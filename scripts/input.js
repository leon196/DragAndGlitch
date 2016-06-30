
var input = {};

input.x = 0;
input.y = 0;
input.down = false;
input.clic = false;

input.drag = new vec2();
input.dragOrigin = new vec2();
input.dragDelta = new vec2();

input.wheel = 0;
input.wheelDelta = 0;

input.start = 0;
input.delay = 0.5;

input.mouseMove = function(event)
{
	input.x = event.data.global.x;
	input.y = event.data.global.y;
	if (input.down) {
		input.drag.x = input.x - input.dragDelta.x;
		input.drag.y = input.y - input.dragDelta.y;
	}
	input.dragDelta.x = input.x;
	input.dragDelta.y = input.y;
};

input.mouseDown = function(event)
{
	input.x = event.data.global.x;
	input.y = event.data.global.y;
	input.dragOrigin.x = input.x - input.drag.x;
	input.dragOrigin.y = input.y - input.drag.y;
	input.down = true;
	input.clic = true;
};

input.mouseUp = function(event)
{
	input.down = false;
	input.clic = false;
};

input.mouseWheel = function(x, y)
{
	input.wheel += y;
	input.wheelDelta = y;
};

input.setup = function (container)
{
  container.interactive = true;
  container.on('mousedown', input.mouseDown).on('touchstart', input.mouseDown);
  container.on('mouseup', input.mouseUp).on('touchend', input.mouseUp);
  container.on('mouseout', input.mouseUp);
  container.on('mousemove', input.mouseMove).on('touchmove', input.mouseMove);
	
  addWheelListener(renderer.view, function (e) {
    input.mouseWheel(e.deltaX, e.deltaY);
  });
};