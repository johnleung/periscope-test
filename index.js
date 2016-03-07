var express = require('express');
var app = express();
app.set('view engine', 'ejs');
app.set('port', (process.env.PORT || 5000));

app.get('/hello', function(req, res) {
	var Horseman = require('node-horseman');
	var horseman = new Horseman();

	var periscopeURL = req.query.periscopeURL;

	if (periscopeURL) {
		horseman
			.userAgent("Mozilla/5.0 (Windows NT 6.1; WOW64; rv:27.0) Gecko/20100101 Firefox/27.0")
			.open(periscopeURL)
			.attribute('#token-id', 'content')
			.then(function(tokenId) {
				horseman.close();

				var request = require('request');
				request('https://api.periscope.tv/api/v2/getAccessPublic?broadcast_id=' + tokenId, function(error, response, body) {
					if (!error && response.statusCode == 200) {
						console.log(body)

						var data = JSON.parse(body);
						res.render('pages/hello', {
							'isLive': !!data.hls_url,
							'streamURI': data.hls_url,
							'periscopeURL': periscopeURL
						});
					}
				});

			});
	} else {
		res.render('pages/hello');
	}

});
app.listen(app.get('port'), function() {
	console.log('Node app is running on port', app.get('port'));
});