/**
 * WHEEL
 * MANAGER
 *
 * /!\ Install Virtual Scroll
 * https://github.com/ayamflow/virtual-scroll
 * 
 * npm i virtual-scroll -S
 * 
 */

class WheelManager {


	static start ( debounced = true, debounceTime = 300 ) {

		// params
		WheelManager.views = [];
		WheelManager.debouncer = -1;
		WheelManager.locked = false;
		WheelManager.time = debounceTime;

		const VirtualScroll = require('virtual-scroll');
		const listener = new VirtualScroll( { limitInertia:debounced } );

		listener.on( debounced ? WheelManager.wheel : WheelManager.freeWheel );

	}

	static wheel( event ) {

		if(WheelManager.locked) return;

		WheelManager.locked = true;

		WheelManager.freeWheel(event);

		WheelManager.debouncer = window.setTimeout( ()=>{ WheelManager.locked = false; }, WheelManager.time);

	}

	static freeWheel( event ) {

		for( let i = 0; i < WheelManager.views.length; i ++ ) {
			WheelManager.views[i].fn(event);
		}
	}


	static bind( id, fn) {

		WheelManager.views.push({id:id,fn:fn});
	}

	static unbind(id) {

		let tgtID = -1;

		for(let i=0; i < WheelManager.views.length; i++)
		{
			if(WheelManager.views[i].id === id)
			{
				tgtID = i;
				break;
			}
		}

		if( tgtID > -1 ) WheelManager.views.splice( tgtID, 1);
	}


}

export default WheelManager;