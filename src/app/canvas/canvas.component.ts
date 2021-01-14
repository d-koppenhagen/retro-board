import { v4 as uuidv4 } from 'uuid';
import { uniqWith, isEqual } from 'lodash';
import {
  Component,
  Input,
  HostListener,
  AfterViewInit,
  OnInit,
  EventEmitter,
  Output,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/data.service';
import {
  DragPosition,
  Shape,
  ShapeDbo,
  Tool,
  Free,
  Rectangle,
  Circle,
  Line,
} from '../shared/shape';
import { Ruler } from '../shared/ruler';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @Input() width: string;
  @Input() height: string;
  @Input() tool: Tool;
  @Input() fill: string;
  @Input() strokeColor: string;
  @Input() fillColor: string;
  @Input() lineWidth: number;
  @Input() backgroundImage: string;
  @Input() rulers: Ruler[];
  @Output() updateRulers = new EventEmitter();

  context: CanvasRenderingContext2D;
  dragging = false;
  dragStartLocation: DragPosition;
  snapshot: ImageData;
  lastX: number;
  lastY: number;
  slug: string;
  pointArray: DragPosition[] = [];
  lastDragStart: DragPosition;
  lastDragStop: DragPosition;

  canvas: HTMLCanvasElement;
  audio: HTMLAudioElement;
  private internalData: Partial<Shape>;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  /**
   * listen for screen resize events
   */
  @HostListener('window:resize', ['$event'])
  onResize(event: UIEvent) {
    this.resizeCanvasToDisplaySize();
  }

  ngOnInit() {
    this.slug = this.route.snapshot.paramMap.get('slug');
  }

  public ngAfterViewInit() {
    this.init();

    this.dataService.canvasUpdates(this.slug).subscribe((shapes: ShapeDbo) => {
      if (shapes) {
        for (const [key, value] of Object.entries(shapes)) {
          // use remote update shape style
          this.context.strokeStyle = value.strokeColor;
          this.context.fillStyle = value.fillColor;
          this.context.lineWidth = value.lineWidth;

          // paint the shape
          switch (value.type) {
            case 'free':
              const freeShape = value.shape as Free;
              this.drawFree({ points: freeShape.points, closed: false });
              break;
            case 'free_closed':
              const freeCloseShape = value.shape as Free;
              this.drawFree({ points: freeCloseShape.points, closed: true });
              break;
            case 'rectangle':
              const rectangleShape = value.shape as Rectangle;
              this.drawRectangle(rectangleShape);
              break;
            case 'circle':
              const circleShape = value.shape as Rectangle;
              this.drawCircle(circleShape);
              break;
            case 'line':
              const lineShape = value.shape as Rectangle;
              this.drawLine(lineShape);
              break;
            default:
              break;
          }

          // reset shape style after remote updates has been painted
          this.setShapeStyle();
        }
      }
    });
  }

  /**
   * get the coordinates on the canvas for a position on the screen
   */
  getCanvasCoordinates(event: MouseEvent): DragPosition {
    const x = event.clientX - this.canvas.getBoundingClientRect().left;
    const y = event.clientY - this.canvas.getBoundingClientRect().top;
    return { x, y };
  }

  /**
   * Method to Draw Line
   */
  drawLine({ start, end }: Line) {
    this.context.beginPath();
    this.context.moveTo(start.x, start.y);
    this.context.lineTo(end.x, end.y);
    this.context.stroke();
    this.context.closePath();
  }

  /**
   * Method to Draw Circle
   */
  drawCircle({ start, end }: Circle) {
    const radius = Math.sqrt(
      Math.pow(start.x - end.x, 2) + Math.pow(start.y - end.y, 2)
    );
    this.context.moveTo(start.x, start.y);
    this.context.beginPath();
    this.context.arc(start.x, start.y, radius, 0, 2 * Math.PI, false);
    this.context.fill();
    this.context.stroke();
    this.context.closePath();
  }

  /**
   * Method to Draw Rectangle
   */
  drawRectangle({ start, end }: Rectangle) {
    const lengthX = Math.abs(end.x - start.x);
    const lengthY = Math.abs(end.y - start.y);
    const width = lengthX * (end.x < start.x ? -1 : 1);
    const height = lengthY * (end.y < start.y ? -1 : 1);
    this.context.moveTo(start.x, start.y);
    this.context.beginPath();
    this.context.rect(start.x, start.y, width, height);
    this.context.fill();
    this.context.stroke();
    this.context.closePath();
  }

  /**
   * draw a freehand line / shape
   *
   * @param close close the path optionally
   */
  drawFree({ points, closed }: Free) {
    this.context.moveTo(points[0].x, points[0].y);
    this.context.beginPath();
    points.forEach((p) => {
      this.context.lineTo(p.x, p.y);
    });
    if (closed) {
      this.context.closePath();
      this.context.stroke();
    } else {
      this.context.stroke();
      this.context.closePath();
    }
  }

  /**
   * Mouse Drag event start function
   */
  dragStart(event: MouseEvent) {
    if (!this.tool) {
      return;
    }
    this.dragging = true;
    this.pointArray = []; // clear points as we start a new path
    this.lastDragStart = this.getCanvasCoordinates(event);
  }

  /**
   * This event fires when moving the mouse around
   */
  drag(event: MouseEvent) {
    if (!this.tool || !this.dragging) {
      return;
    }
    this.pointArray.push(this.getCanvasCoordinates(event));
  }

  /**
   * Mouse Drag event stop function
   */
  dragStop(event: MouseEvent) {
    if (!this.tool || !this.lastDragStart) {
      return;
    }
    this.lastDragStop = this.getCanvasCoordinates(event);

    console.log('<< dragStop', event);

    this.setShapeStyle();

    // filter duplicated points in sequence
    const points = uniqWith(
      [this.lastDragStart, ...this.pointArray, this.lastDragStop],
      isEqual
    );

    const baseData: Omit<Shape, 'shape'> = {
      uuid: uuidv4(),
      type: this.tool,
      strokeColor: this.strokeColor,
      lineWidth: this.lineWidth,
      fillColor: this.fillColor,
    };

    let data: Shape;
    const startEnd = {
      start: this.lastDragStart,
      end: this.lastDragStop,
    };

    switch (this.tool) {
      case 'free':
        data = { ...baseData, shape: { points, closed: false } };
        this.drawFree({ points, closed: false });
        break;
      case 'free_closed':
        data = { ...baseData, shape: { points, closed: true } };
        this.drawFree({ points, closed: true });
        break;
      case 'rectangle':
        data = { ...baseData, shape: startEnd };
        this.drawRectangle(startEnd);
        break;
      case 'circle':
        data = { ...baseData, shape: startEnd };
        this.drawCircle(startEnd);
        break;
      case 'line':
        data = { ...baseData, shape: startEnd };
        this.drawLine(startEnd);
        break;
      default:
        break;
    }

    // reset once painted
    this.lastDragStart = null;
    this.lastDragStop = null;
    this.dragging = false;

    // write data to firebase
    this.dataService.draw(this.slug, data);
  }

  /**
   * set basic style on the canvas context
   */
  setShapeStyle() {
    this.context.strokeStyle = this.strokeColor;
    this.context.fillStyle = this.fillColor;
    this.context.lineWidth = this.lineWidth;
    this.context.lineCap = 'round';
  }

  /**
   * initialize
   */
  init() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');
    this.canvas.addEventListener('mousedown', this.dragStart.bind(this), false);
    this.canvas.addEventListener('mousemove', this.drag.bind(this), false);
    this.canvas.addEventListener('mouseup', this.dragStop.bind(this), false);
    this.canvas.addEventListener('mouseout', this.dragStop.bind(this), false);
    this.resizeCanvasToDisplaySize();
  }

  /**
   * resize the canvas
   */
  resizeCanvasToDisplaySize(): boolean {
    // look up the size the canvas is being displayed
    const width = this.canvas.clientWidth;
    const height = this.canvas.clientHeight;

    // If it's resolution does not match change it
    if (this.canvas.width !== width || this.canvas.height !== height) {
      const tempCnvs = document.createElement('canvas');
      const tempCntx = tempCnvs.getContext('2d');
      tempCnvs.width = this.canvas.width;
      tempCnvs.height = this.canvas.height;
      tempCntx.drawImage(this.canvas, 0, 0);
      this.canvas.width = width;
      this.canvas.height = height;
      this.context.drawImage(tempCnvs, 0, 0);
      return true;
    }
    return false;
  }

  /**
   * update a ruler
   */
  updateRuler(newRuler: Ruler, oldRuler: Ruler) {
    const newRulers = [...this.rulers];
    const oldRulerPos = newRulers.findIndex(
      (ruler) => ruler.id === oldRuler.id
    );
    newRulers[oldRulerPos] = newRuler;
    this.updateRulers.emit(newRulers);
  }

  /**
   * remove a ruler from the board
   */
  removeRuler(rulerToRemove: Ruler) {
    const newRulers = this.rulers.filter(
      (ruler) => ruler.id !== rulerToRemove.id
    );
    this.updateRulers.emit(newRulers);
  }
}
