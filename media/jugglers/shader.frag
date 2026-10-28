#ifdef GL_ES
precision mediump float;
#endif
  
// UNIFORMS
uniform sampler2D tex0;	// canvas that you draw on, src
uniform sampler2D tex1; // saved image of canvas, buffer
uniform float time;
uniform vec2 u_resolution;

varying vec2 uv;

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
    
    vec2 vUv = gl_FragCoord.xy / u_resolution.xy;
    vUv.y = 1.0 - vUv.y;
    vec3 rgb = texture2D(tex1, vUv).rgb;
  
  
    if (random(vec2(vUv.x + time, vUv.y)) < 0.01) {
      rgb = texture2D(tex0, vUv).rgb;
    }
  
    vec4 color = vec4(rgb, 1.0);
    gl_FragColor = color;

}