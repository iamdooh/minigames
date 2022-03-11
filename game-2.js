var x = 0;
var y = 0;

var scene = 0;
var sceneCounts = [26, 20, 19, 53, 37];

var srcX;
var srcY;

var sheetWidth = 6416;
var sheetHeight = 3600;

var cols = 8;
var rows = 9;

var width = sheetWidth/cols;
var height = sheetHeight/rows;

var playInt;
var playIntResult;
var currentFrame = 0;
var totalFrame = 68;
var totalSpriteImages = 0;
var responseData = {
	isWinner: true
};
var arrowPosY = 0;
var isArrowDirectionUp = false;
var isClicked = false;

var lootboxSprite = new Image();
	lootboxSprite.src = 'https://play.blizzard.kr/static/images/minigame/2/sprite-lootbox.jpg';
var sombraSprite = new Image();
	sombraSprite.src = 'https://play.blizzard.kr/static/images/minigame/2/sprite-sombra.jpg';
var doomfistSprite = new Image();
	doomfistSprite.src = 'https://play.blizzard.kr/static/images/minigame/2/sprite-doomfist.jpg';
	
var arrowImage = new Image();
	arrowImage.src = 'https://play.blizzard.kr/static/images/minigame/2/arrow.png';

var canvas = document.getElementById('minigame-canvas');

var ctx = canvas.getContext('2d');
	ctx.font = "16px NotoSans Regular";
	ctx.fillStyle = "#006bb8";
	ctx.textAlign = "center";

function updateFrame(){
	ctx.clearRect(x, y, width, height);

	currentFrame = currentFrame % totalFrame;
	
	srcX = (currentFrame % cols) * width;
	srcY = Math.floor(currentFrame / cols) * height;
	
	currentFrame++;
}

function drawLootBox(){
	updateFrame();

	if(scene === 0 && currentFrame == sceneCounts[scene]){
		canvas.addEventListener('click', openLootBox);
		scene = 1;
	} else if(scene === 1 && currentFrame == (sceneCounts[scene-1] + sceneCounts[scene])){
		currentFrame = sceneCounts[scene-1];
	} else if(scene === 2 && currentFrame == totalFrame){
		if(!isClicked){
			setTimeout(function(){
				showResult();
			}, 5000);
			
			isClicked = true;
		}
		
		currentFrame = currentFrame - 4;
	}
	
	ctx.drawImage(lootboxSprite, srcX, srcY, width, height, 102, 51, width, height);
	
	if(scene === 1){
		if(arrowPosY === 0 || arrowPosY === 5) {
			isArrowDirectionUp = !isArrowDirectionUp;
		}
		
		arrowPosY = (isArrowDirectionUp) ? arrowPosY + 1 : arrowPosY - 1;

		ctx.drawImage(arrowImage, (canvas.width/2 - 8), 405 + arrowPosY, 16, 11);
		ctx.fillText("Click the lootbox!", canvas.width/2, 445);
	}
}

function openLootBox(event){
	event = window.event? window.event : event;
	
	var x = event.offsetX,
		y = event.offsetY;
	
	if((x > 390 && x < 625) && (y > 165 && y < 390)){
		canvas.removeEventListener('click', openLootBox);
		currentFrame = (sceneCounts[scene-1] + sceneCounts[scene]);
		scene = 2;
	}
}

function showResult(){
	ctx.clearRect(x, y, width, height);
	clearInterval(playInt);
	
	if(responseData.isWinner){
		scene = 3;
		lootboxSprite = sombraSprite;
	} else {
		scene = 4;
		lootboxSprite = doomfistSprite;
	}
	
	width = 1006;
	height = 502;
	
	currentFrame = 0;
	totalFrame = sceneCounts[scene];

	playIntResult = setInterval(function(){
		drawResult();
	}, 100);
}

function drawResult(){
	updateFrame();

	if(currentFrame == (sceneCounts[scene]-1)){
		clearInterval(playIntResult);
	}

	ctx.drawImage(lootboxSprite, srcX, srcY, width, height, x, y, width, height);
}

[lootboxSprite, sombraSprite, doomfistSprite].map(function(e) {
	e.addEventListener('load', function(){
		totalSpriteImages++;

		if (totalSpriteImages == 3){
			playInt = setInterval(drawLootBox, 100);
			
			document.getElementById('minigame').style.display = 'block';
		}
	});
});