
function Cursor (fragmentSource)
{
	PIXI.Graphics.call(this);

	this.circle = function (x, y, radius)
	{
		this.clear();
		this.moveTo(x + radius, y);
		var segment = Math.ceil(radius / 2);
		for (var i = 1; i <= segment; ++i) {
			var color = i % 2 ? 0xffffff : 0x000000;
			this.lineStyle(2, color, 1);
			var xx = Math.cos(i / segment * 3.1416 * 2) * radius;
			var yy = Math.sin(i / segment * 3.1416 * 2) * radius;
			this.lineTo(x + xx, y + yy);	
		}
		// this.drawRect(50, 250, 100, 100);
		// this.lineStyle(0);
		// this.beginFill(0xFFFF0B, 0.5);
		// this.endFill();
	}
	// cursor = new PIXI.Sprite.fromImage('images/pognon.png');
	// cursor.scaleMode = PIXI.SCALE_MODES.NEAREST;
	// cursor.scale.set(0.4);
	// cursor.anchor.set(0.5);
	// scene.addChild(cursor);
}

Cursor.prototype = Object.create(PIXI.Graphics.prototype);
Cursor.prototype.constructor = Cursor;