import { UserService } from './user.service';
import { Component } from '@angular/core';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {

  userName: string = '';
  userNameEntered: boolean = false;


  constructor(private userService: UserService){}

  enterChat() {
    if (this.userName.trim() !== '') {
      this.userNameEntered = true;
      this.userService.setUsername(this.userName);
    }
  }

}
