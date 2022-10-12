import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import {JwtHelperService} from '@auth0/angular-jwt';



@Injectable({
  providedIn: 'root'
})
export class AuthGuardService {

  jwtHelper = new JwtHelperService();

  constructor(private http: HttpClient) { 

  }

  login(user: any) {
    return this.http.post('http://localhost:5000/api/v1.0/login', { 'username': user.email, 'password': user.password })
  }

  logout() {
    const token = sessionStorage.getItem('token')
    sessionStorage.removeItem('token')
    return this.http.post('http://localhost:5000/api/v1.0/logout','', { headers: { 'x-access-token': JSON.parse(token!) } })
  }

  getToken(){  
    return !!sessionStorage.getItem("token");  
  }
  
  async isTokenValid(token: any){
    return !!this.jwtHelper.isTokenExpired(await token) 
  }
} 

