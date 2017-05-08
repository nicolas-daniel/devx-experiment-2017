uniform sampler2D tInput;

varying vec2 vUv;

uniform vec3 color;
uniform float progress;

void main() {

    float alpha = vUv.x > progress ? 0.0 : 1.0;
    gl_FragColor = vec4(color, alpha);

}