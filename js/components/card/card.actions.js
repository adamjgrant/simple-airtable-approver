m.card.act({
    airtable_base(_$, args) {
        const Airtable = require('airtable');
        // Get a base ID for an instance of art gallery example
        const base = new Airtable({ apiKey: localStorage.getItem("airtable_api_key") }).base(localStorage.getItem('airtable_base_id'));
        return base;
    },

    load_in_data(_$, args) {
        return new Promise((resolve, reject) => {
            const response_options = args.record.get("Response Options");
            let responses = JSON.parse(response_options).length ? JSON.parse(response_options) : [args.record.get("Full tweet")];
            let card_data = {
                id: args.record.getId(),
                tweet: args.record.get("Responds to (Text) cleaned up"),
                response: (responses[0] || ""),
                tweetalt1: response_options.length ? responses[1] : "",
                tweetalt2: response_options.length ? responses[2] : "",
                order: args.record.get("Optional Sort Ordering"),
                job_name: [""].concat(args.record.get("Permutation Job Name")).reverse()[0],
                job_approval_rate: [""].concat(args.record.get("Permutation Job Approval Rate")).reverse()[0],
                job_link: `https://airtable.com/app2X2gnPXhFKDs1t/tblD70jsW5F9jEjGr/viwxIVb4yRM9zrHsY/${[""].concat(args.record.get("Job")).reverse()[0]}?blocks=hide`,
                reply_to_handle: args.record.get("Reply To Handle"),
                sending_account_handle: args.record.get("Sending account handle"),
                link_to_tweet: `https://twitter.com/BarackObama/status/${args.record.get("Reply To")}`,
                thumbnail: _$.act.get_twitter_photo({ record: args.record }),
                response_quality: args.record.get("Response Quality"),
                combined_response_quality: args.record.get("Combined Response Quality")
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
        // _$.act.advance_to_next_card();
    },

    format_card(_$, args) {
        const turn_hashtags_into_links = (str) => {
            return str.replace(/#\w+/g, (capture_group) => {
                return `<a href="#">${capture_group}</a>`
            });
        }

        m.card.this_card.tweet = turn_hashtags_into_links(m.card.this_card.tweet);
        m.card.this_card.response = m.card.this_card.response;
    },

    no_more_cards(_$, args) {
        // Don't confuse a bad connection with a good connection with no cards.
        if (_$.act.bad_connection_details()) return false;
        return !m.card.data.length;
    },

    bad_connection_details(_$, args) {
        return !m.bottom_nav.valid_settings;
    },

    advance_to_next_card(_$, args = {}) {
        m.metadata.act.hide_badge();
        if (m.card.this_card != null) m.card.cards_processed.push(m.card.this_card);

        if (_$.act.no_more_cards()) {
            m.bottom_nav.act.hide();
            return m.curtain.act.set_curtain_text({ text: "Session complete. Refresh for more tweets" });
        }

        if (_$.act.bad_connection_details()) {
            m.bottom_nav.act.show();
            return m.curtain.act.set_curtain_text({ text: "Could not find Airtable Connection Key/Base ID" });
        }

        m.bottom_nav.act.show();
        if (args.this_card) {
            m.card.data.splice(args.index, 1);
            m.card.this_card = args.this_card;
        } else {
            m.card.this_card = m.card.data.shift();

            const handle = m.card.this_card.sending_account_handle;

            // In case there is a filter, let's skip next items that match the filter.
            if (!m.account.act.handle_is_in_filter({ handle })) {
                _$.act.advance_to_next_card();
            }
        }
        m.embedded_tweet.act.hide_all();
        _$.act.format_card();
        _$.act.set_card_values();
        m.metadata.act.set_badge({
            job_name: m.card.this_card.job_name,
            job_approval_rate: m.card.this_card.job_approval_rate,
            job_link: m.card.this_card.job_link
        });
        m.metadata.act.set_response_quality({
            response_quality: m.card.this_card.response_quality,
            combined_response_quality: m.card.this_card.combined_response_quality
        });

        m.viewport.act.scroll_to_top();
    },

    advance_to_card_at_index(_$, args) {
        const this_card = m.card.data[args.index];
        _$.act.advance_to_next_card({ this_card: this_card, index: args.index });
    },

    reject_card_at_index(_$, args) {
        const this_card = m.card.data[args.index];
        m.bottom_nav.act
            .reject_specific_card({ this_card: this_card, index: args.index })
            .then();
    },

    undo(_$, args) {
        if (!m.card.cards_processed.length) return console.error("No card to go back to");
        m.card.data.unshift(m.card.this_card);
        m.card.this_card = m.card.cards_processed.pop();
        m.bottom_nav.act.in_review();
        _$.act.format_card();
        _$.act.set_card_values();
        m.tabs.act.set_tab_filter();
    },

    reset_card_values(_$, args) {
        // Reset
        _$(".tweet-minus-1").classList.remove("show");
        _$(".tweet-minus-2").classList.remove("show");
        m.choice.act.set_text_for_choice_at_index({ text: "", index: 0 });
        m.choice.act.set_text_for_choice_at_index({ text: "", index: 1 });
        m.choice.act.set_text_for_choice_at_index({ text: "", index: 2 });
    },

    set_card_values(_$, args) {
        _$.act.reset_card_values();
        _$("#tweet").innerHTML = _$.act.format_embedded_tweet_at_index({ tweet: m.card.this_card.tweet, index: 0 });

        const initial_choice = m.card.this_card.response;
        _$("#response").innerHTML = initial_choice;
        _$("#response").value = initial_choice;
        m.choice.act.set_choice_response({ text: initial_choice });

        m.choice.act.set_text_for_choice_at_index({ text: m.card.this_card.response, index: 0 });
        m.choice.act.set_text_for_choice_at_index({ text: m.card.this_card.tweetalt1, index: 1 });
        m.choice.act.set_text_for_choice_at_index({ text: m.card.this_card.tweetalt2, index: 2 });

        _$("#response-thumbnail").src = m.card.this_card.thumbnail;

        _$(".link-to-tweet").forEach(link => {
            link.href = m.card.this_card.link_to_tweet;
        });

        m.card.this_card.previous_responses.forEach((response, i) => {
            _$(`#tweet-minus-${i + 1}`).innerHTML = _$.act.format_embedded_tweet_at_index({ tweet: response.tweet, index: i + 1 });
            _$(`.tweet-minus-${i + 1}`).classList.add("show");
        });

        m.choice.act.reset_choices();
    },

    toggle_response_edit(_$, args) {
        const twitter_box = _$(".twitter-box")[_$(".twitter-box").length - 1];
        if (twitter_box.classList.contains("response-edit-hidden")) {
            twitter_box.classList.remove("response-edit-hidden");
        } else {
            twitter_box.classList.add("response-edit-hidden");
        }
    },

    priv: {
        format_embedded_tweet_at_index(_$, args) {
            const embed_regex = /https\:\/\/t\.co\/\w+/
            const matches = args.tweet.match(embed_regex);
            if (matches && matches[0]) {
                m.embedded_tweet.act.set_tweet_at_index({
                    url: matches[0],
                    index: (2 - args.index)
                })
            }
            return args.tweet.replace(embed_regex, "");
        },

        get_previous_responses(_$, args) {
            return new Promise((resolve, reject) => {
                const external_tweet = args.record.get("External tweets");

                if (!external_tweet) return resolve([]);
                let responses = [];

                const get_tweet = (record_id) => {
                    _$.act.get_external_tweet_for_record_id({ recordId: record_id }).then(tweet => {
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
        }
    },

    manual_edit(_$, args) {
        const text = _$("#choice-response").value;
        _$.act.change_response_field({ text });
        _$.act.edit_response({ text });
    },

    change_response_field(_$, args) {
        // This exists because some external components need to both 
        // change the textarea and change the remote data's response.
        // Some components shouldn't use this because they are
        // triggered by editing the textarea already.
        _$("#response").value = args.text;
        _$("#response").innerHTML = args.text;
    },

    edit_response(_$, args) {
        // m.bottom_nav.act.disable();
        m.status_indicator.act.set_status_yellow({ reset: false });

        common.debounce(() => {
                m.card.act.airtable_base()('💬 Tweets').update([{
                    id: m.card.this_card.id,
                    fields: { "Tweet": args.text }
                }], function(err, records) {
                    if (err) {
                        m.status_indicator.act.set_status_red();
                        return console.error(err);
                    } else {
                        m.bottom_nav.act.enable();
                        m.status_indicator.act.set_status_green();
                    }
                });
            },
            'edit',
            1000,
        );
    },

    select_all(_$, args) {
        _$("#response").select();
    },

    clear(_$, args) {
        _$("#response").value = "";
        _$("#response").innerHTML = "";
    },

    sort_cards(_$, args) {
        m.card.data = m.card.data.sort((a, b) => {
            if (a.order > b.order) return 1;
            if (a.order < b.order) return -1;
            return 0;
        });
        m.card.data = m.card.data.sort((card, card2) => {
            return card2.combined_response_quality - card.combined_response_quality;
        });
        m.card.data = _$.act.take_ten_percent_of_items_randomly_and_distribute_them_as_every_tenth_item_in_the_array({
            cards: m.card.data
        })
    },

    take_ten_percent_of_items_randomly_and_distribute_them_as_every_tenth_item_in_the_array(_$, args) {
        const arr = args.cards;
        const number_of_items_to_select = Math.round(arr.length/10);
        for (let x=0;x<number_of_items_to_select;x++) {
          const randomly_chosen_item_index = Math.floor(Math.random()*arr.length);
          const randomly_chosen_item = arr.splice(randomly_chosen_item_index, 1)[0];
          const new_position = x*10+9;
          arr.splice(new_position, 0, randomly_chosen_item);
        }
        return arr; 
    }
})

m.card.data = [];
m.card.cards_processed = [];
m.card.this_card = null;