
function lerp (a, b, t)
{
	return a * (1.0 - t) + b * t;
}

function vec2 ()
{
	this.x = 0;
	this.y = 0;
}