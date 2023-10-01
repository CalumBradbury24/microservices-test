const express = require('express');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json()); // same as app.use(express.json());
app.use(cors());

const posts = {};

app.get('/posts', (req, res, next) => {
    res.send(posts);
});

app.post('/posts', async (req, res, next) => {
    const id = randomBytes(4).toString('hex');
    const { title } = req.body;

    posts[id] = {
        id,
        title
    };

    const data = {
        type: 'PostCreated',
        id, 
        title
    }

    const resp = await fetch('http://event-bus-srv:4005/events', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    });

    if(resp.ok) res.status(201).send(posts[id]);
});

app.post('/events', (req, res) => {
    res.send({});
});

app.listen(4000, () => {
    console.log('v55');
    console.log('Posts service listening on 4000');
})