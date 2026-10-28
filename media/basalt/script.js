var Ot=class{constructor(e,r){this.targetFPS=e,this.now,this.then=Date.now(),this.interval=1e3/this.targetFPS,this.delta,this.totalFrames=r,this.frameStep=0,this.loopTime=0,this.totalTime=0,this.cycle=0,this.frames=0,this.ptime=0,this.fps=0}calcFPS(e){return this.frames++,e>=this.ptime+1e3&&(this.fps=this.frames*1e3/(e-this.ptime),this.ptime=e,this.frames=0),this.fps}stepTime(e){this.now=Date.now(),this.delta=this.now-this.then,this.totalTime++}updateTime(e){this.then=this.now-this.delta%this.interval,this.frameStep>this.totalFrames-1&&(this.frameStep=0,this.cycle+=1),this.loopTime=this.frameStep/this.totalFrames*(Math.PI*2)}};var ui="ontouchstart"in document.documentElement;function gr(t){let e={x:0,y:0,px:0,py:0,pressed:!1,lastClick:0,doubleClick:function(){console.log("double clicked!")},hasTouch:ui};function r(n,o,l){let h=l.getBoundingClientRect();e.pressed=!0,e.x=n-h.left,e.y=o-h.top;let d=new Date().getTime();d-e.lastClick<500&&e.doubleClick(),e.lastClick=d}function i(n,o,l){let h=l.getBoundingClientRect();e.x=n-h.left,e.y=o-h.top}function s(n,o){e.pressed=!1}return ui?(t.addEventListener("touchstart",function(n){n.preventDefault(),r(n.touches[0].clientX,n.touches[0].clientY,t)}),t.addEventListener("touchmove",function(n){n.preventDefault(),i(n.touches[0].clientX,n.touches[0].clientY,t)}),t.addEventListener("touchend",function(n){n.preventDefault(),e.pressed=!1})):(t.addEventListener("mousedown",function(n){r(n.clientX,n.clientY,t)}),t.addEventListener("mousemove",function(n){i(n.clientX,n.clientY,t)}),t.addEventListener("mouseup",function(n){s(n.clientX,n.clientY)})),e}var fi={init:gr};var Se=class{constructor(e){this.useA=!1;let r=function(i){let s=parseInt(i.substring(0,8),16),n=parseInt(i.substring(8,16),16),o=parseInt(i.substring(16,24),16),l=parseInt(i.substring(24,32),16);return function(){s|=0,n|=0,o|=0,l|=0;let h=(s+n|0)+l|0;return l=l+1|0,s=n^n>>>9,n=o+(o<<3)|0,o=o<<21|o>>>11,o=o+h|0,(h>>>0)/4294967296}};this.prngA=new r(e.substring(2,34)),this.prngB=new r(e.substring(34,66));for(let i=0;i<1e6;i+=2)this.prngA(),this.prngB()}random_dec(){return this.useA=!this.useA,this.useA?this.prngA():this.prngB()}random_num(e,r){return e+(r-e)*this.random_dec()}random_int(e,r){return Math.floor(this.random_num(e,r+1))}random_bool(e){return this.random_dec()<e}random_choice(e){return e[this.random_int(0,e.length-1)]}},di=Se;function Nt(t,e){let r=t.length,i,s,n=function(){let o=Math.sin(e++)*1e4;return o-Math.floor(o)};for(;r;)s=Math.floor(n()*r--),i=t[r],t[r]=t[s],t[s]=i;return t}var xr={BURGUNDY:[145,78,114],BLUE:[0,120,191],GREEN:[0,169,92],MED_BLUE:[50,85,164],BRIGHT_RED:[241,80,96],FED_BLUE:[61,85,136],TEAL:[0,131,138],ORANGE:[255,108,47],CRIMSON:[228,93,80],CORNFLOWER:[98,168,229],SKYBLUE:[73,130,207],SEABLUE:[0,116,162],INDIGO:[72,77,122],MIDNIGHT:[67,80,96],MIST:[184,199,196],STEEL:[55,95,119],SEAFOAM:[98,194,177],LAGOON:[47,97,101],PLUM:[132,89,145],GRAPE:[108,93,128],TOMATO:[210,81,94],SUNFLOWER:[255,181,17],MELON:[255,174,59],APRICOT:[246,160,77],PAPRIKA:[238,127,75],MAHOGANY:[142,89,90],BISQUE:[242,205,207],WINE:[145,78,114],BA1:[100,18,25],BA2:[0,95,115],BA3:[10,147,150],BA4:[148,210,189],BA5:[233,216,166],BA6:[238,155,0],BA7:[202,103,2],BA8:[187,62,3],BA9:[174,32,18],BA10:[155,34,38]},wr={A:[201,201,201],B:[237,237,233],C:[214,204,194],D:[245,235,224],E:[227,213,202],F:[255,211,183]};function vr(t,e){let r=Object.values(xr),i=Object.values(wr),s=[],n=Nt(r,t.random_dec(0,9999)),o=Nt(i,t.random_dec(0,9999));for(let l=0;l<e;l++)l<e-1?s.push(n[l][0],n[l][1],n[l][2]):s.push(o[0][0],o[0][1],o[0][2]);return s=s.map(l=>l/255),s}var pi=vr;var Gt=class{constructor(e,r,i){this.gl=e,this.pgm=this.createPGM(e,r,i),this.fbo,this.texture,this.bb=new se(this.gl)}start(){let e=this.gl;e.bindFramebuffer(e.FRAMEBUFFER,this.fbo),e.useProgram(this.pgm)}allocate(e,r){let i=this.gl;this.fbo=i.createFramebuffer(),this.texture=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this.texture),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,e,r,0,i.RGBA,i.UNSIGNED_BYTE,null),i.bindFramebuffer(i.FRAMEBUFFER,this.fbo),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,this.texture,0)}allocate2(e,r){let i=this.gl;this.fbo=i.createFramebuffer(),this.texture=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this.texture),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,e,r,0,i.RGBA,i.UNSIGNED_BYTE,null),i.bindFramebuffer(i.FRAMEBUFFER,this.fbo),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,this.texture,0)}draw(e){this.bb.draw(e,this.texture)}draw2(e,r){this.bb.draw2(e,this.texture,r)}draw3(e,r,i){this.bb.draw3(e,this.texture,r,i)}draw4(e,r,i,s){this.bb.draw4(e,this.texture,r,i,s)}createPGM(e,r,i){let s=e.createProgram();return e.attachShader(s,r),e.attachShader(s,i),e.linkProgram(s),s}},Wt=class{constructor(e){this.gl=e,this.fbo,this.texture,this.bb=new se(e)}start(e){let r=this.gl;r.bindFramebuffer(r.FRAMEBUFFER,this.fbo)}allocate(e,r){let i=this.gl;this.fbo=i.createFramebuffer(),this.texture=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this.texture),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.NEAREST),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.NEAREST),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,e,r,0,i.RGBA,i.UNSIGNED_BYTE,null),i.bindFramebuffer(i.FRAMEBUFFER,this.fbo),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,this.texture,0)}allocate2(e,r){let i=this.gl;this.fbo=i.createFramebuffer(),this.texture=i.createTexture(),i.bindTexture(i.TEXTURE_2D,this.texture),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_S,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_WRAP_T,i.CLAMP_TO_EDGE),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MIN_FILTER,i.LINEAR),i.texParameteri(i.TEXTURE_2D,i.TEXTURE_MAG_FILTER,i.LINEAR),i.texImage2D(i.TEXTURE_2D,0,i.RGBA,e,r,0,i.RGBA,i.UNSIGNED_BYTE,null),i.bindFramebuffer(i.FRAMEBUFFER,this.fbo),i.framebufferTexture2D(i.FRAMEBUFFER,i.COLOR_ATTACHMENT0,i.TEXTURE_2D,this.texture,0)}draw(e){this.bb.draw(e,this.texture)}draw2(e,r){this.bb.draw2(e,this.texture,r)}draw3(e,r,i){this.bb.draw3(e,this.texture,r,i)}draw4(e,r,i,s){this.bb.draw4(e,this.texture,r,i,s)}};function qt(t,e,r){let i=t.createShader(r);return t.shaderSource(i,e),t.compileShader(i),t.getShaderParameter(i,t.COMPILE_STATUS)?i:(console.log(t.getShaderInfoLog(i)),null)}function mi(t,e,r){let i=t.createProgram();if(t.attachShader(i,e),t.attachShader(i,r),t.linkProgram(i),!t.getProgramParameter(i,t.LINK_STATUS))throw t.getProgramInfoLog(i);return i}var se=class{constructor(e){this.gl=e,this.vert=this.gl.createBuffer(),ke(this.gl,this.vert,[-1,1,0,-1,-1,0,1,1,0,1,-1,0]),this.tex=this.gl.createBuffer(),ke(this.gl,this.tex,[0,1,0,0,1,1,1,0]),this.color=this.gl.createBuffer(),ke(this.gl,this.color,[1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1])}predraw(e){let r=this.gl;r.useProgram(e),e.vertexPosAttrib=r.getAttribLocation(e,"pos"),r.enableVertexAttribArray(e.vertexPosAttrib),e.vertexColorAttrib=r.getAttribLocation(e,"color"),r.enableVertexAttribArray(e.vertexColorAttrib),e.vertexTexAttrib=r.getAttribLocation(e,"texcoord"),r.enableVertexAttribArray(e.vertexTexAttrib),r.bindBuffer(r.ARRAY_BUFFER,this.color),r.vertexAttribPointer(e.vertexColorAttrib,4,r.FLOAT,!1,0,0),r.bindBuffer(r.ARRAY_BUFFER,this.vert),r.vertexAttribPointer(e.vertexPosAttrib,3,r.FLOAT,!1,0,0),r.bindBuffer(r.ARRAY_BUFFER,this.tex),r.vertexAttribPointer(e.vertexTexAttrib,2,r.FLOAT,!1,0,0)}draw(e,r){let i=this.gl;this.predraw(e),i.uniform1i(i.getUniformLocation(e,"tex0"),0),i.activeTexture(i.TEXTURE0),i.bindTexture(i.TEXTURE_2D,r),i.drawArrays(i.TRIANGLE_STRIP,0,4)}draw2(e,r,i){let s=this.gl;this.predraw(e),s.uniform1i(s.getUniformLocation(e,"tex0"),0),s.uniform1i(s.getUniformLocation(e,"tex1"),1),s.activeTexture(s.TEXTURE0),s.bindTexture(s.TEXTURE_2D,r),s.activeTexture(s.TEXTURE1),s.bindTexture(s.TEXTURE_2D,i),s.drawArrays(s.TRIANGLE_STRIP,0,4)}draw3(e,r,i,s){let n=this.gl;this.predraw(e),n.uniform1i(n.getUniformLocation(e,"tex0"),0),n.uniform1i(n.getUniformLocation(e,"tex1"),1),n.uniform1i(n.getUniformLocation(e,"tex2"),2),n.activeTexture(n.TEXTURE0),n.bindTexture(n.TEXTURE_2D,r),n.activeTexture(n.TEXTURE1),n.bindTexture(n.TEXTURE_2D,i),n.activeTexture(n.TEXTURE2),n.bindTexture(n.TEXTURE_2D,s),n.drawArrays(n.TRIANGLE_STRIP,0,4)}draw4(e,r,i,s,n){let o=this.gl;this.predraw(e),o.uniform1i(o.getUniformLocation(e,"tex0"),0),o.uniform1i(o.getUniformLocation(e,"tex1"),1),o.uniform1i(o.getUniformLocation(e,"tex2"),2),o.uniform1i(o.getUniformLocation(e,"tex3"),3),o.activeTexture(o.TEXTURE0),o.bindTexture(o.TEXTURE_2D,r),o.activeTexture(o.TEXTURE1),o.bindTexture(o.TEXTURE_2D,i),o.activeTexture(o.TEXTURE2),o.bindTexture(o.TEXTURE_2D,s),o.activeTexture(o.TEXTURE3),o.bindTexture(o.TEXTURE_2D,n),o.drawArrays(o.TRIANGLE_STRIP,0,4)}};function ke(t,e,r){t.bindBuffer(t.ARRAY_BUFFER,e),t.bufferData(t.ARRAY_BUFFER,new Float32Array(r),t.STATIC_DRAW)}var yr={signature:"GIF",version:"89a",trailer:59,extensionIntroducer:33,applicationExtensionLabel:255,graphicControlExtensionLabel:249,imageSeparator:44,signatureSize:3,versionSize:3,globalColorTableFlagMask:128,colorResolutionMask:112,sortFlagMask:8,globalColorTableSizeMask:7,applicationIdentifierSize:8,applicationAuthCodeSize:3,disposalMethodMask:28,userInputFlagMask:2,transparentColorFlagMask:1,localColorTableFlagMask:128,interlaceFlagMask:64,idSortFlagMask:32,localColorTableSizeMask:7};function vi(t=256){let e=0,r=new Uint8Array(t);return{get buffer(){return r.buffer},reset(){e=0},bytesView(){return r.subarray(0,e)},bytes(){return r.slice(0,e)},writeByte(s){i(e+1),r[e]=s,e++},writeBytes(s,n=0,o=s.length){i(e+o);for(let l=0;l<o;l++)r[e++]=s[l+n]},writeBytesView(s,n=0,o=s.byteLength){i(e+o),r.set(s.subarray(n,n+o),e),e+=o}};function i(s){var n=r.length;if(n>=s)return;var o=1024*1024;s=Math.max(s,n*(n<o?2:1.125)>>>0),n!=0&&(s=Math.max(s,256));let l=r;r=new Uint8Array(s),e>0&&r.set(l.subarray(0,e),0)}}var Ue=12,gi=5003,Tr=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535];function br(t,e,r,i,s=vi(512),n=new Uint8Array(256),o=new Int32Array(gi),l=new Int32Array(gi)){let h=o.length,f=Math.max(2,i);n.fill(0),l.fill(0),o.fill(-1);let d=0,c=0,p=f+1,A=p,b=!1,E=A,x=(1<<E)-1,S=1<<p-1,J=S+1,I=S+2,k=0,z=r[0],W=0;for(let F=h;F<65536;F*=2)++W;W=8-W,s.writeByte(f),tt(S);let C=r.length;for(let F=1;F<C;F++)t:{let lt=r[F],D=(lt<<Ue)+z,N=lt<<W^z;if(o[N]===D){z=l[N];break t}let mt=N===0?1:h-N;for(;o[N]>=0;)if(N-=mt,N<0&&(N+=h),o[N]===D){z=l[N];break t}tt(z),z=lt,I<1<<Ue?(l[N]=I++,o[N]=D):(o.fill(-1),I=S+2,b=!0,tt(S))}return tt(z),tt(J),s.writeByte(0),s.bytesView();function tt(F){for(d&=Tr[c],c>0?d|=F<<c:d=F,c+=E;c>=8;)n[k++]=d&255,k>=254&&(s.writeByte(k),s.writeBytesView(n,0,k),k=0),d>>=8,c-=8;if((I>x||b)&&(b?(E=A,x=(1<<E)-1,b=!1):(++E,x=E===Ue?1<<E:(1<<E)-1)),F==J){for(;c>0;)n[k++]=d&255,k>=254&&(s.writeByte(k),s.writeBytesView(n,0,k),k=0),d>>=8,c-=8;k>0&&(s.writeByte(k),s.writeBytesView(n,0,k),k=0)}}}var Er=br;function yi(t,e,r){return t<<8&63488|e<<2&992|r>>3}function Ti(t,e,r,i){return t>>4|e&240|(r&240)<<4|(i&240)<<8}function bi(t,e,r){return t>>4<<8|e&240|r>>4}function ne(t,e,r){return t<e?e:t>r?r:t}function jt(t){return t*t}function xi(t,e,r){var i=0,s=1e100;let n=t[e],o=n.cnt,l=n.ac,h=n.rc,f=n.gc,d=n.bc;for(var c=n.fw;c!=0;c=t[c].fw){let A=t[c],b=A.cnt,E=o*b/(o+b);if(!(E>=s)){var p=0;r&&(p+=E*jt(A.ac-l),p>=s)||(p+=E*jt(A.rc-h),!(p>=s)&&(p+=E*jt(A.gc-f),!(p>=s)&&(p+=E*jt(A.bc-d),!(p>=s)&&(s=p,i=c))))}}n.err=s,n.nn=i}function Be(){return{ac:0,rc:0,gc:0,bc:0,cnt:0,nn:0,fw:0,bk:0,tm:0,mtm:0,err:0}}function Ar(t,e){let r=e==="rgb444"?4096:65536,i=new Array(r),s=t.length;if(e==="rgba4444")for(let n=0;n<s;++n){let o=t[n],l=o>>24&255,h=o>>16&255,f=o>>8&255,d=o&255,c=Ti(d,f,h,l),p=c in i?i[c]:i[c]=Be();p.rc+=d,p.gc+=f,p.bc+=h,p.ac+=l,p.cnt++}else if(e==="rgb444")for(let n=0;n<s;++n){let o=t[n],l=o>>16&255,h=o>>8&255,f=o&255,d=bi(f,h,l),c=d in i?i[d]:i[d]=Be();c.rc+=f,c.gc+=h,c.bc+=l,c.cnt++}else for(let n=0;n<s;++n){let o=t[n],l=o>>16&255,h=o>>8&255,f=o&255,d=yi(f,h,l),c=d in i?i[d]:i[d]=Be();c.rc+=f,c.gc+=h,c.bc+=l,c.cnt++}return i}function Ei(t,e,r={}){let{format:i="rgb565",clearAlpha:s=!0,clearAlphaColor:n=0,clearAlphaThreshold:o=0,oneBitAlpha:l=!1}=r;if(!t||!t.buffer)throw new Error("quantize() expected RGBA Uint8Array data");if(!(t instanceof Uint8Array)&&!(t instanceof Uint8ClampedArray))throw new Error("quantize() expected RGBA Uint8Array data");let h=new Uint32Array(t.buffer),f=r.useSqrt!==!1,d=i==="rgba4444",c=Ar(h,i),p=c.length,A=p-1,b=new Uint32Array(p+1);for(var E=0,x=0;x<p;++x){let Z=c[x];if(Z!=null){var S=1/Z.cnt;d&&(Z.ac*=S),Z.rc*=S,Z.gc*=S,Z.bc*=S,c[E++]=Z}}jt(e)/E<.022&&(f=!1);for(var x=0;x<E-1;++x)c[x].fw=x+1,c[x+1].bk=x,f&&(c[x].cnt=Math.sqrt(c[x].cnt));f&&(c[x].cnt=Math.sqrt(c[x].cnt));var J,I,k;for(x=0;x<E;++x){xi(c,x,!1);var z=c[x].err;for(I=++b[0];I>1&&(k=I>>1,!(c[J=b[k]].err<=z));I=k)b[I]=J;b[I]=x}var W=E-e;for(x=0;x<W;){for(var C;;){var tt=b[1];if(C=c[tt],C.tm>=C.mtm&&c[C.nn].mtm<=C.tm)break;C.mtm==A?tt=b[1]=b[b[0]--]:(xi(c,tt,!1),C.tm=x);var z=c[tt].err;for(I=1;(k=I+I)<=b[0]&&(k<b[0]&&c[b[k]].err>c[b[k+1]].err&&k++,!(z<=c[J=b[k]].err));I=k)b[I]=J;b[I]=tt}var F=c[C.nn],lt=C.cnt,D=F.cnt,S=1/(lt+D);d&&(C.ac=S*(lt*C.ac+D*F.ac)),C.rc=S*(lt*C.rc+D*F.rc),C.gc=S*(lt*C.gc+D*F.gc),C.bc=S*(lt*C.bc+D*F.bc),C.cnt+=F.cnt,C.mtm=++x,c[F.bk].fw=F.fw,c[F.fw].bk=F.bk,F.mtm=A}let N=[];var mt=0;for(x=0;;++mt){let Z=ne(Math.round(c[x].rc),0,255),Tt=ne(Math.round(c[x].gc),0,255),kt=ne(Math.round(c[x].bc),0,255),ut=255;d&&(ut=ne(Math.round(c[x].ac),0,255),l&&(ut=ut<=(typeof l=="number"?l:127)?0:255),s&&ut<=o&&(Z=Tt=kt=n,ut=0));let Ut=d?[Z,Tt,kt,ut]:[Z,Tt,kt];if(Mr(N,Ut)||N.push(Ut),(x=c[x].fw)==0)break}return N}function Mr(t,e){for(let r=0;r<t.length;r++){let i=t[r],s=i[0]===e[0]&&i[1]===e[1]&&i[2]===e[2],n=i.length>=4&&e.length>=4?i[3]===e[3]:!0;if(s&&n)return!0}return!1}function Ai(t,e,r="rgb565"){if(!t||!t.buffer)throw new Error("quantize() expected RGBA Uint8Array data");if(!(t instanceof Uint8Array)&&!(t instanceof Uint8ClampedArray))throw new Error("quantize() expected RGBA Uint8Array data");if(e.length>256)throw new Error("applyPalette() only works with 256 colors or less");let i=new Uint32Array(t.buffer),s=i.length,n=r==="rgb444"?4096:65536,o=new Uint8Array(s),l=new Array(n),h=r==="rgba4444";if(r==="rgba4444")for(let f=0;f<s;f++){let d=i[f],c=d>>24&255,p=d>>16&255,A=d>>8&255,b=d&255,E=Ti(b,A,p,c),x=E in l?l[E]:l[E]=Rr(b,A,p,c,e);o[f]=x}else{let f=r==="rgb444"?bi:yi;for(let d=0;d<s;d++){let c=i[d],p=c>>16&255,A=c>>8&255,b=c&255,E=f(b,A,p),x=E in l?l[E]:l[E]=_r(b,A,p,e);o[d]=x}}return o}function Rr(t,e,r,i,s){let n=0,o=1e100;for(let l=0;l<s.length;l++){let h=s[l],f=h[3],d=bt(f-i);if(d>o)continue;let c=h[0];if(d+=bt(c-t),d>o)continue;let p=h[1];if(d+=bt(p-e),d>o)continue;let A=h[2];d+=bt(A-r),!(d>o)&&(o=d,n=l)}return n}function _r(t,e,r,i){let s=0,n=1e100;for(let o=0;o<i.length;o++){let l=i[o],h=l[0],f=bt(h-t);if(f>n)continue;let d=l[1];if(f+=bt(d-e),f>n)continue;let c=l[2];f+=bt(c-r),!(f>n)&&(n=f,s=o)}return s}function bt(t){return t*t}function Mi(t={}){let{initialCapacity:e=4096,auto:r=!0}=t,i=vi(e),s=5003,n=new Uint8Array(256),o=new Int32Array(s),l=new Int32Array(s),h=!1;return{reset(){i.reset(),h=!1},finish(){i.writeByte(yr.trailer)},bytes(){return i.bytes()},bytesView(){return i.bytesView()},get buffer(){return i.buffer},get stream(){return i},writeHeader:f,writeFrame(d,c,p,A={}){let{transparent:b=!1,transparentIndex:E=0,delay:x=0,palette:S=null,repeat:J=0,colorDepth:I=8,dispose:k=-1}=A,z=!1;if(r?h||(z=!0,f(),h=!0):z=!!A.first,c=Math.max(0,Math.floor(c)),p=Math.max(0,Math.floor(p)),z){if(!S)throw new Error("First frame must include a { palette } option");Sr(i,c,p,S,I),wi(i,S),J>=0&&kr(i,J)}let W=Math.round(x/10);Cr(i,k,W,b,E);let C=!!S&&!z;Ur(i,c,p,C?S:null),C&&wi(i,S),Br(i,d,c,p,I,n,o,l)}};function f(){Ri(i,"GIF89a")}}function Cr(t,e,r,i,s){t.writeByte(33),t.writeByte(249),t.writeByte(4),s<0&&(s=0,i=!1);var n,o;i?(n=1,o=2):(n=0,o=0),e>=0&&(o=e&7),o<<=2,t.writeByte(0|o|0|n),vt(t,r),t.writeByte(s||0),t.writeByte(0)}function Sr(t,e,r,i,s=8){let n=1,o=0,l=Pe(i.length)-1,h=n<<7|s-1<<4|o<<3|l;vt(t,e),vt(t,r),t.writeBytes([h,0,0])}function kr(t,e){t.writeByte(33),t.writeByte(255),t.writeByte(11),Ri(t,"NETSCAPE2.0"),t.writeByte(3),t.writeByte(1),vt(t,e),t.writeByte(0)}function wi(t,e){let r=1<<Pe(e.length);for(let i=0;i<r;i++){let s=[0,0,0];i<e.length&&(s=e[i]),t.writeByte(s[0]),t.writeByte(s[1]),t.writeByte(s[2])}}function Ur(t,e,r,i){if(t.writeByte(44),vt(t,0),vt(t,0),vt(t,e),vt(t,r),i){let s=0,n=0,o=Pe(i.length)-1;t.writeByte(128|s|n|0|o)}else t.writeByte(0)}function Br(t,e,r,i,s=8,n,o,l){Er(r,i,e,s,t,n,o,l)}function vt(t,e){t.writeByte(e&255),t.writeByte(e>>8&255)}function Ri(t,e){for(var r=0;r<e.length;r++)t.writeByte(e.charCodeAt(r))}function Pe(t){return Math.max(Math.ceil(Math.log2(t)),1)}function Pr(t,e,r,i,s){return(1-s)*(1-s)*(1-s)*t[0]+3*((1-s)*(1-s))*s*e[0]+3*(1-s)*(s*s)*r[0]+s*s*s*i[0]}function Dr(t,e,r,i,s){return(1-s)*(1-s)*(1-s)*t[1]+3*((1-s)*(1-s))*s*e[1]+3*(1-s)*(s*s)*r[1]+s*s*s*i[1]}function Ir(t,e,r,i,s){return(1-s)*(1-s)*(1-s)*t[2]+3*((1-s)*(1-s))*s*e[2]+3*(1-s)*(s*s)*r[2]+s*s*s*i[2]}function _i(t,e,r,i,s){let n=t,o=e,l=r,h=i,f=s,d=Pr(n,o,l,h,f),c=Dr(n,o,l,h,f),p=Ir(n,o,l,h,f);return[d,c,p]}function Fr(t,e,r,i){return r*(t/=i)*t+e}function zr(t,e,r,i){return(t/=i/2)<1?r/2*t*t+e:-r/2*(--t*(t-2)-1)+e}function Lr(t,e,r,i){return t==i?e+r:r*(-Math.pow(2,-10*t/i)+1)+e}function Xr(t,e,r,i){return t==0?e:t==i?e+r:(t/=i/2)<1?r/2*Math.pow(2,10*(t-1))+e:r/2*(-Math.pow(2,-10*--t)+2)+e}function Or(t,e,r,i){return r*(t/=i)*t*t+e}function Nr(t,e,r,i){return(t/=i/2)<1?r/2*t*t*t+e:r/2*((t-=2)*t*t+2)+e}function Gr(t,e,r,i){return(t/=i/2)<1?r/2*t*t*t*t*t+e:r/2*((t-=2)*t*t*t*t+2)+e}function Wr(t,e,r,i){return r*((t=t/i-1)*t*t*t*t+1)+e}var De=class{constructor(e,r,i,s,n,o,l){this.start=e,this.ctrlA=r,this.ctrlB=i,this.end=s,this.pos=e,this.prevpos=[0,0,0],this.elapsed=0,this.totalTime=90,this.t=0,this.e=0,this.func=n,this.radius=o,this.color=l}reset(e){this.start=e[0],this.ctrlA=e[1],this.ctrlB=e[2],this.end=e[3]}update(e,r){this.elapsed+=1,this.t=this.elapsed/this.totalTime,this.func==1?this.e=Or(this.t,0,1,1):this.func==2?this.e=Nr(this.t,0,1,1):this.func==3?this.e=Wr(this.t,0,1,1):this.func==4?this.e=Fr(this.t,0,1,1):this.func==5?this.e=Xr(this.t,0,1,1):this.func==6?this.e=zr(this.t,0,1,1):this.func==7?this.e=Lr(this.t,0,1,1):this.func==8&&(this.e=Gr(this.t,0,1,1)),this.pos=_i([this.start[0]*e,this.start[1]*r,0],[this.ctrlA[0]*e,this.ctrlA[1]*r,0],[this.ctrlB[0]*e,this.ctrlB[1]*r,0],[this.end[0]*e,this.end[1]*r,0],this.e),this.elapsed>=this.totalTime&&(this.elapsed=0,this.e=0),this.prevpos=this.pos}render(e,r,i){let s=(this.pos[0]-this.prevpos[0])*.1,n=(this.pos[1]-this.prevpos[1])*.1;for(let o=0;o<50;o++){let l=_i([this.start[0]*r,this.start[1]*i,0],[this.ctrlA[0]*r,this.ctrlA[1]*i,0],[this.ctrlB[0]*r,this.ctrlB[1]*i,0],[this.end[0]*r,this.end[1]*i,0],this.e-o*.001);e.fillStyle=this.color,e.beginPath(),e.arc(l[0],l[1],this.radius/100,0,2*Math.PI),e.fill()}this.prevpos=this.pos}},Ci=De;var gt=class{constructor(e,r,i,s){this.x=e,this.y=r,this.w=i,this.h=s}contains(e){return e[0]>=this.x-this.w&&e[0]<this.x+this.w&&e[1]>=this.y-this.h&&e[1]<this.y+this.h}intersects(e){return!(e.x-e.w>this.x+this.w||e.x+e.w<this.x-this.w||e.y-e.h>this.y+this.h||e.y+e.h<this.y-this.h)}};var ae=class t{constructor(e,r){this.boundary=e,this.capacity=r,this.points=[],this.divided=!1}subdivide(){let e=this.boundary.x,r=this.boundary.y,i=this.boundary.w,s=this.boundary.h,n=new gt(e+i/2,r-s/2,i/2,s/2);this.northeast=new t(n,this.capacity);let o=new gt(e-i/2,r-s/2,i/2,s/2);this.northwest=new t(o,this.capacity);let l=new gt(e+i/2,r+s/2,i/2,s/2);this.southeast=new t(l,this.capacity);let h=new gt(e-i/2,r+s/2,i/2,s/2);this.southwest=new t(h,this.capacity),this.divided=!0}insert(e){if(!this.boundary.contains(e))return!1;if(this.points.length<this.capacity)return this.points.push(e),!0;if(this.divided||this.subdivide(),this.northeast.insert(e))return!0;if(this.northwest.insert(e))return!0;if(this.southeast.insert(e))return!0;if(this.southwest.insert(e))return!0}query(e,r){if(r||(r=[]),this.boundary.intersects(e)){for(let i of this.points)e.contains(i)&&r.push(i);this.divided&&(this.northwest.query(e,r),this.northeast.query(e,r),this.southwest.query(e,r),this.southeast.query(e,r))}else return;return r}};function it(t,e,r){this.x=t,this.y=e,this.z=r}it.prototype.dot2=function(t,e){return this.x*t+this.y*e};var qr=[new it(1,1,0),new it(-1,1,0),new it(1,-1,0),new it(-1,-1,0),new it(1,0,1),new it(-1,0,1),new it(1,0,-1),new it(-1,0,-1),new it(0,1,1),new it(0,-1,1),new it(0,1,-1),new it(0,-1,-1)],Si=[151,160,137,91,90,15,131,13,201,95,96,53,194,233,7,225,140,36,103,30,69,142,8,99,37,240,21,10,23,190,6,148,247,120,234,75,0,26,197,62,94,252,219,203,117,35,11,32,57,177,33,88,237,149,56,87,174,20,125,136,171,168,68,175,74,165,71,134,139,48,27,166,77,146,158,231,83,111,229,122,60,211,133,230,220,105,92,41,55,46,245,40,244,102,143,54,65,25,63,161,1,216,80,73,209,76,132,187,208,89,18,169,200,196,135,130,116,188,159,86,164,100,109,198,173,186,3,64,52,217,226,250,124,123,5,202,38,147,118,126,255,82,85,212,207,206,59,227,47,16,58,17,182,189,28,42,223,183,170,213,119,248,152,2,44,154,163,70,221,153,101,155,167,43,172,9,129,22,39,253,19,98,108,110,79,113,224,232,178,185,112,104,218,246,97,228,251,34,242,193,238,210,144,12,191,179,162,241,81,51,145,235,249,14,239,107,49,192,214,31,181,199,106,157,184,84,204,176,115,121,50,45,127,4,150,254,138,236,205,93,222,114,67,29,24,72,243,141,128,195,78,66,215,61,156,180],Ht=new Array(512),Yt=new Array(512);for(let t=0;t<256;t++){let e;t&1,e=Si[t]^0,Ht[t]=Ht[t+256]=e,Yt[t]=Yt[t+256]=qr[e%12]}var jr=.5*(Math.sqrt(3)-1),Vt=(3-Math.sqrt(3))/6,Ie=class{get(e,r){let i,s,n,o=(e+r)*jr,l=Math.floor(e+o),h=Math.floor(r+o),f=(l+h)*Vt,d=e-l+f,c=r-h+f,p,A;d>c?(p=1,A=0):(p=0,A=1);let b=d-p+Vt,E=c-A+Vt,x=d-1+2*Vt,S=c-1+2*Vt;l&=255,h&=255;let J=Yt[l+Ht[h]],I=Yt[l+p+Ht[h+A]],k=Yt[l+1+Ht[h+1]],z=.5-d*d-c*c;z<0?i=0:(z*=z,i=z*z*J.dot2(d,c));let W=.5-b*b-E*E;W<0?s=0:(W*=W,s=W*W*I.dot2(b,E));let C=.5-x*x-S*S;return C<0?n=0:(C*=C,n=C*C*k.dot2(x,S)),70*(i+s+n)}},ki=Ie;var Fe=class{constructor(e,r,i,s,n,o){this.xMin=e[0],this.xMax=e[1],this.yMin=e[2],this.yMax=e[3],this.radius=i,this.k=s,this.pointQueue=[],this.firstPoint=!0,this.thePoints=[],this.offset=n,this.r=o,this.poly=r,this.cellSize=this.radius*Math.sqrt(.5),this.width=Math.ceil((this.xMax-this.xMin)/this.cellSize),this.height=Math.ceil((this.yMax-this.yMin)/this.cellSize),this.data=new Array(this.width*this.height),this.initializeState(),this.thePoints=this.allPoints()}pointInPolygon(e,r){let i=!1;for(let s=0,n=this.poly.length-1;s<this.poly.length;n=s++){let o=this.poly[s][0],l=this.poly[s][1],h=this.poly[n][0],f=this.poly[n][1];l>r!=f>r&&e<(h-o)*(r-l)/(f-l)+o&&(i=!i)}return i}initializeState(){this.pointQueue=new Array(0),this.firstPoint=!0;for(let e=0;e<this.data.length;e++)this.data[e]=null}dist2(e,r,i,s){return(i-e)*(i-e)+(s-r)*(s-r)}createNewPoint(e,r){let i={x:e,y:r},s=Math.floor(e/this.cellSize)+Math.floor(r/this.cellSize)*this.width;return this.data[s]=i,this.pointQueue.push(i),i}isValidPoint(e,r){if(e<this.xMin||e>this.xMax||r<this.yMin||r>this.yMax||!this.pointInPolygon(e,r))return!1;let i=Math.floor((e-this.xMin)/this.cellSize),s=Math.floor((r-this.yMin)/this.cellSize),n=0,o=0,l=0,h=this.radius*this.radius;for(o=i-2;o<=i+2;o++)for(l=s-2;l<=s+2;l++)if(o>=0&&o<this.width&&l>=0&&l<this.height&&(n=o+l*this.width,this.data[n]!==null&&this.dist2(e,r,this.data[n].x,this.data[n].y)<=h))return!1;return!0}createPointInPolygon(){let e=0,r=0;for(let i=0;i<this.poly.length;i++)e+=this.poly[i][0],r+=this.poly[i][1];return e/=this.poly.length,r/=this.poly.length,this.createNewPoint(e+this.offset[0],r+this.offset[1])}nextPoint(){let e=0,r=0;if(this.firstPoint)return this.firstPoint=!1,this.createPointInPolygon();let i=0,s=0,n=0;for(;this.pointQueue.length>0;){i=this.pointQueue.length*this.r.random_dec()|0;let o=this.pointQueue[i].x,l=this.pointQueue[i].y;for(let h=0;h<this.k;h++)if(s=this.radius*(this.r.random_dec()+1),n=this.r.random_num(0,Math.PI*2),e=o+s*Math.cos(n),r=l+s*Math.sin(n),this.isValidPoint(e,r))return this.createNewPoint(e,r);this.pointQueue.splice(i,1)}return null}allPoints(){let e=null,r=new Array(0);for(;e=this.nextPoint(),e!=null;)r.push(e);return r}},Ui=Fe;function Vr(t,e,r,i){let s=r-t,n=i-e;return Math.sqrt(s*s+n*n)}function ze(t,e){return Math.round(t/e)*e}function Hr(t,e){let r=t[0],i=t[1],s=[r,i],n=e,o=[0,0],l=9e3,h=-1;for(let f=0;f<n.length;f++){h*=-1;let d=n[f];s[0]=d[0]-r,s[1]=d[1]-i,s[0]*=l/(s[0]*s[0]+s[1]*s[1]),s[1]*=l/(s[0]*s[0]+s[1]*s[1]),o[0]+=s[0]*h,o[1]+=s[1]*h}return[o[0]*.01,o[1]*.01]}function Pt(t,e,r,i,s,n,o,l,h){let f=0,d=1,c=n,p=0;for(let A=0;A<t;A++)p+=e.get(r*c+h,i*c+h/2)*d,f+=d,d*=s,c*=2;return p/=f,p=p*(l-o)/2+(l+o)/2,p}var Le=class{constructor(e,r,i,s,n,o,l){this.eps=e,this.width=r,this.height=i,this.margin=n,this.angle=o,this.rand=s,this.flow=l,this.poisson=new Ui([0,this.width,0,this.height],[[this.margin,this.margin],[this.width-this.margin,this.margin],[this.width-this.margin,this.height-this.margin],[this.margin,this.height-this.margin]],3,9,[this.rand.random_num(-this.width/8,this.width/8),this.rand.random_num(-this.height/8,this.height/8)],this.rand),this.polygons=[],this.boundary=new gt(0,0,this.width,this.height),this.qtree=new ae(this.boundary,2),this.noise=new ki,this.seed=this.rand.random_num(0,9999),this.targets=[];for(let h=0;h<4;h++)this.targets[h]=[this.rand.random_int(150,this.width-150),this.rand.random_int(150,this.height-150)];this.pts=Nt(this.poisson.thePoints,this.seed)}generatePack(){for(let e=0;e<this.poisson.thePoints.length;e++){let r=this.generatePolygon(e);if(this.canPutPoly(r)){this.polygons.push(r);for(let i=0;i<r.length;i++)this.qtree.insert(r[i])}}}generatePolygon(e){let r=this.pts[e].x,i=this.pts[e].y,s=Math.floor(this.rand.random_int(10,250)),n=0,o=this.rand.random_choice([-1,1]),l=[r,i],h,f,d=[];for(let c=0;c<s;c++){let p,A=0,b=0;if(this.flow==0)p=ze(Pt(4,this.noise,l[0],l[1],.1,.002,0,1,this.seed)*Math.PI*this.angle,Math.PI),h=Math.cos(p),f=Math.sin(p);else if(this.flow==1)p=ze(Pt(4,this.noise,l[0],l[1],.1,.002,0,1,this.seed)*Math.PI*this.angle,Math.PI/2),h=Math.cos(p),f=Math.sin(p);else if(this.flow==2)p=ze(Pt(4,this.noise,l[0],l[1],.1,.002,0,1,this.seed)*Math.PI*this.angle,Math.PI/3),h=Math.cos(p),f=Math.sin(p);else if(this.flow==3)p=Pt(2,this.noise,l[0],l[1],.1,.002,0,1,this.seed)*Math.PI*this.angle,h=Math.cos(p),f=Math.sin(p);else if(this.flow==4)h=(l[0]-this.targets[0][0])*.01,f=(l[1]-this.targets[0][1])*.01,A=f*this.angle*Math.PI/2,b=-h*this.angle*Math.PI/2;else if(this.flow==5)h=6*Math.sin(2*Math.PI/10*c),f=6*Math.cos(2*Math.PI/10*c);else if(this.flow==6){let S=Hr(l,this.targets);h=S[0],f=S[1]}else this.flow==7?(p=Pt(3,this.noise,l[0],l[1],.1,.001,0,1,this.seed)*Math.PI*this.angle,h=Math.cos(p),f=Math.sin(p)):this.flow==8&&(p=Pt(2,this.noise,l[0],l[1],.1,.001,0,1,this.seed)*Math.PI*this.angle,h=Math.cos(p),f=-Math.sin(p));h+=A,f+=b;let E=[h,f];E[0]*=this.eps*2,E[1]*=this.eps*2;let x=l;x[0]+=E[0]*o,x[1]+=E[1]*o,d.push([x[0],x[1]]),l=[x[0],x[1]]}return d}drawPolygon(e,r){r.fillStyle="#0000ff";for(let i=0;i<e.length;i++)r.beginPath(),r.arc(e[i][0],e[i][1],this.eps,0,2*Math.PI),r.fill()}canPutPoly(e){if(this.polygonIsOut(e))return!1;for(let r=0;r<e.length;r++){let i=new gt(e[r][0],e[r][1],this.eps*4,this.eps*4),s=this.qtree.query(i);for(let n=0;n<s.length;n++)if(Vr(s[n][0],s[n][1],e[r][0],e[r][1])<this.eps)return!1}return!0}canPlace(e){if(this.polygonIsOut(e))return!1;for(let r of this.polygons)if(this.polygonsIntersect(e,r))return!1;return!0}polygonIsOut(e){for(let r of e)if(r[0]<this.margin||r[0]>this.width-this.margin||r[1]<this.margin||r[1]>this.height-this.margin)return!0;return!1}},Bi=Le;var ii=(t,e,r)=>{if(!e.has(t))throw TypeError("Cannot "+r)},a=(t,e,r)=>(ii(t,e,"read from private field"),r?r.call(t):e.get(t)),M=(t,e,r)=>{if(e.has(t))throw TypeError("Cannot add the same private member more than once");e instanceof WeakSet?e.add(t):e.set(t,r)},G=(t,e,r,i)=>(ii(t,e,"write to private field"),i?i.call(t,r):e.set(t,r),r),Yr=(t,e,r,i)=>({set _(s){G(t,e,s,r)},get _(){return a(t,e,i)}}),R=(t,e,r)=>(ii(t,e,"access private method"),r),B=new Uint8Array(8),wt=new DataView(B.buffer),ot=t=>[(t%256+256)%256],P=t=>(wt.setUint16(0,t,!1),[B[0],B[1]]),$r=t=>(wt.setInt16(0,t,!1),[B[0],B[1]]),Xi=t=>(wt.setUint32(0,t,!1),[B[1],B[2],B[3]]),m=t=>(wt.setUint32(0,t,!1),[B[0],B[1],B[2],B[3]]),Ct=t=>(wt.setUint32(0,Math.floor(t/2**32),!1),wt.setUint32(4,t,!1),[B[0],B[1],B[2],B[3],B[4],B[5],B[6],B[7]]),ri=t=>(wt.setInt16(0,2**8*t,!1),[B[0],B[1]]),pt=t=>(wt.setInt32(0,2**16*t,!1),[B[0],B[1],B[2],B[3]]),Xe=t=>(wt.setInt32(0,2**30*t,!1),[B[0],B[1],B[2],B[3]]),ht=(t,e=!1)=>{let r=Array(t.length).fill(null).map((i,s)=>t.charCodeAt(s));return e&&r.push(0),r},St=t=>t&&t[t.length-1],yt=(t,e,r=!0)=>{let i=t*e;return r?Math.round(i):i},Oi=t=>{let e=t*(Math.PI/180),r=Math.cos(e),i=Math.sin(e);return[r,i,0,-i,r,0,0,0,1]},Qr=Oi(0),Ni=t=>[pt(t[0]),pt(t[1]),Xe(t[2]),pt(t[3]),pt(t[4]),Xe(t[5]),pt(t[6]),pt(t[7]),Xe(t[8])],Kt=t=>!t||typeof t!="object"?t:Array.isArray(t)?t.map(Kt):Object.fromEntries(Object.entries(t).map(([e,r])=>[e,Kt(r)])),Lt=t=>t>=0&&t<2**32,O=(t,e,r)=>({type:t,contents:e&&new Uint8Array(e.flat(10)),children:r}),L=(t,e,r,i,s)=>O(t,[ot(e),Xi(r),i??[]],s),Kr=t=>{let e=512;return t.fragmented?O("ftyp",[ht("iso5"),m(e),ht("iso5"),ht("iso6"),ht("mp41")]):O("ftyp",[ht("isom"),m(e),ht("isom"),t.holdsAvc?ht("avc1"):[],ht("mp41")])},Oe=t=>({type:"mdat",largeSize:t}),Zr=t=>({type:"free",size:t}),oe=(t,e,r=!1)=>O("moov",null,[Jr(e,t),...t.map(i=>ts(i,e)),r?Rs(t):null]),Jr=(t,e)=>{let r=yt(Math.max(0,...e.filter(o=>o.samples.length>0).map(o=>St(o.samples).timestamp+St(o.samples).duration)),je),i=Math.max(...e.map(o=>o.id))+1,s=!Lt(t)||!Lt(r),n=s?Ct:m;return L("mvhd",+s,0,[n(t),n(t),m(je),n(r),pt(1),ri(1),Array(10).fill(0),Ni(Qr),Array(24).fill(0),m(i)])},ts=(t,e)=>O("trak",null,[es(t,e),is(t,e)]),es=(t,e)=>{let r=St(t.samples),i=yt(r?r.timestamp+r.duration:0,je),s=!Lt(e)||!Lt(i),n=s?Ct:m;return L("tkhd",+s,3,[n(e),n(e),m(t.id),m(0),n(i),Array(8).fill(0),P(0),P(0),ri(t.info.type==="audio"?1:0),P(0),Ni(Oi(t.info.type==="video"?t.info.rotation:0)),pt(t.info.type==="video"?t.info.width:0),pt(t.info.type==="video"?t.info.height:0)])},is=(t,e)=>O("mdia",null,[rs(t,e),ss(t.info.type==="video"?"vide":"soun"),ns(t)]),rs=(t,e)=>{let r=St(t.samples),i=yt(r?r.timestamp+r.duration:0,t.timescale),s=!Lt(e)||!Lt(i),n=s?Ct:m;return L("mdhd",+s,0,[n(e),n(e),m(t.timescale),n(i),P(21956),P(0)])},ss=t=>L("hdlr",0,0,[ht("mhlr"),ht(t),m(0),m(0),m(0),ht("mp4-muxer-hdlr",!0)]),ns=t=>O("minf",null,[t.info.type==="video"?as():os(),ls(),us(t)]),as=()=>L("vmhd",0,1,[P(0),P(0),P(0),P(0)]),os=()=>L("smhd",0,0,[P(0),P(0)]),ls=()=>O("dinf",null,[hs()]),hs=()=>L("dref",0,0,[m(1)],[cs()]),cs=()=>L("url ",0,1),us=t=>O("stbl",null,[fs(t),Ts(t),bs(t),Es(t),As(t),Ms(t)]),fs=t=>L("stsd",0,0,[m(1)],[t.info.type==="video"?ds(Fs[t.info.codec],t):ws(Ls[t.info.codec],t)]),ds=(t,e)=>O(t,[Array(6).fill(0),P(1),P(0),P(0),Array(12).fill(0),P(e.info.width),P(e.info.height),m(4718592),m(4718592),m(0),P(1),Array(32).fill(0),P(24),$r(65535)],[zs[e.info.codec](e)]),ps=t=>t.codecPrivate&&O("avcC",[...t.codecPrivate]),ms=t=>t.codecPrivate&&O("hvcC",[...t.codecPrivate]),gs=t=>t.codecPrivate&&O("vpcC",[...t.codecPrivate]),xs=t=>t.codecPrivate&&O("av1C",[...t.codecPrivate]),ws=(t,e)=>O(t,[Array(6).fill(0),P(1),P(0),P(0),m(0),P(e.info.numberOfChannels),P(16),P(0),P(0),pt(e.info.sampleRate)],[Xs[e.info.codec](e)]),vs=t=>L("esds",0,0,[m(58753152),ot(32+t.codecPrivate.byteLength),P(1),ot(0),m(75530368),ot(18+t.codecPrivate.byteLength),ot(64),ot(21),Xi(0),m(130071),m(130071),m(92307584),ot(t.codecPrivate.byteLength),...t.codecPrivate,m(109084800),ot(1),ot(2)]),ys=t=>O("dOps",[ot(0),ot(t.info.numberOfChannels),P(3840),m(t.info.sampleRate),ri(0),ot(0)]),Ts=t=>L("stts",0,0,[m(t.timeToSampleTable.length),t.timeToSampleTable.map(e=>[m(e.sampleCount),m(e.sampleDelta)])]),bs=t=>{if(t.samples.every(r=>r.type==="key"))return null;let e=[...t.samples.entries()].filter(([,r])=>r.type==="key");return L("stss",0,0,[m(e.length),e.map(([r])=>m(r+1))])},Es=t=>L("stsc",0,0,[m(t.compactlyCodedChunkTable.length),t.compactlyCodedChunkTable.map(e=>[m(e.firstChunk),m(e.samplesPerChunk),m(1)])]),As=t=>L("stsz",0,0,[m(0),m(t.samples.length),t.samples.map(e=>m(e.size))]),Ms=t=>t.finalizedChunks.length>0&&St(t.finalizedChunks).offset>=2**32?L("co64",0,0,[m(t.finalizedChunks.length),t.finalizedChunks.map(e=>Ct(e.offset))]):L("stco",0,0,[m(t.finalizedChunks.length),t.finalizedChunks.map(e=>m(e.offset))]),Rs=t=>O("mvex",null,t.map(_s)),_s=t=>L("trex",0,0,[m(t.id),m(1),m(0),m(0),m(0)]),Pi=(t,e)=>O("moof",null,[Cs(t),...e.map(Ss)]),Cs=t=>L("mfhd",0,0,[m(t)]),Gi=t=>{let e=0,r=0,i=0,s=0,n=t.type==="delta";return r|=+n,n?e|=1:e|=2,e<<24|r<<16|i<<8|s},Ss=t=>O("traf",null,[ks(t),Us(t),Bs(t)]),ks=t=>{let e=0;e|=8,e|=16,e|=32,e|=131072;let r=t.currentChunk.samples[1]??t.currentChunk.samples[0],i={duration:r.timescaleUnitsToNextSample,size:r.size,flags:Gi(r)};return L("tfhd",0,e,[m(t.id),m(i.duration),m(i.size),m(i.flags)])},Us=t=>L("tfdt",1,0,[Ct(yt(t.currentChunk.startTimestamp,t.timescale))]),Bs=t=>{let e=t.currentChunk.samples.map(p=>p.timescaleUnitsToNextSample),r=t.currentChunk.samples.map(p=>p.size),i=t.currentChunk.samples.map(Gi),s=new Set(e),n=new Set(r),o=new Set(i),l=o.size===2&&i[0]!==i[1],h=s.size>1,f=n.size>1,d=!l&&o.size>1,c=0;return c|=1,c|=4*+l,c|=256*+h,c|=512*+f,c|=1024*+d,L("trun",0,c,[m(t.currentChunk.samples.length),m(t.currentChunk.offset-t.currentChunk.moofOffset||0),l?m(i[0]):[],t.currentChunk.samples.map((p,A)=>[h?m(e[A]):[],f?m(r[A]):[],d?m(i[A]):[]])])},Ps=t=>O("mfra",null,[...t.map(Ds),Is()]),Ds=(t,e)=>L("tfra",1,0,[m(t.id),m(63),m(t.finalizedChunks.length),t.finalizedChunks.map(r=>[Ct(yt(r.startTimestamp,t.timescale)),Ct(r.moofOffset),m(e+1),m(1),m(1)])]),Is=()=>L("mfro",0,0,[m(0)]),Fs={avc:"avc1",hevc:"hvc1",vp9:"vp09",av1:"av01"},zs={avc:ps,hevc:ms,vp9:gs,av1:xs},Ls={aac:"mp4a",opus:"Opus"},Xs={aac:vs,opus:ys},si=class{constructor(){this.buffer=null}},Wi=class{constructor(t){this.options=t}},Os=class{constructor(t,e){this.stream=t,this.options=e}},Et,Dt,ni=class{constructor(){this.pos=0,M(this,Et,new Uint8Array(8)),M(this,Dt,new DataView(a(this,Et).buffer)),this.offsets=new WeakMap}seek(t){this.pos=t}writeU32(t){a(this,Dt).setUint32(0,t,!1),this.write(a(this,Et).subarray(0,4))}writeU64(t){a(this,Dt).setUint32(0,Math.floor(t/2**32),!1),a(this,Dt).setUint32(4,t,!1),this.write(a(this,Et).subarray(0,8))}writeAscii(t){for(let e=0;e<t.length;e++)a(this,Dt).setUint8(e%8,t.charCodeAt(e)),e%8===7&&this.write(a(this,Et));t.length%8!==0&&this.write(a(this,Et).subarray(0,t.length%8))}writeBox(t){if(this.offsets.set(t,this.pos),t.contents&&!t.children)this.writeBoxHeader(t,t.size??t.contents.byteLength+8),this.write(t.contents);else{let e=this.pos;if(this.writeBoxHeader(t,0),t.contents&&this.write(t.contents),t.children)for(let s of t.children)s&&this.writeBox(s);let r=this.pos,i=t.size??r-e;this.seek(e),this.writeBoxHeader(t,i),this.seek(r)}}writeBoxHeader(t,e){this.writeU32(t.largeSize?1:e),this.writeAscii(t.type),t.largeSize&&this.writeU64(e)}measureBoxHeader(t){return 8+(t.largeSize?8:0)}patchBox(t){let e=this.pos;this.seek(this.offsets.get(t)),this.writeBox(t),this.seek(e)}measureBox(t){if(t.contents&&!t.children)return this.measureBoxHeader(t)+t.contents.byteLength;{let e=this.measureBoxHeader(t);if(t.contents&&(e+=t.contents.byteLength),t.children)for(let r of t.children)r&&(e+=this.measureBox(r));return e}}};Et=new WeakMap,Dt=new WeakMap;var le,_t,Zt,$t,he,Ne,Ns=class extends ni{constructor(t){super(),M(this,he),M(this,le,void 0),M(this,_t,new ArrayBuffer(2**16)),M(this,Zt,new Uint8Array(a(this,_t))),M(this,$t,0),G(this,le,t)}write(t){R(this,he,Ne).call(this,this.pos+t.byteLength),a(this,Zt).set(t,this.pos),this.pos+=t.byteLength,G(this,$t,Math.max(a(this,$t),this.pos))}finalize(){R(this,he,Ne).call(this,this.pos),a(this,le).buffer=a(this,_t).slice(0,Math.max(a(this,$t),this.pos))}};le=new WeakMap,_t=new WeakMap,Zt=new WeakMap,$t=new WeakMap,he=new WeakSet,Ne=function(t){let e=a(this,_t).byteLength;for(;e<t;)e*=2;if(e===a(this,_t).byteLength)return;let r=new ArrayBuffer(e),i=new Uint8Array(r);i.set(a(this,Zt),0),G(this,_t,r),G(this,Zt,i)};var ce,At,qi=class extends ni{constructor(t){super(),M(this,ce,void 0),M(this,At,[]),G(this,ce,t)}write(t){a(this,At).push({data:t.slice(),start:this.pos}),this.pos+=t.byteLength}flush(){if(a(this,At).length===0)return;let t=[],e=[...a(this,At)].sort((r,i)=>r.start-i.start);t.push({start:e[0].start,size:e[0].data.byteLength});for(let r=1;r<e.length;r++){let i=t[t.length-1],s=e[r];s.start<=i.start+i.size?i.size=Math.max(i.size,s.start+s.data.byteLength-i.start):t.push({start:s.start,size:s.data.byteLength})}for(let r of t){r.data=new Uint8Array(r.size);for(let i of a(this,At))r.start<=i.start&&i.start<r.start+r.size&&r.data.set(i.data,i.start-r.start);a(this,ce).options.onData?.(r.data,r.start)}a(this,At).length=0}finalize(){}};ce=new WeakMap,At=new WeakMap;var Gs=2**24,Ws=2,de,ct,rt,pe,Ge,We,Di,qe,Ii,Jt,me,ji=class extends ni{constructor(t){if(super(),M(this,pe),M(this,We),M(this,qe),M(this,Jt),M(this,de,void 0),M(this,ct,void 0),M(this,rt,[]),G(this,de,t),G(this,ct,t.options?.chunkSize??Gs),!Number.isInteger(a(this,ct))||a(this,ct)<2**10)throw new Error("Invalid StreamTarget options: chunkSize must be an integer not smaller than 1024.")}write(t){R(this,pe,Ge).call(this,t,this.pos),R(this,Jt,me).call(this),this.pos+=t.byteLength}finalize(){R(this,Jt,me).call(this,!0)}};de=new WeakMap,ct=new WeakMap,rt=new WeakMap,pe=new WeakSet,Ge=function(t,e){let r=a(this,rt).findIndex(l=>l.start<=e&&e<l.start+a(this,ct));r===-1&&(r=R(this,qe,Ii).call(this,e));let i=a(this,rt)[r],s=e-i.start,n=t.subarray(0,Math.min(a(this,ct)-s,t.byteLength));i.data.set(n,s);let o={start:s,end:s+n.byteLength};if(R(this,We,Di).call(this,i,o),i.written[0].start===0&&i.written[0].end===a(this,ct)&&(i.shouldFlush=!0),a(this,rt).length>Ws){for(let l=0;l<a(this,rt).length-1;l++)a(this,rt)[l].shouldFlush=!0;R(this,Jt,me).call(this)}n.byteLength<t.byteLength&&R(this,pe,Ge).call(this,t.subarray(n.byteLength),e+n.byteLength)},We=new WeakSet,Di=function(t,e){let r=0,i=t.written.length-1,s=-1;for(;r<=i;){let n=Math.floor(r+(i-r+1)/2);t.written[n].start<=e.start?(r=n+1,s=n):i=n-1}for(t.written.splice(s+1,0,e),(s===-1||t.written[s].end<e.start)&&s++;s<t.written.length-1&&t.written[s].end>=t.written[s+1].start;)t.written[s].end=Math.max(t.written[s].end,t.written[s+1].end),t.written.splice(s+1,1)},qe=new WeakSet,Ii=function(t){let e={start:Math.floor(t/a(this,ct))*a(this,ct),data:new Uint8Array(a(this,ct)),written:[],shouldFlush:!1};return a(this,rt).push(e),a(this,rt).sort((r,i)=>r.start-i.start),a(this,rt).indexOf(e)},Jt=new WeakSet,me=function(t=!1){for(let e=0;e<a(this,rt).length;e++){let r=a(this,rt)[e];if(!(!r.shouldFlush&&!t)){for(let i of r.written)a(this,de).options.onData?.(r.data.subarray(i.start,i.end),r.start+i.start);a(this,rt).splice(e--,1)}}};var qs=class extends ji{constructor(t){super(new Wi({onData:(e,r)=>t.stream.write({type:"write",data:e,position:r}),chunkSize:t.options?.chunkSize}))}},je=1e3,js=["avc","hevc","vp9","av1"],Vs=["aac","opus"],Hs=2082844800,Ys=["strict","offset"],T,v,ge,st,Q,K,It,zt,Ve,Mt,Rt,te,He,Vi,Ye,Hi,$e,Fi,Qe,Yi,Ke,zi,ue,Ze,dt,xt,Je,Li,ee,xe,we,ti,Ft,Qt,fe,ei,$i=class{constructor(t){if(M(this,He),M(this,Ye),M(this,$e),M(this,Qe),M(this,Ke),M(this,ue),M(this,dt),M(this,Je),M(this,ee),M(this,we),M(this,Ft),M(this,fe),M(this,T,void 0),M(this,v,void 0),M(this,ge,void 0),M(this,st,void 0),M(this,Q,null),M(this,K,null),M(this,It,Math.floor(Date.now()/1e3)+Hs),M(this,zt,[]),M(this,Ve,1),M(this,Mt,[]),M(this,Rt,[]),M(this,te,!1),R(this,He,Vi).call(this,t),t.video=Kt(t.video),t.audio=Kt(t.audio),t.fastStart=Kt(t.fastStart),this.target=t.target,G(this,T,{firstTimestampBehavior:"strict",...t}),t.target instanceof si)G(this,v,new Ns(t.target));else if(t.target instanceof Wi)G(this,v,t.target.options?.chunked?new ji(t.target):new qi(t.target));else if(t.target instanceof Os)G(this,v,new qs(t.target));else throw new Error(`Invalid target: ${t.target}`);R(this,Qe,Yi).call(this),R(this,Ye,Hi).call(this)}addVideoChunk(t,e,r){let i=new Uint8Array(t.byteLength);t.copyTo(i),this.addVideoChunkRaw(i,t.type,r??t.timestamp,t.duration,e)}addVideoChunkRaw(t,e,r,i,s){if(R(this,fe,ei).call(this),!a(this,T).video)throw new Error("No video track declared.");if(typeof a(this,T).fastStart=="object"&&a(this,Q).samples.length===a(this,T).fastStart.expectedVideoChunks)throw new Error(`Cannot add more video chunks than specified in 'fastStart' (${a(this,T).fastStart.expectedVideoChunks}).`);let n=R(this,ue,Ze).call(this,a(this,Q),t,e,r,i,s);if(a(this,T).fastStart==="fragmented"&&a(this,K)){for(;a(this,Rt).length>0&&a(this,Rt)[0].timestamp<=n.timestamp;){let o=a(this,Rt).shift();R(this,dt,xt).call(this,a(this,K),o)}n.timestamp<=a(this,K).lastTimestamp?R(this,dt,xt).call(this,a(this,Q),n):a(this,Mt).push(n)}else R(this,dt,xt).call(this,a(this,Q),n)}addAudioChunk(t,e,r){let i=new Uint8Array(t.byteLength);t.copyTo(i),this.addAudioChunkRaw(i,t.type,r??t.timestamp,t.duration,e)}addAudioChunkRaw(t,e,r,i,s){if(R(this,fe,ei).call(this),!a(this,T).audio)throw new Error("No audio track declared.");if(typeof a(this,T).fastStart=="object"&&a(this,K).samples.length===a(this,T).fastStart.expectedAudioChunks)throw new Error(`Cannot add more audio chunks than specified in 'fastStart' (${a(this,T).fastStart.expectedAudioChunks}).`);let n=R(this,ue,Ze).call(this,a(this,K),t,e,r,i,s);if(a(this,T).fastStart==="fragmented"&&a(this,Q)){for(;a(this,Mt).length>0&&a(this,Mt)[0].timestamp<=n.timestamp;){let o=a(this,Mt).shift();R(this,dt,xt).call(this,a(this,Q),o)}n.timestamp<=a(this,Q).lastTimestamp?R(this,dt,xt).call(this,a(this,K),n):a(this,Rt).push(n)}else R(this,dt,xt).call(this,a(this,K),n)}finalize(){if(a(this,te))throw new Error("Cannot finalize a muxer more than once.");if(a(this,T).fastStart==="fragmented"){for(let e of a(this,Mt))R(this,dt,xt).call(this,a(this,Q),e);for(let e of a(this,Rt))R(this,dt,xt).call(this,a(this,K),e);R(this,we,ti).call(this,!1)}else a(this,Q)&&R(this,ee,xe).call(this,a(this,Q)),a(this,K)&&R(this,ee,xe).call(this,a(this,K));let t=[a(this,Q),a(this,K)].filter(Boolean);if(a(this,T).fastStart==="in-memory"){let e;for(let i=0;i<2;i++){let s=oe(t,a(this,It)),n=a(this,v).measureBox(s);e=a(this,v).measureBox(a(this,st));let o=a(this,v).pos+n+e;for(let l of a(this,zt)){l.offset=o;for(let{data:h}of l.samples)o+=h.byteLength,e+=h.byteLength}if(o<2**32)break;e>=2**32&&(a(this,st).largeSize=!0)}let r=oe(t,a(this,It));a(this,v).writeBox(r),a(this,st).size=e,a(this,v).writeBox(a(this,st));for(let i of a(this,zt))for(let s of i.samples)a(this,v).write(s.data),s.data=null}else if(a(this,T).fastStart==="fragmented"){let e=a(this,v).pos,r=Ps(t);a(this,v).writeBox(r);let i=a(this,v).pos-e;a(this,v).seek(a(this,v).pos-4),a(this,v).writeU32(i)}else{let e=a(this,v).offsets.get(a(this,st)),r=a(this,v).pos-e;a(this,st).size=r,a(this,st).largeSize=r>=2**32,a(this,v).patchBox(a(this,st));let i=oe(t,a(this,It));if(typeof a(this,T).fastStart=="object"){a(this,v).seek(a(this,ge)),a(this,v).writeBox(i);let s=e-a(this,v).pos;a(this,v).writeBox(Zr(s))}else a(this,v).writeBox(i)}R(this,Ft,Qt).call(this),a(this,v).finalize(),G(this,te,!0)}};T=new WeakMap,v=new WeakMap,ge=new WeakMap,st=new WeakMap,Q=new WeakMap,K=new WeakMap,It=new WeakMap,zt=new WeakMap,Ve=new WeakMap,Mt=new WeakMap,Rt=new WeakMap,te=new WeakMap,He=new WeakSet,Vi=function(t){if(t.video){if(!js.includes(t.video.codec))throw new Error(`Unsupported video codec: ${t.video.codec}`);if(t.video.rotation!==void 0&&![0,90,180,270].includes(t.video.rotation))throw new Error(`Invalid video rotation: ${t.video.rotation}. Has to be 0, 90, 180 or 270.`)}if(t.audio&&!Vs.includes(t.audio.codec))throw new Error(`Unsupported audio codec: ${t.audio.codec}`);if(t.firstTimestampBehavior&&!Ys.includes(t.firstTimestampBehavior))throw new Error(`Invalid first timestamp behavior: ${t.firstTimestampBehavior}`);if(typeof t.fastStart=="object"){if(t.video&&t.fastStart.expectedVideoChunks===void 0)throw new Error("'fastStart' is an object but is missing property 'expectedVideoChunks'.");if(t.audio&&t.fastStart.expectedAudioChunks===void 0)throw new Error("'fastStart' is an object but is missing property 'expectedAudioChunks'.")}else if(![!1,"in-memory","fragmented"].includes(t.fastStart))throw new Error("'fastStart' option must be false, 'in-memory', 'fragmented' or an object.")},Ye=new WeakSet,Hi=function(){if(a(this,v).writeBox(Kr({holdsAvc:a(this,T).video?.codec==="avc",fragmented:a(this,T).fastStart==="fragmented"})),G(this,ge,a(this,v).pos),a(this,T).fastStart==="in-memory")G(this,st,Oe(!1));else if(a(this,T).fastStart!=="fragmented"){if(typeof a(this,T).fastStart=="object"){let t=R(this,$e,Fi).call(this);a(this,v).seek(a(this,v).pos+t)}G(this,st,Oe(!0)),a(this,v).writeBox(a(this,st))}R(this,Ft,Qt).call(this)},$e=new WeakSet,Fi=function(){if(typeof a(this,T).fastStart!="object")return;let t=0,e=[a(this,T).fastStart.expectedVideoChunks,a(this,T).fastStart.expectedAudioChunks];for(let r of e)r&&(t+=8*Math.ceil(2/3*r),t+=4*r,t+=12*Math.ceil(2/3*r),t+=4*r,t+=8*r);return t+=4096,t},Qe=new WeakSet,Yi=function(){if(a(this,T).video&&G(this,Q,{id:1,info:{type:"video",codec:a(this,T).video.codec,width:a(this,T).video.width,height:a(this,T).video.height,rotation:a(this,T).video.rotation??0},timescale:11520,codecPrivate:new Uint8Array(0),samples:[],finalizedChunks:[],currentChunk:null,firstTimestamp:void 0,lastTimestamp:-1,timeToSampleTable:[],lastTimescaleUnits:null,lastSample:null,compactlyCodedChunkTable:[]}),a(this,T).audio){let t=R(this,Ke,zi).call(this,2,a(this,T).audio.sampleRate,a(this,T).audio.numberOfChannels);G(this,K,{id:a(this,T).video?2:1,info:{type:"audio",codec:a(this,T).audio.codec,numberOfChannels:a(this,T).audio.numberOfChannels,sampleRate:a(this,T).audio.sampleRate},timescale:a(this,T).audio.sampleRate,codecPrivate:t,samples:[],finalizedChunks:[],currentChunk:null,firstTimestamp:void 0,lastTimestamp:-1,timeToSampleTable:[],lastTimescaleUnits:null,lastSample:null,compactlyCodedChunkTable:[]})}},Ke=new WeakSet,zi=function(t,e,r){let i=[96e3,88200,64e3,48e3,44100,32e3,24e3,22050,16e3,12e3,11025,8e3,7350].indexOf(e),s=r,n="";n+=t.toString(2).padStart(5,"0"),n+=i.toString(2).padStart(4,"0"),i===15&&(n+=e.toString(2).padStart(24,"0")),n+=s.toString(2).padStart(4,"0");let o=Math.ceil(n.length/8)*8;n=n.padEnd(o,"0");let l=new Uint8Array(n.length/8);for(let h=0;h<n.length;h+=8)l[h/8]=parseInt(n.slice(h,h+8),2);return l},ue=new WeakSet,Ze=function(t,e,r,i,s,n){let o=i/1e6,l=s/1e6;return o=R(this,Je,Li).call(this,o,t),n?.decoderConfig?.description&&(t.codecPrivate=new Uint8Array(n.decoderConfig.description)),{timestamp:o,duration:l,data:e,size:e.byteLength,type:r,timescaleUnitsToNextSample:yt(l,t.timescale)}},dt=new WeakSet,xt=function(t,e){if(a(this,T).fastStart!=="fragmented"&&t.samples.push(e),t.lastTimescaleUnits!==null){let i=yt(e.timestamp,t.timescale,!1),s=Math.round(i-t.lastTimescaleUnits);if(t.lastTimescaleUnits+=s,t.lastSample.timescaleUnitsToNextSample=s,a(this,T).fastStart!=="fragmented"){let n=St(t.timeToSampleTable);n.sampleCount===1?(n.sampleDelta=s,n.sampleCount++):n.sampleDelta===s?n.sampleCount++:(n.sampleCount--,t.timeToSampleTable.push({sampleCount:2,sampleDelta:s}))}}else t.lastTimescaleUnits=0,a(this,T).fastStart!=="fragmented"&&t.timeToSampleTable.push({sampleCount:1,sampleDelta:yt(e.duration,t.timescale)});t.lastSample=e;let r=!1;if(!t.currentChunk)r=!0;else{let i=e.timestamp-t.currentChunk.startTimestamp;if(a(this,T).fastStart==="fragmented"){let s=a(this,Q)??a(this,K);t===s&&e.type==="key"&&i>=1&&(r=!0,R(this,we,ti).call(this))}else r=i>=.5}r&&(t.currentChunk&&R(this,ee,xe).call(this,t),t.currentChunk={startTimestamp:e.timestamp,samples:[]}),t.currentChunk.samples.push(e)},Je=new WeakSet,Li=function(t,e){if(a(this,T).firstTimestampBehavior==="strict"&&e.lastTimestamp===-1&&t!==0)throw new Error(`The first chunk for your media track must have a timestamp of 0 (received ${t}). Non-zero first timestamps are often caused by directly piping frames or audio data from a MediaStreamTrack into the encoder. Their timestamps are typically relative to the age of the document, which is probably what you want.

If you want to offset all timestamps of a track such that the first one is zero, set firstTimestampBehavior: 'offset' in the options.
`);if(a(this,T).firstTimestampBehavior==="offset"&&(e.firstTimestamp===void 0&&(e.firstTimestamp=t),t-=e.firstTimestamp),t<e.lastTimestamp)throw new Error(`Timestamps must be monotonically increasing (went from ${e.lastTimestamp*1e6} to ${t*1e6}).`);return e.lastTimestamp=t,t},ee=new WeakSet,xe=function(t){if(a(this,T).fastStart==="fragmented")throw new Error("Can't finalize individual chunks 'fastStart' is set to 'fragmented'.");if(t.currentChunk){if(t.finalizedChunks.push(t.currentChunk),a(this,zt).push(t.currentChunk),(t.compactlyCodedChunkTable.length===0||St(t.compactlyCodedChunkTable).samplesPerChunk!==t.currentChunk.samples.length)&&t.compactlyCodedChunkTable.push({firstChunk:t.finalizedChunks.length,samplesPerChunk:t.currentChunk.samples.length}),a(this,T).fastStart==="in-memory"){t.currentChunk.offset=0;return}t.currentChunk.offset=a(this,v).pos;for(let e of t.currentChunk.samples)a(this,v).write(e.data),e.data=null;R(this,Ft,Qt).call(this)}},we=new WeakSet,ti=function(t=!0){if(a(this,T).fastStart!=="fragmented")throw new Error("Can't finalize a fragment unless 'fastStart' is set to 'fragmented'.");let e=[a(this,Q),a(this,K)].filter(l=>l&&l.currentChunk);if(e.length===0)return;let r=Yr(this,Ve)._++;if(r===1){let l=oe(e,a(this,It),!0);a(this,v).writeBox(l)}let i=a(this,v).pos,s=Pi(r,e);a(this,v).writeBox(s);{let l=Oe(!1),h=0;for(let d of e)for(let c of d.currentChunk.samples)h+=c.size;let f=a(this,v).measureBox(l)+h;f>=2**32&&(l.largeSize=!0,f=a(this,v).measureBox(l)+h),l.size=f,a(this,v).writeBox(l)}for(let l of e){l.currentChunk.offset=a(this,v).pos,l.currentChunk.moofOffset=i;for(let h of l.currentChunk.samples)a(this,v).write(h.data),h.data=null}let n=a(this,v).pos;a(this,v).seek(a(this,v).offsets.get(s));let o=Pi(r,e);a(this,v).writeBox(o),a(this,v).seek(n);for(let l of e)l.finalizedChunks.push(l.currentChunk),a(this,zt).push(l.currentChunk),l.currentChunk=null;t&&R(this,Ft,Qt).call(this)},Ft=new WeakSet,Qt=function(){a(this,v)instanceof qi&&a(this,v).flush()},fe=new WeakSet,ei=function(){if(a(this,te))throw new Error("Cannot add new video or audio chunks after the file has been finalized.")};function $s(t){let e=[],r=[],i="1.0",s,n;window.innerHeight<=window.innerWidth?(s=Math.max(window.innerHeight,1)*.75,n=Math.max(window.innerHeight,1)):(s=Math.max(window.innerWidth,1),n=Math.max(window.innerWidth,1)/.75);let o=t.hash||tr(),l=new di(o),h=l.random_choice([4,6,8,10]),f=pi(l,h),d=["#ff0000","#00ff00","#0000ff","#ffff00","#00ffff","#ff00ff","#0078BF","#3255A4","#D2515E","#62A8E5","#FFE800","#A5AAA8","#397E58","#EE7F4B"],c=l.random_dec(),p=t.rangle||l.random_choice([.3,.8,1.2,1.5,2.2]),A=l.random_choice(["2.0","3.0","4.0","99.0","99.0","99.0"]),b=l.random_choice(["1","2","2","3","3","4"]),E=l.random_choice(["2.0","4.0","8.0"]),x=t.spread||l.random_num(.05,.3),S=t.decay||l.random_num(1e-5,.004,.009),J=l.random_choice([3,6,9]),I=l.random_choice(["1.5","2.0","2.5"]),k=parseInt(t.ngestures)||l.random_choice([50,70]),z=l.random_choice([[2,5,10],[2,10,20],[2,40,100]]),W=parseInt(t.margin)||l.random_choice([0,0,0,25,50,100]),C=parseInt(t.outline)||l.random_num(0,1),tt=parseInt(t.fade)||l.random_choice([10,15,25,35]),F=parseInt(t.flowType)||l.random_choice([0,0,0,1,2,2,3,3,4,4,5,5,6,7,8]),lt=t.padding||48,D=1,N,mt=0,Z=!1,Tt=!1,kt=!1,ut=!1,Ut=0,ve={HASH:o,MARGIN:W,ANGLE:p,ROTATION:A,OCTAVES:b,SPREAD:x,DECAY:S,FLOW:F,FADE:tt,OUTLINE:C,GESTURES:k};console.log(ve),window.$artifact={features:ve,aspectRatio:.75};let Qi=`
    attribute vec3 pos;
    attribute vec4 color;
    attribute vec2 texcoord;
    varying vec4 vColor;
    varying vec2 tc;
    varying vec2 vUv;

    void main() {
      gl_Position = vec4(pos, 1.0);
      tc = texcoord;
      vColor = color;
      vUv = 0.5 * (pos.xy + 1.0);
    }`,Ki=`
    #ifdef GL_ES
    precision mediump float;
    precision mediump sampler2D;
    #endif
    uniform sampler2D tex0;
    uniform sampler2D tex1;
    uniform vec2 uResolution;
    varying vec2 vUv;

    void main() {
      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      vec4 c = texture2D(tex0, vUv);
      gl_FragColor = c;
    }`,Zi=`
    #ifdef GL_ES
    precision mediump float;
    precision mediump sampler2D;
    #endif
    uniform sampler2D tex0;
    uniform sampler2D tex1;
    uniform vec2 uResolution;
    uniform float uTime;
    uniform float pixel;
    uniform float seed;
    uniform float outline;

    varying vec4 vColor;
    varying vec2 tc;
    varying vec2 vUv;

    uniform vec3 palette[10];

    vec3 rgb2hsv(vec3 c) {
        vec4 K = vec4(0.0, -1.0 / 3.0, 2.0 / 3.0, -1.0);
        vec4 p = mix(vec4(c.bg, K.wz), vec4(c.gb, K.xy), step(c.b, c.g));
        vec4 q = mix(vec4(p.xyw, c.r), vec4(c.r, p.yzx), step(p.x, c.r));

        float d = q.x - min(q.w, q.y);
        float e = 1.0e-10;
        return vec3(abs(q.z + (q.w - q.y) / (6.0 * d + e)), d / (q.x + e), q.x);
    }

    vec3 hsv2rgb(vec3 c) {
        vec4 K = vec4(1.0, 2.0 / 3.0, 1.0 / 3.0, 3.0);
        vec3 p = abs(fract(c.xxx + K.xyz) * 6.0 - K.www);
        return c.z * mix(K.xxx, clamp(p - K.xxx, 0.0, 1.0), c.y);
    }

    vec3 closestColor(vec3 color) {
        vec3 targetHSV = rgb2hsv(color);

        vec3 closest = palette[0];
        float minDist = 999.0;
            
        for (int i = 0; i < ${h}; i++) {
            vec3 col = palette[i];
            vec3 colHSV = rgb2hsv(col);
            float dr, dg, db;
            
            if (seed > 0.25) {
              dr = 1.0-abs(color.r - col.r);
              dg = 1.0-abs(color.g - col.g);
              db = 1.0-abs(color.b - col.b);
            } else {
              dr = abs(color.r - col.r);
              dg = abs(color.g - col.g);
              db = abs(color.b - col.b);
            }

            
            float dist = sqrt(dr * dr + dg * dg + db * db);
            
            if (dist < minDist) {
                closest = col;
                minDist = dist;
            }
        }
        return closest;
    }

    float hash(float n) { return fract(sin(n) * 1e4); }
    float hash(vec2 p) { return fract(1e4 * sin(17.0 * p.x + p.y * 0.1) * (0.1 + abs(sin(p.y * 13.0 + p.x)))); }

    float bn(vec2 p) {
      return  (hash(p+vec2(-1,-1)) + hash(p+vec2(0,-1)) + hash(p+vec2(1,-1))
              + hash(p+vec2(-1, 0)) - 8.* hash( p ) + hash(p+vec2(1, 0))
              + hash(p+vec2(-1, 1)) + hash(p+vec2(0, 1)) + hash(p+vec2(1, 1))) * .5/9. * 2.1 +.5;
    }

    float dither(vec2 st, float color, float grey) {
      float noised = (2.0 / grey) * (bn(st)) + color - (1.0 / grey);
      float levels = clamp(floor(grey * noised) / (grey - 1.0), 0.0, 1.0);
      return levels;
    }

    void main(void) {

      vec2 uv = gl_FragCoord.xy / uResolution.xy;
      float aspect = uResolution.y / uResolution.x;

      float dotSize = 1.0;
      vec2 pixelBin = gl_FragCoord.xy / dotSize;
      vec2 tiles = uResolution.xy / dotSize;
      vec2 uvBin = floor(pixelBin) / tiles;      
      ivec2 pos = ivec2(mod(pixelBin.x*8.0, 8.0), mod(pixelBin.y*8.0, 8.0));
      vec4 inColor = texture2D(tex0, uv);
      float grey = 2.0;

      vec2 xyPos = floor(pixelBin);
      vec3 dith = vec3(dither(xyPos, inColor.r, grey), dither(xyPos, inColor.g, grey), dither(xyPos, inColor.b, grey));
      
      float sx = 1.0/uResolution.x * pixel;
      float sy = 1.0/uResolution.y * pixel;
      vec4 er = texture2D(tex0, uvBin+vec2(sx, 0.));
      vec4 eb = texture2D(tex0, uvBin+vec2(0., sy));
      float dx = length(inColor-er)/sx;
      float dy = length(inColor-eb)/sy;
      float g = sqrt(pow(dx,2.) + pow(dy,2.)) * 0.02;

      if(outline < 0.75) {
        if(g > 6.5) {
          if (seed > 0.25) {
            gl_FragColor = vec4(0.0, 0.0, 0.0, 1.0);
          } else {
            gl_FragColor = vec4(closestColor(vec3(1.0, 1.0, 1.0)), 1.0);
          }          
        } else {
          gl_FragColor = vec4(closestColor(dith.rgb), 1.0);
        }
      } else {
          gl_FragColor = vec4(closestColor(dith.rgb), 1.0);
      }      
    }
    `,Ji=`
    #ifdef GL_ES
    precision mediump float;
    precision mediump sampler2D;
    #endif

    uniform float uTime;
    uniform vec2 uResolution;
    uniform sampler2D tex0;
    uniform sampler2D tex1;
    uniform sampler2D tex2;
    uniform float seed;
    uniform float pixel;

    const float PI = 3.141592653;

    //4D simplex noise functions.
    //Author : Ian McEwan, Ashima Arts.

    vec4 mod289(vec4 x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0; }

    float mod289(float x) {
      return x - floor(x * (1.0 / 289.0)) * 289.0; }

    vec4 permute(vec4 x) {
        return mod289(((x*34.0)+10.0)*x);
    }

    float permute(float x) {
        return mod289(((x*34.0)+10.0)*x);
    }

    vec4 taylorInvSqrt(vec4 r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    float taylorInvSqrt(float r)
    {
      return 1.79284291400159 - 0.85373472095314 * r;
    }

    vec4 grad4(float j, vec4 ip)
      {
      const vec4 ones = vec4(1.0, 1.0, 1.0, -1.0);
      vec4 p,s;

      p.xyz = floor( fract (vec3(j) * ip.xyz) * 7.0) * ip.z - 1.0;
      p.w = 1.5 - dot(abs(p.xyz), ones.xyz);
      s = vec4(lessThan(p, vec4(0.0)));
      p.xyz = p.xyz + (s.xyz*2.0 - 1.0) * s.www;

      return p;
      }

    // (sqrt(5) - 1)/4 = F4, used once below
    #define F4 0.309016994374947451

    float snoise(vec4 v)
      {
      const vec4  C = vec4( 0.138196601125011,  // (5 - sqrt(5))/20  G4
                            0.276393202250021,  // 2 * G4
                            0.414589803375032,  // 3 * G4
                          -0.447213595499958); // -1 + 4 * G4

    // First corner
      vec4 i  = floor(v + dot(v, vec4(F4)) );
      vec4 x0 = v -   i + dot(i, C.xxxx);

    // Other corners

    // Rank sorting originally contributed by Bill Licea-Kane, AMD (formerly ATI)
      vec4 i0;
      vec3 isX = step( x0.yzw, x0.xxx );
      vec3 isYZ = step( x0.zww, x0.yyz );
    //  i0.x = dot( isX, vec3( 1.0 ) );
      i0.x = isX.x + isX.y + isX.z;
      i0.yzw = 1.0 - isX;
    //  i0.y += dot( isYZ.xy, vec2( 1.0 ) );
      i0.y += isYZ.x + isYZ.y;
      i0.zw += 1.0 - isYZ.xy;
      i0.z += isYZ.z;
      i0.w += 1.0 - isYZ.z;

      // i0 now contains the unique values 0,1,2,3 in each channel
      vec4 i3 = clamp( i0, 0.0, 1.0 );
      vec4 i2 = clamp( i0-1.0, 0.0, 1.0 );
      vec4 i1 = clamp( i0-2.0, 0.0, 1.0 );

      vec4 x1 = x0 - i1 + C.xxxx;
      vec4 x2 = x0 - i2 + C.yyyy;
      vec4 x3 = x0 - i3 + C.zzzz;
      vec4 x4 = x0 + C.wwww;

    // Permutations
      i = mod289(i);
      float j0 = permute( permute( permute( permute(i.w) + i.z) + i.y) + i.x);
      vec4 j1 = permute( permute( permute( permute (
                i.w + vec4(i1.w, i2.w, i3.w, 1.0 ))
              + i.z + vec4(i1.z, i2.z, i3.z, 1.0 ))
              + i.y + vec4(i1.y, i2.y, i3.y, 1.0 ))
              + i.x + vec4(i1.x, i2.x, i3.x, 1.0 ));

    // Gradients: 7x7x6 points over a cube, mapped onto a 4-cross polytope
    // 7*7*6 = 294, which is close to the ring size 17*17 = 289.
      vec4 ip = vec4(1.0/294.0, 1.0/49.0, 1.0/7.0, 0.0) ;

      vec4 p0 = grad4(j0,   ip);
      vec4 p1 = grad4(j1.x, ip);
      vec4 p2 = grad4(j1.y, ip);
      vec4 p3 = grad4(j1.z, ip);
      vec4 p4 = grad4(j1.w, ip);

    // Normalise gradients
      vec4 norm = taylorInvSqrt(vec4(dot(p0,p0), dot(p1,p1), dot(p2, p2), dot(p3,p3)));
      p0 *= norm.x;
      p1 *= norm.y;
      p2 *= norm.z;
      p3 *= norm.w;
      p4 *= taylorInvSqrt(dot(p4,p4));

    // Mix contributions from the five corners
      vec3 m0 = max(0.6 - vec3(dot(x0,x0), dot(x1,x1), dot(x2,x2)), 0.0);
      vec2 m1 = max(0.6 - vec2(dot(x3,x3), dot(x4,x4)            ), 0.0);
      m0 = m0 * m0;
      m1 = m1 * m1;
      return 49.0 * ( dot(m0*m0, vec3( dot( p0, x0 ), dot( p1, x1 ), dot( p2, x2 )))
                  + dot(m1*m1, vec2( dot( p3, x3 ), dot( p4, x4 ) ) ) ) ;

    }

    const int octaves = ${b};

    float ridgenoise(vec4 vuv) {
      float n = snoise(vuv);
      if (octaves == 1) {
        return 3.0 * (0.5 - abs(0.5 - n));
      }
      if (octaves == 2) {
        return 2.0 * (0.5 - abs(0.5 - n));
      }
      return n;
    }

    float fbm(vec2 vuv) {
      float amplitude = 0.5;
      float freq = 2.0;
      float value = 0.0;
      vec2 shift = vec2(10.0);
      mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));

      for(int i = 0; i < octaves; i++) {
          value += amplitude * ridgenoise(vec4(freq * vuv.x + seed, freq * vuv.y + seed, 0.001 * cos(uTime), 0.001 * sin(uTime)));
          vuv = rot * vuv * 2.0 + shift;
          amplitude *= 0.6;
          freq *= 2.0;//2
      }
      return pow(value * 1.0, 1.0);
    }

    vec2 clampAngle(vec2 coord){
      float angle = PI / ${A};
      float inangle = atan(coord.y, coord.x);
      float newangle = floor(inangle/angle + 0.5)*angle;
      float l = length(coord);
      vec2 t = vec2(cos(newangle), sin(newangle)) * l;
      return t;
    }

    const float feedback = 0.0;
    const float fractures = 100.0;
    const float smear = 5.0;
    const float spread = ${x}; //0.05-0.3
    const float decay = ${S}; //0.0001 - 0.02

    vec4 tx(sampler2D tx, vec2 p){
      return texture2D(tx, p);
    }

    vec4 blur(vec2 st){
        vec2 pixelSize = 1.0 / uResolution.xy * pixel;
        vec4 sum = vec4(0.0);

        float v = pixelSize.y;
        sum += texture2D(tex0, fract(vec2(st.x, st.y - 4.0*v)) ) * 0.05;
        sum += texture2D(tex0, fract(vec2(st.x, st.y - 3.0*v)) ) * 0.09;
        sum += texture2D(tex0, fract(vec2(st.x, st.y - 2.0*v)) ) * 0.12;
        sum += texture2D(tex0, fract(vec2(st.x, st.y - 1.0*v)) ) * 0.15;
        sum += texture2D(tex0, fract(vec2(st.x, st.y + 0.0*v)) ) * 0.16;
        sum += texture2D(tex0, fract(vec2(st.x, st.y + 1.0*v)) ) * 0.15;
        sum += texture2D(tex0, fract(vec2(st.x, st.y + 2.0*v)) ) * 0.12;
        sum += texture2D(tex0, fract(vec2(st.x, st.y + 3.0*v)) ) * 0.09;
        sum += texture2D(tex0, fract(vec2(st.x, st.y + 4.0*v)) ) * 0.05;

        float h = pixelSize.x;
        sum += texture2D(tex0, fract(vec2(st.x - 4.0*h, st.y)) ) * 0.05;
        sum += texture2D(tex0, fract(vec2(st.x - 3.0*h, st.y)) ) * 0.09;
        sum += texture2D(tex0, fract(vec2(st.x - 2.0*h, st.y)) ) * 0.12;
        sum += texture2D(tex0, fract(vec2(st.x - 1.0*h, st.y)) ) * 0.15;
        sum += texture2D(tex0, fract(vec2(st.x + 0.0*h, st.y)) ) * 0.16;
        sum += texture2D(tex0, fract(vec2(st.x + 1.0*h, st.y)) ) * 0.15;
        sum += texture2D(tex0, fract(vec2(st.x + 2.0*h, st.y)) ) * 0.12;
        sum += texture2D(tex0, fract(vec2(st.x + 3.0*h, st.y)) ) * 0.09;
        sum += texture2D(tex0, fract(vec2(st.x + 4.0*h, st.y)) ) * 0.05;

        sum.xyz = sum.xyz / spread;

        return sum;
    }

    void main() {
      float dotSize = 0.5 * pixel;
      vec2 pixelBin = gl_FragCoord.xy / dotSize;
      vec2 tiles = uResolution.xy / dotSize;
      vec2 vuv = floor(pixelBin) / tiles;
      vec2 uv = vuv;

      vec2 pw = 0.5 / uResolution.xy * pixel;
      float nx = fbm(${I} * uv+vec2(29. + seed, 55.0));
      float ny = fbm(${E} * uv+vec2(seed, 99.0)) + fbm(${I} * uv+vec2(99. + seed, 5.0));

      vec3 noise = texture2D(tex0, uv + vec2(nx * 0.01, ny * 0.01)).xyz;
      vec2 pwr = pw * fractures;

      vec2 lap = vec2(tx(tex0, uv + noise.xy*pwr).x - tx(tex0, uv - noise.xy*pwr).x, tx(tex0, uv + noise.yx*pwr).y - tx(tex0, uv - noise.yx*pwr).x);
      uv = uv + lap * pw;

      uv += clampAngle(vec2(nx * 0.005, ny * 0.005));

      vec2 d = pw * smear;
      vec4 dx = (blur(fract(uv + vec2(1.0,0.0)*d)) - blur(fract(uv - vec2(1.0,0.0)*d))) * 0.2;
      vec4 dy = (blur(fract(uv + vec2(0.0,1.0)*d)) - blur(fract(uv - vec2(0.0,1.0)*d))) * 0.2;
      vec2 uv_r = uv + vec2(dx.x, dy.x) * pw;
      vec2 uv_g = uv + vec2(dx.y, dy.y) * pw;
      vec2 uv_b = uv + vec2(dx.z, dy.z) * pw;

      float new_red = tx(tex0, fract(uv_r)).x + (noise.x - 0.5) * 0.0025 - decay;
      new_red += (blur(fract(uv_r + (noise.xy - 0.5) * pw)).x + tx(tex0, fract(uv_r + (noise.xy-0.5) * pw))).x * 0.000145;

      float new_green = tx(tex0, fract(uv_g)).y + (noise.y - 0.5) * 0.0025 - decay;
      new_green -= (blur(fract(uv_g + (noise.xy - 0.5) * pw)).y + tx(tex0, fract(uv_g + (noise.xy-0.5) * pw))).y * 0.000145;

      float new_blue = tx(tex0, fract(uv_b)).z + (noise.z - 0.5) * 0.0025 - decay;
      new_blue -= (blur(fract(uv_b + (noise.xy - 0.5) * pw)).z + tx(tex0, fract(uv_b + (noise.xy-0.5) * pw))).z * 0.000145;

      vec4 old = vec4(vec3(clamp(new_red, 0.0, 3.0), clamp(new_green, 0.0, 3.0), clamp(new_blue, 0.0, 3.0)), 1.0);
      vec4 incolor = texture2D(tex1, vuv);
      vec4 color = texture2D(tex1, vuv);
      vec2 flow;
      if (color.a <= 0.0) {
        incolor.rgb = old.rgb;
      }
      vec4 final = mix(vec4(color.rgb, 1.0), vec4(incolor.rgb, 1.0), 0.99);
      gl_FragColor = final;
    }`;function tr(){let g="0x";for(var _=0;_<64;_++)g+=Math.floor(Math.random()*16).toString(16);return g}let w=document.querySelector("canvas");document.body.appendChild(w);let ye=0;window.location!==window.parent.location?ye=0:ye=255,document.body.style.backgroundColor=`rgba(${f[0]*255},${f[1]*255},${f[2]*255}, ${ye})`;let nt=window.devicePixelRatio||1;w.width=Math.floor(nt*s/D)*D,w.height=Math.floor(nt*n/D)*D,w.style.padding=lt+"px",w.style.width=Math.floor(s/D)*D+"px",w.style.height=Math.floor(n/D)*D+"px";let u=w.getContext("webgl",{antialias:!1,preserveDrawingBuffer:!0,premultipliedAlpha:!1,alpha:!0});w.style.imageRendering="pixelated",w.imageSmoothingEnabled=!1;let ie,ai,oi,Qs,li,Te,H,be,Y,Xt,Ks,et=document.createElement("canvas"),Ee=et.getContext("2d",{alpha:!0,willReadFrequently:!0});et.style.imageRendering="pixelated",et.imageSmoothingEnabled=!1,et.width=720,et.height=960;let Ae=u.createTexture(),er=fi.init(w);er.doubleClick=function(){Tt=!Tt};let $=new Ot(30,90),q=[];window.addEventListener("resize",lr),document.addEventListener("keydown",dr);function ir(){nr(et.width,et.height),rr(),sr(),requestAnimationFrame(_e),console.log(`
        BASALT-RT by Galo Canizares (b. 1989)
        all rights reserved
        `)}function rr(){u.blendFunc(u.SRC_ALPHA,u.ONE_MINUS_SRC_ALPHA),u.disable(u.BLEND),u.disable(u.DEPTH_TEST),u.clearColor(1,1,1,1),u.colorMask(!0,!0,!0,!0),u.viewport(0,0,w.width,w.height)}function sr(){ie=qt(u,Qi,u.VERTEX_SHADER),ai=qt(u,Ki,u.FRAGMENT_SHADER),oi=qt(u,Ji,u.FRAGMENT_SHADER),li=qt(u,Zi,u.FRAGMENT_SHADER),Te=mi(u,ie,ai),Y=new Gt(u,ie,oi),Y.allocate(w.width,w.height),Xt=new Wt(u),Xt.allocate(w.width,w.height),H=new Gt(u,ie,li),H.allocate(w.width,w.height),be=new Wt(u),be.allocate(w.width,w.height),u.useProgram(H.pgm),u.uniform2fv(u.getUniformLocation(H.pgm,"uResolution"),[w.width,w.height]),u.useProgram(Y.pgm),u.uniform2fv(u.getUniformLocation(Y.pgm,"uResolution"),[w.width,w.height]),Me(),_e()}function nr(g,_){r=[];let y=new Bi(J,g,_,l,W,p,F);y.generatePack(),N=y.polygons.length>100?k:y.polygons.length;for(let U=0;U<y.polygons.length;U++){let X=y.polygons[U].length-1,at=[y.polygons[U][0][0]/g,y.polygons[U][0][1]/_,0],j=[y.polygons[U][Math.floor(X/4)][0]/g,y.polygons[U][Math.floor(X/4)][1]/_,0],V=[y.polygons[U][Math.floor(X/2)][0]/g,y.polygons[U][Math.floor(X/2)][1]/_,0],ft=[y.polygons[U][X][0]/g,y.polygons[U][X][1]/_,0];r.push([at,j,V,ft]),e[U]!=null&&e[U].reset([at,j,V,ft])}}function Me(){Ae.image=et,u.bindTexture(u.TEXTURE_2D,Ae),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_S,u.CLAMP_TO_EDGE),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_WRAP_T,u.CLAMP_TO_EDGE),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MIN_FILTER,u.NEAREST),u.texParameteri(u.TEXTURE_2D,u.TEXTURE_MAG_FILTER,u.NEAREST),u.pixelStorei(u.UNPACK_FLIP_Y_WEBGL,!0),u.texImage2D(u.TEXTURE_2D,0,u.RGBA,u.RGBA,u.UNSIGNED_BYTE,et)}function ar(g){let _=document.createElement("canvas");return _.width=g.width/nt,_.height=g.height/nt,_.getContext("2d").drawImage(g,0,0,_.width,_.height),_}function hi(){window.innerHeight<=window.innerWidth?(s=Math.max(window.innerHeight,1)*.75,n=Math.max(window.innerHeight,1)):(s=Math.max(window.innerWidth,1),n=Math.max(window.innerWidth,1)/.75),w.width=Math.floor(nt*s/D)*D,w.height=Math.floor(nt*n/D)*D,w.style.width=Math.floor(s/D)*D+"px",w.style.height=Math.floor(n/D)*D+"px",Me(),u.viewport(0,0,w.width,w.height),H.allocate(w.width,w.height),Xt.allocate(w.width,w.height),be.allocate(w.width,w.height),Y.allocate(w.width,w.height),u.useProgram(H.pgm),u.uniform2fv(u.getUniformLocation(H.pgm,"uResolution"),[w.width,w.height]),u.useProgram(Y.pgm),u.uniform2fv(u.getUniformLocation(Y.pgm,"uResolution"),[w.width,w.height])}function or(g,_){let y=Ee.getImageData(0,0,g.width,g.height);for(let U=0;U<y.data.length;U+=4)if(y.data[U+3]>0){let X=y.data[U+3];X=Math.max(0,X-_),y.data[U+3]=X}Ee.putImageData(y,0,0)}function lr(){hi()}function hr(){let g,_;try{let y="image/png";g=w.toDataURL(y,1),cr(g.replace(y,"image/octet-stream"),"BASALT-RT-"+o+".png")}catch(y){console.log(y);return}}function cr(g,_){let y=document.createElement("a");typeof y.download=="string"?(document.body.appendChild(y),y.download=_,y.href=g,y.click(),document.body.removeChild(y)):location.replace(uri)}function ci(g,_,y){let U=g instanceof Blob?g:new Blob([g],{type:y}),X=URL.createObjectURL(U),at=document.createElement("a");at.href=X,at.download=_,at.click()}async function ur(){let g=document.createElement("canvas");g.width=w.width/nt,g.height=w.height/nt;let _=g.getContext("2d",{willReadFrequently:!0}),y=g.cloneNode(!0).getContext("2d"),U=g.cloneNode(!0).getContext("2d"),X=new $i({target:new si,video:{codec:"avc",width:g.width,height:g.height},fastStart:"in-memory"}),at=new VideoEncoder({output:(V,ft)=>X.addVideoChunk(V,ft),error:V=>console.error(V)});at.configure({codec:"avc1.64002a",width:g.width,height:g.height,bitrate:2e7});for(let V=0;V<$.totalFrames-10;V++){if(V<10){let Bt=V/10,re=80+V;y.clearRect(0,0,g.width,g.height),y.drawImage(q[V],0,0),U.clearRect(0,0,g.width,g.height),U.globalAlpha=1-Bt,U.drawImage(q[re],0,0),_.clearRect(0,0,g.width,g.height),_.drawImage(y.canvas,0,0),_.drawImage(U.canvas,0,0),q[V]=g}let ft=new VideoFrame(q[V],{timestamp:V*1e6/30,duration:1e6/30});at.encode(ft,{keyFrame:!1}),ft.close(),await new Promise(Bt=>setTimeout(Bt,0))}await at.flush(),X.finalize();let{buffer:j}=X.target;q=[],ci(j,"BASALT-RT-"+o+".mp4",{type:"video/mp4"})}async function fr(){let g=document.createElement("canvas");g.width=w.width/nt,g.height=w.height/nt;let _=g.getContext("2d",{willReadFrequently:!0}),y=g.cloneNode(!0).getContext("2d"),U=g.cloneNode(!0).getContext("2d"),X=Mi();for(let j=0;j<$.totalFrames-10;j++){if(j<10){let Ce=j/10,mr=80+j;y.clearRect(0,0,g.width,g.height),y.drawImage(q[j],0,0),U.clearRect(0,0,g.width,g.height),U.globalAlpha=1-Ce,U.drawImage(q[mr],0,0),_.clearRect(0,0,g.width,g.height),_.drawImage(y.canvas,0,0),_.drawImage(U.canvas,0,0),q[j]=g}let ft=q[j].getContext("2d").getImageData(0,0,q[j].width,q[j].height).data,Bt="rgb444",re=Ei(ft,256,{format:Bt}),pr=Ai(ft,re,Bt);X.writeFrame(pr,q[j].width,q[j].height,{palette:re,delay:30}),await new Promise(Ce=>setTimeout(Ce,0))}X.finish(),q=[];let at=X.bytesView();ci(at,"BASALT-RT-"+o+".gif",{type:"image/gif"})}function Re(){Z=!Z,Ut=0}function dr(g){g.key==="s"&&hr(),g.key==="m"&&(ut=!1,Re()),g.key==="g"&&(ut=!0,Re()),g.key==="f"&&hi()}ir();function _e(g){if($.stepTime(g),$.delta>$.interval&&!Tt){$.updateTime(g),or(w,tt);for(let y=0;y<e.length;y++)e[y].update(et.width,et.height),e[y].render(Ee,et.width,et.height);Me(),u.useProgram(Y.pgm),u.uniform1f(u.getUniformLocation(Y.pgm,"pixel"),nt),u.uniform1f(u.getUniformLocation(Y.pgm,"uTime"),$.loopTime),u.uniform2fv(u.getUniformLocation(Y.pgm,"uResolution"),[w.width,w.height]),u.uniform1f(u.getUniformLocation(Y.pgm,"seed"),c),u.useProgram(H.pgm),u.uniform3fv(u.getUniformLocation(H.pgm,"palette"),f),u.uniform1f(u.getUniformLocation(H.pgm,"uTime"),$.loopTime),u.uniform1f(u.getUniformLocation(H.pgm,"pixel"),nt),u.uniform1f(u.getUniformLocation(H.pgm,"seed"),c),u.uniform1f(u.getUniformLocation(H.pgm,"outline"),C),u.clear(u.COLOR_BUFFER_BIT),Y.start(),u.clear(u.COLOR_BUFFER_BIT),Xt.draw2(Y.pgm,Ae),H.start(),u.clear(u.COLOR_BUFFER_BIT),Y.draw(H.pgm),Xt.start(),u.clear(u.COLOR_BUFFER_BIT),Y.draw(Te),u.bindFramebuffer(u.FRAMEBUFFER,null),H.draw(Te),Z===!0&&(q[Ut]=ar(w),Ut++,console.log(q.length),q.length==$.totalFrames&&(Re(),ut?fr():ur())),$.frameStep%3==0&&e.length<N&&(e.push(new Ci(r[mt][0],r[mt][1],r[mt][2],r[mt][3],l.random_choice([1,2,3,4,5,6,7,8]),l.random_choice(z),l.random_choice(d))),mt++),$.frameStep++,$.cycle==5&&kt==!1&&(capturePreview(),kt=!0);let _="";_+="Frame Rate: "+Math.round($.calcFPS(g))+`
`,_+="Total Time: "+Math.round($.totalTime)+`
`,_+="Frame: "+Math.round($.frameStep)+`
`,_+="Cycle: "+Math.round($.cycle)+`
`}requestAnimationFrame(_e)}}var Xn={app:$s};

//url params
let queryString = new URLSearchParams(window.location.search);
let features = {
    hash: queryString.get('hash') || vhash,
    edition: editionNumber,
    margin: queryString.get('margin'),
    outline: queryString.get('outline'),
    fade: queryString.get('fade'),
    flowType: queryString.get('flowType'),
    padding: queryString.get('padding')
}

window.addEventListener('load', function(){
  Xn.app(features);
});