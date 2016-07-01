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
uniform float brushOpposite;
uniform float brushSoftness;

uniform float lightRatio;

void main (void)
{
	vec2 uv = vTextureCoord;
	vec2 pixelUnit = 1. / resolution;
	vec2 center = uv - brushPosition / resolution;
	center.x *= resolution.x / resolution.y;
	float radius = brushRadius / resolution.y;
	float dist = smoothstep(0.0, radius, length(center));
	dist = mix(step(0.999, dist), dist, brushSoftness);
	dist = mix(1.0 - dist, dist, brushInverse);
	dist = mix(dist, dist * -1., brushOpposite);

	uv = uv - brushDrag * dist * pixelUnit * brushStrength;
	uv = mod(abs(uv + 1.0), 1.0);

	vec4 color = texture2D(uSampler, uv);

	color = mix(color, color * lightRatio, dist * clamp(brushStrength, 0.0, 1.0));

	gl_FragColor = color;
}