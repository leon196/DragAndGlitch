
function Filter (fragmentSource)
{
	PIXI.AbstractFilter.call(this, null, fragmentSource, { 
		time : { type: '1f', value: 0 },
		resolution : { type: '2f', value: [window.innerWidth, window.innerHeight] },
		brushStrength : { type: '1f', value: 1 },
		brushPosition : { type: '2f', value: [0, 0] },
		brushDrag : { type: '2f', value: [0, 0] },
		brushRadius : { type: '1f', value: 100 },
		noiseScale : { type: '1f', value: 8 },
		lightRatio : { type: '1f', value: 1 },
		brushStrengh : { type: '1f', value: 100 },
		brushSoftness : { type: '1f', value: 1 },
		brushInverse : { type: '1f', value: 0 },
		brushOpposite : { type: '1f', value: 0 }
	});

	this.update = function ()
	{
		this.uniforms.time.value = time.elapsed;
		this.uniforms.brushRadius.value = gui.brushRadius;
		this.uniforms.brushInverse.value = gui.brushInverse;
		this.uniforms.brushOpposite.value = gui.brushOpposite;
		this.uniforms.noiseScale.value = gui.noiseScale;
		this.uniforms.lightRatio.value = gui.lightRatio;
		this.uniforms.brushSoftness.value = gui.brushSoftness ? 1 : 0;
		this.uniforms.brushDrag.value[0] = 0;
		this.uniforms.brushDrag.value[1] = 0;
		this.uniforms.brushStrength.value = 0;
	}
}

Filter.prototype = Object.create(PIXI.AbstractFilter.prototype);
Filter.prototype.constructor = Filter;