export default class CompletedTournament {
    id: string;
    ranking: number;
    constructor(_id: string) {
        this.id = _id;
        this.ranking = 0;
    }
}