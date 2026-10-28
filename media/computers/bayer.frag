#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
uniform sampler2D tex1; // color palette
uniform vec2 u_resolution;
uniform float spread;
uniform float offset;

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

// All components are in the range [0…1], including hue.
vec3 rgb2hsv(vec3 c)
{
    vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
    vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
    vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

    float d = q.x - min(q.w, q.y);
    float e = 1.0e-10;
    return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
}

// All components are in the range [0…1], including hue.
vec3 hsv2rgb(vec3 c)
{
    vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
    vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
    return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
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

// "steps" of R, G and B. Must be integer && equal or greater than 2
float rcount = 2.0;
float gcount = 2.0;
float bcount = 2.0;
float acount = 1.0;

float bayer[16];

const float bayerSize = 4.0;
float bayerDivider = bayerSize * bayerSize;

//takes input color from matrix index
vec4 nearestColor(vec4 incolor) {
    vec4 rgbaCounts = vec4(rcount, gcount, bcount, acount);

    vec4 color = incolor;
    //lightness calculation
    color.r = (floor((rgbaCounts.r - 1.0) * color.r + offset) / (rgbaCounts.r - 1.0));
    color.g = (floor((rgbaCounts.g - 1.0) * color.g + 0.1) / (rgbaCounts.g - 1.0));
    color.b = (floor((rgbaCounts.b - 1.0) * color.b + offset) / (rgbaCounts.b - 1.0));
    color.a = 1.0;
    //float newcolor = length(color.rgb * vec3(0.2126,0.7152,0.0722));
    float newcolor = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    //0.2126,0.7152,0.0722
    vec4 grey = vec4(newcolor, newcolor, newcolor, 1.0);

    return color;
}
//see algorithm https://medium.com/the-bkpt/dithered-shading-tutorial-29f57d06ac39
float indexValue(int idx) {
    int x = int(mod(gl_FragCoord.x, bayerSize));
    int y = int(mod(gl_FragCoord.y, bayerSize));

    if(x < 8){
      if (idx == 0) return bayer[0] / 16.0;
      if (idx == 1) return bayer[1] / 16.0;
      if (idx == 2) return bayer[2] / 16.0;
      if (idx == 3) return bayer[3] / 16.0;
      if (idx == 4) return bayer[4] / 16.0;
      if (idx == 5) return bayer[5] / 16.0;
      if (idx == 6) return bayer[6] / 16.0;
      if (idx == 7) return bayer[7] / 16.0;
      if (idx == 8) return bayer[8] / 16.0;
      if (idx == 9) return bayer[9] / 16.0;
      if (idx == 10) return bayer[10] / 16.0;
      if (idx == 11) return bayer[11] / 16.0;
      if (idx == 12) return bayer[12] / 16.0;
      if (idx == 13) return bayer[13] / 16.0;
      if (idx == 14) return bayer[14] / 16.0;
      if (idx == 15) return bayer[15] / 16.0;
    }
}

void main(void) {
  bayer[0] = 0.0;
  bayer[1] = 8.0;
  bayer[2] = 2.0;
  bayer[3] = 10.0;
  bayer[4] = 12.0;
  bayer[5] = 4.0;
  bayer[6] = 14.0;
  bayer[7] = 6.0;
  bayer[8] = 3.0;
  bayer[9] = 11.0;
  bayer[10] = 1.0;
  bayer[11] = 9.0;
  bayer[12] = 15.0;
  bayer[13] = 7.0;
  bayer[14] = 13.0;
  bayer[15] = 5.0;

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

  // create texture coordinates based on pixelSize //
  vec2 uv=gl_FragCoord.xy/u_resolution.xy;
  uv.y = 1.0-uv.y;
  
  vec2 pixelBin = gl_FragCoord.xy / floor(u_resolution.y/400.);
  vec2 tiles = u_resolution.xy / floor(u_resolution.y/400.);
  vec2 uvBin = floor(pixelBin) / tiles;
  
  vec4 color = texture2D(tex0, uv);

  float step_x = floor(u_resolution.y/400.)/u_resolution.x;
  float step_y = floor(u_resolution.y/400.)/u_resolution.y;

  vec4 cRight = texture2D(tex0, uv+vec2(step_x, 0.));
  vec4 cBottom = texture2D(tex0, uv+vec2(0., step_y));

  float _dFdx = length(color-cRight)/step_x;
  float _dFdy = length(color-cBottom)/step_y;

  float g = sqrt(pow(_dFdx, 2.)+pow(_dFdy, 2.)) * 0.006;
  
  // get the image as a vec4 using texture2D and plug in our distored uv's
  vec4 inColor = texture2D(tex0, uv);

  vec2 xyPos = floor(mod(pixelBin.xy, bayerSize));
  int idx = int(xyPos.x) + int(xyPos.y) * int(bayerSize);

  vec4 dither = nearestColor(inColor + spread * (indexValue(idx) / bayerDivider)); //bayerDivider normalizes the color range
  if(g > 0.1) {
    //color.rgb = vec3(0.0);
    gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
  } else {
    gl_FragColor = vec4(closestColor(dither.rgb), 1.0);
  }

}
