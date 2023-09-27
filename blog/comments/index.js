const express = require('express');
const bodyParser = require('body-parser')
const { randomBytes } = require('crypto');
const cors = require('cors');

const app = express();
app.use(bodyParser.json()); // same as app.use(express.json());
app.use(cors());

const commentsByPostID = {};

app.get('/posts/:id/comments', (req, res, next) => {
    res.send(commentsByPostID[req.params.id] || []);
});

app.post('/posts/:id/comments', async (req, res, next) => {
    const commentID = randomBytes(4).toString('hex');
    const { content } = req.body;

    const comments = commentsByPostID[req.params.id] || [];

    comments.push({id: commentID, content, status: 'pending'});
    commentsByPostID[req.params.id] = comments;

    const data = {
        type: 'CommentCreated',
        postID: req.params.id,
        id: commentID,
        content,
        status: 'pending'
    }

    const requestOptions = { 
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            "Content-Type": "application/json"
        }
    }

    await fetch('http://localhost:4005/events', requestOptions)
        .then(response => response.json())
        .then((data) => console.log(data)); //post event to event bus

    res.status(201).send(comments);
});

app.post('/events', async (req, res) => {
    const { type } = req.body;

    if(type === 'CommentModerated'){
        const { id, content, postID, status } = req.body;

        const comments = commentsByPostID[postID];

        const comment = comments.find(c => c.id === id);
        comment.status = status;
        const data = {
            type: 'CommentUpdated',
            postID,
            id,
            content,
            status
        }
    
        const requestOptions = { 
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                "Content-Type": "application/json"
            }
        }
    
        await fetch('http://localhost:4005/events', requestOptions)
            .then(response => response.json())
            .then((data) => console.log(data)) //post event to event bus
            .catch(err => console.log(err));
    }
    res.send({});
});


app.listen(4001, () => {
    console.log('Comments service listening on 4001');
})