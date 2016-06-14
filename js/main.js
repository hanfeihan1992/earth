var planet = planetaryjs.planet();
var canvas = document.getElementById('globe');
canvas.width  = window.innerWidth;
canvas.height = window.innerHeight;
planet.loadPlugin(planetaryjs.plugins.earth({
    topojson: { file:   'js/world-110m.json' },
    oceans:   { fill:   '#001320' },
    land:     { fill:   '#06304e' },
    borders:  { stroke: '#001320' }
}));
planet.projection.scale(window.innerHeight/2-20).translate([window.innerWidth/2, window.innerHeight/2]).rotate([250, -20, 0]);
var autoRotate = function(degreesPerTick) {
    return function(planet) {
        var paused = false;
        planet.plugins.autoRotate = {
            pause:  function() { paused = true;  },
            resume: function() { paused = false; },
            ispaused: function() { return paused;}
        };
        planet.onDraw(function() {
            if (!paused) {
                var rotation = planet.projection.rotate();
                rotation[0] += degreesPerTick;
                if (rotation[0] >= 180) rotation[0] -= 360;
                planet.projection.rotate(rotation);
            }
        });
    };
};
planet.loadPlugin(autoRotate(0.3));
planet.loadPlugin(planetaryjs.plugins.zoom({
    scaleExtent: [50, 5000]
}));
planet.loadPlugin(planetaryjs.plugins.drag({
    onDragStart: function() {
        this.plugins.autoRotate.pause();
    },
    onDragEnd: function() {
        this.plugins.autoRotate.resume();
    }
}));
planet.loadPlugin(planetaryjs.plugins.pings());
planet.draw(canvas);


//var colors = ['red', 'yellow', 'white', 'orange', 'green', 'cyan', 'pink'];
setInterval(function() {
    var url = '/data.php?num=15';
    $.getJSON(url, function(data){
        $('ul#ip').empty();
        $('ul#address').empty();
        $.each(data, function(i,item){
            var keys = item.split(',');
            var x = keys[1];
            var y = keys[2];
            var ip = keys[0];
            var address = keys[3];
            planet.plugins.pings.add(x, y, { color: 'red', ttl: 20000, angle: 3 });
            var htmlIp = '<li class="list-group-item">' + ip + '</li>';
            $('ul#ip').append(htmlIp);
            var htmlAddress = '<li class="list-group-item" style="text-align:right;">' + address + '</li>';
            $('ul#address').append(htmlAddress);
        });
    });
},2000);

$(document).keydown(function(event){ 
if(event.keyCode == 32){
    var paused = planet.plugins.autoRotate.ispaused();
    if (paused == false){
        planet.projection.rotate([250, -20, 0]);
        planet.plugins.autoRotate.pause();
    } else if (paused == true){
        planet.plugins.autoRotate.resume();
    }
}}); 
