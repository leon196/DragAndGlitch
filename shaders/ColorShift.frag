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

// Sam Hocevar
vec3 rgb2hsv(vec3 c)
{
  vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
  vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
  vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

  float d = q.x - min(q.w, q.y);
  float e = 1.0e-10;
  return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// Sam Hocevar
vec3 hsv2rgb(vec3 c)
{
  vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
  vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
  return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
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
	dist = mix(dist, dist * -1., brushOpposite);

	vec4 c = texture2D(uSampler, uv);
	angle += rgb2hsv(c.rgb).x * 3.1416 * 8.;
	vec2 offset = vec2(cos(angle), sin(angle)) * pixelUnit * brushStrength * dist * length(brushDrag);

	uv = mod(abs(uv - offset + 1.0), 1.0);
	vec4 color = texture2D(uSampler, uv, 1.0);

	color = mix(color, color * lightRatio, dist * clamp(brushStrength, 0.0, 1.0));

	gl_FragColor = color;
}