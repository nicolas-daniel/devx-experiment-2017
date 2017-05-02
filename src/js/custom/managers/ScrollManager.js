import Tools from '../utils/Tools';

/**
 * Scroll Manager
 */

class ScrollManager {


	static start() {

		ScrollManager.views = [];

		if (window.isSafari) {
			window.wrapper.addEventListener('scroll', ScrollManager.scroll );
		} else {
			window.addEventListener('scroll', ScrollManager.scroll );
		}

		ScrollManager.scroll();
	}

	static bind( id, fn) {

		ScrollManager.views.push({id:id,fn:fn});
	}

	static unbind(id) {

		let tgtID = -1;

		for(let i=0; i < ScrollManager.views.length; i++)
		{
			if(ScrollManager.views[i].id === id)
			{
				tgtID = i;
				break;
			}
		}

		if( tgtID > -1 ) ScrollManager.views.splice( tgtID, 1);
	}

	static scroll() {

		window.scroll = Tools.getScrollTop();

		for(let i=0; i < ScrollManager.views.length; i++) ScrollManager.views[i].fn();

	}

}

export default ScrollManager;