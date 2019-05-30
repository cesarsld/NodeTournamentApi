import * as rp from 'request-promise';

export default class ChallongeModule{
    public static async CreateTournament(creator:string, tournamentId:string){
        var data = new ChallongeJson(creator, tournamentId);
        var url = data.GetPostUrl();
        var req = await rp.post(url);
        var json = JSON.parse(req);
        return json.tournament.id;
    }

    public static async AddPlayer(challongeId:number, playerAddress:string, playerName:string){
        var url = this.GetPlayerBaseUrl(challongeId);
        url += "&participant[name]=" + playerName;
        url += "&participant[misc]=" + playerAddress;
        url = url.replace(' ' , '%20');
        var req = await rp.post(url);
        var json = JSON.parse(req);
        return json.participant.id;
    }

    public static async UpdateMatch(challongeId:number, matchId:number, score:string, winnerId:number){
        var url = this.GetTournamentBaseUrl(challongeId);
        url += "/matches/" + matchId + ".json" + "?api_key=" + process.env.CHALLONGE_API_KEY;
        url += "&match[scores_csv]=" + score + "&match[winner_id]=" + winnerId;
        var req = await rp.put(url);
    }

    private static GetTournamentBaseUrl(challongeId:number){
        var url = "https://api.challonge.com/v1/tournaments.json";
        url += "?api_key=" + process.env.CHALLONGE_API_KEY;
        return url;
    }
    private static GetPlayerBaseUrl(challongeId:number) {
        var baseurl = "https://api.challonge.com/v1/tournaments/" + challongeId+ "/participants.json";
        baseurl+= "?api_key=" + process.env.CHALLONGE_API_KEY;
        return baseurl;
    }
}

class ChallongeJson{
    name:string;
    url:string;
    tournament_type: string;
    description:string;
    open_signup:boolean;
    hold_third_place_match:boolean;

    constructor(creator:string, urlId:string){
        this.name = creator + "'s single elimination Axie tournament";
        this.tournament_type = 'Single elimination';
        this.description = 'Fight to prove you are the best Axie trainer!';
        this.open_signup = false;
        this.hold_third_place_match = false;
        this.url = urlId;
    }
    GetPostUrl(){
        var url = "https://api.challonge.com/v1/tournaments.json";
        url += "?api_key=" + process.env.CHALLONGE_API_KEY;
        var k = Object.keys(this);
        k.forEach(key => {
            url += "&tournament[" + key + "]=" + this[key];
        });
        url = url.replace(' ', '%20');
        return url;
    }
}