var renderer;
var scene, filter;
var cursor;
var buffer;

PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;

function init ()
{
	var width = window.innerWidth;
	var height = window.innerHeight;

	renderer = new PIXI.WebGLRenderer(width, height, { view: document.getElementById('view') });

	buffer = new Buffer(renderer, width, height);
	scene = new PIXI.Container();
	scene.addChild(buffer.container);

	input.setup(scene);

	buffer.printBackground();

	filter = new Filter(loader.shaderArray[0]);
	buffer.container.filters = [filter];

	gui.init(scene);

	window.addEventListener("resize", resize);
	renderer.view.ondragover = ondragover;
	renderer.view.ondrop = ondrop;

	animate();
}

function animate() 
{
	requestAnimationFrame(animate);

	time.update();
	input.update();
	gui.update();

	gui.cursor.x = input.x;
	gui.cursor.y = input.y;

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

	filter.update();

	if (gui.dragAnchor == 'Follow') {
		filter.uniforms.brushPosition.value[0] = input.x;
		filter.uniforms.brushPosition.value[1] = input.y;
	} else if (gui.dragAnchor == 'Origin') {
		filter.uniforms.brushPosition.value[0] = input.dragOrigin.x;
		filter.uniforms.brushPosition.value[1] = input.dragOrigin.y;
		if (input.down) {
			gui.cursor.x = input.dragOrigin.x;
			gui.cursor.y = input.dragOrigin.y;
		}
	}

	if (input.down) {

		filter.uniforms.brushStrength.value = gui.brushStrength;

		var rot = 0;

		if (gui.dragStyle == 'Relative') {
			filter.uniforms.brushDrag.value[0] = input.dragDelta.x;
			filter.uniforms.brushDrag.value[1] = input.dragDelta.y;
			rot = length(input.dragDelta) / 100;
		} else if (gui.dragStyle == 'Absolute') {
			filter.uniforms.brushDrag.value[0] = input.drag.x / 10;
			filter.uniforms.brushDrag.value[1] = input.drag.y / 10;
			rot = length(input.drag) / 1000;
		}

		gui.cursor.rotation += rot / gui.brushStrength;

	} else {
		gui.cursor.rotation = 0;
	}

	buffer.update();
	renderer.render(scene);
}

function resize ()
{
	var width = window.innerWidth;
	var height = window.innerHeight;
	renderer.resize(width, height);
	buffer.resize(width, height);
	buffer.printBackground();
	filter.uniforms.resolution.value[0] = window.innerWidth;
	filter.uniforms.resolution.value[1] = window.innerHeight;
}