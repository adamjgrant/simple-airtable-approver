import { C } from "../../constants.js";
m.rewarder.acts({
    check(_$, args) {
        _$.act.send_notification({ 
            tuple: _$.act.scenario_high_score(),
            debounce: {
                id: "high_score",
                delay: C.FIFTEEN_SECONDS_IN_MS
            }
        });
        _$.act.send_notification({ tuple: _$.act.scenario_ten_x_approved() });
        _$.act.send_notification({ tuple: _$.act.scenario_hundred_x_approved() });
    },

    send_notification(_$, args) {
        let [rewardable, heading, message, icon, animation, background_color] = args.tuple;
        args.debounce = args.debounce || {};
        if (rewardable) {
            common.debounce(() => {
                m.notification.act.show_notification({
                    heading: heading,
                    message: message,
                    icon: icon,
                    animation: animation,
                    background_color: background_color || `#C600D7`
                });
            }, args.debounce.id || '.', args.debounce.delay || 0)
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
                result[2] = `You made it to ${score_rounded} Approvals Per Hour over the past 2 mins`;
                result[3] = `🏆`;
                result[4] = `animate__tada`;
                result[5] = '#91D700' // GREEN
            }
            return result;
        },

        scenario_ten_x_approved(_$, args)  {
            // Some even multiple of 10 approvals have been made.
            let result = [false];
            const scores = m.account.act.get_all_scores_for_filter(); 
            let is_not_zero = scores.approve !== 0;
            let ten_x = scores.approved % 10 === 0;
            let is_not_hundred_x = scores.approved % 100 === 0;
            let reached_a_new_level = scores.approved > m.rewarder.current_ten_x_approved;

            if (is_not_zero && ten_x && is_not_hundred_x && reached_a_new_level) {
                m.rewarder.current_ten_x_approved = scores.approved;
                result[0] = true;
                result[1] = `${scores.approved} Approved!`;
                result[2] = `You've reached a new 10x level of approved tweets`;
                result[3] = `🌟`;
                result[4] = `animate__tada`;
                result[5] = undefined;
                m.rewarder.current_ten_x_approved = scores.approved;
            }
            return result;
        },

        scenario_hundred_x_approved(_$, args) {
            // Some even multiple of 100 approvals have been made.
            let result = [false];
            const scores = m.account.act.get_all_scores_for_filter(); 
            let is_not_zero = scores.approve !== 0;
            let hundred_x = scores.approved % 100 === 0;
            let reached_a_new_level = scores.approved > m.rewarder.current_hundred_x_approved;

            if (is_not_zero && hundred_x && reached_a_new_level) {
                m.rewarder.current_hundred_x_approved = scores.approved;
                result[0] = true;
                result[1] = `${scores.approved} Approved!`;
                result[2] = `Holy FUCKING SHIT. You've reached a new 100x level of approved tweets`;
                result[3] = `💯`;
                result[4] = `animate__tada`;
                result[5] = `#3D0043`;
                m.rewarder.current_ten_x_approved = scores.approved;
            }
            return result;
        }
    }

});
m.rewarder.current_ten_x_approved = 0;
