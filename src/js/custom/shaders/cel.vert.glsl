precision mediump float;

uniform mat4 u_projectionMat;
uniform mat4 u_modelviewMat;
uniform mat3 u_normalMat;
uniform vec3 u_diffuse;

varying vec3 v_eyeNormal;
varying vec3 v_diffuse;

void main() {

    v_eyeNormal = normalMatrix * normal;
    v_diffuse = u_diffuse;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);

}