function loadDaily(margin) {

    const svg = d3
        .select("#tide_today")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Title
    svg.append("text").attr("x", 4).attr("y", -9).text("Tide Today").style("font-size", "16px").attr("alignment-baseline", "middle")

    // Handmade legend
    svg.append("circle").attr("cx", 0).attr("cy", height + 32).attr("r", 6).style("fill", "red")
    svg.append("text").attr("x", 10).attr("y", height + 33).text("Predicted Tide").style("font-size", "16px").attr("alignment-baseline", "middle")

    svg.append("circle").attr("cx", 130).attr("cy", height + 32).attr("r", 6).style("fill", "steelblue")
    svg.append("text").attr("x", 140).attr("y", height + 33).text("Observed Tide").style("font-size", "16px").attr("alignment-baseline", "middle")

    //DANGER ZONE (red square)
    svg
        .append("svg:rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height * 0.25)
        .style("fill", "rgb(255, 127, 127)")
        .attr("opacity", 0.5);

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

    function map(n, start1, stop1, start2, stop2) {
        let newval = ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
        return newval;
    }

    let date = yyyymmdd();
    let begin_date = date + " 00:00";
    let end_date = date + " 23:59";

    let water_level_url =
        "https://tidesandcurrents.noaa.gov/api/datagetter?begin_date=" +
        begin_date +
        "&end_date=" +
        end_date +
        "&station=1612340&product=water_level&datum=mllw&units=english&time_zone=lst&application=Web Services&format=csv";

    let predictions_url =
        "https://tidesandcurrents.noaa.gov/api/datagetter?begin_date=" +
        begin_date +
        "&end_date=" +
        end_date +
        "&station=1612340&product=predictions&datum=mllw&units=english&time_zone=lst&application=Web Services&format=csv";

    let prediction_points = 240; //hard-coded, assuming there is always a measurement every 6 minutes

    d3.csv(
        predictions_url,

        function (d) {
            //This bizarre handling of dates is because Date.parse() doesn't work properly in IE. 
            let str = d["Date Time"].replace(/-/g, ' ');
            var v = str.split(' ');
            var reassembled = v[0] + "-" + v[1] + "-" + v[2] + "T" + v[3];
            let parsed = Date.parse(reassembled);
            let myTime = new Date(parsed).getTime();
            let myValue = d[" Prediction"];
            return { time: myTime, value: myValue };
        },

        function (data) {
            let x = d3
                .scaleTime()
                .domain(
                    d3.extent(data, function (d) {
                        return d.time;
                    })
                )
                .range([0, width]);

            let xAxis = svg
                .append("g")
                .attr("transform", "translate(0," + height + ")")
                .call(
                    d3
                        .axisBottom(x)
                        .ticks(24)
                        .tickSize(-height)
                        .tickFormat(d3.timeFormat("%I:%M"))
                );

            xAxis.selectAll("line").style("stroke", "rgb(127,127,127)");

            let y = d3
                .scaleLinear()
                .domain([-1, 3])
                .range([height, 0]);

            let yAxis = svg.append("g").call(
                d3
                    .axisLeft(y)
                    .ticks(6)
                    .tickSize(-width)
            );

            yAxis.selectAll("line").style("stroke", "rgb(127,127,127)");

            svg
                .append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 2)
                .attr(
                    "d",
                    d3
                        .line()
                        .x(function (d) {
                            return x(d.time);
                        })
                        .y(function (d) {
                            return y(d.value);
                        })
                );
        }

    );

    //Actual water level readings
    d3.csv(
        water_level_url,

        function (d) {
            //This bizarre handling of dates is because Date.parse() doesn't work properly in IE. 
            let str = d["Date Time"].replace(/-/g, ' ');
            let v = str.split(' ');
            let reassembled = v[0] + "-" + v[1] + "-" + v[2] + "T" + v[3];
            let parsed = Date.parse(reassembled);
            let myTime = new Date(parsed).getTime();
            let myValue = d[" Water Level"];
            return { time: myTime, value: myValue };
        },

        function (data) {
            let x = d3
                .scaleTime()
                .domain(
                    d3.extent(data, function (d) {
                        return d.time;
                    })
                )
                .range([0, map(data.length, 0, prediction_points, 0, width)]);

            let y = d3
                .scaleLinear()
                .domain([-1, 3])
                .range([height, 0]);

            svg
                .append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "steelblue")
                .attr("stroke-width", 2)
                .attr(
                    "d",
                    d3
                        .line()
                        .x(function (d) {
                            return x(d.time);
                        })
                        .y(function (d) {
                            return y(d.value);
                        })
                );
        }
    );
}