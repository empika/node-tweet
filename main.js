const fs = require('fs');
const Twitter = require('twit');

const config_file_name = 'config.json';

let rawData = fs.readFileSync(config_file_name);
let config = JSON.parse(rawData);

var client = new Twitter({
    consumer_key: config.consumer_key,
    consumer_secret: config.consumer_secret,
    access_token: config.access_token,
    access_token_secret: config.access_token_secret,
    timeout_ms: config.timeout_ms,  // optional HTTP request timeout to apply to all requests.
    strictSSL: true
});

var row = config.row;
var tweets = config.tweets;

if(row >= tweets.length)
{
    row = 0;
}

console.log("Getting row: " + row);

var tweet = tweets[row];

// Lets upload our gif
const pathToMovie = process.cwd() + "/" + tweet.image_path;
const mediaType   = 'image/gif'; // `'video/mp4'` is also supported
const mediaData   = require('fs').readFileSync(pathToMovie);
const mediaSize    = require('fs').statSync(pathToMovie).size;

client.postMediaChunked({ file_path: pathToMovie }, function (error, data, response) {

    if (error) {
        throw error;
    }
    else{
        console.log("Success uploading gif: " + data.media_id_string);

        // Construct the tweet
        var tweet_body = tweet.text + "\n";
        var hashtags = config.hashtags;
        var theDate = new Date();
        if(theDate.getDay() == 5)
        {
            hashtags += " " + config.friday_hashtag;
        }
        else if (theDate.getDay() == 6)
        {
            hashtags += " " + config.saturday_hashtag;
        }

        hashtags += "\n";

        if(theDate.getDay() == 5)
        {
            tweet_body += hashtags + config.promo_friday;
        }
        else {
            tweet_body += hashtags + config.promo;
        }

        console.log(tweet_body);

        client.post('statuses/update', {
            status: tweet_body,
            media_ids: [data.media_id_string]
        }, function (error, tweet, response)
        {
            if (error) throw error;
            console.log("Success updating status: " + tweet.id_str);
        });
    }
});


// Wrap up, incremenet the row number and save the config
row += 1;
config["row"] = row;

let data = JSON.stringify(config, null, 4);
fs.writeFileSync(config_file_name, data);
