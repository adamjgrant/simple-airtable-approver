m.odometer.events(_$ => {
  _$.act.init();
  setInterval(_$.act.update_odometer, 5000);
  setInterval(_$.act.reset_interval, 10000);
});
