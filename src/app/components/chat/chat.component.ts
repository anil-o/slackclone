import { Component, OnDestroy, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { ChannelService } from 'src/app/services/channel.service';
import { ChatService } from 'src/app/services/chat.service';
import { FirestoreService } from 'src/app/services/firestore.service';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss'],
})
export class ChatComponent implements OnDestroy, OnInit {
  observerChatList: Observable<any>;
  scrollStatus = this.chatService.scrollStatus;

  constructor(
    public chatService: ChatService,
    public firestoreservice: FirestoreService,
    public channelService: ChannelService
  ) {
    this.observerChatList = this.firestoreservice.observeChat$;
    this.observerChatList.subscribe((chats) => {
      this.chatService.chatList = chats;
      this.chatService.updateChatContent();
    });
    this.scrollStatus.subscribe((status) => {
      if (status) {
        this.scrollToBottomOfContent('smooth');
      } else if (!status) {
        this.scrollToBottomOfContent('instant');
      }
    });
  }

  ngOnInit(): void {
    //this.chatService.loadChatContent();
  }

  ngOnDestroy(): void {
    this.chatService.chatReady = false;
  }

  scrollToBottomOfContent(style: any): void {
    let content = document.getElementById('chat-content') || undefined;
    content.scrollTo({ top: content.scrollHeight, behavior: style });
  }
}
