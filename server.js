const fs = require('fs');
const path = require("path");
const express = require('express');
const { v4: uuidv4 } = require('uuid');


const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './public/index.html'))
});

app.get('/notes', (req, res) => {
    res.sendFile(path.join(__dirname, './public/notes.html'))
});

app.get("/api/notes", (req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        res.json(JSON.parse(data));
    });
});

app.post('/api/notes', (req, res) => {
    fs.readFile(path.join(__dirname, "/db/db.json"), "utf8", (err, data) => {
        if (err) throw err;
        const text_data = JSON.parse(data);
        const newText = [];
        
        text_data.push(req.body);

        for (let i = 0; i < text_data.length; i++) {
            const newPost = {
                title: text_data[i].title,
                text: text_data[i].text,
                id: i
            };

            newText.push(newPost);
        };

     
        fs.writeFile(path.join(__dirname, "/db/db.json"), JSON.stringify(newText, null, 2), (err) => {
            if (err) throw err;
            res.json(req.body);
        });
    })
});

app.listen(PORT, () => {
    console.log(`listening: ${PORT}`)
});