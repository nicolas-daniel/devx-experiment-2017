import EventsManager from 'events/EventsManager';
import Events from 'events/Events';

import ShapeController from 'controllers/ShapeController';

const glslify = require('glslify');

/**
 * MONOGRID DEVX XP
 *
 * Supershape
 */

class Supershape extends THREE.Object3D {
    
    constructor(radius) {
        super();

        // Props
        this.radius = radius;

        // Bindings
        this.onPaletteChange = ::this.onPaletteChange;

        // Geometry
        this.geometry = new THREE.Geometry();

        const step = 0.05;
        const l1 = parseInt(2 * Math.PI / step + 1.3462);
        const l2 = parseInt(Math.PI / step + 1.5);

        // Calculate vertices
        for (let i=0; i<l1; i++) {
            const theta = -Math.PI + i * step;
            const r1 = this.supershape(theta, 0, 0, 0, 0, 1, 1);
            
            for (let j=0; j<l2; j++) {
                const phi = -Math.PI / 2 + j * step;
                const r2 = this.supershape(phi, 0, 0, 0, 0, 1, 1);
                
                const x = r1 * Math.cos(theta) * r2 * Math.cos(phi) * 30;
                const y = r1 * Math.sin(theta) * r2 * Math.cos(phi) * 30;
                const z = r2 * Math.sin(phi) * 30;

                this.geometry.vertices.push(new THREE.Vector3(x, y, z));
            }
        }
        
        // Calculate indices
        for (let i=0; i<(l1 - 1); i++) {
            for (let j=0; j<(l2 - 1); j++) {
                const a = (i + 1) * l2 + j;
                const b = (i + 1) * l2 + j + 1;
                const c = i * l2 + j + 1;
                const d = i * l2 + j;

                this.geometry.faces.push(new THREE.Face3(a, b, d));
                this.geometry.faces.push(new THREE.Face3(b, c, d));
            }
        }
        
        // Compute normals
        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();

        // Material
        this.material = new THREE.ShaderMaterial({
            vertexShader : glslify('../shaders/cel.vert.glsl'),
            fragmentShader : glslify('../shaders/cel.frag.glsl'),
            uniforms : {
                u_diffuse :     { type:'c', value:new THREE.Color(0x00d173) },
                u_light :       { type:'v3', value:new THREE.Vector3(0.25, 0.25, 1) },
                u_ambient :     { type:'v3', value:new THREE.Vector3(0.1, 0.1, 0.1) },
                u_specular :    { type:'v3', value:new THREE.Vector3(0.50, 0.50, 0.50) },
                u_shine :       { type:'f', value:1000.0 },
                u_celShading :  { type:'f', value:10.0 },
                color1 :        { type:'c', value:new THREE.Color(0x85107a) },
                color2 :        { type:'c', value:new THREE.Color(0x161616) },
                color3 :        { type:'c', value:new THREE.Color(0xffff44) },
                color4 :        { type:'c', value:new THREE.Color(0xffad32) }
            }
        });

        // Big outline
        this.outlineMaterial = new THREE.ShaderMaterial({
            vertexShader : glslify('../shaders/outline.vert.glsl'),
            fragmentShader : glslify('../shaders/outline.frag.glsl'),
            uniforms : {
                u_offset :     { type:'f', value:4.2 },
                u_color :       { type:'c', value:new THREE.Color(0x000000) },
            }
        });
        this.outlineMaterial.side = THREE.BackSide;

        // Thin outline
        this.thinOutlineMaterial = new THREE.ShaderMaterial({
            vertexShader : glslify('../shaders/outline.vert.glsl'),
            fragmentShader : glslify('../shaders/outline.frag.glsl'),
            uniforms : {
                u_offset :     { type:'f', value:1 },
                u_color :       { type:'c', value:new THREE.Color(0x00ff00) },
            }
        });
        this.thinOutlineMaterial.side = THREE.BackSide;

        // Meshes
        this.shape = new THREE.Mesh(this.geometry, this.material);
        this.outline = new THREE.Mesh(this.geometry, this.outlineMaterial);
        this.thinOutline = new THREE.Mesh(this.geometry, this.thinOutlineMaterial);
        
        // Add to scene
        this.add(this.shape);
        this.add(this.outline);
        this.add(this.thinOutline);

        // Listeners
        EventsManager.on(Events.PALETTE_CHANGE, this.onPaletteChange);
    }

    display() {
        TweenMax.to(this.scale, 0.6, { x:1, y:1, z:1, ease:Power2.easeOut });
    }

    hide() {

    }

    draw() {
        const { m1, n11, n21, n31, m2, n12, n22, n32 } = ShapeController.get();
        const step = 0.05;
        const l1 = parseInt(2 * Math.PI / step + 1.3462);
        const l2 = parseInt(Math.PI / step + 1.5);
        let vIndex = 0;

        // Calculate vertices
        for (let i=0; i<l1; i++) {
            const theta = -Math.PI + i * step;
            const r1 = this.supershape(theta, m1, n11, n21, n31, 1, 1);
            
            for (let j=0; j<l2; j++) {
                const phi = -Math.PI / 2 + j * step;
                const r2 = this.supershape(phi, m2, n12, n22, n32, 1, 1);
                
                const x = r1 * Math.cos(theta) * r2 * Math.cos(phi) * this.radius;
                const y = r1 * Math.sin(theta) * r2 * Math.cos(phi) * this.radius;
                const z = r2 * Math.sin(phi) * this.radius;

                this.geometry.vertices[vIndex].set(x, y, z);
                vIndex++;
            }
        }

        this.geometry.computeFaceNormals();
        this.geometry.computeVertexNormals();
        this.geometry.verticesNeedUpdate = true;
    }

    onPaletteChange(palette) {
        this.material.uniforms.color1.value = new THREE.Color(palette.shape[1]);
        this.material.uniforms.color2.value = new THREE.Color(palette.shape[2]);
        this.material.uniforms.color3.value = new THREE.Color(palette.shape[3]);
        this.material.uniforms.color4.value = new THREE.Color(palette.shape[4]);
        this.outlineMaterial.uniforms.u_color.value = new THREE.Color(palette.outline);
        this.thinOutlineMaterial.uniforms.u_color.value = new THREE.Color(palette.thinOutline);
    }

    /**
     * Super shape function \o/
     *
     * @return radius
     */
    supershape(theta, m, n1, n2, n3, a, b) {
        let t1 = Math.abs((1.0 / a) * Math.cos(m * theta / 4.0));
        t1 = Math.pow(t1, n2);
        
        let t2 = Math.abs((1.0 / b) * Math.sin(m * theta / 4.0));
        t2 = Math.pow(t2, n3);
        
        let t3 = t1 + t2;
        
        let r = Math.pow(t3, - 1.0 / n1);

        return r;
    }

    update() {
        // Rotate shape
        // this.rotation.x += 0.001;
        // this.rotation.y += 0.005;
        // this.rotation.z += 0.008;

        this.rotation.y += 0.01;
        this.rotation.x = 10;
        // this.rotation.z += 0.008;

        // Redraw shape with new values
        if (!window.vjPlaying) {
            this.draw();
        }
    }

}

export default Supershape;