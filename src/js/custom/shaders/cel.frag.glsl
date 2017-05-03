precision mediump float;
varying vec3 v_eyeNormal;
varying vec3 v_diffuse;

uniform vec3 u_light;
uniform vec3 u_ambient;
uniform vec3 u_specular;
uniform float u_shine;
uniform float u_celShading;

uniform vec3 color1;
uniform vec3 color2;
uniform vec3 color3;
uniform vec3 color4;
uniform vec3 color5;

float celShade(float d) {
    float E = 0.05;
    d *= u_celShading;
    float r = 1.0 / (u_celShading-0.5);
    float fd = floor(d);
    float dr = d * r;
    if (d > fd-E && d < fd+E) {
        float last = (fd - sign(d - fd))*r;
        return mix(last, fd*r, 
        smoothstep((fd-E)*r, (fd+E)*r, dr));
    } else {
        return fd*r;
    }
}

void main() {
    vec3 en = normalize(v_eyeNormal);
    vec3 ln = normalize(u_light);
    vec3 hn = normalize(ln + vec3(0, 0, 1));
    float E = 0.05;

    float df = max(0.0, dot(en, ln));
    float sf = max(0.0, dot(en, hn));

    float cdf = celShade(df);  

    sf = pow(sf, u_shine);

    if (sf > 0.5 - E && sf < 0.5 + E) {
        sf = smoothstep(0.5 - E, 0.5 + E, sf);
    } else {
        sf = step(0.5, sf);
    }

    float csf = sf;

    vec3 color = u_ambient + cdf * v_diffuse + csf * u_specular;

    if (color.g > 0.85) color = color4;
    else if (color.g > 0.7) color = color3;
    else if (color.g > 0.4) color = color2;
    else color = color1;

    gl_FragColor = vec4(color, 1.0);
}