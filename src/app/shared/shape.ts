export interface Shape {
  position: {
    x: number;
    y: number;
  };
  uuid: string;
  shape: ShapeType;
  dragStartLocation: DragPosition;
  strokeStyle: string;
  lineWidth: number;
  fillStyle: string;
  dragging?: boolean;
}

export interface DragPosition {
  x: number;
  y: number;
}

export type ShapeType = 'line' | 'circle' | 'rectangle' | 'sticky_note';

export interface ShapeDbo {
  [uuid: string]: Omit<Shape, 'uuid'>;
}
