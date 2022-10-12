import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { AuthGuardService } from './auth-guard.service';


@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(private Authguardservice: AuthGuardService,
    private router: Router) {} 
  async canActivate() :Promise<boolean> {
    if (!this.Authguardservice.getToken()) {  
      this.router.navigateByUrl("/login");  
    }
    else if(await this.Authguardservice.isTokenValid(sessionStorage.getItem('token'))){
      this.router.navigateByUrl("/login");  
    }  
    return this.Authguardservice.getToken();  
  }
  
}
