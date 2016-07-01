
var gui = {};

gui.brushStyle = '';
gui.brushShape = 'Circle';
gui.brushRadius = 300;
gui.brushInverse = false;
gui.brushOpposite = false;
gui.brushStrength = 5;
gui.lightRatio = 1;
gui.brushSoftness = true;
gui.dragStyle = 'Relative';
gui.dragAnchor = 'Origin';
gui.noiseScale = 8;
gui.cursor;
gui.showCursor = true;
gui.confirmReset = false;
gui.currentImage = '';

gui.filterMode = 'Nearest';
gui.lastFilterMode = gui.filterMode;

gui.init = function (container)
{
	gui.brushStyle = loader.shaderNames[0];
	gui.currentImage = loader.currentImageName;

	var datGUI = new dat.GUI({ load: loader.presets });
	datGUI.remember(gui);

	var brushFolder = datGUI.addFolder('Brush');
	brushFolder.add(gui, 'brushStyle', loader.shaderNames).name('Style').onChange(gui.updateBrushStyle);
	// brushFolder.add(gui, 'brushShape', ['Circle', 'Box']).name('Shape').onChange(gui.updateBrushShape);
	brushFolder.add(gui, 'brushStrength', 1, 20).name('Strength');
	brushFolder.add(gui, 'brushRadius', 1, 1000).name('Radius').listen().onChange(gui.updateBrushRadius);
	brushFolder.add(gui, 'lightRatio', 0.95, 1.05).name('Light Ratio').step(0.01);
	brushFolder.add(gui, 'brushInverse').name('Inverse');
	brushFolder.add(gui, 'brushOpposite').name('Opposite');
	brushFolder.close();

	var noiseFolder = datGUI.addFolder('Noise');
	noiseFolder.add(gui, 'noiseScale', 1, 32).name('Scale');
	noiseFolder.close();
	
	var cursorFolder = datGUI.addFolder('Cursor');
	cursorFolder.add(gui, 'showCursor').name('Show').onChange(gui.updateShowCursor);
	cursorFolder.add(gui, 'dragStyle', ['Relative', 'Absolute']).name('Offset');
	cursorFolder.add(gui, 'dragAnchor', ['Origin', 'Follow']).name('Anchor');
	cursorFolder.add(gui, 'brushSoftness').name('Soft').onChange(gui.updateBrushSoftness);
	cursorFolder.close();

	var backgroundFolder = datGUI.addFolder('Background');
	backgroundFolder.add(gui, 'currentImage', loader.imageNames).name('Image').onChange(gui.updateBackground);
	backgroundFolder.close();

	datGUI.add(gui, 'reset').name('Reset');
	// datGUI.add(gui, 'confirmReset').name('Confirm Reset');

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
	if (gui.confirmReset) {
		var shouldReset = confirm("Reset pixels ?");
		if (shouldReset) {
			buffer.printBackground();
		}
	} else {
		buffer.printBackground();
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

gui.updateBrushShape = function (value)
{
	if (value == 'Circle') {
		gui.cursor.circle(gui.brushRadius);
		filter.uniforms.brushRadius.value = gui.brushRadius;
	} else if (value == 'Box') {
		gui.cursor.box(gui.brushRadius);
		filter.uniforms.brushRadius.value = gui.brushRadius;
	}
};

gui.updateShowCursor = function (value)
{
	gui.cursor.visible = value;
};

gui.updateBackground = function (value)
{
	var index = loader.imageNames.indexOf(value);
	if (loader.currentImageName != loader.imageNames[index]) {
		loader.currentImageName = loader.imageNames[index];
		buffer.printBackground();
	}
};

gui.updateFilterMode = function (value)
{
	if (value != gui.lastFilterMode) {
		gui.lastFilterMode = value;
		if (value == 'Nearest') {
			PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.NEAREST;
		} else if (value == 'Linear') {	
			PIXI.SCALE_MODES.DEFAULT = PIXI.SCALE_MODES.LINEAR;
		}
		buffer.reset();
		gui.reset();
	}
};
