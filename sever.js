var express = require('express'),
	session = require('express-session'),
	passport = require('passport'),
	request = require('request'),
	GitHubStrategy = require('passport-github').Strategy,
	GitHubApi = require('github'),
	keys = require('./server/keys'),
	app = express();



app.use(express.static(__dirname + '/public'));

app.use(session({
	secret: 'Super secret, secret',
	resave: true,
	saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
	//go to mongo get_id for user, put that on session in real app
	done(null, user);
});

passport.deserializeUser(function (obj, done) {
	//get data off of sesion.
	done(null, obj);
	//put it on req.user in EVERY ENDPOINT
});


passport.use(new GitHubStrategy({
		clientID: keys.appId,
		clientSecret: keys.secret,
		callbackURL: "/auth/github/callback"
	}, function (accessToken, refreshToken, profile, cb) {
		return cb(null, profile)
	}
));

app.get('/auth/github', passport.authenticate('github'));

app.get('/auth/github/callback', passport.authenticate('github', {
		failureRedirect: '/#/login'
	}),
	function (req, res) {
		res.redirect('/#/home')	
	});


var requireAuth = function(req, res, next) {
	if (!req.isAuthenticated()) {
		return res.status(403).end();
	}
	return next();
}


var github = new GitHubApi({
	// required
	version: "3.0.0",
	// optional
	debug: true,
	protocol: "https",
	host: "api.github.com", // should be api.github.com for GitHub
	timeout: 5000,
	headers: {
		"user-agent": "My-Cool-GitHub-App" // GitHub is happy with a unique user agent
	}
});


app.get('/api/github/following', requireAuth, function(req, res) {
	console.log(req.user.username)
	github.user.getFollowingFromUser({
		user: req.user.username
	}, function(err, response) {
		if(err) {
			console.log(err);
			res.status(500).send(err);
		} else {
			res.status(200).json(response)
		}
	})
	
});

app.get('/api/github/:username/activity', requireAuth, function(req, res, next) {
	var user = req.params.username;
	
	var options = {
		url: 'https://api.github.com/users/' + user + '/events',
		headers: {
			"user-agent": "My-Cool-GitHub-App"
		}
	};
	
	request(options, function(err, response) {
		if(err) {
			res.status(500).send(err);
		} else {
			res.status(200).json(response);
			console.log(response)
		}
	})
	
})

//SET UP PORT//
var port = process.env.PORT || 3000;

app.listen(port, function () {
	console.log('Listening on port ' + port);
})