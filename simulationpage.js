'use strict';
/**
 * The gameboard controller is responsible for setting up a level and managing gameplay for
 * a level
 * */
var SimulationPage = function (canvas) {
    this.canvas = canvas;
    this.camera = new Camera(canvas);
    this.drawDt = 0;
    this.framerate = 30;
    this.currentDrawTime = 0;
    this.lastDrawTime = 0;
    this.camera.setExtents(768, 1024);
    this.camera.setCenter(768 * 0.5, 1024 * 0.5);
    this.theta = 0;
    this.curvePoints = [];
    this.curveSegments = [];
    this.deltaS = 0.05;
    this.lastS = 0;
};

SimulationPage.prototype = {
    
    update: function (dt) {
        this.draw(dt);
    },

    draw: function (dt) {
        this.drawDt += dt;

        if (this.drawDt > this.framerate) {
            this.currentDrawTime = new Date().getTime();

            this.lastDrawTime = this.currentDrawTime;

            this.camera.reset('rgba(0,0,0,1.0)');

            this.camera.show();

            var pts = [new Vector(100, 500),
                       new Vector(300, 100),
                       new Vector(500, 100),
                       new Vector(700, 500)],
                r = 8,
                w = 2,
                color = [255, 255, 0],
                i,
                lines = [],
                s;

            this.theta += dt / 1000;
            if (this.theta > Math.PI) {
                this.theta = 0;
                this.curvePoints.length = 0;
                this.lastS = -this.deltaS;
            }

            s = Math.abs(Math.sin(this.theta));

            //recursively draw our control point, interpolation points and lines
            while (pts.length > 1) {
                lines.length = 0;
                for (i = 0; i < pts.length; i += 1) {
                    this.canvas.circle(pts[i].x, pts[i].y, r, color, 1.0);
                    if (i > 0) {
                        lines.push(new Line(pts[i - 1], pts[i]));
                    }
                }
                pts.length = 0;
                for (i = 0; i < lines.length; i += 1) {
                    this.canvas.line(lines[i].p1, lines[i].p2, w, color, 1.0);
                    pts.push(lines[i].interpolate(s));
                }
            }

            color = [0, 255, 0];
            //make sure we don't draw too many points
            if (s - this.lastS >= this.deltaS) {
                this.lastS = s;
                this.curvePoints.push(new Vector(pts[0].x, pts[0].y));
            }
            this.canvas.circle(pts[0].x, pts[0].y, r, color, 1.0);
            for (i = 0; i < this.curvePoints.length; i += 1) {
                this.canvas.circle(this.curvePoints[i].x, this.curvePoints[i].y, r, color, 0.5);
                if (i > 0) {
                    this.canvas.line(this.curvePoints[i - 1], this.curvePoints[i], w, color, 1.0);
                }
            }

            this.drawDt = 0;
        }
    }
};
