import { Component} from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';



@Component({
    selector: 'register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    responseMessage: any;
    constructor(private webService: WebService,
        private route: ActivatedRoute) { }
    
    hide = true;
    email = new FormControl();
    pass = new FormControl();
    pass2 = new FormControl();
    name = new FormControl();
  
    async ngOnInit() {
       
    }

    getErrorEmailMessage() {
        if (this.email.hasError('required')) {
          return 'You must enter a value';
        }
    
        return this.email.hasError('email') ? 'Not a valid email' : '';
    }

    getErrorNameMessage() {
        if (this.name.hasError('required')) {
          return 'You must enter a value';
        }
    
        return this.name.hasError('name') ? 'Not a valid name' : '';
    }

    getErrorPassMessage() {
        if (this.pass.hasError('required')) {
          return 'You must enter a value';
        }
    
        return this.pass.hasError('password') ? 'Not a valid password' : '';
    }

    async submitRegister() {
        this.webService.createUser({
            fullname: this.name.value,
            password1: this.pass.value,
            password2: this.pass2.value,
            email: this.email.value
        }).subscribe(response => 
            this.responseMessage = response
        );
        await this.delay(2000);
        alert(this.responseMessage.message)
        window.location.assign('/login')
    
    }
    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }



 


}
