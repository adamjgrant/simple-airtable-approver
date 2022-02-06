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
        const formatted_text = _$.act.format_badge(args);
        _$("#badge").innerHTML = formatted_text;
    },

    priv: {
        format_badge(_$, args) {
            let number_parsed = args.text.match(/(\d+\.\d+)/);
            let number = number_parsed ? number_parsed[0] : args.text;
            number = parseFloat(number.substr(0, 6)) * 100;
            if (number == 0) number = "---";
            return args.text.replace(/(\d+\.\d+)/, `${number}%`);
        }
    }
})