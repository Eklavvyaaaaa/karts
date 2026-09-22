import { KeyboardInput } from './KeyboardInput'
import type { InputState } from './InputState'

export class InputManager {
  private readonly keyboard = new KeyboardInput()

  connect() {
    return this.keyboard.connect()
  }

  disconnect() {
    this.keyboard.disconnect()
  }

  read(): InputState {
    return this.keyboard.read()
  }
}
