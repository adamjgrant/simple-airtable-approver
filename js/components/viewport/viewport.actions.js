m.viewport.acts({
    show_timeline(_$, args) {
        _$.me().className = "";
        m.row_tweet.act.populate();
        _$.me().classList.add("timeline-view");
        m.metadata.act.clear();
        m.viewport.current_view = "timeline";
    },

    show_tinder(_$, args) {
        _$.me().className = "";
        _$.me().classList.add("tinder-view");
        m.viewport.current_view = "tinder";
        m.metadata.act.show_badge();
    },
});