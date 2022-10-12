import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable()
export class WebService {
    

    constructor(private http: HttpClient) {

    }
    async getPlayers() {
        const token = sessionStorage.getItem('token')
        try {
            return await this.http.get('http://localhost:5000/api/v1.0/players', { headers: { 'x-access-token': JSON.parse(token!) } }
            ).toPromise();
        } catch (err: any) {
            return alert(err.error.message);
        }
    }
    async getTeams() {
        const token = sessionStorage.getItem('token')
        try {
            return await this.http.get('http://localhost:5000/api/v1.0/teams', { headers: { 'x-access-token': JSON.parse(token!) } }
            ).toPromise();
        } catch (err: any) {
            return alert(err.error.message);
        }
    }
    getUser(){
        const token = sessionStorage.getItem('token')
        return this.http.get('http://localhost:5000/api/v1.0/get/user', { headers: {'x-access-token': JSON.parse(token!)}}
        ).toPromise();
    }

    editUsername(newName: any){
        const token = sessionStorage.getItem('token')
        return this.http.post('http://localhost:5000/api/v1.0/edit/username', newName, { headers: {'x-access-token': JSON.parse(token!)}})
    }

    createUser(user: any) {
        let userData = new FormData();
        userData.append("fullname", user.fullname)
        userData.append("email", user.email)
        userData.append("password1", user.password1)
        userData.append("password2", user.password2)
        return this.http.post('http://localhost:5000/api/v1.0/create/user', userData)
    }

    createTeam(team: any){
        const token = sessionStorage.getItem('token')
        return this.http.post('http://localhost:5000/api/v1.0/create/team', team, { headers: {'x-access-token': JSON.parse(token!)}})
    }

    deleteTeam(id: any) {
        const token = sessionStorage.getItem('token')
        return this.http.post('http://localhost:5000/api/v1.0/delete/team', id, { headers: {'x-access-token': JSON.parse(token!)}})
    }

    



}