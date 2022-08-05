import { C } from "../../../js/constants.js";

m.odometer.acts({
  init(_$, args) {
    m.odometer.approvals = [];
    m.odometer.high_score = 0;
    m.odometer.start_time = new Date();
  },

  register_that_an_approval_has_happened(_$, args) {
    m.odometer.approvals.push({ id: args.id });
    _$.act.update_odometer();
  },

  unregister_an_approval(_$, args) {
    m.odometer.approvals = m.odometer.approvals.filter(approval => {
        return approval.id != args.id;
    })
  },

  get_rounded_score(_$, args) {
    const score = _$.act.calculate_approvals_per_hour();
    const score_rounded = Math.round(score * 10)/10.0;
    return score_rounded;
  },

  update_odometer(_$, args) {
    const score_rounded = _$.act.get_rounded_score();
    if (_$.act.has_reached_time_threshold()) {
      m.rewarder.act.check();
    }
    
    _$(".aph").innerHTML = _$.act.has_reached_time_threshold() ? score_rounded : "---";
  },

  priv: {
    has_reached_time_threshold(_$, args) {
      return _$.act.time_elapsed_in_seconds() > C.SECONDS_IN_A_MINUTE;
    },
    
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
