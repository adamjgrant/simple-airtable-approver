m.embedded_tweet.acts({
    set_tweet_at_index(_$, args) {
        const embed = _$.act.get_element_at_index({ index: args.index });

        _$.act.get_id_for_tco_url({ url: args.url }).then(id => {
            embed.innerHTML = `
            <blockquote class="twitter-tweet">
                <a href="https://twitter.com/x/status/${id}"></a>
            </blockquote>
          `;
            let script = document.createElement("script");
            script.async = true;
            script.src = "https://platform.twitter.com/widgets.js"
            document.body.appendChild(script);
            _$.act.show_at_index({ index: args.index });
        });
    },

    show_at_index(_$, args) {
        const embed = _$.act.get_element_at_index({ index: args.index });
        embed.classList.remove("hide");
    },

    hide_all(_$, args) {
        _$.me().forEach((embed, index) => {
            _$.act.hide_at_index({ index });
        });
    },

    hide_at_index(_$, args) {
        const embed = _$.act.get_element_at_index({ index: args.index });
        embed.classList.add("hide");
    },

    priv: {
        get_element_at_index(_$, args) {
            return _$.me()[args.index];
        },

        get_id_for_tco_url(_$, args) {
            return new Promise((resolve, reject) => {
                const xhr = new XMLHttpRequest();
                xhr.open("GET", args.url, true);
                xhr.onload = function() {
                    const url_regex = /\<title\>(.+)\<\/title\>/;
                    const url = this.response.match(url_regex)[1];
                    const id = url.replace(/https\:\/\/twitter\.com\/.+\//, "");
                    resolve(id);
                }

                xhr.send();
            });
        }
    }
})