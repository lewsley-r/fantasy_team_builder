import { Component} from '@angular/core';
import { WebService } from './web.service';
import { AuthGuardService } from './auth-guard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';



@Component({
    selector: 'login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.css']
})
export class LoginComponent {
    constructor(private webService: WebService,
        private authGuard: AuthGuardService,
        private route: ActivatedRoute,
        private router: Router) { }
    
    hide = true;
    email = new FormControl();
    pass = new FormControl();
  
    async ngOnInit() {
       
    }

    getErrorEmailMessage() {
        if (this.email.hasError('required')) {
          return 'You must enter a value';
        }
    
        return this.email.hasError('email') ? 'Not a valid email' : '';
    }

    getErrorPassMessage() {
        if (this.pass.hasError('required')) {
          return 'You must enter a value';
        }
        return this.pass.hasError('email') ? 'Not a valid email' : '';
    }

    async submitLogin() {
       this.authGuard.login({
            password: this.pass.value,
            email: this.email.value
        }).subscribe(response => 
            sessionStorage.setItem('token', JSON.stringify(response))
        );
        await this.delay(2000);
        if(sessionStorage.getItem('token')!= null){
            window.location.assign('/')
        }
        else{
            alert('Login Failed, Try Again')
        }
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }


 


}
