/**
 * Request Animation Frame
 * Manager
 *
 * v1.0
 */

class RafManager {
	
	constructor() {

		// binding
		this.update = ::this.update;

		// params
		this.binders = [];
		this.raf = null;

		this.now = Date.now();
		this.time = this.now;
		this.deltaTime = 0;
	}

	/* Start */
	static start() {

		if(!RafManager.INSTANCE) RafManager.INSTANCE = new RafManager();

		RafManager.INSTANCE.update();
	}

	/* Stop */
	static stop() {

		window.cancelAnimationFrame( RafManager.INSTANCE.raf );
	}

	/* Update */
	update() {

		// time stuff
		this.now = Date.now();
		this.deltaTime = this.now - this.time;
		this.time = this.now;	

		for(let i=0; i < this.binders.length; i++) this.binders[i].fn( this.deltaTime );

		this.raf = window.requestAnimationFrame( this.update );
	}

	/**
	 * Bind
	 * @param  {String}   id [description]
	 * @param  {Function} fn [description]
	 */
	static bind(id, fn) {

		const _this = RafManager.INSTANCE;

		// id type check
		if( typeof id !== 'string' ) {
			console.error('RafManager :: Bind :: Invalid ID', id);
			return;
		}

		// fn type check
		if( typeof fn !== 'function' ) {
			console.error('RafManager :: Bind :: Invalid Function', fn);
			return;
		}

		// use id check
		for( let i = 0; i < _this.binders.length; i++ ) {

			const b = _this.binders[i];

			if(b.id === id) {
				console.warn('RafManager :: Bind :: ID already used !', id);
				return;
			}
		}

		RafManager.INSTANCE.binders.push({id:id,fn:fn});
	}

	static unbind(id) {

		let tgtID = -1;
		let _this = RafManager.INSTANCE;

		for(let i=0; i < _this.binders.length; i++)
		{
			if(_this.binders[i].id === id)
			{
				tgtID = i;
				break;
			}
		}

		// avoiding fails
		if( tgtID > -1 ) _this.binders.splice( tgtID, 1);

	}

	static debug () {

		console.table( RafManager.INSTANCE.binders );
	}

}

export default RafManager;