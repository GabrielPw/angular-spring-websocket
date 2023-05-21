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

  private idListSubject: BehaviorSubject<string[]> = new BehaviorSubject<string[]>([]);
  public idList$: Observable<string[]> = this.idListSubject.asObservable();


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

      switch(message.type){
        case MessageTypeEnum.System:
          if(message.content == 'getId'){ // Obtem id do cliete
            console.log('Id do cliente: ' + message.sessionId);
            this.idDoCliente = message.sessionId;
            this.resolveIdDoCliente(this.idDoCliente);
          } else if (message.content === 'idList') {
            const idList: string[] = JSON.parse(message.sessionIdList);
            this.idListSubject.next(idList);
            console.log('Lista de IDs: ', idList);
            // Faça o que for necessário com a lista de IDs recebida
          }
          break;
        case MessageTypeEnum.Chat:
          break;
      }
    });
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
  
}