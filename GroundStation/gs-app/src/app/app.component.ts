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
  messages: string[] = [];
  state = new Map<String, String>();

  roverCommand: string;
  speed: string;
  direction: string;
  manualMode: boolean;
  trapDoor: boolean;
  followLine: boolean;
  scoop: boolean;
  roverRefreshRate: string;
  
  isruCommand: string;
  deployed: boolean;
  servoAngle: string;
  heater: boolean;
  electrolysis: boolean;
  isruRefreshRate: string;

  constructor(private commsService: CommsService) {
    this.state.set("relativePosition", "[1,3]");
    this.state.set("materialFill","43");
    this.state.set("temp1","35");
    this.state.set("temp2", "25");
    this.state.set("waterLevel", "50");
    this.state.set("solarPower","2.3");
    this.state.set("batteryCurrent","4.2");

    this.speed = "10";
    this.speed = "50";
    this.manualMode = true;
    this.trapDoor = true;
    this.followLine = true;
    this.scoop = true;
    this.roverRefreshRate = "60";
    
    this.deployed = false;
    this.servoAngle = "50";
    this.heater = true;
    this.electrolysis = true;
    this.isruRefreshRate = "60";

  }

  sendMessage() {
    this.commsService.sendMessage(this.message);
    this.message = '';  
  }

  sendRoverCommand() {
    this.commsService.sendMessage("{\"rover_commands\":\"{" + this.roverCommand +"}\"}");
    this.roverCommand = '';  
  }

  sendISRUCommand() {
    this.commsService.sendMessage("{\"isru_commands\":\"{" + this.isruCommand +"}\"}");
    this.isruCommand = '';  
  }

  setSpeed(value) {
    this.commsService.sendMessage("{\"rover_commands\":\"{\\\"speed\\\":\\\"" + value +"\\\"}\"}");
  }

  setDirection(value) {
    this.commsService.sendMessage("{\"rover_commands\":\"{\\\"direction\\\":\\\"" + value +"\\\"}\"}");
  }

  setManualMode() {
    this.commsService.sendMessage("{\"rover_commands\":\"{\\\"manualMode\\\":\\\"" + this.manualMode +"\\\"}\"}");
  }

  setTrapDoor() {
    this.commsService.sendMessage("{\"rover_commands\":\"{\\\"trapDoor\\\":\\\"" + this.trapDoor +"\\\"}\"}");
  }

  setFollowLine() {
    this.commsService.sendMessage("{\"rover_commands\":\"{\\\"followLine\\\":\\\"" + this.followLine +"\\\"}\"}");
  }

  setScoop(value:boolean) {
    this.commsService.sendMessage("{\"rover_commands\":\"{\\\"scoop\\\":\\\"" + value +"\\\"}\"}");
  }

  setRoverRefreshRate() {
    this.commsService.sendMessage("{\"rover_commands\":\"{\\\"roverRefreshRate\\\":\\\"" + this.roverRefreshRate +"\\\"}\"}");
  }

  deploy() {
    this.commsService.sendMessage("{\"isru_commands\":\"{\\\"deployed\\\":\\\"" + true +"\\\"}\"}");
  }

  setServoAngle(value) {
    this.commsService.sendMessage("{\"rover_commands\":\"{\\\"servoAngle\\\":\\\"" + value +"\\\"}\"}");
  }

  setHeater() {
    this.commsService.sendMessage("{\"isru_commands\":\"{\\\"heater\\\":\\\"" + this.heater +"\\\"}\"}");
  }

  setElectrolysis() {
    this.commsService.sendMessage("{\"isru_commands\":\"{\\\"electrolysis\\\":\\\"" + this.electrolysis +"\\\"}\"}");
  }
  
  setISRURefreshRate() {
    this.commsService.sendMessage("{\"isru_commands\":\"{\\\"isruRefreshRate\\\":\\\"" + this.isruRefreshRate +"\\\"}\"}");
  }

  ngOnInit() {    
    this.commsService
      .getMessages()
      .subscribe((message: string) => {
        this.messages.push(message);  
        // console.log(message.replace(/'/g,"\""))
        JSON.parse(message.replace(/'/g,"\""), (key, value) => {

          if (key=="manualMode") {
            this.manualMode = value == "true";  
          } else if (key=="trapDoor") {
            this.trapDoor = value == "true"; 
          } else if (key=="followLine") {
            this.followLine = value == "true"; 
          } else if (key=="scoop") {
            this.scoop = value == "true"; 
          } else if (key=="roverRefreshRate") {
            this.roverRefreshRate = value; 
          } else if (key=="deployed") {
            this.deployed = value == "true"; 
          } else if (key=="heater") {
            this.heater = value == "true"; 
          } else if (key=="electrolysis") {
            this.electrolysis = value == "true"; 
          } else if (key=="isruRefreshRate") {
            this.isruRefreshRate = value; 
          } else if (key=="speed") {
            this.speed = value; 
          } else if (key=="direction") {
            this.direction = value; 
          } else if (key=="servoAngle") {
            this.servoAngle = value; 
          } else {
            this.state.set(key,value);
          }
          // console.log("adding " + key + " : " + value);
          // console.log("getting " + key + ", found  " + this.state.get(key));
        });
      });
  }
  
}
