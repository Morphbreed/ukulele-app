// Noten der C-Dur-Tonleiter in der 1. Lage (Stimmung G C E A, hohes G).
// Die Ukulele klingt wie notiert: C-Saite leer = C4 (eingestrichenes c).
export const NOTES = [
  { name: 'C', key: 'c/4', midi: 60, hint: 'C-Saite, leer' },
  { name: 'D', key: 'd/4', midi: 62, hint: 'C-Saite, 2. Bund' },
  { name: 'E', key: 'e/4', midi: 64, hint: 'E-Saite, leer' },
  { name: 'F', key: 'f/4', midi: 65, hint: 'E-Saite, 1. Bund' },
  { name: 'G', key: 'g/4', midi: 67, hint: 'G-Saite, leer (oder E-Saite, 3. Bund)' },
  { name: 'A', key: 'a/4', midi: 69, hint: 'A-Saite, leer (oder G-Saite, 2. Bund)' },
  { name: 'H', key: 'b/4', midi: 71, hint: 'A-Saite, 2. Bund' },
  { name: 'C', key: 'c/5', midi: 72, hint: 'A-Saite, 3. Bund' },
];

const NAMES_DE = ['C', 'Cis', 'D', 'Dis', 'E', 'F', 'Fis', 'G', 'Gis', 'A', 'B', 'H'];

export function freqToMidiFloat(freq) {
  return 69 + 12 * Math.log2(freq / 440);
}

export function midiToName(midi) {
  return NAMES_DE[((midi % 12) + 12) % 12] + (Math.floor(midi / 12) - 1);
}

export function randomNote(exclude) {
  const pool = NOTES.filter((n) => n !== exclude);
  return pool[Math.floor(Math.random() * pool.length)];
}
