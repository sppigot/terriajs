"use strict";
/**
 * Pre-canned colour ramps
 */
var colorMaps = function(){
    var self,
    red = "rgba(192, 57, 43,1.0)",
    blue = "rgba(52, 152, 219,1.0)",
    yellow = "rgba(241, 196, 15,1.0)",
    green = "rgba(46, 204, 113,1.0)",
    turquoise = "rgba(26, 188, 156,1.0)",
    purple = "rgba(155, 89, 182,1.0)",
    asphalt = "rgba(52, 73, 94,1.0)",
    concrete = "rgba(149, 165, 166,1.0)",

    redGreen, redBlue, redYellow, redPurple;

    function makeColorMap(){
        var args = Array.prototype.slice.call(arguments, 0);
        var map = args.map(function(el, index){
            var obj = {};
            obj["color"] = el;
            obj["offset"] = index/(this.length-1);
            return obj;
        }, args);
        return map;
    }

    redGreen = makeColorMap(red, green);
    redBlue = makeColorMap(red, green, yellow, turquoise, purple, blue);
    redYellow = makeColorMap(red, blue, turquoise, yellow);
    redPurple = makeColorMap(red, concrete, asphalt, purple);

    self = {
        redGreen: redGreen,
        redBlue: redBlue,
        redYellow: redYellow,
        redPurple: redPurple
    }

    return self;
};

console.log(colorMaps().redGreen);
console.log(colorMaps().redBlue);
console.log(colorMaps().redYellow);
console.log(colorMaps().redPurple);

module.exports = colorMaps;
