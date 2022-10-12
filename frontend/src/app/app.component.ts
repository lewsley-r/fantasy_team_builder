import { Component } from '@angular/core';
import { AuthGuardService } from './auth-guard.service';
import { Router } from '@angular/router';



@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title: any;
  constructor(private authGuardService: AuthGuardService,
    private router: Router){}
  responseMessage: any;
  isLoggedIn: any; 
  
  async ngOnInit(){
    this.isLoggedIn = this.authGuardService.getToken()
    console.log(this.isLoggedIn)
    return 
  }
  

  async logout(){
    this.authGuardService.logout().subscribe((response: any) => 
        this.responseMessage = response)
        await this.delay(2000)
        alert(this.responseMessage.message)
        window.location.reload() 

  }
  delay(ms: number) {
    return new Promise( resolve => setTimeout(resolve, ms) );
  }

}
