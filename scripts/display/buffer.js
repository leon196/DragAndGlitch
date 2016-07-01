

function Buffer (renderer, width, height)
{
	this.renderer = renderer;
	this.width = width;
	this.height = height;
	this.renderTextureArray = [ 
		new PIXI.RenderTexture(this.renderer, this.width, this.height),
		new PIXI.RenderTexture(this.renderer, this.width, this.height)
	];
	this.current = 0;
	this.sprite = new PIXI.Sprite(this.renderTextureArray[this.current]);
	this.dragAndDropSprite = null;
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

	this.clear = function ()
	{
		this.renderTextureArray[0].clear();
		this.renderTextureArray[1].clear();
	};

	this.print = function (container)
	{
		this.addChild(container);
		this.update();
		this.removeChild(container);
	};

	this.printFromSprite = function (sprite)
	{
		this.resizeSprite(sprite);
		this.clear();
		this.print(sprite);
	};

	this.printFromImage = function (image)
	{
		this.dragAndDropSprite = new PIXI.Sprite(new PIXI.Texture(new PIXI.BaseTexture(image)));
		this.printFromSprite(this.dragAndDropSprite);
	};

	this.printFromImageUrl = function (url)
	{
		var sprite = new PIXI.Sprite.fromImage(url);
		this.printFromSprite(sprite);
	};

	this.printBackground = function ()
	{
		if (this.dragAndDropSprite == null) {
			this.printFromImageUrl(loader.getBackground());
		} else {
			this.printFromSprite(this.dragAndDropSprite);
		}
	};

	this.reset = function ()
	{
		this.renderTextureArray = [ 
			new PIXI.RenderTexture(this.renderer, this.width, this.height),
			new PIXI.RenderTexture(this.renderer, this.width, this.height)
		];
		this.current = 0;
		this.sprite.texture = this.renderTextureArray[this.current];
	};

	this.resize = function (width, height)
	{
		this.width = width;
		this.height = height;
		this.reset();
	};

	this.resizeSprite = function (sprite)
	{
		if (sprite.width > this.width) {
			var ratio = sprite.height / sprite.width;
			sprite.width = this.width;
			sprite.height = sprite.width * ratio;
			sprite.x = 0;
			sprite.y = (this.height - sprite.height) / 2;
		} else {
			sprite.x = (this.width - sprite.width) / 2;
		}
		if (sprite.height > this.height) {
			var ratio = sprite.width / sprite.height;
			sprite.height = this.height;
			sprite.width = sprite.height * ratio;
			sprite.x = (this.width - sprite.width) / 2;
			sprite.y = 0;
		} else {
			sprite.y = (this.height - sprite.height) / 2;
		}
	};
};