import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { Observable } from 'rxjs';
import { ActiveUsers, OwnUser } from './active-users';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private db: AngularFireDatabase) {}

  setOwnUser(user: OwnUser) {
    localStorage.setItem('user', JSON.stringify(user));
  }

  getOwnUser(): OwnUser | null {
    return JSON.parse(localStorage.getItem('user'));
  }

  ownUserOnline(slug: string, user: OwnUser): void {
    this.db.object(`${slug}/users/${user.uuid}`).set(user.username);
  }

  getUsers(slug: string): Observable<ActiveUsers | null> {
    return this.db.object<ActiveUsers | null>(`${slug}/users`).valueChanges();
  }

  logout(slug: string): void {
    const user = this.getOwnUser();
    this.db.object(`${slug}/users/${user.uuid}`).remove();
  }
}
