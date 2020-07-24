const Joi = require('joi');
const express = require('express');
const app = express();

app.use(express.json());
app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methosds': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
});

const users = [
    { id: 1, name: 'bayu', email: 'bayuinyoman@gmail.com', password: 'bayu1234' }
];

const films = [
    { id: 1, name: 'I Dream In Another Language'},
    { id: 2, name: 'Benched'},
    { id: 3, name: 'Whitney'},
    { id: 4, name: 'Blindspotting'}
];

app.get("/api/films", (req, res) => {
    var datetime = new Date();
    console.log("\n"+datetime);
    return res.json(films);
});

app.get('/api/films/:id', (req, res) => {
    const film = films.find( f => f.id === parseInt(req.params.id) );
    if (!film) return res.status(404).send('ID not found.');
    return res.json(film);
})

app.post('/api/films', (req, res) => {
    const {error} = validateFilm(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }

    const film = {
        id: films.length + 1,
        name: req.body.name
    };
    films.push(film);
    console.log('Insert Success');
    return res.json(film);
});

app.put('/api/films/:id', (req, res) => {
    const {error} = validateFilm(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const film = films.find( f => f.id === parseInt(req.params.id) );
    if (!film) return res.status(404).send('ID not found.');

    film.name = req.body.name;
    console.log('Update Success');
    return res.json(film);
});

app.delete('/api/films/:id', (req, res) => {
    const film = films.find( f => f.id === parseInt(req.params.id) );
    if (!film) return res.status(404).send('ID not found.');

    const index = films.indexOf(film);
    films.splice(index, 1);
    console.log('Delete Success');
    return res.json(film);
});

app.get('/api/users', (req, res) => {

    var datetime = new Date();
    console.log("\n"+datetime);
    console.log('User data has been retrieved.');
    return res.json(users);

});

app.post('/api/users', (req, res) => {

    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new POST HTTP request.");
    console.log(req.body);

    const {error} = verifyUser(req.body);
    if (error) {
        console.log('Validation error');

        var jsonRespond = {
            result: "",
            message: error.details[0].message
        }

        return res.status(400).json(jsonRespond);
    }
    console.log('Validation success.');

    console.log('Check existing email: '+req.body.email+ '.');
    const check_user = users.find( u => u.email === req.body.email );
    if (check_user) {
        console.log('Email: '+req.body.email+' is already registered.');

        var jsonRespond = {
            result: "",
            message: "Registration failed. Email "+req.body.email+" is already registered. Please use other email."
        }

        return res.status(404).json(jsonRespond);
    }

    console.log('Email ' + req.body.email + ' has been registered.\n');
    const user = {
        id: users.length + 1,
        name: req.body.name,
        email: req.body.email,
        password: req.body.password
    };

    users.push(user);

    var jsonRespond = {
        result: user,
        message: "Successfully Registered!"
    }
    return res.status(200).json(jsonRespond);

    //return res.json(user);
});

//SIGN IN CODE
app.get('/api/users/:email/:password', (req, res) => {

    // LOG TIME
    var datetime = new Date();
    console.log("\n"+datetime);
    console.log("Incoming new GET HTTP request for LOGIN.");
    console.log(req.params);

    // VALIDATE
    const {error} = verifyUser(req.params);
    if (error) {
        console.log('Validation error.');

        var jsonRespond = {
            result: "",
            message: error.details[0].message
        }

        return res.status(400).json(jsonRespond);
    }
    console.log('Validation success and accepted.');

    // CHECK IF THE EMAIL AND PASSWORD CORRECT
    console.log('Check existing email: '+req.params.email+' and password: '+req.params.password+ '.');
    const check_user = users.find( u => u.email === req.params.email && u.password === req.params.password );
    if (!check_user) {
        var error_message = 'Invalid login detail. Email or password is not correct.';
        console.log(error_message);

        var jsonRespond = {
            result: "",
            message: error_message
        }

        return res.status(404).json(jsonRespond);
    }

    console.log('Email ' + req.params.email + ' sucessfully login.\n');
    var jsonRespond = {
        result: users,
        message: "Successfully Login!"
    }

    return res.status(200).json(jsonRespond);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

function verifyUser(user) {
    const schema = Joi.object({
        name: Joi.string().min(3),
        email: Joi.string().email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
        password: Joi.string().min(8).max(16).pattern(new RegExp('^[a-zA-Z0-9]{3,30}$'))
    });
    return schema.validate(user);
}
