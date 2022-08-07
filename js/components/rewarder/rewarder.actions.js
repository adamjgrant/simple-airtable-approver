const FIFTEEN_SECONDS_IN_MS = 15 * 1000;
m.rewarder.acts({
    check(_$, args) {
        common.debounce(_$.act.send_notification, 'high_score', FIFTEEN_SECONDS_IN_MS, [{ tuple: _$.act.scenario_high_score() }], this);
        _$.act.send_notification({ tuple: _$.act.scenario_ten_x_approved() });
    },

    send_notification(_$, args) {
        let [rewardable, heading, message, icon, animation] = args.tuple;
        if (rewardable) {
            m.notification.act.show_notification({
                heading: heading,
                message: message,
                icon: icon,
                animation: animation
            });
        }
    },

    priv: {
        // All scenarios should return an array with [<Boolean>, message<String>, icon<String>]
        scenario_high_score(_$, args) {
            let result = [false];
            let score_rounded = m.odometer.act.get_rounded_score();
            let has_reached_time_threshold = m.odometer.act.has_reached_time_threshold();
            let new_high_score = score_rounded > m.odometer.high_score;
            if (new_high_score && has_reached_time_threshold) {
                m.odometer.high_score = score_rounded;
                result[0] = true;
                result[1] = `High Score!`
                result[2] = `You made it to ${score_rounded} APH`;
                result[3] = `🏆`
                result[4] = `animate__tada`
            }
            return result;
        },

        scenario_ten_x_approved(_$, args)  {
            // Some even multiple of 10 approvals have been made.
            let result = [false];
            const scores = m.account.act.get_all_scores_for_filter(); 
            let is_not_zero = scores.approve !== 0;
            let ten_x = scores.approved % 10 === 0;
            let reached_a_new_level = scores.approved > m.rewarder.current_ten_x_approved;

            if (is_not_zero && ten_x && reached_a_new_level) {
                m.rewarder.current_ten_x_approved = scores.approved;
                result[0] = true;
                result[1] = `${scores.approved} Approved!`;
                result[2] = `You've reached a new 10x level of approved tweets`;
                result[3] = `🌟`;
                result[4] = `animate__tada`;
                m.rewarder.current_ten_x_approved = scores.approved;
            }
            return result;
        }
    }

});
m.rewarder.current_ten_x_approved = 0;
