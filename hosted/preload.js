(()=>{var e,t,o,n,r,i,l,u,a,s,c,p,m,d,f,v,y,b,g,h,w,R,j,S,I,k,O,P,x,T,E,A,M={932:e=>{var t=function(){var e=window;return{width:e.innerWidth,height:e.innerHeight}},o=function(){var e=t(),o=e.width,n=e.height,r=o/392,i=n/588,l=i<r;return{width:o,height:n,pixelsPerUnit:l?i:r,wide:l}};e.exports={unitsHorizontalOuter:392,unitsHorizontalOuterHalf:196,unitsHorizontalInner:328,unitsHorizontalInnerHalf:164,unitsVerticalInner:524,unitsVerticalInnerHalf:262,unitsPaddingHorizontal:32,unitsPaddingVertical:32,unitsBackgroundWidth:784,unitsBackgroundHeight:980,unitsPerEm:16,getWindowMeasurements:t,getPixelsPerUnit:o,getGridMeasurements:function(){var e=o(),t=e.width,n=e.height,r=e.pixelsPerUnit;return e.wide?{pixelsPerUnit:r,verticalFreeSpace:0,horizontalOffset:t/2-164*r,verticalOffset:32*r}:r<n/784?{pixelsPerUnit:r,verticalFreeSpace:196*r,horizontalOffset:32*r,verticalOffset:(n-720*r)/2}:{pixelsPerUnit:r,verticalFreeSpace:n-588*r,horizontalOffset:32*r,verticalOffset:32*r}}}},773:(e,t,o)=>{function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}function r(e,t,o){var r;return r=function(e,t){if("object"!=n(e)||!e)return e;var o=e[Symbol.toPrimitive];if(void 0!==o){var r=o.call(e,"string");if("object"!=n(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(t),(t="symbol"==n(r)?r:String(r))in e?Object.defineProperty(e,t,{value:o,enumerable:!0,configurable:!0,writable:!0}):e[t]=o,e}function i(e){return function(e){if(Array.isArray(e))return l(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return l(e,t);var o=Object.prototype.toString.call(e).slice(8,-1);return"Object"===o&&e.constructor&&(o=e.constructor.name),"Map"===o||"Set"===o?Array.from(e):"Arguments"===o||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(o)?l(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function l(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,n=new Array(t);o<t;o++)n[o]=e[o];return n}var u,a=o(287),s=a.dictToElement,c=a.setTimeoutBetter,p=[{url:"/fonts/Geist-Regular.otf",family:"Geist",weight:400},{url:"/fonts/Geist-Medium.otf",family:"Geist",weight:500},{url:"/fonts/Geist-Bold.otf",family:"Geist",weight:700},{url:"/fonts/Migra-Regular.otf",family:"Migra",weight:400}],m=[{url:"/bootstrap-reboot.min.css"},{url:"/style.css"},{url:"/animations.css"}],d=[{url:"/main.js"}],f={thinker1:{urlRel:"composite/chess/0.jpg"},thinker2:{urlRel:"composite/chess/0.jpg"},thinker3:{urlRel:"composite/chess/0.jpg"},dreamer1:{urlRel:"composite/balloon/0.jpg"},dreamer2:{urlRel:"composite/balloon/0.jpg"},dreamer3:{urlRel:"composite/balloon/0.jpg"},producer1:{urlRel:"composite/appliance/0.jpg"},producer2:{urlRel:"composite/appliance/0.jpg"},producer3:{urlRel:"composite/appliance/0.jpg"},disciplined1:{urlRel:"composite/bonsai/0.jpg"},disciplined2:{urlRel:"composite/bonsai/0.jpg"},disciplined3:{urlRel:"composite/bonsai/0.jpg"},innovator1:{urlRel:"composite/appliance/0.jpg"},innovator2:{urlRel:"composite/appliance/0.jpg"},innovator3:{urlRel:"composite/appliance/0.jpg"},visionary1:{urlRel:"composite/duck/0.jpg"},visionary2:{urlRel:"composite/duck/0.jpg"},visionary3:{urlRel:"composite/duck/0.jpg"},independent1:{urlRel:"composite/plane/0.jpg"},independent2:{urlRel:"composite/plane/0.jpg"},independent3:{urlRel:"composite/plane/0.jpg"},listener1:{urlRel:"composite/radio/0.jpg"},listener2:{urlRel:"composite/radio/0.jpg"},listener3:{urlRel:"composite/radio/0.jpg"}},v={thinker1:{sources:[{type:"video/webm",urlRel:"composite/chess/0.webm"},{type:"video/mp4",urlRel:"composite/chess/0.mp4"}]},thinker2:{sources:[{type:"video/webm",urlRel:"composite/chess/0.webm"},{type:"video/mp4",urlRel:"composite/chess/0.mp4"}]},thinker3:{sources:[{type:"video/webm",urlRel:"composite/chess/0.webm"},{type:"video/mp4",urlRel:"composite/chess/0.mp4"}]},dreamer1:{sources:[{type:"video/webm",urlRel:"composite/balloon/0.webm"},{type:"video/mp4",urlRel:"composite/balloon/0.mp4"}]},dreamer2:{sources:[{type:"video/webm",urlRel:"composite/balloon/0.webm"},{type:"video/mp4",urlRel:"composite/balloon/0.mp4"}]},dreamer3:{sources:[{type:"video/webm",urlRel:"composite/balloon/0.webm"},{type:"video/mp4",urlRel:"composite/balloon/0.mp4"}]},producer1:{sources:[{type:"video/webm",urlRel:"composite/appliance/0.webm"},{type:"video/mp4",urlRel:"composite/appliance/0.mp4"}]},producer2:{sources:[{type:"video/webm",urlRel:"composite/appliance/0.webm"},{type:"video/mp4",urlRel:"composite/appliance/0.mp4"}]},producer3:{sources:[{type:"video/webm",urlRel:"composite/appliance/0.webm"},{type:"video/mp4",urlRel:"composite/appliance/0.mp4"}]},disciplined1:{sources:[{type:"video/webm",urlRel:"composite/bonsai/0.webm"},{type:"video/mp4",urlRel:"composite/bonsai/0.mp4"}]},disciplined2:{sources:[{type:"video/webm",urlRel:"composite/bonsai/0.webm"},{type:"video/mp4",urlRel:"composite/bonsai/0.mp4"}]},disciplined3:{sources:[{type:"video/webm",urlRel:"composite/bonsai/0.webm"},{type:"video/mp4",urlRel:"composite/bonsai/0.mp4"}]},innovator1:{sources:[{type:"video/webm",urlRel:"composite/appliance/0.webm"},{type:"video/mp4",urlRel:"composite/appliance/0.mp4"}]},innovator2:{sources:[{type:"video/webm",urlRel:"composite/appliance/0.webm"},{type:"video/mp4",urlRel:"composite/appliance/0.mp4"}]},innovator3:{sources:[{type:"video/webm",urlRel:"composite/appliance/0.webm"},{type:"video/mp4",urlRel:"composite/appliance/0.mp4"}]},visionary1:{sources:[{type:"video/webm",urlRel:"composite/duck/0.webm"},{type:"video/mp4",urlRel:"composite/duck/0.mp4"}]},visionary2:{sources:[{type:"video/webm",urlRel:"composite/duck/0.webm"},{type:"video/mp4",urlRel:"composite/duck/0.mp4"}]},visionary3:{sources:[{type:"video/webm",urlRel:"composite/duck/0.webm"},{type:"video/mp4",urlRel:"composite/duck/0.mp4"}]},independent1:{sources:[{type:"video/webm",urlRel:"composite/plane/0.webm"},{type:"video/mp4",urlRel:"composite/plane/0.mp4"}]},independent2:{sources:[{type:"video/webm",urlRel:"composite/plane/0.webm"},{type:"video/mp4",urlRel:"composite/plane/0.mp4"}]},independent3:{sources:[{type:"video/webm",urlRel:"composite/plane/0.webm"},{type:"video/mp4",urlRel:"composite/plane/0.mp4"}]},listener1:{sources:[{type:"video/webm",urlRel:"composite/radio/0.webm"},{type:"video/mp4",urlRel:"composite/radio/0.mp4"}]},listener2:{sources:[{type:"video/webm",urlRel:"composite/radio/0.webm"},{type:"video/mp4",urlRel:"composite/radio/0.mp4"}]},listener3:{sources:[{type:"video/webm",urlRel:"composite/radio/0.webm"},{type:"video/mp4",urlRel:"composite/radio/0.mp4"}]},preReveal:{sources:[{type:"video/webm",urlRel:"background/unborn/pre-reveal.webm"},{type:"video/mp4",urlRel:"background/unborn/pre-reveal.mp4"}]},reveal:{sources:[{type:"video/webm",urlRel:"background/unborn/reveal.webm"},{type:"video/mp4",urlRel:"background/unborn/reveal.mp4"}]},sendoff:{sources:[{type:"video/webm",urlRel:"background/unborn/sendoff.webm"},{type:"video/mp4",urlRel:"background/unborn/sendoff.mp4"}]}},y={backgroundImg:{url:"/images/background.png"},compositeWorker:{url:"/composite-worker.js"},logo:{url:"/images/logo.svg"},progressStar:{url:"/images/progress-star.svg"},shuffleButton:{url:"/images/shuffle-button.svg"}},b=function(e){return e.url},g=function(e){return e.urlRel},h=function(e){return e.blob},w=function(e){return e.el},R=p.map(b),j=m.map(b),S=d.map(b),I=Object.values(f),k=Object.values(v),O=k.map((function(e){return e.sources})).flat(),P=Object.values(y),x=P.map(b),T=function(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.blob=e[b(n)]}},E=function(e){var t=e.el;t.className="hiddenVideo",t.pause(),c((function(){t.currentTime=0}),100)},A=!1;e.exports={preload:function(e){return A?null:new Promise((function(t,o){A=!0;var n=function(){A=!1,o()};fetch("/video-folder").then((function(o){return o.text().then((function(o){var l=i(new Set([].concat(i(R),i(j),i(S),i(x)))),u=Object.assign.apply(Object,[{}].concat(i(l.map((function(e){return r({},e,{})})))));Promise.all(l.map((function(t){return function(e){var t=e.url,o=e.onProgress;return new Promise((function(e,n){var r=new XMLHttpRequest;r.open("GET",t,!0),r.responseType="blob",r.onload=function(){200===r.status?e(URL.createObjectURL(r.response)):n(r.statusText)},r.onprogress=o,r.onerror=n,r.send()}))}({url:t,onProgress:function(o){u[t]=o,e(function(e){for(var t=0,o=0,n=0;n<e.length;n++){var r=e[n],i=r.loaded,l=r.total;if(null==i||null==l)return;t+=i,o+=l}return t/o*100}(Object.values(u)))}})}))).then((function(e){A=!1,t({blobs:Object.assign.apply(Object,[{}].concat(i(l.map((function(t,o){return r({},t,e[o])}))))),videoFolder:o})})).catch(n)})).catch(n)})).catch(n)}))},preloadInfoToDoc:function(e){document.head.dataset.preloadInfo=JSON.stringify(e)},preloadInfoFromDoc:function(){var e=JSON.parse(document.head.dataset.preloadInfo);return delete document.head.dataset.preloadInfo,e},assignPreloadInfoToFontsStylesScripts:function(e){var t=e.blobs;T(t,p),T(t,m),T(t,d)},fontsStylesScriptsToHead:function(){var e=document.createElement("style");e.innerHTML=p.map((function(e){return"@font-face{font-family:".concat(e.family,";font-weight:").concat(e.weight,";src:url('").concat(h(e),"')}")})).join("");for(var t=[e].concat(i(m.map((function(e){return s("link",{rel:"stylesheet",type:"text/css",href:h(e),integrity:e.integrity,crossorigin:e.crossorigin})}))),i(d.map((function(e){return s("script",{src:h(e)})})))),o=0;o<t.length;o++)document.head.appendChild(t[o])},assignPreloadInfoToVideosImagesMisc:function(e){var t=e.blobs;!function(e){for(var t=0;t<I.length;t++){var o=I[t];o.url=e+g(o)}for(var n=0;n<O.length;n++){var r=O[n];r.url=e+g(r)}}(e.videoFolder),T(t,P)},createImageVideoEls:function(){return new Promise((function(e,t){u=document.createElement("div"),document.body.appendChild(u);for(var o=0;o<k.length;o++){var n=k[o],r=n.sources,i=document.createElement("video");i.muted=!0,i.onload=function(){},i.crossOrigin="Anonymous",i.setAttribute("webkit-playsinline","webkit-playsinline"),i.setAttribute("playsinline","playsinline"),i.setAttribute("preload","auto"),i.className="hiddenVideo",i.src=void 0;for(var l=0;l<r.length;l++){var a=r[l],s=document.createElement("source");s.onload=function(){},s.crossOrigin="Anonymous",s.type=a.type,s.src=b(a),i.appendChild(s)}n.el=i,u.appendChild(i)}Promise.all(I.map((function(e){return t=b(e),new Promise((function(e,o){var n=new Image;n.onload=function(){e(n)},n.onerror=function(e){o(e)},n.crossOrigin="Anonymous",n.src=t}));var t}))).then((function(t){for(var o=0;o<I.length;o++)I[o].el=t[o];e()})).catch(t)}))},prepareVideo:function(e){var t=e.el,o=e.className,n=e.onPlaying,r=e.onEnd;return t.className=o,t.onended=r,t.loop=!r,t.onplaying=n&&function(){t.onplaying=void 0,n()},t.play(),t},hideAndRewindVideo:E,removeAndRewindVideo:function(e){E(e),u.appendChild(w(e))},images:f,videos:v,misc:y,getBlob:h,getEl:w}},287:e=>{function t(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var o=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=o){var n,r,i,l,u=[],a=!0,s=!1;try{if(i=(o=o.call(e)).next,0===t){if(Object(o)!==o)return;a=!1}else for(;!(a=(n=i.call(o)).done)&&(u.push(n.value),u.length!==t);a=!0);}catch(e){s=!0,r=e}finally{try{if(!a&&null!=o.return&&(l=o.return(),Object(l)!==l))return}finally{if(s)throw r}}return u}}(e,t)||function(e,t){if(e){if("string"==typeof e)return o(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?o(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function o(e,t){(null==t||t>e.length)&&(t=e.length);for(var o=0,n=new Array(t);o<t;o++)n[o]=e[o];return n}function n(e){return n="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},n(e)}function r(e,t){for(var o=0;o<t.length;o++){var n=t[o];n.enumerable=n.enumerable||!1,n.configurable=!0,"value"in n&&(n.writable=!0),Object.defineProperty(e,i(n.key),n)}}function i(e){var t=function(e,t){if("object"!=n(e)||!e)return e;var o=e[Symbol.toPrimitive];if(void 0!==o){var r=o.call(e,"string");if("object"!=n(r))return r;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==n(t)?t:String(t)}var l=function(){"use strict";function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.empty()}var t,o;return t=e,(o=[{key:"enqueue",value:function(e){this.items[this.backIndex]=e,this.backIndex++,this.isNotEmpty=!0}},{key:"dequeue",value:function(){if(this.isNotEmpty){var e=this.frontIndex,t=this.items[e];return delete this.items[e],this.frontIndex++,this.frontIndex===this.backIndex&&(this.isNotEmpty=!1),t}throw new RangeError}},{key:"empty",value:function(){this.items={},this.frontIndex=0,this.backIndex=0,this.isNotEmpty=!1}}])&&r(t.prototype,o),Object.defineProperty(t,"prototype",{writable:!1}),e}(),u=function(e){return"".concat(e,"px")},a=function(e){return Math.max(0,Math.min(e,1))},s=2*Math.PI,c=function(e){return 255*e},p=function(e){var t=6*e;return[Math.abs(t-3)-1,2-Math.abs(t-2),2-Math.abs(t-4)].map(a)},m=function(e,t){var o,n;return t<.5?(o=1.3*t,n=.175):(o=-1.3*t+1.3,n=1.3*t-.4750000000000001),e.map((function(e){return o*e+n}))};e.exports={Queue:l,px:u,blurPx:function(e){return"blur(".concat(u(e),")")},percent:function(e){return"".concat(arguments.length>1&&void 0!==arguments[1]&&arguments[1]?parseInt(e,10):parseFloat(e),"%")},randomInt:function(e){return Math.floor(Math.random()*e)},ensureNumber:function(e){return Number(e)||0},lerp:function(e,t,o){return e+(t-e)*o},clamp01:a,isWithin01:function(e){return e>=0&&e<=1},num01ToRadianRange:function(e){return s*e},numRadianTo01Range:function(e){return e/s},num01ToDegreeRange:function(e){return 360*e},num01ToByteRange:c,rgb01ToByteRange:function(e){return e.map(c)},colorToRGB:p,applyShadeToRGB:m,colorShadeToRGB:function(e,t){return m(p(e),t)},vectorLengthNoSqrt:function(e){return e.map((function(e){return e*e})).reduce((function(e,t){return e+t}))},dictToElement:function(e,o){for(var n=document.createElement(e),r=Object.entries(o),i=0;i<r.length;i++){var l=t(r[i],2),u=l[0],a=l[1];null!=a&&n.setAttribute(u,a)}return n},commaJoin:function(e){return e.join(", ")},square:function(e){return e*e},isMouseEvent:function(e){return e.type.startsWith("mouse")},preventChildrenFromCalling:function(e){return null!=e?function(t){t.currentTarget===t.target&&e(t)}:void 0},setIntervalWithInitialCall:function(e,t){return e(),setInterval(e,t)},setTimeoutBetter:function(e,t){var o=Date.now();!function n(){Date.now()-o<t?requestAnimationFrame(n):e()}()},starIsBorn:function(e){return e.born}}}},H={};function z(e){var t=H[e];if(void 0!==t)return t.exports;var o=H[e]={exports:{}};return M[e](o,o.exports,z),o.exports}r=z(932),i=r.getGridMeasurements,l=r.unitsHorizontalInner,u=r.unitsHorizontalInnerHalf,a=r.unitsVerticalInnerHalf,s=r.unitsPerEm,c=z(773),p=c.preload,m=c.preloadInfoToDoc,d=c.assignPreloadInfoToFontsStylesScripts,f=c.fontsStylesScriptsToHead,v=z(287),y=v.px,b=v.percent,g=v.setIntervalWithInitialCall,h=.25,w=u-36,R=a-36,j=a+52,S=a-52,I=[],k=5,O=function t(){e&&o||window.removeEventListener("resize",t);var n=i(),r=n.pixelsPerUnit,u=n.verticalFreeSpace,a=n.horizontalOffset,c=n.verticalOffset;e.style.left=y(a+r*w),e.style.top=y(c+u/2+r*R),e.style.width=y(72*r),e.style.height=y(72*r),o.style.left=y(a),o.style.top=y(c+u/2+r*j),o.style.width=y(r*l),o.style.height=y(r*S),o.style.fontSize=y(r*s)},P=function(e){null!=e&&(o.innerText=e)},x=function(e,t){e.setAttribute("opacity",t)},T=function(e){for(var t=0;t<8;t++)x(I[t],e)},E=function(){var e=(k+1)%8,t=(k+2)%8;x(I[k],h),x(I[e],.5),x(I[t],1),k=e},A=function(){k=5,clearInterval(n)},window.onload=function(){e=document.querySelector("#loadingStar"),t=e.querySelector("#center");for(var r=0;r<8;r++)I[r]=e.querySelector("#rect".concat(r));o=document.querySelector("#loadingProgress"),window.addEventListener("resize",O),O();var i=!0;x(t,1),T(h),A(),n=g(E,125),p((function(e){i&&null!=e&&P(b(e,!0))})).then((function(e){A(),x(t,1),T(1),P(b(100)),m(e),d(e),f()})).catch((function(e){i=!1,A(),x(t,h),T(h),P(null!=e?e:"Failed to load")}))}})();