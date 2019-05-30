import {UserData} from '../user/UserData';

export default class ParticipantData{
    ethAddress:string;
    discordId:number;
    stillCompeting:boolean;
    challongeId:number;

    constructor(user:UserData){
        this.ethAddress = user._id;
        this.discordId = user.discordId;
        this.stillCompeting = true;
        this.challongeId = 0;
    }

    public IsDiscordIdValid(){
         return this.discordId !== 0;
    }
}