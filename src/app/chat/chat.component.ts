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
import { DataService } from '../shared/data.service';

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
    private dataService: DataService
  ) {}

  ngOnInit(): void {
    this.slug = this.route.snapshot.paramMap.get('slug');
    this.messages$ = this.dataService.getChatMessages(this.slug);
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

  sendMessage(message: string) {
    this.dataService.sendChatMessage(this.slug, message);
  }

  isOwnMessage(uuid: string) {
    return this.dataService.getOwnUser().uuid === uuid;
  }
}
