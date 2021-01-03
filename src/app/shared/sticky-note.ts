export interface StickyNote {
  title: string;
  description: string;
  uuid: string;
  top: number;
  left: number;
  backgroundColor: string;
  editMode: boolean;
}

export interface StickyNoteDbo {
  [uuid: string]: Omit<StickyNote, 'uuid'>;
}
