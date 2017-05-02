import RafManager from '../managers/RafManager';

import EventsManager from '../events/EventsManager';
import Events from '../events/Events';

import Simple1DNoise from '../util/Simple1DNoise';
const noise = new Simple1DNoise();

import Utils from '../util/Utils';

class ShapeController {

	constructor() {
		// Props
		this.m1 = 0;
		this.n11 = 0;
		this.n21 = 0;
		this.n31 = 0;
		this.m2 = 0;
		this.n12 = 0;
		this.n22 = 0;
		this.n32 = 0;
		this.smoothM1 = 0;
        this.smoothN11 = 0;
        this.smoothN21 = 0;
        this.smoothN31 = 0;
        this.smoothM2 = 0;
        this.smoothN12 = 0;
        this.smoothN22 = 0;
        this.smoothN32 = 0;
		this.movingTime = 0;
		this.playing = false;
		this.prevMouse = new THREE.Vector2();

		// Bindings
		this.update = ::this.update;
		this.onHideShape = ::this.onHideShape;

		// RAF
		RafManager.bind('mouseController', this.update);
	}

	static start() {
		if (!ShapeController.instance) ShapeController.instance = new ShapeController();
	}

	onHideShape() {
		this.playing = false;
	}

	update() {
		if (window.mousedown) {
			if (window.mouse.x !== this.prevMouse.x || window.mouse.y !== this.prevMouse.y) {
				this.movingTime += 1;
			}

			this.m1 = Utils.map(noise.getVal(this.movingTime * 0.02), 0, 1, 0.1, 15);
			this.n11 = Utils.map(noise.getVal((this.movingTime + 10) * 0.02), 0, 1, 0.1, 100);
			this.n21 = Utils.map(noise.getVal((this.movingTime + 20) * 0.02), 0, 1, 0.1, 100);
			this.n31 = Utils.map(noise.getVal((this.movingTime + 30) * 0.02), 0, 1, 0.1, 100);
			this.m2 = Utils.map(noise.getVal((this.movingTime + 40) * 0.02), 0, 1, 0.1, 15);
			this.n12 = Utils.map(noise.getVal((this.movingTime + 50) * 0.02), 0, 1, 0.1, 100);
			this.n22 = Utils.map(noise.getVal((this.movingTime + 60) * 0.02), 0, 1, 0.1, 100);
			this.n32 = Utils.map(noise.getVal((this.movingTime + 70) * 0.02), 0, 1, 0.1, 100);
		}

		// Smooth values
		this.smoothM1 += (this.m1 - this.smoothM1) * 0.8;
        this.smoothN11 += (this.n11 - this.smoothN11) * 0.8;
        this.smoothN21 += (this.n21 - this.smoothN21) * 0.8;
        this.smoothN31 += (this.n31 - this.smoothN31) * 0.8;
        this.smoothM2 += (this.m2 - this.smoothM2) * 0.8;
        this.smoothN12 += (this.n12 - this.smoothN12) * 0.8;
        this.smoothN22 += (this.n22 - this.smoothN22) * 0.8;
        this.smoothN32 += (this.n32 - this.smoothN32) * 0.8;

		this.prevMouse.set(window.mouse.x, window.mouse.y);
	}

	static get() {
		const data = {
			m1 : ShapeController.instance.smoothM1.toFixed(2),
			n11 : ShapeController.instance.smoothN11.toFixed(2),
			n21 : ShapeController.instance.smoothN21.toFixed(2),
			n31 : ShapeController.instance.smoothN31.toFixed(2),
			m2 : ShapeController.instance.smoothM2.toFixed(2),
			n12 : ShapeController.instance.smoothN12.toFixed(2),
			n22 : ShapeController.instance.smoothN22.toFixed(2),
			n32 : ShapeController.instance.smoothN32.toFixed(2)
		};
		
		return data;
	}

}

export default ShapeController;