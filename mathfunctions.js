function Vec3(){
    this.x = 0;
    this.y = 0;
    this.z = 0;
}

function Vec3(x,y,z){
    this.x = x;
    this.y = y;
    this.z = z;
}

Vec3.prototype.set = function (v) {
    this.x = v;
    this.y = v;
    this.z = v;
}

Vec3.prototype.set = function (x,y,z) {
    this.x = x;
    this.y = y;
    this.z = z;
}

Vec3.prototype.sum = function (p1,p2) {
    p = new Vec3();
    p.x = p1.x+p2.x;
    p.y = p1.y+p2.y;
    p.z = p1.z+p2.z;
    return p;
}

function identity() { // identidade 
    return [
        [1, 0, 0, 0],
        [0, 1, 0, 0],
        [0, 0, 1, 0],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}
//Matriz de escala(sx,sy,sz) com retorno: 4x4
function scaleMatrix(sx,sy,sz) { // identidade 
    return [
        [sx, 0, 0, 0],
        [0, sy, 0, 0],
        [0, 0, sz, 0],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}

function scaleMatrixI(sx,sy,sz) { // identidade 
    return [
        [1./sx, 0, 0, 0],
        [0, 1./sy, 0, 0],
        [0, 0, sz==0 ? 0 : 1./sz, 0],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}

//matriz transposta de uma matriz 4x4
function transpose(T){
    return [
        [T[0][0], T[1][0], T[2][0],T[3][0]],
        [T[0][1], T[1][1], T[2][1],T[3][1]],
        [T[0][2], T[1][2], T[2][2],T[3][2]],
        [T[0][3], T[1][3], T[2][3],T[3][3]]
    ];
}

//TODO: definir matriz de translação (tx,ty,tz) com retorno: 4x4
function translateMatrix(tx,ty,tz){
    return [
        [1, 0, 0, tx],
        [0, 1, 0, ty],
        [0, 0, 1, tz],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}

function translateMatrixI(tx,ty,tz){
    return [
        [1, 0, 0, -tx],
        [0, 1, 0, -ty],
        [0, 0, 1, -tz],
        [0, 0, 0, 1]
    ]; //retorna matriz 4x4
}

//TODO: definir matriz de rotação no eixo x passando um angulo em graus com retorno: 4x4
function rotateMatrixX(theta){
    var theta = (theta*Math.PI)/180.;
    return [
        [1,               0,                0, 0],
        [0, Math.cos(theta), -Math.sin(theta), 0],
        [0, Math.sin(theta),  Math.cos(theta), 0],
        [0,               0,                0, 1]
    ]; //retorna matriz 4x4
}

function rotateMatrixXI(theta){
    return transpose(rotateMatrixX(theta));
}

function rotateMatrixY(theta){
    var theta = (theta*Math.PI)/180.;
    return [
        [ Math.cos(theta), 0, Math.sin(theta), 0],
        [               0, 1,               0, 0],
        [-Math.sin(theta), 0, Math.cos(theta), 0],
        [0,                0,               0, 1]
    ]; //retorna matriz 4x4
}

function rotateMatrixYI(theta){
    return transpose(rotateMatrixY(theta));
}

function rotateMatrixZ(theta){
    var theta = (theta*Math.PI)/180.;
    return [
        [Math.cos(theta),-Math.sin(theta), 0, 0],
        [Math.sin(theta), Math.cos(theta), 0, 0],
        [              0,               0, 1, 0],
        [              0,               0, 0, 1]
    ]; //retorna matriz 4x4
}

function rotateAxisMatrix(axis,angle){
    var theta = (angle*Math.PI)/180.;
    x = axis[0];
    y = axis[1];
    z = axis[2];
    var mod = Math.sqrt(x*x+y*y+z*z);
    x = x/mod;
    y = y/mod;
    z = z/mod;
    return [
        [(1-Math.cos(theta))*x*x+Math.cos(theta),(1-Math.cos(theta))*x*y-Math.sin(theta)*z,(1-Math.cos(theta))*x*z+Math.sin(theta)*y,0],
        [(1-Math.cos(theta))*x*y+Math.sin(theta)*z,(1-Math.cos(theta))*y*y+Math.cos(theta),(1-Math.cos(theta))*y*z-Math.sin(theta)*x,0],
        [(1-Math.cos(theta))*x*z-Math.sin(theta)*y,(1-Math.cos(theta))*y*z+Math.sin(theta)*x,(1-Math.cos(theta))*z*z+Math.cos(theta),0],
        [0,0,0,1],
    ];
}

function rotateMatrixZI(theta){
    return transpose(rotateMatrixZ(theta));
}
//TODO: definir matriz de rotação no eixo y passando um angulo em graus com retorno: 4x4

//TODO: definir matriz de rotação no eixo z passando um angulo em graus com retorno: 4x4

function multMatrix(a, b) {
    var aNumRows = a.length, aNumCols = a[0].length,
        bNumRows = b.length, bNumCols = b[0].length,
        m = new Array(aNumRows);  // initialize array of rows
    for (var r = 0; r < aNumRows; ++r) {
      m[r] = new Array(bNumCols); // initialize the current row
      for (var c = 0; c < bNumCols; ++c) {
        m[r][c] = 0;             // initialize the current cell
        for (var i = 0; i < aNumCols; ++i) {
          m[r][c] += a[r][i] * b[i][c];
        }
      }
    }
    return m;
  }

function multVec(A, b) { //multiplicação de uma matriz (4x4) e um vetor 4x1
    var C = [0, 0, 0, 1];
    var i;
    for (i = 0; i < 4; i++) {
        C[i] = A[i][0] * b[0] + A[i][1] * b[1] + A[i][2] * b[2] + + A[i][3] * b[3];
    }
    return new Vec3(C[0],C[1],C[2],C[3]); //retorna um vetor 4x1
}

function transformCanvas(Width,Height) {
    return [
        [1, 0, 0, Width / 2.],
        [0, -1, 0, Height / 2.],
        [0, 0, 1,0],
        [0, 0, 0,1]
    ];
}

function transformToSystem(Width,Height) {
    return [
        [1, 0, 0, -Width/2],
        [0, -1, 0, Height/2],
        [0, 0, 1,0],
        [0, 0, 0,1]
    ];
}