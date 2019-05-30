import app from "../app";
import SEModule from '../modules/SEModule';
import ValidateSig from '../modules/Cryptography'

// GET api/Tourney/completed?offset=5
app.get('/api/tourney/completed', async (req, res)=>{
    console.log('queried2');
    var offset = req.query.offset? req.query.offset : 0;
    var tourneys = await SEModule.GetCompletedTourneys(offset);
    if(tourneys)
        res.status(200).send(tourneys);
    else
        res.status(400).send('Not found.');
});

// GET api/Tourney/ID
app.get('/api/tourney/:id', async (req, res)=>{
    console.log('queried!');
    var tourney = await SEModule.GetTourney(req.params.id);
    if(tourney)
        res.status(200).send(tourney);
    else
        res.status(400).send('Not found.');
    
});

// PUT api/Tourney/ID/join
app.put('/api/tourney/:id/join', async (req, res)=>{
    if(await SEModule.JoinTourney(req.params.id, req.body.address))
        res.status(200).send('User Joined');
    else
        res.status(403).send('User could not join because Tournament has reach max capacity or user has already joined.');
    
});

// PUT api/Tourney/ID/start
app.put('/api/tourney/:id/start', async (req, res)=>{
    if(ValidateSig(req.body.signature, req.body.creatorAddress)){
        if(await SEModule.StartTourney(req.params.id))
            res.status(200).send('Tournament Started');
        else
            res.status(404).send('Tournament not found.');
    }
    else
        res.status(403).send('Missing or wrong user signature.');
    
});

// PUT api/Tourney/ID/resolve
app.put('/api/tourney/:id/resolve', async (req, res)=>{
    if(ValidateSig(req.body.signature, req.body.resolverAddress)){
        if(await SEModule.ResolveMatchup(req.params.id, req.body))
            res.status(200).send('MatchUp Resolved');
        else
            res.status(400).send('MatchUp could not be resolved');
    }
    else
        res.status(403).send('Missing or wrong user signature.');
    
});

// POST api/Tourney
app.post('/api/tourney', async (req, res)=>{
    if(ValidateSig(req.body.signature, req.body.creatorAddress)){
        var newTourney = await SEModule.CreateTourney(req.body);
        res.status(200).send(newTourney);
    }
    else
        res.status(403).send('Missing or wrong user signature.');
    
});