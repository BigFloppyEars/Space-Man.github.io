
// Stuff form creating a screen slash canvas.
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');
//canvas.width = document.body.clientWidth; 
//canvas.height = document.body.clientHeight;
var halfCanvasWidth = (canvas.width/2);
var halfCanvasHeight = (canvas.height/2);  
var horizon = canvas.height * (4 / 5);
var spriteSheet = document.getElementById("spriteSheet");
var backTheGround = document.getElementById("backTheGround");

var rAF
// PLAYER 1 KEYS
var keyW = false;
var keyA = false;
var keyS = false;
var keyD = false;
var keyL = false;
var keyT = false;
var keySPACE = false;

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
		ctx.drawImage(backTheGround , 0, 0, 1000, 1000, 0, 0, canvas.width, canvas.height);
    }
};

// Basic Sprite & Platform constructor
function Sprite(x, y, width, height, id) {
    this.id = id;
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.velocity_x = 0;
    this.velocity_y = 0;
    this.stamp = 0;
};
Sprite.prototype.update = function() {
    this.x += this.velocity_x;
    this.y += this.velocity_y;
};
Sprite.prototype.display = function(color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
};

// Enemy Constructor
function badGuy(x, y, width, height, id) {
    Sprite.call(this, x, y, width, height, id);
    this.patrol = 0;
    this.d_LEFT = true;
    this.d_RIGHT = false;
    this.health = 5;
    this.healthBar = new Sprite(this.x, this.y - 20, this.health * 20, 20);
};

badGuy.prototype = Object.create(Sprite.prototype);
badGuy.prototype.constructor = badGuy;

badGuy.prototype.update = function () {
    this.patrol += this.velocity_x;
    if (this.patrol > 300) {
        this.d_LEFT = true;
        this.d_RIGHT = false;
    }
    else if (this.patrol < -300) {
        this.d_LEFT = false;
        this.d_RIGHT = true;
    }
    if (this.d_LEFT) {
        this.velocity_x = -4;
    }
    else if (this.d_RIGHT) {
        this.velocity_x = 4;
    }
    this.y += this.velocity_y;
    this.x += this.velocity_x;
    this.healthBar.display("white");
    this.healthBar.width = this.health * 20;
    this.healthBar.x = this.x + this.velocity_x;
    //this.healthBar.x += this.velocity_x;
    this.healthBar.y = this.y -20;
    };
badGuy.prototype.display = function(color) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
};

// Character constructor
function Char(x, y, width, height, id) {
    Sprite.call(this, x, y, width, height, id);
    this.playtime = 0;
    this.toss_stamp = 0;
    // Orientation Variables
    this.outOfBounds = false;
    this.d_RIGHT = true;
    this.d_LEFT = false;
    this.rightWalking = false;
    this.leftWalking = false;
    this.onGround = false;
    this.jumping = false;
    this.nearLadder = false;
    this.onLadder = false;
    this.onPlatform = false;
    // Attack / Interactions
    this.tossing = false;
    // Health
    this.health = 100;
    this.healthBar = new Sprite(this.x, this.y - 20, this.health * 20, 10);
    // Sprite Animation Variables
    this.numWalkImages = 14;
    this.currRightWalk = 0;
    this.currLeftWalk = 14;
}

Char.prototype = Object.create(Sprite.prototype);
Char.prototype.constructor = Char;
    
    // Render or draw character
Char.prototype.display = function () {
    if (this.d_RIGHT && this.jumping) {
        ctx.drawImage(spriteSheet , 0, 200, this.width, this.height, this.x, this.y +2, this.width, this.height);
    }
    else if (this.d_LEFT && this.jumping) {
        ctx.drawImage(spriteSheet , 200, 300, this.width, this.height, this.x, this.y +2, this.width, this.height);
    }
    else if (this.rightWalking) {
        ctx.drawImage(spriteSheet , (this.currRightWalk)*100, 400, this.width, this.height, this.x, this.y +2, this.width, this.height);
    }
    else if (this.leftWalking) {
        ctx.drawImage(spriteSheet , (this.currLeftWalk)*100, 500, this.width, this.height, this.x, this.y +2, this.width, this.height);
    }
    else {
        if (this.d_RIGHT) {
            ctx.drawImage(spriteSheet , 0, 0, this.width, this.height, this.x, this.y +2, this.width, this.height);
        }
        else if (this.d_LEFT) {
            ctx.drawImage(spriteSheet , 0, 100, this.width, this.height, this.x, this.y +2, this.width, this.height);
        }
    }
    // Sprite Walking Rules
    // Right
    if (this.rightWalking == false || this.currRightWalk > this.numWalkImages) {
        this.currRightWalk = 0;
    }
    else {
        this.currRightWalk += 1;
    }
    // Left
    if (this.lefttWalking == false || this.currLeftWalk < 1) {
        this.currLeftWalk = this.numWalkImages;
    }
    else {
        this.currLeftWalk -= 1;
    }
};
    
Char.prototype.update = function(curr) {
    this.playtime = curr;
    if (this.health < 0) {
        this.health = 0;
    }
    this.healthBar.display("white");
    this.healthBar.width = this.health * 1;
    this.healthBar.x = this.x;
    this.healthBar.y = this.y -20 + this.velocity_y;
    if (this.stamp + 0.1 < this.playtime) {
        self.jumping = false;
    }
    // Gravity
    if (!this.onGround && !this.onPlatform && !this.onLadder) {
        this.jumping = true;
    }
    if (this.jumping && !this.onLadder && this.velocity_y < 10) {
        this.velocity_y += 1;
    }
    // Borders
    if (this.y - this.velocity_y < 0) {
        this.y = 0;
    }
    // Orientation
    if (this.velocity_x > 0) {
        this.rightWalking = true;
        this.leftWalking = false
        this.d_RIGHT = true;
        this.d_LEFT = false;
    }
    if (this.velocity_x < 0) {
        this.rightWalking = false;
        this.leftWalking = true;
        this.d_RIGHT = false;
        this.d_LEFT = true;
    }
    if (this.velocity_x <= 0){
        this.rightWalking = false;
    }
    if (this.velocity_x >= 0){
        this.leftWalking = false;
    }
    if (!keyS && !keyW && this.onGround || keySPACE) {
        this.onLadder = false;
    }
    if (this.onLadder) {
        this.velocity_x = 0
        this.leftWalking = false;
        this.rightWalking = false;
    }
    if (this.outOfBounds) {
        this.velocity_x = 0;
    }
    // Health Bar Update
    this.x += this.velocity_x;
    this.y += this.velocity_y;
};
Char.prototype.jump = function(stamp) {
    if (this.onLadder && !this.onPlatform && !this.onGround) {
        this.onLadder = false;
        this.velocity_y = 0;
        this.jumping = true;
    }
    else if (this.onGround && !this.jumping) {
        this.stamp = stamp;
        this.jumping = true;
        this.velocity_y -= 20;
    }
};
Char.prototype.climb = function(m) {
    if (this.nearLadder) {
        this.onLadder = true;
    }
    if (this.onLadder) {
        this.velocity_y = (vy * m);
    }
};
Char.prototype.toss = function(t_stamp, m_array) {
    var ball;
    if (!this.onLadder && !this.tossing && this.toss_stamp + 0.25 < this.playtime) {
    this.tossing = true;
        this.toss_stamp = t_stamp;
        if (this.d_LEFT) {
            ball = new Sprite(this.x - 25, this.y, 25, 25, "ball");
            ball.velocity_x = -10;
        }
        else if (this.d_RIGHT) {
            ball = new Sprite(this.x + this.width, this.y, 25, 25, "ball");
            ball.velocity_x = 10;
        }
        ball.stamp = this.toss_stamp;
        m_array.push(ball);
    }
};

function Clock() {
    this.start;
    this.last;
    this.end;
    this.fps;
    this.current;
this.beginTimer = function() {
        this.start = Date.now();
    }
this.secondsElapsed = function() {
        this.last = this.current;
        this.end = Date.now();
        this.current = ((this.end - this.start)/1000);
        this.fps = 1/(this.current - this.last);
        return this.current;
    }
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
    }
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
                if (hero.onLadder == false && hero.velocity_y > -1) {
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
    }
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
    }
    this.doKill = function(spriteList, sprite) {
        if (spriteList.indexOf(sprite) > -1) {
            spriteList.splice(spriteList.indexOf(sprite), 1);
        }
        if (this.tangled.indexOf(sprite) > -1) {
            this.tangled.splice(this.tangled.indexOf(sprite), 1);
        }
    }
    this.missileControl = function(jerks, missList, curr) {
        for (var h = 0; h < missList.length; h++) {
            for (var v = 0; v < jerks.length; v++) {
                if (jerks[v].id === "Jerk") {
                    if (missList[h].velocity_x >= 0) {
                        if (missList[h].x + missList[h].width + missList[h].velocity_x >= jerks[v].x && missList[h].x + missList[h].width + missList[h].velocity_x <= jerks[v].x + jerks[v].width && missList[h].y <= jerks[v].y + jerks[v].height && missList[h].y >= jerks[v].y) {
                            jerks[v].health -= 1;
                            this.doKill(missList, missList[h])
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
                            this.doKill(missList, missList[h])
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
                        this.doKill(missList, missList[h])
                        return;
                    }
                }
            }
            if (missList[h].stamp < curr - 0.25) {
                missList[h].velocity_y += 0.5;
            }
        }
    }
    this.worldStrings = function(plats, missiles, playa, curr) {
        var jerkl = 0;
        for (var k = 0; k < plats.length; k++) {
            if (plats[k].id === "Jerk") {
                jerkl += 1;
                plats[k].update();
                plats[k].display("purple");
            }
            else {
                plats[k].update();
                plats[k].display("black");
            }
        }
        for (var p = 0; p < missiles.length; p++) {
            missiles[p].update();
            missiles[p].display("red");
        }
		if (playa.length > 0) {
			playa[0].update(curr);
			playa[0].display();
		}
    }
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
    }
};


var vx = 5;
var vy = 5;
var current = 0;

var cloud = new collideCloud();
var gameClock = new Clock();
var foreground = new background();

var playerOne = new Char(halfCanvasWidth - (halfCanvasWidth * (1/6)), horizon - 100, 100, 100, "Player");
var playerOne_Group = [playerOne];


var missileList = [];

function statsDisplay() {
    ctx.font="20px Arial";
    ctx.fillText(playerOne.id, playerOne.x, playerOne.y - 20);
    var i = gameClock.fps.toString();
    ctx.fillText(i, canvas.width/2 + 300, 50);
}

function screenReSize(all, misses, hero) {
    for (var c = 0; c < all.length; c++) {
        if (all[c].id !== "platform1") {
            all[c].x = all[c].x * (1/8);
            all[c].width = all[c].width * (1/8);
            all[c].velocity_x = all[c].velocity_x * (1/8);
            all[c].y = all[c].y * (1/8);
            all[c].height = all[c].height * (1/8);
            all[c].velocity_y = all[c].velocity_y * (1/8);
        }
        else {
            all[c].width = all[c].width * (1/2);
            all[c].height = all[c].height * (1/8);
            all[c].y = all[c].y * (1/8);
        }
    }
    for (var a = 0; a < misses.length; a++) {
        misses[a].x = misses[a].x * (1/8);
        misses[a].width = misses[a].width * (1/8);
        misses[a].velocity_x = misses[a].velocity_x * (1/8);
        misses[a].y = misses[a].y * (1/8);
        misses[a].height = misses[a].height * (1/8);
        misses[a].velocity_y = misses[a].velocity_y * (1/8);
    }
    hero.x = hero.x * (1/8);
    hero.width = hero.width * (1/8);
    hero.velocity_x = hero.velocity_x * (1/8);
    hero.y = hero.y * (1/8);
    hero.height = hero.height * (1/8);
    hero.velocity_y = hero.velocity_y * (1/8);
}

function Mainloop() {
    if (playerOne.health < 0.5) {
        cloud.doKill(playerOne_Group, playerOne)
    }
    current = gameClock.secondsElapsed();
    // Key Events and Log
    // Player 1
    if (keyD == true && !playerOne.onLadder) {
        playerOne.velocity_x = vx;
    }
    if (keyA == true && !playerOne.onLadder) {
        playerOne.velocity_x = vx * -1;
    }
    if (keyW == true && playerOne.nearLadder) {
        playerOne.climb(-1);
    }
    else {
        keyW = false;
    }
    if (keyS == true && playerOne.nearLadder) {
        playerOne.climb(1);
    }
    else {
        keyS = false;
    }
    if (keyT == true) {
        playerOne.toss(current, missileList);
    }
    else {
        playerOne.tossing = false;
    }
    if (keyA == false && keyD == false) {
        playerOne.velocity_x = 0;
    }
    if (keyW == false && keyS == false && !playerOne.jumping) {
        playerOne.velocity_y = 0;
    }
    if (keyL == true) {
        console.log(cloud.tangled.length, playerOne.nearLadder, playerOne.onGround, playerOne.onPlatform, playerOne.x);
        if (cloud.tangled.length > 0) {
            console.log(cloud.tangled[0].id);
        }
    }
    if (keySPACE == true) {
        playerOne.jump(current);
    }
    foreground.display();
    statsDisplay();
    cloud.rectDetect(allSpritesList, playerOne, current);
    cloud.stateActivate(playerOne);
    cloud.levelPush(allSpritesList, playerOne);
    cloud.missileControl(allSpritesList, missileList, current);
    cloud.worldStrings(allSpritesList, missileList, playerOne_Group, current)
    
    rAF = window.requestAnimationFrame(Mainloop);
};

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
                            [400, 800, 50, 1700, "ladder"],
                            [2300, 1800, 50, horizon + 300, "ladder"],
                            [1300, 500, 50, horizon + 400, "ladder"],
                            [1700, 2500 - 100, 100, 100, "Jerk"],
                            [1000, 2500 - 100, 100, 100, "Jerk"]
                                    ]);

//screenReSize(allSpritesList, missileList, playerOne);

$("Art").ready(function(){			 
	gameClock.beginTimer();

	window.requestAnimationFrame(Mainloop);
});

