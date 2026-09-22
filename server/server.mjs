import crypto from 'node:crypto'
import express from 'express'
import http from 'node:http'
import https from 'node:https'
import os from 'node:os'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import QRCode from 'qrcode'
import { Server } from 'socket.io'

const root = path.dirname(fileURLToPath(import.meta.url))
const port = Number(process.env.CONTROLLER_PORT || 8443)
const maxPlayers = Number(process.env.MAX_PLAYERS || 4)
const useHttps = Boolean(process.env.HTTPS_KEY && process.env.HTTPS_CERT)
const app = express()
app.use((_req, res, next) => { res.setHeader('Access-Control-Allow-Origin', '*'); next() })
app.use(express.static(path.join(root, 'public'), { extensions: ['html'], setHeaders: (res) => res.setHeader('Cache-Control', 'no-cache') }))
const server = useHttps ? https.createServer({ key: await readFile(process.env.HTTPS_KEY), cert: await readFile(process.env.HTTPS_CERT) }, app) : http.createServer(app)
const io = new Server(server, { cors: { origin: '*' }, transports: ['websocket', 'polling'] })
const roles = new Map()
const slots = new Array(maxPlayers).fill(null)
const rooms = new Set()

app.get('/api/pairing', async (req, res) => {
  const room = typeof req.query.room === 'string' ? req.query.room : createRoom()
  const url = `${useHttps ? 'https' : 'http'}://${localAddress()}:${port}/controller.html?room=${encodeURIComponent(room)}`
  res.json({ room, url, qr: await QRCode.toDataURL(url, { margin: 1, width: 280 }) })
})
app.get('/api/health', (_req, res) => res.json({ ok: true, maxPlayers, secure: useHttps }))

io.on('connection', (socket) => {
  socket.on('register', ({ role, room }) => {
    if (role !== 'game' && role !== 'controller') return
    roles.set(socket.id, role)
    socket.data.room = typeof room === 'string' && room.length <= 12 ? room : createRoom()
    socket.join(socket.data.room)
    if (role === 'controller') {
      const slot = slots.indexOf(null)
      if (slot === -1) { socket.emit('slot-denied', { max: maxPlayers }); socket.disconnect(true); return }
      slots[slot] = socket.id
      socket.data.slot = slot
      socket.emit('assigned', { playerId: `p${slot + 1}`, playerNumber: slot + 1, maxPlayers })
    }
    broadcastPresence(socket.data.room)
  })
  socket.on('input', (payload) => {
    if (roles.get(socket.id) !== 'controller') return
    const input = validateInput(payload)
    if (!input) return
    socket.to(socket.data.room).emit('controller-input', { ...input, playerId: `p${socket.data.slot + 1}`, playerNumber: socket.data.slot + 1 })
  })
  socket.on('disconnect', () => {
    const slot = slots.indexOf(socket.id)
    if (slot >= 0) slots[slot] = null
    roles.delete(socket.id)
    if (socket.data.room) broadcastPresence(socket.data.room)
  })
})

server.listen(port, '0.0.0.0', () => {
  console.log(`Relay: ${useHttps ? 'https' : 'http'}://localhost:${port}`)
  console.log(`Phone: ${useHttps ? 'https' : 'http'}://${localAddress()}:${port}/controller.html`)
  if (!useHttps) console.log('Motion sensors usually require HTTPS; touch controls remain available.')
})

function createRoom() { const room = crypto.randomBytes(2).toString('hex').toUpperCase(); rooms.add(room); return room }
function localAddress() {
  for (const values of Object.values(os.networkInterfaces())) for (const value of values || []) if (value && value.family === 'IPv4' && !value.internal) return value.address
  return 'localhost'
}
function broadcastPresence(room) { io.to(room).emit('presence', { players: slots.map((id, slot) => ({ slot, connected: Boolean(id), playerId: `p${slot + 1}` })) }) }
function validateInput(value) {
  if (!value || typeof value !== 'object') return null
  const packet = value
  if (!Number.isSafeInteger(packet.sequence)) return null
  return { sequence: packet.sequence, timestamp: Number.isFinite(packet.timestamp) ? packet.timestamp : Date.now(), steering: clamp(Number(packet.steering) || 0, -1, 1), accelerate: Boolean(packet.accelerate), brake: Boolean(packet.brake), drift: Boolean(packet.drift), boost: Boolean(packet.boost), item: Boolean(packet.item) }
}
function clamp(value, min, max) { return Math.max(min, Math.min(max, value)) }
async function readFile(file) { const fs = await import('node:fs/promises'); return fs.readFile(file) }
