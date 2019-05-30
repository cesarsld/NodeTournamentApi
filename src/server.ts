import * as dotenv from "dotenv";
import app from "./app";
dotenv.config();
var port = process.env.PORT || 1337;
require ('./mongo/mongo');
require('./controllers/TourneyController');
require('./controllers/UserController');
console.log('test')
app.listen(port, () => {
    console.log('Express server listening on port ' + port);
})