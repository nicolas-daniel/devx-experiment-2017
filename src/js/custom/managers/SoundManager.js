import EventsManager from '../events/EventsManager';
import Events from '../events/Events';

import RafManager from '../managers/RafManager';

const createPlayer = require('web-audio-player');
const createAnalyser = require('web-audio-analyser');
const average = require('analyser-frequency-average');
const detectAutoplay = require('detect-audio-autoplay');
const createAudioContext = require('ios-safe-audio-context');

const audioContext = createAudioContext();

class SoundManager {

    constructor () {
        // Properties
        this.ready = false;
        this.tumtumTime = 0;
        this.bumbumTime = 0;

        // Bindings
        this.onLoad     = ::this.onLoad;
        this.onEnded    = ::this.onEnded;
        this.onClick    = ::this.onClick;
        this.update     = ::this.update;
        this.onKeyPress = ::this.onKeyPress;


        // Player
        // this.player = createPlayer('../assets/sound/music.mp3', {
        //     context: audioContext,
        //     buffer: true
        // });
        // this.player.crossOrigin = 'Anonymous';
        
        // this.audioUtil = createAnalyser(this.player.node, this.player.context, {
        //     stereo: false
        // });
        
        // this.analyser = this.audioUtil.analyser;
        
        // this.player.on('load', this.onLoad);
        // this.player.on('end', this.onEnded);

        this.player = new Audio();
        this.player.crossOrigin = 'Anonymous';
        this.player.setAttribute('webkit-playsinline', '');
        this.player.addEventListener('canplay', this.onLoad);
        this.player.addEventListener('ended', this.onEnded);
        this.player.src = window.dev ? 'assets/sound/music.mp3' : 'public/assets/sound/music.mp3';
        // this.player.src = window.dev ? 'assets/sound/debug.mp3' : 'public/assets/sound/debug.mp3';

        // Listeners
        EventsManager.on(Events.KEYPRESS, this.onKeyPress);

        window.addEventListener('click', this.onClick);
    }

    /* Start */
    static start() {
        if (!SoundManager.instance) SoundManager.instance = new SoundManager();
    }

    static play(crossfade = true) {
        if (crossfade) {
            SoundManager.instance.player.play();
            TweenMax.to(SoundManager.instance.player, 0.3, { volume:1, ease:Power2.easeOut, onComplete:() => {
                RafManager.bind('soundmanager', SoundManager.instance.update);
            } });
        } else {
            SoundManager.instance.player.volume = 1;
            SoundManager.instance.player.play();
            TweenMax.delayedCall(0.3, () => {
                RafManager.bind('soundmanager', SoundManager.instance.update);
            });
        }
    }

    static pause() {
        RafManager.unbind('soundmanager');
        TweenMax.to(SoundManager.instance.player, 0.3, { volume:0, ease:Power2.easeOut, onComplete:() => {
            SoundManager.instance.player.pause();
        } });
    }

    onLoad() {
        if (this.ready) return;
        this.ready = true;

        // this.player.node.connect(this.player.context.destination);
        this.audioUtil = createAnalyser(this.player, audioContext, { audible: true, stereo: false });
        this.analyser = this.audioUtil.analyser;
        
        // this.player.playbackRate = 2.0;
        this.player.volume = 0;
        SoundManager.pause();
    }

    onEnded() {
        SoundManager.pause();
        this.player.currentTime = 0;

        EventsManager.emit(Events.SOUND_ENDED);
    }

    onClick() {
        // if (this.player.playing) this.player.pause()
        // else this.player.play()
        // if (this.player.playing) {
        // clickToPlay.style.display = 'none'
        // } else {
        // clickToPlay.textContent = 'Paused'
        // clickToPlay.style.display = 'block'
        // }
    }

    onKeyPress(key) {
        if (key === 'spacebar' && window.vjPlaying) {
            if (this.player.paused) {
                // Resume
                SoundManager.play();
                EventsManager.emit(Events.RESUME_VJING);
            } else {
                // Pause
                SoundManager.pause();
                EventsManager.emit(Events.PAUSE_VJING);
            }
        }
    }

    update () {
        if (this.player.paused) return;

        const freqs = this.audioUtil.frequencies();
        const tumtum = average(this.analyser, freqs, 246, 700);
        const bumbum = average(this.analyser, freqs, 20, 70);
        const canPlayTumtum = Date.now() - this.tumtumTime > 600;
        const canPlayBumbum = Date.now() - this.bumbumTime > 600;
        const diffTime = Math.abs(this.tumtumTime - this.bumbumTime);

        if (canPlayTumtum && tumtum > 0.5) {
            this.tumtumTime = Date.now();
            EventsManager.emit(Events.PLAY_EFFECT, { disallow:false });
        } else {
            if (canPlayBumbum && bumbum > 0.95 && diffTime > 300) {
                this.bumbumTime = Date.now();
                EventsManager.emit(Events.PLAY_EFFECT, { disallow:true });
            }
        }
    }

}

export default SoundManager;