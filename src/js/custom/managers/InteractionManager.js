import EventsManager from '../events/EventsManager';
import Events from '../events/Events';

/**
 * Interaction Manager
 */

class InteractionManager {

    static start() {
        // Props
        window.mouse = new THREE.Vector2();
        window.mousedown = false;

        // Move
        window.addEventListener('mousemove', InteractionManager.onMousemove );
        window.addEventListener('touchmove', InteractionManager.onTouchmove);
        
        // Down
        window.addEventListener('mousedown', InteractionManager.onMousedown);
        window.addEventListener('touchstart', InteractionManager.onMousedown);
        
        // Up
        window.addEventListener('mouseup', InteractionManager.onMouseup);
        window.addEventListener('touchend', InteractionManager.onMouseup);
    }

    static onMousemove(e) {
        window.mouse.set(e.clientX, e.clientY);
    }

    static onTouchmove(e) {
        e.preventDefault();
        window.mouse.set(e.touches[0].clientX, e.touches[0].clientY);
    }

    static onMousedown() {
        window.mousedown = true;
        EventsManager.emit(Events.MOUSE_DOWN);
    }

    static onMouseup() {
        window.mousedown = false;
        EventsManager.emit(Events.MOUSE_UP);
    }

}

export default InteractionManager;