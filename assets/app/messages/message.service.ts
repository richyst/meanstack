import { Message } from "./message.model";
import { Http, Response, Headers } from '@angular/http'
import { Injectable, EventEmitter } from "@angular/core";
import 'rxjs/Rx';
import { Observable } from 'rxjs';
@Injectable()
export class MessageService {
    private messages: Message[] = [];
    messageIsEdit = new EventEmitter<Message>();

    constructor(private http: Http){}
    addMessage(message: Message) {
        
        const body = JSON.stringify(message);
        const headers = new Headers({'Content-Type': 'application/json'})
        return this.http.post('http://localhost:3000/message', body, {headers: headers})
            .map((res: Response) => {
                const result = res.json();
                const message = new Message(result.obj.content, 'Ricardo', result.obj._id,null);
                this.messages.push(message);
                return message;
            })
            .catch((error:Response)=> Observable.throw(error.json()));
    }

    getMessages() {
        return this.http.get('http://localhost:3000/message')
            .map((res:Response)=> {
                const messages = res.json().obj;
                let transformedMessages: Message[] = [];
                for (let message of messages) {
                    transformedMessages.push(new Message(message.content,'Test', message._id, null));
                }
                this.messages = transformedMessages;
                return transformedMessages;
            })
            .catch((error: Response) => Observable.throw(error.json()));
    }

    editMessage(message: Message) {
        this.messageIsEdit.emit(message);
    }

    updateMessage(message: Message) {
        const body = JSON.stringify(message);
        const headers = new Headers({ 'Content-Type': 'application/json' })
        return this.http.patch('http://localhost:3000/message/' + message.messageId, body, { headers: headers })
            .map((res: Response) => res.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
    deleteMessage(message:Message) {
        this.messages.splice(this.messages.indexOf(message), 1);
        return this.http.delete('http://localhost:3000/message/' + message.messageId)
            .map((res: Response) => res.json())
            .catch((error: Response) => Observable.throw(error.json()));
    }
}