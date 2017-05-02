import EventsManager from '../events/EventsManager';
import Events from '../events/Events';

import Utils from '../util/Utils';

import colorsPalette from '../colors/colorsPalette';

class EffectController {

	constructor() {
		// Bindings
		this.onKeypress = ::this.onKeypress;

		// Properties
		this.paletteIndex = 0;

		// Events
		EventsManager.on(Events.KEYPRESS, this.onKeypress);
	}

	static start() {
		if (!EffectController.instance) EffectController.instance = new EffectController();
	}

	onKeypress(key) {
		switch (key) {
			case 'q':
				EventsManager.emit(Events.SPLIT_EFFECT, 1);
				break;
			
			case 'w':
				EventsManager.emit(Events.SPLIT_EFFECT, 2);
				break;
				
			case 'e':
				EventsManager.emit(Events.SPLIT_EFFECT, 4);
				break;

			case 'r':
				const palette = Utils.getPalette();
				EventsManager.emit(Events.PALETTE_CHANGE, palette);
				break;
			
			case 't':
				break;
			
			case 'y':
				break;
		}
	}

}

export default EffectController;