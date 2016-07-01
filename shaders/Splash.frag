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
uniform float brushOpposite;
uniform float noiseScale;

uniform float lightRatio;

// hash based 3d value noise
// function taken from https://www.shadertoy.com/view/XslGRr
// Created by inigo quilez - iq/2013
// License Creative Commons Attribution-NonCommercial-ShareAlike 3.0 Unported License.

// ported from GLSL to HLSL
float hash( float n )
{
  return fract(sin(n)*43758.5453);
}

float noiseIQ( vec3 x )
{
  // The noise function returns a value in the range -1.0f -> 1.0f
  vec3 p = floor(x);
  vec3 f = fract(x);
  f       = f*f*(3.0-2.0*f);
  float n = p.x + p.y*57.0 + 113.0*p.z;
  return mix(mix(mix( hash(n+0.0), hash(n+1.0),f.x),
   mix( hash(n+57.0), hash(n+58.0),f.x),f.y),
  mix(mix( hash(n+113.0), hash(n+114.0),f.x),
   mix( hash(n+170.0), hash(n+171.0),f.x),f.y),f.z);
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
	
	float variation = noiseIQ(vec3(abs(angle), brushDrag.x, brushDrag.y) * noiseScale);

	vec2 offset = vec2(cos(angle), sin(angle)) * pixelUnit * brushStrength * variation * dist;

	vec4 color = texture2D(uSampler, mod(abs(uv - offset + 1.0), 1.0));

	color = mix(color, color * lightRatio, dist * clamp(brushStrength, 0.0, 1.0));

	gl_FragColor = color;
}