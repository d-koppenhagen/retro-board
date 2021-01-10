import { CdkDragEnd } from '@angular/cdk/drag-drop';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Ruler } from '../shared/ruler';

@Component({
  selector: 'app-ruler',
  templateUrl: './ruler.component.html',
  styleUrls: ['./ruler.component.scss'],
})
export class RulerComponent implements OnInit {
  @Input() ruler: Ruler;
  @Output() updatePosition = new EventEmitter();
  @Output() remove = new EventEmitter();

  hasBeenClickedOnce = false;

  get isHorizontal(): boolean {
    return this.ruler.direction === 'horizontal';
  }

  constructor() {}

  ngOnInit(): void {}

  dragRulerEnded($event: CdkDragEnd) {
    const { x, y } = $event.distance;
    const newRuler = { ...this.ruler };
    newRuler.positionOnAxis =
      this.ruler.direction === 'horizontal'
        ? this.ruler.positionOnAxis + y
        : this.ruler.positionOnAxis + x;
    this.updatePosition.emit(newRuler);
  }

  deleteOnDoubleClick() {
    if (this.hasBeenClickedOnce) {
      this.remove.emit();
    }
    this.hasBeenClickedOnce = true;
    setTimeout(() => {
      this.hasBeenClickedOnce = false;
    }, 250);
  }
}
