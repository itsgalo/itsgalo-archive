#ifdef GL_ES
precision mediump float;
#endif

// UNIFORMS
uniform sampler2D tex0;	// canvas that you draw on, src
uniform sampler2D tex1; // saved image of canvas, buffer
uniform float time;
uniform float nColors;
uniform float pixelCount;
uniform vec2 u_resolution;

//noise
highp float random(vec2 co)
{
    highp float a = 12.9898;
    highp float b = 78.233;
    highp float c = 43758.5453;
    highp float dt= dot(co.xy ,vec2(a,b));
    highp float sn= mod(dt,3.14);
    return fract(sin(sn) * c);
}

void main() {

    vec2 uv = gl_FragCoord.xy / u_resolution.xy;
    uv.y = 1.0-uv.y;

    float aspect = u_resolution.x / u_resolution.y;
    vec2 newRes = vec2(pixelCount);
    newRes.x *= aspect;

    vec2 vuv = floor( uv * newRes ) / newRes;

    vec4 src = texture2D(tex0, vuv);

    float gamma = 4.2;
    float numColors = nColors;

    vec3 c = src.rgb; //texture2D(tex0, st).rgb;
    c = pow(c, vec3(gamma, gamma, gamma));
    c = c * numColors;
    c = floor(c);
    c = c / numColors;
    c = pow(c, vec3(1.0/gamma));

    vec4 tex = vec4(c, 1.0);
    if (random(vec2(vuv.x + time, vuv.y)) < 0.7) {
      tex = texture2D(tex1, uv);
    }

    gl_FragColor = tex;

}
