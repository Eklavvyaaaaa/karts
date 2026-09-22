export type KartSound = 'engine' | 'drift' | 'boost' | 'collision' | 'itemPickup' | 'jump' | 'landing'

export class AudioManager {
  play(_sound: KartSound, _volume = 1) {
    // Sound assets can be connected here without coupling audio to physics.
  }

  stop(_sound: KartSound) {}
}
