//console.log("Hello world");

let board;
let score = 0;
let rows = 4;
let columns = 4;

let startX = 0;
let startY = 0;

let is2048Exist = false;
let is4096Exist = false;
let is8192Exist = false;

//avoids the redundancy of the victory
//the board is checked for every user action
//if the 2048 already existed, it will return true and the congratulations will not repeat anymore

function setGame(){ //sets the board
	
	board=[
		// [16, 4, 4, 8,],
		// [0, 2, 4, 2,],
		// [2, 2, 4, 2,],
		// [32, 16, 16, 8,]

		[0, 0, 0, 0,],
		[0, 0, 0, 0,],
		[0, 0, 0, 0,],
		[0, 0, 0, 0,]

	];

	console.log(board);

	for(let r=0; r<rows; r++){
		for(let c=0; c<columns; c++){

			let tile = document.createElement("div");

			tile.id = r.toString() + "-" + c.toString();

			let num = board[r][c];

			updateTile(tile,num);

			document.getElementById("board").append(tile);
		}
	}

	setTwo();
	setTwo();
}

function updateTile(tile, num) { //updates the tiles
	tile.innerText = "";
	tile.classList.value = "";

	tile.classList.add("tile");

	if(num > 0) {
		tile.innerText = num.toString();
		if(num <= 4096){
			tile.classList.add("x"+ num.toString());
		
		} else {
			tile.classList.add("x8192");
		}
	}
}

window.onload = function(){ //loads the board upon opening the page
	setGame();
}

function handleSlide(e){ //controls the user arrow input

	e.preventDefault(); //prevents scrolling using arrow keys

	console.log(e.code);

	if(["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.code)) {

		if(e.code == "ArrowLeft"){
			slideLeft();
			setTwo();
		} else if(e.code == "ArrowRight"){
			slideRight();
			setTwo();
		} else if(e.code == "ArrowUp"){
			slideUp();
			setTwo();
		} else if(e.code == "ArrowDown"){
			slideDown();
			setTwo();
		}
	}

	document.getElementById("score").innerText = score;

	  setTimeout(() => {
    if(hasLost()){
      alert("Game Over! You have lost the game. Game will restart");
      restartGame();
      alert("Click any arrow key to restart")
    }
    else{
      checkWin();
    }	
  }, 100); // delay time in milliseconds

}


document.addEventListener("keydown", handleSlide);

function filterZero(tiles){ 
//rejects tiles with no value / with 0 value
	return tiles.filter(num => num!=0);
}

function slide(tiles){ //by default, slides tiles to the left
	tiles = filterZero(tiles);
	for(let i=0; i<tiles.length-1; i++){
		if(tiles[i] == tiles[i+1]){
			tiles[i] *= 2; //4 to 4 = 8
			tiles[i+1] = 0;
			score += tiles [i]
		}
	}

	tiles = filterZero(tiles);

	while(tiles.length < columns){
		tiles.push(0)
	}

	return tiles;
}

function slideLeft(){
	//console.log("sliding to the left");

	for(let r=0; r<rows; r++){
		let row = board[r];
		originalRow = row.slice();
		row = slide(row);
		board[r] = row;

		for(let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-right 0.3s";
				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}
			updateTile(tile, num);
		}
	}
}

function slideRight(){
	//console.log("sliding to the right");

	for(let r=0; r<rows; r++){
		let row = board[r];

		originalRow = row.slice();
		row.reverse();
		row = slide(row);
		row.reverse();
		board[r] = row;

		for(let c=0; c<columns; c++){
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];
			if(originalRow[c] !== num && num !== 0){
				tile.style.animation = "slide-from-left 0.3s";
				setTimeout(() => {
					tile.style.animation = "";
				}, 300)
			}
			updateTile(tile, num);
		}
	}
}

function slideUp(){
	//console.log("sliding to the upward");

	for(let c=0; c<columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		let originalCol = col.slice();
		col = slide(col);

		for(let r=0; r<rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(originalCol[r] !== num && num !== 0){
				tile.style.animation = "slide-from-bottom 0.3s";
					setTimeout(() =>{
						tile.style.animation = "";
					}, 300)
			}
			updateTile(tile, num);
		}
	}
}

function slideDown(){
	//console.log("sliding to the downware");

	for(let c=0; c<columns; c++){
		let col = [board[0][c], board[1][c], board[2][c], board[3][c]];

		let originalCol = col.slice();
		col.reverse();
		col = slide(col);
		col.reverse();

		for(let r=0; r<rows; r++){
			board[r][c] = col[r];
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			let num = board[r][c];

			if(originalCol[r] !== num && num !== 0){
				tile.style.animation = "slide-from-top 0.3s";
					setTimeout(() =>{
						tile.style.animation = "";
					}, 300)
			}
			updateTile(tile, num);
		}
	}
}


function hasEmptyTile(){ 
//needs to find out if tile is empty to generate new tile
	for (let r=0; r<rows; r++){
		for (let c=0; c<columns; c++){
			if (board[r][c] == 0) {
				return true;
			}
		}
	}

	return false;
}

	/*
		= - assigning value / collection of values
		== - comparing two values
		=== - comparing two values but strict in data type
	*/

function setTwo(){
	//if it cannot find an empty tile 
	if (hasEmptyTile() == false) {
		return; 
		//no need to do anything (no need to generate a new tile)
	}

	let found = false;

	while(!found){
		let r = Math.floor(Math.random()*rows);
		let c = Math.floor(Math.random()*columns);

		if(board[r][c]== 0){
			board[r][c] = 2;
			let tile = document.getElementById(r.toString() + "-" + c.toString());
			tile.innerText = "2";
			tile.classList.add("x2");
			found = true;
		}
	}
}

function checkWin(){
	for(let r=0; r<rows; r++){
		for (let c=0; c<columns; c++){
			if(board[r][c] == 2048 && is2048Exist == false){
				alert("You win! You got the 2048");
				is2048Exist = true;
			} else if(board[r][c] == 4096 && is4096Exist == false){
				alert("You are unstoppable at 4096! Fantastic!");
				is4096Exist = true;
			} else if(board[r][c] == 8192 && is8192Exist == false){
				alert("Victory! You have reached 9192! Awesome!");
				is8192Exist = true;
			}
		}
	}
}

function hasLost(){

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < columns; c++) 
    {
      // if the board has an empty tile, false means, the user is not yet lost
      if(board[r][c] == 0){
        return false;
      }

      const currentTile = board[r][c];

      // if the board has an same adjacent tile, false means, the user is not yet lost
      if(
        r>0 && currentTile === board[r-1][c] || // this will check it will has a match to the upper  adjacent tile
        // r < 3
        r<rows - 1 && currentTile === board[r+1][c] || // this will check if it has a match  to the lower adjacent tile
        c>0 && currentTile === board[r][c-1] || // this will check if it has a match to the left adjacent tile
        c<columns-1 && currentTile === board[r][c+1]  // this will check if it has a match to the right adjacent tile
      ){
        return false;
      }

    }
    
    
  }
  return true;
  // No empty tiles, and no possible moves left, meaning true, the user hasLost
}


function restartGame(){

  board = [
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
    [0, 0, 0, 0]
  ];

  score = 0;

  setTwo();
}
  // clear the board and remake
  // document.getElementById('board').innerHTML = '';

  document.addEventListener("touchstart", (e)=>{
  	startX = e.touches[0].clientX;
  	startY = e.touches[0].clientY;
  })

  document.addEventListener("touchend", (e)=>{
  if(!e.target.className.includes("tile")){
    return;
  }

  let diffX = startX - e.changedTouches[0].clientX;
  let diffY = startY - e.changedTouches[0].clientY;

  if(diffX != 0 && diffY !== 0){
    if(Math.abs(diffX) > Math.abs(diffY)){
      if(diffX > 0){
        slideLeft();
        setTwo();
      } else{
        slideRight();
        setTwo();
      }
    } else{
      if(diffY > 0){
        slideUp();
        setTwo();
      } else{
        slideDown();
        setTwo();
      }
    }
  }

	  document.getElementById("score").innerText = score;

		  setTimeout(() => {
	    if(hasLost()){
	      alert("Game Over! You have lost the game. Game will restart");
	      restartGame();
	      alert("Click any arrow key to restart")
	    }
	    else{
	      checkWin();
	    }	
	  }, 100); // delay time in milliseconds

})