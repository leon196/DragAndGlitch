
var time = {};

time.scale = 1000;
time.start = new Date() / time.scale;
time.elapsed = 0;

time.update = function ()
{
	time.elapsed = new Date() / time.scale - time.start;
}