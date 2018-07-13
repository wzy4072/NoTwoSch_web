import {DateTime} from 'luxon/src/datetime.js'

export default {
  methods: {
    jsDateToEpoch(val) {
      if (val) {
        return val.valueOf();
      } else {
        return null;
      }
    },
    stringToEpoch(val) {
      if (val != null) {
        return DateTime.fromObject(val).valueOf();
      }
      return null;
    },
    epochToString(val, format = "yyyy-MM-dd HH:mm") {
      if (val != null) {
        return DateTime.fromMillis(val).toLocal().toFormat(format);
      }
      return null;
    },
    jsDate(epoch) {
      return DateTime.fromMillis(epoch).toJSDate();
    },
    datePart(epoch) {
      return DateTime.fromMillis(epoch).toLocal().toFormat('yyyy-MM-dd');
    },
    timePart(epoch) {
      return DateTime.fromMillis(epoch).toLocal().toFormat('HH:mm');
    },
    combineDateTime(dateStr, timeStr) {
      if (timeStr != null && timeStr !== "") {
        return DateTime.fromString(dateStr + " " + timeStr, "yyyy-MM-dd HH:mm").toJSDate();
      } else {
        return DateTime.fromString(dateStr, "yyyy-MM-dd").toJSDate();
      }
    }
  }
}
