m.viewport.acts({
    show_timeline(_$, args) {
        _$.me().className = "";
        m.row_tweet.act.populate();
        _$.me().classList.add("timeline-view");
    },

    show_tinder(_$, args) {
        _$.me().className = "";
        _$.me().classList.add("tinder-view");
    }
});