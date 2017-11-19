var bodyParser = require('body-parser');
var exec = require('child_process').execSync
var express = require('express');
var fs = require('fs');
var path = require('path');

var app = express();

app.use(bodyParser.urlencoded({ extended: false }));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');
app.use(express.static(path.join(__dirname, 'static')));

app.get('/', function(req, res) {
	res.render('index');
});

app.post('/create', function(req, res) {
	var values = req.body['values[]'];
	var repoName = req.body['name'];

	var outputDir = path.join(__dirname, 'output', repoName);
	if (fs.existsSync(outputDir)) {
		console.log('Output directory already exists');
		res.sendStatus(400);
		return;
	}
	fs.mkdirSync(outputDir);

	// start with today's date...
	var commitDate = new Date();
	commitDate.setHours(12);
	commitDate.setMinutes(0);
	commitDate.setSeconds(0);
	commitDate.setMilliseconds(0);
	
	// ...set to latest Sunday...
	commitDate.setDate(commitDate.getDate() - commitDate.getDay());

	// ...then go back 52 weeks
	commitDate.setDate(commitDate.getDate() - (52 * 7));
	
	// set up repo
	exec('cd "' + outputDir + '" && git init && touch file && git add .');
	
	// make commits
	var x = 0;
	for (var i = 0; i < (52 * 7); ++i) {
		for (var j = 0; j < values[i]; ++j) {
			exec('cd "' + outputDir + '" && echo ' + x + ' > file && git commit -am "Painter" --date=' + commitDate.toISOString());
			++x;
		}
		commitDate.setDate(commitDate.getDate() + 1);
	}

	res.sendStatus(200);
});

app.listen(3006, function() {
	console.log('Listening on http://localhost:3006');
});
