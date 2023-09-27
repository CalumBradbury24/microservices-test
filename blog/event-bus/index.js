const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
const cors = require('cors')

const app = express();
app.use(bodyParser.json()); // same as app.use(express.json());
app.use(cors());

const events = [];

app.post('/events', (req, res) => {
    const event = req.body;

    events.push(event);

    const requestOptions = { 
        method: 'POST', 
        body: JSON.stringify(event),
        headers: {
            "Content-Type": "application/json"
        }
    }
    fetch('http://localhost:4000/events', requestOptions); //posts service
    fetch('http://localhost:4001/events', requestOptions); //comments service
    fetch('http://localhost:4002/events', requestOptions); //query service
    fetch('http://localhost:4003/events', requestOptions); //moderation service

    res.send({ status: 'OK'});
});

app.get('/events', (req, res) => {
    res.send(events);
});

app.listen(4005, () => console.log('Listening on port 4005'));