//listens to events
const express = require('express');
const bodyParser = require('body-parser');

const app = express();
app.use(bodyParser.json());

app.post('/events', async (req, res) => {
    const { type } = req.body;

    if(type === 'CommentCreated'){
        const { id, content, postID } = req.body;
        const status = content.includes('orange') ? 'rejected' : 'approved';

        const data = {
            type: 'CommentModerated',
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
            .then((data) => console.log(data)); //post event to event bus
    }

    res.send({});
});

app.listen(4003, () => console.log('listening on 4003'));