var renderer;
var scene, filter;
var cursor;
var buffer;

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

function init ()
{
	var width = window.innerWidth;
	var height = window.innerHeight;

	renderer = new PIXI.WebGLRenderer(width, height);
	document.body.appendChild(renderer.view);

	buffer = new Buffer(renderer, width, height);
	scene = new PIXI.Container();
	scene.addChild(buffer.container);

	input.setup(scene);

	buffer.printFromImage(loader.imageArray[gui.currentImage]);

	filter = new Filter(loader.shaderArray[0]);
	buffer.container.filters = [filter];

	gui.init(scene);

	animate();
}

function animate() 
{
	time.update();

	requestAnimationFrame(animate);

	if (input.clic) {
		input.clic = false;
		// input.start = time.elapsed;
		// cursorRotSeed = Math.random() * 2.0;
	}

	// if (input.start + input.delay > time.elapsed) {
	// 	var ratio = Math.max(0.0, Math.min(1.0, (time.elapsed - input.start) / clicDelay));
	// 	filter.uniforms.uStrength.value = 1.0 - ratio;
	// 	// filter.uniforms.uStrength.value = Math.sin(ratio * Math.PI);
	// 	cursor.rotation = lerp(cursor.rotation, cursorRotSeed * Math.PI * 2.0, ratio);
	// } else {
	// }
	gui.update();

	filter.updateDrag(input.down);
	filter.update();
	buffer.update();

	renderer.render(scene);
}