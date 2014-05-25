'use strict';

var Line = function (p1, p2) {
    this.p1 = p1;
    this.p2 = p2;
};

Line.prototype = {

    /* get a point on the line from the parameter s */
    interpolate: function (s) {
        var x = this.p1.x + s * (this.p2.x - this.p1.x),
            y = this.p1.y + s * (this.p2.y - this.p1.y);
        return new Vector(x, y);
    }
};
