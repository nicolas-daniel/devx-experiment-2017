import EventsManager from 'events/EventsManager';
import Events from 'events/Events';

const Color = require('color');

class Branding {
    
    constructor(view) {
        // DOM
        this.$view = view;
        this.$letters = this.$view.querySelectorAll('.logo__letter');
        this.$lines = this.$view.querySelectorAll('.logo__line');
        this.$helperAction = this.$view.querySelector('.helper__action');
        this.$helperReaction = this.$view.querySelector('.helper__reaction');
        this.$links = this.$view.querySelectorAll('.credit__link');

        // Bindings
        this.onPaletteChange = ::this.onPaletteChange;
        this.stopPropagation = ::this.stopPropagation;

        // Stop propagations
        for (let i=0; i<this.$links.length; i++) {
            this.$links[i].addEventListener('mousedown', this.stopPropagation);
            this.$links[i].addEventListener('mouseup', this.stopPropagation);
        }

        // Listeners
        EventsManager.on(Events.PALETTE_CHANGE, this.onPaletteChange);
    }

    onPaletteChange(palette) {
        // if (window.vjPlaying) return;
        
        // Darken background color
        const backgroundColor = Color(palette.background);
        let letterColor = backgroundColor.hsl().darken(0.25).rgb();

        // for letters
        for (let i=0; i<this.$letters.length; i++) {
            this.$letters[i].style.color = `rgb(${~~letterColor.color[0]}, ${~~letterColor.color[1]}, ${~~letterColor.color[2]})`;
        }

        // and lines
        for (let i=0; i<this.$lines.length; i++) {
            this.$lines[i].style.backgroundColor = `rgb(${~~letterColor.color[0]}, ${~~letterColor.color[1]}, ${~~letterColor.color[2]})`;
        }

        // Check background luminosity
        const luminosity = backgroundColor.luminosity();

        // Change helper color depending on luminosity
        if (luminosity > 0.7) {
            this.$helperAction.style.color = '#333333';
            this.$helperReaction.style.color = '#333333';
        } else {
            this.$helperAction.style.color = '#FFFFFF';
            this.$helperReaction.style.color = '#FFFFFF';
        }
    }

    setWhiteMode() {
        // Letters
        for (let i=0; i<this.$letters.length; i++) {
            this.$letters[i].style.color = '#FFFFFF';
        }

        // Lines
        for (let i=0; i<this.$lines.length; i++) {
            this.$lines[i].style.backgroundColor = '#FFFFFF';
        }
    }

    stopPropagation(e) {
        e.stopPropagation();
    }

}

export default Branding;