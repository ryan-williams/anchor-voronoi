

var anchors = Array.prototype.slice.call(document.getElementsByTagName('a'));

var body = d3.select('body');
var debug = false;

function pp(p) {
  return '(' + parseInt(p[0]) + ',' + parseInt(p[1]) + ')';
}

var mX = 0, mY = 0;
body.on('mousemove', function() {
  var e = d3.event;
  mX = e.pageX;
  mY = e.pageY;
  if (debug) {
    console.log('e: %O, %d,%d', e, mX, mY);
  }
});

var svg = body.append('svg:svg')
            .attr('width','100%')
            .attr('height','100%')
            .style('position', 'fixed')
            .style('top','0px')
            .style('left', '0px')
            .attr('id', 'cv')
;

var svgBB = svg[0][0].getBoundingClientRect();

svg.style('display', 'none');
var svgVisible = false;

var ps = anchors.map(function(a) {
  return a.getBoundingClientRect();
}).map(function(rect) {
  return [rect.left + rect.width/2 - svgBB.left, rect.top + rect.height/2 - svgBB.top];
});

var v = d3.geom.voronoi(ps);

svg.selectAll('path')
      .data(v)
      .enter()
      .append('svg:path')
      .attr('d', function(d) {
        return "M" + d.join(',') + "Z";
      }).attr('id', function(d,i) {
        return "path-"+i;
      }).style("fill", d3.rgb(230,230,230))
      .style("fill-opacity",0.4)
      .style("stroke",d3.rgb(200,200,200))
      .on('mouseover', function(d,i) {
        svg.selectAll('path').style('fill', d3.rgb(230,230,230));
        d3.select(this).style('fill', d3.rgb(31, 120, 180));
        console.log("mouseover: %O", this);
      }).on('mouseout', function(d,i) {
        d3.select(this).style('fill', d3.rgb(230,230,230));
        console.log("mouseout: %O", this);
      }).on('click', function(d, i) {
        console.log("click! %d %O", i, anchors[i]);
        anchors[i].click();
      });
;

var paths = svg.selectAll('path');

function pointInPolygon(point, vs) {
  // ray-casting algorithm based on
  // http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
  var xi, xj, i, intersect,
        x = point[0],
        y = point[1],
        inside = false;
  for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
    xi = vs[i][0],
          yi = vs[i][1],
          xj = vs[j][0],
          yj = vs[j][1],
          intersect = ((yi > y) != (yj > y))
          && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
    if (intersect) inside = !inside;
  }
  return inside;
}

function toggleSvg(force) {
  if (force !== undefined) {
    svgVisible = !force;
  }
  if (svgVisible) {
    svg.selectAll('path').style('fill', d3.rgb(230,230,230));
    svg.style('display','none');
  } else {
    svg.style('display','');

    var x = mX - svgBB.left;
    var y = mY - svgBB.top;
    d3.selectAll('path').filter(function(d, i) {
      var r = pointInPolygon([ x, y ], d);
      return r;
    }).style('fill', d3.rgb(31, 120, 180));
  }
  svgVisible = !svgVisible;
}


body.on('keyup', function() {
  console.log('event: %O', d3.event);
  if (d3.event.keyCode != 75) {
    toggleSvg();
  }
});

//chrome.commands.onCommand.addListener(function(command) {
//  console.log('Command:', command);
//});
