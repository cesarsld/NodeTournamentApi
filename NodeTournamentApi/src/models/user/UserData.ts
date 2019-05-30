import CompletedTournament from "../SingleElimination/CompletedTournaments";
import BaseUserData from "./BaseUserData";
import * as mongoose from 'mongoose';
import * as mongodb from 'mongodb';
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

    ReturnSchema() { }
}

var completedTournamentSchema: mongoose.Schema = new mongoose.Schema({
    id: String,
    rnaking: Number
});

var UserDataSchema: mongoose.Schema = new mongoose.Schema({
    id: { type: String, unique: true, required : true },
    discordId: Number,
    userName: String,
    ongoingTournaments: {
        type: [completedTournamentSchema]
    },
    completedTournaments: {
        type: [completedTournamentSchema]
    },
    ongoingCreatedTournaments: {
        type: [completedTournamentSchema]
    },
    completedCreatedTournaments: {
        type: [completedTournamentSchema]
    },
});

var User = mongoose.model("UserTest", UserDataSchema);
 
export  {UserData};