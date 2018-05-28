/*
var colorNodes = [
	{name:"tools", levels: ['#a6cee3', '#1f78b4']},
	{name:"learning ressources", levels: ['#b2df8a', '#33a02c']},
	{name:"training ressources", levels: ['#fb9a99', '#e31a1c']},
	{name:"inspiration", levels: ['#fdbf6f', '#ff7f00']}
]
*/

var colorNodes = [
	{name:"tools", levels: ['#a6cee3', '#7cbde9', '#51a7e1', '#1f78b4']},
	{name:"learning ressources", levels: ['#adebad', '#70db70', '#47d147']},
	{name:"training ressources", levels: ['#fb9a99','#ef7678', '#ea484b']},
	{name:"inspiration", levels: ['#fdbf6f', '#ffa64d', '#ff9933']}
]

var svg = d3.select("svg"),
    margin = 20,
    diameter = +svg.attr("width"),
    g = svg.append("g").attr("transform", "translate(" + diameter / 2 + "," + diameter / 2 + ")");

// TO CHANGE

var color = d3.scaleLinear()
    .domain([-1, 5])
    .range(["hsl(152,80%,80%)", "hsl(228,30%,40%)"])
    .interpolate(d3.interpolateHcl);

var pack = d3.pack()
    .size([diameter - margin, diameter - margin])
    .padding(2);

d3.json("data/ressources.json", function(error, root) {
  if (error) throw error;

  root = d3.hierarchy(root)
      .sum(function(d) { return d.size; })
      .sort(function(a, b) { return b.value - a.value; });

  var focus = root,
      nodes = pack(root).descendants(),
      view;

  var circle = g.selectAll("circle")
    .data(nodes)
    .enter().append("circle")
      .attr("class", function(d) { 
      	return d.parent ? d.children ? "node" : "node node--leaf" : "node node--root"; 
      })
      .style("fill", function(d) { 
      	//return d.children ? color(d.depth) : null; 
      	/*if (d.children == null) {
      		 //console.log("yolo");
      		 return getColorNode(getLevel1ParentName(d.ancestors()), 3);
      	}
      	else */ 
      	if (d.depth != 0) {
      		return getColorNode(getLevel1ParentName(d.ancestors()), d.depth);
      	}
      	else {
      		return "#f2f2f2";
      	}
      })
      .on("click", function(d) { 
		  	console.log(d3.select(this));
		  	console.log(d);
		  	//console.log(getColorNode(getLevel1ParentName(d.ancestors()), d.depth));
		  	//console.log(getLevel1ParentName(d.ancestors()));
		  	if (d3.select(this).classed("node--leaf")) {
		  	 	//console.log(d);
		  	 	//console.log("url " + d.data.url);
		  	 	console.log('open tab')
		        window.open(
		          d.data.url,
		          '_blank' // <- This is what makes it open in a new window.
		        );
		  	}
		  	else {
			  	if (focus !== d) {
			  		zoom(d), d3.event.stopPropagation(); 
			  	}
			}
      	});

  var text = g.selectAll("text")
    .data(nodes)
    .enter().append("text")
      //.attr("class", "label")
      .attr("class", function(d) { 
      	//console.log(d);
      	//console.log(d.parent ? d.children ? "node--label" : "node label--leaf" : "node label--root");
      	return d.parent ? d.children ? "node--label" : "node label--leaf" : "node label--root"; 
      })
      //.style("font-size", function(d) { return (d.data.size / 100) })
      .style("fill-opacity", function(d) { return d.parent === root ? 1 : 0; })
      .style("display", function(d) { return d.parent === root ? "inline" : "none"; })
      .text(function(d) { return d.data.name; });

  var node = g.selectAll("circle,text");

  svg
      //.style("background", color(-1))
      .style("background", "white")
      .on("click", function() { zoom(root); });

  zoomTo([root.x, root.y, root.r * 2 + margin]);

  function zoom(d) {
    var focus0 = focus; focus = d;

    var transition = d3.transition()
        .duration(d3.event.altKey ? 7500 : 750)
        .tween("zoom", function(d) {
          var i = d3.interpolateZoom(view, [focus.x, focus.y, focus.r * 2 + margin]);
          return function(t) { zoomTo(i(t)); };
        });

    transition.selectAll("text")
      .filter(function(d) { return d.parent === focus || this.style.display === "inline"; })
        .style("fill-opacity", function(d) { return d.parent === focus ? 1 : 0; })
        .on("start", function(d) { if (d.parent === focus) this.style.display = "inline"; })
        .on("end", function(d) { if (d.parent !== focus) this.style.display = "none"; });
  }

  function zoomTo(v) {
    var k = diameter / v[2]; view = v;
    node.attr("transform", function(d) { return "translate(" + (d.x - v[0]) * k + "," + (d.y - v[1]) * k + ")"; });
    circle.attr("r", function(d) { return d.r * k; });
  }
});


function getLevel1ParentName(arrayAncestors) {
	var name = "";
	for (i=0;i<arrayAncestors.length;i++){
		if ( arrayAncestors[i].depth == 1) {
			name = arrayAncestors[i].data.name;
			break;
		}
	}
	return name;
}

function getColorNode(name, depth) {
	 var level = depth - 1;
	 var color = "";
	 for (i=0;i<colorNodes.length;i++){
	 	if (colorNodes[i].name == name){
	 		color = colorNodes[i].levels[level];
	 		break;
	 	}
	 }
	 
	 return color;
}




