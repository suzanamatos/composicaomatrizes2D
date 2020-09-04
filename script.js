var canvas = document.getElementById("canvas");
var ctx = canvas.getContext("2d");
var textarea = document.getElementById("code");
var code = textarea.value;
//definindo tipo de geometria
const circle = 0;
const box = 1;

var p = null; //ponto de click
//matriz de transformação de canvas para sistema de coordenadas usual
M = transformCanvas(canvas.width, canvas.height);
M2 = transformToSystem(canvas.width, canvas.height);
TC = identity();
var show_points = false;
var colorintersection = false;

var hit = null;




function apply(m){
    //console.log(M.length);
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
    //console.log(M.length);
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
    this.translate = new Vec3(0,0,0);
    this.scale = new Vec3(0,0,0);
    this.rotate = new Vec3(0,0,0);
}

function Shape(name) {
    this.geometry = circle;
    this.name = name;
    this.translate = new Vec3(0,0,0);
    this.scale = new Vec3(0,0,0);
    this.rotate = new Vec3(0,0,0);
}

Shape.prototype.setScale = function (x = 0, y = 0, z = 0) {
    this.scale = new Vec3(x, y, z);
}

Shape.prototype.setTranslate = function (x = 0, y = 0, z = 0) {
    this.translate = new Vec3(x, y, z);
}

Shape.prototype.setRotateX = function (angle) {
    this.rotate.x = angle; 
}

Shape.prototype.setRotateY = function (angle) {
    this.rotate.y = angle; 
}

Shape.prototype.setRotateZ = function (angle) {
    this.rotate.z = angle; 
}

Shape.prototype.testIntersection = function () {
    var Ti = translateMatrixI(this.translate.x,this.translate.y,this.translate.z); //TODO: modificar para receber a matriz de escala
    //console.log(this.rotate.z);
    var Ri = multMatrix(rotateMatrixXI(this.rotate.x),multMatrix(rotateMatrixYI(this.rotate.y),rotateMatrixZI(this.rotate.z))); //TODO: modificar para receber a matriz de rotação
    var Si = scaleMatrixI(this.scale.x, this.scale.y, this.scale.z);
    var Ci = multMatrix(Si, multMatrix(Ri, Ti));

    var pl = multVec(Ci,[p.x,p.y,0,1]);
    if(pl.x*pl.x+pl.y*pl.y<=1){
        console.log("interceptou!");
    }else{
        console.log("não interceptou!");
    }

    //verifica se a geometria é um círculo
    if (this.geometry == circle) {
        var step = 0.1;
        var x0 = 0; //x inicial
        var h0 = 0; //y inicial
        var r = 1; //raio inicial

        ctx.strokeStyle = "#851e52";
        ctx.beginPath(); //tell canvas to start a set of lines

        for (var theta = 0; theta < 2 * Math.PI; theta += step) {
            //ponto da borda do círculo
            var x = x0 + r * Math.cos(theta);
            var y = h0 - r * Math.sin(theta);
            //tranformando os vértices
            var vertex = multVec(C,[x,y,0,1]);
            //transformando para coordenadas do canvas
            vertex = multVec(M,[vertex.x, vertex.y,vertex.z, 1])
            ctx.lineTo(vertex.x, vertex.y);
        }
        ctx.closePath(); //close the end to the start point
        ctx.stroke(); //actually draw the accumulated lines
        if(!colorintersection){
            ctx.fillStyle = "#f7d3ba";
        }
        ctx.fill();
    }

}
Number.prototype.round = function(p) {
    p = p || 10;
    return parseFloat( this.toFixed(p) );
  };

Shape.prototype.draw = function () {
    var T = translateMatrix(this.translate.x,this.translate.y,this.translate.z); //TODO: modificar para receber a matriz de escala
    //console.log(this.rotate.z);
    var R = multMatrix(rotateMatrixX(this.rotate.x),multMatrix(rotateMatrixY(this.rotate.y),rotateMatrixZ(this.rotate.z))); //TODO: modificar para receber a matriz de rotação
    var S = scaleMatrix(this.scale.x, this.scale.y, this.scale.z);
    var C = multMatrix(T, multMatrix(R, S));

    //verifica se a geometria é um círculo
    if (this.geometry == circle) {
        var step = 0.1;
        var x0 = 0; //x inicial
        var h0 = 0; //y inicial
        var r = 1; //raio inicial

        ctx.strokeStyle = "#851e52";
        ctx.beginPath(); //tell canvas to start a set of lines

        for (var theta = 0; theta < 2 * Math.PI; theta += step) {
            //ponto da borda do círculo
            var x = x0 + r * Math.cos(theta);
            var y = h0 - r * Math.sin(theta);
            //tranformando os vértices
            var vertex = multVec(C,[x,y,0,1]);
            //transformando para coordenadas do canvas
            vertex = multVec(M,[vertex.x, vertex.y,vertex.z, 1])
            ctx.lineTo(vertex.x, vertex.y);
        }
        ctx.closePath(); //close the end to the start point
        ctx.stroke(); //actually draw the accumulated lines
        if(!colorintersection){
            ctx.fillStyle = "#f7d3ba";
        }
        ctx.fill();
    }

    if (this.geometry == box) {
        var p1 = [0.5,0.5,0,1];
        var p2 = [0.5,-0.5,0,1];
        var p3 = [-0.5,-0.5,0,1];
        var p4 = [-0.5,0.5,0,1];
        points = []
        points.push(p1);
        points.push(p2);
        points.push(p3);
        points.push(p4);
    
        ctx.strokeStyle = "#dd2c00";
        ctx.beginPath(); //tell canvas to start a set of lines

        for (var i=0; i<points.length; i++) {
            //ponto da borda do círculo
            //tranformando os vértices
            var vertex = multVec(multMatrix(TC,C),points[i]);
            if(show_points){
                ctx.fillStyle = "#1b262c";
                ctx.fillText("p"+i+": ("+vertex.x.round(2)+","+vertex.y.round(2)+","+vertex.z.round(2)+")", 10, canvas.height-40+i*10);
            }
            //transformando para coordenadas do canvas
            vertex = multVec(M,[vertex.x, vertex.y,vertex.z, 1])
            ctx.lineTo(vertex.x, vertex.y);
            vertex = multVec(multMatrix(TC,C),points[(i+1)%points.length]);
            //transformando para coordenadas do canvas
            vertex = multVec(M,[vertex.x, vertex.y,vertex.z, 1])
            ctx.lineTo(vertex.x, vertex.y);
            
            
        }
        ctx.closePath(); //close the end to the start point
        ctx.stroke(); //actually draw the accumulated lines
        var vertex = multVec(multMatrix(TC,C),points[0]);
        if(vertex.z>=0){
            ctx.fillStyle = "#febf63";
        }else{
            ctx.fillStyle = "#ffc7c7";
        }
        
        
        ctx.fill();
        
    }

}
testshape = new Shape();
//chame por este evento no onclick do canvas
function setArrow(event) {
    var x = event.offsetX;
    var y = event.offsetY;
    guessX = x;
    guessY = y;
    p = multVec(M2,[x,y,0,1]);
    console.log("x coords: " + guessX + ", y coords: " + guessY);
    //transformar para sistema de coordenadas global
    var T = transformToSystem(canvas.width,canvas.height);
    var vertex = multVec(T,[x,y,0,1]);
    console.log("sis x coords: " + vertex.x + ", sis y coords: " + vertex.y);
    verifyIntersection(vertex,testshape);
    if(colorintersection){
        ctx.fillStyle = "#be3737";
    }else{
        ctx.fillStyle = "#f7d3ba";
    }
    drawCanvas();
    if(colorintersection){
        ctx.fillStyle = "#494949"; //cor do texto
        ctx.fillText("Interceptou!", canvas.width-100, canvas.height-20); //x e y definem a posição do canvas
        console.log("Ponto interceptou!");
    }else{
        console.log("Ponto não interceptou!"); 
        ctx.fillStyle = "#494949"; //cor do texto
        ctx.fillText("Não interceptou!", canvas.width-100, canvas.height-20); //x e y definem a posição do canvas    
    }
    
}

function verifyIntersection(point,shape){
    var T = translateMatrix(shape.translate.x,shape.translate.y,shape.translate.z); //TODO: modificar para receber a matriz de escala
    //console.log(this.rotate.z);
    var R = multMatrix(rotateMatrixX(shape.rotate.x),multMatrix(rotateMatrixY(shape.rotate.y),rotateMatrixZ(shape.rotate.z))); //TODO: modificar para receber a matriz de rotação
    var S = scaleMatrix(shape.scale.x, shape.scale.y, 0);
    var C = multMatrix(T, multMatrix(R, S));
    //console.log(shape);
    //transformar ponto em coordenada local
    var Ti = translateMatrixI(shape.translate.x,shape.translate.y,shape.translate.z); //TODO: modificar para receber a matriz de escala
    //console.log(this.rotate.z);
    //var R = multMatrix(rotateMatrixX(shape.rotate.x),multMatrix(rotateMatrixY(shape.rotate.y),rotateMatrixZ(shape.rotate.z))); //TODO: modificar para receber a matriz de rotação
    //var Ri = transpose(R);
    var Ri = multMatrix(rotateMatrixZI(shape.rotate.z),multMatrix(rotateMatrixYI(shape.rotate.y),rotateMatrixXI(shape.rotate.x))); //TODO: modificar para receber a matriz de rotação
    var Si = scaleMatrixI(shape.scale.x, shape.scale.y, 0.0);
    var Ci = multMatrix(Si, multMatrix(Ri, Ti)); 
    //console.log(Ci);
    var p = multVec(Ci,[point.x,point.y,point.z,1]);
    
    hit = multVec(C,[p.x,p.y,p.z,1]);

    if(p.x*p.x+p.y*p.y<=1.0){
        colorintersection = true;
        return true;
    }
    colorintersection = false;
    return false;
}


function Line(x1,y1,x2,y2){
    this.x1=x1;
    this.y1=y1;
    this.x2=x2;
    this.y2=y2;
}
Line.prototype.drawWithArrowheads=function(ctx){

    // arbitrary styling
    ctx.strokeStyle="blue";
    ctx.fillStyle="blue";
    ctx.lineWidth=1;

    // draw the line
    ctx.beginPath();
    ctx.moveTo(this.x1,this.y1);
    ctx.lineTo(this.x2,this.y2);
    ctx.stroke();

    // draw the starting arrowhead
    //var startRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
    //startRadians+=((this.x2>this.x1)?-90:90)*Math.PI/180;
    //this.drawArrowhead(ctx,this.x1,this.y1,startRadians);
    // draw the ending arrowhead
    var endRadians=Math.atan((this.y2-this.y1)/(this.x2-this.x1));
    endRadians+=((this.x2>this.x1)?90:-90)*Math.PI/180;
    this.drawArrowhead(ctx,this.x2,this.y2,endRadians);


}
Line.prototype.drawArrowhead=function(ctx,x,y,radians){
    ctx.save();
    ctx.beginPath();
    ctx.translate(x,y);
    ctx.rotate(radians);
    ctx.moveTo(0,0);
    ctx.lineTo(3,10);
    ctx.lineTo(-3,10);
    ctx.closePath();
    ctx.restore();
    ctx.fill();
}

var angle_auto = 0;
function rotateArrow(p,angle=0,auto=false){
    var v1 = multVec(M,[0, 0,0, 1]);
    var v2 = multVec(M,[p[0],p[1], p[2], 1]);
    var line=new Line(v1.x,v1.y,v2.x,v2.y);
    // draw the line
    line.drawWithArrowheads(ctx);
    if(!auto){
        apply(rotateAxisMatrix(p,angle));
    }else{
        apply(rotateAxisMatrix(p,angle_auto));
        angle_auto=angle_auto+1;        
    }
    
}


var fps = 60;
function drawCanvas() {
    setTimeout(function() {
        requestAnimationFrame(drawCanvas);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    drawAxis();
    var object1 = new Shape("Box");
    object1.geometry = box;
    object1.setScale(20,20);
    
    TC = identity();
    eval(textarea.value);
    object1.draw();

    // create a new line object
    
    /*if(hit!=null){
        phit = new Shape();
        phit.setTranslate(hit.x,hit.y,hit.z);
        ctx.fillStyle = "#005792";
        phit.setScale(3,3);
        phit.draw();
    }*/
    
    }, 1000 / fps);
}

textarea.addEventListener("input", drawCanvas);
window.addEventListener("load", drawCanvas);