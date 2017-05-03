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

    vec4 color = texture2D(tInput, uv);

    // Morph
    if (morph > 0.) {
        color = texture2D(tInput, vec2(sin(vUv.x * 3.14), sin(vUv.y * 3.14)));
    }

    gl_FragColor = color;

}