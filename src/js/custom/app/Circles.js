// Events
import EventsManager from '../events/EventsManager';
import Events from '../events/Events';

/**
 * MONOGRID DEVX XP
 *
 * Circles
 */

class Circles extends THREE.Object3D {

    constructor() {
        super();

        // Bindings
        this.onMouseDown = ::this.onMouseDown;

        this.material = new THREE.MeshBasicMaterial({ color:0xdddddd, transparent:true });
        this.meshes = [];
        
        for (let i=0; i<6; i++) {
            const geometry = new THREE.RingGeometry(223 + 50 * i, 225 + 50 * i, 64, 1);
            const mesh = new THREE.Mesh(geometry, this.material);
            mesh.position.z = - (6 - i) * 10 * 4;
            mesh.initialDepth = mesh.position.z;
            this.add(mesh);
            this.meshes[i] = mesh;
        }

        EventsManager.on(Events.MOUSE_DOWN, this.onMouseDown);
    }

    display() {
        const tl = new TimelineMax();
        for (let i=0; i<this.meshes.length; i++) {
            tl.fromTo(this.meshes[i].scale, 0.6, { x:0.88, y:0.88 }, { x:1, y:1, ease:Power2.easeOut, }, i * 0.06);
        }
    }

    hide() {
        // TweenMax.to(this.material, 0.3, { opacity:0, ease:Power2.easeOut });
    }

    onMouseDown() {
        const tl = new TimelineMax();
        for (let i=0; i<this.meshes.length; i++) {
            tl.to(this.meshes[i].scale, 0.6, { x:1.12, y:1.12, ease:Power2.easeOut, }, i * 0.06);
        }
    }

}

export default Circles;