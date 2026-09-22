# Rush Local Architecture

## Current local flow

```mermaid
flowchart TD
  keyboard[KeyboardInput] --> input[InputState]
  input --> kart[KartController]
  kart --> physics[Rapier physics]
  race[RaceManager] --> hud[Race HUD]
  track[TrackConfig] --> renderer[Track + checkpoints + finish sensors]
  renderer --> race
```

The PC browser owns rendering, physics, race timing, and authoritative local state. Fast-changing values stay in refs or game-loop objects; Zustand carries UI snapshots.

## Input abstraction

All future sources produce the same normalized `InputState`. Keyboard and the OpenWii adapter should never be imported by `KartController`. This keeps local phone input and future online input interchangeable.

## Local multiplayer target

```mermaid
flowchart LR
  phones[Phone controllers] --> relay[Local Socket.IO relay]
  keyboard[PC keyboard] --> players[PlayerManager]
  relay --> players
  players --> karts[Map playerId -> kart/controller]
  karts --> race[Race + track systems]
```

`PlayerManager` is keyed by player ID rather than hardcoded player variables. The current committed baseline predates the phone relay restoration, so this repository phase adds the shared contracts and item/player foundations without pretending phone connectivity is active.

## Online foundation

```mermaid
flowchart TD
  client[Client intent] --> protocol[Shared discriminated protocol]
  protocol --> server[Authoritative Node server]
  server --> room[RoomManager / RoomStore]
  server --> snapshot[State snapshots]
  snapshot --> interpolation[Client interpolation]
```

The first server implementation should keep rooms in memory behind a `RoomStore` interface. Redis, PostgreSQL, authentication, and matchmaking ranking remain future concerns.

## State ownership

- `InputState`: player intent only.
- `KartController`: local movement simulation.
- `RaceManager`: laps, checkpoints, timing, and results.
- `PlayerManager`: player identity, selected kart, connection, and item ownership.
- `TrackConfig`: data for layouts, spawns, checkpoints, and item points.
- Server snapshots: future authoritative state; clients must not submit position, speed, lap, or ranking.
