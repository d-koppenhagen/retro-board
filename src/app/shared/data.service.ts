import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { v4 as uuidv4 } from 'uuid';
import { ActiveUsers, OwnUser } from './active-users';
import { BoardData } from './board-data';
import { Ruler } from './ruler';
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

  clearAll(boardId: string): Promise<void> {
    return this.db.object(`${boardId}`).remove();
  }

  getBackgroundImage(boardId: string): Observable<string | null> {
    return this.db.object<string>(`${boardId}/backgroundImage`).valueChanges();
  }

  setBackgroundImage(boardId: string, backgroundImageUrl: string): void {
    this.db.object(`${boardId}/backgroundImage`).set(backgroundImageUrl);
  }

  getRulers(boardId: string | null): Observable<Ruler[] | null> {
    return this.db.object<Ruler[] | null>(`${boardId}/rulers`).valueChanges();
  }

  setRulers(boardId: string, rulers: Ruler[]): void {
    this.db.object(`${boardId}/rulers`).set(rulers);
  }

  getBoardData(boardId: string): Observable<BoardData | null> {
    return this.db
      .object<BoardData | null>(boardId)
      .valueChanges()
      .pipe(take(1));
  }

  setBoardData(boardId: string, boardData: BoardData): Promise<void> {
    // store result without users
    return this.db.object(boardId).set({ ...boardData, users: {} });
  }
}
