import Vue from "vue";
import dayjs from "dayjs";
// July 7, 2021
Vue.filter("handleDay", (date, formatType = "MMMM D, YYYY") => {
  return dayjs(date).format(formatType);
});
