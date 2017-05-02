/**
 * Mouse Manager
 */

class MouseManager {

	static start( checkMouseSpeed = false ) {
		window.mouse = new THREE.Vector2();
		window.addEventListener('mousemove', MouseManager.move );
	}

	static move(e) {
		window.mouse.set(e.clientX, e.clientY);
	}

}

export default MouseManager;