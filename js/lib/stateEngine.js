define(["sprite", "enemy"], function(Sprite, badGuy){

	function collideCloud() {
		this.tangled = [];
	};
	
    collideCloud.prototype.doKill = function(spriteList, sprite) {
        if (spriteList.indexOf(sprite) > -1) {
            spriteList.splice(spriteList.indexOf(sprite), 1);
        }
        if (spriteList !== this.tangled && this.tangled.indexOf(sprite) > -1) {
            this.tangled.splice(this.tangled.indexOf(sprite), 1);
        }
		return spriteList;
    };
	
    collideCloud.prototype.rectDetect = function (fiends, hero) {
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
	
    collideCloud.prototype.stateActivate = function(hero, losers , curr) {
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
					this.tangled[j].health -= 1;
                    hero.y = this.tangled[j].y - hero.height;
                    hero.onGround = true;
                    hero.onPlatform = true;
                    hero.jumping = false;
                    hero.jump(curr);
                    if (this.tangled[j].health < 0) {
                        this.doKill(losers, this.tangled[j]);
                        return;
                    }
					return;
                }
                else if (hero.x + hero.width > this.tangled[j].x && hero.x + hero.width < this.tangled[j].x + this.tangled[j].width && hero.y + hero.height > this.tangled[j].y) {
                    hero.x = this.tangled[j].x - hero.width;
					if (hero.onLadder) {
						hero.onLadder = false;
						hero.velocity_y = 0;
						hero.jumping = true;
					}
                    hero.health -= 1;
					return;
                }
                else if (hero.x > this.tangled[j].x && hero.x < this.tangled[j].x + this.tangled[j].width && hero.y + hero.height > this.tangled[j].y) {
                    hero.x = this.tangled[j].x + this.tangled[j].width;
					if (hero.onLadder) {
						hero.onLadder = false;
						hero.velocity_y = 0;
						hero.jumping = true;
					}
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
	
    collideCloud.prototype.levelPush = function(plats, hero) {
        var change;
        var changeY;
        if (hero.x + hero.width > 600) {
            change = 600 - (hero.x + hero.width);
            hero.x = 600 - hero.width;
            for (var q = 0; q < plats.length; q++) {
                plats[q].x += change;
                if (plats[q].id === "platform1") {
                    plats[q].x = 0;
                }
            }
        }
        if (hero.x < 300) {
            change = 300 - hero.x;
            hero.x = 300;
            for (var b = 0; b < plats.length; b++) {
                plats[b].x += change;
                if (plats[b].id === "platform1") {
                    plats[b].x = 0;
                }
            }
        }
        if (hero.y < 500 - (500 * (1/6))) {
            changeY = (500 - (500 * (1/6)) - (hero.y));
            hero.y = 500 - (500 * (1/6));
            for (var z = 0; z < plats.length; z++) {
                plats[z].y += changeY;
            }
        }
        if (hero.y + hero.height + hero.velocity_y >= 400) {
            changeY = 400 - (hero.y + hero.height);
            hero.y = 400 - hero.height;
            for (var x = 0; x < plats.length; x++) {
                plats[x].y += changeY;
            }
        }
    }
	
    collideCloud.prototype.missileControl = function(jerks, missList, curr) {
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
	
    collideCloud.prototype.worldStrings = function(plats, missiles, playa, curr, ctx) {
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
			playa[0].update(curr, ctx);
			playa[0].display(ctx);
		}
	};
	
    collideCloud.prototype.bigBang = function(matter) {
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
	
	return collideCloud;
});