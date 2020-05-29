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

    MongoClient.connect(databaseUrl, (err, database) => {
        if (err) {
            throw err;
        }

        const dbFighters = database.db("sfdb");

        dbFighters.fighters.find({nombre:req.params.name.replace("+", " ")}, (err, result) => {
            if (err) {
                throw err;
            }

            // Business logic
            if( result.length > 0 ) {
                res.send(`Hello ${ req.params.name }`);
            }
            else {
                res.send(`Who are you?`);
            }

            dbFighters.close();
        });
    }); 
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