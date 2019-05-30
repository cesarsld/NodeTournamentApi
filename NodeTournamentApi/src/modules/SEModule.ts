import { client } from '../mongo/mongo';
import { UserModule } from '../modules/UserModule';
import SingleEliminationTournament from '../models/SingleElimination/SingleEliminationTournament';
import { TournamentState } from '../models/SingleElimination/TournamentStateEnum';
import TourneyCreationData from '../models/SingleElimination/TourneyCreationData';
import ValidateSig from './Cryptography'
import ChallongeModule from './ChallongeModule';
import CompletedTournaments from '..//models/SingleElimination/CompletedTournaments';
import ResolveData from '../models/SingleElimination/ResolveData';
export default class SEModule{

    public static async JoinTourney(id:string, userAddress:string) {
        var tourney = await this.GetTourney(id);
        var user = await UserModule.GetUser(userAddress);
        if(tourney){
            if(user){
                var didJoin = await tourney.AddPlayer(user);
                if(didJoin)
                    return true;
                
                else
                    return false;
            }
            else return false;
        }
        else return false;
    } 

    public static async GetTourney(id:string){
        const db = client.db('TournamentData');
        const tourneyCollec = db.collection<SingleEliminationTournament>('SingleEliminationTournaments');
        var tourney = await tourneyCollec.findOne({_id: id});
        return SingleEliminationTournament.CreateObjectFromJson (tourney);
    }

    public static async GetCompletedTourneys(offset:number){
        const db = client.db('TournamentData');
        const tourneyCollec = db.collection<SingleEliminationTournament>('SingleEliminationTournaments');
        var tourneys = await tourneyCollec.find({tourneyState : TournamentState.Over}).limit(10).skip(offset).toArray();
        return tourneys;
    }

    public static async CreateTourney(data:TourneyCreationData){
        if(ValidateSig(data.signature, data.creatorAddress)){
            var newTourney = new SingleEliminationTournament(data.timeBetweenRounds, 
                                                             data.creatorAddress, 
                                                             data.bestOfFormat,
                                                             data.maxPlayers,
                                                             data.creatorName);
            var challongeId = await ChallongeModule.CreateTournament(newTourney.creatorName, newTourney._id);
            newTourney.challongeId = challongeId;
            var user = await UserModule.GetUser(data.creatorAddress);
            user.ongoingCreatedTournaments.push(new CompletedTournaments(newTourney._id));
            await UserModule.UpdateUserInternal(user);
            await newTourney.SaveToDb();
            return newTourney._id; 
        }
    }

    public static async ResolveMatchup(tourneyId:string, data:ResolveData){
        var tourney = await this.GetTourney(tourneyId);
        return await tourney.ResolveMatchup(data.matchIndex, data.winner, data.scoreWinner, data.scoreLoser, data.matchupList);
    }

    public static async StartTourney(id:string){
        var tourney = await this.GetTourney(id);
        if(tourney){
            tourney.StartTourney();
            await tourney.SaveToDb()
            return true;
        }
        return false;
    }
}