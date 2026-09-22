import { useEffect, useState } from 'react'
import { InputManager } from '../game/input/InputManager'

export function useInputManager() {
  const [manager] = useState(() => new InputManager())

  useEffect(() => manager.connect(), [manager])
  return manager
}
