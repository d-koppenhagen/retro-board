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

  updateStickyNote(slug: string, note: StickyNote): void {
    const noteRevised = { ...note };
    delete noteRevised.uuid;
    this.db.object(`${slug}/stickyNotes/${note.uuid}`).set(noteRevised);
  }

  stickyNotesUpdates(slug: string): Observable<StickyNoteDbo | null> {
    return this.db
      .object<StickyNoteDbo | null>(`${slug}/stickyNotes`)
      .valueChanges();
  }

  updateCanvas(slug: string, dataUrl: string) {
    this.db.object(`${slug}/canvas`).set(dataUrl);
  }

  canvasUpdates(slug: string): Observable<ShapeDbo> {
    return this.db.object<ShapeDbo>(`${slug}/canvasData`).valueChanges();
  }

  draw(slug: string, shape: Shape) {
    this.db.object(`${slug}/canvasData/${uuidv4()}`).set(shape);
  }

  setOwnUser(user: OwnUser) {
    sessionStorage.setItem('user', JSON.stringify(user));
  }

  getOwnUser(): OwnUser | null {
    return JSON.parse(sessionStorage.getItem('user'));
  }

  ownUserOnline(slug: string, user: OwnUser): void {
    this.db.object(`${slug}/users/${user.uuid}`).set(user.username);
  }

  getUsers(slug: string): Observable<ActiveUsers | null> {
    return this.db.object<ActiveUsers | null>(`${slug}/users`).valueChanges();
  }

  logout(slug: string, user: OwnUser): void {
    this.db.object(`${slug}/users/${user.uuid}`).remove();
  }

  clearAll(slug: string): Promise<void> {
    return this.db.object(`${slug}`).remove();
  }

  changeBoardLocation(oldSlug: string, newslug: string) {
    this.getBoardData(oldSlug).subscribe((res) => {
      this.db
        .object(`${newslug}`)
        .set(res)
        .then(() => {
          this.db.object(`${oldSlug}`).remove();
        });
    });
  }

  getBackgroundImage(slug: string): Observable<string | null> {
    return this.db.object<string>(`${slug}/backgroundImage`).valueChanges();
  }

  setBackgroundImage(slug: string, backgroundImageUrl: string): void {
    this.db.object(`${slug}/backgroundImage`).set(backgroundImageUrl);
  }

  getRulers(slug: string | null): Observable<Ruler[] | null> {
    return this.db.object<Ruler[] | null>(`${slug}/rulers`).valueChanges();
  }

  setRulers(slug: string, rulers: Ruler[]): void {
    this.db.object(`${slug}/rulers`).set(rulers);
  }

  getBoardData(slug: string): Observable<BoardData | null> {
    return this.db.object<BoardData | null>(slug).valueChanges().pipe(take(1));
  }

  setBoardData(slug: string, boardData: BoardData): Promise<void> {
    // store result without users
    return this.db.object(slug).set({ ...boardData, users: {} });
  }
}
