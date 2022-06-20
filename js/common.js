const common = {
    debounceQueue: {},
    debounce(fn, id, delay, args, that) {
      delay = delay || 1000;
      that = that || this;
      args = args || new Array;
      if (typeof common.debounceQueue[id] !== "object") {
        common.debounceQueue[id] = new Object();
      }
      if (typeof common.debounceQueue[id].debounceTimer !== "undefined") {
        clearTimeout(common.debounceQueue[id].debounceTimer);
      }
      return common.debounceQueue[id] = {
        fn: fn,
        id: id,
        delay: delay,
        args: args,
        debounceTimer: setTimeout(function() {
          common.debounceQueue[id].fn.apply(that, common.debounceQueue[id].args);
          return common.debounceQueue[id] = void 0;
        }, delay)
      };
    }
}