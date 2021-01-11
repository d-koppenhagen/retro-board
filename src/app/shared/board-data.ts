import { ShapeDbo } from './shape';
import { StickyNoteDbo } from './sticky-note';
import { ActiveUsers } from './active-users';
import { Ruler } from './ruler';

export interface BoardData {
  backgroundImage?: string;
  canvasData?: ShapeDbo;
  stickyNotes?: StickyNoteDbo;
  users?: ActiveUsers;
  rulers?: Ruler[];
}
