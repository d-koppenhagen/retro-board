import {
  AfterViewChecked,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable } from 'rxjs';

import { ChatMessage } from '../shared/chat-message';
import { ChatService } from '../shared/chat.service';
import { UserService } from '../shared/user.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnInit, AfterViewChecked {
  @ViewChild('chatMessagesContainer') private chatMessagesContainer: ElementRef;

  messages$: Observable<ChatMessage[]>;
  private slug: string;

  constructor(
    private route: ActivatedRoute,
    private chatService: ChatService,
    private userService: UserService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.messages$ = this.chatService.getChatMessages(this.slug);
    this.scrollToBottom();
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  scrollToBottom(): void {
    try {
      this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
    } catch (err) {}
  }

  sendMessage(messageInput: HTMLInputElement) {
    if (messageInput.value && messageInput.value.trim() !== '') {
      this.chatService.sendChatMessage(this.slug, messageInput.value);
      messageInput.value = '';
    }
  }

  isOwnMessage(uuid: string) {
    return this.userService.getOwnUser().uuid === uuid;
  }
}
