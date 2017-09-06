
// CONFIG VARS
// =============================================================================

const width = 800;
const height = 600;
const padding = {
  left: 50,
  top: 10,
  right: 0,
  bottom: 100
};

// USEFUL FUNCTIONS FOR THE PLOT
// =============================================================================

function partisanScore(d) {
    return d.republicanReps / (d.democraticReps + d.republicanReps);
}

// SCALES
// =============================================================================

const incomeMin = d3.min(states, function(d) { return d.medianIncome; });
const incomeMax = d3.max(states, function(d) { return d.medianIncome; });

const colorScale = d3.scaleLinear()
    .domain([0,1])
    .range(["dodgerblue", "crimson"]);

const xScale = d3.scaleBand()
    .domain(states.map(d => d.name))
    .range([padding.left, width - padding.right])
    .padding(.1);
    
const yScale = d3.scaleLinear()
    .domain([incomeMin,incomeMax])
    .range([height - padding.top, padding.bottom]);

// INITIALIZE THE SVG
// =============================================================================

const svg = d3.select("body")
    .append("svg")
    .attr("width", width)
    .attr("height", height);

// ENTER-APPEND
// =============================================================================

let rects = svg.selectAll("rect")
   .data(states)
   .enter()
   .append("rect");

rects
    .attr("x", function(d) { return xScale(d.name); })
    .attr("width", xScale.bandwidth())
    .attr("y", height - padding.bottom)
    .attr("height", 10)
    .attr("fill", function(d) { return colorScale(partisanScore(d)); });
     
svg.append('g')
    .attr("transform", `translate(${padding.left},${-padding.bottom+padding.top})`)
    .call(d3.axisLeft(yScale))

svg.append('g')
    .attr("transform", `translate(0,${height - padding.bottom+padding.top})`)
    .call(d3.axisBottom(xScale))
    .selectAll("text")
    .attr("transform", "rotate(90) translate(10,-13)")
    .style("text-anchor", "start")

// TOOLTIP & EVENT HANDLING
// =============================================================================

var tooltipDiv = d3.select('body')
    .append("div")
    .attr('class', 'tooltip')
    .style("opacity", 0);

rects
    .on("mouseover", function(d) {
        // Setting the html inside of our div
        tooltipDiv.html("<p>" + d.medianIncome +"</p>");

        // Get the value of the height and width of the div
        // so that we can determine where to place it on the screen
        var width = parseInt(tooltipDiv.style("width"));
        var height = parseInt(tooltipDiv.style("height"));
        
        // Using absolute positioning, put the left side of the div
        // where the mouse is minus half of the width of the div
        // This essentially means the middle of the div will be positioned
        // where the mouse is on the x axis
        tooltipDiv.style("left", `${d3.event.pageX - (width / 2)}px`);

        // Position the y value for the top of the div above the mouse
        tooltipDiv.style("top", `${d3.event.pageY - height - 20}px`);

        // Making the div visible
        tooltipDiv.style("opacity", 1);
    })
    .on("mouseout", function() {
        // Hide the div on mouse out
        tooltipDiv.style("opacity", 0);
    })

// TRANSITIONS
// =============================================================================

// describes our transition.
// We can add a ease function here as well
var t = d3.transition()
    .duration(1000);

// Next, add our transition to rects and set the y and
// the height to the values that we want to visualize.
rects
    .transition(t)
    .ease(d3.easeExpOut) // setting a easeExpOut so it's not a linear animation
    .attr('y', d => yScale(d.medianIncome) - padding.bottom + padding.top )
    .attr('height', d => {
        return height - yScale(d.medianIncome);
    })

// =============================================================================
// =============================================================================

// For more reading, Mike Bostock has some incredible blog write ups:
//  * General Update Pattern: https://bl.ocks.org/mbostock/3808218
//  * Thinking with Joins: https://bost.ocks.org/mike/join/
//  * Working with transitions: https://bost.ocks.org/mike/transition/
