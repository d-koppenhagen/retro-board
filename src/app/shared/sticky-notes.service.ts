import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { StickyNote, StickyNoteDbo } from './sticky-note';

@Injectable({
  providedIn: 'root',
})
export class StickyNotesService {
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
}
