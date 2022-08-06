m.rewarder.acts({
    check(_$, args) {
        _$.act.send_notification({ tuple: _$.act.scenario_high_score() });
    },

    send_notification(_$, args) {
        let [rewardable, heading, message, icon] = args.tuple;
        if (rewardable) {
            m.notification.act.show_notification({
                heading: heading,
                message: message,
                icon: icon
            });
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
                result[1] = `High Score!`
                result[2] = `You made it to ${score_rounded} APH`;
                result[3] = `🏆`
            }
            return result;
        }
    }

});
