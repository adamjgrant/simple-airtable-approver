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
                const reset = _$.act.debounce({
                    func: _$.act.reset_status,
                    wait: 500,
                });
                reset();
            }
        },

        debounce(_$, args) {
            const func = args.func;
            const wait = args.wait;
            const immediate = args.immediate;

            var timeout;
            return function() {
                var context = this,
                    args = arguments;
                var later = function() {
                    timeout = null;
                    if (!immediate) func.apply(context, args);
                };
                var callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func.apply(context, args);
            };
        }
    }
});