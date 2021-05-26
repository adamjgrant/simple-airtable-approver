m.card.act({
    load_in_data(_$, args) {
        const card_data = {
            id: args.record.getId(),
            tweet: args.record.get("Responds to (Text) cleaned up"),
            response: args.record.get("Full tweet")
        }

        m.card.data.push(card_data);
    },

    start(_$, args) {
        _$.act.advance_to_next_card();
    },

    advance_to_next_card(_$, args) {
        m.card.this_card = m.card.data.pop();

        _$("#tweet").innerHTML = this_card.tweet;
        _$("#response").innerHTML = this_card.response;
    }
})

m.card.data = [];
m.card.this_card = null;