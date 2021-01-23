import { Injectable } from '@angular/core';
import { AngularFireDatabase } from '@angular/fire/database';
import { ChatMessage } from './chat-message';
import { UserService } from './user.service';

@Injectable({
  providedIn: 'root',
})
export class ChatService {
  constructor(
    private db: AngularFireDatabase,
    private userService: UserService
  ) {}

  getChatMessages(slug: string) {
    return this.db.list<ChatMessage>(`${slug}/messages`).valueChanges();
  }

  sendChatMessage(slug: string, message: string): void {
    const user = this.userService.getOwnUser();
    const chatMessage: ChatMessage = {
      userId: user.uuid,
      userName: user.username,
      date: new Date(),
      message,
    };
    this.db.list(`${slug}/messages`).push(chatMessage);
  }
}
