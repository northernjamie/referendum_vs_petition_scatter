var margin = { top: 50, right: 300, bottom: 50, left: 50 },
    outerWidth = 1200,
    outerHeight = 600,
    width = outerWidth - margin.left - margin.right,
    height = outerHeight - margin.top - margin.bottom;

var x = d3.scale.linear()
    .range([0, width]).nice();

var y = d3.scale.linear()
    .range([height, 0]).nice();

var xCat = "percsigned",
    yCat = "Remain",
    colorCat = "partyColour",
    legendEntries = [],
    areaLabel = "name";
    regionname = "regionname";
    regioncode = "regioncode";
    polParty = "polParty";
    mp = "mp";

var datasource = "data/ref_vs_petition_20190328180400.csv"
 
 function colour_party(col) { 
    if(col == "Conservative") {
        return "#0087DC"
 } else if (col == "Labour") {
        return "#DC241f"
 } else if (col == "Green Party") {
        return "#528D6B"
 } else if (col == "Democratic Unionist Party") {
        return "#D46A4C"
 } else if (col == "Independent") {
        return "#DDDDDD"
 } else if (col == "Liberal Democrat") {
        return "#FAA61A"
 } else if (col == "Plaid Cymru") {
        return "#008142"
 } else if (col == "Scottish National Party") {
        return "#FEF987"
 } else if (col == "Sinn Féin") {
        return "#326760"
 } else if (col == "Speaker") {
        return "#ffffff"
 } else if (col == "None") {
        return "#EEEEEE"
 }
         
}

var colour_region = d3.scale.category20();



function remove_spaces(text) {
  return text.replace(/\s/g,'')
}



function load_tool() {
console.log('function running:' + datasource);
d3.csv(datasource, function(data) {
  data.forEach(function(d) {
    d.percsigned = +d.percsigned;
    d.Remain = +d.Remain;
    d.partyColour = d.partyColour;
    d.regionname = d.EER17NM;
    d.regioncode = d.EER17CD;
    legendEntries.push({regioncode: d.EER17CD, regionname: d.EER17NM, });
    //partyLegendEntries.push({partycolour:d.partyColour, partyname: d.polParty, });
  });
  
  console.log(legendEntries[0].regionname);


var uniqueParty = data.map(function(d){ return d.polParty}).filter(function(value, index, self){
    return self.indexOf(value) === index;
});

var uniqueRegion = data.map(function(d){ return d.regionname}).filter(function(value, index, self){
    return self.indexOf(value) === index;
});

console.log(uniqueParty);

  var xMax = d3.max(data, function(d) { return d[xCat]; }) * 1.05,
      xMin = d3.min(data, function(d) { return d[xCat]; }),
      xMin = xMin > 0 ? 0 : xMin,
      yMax = d3.max(data, function(d) { return d[yCat]; }) * 1.05,
      yMin = d3.min(data, function(d) { return d[yCat]; }),
      yMin = yMin > 0 ? 0 : yMin

      

  x.domain([xMin, xMax]);
  y.domain([yMin, yMax]);
  xCatLabel = $('#x_select option:selected').text();
  yCatLabel = $('#y_select option:selected').text();

  var xAxis = d3.svg.axis()
      .scale(x)
      .orient("bottom")
      .tickSize(-height);

  var yAxis = d3.svg.axis()
      .scale(y)
      .orient("left")
      .tickSize(-width);

  var color = d3.scale.category10();

  var tip = d3.tip()
      .attr("class", "d3-tip")
      .offset([-10, 0])
      .html(function(d) {
        return '<h3>' + d[areaLabel] + '</h3><br>' + d[regionname] + '<br>' + d[polParty] + '<br>' + d[mp] + "<br>Signed petition: " + d[xCat].toFixed(1) + "%<br>Voted remain " + d[yCat] + "%<br>";
      });

  var zoomBeh = d3.behavior.zoom()
      .x(x)
      .y(y)
      .scaleExtent([0, 500])
      .on("zoom", zoom);

  var svg = d3.select("#scatter")
    .append("svg")
      .attr("width", outerWidth)
      .attr("height", outerHeight)
    .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
      .call(zoomBeh);

  svg.call(tip);

  svg.append("rect")
      .attr("width", width)
      .attr("height", height);

  svg.append("g")
      .classed("x axis", true)
      .attr("transform", "translate(0," + height + ")")
      .call(xAxis)
    .append("text")
      .classed("label", true)
      .attr("x", width)
      .attr("y", margin.bottom - 10)
      .style("text-anchor", "end")
      .text('% of electorate signing petition');

  svg.append("g")
      .classed("y axis", true)
      .call(yAxis)
    .append("text")
      .classed("label", true)
      .attr("transform", "rotate(-90)")
      .attr("y", -margin.left)
      .attr("dy", ".71em")
      .style("text-anchor", "end")
      .text('% of electorate voting to remain in EU');

  var objects = svg.append("svg")
      .classed("objects", true)
      .attr("width", width)
      .attr("height", height);

  objects.append("svg:line")
      .classed("axisLine hAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", width)
      .attr("y2", 0)
      .attr("transform", "translate(0," + height + ")");

  objects.append("svg:line")
      .classed("axisLine vAxisLine", true)
      .attr("x1", 0)
      .attr("y1", 0)
      .attr("x2", 0)
      .attr("y2", height);

  objects.selectAll(".dot")
      .data(data)
    .enter().append("circle")
      .attr("class", function(d) {
          var c = "";
          c = d["ons_code"];
          c += " dot";
          return c;
        })
      .attr("r", 5)
      .attr("transform", transform)
      .attr("id" , function(d) { return remove_spaces(d.regionname); } )
      .style("fill", function(d) {return colour_region(d.regionname);})
      .style("fill-opacity", 0.5)
      .style("stroke-width",2)
      .style("stroke-opacity",0)
      .style("stroke","#111")
      .on("mouseover", tip.show)
      .on("mouseout", tip.hide);
      

  
  var legend = svg.selectAll(".legend")
      .data(uniqueRegion)
      .enter()  
      .append("g")
      .classed("legend", true)
      .attr("transform", function(d, i) { return "translate(0," + i * 20 + ")"; });
      
  legend.append("text")
      .attr("x", width + 30)
      .attr("dy", ".35em")
      .attr("font-weight", "bold")
      .attr("id", function(d) {return remove_spaces(d) + 'ltext'})
      .text(function(d) {return d; });
      

  legend.append("circle")
      .attr("r", 8)
      .attr("cx", width + 20)
      .style("fill", function(d) {return colour_region(d)})
      .style("fill-opacity", 0.5)
      .style("stroke-width", 1)
      .style("stroke-opacity", 0.8)
      .style("stroke", '#111')
      .attr("id", function(d) {return remove_spaces(d); })
      .on("click", function (d, i) {
                      // register on click event
                      var lVisibility = this.style['fill-opacity']
                      var dnospace = remove_spaces(d)
                      ltvisibility = document.getElementById(dnospace + 'ltext').attributes['font-weight'].value;
                      filterGraph(dnospace, lVisibility, ltvisibility);
                   });

  
       

  d3.select("#pcon_sel").on("change", highlightpoint);

  

  function highlightpoint() {
      
      t_class = "." + d3.select("#pcon_sel").node().value;
    
      console.log(t_class)
      d3.selectAll(t_class)
      .transition()
      .duration(1000)
      .style("fill-opacity",1)
      .attr("r",50)
      .transition()
      .duration(1000)
      .attr("r",5)
      .style("fill-opacity",0.5)
   };

  function change() {
    xCat = d3.select("#x_select").node().value;
    yCat = d3.select("#y_select").node().value;
    rCat = d3.select("#r_select").node().value;
    xCatLabel = $('#x_select option:selected').text();
    yCatLabel = $('#y_select option:selected').text();
    rCatLabel = $('#r_select option:selected').text();
    console.log(xCatLabel);
    

    xMax = d3.max(data, function(d) { return d[xCat]; });
    xMin = d3.min(data, function(d) { return d[xCat]; });
    yMax = d3.max(data, function(d) { return d[yCat]; });
    yMin = d3.min(data, function(d) { return d[yCat]; });
    rMax = d3.max(data, function(d) { return d[rCat]; });
    rModifier = 1+(100/rMax);


    zoomBeh.x(x.domain([xMin, xMax])).y(y.domain([yMin, yMax]));

    var svg = d3.select("#scatter").transition();

    svg.select(".x.axis").duration(750).call(xAxis).select(".label").text(xCatLabel);
    svg.select(".y.axis").duration(750).call(yAxis).select(".label").text(yCatLabel);

    objects.selectAll(".dot")
        .transition().duration(1000)
        .attr("transform", transform)
        .attr("r", function (d) { return rModifier * Math.sqrt(d[rCat] / Math.PI); });
  }

  function zoom() {
    svg.select(".x.axis").call(xAxis);
    svg.select(".y.axis").call(yAxis);

    svg.selectAll(".dot")
        .attr("transform", transform);
  }

  function transform(d) {
    return "translate(" + x(d[xCat]) + "," + y(d[yCat]) + ")";
  }

  function highlightCircle (circle, strokeFlag) {
        if (strokeFlag == 0)
            {newStroke = 1}
          else {newStroke = 0};
        d3.selectAll("#" + circle).style("stroke-opacity", newStroke);
  }

  // Method to filter graph
    function filterGraph( aRegion, aVisibility, ltvisibility) {
        
          newOpacity = 0.5 - aVisibility ;
          
          if (ltvisibility == 'bold') 
            { newWeight = 'normal' }
          else { newWeight = 'bold'};

         
        // Hide or show the elements
        d3.selectAll("#" + aRegion).style("fill-opacity", newOpacity);
        d3.selectAll("#" + aRegion + "ltext").attr("font-weight", newWeight);
        
    }
  // function to highlight a selected point, chosen from a drop down

   
  


});

}

$( document ).ready(load_tool);

d3.select("#petition_sel").on("change", function() {
  console.log("Hello")
  var petition_version = d3.select("#petition_sel").node().value;
  console.log(petition_version)
  if (petition_version == 'petition_v1') {
    datasource  = "data/ref_vs_petition.csv"
     }
  else if (petition_version == 'petition_v2') {
    datasource = "data/ref_vs_petition_20190323212200.csv"
    }
  console.log(datasource)
  load_tool()
 
  });
 






