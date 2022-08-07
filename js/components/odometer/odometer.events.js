import { C } from "../../../js/constants.js";

m.odometer.events(_$ => {
  _$.act.init();
  setInterval(_$.act.update_odometer, C.FIVE_SECONDS_IN_MS);
  // Need to allow for the first "enough time has passed" interval to happen before we do this.
  setTimeout(() => {
    setInterval(_$.act.reset_interval, C.FIVE_SECONDS_IN_MS);
  }, C.ONE_MINUTE_IN_MS);
});
