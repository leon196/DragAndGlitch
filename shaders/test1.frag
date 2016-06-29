precision mediump float;
varying vec2 vTextureCoord;
varying vec4 vColor;
uniform sampler2D uSampler;
uniform sampler2D uImage;
uniform sampler2D uBuffer;
uniform float uTime;
uniform float uStrength;
uniform vec2 uResolution;
uniform vec2 uTarget;

// https://gist.github.com/patriciogonzalezvivo/670c22f3966e662d2f83
float rand (vec2 n)
{
  return fract(sin(dot(n, vec2(12.9898, 4.1414))) * 43758.5453);
}

void main (void)
{
	vec2 uv = vTextureCoord;

	float lod1 = 256.0;
	// vec2 res = uResolution;// / lod1;
	// uv = floor(uv * lod1) / lod1;

	vec2 pixelUnit = 1. / uResolution;// + (sin(uTime * 0.1) * 0.5 + 0.5) * 0.01;
	vec4 color = texture2D(uBuffer, uv);
	vec2 center = uv - uTarget / uResolution;
	float angle = atan(center.y, center.x);
	float dist = 1.0 - clamp(length(center) * 2.0, 0.0, 1.0);
	float lod = 32.0;
	float variation = rand(vec2(floor(angle * lod) / lod, 0)) * rand(vec2(angle, 0));
	variation *= variation;

	vec2 offset = vec2(cos(angle), sin(angle)) * pixelUnit * uStrength * variation * 100.0 * dist;

	// float lum = (color.r + color.g + color.b) / 3.;
	// angle = lum * 3.1416 * 2.;
	// offset += vec2(cos(angle), sin(angle)) * pixelUnit * uStrength * dist;

	// angle = rand(uv) * 3.1416 * 2.0;
	// offset += vec2(cos(angle), sin(angle)) * pixelUnit * uStrength * dist;




	color = texture2D(uBuffer, mod(abs(uv - offset), 1.0));
	vec4 image = texture2D(uImage, uv);

	// color = mix(color, image, 0.25);
	// color = max(color, image);
	// color.rgb *= 0.99;

	// color = mix(color, image, smoothstep(0.5, 1.0, distance(color, image)));	
	// color = mix(color, image, step(0.5, distance(color, image)));	
	// color = mix(color, image, step(uStrength, distance(color, image)));	

	gl_FragColor = color;
}