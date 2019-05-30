import { client } from '../mongo/mongo';
import BaseUserData from '../models/user/BaseUserData';
import {UserData} from '../models/user/UserData';
import ValidateSig from './Cryptography'
export default class UserModule {
    public static async CreateUser(data: BaseUserData) {
        if(ValidateSig(data.signature, data.id)){
            const db = client.db('TournamentData');
            const userCollec = db.collection<UserData>('Users');
            var user = await userCollec.findOne({_id : data.id.toLowerCase()});
            if (!user){
                var newUser = new UserData(data);
                await userCollec.insertOne(newUser);
                console.log('User created');
                return true;
            }
            return false;
        }
        return false;
    }
    public static async UpdateUser(data: BaseUserData){
        if(ValidateSig(data.signature, data.id)){
            const db = client.db('TournamentData');
            const userCollec = db.collection<UserData>('Users');
            var user = await userCollec.findOne({_id : data.id.toLowerCase()});
            if(user){
                user.userName =  data.nickName;
                user.discordId = data.discordId;
                await userCollec.replaceOne({_id : data.id.toLowerCase()}, user);
                return true;
            }
            return false;
        }
        return false;
    }
    public static async UpdateUserInternal(data: UserData){
        const db = client.db('TournamentData');
        const userCollec = db.collection<UserData>('Users');
        var user = await userCollec.findOne({_id : data._id.toLowerCase()});
        if(user){
            await userCollec.replaceOne({_id : data._id.toLowerCase()}, user);
        }
    }
    public static async GetUser(id:string){
        const db = client.db('TournamentData');
        const userCollec = db.collection<UserData>('Users');
        return await userCollec.findOne({_id : id.toLowerCase()});
    }
    public static async DeleteUser(data: BaseUserData){
        if(ValidateSig(data.signature, data.id)){
            const db = client.db('TournamentData');
            const userCollec = db.collection<UserData>('Users');
            var user = await this.GetUser(data.id);
            if(user){
                await userCollec.deleteOne({_id : data.id.toLowerCase()});
                return true;
            }
            return false;
        }
        return false;
    }
}