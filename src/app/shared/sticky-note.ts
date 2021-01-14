export interface StickyNote {
  title: string;
  description: string;
  uuid: string;
  top: number;
  left: number;
  backgroundColor: string;
  editMode: boolean;
  votes?: number;
  rotation?: number;
}

export interface StickyNoteDbo {
  [uuid: string]: Omit<StickyNote, 'uuid'>;
}
