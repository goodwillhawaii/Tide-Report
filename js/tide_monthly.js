function loadMonthly() {

    const svg = d3
        .select("#tide_today")
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Title
    svg.append("text").attr("x", 4).attr("y", -9).text("High and Low Tides This Month").style("font-size", "16px").attr("alignment-baseline", "middle")

    // Handmade legend
    svg.append("circle").attr("cx", 0).attr("cy", height + 32).attr("r", 6).style("fill", "red")
    svg.append("text").attr("x", 10).attr("y", height + 33).text("Predicted Tide").style("font-size", "16px").attr("alignment-baseline", "middle")

    //DANGER ZONE (red square)
    svg
        .append("svg:rect")
        .attr("x", 0)
        .attr("y", 0)
        .attr("width", width)
        .attr("height", height * 0.25)
        .style("fill", "rgb(255, 127, 127)")
        .attr("opacity", 0.5);

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

    let predictions_url =
        "https://tidesandcurrents.noaa.gov/api/datagetter?begin_date=" +
        begin_date +
        "&end_date=" +
        end_date +
        "&station=1612340&product=predictions&datum=mllw&units=english&time_zone=lst&application=Web Services&interval=hilo&format=csv";

    d3.csv(
        predictions_url,

        function (d) {

            //This bizarre handling of dates is because Date.parse() doesn't work properly in IE. 
            let str = d["Date Time"].replace(/-/g, ' ');
            let v = str.split(' ');
            let reassembled = v[0] + "-" + v[1] + "-" + v[2] + "T" + v[3];
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
                        .tickFormat(d3.timeFormat("%m-%d"))
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

            //The path
            svg
                .append("path")
                .datum(data)
                .attr("fill", "none")
                .attr("stroke", "red")
                .attr("stroke-width", 1)
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

            let color = d3.scaleLinear()
                .domain([-0.5, 2.5])
                .range(["blue", "red"]);

            // Add data points!
            svg.selectAll(".dot")
                .data(data)
                .enter().append("circle")
                .attr("class", "dot")
                .attr("r", 5) // radius size, could map to another data dimension
                .attr("cx", function (d) { return x(d.time); })     // x position
                .attr("cy", function (d) { return y(d.value); })  // y position
                .attr('fill', function (d) { return color(d.value); })
                .on("mouseover", tipMouseover)
                .on("mouseout", tipMouseout);
        }

    );

    // it's invisible and its position/contents are defined during mouseover
    var tooltip = d3.select("body")
        .append("div")
        .style("position", "absolute")
        .style("z-index", "10")
        .style("visibility", "hidden")
        .text("a simple tooltip");

    // tooltip mouseover event handler
    var tipMouseover = function (d) {
        // var html = d.cereal + "<br/>" +
        //     "<span style='color:red;'>" + d.manufacturer + "</span><br/>" +
        //     "<b>" + d.sugar + "</b> sugar, <b/>" + d.calories + "</b> calories";

        // tooltip.html(html)
        //     .style("left", (d3.event.pageX + 15) + "px")
        //     .style("top", (d3.event.pageY - 28) + "px")
        //     .transition()
        //     .duration(200) // ms
        //     .style("opacity", .9) // started as 0!

    };

    // tooltip mouseout event handler
    var tipMouseout = function (d) {
        // tooltip.transition()
        //     .duration(300) // ms
        //     .style("opacity", 0); // don't care about position!
    };

}