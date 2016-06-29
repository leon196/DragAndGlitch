
var Mouse = {}

Mouse.x = 0
Mouse.y = 0
Mouse.down = false
Mouse.clic = false

// Pan
Mouse.panX = 0
Mouse.panY = 0
Mouse.panStartX = 0
Mouse.panStartY = 0
Mouse.panLast = { x: 0, y: 0};
Mouse.panStarted = false

Mouse.onMove = function(event)
{
	Mouse.x = event.data.global.x
	Mouse.y = event.data.global.y
	if (Mouse.panStarted)
	{
		Mouse.panX = Mouse.x - Mouse.panLast.x
		Mouse.panY = Mouse.y - Mouse.panLast.y
	}
	Mouse.panLast.x = Mouse.x;
	Mouse.panLast.y = Mouse.y;
}

Mouse.onClic = function(event)
{
	Mouse.x = event.data.global.x
	Mouse.y = event.data.global.y
	Mouse.down = true
	Mouse.clic = true

	// Pan
	Mouse.panStartX = Mouse.x - Mouse.panX
	Mouse.panStartY = Mouse.y - Mouse.panY
	Mouse.panStarted = true
}

Mouse.onMouseUp = function(event)
{
	Mouse.down = false
	Mouse.clic = false
	Mouse.panStarted = false
}
