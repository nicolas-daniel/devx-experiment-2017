import EventsManager from 'events/EventsManager';
import Events from 'events/Events';

/**
 * Keyboard Controller
 */

class KeyboardController {

    constructor() {
        // Bindings
        this.onKeypress = ::this.onKeypress;

        // Characters
        this.keys = {
            113 : 'q',
            119 : 'w',
            101 : 'e',
            114 : 'r',
            116 : 't',
            121 : 'y',
            32  : 'spacebar',
            99  : 'c',
        };

        // Events
        window.addEventListener('keypress', this.onKeypress);
    }

    static start() {
        if (!KeyboardController.instance) KeyboardController.instance = new KeyboardController();
    }

    onKeypress(e) {
        EventsManager.emit(Events.KEYPRESS, this.keys[e.keyCode]);
    }

}

export default KeyboardController;