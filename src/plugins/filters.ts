import Vue from "vue";
import moment from "moment";

Vue.filter("currency", function (value: string|number) {
    if (typeof value === "string") {
        value = parseFloat(value);
    }

    return value.toFixed(2).replace(/\d(?=(\d{3})+\.)/g, '$&,');
});

Vue.filter("datetime", (value: string) => {
    return moment(value).format("DD/MM/YYYY hh:mm:ss");
});