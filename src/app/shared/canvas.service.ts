import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { Shape, ShapeDbo } from './shape';

@Injectable({
  providedIn: 'root',
})
export class CanvasService {
  constructor(private db: AngularFireDatabase) {}

  updateCanvas(slug: string, dataUrl: string) {
    this.db.object(`${slug}/canvas`).set(dataUrl);
  }

  canvasUpdates(slug: string): Observable<ShapeDbo> {
    return this.db.object<ShapeDbo>(`${slug}/canvasData`).valueChanges();
  }

  draw(slug: string, shape: Shape) {
    this.db.object(`${slug}/canvasData/${uuidv4()}`).set(shape);
  }
}
