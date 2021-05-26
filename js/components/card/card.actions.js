m.card.act({
    load_in_data(_$, args) {
        console.log(args);
        const card_data = {
            id: args.record.getId(),
            tweet: args.record.get("Responds to (Text) cleaned up"),
            response: args.record.get("Full tweet"),
            thumbnail: _$.act.get_twitter_photo({ record: args.record })
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
        m.card.this_card = m.card.data.pop();
        _$.act.format_card();
        _$("#tweet").innerHTML = m.card.this_card.tweet;
        _$("#response").innerHTML = m.card.this_card.response;
        _$("#response-thumbnail").src = m.card.this_card.thumbnail;
    }
})

m.card.data = [];
m.card.this_card = null;