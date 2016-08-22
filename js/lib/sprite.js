define("sprite", function(){
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
	}
	Sprite.prototype.update = function() {
		this.x += this.velocity_x;
		this.y += this.velocity_y;
	};
	Sprite.prototype.display = function(color, ctx) {
        ctx.fillStyle = color;
        ctx.fillRect(this.x, this.y, this.width, this.height);
	};
	return Sprite;
});