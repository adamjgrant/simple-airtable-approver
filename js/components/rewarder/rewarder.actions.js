m.rewarder.acts({
    check(_$, args) {
        _$.act.send_notification({ tuple: _$.act.scenario_high_score() });
    },

    send_notification(_$, args) {
        if (args.tuple[0]) {
            m.notification.act.show_notification({
                message: args.tuple[1],
                icon: args.tuple[2] 
            })
        }
    },

    priv: {
        // All scenarios should return an array with [<Boolean>, message<String>, icon<String>]
        scenario_high_score(_$, args) {
            let result = [false, undefined, undefined];
            let score_rounded = m.odometer.act.get_rounded_score();
            if (score_rounded > m.odometer.high_score) {
                m.odometer.high_score = score_rounded;
                result[0] = true;
                result[1] = `High score! ${score_rounded} APH`;
                result[2] = `🏆`
            }
            return result;
        }
    }

});
