
function Cursor (fragmentSource)
{
	PIXI.Graphics.call(this);

	this.circle = function (x, y, radius)
	{
		this.clear();
		this.moveTo(x + radius, y);
		var segment = Math.ceil(radius / 2);
		segment += segment % 2;
		for (var i = 1; i <= segment; ++i) {
			var color = i % 2 ? 0xffffff : 0x000000;
			this.lineStyle(2, color, 1);
			var xx = Math.cos(i / segment * 3.1416 * 2) * radius;
			var yy = Math.sin(i / segment * 3.1416 * 2) * radius;
			this.lineTo(x + xx, y + yy);	
		}

		var pointSize = 0.2;
		segment = Math.ceil(radius / 40);
		segment += segment % 2;
		this.lineStyle(2, 0x000000, 1);
		this.moveTo(x + radius * pointSize, y);
		for (var i = segment ; i >= 0; --i) {
			var color = i % 2 ? 0xffffff : 0x000000;
			this.lineStyle(2, color, 1);
			this.lineTo(x + radius * pointSize * ((i / (segment + 1)) * 2 - 1), y);
		}
		this.moveTo(x, y + radius * pointSize);
		for (var i = segment ; i >= 0; --i) {
			var color = i % 2 ? 0xffffff : 0x000000;
			this.lineStyle(2, color, 1);
			this.lineTo(x, y + radius * pointSize * ((i / (segment + 1)) * 2 - 1));
		}
	}
}

Cursor.prototype = Object.create(PIXI.Graphics.prototype);
Cursor.prototype.constructor = Cursor;