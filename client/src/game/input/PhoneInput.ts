import type { InputState } from './InputState'

export class PhoneInput {
  private state: InputState = { accelerate: false, brake: false, left: false, right: false, drift: false, boost: false, item: false, steering: 0 }
  private lastSequence = -1
  private active = false

  apply(packet: Partial<InputState> & { sequence?: number }) {
    if (typeof packet.sequence === 'number' && packet.sequence <= this.lastSequence) return
    if (typeof packet.sequence === 'number') this.lastSequence = packet.sequence
    this.state = { ...this.state, ...packet, steering: Math.max(-1, Math.min(1, Number(packet.steering) || 0)) }
    this.active = true
  }

  clear() {
    this.active = false
    this.state = { ...this.state, accelerate: false, brake: false, drift: false, boost: false, item: false, steering: 0 }
  }

  isActive() { return this.active }
  read() { return this.state }
}
