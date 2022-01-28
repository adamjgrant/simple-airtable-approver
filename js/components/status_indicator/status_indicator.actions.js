m.status_indicator.acts({
    reset_status(_$, args) {
        _$.me().classList.remove("green");
        _$.me().classList.remove("red");
        _$.me().classList.remove("yellow");
    },

    set_status_green(_$, args) { _$.act.set_status({ color: "green", reset: (args && args.reset) }) },

    set_status_red(_$, args) { _$.act.set_status({ color: "red", reset: (args && args.reset) }) },

    set_status_yellow(_$, args) { _$.act.set_status({ color: "yellow", reset: (args && args.reset) }) },

    priv: {
        set_status(_$, args) {
            _$.act.reset_status();
            _$.me().classList.add(args.color);

            if (args.reset === undefined) args.reset = true;
            if (args.reset) {
                const reset = common.debounce({
                    func: _$.act.reset_status,
                    wait: 500,
                });
                reset();
            }
        }
    }
});