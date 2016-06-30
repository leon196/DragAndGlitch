

function Buffer (renderer, width, height)
{
	this.width = width;
	this.height = height;
	this.renderTextureArray = [ 
		new PIXI.RenderTexture(renderer, this.width, this.height),
		new PIXI.RenderTexture(renderer, this.width, this.height)
	];
	this.current = 0;
	this.sprite = new PIXI.Sprite(this.renderTextureArray[this.current]);
	this.container = new PIXI.Container();
	this.container.addChild(this.sprite);

	this.update = function () 
	{
		// swap
		this.current = (this.current + 1) % 2;
		this.sprite.texture = this.renderTextureArray[this.current];
		// render
		this.renderTextureArray[(this.current + 1) % 2].render(this.container, null, false);
	};

	this.addChild = function (container)
	{
		this.container.addChild(container);
	};

	this.removeChild = function (container)
	{
		this.container.removeChild(container);
	};

	this.print = function (container)
	{
		this.addChild(container);
		this.update();
		this.removeChild(container);
	};

	this.printFromImage = function (image)
	{
		var sprite = new PIXI.Sprite.fromImage(image);
		sprite.width = this.width;
		sprite.height = this.height;
		buffer.print(sprite);
	};
};