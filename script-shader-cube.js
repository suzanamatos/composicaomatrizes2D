var vertexShaderText = 
[
'precision mediump float;', 
'attribute vec3 vertPosition;',
'attribute vec3 vertColor;',
'varying vec3 fragColor;',
'uniform mat4 mWorld;',
'uniform mat4 mView;',
'uniform mat4 mProj;',
'void main()',
'	{',
'		fragColor = vertColor;',
'		gl_Position = mProj * mView * mWorld * vec4(vertPosition, 1.0);',
'	}',
].join('\n');

var fragmentShaderText =
[
'precision mediump float;',
'',
'varying vec3 fragColor;',
'void main()',
'{',
'  gl_FragColor = vec4(fragColor, 1.0);',
'}'
].join('\n');

var InitDemo = function () {
    

	console.log('This is working');

	var canvas = document.getElementById("canvas");
	var gl = canvas.getContext('webgl');

	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);

	gl.shaderSource(vertexShader, vertexShaderText);
	gl.shaderSource(fragmentShader, fragmentShaderText);

	gl.compileShader(vertexShader);
	if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling vertex shader!', gl.getShaderInfoLog(vertexShader));
		return;
	}

	gl.compileShader(fragmentShader);
	if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
		console.error('ERROR compiling fragment shader!', gl.getShaderInfoLog(fragmentShader));
		return;
	}

	var program = gl.createProgram();
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	gl.linkProgram(program);
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		console.error('ERROR linking program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.validateProgram(program);
	if (!gl.getProgramParameter(program, gl.VALIDATE_STATUS)) {
		console.error('ERROR validating program!', gl.getProgramInfoLog(program));
		return;
	}
	gl.enable(gl.DEPTH_TEST);
	gl.enable(gl.CULL_FACE);
	gl.frontFace(gl.CCW);
	gl.cullFace(gl.BACK);

	gl.clearColor(1.0, 1.0, 1.0, 0.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	var boxVertices = 
	[ // X, Y, Z           R, G, B
		// Top
		-0.5, 0.5, -0.5,   0.5, 0.5, 0.5,
		-0.5, 0.5, 0.5,    0.5, 0.5, 0.5,
		0.5, 0.5, 0.5,     0.5, 0.5, 0.5,
		0.5, 0.5, -0.5,    0.5, 0.5, 0.5,

		// Left
		-0.5, 0.5, 0.5,    0.75, 0.25, 0.5,
		-0.5, -0.5, 0.5,   0.75, 0.25, 0.5,
		-0.5, -0.5, -0.5,  0.75, 0.25, 0.5,
		-0.5, 0.5, -0.5,   0.75, 0.25, 0.5,

		// Right
		0.5, 0.5, 0.5,    0.25, 0.25, 0.75,
		0.5, -0.5, 0.5,   0.25, 0.25, 0.75,
		0.5, -0.5, -0.5,  0.25, 0.25, 0.75,
		0.5, 0.5, -0.5,   0.25, 0.25, 0.75,

		// Front
		0.5, 0.5, 0.5,    0.5, 0.3, 0.15,
		0.5, -0.5, 0.5,    0.5, 0.3, 0.15,
		-0.5, -0.5, 0.5,    0.5, 0.3, 0.15,
		-0.5, 0.5, 0.5,    0.5, 0.3, 0.15,

		// Back
		0.5, 0.5, -0.5,    0.0, 0.5, 0.15,
		0.5, -0.5, -0.5,    0.0, 0.5, 0.15,
		-0.5, -0.5, -0.5,    0.0, 0.5, 0.15,
		-0.5, 0.5, -0.5,    0.0, 0.5, 0.15,

		// Bottom
		-0.5, -0.5, -0.5,   0.0, 0.5, 0.5,
		-0.5, -0.5, 0.5,    0.0, 0.5, 0.5,
		0.5, -0.5, 0.5,     0.0, 0.5, 0.5,
		0.5, -0.5, -0.5,    0.0, 0.5, 0.5,
	];

	var boxIndices =
	[
		// Top
		0, 1, 2,
		0, 2, 3,

		// Left
		5, 4, 6,
		6, 4, 7,

		// Right
		8, 9, 10,
		8, 10, 11,

		// Front
		13, 12, 14,
		15, 14, 12,

		// Back
		16, 17, 18,
		16, 18, 19,

		// Bottom
		21, 20, 22,
		22, 20, 23
	];

	var boxVertexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, boxVertexBufferObject);
	gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(boxVertices), gl.STATIC_DRAW);

	var boxIndexBufferObject = gl.createBuffer();
	gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, boxIndexBufferObject);
	gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(boxIndices), gl.STATIC_DRAW);
	


	var positionAttribLocation = gl.getAttribLocation(program, 'vertPosition');
	var colorAttribLocation = gl.getAttribLocation(program, 'vertColor');
	gl.vertexAttribPointer(
		positionAttribLocation, // localização do atributo
		3, // numero de elementos por atributo
		gl.FLOAT, // Tipo de elemento
		gl.FALSE, //Normalização
		6 * Float32Array.BYTES_PER_ELEMENT, // Tamanho do vertice individual
		0 // Offset para iniciar a capturar os valores
	);
	gl.vertexAttribPointer(
		colorAttribLocation, // Attribute location
		3, // Number of elements per attribute
		gl.FLOAT, // Type of elements
		gl.FALSE,
		6 * Float32Array.BYTES_PER_ELEMENT, // Size of an individual vertex
		3 * Float32Array.BYTES_PER_ELEMENT // Offset from the beginning of a single vertex to this attribute
	);

	gl.enableVertexAttribArray(positionAttribLocation);
	gl.enableVertexAttribArray(colorAttribLocation);

	gl.useProgram(program);

	//fazendo a ponte com o shader
	var matWorldUniformLocation = gl.getUniformLocation(program,'mWorld');
	var matViewUniformLocation = gl.getUniformLocation(program,'mView');
	var matProjUniformLocation = gl.getUniformLocation(program,'mProj');

	//inicializando as matrizes de transformação
	var worldMatrix = new Float32Array(16);
	var viewMatrix = new Float32Array(16);
	var projMatrix = new Float32Array(16);
	var mat4 = glMatrix.mat4;
	mat4.identity(worldMatrix);
	mat4.identity(viewMatrix);
	mat4.identity(projMatrix);

	
	

    eval(textarea.value);

	//inserindo valores nas variáveis no shader
	gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix);
	gl.uniformMatrix4fv(matViewUniformLocation,gl.FALSE,viewMatrix);
	gl.uniformMatrix4fv(matProjUniformLocation,gl.FALSE,projMatrix);

	gl.uniformMatrix4fv(matWorldUniformLocation,gl.FALSE,worldMatrix);
		
	gl.clearColor(217/255., 228/255., 221/255., 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.drawElements(gl.TRIANGLES, boxIndices.length, gl.UNSIGNED_SHORT,0);

	

	
    
};
var textarea = document.getElementById("code");
var code = textarea.value;


textarea.addEventListener("input", InitDemo);

