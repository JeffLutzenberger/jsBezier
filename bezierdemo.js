'use strict';

var BezierDemo = function (canvas) {
    this.canvas = canvas;
    this.camera = new Camera(canvas);
    this.drawDt = 0;
    this.framerate = 30;
    this.currentDrawTime = 0;
    this.lastDrawTime = 0;
    this.paused = false;
    this.camera.setExtents(768, 1024);
    this.camera.setCenter(768 * 0.5, 1024 * 0.5);
    this.theta = 0;
    this.curvePoints = [];
    this.curveSegments = [];
    this.deltaS = 0.05;
    this.lastS = 0;
    this.controlPoints = {
        'quadratic' : [new Vector(100, 500),
                       new Vector(400, 100),
                       new Vector(700, 500)],
        'cubic' : [new Vector(100, 500),
                   new Vector(300, 100),
                   new Vector(500, 100),
                   new Vector(700, 500)],
        'quartic' : [new Vector(100, 500),
                     new Vector(300, 100),
                     new Vector(400, 800),
                     new Vector(600, 200),
                     new Vector(700, 400)],
        'quintic' : [new Vector(100, 500),
                     new Vector(300, 100),
                     new Vector(400, 800),
                     new Vector(600, 200),
                     new Vector(700, 400),
                     new Vector(500, 600)]
    };
    this.bezierOrder = 'cubic';
};

BezierDemo.prototype = {
    
    update: function (dt) {
        this.draw(dt);
    },

    reset: function () {
        this.theta = 0;
        this.curvePoints.length = 0;
        this.curveSegments.length = 0;
        this.lastS = - this.deltaS;
    },

    draw: function (dt) {
        if (this.paused) {
            return;
        }

        this.drawDt += dt;

        if (this.drawDt > this.framerate) {
            this.currentDrawTime = new Date().getTime();

            this.lastDrawTime = this.currentDrawTime;

            this.camera.reset('rgba(0,0,0,1.0)');

            this.camera.show();

            this.theta += dt / 1000;
            if (this.theta > Math.PI) {
                this.reset();
            }

            var s = Math.abs(Math.sin(this.theta));

            this.bezier(this.controlPoints[this.bezierOrder], s);
           
            this.drawDt = 0;
        }
    },

    /* Our bezier function. It starts by drawing the control points for the Bezier curve.
     * It then iteratively calculates and draws our interpolation points.
     */
    bezier: function (controlPts, s) {
        var pts = controlPts.slice(0),
            r = 6,
            w = 2,
            color = [255, 255, 0],
            alpha = 0.75,
            lines = [],
            i;

        while (pts.length > 1) {
            lines.length = 0;
            for (i = 0; i < pts.length; i += 1) {
                this.canvas.circle(pts[i].x, pts[i].y, r, color, alpha);
                if (i > 0) {
                    lines.push(new Line(pts[i - 1], pts[i]));
                }
            }
            pts.length = 0;
            for (i = 0; i < lines.length; i += 1) {
                this.canvas.line(lines[i].p1, lines[i].p2, w, color, alpha);
                pts.push(lines[i].interpolate(s));
            }
        }

        color = [0, 255, 0];
        //make sure we don't draw too many points or Bezier segments
        if (s - this.lastS >= this.deltaS) {
            this.lastS = s;
            this.curvePoints.push(new Vector(pts[0].x, pts[0].y));
        }
        this.canvas.circle(pts[0].x, pts[0].y, 1.5 * r, color, 1.0);
        for (i = 0; i < this.curvePoints.length; i += 1) {
            this.canvas.circle(this.curvePoints[i].x, this.curvePoints[i].y, 1.5 * r, color, 0.5);
            if (i > 0) {
                this.canvas.line(this.curvePoints[i - 1], this.curvePoints[i], 2 * w, color, 1.0);
            }
        }
    }
};
