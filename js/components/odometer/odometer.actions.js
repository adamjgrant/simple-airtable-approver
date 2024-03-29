import { C } from "../../../js/constants.js";

m.odometer.acts({
  init(_$, args) {
    m.odometer.approvals = [];
    m.odometer.high_score = 0;
    m.odometer.start_time = new Date();
  },

  register_that_an_approval_has_happened(_$, args) {
    m.odometer.approvals.push({ id: args.id, time: Date.now() });
    _$.act.update_odometer();
  },

  unregister_an_approval(_$, args) {
    m.odometer.approvals = m.odometer.approvals.filter(approval => {
        return approval.id != args.id;
    })
  },

  reset_interval(_$, args) {
    // Set amount of time we measure for APH to two minutes.
    // Remove any registrations outside that time.
    const TWO_MINUTES_AGO_EPOCH = Date.now() - C.TWO_MINUTES_IN_MS;
    m.odometer.start_time = new Date(TWO_MINUTES_AGO_EPOCH);
    m.odometer.approvals = m.odometer.approvals.filter(approval => {
      return approval.time >= TWO_MINUTES_AGO_EPOCH;
    })
  },

  get_rounded_score(_$, args) {
    const score = _$.act.calculate_approvals_per_hour();
    const score_rounded = Math.round(score * 10)/10.0;
    return score_rounded;
  },

  update_odometer(_$, args) {
    const score_rounded = _$.act.get_rounded_score();
    m.rewarder.act.check();
    
    _$(".aph").innerHTML = _$.act.has_reached_time_threshold() ? score_rounded : "---";
  },

  has_reached_time_threshold(_$, args) {
    return _$.act.time_elapsed_in_seconds() > C.SECONDS_IN_A_MINUTE;
  },

  priv: {
    time_elapsed_in_seconds(_$, args) {
        const start = m.odometer.start_time;
        const finish = new Date();
        return (finish - start)/1000;
    },

    calculate_approvals_per_hour(_$, args) {
        const approvals_per_second = m.odometer.approvals.length / _$.act.time_elapsed_in_seconds();
        return approvals_per_second * C.SECONDS_IN_A_MINUTE * C.MINUTES_IN_AN_HOUR;
    }
  }
});
