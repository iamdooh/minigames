$(function(){
	var canvas = $("#minigame-canvas");
var ctx = canvas.get(0).getContext("2d");
var canvasX = 1006;
var canvasY = 502;

var playIntGun, playIntTarget, playIntResult;
var cnt = 0;
var totalImages = 0;
var clickNumber = false;

var spriteWidth = 1612, spriteHeight = 462; 
var spriteWidthT = 1624, spriteHeightT = 330;

var rows = 1, cols = 4, colsT = 8;

var width = spriteWidth/cols; 
var height = spriteHeight/rows; 
var widthT = spriteWidthT/colsT; 
var heightT = spriteHeightT/rows; 

var curFrame = 0, frameCount = 4; 
var curFrameT = 0, frameCountT = 5;

var srcX = 0, srcY = 0; 
var srcXT = 0, srcYT = 0;
var srcXT1 = 0, srcXT2 = 0, srcXT3 = 0;

var resultWin = "https://play.blizzard.kr/static/images/minigame/1/card_win.png";
var resultFail = "https://play.blizzard.kr/static/images/minigame/1/card_failed.png";
var targetImg = "https://play.blizzard.kr/static/images/minigame/1/card_back-sprite.png";
var gunImg = "https://play.blizzard.kr/static/images/minigame/1/gun-sprite.png";
var targetBasicImg = "https://play.blizzard.kr/static/images/minigame/1/card_failed.png";
var bgImg = "https://play.blizzard.kr/static/images/minigame/1/bg.jpg";

var targetImage = new Image();
	targetImage.src = targetImg;
var targetImage2 = new Image();
	targetImage2.src = targetImg;
var targetImage3 = new Image();
	targetImage3.src = targetImg;
var gunImage = new Image();
	gunImage.src = gunImg;
var basicImage = new Image();
	basicImage.src = targetBasicImg	;
var bgImage = new Image();
	bgImage.src = bgImg;
var resultImage;

var target_pos_y = 120;
var target_pos_m_y = target_pos_y - 40;
var target1_pos_x = 180, target2_pos_x = 400, target3_pos_x = 620;	
var target1_pos_s_x = target1_pos_x - 40;
var target1_pos_e_x = target1_pos_x + 160;
var target2_pos_s_x = target2_pos_x - 30;
var target2_pos_e_x = target2_pos_x + 160;
var target3_pos_s_x = target3_pos_x - 30;
var target3_pos_e_x = target3_pos_x + 170;

var target = new target();
var target2 = new target2();
var target3 = new target3();
var playgun = new playGun();


function target() {
	this.x = target1_pos_x;
	this.y = target_pos_y;

	this.render = function() {
		ctx.drawImage(targetImage, srcXT1, srcYT, widthT, heightT, this.x, this.y, widthT, heightT);	
	}
}

function target2() {
	this.x = target2_pos_x;
	this.y = target_pos_y;

	this.render = function() {
		ctx.drawImage(targetImage2, srcXT2, srcYT, widthT, heightT, this.x, this.y, widthT, heightT);	
	}
}

function target3() {
	this.x = target3_pos_x;
	this.y = target_pos_y;

	this.render = function() {
		ctx.drawImage(targetImage3, srcXT3, srcYT, widthT, heightT, this.x, this.y, widthT, heightT);	
	}
}

function playGun() {
	this.x = 0;
	this.y = 70;

	this.render = function() {			
		ctx.drawImage(gunImage, srcX, srcY, width, height, this.x, this.y, width, height);
	}
}

function updateFrame() {
	curFrame = ++curFrame % frameCount;
	srcX = curFrame * width;
}

function updateFrameT(nth) {
	curFrameT = ++curFrameT % frameCountT;
	srcXT = curFrameT * widthT;

	switch(nth) {
		case 1:
			srcXT2=0, srcXT3 = 0, srcXT1 = srcXT;
			break;
		case 2:
			srcXT1=0, srcXT3 = 0, srcXT2 = srcXT;
			break;
		case 3:
			srcXT1=0, srcXT2 = 0,srcXT3 = srcXT;
			break;
	}
}

function moveTarget() {
	target.y = target_pos_y;
	target2.y = target_pos_y;
	target3.y = target_pos_y;
	
	if (playgun.x >= target1_pos_s_x && playgun.x <= target1_pos_e_x ) {
		target.y = target_pos_m_y;
	} else if (playgun.x >= target2_pos_s_x && playgun.x <= target2_pos_e_x ) {
		target2.y = target_pos_m_y;
	} else if (playgun.x >= target3_pos_s_x && playgun.x <= target3_pos_e_x ) {
		target3.y = target_pos_m_y;
	}
}

function moveGun() {
	updateFrame();
	drawCanvas();

	cnt++;

	if(cnt == frameCount) {
		clearInterval(playIntGun);
	}
}

function rotateTarget(nth) {
	updateFrameT(nth);
	drawCanvas();
}

function shooting(shoot) {
	canvas.off('mousemove');

	playIntGun = setInterval(moveGun, 100);
	playIntTarget = setInterval(function(){
		rotateTarget(shoot);
	}, 50);

	setTimeout(function(){
		goShoot(shoot);
	}, 1000);
}

function goShoot(shoot) {
	resultImage = new Image();
			
	resultImage.src = resultWin;

	resultImage.onload = function(){
		setTimeout(function(){
			clearInterval(playIntTarget);
		drawResultCanvas(shoot);
		}, 2400);
	}
}

function drawCanvas() {
	ctx.clearRect(0, 0, canvasX, canvasY);
	
	target.render();
	target2.render();
	target3.render();
	playgun.render();
}

function drawResultCanvas(shoot) {
	ctx.clearRect(0, 0, canvasX, canvasY);
	
	if(shoot === 1){
		ctx.drawImage(resultImage, target1_pos_x, target_pos_m_y, 203, 330);
	} else {
		target.render();
	}
	
	if(shoot === 2){
		ctx.drawImage(resultImage, target2_pos_x, target_pos_m_y, 203, 330);
	} else {
		target2.render();
	}

	if(shoot === 3){
		ctx.drawImage(resultImage, target3_pos_x, target_pos_m_y, 203, 330);
	} else {
		target3.render();
	}
}

canvas.mousemove(function(e) {
	var e = window.event? window.event : e;		
	playgun.x = e.offsetX - 40;

	moveTarget();
	drawCanvas();
});

canvas.click(function(e) {
	if ((playgun.x >= target1_pos_s_x && playgun.x <= target1_pos_e_x) && (clickNumber == false)) {
		shooting(1);
		clickNumber = true;
	}
	if ((playgun.x >= target2_pos_s_x && playgun.x <= target2_pos_e_x) && (clickNumber == false)) {
		shooting(2);
		clickNumber = true;
	} 
	if ((playgun.x >= target3_pos_s_x && playgun.x <= target3_pos_e_x) && (clickNumber == false)) {
		shooting(3);
		clickNumber = true;
	}
});

[targetImage, targetImage2, targetImage3, gunImage, bgImage].map(function(e) {
	e.addEventListener("load", function(){
		totalImages++;

		if (totalImages == 5) {
			canvas.css({
				"background-image": "url('" + bgImg + "')",
				"cursor": "none"
			});

			drawCanvas();

			$("#minigame").css("display", "block");
		}
	});
});

});
