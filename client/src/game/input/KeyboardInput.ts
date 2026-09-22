import type { InputState } from './InputState'

type ButtonInput = Exclude<keyof InputState, 'steering'>

const KEY_BINDINGS: Record<string, ButtonInput> = {
  KeyW: 'accelerate',
  ArrowUp: 'accelerate',
  KeyS: 'brake',
  ArrowDown: 'brake',
  KeyA: 'left',
  ArrowLeft: 'left',
  KeyD: 'right',
  ArrowRight: 'right',
  Space: 'drift',
  ShiftLeft: 'boost',
  ShiftRight: 'boost',
}

export class KeyboardInput {
  private readonly state: InputState = {
    accelerate: false,
    brake: false,
    left: false,
    right: false,
    drift: false,
    boost: false,
    item: false,
    steering: 0,
  }

  private readonly onKeyDown = (event: KeyboardEvent) => {
    const action = KEY_BINDINGS[event.code]
    if (action) {
      event.preventDefault()
      this.state[action] = true
    }
  }

  private readonly onKeyUp = (event: KeyboardEvent) => {
    const action = KEY_BINDINGS[event.code]
    if (action) {
      event.preventDefault()
      this.state[action] = false
    }
  }

  connect() {
    window.addEventListener('keydown', this.onKeyDown)
    window.addEventListener('keyup', this.onKeyUp)
    return () => this.disconnect()
  }

  disconnect() {
    window.removeEventListener('keydown', this.onKeyDown)
    window.removeEventListener('keyup', this.onKeyUp)
  }

  read(): InputState {
    return { ...this.state, steering: Number(this.state.right) - Number(this.state.left) }
  }
}
