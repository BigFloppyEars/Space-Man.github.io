define("player", ["sprite"], function(Sprite){
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
		this.healthBar = new Sprite(this.x, this.y - 20, this.health * 20, 10, "healthbar");
		// Sprite Animation Variables
		this.numWalkImages = 14;
		this.currRightWalk = 0;
		this.currLeftWalk = 14;
	}

	Char.prototype = Object.create(Sprite.prototype);
	Char.prototype.constructor = Char;
    
	// Render or draw character
	Char.prototype.display = function (ctx) {
		if (this.d_RIGHT && this.jumping && this.velocity_y < 0) {
			ctx.drawImage(spriteSheet , 200, 200, this.width, this.height, this.x, this.y +2, this.width, this.height);
		}
		else if (this.d_RIGHT && this.jumping && this.velocity_y > 0) {
			ctx.drawImage(spriteSheet , 0, 200, this.width, this.height, this.x, this.y +2, this.width, this.height);
		}
		else if (this.d_LEFT && this.jumping && this.velocity_y < 0) {
			ctx.drawImage(spriteSheet , 0, 300, this.width, this.height, this.x, this.y +2, this.width, this.height);
		}
		else if (this.d_LEFT && this.jumping && this.velocity_y > 0) {
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
		if (!this.rightWalking || this.currRightWalk > this.numWalkImages) {
			this.currRightWalk = 0;
		}
		else {
			this.currRightWalk += 1;
		}
		// Left
		if (!this.leftWalking || this.currLeftWalk < 1) {
			this.currLeftWalk = this.numWalkImages;
		}
		else {
			this.currLeftWalk -= 1;
		}
	};
    
	Char.prototype.update = function(curr, ctx) {
		this.playtime = curr;
		if (this.health < 0) {
			this.health = 0;
		}
		this.healthBar.display("white", ctx);
		this.healthBar.width = this.health * 1;
		this.healthBar.x = this.x;
		this.healthBar.y = this.y -20 + this.velocity_y;
		if (this.stamp + 0.1 < this.playtime) {
			this.jumping = false;
		}
		// Gravity
		if (!this.onGround && !this.onPlatform && !this.onLadder) {
			this.jumping = true;
		}
		if (this.jumping && !this.onLadder && this.velocity_y < 10) {
			this.velocity_y += 1;
		}
		// Orientation
		if (this.velocity_x > 0) {
			this.rightWalking = true;
			this.leftWalking = false;
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
		if (this.onLadder) {
			this.velocity_x = 0;
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
			this.velocity_y = (5 * m);
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
	return Char;
});