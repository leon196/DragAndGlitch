
var gui = {};

gui.brushStyle = '';
gui.brushRadius = 100;
gui.brushInverse = false;
gui.brushStrength = 1;
gui.brushSoftness = true;
gui.dragStyle = 'Relative';
gui.dragAnchor = 'Follow';

gui.cursor;
gui.showCursor = true;
gui.currentImage = 0;

gui.filterMode = 'Nearest';

gui.init = function (container)
{
	gui.brushStyle = loader.shaderNames[0];

	var datGUI = new dat.GUI();
	datGUI.remember(gui);

	var brush = datGUI.addFolder('Brush');
	brush.add(gui, 'brushStyle', loader.shaderNames).name('Style').onChange(gui.updateBrushStyle);
	brush.add(gui, 'brushStrength', 1, 10).name('Strength');
	brush.add(gui, 'brushRadius', 1, 1000).name('Radius').listen().onChange(gui.updateBrushRadius);
	brush.add(gui, 'brushInverse').name('Inverse').onChange(gui.updateBrushInverse);
	brush.open();
	
	var control = datGUI.addFolder('Drag');
	control.add(gui, 'dragStyle', ['Relative', 'Absolute']).name('Offset');
	control.add(gui, 'dragAnchor', ['Follow', 'Origin']).name('Anchor');
	control.add(gui, 'brushSoftness').name('Soft').onChange(gui.updateBrushSoftness);
	control.open();

	datGUI.add(gui, 'showCursor').name('Show Cursor').onChange(gui.updateShowCursor);
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
	var shouldReset = confirm("Reset pixels ?");
	if (shouldReset) {
		buffer.printFromImage(loader.imageArray[gui.currentImage]);
	}
};

gui.update = function ()
{
	if (Math.abs(input.wheel) > 0) {
		gui.brushRadius = clamp(gui.brushRadius + input.wheel / 10, 1, 1000);
		gui.updateBrushRadius(gui.brushRadius);
		input.wheel = 0;
	}
};

gui.updateBrushStyle = function (value)
{
	var index = loader.shaderNames.indexOf(value);
	filter = new Filter(loader.shaderArray[index]);
	buffer.container.filters = [filter];
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

gui.updateShowCursor = function (value)
{
	gui.cursor.visible = value;
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
