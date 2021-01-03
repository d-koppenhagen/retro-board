import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import { ActiveUsers, OwnUser } from './active-users';
import { Shape, ShapeDbo } from './shape';
import { StickyNote, StickyNoteDbo } from './sticky-note';

@Injectable({
  providedIn: 'root',
})
export class DataService {
  constructor(private db: AngularFireDatabase) {}

  updateStickyNote(boardId: string, note: StickyNote): void {
    const noteRevised = { ...note };
    delete noteRevised.uuid;
    this.db.object(`${boardId}/stickyNotes/${note.uuid}`).set(noteRevised);
  }

  stickyNotesUpdates(boardId: string): Observable<StickyNoteDbo | null> {
    return this.db
      .object<StickyNoteDbo | null>(`${boardId}/stickyNotes`)
      .valueChanges();
  }

  updateCanvas(boardId: string, dataUrl: string) {
    this.db.object(`${boardId}/canvas`).set(dataUrl);
  }

  canvasUpdates(boardId: string): Observable<ShapeDbo> {
    return this.db.object<ShapeDbo>(`${boardId}/canvasData`).valueChanges();
  }

  draw(boardId: string, shape: Shape) {
    this.db.object(`${boardId}/canvasData/${uuidv4()}`).set(shape);
  }

  setOwnUser(user: OwnUser) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getOwnUser(): OwnUser | null {
    return JSON.parse(sessionStorage.getItem('user'));
  }

  ownUserOnline(boardId: string, user: OwnUser): void {
    this.db.object(`${boardId}/users/${user.uuid}`).set(user.username);
  }

  getUsers(boardId: string): Observable<ActiveUsers | null> {
    return this.db
      .object<ActiveUsers | null>(`${boardId}/users`)
      .valueChanges();
  }

  logout(boardId: string, user: OwnUser): void {
    this.db.object(`${boardId}/users/${user.uuid}`).remove();
  }

  clearAll(boardId: string) {
    this.db.object(`${boardId}`).remove();
  }

  getBackgroundImage(boardId: string | null): Observable<string> {
    return this.db.object<string>(`${boardId}/backgroundImage`).valueChanges();
  }

  setBackgroundImage(boardId: string, backgroundImageUrl: string): void {
    this.db.object(`${boardId}/backgroundImage`).set(backgroundImageUrl);
  }
}