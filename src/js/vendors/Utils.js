// Utils

/**
 * @class
 * @source http://stackoverflow.com/questions/25582882/javascript-math-random-normal-distribution-gaussian-bell-curve
 * @source https://en.wikipedia.org/wiki/Marsaglia_polar_method
 */
class Gaussian {
  constructor(mean = 0, sd = 1) {
    this.mean = mean;
    this.sd = sd;
  }
  generate() {
    var y1, x1, x2, w;
    if (this._previous) {
      y1 = this._y2;
      this._previous = false;
    } else {
      do {
        x1 = Math.random() * 2 - 1;
        x2 = Math.random() * 2 - 1;
        w = x1 * x1 + x2 * x2;
      } while (w >= 1);
      w = Math.sqrt((-2 * Math.log(w)) / w);
      y1 = x1 * w;
      this._y2 = x2 * w;
      this._previous = true;
    }
    return y1 * this.sd + this.mean;
  }
}

/**
 * @class
 * @source https://github.com/processing/p5.js/blob/master/src/math/noise.js#L41
 */
class PerlinNoise {
  constructor(octaves = 4, ampFalloff = 0.5, size = 4095) {
    this._yWrapB = 4;
    this._yWrap = 1 << this._yWrapB;
    this._zWrapB = 8;
    this._zWrap = 1 << this._zWrapB;

    this._size = size;
    this._octaves = octaves;
    this._ampFalloff = ampFalloff;

    this._perlin = new Array(this._size + 1);
    for (var i = 0; i < this._size + 1; i++) {
      this._perlin[i] = Math.random();
    }
  }
  _scaledCosine(i) {
    return 0.5 * (1.0 - Math.cos(i * Math.PI));
  }
  noise(x = 0, y = 0, z = 0) {
    x = Math.abs(x);
    y = Math.abs(y);
    z = Math.abs(z);

    var xi = Math.floor(x),
      yi = Math.floor(y),
      zi = Math.floor(z);
    var xf = x - xi;
    var yf = y - yi;
    var zf = z - zi;

    var rxf, ryf;
    var r = 0;
    var ampl = 0.5;

    var n1, n2, n3;

    for (var o = 0; o < this._octaves; o++) {
      var of = xi + (yi << this._yWrapB) + (zi << this._zWrapB);

      rxf = this._scaledCosine(xf);
      ryf = this._scaledCosine(yf);

      n1 = this._perlin[of & this._size];
      n1 += rxf * (this._perlin[(of + 1) & this._size] - n1);
      n2 = this._perlin[(of + this._yWrap) & this._size];
      n2 += rxf * (this._perlin[(of + this._yWrap + 1) & this._size] - n2);
      n1 += ryf * (n2 - n1);

      of += this._zWrap;
      n2 = this._perlin[of & this._size];
      n2 += rxf * (this._perlin[(of + 1) & this._size] - n2);
      n3 = this._perlin[(of + this._yWrap) & this._size];
      n3 += rxf * (this._perlin[(of + this._yWrao + 1) & this._size] - n3);
      n2 += ryf * (n3 - n2);

      n1 += this._scaledCosine(zf) * (n2 - n1);

      r += n1 * ampl;
      ampl *= this._ampFalloff;
      xi <<= 1;
      xf *= 2;
      yi <<= 1;
      yf *= 2;
      zi <<= 1;
      zf *= 2;

      if (xf >= 1.0) {
        xi++; xf--;
      }
      if (yf >= 1.0) {
        yi++; yf--;
      }
      if (zf >= 1.0) {
        zi++; zf--;
      }
    }

    return r;
  }
}

const utils = {
  /**
   * @method
   * @desc
   * Takes N number of arguments and selects one randomly. Arguments can be weighted by probability if provided as an `Object` with a `value` and `prob` property, where `prob` is a number between 0 and 1 (`{ value: ..., prob: 0.2 }`). All unweighted arguments will be given an equal share of the remaining probability. 
   * @return value - Randomly selected value
   */
  random() {
    const args = Array.prototype.slice.call(arguments);
    var values = [],
      probability = 1,
      probCount = 0;

    // Create uniform values array
    args.forEach(function(value) {
      if (typeof value === 'object' && value.value !== undefined) {
        if (value.prob) {
          probability -= value.prob;
          probCount += 1;
        }
      } else {
        value = {
          value
        }
      }
      values.push(value);
    });

    // Calc average probability
    if (probability < 0) {
      throw new Error('utils.random() - Sum of all probabilities is larger than 1.');
    }
    const avgProbability = probability / (values.length - probCount);

    // Select random value
    const selector = Math.random();
    var threshold = 0,
      selected;

    for (let i = 0; i < values.length; i++) {
      let value = values[i];

      // Set average probability for unset items
      if (value.prob === undefined) {
        value.prob = avgProbability;
      }

      if (selector < value.prob + threshold) {
        selected = value;
        break;
      }

      threshold += value.prob;
    }

    return selected && selected.value;
  },
  map(n, start1, stop1, start2, stop2) {
    return ((n-start1)/(stop1-start1))*(stop2-start2)+start2;
  },
  Gaussian,
  PerlinNoise
};