const createApp = require('util/createApp');

import Utils from 'util/Utils';

// Events
import EventsManager from 'events/EventsManager';
import Events from 'events/Events';

// Managers
import RafManager from 'managers/RafManager';
import InteractionManager from 'managers/InteractionManager';
import SoundManager from 'managers/SoundManager';

// Controllers
import KeyboardController from 'controllers/KeyboardController';
import EffectController from 'controllers/EffectController';
import ShapeController from 'controllers/ShapeController';

// Objects3D
import Supershape from 'app/Supershape';
import Background from 'app/Background';
import Circles from 'app/Circles';

// UI
import Branding from 'app/Branding';

const glslify = require('glslify');

/**
 * MONOGRID DEVX XP
 *
 * Main
 */

class Main {

	constructor() {
		// Global
		window.vjPlaying = false;
		window.canStart = false;

		// Bindings
		this.render 		= ::this.render;
        this.onMouseDown 	= ::this.onMouseDown;
        this.onMouseUp 		= ::this.onMouseUp;
        this.onPlayEffect 	= ::this.onPlayEffect;
        this.onSplitEffect 	= ::this.onSplitEffect;
        this.onSoundEnded 	= ::this.onSoundEnded;
        this.onResumeVjing 	= ::this.onResumeVjing;
        this.onPauseVjing 	= ::this.onPauseVjing;

        // Props
        this.time = Date.now();
        this.smoothRotationX = 0;
        this.smoothRotationY = 0;

        // DOM elements
        this.$ui = document.querySelector('.ui');
        this.$helper = this.$ui.querySelector('.helper');
        this.$credits = this.$ui.querySelector('.credits');
        this.$brand = this.$ui.querySelector('.brand--ui');
        this.$logo = this.$ui.querySelector('.logo');
        this.$crosses = this.$ui.querySelectorAll('.cross');
        this.$restart = this.$ui.querySelector('.restart');
        this.$brandCorner = document.querySelector('.brand--corner');

		// Create App
		window.app = createApp({ debug:false });

		// Camera 
		window.app.camera.position.z = 1200;
		window.app.camera.lookAt(new THREE.Vector3(0,0,0));

		// CSS3D Camera 
		window.app.css3DCamera.position.z = 1200;
		window.app.css3DCamera.lookAt(new THREE.Vector3(0,0,0));

		window.app.render();

		// PostFX
		this.FXAAPass = new WAGNER.FXAAPass();
		this.postFXPass = new WAGNER.Pass();
		this.postFXPass.shader = WAGNER.processShader(WAGNER.basicVs, glslify('./shaders/postFX.frag.glsl'));
		this.postFXPass.shader.uniforms.divide.value = 1;
		this.postFXPass.shader.uniforms.mirrorX.value = 0;
		this.postFXPass.shader.uniforms.mirrorY.value = 0;
		this.postFXPass.shader.uniforms.morph.value = 0;

		// Managers
		RafManager.start();
		InteractionManager.start();
		SoundManager.start();
		
		// Controllers
		KeyboardController.start();
		EffectController.start();
		ShapeController.start();

		// Branding
		this.branding = new Branding(this.$ui);

		// UI
		this.ui = new THREE.CSS3DObject(this.$ui);
		this.ui.position.x = 18;
		this.ui.position.y = 18;
		this.ui.position.z = 100;
		window.app.css3DScene.add(this.ui);

		// Circles
		this.circles = new Circles();
		this.circles.position.x = 140;
		this.circles.position.y = 18;
		this.circles.position.z = -1;
		window.app.scene.add(this.circles);

		// Background
		this.background = new Background();
		this.background.position.x = 18;
		this.background.position.y = 18;
		this.background.position.z = 0;
		window.app.scene.add(this.background);

		// Supershape
		this.supershape = new Supershape(180);
		this.supershape.scale.x = this.supershape.scale.y = this.supershape.scale.z = 0.01;
		this.supershape.position.x = -18;
		this.supershape.position.y = -18;
		this.supershape.position.z = 300;
		window.app.scene.add(this.supershape);

		// Random palette
		const palette = Utils.getPalette();
		EventsManager.emit(Events.PALETTE_CHANGE, palette);

		// Start render
		RafManager.bind('main', this.render);

        // Listeners
        EventsManager.on(Events.MOUSE_DOWN, this.onMouseDown);
        EventsManager.on(Events.MOUSE_UP, this.onMouseUp);
        EventsManager.on(Events.PLAY_EFFECT, this.onPlayEffect);
        EventsManager.on(Events.SPLIT_EFFECT, this.onSplitEffect);
        EventsManager.on(Events.SOUND_ENDED, this.onSoundEnded);
        EventsManager.on(Events.RESUME_VJING, this.onResumeVjing);
        EventsManager.on(Events.PAUSE_VJING, this.onPauseVjing);
		window.addEventListener('resize', ::this.resize, true);

		TweenMax.delayedCall(0.5, () => {
			this.display();
		});
	}

	display() {
		this.displayTL = new TimelineMax({ onComplete:() => {
			window.canStart = true;
		}});
		this.displayTL.addCallback(() => {
			this.circles.display();
		}, 0);
		this.displayTL.to(this.background.material.uniforms.progress, 0.6, { value:1, ease:Power2.easeInOut }, 0);
		this.displayTL.to(this.$ui, 1.2, { opacity:1, ease:Power2.easeOut }, 0.4);
		this.displayTL.to(this.ui.position, 1.2, { z:0, ease:Power2.easeOut }, 0.4);
		this.displayTL.to(this.$helper, 0.6, { opacity:1, ease:Power2.easeOut }, 1.0);
	}

    onSoundEnded() {
    	window.vjPlaying = false;

		TweenMax.delayedCall(0.6, () => {
			this.pauseVjing(true);
		});
    }

	onMouseDown() {
		if (window.vjPlaying) return;

		// Display supershape
		this.supershape.display();

		// Move cameras
		TweenMax.to([window.app.camera.position, window.app.css3DCamera.position], 0.6, { z:1400, ease:Power2.easeOut });

		// Hide helper
		TweenMax.to([this.$helper, this.$logo, this.$restart, this.$credits], 0.3, { opacity:0, ease:Power2.easeOut });
	}

	onMouseUp() {
		if (window.vjPlaying) return;
		window.vjPlaying = true;

		// Set white mode UI 
        // this.$ui.classList.add('ui--white');
        // this.branding.setWhiteMode();

		this.playVjing(true, false);
	}

	onPlayEffect({ disallow }) {
		// Split
		this.postFXPass.shader.uniforms.divide.value = Utils.range([1,1,2,2,4]);

		// Mirror X
		this.postFXPass.shader.uniforms.mirrorX.value = Utils.lucky(2);
		
		// Mirror Y
		this.postFXPass.shader.uniforms.mirrorY.value = Utils.lucky(2);
		
		// Morph
		if (this.postFXPass.shader.uniforms.divide.value < 4) {
			this.postFXPass.shader.uniforms.morph.value = Utils.lucky(2);
		} else {
			this.postFXPass.shader.uniforms.morph.value = 0;
		}

		// Palette
		if (!disallow) {
			const palette = Utils.getPalette();
			EventsManager.emit(Events.PALETTE_CHANGE, palette);
		}

		// Scale background
		this.background.scale.x = this.background.scale.y = Utils.range([1,6]);

		// Logo
		if (!disallow) {
			this.$logo.style.opacity = ~~(Math.random() * 2);
		}

		// Camera
		if (this.background.scale.x > 1) {
			TweenMax.to(window.app.camera.position, 0.15, { z:Math.random() * 500 + 600, ease:Power2.easeOut });
		} else {
			TweenMax.to(window.app.camera.position, 0.15, { z:Math.random() * 500 + 800, ease:Power2.easeOut });
		}
	}

	onSplitEffect(splitCount) {
		this.postFXPass.shader.uniforms.divide.value = splitCount;
		this.postFXPass.shader.uniforms.morph.value = 1;
	}

	onResumeVjing() {
		this.playVjing(false);
	}

	onPauseVjing() {
		this.pauseVjing();
	}

	playVjing(playSound = true, crossfade = true) {
		// Kill old timelines
		if (this.playTL) this.playTL.kill();
		if (this.pauseTL) this.pauseTL.kill();

		// Timeline
		this.playTL = new TimelineMax({ onComplete:() => {
			if (playSound) SoundManager.play(crossfade);
		}});
		this.playTL.to(this.background.scale, 0.3, { x:window.innerWidth/400, y:window.innerHeight/400, ease:Power2.easeIn }, 0);
		// this.playTL.to(this.supershape.scale, 0.2, { x:1.4, y:1.4, z:1.4, ease:Power2.easeIn }, 0.01);
		this.playTL.to([window.app.camera.position, window.app.css3DCamera.position], 0.6, { z:1200, ease:Power2.easeOut }, 0);
		this.playTL.to([this.$credits, this.$brand, this.$crosses], 0.3, { opacity:0, ease:Power2.easeOut }, 0);
		this.playTL.to(this.$brandCorner, 0.4, { opacity:1, ease:Power2.easeOut }, 0.3);
	}

	pauseVjing(restart = false) {
		// Reset postFX
    	this.postFXPass.shader.uniforms.divide.value = 1;
		this.postFXPass.shader.uniforms.mirrorX.value = 0;
		this.postFXPass.shader.uniforms.mirrorY.value = 0;
		this.postFXPass.shader.uniforms.morph.value = 0;

		// Set background scale fullsize
		this.background.scale.x = window.innerWidth / 400;
		this.background.scale.y = window.innerHeight / 400;

		// Display logo
		this.$logo.style.opacity = 1;
		
		// Kill old timelines
		if (this.playTL) this.playTL.kill();
		if (this.pauseTL) this.pauseTL.kill();

		// Timeline
		this.pauseTL = new TimelineMax();
		this.pauseTL.to(window.app.camera.position, 0.7, { z:1200, ease:Power2.easeOut }, 0);
		this.pauseTL.to(this.background.scale, 0.7, { x:1, y:1, ease:Power2.easeOut }, 0);
		this.pauseTL.to(this.supershape.scale, 0.7, { x:0.7, y:0.7, z:0.7, ease:Power2.easeOut }, 0);
		this.pauseTL.to(this.$brandCorner, 0.3, { opacity:0, ease:Power2.easeOut }, 0);
		this.pauseTL.to([this.$ui, this.$crosses, this.$brand, this.$credits, this.$logo], 1.2, { opacity:1, ease:Power2.easeOut }, 0.7);
		if (restart) this.pauseTL.to(this.$restart, 1.2, { opacity:1, ease:Power2.easeOut }, 0.7);
		this.pauseTL.addCallback(() => {
			// Display circles
			this.circles.bounce();
		}, 0.3);
	}

	render() {
		// Update
		this.update();
		
		// Render
		window.app.css3DRenderer.render( window.app.css3DScene, window.app.css3DCamera );
		window.app.renderer.autoClearColor = true;
		window.app.composer.reset();
		window.app.composer.render( window.app.scene, window.app.camera );
		window.app.composer.pass( this.postFXPass );
		// window.app.composer.pass( this.ASCIIPass );
		window.app.composer.pass( this.FXAAPass );
		window.app.composer.toScreen();
	}

	update() {
		// Update supershape
		this.supershape.update(this.time);

		const rotationX = Utils.map(window.mouse.y, 0, window.innerHeight, -0.1, 0.1);
		const rotationY = Utils.map(window.mouse.x, 0, window.innerWidth, -0.1, 0.1);

		this.smoothRotationX += (rotationX - this.smoothRotationX) * 0.1;
		this.smoothRotationY += (rotationY - this.smoothRotationY) * 0.1;
		
		window.app.scene.rotation.x = this.smoothRotationX * 2;
		window.app.scene.rotation.y = this.smoothRotationY * 2;
		window.app.scene.position.x = this.smoothRotationX * 100;
		window.app.scene.position.y = this.smoothRotationY * 100;

		window.app.css3DScene.rotation.x = this.smoothRotationX;
		window.app.css3DScene.rotation.y = this.smoothRotationY;
		window.app.css3DScene.position.x = this.smoothRotationX * 75;
		window.app.css3DScene.position.y = this.smoothRotationY * 75;
	}

	resize() {
		window.app.resize(window.innerWidth, window.innerHeight);
	}
}

new Main();