// Tonhöhenerkennung über das Mikrofon mit pitchy (McLeod Pitch Method).
import { PitchDetector as Pitchy } from 'pitchy';

const MIN_FREQ = 150;      // etwas unter C4 (261 Hz)
const MAX_FREQ = 1200;     // deutlich über C5 (523 Hz)
const MIN_CLARITY = 0.9;   // darunter ist es eher Rauschen als ein Ton

export class PitchDetector {
  async start() {
    const stream = await navigator.mediaDevices.getUserMedia({
      audio: { echoCancellation: false, noiseSuppression: false, autoGainControl: false },
    });
    this.ctx = new (window.AudioContext || window.webkitAudioContext)();
    await this.ctx.resume();
    const source = this.ctx.createMediaStreamSource(stream);
    this.analyser = this.ctx.createAnalyser();
    this.analyser.fftSize = 2048;
    source.connect(this.analyser);
    this.buffer = new Float32Array(this.analyser.fftSize);
    this.pitchy = Pitchy.forFloat32Array(this.buffer.length);
  }

  // Liefert { rms, freq } – freq ist null, wenn kein klarer Ton erkannt wurde.
  read() {
    this.analyser.getFloatTimeDomainData(this.buffer);
    const buf = this.buffer;

    let sum = 0;
    for (let i = 0; i < buf.length; i++) sum += buf[i] * buf[i];
    const rms = Math.sqrt(sum / buf.length);

    const [freq, clarity] = this.pitchy.findPitch(buf, this.ctx.sampleRate);
    const valid = clarity >= MIN_CLARITY && freq >= MIN_FREQ && freq <= MAX_FREQ;
    return { rms, freq: valid ? freq : null };
  }
}
