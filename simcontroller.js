'use strict';

var SimulationController = function (canvas) {
    this.canvas = canvas;
    this.debug = false;
    this.clockrate = 10; //ms
    this.dt = 0;
    this.currentTime = 0;
    this.lastTime = 0;
    this.simulationPage = new SimulationPage(this.canvas);
    this.interval = setInterval(this.update.bind(this), this.clockrate);
};

SimulationController.prototype = {

    update: function () {
        this.currentTime = new Date().getTime();
        this.dt = this.currentTime - this.lastTime;
        this.lastTime = this.currentTime;
        this.simulationPage.update(this.dt);
    }
};
