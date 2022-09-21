const express = require('express');
const bodyParser = require("body-parser");
const dirTree = require('directory-tree');
const fs = require('fs');
const path = require('path')
const cors = require('cors');

const app = express();

const AUDIO_PATH = path.join(__dirname, "audio");

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use("/statics/audio", express.static(AUDIO_PATH));
app.use(bodyParser.json());

app.get("/api/audioLits", (req, res) => {
    const audioList = dirTree(AUDIO_PATH)
    res.status(200).json({AudioList: audioList["children"]});
});

const PORT = 3000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}`));