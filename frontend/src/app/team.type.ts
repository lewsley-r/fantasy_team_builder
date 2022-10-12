import {Player} from "./player.type";


export class Team{
    _id!: string;
    Owner_id!: string;
    Team_Name!: string;
    Goalkeeper: Player = new Player;
    Defenders: [Player, Player, Player, Player] = [new Player, new Player, new Player, new Player];
    Midfielders: [Player, Player, Player, Player] = [new Player, new Player, new Player, new Player];
    Forwards: [Player, Player] = [new Player, new Player];
}