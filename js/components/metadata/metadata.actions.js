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
        const approval_rate = _$.act.format_percentage({ number: args.job_approval_rate });
        _$("#badge").innerHTML = `"${args.job_name}": ${approval_rate}%`;
    },

    priv: {
        format_percentage(_$, args) {
            return parseFloat(Math.round(args.number * 1000)) / 10.0;
        }
    }
})