import app from "./app";
const PORT = 1337;
import {UserModule} from './modules/UserModule';
import BaseUserData from './models/user/BaseUserData';
import {client} from './mongo/mongo';
import * as rp from 'request-promise';
require ('./mongo/mongo');
require('./controllers/TourneyController');
//(async () => {
//})();

app.listen(PORT, () => {
    console.log('Express server listening on port ' + PORT);
})