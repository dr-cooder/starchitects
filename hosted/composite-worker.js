(()=>{var t,r,e,n,a,i,o,u,s,c,l,f={899:t=>{var r=360,e=360,n=[0,0,r,e],a=[r,0,r,e],i=[720,0,r,e];t.exports={alphaOffset:3,bytesPerPixel:4,vidPartWidth:r,vidPartHeight:e,vidWidth:1080,vidHeight:360,bytesPerVidPart:518400,vidFrameDurationMs:1e3/30,blackBounds:n,bwDiffBounds:a,alphaBounds:i,starCanvasWidth:360,starCanvasHeight:360,starMinWidth:240,starMinHeight:240,starMinX:60,starMinY:60,starMaxWidth:320,starMaxHeight:320,starMaxX:20,starMaxY:20}},287:t=>{function r(t,r){return function(t){if(Array.isArray(t))return t}(t)||function(t,r){var e=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=e){var n,a,i,o,u=[],s=!0,c=!1;try{if(i=(e=e.call(t)).next,0===r){if(Object(e)!==e)return;s=!1}else for(;!(s=(n=i.call(e)).done)&&(u.push(n.value),u.length!==r);s=!0);}catch(t){c=!0,a=t}finally{try{if(!s&&null!=e.return&&(o=e.return(),Object(o)!==o))return}finally{if(c)throw a}}return u}}(t,r)||function(t,r){if(t){if("string"==typeof t)return e(t,r);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?e(t,r):void 0}}(t,r)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function e(t,r){(null==r||r>t.length)&&(r=t.length);for(var e=0,n=new Array(r);e<r;e++)n[e]=t[e];return n}var n=function(t,r,e){return t+(r-t)*e},a=function(t){return Math.max(0,Math.min(t,1))};t.exports={px:function(t){return"".concat(t,"px")},percent:function(t){return"".concat(parseInt(t,10),"%")},lerp:n,clamp01:a,hueToRGB:function(t){var r=6*t;return[Math.abs(r-3)-1,2-Math.abs(r-2),2-Math.abs(r-4)].map(a)},applySaturationValue:function(t,r,e){return n(1,t,r)*e},vectorLengthNoSqrt:function(t){return t.map((function(t){return t*t})).reduce((function(t,r){return t+r}))},dictToElement:function(t,e){for(var n=document.createElement(t),a=Object.entries(e),i=0;i<a.length;i++){var o=r(a[i],2),u=o[0],s=o[1];null!=s&&n.setAttribute(u,s)}return n}}}},h={};function d(t){var r=h[t];if(void 0!==r)return r.exports;var e=h[t]={exports:{}};return f[t](e,e.exports,d),e.exports}t=d(899),r=t.alphaOffset,e=t.bytesPerPixel,n=t.vidPartWidth,a=t.vidPartHeight,i=t.bytesPerVidPart,o=d(287),u=o.hueToRGB,s=o.applySaturationValue,c=new ImageData(n,a),l=c.data,onmessage=function(t){for(var n=t.data,a=n.color,o=n.shade,f=n.blackBytes,h=n.bwDiffBytes,d=n.alphaBytes,p=function(t,r){var e=2*r*Math.PI,n=.75+.25*Math.cos(e),a=.75+.25*Math.sin(e);return u(t).map((function(t){return s(t,n,a)}))}(a,o),v=0;v<i;v+=e){for(var y=0;y<r;y++){var b=v+y;l[b]=f[b]+h[b]*p[y]}l[v+r]=d[v]}postMessage(c)}})();