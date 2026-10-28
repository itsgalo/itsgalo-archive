

#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
uniform sampler2D tex1;
uniform vec2 u_resolution;
uniform float dotSize;
uniform float seed;

//glsl-lut by @mattdesl
vec4 lookup(in vec4 textureColor, in sampler2D lookupTable) {

    mediump float blueColor = textureColor.b * 63.0;
    mediump vec2 quad1;
    quad1.y = floor(floor(blueColor) / 8.0);
    quad1.x = floor(blueColor) - (quad1.y * 8.0);
    mediump vec2 quad2;
    quad2.y = floor(ceil(blueColor) / 8.0);
    quad2.x = ceil(blueColor) - (quad2.y * 8.0);
    highp vec2 texPos1;
    texPos1.x = (quad1.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
    texPos1.y = (quad1.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);
    highp vec2 texPos2;
    texPos2.x = (quad2.x * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.r);
    texPos2.y = (quad2.y * 0.125) + 0.5/512.0 + ((0.125 - 1.0/512.0) * textureColor.g);
    lowp vec4 newColor1 = texture2D(lookupTable, texPos1);
    lowp vec4 newColor2 = texture2D(lookupTable, texPos2);
    lowp vec4 newColor = mix(newColor1, newColor2, fract(blueColor));
    return newColor;
}

vec2 stepnoise(vec2 p, float size) {
    p += 10.0;
    float x = floor(p.x/size)*size;
    float y = floor(p.y/size)*size;

    x = fract(x*0.1) + 1.0 + x*0.0002;
    y = fract(y*0.1) + 1.0 + y*0.0003;

    float a = fract(1.0 / (0.000001*x*y + 0.00001));
    a = fract(1.0 / (0.000001234*a + 0.00001));

    float b = fract(1.0 / (0.000002*(x*y+x) + 0.00001));
    b = fract(1.0 / (0.0000235*b + 0.00001));

    return vec2(a, b);

}
float tent(float f) {
    return 1.0 - abs(fract(f)-0.5)*2.0;
}

#define SEED1 -0.5775604999999985
#define SEED2 6.440483302499992

float maskA(vec2 p) {
    vec2 r = stepnoise(p, 8.423424);
    p[0] += r[0];
    p[1] += r[1];

    float f1 = tent(p[0]*SEED1 + p[1]/(SEED1+0.5));
    float f2 = tent(p[1]*SEED2 + p[0]/(SEED2+0.5));
    float f = f1*f2;

    //f = pow(f, 4.0)*1.4 + f*0.2;
    f = sqrt(f);
    return f;
}

#define SEED3 (1.705)
#define SEED4 (1.379)
#define DMUL 8.12235325

float poly(float a, float b, float c, float ta, float tb, float tc) {
    return (a*ta + b*tb + c*tc) / (ta+tb+tc);
}
float maskB(vec2 p) {
    vec2 r = stepnoise(p, 5.5)-0.5;
    p[0] += r[0]*DMUL;
    p[1] += r[1]*DMUL;

    float f = fract(p[0]*seed + p[1]/(seed+0.15555))*1.03;
    return poly(pow(f, 150.0), f*f, f, 1.0, 0.0, 1.3);
}

float dither(vec2 coords, float gray, float ng) {
    // Calculated noised gray value
    //float noised = (2.0/ng) * T(intensity(coords)) + gray - (1.0/ng);
    float noised = (2.0/ng) * maskB(coords) + gray - (1.0/ng);
    // Clamp to the number of gray levels we want
    float levels = clamp(floor(ng * noised) / (ng-1.0), 0.0, 1.0);
    return levels;
}

void main(void) {
  float gamma = 2.2;

  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  //uv.y = 1.0 - uv.y;

  //float dotSize = 2.0;
  vec2 pixelBin = gl_FragCoord.xy / dotSize;
  vec2 tiles = u_resolution.xy / dotSize;
  vec2 uvBin = floor(pixelBin) / tiles;
  uvBin.y = 1.0 - uvBin.y;

  float greyLvl = 3.0; // Number of gray levels to use

  vec3 tex = pow(texture2D(tex0, uvBin).rgb, vec3(gamma));

  //optional posterize
  float numColors = 256.0;
  vec3 c = tex.rgb;
  c = c * numColors;
  c = floor(c);
  c = c / numColors;
  c = pow(c, vec3(1.0/gamma));
  vec4 post = vec4(c, 1.0);

  vec2 xyPos = floor(pixelBin.xy);

  //vec3 col = vec3(dither(xyPos, dot(post.rgb, vec3(0.3, 0.59, 0.11)), greyLvl));
  vec3 col = vec3(dither(xyPos, post.r, greyLvl), dither(xyPos, post.g, greyLvl), dither(xyPos, post.b, greyLvl));
  col.rgb = pow(col, vec3(1.0/gamma));



  vec4 remap = lookup(vec4(col, 1.0), tex1);
  gl_FragColor = remap;

}
