import { Component, OnInit } from "@angular/core";
import { MessageService } from "./message.service";
import { Message } from "./message.model";
import { NgForm } from "@angular/forms";

@Component({
    selector: 'app-message-input',
    templateUrl:'./message-input.component.html'
})
export class MessageInputcomponent implements OnInit{
    message: Message;
    constructor(private messageService: MessageService){}

    ngOnInit(){
        this.messageService.messageIsEdit.subscribe(
            (message: Message) => this.message = message
        );
    }
    onClear(form: NgForm){
        this.message = null;
        form.resetForm();
    }

    onSubmit(form:NgForm ){
        if (this.message) {
            this.message.content = form.value.content;
            this.messageService.updateMessage(this.message).subscribe(
                result => console.log(result);
            );
            this.message = null;
            
        } else {
            const message = new Message(form.value.content, 'Max');
            this.messageService.addMessage(message).subscribe(
                data => console.log(data),
                error => console.log(error)
            );
        }
        form.resetForm();
    }
}