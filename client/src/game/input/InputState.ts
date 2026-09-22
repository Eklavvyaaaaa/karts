export type InputState = {
  accelerate: boolean
  brake: boolean
  left: boolean
  right: boolean
  drift: boolean
  boost: boolean
}

export const EMPTY_INPUT: InputState = {
  accelerate: false,
  brake: false,
  left: false,
  right: false,
  drift: false,
  boost: false,
}
