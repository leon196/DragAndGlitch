
function lerp (a, b, t)
{
	return a * (1.0 - t) + b * t;
}

function vec2 ()
{
	this.x = 0;
	this.y = 0;
}

function clamp (value, min, max)
{
	return Math.max(min, Math.min(max, value));
}