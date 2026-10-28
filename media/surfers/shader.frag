// Dithering using noise and random functions
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D tex0;	// canvas that you draw on, src
uniform sampler2D tex1; // saved image of canvas, buffer
uniform float time;
uniform vec2 u_resolution;
uniform float res;
uniform float seed;

uniform vec3 palette0;
uniform vec3 palette1;
uniform vec3 palette2;
uniform vec3 palette3;
uniform vec3 palette4;
uniform vec3 palette5;
uniform vec3 palette6;
uniform vec3 palette7;
uniform vec3 palette8;
uniform vec3 palette9;

vec3 colors[10];

vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

vec3 closestColor(vec3 color) {
    vec3 targetHSV = rgb2hsv(color);

    vec3 closest = colors[0];
    float minDist = 999.0;
  
    //float dmin = distance(idealColor, color0);
  
    for (int i = 0; i < 10; i++) {
        vec3 col = colors[i];
        vec3 colHSV = rgb2hsv(col);
        
        float dr = abs(color.r - col.r);
        float dg = abs(color.g - col.g);
        float db = abs(color.b - col.b);
        
        float dist = sqrt(dr * dr + dg * dg + db * db);
        
        if (dist < minDist) {
            closest = col;
            minDist = dist;
        }
    }
    return closest;
}

float random(vec2 co) {
  return fract(sin(dot(co.xy, vec2(10.01, seed * 3.1415))) * 43.5);//43758.5453123
}

float dither(vec2 coords, float color, float grey) {
    // Calculated noised gray value
    float noised = (2.0/grey) * (random(coords)) + color - (1.0/grey);
    // Clamp to the number of gray levels we want
    float levels = clamp(floor(grey * noised) / (grey-1.0), 0.0, 1.0);
    return levels;
}

void main(void) {
  
  colors[0] = palette0 / 256.;
  colors[1] = palette1 / 256.;
  colors[2] = palette2 / 256.;
  colors[3] = palette3 / 256.;
  colors[4] = palette4 / 256.;
  colors[5] = palette5 / 256.;
  colors[6] = palette6 / 256.;
  colors[7] = palette7 / 256.;
  colors[8] = palette8 / 256.;
  colors[9] = palette9 / 256.;
  
  float gamma = 2.2;

  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.y = 1.0 - uv.y;

float height = 0.0;

if (u_resolution.y < res) {
  height = (u_resolution.y / u_resolution.y);
} else {
  height = (u_resolution.y / res);
}
  
  vec2 pixelBin = gl_FragCoord.xy / height;
  vec2 tiles = u_resolution.xy / height;
  vec2 vuv = floor(pixelBin) / tiles;
  vuv.y = 1.0-vuv.y;
  
  float greyLvl = 2.0; // Number of gray levels
  
  vec3 color = texture2D(tex0, vuv).rgb;
  vec3 tex = pow(texture2D(tex0, vuv).rgb, vec3(gamma));
  vec2 xyPos = floor(pixelBin);//floor(gl_FragCoord.xy/(u_resolution.y/pixRes));
  
  //vec3 col = vec3(dither(xyPos, dot(color, vec3(0.3, 0.59, 0.11)), greyLvl));
  vec3 col = vec3(dither(xyPos, color.r, greyLvl), dither(xyPos, color.g, greyLvl), dither(xyPos, color.b, greyLvl));
  
  col.rgb = pow(col, vec3(1.0/gamma));
  
  vec3 r = vec3(1.0, 0.0, 0.0);
    
  gl_FragColor = vec4(closestColor(col), 1.0);
  
}
