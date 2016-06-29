
function Filter (fragmentSource)
{
	PIXI.AbstractFilter.call(this, null, fragmentSource, { 
		uTime : { type: '1f', value: 0 },
		uStrength : { type: '1f', value: 0 },
		uStrength : { type: '1f', value: 0 },
		uResolution : { type: '2f', value: [window.innerWidth, window.innerHeight] },
		uTarget : { type: '2f', value: [0, 0] } ,
		uOffset : { type: '2f', value: [0, 0] } ,
		uImage : { type : 'sampler2D', value : 0},
		uBuffer : { type : 'sampler2D', value : 0}
	} );

	this.update = function ()
	{
		this.uniforms.uTime.value = time.elapsed;
	}

	this.updateDrag = function (shouldDrag)
	{
		if (shouldDrag) {
			this.uniforms.uTarget.value[0] = input.x;
			this.uniforms.uTarget.value[1] = input.y;
			this.uniforms.uOffset.value[0] = input.drag.x;
			this.uniforms.uOffset.value[1] = input.drag.y;
			this.uniforms.uStrength.value = 1;
		} else {
			this.uniforms.uStrength.value = 0;
		}
	}
}

Filter.prototype = Object.create(PIXI.AbstractFilter.prototype);
Filter.prototype.constructor = Filter;