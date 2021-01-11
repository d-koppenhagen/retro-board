export interface StickyNote {
  title: string;
  description: string;
  uuid: string;
  top: number;
  left: number;
  backgroundColor: string;
  editMode: boolean;
  rotation?: number;
}

export interface StickyNoteDbo {
  [uuid: string]: Omit<StickyNote, 'uuid'>;
}
