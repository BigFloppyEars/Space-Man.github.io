"use strict";

requirejs.config({
    //By default load any module IDs from js/lib
    baseUrl: 'js/lib'
});

requirejs(["sprite", "enemy", "player"],	function(Sprite, badGuy, Char){
	
	window.requestAnimFrame = (function(callback) {
		return window.requestAnimationFrame || window.webkitRequestAnimationFrame || window.mozRequestAnimationFrame || window.oRequestAnimationFrame || window.msRequestAnimationFrame ||
			function(callback) {
				window.setTimeout(callback, 1000 / 60);
			};
	})();

var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
if (document.body.clientWidth < canvas.width){canvas.width = document.body.clientWidth;}
if (document.body.clientHeight < canvas.height){canvas.height = document.body.clientHeight;}
var halfCanvasWidth = (canvas.width/2);
var halfCanvasHeight = (canvas.height/2);  
var horizon = canvas.height * (4 / 5);
var spriteSheet = document.getElementById("spriteSheet");
var backTheGround = document.getElementById("backTheGround");

var rAF;
// PLAYER 1 KEYS
var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;
var keyL = false;
var keyT = false;
var keySPACE = false;
var running = true;

// Event listener
window.addEventListener("keydown", onKeyDown, false);
window.addEventListener("keyup", onKeyUp, false);

function onKeyDown(event) {
    var keyCode = event.keyCode;
    switch (keyCode) {
        case 68:
            // D key
            keyD = true;
            break;
        case 83:
            // S key
            keyS = true;
            break;
        case 65:
            // A key
            keyA = true;
            break;
        case 87:
            // W key
            keyW = true;
            break;
        case 76:
            // L key
            keyL = true;
            break;
        case 84:
            // T key
            keyT = true;
            break;
        case 32:
            // SPACEBAR
            keySPACE = true;
            break;
    }
}

function onKeyUp(event) {
    var keyCode = event.keyCode;

    switch (keyCode) {
        case 68:
            // D key
            keyD = false;
            break;
        case 83:
            // S key
            keyS = false;
            break;
        case 65:
            // A key
            keyA = false;
            break;
        case 87:
            // W key
            keyW = false;
            break;
        case 76:
            // L Key
            keyL = false;
            break;
        case 84:
            // T Key
            keyT = false;
            break;
        case 32:
            // SPACEBAR
            keySPACE = false;
            break;
    }
}

// Background
function background() {
    this.display = function () {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
		ctx.fillStyle = "lightblue";
		ctx.fillRect(0, 0, canvas.width, canvas.width);
    };
}

function Clock() {
    this.start;
    this.last;
    this.end;
    this.fps;
    this.current;
this.beginTimer = function() {
        this.start = Date.now();
    };
this.secondsElapsed = function() {
        this.last = this.current;
        this.end = Date.now();
        this.current = ((this.end - this.start)/1000);
        this.fps = 1/(this.current - this.last);
        return this.current;
    };
}

function collideCloud() {
    this.levelLimit = 0;
    this.tangled = [];
    this.rectDetect = function (fiends, hero) {
        for (var i = 0; i < fiends.length; i++) {
        //Top Left Corner
            if (fiends[i].x <= hero.x && hero.x <= fiends[i].x + fiends[i].width && fiends[i].y <= hero.y && hero.y <= fiends[i].y + fiends[i].height) {
                if (this.tangled.indexOf(fiends[i]) === -1) {
                    this.tangled.push(fiends[i]);
                }
            }
        //Top Right Corner
            else if (fiends[i].x <= hero.x + hero.width && hero.x + hero.width <= fiends[i].x + fiends[i].width && fiends[i].y <= hero.y && hero.y <= fiends[i].y + fiends[i].height) {
                if (this.tangled.indexOf(fiends[i]) === -1) {
                    this.tangled.push(fiends[i]);
                }
            }
        //Bottom Right Corner
            else if (fiends[i].x <= hero.x + hero.width && hero.x + hero.width <= fiends[i].x + fiends[i].width && fiends[i].y <= hero.y + hero.height && hero.y + hero.height <= fiends[i].y + fiends[i].height) {
                if (this.tangled.indexOf(fiends[i]) === -1) {
                    this.tangled.push(fiends[i]);
                }
            }
       //Bottom Left Corner
            else if (fiends[i].x <= hero.x && hero.x <= fiends[i].x + fiends[i].width && fiends[i].y <= hero.y + hero.height && hero.y + hero.height <= fiends[i].y + fiends[i].height) {
                if (this.tangled.indexOf(fiends[i]) === -1) {
                    this.tangled.push(fiends[i]);
                }
            }
            else {
                if (this.tangled.indexOf(fiends[i]) > -1) {
                    this.tangled.splice(this.tangled.indexOf(fiends[i]), 1);
                }
            }
        }
    };
    this.stateActivate = function(hero, curr) {
        var ladLen = 0;
        var platLen = 0;
        if (this.tangled.length === 0) {
            hero.onLadder = false;
            hero.nearLadder = false;
            hero.onGround = false;
            hero.onPlatform = false;
        }
        for (var j = 0; j < this.tangled.length; j++) {
            // Ladders
            if (this.tangled[j].id.slice(0, 6) === "ladder") {
                hero.nearLadder = true;
                ladLen += 1;
                if (hero.onLadder) {
                    hero.jumping = false;
                    if (hero.d_RIGHT && hero.x < this.tangled[j].x) {
                        hero.x = this.tangled[j].x + (this.tangled[j].width/2) - hero.width;
                    }
                    else if (hero.d_RIGHT && hero.x > this.tangled[j].x) {
                        hero.x = this.tangled[j].x + (this.tangled[j].width/2);
                    }
                    else if (hero.d_LEFT && hero.x > this.tangled[j].x)
                    {
                        hero.x = this.tangled[j].x + (this.tangled[j].width/2);
                    }
                    else if (hero.d_LEFT && hero.x < this.tangled[j].x)
                    {
                        hero.x = this.tangled[j].x + (this.tangled[j].width/2) - hero.width;
                    }
                }
            }
            if (ladLen < 1) {
                hero.nearLadder = false;
            }
            // Platforms
            if (this.tangled[j].id.slice(0, 9) === "platform1") {
                platLen += 1;
                hero.onGround = true;
                hero.onPlatform = true;
                hero.jumping = false;
                if (hero.velocity_y + hero.y + hero.height >= this.tangled[j].y) {
                    hero.y = this.tangled[j].y - hero.height;
                }
            }
            if (platLen < 1) {
                hero.onGround = false;
                hero.onPlatform = false;
            }
            if (this.tangled[j].id.slice(0, 9) === "platform2") {
                if (!hero.onLadder && hero.velocity_y > -1) {
                    platLen += 1;
                    hero.onGround = true;
                    hero.onPlatform = true;
                    hero.jumping = false;
                    if (hero.velocity_y + hero.y + hero.height >= this.tangled[j].y && hero.velocity_y + hero.y + hero.height <= this.tangled[j].y + 20) {
                        hero.y = this.tangled[j].y - hero.height;
                    }
                    else {
                        hero.onGround = false;
                        hero.onPlatform = false;
                        hero.jumping = true;
                    }
                }
            }
            if (this.tangled[j].id.slice(0, 4) === "Jerk") {
                if (hero.y + hero.height > this.tangled[j].y && hero.velocity_y > -1 && hero.jumping) {
                    hero.y = this.tangled[j].y - hero.height;
                    hero.onGround = true;
                    hero.onPlatform = true;
                    hero.jumping = false;
                    hero.jump(curr);
                }
                else if (hero.x + hero.width > this.tangled[j].x && hero.x + hero.width < this.tangled[j].x + this.tangled[j].width && hero.y + hero.height > this.tangled[j].y) {
                    hero.x = this.tangled[j].x - hero.width;
                    hero.onLadder = false;
                    hero.health -= 1;
                }
                else if (hero.x > this.tangled[j].x && hero.x < this.tangled[j].x + this.tangled[j].width && hero.y + hero.height > this.tangled[j].y) {
                    hero.x = this.tangled[j].x + this.tangled[j].width;
                    hero.onLadder = false;
                    hero.health -= 1;
                }
            }
            if (this.tangled[j].id.slice(0, 6) === "portal") {
                if (hero.d_LEFT) {
                    if (hero.x <= this.tangled[j].x + this.tangled[j].width) {
                        hero.x = this.tangled[j].x + this.tangled[j].width;
                    }
                }
                if (hero.d_RIGHT) {
                    if (hero.x + hero.width >= this.tangled[j].x) {
                        hero.x = this.tangled[j].x - hero.width;
                    }
                }
            }
        }
    };
    this.levelPush = function(plats, hero) {
        var change;
        var changeY;
        if (hero.x + hero.width > halfCanvasWidth + (halfCanvasWidth * (1/3))) {
            change = (halfCanvasWidth + (halfCanvasWidth * (1/3))) - (hero.x + hero.width);
            hero.x = halfCanvasWidth + (halfCanvasWidth * (1/3)) - hero.width;
            for (var q = 0; q < plats.length; q++) {
                plats[q].x += change;
                if (plats[q].id === "platform1") {
                    plats[q].x = 0;
                }
            }
        }
        if (hero.x < halfCanvasWidth - (halfCanvasWidth * (1/3))) {
            change = halfCanvasWidth - (halfCanvasWidth * (1/3)) - hero.x;
            hero.x = halfCanvasWidth - (halfCanvasWidth * (1/3));
            for (var b = 0; b < plats.length; b++) {
                plats[b].x += change;
                if (plats[b].id === "platform1") {
                    plats[b].x = 0;
                }
            }
        }
        if (hero.y < halfCanvasHeight - (halfCanvasHeight * (1/6))) {
            changeY = (halfCanvasHeight - (halfCanvasHeight * (1/6)) - (hero.y));
            hero.y = halfCanvasHeight - (halfCanvasHeight * (1/6));
            for (var z = 0; z < plats.length; z++) {
                plats[z].y += changeY;
            }
        }
        if (hero.y + hero.height + hero.velocity_y >= horizon) {
            changeY = horizon - (hero.y + hero.height);
            hero.y = horizon - hero.height;
            for (var x = 0; x < plats.length; x++) {
                plats[x].y += changeY;
            }
        }
    };
    this.doKill = function(spriteList, sprite) {
        if (spriteList.indexOf(sprite) > -1) {
            spriteList.splice(spriteList.indexOf(sprite), 1);
        }
        if (this.tangled.indexOf(sprite) > -1) {
            this.tangled.splice(this.tangled.indexOf(sprite), 1);
        }
    };
    this.missileControl = function(jerks, missList, curr) {
        for (var h = 0; h < missList.length; h++) {
            for (var v = 0; v < jerks.length; v++) {
                if (jerks[v].id === "Jerk") {
                    if (missList[h].velocity_x >= 0) {
                        if (missList[h].x + missList[h].width + missList[h].velocity_x >= jerks[v].x && missList[h].x + missList[h].width + missList[h].velocity_x <= jerks[v].x + jerks[v].width && missList[h].y <= jerks[v].y + jerks[v].height && missList[h].y >= jerks[v].y) {
                            jerks[v].health -= 1;
                            this.doKill(missList, missList[h]);
                            if (jerks[v].health < 1) {
                                this.doKill(jerks, jerks[v]);
                                return;
                            }
                            return;
                        }
                    }
                    else if (missList[h].velocity_x <= 0) {
                        if (missList[h].x + missList[h].velocity_x >= jerks[v].x && missList[h].x + missList[h].velocity_x <= jerks[v].x + jerks[v].width && missList[h].y <= jerks[v].y + jerks[v].height && missList[h].y >= jerks[v].y) {
                            jerks[v].health -= 1;
                            this.doKill(missList, missList[h]);
                            if (jerks[v].health < 1) {
                                this.doKill(jerks, jerks[v]);
                                return;
                            }
                            return;
                        }    
                    }
                }
                if (jerks[v].id === "platform1") {
                    if (missList[h].y + missList[h].height > jerks[v].y) {
                        this.doKill(missList, missList[h]);
                        return;
                    }
                }
            }
            if (missList[h].stamp < curr - 0.25) {
                missList[h].velocity_y += 0.5;
            }
        }
    };
    this.worldStrings = function(plats, missiles, playa, curr) {
        var jerkl = 0;
        for (var k = 0; k < plats.length; k++) {
            if (plats[k].id === "Jerk") {
                jerkl += 1;
                plats[k].update(ctx);
                plats[k].display("purple", ctx);
            }
            else if (plats[k].id === "platform1") {
				plats[k].update();
                plats[k].display("green", ctx);
			}
            else {
                plats[k].update();
                plats[k].display("black", ctx);
            }
        }
        for (var p = 0; p < missiles.length; p++) {
            missiles[p].update();
            missiles[p].display("red", ctx);
        }
		if (playa.length > 0) {
			playa[0].update(curr, vx , vy, ctx, keyS, keyW, keySPACE);
			playa[0].display(ctx);
		}
};
    this.bigBang = function(matter) {
        var cntr = 0;
        var space = [];
        for (var d = 0; d < matter.length; d++) {
            if (matter[d][4] === "ladder" || matter[d][4] === "platform1" || matter[d][4] === "platform2" || matter[d][4] === "portal") {
                space[cntr] = new Sprite(matter[d][0], matter[d][1], matter[d][2], matter[d][3], matter[d][4]);
                cntr++;
            }
            else if (matter[d][4] === "Jerk") {
                space[cntr] = new badGuy(matter[d][0], matter[d][1], matter[d][2], matter[d][3], matter[d][4]);
                cntr++;
            }
        }
        return space;
    };
}


var vx = 5;
var vy = 5;
var current = 0;

var cloud = new collideCloud();
var gameClock = new Clock();
var foreground = new background();

var playerOne = new Char(halfCanvasWidth - (halfCanvasWidth * (1/6)), horizon - 100, 100, 100, "Player");
var playerOne_Group = [playerOne];

var missileList = [];

function Mainloop() {
	if (running) {
		if (playerOne.health < 0.5) {
			cloud.doKill(playerOne_Group, playerOne);
			keyT = false;
			running = false;
		}
		current = gameClock.secondsElapsed();
		// Key Events and Log
		// Player 1
		if (keyD && !playerOne.onLadder) {
			playerOne.velocity_x = vx;
		}
		if (keyA && !playerOne.onLadder) {
			playerOne.velocity_x = vx * -1;
		}
		if (keyW && playerOne.nearLadder) {
			playerOne.climb(-1);
		}
		else {
			keyW = false;
		}
		if (keyS && playerOne.nearLadder) {
			playerOne.climb(1);
		}
		else {
			keyS = false;
		}
		if (keyT) {
			playerOne.toss(current, missileList);
		}
		else {
			playerOne.tossing = false;
		}
		if (!keyA&& !keyD) {
			playerOne.velocity_x = 0;
		}
		if (!keyW && !keyS && !playerOne.jumping) {
			playerOne.velocity_y = 0;
		}
		if (keyL) {
			console.log(cloud.tangled.length, playerOne.nearLadder, playerOne.onGround, playerOne.onPlatform, playerOne.x);
			if (cloud.tangled.length > 0) {
				console.log(cloud.tangled[0].id);
			}
		}
		if (keySPACE) {
			playerOne.jump(current);
		}
		foreground.display();
		cloud.rectDetect(allSpritesList, playerOne, current);
		cloud.stateActivate(playerOne);
		cloud.levelPush(allSpritesList, playerOne);
		cloud.missileControl(allSpritesList, missileList, current);
		cloud.worldStrings(allSpritesList, missileList, playerOne_Group, current);
    
		rAF = window.requestAnimFrame(function() {Mainloop();});
	}
	else {
		alert("Game Over, Refresh to Restart.");
		return;
	}
}

var allSpritesList = cloud.bigBang([
                            [4000, 0, 100, 2500, "portal"],
                            [0, 0, 100, 2500, "portal"],
                            [0, 2500, screen.width, screen.height - horizon, "platform1"],
                            [100, horizon, 400, 50, "platform2"],
                            [750 , horizon, 200, 50, "platform2"],
                            [1200 , horizon, 200, 50, "platform2"],
                            [1650 , horizon, 200, 50, "platform2"],
                            [2100 , horizon, 200, 50, "platform2"],
                            [2550 , horizon, 200, 50, "platform2"],
                            [3000 , horizon, 200, 50, "platform2"],
                            [3450 , horizon, 200, 50, "platform2"],
                            [3900 , horizon, 200, 50, "platform2"],
                            [800 , 2300, 200, 50, "platform2"],
                            [1300 , 2300, 200, 50, "platform2"],
                            [1650 , 1300, 200, 50, "platform2"],
                            [2100 , 1300, 200, 50, "platform2"],
                            [2550 , 1300, 200, 50, "platform2"],
                            [3000 , 1300, 200, 50, "platform2"],
                            [3450 , 1300, 200, 50, "platform2"],
                            [3900 , 1300, 200, 50, "platform2"],
                            [2550 , 2200, 200, 50, "platform2"],
                            [3000 , 2200, 200, 50, "platform2"],
                            [3450 , 2300, 200, 50, "platform2"],
                            [3900 , 2300, 200, 50, "platform2"],
                            [800 , 2300, 200, 50, "platform2"],
                            [1300 , 2300, 200, 50, "platform2"],
                            [2400, horizon, 50, 1500, "ladder"],
                            [1300, 1800, 50, horizon + 300, "ladder"],
                            [1300, 500, 50, horizon + 400, "ladder"],
                            [1700, 2500 - 100, 100, 100, "Jerk"],
                            [1000, 2500 - 100, 100, 100, "Jerk"]
                                    ]);


$("Art").ready(function(){			 
	gameClock.beginTimer();

	window.requestAnimFrame(function() {Mainloop();});
});

});