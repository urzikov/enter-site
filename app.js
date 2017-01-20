var express = require("express"),
	feedback = require("./js/feedback"),
	bodyParser = require('body-parser'),
    app = express(),
    vidStreamer = require("vid-streamer"),
    port = process.env.PORT || 3000,
    settings = {
        "forceDownload": false,
        "rootPath": "videos/",
        "server": 'app.js'
    };

app.use(bodyParser.urlencoded({extended : true}));
app.use(express.static(__dirname));

app.post('/feedback', feedback.sendForm);
app.get("/videos/", vidStreamer.settings(settings));
app.listen(port, 'localhost');
console.log("app.js up and running on port " + port);