define("enemy", ["sprite"], function(Sprite){
// Enemy Constructor
	function badGuy(x, y, width, height, id) {
		Sprite.call(this, x, y, width, height, id);
		this.patrol = 0;
		this.d_LEFT = true;
		this.d_RIGHT = false;
		this.health = 5;
		this.healthBar = new Sprite(this.x, this.y - 20, this.health * 20, 20, "healthbar");
	}

	badGuy.prototype = Object.create(Sprite.prototype);
	badGuy.prototype.constructor = badGuy;

	badGuy.prototype.update = function (ctx) {
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
		this.healthBar.display("white", ctx);
		this.healthBar.width = this.health * 20;
		this.healthBar.x = this.x + this.velocity_x;
		//this.healthBar.x += this.velocity_x;
		this.healthBar.y = this.y -20;
	};
	badGuy.prototype.display = function(color, ctx) {
		ctx.fillStyle = color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	return badGuy;
});