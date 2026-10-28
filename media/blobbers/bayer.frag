#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;	// canvas that you draw on, src
uniform sampler2D tex1; // saved image of canvas, buffer
uniform float time;
uniform vec2 u_resolution;
uniform float mobile;
varying vec2 vTexCoord;

// "steps" of R, G and B. Must be integer && equal or greater than 2
float rcount = 2.0;
float gcount = 2.0;
float bcount = 2.0;
float acount = 1.0;

float bayer[16];

const float bayerSize = 4.0;
float bayerDivider = bayerSize * bayerSize;


vec4 nearestColour(vec4 incolor) {
    vec4 rgbaCounts = vec4(rcount, gcount, bcount, acount);

    vec4 color = incolor;

    color.r = (floor((rgbaCounts.r - 1.0) * color.r + 0.3) / (rgbaCounts.r - 1.0));
    color.g = (floor((rgbaCounts.g - 1.0) * color.g + 0.3) / (rgbaCounts.g - 1.0));
    color.b = (floor((rgbaCounts.b - 1.0) * color.b + 0.3) / (rgbaCounts.b - 1.0));
    color.a = 1.0;
    float newcolor = length(color.rgb * vec3(0.2126,0.7152,0.0722));
    //0.2126,0.7152,0.0722
    vec4 grey = vec4(newcolor, newcolor, newcolor, 1.0);

    return color;
}

float indexValue(int idx) {
    int x = int(mod(gl_FragCoord.x, 4.0));
    int y = int(mod(gl_FragCoord.y, 4.0));

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

void main(void) {
  //0,  8,  2,  10, 12, 4,  14, 6, 3,  11, 1,  9, 15, 7,  13, 5
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


  float spread = 1.0 / (0.299 * (rcount - 1.0) + 0.581 * (gcount - 1.0) + 0.114 * (bcount - 1.0));  // this spread value is optimised one -- try your own values for various effects!//0.299, 0.587, 0.114


  // create texture coordinates based on pixelSize //
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  if (mobile == 1.0) {
    uv = gl_FragCoord.xy / u_resolution.xy;
  } else {
    uv.y = 1.0-uv.y;
  }

  //width of pixel region in texture coordinates. changes the dither dot size.
  float dotSize = 2.0;
  vec2 texCoordsStep = 1.0 / (u_resolution.xy / dotSize);

  //pixel region number using the texture coordinates
  vec2 pixelBin = floor(uv.xy / texCoordsStep);

  //add step to incolor to downscale pixelate (bin)
  float tiles = u_resolution.y / dotSize;
  vec2 bin = floor(uv * tiles) / tiles;

  // get the image as a vec4 using texture2D and plug in our distored uv's
  vec4 inColor = texture2D(tex0, bin);

  vec2 entry = mod(pixelBin.xy, vec2(bayerSize, bayerSize));
  int idx = int(entry.y) * int(bayerSize) + int(entry.x);

  //vec3 rgb = inColor.rgb;
  vec4 rgb = nearestColour(inColor + 3.5 * (indexValue(idx) / bayerDivider - 0.0));

  if (random(vec2(uv.x + time, uv.y)) < 0.92) {
      rgb = texture2D(tex1, uv);
    }

  //gl_FragColor = nearestColour(inColor + 3.5 * (indexValue(idx) / bayerDivider - 0.0));
  gl_FragColor = rgb;

}
