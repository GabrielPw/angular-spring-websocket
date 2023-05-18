import { Message } from './Message';
import { ChatService } from './../chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  private webSocket!: WebSocket;
  messages: Message[] = [];
  newMessage: string = '';
  clientName: string = '';
  connectedClientsList: string[] = []; // Lista de usuários conectados 'online' que estarão visivel na sidebar da página.
  connectedClients = 0; // Número de clientes conectados

  constructor(private service: ChatService) {}

  ngOnInit(): void {

    console.log("Iniciando o onInit");

    this.service.receiveMessage().subscribe((message: any) => {
      if (Array.isArray(message)) {
        console.log("lista de clientes recebida! : " + message);
        this.connectedClientsList = message;
      } else {
        this.messages.push(new Message(message.content, message.clientName, new Date()));
        this.connectedClients = message.connectedClients;
      }
    })

  }

  openChat(client: string): void {
    // Lógica para abrir o chat correspondente ao usuário clicado

  }

  onMessageInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.newMessage = inputElement.value;
  }

  onNicknameInputChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    this.clientName = inputElement.value;
  }

  sendMessage(): void {

    if (this.clientName.trim() !== '') {

      console.log("Nome digitado: " + this.clientName);

      const message = new Message(this.newMessage, this.clientName, new Date());
      this.service.sendMessage(message);
      this.newMessage = '';
    }

    this.service.getConnectedClients().subscribe((conectados: string[]) => {

      this.connectedClients = conectados.length;
    }) 

    console.log("Connected: " + this.connectedClients);
  }
}
