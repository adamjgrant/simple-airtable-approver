m.odometer.events(_$ => {
  _$.act.init();
  setInterval(_$.act.update_odometer, 5000);
});
