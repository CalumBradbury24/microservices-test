const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();
app.use(bodyParser.json()); // same as app.use(express.json());
app.use(cors());

const posts = {};

const handleEvent = (type, data) => {
    if(type === 'PostCreated'){
        const { id, title } = data;
        posts[id] = { id, title, comments: [] };
    }

    else if(type === 'CommentCreated'){
        const { id, content, postID, status } = data;

        const post = posts[postID];
        if(post) post.comments.push({ id, content, status });
    }

    else if(type === 'CommentUpdated'){
        const { id, content, postID, status } = data;

        const post = posts[postID];
        if(post){
            const comment = post.comments.find(c => c.id === id);
            comment.status = status;
            comment.content = content;
        }
    }
}

app.get('/posts', (req, res) => {
    console.log('got posts -> ', posts);
    res.send(posts);
});

app.post('/events', (req, res) => {
    const { type, id, content, postID, status, title = '' } = req.body;

    handleEvent(type, {id, content, postID, status, title})
    res.send({});
});

app.listen(4002, async () => {
    console.log('Posts service listening on 4002');

    //get events that have been emitted before this server spun up
    const requestOptions = { 
        method: 'GET', 
        headers: {
            "Content-Type": "application/json"
        }
    }

    let res = await fetch('http://localhost:4005/events', requestOptions); //posts service
    res = await res.json();
    res = res || [];

    for(let event of res){
        console.log('processing event', event.type);
        handleEvent(event.type, event);
    }
});