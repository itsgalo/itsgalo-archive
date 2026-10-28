#ifdef GL_ES
precision mediump float;
#endif

uniform sampler2D tex0;
uniform vec2 u_resolution;

//steps of R, G and B. Must be integer && equal or greater than 2
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
    //color distance calculation
    color.r = (floor((rgbaCounts.r - 1.0) * color.r + 0.1) / (rgbaCounts.r - 1.0));
    color.g = (floor((rgbaCounts.g - 1.0) * color.g + 0.1) / (rgbaCounts.g - 1.0));
    color.b = (floor((rgbaCounts.b - 1.0) * color.b + 0.1) / (rgbaCounts.b - 1.0));
    color.a = 1.0;
    //float newcolor = length(color.rgb * vec3(0.2126,0.7152,0.0722));
    float bw = dot(color.rgb, vec3(0.299, 0.587, 0.114));
    //float newcolor = dot(color.rgb, vec3(0.3, 0.59, 0.11));

    //clamp to bw levels
    float levels = clamp(floor((rcount-1.0) * bw + 0.5) / (rcount-1.0), 0.0, 1.0);
    vec4 grey = vec4(levels, levels, levels, 1.0);

    return color;
}

//see algorithm https://medium.com/the-bkpt/dithered-shading-tutorial-29f57d06ac39
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

  // create texture coordinates based on pixelSize
  vec2 uv = gl_FragCoord.xy / u_resolution.xy;
  uv.y = 1.0 - uv.y;

  //width of pixel region in texture coordinates. changes the dither dot size.
  float dotSize = 2.0;

  //modified pixel coords based on desired dot size
  vec2 pixelBin = gl_FragCoord.xy / dotSize;

  //step to downscale uvs and match the pixel bin
  vec2 tiles = u_resolution.xy / dotSize;
  vec2 uvBin = floor(pixelBin) / tiles;

  //get the image as a vec4 using texture2D and plug in our distored uvs
  vec4 inColor = texture2D(tex0, uvBin);

  //set up new coords to feed into the bayer matrix using modulo
  vec2 xyPos = floor(mod(pixelBin.xy, bayerSize));
  int idx = int(xyPos.x) + int(xyPos.y) * int(bayerSize);

  //spread value controls the contrast of the final colors (not true color reproduction)
  float spread = 10.5;

  vec4 dither = nearestColor(inColor + spread * (indexValue(idx) / bayerDivider)); //bayerDivider normalizes the color range

  gl_FragColor = dither;

}
