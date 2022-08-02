m.odometer.acts({
  init(_$, args) {
    m.odometer.approvals_so_far = 0;
    m.odometer.start_time = new Date();
  },

  register_that_an_approval_has_happened(_$, args) {
    m.odometer.approvals_so_far++;
    _$.act.update_odometer();
  },

  update_odometer(_$, args) {
    const score = _$.act.calculate_approvals_per_hour();
    const score_rounded = Math.round(score * 10)/10.0;
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
    }
  }
});
