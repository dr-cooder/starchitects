(()=>{var e,t,n,r,o,i,a,u,s,l,c,f,m,p,d,y,b,h,v,g,S,w,T,x,O,j,P,I,E,z,M={932:e=>{var t=function(){var e=window;return{width:e.innerWidth,height:e.innerHeight}},n=function(){var e=t(),n=e.width,r=e.height,o=n/392,i=r/588,a=i<o;return{width:n,height:r,pixelsPerUnit:a?i:o,wide:a}};e.exports={unitsHorizontalOuter:392,unitsHorizontalOuterHalf:196,unitsHorizontalInner:328,unitsHorizontalInnerHalf:164,unitsVerticalInner:524,unitsVerticalInnerHalf:262,unitsPaddingHorizontal:32,unitsPaddingVertical:32,unitsBackgroundWidth:784,unitsBackgroundHeight:980,unitsPerEm:16,getWindowMeasurements:t,getPixelsPerUnit:n,getGridMeasurements:function(){var e=n(),t=e.width,r=e.height,o=e.pixelsPerUnit;return e.wide?{pixelsPerUnit:o,verticalFreeSpace:0,horizontalOffset:t/2-164*o,verticalOffset:32*o}:o<r/784?{pixelsPerUnit:o,verticalFreeSpace:196*o,horizontalOffset:32*o,verticalOffset:(r-720*o)/2}:{pixelsPerUnit:o,verticalFreeSpace:r-588*o,horizontalOffset:32*o,verticalOffset:32*o}}}},773:(e,t,n)=>{function r(e){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(e)}function o(e,t,n){var o;return o=function(e,t){if("object"!=r(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,"string");if("object"!=r(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(t),(t="symbol"==r(o)?o:String(o))in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function i(e){return function(e){if(Array.isArray(e))return a(e)}(e)||function(e){if("undefined"!=typeof Symbol&&null!=e[Symbol.iterator]||null!=e["@@iterator"])return Array.from(e)}(e)||function(e,t){if(e){if("string"==typeof e)return a(e,t);var n=Object.prototype.toString.call(e).slice(8,-1);return"Object"===n&&e.constructor&&(n=e.constructor.name),"Map"===n||"Set"===n?Array.from(e):"Arguments"===n||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)?a(e,t):void 0}}(e)||function(){throw new TypeError("Invalid attempt to spread non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function a(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}var u,s=n(287).dictToElement,l=[{filename:"/fonts/Geist-Regular.otf",family:"Geist",weight:400},{filename:"/fonts/Geist-Medium.otf",family:"Geist",weight:500},{filename:"/fonts/Geist-Bold.otf",family:"Geist",weight:700},{filename:"/fonts/Migra-Regular.otf",family:"Migra",weight:400}],c=[{filename:"https://cdn.jsdelivr.net/npm/bootstrap@5.3.2/dist/css/bootstrap-reboot.min.css",integrity:"sha384-AzXcmcMInlJeZ/nwA+GR1Ta94m/H/FK4P6NcvXCVMWbzM4WyU+i1JgunGXPetEyz",crossorigin:"anonymous"},{filename:"/style.css"},{filename:"/animations.css"}],f=[{filename:"/main.js"}],m={placeholderStarVid:{sources:[{type:"video/mp4",filename:"/videos/composite/placeholder.mp4"}]},quizBgTestStart:{sources:[{type:"video/webm",filename:"/videos/background/quiz/test-start.webm"},{type:"video/mp4",filename:"/videos/background/quiz/test-start.mp4"}]},quizBgTestLoop:{sources:[{type:"video/webm",filename:"/videos/background/quiz/test-loop.webm"},{type:"video/mp4",filename:"/videos/background/quiz/test-loop.mp4"}]}},p={backgroundImg:{filename:"/images/background.png"},compositeWorker:{filename:"/composite-worker.js"},logo:{filename:"/images/logo.svg"},progressStar:{filename:"/images/progress-star.svg"}},d=function(e){return e.filename},y=l.map(d),b=c.map(d),h=f.map(d),v=Object.values(m),g=v.map((function(e){return e.sources})).flat(),S=g.map(d),w=Object.values(p),T=w.map(d),x=function(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.blob=e[r.filename]}},O=!1;e.exports={preload:function(e){return O?null:new Promise((function(t,n){O=!0;var r=i(new Set([].concat(i(y),i(b),i(h),i(S),i(T)))),a=Object.assign.apply(Object,[{}].concat(i(r.map((function(e){return o({},e,{})})))));Promise.all(r.map((function(t){return r=(n={url:t,onProgress:function(n){a[t]=n,e(function(e){for(var t=0,n=0,r=0;r<e.length;r++){var o=e[r],i=o.loaded,a=o.total;if(null==i||null==a)return;t+=i,n+=a}return t/n*100}(Object.values(a)))}}).url,o=n.onProgress,new Promise((function(e,t){var n=new XMLHttpRequest;n.open("GET",r,!0),n.responseType="blob",n.onload=function(){200===n.status?e(URL.createObjectURL(n.response)):t(n.statusText)},n.onprogress=o,n.onerror=t,n.send()}));var n,r,o}))).then((function(e){t(Object.assign.apply(Object,[{}].concat(i(r.map((function(t,n){return o({},t,e[n])}))))))})).catch((function(){O=!1,n()}))}))},allBlobsToDoc:function(e){document.head.dataset.allBlobs=JSON.stringify(e)},allBlobsFromDoc:function(){var e=JSON.parse(document.head.dataset.allBlobs);return delete document.head.dataset.allBlobs,e},assignBlobSrcsToFontsStylesScripts:function(e){x(e,l),x(e,c),x(e,f)},fontsStylesScriptsToHead:function(){var e=document.createElement("style");e.innerHTML=l.map((function(e){return"@font-face{font-family:".concat(e.family,";font-weight:").concat(e.weight,";src:url('").concat(e.blob,"')}")})).join("");for(var t=[e].concat(i(c.map((function(e){return s("link",{rel:"stylesheet",type:"text/css",href:e.blob,integrity:e.integrity,crossorigin:e.crossorigin})}))),i(f.map((function(e){return s("script",{src:e.blob})})))),n=0;n<t.length;n++)document.head.appendChild(t[n])},assignBlobsToVideosMisc:function(e){x(e,g),x(e,w)},createImageVideoEls:function(){u=document.createElement("div"),document.body.appendChild(u);for(var e=0;e<v.length;e++){var t=v[e],n=t.sources,r=document.createElement("video");r.muted=!0,r.playsInline=!0,r.className="hiddenVideo";for(var o=0;o<n.length;o++){var i=n[o],a=document.createElement("source");a.type=i.type,a.src=i.blob,r.appendChild(a)}t.el=r,u.appendChild(r)}},prepareVideo:function(e){var t=e.el,n=e.className,r=e.onEnd;return t.className=n,t.onended=r,t.loop=!r,t.remove(),t.play(),t},removeAndRewindVideo:function(e){var t=e.el;t.className="hiddenVideo",u.appendChild(t),t.pause(),t.currentTime=0},videos:m,misc:p}},287:e=>{function t(e,t){return function(e){if(Array.isArray(e))return e}(e)||function(e,t){var n=null==e?null:"undefined"!=typeof Symbol&&e[Symbol.iterator]||e["@@iterator"];if(null!=n){var r,o,i,a,u=[],s=!0,l=!1;try{if(i=(n=n.call(e)).next,0===t){if(Object(n)!==n)return;s=!1}else for(;!(s=(r=i.call(n)).done)&&(u.push(r.value),u.length!==t);s=!0);}catch(e){l=!0,o=e}finally{try{if(!s&&null!=n.return&&(a=n.return(),Object(a)!==a))return}finally{if(l)throw o}}return u}}(e,t)||function(e,t){if(e){if("string"==typeof e)return n(e,t);var r=Object.prototype.toString.call(e).slice(8,-1);return"Object"===r&&e.constructor&&(r=e.constructor.name),"Map"===r||"Set"===r?Array.from(e):"Arguments"===r||/^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(r)?n(e,t):void 0}}(e,t)||function(){throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.")}()}function n(e,t){(null==t||t>e.length)&&(t=e.length);for(var n=0,r=new Array(t);n<t;n++)r[n]=e[n];return r}function r(e){return r="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e},r(e)}function o(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,i(r.key),r)}}function i(e){var t=function(e,t){if("object"!=r(e)||!e)return e;var n=e[Symbol.toPrimitive];if(void 0!==n){var o=n.call(e,"string");if("object"!=r(o))return o;throw new TypeError("@@toPrimitive must return a primitive value.")}return String(e)}(e);return"symbol"==r(t)?t:String(t)}var a=function(){"use strict";function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.empty()}var t,n;return t=e,(n=[{key:"enqueue",value:function(e){this.items[this.backIndex]=e,this.backIndex++,this.isNotEmpty=!0}},{key:"dequeue",value:function(){if(this.isNotEmpty){var e=this.frontIndex,t=this.items[e];return delete this.items[e],this.frontIndex++,this.frontIndex===this.backIndex&&(this.isNotEmpty=!1),t}throw new RangeError}},{key:"empty",value:function(){this.items={},this.frontIndex=0,this.backIndex=0,this.isNotEmpty=!1}}])&&o(t.prototype,n),Object.defineProperty(t,"prototype",{writable:!1}),e}(),u=function(e){return"".concat(e,"px")},s=function(e,t,n){return e+(t-e)*n},l=function(e){return Math.max(0,Math.min(e,1))},c=2*Math.PI,f=function(e){return 255*e},m=function(e){var t=6*e;return[Math.abs(t-3)-1,2-Math.abs(t-2),2-Math.abs(t-4)].map(l)},p=function(e,t){return e.map((function(e){return s(e,t,.35)}))};e.exports={Queue:a,px:u,blurPx:function(e){return"blur(".concat(u(e),")")},percent:function(e){return"".concat(arguments.length>1&&void 0!==arguments[1]&&arguments[1]?parseInt(e,10):parseFloat(e),"%")},ensureNumber:function(e){return Number(e)||0},lerp:s,clamp01:l,num01ToRadianRange:function(e){return c*e},numRadianTo01Range:function(e){return e/c},num01ToDegreeRange:function(e){return 360*e},num01ToByteRange:f,rgb01ToByteRange:function(e){return e.map(f)},colorToRGB:m,applyShadeToRGB:p,colorShadeToRGB:function(e,t){return p(m(e),t)},vectorLengthNoSqrt:function(e){return e.map((function(e){return e*e})).reduce((function(e,t){return e+t}))},dictToElement:function(e,n){for(var r=document.createElement(e),o=Object.entries(n),i=0;i<o.length;i++){var a=t(o[i],2),u=a[0],s=a[1];null!=s&&r.setAttribute(u,s)}return r},commaJoin:function(e){return e.join(", ")},square:function(e){return e*e},isMouseEvent:function(e){return e.type.startsWith("mouse")},preventChildrenFromCalling:function(e){return function(t){t.currentTarget===t.target&&e(t)}},starIsBorn:function(e){return null!=e.birthDate}}}},B={};function k(e){var t=B[e];if(void 0!==t)return t.exports;var n=B[e]={exports:{}};return M[e](n,n.exports,k),n.exports}r=k(932),o=r.getGridMeasurements,i=r.unitsHorizontalInner,a=r.unitsHorizontalInnerHalf,u=r.unitsVerticalInnerHalf,s=r.unitsPerEm,l=k(773),c=l.preload,f=l.allBlobsToDoc,m=l.assignBlobSrcsToFontsStylesScripts,p=l.fontsStylesScriptsToHead,d=k(287),y=d.px,b=d.percent,h=.25,v=a-36,g=u-36,S=u+52,w=u-52,T=[],x=!1,O=function t(){e&&n||window.removeEventListener("resize",t);var r=o(),a=r.pixelsPerUnit,u=r.verticalFreeSpace,l=r.horizontalOffset,c=r.verticalOffset;e.style.left=y(l+a*v),e.style.top=y(c+u/2+a*g),e.style.width=y(72*a),e.style.height=y(72*a),n.style.left=y(l),n.style.top=y(c+u/2+a*S),n.style.width=y(a*i),n.style.height=y(a*w),n.style.fontSize=y(a*s)},j=function(e){null!=e&&(n.innerText=e)},P=function(e,t){e.setAttribute("opacity",t)},I=function(e){for(var t=0;t<8;t++)P(T[t],e)},E=function e(t){if(x){var n=(t+1)%8,r=(t+2)%8;P(T[t],h),P(T[n],.5),P(T[r],1),setTimeout((function(){return e(n)}),125)}},z=function(){x=!0,P(t,1),I(h),E(5)},window.onload=function(){e=document.querySelector("#loadingStar"),t=e.querySelector("#center");for(var r=0;r<8;r++)T[r]=e.querySelector("#rect".concat(r));n=document.querySelector("#loadingProgress"),window.addEventListener("resize",O),O();var o=!0;z(),c((function(e){o&&null!=e&&j(b(e,!0))})).then((function(e){x=!1,P(t,1),I(1),j(b(100)),f(e),m(e),p()})).catch((function(e){o=!1,x=!1,P(t,h),I(h),j(null!=e?e:"Failed to load")}))}})();