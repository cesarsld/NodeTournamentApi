import CompletedTournament from "../SingleElimination/CompletedTournaments";
import BaseUserData from "./BaseUserData";
class UserData {
    _id: string;
    discordId: number;
    userName: string;
    ongoingTournaments: CompletedTournament[];
    completedTournaments: CompletedTournament[];

    ongoingCreatedTournaments: CompletedTournament[];
    completedCreatedTournaments: CompletedTournament[];
    constructor(data: BaseUserData) {
        this._id = data.id;
        this.discordId = data.discordId;
        this.userName = data.nickName;

        this.ongoingTournaments = new Array();
        this.completedTournaments = new Array();

        this.ongoingCreatedTournaments = new Array();
        this.completedCreatedTournaments = new Array();
    }

    public static CreateObjectFromJson(data:UserData){
        var user = new UserData(new BaseUserData());
        var keys = Object.keys(user);
        keys.forEach(key => {
            user[key] = data[key];
        });
        return user;
    }
}
 
export  {UserData};