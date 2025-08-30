export class AudioManager {
  muted = false;
  context: AudioContext | null = null;

  constructor() {
    this.init();
  }

  init() {
    if (typeof AudioContext !== 'undefined') {
      this.context = new AudioContext();
    }
  }

  play(sound: string) {
    if (this.muted || !this.context) return;
    // Simple beep sounds
    const oscillator = this.context.createOscillator();
    const gain = this.context.createGain();
    oscillator.connect(gain);
    gain.connect(this.context.destination);
    oscillator.frequency.setValueAtTime(this.getFrequency(sound), this.context.currentTime);
    gain.gain.setValueAtTime(0.1, this.context.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.01, this.context.currentTime + 0.1);
    oscillator.start();
    oscillator.stop(this.context.currentTime + 0.1);
  }

  playMatch() {
    this.play('match');
  }

  playMiss() {
    this.play('miss');
  }

  playStreak() {
    this.play('streak');
  }

  getFrequency(sound: string): number {
    switch (sound) {
      case 'match': return 440;
      case 'miss': return 220;
      case 'streak': return 660;
      case 'star': return 880;
      default: return 440;
    }
  }

  setMuted(muted: boolean) {
    this.muted = muted;
  }

  toggleMute() {
    this.muted = !this.muted;
  }
}
