/**
 * Provides requestAnimationFrame in a cross browser way.
 * http://paulirish.com/
 */
if (!window.requestAnimationFrame) {

    window.requestAnimationFrame = ( function() {

          return  window.requestAnimationFrame       ||
                  window.webkitRequestAnimationFrame ||
                  window.mozRequestAnimationFrame    ||
                  window.oRequestAnimationFrame      ||
                  window.msRequestAnimationFrame     ||
                  function( callback ){
                    window.setTimeout(callback, 1000 / 60);
                  };
        })();
}


var ColorUtils = (function() {

    function randomRange(min, max) {
        return ((Math.random() * (max - min)) + min);
    }
    function hexToR(h) {
        return parseInt((cutHex(h)).substring(0,2),16);
    }
    function hexToG(h) {
        return parseInt((cutHex(h)).substring(2,4),16);
    }
    function hexToB(h) {
        return parseInt((cutHex(h)).substring(4,6),16);
    }
    function cutHex(h) {
        return (h.charAt(0)=="#") ? h.substring(1,7):h;
    }

    return {
        randomRange: randomRange,
        hexToR: hexToR,
        hexToG: hexToG,
        hexToB: hexToB,
        cutHex: cutHex
    };

}());

var ConnectedPoints = (function(){

    var backColor = '#FAFAFA';
    var lineColor = '#0000FF';
    var canvas;
    var c;
    var particleArray = [];

    function init(){
        canvas = document.getElementById("canvas");
        context = canvas.getContext("2d");
        context.canvas.width  = window.innerWidth;
        context.canvas.height = window.innerHeight;
    }

    function onWindowResize() {
        canvas = document.getElementById('canvas');
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }

    function onWindowClick() {
        document.getElementById('advise').style.display = 'none';
        particleArray.push(Particle.get());
        console.log(particleArray.length);
    }

    function draw(){

        context.clearRect(0,0,window.innerWidth,window.innerHeight);
        context.fillStyle = backColor;
        context.fillRect(0,0,window.innerWidth,window.innerHeight);

        for(var i=0; i<particleArray.length;i++){

            var particle = particleArray[i];

            context.beginPath();
            context.fillStyle = "rgba("+ColorUtils.hexToR(particle.color)+", "+ColorUtils.hexToG(particle.color)+", "+ColorUtils.hexToB(particle.color)+", "+particle.opacity+")";

            var radius = particle.size/2;
            context.arc(particle.x, particle.y, radius, 0, 2 * Math.PI, false);
            context.fill();
            context.closePath();

            particle.x = particle.x + particle.xSpeed;
            particle.y = particle.y + particle.ySpeed;

            for(var j=0; j<particleArray.length;j++){
                if(j!=i){
                    var particleFriend = particleArray[j];
                    context.lineWidth = 1;
                    context.beginPath();
                    context.moveTo(particle.x,particle.y);
                    context.lineTo(particleFriend.x ,particleFriend.y);
                    context.strokeStyle = lineColor;
                    context.stroke();
                }
            }

            if(particle.x > window.innerWidth+particle.size ||
                particle.y > window.innerHeight+particle.size ||
                particle.x < 0 ||
                particle.y < 0
            ){
                particleArray.splice(i,1);
            }
        }
    }

    return {
        init: init,
        draw: draw,
        onWindowResize: onWindowResize,
        onWindowClick: onWindowClick
    }

}());

var Particle = (function(){

    var velocity = 1;
    var opacity = 0.25;
    var size = 8;
    var color = "#0000FF";

    function get(){
        var particle = {};
        particle.x = ColorUtils.randomRange(0,window.innerWidth);
        particle.y = ColorUtils.randomRange(0,window.innerHeight);
        particle.xSpeed = ColorUtils.randomRange( (-1) * velocity , velocity);
        particle.ySpeed = ColorUtils.randomRange( (-1) * velocity , velocity);
        particle.color = color;
        particle.opacity = opacity;
        particle.size  = size;
        return particle;
    }

    return {
        get: get
    }

}());

var points;

window.onload = function() {
    ConnectedPoints.init();
    animate();
};

window.addEventListener('resize', ConnectedPoints.onWindowResize, false );
window.addEventListener('click', ConnectedPoints.onWindowClick, false );

function animate(){
    requestAnimationFrame(animate);
    ConnectedPoints.draw();
}
