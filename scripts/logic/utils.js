
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

function length (v) { return Math.sqrt(v.x * v.x + v.y * v.y); };
function normalize(v) { var dist = length(v); return new vec2(v.x / dist, v.y / dist ); }
function fract(x) { return x % 1; }