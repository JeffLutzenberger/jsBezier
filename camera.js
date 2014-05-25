'use strict';

var Camera = function (canvas) {
    this.canvas = canvas;
    this.viewport = new Vector(canvas.width, canvas.height);
    this.center = new Vector(0, 0);
    this.scaleConstant = 1;
    this.zoomFactor = 1;
    this.transition = false;
    this.startTransitionCenter = new Vector(this.center.x, this.center.y);
    this.endTransitionCenter = new Vector(this.center.x, this.center.y);
    this.startViewportSize = new Vector(this.viewport.x, this.viewport.y);
    this.endViewportSize = new Vector(this.viewport.x, this.viewport.y);
    this.zoomTime = 0;
};

Camera.prototype = {

    push: function () {
        this.canvas.ctx.save();
    },

    pop: function () {
        this.canvas.ctx.restore();
    },

    setExtents: function (w, h) {
        this.viewportWidth = w;
        this.viewportHeight = h;
        this.zoomFactor = this.canvas.width / w;
    },

    setZoom: function (x) {
        this.zoomFactor = x;
        this.viewportWidth = this.zoomFactor / this.canvas.width;
        this.viewportHeight = this.zoomFactor / this.canvas.height;
    },

    setCenter: function (x, y) {
        this.center.x = x;
        this.center.y = y;
    },

    show: function () {
        this.canvas.ctx.scale(this.zoomFactor, this.zoomFactor);
        this.canvas.ctx.translate(-this.center.x, -this.center.y);
    },

    reset: function (bgColor) {
        this.pop();
        this.canvas.clear(bgColor);
        this.push();
        //move the viewport center to 0,0
        this.canvas.ctx.translate(this.canvas.width * 0.5,
                                  this.canvas.height * 0.5);
    },

    startTransition: function (toCenter, toViewportSize, transitionTime) {
        this.zoomTransition = true;
        this.startTransitionCenter = new Vector(this.center.x, this.center.y);
        this.endTransitionCenter = new Vector(toCenter.x, toCenter.y);
        this.startViewportSize = new Vector(this.viewportWidth, this.viewportHeight);
        this.endViewportSize = new Vector(toViewportSize.x, toViewportSize.y);
        this.zoomTime = 0;
    },

    onZoomTransition: function (dt) {
        var duration = 500,
            centerDeltaX = this.finalZoomCenter.x - this.startZoomCenter.x,
            centerDeltaY = this.finalZoomCenter.y - this.startZoomCenter.y,
            extentDeltaX = this.finalZoomExtents.x - this.startZoomExtents.x,
            extentDeltaY = this.finalZoomExtents.y - this.startZoomExtents.y,
            x,
            y;
        //when this.zoomTime = duration we should be fully transitioned
        if (this.zoomTime > duration) {
            this.zoomTime = duration;
            this.zoomTransition = false;
        }
        x = this.zoomTime / duration * centerDeltaX + this.startZoomCenter.x;
        y = this.zoomTime / duration * centerDeltaY + this.startZoomCenter.y;
        this.camera.setCenter(x, y);
        x = this.zoomTime / duration * extentDeltaX + this.startZoomExtents.x;
        y = this.zoomTime / duration * extentDeltaY + this.startZoomExtents.y;
        this.camera.setExtents(x, y);
        this.zoomTime += dt;
    },

    screenToWorld: function (x, y) {
        //screen for canvas is 0, 0 with y down
        //our world coords are also y down
        var upperleftx = this.center.x - this.viewportWidth * 0.5,
            upperlefty = this.center.y - this.viewportHeight * 0.5,
            x1 = x / this.canvas.width * this.viewportWidth + upperleftx,
            y1 = y / this.canvas.height * this.viewportHeight + upperlefty;
        return new Vector(x1, y1);
    }
};

