const Joi = require('joi');

const express = require('express');
const app = express();

app.use(express.json());

const users = [
    { id: 1, email: 'bayuinyoman@gmail.com', password: 'nyomannyoman' },
    { id: 2, email: 'inyomanbayu1@gmail.com', password: 'bayubayu' }
];

app.use((req, res, next) => {
    res.set({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'GET, POST, PUT, DELETE',
        'Access-Control-Allow-Headers' : '*'
    });
    next();
})

app.get('/', (req, res) => {
    res.send('Welcome!');
})

app.get("/api/users", (req, res) => {
    return res.json(courses);
});

app.get('/api/users/:id', (req, res) => {
    const course = courses.find( c => c.id === parseInt(req.params.id) );
    if (!course) return res.status(404).send('ID not found.');
    return res.json(course);
})

app.post('/api/users', (req, res) => {
    //const {error} = validateCourse(req.body);
    const user = users.find(u => u.email === req.params.email);
    if (user) {
        //console.log(res.status(400));
        return res.status(400).send("This email already exist.");
    }

    const userInput = {
        id: users.length + 1,
        email: req.body.email,
        password: req.body.password
    };
    users.push(userInput);
    return res.json(userInput);
});

app.put('/api/users/:id', (req, res) => {
    const {error} = validateCourse(req.body);
    if (error) {
        return res.status(400).send(error.details[0].message);
    }
    const course = courses.find( c => c.id === parseInt(req.params.id) );
    if (!course) return res.status(404).send('ID not found.');

    course.name = req.body.name;
    return res.json(course);
});

app.delete('/api/users/:id', (req, res) => {
    const course = courses.find( c => c.id === parseInt(req.params.id) );
    if (!course) return res.status(404).send('ID not found.');

    const index = courses.indexOf(course);
    courses.splice(index, 1);
    return res.json(course);
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`Listening on port ${port}`);
})

function validateCourse(course) {
    const schema = Joi.object({
        name: Joi.string().min(3).required()
    });

    return schema.validate(course);
}