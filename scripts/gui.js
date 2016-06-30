
var gui = {};

gui.brushStyle = 'Drag';
gui.brushShape = 'Circle';
gui.brushRadius = 100;

gui.cursor;
gui.showCursor = true;
gui.currentImage = 0;

gui.init = function (container)
{
	var datGUI = new dat.GUI();
	datGUI.remember(gui);
	datGUI.add(gui, 'brushStyle', [ 'Drag' ])
		.name('Brush Style')
		.onFinishChange(function (value) {});
	// datGUI.add(gui, 'brushShape', [ 'Circle' ])
	// 	.name('Brush Shape');
	datGUI.add(gui, 'brushRadius', 1, 1000)
		.name('Brush Radius')
		.listen()
		.onChange(function (value) { gui.updateBrushRadius(value); });

	// datGUI.add(gui, 'showCursor').name('Show Cursor');
	datGUI.add(gui, 'reset').name('Reset');

	// var f2 = gui.addFolder('Letters');
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
		gui.cursor.circle(0, 0, gui.brushRadius);
		input.wheel = 0;
	}
};

gui.updateBrushRadius = function (value)
{
	gui.cursor.circle(0, 0, value);
};
