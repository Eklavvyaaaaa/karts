import type { ClientMessage } from '../../../shared/types.js'

export function validateClientMessage(value: unknown): value is ClientMessage {
  if (!value || typeof value !== 'object' || !('type' in value) || typeof value.type !== 'string') return false
  if (value.type === 'INPUT') {
    const input = value as Partial<ClientMessage & { steering: number; sequence: number }>
    return Number.isSafeInteger(input.sequence) && typeof input.steering === 'number' && input.steering >= -1 && input.steering <= 1
  }
  if (value.type === 'JOIN_ROOM' || value.type === 'SELECT_KART' || value.type === 'SELECT_TRACK') return 'roomId' in value || 'kartId' in value || 'trackId' in value
  return ['READY', 'USE_ITEM', 'LEAVE_ROOM'].includes(value.type)
}
