/**
 * SIMPLE 1D NOISE
 * 
 * http://www.michaelbromley.co.uk/blog/90/simple-1d-noise-in-javascript
 */

class Simple1DNoise {

    constructor ( max = 256, amplitude = 1, scale = 1 ) {

        // params
        this.MAX_VERTICES = max;
        this.MAX_VERTICES_MASK = this.MAX_VERTICES -1;
        this.amplitude = amplitude;
        this.scale = scale;

        this.xMin = 0;
        this.xMax = 0;

        // build
        this.r = [];

        for ( var i = 0; i < this.MAX_VERTICES; ++i ) {
            this.r[i] = Math.random();
        }

    }

    getVal ( value ) {
        
        // TODO
        // IMPROVE
        // IMPROVE
        // IMPROVE

        const scaledX =  value  * this.scale;
        const xFloor = Math.floor(scaledX);
        const t = scaledX - xFloor;
        const tRemapSmoothstep = t * t * ( 3 - 2 * t );

        // Modulo
        this.xMin = xFloor & this.MAX_VERTICES_MASK;
        this.xMax = ( this.xMin + 1 ) & this.MAX_VERTICES_MASK;

        return this.lerp( this.r[ this.xMin ], this.r[ this.xMax ], tRemapSmoothstep ) * this.amplitude;
    }

    lerp (a, b, t ) {
        return a * ( 1 - t ) + b * t;
    }

}

export default Simple1DNoise;