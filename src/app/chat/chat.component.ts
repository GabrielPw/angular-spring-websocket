import { UserService } from './../user.service';
import { Client } from './Client';
import { Message } from './Message';
import { ChatService } from './../chat.service';
import { Component, OnInit } from '@angular/core';
import { MessageTypeEnum } from './MessageTypeEnum';

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

  client: Client = new Client('', '');
  idList: string[] = [];
  newMessage: string = ''; // variável que vai guardar a mensagem que o cliente digitar.
   
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

  constructor(private service: ChatService, private userService:UserService) {}
  async ngOnInit(): Promise<void> {

    // Obter informações sobre cliente
    // Obtendo id

    // Aguardar a atualização do valor de idDoCliente
    await this.service.idDoClientePromise;    

    console.log("Id do cliente vinda do service: " + this.service.idDoCliente);
    this.client = new Client(this.userService.username, this.service.idDoCliente);

    console.log("nome do cliente: " + this.client.getName());
    // define uma foto aletória para o cliente.
    this.client.setPhotoUrl(this.getRandomProfilePicFromList());

    // envia a foto do cliente para o servidor.
    let payload = {
      
      content: 'setClientPhoto',
      urlPhoto: this.client.getPhotoUrl(),
      sessionId: this.client.getSessionId(),
      clientName: this.client.getName(),
      type: 'System'
    } 

    this.service.sendMessageToServer(payload);

    // obtendo lista de id's dos clientes conectados ao webSocket.
    this.service.requestIDList();

    this.service.idList$.subscribe((idList: string[]) => {

      // aplicando o .filter() para remover o id do cliente da lista de id's 
      this.idList = idList.filter(id => id !== this.client.getSessionId());
      console.log('Lista de IDs atualizada:', this.idList);
    });
  }

  getRandomProfilePicFromList():string{

    const randomIndex = Math.floor(Math.random() * this.profile_pic_list.length);
    return this.profile_pic_list[randomIndex];
  }

  // Envia mensagem digitada pelo usuário.
  sendMessage(){

  }

  openChat(clientId:string){

  }

  // Atualiza a variável 'newMessage' conforme o usuário digita no campo de texto.
  onMessageInputChange(event: Event){
    const inputElement = event.target as HTMLInputElement;
    this.newMessage = inputElement.value;
  }
}