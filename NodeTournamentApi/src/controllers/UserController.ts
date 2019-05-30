import app from "../app";
import UserModule from '../modules/UserModule';

// GET api/User/0xsomething
app.get('/api/user/:id', async (req, res)=>{
    var user = await UserModule.GetUser(req.params.id);
    if(user)
        res.status(200).send(user);
    else
        res.status(400).send('Not found.');
});

// POST api/User/register
app.post('/api/user/register', async (req, res)=>{
    if(await UserModule.CreateUser(req.body))
        res.status(200).send('User registered');
    else
        res.status(403).send('Missing or wrong user signature.');
});

// PUT api/User/update
app.put('/api/user/update', async (req, res)=>{
    if(await UserModule.UpdateUser(req.body))
        res.status(200).send('User updated');
    else
        res.status(403).send('Missing or wrong user signature.');
});

// DELETE api/User/0xsomething
app.delete('/api/user/:id', async (req, res)=>{
    if(await UserModule.DeleteUser(req.params.id))
        res.status(200).send('User deleted');
    else
        res.status(400).send('Missing or wrong user signature.');
});