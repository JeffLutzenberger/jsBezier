'use strict';

var SimulationController = function (canvas) {
    this.canvas = canvas;
    this.debug = false;
    this.clockrate = 10; //ms
    this.dt = 0;
    this.currentTime = 0;
    this.lastTime = 0;
    this.bezierDemo = new BezierDemo(this.canvas);
    this.interval = setInterval(this.update.bind(this), this.clockrate);
    this.showUI();
};

SimulationController.prototype = {

    update: function () {
        this.currentTime = new Date().getTime();
        this.dt = this.currentTime - this.lastTime;
        this.lastTime = this.currentTime;
        this.bezierDemo.update(this.dt);
    },

    showUI: function () {
        var val;
  
        $("#editor").append('<input id="pause-button" type="button" value="Pause">').button();
        $("#pause-button").click($.proxy(function () {
            this.togglePause();
            //this.addBucket();
        }, this));

        $("#pause-button").css({ width: '120px'});
        
        $("#editor").append('&nbsp;&nbsp;Bezier Order: <select id="bezier-order"></select><br>');
        $("#bezier-order").append('<option value=quadratic>quadratic</option>');
        $("#bezier-order").append('<option value=cubic>cubic</option>');
        $("#bezier-order").append('<option value=quartic>quartic</option>');
        $("#bezier-order").append('<option value=quintic>quintic</option>');
        $("#bezier-order").val(this.bezierDemo.bezierOrder);
        $("#bezier-order").change($.proxy(function () {
            val = $("#bezier-order option:selected").text();
            this.bezierDemo.bezierOrder = val;
            this.bezierDemo.reset();
        }, this));
    },

    togglePause: function () {
        if(this.bezierDemo.paused) {
            $("#pause-button").prop('value', 'Pause');
            this.bezierDemo.paused = false;
        } else {
            $("#pause-button").prop('value', 'Play');
            this.bezierDemo.paused = true;
        }
    }
};
