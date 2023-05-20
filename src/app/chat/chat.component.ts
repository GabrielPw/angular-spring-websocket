import { Client } from './Client';
import { Message } from './Message';
import { ChatService } from './../chat.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.scss']
})
export class ChatComponent implements OnInit {

  /*

  Oque deve ser feito no ChatComponent

  1. Inicializar chat ontendo informações básicas do cliente conectado (id, imagem perfil)
  2. exibir informações do cliente na tela.
  3. exibir mensagens (tando das enviadas como das recebidas)
   
  -------------------

  1. ao iniciar o programa, as informações básicas do cliente será definida no onInit.

  */
   
  
  clienteChatAtivo:Client = new Client('', '');
  clientName = '';

  client: Client = new Client('', '');
  newMessage: string = ''; // mensagem que o usuário digitar no campo de texto.
  messages:Message[] = []; // Lista de mensagens que já foram recebidas.
  sessionIdList: string[] = []; // Lista de IDs de sessão

  // Lista com url de fotos de perfil (apenas p/ uso temporário).
  profile_pic_list: string[] = [
    'https://i.pinimg.com/236x/02/df/df/02dfdfb8f8b3c82fb1f51118fa73a914.jpg',
    'https://i.pinimg.com/236x/e0/76/cd/e076cda4ac938cfa5e52c39ee8cf62fa.jpg',
    'https://i.pinimg.com/236x/d6/e1/0a/d6e10a79f543530e51c36f3c421299df.jpg',
    'https://i.pinimg.com/736x/ab/1d/a8/ab1da83058a41c3cdd49bd5415863b0d.jpg',
    'https://i.pinimg.com/236x/77/16/45/7716450e8335bc0d9ae853984e640e1f.jpg',
    'https://i.pinimg.com/236x/d9/a5/78/d9a5786dfcb94b3f1fdd9094521074e2.jpg',
    'https://i.pinimg.com/236x/0c/ec/fa/0cecfa5bd56a3a089467769c9ede571e.jpg',
    'https://i.pinimg.com/236x/81/ce/62/81ce624988f75a68f1f0fbc1b4891f92.jpg',
    'https://i.pinimg.com/736x/0b/e2/12/0be212fef95d29931e14a2820e52f568.jpg',
    'https://i.pinimg.com/236x/bb/f4/cd/bbf4cdb5eb38517f08ce9105669aae99.jpg'

  ];

  constructor(private service: ChatService) {}
  ngOnInit(): void {

    // subscribe para receber atualizações do valor da variável 'sessionId'.
    this.service.sessionId$.subscribe((sessionId: string) => {
      console.log("Atualizou")
      this.client.setSessionId(sessionId);
    });

    
    this.service.sessionIdList$.subscribe((sessionIdList: string[]) => {
      this.sessionIdList = sessionIdList;

      this.sessionIdList = sessionIdList.filter(id => id !== this.client.getSessionId()); // remove Id do cliente da lista de id's (só é necessário exibir o id dos outros clientes que estão online). 
    });

    this.service.clienteAtivo$.subscribe((clienteAtivo) => {
      this.clienteChatAtivo = clienteAtivo;

      
    });

    this.client.setPhotoUrl(this.getRandomProfilePicFromList());
    this.service.sendClientInformation(this.client);
  }

  // método para enviar mensagem.
  sendMessage():void{

    // verificar se campos não estão vazios.
    if (this.newMessage.trim() !== ''){
      const message = new Message(this.newMessage, this.clientName, new Date());
      var destination = '';
      this.service.sendMessage(message, destination);
      
      this.newMessage = '';
    }

    console.log('sessionId do cliente:' + this.client.getSessionId());
  }

  // Método para obter/atualizar valor 'mensagem' digitado pelo usuário.
  onMessageInputChange(event: Event):void{

    const inputElement = event.target as HTMLInputElement;
    this.newMessage = inputElement.value;
  }

  // Método para obter/atualizar valor 'nome' do cliente.
  onNicknameInputChange(event: Event):void{
    
    const inputElement = event.target as HTMLInputElement;
    this.client.setName(inputElement.value);
  }

  getRandomProfilePicFromList():string{

    const randomIndex = Math.floor(Math.random() * this.profile_pic_list.length);
    return this.profile_pic_list[randomIndex];
  }

  //
  openChat(clientId:string){
    this.service.getClientInformation(clientId);
  }
}
