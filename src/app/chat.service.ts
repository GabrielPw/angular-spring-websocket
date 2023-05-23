import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Message } from './chat/Message';
import { Client } from './chat/Client';
import { MessageTypeEnum } from './chat/MessageTypeEnum';

@Injectable({
  providedIn: 'root'
})
export class ChatService {

  /*  
    1. Obter id do cliente.
    2. obter todos os clientes online.
  */

  private socket$: WebSocketSubject<any>;
  public idDoCliente = '';

  public idDoClientePromise: Promise<string>;
  private resolveIdDoCliente!: (value: string | PromiseLike<string>) => void;

  private clientListSubject: BehaviorSubject<Client[]> = new BehaviorSubject<Client[]>([]);
  public clientList$: Observable<Client[]> = this.clientListSubject.asObservable();

  public connectedClientList:Client[] = [];
  private chatMessages: { [chatId: string]: { senderName: string, messages: string[] } } = {}; // Variável que armazena uma chave 'id' (id do chat) com valores lista de mensagens e remetente.

  // quando o chat service for iniciado, ele deve obter o Id do cliente e enviar o nome que o cliente inseriu no frontend.
  // O backend vai enviar um id correspondente á sessão e o frontend vai enviar o nome do cliente.
  constructor(private http: HttpClient) {
    this.socket$ = new WebSocketSubject('ws://localhost:8080/chat');

    this.idDoClientePromise = new Promise<string>((resolve) => {
      this.resolveIdDoCliente = resolve;
    });

    this.socket$.subscribe((message: any) => {

      // as mensagens vão ser de 2 tipos: tipo 'System' ou tipo 'Chat'
      // 'System': usado pelo frontEnd para enviar ou requisitar informações ao backend. (ex: pedir o id de um usuário/enviar o nome que o cliente inseriu.)
      // 'Chat': mensagens trocadas pelos usuários.

      // Ao receber mensagens do servidor, deve-se saber se a mensagem é do tipo 'System' ou 'Chat'
      console.log("messagem chegou.");
      console.log("message type: " + message.type);
      switch(message.type){
        
        case MessageTypeEnum.System:
          this.handleSystemMessage(message);
        break;
        case MessageTypeEnum.Chat:

          this.handleChatMessage(message);
        break;
      }
    });
  }

  // Métodos para lidar com mensagens recebidas do tipo: System e Chat.
  // Mensagens do tipo: 'System'.
  handleSystemMessage(message: any){
    if(message.content == 'getId'){ // Obtem id do cliete
      console.log('Id do cliente: ' + message.sessionId);
      this.idDoCliente = message.sessionId;
      this.resolveIdDoCliente(this.idDoCliente);
    } else if (message.content === 'idList') {

      // Obtem lista de id's vinda do servidor. (lista que será útil para saber quais usuários estão 'online').
      const connectedClientListData: any[] = JSON.parse(message.connectedClientList);
      const connectedClientList: Client[] = connectedClientListData.map(clientData => { // convertendo o Json para um objeto do tipo Client.
        const { name, sessionId, urlPhoto } = clientData;
        return new Client(name, sessionId, urlPhoto);

      });
     
      this.clientListSubject.next(connectedClientList);
    }
  }

  // Mensagens do tipo: 'Chat'.
  handleChatMessage(message: any){
    // obter mensagem e quem enviou.
    const receivedMessage:string = message.content;
    const clientWhoSendMessage_Id:string = message.sessionId;
    const clientDestination_Id: string = message.messageTo;

    // Verificar se o ID do chat já existe no objeto de mensagens
    if (!this.chatMessages.hasOwnProperty(clientDestination_Id)) {
      this.chatMessages[clientDestination_Id] = { senderName: '', messages: [] }; // Se não existir, cria uma nova lista de mensagens para esse chat
    }

    // obtendo cliente que enviou a mensagem
    const clientSender: Client | undefined = this.connectedClientList.find(client => client.getSessionId() === clientWhoSendMessage_Id);
    const senderName: string = clientSender ? clientSender.getName() : ''; // Obter o nome do cliente que enviou a mensagem

    // Adicionar a nova mensagem à lista de mensagens do chat
    this.chatMessages[clientWhoSendMessage_Id].senderName = senderName;
    this.chatMessages[clientWhoSendMessage_Id].messages.push(receivedMessage);
    
  }

  sendMessageToServer(message: any) {
    // Enviar a mensagem para o servidor usando o método `next()` do WebSocketSubject
    this.socket$.next(message);
  }

  // Obter lista de id's.
  requestIDList() {
    const message = {
      content: 'getIdList',
      type: 'System'
    };
    this.sendMessageToServer(message);
    
  }

  // Obter lista de mensagens recebidas.
  getChatMessages(chatId: string): { senderName: string, messages: string[] } {
    // Retorna o objeto com o remetente e a lista de mensagens do chat específico
    return this.chatMessages[chatId] || { senderName: '', messages: [] };
    
  }

  addMessageToChat(chatId: string, senderName: string, message: string) {
    // Verifica se o ID do chat existe no objeto de mensagens
    if (!this.chatMessages.hasOwnProperty(chatId)) {
      // Se não existir, cria um novo objeto de mensagens para esse chat
      this.chatMessages[chatId] = { senderName: '', messages: [] };
    }

    // Adiciona o remetente e a nova mensagem à lista de mensagens do chat
    this.chatMessages[chatId].senderName = senderName;
    this.chatMessages[chatId].messages.push(message);
  }
}