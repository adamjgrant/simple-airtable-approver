import { TableObject } from "../../../js/vendor/table_object.js";

m.odometer.acts({
  init(_$, args) {
    m.odometer.approvals_so_far = 0;
    m.odometer.high_score = 0;
    m.odometer.start_time = new Date();
  },

  register_that_an_approval_has_happened(_$, args) {
    m.odometer.approvals_so_far++;
    _$.act.update_odometer();
  },

  update_odometer(_$, args) {
    const score = _$.act.calculate_approvals_per_hour();
    const score_rounded = Math.round(score * 10)/10.0;
    if (score_rounded > m.odometer.high_score) {
        m.odometer.high_score = score_rounded;
        _$.act.send_reward({ reward: "high_score" });
    }
    _$(".aph").innerHTML = score_rounded;
  },

  priv: {
    time_elapsed_in_seconds(_$, args) {
        const start = m.odometer.start_time;
        const finish = new Date();
        return (finish - start)/1000;
    },

    calculate_approvals_per_hour(_$, args) {
        const approvals_per_second = m.odometer.approvals_so_far / _$.act.time_elapsed_in_seconds();
        return approvals_per_second * 60;
    },

    get_rewards(_$, args) {
        // Pre-programmed emoji + short message to show briefly based on specific logic
        const rewards = new TableObject([
            ["emoji", "message",                     "for_arg"],
            ["🌟",    "High Score!",                 "high_score"]
        ]);
        return rewards;
    },

    send_reward(_$, args) {
        const rewards = _$.act.get_rewards();
        const reward_type = args.reward;
        const reward_to_send = rewards.filter(reward => {
            return reward.for_arg === reward_type
        });
    }
  }
});
