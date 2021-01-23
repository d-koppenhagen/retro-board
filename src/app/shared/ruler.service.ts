import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { Ruler } from './ruler';

@Injectable({
  providedIn: 'root',
})
export class RulerService {
  constructor(private db: AngularFireDatabase) {}

  getRulers(slug: string | null): Observable<Ruler[] | null> {
    return this.db.object<Ruler[] | null>(`${slug}/rulers`).valueChanges();
  }

  setRulers(slug: string, rulers: Ruler[]): void {
    this.db.object(`${slug}/rulers`).set(rulers);
  }
}
