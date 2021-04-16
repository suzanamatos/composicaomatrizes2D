var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var textarea = document.getElementById("code");
var code = textarea.value;
//definindo tipo de geometria
const circle = 0;
const box = 1;
const butterfly = 2;

//matriz de transformação de canvas para sistema de coordenadas usual
M = transformCanvas(canvas.width, canvas.height);
M2 = transformToSystem(canvas.width, canvas.height);
var show_points = true;
var object;

var pointsData = []

var boxData = [
    {"x":0.2,
     "y":0.2},
    {"x":0.2,
     "y":-0.2},
    {"x":-0.2,
     "y":-0.2},
    {"x":-0.2,
     "y":0.2}]
     
var butterflyData = [
    {"x":0.4489,
     "y":0.50301},
    {"x":0.40882,
     "y":0.52505},
    {"x":0.36673,
     "y":0.53908},
    {"x":0.32265,
     "y":0.54309},
    {"x":0.28858,
     "y":0.55711},
    {"x":0.33267,
     "y":0.55511},
    {"x":0.37876,
     "y":0.54509},
    {"x":0.42485,
     "y":0.53106},
    {"x":0.45892,
     "y":0.53908},
    {"x":0.43287,
     "y":0.58116},
    {"x":0.41483,
     "y":0.62325},
    {"x":0.3988,
     "y":0.66934},
    {"x":0.41683,
     "y":0.6513},
    {"x":0.43086,
     "y":0.60521},
    {"x":0.45291,
     "y":0.56112},
    {"x":0.48096,
     "y":0.52906},
    {"x":0.51503,
     "y":0.52305},
    {"x":0.51303,
     "y":0.56914},
    {"x":0.51503,
     "y":0.61122},
    {"x":0.51503,
     "y":0.65731},
    {"x":0.51703,
     "y":0.70341},
    {"x":0.52705,
     "y":0.74749},
    {"x":0.53707,
     "y":0.79359},
    {"x":0.55311,
     "y":0.83968},
    {"x":0.57315,
     "y":0.88176},
    {"x":0.59319,
     "y":0.92385},
    {"x":0.62525,
     "y":0.96393},
    {"x":0.67134,
     "y":1},
    {"x":0.71343,
     "y":0.98597},
    {"x":0.73547,
     "y":0.93988},
    {"x":0.74349,
     "y":0.89379},
    {"x":0.7515,
     "y":0.8477},
    {"x":0.76553,
     "y":0.8016},
    {"x":0.78357,
     "y":0.75952},
    {"x":0.81162,
     "y":0.71944},
    {"x":0.83367,
     "y":0.67936},
    {"x":0.82966,
     "y":0.63327},
    {"x":0.83567,
     "y":0.6012},
    {"x":0.87776,
     "y":0.58918},
    {"x":0.8978,
     "y":0.55711},
    {"x":0.90982,
     "y":0.51904},
    {"x":0.91383,
     "y":0.48096},
    {"x":0.92385,
     "y":0.43888},
    {"x":0.91784,
     "y":0.4008},
    {"x":0.96393,
     "y":0.38076},
    {"x":0.97595,
     "y":0.35471},
    {"x":0.93186,
     "y":0.37475},
    {"x":0.8998,
     "y":0.35671},
    {"x":0.88778,
     "y":0.31463},
    {"x":0.92986,
     "y":0.28657},
    {"x":0.97595,
     "y":0.26854},
    {"x":0.9479,
     "y":0.25852},
    {"x":0.9018,
     "y":0.28257},
    {"x":0.85772,
     "y":0.28257},
    {"x":0.81363,
     "y":0.26453},
    {"x":0.76754,
     "y":0.26854},
    {"x":0.72946,
     "y":0.28858},
    {"x":0.68938,
     "y":0.31663},
    {"x":0.67335,
     "y":0.30261},
    {"x":0.70942,
     "y":0.26052},
    {"x":0.73146,
     "y":0.21844},
    {"x":0.73547,
     "y":0.17234},
    {"x":0.72144,
     "y":0.12625},
    {"x":0.74148,
     "y":0.08016},
    {"x":0.77154,
     "y":0.038076},
    {"x":0.74549,
     "y":0.038076},
    {"x":0.71944,
     "y":0.082164},
    {"x":0.67535,
     "y":0.10421},
    {"x":0.63727,
     "y":0.084168},
    {"x":0.64529,
     "y":0.04008},
    {"x":0.65331,
     "y":0},
    {"x":0.62325,
     "y":0.042084},
    {"x":0.58116,
     "y":0.064128},
    {"x":0.54709,
     "y":0.058116},
    {"x":0.50501,
     "y":0.054108},
    {"x":0.46493,
     "y":0.068136},
    {"x":0.42285,
     "y":0.084168},
    {"x":0.40281,
     "y":0.11222},
    {"x":0.40681,
     "y":0.13427},
    {"x":0.38277,
     "y":0.14629},
    {"x":0.33868,
     "y":0.13427},
    {"x":0.29659,
     "y":0.1483},
    {"x":0.25651,
     "y":0.16834},
    {"x":0.21443,
     "y":0.19038},
    {"x":0.16834,
     "y":0.2004},
    {"x":0.12224,
     "y":0.20641},
    {"x":0.076152,
     "y":0.21042},
    {"x":0.03006,
     "y":0.22445},
    {"x":0,
     "y":0.25451},
    {"x":0.006012,
     "y":0.29659},
    {"x":0.04008,
     "y":0.33667},
    {"x":0.078156,
     "y":0.36874},
    {"x":0.11824,
     "y":0.39479},
    {"x":0.16433,
     "y":0.41283},
    {"x":0.20842,
     "y":0.42886},
    {"x":0.25251,
     "y":0.44289},
    {"x":0.29659,
     "y":0.4489},
    {"x":0.34269,
     "y":0.45691},
    {"x":0.38878,
     "y":0.45892},
    {"x":0.43487,
     "y":0.46092},
    {"x":0.45892,
     "y":0.47695},
    {"x":0.4489,
     "y":0.50301}]



function addData(data, points) {
	for (var i = 0; i < data.length; i++) {
		points.push([data[i].x*100,data[i].y*100,0,1]);
	}
}


function changeObject(geo){
	object.geometry = geo;
}

function apply(m){
    //console.log(m.length);
    if(m.length == 3){
        m[0].push(0);
        m[0][3] = m[0][2];
        m[0][2] = 0;
        m[1].push(0);
        m[1][3] = m[1][2];
        m[1][2] = 0;
        m[2].push(0);
        m.push([0,0,0,1]);
    }
    else if(m.length == 2){
        m[0].push(0);
        m[0].push(0);
        m[1].push(0);
        m[1].push(0);
        m.push([0,0,1,0]);
        m.push([0,0,0,1]);
    }
    //console.log(m);
    TC = multMatrix(m,TC);
}

function drawAxis() {
    ctx.strokeStyle = "#557571";
    ctx.beginPath();
    ctx.lineWidth = 0.5;
    ctx.moveTo(0, canvas.height / 2);
    ctx.lineTo(canvas.width, canvas.height / 2);
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(canvas.width / 2, 0);
    ctx.lineTo(canvas.width / 2, canvas.height);
    ctx.stroke();
    ctx.lineWidth = 0.25;
    ctx.strokeStyle = "#767c77"
    for(var i = canvas.height ; i>= 0;i=i-10){
        ctx.beginPath();
        ctx.moveTo(0, i);
        ctx.lineTo(canvas.width, i);
        ctx.stroke();
       
    }
    for(var i = canvas.width ; i>= 0;i=i-10){
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i, canvas.height);
        ctx.stroke();
    }
    ctx.lineWidth = 1.5;
}



function Shape() {
    this.geometry = circle;
    this.name = "";
}

function Shape(name) {
    this.geometry = circle;
    this.name = name;
}


Number.prototype.round = function(p) {
    p = p || 10;
    return parseFloat( this.toFixed(p) );
};

Shape.prototype.draw = function () {

    //verifica se a geometria é um círculo
    if (this.geometry == circle) {
        var step = 0.1;
        var x0 = 0; //x inicial
        var h0 = 0; //y inicial
        var r = 15; //raio inicial

        ctx.strokeStyle = "#851e52";
        ctx.beginPath(); //tell canvas to start a set of lines

        for (var theta = 0; theta < 2 * Math.PI; theta += step) {
            //ponto da borda do círculo
            var x = x0 + r * Math.cos(theta);
            var y = h0 - r * Math.sin(theta);
            //tranformando os vértices
            var vertex = multVec(TC,[x,y,0,1]);
            //transformando para coordenadas do canvas
            vertex = multVec(M,[vertex.x, vertex.y,vertex.z, 1])
            ctx.lineTo(vertex.x, vertex.y);
        }
        ctx.closePath(); //close the end to the start point
        ctx.stroke(); //actually draw the accumulated lines
        ctx.fill();
    }
    else
    {
        points = []
	    if (this.geometry == box) {
	    	show_points = true;
    		addData(boxData, points);
    	}else if (this.geometry == butterfly) {
    		show_points = false;
			addData(butterflyData, points);
		}

		ctx.strokeStyle = "#dd2c00";
		ctx.beginPath(); //tell canvas to start a set of lines

		for (var i=0; i<points.length; i++) 
		{
		    //tranformando os vértices
		    var vertex = multVec(TC,points[i]);
            if(show_points){
                ctx.fillStyle = "#1b262c";
                ctx.fillText("p"+i+": ("+vertex.x.round(2)+","+vertex.y.round(2)+")", 10, canvas.height-40+i*10);
            }
		    //transformando para coordenadas do canvas
		    vertex = multVec(M, [vertex.x, vertex.y, vertex.z, 1])
		    ctx.lineTo(vertex.x, vertex.y);
		    vertex = multVec(TC,points[(i+1)%points.length]);
		    //transformando para coordenadas do canvas
		    vertex = multVec(M, [vertex.x, vertex.y,vertex.z, 1])
		    ctx.lineTo(vertex.x, vertex.y);
		}
		ctx.closePath(); //close the end to the start point
		ctx.stroke(); //actually draw the accumulated lines
		var vertex = multVec(TC,points[0]);
		
		if(vertex.z>=0){
		    ctx.fillStyle = "#febf63";
		}else{
		    ctx.fillStyle = "#ffc7c7";
		}
		
		
		ctx.fill();    
    }
    
    
}


var fps = 60;
function drawCanvas() {
    setTimeout(function() {
        requestAnimationFrame(drawCanvas);
	    ctx.clearRect(0, 0, canvas.width, canvas.height);
	    ctx.setTransform(1, 0, 0, 1, 0, 0);
	    drawAxis();
	    object = new Shape("Object");
	    object.geometry = box;
	    
	    TC = identity();
	    eval(textarea.value);
	    object.draw();

    
    }, 1000 / fps);
}

textarea.addEventListener("input", drawCanvas);
window.addEventListener("load", drawCanvas);
