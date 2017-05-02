const OrbitControls = require('three-orbit-controls')(THREE);

module.exports = createApp;

function createApp (opt = {}) {
	const debug = opt.debug || false;
	
	// renderer
	const renderer = new THREE.WebGLRenderer({ antialias:true });
	renderer.setClearColor(0xe9e9e9, 1);
	renderer.setSize(window.innerWidth, window.innerHeight);
	renderer.shadowMap.enabled = true;
	renderer.shadowMap.type = THREE.PCFSoftShadowMap;

	// canvas
	const canvas = renderer.domElement;
	document.body.appendChild(canvas);

	// camera
	const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);

	// scene
	const scene = new THREE.Scene();

	// css3D
	const css3DRenderer = new THREE.CSS3DRenderer();
    css3DRenderer.setSize(window.innerWidth, window.innerHeight);
    css3DRenderer.domElement.style.position = 'absolute';
    css3DRenderer.domElement.style.top = 0;
    document.body.appendChild(css3DRenderer.domElement);
	const css3DScene = new THREE.Scene();
	const css3DCamera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 2000);

	// controls
	// const controls = new OrbitControls(camera);

	// effect composer
	WAGNER.vertexShadersPath = 'js/vertex-shaders';
	WAGNER.fragmentShadersPath = 'js/fragment-shaders';
	const composer = new WAGNER.Composer(renderer, { useRGBA:true });
	composer.setSize(canvas.width, canvas.height);

	// app
	const app = { renderer, composer, canvas, camera, scene, css3DRenderer, css3DCamera, css3DScene, render, resize };
	return app;

	function render () {
		if (debug) {
			console.log(renderer.info.render);
		}
		renderer.render(scene, camera);
	}

	function resize(w, h) {
		camera.aspect = w / h;
		camera.updateProjectionMatrix();

		renderer.setSize(w, h);

		css3DCamera.aspect = w / h;
		css3DCamera.updateProjectionMatrix();

		css3DRenderer.setSize(w, h);
	}

}