m.card.act({
    load_in_data(_$, args) {
        const card_data = {
            id: args.record.getId(),
            tweet: args.record.get("Responds to (Text) cleaned up"),
            response: args.record.get("Full tweet"),
            thumbnail: _$.act.get_twitter_photo({ record: args.record }),
            previous_responses: _$.act.get_previous_responses({ record: args.record })
        }

        m.card.data.push(card_data);
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
            _$(`#tweet-minus-${i + 1}`).innerHTML = response.text;
            _$(`.tweet-minus-${i + 1}`).classList.add("show");
        });
    },

    priv: {
        get_previous_responses(_$, args) {
          return [
              {
                  text: "Foo"
              },
              {
                  text: "Bar"
              }
          ].reverse(); // TODO
        }
    }
})

m.card.data = [];
m.card.cards_processed = [];
m.card.this_card = null;