# anchor-voronoi
Some hacks toward clicking links on webpages with minimal effort.

Currently: 
* eval the contents of [`av.js`](av.js) on a page that has [`d3.js`](http://mbostock.github.com/d3/d3.js) already on it
* focus on `<body>` and press any key to toggle a Voronoi-diagram overlay based on all `<a>` tags on the page:

![](http://f.cl.ly/items/392k1S0r0M000R2y2q3l/Screen%20Recording%202015-04-27%20at%2012.39%20PM.gif)

Clicking on selected region follows that link.
