const CNCustoms = {};
const WorkingQueue = {};
export default {
  CNCustoms() {
    return CNCustoms;
  },
  Setup(name, callbackAlways, callbackSetup) {
    if (CNCustoms[name] != null) {
      callbackAlways(CNCustoms[name]);
      return;
    }
    if (WorkingQueue[name] != null && WorkingQueue[name].length > 0) {
      // no need to setup, as somebody should be doing
      WorkingQueue[name].push(callbackAlways);
    } else {
      WorkingQueue[name] = [callbackAlways];
      callbackSetup();
    }
  },
  SetupDone(name, value) {
    CNCustoms[name] = value;
    for (var i = 0; i < WorkingQueue[name].length; i++) {
      WorkingQueue[name][i](value);
    }
    WorkingQueue[name] = [];
  }
}
