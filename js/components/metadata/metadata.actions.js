m.metadata.act({
    clear(_$, args) {
        _$.act.hide_badge();
    },
    
    hide_badge(_$, args) {
        _$("#badge").classList.add("hide");
    },
    
    show_badge(_$, args) {
        _$("#badge").classList.remove("hide");
    },

    set_badge(_$, args) {
        if (m.viewport.current_view === "tinder") _$.act.show_badge();
        _$("#badge").innerHTML = args.text;
    }
})