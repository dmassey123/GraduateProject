import * as io from 'socket.io-client';
import { Observable } from 'rxjs';
import { Injectable } from "@angular/core";

@Injectable()
export class CommsService {
    private url = '127.0.0.1:5000';
    private socket;    

    constructor() {
        this.socket = io(this.url);
    }

    public sendMessage(message) {
        console.log("Sending message: " + message); 
        this.socket.emit('new-message', message);
    }

    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('new-message', (message) => {
                console.log(message);
                observer.next(message);
            });
        });
    }

}   