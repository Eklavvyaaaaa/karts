import { create } from 'zustand'
import type { RaceSnapshot } from '../game/race/RaceState'

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
  race: RaceSnapshot
  setDebugMode: (debugMode: boolean) => void
  setPerformance: (performance: Partial<PerformanceSnapshot>) => void
  setKart: (kart: Partial<KartDebugSnapshot>) => void
  setRace: (race: RaceSnapshot) => void
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
  race: {
    state: 'LOBBY',
    countdown: 0,
    countdownLabel: null,
    currentLap: 1,
    totalLaps: 3,
    position: 1,
    totalPlayers: 1,
    progress: { playerId: 'p1', currentLap: 1, checkpointIndex: -1, progress: 0, finished: false, finishTime: null },
    lapTimes: [],
    bestLap: null,
    totalTime: 0,
    resetToken: 0,
  },
  setDebugMode: (debugMode) => set({ debugMode }),
  setPerformance: (performance) =>
    set((state) => ({ performance: { ...state.performance, ...performance } })),
  setKart: (kart) => set((state) => ({ kart: { ...state.kart, ...kart } })),
  setRace: (race) => set({ race }),
}))
