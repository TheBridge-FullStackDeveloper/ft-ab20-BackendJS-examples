const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');

const MongoClient = require('mongodb').MongoClient;
const databaseUrl = "mongodb://localhost:27017/";

const server = express();
const listenPort = 8889;

// -------------- INITIALIZATION -------------- 

// Set public root directory
server.use(express.static('public'));

// Parsing body POST, PUT & DELETE requests
server.use(bodyParser.urlencoded({ extended: false }));
server.use(bodyParser.json());

// -------------- MOCK DATA -------------- 

const fighters = [ "Ryu", "Ken", "Chun Li", "Cammy" ];

const questions = [
    {
        text: "¿Cuánto es 1 + 1?",
        answers: [
            {
                text: "2",
                correct: true
            },
            {
                text: "999",
                correct: false
            }
        ]
    }
];

// -------------- API REST -------------- 

server.get('/loadImage', (req, res) => {

    // JSON response
    res.send( { src: 'img/atlasV.jpg' } );
});

server.get('/sayhelloto/:name', (req, res) => {

    async function userExists(username) {
        let client, dbFighters;

        try {
            // Connect to MongoDB server and use my database
            client = await MongoClient.connect(databaseUrl);
            dbFighters = client.db("StreetFighterDB");

            // Select collection and do CRUD operations
            let fighters = dbFighters.collection('fighters');
            let result = await fighters.find({ nombre: username.replace("+", " ") });

            // Business logic
            if( result.toArray().length > 0 ) {
                return true;
            }
            else {
                return false;
            }
        }
        catch(error) {
            console.error(error);
        }
        finally {
            client.close();
        }
    }

    // Business logic
    if( userExists(req.params.name) ) {
        res.send(`Hello ${ req.params.name }`);
    }
    else {
        res.send(`Who are you?`);
    }
});

server.get('/question', (req, res) => {

    // Static files
    res.sendFile(path.join(__dirname + '/public/question.html'));
});

server.get('/question/:id', (req, res) => {

    // Send question data
    res.send( questions[req.params.id] );
});

server.post('/question/:id', (req, res) => {

    // If answer is right...
    const rightAnswers = questions[req.params.id].answers.filter(a => a.correct === true);
    
    if( rightAnswers[0].text == req.body.answer ) {
        res.send( { result: 'Right!' } );
    }
    else {
        res.send( { result: 'Wrong!' } );
    }
});

server.get('/win', (req, res) => res.send( "You won!" ));

// -------------- START SERVER --------------

server.listen(listenPort, () => console.log(`Server started listening on ${listenPort}`));