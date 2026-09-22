# OpenWii Integration

OpenWii is used as the reference architecture for a local phone controller: a lightweight phone web page reads motion/buttons, a Node Socket.IO relay assigns controller slots and forwards compact packets, and the PC browser remains authoritative for rendering, Rapier physics, race state, and kart simulation.

This project reimplements the integration independently. It does not copy OpenWii game assets, Nintendo branding, Mario Kart content, or game code. The phone sends only normalized intent: steering in `-1..1`, button states, sequence, and timestamp. It never sends position, velocity, lap, ranking, or score.

## Flow

```text
Phone motion/touch
  -> controller.html / Motion calibration
  -> Socket.IO input packet
  -> server/server.mjs relay
  -> client GameSocket
  -> PlayerManager / PhoneInput
  -> existing KartController
  -> PC Three.js + Rapier game
```

## Adapted concepts

- QR room joining over the local Wi-Fi network
- Four configurable player slots
- Explicit iOS motion permission handling
- Neutral-pose calibration and dead-zone smoothing
- Touch fallback when sensors are unavailable
- Sequence numbers and rate-limited compact packets
- Presence and disconnect handling

## License boundary

OpenWii is MIT licensed. Its architectural ideas are referenced here; this implementation is original project code. If substantial OpenWii source is copied in the future, its MIT copyright and permission notice must accompany that copy. The game remains original and is not affiliated with Nintendo.

Motion sensors generally require HTTPS. The relay supports HTTPS when `HTTPS_KEY` and `HTTPS_CERT` are supplied; touch controls remain available over HTTP for local development.
