const chartSize = {width: 1400, height: 680};
const margin = {left: 100, right: 10, top: 10, bottom: 50};

const width = chartSize.width - margin.left - margin.right;
const height = chartSize.height - margin.top - margin.bottom;
let _years;

const initChart = function () {
    const svg = d3
        .select("#world-population-chart svg")
        .attr("width", chartSize.width)
        .attr("height", chartSize.height);

    const populationGrowth = svg
        .append("g")
        .attr("class", "population-growth")
        .attr("transform", `translate(${margin.left},${margin.top})`);

    populationGrowth
        .append("text")
        .attr("class", "x-axis-label")
        .attr("x", width / 2)
        .attr("y", height + 140)
        .text("Time");

    populationGrowth
        .append("text")
        .attr("class", "y-axis-label")
        .attr("x", -height / 2)
        .attr("y", -60)
        .text("Close");

    populationGrowth.append("g").attr("class", "y-axis");

    populationGrowth
        .append("g")
        .attr("class", "x-axis")
        .attr("transform", `translate(0,${height})`);

    populationGrowth
        .selectAll(".x-axis text")
        .attr("x", -5)
        .attr("y", 10);
};

const updateChartData = function (populationData) {
    const startingYear = new Date(_.first(_years));
    const endingYear = new Date(_.last(_years));
    const svg = d3.select("#world-population-chart svg");
    const countryWiseHighestGrowth = _.map(populationData,(countryData)=>_.get(_.maxBy(
        countryData.populationGrowth,
        "population"
    ),"population",0))
    const maxYAxisValue = _.maxBy(countryWiseHighestGrowth);

    const y = d3
        .scaleLinear()
        .domain([0, maxYAxisValue])
        .range([height, 0]);

    const x = d3
        .scaleTime()
        .domain([startingYear, endingYear])
        .range([0, width]);

    svg.select(".y-axis-label").text("Close");

    const yAxis = d3.axisLeft(y).ticks(10);

    svg.select(".y-axis").call(yAxis);

    const xAxis = d3.axisBottom(x);

    svg.select(".x-axis").call(xAxis);

    const line = d3
        .line()
        .x(popGrowth => x(new Date(popGrowth.year)))
        .y(q => y(q.population));

    const populationGrowth = svg.append("g")
        .attr("class", "popGrowth")
        .selectAll("path")
        .data(populationData)
        .join("path")
        .attr("d", d => line(d.populationGrowth));


};


const hover = function (svg, path) {
    console.log("boo")
    // if ("ontouchstart" in document) svg
    //     .style("-webkit-tap-highlight-color", "transparent")
    //     .on("touchmove", moved)
    //     .on("touchstart", entered)
    //     .on("touchend", left)
    // else svg
    //     .on("mousemove", moved)
    //     .on("mouseenter", entered)
    //     .on("mouseleave", left);
    //
    // const dot = svg.append("g")
    //     .attr("display", "none");
    //
    // dot.append("circle")
    //     .attr("r", 2.5);
    //
    // dot.append("text")
    //     .style("font", "10px sans-serif")
    //     .attr("text-anchor", "middle")
    //     .attr("y", -8);
    //
    // function moved() {
    //   d3.event.preventDefault();
    //   const ym = y.invert(d3.event.layerY);
    //   const xm = x.invert(d3.event.layerX);
    //   const i1 = d3.bisectLeft(data.dates, xm, 1);
    //   const i0 = i1 - 1;
    //   const i = xm - data.dates[i0] > data.dates[i1] - xm ? i1 : i0;
    //   const s = data.series.reduce((a, b) => Math.abs(a.values[i] - ym) < Math.abs(b.values[i] - ym) ? a : b);
    //   path.attr("stroke", d => d === s ? null : "#ddd").filter(d => d === s).raise();
    //   dot.attr("transform", `translate(${x(data.dates[i])},${y(s.values[i])})`);
    //   dot.select("text").text(s.name);
    // }
    //
    // function entered() {
    //   path.style("mix-blend-mode", null).attr("stroke", "#ddd");
    //   dot.attr("display", null);
    // }
    //
    // function left() {
    //   path.style("mix-blend-mode", "multiply").attr("stroke", null);
    //   dot.attr("display", "none");
    // }
}
const parsePopulationGrowth = function (countryData) {
    if (!_years) _years = _.filter(_.keys(countryData), k => Number.isFinite(+k));
    countryData.populationGrowth = [];
    _.forEach(_years, year => {
            countryData[year] = +countryData[year]
            countryData.populationGrowth.push({
                year: year,
                population: +countryData[year]
            })
        }
    );
    return countryData;
};

const drawChart = function (populationData) {
    initChart();
    updateChartData(populationData);
};

const main = function () {
    d3.csv("public/data/populationData.csv", parsePopulationGrowth).then(
        drawChart
    );
};

window.onload = main;
