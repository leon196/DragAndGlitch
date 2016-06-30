
var loader = {};

loader.shaderNames = ['drag', 'boom'];
loader.imageNames = ['carte-monde-pays-drapeau.png'];
loader.shaderArray = [];
loader.imageArray = [];

loader.init = function ()
{
	for (var i = 0; i < loader.shaderNames.length; ++i) {
		PIXI.loader.add('shader' + i,'shaders/' + loader.shaderNames[i] + '.frag');
	}

	for (var i = 0; i < loader.imageNames.length; ++i) {
		PIXI.loader.add('background' + i,'images/' + loader.imageNames[i]);
		loader.imageArray.push('images/' + loader.imageNames[i]);
	}

	PIXI.loader.once('complete', loader.complete);
	PIXI.loader.load();
};

loader.complete = function (self, resources)
{
	for (var i = 0; i < loader.shaderNames.length; ++i) {
		loader.shaderArray.push(resources['shader' + i].data);
	}
	init();
}

loader.init();