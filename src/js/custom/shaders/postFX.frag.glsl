uniform sampler2D tInput;

varying vec2 vUv;

uniform float divide;
uniform float mirrorX; 
uniform float mirrorY; 
uniform float morph;

void main() {
    
    vec2 uv = vUv;
    
    // Mirror x
    if (mirrorX > 0.) {
        uv.x = abs(vUv.x-.5)+.5;
    }
    
    // Mirror y
    if (mirrorY > 0.) {
        uv.y = abs(vUv.y-.5)+.5;
    }

    // Split
    uv *= divide; uv = mod(uv,vec2(1.));
    // if (uv.x > 0.5 && uv.y > 0.5) uv *= 2.; uv = mod(uv,vec2(1.));
    // if (vUv.x > 0.5 && vUv.y > 0.5) uv *= 2.; uv = mod(uv,vec2(1.));
    
    // if (vUv.x > 0.5 && vUv.y > 0.5) uv *= 2.; uv = mod(uv,vec2(1.));
    // if (vUv.x <= 0.5 && vUv.y <= 0.5) uv *= 2.; uv = mod(uv,vec2(1.));
    // if (vUv.x > 0.5 && vUv.y > 0.75 && vUv.x <= 0.75) uv *= 2.; uv = mod(uv,vec2(1.));
    // if (vUv.y < 0.5 && vUv.y >= 0.25 && vUv.x <= 0.25) uv *= 2.; uv = mod(uv,vec2(1.));

    vec4 color = texture2D(tInput, uv);

    // Morph
    if (morph > 0.) {
        color = texture2D(tInput, vec2(sin(vUv.x * 3.14), sin(vUv.y * 3.14)));
    }

    gl_FragColor = color;

}