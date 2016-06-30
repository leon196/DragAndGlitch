
var gui = {};

gui.brushStyle = 'Drag';
gui.brushShape = 'Circle';
gui.brushRadius = 100;
gui.brushInverse = false;

gui.cursor;
gui.showCursor = true;
gui.currentImage = 0;

gui.filterMode = 'Nearest';

gui.init = function (container)
{
	var datGUI = new dat.GUI();
	datGUI.remember(gui);

	var brush = datGUI.addFolder('Brush');
	brush.add(gui, 'brushStyle', [ 'Drag' ]).name('Style').onFinishChange(function (value) {});
	// brush.add(gui, 'brushShape', [ 'Circle' ]).name('Shape');
	brush.add(gui, 'brushRadius', 1, 1000).name('Radius').listen().onChange(gui.updateBrushRadius);
	brush.add(gui, 'brushInverse').name('Inverse').onFinishChange(gui.updateBrushInverse);
	brush.open();

	// datGUI.add(gui, 'showCursor').name('Show Cursor');
	datGUI.add(gui, 'reset').name('Reset');

	var advanced = datGUI.addFolder('Advanced');
	advanced.add(gui, 'filterMode', ['Nearest', 'Linear']).name('Filter Mode')
		.onFinishChange(gui.updateFilterMode);

	gui.cursor = new Cursor();
	gui.cursor.circle(0, 0, gui.brushRadius);
	gui.cursor.x = input.x;
	gui.cursor.y = input.y;
	container.addChild(gui.cursor);
};

gui.reset = function () 
{
	buffer.printFromImage(loader.imageArray[gui.currentImage]);
};

gui.update = function ()
{
	gui.cursor.x = input.x;
	gui.cursor.y = input.y;

	if (Math.abs(input.wheel) > 0) {
		gui.brushRadius = clamp(gui.brushRadius + input.wheel / 10, 1, 1000);
		gui.updateBrushRadius(gui.brushRadius);
		input.wheel = 0;
	}
};

gui.updateBrushRadius = function (value)
{
	gui.cursor.circle(0, 0, value);
	filter.uniforms.brushRadius.value = gui.brushRadius;
};

gui.updateBrushInverse = function (value)
{
	filter.uniforms.brushInverse.value = value ? 1 : 0;
};

gui.updateFilterMode = function (value)
{
	if (value == 'Nearest') {
		PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
	} else if (value == 'Linear') {	
		PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.LINEAR;
	}
	buffer.reset();
	gui.reset();
};
