import { create } from 'zustand'

type PerformanceSnapshot = {
  fps: number
  drawCalls: number
  triangles: number
  physics: 'online' | 'paused'
}

export type KartDebugSnapshot = {
  speed: number
  grounded: boolean
  drifting: boolean
  boosting: boolean
  boostCooldown: number
}

type GameState = {
  debugMode: boolean
  performance: PerformanceSnapshot
  kart: KartDebugSnapshot
  setDebugMode: (debugMode: boolean) => void
  setPerformance: (performance: Partial<PerformanceSnapshot>) => void
  setKart: (kart: Partial<KartDebugSnapshot>) => void
}

export const useGameStore = create<GameState>((set) => ({
  debugMode: true,
  performance: {
    fps: 0,
    drawCalls: 0,
    triangles: 0,
    physics: 'paused',
  },
  kart: {
    speed: 0,
    grounded: true,
    drifting: false,
    boosting: false,
    boostCooldown: 0,
  },
  setDebugMode: (debugMode) => set({ debugMode }),
  setPerformance: (performance) =>
    set((state) => ({ performance: { ...state.performance, ...performance } })),
  setKart: (kart) => set((state) => ({ kart: { ...state.kart, ...kart } })),
}))
