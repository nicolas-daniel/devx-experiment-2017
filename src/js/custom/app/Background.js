// Events
import EventsManager from 'events/EventsManager';
import Events from 'events/Events';

const glslify = require('glslify');

/**
 * MONOGRID DEVX XP
 *
 * Background
 */

class Background extends THREE.Object3D {

    constructor() {
        super();
        
        // Bindings
        this.onPaletteChange = ::this.onPaletteChange;

        // Geometry
        this.geometry = new THREE.PlaneGeometry(600, 600);

        // Material
        // this.material = new THREE.MeshBasicMaterial({ color:0xff0000 });
        this.material = new THREE.ShaderMaterial({
            vertexShader: glslify('../shaders/basic.vert.glsl'),
            fragmentShader: glslify('../shaders/background.frag.glsl'),
            uniforms: {
                color: { type:'c', value:new THREE.Color(0xffffff) },
                progress: { type:'c', value:0 },
            },
            transparent: true
        });

        // Mesh
        this.mesh = new THREE.Mesh(this.geometry, this.material);

        // Add to scene
        this.add(this.mesh);

        EventsManager.on(Events.PALETTE_CHANGE, this.onPaletteChange);
    }

    onPaletteChange(palette) {
        // this.material.color.set(new THREE.Color(palette.background));
        this.material.uniforms.color.value = new THREE.Color(palette.background);
    }

}

export default Background;