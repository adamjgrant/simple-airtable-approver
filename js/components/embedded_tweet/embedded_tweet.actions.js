m.embedded_tweet.acts({
    set_tweet_at_index(_$, args) {
        const embed = _$.act.get_element_at_index({ index: args.index });
        embed.innerHTML = `
          <blockquote class="twitter-tweet">
              <a href="https://twitter.com/x/status/${args.id}"></a>
          </blockquote>
        `;
        let script = document.createElement("script");
        script.async = true;
        script.src = "https://platform.twitter.com/widgets.js"
        document.body.appendChild(script);
        _$.act.show_at_index({ index: args.index });
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
        }
    }
})