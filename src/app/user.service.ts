import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  username: string = '';
  constructor() { }

  setUsername(name:string):void{

    this.username = name;
  }
}
