import { Component, Inject } from '@angular/core';
import { WebService } from './web.service';
import { AuthGuardService } from './auth-guard.service';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog, MAT_DIALOG_DATA } from '@angular/material/dialog';


export interface DialogData {
    team: any;
    stats: any;
}


@Component({
    selector: 'home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.css']
})
export class HomeComponent {
    constructor(private webService: WebService,
        private authGuardService: AuthGuardService,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private router: Router) { }
    user: any
    teams: any
    panelOpenState: boolean = false;
    newUserName = new FormControl()
    responseMessage: any





    async ngOnInit() {
        var response = await this.webService.getUser()
        if (response) {
            this.user = response
        }
        var teams = await this.webService.getTeams()
        this.teams = teams
    }

    async editUsername() {
        this.webService.editUsername({ 'name': this.newUserName.value }).subscribe(response =>
            this.responseMessage = response
        );
        await this.delay(2000)
        alert(this.responseMessage.message)
        window.location.reload() 

    }

    openStatsDialog(team: any) {
        this.dialog.open(TeamSheetDialog, {
            data: {
                team: team
            },
        });
    }
    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    async deleteTeam(id: any) {
        this.webService.deleteTeam({ 'id': id }).subscribe(response =>
            this.responseMessage = response
        );
        await this.delay(2000)
        alert(this.responseMessage.message)
        window.location.reload() 
    }

    



}


@Component({
    selector: 'team-sheet-dialog',
    templateUrl: 'team-sheet-dialog.html',
})
export class TeamSheetDialog {
    constructor(

        @Inject(MAT_DIALOG_DATA) public data: DialogData) { }
}

