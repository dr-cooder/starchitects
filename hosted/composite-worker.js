(()=>{var t,s,a,r,e,i,d,f,o={7899:t=>{var s=640,a=640,r=[0,0,s,a],e=[s,0,s,a],i=[1280,0,s,a],d=[1920,0,s,a],f=[2560,0,s,a];t.exports={alphaOffset:3,bytesPerPixel:4,vidPartWidth:s,vidPartHeight:a,vidWidth:3200,vidHeight:640,bytesPerVidPart:1638400,vidFrameDurationMs:1e3/30,basisBounds:r,starDiffBounds:e,dustDiffBounds:i,starTimesDustDiffBounds:d,alphaBounds:f,starCanvasWidth:640,starCanvasHeight:640}}},v={};t=function t(s){var a=v[s];if(void 0!==a)return a.exports;var r=v[s]={exports:{}};return o[s](r,r.exports,t),r.exports}(7899),s=t.alphaOffset,a=t.bytesPerPixel,r=t.vidPartWidth,e=t.vidPartHeight,i=t.bytesPerVidPart,d=new ImageData(r,e),f=d.data,onmessage=function(t){for(var r=t.data,e=r.starRGB,o=r.dustRGB,v=r.basisBytes,n=r.starDiffBytes,u=r.dustDiffBytes,h=r.starTimesDustDiffBytes,B=r.alphaBytes,P=[],p=0;p<s;p++)P[p]=e[p]*o[p];for(var D=0;D<i;D+=a){for(var y=0;y<s;y++){var g=D+y;f[g]=v[g]+n[g]*e[y]+u[g]*o[y]+h[g]*P[y]}f[D+s]=B[D]}postMessage(d)}})();