import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Message } from './chat/Message';
import { Client } from './chat/Client';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket$: WebSocketSubject<any>;
  private connectedClientsSubject = new BehaviorSubject<number>(0);
  public connectedClients$ = this.connectedClientsSubject.asObservable();

  // variáveis para armazenar o Id da sessão.
  private sessionIdSubject = new BehaviorSubject<string>('');
  public sessionId$ = this.sessionIdSubject.asObservable();

  private sessionIdListSubject = new BehaviorSubject<string[]>([]);
  public sessionIdList$ = this.sessionIdListSubject.asObservable();


  client:Client = new Client("", "");
  private clienteAtivoSubject = new BehaviorSubject<Client>(this.client);
  public clienteAtivo$ = this.clienteAtivoSubject.asObservable();
  

  constructor(private http: HttpClient) {
    this.socket$ = new WebSocketSubject('ws://localhost:8080/chat');
    this.socket$.subscribe((message: any) => {
      this.handleWebSocketMessage(message);
    });
  }

  sendMessage(messageObj: Message, destination:string): void {
    const payload = {
      content: messageObj.content,
      clientName: messageObj.clientName,
      date: messageObj.actualTime,
      sessionId: this.sessionIdSubject.getValue(),
      destination: destination
    };
    this.socket$.next(payload);
    console.log("Mensagem enviada: " + payload.content);
  }

  receiveMessage(): Observable<any> {
    return this.socket$.asObservable().pipe(
      tap((message: any) => {
        this.handleWebSocketMessage(message);
      })
    );
  }

  // método para atualizar lista de Id's de sessão.
  updateSessionIdList(sessionIdList: string[]):void{
    this.sessionIdListSubject.next(sessionIdList);
  }

  private handleWebSocketMessage(message: any): void {
    
    console.log("Entrou no método. message: " + message.sessionId);
    if (typeof message === 'number') {
      this.connectedClientsSubject.next(message);
      console.log("Número de clientes conectados: " + message);
    } else if(Array.isArray(message)){

      // JSON contendo lista de Id's.
      //console.log("A lista de ID's chegou!");
      this.sessionIdListSubject.next(message);
      //console.log("Lista de IDs:", message);
      console.log("Mesagem: " + message);
      
    }else{
      console.log('sessionId chegou.');
      console.log("Mesagem: " + message);

      this.sessionIdSubject.next(message.sessionId);
      if (message.hasOwnProperty('sessionId')) {
        console.log("(recebido) sessionId:", message.sessionId);
      }
  
      if (message.hasOwnProperty('clientName')) {
        // Atualize o BehaviorSubject correspondente
        console.log("(recebido) clientName:", message.clientName);
      
      }
  
      if (message.hasOwnProperty('urlPhoto')) {
        console.log("(recebido) urlPhoto:", message.urlPhoto);

        this.client.setPhotoUrl(message.urlPhoto);
        this.clienteAtivoSubject.next(this.client);
      }
    }

  }

  sendClientInformation(client:Client){
    const payload = {  
      destination: 'setClientInformation',
      sessionId: this.sessionIdSubject.getValue(),
      urlPhoto: client.getPhotoUrl()
    };

    this.socket$.next(payload);
  }

  // método para obter informações sobre um usuário (sessão) a partir de seu sessionId. será necessário quando abrir o chat.
  getClientInformation(sessionId: string): void {
 
    const payload = {  
      destination: 'getClientInformation',
      sessionId: this.sessionIdSubject.getValue(),
      getInfoOfSessionId: sessionId
    };

    this.socket$.next(payload);
    console.log('requisição de informação de cliente. Dono: ' + this.sessionIdSubject.getValue() + ' - para: ' + sessionId);
  }
}