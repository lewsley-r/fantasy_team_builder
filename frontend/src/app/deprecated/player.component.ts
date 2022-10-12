import { Component, EventEmitter, Output } from '@angular/core';
import { WebService } from './web.service';
import { ActivatedRoute } from '@angular/router';


@Component({
    selector: 'player',
    templateUrl: './player.component.html',
    styleUrls: ['./player.component.css']
})
export class PlayerComponent {
    constructor(private webService: WebService,
        private route: ActivatedRoute) { }
    

    player: any;
    playerStats: any;


    async ngOnInit() {
        var response = await this.webService.getPlayer(this.route.snapshot.params['id'])
        this.player = response
        this.playerStats = ['Name', 'Club', 'Jersey_Number', 'Position', 'Nationality', 'Age', 'Appearances', 'Wins', 'Losses', 'Goals', 'Goals_per_match', 'Headed_goals', 'Goals_with_right_foot', 'Goals_with_left_foot', 'Penalties_scored', 'Freekicks_scored', 'Shots', 'Shots_on_target', 'Shooting_accuracy_%', 'Hit_woodwork', 'Big_chances_missed', 'Clean_sheets', 'Goals_conceded', 'Tackles', 'Tackle_success_%', 'Last_man_tackles', 'Blocked_shots', 'Interceptions', 'Clearances', 'Headed_Clearance', 'Clearances_off_line', 'Recoveries', 'Duels_won', 'Duels_lost', 'Aerial_battles_won', 'Aerial_battles_lost', 'Own_goals', 'Errors_leading_to_goal', 'Assists', 'Passes', 'Passes_per_match', 'Big_chances_created', 'Crosses', 'Cross_accuracy_%', 'Through_balls', 'Accurate_long_balls', 'Saves', 'Penalties_saved', 'Punches', 'High_Claims', 'Catches', 'Sweeper_clearances', 'Throw_outs', 'Goal_Kicks', 'Yellow_cards', 'Red_cards', 'Fouls', 'Offsides']

    }

    addPlayerToTeam(value: string) {
        
    }


}

