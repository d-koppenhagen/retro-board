export interface Shape {
  position: {
    x: number;
    y: number;
  };
  uuid: string;
  shape: string;
  dragStartLocation: {
    x: number;
    y: number;
  };
  strokeStyle: string;
  lineWidth: number;
  fillStyle: string;
  dragging?: boolean;
}

export interface ShapeDbo {
  [uuid: string]: Omit<Shape, 'uuid'>;
}
