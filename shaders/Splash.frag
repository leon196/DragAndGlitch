precision mediump float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform sampler2D uSampler;

uniform float time;
uniform vec2 resolution;

uniform vec2 brushPosition;
uniform vec2 brushDrag;
uniform float brushStrength;
uniform float brushRadius;
uniform float brushInverse;
uniform float brushSoftness;

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand (vec2 n)
{
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main (void)
{
	vec2 uv = vTextureCoord;

	vec2 pixelUnit = 1. / resolution;
	vec2 center = uv - brushPosition / resolution;
	center.x *= resolution.x / resolution.y;
	float angle = atan(center.y, center.x);
	float radius = brushRadius / resolution.y;
	float dist = smoothstep(0.0, radius, length(center));
	dist = mix(step(0.999, dist), dist, brushSoftness);
	dist = mix(1.0 - dist, dist, brushInverse);
	float lod = 8.0;
	float variation = rand(vec2(floor(angle * lod) / lod, brushDrag.x)) * rand(vec2(angle, brushDrag.y));
	variation *= variation;

	vec2 offset = vec2(cos(angle), sin(angle)) * pixelUnit * brushStrength * variation * dist * 10.0;

	// vec4 color = texture2D(uBuffer, uv);
	// float lum = (color.r + color.g + color.b) / 3.;
	// angle = lum * 3.1416 * 2.;
	// offset += vec2(cos(angle), sin(angle)) * pixelUnit * brushStrength * dist;

	// angle = rand(uv) * 3.1416 * 2.0;
	// offset += vec2(cos(angle), sin(angle)) * pixelUnit * brushStrength * dist;

	vec4 color = texture2D(uSampler, mod(abs(uv - offset), 1.0));

	gl_FragColor = color;
}