import { Component } from '@angular/core';
import { CommsService } from './comms.service';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ground Station';
  message: string;
  messages: string[] = [];
  
  constructor(private commsService: CommsService) {
    
  }

  sendMessage() {
    this.commsService.sendMessage(this.message);
    this.message = '';  
  }

  ngOnInit() {
    this.commsService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);  
      });
  }
  
}
