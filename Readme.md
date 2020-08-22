# Node Tweet

Quick script to send tweets scheduled with an easy cron job.

The script will compile a tweet from a given list and combine it with recuring text and hashtags

## Setup

* Register your Twitter app at [https://developer.twitter.com/](https://developer.twitter.com/)
* Copy or rename `config.json.example` to `config.json`
* Edit `config.json`
    * Update the keys and secrets and bits from Twitter
    * Update your hashtags
    * Update your promo text
    * Update the array of tweets with their text and path to the image
* Update cron
    * eg, run it at 23:00 every day `0 23 * * * cd /path/to/nodetweet && nodejs main.js >> /var/log/nodetweet.log 2>&1`

## Details

The script will compile a tweet from the hashtags, promo and list of tweets in the config. The `promo` is some text that should be used in every tweet.

If it's friday, the `friday_hashtag` will also get added to the the list of hashtags and the `promo_friday` will be used instead of `promo`. If it's saturday, the `saturday_hashtag` will get appended to the list of hashtags.

The chosen tweet will be selected from the list using the `row` config option, and after it has finished running the `row` number will be incremented or reset to 0.

The is no error checking on length of the compiled tweet.
