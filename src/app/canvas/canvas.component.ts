import { v4 as uuidv4 } from 'uuid';
import {
  Component,
  Input,
  HostListener,
  AfterViewInit,
  OnInit,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DataService } from '../shared/data.service';
import { Shape, ShapeDbo } from '../shared/shape';

@Component({
  selector: 'app-canvas',
  templateUrl: './canvas.component.html',
  styleUrls: ['./canvas.component.scss'],
})
export class CanvasComponent implements OnInit, AfterViewInit {
  @Input() width: string;
  @Input() height: string;
  @Input() shape: string;
  @Input() fill: string;
  @Input() strokeColor: string;
  @Input() fillColor: string;
  @Input() strokeWidth: number;
  @Input() backgroundImage: string;

  context: any;
  dragging = false;
  dragStartLocation;
  snapshot: string;
  lastX: number;
  lastY: number;
  boardId: string;

  canvas: HTMLCanvasElement;
  undoArray = [];
  redoArray = [];

  private internalData: any;

  constructor(
    private dataService: DataService,
    private route: ActivatedRoute
  ) {}

  // Listener for the Screen resize
  @HostListener('window:resize', ['$event'])
  onResize(event) {
    this.resizeCanvasToDisplaySize(this.canvas);
  }

  ngOnInit() {
    this.boardId = this.route.snapshot.paramMap.get('boardId');
  }

  public ngAfterViewInit() {
    this.init();

    this.dataService
      .canvasUpdates(this.boardId)
      .subscribe((shape: ShapeDbo) => {
        if (shape) {
          for (const [key, value] of Object.entries(shape)) {
            if (!this.internalData.dragging && shape.dragging) {
              this.lastX = value.dragStartLocation.x;
              this.lastY = value.dragStartLocation.y;
            }
            this.drawShape(
              value.position,
              value.shape,
              value.dragStartLocation,
              value.strokeStyle,
              value.lineWidth,
              value.fillStyle,
              value.dragging
            );
            this.takeSnapshot();
          }
        }
      });

    this.internalData = {
      shape: this.shape,
      dragStartLocation: this.dragStartLocation,
      strokeStyle: this.strokeColor,
      lineWidth: this.strokeWidth,
      fillStyle: this.fillColor,
      dragging: this.dragging,
    };
  }

  // Method to get the coordiantes of the canvas
  getCanvasCoordinates(event) {
    const x = event.clientX - this.canvas.getBoundingClientRect().left;
    const y = event.clientY - this.canvas.getBoundingClientRect().top;

    return { x, y };
  }

  // Method to get the snapshot of the Canvas
  takeSnapshot() {
    this.snapshot = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
  }

  // Method to restore the snapshot of the Canvas
  restoreSnapshot() {
    this.context.putImageData(this.snapshot, 0, 0);
  }

  // Method to draw the particular shape
  drawShape(
    position,
    shape,
    dragStartLocation,
    strokeStyle,
    lineWidth,
    fillStyle,
    dragging
  ) {
    this.internalData = {
      shape,
      dragStartLocation,
      position,
      strokeStyle,
      lineWidth,
      fillStyle,
      dragging,
    };
    this.context.strokeStyle = this.internalData.strokeStyle;
    this.context.fillStyle = this.internalData.fillStyle;
    this.context.lineWidth = this.internalData.lineWidth;
    switch (this.internalData.shape) {
      case 'line':
        this.drawLine(position);
        break;

      case 'circle':
        this.drawCircle(position);
        break;

      case 'free':
        this.drawFree(position);
        break;

      case 'rectangle':
        this.drawRectangle(position);
        break;

      case 'erase':
        this.context.strokeStyle = 'white';
        this.drawFree(position);
        break;
      default:
        break;
    }
  }

  // Method to Draw Line
  drawLine(position) {
    this.context.beginPath();
    this.context.moveTo(
      this.internalData.dragStartLocation.x,
      this.internalData.dragStartLocation.y
    );
    this.context.lineTo(position.x, position.y);
    this.context.stroke();
  }

  // Method to Draw Circle
  drawCircle(position) {
    const radius = Math.sqrt(
      Math.pow(this.internalData.dragStartLocation.x - position.x, 2) +
        Math.pow(this.internalData.dragStartLocation.y - position.y, 2)
    );
    this.context.beginPath();
    this.context.arc(
      this.internalData.dragStartLocation.x,
      this.internalData.dragStartLocation.y,
      radius,
      0,
      2 * Math.PI,
      false
    );
    this.context.fill();
    this.context.stroke();
  }

  // Method to Draw Free Text
  drawFree(position) {
    if (this.internalData.dragging === true) {
      this.context.beginPath();
      this.context.lineJoin = 'round';
      this.context.moveTo(this.lastX, this.lastY);
      this.context.lineTo(position.x, position.y);
      this.context.closePath();
      this.context.stroke();
    }
    this.lastX = position.x;
    this.lastY = position.y;
  }

  // Method to Draw Rectangle
  drawRectangle(position) {
    const lengthX = Math.abs(
      position.x - this.internalData.dragStartLocation.x
    );
    const lengthY = Math.abs(
      position.y - this.internalData.dragStartLocation.y
    );
    let width;
    let height;
    if (lengthX > lengthY) {
      width =
        lengthX * (position.x < this.internalData.dragStartLocation.x ? -1 : 1);
      height =
        lengthX * (position.y < this.internalData.dragStartLocation.y ? -1 : 1);
    } else {
      width =
        lengthY * (position.x < this.internalData.dragStartLocation.x ? -1 : 1);
      height =
        lengthY * (position.y < this.internalData.dragStartLocation.y ? -1 : 1);
    }
    this.context.beginPath();
    this.context.rect(
      this.internalData.dragStartLocation.x,
      this.internalData.dragStartLocation.y,
      width,
      height
    );
    this.context.fill();
    this.context.stroke();
  }

  // Mouse Drag event start function
  dragStart(event) {
    this.internalData.dragging = true;
    this.dragging = true;
    if (this.shape !== 'erase') {
      this.context.strokeStyle = this.strokeColor;
    }
    this.context.fillStyle = this.fillColor;
    this.context.lineWidth = this.strokeWidth;
    this.dragStartLocation = this.getCanvasCoordinates(event);
    if (
      this.internalData.shape === 'free' ||
      this.internalData.shape === 'erase'
    ) {
      this.lastX = this.dragStartLocation.x;
      this.lastY = this.dragStartLocation.y;
    } else {
      this.takeSnapshot();
    }
  }

  // Mouse Drag event function
  drag(event) {
    let position;
    if (this.internalData.dragging === true) {
      position = this.getCanvasCoordinates(event);
      if (
        this.internalData.shape !== 'free' &&
        this.internalData.shape !== 'erase'
      ) {
        this.restoreSnapshot();
      } else {
        const shapeObj: Shape = {
          uuid: uuidv4(),
          shape: this.shape,
          dragStartLocation: this.getCanvasCoordinates(event),
          position,
          strokeStyle: this.strokeColor,
          lineWidth: this.strokeWidth,
          fillStyle: this.fillColor,
          dragging: this.dragging,
        };
        this.dataService.draw(this.boardId, shapeObj);
      }
      this.drawShape(
        position,
        this.shape,
        this.dragStartLocation,
        this.strokeColor,
        this.strokeWidth,
        this.fillColor,
        this.dragging
      );
    }
  }

  // Mouse Drag event stop function
  dragStop(event) {
    this.dragging = false;
    this.internalData.dragging = false;
    if (
      this.internalData.shape !== 'free' &&
      this.internalData.shape !== 'erase'
    ) {
      this.restoreSnapshot();
    }
    this.takeSnapshot();
    const position = this.getCanvasCoordinates(event);
    this.drawShape(
      position,
      this.shape,
      this.dragStartLocation,
      this.strokeColor,
      this.strokeWidth,
      this.fillColor,
      this.dragging
    );
    const shapeObj = {
      uuid: uuidv4(),
      shape: this.shape,
      dragStartLocation: this.dragStartLocation,
      position,
      strokeStyle: this.strokeColor,
      lineWidth: this.strokeWidth,
      fillStyle: this.fillColor,
    };
    this.dataService.draw(this.boardId, shapeObj);
  }

  // Initialization Method
  init() {
    this.canvas = document.getElementById('canvas') as HTMLCanvasElement;
    this.context = this.canvas.getContext('2d');
    this.context.strokeStyle = this.strokeColor;
    this.context.fillStyle = this.fillColor;
    this.context.lineWidth = this.strokeWidth;
    this.context.lineCap = 'round';

    this.canvas.addEventListener('mousedown', this.dragStart.bind(this), false);
    this.canvas.addEventListener('mousemove', this.drag.bind(this), false);
    this.canvas.addEventListener('mouseup', this.dragStop.bind(this), false);

    this.resizeCanvasToDisplaySize(this.canvas);
  }

  // Resize method for the canvas
  resizeCanvasToDisplaySize(canvas) {
    // look up the size the canvas is being displayed
    const width = canvas.clientWidth;
    const height = canvas.clientHeight;

    // If it's resolution does not match change it
    if (canvas.width !== width || canvas.height !== height) {
      const tempCnvs = document.createElement('canvas');
      const tempCntx = tempCnvs.getContext('2d');
      tempCnvs.width = canvas.width;
      tempCnvs.height = canvas.height;
      tempCntx.drawImage(canvas, 0, 0);
      canvas.width = width;
      canvas.height = height;
      this.context.drawImage(tempCnvs, 0, 0);
      if (this.shape !== 'erase') {
        this.context.strokeStyle = this.strokeColor;
      }
      this.context.fillStyle = this.fillColor;
      this.context.lineWidth = this.strokeWidth;
      this.context.lineCap = 'round';
      return true;
    }
    return false;
  }
}
