m.rewarder.acts({
    check(_$, args) {
        if (_$.act.scenario_high_score()[0]) {
            // TODO: Send
        }
    },

    get_rewards(_$, args) {
        // Pre-programmed emoji + short message to show briefly based on specific logic
        const rewards = new TableObject([
            ["emoji", "message",                     "for_arg"],
            ["🌟",    "High Score!",                 "high_score"]
        ]);
        return rewards;
    },

    send(_$, args) {
        const rewards = _$.act.get_rewards();
        const reward_type = args.reward;
        const reward_to_send = rewards.filter(reward => {
            return reward.for_arg === reward_type
        });
    },

    priv: {
        // All scenarios should return an array with [<Boolean>, message<String>]
        scenario_high_score(_$, args) {
            let result = [false, undefined];
            let score_rounded = m.odometer.act.score_rounded();
            m.odometer.high_score = score_rounded;
            if (score_rounded > m.odometer.high_score) {
                result[0] = true;
                result[1] = `High score! ${score_rounded} APH`;
            }
        }
    }

});
