m.status_indicator.acts({
    reset_status(_$, args) {
        _$.me().classList.remove("green");
        _$.me().classList.remove("red");
        _$.me().classList.remove("yellow");
    },

    set_status_green(_$, args) { _$.act.set_status({ color: "green", reset: (args && args.reset) }) },

    set_status_red(_$, args) { _$.act.set_status({ color: "red", reset: (args && args.reset) }) },

    set_status_yellow(_$, args) { _$.act.set_status({ color: "yellow", reset: (args && args.reset) }) },

    set_status_offline(_$, args) { _$.act.set_status({ color: "offline", reset: (args && args.reset) }) },

    updateOfflineQueueStatus(_$, args) {
        if (m.offline_manager && m.offline_manager.act) {
            const status = m.offline_manager.act.getQueueStatus();
            if (status.hasPendingActions) {
                _$.me().className = "status-indicator offline-queue";
                _$.me().setAttribute('title', `${status.queueLength} actions queued for when online`);
            }
        }
    },

    priv: {
        set_status(_$, args) {
            _$.act.reset_status();
            _$.me().classList.add(args.color);

            if (args.reset === undefined) args.reset = true;
            if (args.reset) {
                common.debounce(_$.act.reset_status, 'reset', 500);
            }
        }
    }
});