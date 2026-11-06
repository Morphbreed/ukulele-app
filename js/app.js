import { freqToMidiFloat, midiToName, randomNote } from './notes.js';
import { PitchDetector } from './pitch.js';
import { renderNote } from './staff.js';

const STABLE_FRAMES = 5;     // so viele Frames muss ein Ton gleich bleiben
const MAX_CENTS = 40;        // erlaubte Verstimmung
const SILENCE_RMS = 0.01;    // darunter gilt das Signal als Stille
const SILENCE_FRAMES = 6;    // so lange Stille setzt die Sperre zurück
const ONSET_RATIO = 2;       // plötzlicher Lautstärkesprung = neuer Anschlag
const SUCCESS_DELAY = 1000;  // ms, wie lange "Richtig!" angezeigt wird

const $ = (id) => document.getElementById(id);
const els = {
  staff: $('staff'),
  name: $('note-name'),
  octave: $('note-octave'),
  hint: $('hint'),
  feedback: $('feedback'),
  detected: $('detected'),
  correct: $('score-correct'),
  wrong: $('score-wrong'),
  start: $('start'),
  skip: $('skip'),
  hintToggle: $('hint-toggle'),
};

const detector = new PitchDetector();
let current = null;
let phase = 'idle';          // idle | listening | success
let candidate = null;
let candidateCount = 0;
let ignoreMidi = null;       // zuletzt bewerteter Ton, bis er ausgeklungen ist
let silentCount = 0;
let avgRms = 0;
let score = { correct: 0, wrong: 0 };

function showNote(note) {
  current = note;
  renderNote(els.staff, note.key);
  els.name.textContent = note.name;
  els.octave.textContent = midiToName(note.midi);
  els.hint.textContent = note.hint;
}

function setFeedback(text, kind) {
  els.feedback.textContent = text;
  els.feedback.className = 'feedback ' + kind;
  // Animation neu starten
  void els.feedback.offsetWidth;
  els.feedback.classList.add('pop');
}

function updateScore() {
  els.correct.textContent = score.correct;
  els.wrong.textContent = score.wrong;
}

function nextNote() {
  showNote(randomNote(current));
  setFeedback('Spiel die Note!', 'neutral');
  phase = 'listening';
}

function judge(midi) {
  ignoreMidi = midi;
  if (midi === current.midi) {
    score.correct++;
    phase = 'success';
    setFeedback('Richtig! ✓', 'success');
    setTimeout(nextNote, SUCCESS_DELAY);
  } else {
    score.wrong++;
    setFeedback(`Falsch – das war ${midiToName(midi)}`, 'error');
  }
  updateScore();
}

function tick() {
  const { rms, freq } = detector.read();

  if (rms > SILENCE_RMS * 2 && rms > avgRms * ONSET_RATIO) ignoreMidi = null;
  avgRms = avgRms * 0.9 + rms * 0.1;

  if (rms < SILENCE_RMS || freq === null) {
    candidateCount = 0;
    if (++silentCount >= SILENCE_FRAMES) ignoreMidi = null;
    if (rms < SILENCE_RMS) els.detected.textContent = '–';
  } else {
    silentCount = 0;
    const m = freqToMidiFloat(freq);
    const midi = Math.round(m);
    const cents = Math.round((m - midi) * 100);
    els.detected.textContent = `${midiToName(midi)} (${cents >= 0 ? '+' : ''}${cents} ct, ${freq.toFixed(1)} Hz)`;

    if (Math.abs(cents) <= MAX_CENTS) {
      if (midi === candidate) candidateCount++;
      else { candidate = midi; candidateCount = 1; }
    } else {
      candidateCount = 0;
    }

    if (candidateCount === STABLE_FRAMES && phase === 'listening' && midi !== ignoreMidi) {
      judge(midi);
    }
  }

  requestAnimationFrame(tick);
}

els.start.addEventListener('click', async () => {
  els.start.disabled = true;
  try {
    await detector.start();
  } catch (err) {
    els.start.disabled = false;
    setFeedback('Kein Mikrofonzugriff: ' + err.message, 'error');
    return;
  }
  els.start.hidden = true;
  els.skip.hidden = false;
  nextNote();
  requestAnimationFrame(tick);
});

els.skip.addEventListener('click', () => {
  if (phase === 'listening') nextNote();
});

els.hintToggle.addEventListener('click', () => {
  els.hint.hidden = !els.hint.hidden;
  els.hintToggle.textContent = els.hint.hidden ? 'Tipp zeigen' : 'Tipp verbergen';
});

showNote(randomNote(null));
