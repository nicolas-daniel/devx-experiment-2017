const palettes = require('../colors/colors2.json');

/**
 * Utils
 */

class Utils {

    static map(n, start1, stop1, start2, stop2) {
        return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
    }

    static lucky(chances) {
        return !~~(Math.random() * chances);
    }

    static range(array) {
        return array[~~(Math.random() * array.length)];
    }

    static getPalette() {
        const palette = palettes[~~(Math.random() * palettes.length)];
        return {
            background : palette[0],
            outline : palette[1],
            thinOutline : palette[2],
            shape : palette
        };
    }
    
}

export default Utils;
