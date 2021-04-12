let grid;
let cols;
let rows;
let resolution = 40;
let canvas;
let context;
let mouse = false;
let posI;
let posJ;
let start = 0;

let screenW = window.innerWidth;
let screenH = window.innerHeight;

document.addEventListener('mousemove', e => {
	if (screenW > window.innerWidth || screenW < window.innerWidth || screenH > window.innerHeight || screenH < window.innerHeight) {
		document.location.reload();
	}
});

/*<div style="width: 1px; height: 100%; margin-left: 39px; background-color: rgba(255,255,255,0.2);;"></div>*/
for (var i = 1; i <= (screenW/resolution); i++) {
	var marge = resolution;
	if (i==1) {
		marge = marge - 1;
	}
	var element = document.createElement("div");
	element.style.backgroundColor = "rgba(255,255,255,0.3)";
	element.style.marginLeft = (marge-1)+"px";
	element.style.width = "1px";
	element.style.height = "100vh";
	document.getElementById('grid-c').appendChild(element);
}

for (var i = 1; i <= (screenH/resolution); i++) {
	var marge = resolution;
	if (i==1) {
		marge = marge - 1;
	}
	var element = document.createElement("div");
	element.style.backgroundColor = "rgba(255,255,255,0.3)";
	element.style.marginTop = (marge-1)+"px";
	element.style.width = "100vw";
	element.style.height = "1px";
	document.getElementById('grid-l').appendChild(element);
}


document.addEventListener('keyup', event => {
  if (event.code === 'Space') {
    if(start == 1){
    	start--;
    }else{
    	start++;
    }
  }
})

function make2DArray(cols,rows){
	let arr = new Array(cols);
	for (let i = 0; i < arr.length; i++) {
		arr[i] = new Array(rows);
	}
	return arr;
}

document.addEventListener("mousedown", function(e){
	mouse = true;
});


document.addEventListener("mousemove", function(e){
	if (mouse == true) {
		var pos = getMousePos(canvas, e);
		posI = Math.trunc(pos.x / resolution);
		posJ = Math.trunc(pos.y / resolution);
		if (grid[posI][posJ] == 0) {
			grid[posI][posJ] = 1;
		}else{
			grid[posI][posJ] = grid[posI][posJ];
		}
		
	}
});


document.addEventListener("mouseup", function(e){
	mouse = false;
});

function setup(){
	createCanvas(screenW,screenH);
	canvas = document.getElementById("defaultCanvas0");
	context = canvas.getContext("2d");
	cols = Math.round(width / resolution);
	rows = Math.round(height / resolution);
	
	grid = make2DArray(cols,rows);
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			grid[i][j] = 0;
		}
	}
}

function getMousePos(canvas, evt) {
    var rect = canvas.getBoundingClientRect();
    return {
        x: (evt.clientX - rect.left) / (rect.right - rect.left) * canvas.width,
        y: (evt.clientY - rect.top) / (rect.bottom - rect.top) * canvas.height
    };
}

function draw(){
	background(0);
	for (let i = 0; i < cols; i++) {
		for (let j = 0; j < rows; j++) {
			let x = i * resolution;
			let y = j * resolution;
			if (grid[i][j] == 1) {
				fill(255);
				rect(x,y,resolution-3,resolution-3);
			}
		}
	}
	if (start==1) {
		let next = make2DArray(cols, rows);
		for (let i = 0; i < cols; i++) {
			for (let j = 0; j < rows; j++) {
				let sum = 0;
				let neighbors = countNeighbors(grid, i, j);
				let state = grid[i][j];
				if (state == 0 && neighbors == 3) {
					next[i][j] = 1;
				} else if(state == 1 && (neighbors < 2 || neighbors > 3)) {
					next[i][j] = 0;
				} else {
					next[i][j] = state;
				}
			}
		}
	setTimeout(function(){
		grid = next;
	},125);
	}
}

function countNeighbors(grid, x, y){
	let sum = 0;
	for (let i = -1; i < 2; i++) {
		for (let j = -1; j < 2; j++) {
			let col = (x + i + cols) % cols;
			let row = (y + j + rows) % rows;
			sum += grid[col][row];
		}
	}
	sum -= grid[x][y];
	return sum;
}