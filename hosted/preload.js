(()=>{var t,e,n,r,o,i,a,u,l,c,s,f,m,d,p,y,g,v,b,h,S,w,T,O,P,j,x,z,E,M,B={932:t=>{var e=function(){var t=window;return{width:t.innerWidth,height:t.innerHeight}},n=function(){var t=e(),n=t.width,r=t.height,o=n/392,i=r/588,a=i<o;return{width:n,height:r,pixelsPerUnit:a?i:o,wide:a}};t.exports={unitsHorizontalOuter:392,unitsHorizontalOuterHalf:196,unitsHorizontalInner:328,unitsHorizontalInnerHalf:164,unitsVerticalInner:524,unitsVerticalInnerHalf:262,unitsPaddingHorizontal:32,unitsPaddingVertical:32,unitsBackgroundWidth:784,unitsBackgroundHeight:980,unitsPerEm:16,getWindowMeasurements:e,getPixelsPerUnit:n,getGridMeasurements:function(){var t=n(),e=t.width,r=t.height,o=t.pixelsPerUnit;return t.wide?{pixelsPerUnit:o,verticalFreeSpace:0,horizontalOffset:e/2-164*o,verticalOffset:32*o}:o<r/784?{pixelsPerUnit:o,verticalFreeSpace:196*o,horizontalOffset:32*o,verticalOffset:(r-720*o)/2}:{pixelsPerUnit:o,verticalFreeSpace:r-588*o,horizontalOffset:32*o,verticalOffset:32*o}}}},773:(t,e,n)=>{function r(t){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(t){return typeof t}:function(t){return t&&"function"==typeof Symbol&&t.constructor===Symbol&&t!==Symbol.prototype?"symbol":typeof t},r(t)}function o(t,e,n){var o;return o=function(t,e){if("object"!=r(t)||!t)return t;var n=t[Symbol.toPrimitive];if(void 0!==n){var o=n.call(t,"string");if("object"!=r(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(t)}(e),(e="symbol"==r(o)?o:String(o))in t?Object.defineProperty(t,e,{value:n,enumerable:!0,configurable:!0,writable:!0}):t[e]=n,t}function i(t){return function(t){if(Array.isArray(t))return a(t)}(t)||function(t){if("undefined"!=typeof Symbol&&null!=t[Symbol.iterator]||null!=t["@@iterator"])return Array.from(t)}(t)||function(t,e){if(t){if("string"==typeof t)return a(t,e);var n=Object.prototype.toString.call(t).slice(8,-1);return"Object"===n&&t.constructor&&(n=t.constructor.name),"Map"===n||"Set"===n?Array.from(t):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(t,e):void 0}}(t)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var u=n(287).dictToElement,l=[{filename:"/fonts/Geist-Regular.otf",family:"Geist",weight:400},{filename:"/fonts/Geist-Medium.otf",family:"Geist",weight:500},{filename:"/fonts/Geist-Bold.otf",family:"Geist",weight:700},{filename:"/fonts/Migra-Regular.otf",family:"Migra",weight:400}],c=[{filename:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap-reboot.min.css",integrity:"sha384-AzXcmcMInlJeZ/nwA+GR1Ta94m/H/FK4P6NcvXCVMWbzM4WyU+i1JgunGXPetEyz",crossorigin:"anonymous"},{filename:"/style.css"},{filename:"/animations.css"}],s=[{filename:"/main.js"}],f={placeholderStarVid:[{type:"video/mp4",filename:"/videos/composite/star/placeholder.mp4"}],quizBgTestStart:[{type:"video/webm",filename:"/videos/background/quiz/test-start.webm"},{type:"video/mp4",filename:"/videos/background/quiz/test-start.mp4"}],quizBgTestLoop:[{type:"video/webm",filename:"/videos/background/quiz/test-loop.webm"},{type:"video/mp4",filename:"/videos/background/quiz/test-loop.mp4"}]},m={backgroundImg:{filename:"/images/background.png"},compositeWorker:{filename:"/composite-worker.js"},logo:{filename:"/images/logo.svg"}},d=function(t){return t.filename},p=l.map(d),y=c.map(d),g=s.map(d),v=Object.values(f).flat(),b=v.map(d),h=Object.values(m),S=h.map(d),w=function(t,e){for(var n=0;n<e.length;n++){var r=e[n];r.blob=t[r.filename]}},T=!1;t.exports={preload:function(t){return T?null:new Promise((function(e,n){T=!0;var r=i(new Set([].concat(i(p),i(y),i(g),i(b),i(S)))),a=Object.assign.apply(Object,[{}].concat(i(r.map((function(t){return o({},t,{})})))));Promise.all(r.map((function(e){return r=(n={url:e,onProgress:function(n){a[e]=n,t(function(t){for(var e=0,n=0,r=0;r<t.length;r++){var o=t[r],i=o.loaded,a=o.total;if(null==i||null==a)return;e+=i,n+=a}return e/n*100}(Object.values(a)))}}).url,o=n.onProgress,new Promise((function(t,e){var n=new XMLHttpRequest;n.open("GET",r,!0),n.responseType="blob",n.onload=function(){200===n.status?t(URL.createObjectURL(n.response)):e(n.statusText)},n.onprogress=o,n.onerror=e,n.send()}));var n,r,o}))).then((function(t){e(Object.assign.apply(Object,[{}].concat(i(r.map((function(e,n){return o({},e,t[n])}))))))})).catch((function(){T=!1,n()}))}))},allBlobsToDoc:function(t){document.head.dataset.allBlobs=JSON.stringify(t)},allBlobsFromDoc:function(){var t=JSON.parse(document.head.dataset.allBlobs);return delete document.head.dataset.allBlobs,t},assignBlobSrcsToFontsStylesScripts:function(t){w(t,l),w(t,c),w(t,s)},fontsStylesScriptsToHead:function(){var t=document.createElement("style");t.innerHTML=l.map((function(t){return"@font-face{font-family:".concat(t.family,";font-weight:").concat(t.weight,";src:url('").concat(t.blob,"')}")})).join("");for(var e=[t].concat(i(c.map((function(t){return u("link",{rel:"stylesheet",type:"text/css",href:t.blob,integrity:t.integrity,crossorigin:t.crossorigin})}))),i(s.map((function(t){return u("script",{src:t.blob})})))),n=0;n<e.length;n++)document.head.appendChild(e[n])},assignBlobsToVideosMisc:function(t){w(t,v),w(t,h)},videoToEl:function(t){var e=t.video,n=t.className,r=t.onEnd;return new Promise((function(t,o){var i=document.createElement("video");i.className=n,i.muted=!0;var a=null==r;i.loop=a;for(var u=0;u<e.length;u++){var l=e[u],c=document.createElement("source");c.type=l.type,c.src=l.blob,i.appendChild(c)}i.addEventListener("canplaythrough",(function(){i.play(),t(i)})),a||i.addEventListener("ended",r),i.addEventListener("error",o)}))},videos:f,misc:m}},287:t=>{function e(t,e){return function(t){if(Array.isArray(t))return t}(t)||function(t,e){var n=null==t?null:"undefined"!=typeof Symbol&&t[Symbol.iterator]||t["@@iterator"];if(null!=n){var r,o,i,a,u=[],l=!0,c=!1;try{if(i=(n=n.call(t)).next,0===e){if(Object(n)!==n)return;l=!1}else for(;!(l=(r=i.call(n)).done)&&(u.push(r.value),u.length!==e);l=!0);}catch(t){c=!0,o=t}finally{try{if(!l&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{if(c)throw o}}return u}}(t,e)||function(t,e){if(t){if("string"==typeof t)return n(t,e);var r=Object.prototype.toString.call(t).slice(8,-1);return"Object"===r&&t.constructor&&(r=t.constructor.name),"Map"===r||"Set"===r?Array.from(t):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(t,e):void 0}}(t,e)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(t,e){(null==e||e>t.length)&&(e=t.length);for(var n=0,r=new Array(e);n<e;n++)r[n]=t[n];return r}var r=function(t){return"".concat(t,"px")},o=function(t,e,n){return t+(e-t)*n},i=function(t){return Math.max(0,Math.min(t,1))},a=2*Math.PI,u=function(t){return 255*t},l=function(t){var e=6*t;return[Math.abs(e-3)-1,2-Math.abs(e-2),2-Math.abs(e-4)].map(i)},c=function(t,e){return t.map((function(t){return o(t,e,.35)}))};t.exports={px:r,blurPx:function(t){return"blur(".concat(r(t),")")},percent:function(t){return"".concat(arguments.length>1&&void 0!==arguments[1]&&arguments[1]?parseInt(t,10):parseFloat(t),"%")},ensureNumber:function(t){return Number(t)||0},lerp:o,clamp01:i,num01ToRadianRange:function(t){return a*t},numRadianTo01Range:function(t){return t/a},num01ToDegreeRange:function(t){return 360*t},num01ToByteRange:u,rgb01ToByteRange:function(t){return t.map(u)},colorToRGB:l,applyShadeToRGB:c,colorShadeToRGB:function(t,e){return c(l(t),e)},vectorLengthNoSqrt:function(t){return t.map((function(t){return t*t})).reduce((function(t,e){return t+e}))},dictToElement:function(t,n){for(var r=document.createElement(t),o=Object.entries(n),i=0;i<o.length;i++){var a=e(o[i],2),u=a[0],l=a[1];null!=l&&r.setAttribute(u,l)}return r},commaJoin:function(t){return t.join(", ")},square:function(t){return t*t},isMouseEvent:function(t){return t.type.startsWith("mouse")},preventChildrenFromCalling:function(t){return function(e){e.currentTarget===e.target&&t(e)}},starIsBorn:function(t){return null!=t.birthDate}}}},H={};function I(t){var e=H[t];if(void 0!==e)return e.exports;var n=H[t]={exports:{}};return B[t](n,n.exports,I),n.exports}r=I(932),o=r.getGridMeasurements,i=r.unitsHorizontalInner,a=r.unitsHorizontalInnerHalf,u=r.unitsVerticalInnerHalf,l=r.unitsPerEm,c=I(773),s=c.preload,f=c.allBlobsToDoc,m=c.assignBlobSrcsToFontsStylesScripts,d=c.fontsStylesScriptsToHead,p=I(287),y=p.px,g=p.percent,v=.25,b=a-36,h=u-36,S=u+52,w=u-52,T=[],O=!1,P=function e(){t&&n||window.removeEventListener("resize",e);var r=o(),a=r.pixelsPerUnit,u=r.verticalFreeSpace,c=r.horizontalOffset,s=r.verticalOffset;t.style.left=y(c+a*b),t.style.top=y(s+u/2+a*h),t.style.width=y(72*a),t.style.height=y(72*a),n.style.left=y(c),n.style.top=y(s+u/2+a*S),n.style.width=y(a*i),n.style.height=y(a*w),n.style.fontSize=y(a*l)},j=function(t){null!=t&&(n.innerText=t)},x=function(t,e){t.setAttribute("opacity",e)},z=function(t){for(var e=0;e<8;e++)x(T[e],t)},E=function t(e){if(O){var n=(e+1)%8,r=(e+2)%8;x(T[e],v),x(T[n],.5),x(T[r],1),setTimeout((function(){return t(n)}),125)}},M=function(){O=!0,x(e,1),z(v),E(5)},window.onload=function(){t=document.querySelector("#loadingStar"),e=t.querySelector("#center");for(var r=0;r<8;r++)T[r]=t.querySelector("#rect".concat(r));n=document.querySelector("#loadingProgress"),window.addEventListener("resize",P),P();var o=!0;M(),s((function(t){o&&null!=t&&j(g(t,!0))})).then((function(t){O=!1,x(e,1),z(1),j(g(100)),f(t),m(t),d()})).catch((function(t){o=!1,O=!1,x(e,v),z(v),j(null!=t?t:"Failed to load")}))}})();