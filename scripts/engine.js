var renderer, resolution, aspectRatio;
var scene, stage, sprite, filter, text;
var renderTexture1, renderTexture2, currentTexture;
var timeStarted, timeElapsed, timeScale;
var clicStart, clicDelay = 0.5;
var image, cursor;
var cursorRotSeed;

PIXI.loader.add('shader','shaders/test.frag');
PIXI.loader.once('complete', onLoaded);
PIXI.loader.load();

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

function CustomFilter (fragmentSource)
{
	PIXI.AbstractFilter.call(this, null, fragmentSource, { 
		uTime : { type: '1f', value: 0 },
		uStrength : { type: '1f', value: 0 },
		uStrength : { type: '1f', value: 0 },
		uResolution : { type: '2f', value: [window.innerWidth, window.innerHeight] },
		uTarget : { type: '2f', value: [0, 0] } ,
		uOffset : { type: '2f', value: [0, 0] } ,
		uImage : { type : 'sampler2D', value : 0},
		uBuffer : { type : 'sampler2D', value : 0}
	} );
}

CustomFilter.prototype = Object.create(PIXI.AbstractFilter.prototype);
CustomFilter.prototype.constructor = CustomFilter;

function onLoaded (loader, res)
{
	aspectRatio = window.innerWidth / window.innerHeight;
	// resolution = { x: 256 * aspectRatio, y: 256 };
	resolution = { x: window.innerWidth, y: window.innerHeight };
	renderer = new PIXI.WebGLRenderer(resolution.x, resolution.y);
	document.body.appendChild(renderer.view);
	stage = new PIXI.Container();

	renderTexture1 = new PIXI.RenderTexture(renderer, resolution.x, resolution.y);
	renderTexture2 = new PIXI.RenderTexture(renderer, resolution.x, resolution.y);
	currentTexture = renderTexture1;
	renderTexture1.scaleMode = PIXI.SCALE_MODES.NEAREST;
	renderTexture2.scaleMode = PIXI.SCALE_MODES.NEAREST;
	sprite = new PIXI.Sprite(currentTexture);
	sprite.texture.scaleMode = PIXI.SCALE_MODES.NEAREST;
	stage.addChild(sprite);

	scene = new PIXI.Container();
	scene.addChild(stage);
	

  stage.interactive = true;
  stage.on('mousedown', Mouse.onClic).on('touchstart', Mouse.onClic);
  stage.on('mouseup', Mouse.onMouseUp).on('touchend', Mouse.onMouseUp);
  stage.on('mousemove', Mouse.onMove).on('touchmove', Mouse.onMove);

	// text = new PIXI.Text('SCREENSAVING',{font : '24px Arial', fill : 0xffffff, align : 'center'});
	// text.anchor.set(0.5);
	// text.position.x = resolution.x / 2;
	// text.position.y = resolution.y / 2;
	// stage.addChild(text);

	image = new PIXI.Sprite.fromImage('images/carte-monde-pays-drapeau.png');
	// image = new PIXI.Sprite.fromImage('images/europe.png');
	// image = new PIXI.Sprite.fromImage('images/farage.jpg');
	// image.scale.set(0.3);
	image.width = window.innerWidth;
	image.height = window.innerHeight;
	image.scaleMode = PIXI.SCALE_MODES.NEAREST;
	stage.addChild(image);

	cursor = new PIXI.Sprite.fromImage('images/pognon.png');
	cursor.scaleMode = PIXI.SCALE_MODES.NEAREST;
	cursor.scale.set(0.4);
	cursor.anchor.set(0.5);
	// stage.addChild(cursor);

	var fragmentSrc = res.shader.data;
	filter = new CustomFilter(fragmentSrc);
	filter.uniforms.uImage.value = image.texture;
	stage.filters = [filter];

	timeScale = 1000;
	timeStarted = new Date() / timeScale;
	timeElapsed = 0;

	animate();
}

function lerp (a, b, t)
{
	return a * (1.0 - t) + b * t;
}

function animate() 
{
	timeElapsed = new Date() / timeScale - timeStarted;

	requestAnimationFrame(animate);

	if (Mouse.clic) {
		Mouse.clic = false;
		clicStart = timeElapsed;
		if (image) {
			stage.removeChild(image);
			image = null;
		}
		cursorRotSeed = Math.random() * 2.0;
	}

	cursor.x = Mouse.x;
	cursor.y = Mouse.y;
	
	filter.uniforms.uStrength.value = 0;

	if (Mouse.down) {
		filter.uniforms.uTarget.value[0] = Mouse.x;
		filter.uniforms.uTarget.value[1] = Mouse.y;
		filter.uniforms.uOffset.value[0] = Mouse.panX;
		filter.uniforms.uOffset.value[1] = Mouse.panY;
	// 	filter.uniforms.uTarget.value[0] = Mouse.x;
	// 	filter.uniforms.uTarget.value[1] = Mouse.y;
		filter.uniforms.uStrength.value = 1;
	} else {
	}

	// if (clicStart + clicDelay > timeElapsed) {
	// 	var ratio = Math.max(0.0, Math.min(1.0, (timeElapsed - clicStart) / clicDelay));
	// 	filter.uniforms.uStrength.value = 1.0 - ratio;
	// 	// filter.uniforms.uStrength.value = Math.sin(ratio * Math.PI);
	// 	cursor.rotation = lerp(cursor.rotation, cursorRotSeed * Math.PI * 2.0, ratio);
	// } else {
	// }


	filter.uniforms.uTime.value = timeElapsed;
	// text.tint = 0xffffff * Math.random();
	// text.scale.x = 1. + Math.cos(timeElapsed * 10.) * 0.5 + 0.5;
	// text.scale.y = 1. + Math.sin(timeElapsed * 10.) * 0.5 + 0.5;

	var temp = renderTexture1;
	renderTexture1 = renderTexture2;
	renderTexture2 = temp;
	sprite.texture = renderTexture1;

	// filter.uniforms.uBuffer.value = sprite.texture;

	renderTexture2.render(stage, null, false);
	renderTexture1.scaleMode = PIXI.SCALE_MODES.NEAREST;
	renderTexture2.scaleMode = PIXI.SCALE_MODES.NEAREST;

	renderer.render(scene);
}