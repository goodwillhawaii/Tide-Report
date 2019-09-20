
function buildMonthlyPredictionsURL() {

    function calc_begin_date() {
        let x = new Date();
        let y = x.getFullYear().toString();
        let m = (x.getMonth() + 1).toString();
        let d = "01";
        d.length == 1 && (d = "0" + d);
        m.length == 1 && (m = "0" + m);
        let yyyymmdd = y + m + d;
        return yyyymmdd;
    }

    function daysInMonth(iMonth, iYear) {
        return 32 - new Date(iYear, iMonth, 32).getDate();
    }

    function calc_end_date() {
        let x = new Date();
        let y = x.getFullYear().toString();
        let m = (x.getMonth() + 1).toString();
        let d = daysInMonth(x.getMonth().toString(), x.getFullYear().toString());
        d.length == 1 && (d = "0" + d);
        m.length == 1 && (m = "0" + m);
        let yyyymmdd = y + m + d;
        return yyyymmdd;
    }

    let begin_date = calc_begin_date();
    let end_date = calc_end_date();

    return predictions_url =
        "https://tidesandcurrents.noaa.gov/api/datagetter?begin_date=" +
        begin_date +
        "&end_date=" +
        end_date +
        "&station=1612340&product=predictions&datum=mllw&units=english&time_zone=lst&application=Web Services&interval=hilo&format=json";

}

/**************************************************************************************************************************/

function buildPredictionsURL() {

    function yyyymmdd() {
        let x = new Date();
        let y = x.getFullYear().toString();
        let m = (x.getMonth() + 1).toString();
        let d = x.getDate().toString();
        d.length == 1 && (d = "0" + d);
        m.length == 1 && (m = "0" + m);
        let yyyymmdd = y + m + d;
        return yyyymmdd;
    }

    let date = yyyymmdd();
    let begin_date = date + " 00:00";
    let end_date = date + " 23:59";

    return predictions_url =
        "https://tidesandcurrents.noaa.gov/api/datagetter?begin_date=" +
        begin_date +
        "&end_date=" +
        end_date +
        "&station=1612340&product=predictions&datum=mllw&units=english&time_zone=lst&application=Web Services&format=json";

}

/**************************************************************************************************************************/
function buildObservedURL() {

    function yyyymmdd() {
        let x = new Date();
        let y = x.getFullYear().toString();
        let m = (x.getMonth() + 1).toString();
        let d = x.getDate().toString();
        d.length == 1 && (d = "0" + d);
        m.length == 1 && (m = "0" + m);
        let yyyymmdd = y + m + d;
        return yyyymmdd;
    }

    let date = yyyymmdd();
    let begin_date = date + " 00:00";
    let end_date = date + " 23:59";

    return observed_url =
        "https://tidesandcurrents.noaa.gov/api/datagetter?begin_date=" +
        begin_date +
        "&end_date=" +
        end_date +
        "&station=1612340&product=water_level&datum=mllw&units=english&time_zone=lst&application=Web Services&format=json";

}

function getTime(d) {
    //This bizarre handling of dates is because Date.parse() doesn't work properly in IE. 
    let str = d.replace(/-/g, ' ');
    let v = str.split(' ');
    let reassembled = v[0] + "-" + v[1] + "-" + v[2] + "T" + v[3];
    let parsed = Date.parse(reassembled);
    return myTime = new Date(parsed).getTime();

}

