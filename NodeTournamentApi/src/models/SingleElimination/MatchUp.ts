import ChallengeData from "./ChallengeData";

export default class MatchUp{
    matchId:number;

    player1:string;
    player1Score:number;
    player2:string;
    player2Score:number;

    winner:string;
    loser:string;
    round:number;

    preqequisiteMatchPlayer1:MatchUp;
    preqequisiteMatchPlayer2:MatchUp;

    matchList:ChallengeData[]

    constructor(a:string, b:string){
        this.player1 = a;
        this.player2 = b;
        this.winner = "";
        this.loser = "";
        this.player1Score = 0;
        this.player2Score = 0;
        this.matchList = [];
    }


}