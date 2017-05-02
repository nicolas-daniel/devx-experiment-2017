/**
 * Resize Manager
 */

class ResizeManager {


	static start() {

		ResizeManager.views = [];

		window.addEventListener('resize', ResizeManager.resize );

		ResizeManager.resize();
	}

	/**
	 * bind - add a callback
	 * 
	 * @param  id {String} - must be unique 
	 * @param  fn {Function} - callback function called on «resize»
	 */
	static bind(id, fn) {

		ResizeManager.views.push({id:id,fn:fn});
	}

	/**
	 * unbind - remove an existing callback
	 * 
	 * @param  id {String}
	 */
	static unbind(id) {

		let tgtID = -1;

		for(let i=0; i < ResizeManager.views.length; i++)
		{
			if(ResizeManager.views[i].id === id)
			{
				tgtID = i;
				break;
			}
		}

		if( tgtID > -1 ) ResizeManager.views.splice( tgtID, 1);
	}

	/**
	 * resize
     * 
	 */
	static resize() {

		window.w = document.documentElement.clientWidth;
		window.h = document.documentElement.clientHeight;

		for(let i=0; i < ResizeManager.views.length; i++) ResizeManager.views[i].fn(window.w,window.h);

	}

}

export default ResizeManager;