m.card.act({
    airtable_base(_$, args) {
        const Airtable = require('airtable');
        // Get a base ID for an instance of art gallery example
        const base = new Airtable({ apiKey: localStorage.getItem("airtable_api_key") }).base(localStorage.getItem('airtable_base_id'));
        return base;
    },

    set_curtain_text(_$, args) {
        _$.act.show_curtain();
        _$(".curtain h1").innerHTML = args.text;
    },

    remove_curtain(_$, args) {
        _$(".curtain").classList.add("hide");
    },

    load_in_data(_$, args) {
        return new Promise((resolve, reject) => {
            let card_data = {
                id: args.record.getId(),
                tweet: args.record.get("Responds to (Text) cleaned up"),
                response: args.record.get("Full tweet"),
                thumbnail: _$.act.get_twitter_photo({ record: args.record })
            }

            _$.act.get_previous_responses({ record: args.record }).then(previous_responses => {
                card_data.previous_responses = previous_responses;
                resolve(m.card.data.push(card_data));
            }).catch(err => {
                console.log(err);
                reject(err);
            });
        })
    },

    get_twitter_photo(_$, args) {
        const photo_record = args.record.get("Twitter Photo");
        if (!photo_record || !photo_record.length) return "img/twitter.jpg";
        return photo_record[0].url;
    },

    start(_$, args) {
        _$.act.advance_to_next_card();
    },

    format_card(_$, args) {
        const turn_hashtags_into_links = (str) => {
            return str.replace(/#\w+/g, (capture_group) => {
                return `<a href="#">${capture_group}</a>`
            });
        }

        m.card.this_card.tweet = turn_hashtags_into_links(m.card.this_card.tweet);
        m.card.this_card.response = turn_hashtags_into_links(m.card.this_card.response);
    },

    advance_to_next_card(_$, args) {
        if (m.card.this_card != null) m.card.cards_processed.push(m.card.this_card);

        if (!m.card.data.length) {
            m.toolbar.act.hide();
            return _$.set_curtain_text({ text: "Session complete. Refresh for more tweets" });
        }

        m.card.this_card = m.card.data.pop();
        _$.act.format_card();
        _$.act.set_card_values();
    },

    undo(_$, args) {
        if (!m.card.cards_processed.length) return console.error("No card to go back to");
        m.card.data.unshift(m.card.this_card);
        m.card.this_card = m.card.cards_processed.pop();
        m.toolbar.act.in_review();
        _$.act.format_card();
        _$.act.set_card_values();
    },

    set_card_values(_$, args) {
        // Reset
        _$(".tweet-minus-1").classList.remove("show");
        _$(".tweet-minus-2").classList.remove("show");

        _$("#tweet").innerHTML = m.card.this_card.tweet;
        _$("#response").innerHTML = m.card.this_card.response;
        _$("#response-thumbnail").src = m.card.this_card.thumbnail;

        m.card.this_card.previous_responses.forEach((response, i) => {
            _$(`#tweet-minus-${i + 1}`).innerHTML = response.tweet;
            _$(`.tweet-minus-${i + 1}`).classList.add("show");
        });
    },

    priv: {
        get_previous_responses(_$, args) {
            return new Promise((resolve, reject) => {
                const external_tweet = args.record.get("External tweets");

                if (!external_tweet) return resolve([]);
                let responses = [];

                const get_tweet = (record_id) => {
                    _$.act.get_external_tweet_for_record_id({ recordId: record_id }).then(tweet => {
                        console.log(responses);
                        responses.push(tweet);
                        if (tweet.responds_to) get_tweet(tweet.responds_to[0]);
                        else return resolve(responses);
                    }).catch(err => {
                        reject(err);
                    });
                }
                get_tweet(external_tweet[0]);
            });
        },

        get_external_tweet_for_record_id(_$, args) {
            return new Promise((resolve, reject) => {
                _$.act.airtable_base()('📧 External tweets').find(args.recordId, function(err, record) {
                    if (err) { console.error(err); return reject(err); }
                    return resolve({
                        tweet: record.get("Tweet"),
                        responds_to: record.get("Responds to (external)")
                    });
                });
            });
        },

        show_curtain(_$, args) {
            _$(".curtain").classList.remove("hide");
        }
    }
})

m.card.data = [];
m.card.cards_processed = [];
m.card.this_card = null;