m.row_tweet.act({
    populate(_$, args) {
        _$.act.clear();
        const cards = m.card.data;
        cards.forEach((card, index) => _$.act.make_row({ card: card, index: index }));
        _$.act.bind_events();
    },

    open_tweet(_$, args) {
        //   Switch to card by index
        const row = args.row
        const index = row.dataset.cardIndex;
        m.card.act.advance_to_card_at_index({ index: parseInt(index) });
        //   Show tinder view
        m.viewport.act.show_tinder();
    },

    reject_tweet(_$, args) {
        //   Switch to card by index
        const row = args.row
        const index = row.dataset.cardIndex;
        m.card.act.reject_card_at_index({ index: parseInt(index) });
    },

    bind_events(_$, args) {
        _$.me().forEach(el => el.addEventListener("click", (e) => {
            if (e.target.classList.contains("reject")) {
                return _$.act.reject_tweet({ row: el })
            }
            _$.act.open_tweet({ row: el })
        }));
    },

    priv: {
        get_template(_$, args) {
            return document.getElementById("timeline-row");
        },

        get_parent(_$, args) {
            return document.querySelector(".view-timeline");
        },

        make_row(_$, args) {
            const template = _$.act.get_template();
            const parent = _$.act.get_parent();
            const index = args.index;
            const card = args.card;

            /*
              id: "recQCu0UowZdiTOrI"
              link_to_tweet: "https://twitter.com/BarackObama/status/1486761353633308686"
              previous_responses: [] (0)
              response: "For a narcissist, this is how they operate. Everything turns back to the self-preservation of \"them\"↵It's hard to just correct tha…"
              thumbnail: "https://dl.airtable.com/.attachments/51074c8a703e603ed5eadd8525f11604/bd9e1fd4/BDKFC_JF_400x400.jpg"
              tweet: "We should watch how people with adhd probably had a narcissist parent and were beat up as a child .This fear of not doing things perfectl…"
            */
            const card_element = template.content.cloneNode(true);
            card_element.querySelector(".tweet").innerHTML = card.tweet;
            card_element.querySelector("[data-component='row_tweet']").dataset.cardIndex = index;
            parent.appendChild(card_element);
        },

        clear(_$, args) {
            const template_html = _$.act.get_template().outerHTML;
            _$.act.get_parent().innerHTML = template_html;
        }
    }
});