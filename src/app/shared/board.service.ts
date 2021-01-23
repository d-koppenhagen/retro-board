import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { take } from 'rxjs/operators';
import { BoardData } from './board-data';

@Injectable({
  providedIn: 'root',
})
export class BoardService {
  constructor(private db: AngularFireDatabase) {}

  clearAll(slug: string): Promise<void> {
    return this.db.object(`${slug}`).remove();
  }

  getBoardData(slug: string): Observable<BoardData | null> {
    return this.db.object<BoardData | null>(slug).valueChanges().pipe(take(1));
  }

  setBoardData(slug: string, boardData: BoardData): Promise<void> {
    // store result without users
    return this.db.object(slug).set({ ...boardData, users: {} });
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
}
