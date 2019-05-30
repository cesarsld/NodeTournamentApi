import {TournamentState} from './TournamentStateEnum';
import ParticipantData from './ParticipantData';
import MatchUp from './MatchUp';
import {client} from '../../mongo/mongo'
import ChallengeData from './ChallengeData';
import { UserData } from '../user/UserData';
import ChallongeModule from '../../modules/ChallongeModule';
import CompletedTournament from './CompletedTournaments';
import { UserModule } from '../../modules/UserModule';
export default class SingleEliminationTournament{
    _id: string;
    challongeId:number;
    creatorAddress:string;
    creatorName:string;
    tourneyState:TournamentState;
    maxPlayers:number;
    secondsBetweenRounds:number;
    totalRoundNumber:number;
    boFormat:number;
    currentRoundTime:number;
    currentRound:number;
    participantList:ParticipantData[];
    matchUpList:MatchUp[]
    winner:string;
    indexOfUnresolvedMatches:number[]


    constructor(seconds:number, creator:string, bo:number, max:number, name:string){
        this._id = '';
        for (var i = 0; i<15 ; i++){
            this._id += Math.floor(Math.random() * 16).toString(16);
        }
        this._id = this._id.toLowerCase();
        this.challongeId = 0;
        this.creatorAddress = creator;
        this.creatorName = name;
        this.tourneyState = TournamentState.Accepting_Players;

        this.secondsBetweenRounds = seconds;
        this.boFormat = bo;
        this.maxPlayers = max;
        this.totalRoundNumber = 0;
        this.currentRoundTime = 0;
        this.currentRound = 1;
        this.matchUpList = [];
        this.participantList = [];
        this.indexOfUnresolvedMatches = [];
        this.winner = '';
    }


    public async AddPlayer(user:UserData){
        if(this.participantList.filter(part => part.ethAddress === user._id).length === 1)
            return false;
        if(this.maxPlayers === -1 || this.participantList.length <this.maxPlayers){
            var participant = new ParticipantData(user);
            participant.challongeId = await ChallongeModule.AddPlayer(this.challongeId, user._id, user.userName);
            user.ongoingTournaments.push(new CompletedTournament(this._id));
            await UserModule.UpdateUserInternal(user);
            if(this.participantList.length === this.maxPlayers)
                this.StartTourney()
            await this.SaveToDb();
            return true;
        }
        return false;
    }

    public async ResolveMatchup (matchIndex:number, _winner:string, scoreWinner:number, scoreLoser:number, matchList:number[]){
        var matchup = this.matchUpList[matchIndex];
        matchup.winner = _winner;
        if (matchup.player1 == matchup.winner)
        {
            matchup.player1Score = scoreWinner;
            matchup.player2Score = scoreLoser;
            matchup.loser = matchup.player2;
        }
        else if (matchup.player2 == matchup.winner)
        {
            matchup.player1Score = scoreLoser;
            matchup.player2Score = scoreWinner;
            matchup.loser = matchup.player1;
        }
        else
            return false;
        if(!matchList)
            matchup.matchList = await this.GetMatchesFromIndexes(matchList);
        var index = this.indexOfUnresolvedMatches.indexOf(matchIndex);
        this.indexOfUnresolvedMatches.splice(index, 1);
        if(this.indexOfUnresolvedMatches.length === 0)
            this.tourneyState = TournamentState.Running;
        await this.SaveToDb();
        return true;
    }

    public async UpdateMatchup (matchIndex:number, _winner:string, scoreWinner:number, scoreLoser:number, matchList:number[]){
        var matchup = this.matchUpList[matchIndex];
        var winner = matchup.winner;
        var loser = matchup.loser;
        matchup.winner = loser;
        matchup.loser = winner;
        if (matchup.player1 == matchup.winner){
            matchup.player1Score = scoreWinner;
            matchup.player2Score = scoreLoser;
            matchup.loser = matchup.player2;
        }
        else if (matchup.player2 == matchup.winner){
            matchup.player1Score = scoreLoser;
            matchup.player2Score = scoreWinner;
            matchup.loser = matchup.player1;
        }
        else
            return false;
        if(!matchList)
            matchup.matchList = await this.GetMatchesFromIndexes(matchList);
        var index = this.indexOfUnresolvedMatches.indexOf(matchIndex);
        this.indexOfUnresolvedMatches.splice(index, 1);
        if(this.indexOfUnresolvedMatches.length === 0)
            this.tourneyState = TournamentState.Running;
        await this.SaveToDb();
        return true;
    }

    private async GetMatchesFromIndexes(range:number[]){
        const db = client.db('TournamentData');
        const collec = db.collection<ChallengeData>('ChallengeCollec');
        var list:ChallengeData[] = [];
        range.forEach(async ind =>{
            var result = await collec.findOne({_id: ind});
            list.push(result);
        });
        return list;
    }

    public StartTourney() {
        this.tourneyState = TournamentState.Ready_For_Seeding;
    }

    public async SaveToDb()
    {
        const db = client.db('TournamentData');
        const collec = db.collection<SingleEliminationTournament>('SingleEliminationTournaments');
        var doc = await collec.findOne({_id: this._id});
        if(doc)
            await collec.findOneAndReplace({_id : this._id}, this);
        else
            await collec.insertOne(this);
    }

    public static CreateObjectFromJson(data:SingleEliminationTournament){
        var newTourney = new SingleEliminationTournament(0, '', 0, 0, '');
        newTourney._id = data._id;
        newTourney.challongeId = data.challongeId;
        newTourney.creatorAddress = data.creatorAddress;
        newTourney.creatorName = data.creatorName;
        newTourney.tourneyState = data.tourneyState;
        newTourney.secondsBetweenRounds = data.secondsBetweenRounds;
        newTourney.boFormat = data.boFormat;
        newTourney.maxPlayers = data.maxPlayers;
        newTourney.totalRoundNumber = data.totalRoundNumber;
        newTourney.currentRoundTime = data.currentRoundTime;
        newTourney.currentRound = data.currentRound;
        newTourney.participantList = data.participantList;
        newTourney.matchUpList = data.matchUpList;
        newTourney.indexOfUnresolvedMatches = data.indexOfUnresolvedMatches;
        newTourney.winner = data.winner;
        return newTourney;
    }
}