import { Component, ElementRef, Inject, ViewChild } from '@angular/core';
import {CommonModule} from '@angular/common';
import { WebService } from './web.service';
import { FormControl } from '@angular/forms';
import { Player } from "./player.type";
import { Team } from "./team.type";
import { ActivatedRoute, Router } from '@angular/router';



import { MatSelect } from '@angular/material/select';
import { MatOption } from '@angular/material/core';
import {MatDialog, MAT_DIALOG_DATA} from '@angular/material/dialog';



export interface DialogData {
    player: any;
    stats: any;
  }

@Component({
    selector: 'team',
    templateUrl: './team.component.html',
    styleUrls: ['./team.component.css']
})
export class TeamComponent {
    defSel: any;
    constructor(private webService: WebService,
        private route: ActivatedRoute,
        public dialog: MatDialog,
        private router: Router) { }
    
    @ViewChild('defSel')
    defSelection!: MatSelect;

    @ViewChild('midSel')
    midSelection!: MatSelect;

    @ViewChild('fwdSel')
    fwdSelection!: MatSelect;


    
    myControl = new FormControl();
    myGoalkeeper = new FormControl();
    myDefenders = new FormControl();
    myMidfielders = new FormControl();
    myForwards = new FormControl();
    teamName = new FormControl();
    selectedPlayer: any;
    players: any;
    goalkeepers: any[] = []
    defenders: any[] = []
    midfielders: any[] = []
    forwards: any[] = []
    team: Team = new Team;
    player: Player = new Player();
    defender1!: string;
    isAllDefSelected: boolean = false;
    isAllMidSelected: boolean = false;
    isAllFwdSelected: boolean = false;
    currentUser: any;
    responseMessage: any;



    async ngOnInit() {
        var response = await this.webService.getPlayers();
        var user = await this.webService.getUser()
        this.currentUser = user
        this.players = response;
        this.filterPositions()


    }

    changedGk() {
        this.team.Goalkeeper = this.myGoalkeeper.value;
    }

    changedDef() {
        if (this.myDefenders.value.length < 4){

        }
        else if (this.myDefenders.value.length = 4) {
            this.isAllDefSelected = true;
            this.team.Defenders = this.myDefenders.value;

        }
    }

    changedMid() {
        if (this.myMidfielders.value.length < 4){

        }
        else if (this.myMidfielders.value.length = 4) {
            this.isAllMidSelected = true;
            this.team.Midfielders = this.myMidfielders.value;
        }
    }

    changedFwd() {
        if (this.myForwards.value.length < 2){

        }
        else if (this.myForwards.value.length = 2) {
            this.isAllFwdSelected = true;
            this.team.Forwards = this.myForwards.value;
        }
    }


    removePlayer(player: any) {
        if (player.Position == "Goalkeeper") {
            this.team.Goalkeeper = new Player
        } else if (player.Position == "Defender") {
            const index: number = this.team.Defenders.indexOf(player);
            if (this.team.Defenders.length > 1){
                this.team.Defenders.splice(index, 1);
                this.defSelection.options.forEach( (item : MatOption) => {item.deselect()});
            }else{
                this.team.Defenders.splice(index, 1, new Player);
            }
            this.isAllDefSelected = false
        } else if (player.Position == "Midfielder") {
            const index: number = this.team.Midfielders.indexOf(player);
            if (this.team.Midfielders.length > 1){
                this.team.Midfielders.splice(index, 1);
                this.midSelection.options.forEach( (item : MatOption) => {item.deselect()});
            }else{
                this.team.Midfielders.splice(index, 1, new Player);
            }
            this.isAllMidSelected = false
        } else if (player.Position == "Forward") {
            const index: number = this.team.Forwards.indexOf(player);
            if (this.team.Forwards.length > 1){
                this.team.Forwards.splice(index, 1);
                this.fwdSelection.options.forEach( (item : MatOption) => {item.deselect()});
            }else{
                this.team.Forwards.splice(index, 1, new Player);
            }
            this.isAllFwdSelected = false
        }
    }

    openStatsDialog(player: any) {
        var i;
        for (i in player){
            console.log(player[i])
        }
        this.dialog.open(PlayerStatsDialog, {
            data: {
              player: player
            },
          });
    }

    filterPositions() {
        var player;
        for (player in this.players) {
            if (this.players[player].Position == "Goalkeeper") {
                this.goalkeepers.push(this.players[player])
            } else if (this.players[player].Position == "Defender") {
                this.defenders.push(this.players[player])
            } else if (this.players[player].Position == "Midfielder") {
                this.midfielders.push(this.players[player])
            } else if (this.players[player].Position == "Forward") {
                this.forwards.push(this.players[player])
            }

        }
    }

    delay(ms: number) {
        return new Promise( resolve => setTimeout(resolve, ms) );
    }

    notAllSelected(){
        if (this.myGoalkeeper.value != null && this.isAllDefSelected && this.isAllMidSelected && this.isAllFwdSelected){
            return false
        }
        else{
            return true
        }
    }

    async saveTeam(){
        this.team.Owner_id = this.currentUser._id
        this.team.Team_Name = this.teamName.value
        this.webService.createTeam(this.team).subscribe(response =>
            this.responseMessage = response
        );
        await this.delay(2000)
        alert(this.responseMessage.message)
        this.router.navigateByUrl('/')
    }
}

@Component({
    selector: 'player-stats-dialog',
    templateUrl: 'player-stats-dialog.html',
})
export class PlayerStatsDialog {
    constructor(

    @Inject(MAT_DIALOG_DATA) public data: DialogData)
    
    
{}
}


