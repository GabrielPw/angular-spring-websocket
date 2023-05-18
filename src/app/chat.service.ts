import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { WebSocketSubject } from 'rxjs/webSocket';
import { Message } from './chat/Message';

@Injectable({
  providedIn: 'root'
})
export class ChatService {
  private socket$: WebSocketSubject<any>;
  private apiUrl = 'http://localhost:8080';
  private connectedClientsSubject = new BehaviorSubject<number>(0);
  public connectedClients$ = this.connectedClientsSubject.asObservable();

  constructor(private http: HttpClient) {
    this.socket$ = new WebSocketSubject('ws://localhost:8080/chat');
    this.socket$.subscribe((message: any) => {
      this.handleWebSocketMessage(message);
    });
  }

  sendMessage(messageObj: Message): void {
    const payload = {
      content: messageObj.content,
      clientName: messageObj.clientName,
      date: messageObj.actualTime
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

  getConnectedClients(): Observable<string[]> {
    const url = `${this.apiUrl}/connected-clients`;
    return this.http.get<string[]>(url);
  }

  private handleWebSocketMessage(message: any): void {
    if (typeof message === 'number') {
      this.connectedClientsSubject.next(message);
      console.log("Número de clientes conectados: " + message);
    }
    // Handle other types of messages
  }
}