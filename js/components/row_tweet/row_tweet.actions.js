m.row_tweet.act({
    show_only_these_rows_by_name(_$, args) {
        _$.me = () => {
            return document.querySelectorAll("[data-component='row_tweet']");
        }
        const rows = _$.me();
        rows.forEach(row => {
            if (!row || row.length === 0) return;
            row.classList.add("hide");
        });
        args.handles.forEach(handle => {
            const class_name = `show-tab-${handle}`;
            document.querySelectorAll(`.${class_name}`).forEach(row => row.classList.remove("hide"));
        });
    },

    populate(_$, args) {
        _$.act.clear();
        const cards = m.card.data;
        if (!m.card.data.length) return console.log("No cards loaded yet. Skipping population");
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
        const rows = _$.me().length ? _$.me() : [_$.me()];
        rows.forEach(el => {
            const tweet = el.querySelector("article");
            const reject = el.querySelector(".reject");

            tweet.addEventListener("click", () => { _$.act.open_tweet({ row: el }) });
            reject.addEventListener("click", () => { _$.act.reject_tweet({ row: el }) });
        })
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
            const card_row_tweet = card_element.querySelector("[data-component='row_tweet']");
            card_element.querySelector(".tweet").innerHTML = card.tweet;
            card_row_tweet.dataset.cardIndex = index;
            card_element.querySelector(".tiny-response img").src = card.thumbnail;
            card_row_tweet.classList.add(`show-tab-${card.sending_account_handle}`);

            const tiny_response_length_in_characters = 50;
            const oversized = (card.response.length > tiny_response_length_in_characters);
            const tiny_response = oversized ? card.response.substr(0, tiny_response_length_in_characters - 1) + "&hellip;" : card.response;
            card_element.querySelector(".tiny-response p").innerHTML = tiny_response;
            parent.appendChild(card_element);
        },

        clear(_$, args) {
            const template_html = _$.act.get_template().outerHTML;
            _$.act.get_parent().innerHTML = template_html;
        }
    }
});