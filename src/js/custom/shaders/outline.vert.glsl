precision mediump float;

uniform float u_offset;

void main() {
    vec4 p = vec4(position + normal * u_offset, 1.0);
    gl_Position = projectionMatrix * modelViewMatrix * p;
}