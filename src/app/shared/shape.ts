export interface Shape {
  uuid: string;
  type: Tool;
  shape: Free | Line | Circle | Rectangle;
  strokeColor: string;
  lineWidth: number;
  fillColor: string;
}

export interface DragPosition {
  x: number;
  y: number;
}

export interface Free {
  points: DragPosition[];
  closed: boolean;
}

export interface Line {
  start: DragPosition;
  end: DragPosition;
}

export interface Circle {
  start: DragPosition;
  end: DragPosition;
}

export interface Rectangle {
  start: DragPosition;
  end: DragPosition;
}

export type Tool =
  | 'free'
  | 'free_closed'
  | 'line'
  | 'circle'
  | 'rectangle'
  | 'sticky_note';

export interface ShapeDbo {
  [uuid: string]: Omit<Shape, 'uuid'>;
}
