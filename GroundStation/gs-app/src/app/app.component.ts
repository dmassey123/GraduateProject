import { Component } from '@angular/core';
import { CommsService } from './comms.service';
import { FormControl } from '@angular/forms';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'Ground Station';
  message: string;
  checked: boolean;
  messages: string[] = [];
  state = new Map<String, String>();

  
  constructor(private commsService: CommsService) {
    this.state.set("temp1","35");
  }

  sendMessage() {
    this.commsService.sendMessage(this.message);
    this.message = '';  
  }

  sendRoverCommand() {
    this.commsService.sendMessage("{\"rover_commands\":\"{" + this.message +"}\"}");
    this.message = '';  
  }

  sendISRUCommand() {
    this.commsService.sendMessage("{\"isru_commands\":\"{" + this.message +"}\"}");
    this.message = '';  
  }

  manualMode = new FormControl;
  setManualMode() {
    this.commsService.sendMessage("{\"rover_commands\":\"{\\\"setManualMode\\\":\\\"" + this.manualMode.value +"\\\"}\"}");
  }

  ngOnInit() {
    this.commsService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);  
        // console.log(message.replace(/'/g,"\""))
        JSON.parse(message.replace(/'/g,"\""), (key, value) => {
          this.state.set(key,value);
          console.log("adding " + key + " : " + value);
          console.log("getting " + key + ", found  " + this.state.get(key));
        });
        console.log("state = " + JSON.stringify(this.state));
      });
  }
  
}
