// Zeichnet eine einzelne Note im Violinschlüssel mit VexFlow.
import { Renderer, Stave, StaveNote, Voice, Formatter } from 'vexflow/bravura';

export function renderNote(container, key) {
  container.innerHTML = '';

  const width = 220;
  const height = 150;
  const renderer = new Renderer(container, Renderer.Backends.SVG);
  renderer.resize(width, height);
  const ctx = renderer.getContext();

  const stave = new Stave(10, 20, width - 20);
  stave.addClef('treble');
  stave.setContext(ctx).draw();

  const note = new StaveNote({ keys: [key], duration: 'w', clef: 'treble' });
  const voice = new Voice({ num_beats: 4, beat_value: 4 }).addTickables([note]);
  new Formatter().joinVoices([voice]).format([voice], width - 100);
  voice.draw(ctx, stave);

  // SVG skalierbar machen
  const svg = container.querySelector('svg');
  svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
  svg.removeAttribute('width');
  svg.removeAttribute('height');
  svg.style.width = '100%';
  svg.style.height = 'auto';
}
