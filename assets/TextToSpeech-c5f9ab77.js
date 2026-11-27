var Bf=(s,i,r)=>{if(!i.has(s))throw TypeError("Cannot "+r)};var mt=(s,i,r)=>(Bf(s,i,"read from private field"),r?r.call(s):i.get(s)),cs=(s,i,r)=>{if(i.has(s))throw TypeError("Cannot add the same private member more than once");i instanceof WeakSet?i.add(s):i.set(s,r)},ps=(s,i,r,o)=>(Bf(s,i,"write to private field"),o?o.call(s,r):i.set(s,r),r);import{s as jt,d as go,c as dt,b as Te,e as ze,f as de,t as je,g as st,F as Ft,j as Gn,_ as _o,l as Z0,n as J0,p as Nm,h as Um,i as X0,r as Ce,u as Y0,x as Q0,k as tn,v as ki,q as e_,y as Lf,z as Nf,A as Ma,m as t_,B as n_}from"./index-1d506c20.js";import{g as i_}from"./_commonjsHelpers-de833af9.js";import{c as jn}from"./_commonjs-dynamic-modules-302442b1.js";function s_(s,i){for(var r=0;r<i.length;r++){const o=i[r];if(typeof o!="string"&&!Array.isArray(o)){for(const p in o)if(p!=="default"&&!(p in s)){const m=Object.getOwnPropertyDescriptor(o,p);m&&Object.defineProperty(s,p,m.get?m:{enumerable:!0,get:()=>o[p]})}}}return Object.freeze(Object.defineProperty(s,Symbol.toStringTag,{value:"Module"}))}const Uf=new Set(["int64","uint64"]);class r_{constructor({ort:i,gpu:r}){this._ort=i,this._gpu=r,this.currentProvider=null}async createSession(i){const r=this._gpu?["webgpu","wasm"]:["wasm"],o=[];for(const p of r)try{const m={executionProviders:[p],graphOptimizationLevel:"extended",enableMemPattern:!0},y=await this._ort.InferenceSession.create(i,m);if(p==="webgpu"&&this._hasUnsupportedDtypes(y)){console.warn("[piper-plus] Model uses int64 tensors unsupported by WebGPU (WGSL has no i64). Falling back to WASM execution provider."),typeof y.release=="function"&&await y.release(),o.push("webgpu: model uses int64 tensors (unsupported by WGSL)");continue}return this.currentProvider=p,y}catch(m){o.push(`${typeof p=="string"?p:p.name}: ${(m==null?void 0:m.message)??String(m)}`)}throw new Error(`All execution providers failed: ${o.join("; ")}`)}_hasUnsupportedDtypes(i){var r;try{const o=i.inputNames;if(!o)return!1;for(const m of o){const y=(r=i.inputMetadata)==null?void 0:r[m];if(y&&Uf.has(y.dataType))return!0}const p=i.handler||i._handler;if(p!=null&&p.inputTypes){for(const m of p.inputTypes)if(Uf.has(m))return!0}}catch{}return!1}async checkGPUCapacity(i){if(!this._gpu)return!1;const r=await this._gpu.requestAdapter();if(!r)return!1;const o=await r.requestDevice();try{return o.limits.maxBufferSize>=i&&o.limits.maxStorageBufferBindingSize>=i}finally{o.destroy()}}}const a_=/(?:Mr|Dr|Mrs|Ms|Prof|Sr|Jr|St|Mt|Inc|Ltd|Corp|Co|vs|etc|Vol|Dept|Est|approx|Gen|Gov|Sgt|Cpl|Pvt|Capt|Lt|Col|Maj|Rev|Ph\.D)\./gi,o_=Object.freeze(["e.g.","i.e."]),Ff=s=>s>="0"&&s<="9"||s>="０"&&s<="９",u_=s=>/^[0-9A-Za-z]$/.test(s);function l_(s,i){if(s[i]!=="."&&s[i]!=="．")return!1;if(i>0&&i+1<s.length&&Ff(s[i-1])&&Ff(s[i+1]))return!0;for(const r of o_)for(let o=0;o<r.length;o++){if(r[o]!==".")continue;const p=i-o,m=p+r.length;if(!(p<0||m>s.length)&&s.slice(p,m).replace(/[A-Z]/g,y=>y.toLowerCase())===r&&(p===0||!u_(s[p-1])))return!0}return!1}class Ms{static split(i,r){return i?r==="ja"?Ms._splitJapanese(i):Ms._splitEnglish(i):[]}static _splitJapanese(i){const r=[];let o="";for(let p=0;p<i.length;p++)o+=i[p],"。！？!?".includes(i[p])&&(r.push(o),o="");return o&&r.push(o),r}static _splitEnglish(i){const r="\0",o=i.replace(a_,(y,$)=>y.slice(0,-1)+r),p=[];let m="";for(let y=0;y<o.length;y++)m+=o[y],".!?".includes(o[y])&&!l_(i,y)&&(p.push(m.replaceAll(r,".")),m="");return m&&p.push(m.replaceAll(r,".")),p.map((y,$)=>$===0?y:y.trimStart()).filter(y=>y.length>0)}}class d_{constructor({phonemize:i,synthesize:r,onAudioChunk:o}){if(typeof i!="function")throw new TypeError("phonemize must be a function");if(typeof r!="function")throw new TypeError("synthesize must be a function");if(typeof o!="function")throw new TypeError("onAudioChunk must be a function");this._phonemize=i,this._synthesize=r,this._onAudioChunk=o}async synthesizeAndPlay(i,r){const o=Ms.split(i,r);if(o.length===0)return;let p=await this._phonemize(o[0]);for(let m=0;m<o.length;m++){const y=p,$=this._synthesize(y),w=m+1<o.length?this._phonemize(o[m+1]):Promise.resolve(null),[I,R]=await Promise.all([$,w]);this._onAudioChunk(I),p=R}}}const c_="piper-plus-models",rn="models",an="dictionaries",p_=2,h_="https://huggingface.co/api/models",Qa="https://huggingface.co",f_="e9860701a941db02149c7cfbe19cfb578c235c5e25020f1f592131d9b3b30f84",m_=Object.freeze([Object.freeze({key:"ja_JP-tsukuyomi-chan-medium",repoId:"ayousanz/piper-plus-tsukuyomi-chan",onnxFile:"tsukuyomi-chan-6lang-fp16.onnx",configFile:"config.json",aliases:Object.freeze(["tsukuyomi","tsukuyomi-chan","ja-tsukuyomi","ayousanz/piper-plus-tsukuyomi-chan"])}),Object.freeze({key:"ja_JP-css10-6lang-medium",repoId:"ayousanz/piper-plus-css10-ja-6lang",onnxFile:"css10-ja-6lang-fp16.onnx",configFile:"config.json",aliases:Object.freeze(["css10","css10-6lang","css10-ja","ja-css10","ayousanz/piper-plus-css10-ja-6lang"])}),Object.freeze({key:"multilingual-zero-shot-base-zs-v1",repoId:"ayousanz/piper-plus-base",revision:"3620ed788667cb76f08bd6cf2db8152c1f4c8bd1",onnxFile:"releases/zs-v1/base.onnx",configFile:"releases/zs-v1/base.onnx.json",sha256:f_,aliases:Object.freeze(["base","zero-shot-base-zs-v1","ayousanz/piper-plus-base"])})]),Fm=new Map(m_.flatMap(s=>[s.key,...s.aliases].map(i=>[i,s])));function g_(s){const i=`${Qa}/${s.repoId}/resolve/${s.revision??"main"}/`,r=i+s.onnxFile,o={modelUrl:r,configUrl:i+s.configFile,configFallbackUrl:null,cacheKey:s.revision?r:s.repoId};return s.sha256&&(o.sha256=s.sha256),o}const __=[{repoId:"ayousanz/piper-plus-tsukuyomi-chan",names:["ja_JP-tsukuyomi-chan-medium","tsukuyomi","tsukuyomi-chan","ja-tsukuyomi"],lines:Object.freeze(["[piper-plus] つくよみちゃんモデルの利用条件 / Terms for the Tsukuyomi-chan model","生成した音声を使うときは「Piper Plus:つくよみちゃん」のクレジット表記が必須です。","Credit 'Piper Plus:つくよみちゃん' is required when you use the generated audio.","非公式の作品です。夢前黎様は開発・サポートに携わっていません。お問い合わせは開発者へ。","Unofficial work. Rei Yumesaki is not involved in development or support; contact the developer.","禁止事項と規約 / Terms and prohibited uses: https://huggingface.co/ayousanz/piper-plus-tsukuyomi-chan"]),files:["tsukuyomi-chan-6lang-fp16.onnx","tsukuyomi.onnx"]}],y_="(この表示は PIPER_PLUS_DISABLE_MODEL_NOTICE=1 で消せます / Set PIPER_PLUS_DISABLE_MODEL_NOTICE=1 to hide this notice.)",w_="PIPER_PLUS_DISABLE_MODEL_NOTICE",b_=/^[a-z][a-z0-9+.-]*:\/\//i;let Wf=!1;function eo(s){var m;if(typeof s!="string"||s==="")return null;const i=b_.test(s);let r=s;i&&(r=r.split(/[?#]/,1)[0]);const o=r.split(/[/\\]/),p=o[o.length-1];for(const y of __)if(s===y.repoId||y.names.includes(s)||((m=Fm.get(s))==null?void 0:m.repoId)===y.repoId||i&&s.includes(`/${y.repoId}/`)||y.files.includes(p))return y.lines;return null}function $_(s=(i=>(i=globalThis.process)==null?void 0:i.env)()){const r=s==null?void 0:s[w_];return typeof r!="string"?!1:["1","true","yes"].includes(r.trim().toLowerCase())}function Wm(s,i={}){return!s||s.length===0||Wf||i.showModelNotice===!1||$_()?!1:(Wf=!0,(i.logger??(o=>console.warn(o)))([...s,y_].join(`
`)),!0)}function v_(s){return new Promise((i,r)=>{const o=globalThis.indexedDB.open(s,p_);o.onupgradeneeded=p=>{const m=p.target.result;m.objectStoreNames.contains(rn)||m.createObjectStore(rn),m.objectStoreNames.contains(an)||m.createObjectStore(an)},o.onsuccess=()=>i(o.result),o.onerror=()=>r(o.error)})}function Vn(s){return new Promise((i,r)=>{s.onsuccess=()=>i(s.result),s.onerror=()=>r(s.error)})}async function jf(s,i){const r=await fetch(s);if(!r.ok)throw new Error(`Failed to fetch ${s}: ${r.status} ${r.statusText}`);if(!i||!r.body)return r.arrayBuffer();const o=r.headers.get("Content-Length"),p=o?parseInt(o,10):0,m=r.body.getReader(),y=[];let $=0;for(;;){const{done:R,value:z}=await m.read();if(R)break;y.push(z),$+=z.byteLength;const M=p>0?Math.round($/p*100):0;i({loaded:$,total:p,percentage:M})}const w=new Uint8Array($);let I=0;for(const R of y)w.set(R,I),I+=R.byteLength;return w.buffer}async function x_(s){const i=`${h_}/${s}`,r=await fetch(i);if(!r.ok)throw new Error(`Failed to query HuggingFace API for "${s}": ${r.status} ${r.statusText}`);const m=((await r.json()).siblings||[]).map(M=>M.rfilename),y=m.filter(M=>M.endsWith(".onnx"));if(y.length===0)throw new Error(`No .onnx file found in repository "${s}"`);const w=y.find(M=>M.includes("fp16"))||y[0],I=`${w}.json`,R=w.slice(0,w.lastIndexOf("/")+1)+"config.json";let z;if(m.includes(I))z=I;else if(m.includes(R))z=R;else throw new Error(`No config file found in repository "${s}"; expected "${I}" or "${R}"`);return{onnxFilename:w,configFilename:z}}class E_{constructor(i={}){this._dbName=i.cachePrefix||c_,this._db=null,this._verifyOnCacheHit=i.verifyOnCacheHit||!1,this._showModelNotice=i.showModelNotice!==!1}async _getDb(){return this._db||(this._db=await v_(this._dbName)),this._db}async _computeSha256(i){if(typeof globalThis.crypto>"u"||!globalThis.crypto.subtle||typeof globalThis.crypto.subtle.digest!="function")return null;try{const r=await globalThis.crypto.subtle.digest("SHA-256",i),o=new Uint8Array(r);return Array.from(o).map(p=>p.toString(16).padStart(2,"0")).join("")}catch{return null}}async _resolveUrls(i){const r=await this._resolveLocations(i);return r.notice=eo(i)??eo(r.modelUrl),r}async _resolveLocations(i){const r=Fm.get(i);if(r)return g_(r);if(/^https?:\/\//i.test(i)){const w=i,I=w+".json",R=w.lastIndexOf("/"),z=R>=0?w.substring(0,R+1)+"config.json":null;return{modelUrl:w,configUrl:I,configFallbackUrl:z,cacheKey:w}}const o=i,{onnxFilename:p,configFilename:m}=await x_(o),y=`${Qa}/${o}/resolve/main/${p}`,$=`${Qa}/${o}/resolve/main/${m}`;return{modelUrl:y,configUrl:$,configFallbackUrl:null,cacheKey:o}}async resolveUrls(i){return this._resolveUrls(i)}async loadModel(i,r={}){const{onProgress:o}=r,{modelUrl:p,configUrl:m,configFallbackUrl:y,cacheKey:$,notice:w,sha256:I}=await this._resolveUrls(i);Wm(w,{showModelNotice:this._showModelNotice});const R=await this.getFromCache($);if(R)return{...R,notice:w};let z=await fetch(m);if(z.status===404&&y&&(z=await fetch(y)),!z.ok){const he=y?`${m} and ${y}`:m;throw new Error(`Failed to fetch model config from ${he}: ${z.status} ${z.statusText}`)}const M=await z.json(),D=await jf(p,o),j=await this._computeSha256(D);if(j===null)console.warn("[piper-plus] crypto.subtle unavailable — skipping SHA-256 integrity verification. Serve over HTTPS for full integrity checks.");else{const he=I??M.sha256;if(he&&j!==he)throw new Error(`SHA-256 mismatch for downloaded model: expected ${he}, got ${j}`)}const J=(await this._getDb()).transaction(rn,"readwrite").objectStore(rn);return await Vn(J.put({modelData:D,config:M,timestamp:Date.now(),sha256:j},$)),{modelData:D,config:M,notice:w}}async getFromCache(i){const p=(await this._getDb()).transaction(rn,"readonly").objectStore(rn),m=await Vn(p.get(i));if(!m)return null;if(this._verifyOnCacheHit&&m.sha256){const y=await this._computeSha256(m.modelData);if(y!==null&&y!==m.sha256)return console.warn(`[piper-plus] Cached model "${i}" failed SHA-256 integrity check (expected ${m.sha256}, got ${y}). Re-downloading.`),null}return{modelData:m.modelData,config:m.config}}async getDictionaryFromCache(i){const p=(await this._getDb()).transaction(an,"readonly").objectStore(an),m=await Vn(p.get(i));return m?m.data:null}async cacheDictionary(i,r){const m=(await this._getDb()).transaction(an,"readwrite").objectStore(an);await Vn(m.put({data:r,timestamp:Date.now()},i))}async fetchAndCacheDictionary(i,r,o={}){const p=await this.getDictionaryFromCache(r);if(p)return p;const m=await jf(i,o.onProgress);return await this.cacheDictionary(r,m),m}async clearCache(){const r=(await this._getDb()).transaction([rn,an],"readwrite");await Vn(r.objectStore(rn).clear()),await Vn(r.objectStore(an).clear())}}let Si=null;function k_(){if(!Si){const s=globalThis.AudioContext||globalThis.webkitAudioContext;if(!s)throw new Error("AudioContext is not available in this environment");Si=new s}return Si.state==="suspended"&&Si.resume().catch(s=>{typeof console<"u"&&console.warn&&console.warn("[piper-plus] AudioContext.resume() failed:",s)}),Si}function S_(s,i){const m=s.length*2,y=44,$=new ArrayBuffer(y+m),w=new DataView($);hs(w,0,"RIFF"),w.setUint32(4,36+m,!0),hs(w,8,"WAVE"),hs(w,12,"fmt "),w.setUint32(16,16,!0),w.setUint16(20,1,!0),w.setUint16(22,1,!0),w.setUint32(24,i,!0),w.setUint32(28,i*1*2,!0),w.setUint16(32,1*2,!0),w.setUint16(34,16,!0),hs(w,36,"data"),w.setUint32(40,m,!0);const I=y;for(let R=0;R<s.length;R++){const z=Math.max(-1,Math.min(1,s[R])),M=z<0?z*32768:z*32767;w.setInt16(I+R*2,M,!0)}return $}function hs(s,i,r){for(let o=0;o<r.length;o++)s.setUint8(i+o,r.charCodeAt(o))}function I_(s){if(s&&Array.isArray(s.phonemes)){for(const i of s.phonemes)Object.freeze(i);Object.freeze(s.phonemes)}return Object.freeze(s)}var Wt,un,Yn;class ks{constructor(i,r=22050,o=null){cs(this,Wt,void 0);cs(this,un,void 0);cs(this,Yn,void 0);if(!(i instanceof Float32Array))throw new TypeError("samples must be a Float32Array");if(typeof r!="number"||r<=0)throw new TypeError("sampleRate must be a positive number");ps(this,Wt,i),ps(this,un,r),ps(this,Yn,o!=null?I_(o):null)}get samples(){return mt(this,Wt)}get sampleRate(){return mt(this,un)}get duration(){return mt(this,Wt).length/mt(this,un)}get timing(){return mt(this,Yn)}get hasTimingInfo(){return mt(this,Yn)!=null}async play(){const i=k_(),r=i.createBuffer(1,mt(this,Wt).length,mt(this,un));r.copyToChannel(mt(this,Wt),0);const o=i.createBufferSource();return o.buffer=r,o.connect(i.destination),new Promise(p=>{o.onended=()=>p(),o.start()})}toBlob(){const i=this.toWav();return new Blob([i],{type:"audio/wav"})}toWav(){return S_(mt(this,Wt),mt(this,un))}download(i="output.wav"){const r=this.toBlob(),o=URL.createObjectURL(r),p=document.createElement("a");p.href=o,p.download=i,p.style.display="none",document.body.appendChild(p),p.click(),setTimeout(()=>{document.body.removeChild(p),URL.revokeObjectURL(o)},100)}}Wt=new WeakMap,un=new WeakMap,Yn=new WeakMap;const Vf=16e3,Zn=80,Ct=400,qf=160,Mn=512,T_=.97,A_=20,z_=11920928955078125e-23,C_={lowpassFilterWidth:64,rolloff:.9475937167399596,beta:14.769656459379492};function O_(s,i){for(;i;)[s,i]=[i,s%i];return s}function Gf(s){const i=s*s/4;let r=1,o=1;for(let p=1;r>o*1e-17;p++)r*=i/(p*p),o+=r;return o}const Hf=new Map;function M_(s,i){const r=`${s}:${i}`,o=Hf.get(r);if(o)return o;const{lowpassFilterWidth:p,rolloff:m,beta:y}=C_,$=Math.min(s,i)*m,w=Math.ceil(p*s/$),I=2*w+s,R=$/s,z=Gf(y),M=new Float64Array(i*I);for(let j=0;j<i;j++)for(let G=0;G<I;G++){let K=(-j/i+(G-w)/s)*$;K=Math.max(-p,Math.min(p,K));const J=K/p,he=Gf(y*Math.sqrt(1-J*J))/z,ce=K*Math.PI;M[j*I+G]=(ce===0?1:Math.sin(ce)/ce)*he*R}const D={kernel:M,width:w,taps:I};return Hf.set(r,D),D}function R_(s,i,r){for(const M of[i,r])if(!Number.isInteger(M)||M<=0)throw new RangeError(`sample rate must be a positive integer, got ${M}`);if(i===r)return s;const o=O_(i,r),p=i/o,m=r/o,{kernel:y,width:$,taps:w}=M_(p,m),I=s.length,R=Math.ceil(m*I/p),z=new Float32Array(R);for(let M=0;M<R;M++){const D=Math.floor(M/m),j=M-D*m,G=D*p-$,K=j*w,J=Math.max(0,-G),he=Math.min(w,I-G);let ce=0;for(let be=J;be<he;be++)ce+=s[G+be]*y[K+be];z[M]=ce}return z}function Ra(s){return 1127*Math.log(1+s/700)}let fs=null,ms=null,Pa=null;function P_(){if(!fs){fs=new Float64Array(Ct);for(let s=0;s<Ct;s++){const i=.5-.5*Math.cos(2*Math.PI*s/(Ct-1));fs[s]=Math.pow(i,.85)}}return fs}function D_(){if(!ms){const s=Mn/2,i=Vf/Mn,r=Ra(A_),p=(Ra(Vf/2)-r)/(Zn+1);ms=new Float64Array(Zn*s);for(let m=0;m<Zn;m++){const y=r+m*p,$=r+(m+1)*p,w=r+(m+2)*p;for(let I=0;I<s;I++){const R=Ra(i*I),z=(R-y)/($-y),M=(w-R)/(w-$);ms[m*s+I]=Math.max(0,Math.min(z,M))}}}return ms}function B_(){if(!Pa){const s=Mn,i=Math.log2(s),r=new Uint16Array(s);for(let m=0;m<s;m++){let y=0;for(let $=0;$<i;$++)y=y<<1|m>>$&1;r[m]=y}const o=new Float64Array(s/2),p=new Float64Array(s/2);for(let m=0;m<s/2;m++)o[m]=Math.cos(2*Math.PI*m/s),p[m]=-Math.sin(2*Math.PI*m/s);Pa={reverse:r,cos:o,sin:p}}return Pa}function L_(s,i){const r=Mn,{reverse:o,cos:p,sin:m}=B_();for(let y=0;y<r;y++){const $=o[y];$>y&&([s[y],s[$]]=[s[$],s[y]],[i[y],i[$]]=[i[$],i[y]])}for(let y=2;y<=r;y<<=1){const $=y>>1,w=r/y;for(let I=0;I<r;I+=y)for(let R=0;R<$;R++){const z=p[R*w],M=m[R*w],D=I+R,j=D+$,G=s[j]*z-i[j]*M,K=s[j]*M+i[j]*z;s[j]=s[D]-G,i[j]=i[D]-K,s[D]+=G,i[D]+=K}}}function N_(s){const i=s.length>=Ct?1+Math.floor((s.length-Ct)/qf):0,r=Mn/2,o=P_(),p=D_(),m=new Float32Array(i*Zn),y=new Float64Array(Ct),$=new Float64Array(Mn),w=new Float64Array(Mn),I=new Float64Array(r);for(let R=0;R<i;R++){const z=R*qf;let M=0;for(let D=0;D<Ct;D++)y[D]=s[z+D],M+=y[D];M/=Ct;for(let D=0;D<Ct;D++)y[D]-=M;$.fill(0),w.fill(0);for(let D=Ct-1;D>=0;D--){const j=D>0?y[D-1]:y[0];$[D]=(y[D]-T_*j)*o[D]}L_($,w);for(let D=0;D<r;D++)I[D]=$[D]*$[D]+w[D]*w[D];for(let D=0;D<Zn;D++){let j=0;const G=D*r;for(let K=0;K<r;K++)j+=p[G+K]*I[K];m[R*Zn+D]=Math.log(Math.max(j,z_))}}return m}const Ai=16e3,on=400,Kf=160,nt=80,U_=20,F_=7600,W_=new Set(["mel","kaldi-fbank"]);class yo{constructor(){this._session=null,this._ort=null,this._frontEnd="mel"}static async initialize(i={}){const r=new yo,o=i.ort||globalThis.ort;if(!o)throw new Error("onnxruntime-web is required. Pass it via options.ort or load it globally.");r._ort=o;const p=i.frontEnd??"mel";if(!W_.has(p))throw new Error(`options.frontEnd must be "mel" or "kaldi-fbank", got ${p}`);r._frontEnd=p;const m=i.modelData??i.modelUrl;if(!m)throw new Error("options.modelUrl or options.modelData is required for SpeakerEncoder");return r._session=await o.InferenceSession.create(m,{executionProviders:["wasm"],graphOptimizationLevel:p==="kaldi-fbank"?"disabled":"all"}),r}async encode(i,r){if(!this._session)throw new Error("SpeakerEncoder not initialized. Call SpeakerEncoder.initialize() first.");let o,p;if(typeof AudioBuffer<"u"&&i instanceof AudioBuffer)o=i.getChannelData(0),p=i.sampleRate;else if(i instanceof Float32Array)o=i,p=r||Ai;else throw new TypeError("audio must be an AudioBuffer or Float32Array");if(o.length===0)throw new Error("Audio samples cannot be empty");const m=this._frontEnd==="kaldi-fbank";let y=o;p!==Ai&&(y=m?R_(o,p,Ai):q_(o,p,Ai));const $=m?j_(N_(y)):G_(y),w=$.length/nt;if(w===0)throw new Error("Audio is too short for mel spectrogram computation");const I=this._ort,R=new I.Tensor("float32",$,[1,w,nt]),z=this._session.inputNames&&this._session.inputNames[0]||"feats",M=await this._session.run({[z]:R}),D=M.output||M[Object.keys(M)[0]],j=new Float32Array(D.data);return m?V_(j):j}dispose(){this._session&&(typeof this._session.release=="function"&&this._session.release(),this._session=null),this._ort=null}}function j_(s){const i=s.length/nt;for(let r=0;r<nt;r++){let o=0;for(let m=0;m<i;m++)o+=s[m*nt+r];const p=o/i;for(let m=0;m<i;m++)s[m*nt+r]-=p}return s}function V_(s){let i=0;for(const o of s)i+=o*o;const r=Math.sqrt(i);if(!Number.isFinite(r)||r===0)throw new Error("Speaker encoder returned a zero or non-finite embedding");return s.map(o=>o/r)}function q_(s,i,r){if(i===r)return s;const o=i/r,p=Math.ceil(s.length/o),m=new Float32Array(p);for(let y=0;y<p;y++){const $=y*o,w=Math.floor($),I=$-w;w+1<s.length?m[y]=s[w]*(1-I)+s[w+1]*I:w<s.length&&(m[y]=s[w])}return m}const Q=Math.fround;function G_(s){const i=K_(),r=H_(on),o=s.length>=on?Math.floor((s.length-on)/Kf)+1:0,p=Math.floor(on/2)+1,m=new Float32Array(o*nt);for(let y=0;y<o;y++){const $=y*Kf,w=new Float32Array(p);for(let I=0;I<p;I++){let R=Q(0),z=Q(0);const M=Q(Q(-2*Math.PI)*Q(I)/Q(on));for(let D=0;D<on;D++){const j=$+D<s.length?Q(Q(s[$+D])*Q(r[D])):Q(0),G=Q(M*Q(D));R=Q(R+Q(j*Q(Math.cos(G)))),z=Q(z+Q(j*Q(Math.sin(G))))}w[I]=Q(Q(R*R)+Q(z*z))}for(let I=0;I<nt;I++){let R=Q(0);for(let z=0;z<p;z++)R=Q(R+Q(i[I*p+z]*w[z]));m[y*nt+I]=Q(Math.log(Math.max(Q(R),1e-10)))}}if(o>0)for(let y=0;y<nt;y++){let $=Q(0);for(let I=0;I<o;I++)$=Q($+m[I*nt+y]);const w=Q($/Q(o));for(let I=0;I<o;I++)m[I*nt+y]=Q(m[I*nt+y]-w)}return m}function H_(s){const i=new Float32Array(s);for(let r=0;r<s;r++)i[r]=Q(Q(.5)*Q(1-Math.cos(Q(2*Math.PI)*Q(r)/Q(s))));return i}function K_(){const s=Math.floor(on/2)+1,i=new Float32Array(nt*s),r=Zf(Q(U_)),o=Zf(Q(F_)),p=[];for(let y=0;y<=nt+1;y++)p.push(Q(r+Q(Q(o-r)*Q(y)/Q(nt+1))));const m=p.map(y=>Q(Q(Z_(y))*Q(on)/Q(Ai)));for(let y=0;y<nt;y++){const $=Math.floor(m[y]);let w=Math.floor(m[y+1]),I=Math.floor(m[y+2]);$===w&&w===I?(w=Math.min(w+1,s-1),I=Math.min(I+2,s-1)):$===w&&(w=Math.min(w+1,s-1)),w===I&&(I=Math.min(I+1,s-1));for(let R=$;R<w;R++)w>$&&(i[y*s+R]=Q(Q(R-$)/Q(w-$)));for(let R=w;R<I;R++)I>w&&(i[y*s+R]=Q(Q(I-R)/Q(I-w)));w<s&&(i[y*s+w]=Math.max(i[y*s+w],1))}return i}function Zf(s){return Q(Q(2595)*Q(Math.log10(Q(1+Q(s)/Q(700)))))}function Z_(s){return Q(Q(700)*Q(Math.pow(10,Q(s)/Q(2595))-1))}function J_(s){const i=new Set(s.inputNames||[]),r=(m,y,$)=>{if(!i.has(m))return null;if(!Array.isArray(s.inputMetadata))throw new Error("ONNX inputMetadata is required for speaker inputs; use onnxruntime-web >=1.22.0.");const w=s.inputMetadata.find(R=>R.name===m);if(!w)throw new Error(`${m}: missing ONNX input metadata.`);if(w.isTensor===!1||w.type!==y||!Array.isArray(w.shape)||!$.includes(w.shape.length))throw new Error(`${m}: expected ${y} tensor of rank ${$.join(" or ")}.`);const I=w.shape[0];if(I!==1&&typeof I!="string")throw new Error(`${m}: only batch size 1 is supported; declared ${I}.`);return{shape:[...w.shape]}},o=r("speaker_embedding","float32",[2]);if(o){const m=o.shape[1];if(typeof m!="string"&&(!Number.isSafeInteger(m)||m<=0))throw new Error(`speaker_embedding: invalid declared dimension ${m}.`)}const p=r("speaker_embedding_mask","int64",[1,2]);if(p&&p.shape.length===2&&p.shape[1]!==1)throw new Error("speaker_embedding_mask: expected shape [batch, 1].");return{embedding:o,mask:p}}function Jf(s,i,r){const o=r!=null,{embedding:p,mask:m}=i;if(o&&!(r instanceof Float32Array))throw new TypeError("speaker_embedding must be a Float32Array.");if(o&&!p)throw new Error("speaker_embedding is not an input of the loaded model.");const y={};if(p){const $=p.shape[1],w=typeof $=="string";if(!o&&w)throw new Error("speaker_embedding has a dynamic dimension; provide an explicit speakerEmbedding.");const I=w?r.length:$;if(o&&(r.length===0||r.length!==I))throw new Error(`speaker_embedding: expected ${I} values, got ${r.length}.`);if(o&&!r.every(Number.isFinite))throw new Error("speaker_embedding must contain only finite values.");y.speaker_embedding=new s.Tensor("float32",o?r:new Float32Array(I),[1,I])}return m&&(y.speaker_embedding_mask=new s.Tensor("int64",new BigInt64Array([o?1n:0n]),m.shape.length===1?[1]:[1,1])),y}const X_={"a:":"","i:":"","u:":"","e:":"","o:":"",cl:"",ky:"",kw:"",gy:"",gw:"",sh:"",ch:"",ts:"",ny:"",hy:"",my:"",ry:"",ty:"",dy:"",by:"",py:"",N_m:"",N_n:"",N_ng:"",N_uvular:""},Y_=/-([^-+]+)\+/,Q_=/\/A:([\d-]+)\+/,Xf=/\+([0-9]+)\+/,ey=/\+([0-9]+)\//,ty=new Set(["_","#","[","]","^","$","?","?!","?.","?~"]);function ny(s){const i=[];for(let r=0;r<s.length;r++){if(s[r]!=="N"){i.push(s[r]);continue}let o=null;for(let p=r+1;p<s.length;p++)if(!ty.has(s[p])){o=s[p];break}o===null?i.push("N_uvular"):["m","my","b","by","p","py"].includes(o)?i.push("N_m"):["n","ny","t","ty","d","dy","ts","ch"].includes(o)?i.push("N_n"):["k","ky","kw","g","gy","gw"].includes(o)?i.push("N_ng"):i.push("N_uvular")}return i}function iy(s){return s.map(i=>X_[i]||i)}function sy(s){const i=s.split(`
`).filter(y=>y.trim()),r=[],o=[];for(let y=0;y<i.length;y++){const $=i[y],w=$.match(Y_);if(!w)continue;const I=w[1];if(I==="sil"){y===0?(r.push("^"),o.push(null)):y===i.length-1&&(r.push("$"),o.push(null));continue}if(I==="pau"){r.push("_"),o.push(null);continue}const R=$.match(Q_),z=$.match(Xf),M=$.match(ey);let D=null,j=null,G=null;if(R&&z&&M&&(D=parseInt(R[1],10),j=parseInt(z[1],10),G=parseInt(M[1],10)),r.push(I),o.push(D!==null?{a1:D,a2:j,a3:G}:null),D===null)continue;let K=-1;if(y<i.length-1){const J=i[y+1].match(Xf);J&&(K=parseInt(J[1],10))}D===0&&K===j+1&&(r.push("]"),o.push(null)),j===G&&K===1&&(r.push("#"),o.push(null)),j===1&&K===2&&(r.push("["),o.push(null))}const p=ny(r);return{tokens:iy(p),prosody:o}}const ry=/[\u000B\u000C\u0085]/g,ay=/[\u0000-\u0008\u000E-\u001F\u007F-\u0084\u0086-\u009F]/g;function Ve(s){return typeof s!="string"?s:s.replace(ry," ").replace(ay,"")}const Yf=["char.bin","matrix.bin","sys.dic","unk.dic","left-id.def","pos-id.def","rewrite.def","right-id.def"];class oy{constructor(i={}){this._openjtalkModule=i.openjtalkModule||null,this._jaDict=i.jaDict||null,this._initialized=!1}get initialized(){return this._initialized}async initialize(i={}){const r=this._openjtalkModule||i.openjtalkModule,o=this._jaDict||i.jaDict;if(!r)throw new Error("openjtalkModule is required. Pass it via new JapaneseG2P({ openjtalkModule }) or initialize({ openjtalkModule }).");this._openjtalkModule=r,o&&this._loadDict(o);const p=r.allocateUTF8("/dict"),m=r._openjtalk_initialize(p);if(r._free(p),m!==0)throw new Error(`OpenJTalk initialization failed with code: ${m}`);this._initialized=!0}phonemize(i){i=Ve(i);const{tokens:r}=this._synthesizeLabelsAndExtract(i);return{tokens:r,prosody:r.map(()=>null)}}phonemizeWithProsody(i){return i=Ve(i),this._synthesizeLabelsAndExtract(i)}dispose(){this._openjtalkModule&&this._openjtalkModule._openjtalk_clear&&this._openjtalkModule._openjtalk_clear(),this._initialized=!1}_synthesizeLabelsAndExtract(i){if(!this._initialized)throw new Error("JapaneseG2P is not initialized. Call initialize() first.");const r=this._openjtalkModule,o=r.allocateUTF8(i),p=r._openjtalk_synthesis_labels(o),m=r.UTF8ToString(p);if(r._openjtalk_free_string(p),r._free(o),m.startsWith("ERROR:"))throw new Error(`OpenJTalk synthesis failed: ${m}`);return sy(m)}_loadDict(i){const r=this._openjtalkModule,o=i.dictFiles||i.dictData;if(!o)throw new Error("jaDict must have { dictFiles: { [filename]: ArrayBuffer } }.");const p=Yf.filter(m=>!(o[m]instanceof ArrayBuffer));if(p.length>0)throw new Error(`Missing required dictionary files: ${p.join(", ")}. All 8 OpenJTalk dictionary files must be provided.`);try{r.FS.mkdir("/dict")}catch{}for(const m of Yf)r.FS.writeFile(`/dict/${m}`,new Uint8Array(o[m]))}}let ln=null,gs=null;const uy="../../data/cmudict_data.json";function wo(s){if(s instanceof Map)return s;if(!s||typeof s!="object")throw new TypeError("CMU dictionary must be an object mapping words to ARPAbet strings");const i=new Map;for(const[r,o]of Object.entries(s))typeof o=="string"&&i.set(r,o);return i}function jm(){return ln?Promise.resolve(ln):(gs||(gs=jt(()=>import("./cmudict_data-eedadc10.js"),[],import.meta.url).then(s=>(ln??(ln=wo(s.default)),ln),s=>{throw gs=null,s})),gs)}function ly(){var o;if(ln)return ln;const s=(o=globalThis.process)==null?void 0:o.getBuiltinModule;if(typeof s!="function")return null;let i;try{i=new URL(uy,import.meta.url)}catch{return null}const r=s.call(globalThis.process,"node:fs");return i.protocol!=="file:"||!r||typeof r.readFileSync!="function"?null:(ln=wo(JSON.parse(r.readFileSync(i,"utf8"))),ln)}const dy=/([0-9][0-9,]+[0-9])/g,cy=/£([0-9,]*[0-9]+)/g,py=/\$([0-9.,]*[0-9]+)/g,hy=/([0-9]+\.[0-9]+)/g,fy=/[0-9]+(st|nd|rd|th)/g,my=/[0-9]+/g,gy=/\s+,/g,_y=/, (\S+)\s+$/,yy=/\s+/g,js=["","one","two","three","four","five","six","seven","eight","nine"],wy=["ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],by=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"],Qn=[" "," thousand"," million"," billion"," trillion"," quadrillion"," quintillion"],$y=["zero","one","two","three","four","five","six","seven","eight","nine"],vy=[["ty","tieth"],["one","first"],["two","second"],["three","third"],["five","fifth"],["eight","eighth"],["nine","ninth"],["twelve","twelfth"]];function xy(s){let i=s.replace(dy,(r,o)=>o.replace(/,/g,""));return i=i.replace(cy,"$1 pounds"),i=i.replace(py,(r,o)=>Ey(o)),i=i.replace(hy,(r,o)=>o.replace(/\./g," point ")),i=i.replace(fy,r=>ky(r)),i.replace(my,r=>Sy(r))}function Rs(s){const i=s.replace(/[^0-9]/g,"").replace(/^0+/,"");return i===""?"0":i}function Ey(s){const i=s.split(".");if(i.length>2)return`${s} dollars`;const r=Rs(i[0]??""),o=Rs(i[1]??""),p=r==="1"?"dollar":"dollars",m=o==="1"?"cent":"cents";return r!=="0"&&o!=="0"?`${r} ${p}, ${o} ${m}`:r!=="0"?`${r} ${p}`:o!=="0"?`${o} ${m}`:"zero dollars"}function ky(s){return Ay(Ps(Rs(s.slice(0,-2)),"and"))}function Sy(s){const i=Rs(s);if(i.length===4){const r=Number(i);if(r>1e3&&r<3e3)return Iy(r)}return Ps(i,"")}function Iy(s){if(s===2e3)return"two thousand";if(s>2e3&&s<2010)return`two thousand ${Ps(String(s%100),"and")}`;if(s%100===0)return`${Ps(String(s/100),"and")} hundred`;const i=s%100,r=i<10?`oh ${js[i]}`:Ri(Math.floor(i/10),i%10,0).trimEnd(),o=Math.floor(s/100);return`${Ri(Math.floor(o/10),o%10,0).trimEnd()} ${r}`}function Ri(s,i,r){if(s===1)return`${wy[i]}${Qn[r]}`;const o=s>0&&i>0?"-":"";return`${by[s]}${o}${js[i]}${Qn[r]}`}function Ty(s,i,r,o,p){if(s>0){const m=i>0||r>0?` ${p} `:"";return`${js[s]} hundred${m}${Ri(i,r,0)}${Qn[o]}, `}return i>0||r>0?`${Ri(i,r,0)}${Qn[o]}, `:""}function Ps(s,i){if(s==="0")return"zero";if(s==="1")return"one";const r=[...s].map(y=>y.charCodeAt(0)-48);if(r.length>3*Qn.length)return r.map(y=>$y[y]).join(" ");const o=Math.floor(r.length/3),p=r.length%3;let m="";p===2?m+=`${Ri(r[0],r[1],o)}, `:p===1&&(m+=`${js[r[0]]}${Qn[o]}, `);for(let y=0;y<o;y++){const $=p+3*y;m+=Ty(r[$],r[$+1],r[$+2],o-1-y,i)}return m.endsWith(", ")&&(m=m.slice(0,-2)),m=m.replace(gy,","),m=m.replace(_y,(y,$)=>` ${i} ${$}`),m.replace(yy," ").trim()}function Ay(s){for(const[i,r]of vy)if(s.endsWith(i))return s.slice(0,-i.length)+r;return`${s}th`}const zy="AAAAAA-CEEEEIIII-NOOOOO--UUUUY--aaaaaa-ceeeeiiii-nooooo--uuuuy-yAaAaAaCcCcCcCcDd--EeEeEeEeEeGgGgGgGgHh--IiIiIiIiI---JjKk-LlLlLl----NnNnNn---OoOoOo--RrRrRrSsSsSsSsTtTt--UuUuUuUuUuUuWwYyYZzZzZz---------------------------------Oo-------------Uu----------------------------AaIiOoUuUuUuUuUu-AaAa----GgKkOoOo--j---Gg--NnAa----AaAaEeEeIiIiOoOoRrRrUuUuSsTt--Hh------AaEeOoOoOoOoYy----------------------------",Cy="AaBbBbBbCcDdDdDdDdDdEeEeEeEeEeFfGgHhHhHhHhHhIiIiKkKkKkLlLlLlLlMmMmMmNnNnNnNnOoOoOoOoPpPpRrRrRrRrSsSsSsSsSsTtTtTtTtUuUuUuUuUuVvVvWwWwWwWwWwXxXxYyZzZzZzhtwy------AaAaAaAaAaAaAaAaAaAaAaAaEeEeEeEeEeEeEeEeIiIiOoOoOoOoOoOoOoOoOoOoOoOoUuUuUuUuUuUuUuYyYyYyYy------",Oy=/^[\t\n\v\f\r \u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]$/,My=/^[A-Za-z '.,?!-]$/;function Ry(s){let i="-";return s>=192&&s<=591?i=zy[s-192]??"-":s>=7680&&s<=7935?i=Cy[s-7680]??"-":s===8490?i="K":s===8491&&(i="A"),i==="-"?null:i}function Py(s){let i="";for(const r of s){let o=r;if(Oy.test(r))o=" ";else{const p=r.codePointAt(0)??0;p>127&&(o=Ry(p)??"")}o&&My.test(o)&&(i+=o)}return i}function Jn(s){return s>="a"&&s<="z"||s>="A"&&s<="Z"}function Dy(s){return Jn(s)||s>="0"&&s<="9"}function By(s){let i="",r=0;for(;r<s.length;){const o=s[r];let p=r+1;for(;p<s.length&&s[p]===o;)p++;i+=o.repeat(Dy(o)?p-r:Math.min(p-r,3)),r=p}return i}function to(s,i){let r=i;for(;r<s.length&&Jn(s[r]);)r++;return r}function Ly(s,i){let r=to(s,i);if(r===i)return null;const o=[];for(;r+1<s.length&&(s[r]==="."||s[r]==="-")&&Jn(s[r+1]);){const p=to(s,r+1);o.push([s[r],r+1,p]),r=p}for(let p=Math.min(o.length-1,126);p>=0;p--){const[m,y,$]=o[p];if(m==="."&&$-y>=2&&$-y<=13)return $}return null}function Ny(s,i){if(!Jn(s[i]))return null;let r=i+1;for(;r<s.length&&(Jn(s[r])||s[r]==="'"||s[r]==="-");)r++;for(let o=r-1;o>=i+2;o--)if(Jn(s[o]))return o+1;return null}function Uy(s,i){if(s[i]!==".")return null;let r=null,o=i+1;for(;;){let p=o;for(;p<s.length&&s[p]===" ";)p++;if(p<s.length&&s[p]===".")r=p+1,o=p+1;else return r}}function Fy(s){const i=By(s),r=[];let o=0;for(;o<i.length;){if(i[o]===" "){o++;continue}let p=Ly(i,o)??Ny(i,o);if(p===null){const m=to(i,o);p=m>o?m:Uy(i,o)??o+1}r.push(i.slice(o,p)),o=p}return r}function Wy(s){let i=Py(xy(s));return i=i.replace(/i\.e\./gi,"that is"),i=i.replace(/e\.g\./gi,"for example"),Fy(i)}const Qf={AA:"ɑ",AE:"æ",AH:"ʌ",AO:"ɔː",AW:"aʊ",AY:"aɪ",B:"b",CH:"tʃ",D:"d",DH:"ð",EH:"ɛ",ER:"ɚ",EY:"eɪ",F:"f",G:"ɡ",HH:"h",IH:"ɪ",IY:"iː",JH:"dʒ",K:"k",L:"l",M:"m",N:"n",NG:"ŋ",OW:"oʊ",OY:"ɔɪ",P:"p",R:"ɹ",S:"s",SH:"ʃ",T:"t",TH:"θ",UH:"ʊ",UW:"uː",V:"v",W:"w",Y:"j",Z:"z",ZH:"ʒ"},jy="ə",Vy=new Set([",",".",";",":","!","?"]),qy=new Set(["a","an","the","i","me","my","mine","myself","you","your","yours","yourself","he","him","his","himself","she","her","hers","herself","it","its","itself","we","us","our","ours","ourselves","they","them","their","theirs","themselves","am","is","are","was","were","be","been","being","have","has","had","having","do","does","did","will","would","shall","should","can","could","may","might","must","at","by","for","from","in","of","on","to","with","about","after","before","between","into","through","under","and","but","or","nor","so","yet","if","that","than","when","while","as","because","since","not","no"]);function Gy(s){return(s.match(/[a-zA-Z']+/g)??[]).map(i=>i.toLowerCase())}function Hy(s){return s.length===1&&Vy.has(s)}const Ky=new Map([["a","EY1"],["b","B IY1"],["c","S IY1"],["d","D IY1"],["e","IY1"],["f","EH1 F"],["g","JH IY1"],["h","EY1 CH"],["i","AY1"],["j","JH EY1"],["k","K EY1"],["l","EH1 L"],["m","EH1 M"],["n","EH1 N"],["o","OW1"],["p","P IY1"],["q","K Y UW1"],["r","AA1 R"],["s","EH1 S"],["t","T IY1"],["u","Y UW1"],["v","V IY1"],["w","D AH1 B AH0 L Y UW0"],["x","EH1 K S"],["y","W AY1"],["z","Z IY1"]]);function em(s){return s>="A"&&s<="Z"}function _s(s){return s>="a"&&s<="z"}function Zy(s){const i=(p,m)=>{let y=p;for(;y<s.length&&m(s[y]);)y++;return y},r=[];let o=0;for(;o<s.length;)if(em(s[o])){const p=i(o,em),m=p<s.length&&_s(s[p]);if(m&&p-o>=2)r.push(s.slice(o,p-1)),o=p-1;else if(m){const y=i(p,_s);r.push(s.slice(o,y)),o=y}else r.push(s.slice(o,p)),o=p}else if(_s(s[o])){const p=i(o,_s);r.push(s.slice(o,p)),o=p}else o++;return r}function Jy(s){return s.split(/\s+/).filter(i=>i).map(i=>{const r=i[i.length-1];return i.length>1&&(r==="0"||r==="1"||r==="2")?[i.slice(0,-1),Number(r)]:[i,-1]})}function Xy(s){const i=[];let r=0;for(;r<s.length;){const[o,p]=s[r],m=s[r+1];if(o==="AA"&&m&&m[0]==="R"&&m[1]===-1){i.push(["ɑːɹ",p]),r+=2;continue}o==="ER"&&p===1?i.push(["ɜː",p]):o==="AH"&&p===0?i.push([jy,p]):Object.hasOwn(Qf,o)&&i.push([Qf[o],p]),r+=1}return i}function Yy(s,i){const r=s.length,o=(m,y)=>{const $=i.get(m);return $===void 0?null:`${$} ${y}`},p=m=>m.length>=2&&m[m.length-1]===m[m.length-2];if(r>4&&s.endsWith("ing")){const m=s.slice(0,-3),y=o(m,"IH0 NG")??(p(m)?o(m.slice(0,-1),"IH0 NG"):null)??o(`${m}e`,"IH0 NG");if(y!==null)return y}if(r>3&&s.endsWith("ed")){const m=s.slice(0,-2),y=o(m,"D")??(p(m)?o(m.slice(0,-1),"D"):null)??o(s.slice(0,-1),"D");if(y!==null)return y}if(r>2&&s.endsWith("s")){const m=(r>4&&s.endsWith("ies")?o(`${s.slice(0,-3)}y`,"Z"):null)??(r>3&&s.endsWith("es")?o(s.slice(0,-2),"IH0 Z"):null)??o(s.slice(0,-1),"Z");if(m!==null)return m}if(r>3&&s.endsWith("er")){const m=s.slice(0,-2),y=o(m,"ER0")??(p(m)?o(m.slice(0,-1),"ER0"):null);if(y!==null)return y}if(r>3&&s.endsWith("ly")){const m=o(s.slice(0,-2),"L IY0")??(r>4&&s[r-3]==="i"?o(`${s.slice(0,-3)}y`,"L IY0"):null);if(m!==null)return m}return r>4&&s.endsWith("est")?o(s.slice(0,-3),"AH0 S T"):null}const Qy="EnglishG2P: the CMU dictionary is not loaded. Call `await englishG2P.initialize()` (EnglishG2P.create() and G2P.create() do this) before phonemizing, or pass a preloaded dictionary as `new EnglishG2P({ cmuDict })`.";class bo{constructor(i={}){this._options=i,this._dict=i.cmuDict?wo(i.cmuDict):null}static async create(i={}){const r=new bo(i);return await r.initialize(),r}async initialize(){return this._dict||(this._dict=await jm()),this}get isInitialized(){return this._dict!==null}_requireDict(){if(!this._dict&&(this._dict=ly(),!this._dict))throw new Error(Qy);return this._dict}_lookup(i){const r=this._requireDict(),o=i.toLowerCase();return r.get(o)??Yy(o,r)}_wordArpabet(i){const r=this._lookup(i);if(r!==null)return r;const o=y=>{const $=y.map(w=>this._wordArpabet(w)).filter(w=>w!==null);return $.length>0?$.join(" "):null};if(i.includes("-")||i.includes("."))return o(i.split(/[-.]/).filter(y=>y));if(i.includes("'"))return this._wordArpabet(i.replace(/'/g,""));const p=Zy(i);if(p.length>1)return o(p);const m=[...i.toLowerCase()].map(y=>Ky.get(y)).filter(y=>y!==void 0);return m.length>0?m.join(" "):null}_phonemize(i){const r=[],o=[];if(!i||typeof i!="string")return{tokens:r,prosody:o};const p=Wy(i),m=Gy(i);let y=!1,$=0;for(const w of p){const I=Hy(w);let R;if(/[A-Za-z]/.test(w)){const M=this._wordArpabet(w);if(M===null)continue;R=Xy(Jy(M))}else R=[[w,-1]];I||($<m.length&&(qy.has(m[$])&&(R=R.map(([M,D])=>[M,D>=1?0:D])),$+=1),y&&(r.push(" "),o.push({a1:0,a2:0,a3:0})));const z=R.reduce((M,[D])=>M+[...D].length,0);for(const[M,D]of R){const j=D===1?2:D===2?1:0;D===1?(r.push("ˈ"),o.push({a1:0,a2:j,a3:z})):D===2&&(r.push("ˌ"),o.push({a1:0,a2:j,a3:z}));for(const G of M)r.push(G),o.push({a1:0,a2:j,a3:z})}y=!0}return{tokens:r,prosody:o}}phonemize(i){i=Ve(i);const{tokens:r}=this._phonemize(i);return{tokens:r,prosody:new Array(r.length).fill(null)}}phonemizeWithProsody(i){return i=Ve(i),this._phonemize(i)}}class tm{constructor(i,r){this._single=i,this._phrases=r}lookupChar(i){const r=String(i);if(!Object.hasOwn(this._single,r))return null;let o=this._single[r];return Array.isArray(o)&&(o=o[0]),typeof o!="string"||o===""?null:o.split(",")[0]}lookupPhrase(i){if(!Object.hasOwn(this._phrases,i))return null;const r=this._phrases[i];let o=[];if(typeof r=="string")o=r.split(/\s+/).filter(p=>p!=="");else if(Array.isArray(r))for(const p of r)typeof p=="string"?o.push(p):Array.isArray(p)&&typeof p[0]=="string"&&o.push(p[0]);return o.length>0?o:null}}function nm(s,i){let r=s;if(typeof r=="string"?r=JSON.parse(r):(r instanceof Uint8Array||r instanceof ArrayBuffer)&&(r=JSON.parse(new TextDecoder().decode(r))),r===null||typeof r!="object"||Array.isArray(r))throw new TypeError(`pinyinDict.${i} must be a JSON object (or its JSON text)`);return r}function Ds(s){if(s instanceof tm)return s;if(s===null||typeof s!="object")throw new TypeError("pinyinDict must be { single, phrases }");return new tm(nm(s.single,"single"),nm(s.phrases,"phrases"))}let ys=null,im=null;function Vm(){return ys||(ys=Promise.all([jt(()=>import("./pinyin_single-ac3a3825.js"),[],import.meta.url),jt(()=>import("./pinyin_phrases-3f3ff634.js"),[],import.meta.url)]).then(([s,i])=>(im=Ds({single:s.default,phrases:i.default}),im),s=>{throw ys=null,new Error(`@piper-plus/g2p: failed to load the bundled pinyin dictionaries (data/pinyin_single.json, data/pinyin_phrases.json): ${(s==null?void 0:s.message)??s}. Pass pinyinDict to G2P.create() / ChineseG2P, or leave "zh" out of languages.`,{cause:s})})),ys}const ew=new Map([["b","p"],["p","pʰ"],["m","m"],["f","f"],["d","t"],["t","tʰ"],["n","n"],["l","l"],["g","k"],["k","kʰ"],["h","x"],["j","tɕ"],["q","tɕʰ"],["x","ɕ"],["zh","tʂ"],["ch","tʂʰ"],["sh","ʂ"],["r","ɻ"],["z","ts"],["c","tsʰ"],["s","s"]]),sm=new Map([["a","a"],["o","o"],["e","ɤ"],["i","i"],["u","u"],["ü","y_vowel"],["v","y_vowel"],["ai","aɪ"],["ei","eɪ"],["ao","aʊ"],["ou","oʊ"],["an","an"],["en","ən"],["ang","aŋ"],["eng","əŋ"],["ong","uŋ"],["er","ɚ"],["ia","ia"],["ie","iɛ"],["iao","iaʊ"],["iu","iou"],["iou","iou"],["ian","iɛn"],["in","in"],["iang","iaŋ"],["ing","iŋ"],["iong","iuŋ"],["ua","ua"],["uo","uo"],["uai","uaɪ"],["ui","ueɪ"],["uei","ueɪ"],["uan","uan"],["un","uən"],["uen","uən"],["uang","uaŋ"],["ueng","uəŋ"],["üe","yɛ"],["ve","yɛ"],["üan","yɛn"],["van","yɛn"],["ün","yn"],["vn","yn"],["-i_retroflex","ɻ̩"],["-i_alveolar","ɨ"]]),tw=["zh","ch","sh","b","p","m","f","d","t","n","l","g","k","h","j","q","x","r","z","c","s"],nw=new Set(["zh","ch","sh","r"]),iw=new Set(["z","c","s"]),qm=new Map([["。","."],["，",","],["！","!"],["？","?"],["、",","],["；",";"],["：",":"],["…","."],["—",","],["“",'"'],["”",'"'],["‘","'"],["’","'"]]),sw=new Set([",",".",";",":","!","?",...qm.keys()]),rw=/^\p{White_Space}$/u,aw=/^\p{Alphabetic}$/u,ow=/^[0-9]$/;function Gm(s){return s>=19968&&s<=40959||s>=13312&&s<=19903}function no(s){const i=s.replaceAll("v","ü");if(i.startsWith("yu"))return`ü${i.slice(2)}`;if(i.startsWith("y")){const r=i.slice(1);return r.startsWith("i")?r:`i${r}`}if(i.startsWith("w")){const r=i.slice(1);return r.startsWith("u")?r:`u${r}`}return i}function uw(s){for(const i of tw)if(s.startsWith(i)){let r=s.slice(i.length);if(r==="i"){if(nw.has(i))return[i,"-i_retroflex"];if(iw.has(i))return[i,"-i_alveolar"]}return(i==="j"||i==="q"||i==="x")&&r.startsWith("u")&&(r=`ü${r.slice(1)}`),[i,r]}return["",s]}function Hm(s,i){const[r,o]=uw(s),p=[];if(r!==""){const m=ew.get(r);m!==void 0&&p.push(m)}if(o!==""){const m=sm.get(o);if(m!==void 0)p.push(m);else for(const y of o)y>="a"&&y<="z"&&p.push(sm.get(y)??y)}return i>=1&&i<=5&&p.push(`tone${i}`),p}function io(s){const i=s.charCodeAt(s.length-1);return i>=49&&i<=53?[s.slice(0,-1),i-48]:[s,5]}function lw(s){for(let i=0;i+1<s.length;i++){const r=s[i].tone,o=s[i+1].tone;if(r===3&&o===3){s[i].tone=2;continue}if(s[i].syllable==="i"&&r===1){o===4?s[i].tone=2:o>=1&&o<=3&&(s[i].tone=4);continue}s[i].syllable==="bu"&&r===4&&o===4&&(s[i].tone=2)}}function dw(s){const i=new Map;let r=[];const o=()=>{r.forEach((p,m)=>i.set(p,[m+1,r.length])),r=[]};return s.forEach((p,m)=>{Gm(p.codePointAt(0))?r.push(m):r.length>0&&o()}),r.length>0&&o(),i}function cw(s,i){const r=[];let o=0;for(;o<s.length;){if(!Gm(s[o].codePointAt(0))){r.push({isChinese:!1,syllable:"",tone:0}),o++;continue}let p=!1;for(let y=Math.min(s.length-o,8);y>=2;y--){const $=i.lookupPhrase(s.slice(o,o+y).join(""));if($){for(let w=0;w<y;w++){const[I,R]=w<$.length?io($[w]):["",5];r.push({isChinese:!0,syllable:no(I),tone:R})}o+=y,p=!0;break}}if(p)continue;const m=i.lookupChar(s[o].codePointAt(0));if(m!==null){const[y,$]=io(m);r.push({isChinese:!0,syllable:no(y),tone:$})}else r.push({isChinese:!1,syllable:"",tone:0});o++}return r}function pw(s){let i=0;for(;i<s.length;){if(!s[i].isChinese){i++;continue}const r=i;for(;i<s.length&&s[i].isChinese;)i++;i-r>=2&&lw(s.slice(r,i))}}function hw(s,i){const r=Array.from(s),o=dw(r),p=cw(r,i);pw(p);const m=[],y=[];return p.forEach(($,w)=>{const I=r[w];if(!$.isChinese){const G=qm.get(I);G!==void 0?(m.push(G),y.push(null)):sw.has(I)?(m.push(I),y.push(null)):rw.test(I)?(m.push(" "),y.push({a1:0,a2:0,a3:0})):(ow.test(I)||aw.test(I))&&(m.push(I),y.push({a1:0,a2:0,a3:1}));return}let R=$.syllable;const z=R.length>1&&R!=="er"&&R.endsWith("r");z&&(R=R.slice(0,-1));const M=Hm(R,$.tone);z&&M.length>0&&(M[M.length-1].startsWith("tone")?M.splice(M.length-1,0,"ɚ"):M.push("ɚ"));const[D,j]=o.get(w)??[1,1];for(const G of M)m.push(G),y.push({a1:$.tone,a2:D,a3:j})}),{tokens:m,prosody:y}}function fw(s){const i=[],r=[];for(const o of s){const[p,m]=io(o);for(const y of Hm(no(p),m))i.push(y),r.push({a1:m,a2:1,a3:1})}return{tokens:i,prosody:r}}const mw=1,gw="ZH-EN code-switching loanword dictionary. Maps English acronyms, loanwords, and individual letters to Mandarin pinyin syllables for phonemization in Chinese-context mixed text.",_w={license:"MIT",schema:"Each entry maps a token to a list of pinyin syllables with tone numbers (e.g. 'ji4' = tone 4). letter_fallback covers A-Z for tokens not in acronyms or loanwords. All pinyin syllables MUST use standard Mandarin pinyin so that phonemize_from_pinyin_syllables can convert them to IPA without errors.",lookup_priority:"case-sensitive loanwords -> uppercase acronyms -> letter_fallback (char by char on uppercased text)"},yw={GPS:["ji4","pi4","ai1","si4"],USB:["you1","ai1","si4","bi4"],CPU:["si4","pi4","you1"],GPU:["ji4","pi4","you1"],AI:["ei1","ai4"],API:["ei1","pi4","ai4"],URL:["you1","a4","er2","ai1","er2"],SDK:["ai1","si4","di4","kei4"],HTML:["ai1","chi4","ti4","ai1","mu5","ai1","er2"],CSS:["si4","ai1","si4","ai1","si4"],JS:["jie4","ai1","si4"],CSV:["si4","ai1","si4","wei1"],PDF:["pi4","di4","ai1","fu2"],XML:["ai4","ke4","si1","ai1","mu5","ai1","er2"],SQL:["ai1","si4","kiu1","ai1","er2"],UI:["you1","ai4"],UX:["you1","ai4","ke4","si1"],DNS:["di4","en1","ai1","si4"],IP:["ai4","pi4"],TCP:["ti4","si4","pi4"],UDP:["you1","di4","pi4"],SSH:["ai1","si4","ai1","si4","ai1","chi4"],SSL:["ai1","si4","ai1","si4","ai1","er2"],TLS:["ti4","ai1","er2","ai1","si4"],VPN:["wei1","pi4","en1"],NPC:["en1","pi4","si4"],RPG:["a4","er2","pi4","ji4"],FPS:["ai1","fu2","pi4","ai1","si4"],CEO:["si4","yi1","ou1"],CFO:["si4","ai1","fu2","ou1"],CTO:["si4","ti4","ou1"],COO:["si4","ou1","ou1"],PR:["pi4","a4","er2"],HR:["ai1","chi4","a4","er2"],KPI:["kei4","pi4","ai4"],ROI:["a4","er2","ou1","ai4"],OKR:["ou1","kei4","a4","er2"],CRM:["si4","a4","er2","ai1","mu5"],ERP:["yi1","a4","er2","pi4"],IOT:["ai4","ou1","ti4"],AR:["ei1","a4","er2"],VR:["wei1","a4","er2"],MR:["ai1","mu5","a4","er2"],ML:["ai1","mu5","ai1","er2"],DL:["di4","ai1","er2"],NLP:["en1","ai1","er2","pi4"],LED:["ai1","er2","yi1","di4"],LCD:["ai1","er2","si4","di4"],OLED:["ou1","ai1","er2","yi1","di4"],PHP:["pi4","ai1","chi4","pi4"],PNG:["pi4","en1","ji4"],JPG:["jie4","pi4","ji4"],MP3:["ai1","mu5","pi4","san1"],MP4:["ai1","mu5","pi4","si4"],FBI:["ai1","fu2","bi4","ai4"],CIA:["si4","ai4","ei1"],NBA:["en1","bi4","ei1"],UN:["you1","en1"],EU:["yi1","you1"],UK:["you1","kei4"],US:["you1","ai1","si4"],USA:["you1","ai1","si4","ei1"],ATM:["ei1","ti4","ai1","mu5"],PIN:["pi4","ai4","en1"],FAQ:["ai1","fu2","ei1","kiu1"],WTO:["shuang1","bi3","you1","ti4","ou1"]},ww={Python:["pai4","sen1"],iPhone:["ai4","feng1"],iPad:["ai4","pa4"],ChatGPT:["chai4","ti2","ji4","pi4","ti4"],Java:["jia3","wa3"],Google:["gu3","ge1"],Facebook:["fei4","si1","bu4","ke4"],Microsoft:["wei2","ruan3"],Twitter:["tui1","te4"],YouTube:["you1","tu4","bei4"],WhatsApp:["hua2","ci2","a1","pu1"],WeChat:["wei1","xin4"],TikTok:["ti4","ke4","ti4","ke4"],Linux:["li4","nei4","ke4","si1"],Docker:["dao4","ke4"],Kubernetes:["ku4","bo2","nei4","ti4","si1"],GitHub:["ji2","te4","ha2","bu4"],Slack:["si1","la1","ke4"],Zoom:["zu4","mu3"],Spotify:["si1","bo1","ti4","fei1"],Netflix:["nai4","fei1"],Amazon:["ya4","ma3","xun4"],Tesla:["te4","si1","la1"],Bitcoin:["bi3","te4","bi4"],Ethereum:["yi3","tai4","fang1"],Discord:["di2","si1","ke1","de2"],Reddit:["rui4","di2","te4"],Steam:["si1","ti4","mu3"],Minecraft:["mai4","ke4","la1","fu1","te4"],Excel:["yi1","ke4","sai1","er3"],Word:["wo4","de2"],PowerPoint:["pao4","wei4","pin3","te4"],Skype:["si1","kai1","pu3"],LinkedIn:["ling3","ying1"],Android:["an1","zhuo2"],iOS:["ai4","ou1","ai1","si4"],macOS:["ma3","ke4","ou1","ai1","si4"],Windows:["wen2","duo1","si1"],Apple:["a1","pou1"],Office:["ao4","fei1","si1"]},bw={A:["ei1"],B:["bi4"],C:["si4"],D:["di4"],E:["yi1"],F:["ai1","fu2"],G:["ji4"],H:["ai1","chi4"],I:["ai4"],J:["jie4"],K:["kei4"],L:["ai1","er2"],M:["ai1","mu5"],N:["en1"],O:["ou1"],P:["pi4"],Q:["kiu1"],R:["a4","er2"],S:["ai1","si4"],T:["ti4"],U:["you1"],V:["wei1"],W:["shuang1","bi3","you1"],X:["ai4","ke4","si1"],Y:["wai4"],Z:["zi4"]},$w={version:mw,description:gw,metadata:_w,acronyms:yw,loanwords:ww,letter_fallback:bw};function Da(){return{acronyms:new Map,loanwords:new Map,letterFallback:new Map}}function vw(s){const i=Da();if(s===null||typeof s!="object"||Array.isArray(s))return i;const r=[["acronyms",i.acronyms],["loanwords",i.loanwords],["letter_fallback",i.letterFallback]];for(const[o,p]of r){const m=s[o];if(m!==void 0){if(m===null||typeof m!="object"||Array.isArray(m))return Da();for(const[y,$]of Object.entries(m)){if(!Array.isArray($)||!$.every(w=>typeof w=="string"))return Da();p.set(y,$)}}}return i}const xw=vw($w);function Ew(s){return s.match(/[A-Za-z0-9]+/g)??[]}function rm(s,i=xw){const r=[];for(const o of Ew(typeof s=="string"?s:"")){const p=i.loanwords.get(o);if(p){r.push(...p);continue}const m=o.toUpperCase(),y=i.acronyms.get(m);if(y){r.push(...y);continue}for(const $ of m){const w=i.letterFallback.get($);w&&r.push(...w)}}return fw(r)}class kw{constructor(i={}){this.phonemeIdMap=i.phonemeIdMap||null,this._wasmPhonemizer=i.wasmPhonemizer||null,this._pinyinDict=i.pinyinDict?Ds(i.pinyinDict):null,this._zhEnDispatch=!0,this._lastError=null}async initialize(){return this._pinyinDict||(this._pinyinDict=await Vm()),this}setPinyinDictionary(i){this._pinyinDict=i?Ds(i):null}get lastError(){return this._lastError}get mode(){return this._wasmPhonemizer?"wasm":this._pinyinDict?"dictionary":"fallback"}setPhonemeIdMap(i){this.phonemeIdMap=i}setWasmPhonemizer(i){this._wasmPhonemizer=i||null,this._lastError=null}setZhEnDispatch(i){this._zhEnDispatch=!!i,this._wasmPhonemizer&&typeof this._wasmPhonemizer.setZhEnDispatch=="function"&&this._wasmPhonemizer.setZhEnDispatch(!!i)}isZhEnDispatchEnabled(){return this._wasmPhonemizer?typeof this._wasmPhonemizer.isZhEnDispatchEnabled=="function"?!!this._wasmPhonemizer.isZhEnDispatchEnabled():null:this._pinyinDict?this._zhEnDispatch:null}phonemize(i){i=Ve(i);const{tokens:r}=this._phonemize(i);return{tokens:r,prosody:new Array(r.length).fill(null)}}phonemizeWithProsody(i){return i=Ve(i),this._phonemize(i)}phonemizeEmbeddedEnglish(i){i=Ve(i);const{tokens:r}=rm(i);return{tokens:r,prosody:new Array(r.length).fill(null)}}phonemizeEmbeddedEnglishWithProsody(i){return i=Ve(i),rm(i)}_phonemize(i){if(!i||typeof i!="string")return{tokens:[],prosody:[]};if(this._wasmPhonemizer)try{const r=this._wasmPhonemizer.phonemize(i,"zh");this._lastError=null;const o=r.tokens||[];return{tokens:o,prosody:o.map(()=>({a1:0,a2:0,a3:0}))}}catch(r){this._lastError=`WASM phonemize failed: ${r.message||r}`}return this._pinyinDict?hw(i,this._pinyinDict):this._fallbackPhonemize(i)}_fallbackPhonemize(i){const r=Array.from(i);return{tokens:r,prosody:r.map(()=>({a1:0,a2:0,a3:0}))}}}const $o=new Set([",",".",";",":","!","?","¡","¿","—","–","…","«","»"]);function Pi(s){return $o.has(s)}const Ss=new Map;function ge(s,i,r){Ss.has(s)||Ss.set(s,new Map),Ss.get(s).set(i,r)}ge("̀","A","À");ge("̀","a","à");ge("̀","E","È");ge("̀","e","è");ge("̀","U","Ù");ge("̀","u","ù");ge("́","A","Á");ge("́","a","á");ge("́","E","É");ge("́","e","é");ge("́","I","Í");ge("́","i","í");ge("́","O","Ó");ge("́","o","ó");ge("́","U","Ú");ge("́","u","ú");ge("̂","A","Â");ge("̂","a","â");ge("̂","E","Ê");ge("̂","e","ê");ge("̂","I","Î");ge("̂","i","î");ge("̂","O","Ô");ge("̂","o","ô");ge("̂","U","Û");ge("̂","u","û");ge("̃","A","Ã");ge("̃","a","ã");ge("̃","N","Ñ");ge("̃","n","ñ");ge("̃","O","Õ");ge("̃","o","õ");ge("̈","E","Ë");ge("̈","e","ë");ge("̈","I","Ï");ge("̈","i","ï");ge("̈","U","Ü");ge("̈","u","ü");ge("̧","C","Ç");ge("̧","c","ç");function vo(s){if(s.length<2)return s.slice();const i=[];let r=0;const o=s.length;for(;r<o;){if(r+1<o){const p=s[r],m=s[r+1],y=Ss.get(m);if(y){const $=y.get(p);if($!==void 0){i.push($),r+=2;continue}}}i.push(s[r]),r+=1}return i}function Km(s){const i=[];let r=!0;for(const o of s)o===" "||o==="	"||o===`
`||o==="\r"?(r||i.push(" "),r=!0):(i.push(o),r=!1);return i.length>0&&i[i.length-1]===" "&&i.pop(),i}function Zm(s,i){const r=[],o=s.length;let p=0;for(;p<o;){const m=s[p];if(i(m)){const y=[];for(;p<o&&i(s[p]);)y.push(s[p]),p+=1;r.push({chars:y,isPunct:!1})}else Pi(m)&&r.push({chars:[m],isPunct:!0}),p+=1}return r}const Sw="β",Iw="ð",Ba="ɡ",am="ɣ",Tw="ɲ",Aw="ɾ",om="ʝ",Is="ˈ",La="",zw="",Cw=new Set([",",".",";",":","!","?","¡","¿"]);function um(s){return Cw.has(s)}function Di(s){return s==="a"||s==="e"||s==="i"||s==="o"||s==="u"}function lm(s){return s==="a"||s==="e"||s==="o"}function dm(s){return s==="i"||s==="u"}function Rn(s){switch(s){case"á":return"a";case"é":return"e";case"í":return"i";case"ó":return"o";case"ú":return"u";case"ü":return"u";default:return s}}function Bs(s){return s==="á"||s==="é"||s==="í"||s==="ó"||s==="ú"}function Ow(s){return Di(s)||Bs(s)||s==="ü"}function cm(s){const i=s.codePointAt(0);return i>=97&&i<=122?!0:s==="ñ"||s==="á"||s==="é"||s==="í"||s==="ó"||s==="ú"||s==="ü"}function Mw(s){const i=s.codePointAt(0);if(i>=65&&i<=90)return String.fromCodePoint(i+32);switch(s){case"Á":return"á";case"É":return"é";case"Í":return"í";case"Ó":return"ó";case"Ú":return"ú";case"Ü":return"ü";case"Ñ":return"ñ";default:return s}}function Jm(s){const i=[...s];return vo(i).map(o=>Mw(o))}function Xm(s){const i=[],r=s.length;let o=0;for(;o<r;)if(cm(s[o])){const p=[];for(;o<r&&cm(s[o]);)p.push(s[o]),o+=1;i.push({type:"word",chars:p})}else if(um(s[o])){const p=[];for(;o<r&&um(s[o]);)p.push(s[o]),o+=1;i.push({type:"punct",chars:p})}else o+=1;return i}const Ym=new Set(["el","la","los","las","un","una","de","del","al","a","en","con","por","y","o","que","se","me","te","le","lo","nos","su","mi","tu","es","no","si"]);function Rw(s){const i=s.map(m=>Rn(m)),r=[],o=s.length;let p=0;for(;p<o;){const m=i[p];if(m==="q"&&p+1<o&&i[p+1]==="u"){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="g"&&p+1<o&&s[p+1]==="ü"&&p+2<o&&(i[p+2]==="e"||i[p+2]==="i")){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="g"&&p+1<o&&i[p+1]==="u"&&p+2<o&&(i[p+2]==="e"||i[p+2]==="i")){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="c"&&p+1<o&&i[p+1]==="h"){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="l"&&p+1<o&&i[p+1]==="l"){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="r"&&p+1<o&&i[p+1]==="r"){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="s"&&p+1<o&&i[p+1]==="c"&&p+2<o&&(i[p+2]==="e"||i[p+2]==="i")){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="x"&&p+1<o&&i[p+1]==="c"&&p+2<o&&(i[p+2]==="e"||i[p+2]==="i")){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="h"){r.push({chars:[s[p]],isVowel:!1,isSilent:!0}),p+=1;continue}if(Di(m)){r.push({chars:[s[p]],isVowel:!0,isSilent:!1}),p+=1;continue}r.push({chars:[s[p]],isVowel:!1,isSilent:!1}),p+=1}return r}function pm(s,i){return i==="l"?s==="b"||s==="c"||s==="f"||s==="g"||s==="p"||s==="t":i==="r"?s==="b"||s==="c"||s==="d"||s==="f"||s==="g"||s==="p"||s==="t":!1}function ws(s){return Rn(s.chars[s.chars.length-1])}function Pw(s){const i=[],r=[];for(let y=0;y<s.length;y++)s[y].isSilent||(i.push(y),r.push(s[y].isVowel));const o=i.length;if(o===0)return[0];const p=[0];let m=1;for(;m<o;)if(r[m]){if(m>0&&r[m-1]){const y=s[i[m-1]].chars[s[i[m-1]].chars.length-1],$=s[i[m]].chars[s[i[m]].chars.length-1],w=Rn(y),I=Rn($);(lm(w)&&lm(I)||dm(I)&&Bs($)||dm(w)&&Bs(y))&&p.push(m)}m+=1}else{const y=m;for(;m<o&&!r[m];)m+=1;const $=m-y;if(m<o)if($===1)p.push(y);else if($===2){const w=ws(s[i[y]]),I=ws(s[i[y+1]]);pm(w,I)?p.push(y):p.push(y+1)}else{const w=ws(s[i[m-2]]),I=ws(s[i[m-1]]);pm(w,I)?p.push(m-2):p.push(m-1)}}return p.map(y=>i[y])}function Dw(s){for(let i=0;i<s.length;i++)if(Bs(s[i]))return i;return-1}function Bw(s,i,r){const o=r.length;if(o===0)return 0;const p=Dw(s);if(p>=0){let y=0,$=0;for(let w=0;w<i.length;w++){const I=i[w].chars.length;if(y<=p&&p<y+I){$=w;break}y+=I}for(let w=o-1;w>=0;w--)if(r[w]<=$)return w;return 0}if(o===1)return 0;const m=Rn(s[s.length-1]);return Di(m)||m==="n"||m==="s"?Math.max(0,o-2):o-1}function Qm(s){const i=[],r=s.length,o=s.map(z=>Rn(z)),p=z=>z>0&&Ow(s[z-1]),m=z=>z>0&&(o[z-1]==="m"||o[z-1]==="n"),y=z=>z===0;let $=0;for(;$<r;){const z=o[$];if(Di(z)){i.push(z),$+=1;continue}if(z==="q"&&$+1<r&&o[$+1]==="u"){i.push("k"),$+=2;continue}if(z==="c"&&$+1<r&&o[$+1]==="h"){i.push(zw),$+=2;continue}if(z==="l"&&$+1<r&&o[$+1]==="l"){i.push(om),$+=2;continue}if(z==="r"&&$+1<r&&o[$+1]==="r"){i.push(La),$+=2;continue}if(z==="g"&&$+1<r&&s[$+1]==="ü"&&$+2<r&&(o[$+2]==="e"||o[$+2]==="i")){i.push(Ba),i.push("w"),$+=2;continue}if(z==="g"&&$+1<r&&o[$+1]==="u"&&$+2<r&&(o[$+2]==="e"||o[$+2]==="i")){p($)&&!m($)?i.push(am):i.push(Ba),$+=2;continue}if(z==="s"&&$+1<r&&o[$+1]==="c"&&$+2<r&&(o[$+2]==="e"||o[$+2]==="i")){i.push("s"),$+=2;continue}if(z==="b"||z==="v"){y($)||m($)||$>0&&o[$-1]==="l"?i.push("b"):i.push(Sw),$+=1;continue}if(z==="c"){$+1<r&&(o[$+1]==="e"||o[$+1]==="i")?i.push("s"):i.push("k"),$+=1;continue}if(z==="d"){y($)||m($)||$>0&&o[$-1]==="l"?i.push("d"):i.push(Iw),$+=1;continue}if(z==="f"){i.push("f"),$+=1;continue}if(z==="g"){$+1<r&&(o[$+1]==="e"||o[$+1]==="i")?i.push("x"):y($)||m($)||$>0&&o[$-1]==="l"?i.push(Ba):i.push(am),$+=1;continue}if(z==="h"){$+=1;continue}if(z==="j"){i.push("x"),$+=1;continue}if(z==="k"){i.push("k"),$+=1;continue}if(z==="l"){i.push("l"),$+=1;continue}if(z==="m"){i.push("m"),$+=1;continue}if(z==="n"){i.push("n"),$+=1;continue}if(z==="ñ"){i.push(Tw),$+=1;continue}if(z==="p"){i.push("p"),$+=1;continue}if(z==="r"){y($)||$>0&&(o[$-1]==="l"||o[$-1]==="n"||o[$-1]==="s")?i.push(La):i.push(Aw),$+=1;continue}if(z==="s"){i.push("s"),$+=1;continue}if(z==="t"){i.push("t"),$+=1;continue}if(z==="w"){i.push("w"),$+=1;continue}if(z==="x"){if($+1<r&&o[$+1]==="c"&&$+2<r&&(o[$+2]==="e"||o[$+2]==="i")){i.push("k"),i.push("s"),$+=2;continue}i.push("k"),i.push("s"),$+=1;continue}if(z==="y"){$===r-1?i.push("i"):i.push(om),$+=1;continue}if(z==="z"){i.push("s"),$+=1;continue}$+=1}const w=Rw(s),I=Pw(w),R=Bw(s,w,I);return{phonemes:i,stressedSyl:R,units:w,boundaries:I}}function Lw(s){const i=s.chars.map(r=>Rn(r));return i.length===1&&i[0]==="h"?0:i.length===2&&i[0]==="g"&&s.chars[1]==="ü"||i.length===2&&i[0]==="x"&&i[1]==="c"||i.length===1&&i[0]==="x"?2:1}function eg(s,i,r,o){if(s.length===0||r.length===0||o>=r.length)return;const p=i.length,m=r[o],y=o+1<r.length?r[o+1]:p;let $=-1;for(let I=0;I<Math.min(y,p)-m;I++)if(i[m+I].isVowel){$=m+I;break}if($<0)return;let w=0;for(let I=0;I<i.length;I++){if(I===$){s.splice(w,0,Is);return}w+=Lw(i[I])}}function Nw(s){if(!s)return[];const i=Jm(s),r=Xm(i);if(r.length===0)return[];const o=[];let p=!1;for(const m of r)if(m.type==="punct")for(const y of m.chars)o.push(y);else if(m.type==="word"){p&&o.push(" ");const y=Qm(m.chars),$=m.chars.join("");Ym.has($)||eg(y.phonemes,y.units,y.boundaries,y.stressedSyl);for(const I of y.phonemes)o.push(I);p=!0}return o}class Uw{constructor(i={}){this.phonemeIdMap=i.phonemeIdMap||null}get languageCode(){return"es"}setPhonemeIdMap(i){this.phonemeIdMap=i}phonemize(i){if(i=Ve(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=Nw(i),o=new Array(r.length).fill(null);return{tokens:r,prosody:o}}phonemizeWithProsody(i){if(i=Ve(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=Jm(i),o=Xm(r);if(o.length===0)return{tokens:[],prosody:[]};const p=[],m=[];let y=!1;for(const $ of o)if($.type==="punct")for(const w of $.chars)p.push(w),m.push({a1:0,a2:0,a3:0});else if($.type==="word"){y&&(p.push(" "),m.push({a1:0,a2:0,a3:0}));const w=Qm($.chars),I=$.chars.join("");Ym.has(I)||eg(w.phonemes,w.units,w.boundaries,w.stressedSyl);const z=w.phonemes.filter(M=>M!==Is).length;for(let M=0;M<w.phonemes.length;M++){const D=w.phonemes[M];if(D===Is)p.push(D),m.push({a1:0,a2:2,a3:z});else{const j=M>0&&w.phonemes[M-1]===Is&&Di(D);p.push(D),m.push({a1:0,a2:j?2:0,a3:z})}}y=!0}return{tokens:p,prosody:m}}}const Ts="",nn="",tg="",so="",Ut="ɛ",ng="ɔ",ig="ə",Na="ɡ",Fw="ʃ",hm="ʒ",Ww="ʁ",jw="ɲ",Vw="ɥ",sg="ø",As="œ",qw=new Set(["a","e","i","o","u","y","à","â","æ","é","è","ê","ë","î","ï","ô","ù","û","ü","œ"]),Gw=new Set(["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z"]),Hw=new Set(["d","g","h","m","n","p","s","t","x","z"]),Kw=new Set(["e","i","y","é","è","ê","ë","î","ï"]);function Ua(s){const i=s.codePointAt(0);return i>=97&&i<=122?!0:s==="à"||s==="â"||s==="æ"||s==="é"||s==="è"||s==="ê"||s==="ë"||s==="î"||s==="ï"||s==="ô"||s==="ù"||s==="û"||s==="ü"||s==="œ"||s==="ç"||s==="ñ"}function et(s){return qw.has(s)}function bs(s){return Gw.has(s)}function $s(s){return Hw.has(s)}function Fa(s){return Kw.has(s)}const Zw=new Set(["a","e","i","o","u",Ut,ng,ig,sg,As,Ts,nn,tg,so]);function Jw(s){return Zw.has(s)}const Xw=new Set(["ville","mille","tranquille"]),Yw=new Set(["hiver","enfer","amer","cancer","super","laser","hamster","master","poster","cluster","starter","leader","transfer","fer"]);function Qw(s){const i=s.codePointAt(0);return i>=65&&i<=90||i>=192&&i<=214||i>=216&&i<=222?String.fromCodePoint(i+32):i===338?"œ":s}function e1(s){let i=vo([...s]);return i=i.map(Qw),Km(i)}const t1=new Set(["l","d","j","n","s","c","m","t","qu"]),n1=new Map([["les","z"],["des","z"],["ces","z"],["mes","z"],["tes","z"],["ses","z"],["nos","z"],["vos","z"],["aux","z"],["petits","z"],["grands","z"],["gros","z"],["deux","z"],["trois","z"],["six","z"],["dix","z"],["nous","z"],["vous","z"],["ils","z"],["elles","z"],["on","n"],["en","n"],["dans","z"],["sans","z"],["chez","z"],["un","n"],["mon","n"],["ton","n"],["son","n"],["tout","t"],["quand","t"],["très","z"],["plus","z"],["est","t"],["ont","t"],["sont","t"],["font","t"],["vont","t"]]);function i1(s){const i=s.map(m=>m==="’"||m==="‘"?"'":m),r=[],o=i.length;let p=0;for(;p<o;){const m=i[p];if($o.has(m)){r.push({chars:[m],isPunct:!0}),p++;continue}if(!Ua(m)){p++;continue}const y=[[]];for(;p<o;)if(Ua(i[p]))y[y.length-1].push(i[p]),p++;else if(i[p]==="'"&&p+1<o&&Ua(i[p+1]))y.push([]),p++;else break;let $=null;y.forEach((w,I)=>{$?$.push(...w):I<y.length-1&&t1.has(w.join(""))?$=[...w]:r.push({chars:w,isPunct:!1})}),$&&r.push({chars:$,isPunct:!1})}return r}function s1(s){return s.length===0?!1:et(s[0])?!0:s[0]==="h"&&s.length>1&&et(s[1])}function r1(s){let i=0;for(const r of s)et(r)&&i++;return i}function a1(s){return Xw.has(s.join(""))}function o1(s){return Yw.has(s.join(""))}function Ii(s,i,r,o,p){if(i+1>=r)return!1;const m=s[i+1];return m!=="n"&&m!=="m"?!1:i+2>=r?(p.push(o),i+2):et(s[i+2])||s[i+2]===m?!1:(p.push(o),i+2)}function u1(s){const i=[];let r=0;const o=s.length;for(;r<o;){const p=s[r];if(p==="e"&&r+1===o-1&&s[r+1]==="r"&&r1(s)>=2&&!o1(s)){i.push("e"),r+=2;continue}if(p==="e"&&r+2<o&&s[r+1]==="a"&&s[r+2]==="u"){i.push("o"),r+=3;continue}if(p==="o"&&r+5<o&&s[r+1]==="u"&&s[r+2]==="i"&&s[r+3]==="l"&&s[r+4]==="l"&&s[r+5]==="e"&&(r+6>=o||!et(s[r+6]))){i.push("u"),i.push("j"),r+=6;continue}if(p==="a"&&r+4<o&&s[r+1]==="i"&&s[r+2]==="l"&&s[r+3]==="l"&&s[r+4]==="e"&&(r+5>=o||!et(s[r+5]))){i.push("a"),i.push("j"),r+=5;continue}if(p==="e"&&r+5<o&&s[r+1]==="u"&&s[r+2]==="i"&&s[r+3]==="l"&&s[r+4]==="l"&&s[r+5]==="e"&&r+6>=o){i.push(As),i.push("j"),r+=6;continue}if(p==="e"&&r+2<o&&s[r+1]==="i"&&s[r+2]==="l"&&r+3>=o){i.push(Ut),i.push("j"),r+=3;continue}if(p==="e"&&r+4<o&&s[r+1]==="i"&&s[r+2]==="l"&&s[r+3]==="l"&&s[r+4]==="e"&&(r+5>=o||!et(s[r+5]))){i.push(Ut),i.push("j"),r+=5;continue}if(p==="a"&&r+2<o&&s[r+1]==="i"&&(s[r+2]==="n"||s[r+2]==="m")&&(r+3>=o||!et(s[r+3]))){i.push(nn),r+=3;continue}if(p==="e"&&r+2<o&&s[r+1]==="i"&&(s[r+2]==="n"||s[r+2]==="m")&&(r+3>=o||!et(s[r+3]))){i.push(nn),r+=3;continue}if(p==="o"&&r+2<o&&s[r+1]==="i"&&s[r+2]==="n"&&(r+3>=o||!et(s[r+3]))){i.push("w"),i.push(nn),r+=3;continue}if(p==="i"&&r+2<o&&s[r+1]==="e"&&s[r+2]==="n"&&(r+3>=o||!et(s[r+3]))){i.push("j"),i.push(nn),r+=3;continue}if(p==="t"&&r+3<o&&s[r+1]==="i"&&s[r+2]==="o"&&s[r+3]==="n"&&(r+4>=o||!et(s[r+4]))){r>0&&s[r-1]==="s"?i.push("t"):i.push("s"),i.push("j"),i.push(so),r+=4;continue}if(p==="i"&&r+3<o&&s[r+1]==="l"&&s[r+2]==="l"&&s[r+3]==="e"&&(r+4>=o||!et(s[r+4]))){i.push("i"),a1(s)?i.push("l"):i.push("j"),r+=4;continue}if(p==="g"&&r+1<o&&s[r+1]==="n"){i.push(jw),r+=2;continue}if(p==="p"&&r+1<o&&s[r+1]==="h"){i.push("f"),r+=2;continue}if(p==="t"&&r+1<o&&s[r+1]==="h"){i.push("t"),r+=2;continue}if(p==="c"&&r+1<o&&s[r+1]==="h"){i.push(Fw),r+=2;continue}if(p==="q"&&r+1<o&&s[r+1]==="u"){i.push("k"),r+=2;continue}if(p==="g"&&r+1<o&&s[r+1]==="u"&&r+2<o&&Fa(s[r+2])){i.push(Na),r+=2;continue}if(p==="a"||p==="e"){const $=Ii(s,r,o,tg,i);if($!==!1){r=$;continue}}if(p==="i"){const $=Ii(s,r,o,nn,i);if($!==!1){r=$;continue}}if(p==="o"){const $=Ii(s,r,o,so,i);if($!==!1){r=$;continue}}if(p==="u"){const $=Ii(s,r,o,nn,i);if($!==!1){r=$;continue}}if(p==="y"){const $=Ii(s,r,o,nn,i);if($!==!1){r=$;continue}}if(p==="o"&&r+1<o&&s[r+1]==="u"){i.push("u"),r+=2;continue}if(p==="a"&&r+1<o&&s[r+1]==="u"){i.push("o"),r+=2;continue}if(p==="o"&&r+1<o&&s[r+1]==="i"){i.push("w"),i.push("a"),r+=2;continue}if(p==="a"&&r+1<o&&s[r+1]==="i"){i.push(Ut),r+=2;continue}if(p==="e"&&r+1<o&&s[r+1]==="i"){i.push(Ut),r+=2;continue}if((p==="e"||p==="œ")&&r+1<o&&s[r+1]==="u"){r+2<o&&bs(s[r+2])&&!$s(s[r+2])?i.push(As):i.push(sg),r+=2;continue}if(p==="é"){i.push("e"),r+=1;continue}if(p==="è"||p==="ê"){i.push(Ut),r+=1;continue}if(p==="ë"){i.push(Ut),r+=1;continue}if(p==="à"||p==="â"){i.push("a"),r+=1;continue}if(p==="a"){i.push("a"),r+=1;continue}if(p==="î"||p==="ï"){i.push("i"),r+=1;continue}if(p==="i"){r+1<o&&et(s[r+1])?r+1===o-1&&s[r+1]==="e"?i.push("i"):i.push("j"):i.push("i"),r+=1;continue}if(p==="ô"){i.push("o"),r+=1;continue}if(p==="o"){const $=r+1;let w=o;w>$&&(w-$>=2&&s[w-2]==="e"&&s[w-1]==="s"?w-=2:s[w-1]==="e"&&(w-=1));let I=!1,R=!0,z=!1;for(let M=$;M<w;M++){if(I=!0,!bs(s[M])){R=!1;break}$s(s[M])||(z=!0)}I&&R&&z?i.push(ng):i.push("o"),r+=1;continue}if(p==="ù"||p==="û"){i.push(Ts),r+=1;continue}if(p==="ü"){i.push(Ts),r+=1;continue}if(p==="u"){if(r+1<o&&s[r+1]==="i"){i.push(Vw),i.push("i"),r+=2;continue}i.push(Ts),r+=1;continue}if(p==="y"){r+1<o&&et(s[r+1])?i.push("j"):i.push("i"),r+=1;continue}if(p==="œ"){i.push(As),r+=1;continue}if(p==="æ"){i.push("e"),r+=1;continue}if(p==="e"){if(r===o-1){r+=1;continue}let $=0;for(let z=r+1;z<o&&bs(s[z]);z++)$++;if($>=2){i.push(Ut),r+=1;continue}const w=s.slice(r+1),I=w.length>0&&w.every(z=>bs(z)),R=w.some(z=>!$s(z));w.length>0&&I&&R?i.push(Ut):i.push(ig),r+=1;continue}if(p==="c"){r+1<o&&Fa(s[r+1])?i.push("s"):i.push("k"),r+=1;continue}if(p==="ç"){i.push("s"),r+=1;continue}if(p==="g"){r+1<o&&Fa(s[r+1])?i.push(hm):i.push(Na),r+=1;continue}if(p==="j"){i.push(hm),r+=1;continue}if(p==="r"){i.push(Ww),r+1<o&&s[r+1]==="r"?r+=2:r+=1;continue}if(p==="x"){if(r===o-1){r+=1;continue}{const $=o-(r+1);let w=!1;if(($===1&&s[r+1]==="e"||$===2&&s[r+1]==="e"&&s[r+2]==="s")&&(w=!0),w){r+=1;continue}}if(r>0&&s[r-1]==="e"&&r+1<o&&et(s[r+1])){i.push(Na),i.push("z"),r+=1;continue}i.push("k"),i.push("s"),r+=1;continue}if(p==="h"){r+=1;continue}const y={b:"b",d:"d",f:"f",k:"k",l:"l",m:"m",n:"n",p:"p",s:"s",t:"t",v:"v",w:"w",z:"z"}[p];if(y!==void 0){const $=r===o-1,w=o>=2&&r===o-2&&s[o-1]==="s";if(($||w)&&$s(p)){r+=1;continue}if(p==="s"){const R=r>0&&et(s[r-1]),z=r+1<o&&et(s[r+1]),M=!(r+1<o&&s[r+1]==="s");if(R&&z&&M){i.push("z"),r+=1;continue}}i.push(y),r+1<o&&s[r+1]===p?r+=2:r+=1;continue}if($o.has(p)){i.push(p),r+=1;continue}r+=1}return i}function fm(s){if(!s)return{phonemes:[],prosody:[]};const i=e1(s),r=i1(i),o=[],p=[];let m=!1;for(let y=0;y<r.length;y++){const $=r[y];if(!$.isPunct&&m&&(o.push(" "),p.push({a1:0,a2:0,a3:0})),$.isPunct)for(const w of $.chars)o.push(w),p.push({a1:0,a2:0,a3:0});else{const w=u1($.chars),I=n1.get($.chars.join("")),R=r[y+1];I&&R&&!R.isPunct&&s1(R.chars)&&w.push(I);const z=w.length;let M=-1;for(let D=w.length-1;D>=0;D--)if(Jw(w[D])){M=D;break}for(let D=0;D<w.length;D++){const j=D===M?2:0;o.push(w[D]),p.push({a1:0,a2:j,a3:z})}}m=!0}return{phonemes:o,prosody:p}}class l1{constructor(i={}){this.phonemeIdMap=i.phonemeIdMap||null}get languageCode(){return"fr"}setPhonemeIdMap(i){this.phonemeIdMap=i}phonemize(i){if(i=Ve(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const{phonemes:r}=fm(i),o=new Array(r.length).fill(null);return{tokens:r,prosody:o}}phonemizeWithProsody(i){if(i=Ve(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const{phonemes:r,prosody:o}=fm(i);return{tokens:r,prosody:o}}}const Vs="",qs="",rg="ɛ",ag="ɔ",ro="ɡ",zs="ʃ",ao="ʒ",oo="ʁ",og="ɲ",ug="ɾ",lg="ʎ",xo="ã",Eo="ẽ",ko="ĩ",So="õ",Io="ũ",d1=new Set(["a","e","i","o","u","á","à","â","ã","é","ê","í","ó","ô","õ","ú","ü"]);function Ot(s){return d1.has(s)}const c1=new Set(["á","é","í","ó","ú"]);function uo(s){return c1.has(s)}const p1=new Set(["â","ê","ô"]);function lo(s){return p1.has(s)}function co(s){return s==="ã"||s==="õ"}function h1(s){switch(s){case"á":case"à":case"â":case"ã":return"a";case"é":case"ê":return"e";case"í":return"i";case"ó":case"ô":case"õ":return"o";case"ú":case"ü":return"u";default:return s}}const f1=new Set(["a","e","i","o","u",rg,ag]);function m1(s){return f1.has(s)}const g1=new Set([xo,Eo,ko,So,Io]);function dg(s){return g1.has(s)}function _1(s){return m1(s)||dg(s)}const y1=new Set(["b","c","d","f","h","j","k","l","m","n","p","s","t","v","w","z",ro,og,ug,oo,zs,lg,ao]);function w1(s){return y1.has(s)}const b1=new Set(["e","i","é","ê","í"]);function Cn(s){return b1.has(s)}function cg(s){const i=s.codePointAt(0);return i>=97&&i<=122||i>=224&&i<=255&&i!==247||s==="ç"||s==="ñ"||s==="ẽ"||s==="ĩ"||s==="ũ"}function $1(s){const i=s.codePointAt(0);return i>=65&&i<=90||i>=192&&i<=222&&i!==215?String.fromCodePoint(i+32):s}function pg(s){let i=[...s];return i=vo(i),i=i.map($1),Km(i)}function hg(s){let i=0,r=0;const o=s.length;for(;r<o;){const p=s[r];if(p==="q"&&r+1<o&&s[r+1]==="u"){r+=2;continue}if(p==="g"&&r+1<o&&s[r+1]==="u"&&r+2<o&&Cn(s[r+2])){r+=2;continue}if(p==="o"&&r+1<o&&s[r+1]==="u"){i+=1,r+=2;continue}Ot(p)&&(i+=1),r+=1}return i}function v1(s){const i=hg(s);let r=-1,o=0,p=0;const m=s.length;for(;p<m;){const I=s[p];if(I==="q"&&p+1<m&&s[p+1]==="u"){p+=2;continue}if(I==="g"&&p+1<m&&s[p+1]==="u"&&p+2<m&&Cn(s[p+2])){p+=2;continue}if(I==="o"&&p+1<m&&s[p+1]==="u"){(uo(I)||lo(I)||co(I))&&(r=o),o+=1,p+=2;continue}Ot(I)&&((uo(I)||lo(I)||co(I))&&(r=o),o+=1),p+=1}if(i===0)return 0;if(r>=0)return i-1-r;const y=s.slice();for(;y.length>0&&y[y.length-1]==="s";)y.pop();const $=y.length;let w=!1;if($>=1){const I=y[$-1];(I==="a"||I==="e"||I==="o")&&(w=!0)}if(!w&&$>=2){const I=y[$-2],R=y[$-1];(I==="a"&&R==="m"||I==="e"&&R==="m"||I==="e"&&R==="n")&&(w=!0)}return w?Math.min(1,i-1):0}function x1(s,i){return s===0||s>=i.length-1?!1:Ot(i[s-1])&&Ot(i[s+1])}function E1(s){switch(s){case"a":return xo;case"e":return Eo;case"i":return ko;case"o":return So;case"u":return Io;default:return s}}function k1(s){switch(s){case"a":return"a";case"e":return rg;case"i":return"i";case"o":return ag;case"u":return"u";default:return s}}function S1(s){const i=[];let r=-1,o=0;const p=s.length,m=v1(s),$=hg(s)-1-m;let w=0;for(;o<p;){const I=s[o];if(I==="n"&&o+1<p&&s[o+1]==="h"){i.push(og),o+=2;continue}if(I==="l"&&o+1<p&&s[o+1]==="h"){i.push(lg),o+=2;continue}if(I==="c"&&o+1<p&&s[o+1]==="h"){i.push(zs),o+=2;continue}if(I==="r"&&o+1<p&&s[o+1]==="r"){i.push(oo),o+=2;continue}if(I==="s"&&o+1<p&&s[o+1]==="s"){i.push("s"),o+=2;continue}if(I==="s"&&o+1<p&&s[o+1]==="c"&&o+2<p&&Cn(s[o+2])){i.push("s"),o+=2;continue}if(I==="q"&&o+1<p&&s[o+1]==="u"){i.push("k"),o+2<p&&Cn(s[o+2])||i.push("w"),o+=2;continue}if(I==="g"&&o+1<p&&s[o+1]==="u"&&o+2<p&&Cn(s[o+2])){i.push(ro),o+=2;continue}if(I==="o"&&o+1<p&&s[o+1]==="u"){w===$&&(r=i.length),i.push("o"),w+=1,o+=2;continue}if(I==="r"){x1(o,s)?i.push(ug):i.push(oo),o+=1;continue}if(I==="s"){o>0&&o+1<p&&Ot(s[o-1])&&Ot(s[o+1])?i.push("z"):i.push("s"),o+=1;continue}if(I==="x"){o===0?i.push(zs):o>0&&Ot(s[o-1])&&o+1<p&&Ot(s[o+1])?i.push("z"):i.push(zs),o+=1;continue}if(I==="c"){o+1<p&&Cn(s[o+1])?i.push("s"):i.push("k"),o+=1;continue}if(I==="ç"){i.push("s"),o+=1;continue}if(I==="g"){o+1<p&&Cn(s[o+1])?i.push(ao):i.push(ro),o+=1;continue}if(I==="j"){i.push(ao),o+=1;continue}if(I==="t"){o+1<p&&(s[o+1]==="i"||s[o+1]==="í")?i.push(Vs):i.push("t"),o+=1;continue}if(I==="d"){o+1<p&&(s[o+1]==="i"||s[o+1]==="í")?i.push(qs):i.push("d"),o+=1;continue}if(I==="h"){o+=1;continue}if(I==="b"||I==="f"||I==="k"||I==="l"||I==="m"||I==="n"||I==="p"||I==="v"){i.push(I),o+=1;continue}if(I==="z"){i.push("z"),o+=1;continue}if(I==="w"){i.push("w"),o+=1;continue}if(Ot(I)){const R=w===$,z=h1(I);let M=!1,D=!1;co(I)?M=!0:o+1<p&&(s[o+1]==="n"||s[o+1]==="m")&&(s[o+1]==="n"&&o+2<p&&s[o+2]==="h"||(o+2>=p?(M=!0,D=!0):Ot(s[o+2])||(M=!0,D=!0)));let j;M?j=E1(z):uo(I)?j=k1(z):(lo(I),j=z),R&&(r=i.length),i.push(j),w+=1,D?o+=2:o+=1;continue}if(Pi(I)){i.push(I),o+=1;continue}o+=1}return{phonemes:i,stressIdx:r}}function I1(s,i){let r=s.length-1;for(;r>=1;)(s[r]==="n"||s[r]==="m")&&dg(s[r-1])&&(r===s.length-1||s[r+1]===" "||Pi(s[r+1]))&&(i>=0&&r<i&&(i-=1),s.splice(r,1)),r-=1;return{phonemes:s,stressIdx:i}}function T1(s){for(let i=0;i<s.length;i++){if(s[i]!=="l")continue;if(i===s.length-1){s[i]="w";continue}const r=s[i+1];if(r===" "||Pi(r)){s[i]="w";continue}(w1(r)||r===Vs||r===qs)&&!_1(r)&&(s[i]="w")}}function A1(s){const i=[];let r=0;for(let o=0;o<s.length;o++)s[o]===" "&&(o>r&&i.push([r,o]),r=o+1);return r<s.length&&i.push([r,s.length]),i}function z1(s,i){const r=A1(s);for(const[o,p]of r){if(p-o<2)continue;let m=p-1;for(;m>=o&&Pi(s[m]);)m-=1;if(!(m<o))if(s[m]==="e"&&m!==i){if(m>o&&s[m-1]==="t"){s[m-1]=Vs,s[m]="i";continue}if(m>o&&s[m-1]==="d"){s[m-1]=qs,s[m]="i";continue}s[m]="i"}else s[m]==="o"&&m!==i&&(s[m]="u")}}function fg(s){let i=S1(s);return i=I1(i.phonemes,i.stressIdx),T1(i.phonemes),z1(i.phonemes,i.stressIdx),i}function C1(s){if(!s)return[];const i=pg(s),r=Zm(i,cg),o=[];let p=!1;for(const m of r)if(m.isPunct){for(const y of m.chars)o.push(y);p=!0}else{p&&o.push(" ");const y=fg(m.chars);for(const $ of y.phonemes)o.push($);p=!0}return o}class mg{constructor(i={}){this.phonemeIdMap=i.phonemeIdMap||null}get languageCode(){return"pt"}setPhonemeIdMap(i){this.phonemeIdMap=i}phonemize(i){if(i=Ve(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=C1(i),o=new Array(r.length).fill(null);return{tokens:r,prosody:o}}phonemizeWithProsody(i){if(i=Ve(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=pg(i),o=Zm(r,cg),p=[],m=[];let y=!1;for(const $ of o)if($.isPunct){for(const w of $.chars)p.push(w),m.push({a1:0,a2:0,a3:0});y=!0}else{y&&(p.push(" "),m.push({a1:0,a2:0,a3:0}));const w=fg($.chars),I=w.phonemes.length;for(let R=0;R<w.phonemes.length;R++){const z=R===w.stressIdx?2:0;p.push(w.phonemes[R]),m.push({a1:0,a2:z,a3:I})}y=!0}return{tokens:p,prosody:m}}}const O1=new Set(["a","e","i","o","u","ɛ","ɔ",xo,Eo,ko,So,Io,"ɨ"]),M1=new Set(["b","d","f","k","l","m","n","p","r","s","t","v","w","z","ɡ","ɲ","ɾ","ʁ","ʃ","ʎ","ʒ","ʔ","h","ɫ"]),Wa=new Set([",",".",";",":","!","?","—","–","…"]);function gg(s){return typeof s=="string"&&s.length>0?s[0]:""}function ja(s){return M1.has(gg(s))}function Cs(s){return O1.has(gg(s))}function R1(s,i){for(let r=i+1;r<s.length;r++)if(s[r]!==" ")return Cs(s[r]);return!1}function mm(s){const i=s.slice(),r=i.length;for(let o=0;o<r;o++){if(i[o]!=="i")continue;const p=o+1<r?i[o+1]:"";if(p===""||p===" "||Wa.has(p)){if(o>=1&&i[o-1]===Vs){i[o-1]="t",i[o]="ɨ";continue}if(o>=1&&i[o-1]===qs){i[o-1]="d",i[o]="ɨ";continue}o>=1&&ja(i[o-1])&&(i[o]="ɨ")}}for(let o=0;o<r;o++){if(i[o]!=="s"&&i[o]!=="z")continue;const p=o+1<r?i[o+1]:"";if(p===""||p===" "||Wa.has(p)){if(R1(i,o)){i[o]="ʒ";continue}i[o]=i[o]==="s"?"ʃ":"ʒ"}else ja(p)&&!Cs(p)&&(i[o]=i[o]==="s"?"ʃ":"ʒ")}for(let o=0;o<r;o++){if(i[o]!=="w"||o===0||!Cs(i[o-1]))continue;const p=o+1<r?i[o+1]:"";(p===""||p===" "||Wa.has(p)||ja(p)&&!Cs(p))&&(i[o]="ɫ")}for(let o=0;o<r;o++)i[o]==="h"&&(i[o]="ʁ");return i}class P1{constructor(i={}){this.brG2P=new mg(i),this.phonemeIdMap=this.brG2P.phonemeIdMap}get languageCode(){return"pt-PT"}phonemize(i){const r=this.brG2P.phonemizeWithProsody(i);return mm(r.tokens)}phonemizeWithProsody(i){const r=this.brG2P.phonemizeWithProsody(i);return{tokens:mm(r.tokens),prosody:r.prosody}}}const Va=new Set(["e","i","y","ä","ö"]),_g=new Set(["a","e","i","o","u","y","å","ä","ö"]),yg=new Set(["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z"]),D1=new Set([".",",",";",":","!","?"]),B1={a:"ɑː",e:"eː",i:"iː",o:"uː",u:"ʉː",y:"yː",å:"oː",ä:"ɛː",ö:"øː"},zi={a:"a",e:"ɛ",i:"ɪ",o:"ɔ",u:"ɵ",y:"ʏ",å:"ɔ",ä:"ɛ",ö:"œ"},L1="oː",N1={b:"b",c:"k",d:"d",f:"f",g:"ɡ",h:"h",j:"j",k:"k",l:"l",m:"m",n:"n",p:"p",q:"k",r:"r",s:"s",t:"t",v:"v",w:"v",x:"ks",z:"s"},U1=new Set(["backe","bricka","docka","dricka","dyker","dyket","enkel","ficka","flicka","fröken","kebab","kennel","kent","keps","kerna","keso","ketchup","kex","kibbutz","kick","kikare","kille","kilo","kilt","kimono","kines","kinesisk","kiosk","kirke","kissa","kitsch","kiwi","leken","leker","lekerska","läker","läket","märke","märker","märket","mörker","naken","ocker","onkel","paket","pojke","raket","rike","ryker","räcker","röker","röket","silke","sjunker","skelett","skicka","smeker","sockel","socker","staket","steker","steket","sticker","stryker","säker","söker","söket","tecken","trycke","tänker","tänket","vacker","viker","vinkel","väcker"]),F1=new Set(["back","block","brick","dock","drick","dyk","fick","flick","lek","lock","läk","märk","pack","rock","ryk","räck","rök","sack","sick","sjunk","skick","smek","sock","stek","stick","stryk","sök","tack","trick","tryck","tänk","vik","väck"]),W1=new Set(["agera","arrangera","bagel","bageri","berg","borg","bygel","bygge","båge","dager","delegera","duger","engagera","finger","flygel","flyger","fogel","fågel","ge","gecko","gel","ger","hage","hagel","hunger","ignorera","intrigera","lager","ligger","ljuger","läge","läger","lägger","mage","nagel","navigera","negera","reagera","regel","segel","seger","segregera","spegel","stege","stiger","suger","tagel","tangera","tegel","tiger","tigger","tygel","väger","äger","ängel"]),j1=new Set(["bag","berg","borg","byg","dag","drag","dug","flyg","lag","lig","ljug","lägg","mag","nag","reg","seg","stig","sug","tag","tig","vag","väg","äg"]),V1=new Set(["blod","bo","bror","dom","flod","fon","fot","god","ion","jord","ko","kol","kontroll","lo","lov","mod","mol","mor","nod","ord","pol","ro","rod","roll","rot","son","tog","ton","tro","zon"]),q1=new Set(["dam","dom","dröm","dum","fem","glöm","gum","ham","hem","kam","lam","lem","ram","rum","som","stam","ström","tom"]),wg=new Set(["att","av","de","dem","den","det","din","du","en","ett","från","för","han","har","hon","hos","i","inte","jag","kan","med","men","min","när","och","om","på","sig","sin","ska","som","till","ur","var","vi","vill","är"]),G1=new Set(["människa","marskalk"]),H1=new Set(["krist","kristus","kron","kronik","och"]),K1=new Set(["bage","dage","drage","frage","hage","klage","lage","mage","plage","sage","tage"]),Z1=[{suffix:"ssion",phonemes:["ɧ","uː","n"]},{suffix:"tion",phonemes:["ɧ","uː","n"]},{suffix:"sion",phonemes:["ɧ","uː","n"]},{suffix:"age",phonemes:["ɑː","ɧ"]},{suffix:"eur",phonemes:["øː","r"]},{suffix:"eum",phonemes:["eː","ɵ","m"]},{suffix:"ium",phonemes:["ɪ","ɵ","m"]}],J1=["ssion","tion","sion","itet","eri","era","ist","ör","ment","ans","ens","ell","ent","ant","ik","ur","al","ös"],X1=["för","be","ge","er","an"],Y1=new Set(["a","e","i","o","u","y","å","ä","ö","ɑ","ɛ","ɪ","ɔ","ʊ","ʉ","ʏ","œ","ø","ɵ"]),gm={t:"ʈ",d:"ɖ",s:"ʂ",n:"ɳ",l:"ɭ"},_m=new Set(["ʈ","ɖ","ʂ","ɳ"]);function Q1(s){return s=s.trim(),s=s.normalize("NFC"),s=s.toLowerCase(),s=s.replace(/\s+/g," "),s}function ym(s){return s>=97&&s<=122||s===229||s===228||s===246||s===233||s===224||s===252||s===225||s===232||s===235||s===239}function eb(s){const i=[],r=[...s];let o=0;const p=r.length;for(;o<p;){const m=r[o],y=m.codePointAt(0);if(m===" "||m==="	"||m===`
`){o++;continue}if(D1.has(m)){i.push({text:m,isPun:!0}),o++;continue}if(ym(y)){const $=o;for(;o<p&&ym(r[o].codePointAt(0));)o++;i.push({text:r.slice($,o).join(""),isPun:!1});continue}o++}return i}function po(s){let i=0,r=!1;for(const o of s)_g.has(o)?(r||i++,r=!0):r=!1;return i===0?1:i}function tb(s){for(const i of Z1)if(s.endsWith(i.suffix)&&s.length>i.suffix.length){if(i.suffix==="age"&&K1.has(s))continue;return{stem:s.slice(0,s.length-i.suffix.length),phonemes:i.phonemes,found:!0}}return{stem:"",phonemes:null,found:!1}}function nb(s){if(U1.has(s))return!0;const i=[...s];for(let r=3;r>=1;r--)if(i.length>r){const o=i.slice(0,i.length-r).join("");if(F1.has(o))return!0}return!1}function ib(s){if(W1.has(s)||s.endsWith("era")||s.endsWith("erar")||s.endsWith("erade"))return!0;const i=[...s];for(let r=3;r>=1;r--)if(i.length>r){const o=i.slice(0,i.length-r).join("");if(j1.has(o))return!0}return!1}function sb(s,i,r){const o=s.length,p=o-i,m=s[i],y=i+1<o?s[i+1]:"";if(p>=3)switch(s[i]+s[i+1]+s[i+2]){case"skj":return{ipa:["ɧ"],consumed:3};case"stj":return{ipa:["ɧ"],consumed:3};case"sch":return{ipa:["ɧ"],consumed:3};case"sng":return{ipa:["s","n"],consumed:3};case"ckj":return{ipa:["ɕ"],consumed:3}}if(p>=2){const w=s[i]+s[i+1];if(w==="sk")return p>=3&&Va.has(s[i+2])&&!G1.has(r)?{ipa:["ɧ"],consumed:2}:{ipa:["s","k"],consumed:2};if(w==="sj")return{ipa:["ɧ"],consumed:2};if(w==="sh")return{ipa:["ɧ"],consumed:2};if(w==="ch")return H1.has(r)?{ipa:["k"],consumed:2}:{ipa:["ɧ"],consumed:2};if(w==="ph")return{ipa:["f"],consumed:2};if(w==="th")return{ipa:["t"],consumed:2};if(w==="tj")return{ipa:["ɕ"],consumed:2};if(w==="kj")return{ipa:["ɕ"],consumed:2};if(w==="gn")return i===0?{ipa:["ɡ","n"],consumed:2}:{ipa:["ŋ","n"],consumed:2};if(w==="ng")return{ipa:["ŋ"],consumed:2};if(w==="nk")return{ipa:["ŋ","k"],consumed:2};if(w==="ck")return{ipa:["k"],consumed:2};if(w==="gj"&&i===0)return{ipa:["j"],consumed:2};if(w==="lj"&&i===0)return{ipa:["j"],consumed:2};if(w==="dj"&&i===0)return{ipa:["j"],consumed:2};if(w==="hj"&&i===0)return{ipa:["j"],consumed:2}}if(m==="k"&&Va.has(y))return nb(r)?{ipa:["k"],consumed:1}:{ipa:["ɕ"],consumed:1};if(m==="g"&&Va.has(y))return ib(r)?{ipa:["ɡ"],consumed:1}:{ipa:["j"],consumed:1};if(m==="g")return{ipa:["ɡ"],consumed:1};if(m==="c")return y==="e"||y==="i"?{ipa:["s"],consumed:1}:{ipa:["k"],consumed:1};if(m==="x")return{ipa:["k","s"],consumed:1};const $=N1[m];return $!==void 0?$.length>1?{ipa:[...$],consumed:1}:{ipa:[$],consumed:1}:{ipa:[m],consumed:1}}function rb(s,i){let r=0,o=i+1;for(;o<s.length&&yg.has(s[o]);)r++,o++;return r}function qa(s,i){return s==="o"&&V1.has(i)?L1:B1[s]||s}function ab(s,i,r,o){const p=s[i];if(!o||wg.has(r)||q1.has(r))return zi[p]||p;const m=rb(s,i);return m===0&&i===s.length-1||m===2&&p!=="o"&&i+1<s.length&&s[i+1]==="r"?qa(p,r):m>=2?zi[p]||p:qa(p,r)}function wm(s,i,r){const o=[...s],p=o.length,m=[];let y=0,$=0,w=!1;for(;y<p;){const I=o[y];if(_g.has(I)){if(w)m.push(zi[I]||I);else{const R=$===r&&r>=0,z=ab(o,y,i,R);m.push(z),$++}w=!0,y++}else if(yg.has(I)){w=!1;const{ipa:R,consumed:z}=sb(o,y,i);m.push(...R),y+=z}else w=!1,y++}return m}const Tn=0,Ga=1,bm=2;function ob(s){const i=[];let r=Tn;for(const o of s)switch(r){case Tn:o==="r"?r=Ga:i.push(o);break;case Ga:{if(o==="r")i.push("r","r"),r=Tn;else{const p=gm[o];p?(i.push(p),r=_m.has(p)?bm:Tn):(i.push("r",o),r=Tn)}break}case bm:{const p=gm[o];p?(i.push(p),_m.has(p)||(r=Tn)):(i.push(o),r=Tn);break}}return r===Ga&&i.push("r"),i}function ub(s){if(wg.has(s))return-1;if(po(s)<=1)return 0;for(const r of J1)if(s.endsWith(r)&&s.length>r.length){const o=s.slice(0,s.length-r.length);return po(o)}for(const r of X1)if(s.startsWith(r)&&s.length>r.length+1)return 1;return 0}function $m(s){for(const i of s)if(Y1.has(i))return!0;return!1}function lb(s,i){if(i<0||s.length===0)return s;let r=0,o=-1,p=!1;for(let $=0;$<s.length;$++){const w=$m(s[$]);if(w&&!p){if(r===i){o=$;break}r++}p=w}if(o<0)return s;let m=o;for(;m>0&&!$m(s[m-1]);)m--;return i===0&&(m=0),[...s.slice(0,m),"ˈ",...s.slice(m)]}function db(s){if(!s)return[];const i=ub(s);let r;const o=tb(s);if(o.found){const m=po(o.stem),y=i>=m?-1:i;r=[...wm(o.stem,s,y),...o.phonemes]}else r=wm(s,s,i);let p=ob(r);return p=lb(p,i),p}class cb{constructor(i={}){this._options=i}get languageCode(){return"sv"}phonemize(i){if(i=Ve(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=this._phonemizeInternal(i);return{tokens:r.tokens,prosody:new Array(r.tokens.length).fill(null)}}phonemizeWithProsody(i){return i=Ve(i),!i||typeof i!="string"?{tokens:[],prosody:[]}:this._phonemizeInternal(i)}_phonemizeInternal(i){const r=Q1(i),o=eb(r),p=[],m=[];let y=!1;for(const $ of o)if($.isPun)for(const w of $.text)p.push(w),m.push({a1:0,a2:0,a3:0});else{y&&(p.push(" "),m.push({a1:0,a2:0,a3:0}));const w=db($.text);let I=0;for(const R of w)R!=="ˈ"&&R!=="ˌ"&&I++;for(const R of w){let z=0;R==="ˈ"&&(z=2),p.push(R),m.push({a1:0,a2:z,a3:I})}y=!0}return{tokens:p,prosody:m}}}const bg=44032,pb=55203,hb=19,ho=21,Hn=28,fb="",mb="",gb="",_b="",yb="",wb="",bb="",$b="",vb="",xb="",Ti="",An="",Ha="",Eb="ɾ",kb="ŋ",Ka="ɛ",Za="ʌ",Sb="ɯ",Ib="ɰ",Tb=["k",$b,"n","t",bb,Eb,"m","p",wb,"s",vb,null,_b,xb,yb,gb,mb,fb,"h"],Ab=[["a",null],[Ka,null],["j","a"],["j",Ka],[Za,null],["e",null],["j",Za],["j","e"],["o",null],["w","a"],["w",Ka],["w","e"],["j","o"],["u",null],["w",Za],["w","e"],["w","i"],["j","u"],[Sb,null],[Ib,"i"],["i",null]],$g=[{ph:null,liaisonInitial:-1,residualFinal:0},{ph:Ti,liaisonInitial:0,residualFinal:0},{ph:Ti,liaisonInitial:1,residualFinal:0},{ph:Ti,liaisonInitial:9,residualFinal:1},{ph:"n",liaisonInitial:-1,residualFinal:0},{ph:"n",liaisonInitial:12,residualFinal:4},{ph:"n",liaisonInitial:-1,residualFinal:0},{ph:An,liaisonInitial:3,residualFinal:0},{ph:"l",liaisonInitial:5,residualFinal:0},{ph:Ti,liaisonInitial:0,residualFinal:8},{ph:"m",liaisonInitial:6,residualFinal:8},{ph:"l",liaisonInitial:7,residualFinal:8},{ph:"l",liaisonInitial:9,residualFinal:8},{ph:"l",liaisonInitial:16,residualFinal:8},{ph:"l",liaisonInitial:17,residualFinal:8},{ph:"l",liaisonInitial:-1,residualFinal:0},{ph:"m",liaisonInitial:-1,residualFinal:0},{ph:Ha,liaisonInitial:7,residualFinal:0},{ph:Ha,liaisonInitial:9,residualFinal:17},{ph:An,liaisonInitial:9,residualFinal:0},{ph:An,liaisonInitial:10,residualFinal:0},{ph:kb,liaisonInitial:-1,residualFinal:0},{ph:An,liaisonInitial:12,residualFinal:0},{ph:An,liaisonInitial:14,residualFinal:0},{ph:Ti,liaisonInitial:15,residualFinal:0},{ph:An,liaisonInitial:16,residualFinal:0},{ph:Ha,liaisonInitial:17,residualFinal:0},{ph:An,liaisonInitial:-1,residualFinal:0}],zb=new Set([",",".",";",":","!","?","。","，","！","？","、"]);function vm(s){return s>=bg&&s<=pb}function Cb(s){const i=s-bg,r=Math.floor(i/(ho*Hn)),o=Math.floor(i%(ho*Hn)/Hn),p=i%Hn;return{initial:r,medial:o,final_:p}}function Ob(s){return s>=4352&&s<=4370}function Mb(s){return s>=4449&&s<=4469}function Rb(s){return s>=4520&&s<=4546}function Pb(s){const i=[],r=s.length;let o=0;for(;o<r;)if(Ob(s[o])&&o+1<r&&Mb(s[o+1])){const p=s[o]-4352,m=s[o+1]-4449;let y;o+2<r&&Rb(s[o+2])?(y=s[o+2]-4520+1,o+=3):(y=0,o+=2);const $=(p*21+m)*28+y+44032;i.push($)}else i.push(s[o]),o+=1;return i}function Db(s,i){if(s.initial<hb){const r=Tb[s.initial];r!==null&&i.push(r)}if(s.medial<ho){const[r,o]=Ab[s.medial];i.push(r),o!==null&&i.push(o)}if(s.final_>0&&s.final_<Hn){const r=$g[s.final_];r.ph!==null&&i.push(r.ph)}}function Bb(s,i){if(s.length===0)return;const r=s.map(o=>Cb(o));for(let o=0;o<r.length-1;o++){const p=r[o].final_;if(p===0||p>=Hn||r[o+1].initial!==11)continue;const m=$g[p];m.liaisonInitial<0||(r[o+1].initial=m.liaisonInitial,r[o].final_=m.residualFinal)}for(const o of r)Db(o,i)}function xm(s){if(!s)return[];let i=[];for(const y of s)i.push(y.codePointAt(0));i=Pb(i);const r=[];let o=!1;const p=i.length;let m=0;for(;m<p;){const y=i[m],$=String.fromCodePoint(y);if($===" "||$==="	"||$===`
`||$==="\r"){o=!0,m++;continue}if(zb.has($)){r.push($),o=!1,m++;continue}if(vm(y)){o&&r.length>0&&r.push(" ");const w=m;for(;m<p&&vm(i[m]);)m++;Bb(i.slice(w,m),r),o=!0;continue}if(y>=65&&y<=90||y>=97&&y<=122){o&&r.length>0&&r.push(" "),r.push($.toLowerCase()),o=!0,m++;continue}m++}return r}class Lb{constructor(i={}){this._options=i}get languageCode(){return"ko"}phonemize(i){if(i=Ve(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=xm(i),o=new Array(r.length).fill(null);return{tokens:r,prosody:o}}phonemizeWithProsody(i){if(i=Ve(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=xm(i),o=r.map(()=>({a1:0,a2:0,a3:0}));return{tokens:r,prosody:o}}}const Nb=1,Ub=["å","Å"],Fb=["och","att","jag","det","den","inte","som","han","hon","var","har","kan","ska","med","för","sig","sin","min","din","vill","från","när","här","där","också","alla","denna","efter","eller","under","utan","mycket","mellan","genom","bara","sedan","redan","aldrig","alltid","igen","något","några","varje","vilken","vilket","är"],Wb={schema_version:Nb,strong_chars:Ub,function_words:Fb};function jb(s){const i=new Set,r=new Set;if(!s||typeof s!="object")return{functionWords:i,strongChars:r};if(Array.isArray(s.function_words))for(const o of s.function_words)typeof o=="string"&&o&&i.add(o.toLowerCase());if(Array.isArray(s.strong_chars)){for(const o of s.strong_chars)if(typeof o=="string"&&o)for(const p of o)r.add(p)}return{functionWords:i,strongChars:r}}const{functionWords:Vb,strongChars:qb}=jb(Wb),Gb=new Map([[12289,","],[12290,"."],[65377,"."],[65380,","]]);function To(s){return s>=12288&&s<=12351||s>=65280&&s<=65312||s>=65339&&s<=65344||s>=65371&&s<=65380||s>=65504&&s<=65519}function Hb(s){const i=s.codePointAt(0);return To(i)?i>=65281&&i<=65374?String.fromCodePoint(i-65248):Gb.get(i)??" ":s}function Kb(s){let i=!1;for(const o of s)if(To(o.codePointAt(0))){i=!0;break}if(!i)return s;let r="";for(const o of s)r+=Hb(o);return r}class Em{constructor(i=["ja","en","zh","es","fr","pt","sv"],r={}){this.languages=new Set(i),this.defaultLatinLanguage=r.defaultLatinLanguage||"en",this._hasJa=this.languages.has("ja"),this._hasZh=this.languages.has("zh"),this._hasKo=this.languages.has("ko"),this._hasSv=this.languages.has("sv");const o=new Set;for(const p of this.languages)(p==="en"||p==="es"||p==="pt"||p==="fr"||p==="sv")&&o.add(p);this._detectSwedish=this._hasSv&&o.size>=2}_isKana(i){return i>=12352&&i<=12447||i>=12448&&i<=12543||i>=12784&&i<=12799}_isCJK(i){return i>=19968&&i<=40959||i>=13312&&i<=19903||i>=63744&&i<=64255}_isHangul(i){return i>=44032&&i<=55215||i>=4352&&i<=4607||i>=12592&&i<=12687}_isFullwidthLatin(i){return i>=65313&&i<=65338||i>=65345&&i<=65370}_isHalfwidthScript(i){return i>=65381&&i<=65503}_isLatin(i){return i>=65&&i<=90||i>=97&&i<=122||i>=192&&i<=214||i>=216&&i<=246||i>=248&&i<=255}hasKana(i){for(const r of i)if(this._isKana(r.codePointAt(0)))return!0;return!1}detectChar(i,r=!1){const o=i.codePointAt(0);return this._isKana(o)?this._hasJa?"ja":null:this._isHangul(o)?this._hasKo?"ko":null:this._isCJK(o)?this._hasJa&&this._hasZh?r?"ja":"zh":this._hasJa?"ja":this._hasZh?"zh":null:this._isFullwidthLatin(o)?this.languages.has(this.defaultLatinLanguage)?this.defaultLatinLanguage:null:To(o)?null:this._isHalfwidthScript(o)?this._hasJa?"ja":null:this._isLatin(o)&&this.languages.has(this.defaultLatinLanguage)?this.defaultLatinLanguage:null}detectLanguage(i){const r=this.segmentText(i);if(r.length===0)return this.defaultLatinLanguage;const o=new Map;for(const y of r){const $=o.get(y.language)||0;o.set(y.language,$+y.text.length)}let p=this.defaultLatinLanguage,m=0;for(const[y,$]of o)$>m&&(m=$,p=y);return o.size<=1&&p===this.defaultLatinLanguage&&m>0&&console.debug(`[g2p/detect] Latin-only text detected -- defaulting to '${p}'. If this text is ES, FR, PT, or SV, pass options.language explicitly.`),p}segmentText(i){if(!i||!i.trim())return[];const r=this.hasKana(i),o=[];let p=null,m=[];for(const y of i){const $=this.detectChar(y,r);$!==null&&$!==p&&p!==null&&(o.push({language:p,text:m.join("")}),m=[]),$!==null&&(p=$),m.push(y)}return m.length>0&&p!==null&&o.push({language:p,text:m.join("")}),o.length===0&&i.trim()&&o.push({language:this.defaultLatinLanguage,text:i}),this._detectSwedish?this._refineLatinSegmentsForSwedish(o):o}_refineLatinSegmentsForSwedish(i){const r=this.defaultLatinLanguage;if(r==="sv")return i;const o=[];for(const p of i){if(p.language!==r){o.push(p);continue}let m=!1;for(const y of p.text.split(/\s+/)){const $=Zb(y).toLowerCase();if(!$)continue;if(Vb.has($)){m=!0;break}let w=!1;for(const I of $)if(qb.has(I)){w=!0;break}if(w){m=!0;break}}o.push(m?{language:"sv",text:p.text}:p)}return o}}function Zb(s){const i=new Set([".",",",";",":","!","?"]);let r=0,o=s.length;for(;r<o&&i.has(s[r]);)r+=1;for(;o>r&&i.has(s[o-1]);)o-=1;return s.slice(r,o)}const km=2;function Jb(s){return s==null?{compatible:!0}:s===km?{compatible:!0}:{compatible:!1,message:`PUA version mismatch: model has pua_compat_version=${s}, but @piper-plus/g2p expects version ${km}. Some phoneme tokens may not encode correctly.`}}const Gs={"a:":"","i:":"","u:":"","e:":"","o:":"",cl:"",ky:"",kw:"",gy:"",gw:"",ty:"",dy:"",py:"",by:"",ch:"",ts:"",sh:"",zy:"",hy:"",ny:"",my:"",ry:"","?!":"","?.":"","?~":"",N_m:"",N_n:"",N_ng:"",N_uvular:"",rr:"",y_vowel:"",pʰ:"",tʰ:"",kʰ:"",tɕ:"",tɕʰ:"",tʂ:"",tʂʰ:"",tsʰ:"",aɪ:"",eɪ:"",aʊ:"",oʊ:"",an:"",ən:"",aŋ:"",əŋ:"",uŋ:"",ia:"",iɛ:"",iou:"",iaʊ:"",iɛn:"",in:"",iaŋ:"",iŋ:"",iuŋ:"",ua:"",uo:"",uaɪ:"",ueɪ:"",uan:"",uən:"",uaŋ:"",uəŋ:"",yɛ:"",yɛn:"",yn:"",ɻ̩:"",tone1:"",tone2:"",tone3:"",tone4:"",tone5:"",p͈:"",t͈:"",k͈:"",s͈:"",t͈ɕ:"",k̚:"",t̚:"",p̚:"",tʃ:"",dʒ:"",ɛ̃:"",ɑ̃:"",ɔ̃:"",iː:"",yː:"",eː:"",ɛː:"",øː:"",ɑː:"",oː:"",uː:"",ʉː:"",ɔɪ:"",œ̃:"",ɐ̃:""},Xb=Object.create(null);for(const[s,i]of Object.entries(Gs))Xb[i]=s;function Yb(s){return Gs[s]??s}class Qb{constructor(i,r={}){if(!i||typeof i!="object")throw new Error("phonemeIdMap is required and must be an object");this._map=i,this._strict=r.strict===!0,this._lookupMap=new Map;for(const[o,p]of Object.entries(i))this._lookupMap.set(o,p);for(const[o,p]of Object.entries(Gs))if(!this._lookupMap.has(o)){const m=i[p];m&&this._lookupMap.set(o,m)}this._bos=this._resolveId("^","BOS"),this._eos=this._resolveId("$","EOS"),this._pad=this._resolveId("_","PAD")}_resolveId(i,r){const o=this._lookupMap.get(i);if(!o||o.length===0)throw new Error(`phonemeIdMap is missing required '${i}' (${r}) entry`);return o[0]}_lookupToken(i){return this._lookupMap.get(i)??null}encode(i){const r=[this._bos],o=new Set;for(let p=0;p<i.length;p++){const m=this._lookupToken(i[p]);if(m)r.push(...m);else{if(this._strict)throw new Error(`Unknown phoneme symbol "${i[p]}" not in phonemeIdMap`);o.add(i[p])}r.push(this._pad)}return r.push(this._eos),{phonemeIds:r,droppedSymbols:[...o]}}encodeWithProsody(i,r){if(!r)return{...this.encode(i),prosodyFlat:null};if(r.length!==i.length)throw new Error(`prosody length (${r.length}) must match tokens length (${i.length})`);const o=[],p=[],m=new Set;o.push(this._bos),p.push(0,0,0);for(let y=0;y<i.length;y++){const $=r[y],w=$?$.a1:0,I=$?$.a2:0,R=$?$.a3:0,z=this._lookupToken(i[y]);if(z)for(const M of z)o.push(M),p.push(w,I,R);else{if(this._strict)throw new Error(`Unknown phoneme symbol "${i[y]}" not in phonemeIdMap`);m.add(i[y])}o.push(this._pad),p.push(0,0,0)}return o.push(this._eos),p.push(0,0,0),{phonemeIds:o,prosodyFlat:p,droppedSymbols:[...m]}}}const Sm=1e5,Im=Object.freeze({none:0,"x-weak":100,weak:200,medium:400,strong:700,"x-strong":1e3}),Tm=Object.freeze({"x-slow":1.5,slow:1.25,medium:1,fast:.8,"x-fast":.6}),e$=/^\s*<speak[\s>]/s;function vg(s){return typeof s!="string"?!1:e$.test(s)}function t$(s){const i=s.trim().toLowerCase();if(i.endsWith("ms")){const o=parseFloat(i.slice(0,-2));return Number.isFinite(o)?Math.trunc(o):0}if(i.endsWith("s")){const o=parseFloat(i.slice(0,-1));return Number.isFinite(o)?Math.trunc(o*1e3):0}const r=parseFloat(i);return Number.isFinite(r)?Math.trunc(r):0}function n$(s){const i=s.trim().toLowerCase();if(i in Tm)return Tm[i];if(i.endsWith("%")){const o=parseFloat(i.slice(0,-1));return Number.isFinite(o)&&o>0?100/o:1}const r=parseFloat(i);return Number.isFinite(r)&&r>0?r:1}function i$(s){const i=s.indexOf("}");return i>=0?s.slice(i+1):s}const Am=Object.freeze({amp:"&",lt:"<",gt:">",quot:'"',apos:"'"});function xg(s){return s.replace(/&([a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);/g,(i,r)=>{if(r.startsWith("#x")){const o=parseInt(r.slice(2),16);return Number.isFinite(o)?String.fromCodePoint(o):i}if(r.startsWith("#")){const o=parseInt(r.slice(1),10);return Number.isFinite(o)?String.fromCodePoint(o):i}return r in Am?Am[r]:i})}function zm(s){const i={},r=/([a-zA-Z_:][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)')/g;let o;for(;(o=r.exec(s))!==null;){const p=o[1],m=o[3]!==void 0?o[3]:o[4];i[p]=xg(m)}return i}function s$(s){const i=[];let r=0;const o=s.length;for(;r<o;){if(s[r]!=="<"){let M=s.indexOf("<",r);M===-1&&(M=o);const D=s.slice(r,M);i.push({kind:"text",text:xg(D)}),r=M;continue}if(s.startsWith("<!--",r)){const M=s.indexOf("-->",r+4);if(M===-1)throw new SyntaxError("unterminated comment");r=M+3;continue}if(s.startsWith("<![CDATA[",r)){const M=s.indexOf("]]>",r+9);if(M===-1)throw new SyntaxError("unterminated CDATA");i.push({kind:"text",text:s.slice(r+9,M)}),r=M+3;continue}if(s.startsWith("<?",r)){const M=s.indexOf("?>",r+2);if(M===-1)throw new SyntaxError("unterminated processing instruction");r=M+2;continue}if(s.startsWith("<!",r))throw new SyntaxError("DTD / declaration not supported");const p=s.indexOf(">",r+1);if(p===-1)throw new SyntaxError("unterminated tag");let m=s.slice(r+1,p);r=p+1;let y=!1,$=!1;if(m.startsWith("/")&&(y=!0,m=m.slice(1)),m.endsWith("/")&&($=!0,m=m.slice(0,-1)),m=m.trim(),m.length===0)throw new SyntaxError("empty tag");const w=m.search(/\s/),I=w===-1?m:m.slice(0,w),R=w===-1?"":m.slice(w),z=i$(I);if(y){if(R.trim().length>0)throw new SyntaxError(`close tag with attributes: ${z}`);i.push({kind:"close",name:z})}else $?i.push({kind:"self",name:z,attrs:zm(R)}):i.push({kind:"open",name:z,attrs:zm(R)})}return i}function r$(s){if(s.time!==void 0)return t$(s.time);if(s.strength!==void 0){const i=s.strength.toLowerCase();return Im[i]??400}return Im.medium}function a$(s){const i=[],r=[];let o=1;for(const p of s)if(p.kind==="text"){const m=p.text.trim();m&&i.push({text:m,breakMs:0,rate:o})}else if(p.kind==="open"){const m=o;p.name==="prosody"&&p.attrs.rate!==void 0&&(o=n$(p.attrs.rate)),r.push({name:p.name,prevRate:m})}else if(p.kind==="self")p.name==="break"?i.push({text:"",breakMs:r$(p.attrs),rate:o}):p.name==="prosody"&&p.attrs.rate;else if(p.kind==="close"){let m;for(;r.length>0&&(m=r.pop(),m.name!==p.name););if(m===void 0)throw new SyntaxError(`unmatched close tag: ${p.name}`);o=m.prevRate}if(r.length>0){const p=r.map(m=>m.name).join(", ");throw new SyntaxError(`unclosed tag(s): ${p}`)}return i}function o$(s){return s.filter(i=>i.text.trim().length>0||i.breakMs>0)}function Cm(s){let i=s,r;do r=i,i=i.replace(/<[^>]*>/g,"");while(i!==r);return i.trim()}function Eg(s){if(typeof s!="string")throw new TypeError("parseSsml: expected a string");if(!vg(s))return[{text:s,breakMs:0,rate:1}];if(s.length>Sm)throw new RangeError(`SSML input too large: ${s.length} bytes (max: ${Sm})`);let i;try{i=s$(s)}catch{return[{text:Cm(s)||s,breakMs:0,rate:1}]}let r;try{r=a$(i)}catch{return[{text:Cm(s)||s,breakMs:0,rate:1}]}const o=o$(r);return o.length>0?o:[{text:"",breakMs:0,rate:1}]}const Ja=["ja","en","zh","ko","es","fr","pt","pt-PT","sv"],u$={en:s=>new bo({cmuDict:s.cmuDict}),ko:()=>new Lb,es:()=>new Uw,fr:()=>new l1,pt:()=>new mg,"pt-PT":()=>new P1,sv:()=>new cb},l$=new Set(["en","es","fr","pt","pt-PT","sv"]),d$=new Set(["^","$","?",...["?!","?.","?~"].flatMap(s=>[s,Yb(s)])]);class Ao{constructor(i,r,o=null){this._phonemizers=i,this._detector=r,this._zhDetector=o,this._disposed=!1}static async create(i={}){const r=i.languages?i.languages.filter(y=>Ja.includes(y)):[...Ja];if(r.length===0)throw new Error(`G2P.create(): no valid languages specified. Supported languages: ${Ja.join(", ")}`);const o=new Map,p=new Em(r);if(r.includes("ja")){const y=new oy({openjtalkModule:i.openjtalkModule,jaDict:i.jaDict});await y.initialize(),o.set("ja",y)}let m=null;if(r.includes("zh")){const y=i.pinyinDict?Ds(i.pinyinDict):await Vm();o.set("zh",new kw({pinyinDict:y})),m=new Em(r,{defaultLatinLanguage:r.includes("en")?"en":"zh"})}for(const y of r){if(y==="ja"||y==="zh")continue;const $=u$[y];if($){const w=$(i);typeof w.initialize=="function"&&await w.initialize(),i.customDicts&&typeof w.setCustomDicts=="function"&&w.setCustomDicts(i.customDicts),o.set(y,w)}}return new Ao(o,p,m)}phonemize(i,r={}){this._ensureNotDisposed(),i=Ve(i);const o=this._resolveLanguage(i,r),p=this._getPhonemizerOrThrow(o),m=o==="zh"?this._phonemizeChineseText(i):p.phonemize(this._prepareText(i,o));return{tokens:m.tokens,prosody:new Array(m.tokens.length).fill(null),language:o}}phonemizeWithProsody(i,r={}){this._ensureNotDisposed(),i=Ve(i);const o=this._resolveLanguage(i,r),p=this._getPhonemizerOrThrow(o);if(o==="zh"){const y=this._phonemizeChineseText(i);return{tokens:y.tokens,prosody:y.prosody,language:o}}if(i=this._prepareText(i,o),typeof p.phonemizeWithProsody=="function"){const y=p.phonemizeWithProsody(i);return{tokens:y.tokens,prosody:y.prosody,language:o}}const m=p.phonemize(i);return{tokens:m.tokens,prosody:new Array(m.tokens.length).fill(null),language:o}}encode(i,r,o={}){this._ensureNotDisposed();const{tokens:p,prosody:m}=this.phonemizeWithProsody(i,o);return new Qb(r).encodeWithProsody(p,m)}detectLanguage(i){return this._ensureNotDisposed(),i=Ve(i),this._detector.detectLanguage(i)}segmentText(i){return this._ensureNotDisposed(),i=Ve(i),this._detector.segmentText(i)}dispose(){if(!this._disposed){this._disposed=!0;for(const[,i]of this._phonemizers)typeof i.dispose=="function"&&i.dispose();this._phonemizers.clear()}}_resolveLanguage(i,r){return r.language?r.language:this._detector.detectLanguage(i)}_phonemizeChineseText(i){const r=this._getPhonemizerOrThrow("zh");if(typeof i!="string"||!this._zhDetector)return r.phonemizeWithProsody(i);const o=this._zhDetector.segmentText(i),p=o.some(w=>w.language==="zh"),m=r.isZhEnDispatchEnabled()===!0,y=[],$=[];return o.forEach((w,I)=>{var G,K;const R=w.language,z=this._prepareText(w.text,R),M=((G=o[I-1])==null?void 0:G.language)==="zh"||((K=o[I+1])==null?void 0:K.language)==="zh";if(m&&R==="en"&&p&&M){const J=r.phonemizeEmbeddedEnglishWithProsody(z);y.push(...J.tokens),$.push(...J.prosody);return}const D=this._getPhonemizerOrThrow(R),j=typeof D.phonemizeWithProsody=="function"?D.phonemizeWithProsody(z):D.phonemize(z);j.tokens.forEach((J,he)=>{var be;(R==="ja"?d$.has(J):J==="^"||J==="$")||(y.push(J),$.push(((be=j.prosody)==null?void 0:be[he])??null))})}),{tokens:y,prosody:$}}_prepareText(i,r){return typeof i!="string"||!l$.has(r)?i:Kb(i)}_getPhonemizerOrThrow(i){const r=this._phonemizers.get(i);if(!r){const o=[...this._phonemizers.keys()];throw new Error(`G2P: language "${i}" is not initialised. Available languages: [${o.join(", ")}]. Pass the language in G2P.create({ languages: [...] }) to enable it.`)}return r}_ensureNotDisposed(){if(this._disposed)throw new Error("G2P: instance has been disposed. Create a new instance with G2P.create().")}}const c$=/[\u000B\u000C\u0085]/g,p$=/[\u0000-\u0008\u000E-\u001F\u007F-\u0084\u0086-\u009F]/g;function zn(s){return typeof s!="string"?s:s.replace(c$," ").replace(p$,"")}const kg=256,h$=new Set([0,1,2]);function f$(s,i){if(!s||!i||i.length!==s.phonemes.length)return s;const r=[];for(let o=0;o<s.phonemes.length;o++)h$.has(i[o])||r.push(s.phonemes[o]);return s.phonemes=r,s}function m$(s,i,r=kg,o=null){var R,z;if(!Number.isFinite(i)||i<=0)throw new TypeError(`sampleRate must be a positive finite number (Hz), got ${i}`);if(!Number.isFinite(r)||r<=0)throw new TypeError(`hopLength must be a positive finite number (samples), got ${r}`);if(s==null||typeof s.length!="number")throw new TypeError("durations must be a Float32Array, Array, or indexable with a numeric length property");const p=s.length;if(o!=null){if(!Array.isArray(o))throw new TypeError("phonemeTokens must be an array of strings");if(o.length!==p)throw new RangeError(`length mismatch: durations has ${p} elements but phonemeTokens has ${o.length}`)}const m=r/i*1e3,y=new Array(p);let $=0,w=0;const I=o!=null;for(let M=0;M<p;M++){const D=s[M];D<0&&((z=(R=globalThis.console)==null?void 0:R.warn)==null||z.call(R,`negative phoneme duration clamped to 0 (index=${M}, value=${D})`));const G=Math.ceil(D>0?D:0)*m,K=$,J=$+G,he=I?o[M]:`ph_${M}`;y[M]={phoneme:he,start_ms:K,end_ms:J,duration_ms:G},$=J,w+=G}return{phonemes:y,total_duration_ms:w,sample_rate:i}}function g$(s,i=null){const r={};if(!s)return r;const o=Object.entries(s).sort(([p],[m])=>p<m?-1:p>m?1:0);for(const[p,m]of o){if(!Array.isArray(m))continue;let y=p;if(i&&i[p]!==void 0)y=i[p];else if(p.length===1){const $=p.charCodeAt(0);$>=57344&&$<=63743&&(y=`U+${$.toString(16).toUpperCase().padStart(4,"0")}`)}for(const $ of m)typeof $=="number"&&!($ in r)&&(r[$]=y)}return r}class zo{constructor(i,r,o="not-requested"){this._wasm=i,this._languages=r,this._disposed=!1,this._japaneseDictionaryStatus=o}get japaneseDictionaryStatus(){return this._japaneseDictionaryStatus}static async create(i,r={}){let o;if(r.wasmLoader)o=await r.wasmLoader();else{const $=r.wasmUrl;if(!$)throw new Error("Either wasmUrl or wasmLoader must be provided");o=await jt(()=>import($),[],import.meta.url),await o.default()}const p=new o.WasmPhonemizer(i);if(typeof p.setChineseDictionary=="function")try{const $=r.zhDictBaseUrl||new URL("../../assets/",self.location).href,[w,I]=await Promise.all([fetch(new URL("pinyin_single.json",$)),fetch(new URL("pinyin_phrases.json",$))]);if(w.ok&&I.ok){const R=new Uint8Array(await w.arrayBuffer()),z=new Uint8Array(await I.arrayBuffer());p.setChineseDictionary(R,z)}else console.warn("[piper-plus] Chinese pinyin dictionaries not found, zh will use passthrough")}catch($){console.warn("[piper-plus] Failed to load Chinese dictionaries:",$.message)}const m=r.jaDict?await y$(p,r.jaDict):"not-requested",y=typeof p.getSupportedLanguages=="function"?Array.from(p.getSupportedLanguages()):["ja","en","zh","ko","es","fr","pt","sv"];return new zo(p,y,m)}async loadEnglishDictionary(i){if(typeof this._wasm.setEnglishDictionary!="function")return"unsupported";if(typeof i!="function")return console.warn("[piper-plus] @piper-plus/g2p has no loadCmuDict (CMU dictionary); digits and Latin words inside Chinese text are read letter by letter. Update @piper-plus/g2p."),"failed";try{const r=await i(),o=JSON.stringify(Object.fromEntries(r));return this._wasm.setEnglishDictionary(new TextEncoder().encode(o)),"loaded"}catch(r){return console.warn("[piper-plus] Failed to load the English dictionary into the Rust WASM G2P; English inside Chinese text will use passthrough:",r.message),"failed"}}encode(i,r){const o=this._wasm.phonemize(i,r);try{const p=Array.from(o.phonemeIds);let m=null;const y=o.prosodyFeatures;if(y&&y.length>0){m=[];for(let I=0;I<y.length;I+=3)m.push([y[I],y[I+1],y[I+2]])}const $=o.droppedSymbols,w=$===void 0?null:Array.from($);return{phonemeIds:p,prosodyFeatures:m,droppedSymbols:w}}finally{o.free()}}detectLanguage(i){return this._wasm.detectLanguage(i)}get supportedLanguages(){return this._languages}dispose(){this._disposed||(this._disposed=!0,this._wasm.free())}}async function _$(s){if(typeof crypto>"u"||!crypto.subtle)return null;const i=await crypto.subtle.digest("SHA-256",s);return Array.from(new Uint8Array(i)).map(r=>r.toString(16).padStart(2,"0")).join("")}async function y$(s,i){if(typeof s.setJapaneseDictionary!="function")return console.warn("[piper-plus] jaDict was provided but this WASM build bundles its own Japanese dictionary; the option has no effect."),"unsupported";try{const r=await fetch(i.url);if(!r.ok)return console.warn(`[piper-plus] Japanese dictionary fetch failed (${r.status}); ja will use passthrough.`),"failed";const o=await r.arrayBuffer();if(i.sha256){const p=await _$(o);if(p===null)console.warn("[piper-plus] crypto.subtle unavailable -- skipping Japanese dictionary integrity check. Serve over HTTPS for full verification.");else if(p!==i.sha256)return console.warn(`[piper-plus] Japanese dictionary SHA-256 mismatch (expected ${i.sha256}, got ${p}); ja will use passthrough.`),"failed"}return s.setJapaneseDictionary(new Uint8Array(o)),"loaded"}catch(r){return console.warn("[piper-plus] Failed to load Japanese dictionary:",r.message),"failed"}}class Co{constructor(i,r,o){this._g2p=i,this._phonemeIdMap=r,this._languages=o,this._disposed=!1}static async create(i,r,o={}){const p=await Ao.create({languages:i,...o});return new Co(p,r,i)}encode(i,r){const o=this._g2p.encode(i,this._phonemeIdMap,{language:r});let p=null;if(o.prosodyFlat&&o.prosodyFlat.length>0){const $=o.prosodyFlat;p=[];for(let w=0;w<$.length;w+=3)p.push([$[w],$[w+1],$[w+2]])}const m={phonemeIds:o.phonemeIds,prosodyFeatures:p};if(Array.isArray(o.droppedSymbols))return m.droppedSymbols=o.droppedSymbols,m;let y;return Object.defineProperty(m,"droppedSymbols",{enumerable:!0,get:()=>y??(y=this._findDroppedSymbols(i,r))}),m}_findDroppedSymbols(i,r){const o=this._phonemeIdMap,{tokens:p}=this._g2p.phonemizeWithProsody(i,{language:r}),m=p.filter(y=>!Object.hasOwn(o,y)&&!Object.hasOwn(o,Gs[y]??""));return[...new Set(m)]}detectLanguage(i){return this._g2p.detectLanguage(i)}get supportedLanguages(){return this._languages}dispose(){this._disposed||(this._disposed=!0,this._g2p.dispose())}}class w${constructor({phonemizers:i,fallback:r,detector:o}){this._phonemizers=i,this._fallback=r||null,this._detector=o||null,this._disposed=!1}encode(i,r){const o=r||this.detectLanguage(i),p=this._phonemizers.get(o)||this._fallback;if(!p)throw new Error(`No phonemizer registered for language "${o}" and no fallback configured`);return p.encode(i,o)}detectLanguage(i){if(this._detector)return this._detector.detectLanguage(i);const r=this._phonemizers.values().next().value;if(r)return r.detectLanguage(i);if(this._fallback)return this._fallback.detectLanguage(i);throw new Error("No phonemizers registered")}get supportedLanguages(){const i=new Set;for(const[r]of this._phonemizers)i.add(r);if(this._fallback)for(const r of this._fallback.supportedLanguages)i.add(r);return[...i]}dispose(){if(this._disposed)return;this._disposed=!0;const i=new Set;for(const r of this._phonemizers.values())i.has(r)||(i.add(r),r.dispose());this._fallback&&!i.has(this._fallback)&&this._fallback.dispose()}}const Ls=15,b$=3,Sg=0,vs=256,Om=.01,qn=2205;function Mm(s,i){const r=s.length;if(r-2<b$)return{phonemeIds:s,prosodyFeatures:i,wasPadded:!1,frontPad:0,backPad:0};if(r>=Ls)return{phonemeIds:s,prosodyFeatures:i,wasPadded:!1,frontPad:0,backPad:0};const p=Ls-r,m=Math.floor(p/2),y=p-m,$=s.slice(0,1),w=s.slice(1,-1),I=s.slice(-1),R=[...$,...new Array(m).fill(0),...w,...new Array(y).fill(0),...I];let z=null;if(i!=null){const M=i.slice(0,1),D=i.slice(1,-1),j=i.slice(-1);z=[...M,...new Array(m).fill(null).map(()=>[0,0,0]),...D,...new Array(y).fill(null).map(()=>[0,0,0]),...j]}return{phonemeIds:R,prosodyFeatures:z,wasPadded:!0,frontPad:m,backPad:y}}function $$(s,i,r,o,p,m=Sg){if(r<=0&&o<=0||i==null||p<=0)return s;const y=1+r+o+1;if(i.length<y)return s;let $=0;for(let J=0;J<1+r;J++)$+=i[J];const w=Math.trunc($*p);let I=0;if(o>0){const J=i.length-1-o;for(let he=J;he<i.length-1;he++)I+=i[he]}const R=Math.trunc(I*p),z=i[i.length-1],M=Math.max(0,z-m),D=R+Math.trunc(M*p),j=s.length,G=Math.max(0,w);let K=j-D;return K<G&&(K=G),G>=j||K<=0||G>=K?s:s.subarray(G,K)}function v$(s,i,r,o=Sg){if(r<=0||i==null||i.length===0)return s;const p=i[i.length-1],m=Math.ceil(p),y=Math.max(0,m-o);if(y<=0)return s;const $=Math.trunc(y*r);return $>=s.length?s:s.subarray(0,s.length-$)}function Rm(s,i=256){const r=s.length;if(r<=qn)return s;const o=Math.floor(r/i);if(o===0)return s;let p=-1,m=-1;for(let R=0;R<o;R++){const z=R*i;let M=0;for(let j=0;j<i;j++){const G=s[z+j];M+=G*G}Math.sqrt(M/i)>Om&&(p<0&&(p=R),m=R)}const y=r%i;if(y>0){const R=o*i;let z=0;for(let D=0;D<y;D++){const j=s[R+D];z+=j*j}Math.sqrt(z/y)>Om&&(p<0&&(p=o),m=o)}if(p<0)return s.slice(0,qn);let $=p*i,w=Math.min((m+1)*i,r);if(w-$<qn){const R=Math.floor(($+w)/2),z=Math.floor(qn/2);$=Math.max(0,R-z),w=Math.min(r,$+qn),$=Math.max(0,w-qn)}return s.slice($,w)}function Pm(s,i,r){if(s>=Ls)return{noiseScale:i,noiseW:r};const o=Math.min(1,s/Ls);return{noiseScale:i*Math.max(.5,o),noiseW:r*Math.max(.4,o)}}const Ci=.4,Oi=1,Mi=.5,xs=22050,Xa=100,x$=1,E$=2,k$=8,S$=2,I$=Ci,T$=Oi,A$=Mi,z$=/[\u3040-\u30FF]/,C$=/[\u3400-\u9FFF]/;class Oo{constructor(){this._session=null,this._config=null,this._phonemizer=null,this._unavailableLanguages=new Map,this._loadWasmEnglishDictionary=null,this._ort=null,this._initialized=!1,this._warmupPromise=null,this._speakerInputSession=null,this._speakerInputContract=null}static async initialize(i={}){const r=new Oo;return await r._init(i),r}async synthesize(i,r={}){var Be,Ke,Et,Me,We,ye;if(i=zn(i),this._assertReady(),this._warmupPromise&&(await this._warmupPromise,this._warmupPromise=null),!i)throw new Error("text is required");if(r.speakerEmbedding!==void 0&&r.speakerEmbedding!==null&&!(r.speakerEmbedding instanceof Float32Array))throw new TypeError("options.speakerEmbedding must be a Float32Array");if(r.ssml!==!1&&vg(i))return this.synthesizeSsml(i,r);const o=r.language||this._detectLanguage(i);let p=r.noiseScale??((Be=this._config.inference)==null?void 0:Be.noise_scale)??Ci;const m=r.lengthScale??((Ke=this._config.inference)==null?void 0:Ke.length_scale)??Oi;let y=r.noiseW??((Et=this._config.inference)==null?void 0:Et.noise_w)??Mi,{phonemeIds:$,prosodyFeatures:w}=await this._textToPhonemeIds(i,o);const I=$.length,R=Pm(I,p,y);p=R.noiseScale,y=R.noiseW;const z=$,M=Mm($,w);$=M.phonemeIds,w=M.prosodyFeatures;const D=M.wasPadded,j=M.frontPad,G=M.backPad,K=await this._infer($,w,{noiseScale:p,lengthScale:m,noiseW:y,language:o,speakerEmbedding:r.speakerEmbedding});let J=K.audio;const he=K.durations;if(D)if(he!=null){const ht=((Me=this._config.audio)==null?void 0:Me.hop_size)??vs;J=$$(J,he,j,G,ht>0?ht:vs)}else J=Rm(J);else if(he!=null){const ht=((We=this._config.audio)==null?void 0:We.hop_size)??vs;J=v$(J,he,ht>0?ht:vs)}const ce=((ye=this._config.audio)==null?void 0:ye.sample_rate)??xs,be=this._createTiming(he,z);return new ks(J,ce,be)}async synthesizeSsml(i,r={}){var M,D,j,G;if(i=zn(i),this._assertReady(),this._warmupPromise&&(await this._warmupPromise,this._warmupPromise=null),typeof i!="string"||i.length===0)throw new Error("ssmlText is required");const o=Eg(i),p=((M=this._config.audio)==null?void 0:M.sample_rate)??xs,m=r.noiseScale??((D=this._config.inference)==null?void 0:D.noise_scale)??Ci,y=r.lengthScale??((j=this._config.inference)==null?void 0:j.length_scale)??Oi,$=r.noiseW??((G=this._config.inference)==null?void 0:G.noise_w)??Mi,w=[];for(const K of o){const J=zn(K.text);if(J&&J.length>0){const he=r.language||this._detectLanguage(J),{phonemeIds:ce,prosodyFeatures:be}=await this._textToPhonemeIds(J,he);if(ce.length!==0){const Be=await this._infer(ce,be,{noiseScale:m,lengthScale:y*(K.rate??1),noiseW:$,language:he});w.push(Be.audio)}}if(K.breakMs&&K.breakMs>0){const he=Math.max(0,Math.floor(K.breakMs/1e3*p));he>0&&w.push(new Float32Array(he))}}let I=0;for(const K of w)I+=K.length;const R=new Float32Array(I);let z=0;for(const K of w)R.set(K,z),z+=K.length;return new ks(R,p,null)}async synthesizeWithVoiceCloning(i,r,o={}){var ce,be,Be,Ke;if(i=zn(i),this._assertReady(),this._warmupPromise&&(await this._warmupPromise,this._warmupPromise=null),!i)throw new Error("text is required");if(!r||!(r instanceof Float32Array))throw new Error("speakerEmbedding must be a Float32Array");if(r.length===0)throw new Error("speakerEmbedding must be non-empty");const p=o.language||this._detectLanguage(i);let m=o.noiseScale??((ce=this._config.inference)==null?void 0:ce.noise_scale)??Ci;const y=o.lengthScale??((be=this._config.inference)==null?void 0:be.length_scale)??Oi;let $=o.noiseW??((Be=this._config.inference)==null?void 0:Be.noise_w)??Mi,{phonemeIds:w,prosodyFeatures:I}=await this._textToPhonemeIds(i,p);const R=w.length,z=Pm(R,m,$);m=z.noiseScale,$=z.noiseW;const M=Mm(w,I);w=M.phonemeIds,I=M.prosodyFeatures;const D=M.wasPadded,j=await this._infer(w,I,{noiseScale:m,lengthScale:y,noiseW:$,language:p,speakerEmbedding:r});let G=j.audio;const K=j.durations;D&&(G=Rm(G));const J=((Ke=this._config.audio)==null?void 0:Ke.sample_rate)??xs,he=this._createTiming(K,w);return new ks(G,J,he)}async synthesizeFromReferenceAudio({text:i,referenceWav:r,encoder:o,sampleRate:p,options:m={}}){if(i=zn(i),!i)throw new Error("text is required");if(!r)throw new Error("referenceWav is required");if(!o||typeof o.encode!="function")throw new TypeError("encoder must be an initialized SpeakerEncoder instance");const y=await o.encode(r,p);return this.synthesize(i,{...m,speakerEmbedding:y})}async findDroppedSymbols(i,r={}){if(i=zn(i),this._assertReady(),!i)throw new Error("text is required");const o=r.language||this._detectLanguage(i),{droppedSymbols:p}=await this._textToPhonemeIds(i,o);if(!Array.isArray(p))throw new Error(`The ${o} phonemizer does not report dropped symbols (outdated WASM or G2P build).`);return p}async synthesizeStreaming(i,r={}){var I,R,z;if(i=zn(i),this._assertReady(),!i)throw new Error("text is required");const o=r.language||this._detectLanguage(i),p=r.noiseScale??((I=this._config.inference)==null?void 0:I.noise_scale)??Ci,m=r.lengthScale??((R=this._config.inference)==null?void 0:R.length_scale)??Oi,y=r.noiseW??((z=this._config.inference)==null?void 0:z.noise_w)??Mi,$=r.onChunk||(()=>{});await new d_({phonemize:async M=>{const{phonemeIds:D}=await this._textToPhonemeIds(M,o);return D},synthesize:async M=>(await this._infer(M,null,{noiseScale:p,lengthScale:m,noiseW:y,language:o,speakerEmbedding:r.speakerEmbedding})).audio,onAudioChunk:$}).synthesizeAndPlay(i,o)}dispose(){this._session&&(typeof this._session.release=="function"&&this._session.release(),this._session=null),this._phonemizer&&(this._phonemizer.dispose(),this._phonemizer=null),this._sessionManager=null,this._speakerInputSession=null,this._speakerInputContract=null,this._modelUrl=null,this._warmupPromise=null,this._initialized=!1}get isInitialized(){return this._initialized}get config(){return this._config}async _init(i){const r=i.ort||globalThis.ort;if(!r)throw new Error("onnxruntime-web is required. Pass it via options.ort or load it globally.");this._ort=r;const o=i.onProgress||(()=>{});try{o({stage:"model",progress:0,message:"Resolving model..."});const m=await new E_({showModelNotice:i.showModelNotice}).resolveUrls(i.model),{modelUrl:y,configUrl:$,configFallbackUrl:w}=m;Wm(m.notice??eo(i.model),{showModelNotice:i.showModelNotice}),o({stage:"model",progress:.1,message:"Downloading config..."});let I=await fetch($);if(!I.ok&&I.status===404&&w&&(I=await fetch(w)),!I.ok)throw new Error(`Failed to fetch config: ${I.status} ${I.statusText}`);this._config=await I.json();const R=Jb(this._config.pua_compat_version);R.compatible||console.warn(`[piper-plus] ${R.message}`),o({stage:"model",progress:.3,message:"Creating ONNX session..."}),this._sessionManager=new r_({ort:r,gpu:void 0}),this._modelUrl=y,this._session=await this._sessionManager.createSession(y),this._refreshInputContract(),o({stage:"model",progress:.7,message:"Model loaded."}),o({stage:"phonemizer",progress:0,message:"Initializing phonemizer..."});let z=this._config.language_id_map?Object.keys(this._config.language_id_map):void 0;const M=new Map;let D=null;this._unavailableLanguages.clear();const j=new Set(["ja","zh"]),G=new Set(["en"]);if(z&&z.some(be=>j.has(be)))try{D=await zo.create(JSON.stringify(this._config),{wasmUrl:i.wasmG2pUrl||"../../dist/rust-wasm/piper_plus_wasm.js",wasmLoader:i.wasmLoader});const be=D.supportedLanguages;for(const Be of z)be.includes(Be)&&!G.has(Be)&&M.set(Be,D)}catch(be){const Be=z.filter(Ke=>j.has(Ke));if(z=z.filter(Ke=>!j.has(Ke)),z.length===0)throw new Error(`[piper-plus] Rust WASM G2P failed to load and the model has no other language (${Be.join(", ")}): ${be.message}. Check that options.wasmG2pUrl points to a reachable piper_plus_wasm.js.`);console.warn(`[piper-plus] Rust WASM G2P failed to load, excluding ${Be.join(", ")}:`,be.message);for(const Ke of Be)this._unavailableLanguages.set(Ke,be.message)}const J=z==null?void 0:z.filter(be=>!M.has(be)),he=!J||J.length>0;let ce=null;if(he&&(ce=await Co.create(J,this._config.phoneme_id_map),J))for(const be of J)M.set(be,ce);if(this._loadWasmEnglishDictionary=null,D&&M.get("zh")===D&&z.includes("en")){let be=null;this._loadWasmEnglishDictionary=()=>(be??(be=D.loadEnglishDictionary(jm).finally(()=>{this._loadWasmEnglishDictionary=null})),be)}this._phonemizer=new w$({phonemizers:M,fallback:ce||D,detector:D||ce}),o({stage:"phonemizer",progress:1,message:"Phonemizer ready."}),this._initialized=!0,o({stage:"ready",progress:1,message:"PiperPlus ready."})}catch(p){throw this.dispose(),p}}_detectLanguage(i){const r=this._phonemizer.detectLanguage(i),o=this._unavailableLanguages;if(o.has("ja")&&z$.test(i))return"ja";if(C$.test(i)){if(o.has("zh"))return"zh";if(o.has("ja"))return"ja"}return r}async _textToPhonemeIds(i,r){const o=this._unavailableLanguages.get(r);if(o!==void 0)throw new Error(`[piper-plus] Cannot synthesize "${r}": the Rust WASM G2P failed to load (${o}). Check that options.wasmG2pUrl points to a reachable piper_plus_wasm.js.`);return this._loadWasmEnglishDictionary&&(r||this._phonemizer.detectLanguage(i))==="zh"&&await this._loadWasmEnglishDictionary(),this._phonemizer.encode(i,r)}_getPhonemeIdToTokenMap(){var i;return this._phonemeIdToTokenMap===void 0&&(this._phonemeIdToTokenMap=g$(((i=this._config)==null?void 0:i.phoneme_id_map)??null)),this._phonemeIdToTokenMap}_createTiming(i,r){var I,R;if(!i)return null;const o=((R=(I=this._config)==null?void 0:I.audio)==null?void 0:R.sample_rate)??xs,p=this._getPhonemeIdToTokenMap(),m=Math.min(i.length,r.length),y=new Array(m);for(let z=0;z<m;z++)y[z]=p[r[z]]??`ph_${z}`;const $=m===i.length?i:i.subarray?i.subarray(0,m):Array.from(i).slice(0,m),w=m$($,o,kg,y);return f$(w,r.slice(0,m))}async _infer(i,r,{noiseScale:o,lengthScale:p,noiseW:m,language:y,speakerEmbedding:$}){var J,he;const w=this._ort;this._speakerInputSession!==this._session&&this._refreshInputContract();const I=new w.Tensor("int64",new BigInt64Array(Array.from(i,ce=>BigInt(ce))),[1,i.length]),R=new w.Tensor("int64",new BigInt64Array([BigInt(i.length)]),[1]),z=new w.Tensor("float32",new Float32Array([o,p,m]),[3]),M={input:I,input_lengths:R,scales:z};if(this._config.language_id_map&&y){const ce=this._config.language_id_map[y];ce!==void 0&&(M.lid=new w.Tensor("int64",new BigInt64Array([BigInt(ce)]),[1]))}if(Object.assign(M,Jf(w,this._speakerInputContract,$)),r&&this._config.prosody_id_map&&this._hasProsodyFeatures){const ce=[];for(const[be,Be,Ke]of r)ce.push(BigInt(be),BigInt(Be),BigInt(Ke));M.prosody_features=new w.Tensor("int64",new BigInt64Array(ce),[1,i.length,3])}let D;try{D=await this._session.run(M)}catch(ce){if(((J=this._sessionManager)==null?void 0:J.currentProvider)==="webgpu"&&((he=ce==null?void 0:ce.message)!=null&&he.includes("Unsupported data type")))console.warn("[piper-plus] WebGPU inference failed (likely int64 unsupported). Recreating session with WASM backend.",ce.message),typeof this._session.release=="function"&&await this._session.release(),this._sessionManager._gpu=void 0,this._session=await this._sessionManager.createSession(this._modelUrl),this._refreshInputContract(),delete M.speaker_embedding,delete M.speaker_embedding_mask,Object.assign(M,Jf(w,this._speakerInputContract,$)),D=await this._session.run(M);else throw ce}const j=D.output||D[Object.keys(D)[0]],G=new Float32Array(j.data);let K=null;return D.durations&&D.durations.data&&(K=new Float32Array(D.durations.data)),{audio:G,durations:K}}async _runWarmup(i=S$){const r=new Array(Xa);r[0]=x$;for(let o=1;o<Xa-1;o++)r[o]=k$;r[Xa-1]=E$;for(let o=0;o<i;o++)try{await this._infer(r,null,{noiseScale:I$,lengthScale:T$,noiseW:A$})}catch(p){console.warn(`[piper-plus] warmup run ${o+1}/${i} failed:`,p);return}}_assertReady(){if(!this._initialized)throw new Error("PiperPlus is not initialized. Call PiperPlus.initialize() first.")}_refreshInputContract(){const i=J_(this._session);this._speakerInputContract=i,this._speakerInputSession=this._session,this._hasSpeakerEmbedding=i.embedding!==null,this._hasProsodyFeatures=(this._session.inputNames||[]).includes("prosody_features")}}const O$="devtoys-web-tts",Ns="voice-profiles";function M$(){return new Promise((s,i)=>{if(typeof indexedDB>"u"){i(new Error("当前浏览器不支持本地角色存储，请使用现代浏览器"));return}const r=indexedDB.open(O$,1);r.onupgradeneeded=()=>{const o=r.result;o.objectStoreNames.contains(Ns)||o.createObjectStore(Ns,{keyPath:"id"})},r.onsuccess=()=>s(r.result),r.onerror=()=>i(new Error("本地角色库打开失败，请检查浏览器存储权限"))})}function Mo(s,i){return M$().then(r=>new Promise((o,p)=>{const m=r.transaction(Ns,s),y=i(m.objectStore(Ns));y.onsuccess=()=>o(y.result),y.onerror=()=>p(new Error("本地角色库读写失败，请重试")),m.oncomplete=()=>r.close(),m.onerror=()=>p(new Error("本地角色库事务失败，请重试"))}))}async function R$(){return(await Mo("readonly",i=>i.getAll())).sort((i,r)=>r.createdAt-i.createdAt)}async function P$(s){await Mo("readwrite",i=>i.put(s))}async function D$(s){await Mo("readwrite",i=>i.delete(s))}function B$(){var r,o;const s=(o=(r=globalThis.crypto)==null?void 0:r.getRandomValues)==null?void 0:o.call(r,new Uint8Array(8));return`voice-${s?Array.from(s,p=>p.toString(16).padStart(2,"0")).join(""):Date.now().toString(16)}`}const L$={class:"dt-model-select"},N$={class:"dt-model-select__row"},U$=["for"],F$=["id","value","disabled"],W$={key:0,value:"",disabled:""},j$=["value"],V$={class:"dt-model-select__hint"},q$={key:0,class:"dt-model-select__hint"},G$=go({__name:"ModelSelect",props:{modelValue:{},models:{},label:{default:"语音模型"},id:{default:"model-select"},disabled:{type:Boolean,default:!1},showDetails:{type:Boolean,default:!0}},emits:["update:modelValue","change"],setup(s,{emit:i}){const r=s,o=i,p=dt(()=>r.models.find(y=>y.id===r.modelValue));function m(y){const $=y.target.value;o("update:modelValue",$),o("change",$)}return(y,$)=>(Te(),ze("div",L$,[de("div",N$,[de("label",{class:"dt-model-select__label",for:y.id},je(y.label),9,U$),de("select",{id:y.id,class:"dt-model-select__control",value:y.modelValue,disabled:y.disabled,onChange:m},[y.models.length?st("",!0):(Te(),ze("option",W$,"暂无可用模型")),(Te(!0),ze(Ft,null,Gn(y.models,w=>(Te(),ze("option",{key:w.id,value:w.id},je(w.name)+" · "+je(w.sizeLabel)+je(w.supportsCloning?" · 可克隆":""),9,j$))),128))],40,F$)]),y.showDetails&&p.value?(Te(),ze(Ft,{key:0},[de("p",V$,je(p.value.description),1),p.value.credit?(Te(),ze("p",q$," 使用说明：生成音频需标注「"+je(p.value.credit)+"」。 ",1)):st("",!0)],64)):st("",!0)]))}});const H$=_o(G$,[["__scopeId","data-v-fefefca9"]]),K$=s=>(Nm("data-v-fbda6455"),s=s(),Um(),s),Z$={key:0,class:"dt-progress",role:"status","aria-live":"polite"},J$={class:"dt-progress__steps"},X$=["data-state"],Y$=K$(()=>de("span",{class:"dt-progress__dot","aria-hidden":"true"},null,-1)),Q$={class:"dt-progress__label"},e2={key:0,class:"dt-progress__track"},t2={class:"dt-progress__meta"},n2={class:"dt-progress__summary"},i2=go({__name:"TtsProgressPanel",props:{stage:{},percent:{},sentenceIndex:{},sentenceTotal:{},synthesizedSeconds:{},detail:{},cancellable:{type:Boolean}},emits:["cancel"],setup(s,{emit:i}){const r=s,o=i,p=[{id:"download",label:"下载模型"},{id:"engine",label:"准备引擎"},{id:"analyze",label:"分析文本"},{id:"synthesize",label:"合成语音"},{id:"done",label:"完成"}],m={download:0,engine:1,analyze:2,synthesize:3,done:4},y=dt(()=>r.stage?m[r.stage]:-1);function $(M){if(y.value<0)return"pending";const D=m[M];return D<y.value?"done":D===y.value?"active":"pending"}const w=dt(()=>{const M=Math.round(r.percent??0);return`${Math.min(100,Math.max(0,M))}%`}),I=dt(()=>r.stage==="engine"||r.stage==="analyze"),R=dt(()=>r.stage==="download"||r.stage==="synthesize"||I.value),z=dt(()=>{if(r.stage==="download")return r.detail||"首次使用会下载模型并缓存到浏览器";if(r.stage==="synthesize"){const M=[];return r.sentenceTotal&&r.sentenceTotal>0&&M.push(`第 ${Math.max(1,r.sentenceIndex??1)} / ${r.sentenceTotal} 句`),r.synthesizedSeconds!==void 0&&r.synthesizedSeconds>0&&M.push(`已生成 ${r.synthesizedSeconds.toFixed(1)} 秒`),r.detail&&M.push(r.detail),M.join(" · ")||"正在逐句合成"}return r.detail||""});return(M,D)=>M.stage?(Te(),ze("div",Z$,[de("ol",J$,[(Te(),ze(Ft,null,Gn(p,j=>de("li",{key:j.id,class:"dt-progress__step","data-state":$(j.id)},[Y$,de("span",Q$,je(j.label),1)],8,X$)),64))]),R.value?(Te(),ze("div",e2,[de("div",{class:Z0(["dt-progress__fill",{"dt-progress__fill--indeterminate":I.value}]),style:J0(I.value?void 0:{width:M.stage==="download"?w.value:((M.sentenceIndex??0)/Math.max(1,M.sentenceTotal??1)*100).toFixed(1)+"%"})},null,6)])):st("",!0),de("div",t2,[de("span",n2,je(z.value),1),M.cancellable?(Te(),ze("button",{key:0,class:"dt-progress__cancel",type:"button",onClick:D[0]||(D[0]=j=>o("cancel"))},"取消")):st("",!0)])])):st("",!0)}});const s2=_o(i2,[["__scopeId","data-v-fbda6455"]]),r2="3620ed788667cb76f08bd6cf2db8152c1f4c8bd1",Ig=[{id:"zs-v1",name:"零样本克隆 zs-v1",description:"支持上传音频生成角色，中英日等 6 语言",repoId:"ayousanz/piper-plus-base",onnxFile:"releases/zs-v1/base.onnx",revision:r2,sha256:"e9860701a941db02149c7cfbe19cfb578c235c5e25020f1f592131d9b3b30f84",supportsCloning:!0,sizeLabel:"40.8 MB"},{id:"tsukuyomi",name:"月读酱 6 语言",description:"固定女声，适合日语与中文朗读，不支持克隆",repoId:"ayousanz/piper-plus-tsukuyomi-chan",onnxFile:"tsukuyomi-chan-6lang-fp16.onnx",supportsCloning:!1,credit:"Piper Plus:つくよみちゃん",sizeLabel:"39.7 MB"},{id:"css10",name:"CSS10 6 语言",description:"固定音色，偏清晰平稳，不支持克隆",repoId:"ayousanz/piper-plus-css10-ja-6lang",onnxFile:"css10-ja-6lang-fp16.onnx",supportsCloning:!1,sizeLabel:"39.7 MB"}];function Tg(s){return Ig.find(i=>i.id===s)}var Ag={exports:{}};(function(s,i){var r=(()=>{var o=Object.defineProperty,p=Object.getOwnPropertyDescriptor,m=Object.getOwnPropertyNames,y=Object.prototype.hasOwnProperty,$=(e=>typeof jn<"u"?jn:typeof Proxy<"u"?new Proxy(e,{get:(t,n)=>(typeof jn<"u"?jn:t)[n]}):e)(function(e){if(typeof jn<"u")return jn.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),w=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(a){throw n=[a],a}},I=(e,t)=>{for(var n in t)o(e,n,{get:t[n],enumerable:!0})},R=(e,t,n,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let u of m(t))!y.call(e,u)&&u!==n&&o(e,u,{get:()=>t[u],enumerable:!(a=p(t,u))||a.enumerable});return e},z=e=>R(o({},"__esModule",{value:!0}),e),M,D,j,G,K,J,he,ce=w(()=>{"use strict";M=new Map,D=[],j=new WeakMap,G=(e,t,n)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let a=M.get(e);if(a===void 0)M.set(e,{backend:t,priority:n});else{if(a.priority>n)return;if(a.priority===n&&a.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${n}`)}if(n>=0){let u=D.indexOf(e);u!==-1&&D.splice(u,1);for(let l=0;l<D.length;l++)if(M.get(D[l]).priority<=n){D.splice(l,0,e);return}D.push(e)}return}throw new TypeError("not a valid backend")},K=async e=>{let t=M.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let n=!!t.initPromise;try{if(!n){let a=t.backend,u=j.get(a);t.initPromise=u?u.then(async()=>a.init(e),async()=>a.init(e)):a.init(e),j.set(a,t.initPromise)}return await t.initPromise,t.initialized=!0,t.backend}catch(a){return n||(t.error=`${a}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},J=async e=>{let t=e.executionProviders||[],n=t.map(h=>typeof h=="string"?h:h.name),a=n.length===0?D:n,u,l=[],d=new Set;for(let h of a){let f=await K(h);typeof f=="string"?l.push({name:h,err:f}):(u||(u=f),u===f&&d.add(h))}if(!u)throw new Error(`no available backend found. ERR: ${l.map(h=>`[${h.name}] ${h.err}`).join(", ")}`);for(let{name:h,err:f}of l)n.includes(h)&&console.warn(`removing requested execution provider "${h}" from session options because it is not available: ${f}`);let c=t.filter(h=>d.has(typeof h=="string"?h:h.name));return[u,new Proxy(e,{get:(h,f)=>f==="executionProviders"?c:Reflect.get(h,f)})]},he=async()=>{let e=[];for(let n of D){if(typeof M.get(n).backend.createLoraAdapterHandler!="function")continue;let a=await K(n);if(typeof a!="string")return a;e.push({name:n,err:a})}let t=e.length===0?"":` ERR: ${e.map(n=>`[${n.name}] ${n.err}`).join(", ")}`;throw new Error(`no available backend supports LoRA adapters.${t}`)}}),be=w(()=>{"use strict";ce()}),Be,Ke=w(()=>{"use strict";Be="1.31.1"}),Et,Me,We=w(()=>{"use strict";Ke(),Et="warning",Me={wasm:{},webgl:{},webgpu:{},versions:{common:Be},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);Et=e}},get logLevel(){return Et}},Object.defineProperty(Me,"logLevel",{enumerable:!0})}),ye,ht=w(()=>{"use strict";We(),ye=Me}),Mt,qt,Ae,Le,tt,rt,gt=w(()=>{"use strict";We(),Mt=(e,t)=>{(typeof Me.trace>"u"?!Me.wasm.trace:!Me.trace)||console.timeStamp(`${e}::ORT::${t}`)},qt=(e,t)=>{var u;let n=((u=new Error().stack)==null?void 0:u.split(/\r\n|\r|\n/g))||[],a=!1;for(let l=0;l<n.length;l++){if(a&&!n[l].includes("TRACE_FUNC")){let d=`FUNC_${e}::${n[l].trim().split(" ")[1]}`;t&&(d+=`::${t}`),Mt("CPU",d);return}n[l].includes("TRACE_FUNC")&&(a=!0)}},Ae=e=>{(typeof Me.trace>"u"?!Me.wasm.trace:!Me.trace)||qt("BEGIN",e)},Le=e=>{(typeof Me.trace>"u"?!Me.wasm.trace:!Me.trace)||qt("END",e)},tt=e=>{(typeof Me.trace>"u"?!Me.wasm.trace:!Me.trace)||console.time(`ORT::${e}`)},rt=e=>{(typeof Me.trace>"u"?!Me.wasm.trace:!Me.trace)||console.timeEnd(`ORT::${e}`)}}),Gt,dn=w(()=>{"use strict";ce(),gt(),Gt=class zg{constructor(t,n){this.backend=t,this.handler=n}static async create(t){if(Ae(),typeof t!="string"&&!(t instanceof Uint8Array))throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let n=await he(),a=await n.createLoraAdapterHandler(t);return Le(),new zg(n,a)}async release(){return this.handler.dispose()}}}),kt,ei,Rt=w(()=>{"use strict";kt=(e,t)=>{let n=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);n.width=e.dims[3],n.height=e.dims[2];let a=n.getContext("2d");if(a!=null){let u,l;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(u=e.dims[2],l=e.dims[3]):(u=e.dims[3],l=e.dims[2]);let d=(t==null?void 0:t.format)!==void 0?t.format:"RGB",c=t==null?void 0:t.norm,h,f;c===void 0||c.mean===void 0?h=[255,255,255,255]:typeof c.mean=="number"?h=[c.mean,c.mean,c.mean,c.mean]:(h=[c.mean[0],c.mean[1],c.mean[2],0],c.mean[3]!==void 0&&(h[3]=c.mean[3])),c===void 0||c.bias===void 0?f=[0,0,0,0]:typeof c.bias=="number"?f=[c.bias,c.bias,c.bias,c.bias]:(f=[c.bias[0],c.bias[1],c.bias[2],0],c.bias[3]!==void 0&&(f[3]=c.bias[3]));let g=l*u,_=0,b=g,x=g*2,v=-1;d==="RGBA"?(_=0,b=g,x=g*2,v=g*3):d==="RGB"?(_=0,b=g,x=g*2):d==="RBG"&&(_=0,x=g,b=g*2);for(let S=0;S<l;S++)for(let T=0;T<u;T++){let k=(e.data[_++]-f[0])*h[0],E=(e.data[b++]-f[1])*h[1],A=(e.data[x++]-f[2])*h[2],C=v===-1?255:(e.data[v++]-f[3])*h[3];a.fillStyle="rgba("+k+","+E+","+A+","+C+")",a.fillRect(T,S,1,1)}if("toDataURL"in n)return n.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},ei=(e,t)=>{let n=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),a;if(n!=null){let u,l,d;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(u=e.dims[2],l=e.dims[1],d=e.dims[3]):(u=e.dims[3],l=e.dims[2],d=e.dims[1]);let c=t!==void 0&&t.format!==void 0?t.format:"RGB",h=t==null?void 0:t.norm,f,g;h===void 0||h.mean===void 0?f=[255,255,255,255]:typeof h.mean=="number"?f=[h.mean,h.mean,h.mean,h.mean]:(f=[h.mean[0],h.mean[1],h.mean[2],255],h.mean[3]!==void 0&&(f[3]=h.mean[3])),h===void 0||h.bias===void 0?g=[0,0,0,0]:typeof h.bias=="number"?g=[h.bias,h.bias,h.bias,h.bias]:(g=[h.bias[0],h.bias[1],h.bias[2],0],h.bias[3]!==void 0&&(g[3]=h.bias[3]));let _=l*u;if(t!==void 0&&(t.format!==void 0&&d===4&&t.format!=="RGBA"||d===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let b=4,x=0,v=1,S=2,T=3,k=0,E=_,A=_*2,C=-1;c==="RGBA"?(k=0,E=_,A=_*2,C=_*3):c==="RGB"?(k=0,E=_,A=_*2):c==="RBG"&&(k=0,A=_,E=_*2),a=n.createImageData(u,l);for(let O=0;O<l*u;x+=b,v+=b,S+=b,T+=b,O++)a.data[x]=(e.data[k++]-g[0])*f[0],a.data[v]=(e.data[E++]-g[1])*f[1],a.data[S]=(e.data[A++]-g[2])*f[2],a.data[T]=C===-1?255:(e.data[C++]-g[3])*f[3]}else throw new Error("Can not access image data");return a}}),Pn,Li,Ht,Ni,it,cn,Ui=w(()=>{"use strict";si(),Pn=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:n,width:a}=t,u=t.norm??{mean:255,bias:0},l,d;typeof u.mean=="number"?l=[u.mean,u.mean,u.mean,u.mean]:l=[u.mean[0],u.mean[1],u.mean[2],u.mean[3]??255],typeof u.bias=="number"?d=[u.bias,u.bias,u.bias,u.bias]:d=[u.bias[0],u.bias[1],u.bias[2],u.bias[3]??0];let c=t.format!==void 0?t.format:"RGBA",h=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",f=n*a,g=h==="RGBA"?new Float32Array(f*4):new Float32Array(f*3),_=4,b=0,x=1,v=2,S=3,T=0,k=f,E=f*2,A=-1;c==="RGB"&&(_=3,b=0,x=1,v=2,S=-1),h==="RGBA"?A=f*3:h==="RBG"?(T=0,E=f,k=f*2):h==="BGR"&&(E=0,k=f,T=f*2);for(let C=0;C<f;C++,b+=_,v+=_,x+=_,S+=_)g[T++]=(e[b]+d[0])/l[0],g[k++]=(e[x]+d[1])/l[1],g[E++]=(e[v]+d[2])/l[2],A!==-1&&S!==-1&&(g[A++]=(e[S]+d[3])/l[3]);return h==="RGBA"?new at("float32",g,[1,4,n,a]):new at("float32",g,[1,3,n,a])},Li=async(e,t)=>{let n=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,a=typeof ImageData<"u"&&e instanceof ImageData,u=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,l=typeof e=="string",d,c=t??{},h=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},f=g=>typeof HTMLCanvasElement<"u"&&g instanceof HTMLCanvasElement||g instanceof OffscreenCanvas?g.getContext("2d"):null;if(n){let g=h();g.width=e.width,g.height=e.height;let _=f(g);if(_!=null){let b=e.height,x=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(b=t.resizedHeight,x=t.resizedWidth),t!==void 0){if(c=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");c.tensorFormat="RGBA",c.height=b,c.width=x}else c.tensorFormat="RGBA",c.height=b,c.width=x;_.drawImage(e,0,0),d=_.getImageData(0,0,x,b).data}else throw new Error("Can not access image data")}else if(a){let g,_;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(g=t.resizedHeight,_=t.resizedWidth):(g=e.height,_=e.width),t!==void 0&&(c=t),c.format="RGBA",c.height=g,c.width=_,t!==void 0){let b=h();b.width=_,b.height=g;let x=f(b);if(x!=null)x.putImageData(e,0,0),d=x.getImageData(0,0,_,g).data;else throw new Error("Can not access image data")}else d=e.data}else if(u){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let g=h();g.width=e.width,g.height=e.height;let _=f(g);if(_!=null){let b=e.height,x=e.width;return _.drawImage(e,0,0,x,b),d=_.getImageData(0,0,x,b).data,c.height=b,c.width=x,Pn(d,c)}else throw new Error("Can not access image data")}else{if(l)return new Promise((g,_)=>{let b=h(),x=f(b);if(!e||!x)return _();let v=new Image;v.crossOrigin="Anonymous",v.src=e,v.onload=()=>{b.width=v.width,b.height=v.height,x.drawImage(v,0,0,b.width,b.height);let S=x.getImageData(0,0,b.width,b.height);c.height=b.height,c.width=b.width,g(Pn(S.data,c))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(d!==void 0)return Pn(d,c);throw new Error("Input data provided is not supported - aborted tensor creation")},Ht=(e,t)=>{let{width:n,height:a,download:u,dispose:l}=t,d=[1,a,n,4];return new at({location:"texture",type:"float32",texture:e,dims:d,download:u,dispose:l})},Ni=(e,t)=>{let{dataType:n,dims:a,download:u,dispose:l}=t;return new at({location:"gpu-buffer",type:n??"float32",gpuBuffer:e,dims:a,download:u,dispose:l})},it=(e,t)=>{let{dataType:n,dims:a,download:u,dispose:l}=t;return new at({location:"ml-tensor",type:n??"float32",mlTensor:e,dims:a,download:u,dispose:l})},cn=(e,t,n)=>new at({location:"cpu-pinned",type:e,data:t,dims:n??[t.length]})}),St,It,Kt,ti,ni=w(()=>{"use strict";St=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),It=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Kt=!1,ti=()=>{if(!Kt){Kt=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,n=globalThis.Float16Array,a=typeof n<"u"&&n.from;e&&(St.set("int64",BigInt64Array),It.set(BigInt64Array,"int64")),t&&(St.set("uint64",BigUint64Array),It.set(BigUint64Array,"uint64")),a?(St.set("float16",n),It.set(n,"float16")):St.set("float16",Uint16Array)}}}),Dn,ii,Hs=w(()=>{"use strict";si(),Dn=e=>{let t=1;for(let n=0;n<e.length;n++){let a=e[n];if(typeof a!="number"||!Number.isSafeInteger(a))throw new TypeError(`dims[${n}] must be an integer, got: ${a}`);if(a<0)throw new RangeError(`dims[${n}] must be a non-negative integer, got: ${a}`);t*=a}return t},ii=(e,t)=>{switch(e.location){case"cpu":return new at(e.type,e.data,t);case"cpu-pinned":return new at({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new at({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new at({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new at({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),at,si=w(()=>{"use strict";Rt(),Ui(),ni(),Hs(),at=class{constructor(e,t,n){ti();let a,u;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,a=e.type,u=e.dims,e.location){case"cpu-pinned":{let d=St.get(a);if(!d)throw new TypeError(`unsupported type "${a}" to create tensor from pinned buffer`);if(!(e.data instanceof d))throw new TypeError(`buffer should be of type ${d.name}`);this.cpuData=e.data;break}case"texture":{if(a!=="float32")throw new TypeError(`unsupported type "${a}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint64"&&a!=="int8"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let d,c;if(typeof e=="string")if(a=e,c=n,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");d=t}else{let h=St.get(e);if(h===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&h===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${h.name} as data.`);e==="uint64"||e==="int64"?d=h.from(t,BigInt):d=h.from(t)}else if(t instanceof h)d=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")d=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&h!==Uint16Array)d=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${a} tensor's data must be type of ${h}`)}else if(c=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let h=typeof e[0];if(h==="string")a="string",d=e;else if(h==="boolean")a="bool",d=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${h}.`)}else if(e instanceof Uint8ClampedArray)a="uint8",d=Uint8Array.from(e);else{let h=It.get(e.constructor);if(h===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);a=h,d=e}if(c===void 0)c=[d.length];else if(!Array.isArray(c))throw new TypeError("A tensor's dims must be a number array");u=c,this.cpuData=d,this.dataLocation="cpu"}let l=Dn(u);if(this.cpuData&&l!==this.cpuData.length&&!((a==="uint4"||a==="int4")&&Math.ceil(l/2)===this.cpuData.length))throw new Error(`Tensor's size(${l}) does not match data length(${this.cpuData.length}).`);this.type=a,this.dims=u,this.size=l}static async fromImage(e,t){return Li(e,t)}static fromTexture(e,t){return Ht(e,t)}static fromGpuBuffer(e,t){return Ni(e,t)}static fromMLTensor(e,t){return it(e,t)}static fromPinnedBuffer(e,t,n){return cn(e,t,n)}toDataURL(e){return kt(this,e)}toImageData(e){return ei(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return ii(this,e)}}}),ct,Fi=w(()=>{"use strict";si(),ct=at}),ri,Ks=w(()=>{"use strict";ce(),dn(),Fi(),gt(),ri=class Cg{constructor(t,n){this.handler=t,this.backend=n}async run(t,n,a){Ae(),tt("InferenceSession.run");let u={},l={};if(typeof t!="object"||t===null||t instanceof ct||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let d=!0;if(typeof n=="object"){if(n===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(n instanceof ct)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(n)){if(n.length===0)throw new TypeError("'fetches' cannot be an empty array.");d=!1;for(let g of n){if(typeof g!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(g)===-1)throw new RangeError(`'fetches' contains invalid output name: ${g}.`);u[g]=null}if(typeof a=="object"&&a!==null)l=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else{let g=!1,_=Object.getOwnPropertyNames(n);for(let b of this.outputNames)if(_.indexOf(b)!==-1){let x=n[b];(x===null||x instanceof ct)&&(g=!0,d=!1,u[b]=x)}if(g){if(typeof a=="object"&&a!==null)l=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else l=n}}else if(typeof n<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let g of this.inputNames)if(typeof t[g]>"u")throw new Error(`input '${g}' is missing in 'feeds'.`);if(d)for(let g of this.outputNames)u[g]=null;let c;if(l.activeLoraAdapters!==void 0){if(!Array.isArray(l.activeLoraAdapters))throw new TypeError("'activeLoraAdapters' must be an array.");c=l.activeLoraAdapters.map(g=>{if(!(g instanceof Gt))throw new TypeError("'activeLoraAdapters' must be an array of LoraAdapter objects.");if(g.backend!==this.backend)throw new Error("LoRA adapter was created by a different backend than the session.");return g.handler})}let h=await this.handler.run(t,u,l,c),f={};for(let g in h)if(Object.hasOwnProperty.call(h,g)){let _=h[g];_ instanceof ct?f[g]=_:f[g]=new ct(_.type,_.data,_.dims)}return rt("InferenceSession.run"),Le(),f}async release(){return this.handler.dispose()}static async create(t,n,a,u){Ae(),tt("InferenceSession.create");let l,d={};if(typeof t=="string"){if(l=t,typeof n=="object"&&n!==null)d=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(l=t,typeof n=="object"&&n!==null)d=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let g=t,_=0,b=t.byteLength;if(typeof n=="object"&&n!==null)d=n;else if(typeof n=="number"){if(_=n,!Number.isSafeInteger(_))throw new RangeError("'byteOffset' must be an integer.");if(_<0||_>=g.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${g.byteLength}).`);if(b=t.byteLength-_,typeof a=="number"){if(b=a,!Number.isSafeInteger(b))throw new RangeError("'byteLength' must be an integer.");if(b<=0||_+b>g.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${g.byteLength-_}].`);if(typeof u=="object"&&u!==null)d=u;else if(typeof u<"u")throw new TypeError("'options' must be an object.")}else if(typeof a<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof n<"u")throw new TypeError("'options' must be an object.");l=new Uint8Array(g,_,b)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[c,h]=await J(d),f=await c.createInferenceSessionHandler(l,h);return rt("InferenceSession.create"),Le(),new Cg(f,c)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),ai,Zs=w(()=>{"use strict";Ks(),ai=ri}),oi,Js=w(()=>{"use strict";dn(),oi=Gt}),oe=w(()=>{"use strict"}),H=w(()=>{"use strict"}),Se=w(()=>{"use strict"}),le=w(()=>{"use strict"}),Xe={};I(Xe,{InferenceSession:()=>ai,LoraAdapter:()=>oi,TRACE:()=>Mt,TRACE_EVENT_BEGIN:()=>tt,TRACE_EVENT_END:()=>rt,TRACE_FUNC_BEGIN:()=>Ae,TRACE_FUNC_END:()=>Le,Tensor:()=>ct,env:()=>ye,registerBackend:()=>G});var qe=w(()=>{"use strict";be(),ht(),Zs(),Js(),Fi(),oe(),H(),gt(),Se(),le()}),Bn=w(()=>{"use strict"}),_t={};I(_t,{default:()=>ui});var pn,Ln,ui,Wi=w(()=>{var e;"use strict";yf(),mn(),er(),pn="ort-wasm-proxy-worker",Ln=((e=globalThis.self)==null?void 0:e.name)===pn,Ln&&(self.onmessage=t=>{let{type:n,in:a}=t.data;try{switch(n){case"init-wasm":ir(a.wasm).then(()=>{ya(a).then(()=>{postMessage({type:n})},u=>{postMessage({type:n,err:u})})},u=>{postMessage({type:n,err:u})});break;case"init-ep":{let{epName:u,env:l}=a;wa(l,u).then(()=>{postMessage({type:n})},d=>{postMessage({type:n,err:d})});break}case"copy-from":{let{buffer:u}=a,l=us(u);postMessage({type:n,out:l});break}case"create":{let{model:u,options:l}=a;$a(u,l).then(d=>{postMessage({type:n,out:d})},d=>{postMessage({type:n,err:d})});break}case"release":va(a),postMessage({type:n});break;case"run":{let{sessionId:u,inputIndices:l,inputs:d,outputIndices:c,options:h}=a;Ea(u,l,d,c,new Array(c.length).fill(null),h).then(f=>{f.some(g=>g[3]!=="cpu")?postMessage({type:n,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:n,out:f},Sa([...d,...f]))},f=>{postMessage({type:n,err:f})});break}case"end-profiling":ka(a),postMessage({type:n});break;default:}}catch(u){postMessage({type:n,err:u})}}),ui=Ln?null:t=>new Worker(t??Ge,{type:"classic",name:pn})}),Oe,Tt,Ge,hn,fn,Ro,Po,Xs,Do,Ys,Bo,Qs,Lo,er=w(()=>{"use strict";Bn(),Oe=typeof location>"u"?void 0:location.origin,Tt=()=>{var e,t;return typeof document<"u"?(e=document.currentScript)==null?void 0:e.src:typeof self<"u"?(t=self.location)==null?void 0:t.href:void 0},Ge=Tt(),hn=()=>{if(Ge&&!Ge.startsWith("blob:"))return Ge.substring(0,Ge.lastIndexOf("/")+1)},fn=(e,t)=>{try{let n=t??Ge;return(n?new URL(e,n):new URL(e)).origin===Oe}catch{return!1}},Ro=(e,t)=>{let n=t??Ge;try{return(n?new URL(e,n):new URL(e)).href}catch{return}},Po=(e,t)=>`${t??"./"}${e}`,Xs=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},Do=async e=>(await jt(()=>import(e),[],import.meta.url)).default,Ys=(Wi(),z(_t)).default,Bo=async()=>{if(!Ge)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(fn(Ge))return[void 0,Ys()];let e=await Xs(Ge);return[e,Ys(e)]},Qs=void 0,Lo=async(e,t,n,a)=>{let u=Qs&&!(e||t);if(u)if(Ge)u=fn(Ge)||a&&!n;else if(a&&!n)u=!0;else throw new Error("cannot determine the script source URL.");if(u)return[void 0,Qs];{let l="ort-wasm-simd-threaded.jsep.mjs",d=e??Ro(l,t),c=n&&d&&!fn(d,t),h=c?await Xs(d):d??Po(l,t);return[c?h:void 0,await Do(h)]}}}),tr,ji,li,nr,No,Uo,Fo,ir,Ie,mn=w(()=>{"use strict";er(),ji=!1,li=!1,nr=!1,No=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},Uo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},Fo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},ir=async e=>{if(ji)return Promise.resolve();if(li)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(nr)throw new Error("previous call to 'initializeWebAssembly()' failed.");li=!0;let t=e.initTimeout,n=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!Fo())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!Uo())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let a=No();n>1&&!a&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+n+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=n=1);let u=e.wasmPaths,l=typeof u=="string"?u:void 0,d=u==null?void 0:u.mjs,c=(d==null?void 0:d.href)??d,h=u==null?void 0:u.wasm,f=(h==null?void 0:h.href)??h,g=e.wasmBinary,[_,b]=await Lo(c,l,n>1,!!g||!!f),x=!1,v=[];if(t>0&&v.push(new Promise(S=>{setTimeout(()=>{x=!0,S()},t)})),v.push(new Promise((S,T)=>{let k={numThreads:n};if(g)k.wasmBinary=g,k.locateFile=E=>E;else if(f||l)k.locateFile=E=>f??l+E;else if(c&&c.indexOf("blob:")!==0)k.locateFile=E=>new URL(E,c).href;else if(_){let E=hn();E&&(k.locateFile=A=>E+A)}b(k).then(E=>{li=!1,ji=!0,tr=E,S(),_&&URL.revokeObjectURL(_)},E=>{li=!1,nr=!0,T(E)})})),await Promise.race(v),x)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},Ie=()=>{if(ji&&tr)return tr;throw new Error("WebAssembly is not initialized yet.")}}),yt,Vi,xe,sr=w(()=>{"use strict";mn(),yt=(e,t)=>{let n=Ie(),a=n.lengthBytesUTF8(e)+1,u=n._malloc(a);return n.stringToUTF8(e,u,a),t.push(u),u},Vi=(e,t,n,a)=>{if(typeof e=="object"&&e!==null){if(n.has(e))throw new Error("Circular reference in options");n.add(e)}Object.entries(e).forEach(([u,l])=>{let d=t?t+u:u;if(typeof l=="object")Vi(l,d+".",n,a);else if(typeof l=="string"||typeof l=="number")a(d,l.toString());else if(typeof l=="boolean")a(d,l?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof l}`)})},xe=e=>{let t=Ie(),n=t.stackSave();try{let a=t.PTR_SIZE,u=t.stackAlloc(2*a);t._OrtGetLastError(u,u+a);let l=Number(t.getValue(u,a===4?"i32":"i64")),d=t.getValue(u+a,"*"),c=d?t.UTF8ToString(d):"";throw new Error(`${e} ERROR_CODE: ${l}, ERROR_MESSAGE: ${c}`)}finally{t.stackRestore(n)}}}),Wo,Vg=w(()=>{"use strict";mn(),sr(),Wo=(e,t)=>{let n=Ie(),a=0,u=[],l=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)l.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)l.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(l.terminate=!1);let d=0;(e==null?void 0:e.tag)!==void 0&&(d=yt(e.tag,u)),a=n._OrtCreateRunOptions(l.logSeverityLevel,l.logVerbosityLevel,!!l.terminate,d),a===0&&xe("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&Vi(e.extra,"",new WeakSet,(c,h)=>{let f=yt(c,u),g=yt(h,u);n._OrtAddRunConfigEntry(a,f,g)!==0&&xe(`Can't set a run config entry: ${c} - ${h}.`)});for(let c of t)n._OrtRunOptionsAddActiveLoraAdapter(a,c)!==0&&xe("Can't add an active LoRA adapter.");return[a,u]}catch(d){throw a!==0&&n._OrtReleaseRunOptions(a),u.forEach(c=>n._free(c)),d}}}),jo,Vo,qo,gn,Go,Ho,qg=w(()=>{"use strict";mn(),sr(),jo=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Vo=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},qo=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(n=>(typeof n=="string"?n:n.name)==="webgpu")&&(e.enableMemPattern=!1)},gn=(e,t,n,a)=>{let u=yt(t,a),l=yt(n,a);Ie()._OrtAddSessionConfigEntry(e,u,l)!==0&&xe(`Can't set a session config entry: ${t} - ${n}.`)},Go=async(e,t,n)=>{let a=t.executionProviders;for(let u of a){let l=typeof u=="string"?u:u.name,d=[],c;switch(l){case"webnn":if(l="WEBNN",gn(e,"session.disable_quant_qdq","1",n),gn(e,"session.disable_qdq_constant_folding","1",n),typeof u!="string"){let b=u==null?void 0:u.deviceType;b&&gn(e,"deviceType",b,n)}break;case"webgpu":if(l="JS",typeof u!="string"){let b=u;if(b!=null&&b.preferredLayout){if(b.preferredLayout!=="NCHW"&&b.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${b.preferredLayout}`);gn(e,"preferredLayout",b.preferredLayout,n)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${l}`)}let h=d.length,f=0,g=0;if(h>0){f=Ie()._malloc(h*Ie().PTR_SIZE),n.push(f),g=Ie()._malloc(h*Ie().PTR_SIZE),n.push(g);for(let b=0;b<h;b++)Ie().setValue(f+b*Ie().PTR_SIZE,d[b][0],"*"),Ie().setValue(g+b*Ie().PTR_SIZE,d[b][1],"*")}let _;if(c===void 0){let b=yt(l,n);_=await Ie()._OrtAppendExecutionProvider(e,b,f,g,h)}_!==0&&xe(`Can't append execution provider: ${l}.`)}},Ho=async e=>{let t=Ie(),n=0,a=[],u=e||{};qo(u);try{let l=jo(u.graphOptimizationLevel??"all"),d=Vo(u.executionMode??"sequential"),c=typeof u.logId=="string"?yt(u.logId,a):0,h=u.logSeverityLevel??2;if(!Number.isInteger(h)||h<0||h>4)throw new Error(`log severity level is not valid: ${h}`);let f=u.logVerbosityLevel??0;if(!Number.isInteger(f)||f<0||f>4)throw new Error(`log verbosity level is not valid: ${f}`);let g=typeof u.optimizedModelFilePath=="string"?yt(u.optimizedModelFilePath,a):0;if(n=t._OrtCreateSessionOptions(l,!!u.enableCpuMemArena,!!u.enableMemPattern,d,!!u.enableProfiling,0,c,h,f,g),n===0&&xe("Can't create session options."),u.executionProviders&&await Go(n,u,a),u.enableGraphCapture!==void 0){if(typeof u.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${u.enableGraphCapture}`);gn(n,"enableGraphCapture",u.enableGraphCapture.toString(),a)}if(u.freeDimensionOverrides)for(let[_,b]of Object.entries(u.freeDimensionOverrides)){if(typeof _!="string")throw new Error(`free dimension override name must be a string: ${_}`);if(typeof b!="number"||!Number.isInteger(b)||b<0)throw new Error(`free dimension override value must be a non-negative integer: ${b}`);let x=yt(_,a);t._OrtAddFreeDimensionOverride(n,x,b)!==0&&xe(`Can't set a free dimension override: ${_} - ${b}.`)}return u.extra!==void 0&&Vi(u.extra,"",new WeakSet,(_,b)=>{gn(n,_,b,a)}),[n,a]}catch(l){throw n!==0&&t._OrtReleaseSessionOptions(n)!==0&&xe("Can't release session options."),a.forEach(d=>t._free(d)),l}}}),_n,Pt,yn,qi,Gi,rr,ar,or,re=w(()=>{"use strict";_n=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},Pt=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},yn=(e,t)=>{let n=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],a=typeof t=="number"?t:t.reduce((u,l)=>u*l,1);return n>0?Math.ceil(a*n):void 0},qi=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},Gi=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},rr=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",ar=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",or=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),Hi,ur=w(()=>{"use strict";Bn(),Hi=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let n=t.headers.get("Content-Length"),a=n?parseInt(n,10):0;if(a<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let u=t.body.getReader(),l;try{l=new ArrayBuffer(a)}catch(c){if(c instanceof RangeError){let h=Math.ceil(a/65536);l=new WebAssembly.Memory({initial:h,maximum:h}).buffer}else throw c}let d=0;for(;;){let{done:c,value:h}=await u.read();if(c)break;let f=h.byteLength;new Uint8Array(l,d,f).set(h),d+=f}return new Uint8Array(l,0,a)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),Ko,Zo,Jo,Xo,lr,Yo,$e,Dt=w(()=>{"use strict";re(),Ko=["V","I","W","E","F"],Zo=(e,t)=>{console.log(`[${Ko[e]},${new Date().toISOString()}]${t}`)},lr=(e,t)=>{Jo=e,Xo=t},Yo=(e,t)=>{let n=Gi(e),a=Gi(Jo);n>=a&&Zo(n,typeof t=="function"?t():t)},$e=(...e)=>{Xo&&Yo(...e)}}),Qo,Nn,L,Ki,eu,tu,nu,pe=w(()=>{"use strict";Qo=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},Nn=class{static calcShape(e,t,n=!1){let a=e.length,u=t.length;if(a===0)return t;if(u===0)return e;let l=Math.max(e.length,t.length),d=new Array(l);if(n){if(a<2||u<2)return;let c=Qo.calcMatMulShape([e[a-2],e[a-1]],[t[u-2],t[u-1]]);if(c===void 0)return;[d[l-2],d[l-1]]=c}for(let c=n?3:1;c<=l;c++){let h=a-c<0?1:e[a-c],f=u-c<0?1:t[u-c];if(h!==f&&h>1&&f>1)return;let g=Math.max(h,f);if(h&&f)d[l-c]=Math.max(h,f);else{if(g>1)return;d[l-c]=0}}return d}static isValidBroadcast(e,t){let n=e.length,a=t.length;if(n>a)return!1;for(let u=1;u<=n;u++)if(e[n-u]!==1&&e[n-u]!==t[a-u])return!1;return!0}},L=class Os{static size(t){return Os.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,n=4){let a=t.length;if(a===0)return[];let u=new Array(a),l=a-1;for(;l>=0;){if(t[l]%n===0){u[l]=t[l]/n;break}if(n%t[l]!==0)throw new Error("cannot convert shape");u[l]=1,n/=t[l],l--}for(l--;l>=0;l--)u[l]=t[l];return u}static sizeFromDimension(t,n){if(n<0||n>t.length)throw new Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return Os.getSizeFromDimensionRange(t,n,t.length)}static sizeToDimension(t,n){if(n<0||n>t.length)throw new Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${t.length} dimensions.`);return Os.getSizeFromDimensionRange(t,0,n)}static getSizeFromDimensionRange(t,n,a){let u=1;for(let l=n;l<a;l++){if(t[l]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");u*=Number(t[l])}return u}static computeStrides(t){let n=t.length;if(n===0)return[];if(n===1)return[1];let a=new Array(n);a[n-1]=1,a[n-2]=t[n-1];for(let u=n-3;u>=0;--u)a[u]=a[u+1]*t[u+1];return a}static normalizeAxis(t,n){if(t<-n&&t>=n)throw new Error("unsupported axis for this operation.");return t<0?t+n:t}static normalizeAxes(t,n){return t.map(a=>this.normalizeAxis(a,n??t.length))}static sortBasedOnPerm(t,n){return n?n.map(a=>t[a]):t.slice().reverse()}static padShape(t,n){let a=t.length;return t.map((u,l)=>u+n[l]+n[l+a])}static areEqual(t,n){return t.length!==n.length?!1:t.every((a,u)=>a===n[u])}},Ki=class sn{static adjustPoolAttributes(t,n,a,u,l,d){if(!t&&a.length!==n.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let c=0;c<n.length-2;c++)c>=a.length?a.push(n[c+2]):a[c]=n[c+2];for(let c=0;c<a.length;c++)if(c<u.length){if(u[c]<0)throw new Error("strides should be greater than or equal to 1")}else u.push(1);for(let c=0;c<a.length;c++)if(c<l.length){if(l[c]<0)throw new Error("dilations should be greater than or equal to 1")}else l.push(1);for(let c=0;c<a.length*2;c++)if(c<d.length){if(d[c]<0)throw new Error("pad should be greater than or equal to 1")}else d.push(0);for(let c=0;c<a.length;c++){if(a[c]<=0)throw new Error("kernel shapes need to be greater than 0");if(d[c]>=a[c]||d[c+a.length]>=a[c])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,n,a,u,l,d,c){if(c){if(l.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(u.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let h=0;h<t.length-2;h++)sn.adjustPadAndReturnShape(t[h+(d?1:2)],n[h],a[h],u[h],l,h,h+t.length-2,c)}}static computePoolOutputShape(t,n,a,u,l,d,c,h=0){if(n.length<=0)throw new Error("input shape must be of size greater than 0");let f=[n[0],n[1]];return sn.computeShapeHelper(t,n,f,a,u,l,d,c,h),f}static computeConvOutputShape(t,n,a,u,l,d,c){if(t.length<=0||n.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let h=[t[0],n[0]];return sn.computeShapeHelper(!1,t,h,a,u,l,d,c),h}static computeShapeHelper(t,n,a,u,l,d,c,h,f=0){if(t)for(let g=0;g<n.length-2;g++)a.push(1);else for(let g=0;g<n.length-2;g++)a.push(sn.adjustPadAndReturnShape(n[g+2],u[g],l[g],d[g],c,g,g+n.length-2,h,f))}static computeOutputSize(t,n,a,u,l){let d=Math.floor(t/n)+1;return l===1&&(d=Math.ceil(t/n)+1,(d-1)*n>=a+u&&(d-=1)),d}static adjustPadAndReturnShape(t,n,a,u,l,d,c,h,f=0){let g=a*(u-1)+1;if(h&&h!=="NOTSET")switch(h){case"VALID":return l[d]=0,l[c]=0,sn.computeOutputSize(t-g,n,t,0,f);case"SAME_LOWER":case"SAME_UPPER":if(a!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let _=(Math.floor((t+n-1)/n)-1)*n+u-t;return l[d]=Math.floor(h==="SAME_LOWER"?(_+1)/2:_/2),l[c]=_-l[d],sn.computeOutputSize(t+l[d]+l[c]-g,n,t,l[d],f)}default:throw new Error("Unsupported AutoPad type")}else return sn.computeOutputSize(t+l[d]+l[c]-g,n,t,l[d],f)}},eu=class{static getShapeOfGemmResult(e,t,n,a,u){if(e.length!==2||n.length!==2)throw new Error("shape need to be of size 2");let l,d,c;t?(l=e[1],d=e[0]):(l=e[0],d=e[1]);let h=-1;if(a?(c=n[0],h=1):(c=n[1],h=0),n[h]!==d)throw new Error("dimension mismatch");if(l<=0||c<=0||d<=0)throw new Error("invalid shape specified");if(u&&!Nn.isValidBroadcast(u,[l,c]))throw new Error("gemm: invalid bias shape for broadcast");return[l,c,d]}},tu=-34028234663852886e22,nu=34028234663852886e22}),dr,iu=w(()=>{"use strict";re(),dr=(e,t)=>new(qi(t))(e)}),cr,su,pr,ru,hr,au,fr,mr,gr,ou,uu,Gg=w(()=>{"use strict";re(),Dt(),cr=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),su=(e,t)=>{if(t==="int32")return e;let n=cr.get(t);if(!n)throw new Error(`WebNN backend does not support data type: ${t}`);let a=n/8;if(e.byteLength%a!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${a}.`);let u=e.byteLength/a,l=new(qi(t))(e.buffer,e.byteOffset,u);switch(t){case"int64":case"uint64":{let d=new Int32Array(u);for(let c=0;c<u;c++){let h=l[c];if(h>2147483647n||h<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");d[c]=Number(h)}return new Uint8Array(d.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&l.some(c=>c>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let d=Int32Array.from(l,Number);return new Uint8Array(d.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},pr=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let n=e.byteLength/4,a=new Int32Array(e.buffer,e.byteOffset,n);switch(t){case"int64":{let u=BigInt64Array.from(a,BigInt);return new Uint8Array(u.buffer)}case"uint64":{if(a.some(l=>l<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let u=BigUint64Array.from(a,BigInt);return new Uint8Array(u.buffer)}case"int8":{if(a.some(l=>l<-128||l>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let u=Int8Array.from(a,Number);return new Uint8Array(u.buffer)}case"uint8":{if(a.some(u=>u<0||u>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(a,Number)}case"uint32":{if(a.some(l=>l<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let u=Uint32Array.from(a,Number);return new Uint8Array(u.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},ru=1,hr=()=>ru++,au=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),fr=(e,t)=>{let n=cr.get(e);if(!n)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((a,u)=>a*u)*n/8):0},mr=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:n,tensor:a,dataType:u,shape:l,fallbackDataType:d}=e;this.sessionId=t,this.mlContext=n,this.mlTensor=a,this.dataType=u,this.tensorShape=l,this.fallbackDataType=d}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return fr(this.dataType,this.tensorShape)}destroy(){$e("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),n=pr(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(n);return}else return new Uint8Array(n).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,n){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===n.length&&this.tensorShape.every((a,u)=>a===n[u])}setIsDataConverted(e){this.isDataConverted=e}},gr=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,n,a){let u=this.tensorManager.getMLContext(e),l=this.tensorManager.getMLOpSupportLimits(e),d;if(!(l!=null&&l.input.dataTypes.includes(t))){if(d=au.get(t),!d||!(l!=null&&l.input.dataTypes.includes(d)))throw new Error(`WebNN backend does not support data type: ${t}`);$e("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${d}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(u,t,n))return this.wrapper.tensor;if(a){if(this.wrapper.byteLength!==fr(t,n))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let c=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,n,c,!0,!0,d),a&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=su(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else $e("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,n;if(this.activeUpload){let a=(t=this.wrapper)!=null&&t.isDataConverted?pr(this.activeUpload,(n=this.wrapper)==null?void 0:n.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(a):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(a);return}else return a.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},ou=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=hr();return this.tensorTrackersById.set(e,new gr(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,n,a,u){$e("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${n}, shape: ${a}, copyOld: ${u}}`);let l=this.tensorTrackersById.get(t);if(!l)throw new Error("Tensor not found.");return l.ensureTensor(e,n,a,u)}upload(e,t){let n=this.tensorTrackersById.get(e);if(!n)throw new Error("Tensor not found.");n.upload(t)}async download(e,t){$e("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let n=this.tensorTrackersById.get(e);if(!n)throw new Error("Tensor not found.");return n.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,n,a){let u=this.getMLContext(e),l=hr(),d=new mr({sessionId:e,context:u,tensor:t,dataType:n,shape:a});return this.tensorTrackersById.set(l,new gr(this,d)),this.externalTensors.add(d),l}async getCachedTensor(e,t,n,a,u,l,d){let c=this.getMLContext(e);for(let[f,g]of this.freeTensors.entries())if(g.canReuseTensor(c,t,n)){$e("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${d?`fallbackDataType: ${d},`:""} shape: ${n}`);let _=this.freeTensors.splice(f,1)[0];return _.sessionId=e,_}$e("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${d?`fallbackDataType: ${d},`:""} shape: ${n}}`);let h=await c.createTensor({dataType:d??t,shape:n,dimensions:n,usage:a,writable:u,readable:l});return new mr({sessionId:e,context:c,tensor:h,dataType:t,shape:n,fallbackDataType:d})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},uu=(...e)=>new ou(...e)}),di,lu,du,Hg=w(()=>{"use strict";re(),mn(),iu(),Gg(),Dt(),di=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),lu=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let n=Object.keys(e).sort(),a=Object.keys(t).sort();return n.length===a.length&&n.every((u,l)=>u===a[l]&&e[u]===t[u])},du=class{constructor(e){this.tensorManager=uu(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,lr(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){$e("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){$e("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let n of t)$e("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${n}}`),this.tensorManager.releaseTensorId(n);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let n=this.mlContextCache.findIndex(a=>a.gpuDevice===e);if(n!==-1)return this.mlContextCache[n].mlContext;{let a=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:a}),a}}else if(e===void 0){let n=this.mlContextCache.findIndex(a=>a.options===void 0&&a.gpuDevice===void 0);if(n!==-1)return this.mlContextCache[n].mlContext;{let a=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:a}),a}}let t=this.mlContextCache.findIndex(n=>lu(n.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let n=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:n}),n}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let n=this.sessionIdsByMLContext.get(t);n||(n=new Set,this.sessionIdsByMLContext.set(t,n)),n.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let n=this.sessionIdsByMLContext.get(t);if(n.delete(e),n.size===0){this.sessionIdsByMLContext.delete(t);let a=this.mlContextCache.findIndex(u=>u.mlContext===t);a!==-1&&this.mlContextCache.splice(a,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){$e("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,n,a,u){let l=di.get(n);if(!l)throw new Error(`Unsupported ONNX data type: ${n}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,l,a,u)}async createTemporaryTensor(e,t,n){$e("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${n}}`);let a=di.get(t);if(!a)throw new Error(`Unsupported ONNX data type: ${t}`);let u=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,u,a,n,!1);let l=this.temporarySessionTensorIds.get(e);return l?l.push(u):this.temporarySessionTensorIds.set(e,[u]),u}uploadTensor(e,t){if(!Ie().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");$e("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let n=await this.tensorManager.download(e);return dr(n,t)}}registerMLTensor(e,t,n,a){let u=di.get(n);if(!u)throw new Error(`Unsupported ONNX data type: ${n}`);let l=this.tensorManager.registerTensor(e,t,u,a);return $e("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${u}, dimensions: ${a}} -> {tensorId: ${l}}`),l}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let n=this.sessionGraphInputs.get(e);return n?n.includes(t):!1}isGraphOutput(e,t){let n=this.sessionGraphOutputs.get(e);return n?n.includes(t):!1}isGraphInputOutputTypeSupported(e,t,n=!0){let a=di.get(_n(t)),u=this.mlOpSupportLimitsBySessionId.get(e);return typeof a>"u"?!1:n?!!(u!=null&&u.input.dataTypes.includes(a)):!!(u!=null&&u.output.dataTypes.includes(a))}flush(){}}}),_r=w(()=>{"use strict"}),yr,Zi,Ji,cu,pu,wr,br,hu,fu,Kg=w(()=>{"use strict";Dt(),_r(),yr=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),Zi=[],Ji=e=>Math.ceil(Number(e)/16)*16,cu=e=>{for(let t=0;t<Zi.length;t++){let n=Zi[t];if(e<=n)return n}return Math.ceil(e/16)*16},pu=1,wr=()=>pu++,br=async(e,t,n,a)=>{let u=Ji(n),l=e.device.createBuffer({size:u,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let d=e.getCommandEncoder();e.endComputePass(),d.copyBufferToBuffer(t,0,l,0,u),e.flush(),await l.mapAsync(GPUMapMode.READ);let c=l.getMappedRange();if(a){let h=a();return h.set(new Uint8Array(c,0,n)),h}else return new Uint8Array(c.slice(0,n))}finally{l.destroy()}},hu=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of yr)Zi.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let n=t.buffer,a=t.byteOffset,u=t.byteLength,l=Ji(u),d=this.storageCache.get(e);if(!d)throw new Error("gpu data for uploading does not exist");if(Number(d.originalSize)!==u)throw new Error(`inconsistent data size. gpu data size=${d.originalSize}, data size=${u}`);if(l===u&&a%4===0)this.backend.device.queue.writeBuffer(d.gpuData.buffer,0,n,a,u);else{let c=new Uint8Array(l);c.set(t),this.backend.device.queue.writeBuffer(d.gpuData.buffer,0,c,0,l)}$e("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let n=this.storageCache.get(e);if(!n)throw new Error("source gpu data for memcpy does not exist");let a=this.storageCache.get(t);if(!a)throw new Error("destination gpu data for memcpy does not exist");if(n.originalSize!==a.originalSize)throw new Error("inconsistent source and destination gpu data size");let u=Ji(n.originalSize),l=this.backend.getCommandEncoder();this.backend.endComputePass(),l.copyBufferToBuffer(n.gpuData.buffer,0,a.gpuData.buffer,0,u)}registerExternalBuffer(e,t,n){let a;if(n){if(a=n[0],e===n[1])return $e("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, buffer is the same, skip.`),a;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else a=wr();return this.storageCache.set(a,{gpuData:{id:a,type:0,buffer:e},originalSize:t}),$e("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, registered.`),a}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),$e("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let n=cu(e),a,u=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,l=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(u||l){let c=(u?this.freeBuffers:this.freeUniformBuffers).get(n);c?c.length>0?a=c.pop():a=this.backend.device.createBuffer({size:n,usage:t}):a=this.backend.device.createBuffer({size:n,usage:t})}else a=this.backend.device.createBuffer({size:n,usage:t});let d={id:wr(),type:0,buffer:a};return this.storageCache.set(d.id,{gpuData:d,originalSize:Number(e)}),$e("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${d.id}`),d}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,n=this.storageCache.get(t);if(!n){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return $e("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${n.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(n.gpuData.buffer),n.originalSize}async download(e,t){let n=this.storageCache.get(Number(e));if(!n)throw new Error("data does not exist");await br(this.backend,n.gpuData.buffer,n.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=yr.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let n=this.freeBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let n=this.freeUniformBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(n=>{n.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&($e("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(n=>{n.gpuData.buffer.destroy()}),this.storageCache=new Map)}},fu=(...e)=>new hu(...e)}),mu,ke,Ne=w(()=>{"use strict";mu=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},ke=e=>new mu(e)}),Un,Xi,Ze,Je,te,Ue,$r,Fn,Zt,Y,ci,U,Z,gu,vr,_u,yu,fe=w(()=>{"use strict";re(),pe(),Un=64,Xi=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Ze=(e,t=1)=>{let n=Xi(e,t);return typeof n=="string"?n:n[0]},Je=(e,t=1)=>{let n=Xi(e,t);return typeof n=="string"?n:n[1]},te=(...e)=>{let t=[];return e.forEach(n=>{n.length!==0&&t.push({type:12,data:n},{type:12,data:L.computeStrides(n)})}),t},Ue=e=>e%4===0?4:e%2===0?2:1,$r=(e="f32",t,n="0")=>!t||t===1?`${e}(${n})`:`vec${t}<${e}>(${n})`,Fn=(e,t,n)=>e==="f32"?n:t===1?`f32(${n})`:`vec${t}<f32>(${n})`,Zt=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,Y=(e,t,n,a)=>e.startsWith("uniforms.")&&n>4?typeof t=="string"?a==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:a==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:n>1?`${e}[${t}]`:e,ci=(e,t,n,a,u)=>{let l=typeof n=="number",d=l?n:n.length,c=[...new Array(d).keys()],h=d<2?"u32":d<=4?`vec${d}<u32>`:`array<u32, ${d}>`,f=Xi(t,u),g=typeof f=="string"?f:f[1],_=typeof f=="string"?f:f[0],b={indices:h,value:g,storage:_,tensor:t},x=F=>typeof F=="string"?F:`${F}u`,v={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},S=l?"uniforms.":"",T=`${S}${e}_shape`,k=`${S}${e}_strides`,E="";for(let F=0;F<d-1;F++)E+=`
    let dim${F} = current / ${Y(k,F,d)};
    let rest${F} = current % ${Y(k,F,d)};
    indices[${F}] = dim${F};
    current = rest${F};
    `;E+=`indices[${d-1}] = current;`;let A=d<2?"":`
  fn o2i_${e}(offset: u32) -> ${b.indices} {
    var indices: ${b.indices};
    var current = offset;
    ${E}
    return indices;
  }`,C=F=>(v.offsetToIndices=!0,d<2?F:`o2i_${e}(${F})`),O=[];if(d>=2)for(let F=d-1;F>=0;F--)O.push(`${Y(k,F,d)} * (indices[${F}])`);let P=d<2?"":`
  fn i2o_${e}(indices: ${b.indices}) -> u32 {
    return ${O.join("+")};
  }`,B=F=>(v.indicesToOffset=!0,d<2?F:`i2o_${e}(${F})`),N=(...F)=>d===0?"0u":`${b.indices}(${F.map(x).join(",")})`,W=(F,ne)=>d<2?`${F}`:`${Y(F,ne,d)}`,q=(F,ne,se)=>d<2?`${F}=${se};`:`${Y(F,ne,d)}=${se};`,ie={},X=(F,ne)=>{v.broadcastedIndicesToOffset=!0;let se=`${ne.name}broadcastedIndicesTo${e}Offset`;if(se in ie)return`${se}(${F})`;let V=[];for(let Re=d-1;Re>=0;Re--){let Fe=ne.indicesGet("outputIndices",Re+ne.rank-d);V.push(`${W(k,Re)} * (${Fe} % ${W(T,Re)})`)}return ie[se]=`fn ${se}(outputIndices: ${ne.type.indices}) -> u32 {
             return ${V.length>0?V.join("+"):"0u"};
           }`,`${se}(${F})`},ee=(F,ne)=>(()=>{if(b.storage===b.value)return`${e}[${F}]=${ne};`;if(b.storage==="vec2<u32>"&&b.value==="i32")return`${e}[${F}]=vec2<u32>(u32(${ne}), select(0u, 0xFFFFFFFFu, ${ne} < 0));`;if(b.storage==="vec2<u32>"&&b.value==="u32")return`${e}[${F}]=vec2<u32>(u32(${ne}), 0u);`;if(b.storage==="u32"&&b.value==="vec4<bool>")return`${e}[${F}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${ne}));`;throw new Error(`not supported combination of storage type ${b.storage} and value type ${b.value} yet`)})(),_e=F=>(()=>{if(b.storage===b.value)return`${e}[${F}]`;if(b.storage==="vec2<u32>"&&b.value==="i32")return`i32(${e}[${F}].x)`;if(b.storage==="vec2<u32>"&&b.value==="u32")return`u32(${e}[${F}].x)`;if(b.storage==="u32"&&b.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${F}] & 0xFFu), bool(${e}[${F}] & 0xFF00u), bool(${e}[${F}] & 0xFF0000u), bool(${e}[${F}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${b.storage} and value type ${b.value} yet`)})(),ve=d<2?"":`
  fn get_${e}ByIndices(indices: ${b.indices}) -> ${g} {
    return ${_e(`i2o_${e}(indices)`)};
  }`,ue=d<2?"":(()=>{let F=c.map(se=>`d${se}: u32`).join(", "),ne=c.map(se=>`d${se}`).join(", ");return`
  fn get_${e}(${F}) -> ${g} {
    return get_${e}ByIndices(${N(ne)});
  }`})(),me=(...F)=>{if(F.length!==d)throw new Error(`indices length must be ${d}`);let ne=F.map(x).join(",");return d===0?_e("0u"):d===1?_e(ne[0]):(v.get=!0,v.getByIndices=!0,v.indicesToOffset=!0,`get_${e}(${ne})`)},we=F=>d<2?_e(F):(v.getByIndices=!0,v.indicesToOffset=!0,`get_${e}ByIndices(${F})`),ae=d<2?"":`
  fn set_${e}ByIndices(indices: ${b.indices}, value: ${g}) {
    ${ee(`i2o_${e}(indices)`,"value")}
  }`,De=d<2?"":(()=>{let F=c.map(se=>`d${se}: u32`).join(", "),ne=c.map(se=>`d${se}`).join(", ");return`
  fn set_${e}(${F}, value: ${g}) {
    set_${e}ByIndices(${N(ne)}, value);
  }`})();return{impl:()=>{let F=[],ne=!1;return v.offsetToIndices&&(F.push(A),ne=!0),v.indicesToOffset&&(F.push(P),ne=!0),v.broadcastedIndicesToOffset&&(Object.values(ie).forEach(se=>F.push(se)),ne=!0),v.set&&(F.push(De),ne=!0),v.setByIndices&&(F.push(ae),ne=!0),v.get&&(F.push(ue),ne=!0),v.getByIndices&&(F.push(ve),ne=!0),!l&&ne&&F.unshift(`const ${T} = ${b.indices}(${n.join(",")});`,`const ${k} = ${b.indices}(${L.computeStrides(n).join(",")});`),F.join(`
`)},type:b,offsetToIndices:C,indicesToOffset:B,broadcastedIndicesToOffset:X,indices:N,indicesGet:W,indicesSet:q,set:(...F)=>{if(F.length!==d+1)throw new Error(`indices length must be ${d}`);let ne=F[d];if(typeof ne!="string")throw new Error("value must be string");let se=F.slice(0,d).map(x).join(",");return d===0?ee("0u",ne):d===1?ee(se[0],ne):(v.set=!0,v.setByIndices=!0,v.indicesToOffset=!0,`set_${e}(${se}, ${ne})`)},setByOffset:ee,setByIndices:(F,ne)=>d<2?ee(F,ne):(v.setByIndices=!0,v.indicesToOffset=!0,`set_${e}ByIndices(${F}, ${ne});`),get:me,getByOffset:_e,getByIndices:we,usage:a,name:e,strides:k,shape:T,rank:d}},U=(e,t,n,a=1)=>ci(e,t,n,"input",a),Z=(e,t,n,a=1)=>ci(e,t,n,"output",a),gu=(e,t,n)=>ci(e,t,n,"atomicOutput",1),vr=(e,t,n,a=1)=>ci(e,t,n,"internal",a),_u=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=Un){let t=typeof e=="number"?e:e[0],n=typeof e=="number"?1:e[1],a=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||n>this.limits.maxComputeWorkgroupSizeY||a>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${n}, ${a}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*n*a>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${n}, ${a}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let u=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,l=u?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,d=u?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*n*a}u + local_idx;`;return`@compute @workgroup_size(${t}, ${n}, ${a})
  fn main(${l}) {
    ${d}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let n=e.usage==="input"?"read":"read_write",a=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${n}> ${e.name}: array<${a}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,n=1){return this.uniforms.push({name:e,type:t,length:n}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:n,length:a}of this.uniforms)if(a&&a>4)n==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${n}>, ${Math.ceil(a/8)}>`):e.push(`${t}:array<vec4<${n}>, ${Math.ceil(a/4)}>`);else{let u=a==null||a===1?n:`vec${a}<${n}>`;e.push(`${t}:${u}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},yu=(e,t)=>new _u(e,t)}),wu,xr,bu,$u,vu,xu,pt,Eu,ku,Jt=w(()=>{"use strict";re(),pe(),Ne(),fe(),wu=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},xr=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),bu=(e,t)=>L.sortBasedOnPerm(e,xr(e.length,t)),$u=(e,t,n,a)=>{let u=`fn perm(i: ${a.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`;for(let l=0;l<t;++l)u+=`a[${e[l]}]=i[${l}];`;return u+="return a;}"},vu=(e,t)=>{let n=[],a=[];for(let u=0;u<e.length;++u)e[u]!==1&&n.push(e[u]),e[t[u]]!==1&&a.push(t[u]);return{newShape:n,newPerm:a}},xu=(e,t)=>{let n=0;for(let a=0;a<e.length;++a)if(t[e[a]]!==1){if(e[a]<n)return!1;n=e[a]}return!0},pt=(e,t)=>{let n=e.dataType,a=e.dims.length,u=xr(a,t),l=bu(e.dims,u),d=e.dims,c=l,h=a<2||xu(u,e.dims),f;if(h)return f=v=>{let S=U("input",n,d,4),T=Z("output",n,c,4);return`
  ${v.registerUniform("output_size","u32").declareVariables(S,T)}
  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let v=L.size(l);return{outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(v/64/4)},programUniforms:[{type:12,data:Math.ceil(v/4)}]}},getShaderSource:f};let{newShape:g,newPerm:_}=vu(e.dims,u),b=L.areEqual(_,[2,3,1]),x=L.areEqual(_,[3,1,2]);if(g.length===2||b||x){d=b?[g[0],g[1]*g[2]]:x?[g[0]*g[1],g[2]]:g,c=[d[1],d[0]];let v=16;return f=S=>{let T=U("a",n,d.length),k=Z("output",n,c.length);return`
  ${S.registerUniform("output_size","u32").declareVariables(T,k)}
  var<workgroup> tile : array<array<${k.type.value}, ${v+1}>, ${v}>;
  ${S.mainStart([v,v,1])}
    let stride = (uniforms.output_shape[1] - 1) / ${v} + 1;
    let workgroup_id_x = workgroup_index % stride;
    let workgroup_id_y = workgroup_index / stride;
    let input_col = workgroup_id_y * ${v}u + local_id.x;
    let input_row = workgroup_id_x * ${v}u + local_id.y;
    if (input_row < uniforms.a_shape[0] && input_col < uniforms.a_shape[1]) {
      tile[local_id.y][local_id.x] = ${T.getByIndices(`${T.type.indices}(input_row, input_col)`)};
    }
    workgroupBarrier();

    let output_col = workgroup_id_x * ${v}u + local_id.x;
    let output_row = workgroup_id_y * ${v}u + local_id.y;
    if (output_row < uniforms.output_shape[0] && output_col < uniforms.output_shape[1]) {
      ${k.setByIndices(`${k.type.indices}(output_row, output_col)`,"tile[local_id.x][local_id.y]")}
    }
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let S=L.size(l);return{outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(c[1]/v),y:Math.ceil(c[0]/v)},programUniforms:[{type:12,data:S},...te(d,c)]}},getShaderSource:f}}return f=v=>{let S=U("a",n,d.length),T=Z("output",n,c.length);return`
  ${v.registerUniform("output_size","u32").declareVariables(S,T)}

  ${$u(u,a,S,T)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${T.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${T.setByOffset("global_idx",S.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let v=L.size(l);return{outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:[{type:12,data:v},...te(d,c)]}},getShaderSource:f}},Eu=(e,t)=>{wu(e.inputs,t.perm),e.compute(pt(e.inputs[0],t.perm))},ku=e=>ke({perm:e.perm})}),Su,Iu,Tu,Au,zu,Cu,Ou,Mu,Ru,Pu,wt,Du,Bu,Lu,Nu,Uu,Fu,Wu,ju,Vu,qu,Zg=w(()=>{"use strict";re(),pe(),fe(),kr(),Jt(),Su={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},Iu={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},Tu={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},Au={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},zu=(e,t)=>{let n=[];for(let a=t-e;a<t;++a)n.push(a);return n},Cu=(e,t)=>{let n=[],a=e.length;for(let l=0;l<a;l++)t.indexOf(l)===-1&&n.push(e[l]);let u=t.map(l=>e[l]);return[n,u]},Ou=(e,t)=>{let n=e.length+t.length,a=[],u=0;for(let l=0;l<n;l++)t.indexOf(l)===-1?a.push(e[u++]):a.push(1);return a},Mu=(e,t)=>{for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0},Ru=(e,t)=>{let n=[];if(!Mu(e,t)){for(let a=0;a<t;++a)e.indexOf(a)===-1&&n.push(a);e.forEach(a=>n.push(a))}return n},Pu=(e,t,n,a,u,l,d)=>{let c=n[0].dims,h=L.size(l),f=L.size(d),g=U("_A",n[0].dataType,c),_=Z("output",u,l),b=64;h===1&&(b=256);let x=`
          var<workgroup> aBestValues : array<f32, ${b}>;
       `,v=S=>`
        ${S.registerUniform("reduceSize","u32").declareVariables(g,_)}
        ${x}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${S.mainStart(b)}

          let outputIndex = global_idx / ${b};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${Tu[a]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${b}) {
           let candidate = f32(${g.getByOffset("offset + k")});
           bestValue = ${Su[a]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${b}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${Iu[a]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${_.setByOffset("outputIndex",`${a==="mean"?`${_.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${_.type.storage}(${Au[a]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${b}`,inputDependencies:["type"]},getShaderSource:v,getRunData:()=>({outputs:[{dims:l,dataType:u}],dispatchGroup:{x:h},programUniforms:[{type:12,data:f}]})}},wt=(e,t,n,a)=>{let u=e.inputs.length===1?n:Er(e.inputs,n),l=u.axes;l.length===0&&!u.noopWithEmptyAxes&&(l=e.inputs[0].dims.map((x,v)=>v));let d=L.normalizeAxes(l,e.inputs[0].dims.length),c=d,h=e.inputs[0],f=Ru(c,e.inputs[0].dims.length);f.length>0&&(h=e.compute(pt(e.inputs[0],f),{inputs:[0],outputs:[-1]})[0],c=zu(c.length,h.dims.length));let[g,_]=Cu(h.dims,c),b=g;u.keepDims&&(b=Ou(g,d)),e.compute(Pu(t,u.cacheKey,[h],a,e.inputs[0].dataType,b,_),{inputs:[h]})},Du=(e,t)=>{wt(e,"ReduceMeanShared",t,"mean")},Bu=(e,t)=>{wt(e,"ReduceL1Shared",t,"l1")},Lu=(e,t)=>{wt(e,"ReduceL2Shared",t,"l2")},Nu=(e,t)=>{wt(e,"ReduceLogSumExpShared",t,"logSumExp")},Uu=(e,t)=>{wt(e,"ReduceMaxShared",t,"max")},Fu=(e,t)=>{wt(e,"ReduceMinShared",t,"min")},Wu=(e,t)=>{wt(e,"ReduceProdShared",t,"prod")},ju=(e,t)=>{wt(e,"ReduceSumShared",t,"sum")},Vu=(e,t)=>{wt(e,"ReduceSumSquareShared",t,"sumSquare")},qu=(e,t)=>{wt(e,"ReduceLogSumShared",t,"logSum")}}),bt,Gu,Yi,Er,$t,Hu,Ku,Zu,Ju,Xu,Yu,Qu,el,tl,nl,vt,il,sl,rl,al,ol,ul,ll,dl,cl,pl,kr=w(()=>{"use strict";re(),pe(),Ne(),fe(),Zg(),bt=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Gu=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],Yi=(e,t,n,a,u,l,d=!1,c=!1)=>{let h=[],f=n[0].dims,g=f.length,_=L.normalizeAxes(u,g),b=!c&&_.length===0;f.forEach((S,T)=>{b||_.indexOf(T)>=0?d&&h.push(1):h.push(S)});let x=h.length,v=L.size(h);return{name:e,shaderCache:t,getShaderSource:S=>{let T=[],k=U("_A",n[0].dataType,g),E=Z("output",l,x),A=a(k,E,_),C=A[2];for(let O=0,P=0;O<g;O++)b||_.indexOf(O)>=0?(d&&P++,C=`for(var j${O}: u32 = 0; j${O} < ${f[O]}; j${O}++) {
                  ${A[2].includes("last_index")?`let last_index = j${O};`:""}
                  ${k.indicesSet("input_indices",O,`j${O}`)}
                  ${C}
                }`):(T.push(`${k.indicesSet("input_indices",O,E.indicesGet("output_indices",P))};`),P++);return`

        ${S.registerUniform("output_size","u32").declareVariables(k,E)}

        ${S.mainStart()}
          ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${k.type.indices};
          let output_indices = ${E.offsetToIndices("global_idx")};

          ${T.join(`
`)}
          ${A[0]}       // init ops for reduce max/min
          ${A[1]}
          ${C}
          ${A[3]}
          ${A.length===4?E.setByOffset("global_idx","value"):A.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:h,dataType:l}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:[{type:12,data:v},...te(f,h)]})}},Er=(e,t)=>{let n=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(a=>n.push(Number(a))),ke({axes:n,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},$t=(e,t,n,a)=>{let u=e.inputs,l=u.length===1?n:Er(u,n);e.compute(Yi(t,{hint:l.cacheKey,inputDependencies:["rank"]},[u[0]],l.noopWithEmptyAxes&&l.axes.length===0?Gu:a,l.axes,u[0].dataType,l.keepDims,l.noopWithEmptyAxes),{inputs:[0]})},Hu=(e,t)=>{bt(e.inputs),$t(e,"ReduceLogSum",t,(n,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${n.getByIndices("input_indices")};`,"value = log(value);"])},Ku=(e,t)=>{bt(e.inputs),$t(e,"ReduceL1",t,(n,a)=>[`var value = ${a.type.storage}(0);`,"",`value += abs(${n.getByIndices("input_indices")});`,""])},Zu=(e,t)=>{bt(e.inputs),$t(e,"ReduceL2",t,(n,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${n.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},Ju=(e,t)=>{bt(e.inputs),$t(e,"ReduceLogSumExp",t,(n,a)=>[`var value = ${a.type.storage}(0);`,"",`value += exp(${n.getByIndices("input_indices")});`,"value = log(value);"])},Xu=(e,t)=>{bt(e.inputs),$t(e,"ReduceMax",t,(n,a,u)=>{let l=[];for(let d=0;d<n.rank;d++)(u.indexOf(d)>=0||u.length===0)&&l.push(n.indicesSet("input_indices",d,0));return[`${l.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};`,`value = max(value, ${n.getByIndices("input_indices")});`,""]})},Yu=(e,t)=>{bt(e.inputs),$t(e,"ReduceMean",t,(n,a,u)=>{let l=1;for(let d=0;d<n.rank;d++)(u.indexOf(d)>=0||u.length===0)&&(l*=e.inputs[0].dims[d]);return["var sum = f32(0);","",`sum += f32(${n.getByIndices("input_indices")});`,`let value = ${a.type.value}(sum / ${l});`]})},Qu=(e,t)=>{bt(e.inputs),$t(e,"ReduceMin",t,(n,a,u)=>{let l=[];for(let d=0;d<n.rank;d++)(u.indexOf(d)>=0||u.length===0)&&l.push(`input_indices[${d}] = 0;`);return[`${l.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};`,`value = min(value, ${n.getByIndices("input_indices")});`,""]})},el=(e,t)=>{bt(e.inputs),$t(e,"ReduceProd",t,(n,a)=>[`var value = ${a.type.storage}(1);`,"",`value *= ${n.getByIndices("input_indices")};`,""])},tl=(e,t)=>{bt(e.inputs),$t(e,"ReduceSum",t,(n,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${n.getByIndices("input_indices")};`,""])},nl=(e,t)=>{bt(e.inputs),$t(e,"ReduceSumSquare",t,(n,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${n.getByIndices("input_indices")}; value += t * t;`,""])},vt=(e,t,n)=>{if(t.length===0)return n;let a=1,u=1;for(let l=0;l<t.length;l++)t.indexOf(l)===-1?a*=e[l]:u*=e[l];return u<32&&a>1024},il=(e,t)=>{vt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Yu(e,t):Du(e,t)},sl=(e,t)=>{vt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ku(e,t):Bu(e,t)},rl=(e,t)=>{vt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Zu(e,t):Lu(e,t)},al=(e,t)=>{vt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ju(e,t):Nu(e,t)},ol=(e,t)=>{vt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Xu(e,t):Uu(e,t)},ul=(e,t)=>{vt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Qu(e,t):Fu(e,t)},ll=(e,t)=>{vt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?el(e,t):Wu(e,t)},dl=(e,t)=>{vt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?tl(e,t):ju(e,t)},cl=(e,t)=>{vt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?nl(e,t):Vu(e,t)},pl=(e,t)=>{vt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Hu(e,t):qu(e,t)}}),Sr,hl,fl,Ir,Jg=w(()=>{"use strict";re(),Ne(),kr(),Sr=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},hl=(e,t)=>{Sr(e.inputs);let n=(a,u,l)=>{let d=[];for(let c=0;c<a.rank;c++)(l.indexOf(c)>=0||l.length===0)&&d.push(`input_indices[${c}] = 0;`);return[`${d.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",u.setByOffset("global_idx","best_index")]};e.compute(Yi("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],n,[t.axis],7,t.keepDims),{inputs:[0]})},fl=(e,t)=>{Sr(e.inputs);let n=(a,u,l)=>{let d=[];for(let c=0;c<a.rank;c++)(l.indexOf(c)>=0||l.length===0)&&d.push(`input_indices[${c}] = 0;`);return[`${d.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",u.setByOffset("global_idx","best_index")]};e.compute(Yi("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],n,[t.axis],7,t.keepDims),{inputs:[0]})},Ir=e=>ke(e)}),ml,Qi,gl,_l,yl,pi,wl,bl,Tr=w(()=>{"use strict";re(),pe(),_r(),fe(),ml=(e,t)=>{let n=e[0],a=e[1],u=e[2],l=e[3],d=e[4],c=e[5];if(d&&c)throw new Error("Attention cannot have both past and attention_bias");if(n.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let h=n.dims[0],f=n.dims[1],g=n.dims[2];if(u.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(a.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(a.dims[0]!==g)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(u.dims[0]!==a.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let _=u.dims[0]/3,b=_,x=b;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let A of t.qkvHiddenSizes)if(A%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");_=t.qkvHiddenSizes[0],b=t.qkvHiddenSizes[1],x=t.qkvHiddenSizes[2]}let v=f;if(_!==b)throw new Error("qkv_hidden_sizes first element should be same as the second");if(u.dims[0]!==_+b+x)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let S=0;if(d){if(b!==x)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(d.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(d.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(d.dims[1]!==h)throw new Error('Input "past" second dimension must be batch_size');if(d.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(d.dims[4]!==b/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(S=d.dims[3])}let T=v+S,k=-1,E=0;if(l)throw new Error("Mask not supported");if(d)throw new Error("past is not supported");if(c){if(c.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(c.dims[0]!==h||c.dims[1]!==t.numHeads||c.dims[2]!==f||c.dims[3]!==T)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:h,sequenceLength:f,pastSequenceLength:S,kvSequenceLength:v,totalSequenceLength:T,maxSequenceLength:k,inputHiddenSize:g,hiddenSize:_,vHiddenSize:x,headSize:Math.floor(_/t.numHeads),vHeadSize:Math.floor(x/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:E,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},Qi=(e,t,n)=>t&&e?`
      let total_sequence_length_input = u32(${t.getByOffset("0")});
      let present_sequence_length = max(total_sequence_length_input, uniforms.past_sequence_length);
      let is_subsequent_prompt: bool = sequence_length > 1 && sequence_length != total_sequence_length_input;
      let is_first_prompt: bool = is_subsequent_prompt == false && sequence_length == total_sequence_length_input;
      total_sequence_length = u32(${e==null?void 0:e.getByOffset("batchIdx")}) + 1;
      var past_sequence_length: u32 = 0;
      if (is_first_prompt == false) {
        past_sequence_length = total_sequence_length - sequence_length;
      }
       `:`
    ${n?"let past_sequence_length = uniforms.past_sequence_length":""};
    let present_sequence_length = total_sequence_length;
    `,gl=(e,t,n,a,u,l,d,c)=>{let h=Ue(d?1:l),f=64,g=l/h;g<f&&(f=32);let _=Math.ceil(l/h/f),b=[{type:12,data:t},{type:12,data:n},{type:12,data:a},{type:12,data:u},{type:12,data:g},{type:12,data:_}],x=Ze(e.dataType,h),v=Je(1,h),S=["type"];d&&S.push("type"),c&&S.push("type");let T=k=>{let E=Z("x",e.dataType,e.dims,h),A=[E],C=d?U("seq_lens",d.dataType,d.dims):void 0;C&&A.push(C);let O=c?U("total_sequence_length_input",c.dataType,c.dims):void 0;O&&A.push(O);let P=Je(e.dataType),B=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${f}>;
  var<workgroup> thread_sum: array<f32, ${f}>;
  ${k.registerUniforms(B).declareVariables(...A)}
  ${k.mainStart([f,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${Qi(C,O,!1)}
    let local_offset = local_idx * uniforms.elements_per_thread;
    let offset = (global_idx / ${f}) * uniforms.total_sequence_length + local_offset;
    let seq_causal_length = ${d?"u32(past_sequence_length + workgroup_id.y + 1)":"total_sequence_length"};
    var thread_max_vector = ${v}(-3.4028234663852886e+38f);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      thread_max_vector = max(${v}(x[offset + i]), thread_max_vector);
    }
    thread_max[local_idx] = ${(()=>{switch(h){case 1:return"thread_max_vector";case 2:return"max(thread_max_vector.x, thread_max_vector.y)";case 4:return"max(max(thread_max_vector.x, thread_max_vector.y), max(thread_max_vector.z, thread_max_vector.w))";default:throw new Error(`Unsupported components: ${h}`)}})()};
    workgroupBarrier();

    var max_value =  f32(-3.4028234663852886e+38f);
    for (var i = 0u; i < ${f}; i++) {
      max_value = max(thread_max[i], max_value);
    }

    var sum_vector = ${v}(0);
    for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
      sum_vector += exp(${v}(x[offset + i]) - max_value);
    }
    thread_sum[local_idx] = ${(()=>{switch(h){case 1:return"sum_vector";case 2:return"sum_vector.x + sum_vector.y";case 4:return"sum_vector.x + sum_vector.y + sum_vector.z + sum_vector.w";default:throw new Error(`Unsupported components: ${h}`)}})()};
    workgroupBarrier();

    var sum: f32 = 0;
    for (var i = 0u; i < ${f}; i++) {
      sum += thread_sum[i];
    }

    if (sum == 0) {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        x[offset + i] = ${E.type.value}(${P}(1.0) / ${P}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${v}(x[offset + i]);
        x[offset + i] = ${E.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${d?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${E.type.value}(${P}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${f};${x};${h}`,inputDependencies:S},getShaderSource:T,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:u,z:t*n},programUniforms:b})}},_l=(e,t,n,a,u,l,d,c,h)=>{let f=d+l.kvSequenceLength,g=[l.batchSize,l.numHeads,l.sequenceLength,f],_=e>1&&a,b=l.kvNumHeads?l.kvNumHeads:l.numHeads,x=_?[l.batchSize,b,f,l.headSize]:void 0,v=l.nReps?l.nReps:1,S=l.scale===0?1/Math.sqrt(l.headSize):l.scale,T=Ue(l.headSize),k=l.headSize/T,E=12,A={x:Math.ceil(f/E),y:Math.ceil(l.sequenceLength/E),z:l.batchSize*l.numHeads},C=[{type:12,data:l.sequenceLength},{type:12,data:k},{type:12,data:f},{type:12,data:l.numHeads},{type:12,data:l.headSize},{type:1,data:S},{type:12,data:d},{type:12,data:l.kvSequenceLength},{type:12,data:v}],O=_&&a&&L.size(a.dims)>0,P=["type","type"];O&&P.push("type"),u&&P.push("type"),c&&P.push("type"),h&&P.push("type");let B=[{dims:g,dataType:t.dataType,gpuDataType:0}];_&&B.push({dims:x,dataType:t.dataType,gpuDataType:0});let N=W=>{let q=U("q",t.dataType,t.dims,T),ie=U("key",n.dataType,n.dims,T),X=[q,ie];if(O){let ae=U("past_key",a.dataType,a.dims,T);X.push(ae)}u&&X.push(U("attention_bias",u.dataType,u.dims));let ee=c?U("seq_lens",c.dataType,c.dims):void 0;ee&&X.push(ee);let _e=h?U("total_sequence_length_input",h.dataType,h.dims):void 0;_e&&X.push(_e);let ve=Z("output",t.dataType,g),ue=[ve];_&&ue.push(Z("present_key",t.dataType,x,T));let me=Je(1,T),we=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${E}u;

  var<workgroup> tileQ: array<${q.type.storage}, ${E*E}>;
  var<workgroup> tileK: array<${q.type.storage}, ${E*E}>;
  ${W.registerUniforms(we).declareVariables(...X,...ue)}
  ${W.mainStart([E,E,1])}
    // x holds the N and y holds the M
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let kvHeadIdx = ${v===1?"headIdx":"headIdx / uniforms.n_reps"};
    let kv_num_heads = ${v===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let m = workgroup_id.y * TILE_SIZE;
    let n = workgroup_id.x * TILE_SIZE;
    let sequence_length = uniforms.M;
    var total_sequence_length = uniforms.N;
    ${Qi(ee,_e,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${O&&_?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${_?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${me}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${O&&_?`
              if (n + local_id.y < past_sequence_length) {
                tileK[idx] = past_key[pastKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
              } else if (n + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
                tileK[idx] = key[kOffset + (n + local_id.y - past_sequence_length) * uniforms.K + w + local_id.x];
              }`:`
          if (n + local_id.y < uniforms.kv_sequence_length) {
            tileK[idx] = key[kOffset + (n + local_id.y) * uniforms.K + w + local_id.x];
          }`}
      ${_?`if (n + local_id.y < present_sequence_length) {
        present_key[presentKeyOffset + (n + local_id.y) * uniforms.K + w + local_id.x] = tileK[idx];
      }`:""}
      }
      workgroupBarrier();

      for (var k: u32 = 0u; k < TILE_SIZE && w+k < uniforms.K; k++) {
          value += ${me}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(T){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${T}`)}})()};
        output[outputIdx] = ${ve.type.value} (sum * uniforms.alpha) + ${u?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${T};${u!==void 0};${a!==void 0};${e}`,inputDependencies:P},getRunData:()=>({outputs:B,dispatchGroup:A,programUniforms:C}),getShaderSource:N}},yl=(e,t,n,a,u,l,d=void 0,c=void 0)=>{let h=l+u.kvSequenceLength,f=u.nReps?u.nReps:1,g=u.vHiddenSize*f,_=e>1&&a,b=u.kvNumHeads?u.kvNumHeads:u.numHeads,x=_?[u.batchSize,b,h,u.headSize]:void 0,v=[u.batchSize,u.sequenceLength,g],S=12,T={x:Math.ceil(u.vHeadSize/S),y:Math.ceil(u.sequenceLength/S),z:u.batchSize*u.numHeads},k=[{type:12,data:u.sequenceLength},{type:12,data:h},{type:12,data:u.vHeadSize},{type:12,data:u.numHeads},{type:12,data:u.headSize},{type:12,data:g},{type:12,data:l},{type:12,data:u.kvSequenceLength},{type:12,data:f}],E=_&&a&&L.size(a.dims)>0,A=["type","type"];E&&A.push("type"),d&&A.push("type"),c&&A.push("type");let C=[{dims:v,dataType:t.dataType,gpuDataType:0}];_&&C.push({dims:x,dataType:t.dataType,gpuDataType:0});let O=P=>{let B=U("probs",t.dataType,t.dims),N=U("v",n.dataType,n.dims),W=[B,N];E&&W.push(U("past_value",a.dataType,a.dims));let q=d?U("seq_lens",d.dataType,d.dims):void 0;d&&W.push(q);let ie=c?U("total_sequence_length_input",c.dataType,c.dims):void 0;c&&W.push(ie);let X=[Z("output",t.dataType,v)];_&&X.push(Z("present_value",t.dataType,x));let ee=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${S}u;
  var<workgroup> tileQ: array<${B.type.value}, ${S*S}>;
  var<workgroup> tileV: array<${B.type.value}, ${S*S}>;
  ${P.registerUniforms(ee).declareVariables(...W,...X)}
  ${P.mainStart([S,S,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${f===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${f===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${Qi(q,ie,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${E&&_?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${_?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${B.type.storage}(0);
   for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = probs[offsetA + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
        ${E&&_?`
        if (w + local_id.y < past_sequence_length) {
          tileV[idx] = past_value[pastValueOffset + (w + local_id.y) * uniforms.N];
        } else if (w + local_id.y - past_sequence_length < uniforms.kv_sequence_length) {
          tileV[idx] = v[vOffset + (w + local_id.y - past_sequence_length) * uniforms.N];
        }
      `:`
            if (w + local_id.y < uniforms.kv_sequence_length) {
              tileV[idx] = v[vOffset + (w + local_id.y) * uniforms.N];
            }`}
        ${_?`
            if (w + local_id.y < present_sequence_length) {
          present_value[presentValueOffset + (w + local_id.y) * uniforms.N] = tileV[idx];
        }`:""}
      }
     workgroupBarrier();
     for (var k: u32 = 0u; k < TILE_SIZE && w+k < total_sequence_length; k++) {
       value += tileQ[TILE_SIZE * local_id.y + k] * tileV[TILE_SIZE * k + local_id.x];
     }
     workgroupBarrier();
   }

   // we need to transpose output from BNSH_v to BSND_v
   if (m < uniforms.M && n < uniforms.N) {
     let outputIdx = batchIdx * uniforms.M * uniforms.v_hidden_size + m * uniforms.v_hidden_size
       + headIdx * uniforms.N + n;
     output[outputIdx] = value;
   }
  }`};return{name:"AttentionScore",shaderCache:{hint:`${a!==void 0};${e}`,inputDependencies:A},getRunData:()=>({outputs:C,dispatchGroup:T,programUniforms:k}),getShaderSource:O}},pi=(e,t,n,a,u,l,d,c,h,f,g=void 0,_=void 0)=>{let b=Math.min(e.outputCount,1+(d?1:0)+(c?1:0)),x=b>1?d:void 0,v=b>1?c:void 0,S=b>1?f.pastSequenceLength:0,T=S+f.kvSequenceLength,k=h&&L.size(h.dims)>0?h:void 0,E=[t,n];x&&L.size(x.dims)>0&&E.push(x),k&&E.push(k),g&&E.push(g),_&&E.push(_);let A=e.compute(_l(b,t,n,x,k,f,S,g,_),{inputs:E,outputs:b>1?[-1,1]:[-1]})[0];e.compute(gl(A,f.batchSize,f.numHeads,S,f.sequenceLength,T,g,_),{inputs:g&&_?[A,g,_]:[A],outputs:[]});let C=[A,a];v&&L.size(v.dims)>0&&C.push(v),g&&C.push(g),_&&C.push(_),e.compute(yl(b,A,a,v,f,S,g,_),{inputs:C,outputs:b>1?[0,2]:[0]})},wl=(e,t)=>{let n=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],a=t.sequenceLength,u=t.inputHiddenSize,l=t.headSize,d=12,c={x:Math.ceil(t.headSize/d),y:Math.ceil(t.sequenceLength/d),z:t.batchSize*t.numHeads},h=[e.inputs[0],e.inputs[1],e.inputs[2]],f=[{type:12,data:a},{type:12,data:u},{type:12,data:l},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],g=_=>{let b=Z("output_q",h[0].dataType,n),x=Z("output_k",h[0].dataType,n),v=Z("output_v",h[0].dataType,n),S=U("input",h[0].dataType,h[0].dims),T=U("weight",h[1].dataType,h[1].dims),k=U("bias",h[2].dataType,h[2].dims),E=S.type.storage,A=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${d}u;
  var<workgroup> tileInput: array<${E}, ${d*d}>;
  var<workgroup> tileWeightQ: array<${E}, ${d*d}>;
  var<workgroup> tileWeightK: array<${E}, ${d*d}>;
  var<workgroup> tileWeightV: array<${E}, ${d*d}>;
  ${_.registerUniforms(A).declareVariables(S,T,k,b,x,v)}
  ${_.mainStart([d,d,1])}
    let batchIndex = workgroup_id.z / uniforms.num_heads;
    let headNumber = workgroup_id.z % uniforms.num_heads;
    let m = global_id.y;
    let n = global_id.x;

    let inputOffset = batchIndex * (uniforms.M * uniforms.K) + m * uniforms.K;
    let biasOffsetQ = headNumber * uniforms.head_size;
    let biasOffsetK = uniforms.hidden_size + biasOffsetQ;
    let biasOffsetV = uniforms.hidden_size + biasOffsetK;

    var valueQ = ${E}(0);
    var valueK = ${E}(0);
    var valueV = ${E}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (m < uniforms.M && w + local_id.x < uniforms.K) {
        tileInput[TILE_SIZE * local_id.y + local_id.x] = input[inputOffset + w + local_id.x];
      }
      if (n < uniforms.N && w + local_id.y < uniforms.K) {
        let offset = n + (w + local_id.y) * uniforms.ldb;
        tileWeightQ[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetQ + offset];
        tileWeightK[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetK + offset];
        tileWeightV[TILE_SIZE * local_id.y + local_id.x] = weight[biasOffsetV + offset];
      }
      workgroupBarrier();
      for (var k: u32 = 0u; k<TILE_SIZE && w+k < uniforms.K; k++) {
        let inputTileOffset = TILE_SIZE * local_id.y + k;
        let weightTileOffset = TILE_SIZE * k + local_id.x;
        valueQ += tileInput[inputTileOffset] * tileWeightQ[weightTileOffset];
        valueK += tileInput[inputTileOffset] * tileWeightK[weightTileOffset];
        valueV += tileInput[inputTileOffset] * tileWeightV[weightTileOffset];
      }

      workgroupBarrier();
    }

    let headOffset = (m * uniforms.N + n) % uniforms.head_size;
    valueQ += bias[headOffset + biasOffsetQ];
    valueK += bias[headOffset + biasOffsetK];
    valueV += bias[headOffset + biasOffsetV];

    let offset = workgroup_id.z * uniforms.M * uniforms.N;
    if (m < uniforms.M && n < uniforms.N) {
      let outputIdx = offset + m * uniforms.N + n;
      output_q[outputIdx] = valueQ;
      output_k[outputIdx] = valueK;
      output_v[outputIdx] = valueV;
    }
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:c,programUniforms:f}),getShaderSource:g},{inputs:h,outputs:[-1,-1,-1]})},bl=(e,t)=>{let n=ml(e.inputs,t),[a,u,l]=wl(e,n);return pi(e,a,u,l,e.inputs[4],void 0,void 0,void 0,e.inputs[5],n)}}),$l,vl,xl,El,Xg=w(()=>{"use strict";qe(),re(),pe(),Ne(),fe(),$l=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let n=(a,u,l)=>{let d=u.length;if(d!==a.length)throw new Error(`${l}: num dimensions != ${d}`);u.forEach((c,h)=>{if(c!==a[h])throw new Error(`${l}: dim[${h}] do not match`)})};if(e[0].dims.length>1){let a=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);n(e[1].dims,a,"Invalid input scale"),n(e[2].dims,a,"Invalid input B"),n(e[3].dims,a,"Invalid input mean"),n(e[4].dims,a,"Invalid input var")}else n(e[1].dims,[1],"Invalid input scale"),n(e[2].dims,[1],"Invalid input B"),n(e[3].dims,[1],"Invalid input mean"),n(e[4].dims,[1],"Invalid input var")},vl=(e,t)=>{let{epsilon:n,spatial:a,format:u}=t,l=e[0].dims,d=a?Ue(l[l.length-1]):1,c=u==="NHWC"&&l.length>1?d:1,h=L.size(l)/d,f=a,g=f?l.length:l,_=U("x",e[0].dataType,e[0].dims,d),b=U("scale",e[1].dataType,e[1].dims,c),x=U("bias",e[2].dataType,e[2].dims,c),v=U("inputMean",e[3].dataType,e[3].dims,c),S=U("inputVar",e[4].dataType,e[4].dims,c),T=Z("y",e[0].dataType,g,d),k=()=>{let A="";if(a)A=`let cOffset = ${l.length===1?"0u":u==="NHWC"?`outputIndices[${l.length-1}] / ${d}`:"outputIndices[1]"};`;else if(u==="NCHW")A=`
            ${T.indicesSet("outputIndices","0","0")}
            let cOffset = ${T.indicesToOffset("outputIndices")};`;else{A=`var cIndices = ${b.type.indices}(0);
                       cIndices[0] = outputIndices[${l.length-1}];`;for(let C=1;C<b.rank;C++)A+=`cIndices[${C}] = outputIndices[${C}];`;A+=`let cOffset = ${b.indicesToOffset("cIndices")};`}return A},E=A=>`
  const epsilon = ${n};
  ${A.registerUniform("outputSize","u32").declareVariables(_,b,x,v,S,T)}
  ${A.mainStart()}
  ${A.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${T.offsetToIndices(`global_idx * ${d}`)};
    ${k()}
    let scale = ${b.getByOffset("cOffset")};
    let bias = ${x.getByOffset("cOffset")};
    let inputMean = ${v.getByOffset("cOffset")};
    let inputVar = ${S.getByOffset("cOffset")};
    let x = ${_.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${T.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${a}_${d}`,inputDependencies:f?["rank","type","type","type","type"]:void 0},getShaderSource:E,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:f?[{type:12,data:h},...te(l)]:[{type:12,data:h}]})}},xl=e=>ke(e),El=(e,t)=>{let{inputs:n,outputCount:a}=e,u=xl({...t,outputCount:a});if(ye.webgpu.validateInputContent&&$l(n,u),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(vl(n,u))}}),kl,Sl,Il,Yg=w(()=>{"use strict";pe(),fe(),kl=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Sl=e=>{let t=e[0].dims,n=e[0].dims[2],a=L.size(t)/4,u=e[0].dataType,l=U("input",u,t,4),d=U("bias",u,[n],4),c=U("residual",u,t,4),h=Z("output",u,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:f=>`
  const channels = ${n}u / 4;
  ${f.declareVariables(l,d,c,h)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let value = ${l.getByOffset("global_idx")}
      + ${d.getByOffset("global_idx % channels")} + ${c.getByOffset("global_idx")};
    ${h.setByOffset("global_idx","value")}
  }`}},Il=e=>{kl(e.inputs),e.compute(Sl(e.inputs))}}),Tl,Ee,Al,zl,Cl,Ol,Ml,Rl,Pl,Dl,Bl,Ll,Nl,Ul,Fl,Wl,hi,jl,es,Vl,ql,Gl,Hl,Kl,Zl,Jl,Xl,Yl,Ql,ed,td,nd,id,sd,rd,ad,Ar,od,zr,Cr,ud,ld,dd,cd,pd,hd,Or=w(()=>{"use strict";re(),pe(),Ne(),fe(),Tl=(e,t,n,a,u,l,d)=>{let c=Math.ceil(t/4),h="";typeof u=="string"?h=`${u}(a)`:h=u("a");let f=U("inputData",n,[c],4),g=Z("outputData",a,[c],4),_=[{name:"vec_size",type:"u32"}];return d&&_.push(...d),`
      ${e.registerUniforms(_).declareVariables(f,g)}

  ${l??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${f.getByOffset("global_idx")};
    ${g.setByOffset("global_idx",h)}
  }`},Ee=(e,t,n,a,u,l=e.dataType,d,c)=>{let h=[{type:12,data:Math.ceil(L.size(e.dims)/4)}];return d&&h.push(...d),{name:t,shaderCache:{hint:u,inputDependencies:["type"]},getShaderSource:f=>Tl(f,L.size(e.dims),e.dataType,l,n,a,c),getRunData:f=>({outputs:[{dims:e.dims,dataType:l}],dispatchGroup:{x:Math.ceil(L.size(f[0].dims)/64/4)},programUniforms:h})}},Al=e=>{e.compute(Ee(e.inputs[0],"Abs","abs"))},zl=e=>{e.compute(Ee(e.inputs[0],"Acos","acos"))},Cl=e=>{e.compute(Ee(e.inputs[0],"Acosh","acosh"))},Ol=e=>{e.compute(Ee(e.inputs[0],"Asin","asin"))},Ml=e=>{e.compute(Ee(e.inputs[0],"Asinh","asinh"))},Rl=e=>{e.compute(Ee(e.inputs[0],"Atan","atan"))},Pl=e=>{e.compute(Ee(e.inputs[0],"Atanh","atanh"))},Dl=e=>ke(e),Bl=(e,t)=>{let n;switch(t.to){case 10:n="vec4<f16>";break;case 1:n="vec4<f32>";break;case 12:n="vec4<u32>";break;case 6:n="vec4<i32>";break;case 9:n="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(Ee(e.inputs[0],"Cast",n,void 0,t.cacheKey,t.to))},Ll=e=>{let t,n,a=e.length>=2&&e[1].data!==0,u=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=a?e[1].getFloat32Array()[0]:-34028234663852886e22,n=u?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=a?e[1].getUint16Array()[0]:64511,n=u?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return ke({min:t,max:n})},Nl=(e,t)=>{let n=t||Ll(e.inputs),a=Je(e.inputs[0].dataType);e.compute(Ee(e.inputs[0],"Clip",u=>`clamp(${u}, vec4<${a}>(uniforms.min), vec4<${a}>(uniforms.max))`,void 0,n.cacheKey,void 0,[{type:e.inputs[0].dataType,data:n.min},{type:e.inputs[0].dataType,data:n.max}],[{name:"min",type:a},{name:"max",type:a}]),{inputs:[0]})},Ul=e=>{e.compute(Ee(e.inputs[0],"Ceil","ceil"))},Fl=e=>{e.compute(Ee(e.inputs[0],"Cos","cos"))},Wl=e=>{e.compute(Ee(e.inputs[0],"Cosh","cosh"))},hi=e=>ke(e),jl=(e,t)=>{let n=Je(e.inputs[0].dataType);e.compute(Ee(e.inputs[0],"Elu",a=>`elu_vf32(${a})`,`
  const elu_alpha_ = ${n}(${t.alpha});

  fn elu_f32(a: ${n}) -> ${n} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${n}>) -> vec4<${n}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},es=(e="f32")=>`
const r0: ${e} = 0.3275911;
const r1: ${e} = 0.254829592;
const r2: ${e} = -0.284496736;
const r3: ${e} = 1.421413741;
const r4: ${e} = -1.453152027;
const r5: ${e} = 1.061405429;

fn erf_vf32(v: vec4<${e}>) -> vec4<${e}> {
  let absv = abs(v);
  let x = 1.0 / (1.0 + r0 * absv);
  return sign(v) * (1.0 - ((((r5 * x + r4) * x + r3) * x + r2) * x + r1) * x * exp(-absv * absv));
}`,Vl=e=>{let t=Je(e.inputs[0].dataType);e.compute(Ee(e.inputs[0],"Erf",n=>`erf_vf32(${n})`,es(t)))},ql=e=>{e.compute(Ee(e.inputs[0],"Exp","exp"))},Gl=e=>{e.compute(Ee(e.inputs[0],"Floor","floor"))},Hl=e=>{let t=Je(e.inputs[0].dataType);e.compute(Ee(e.inputs[0],"Gelu",n=>`0.5 * ${n} * (1.0 + erf_vf32(${n} * 0.7071067811865475))`,es(t)))},Kl=(e,t)=>{let n=Je(e.inputs[0].dataType);e.compute(Ee(e.inputs[0],"LeakyRelu",a=>`select(leaky_relu_alpha_ * ${a}, ${a}, ${a} >= vec4<${n}>(0.0))`,`const leaky_relu_alpha_ = ${n}(${t.alpha});`,t.cacheKey))},Zl=e=>{e.compute(Ee(e.inputs[0],"Not",t=>`!${t}`))},Jl=e=>{e.compute(Ee(e.inputs[0],"Neg",t=>`-${t}`))},Xl=e=>{e.compute(Ee(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Yl=e=>{let t=Je(e.inputs[0].dataType);e.compute(Ee(e.inputs[0],"Relu",n=>`select(vec4<${t}>(0.0), ${n}, ${n} > vec4<${t}>(0.0))`))},Ql=e=>{e.compute(Ee(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},ed=e=>ke(e),td=(e,t)=>{let n=Je(e.inputs[0].dataType);e.compute(Ee(e.inputs[0],"HardSigmoid",a=>`max(vec4<${n}>(0.0), min(vec4<${n}>(1.0), ${t.alpha} * ${a} + vec4<${n}>(${t.beta})))`,void 0,t.cacheKey))},nd=e=>{let t=Je(e.inputs[0].dataType);e.compute(Ee(e.inputs[0],"HardSwish",n=>`${n} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${n} + vec4<${t}>(0.5)))`))},id=e=>{e.compute(Ee(e.inputs[0],"Sin","sin"))},sd=e=>{e.compute(Ee(e.inputs[0],"Sinh","sinh"))},rd=e=>{e.compute(Ee(e.inputs[0],"Sqrt","sqrt"))},ad=e=>{e.compute(Ee(e.inputs[0],"Tan","tan"))},Ar=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,od=e=>{e.compute(Ee(e.inputs[0],"Tanh",Ar))},zr=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${Ar("v")};
}
`,Cr=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,ud=e=>{let t=Je(e.inputs[0].dataType);e.compute(Ee(e.inputs[0],"FastGelu",Cr,zr(t),void 0,e.inputs[0].dataType))},ld=(e,t)=>{let n=Je(e.inputs[0].dataType);return e.compute(Ee(e.inputs[0],"ThresholdedRelu",a=>`select(vec4<${n}>(0.0), ${a}, ${a} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${n}>(${t.alpha});`,t.cacheKey)),0},dd=e=>{e.compute(Ee(e.inputs[0],"Log","log"))},cd=(e,t)=>`
const alpha = vec4<${e}>(${t});
const one = ${e}(1.0);
const zero = ${e}(0.0);

fn quick_gelu_impl(x: vec4<${e}>) -> vec4<${e}> {
  let v = x *alpha;
  var x1 : vec4<${e}>;
  for (var i = 0; i < 4; i = i + 1) {
    if (v[i] >= zero) {
      x1[i] = one / (one + exp(-v[i]));
    } else {
      x1[i] = one - one / (one + exp(v[i]));
    }
  }
  return x * x1;
}
`,pd=e=>`quick_gelu_impl(${e})`,hd=(e,t)=>{let n=Je(e.inputs[0].dataType);e.compute(Ee(e.inputs[0],"QuickGelu",pd,cd(n,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),fd,md,gd,Qg=w(()=>{"use strict";pe(),fe(),Or(),fd=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},md=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let n=U("input",e[0].dataType,e[0].dims,4),a=U("bias",e[0].dataType,[e[0].dims[2]],4),u=Z("output",e[0].dataType,t,4),l=L.size(t)/4,d=Ze(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)}}),getShaderSource:c=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${c.declareVariables(n,a,u)}

  ${es(d)}

  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes(l)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${u.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},gd=e=>{fd(e.inputs),e.compute(md(e.inputs))}}),_d,yd,xt,wd,bd,$d,vd,xd,Ed,kd,Sd,Id,Td,e0=w(()=>{"use strict";re(),pe(),fe(),_d=(e,t,n,a,u,l,d,c,h,f,g,_)=>{let b,x;typeof c=="string"?b=x=(E,A)=>`${c}((${E}),(${A}))`:typeof c=="function"?b=x=c:(b=c.scalar,x=c.vector);let v=Z("outputData",g,a.length,4),S=U("aData",h,t.length,4),T=U("bData",f,n.length,4),k;if(u)if(l){let E=L.size(t)===1,A=L.size(n)===1,C=t.length>0&&t[t.length-1]%4===0,O=n.length>0&&n[n.length-1]%4===0;E||A?k=v.setByOffset("global_idx",x(E?`${S.type.value}(${S.getByOffset("0")}.x)`:S.getByOffset("global_idx"),A?`${T.type.value}(${T.getByOffset("0")}.x)`:T.getByOffset("global_idx"))):k=`
            let outputIndices = ${v.offsetToIndices("global_idx * 4u")};
            let offsetA = ${S.broadcastedIndicesToOffset("outputIndices",v)};
            let offsetB = ${T.broadcastedIndicesToOffset("outputIndices",v)};
            ${v.setByOffset("global_idx",x(d||C?S.getByOffset("offsetA / 4u"):`${S.type.value}(${S.getByOffset("offsetA / 4u")}[offsetA % 4u])`,d||O?T.getByOffset("offsetB / 4u"):`${T.type.value}(${T.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else k=v.setByOffset("global_idx",x(S.getByOffset("global_idx"),T.getByOffset("global_idx")));else{if(!l)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let E=(A,C,O="")=>{let P=`aData[indexA${C}][componentA${C}]`,B=`bData[indexB${C}][componentB${C}]`;return`
            let outputIndices${C} = ${v.offsetToIndices(`global_idx * 4u + ${C}u`)};
            let offsetA${C} = ${S.broadcastedIndicesToOffset(`outputIndices${C}`,v)};
            let offsetB${C} = ${T.broadcastedIndicesToOffset(`outputIndices${C}`,v)};
            let indexA${C} = offsetA${C} / 4u;
            let indexB${C} = offsetB${C} / 4u;
            let componentA${C} = offsetA${C} % 4u;
            let componentB${C} = offsetB${C} % 4u;
            ${A}[${C}] = ${O}(${b(P,B)});
          `};g===9?k=`
            var data = vec4<u32>(0);
            ${E("data",0,"u32")}
            ${E("data",1,"u32")}
            ${E("data",2,"u32")}
            ${E("data",3,"u32")}
            outputData[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:k=`
            ${E("outputData[global_idx]",0)}
            ${E("outputData[global_idx]",1)}
            ${E("outputData[global_idx]",2)}
            ${E("outputData[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(S,T,v)}

        ${_??""}

        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${k}
      }`},yd=(e,t,n,a,u,l,d=n.dataType)=>{let c=n.dims.map(Number),h=a.dims.map(Number),f=!L.areEqual(c,h),g=c,_=L.size(c),b=!1,x=!1,v=[f];if(f){let S=Nn.calcShape(c,h,!1);if(!S)throw new Error("Can't perform binary op on the given tensors");g=S.slice(),_=L.size(g);let T=L.size(c)===1,k=L.size(h)===1,E=c.length>0&&c[c.length-1]%4===0,A=h.length>0&&h[h.length-1]%4===0;v.push(T),v.push(k),v.push(E),v.push(A);let C=1;for(let O=1;O<g.length;O++){let P=c[c.length-O],B=h[h.length-O];if(P===B)C*=P;else break}C%4===0?(x=!0,b=!0):(T||k||E||A)&&(b=!0)}else b=!0;return v.push(b),{name:e,shaderCache:{hint:t+v.map(S=>S.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:S=>_d(S,c,h,g,b,f,x,u,n.dataType,a.dataType,d,l),getRunData:()=>({outputs:[{dims:g,dataType:d}],dispatchGroup:{x:Math.ceil(_/64/4)},programUniforms:[{type:12,data:Math.ceil(L.size(g)/4)},...te(c,h,g)]})}},xt=(e,t,n,a,u,l)=>{e.compute(yd(t,u??"",e.inputs[0],e.inputs[1],n,a,l))},wd=e=>{xt(e,"Add",(t,n)=>`${t}+${n}`)},bd=e=>{xt(e,"Div",(t,n)=>`${t}/${n}`)},$d=e=>{xt(e,"Equal",{scalar:(t,n)=>`u32(${t}==${n})`,vector:(t,n)=>`vec4<u32>(${t}==${n})`},void 0,void 0,9)},vd=e=>{xt(e,"Mul",(t,n)=>`${t}*${n}`)},xd=e=>{let t=U("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;xt(e,"Pow",{scalar:(n,a)=>`pow_custom(${n},${a})`,vector:(n,a)=>`pow_vector_custom(${n},${a})`},`
    fn pow_custom(a : ${t}, b : ${t}) -> ${t} {
      if (b == ${t}(0.0)) {
        return ${t}(1.0);
      } else if (a < ${t}(0.0) && f32(b) != floor(f32(b))) {
        return ${t}(pow(f32(a), f32(b))); // NaN
      }
      return select(sign(a), ${t}(1.0), round(f32(abs(b) % ${t}(2.0))) != 1.0) * ${t}(${t==="i32"?"round":""}(pow(f32(abs(a)), f32(b))));
    }
    fn pow_vector_custom(a : vec4<${t}>, b : vec4<${t}>) -> vec4<${t}> {
      // TODO: implement vectorized pow
      return vec4<${t}>(pow_custom(a.x, b.x), pow_custom(a.y, b.y), pow_custom(a.z, b.z), pow_custom(a.w, b.w));
    }
      `)},Ed=e=>{xt(e,"Sub",(t,n)=>`${t}-${n}`)},kd=e=>{xt(e,"Greater",{scalar:(t,n)=>`u32(${t}>${n})`,vector:(t,n)=>`vec4<u32>(${t}>${n})`},void 0,void 0,9)},Sd=e=>{xt(e,"Less",{scalar:(t,n)=>`u32(${t}<${n})`,vector:(t,n)=>`vec4<u32>(${t}<${n})`},void 0,void 0,9)},Id=e=>{xt(e,"GreaterOrEqual",{scalar:(t,n)=>`u32(${t}>=${n})`,vector:(t,n)=>`vec4<u32>(${t}>=${n})`},void 0,void 0,9)},Td=e=>{xt(e,"LessOrEqual",{scalar:(t,n)=>`u32(${t}<=${n})`,vector:(t,n)=>`vec4<u32>(${t}<=${n})`},void 0,void 0,9)}}),Ad,zd,Cd,Od,t0=w(()=>{"use strict";re(),pe(),Ne(),fe(),Ad=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let n=0,a=e[n],u=a.dataType,l=a.dims.length;e.forEach((d,c)=>{if(c!==n){if(d.dataType!==u)throw new Error("input tensors should be one type");if(d.dims.length!==l)throw new Error("input tensors should have the same shape");d.dims.forEach((h,f)=>{if(f!==t&&h!==a.dims[f])throw new Error("non concat dimensions must match")})}})},zd=(e,t,n,a,u=0)=>{let l=e.reduce((k,E)=>k+L.size(E.dims),0),d=new Array(e.length),c=new Array(e.length),h=new Array(e.length),f=0,g=u,_=[],b=[],x=[{type:12,data:l}];for(let k=0;k<e.length;++k)d[k]=f,c[k]=g,f+=L.size(e[k].dims),g+=e[k].dims[t],b.push(e[k].dims.length),h[k]=U(`input${k}`,a,b[k]),_.push("rank"),x.push({type:12,data:d[k]}),x.push({type:12,data:c[k]});for(let k=0;k<e.length;++k)x.push(...te(e[k].dims));x.push(...te(n));let v=Z("output",a,n.length),S=h.map((k,E)=>{let A=`
        let inputOffset = ${`global_idx - uniforms.inputOffset${E}`};
        var outputIndices = ${k.offsetToIndices("inputOffset")};
        ${v.indicesGet("outputIndices",t)} += uniforms.outputAxisOffset${E};
        ${v.setByIndices("outputIndices",k.getByOffset("inputOffset"))}`;return e.length===1?A:E===0?`if (inputIndex == 0u) {${A}}`:E===e.length-1?`else {${A}}`:`else if (inputIndex == ${E}u) {${A}}`}).join(`
`),T=k=>`

  ${(()=>{k.registerUniform("outputSize","u32");for(let E=0;E<e.length;E++)k.registerUniform(`inputOffset${E}`,"u32"),k.registerUniform(`outputAxisOffset${E}`,"u32");return k.declareVariables(...h,v)})()}

  fn calculateInputIndex(global_idx: u32) -> u32 {
    ${h.slice(1).map((E,A)=>`if (global_idx < uniforms.inputOffset${A+1}) {
      return ${A}u;
    }`).join(`
`)}
    return ${e.length-1}u;
  }

  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

    let inputIndex = calculateInputIndex(global_idx);
    ${S}
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:n,dataType:a}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:x}),getShaderSource:T}},Cd=(e,t)=>{let n=e.inputs,a=n[0].dims,u=L.normalizeAxis(t.axis,a.length);Ad(n,u);let l=a.slice();l[u]=n.reduce((f,g)=>f+(g.dims.length>u?g.dims[u]:0),0);let d=n.filter(f=>L.size(f.dims)>0);if(d.length===0){e.output(0,l);return}let c=e.deviceLimits.maxStorageBuffersPerShaderStage-1,h=0;for(let f=0;f<d.length;f+=c){let g=d.slice(f,f+c);e.compute(zd(g,u,l,n[0].dataType,h),{inputs:g,outputs:[0]}),h+=g.reduce((_,b)=>_+b.dims[u],0)}},Od=e=>ke({axis:e.axis})}),wn,bn,$n,Mr,vn=w(()=>{"use strict";re(),pe(),wn=(e,t,n="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${n}(uniforms.clip_min)), ${t}(${n}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${n}(uniforms.alpha) * value + ${n}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${n}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},bn=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},$n=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},Mr=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[n,a]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:n,beta:a}}else if(t==="Clip"){let[n,a]=(e==null?void 0:e.activation_params)||[tu,nu];return{activation:t,clipMax:a,clipMin:n}}else if(t==="LeakyRelu"){let[n]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:n}}return{activation:t}}}),Ye,Md,Rr=w(()=>{"use strict";Ye=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},Md=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),Rd,n0=w(()=>{"use strict";Rd=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),fi,Pr,Dr=w(()=>{"use strict";re(),pe(),fe(),vn(),fi=(e,t,n,a,u)=>{let l=a-n;return`
      ${Array.from({length:n}).map((d,c)=>`
      if (${Y(t.shape,c,t.rank)} != 1) {
        ${t.indicesSet(e,c,Y(u,c+l,a))}
      } else {
        ${t.indicesSet(e,c,0)}
      }`).join("")}
`},Pr=(e,t,n,a,u=!1,l)=>{let d=e[0].dims,c=e[1].dims,h=d[d.length-2],f=c[c.length-1],g=d[d.length-1],_=Ue(f),b=Ue(g),x=Ue(h),v=L.size(n)/_/x,S=e.length>2,T=a?a.slice(0,-2):n.slice(0,-2),k=[L.size(T),h,f],E=[{type:12,data:v},{type:12,data:h},{type:12,data:f},{type:12,data:g}];bn(t,E),E.push(...te(T,d,c)),S&&E.push(...te(e[2].dims)),E.push(...te(k));let A=C=>{let O=vr("batch_dims",e[0].dataType,T.length),P=U("a",e[0].dataType,d.length,b),B=U("b",e[1].dataType,c.length,_),N=Z("output",e[0].dataType,k.length,_),W=Ze(N.type.tensor),q=wn(t,N.type.value,W),ie=[P,B],X="";if(S){let ve=u?_:1;ie.push(U("bias",e[2].dataType,e[2].dims.length,ve)),X=`${u?`value += bias[col / ${ve}];`:`value += ${N.type.value}(bias[row + i]);`}`}let ee=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];$n(t,ee);let _e=()=>{let ve=`var a_data: ${P.type.value};`;for(let ue=0;ue<b;ue++)ve+=`
              let b_data${ue} = b[(b_offset + (k + ${ue}) * uniforms.N + col) / ${_}];`;for(let ue=0;ue<x;ue++){ve+=`a_data = a[(a_offset + (row + ${ue}) * uniforms.K + k) / ${b}];`;for(let me=0;me<b;me++)ve+=`
            values[${ue}] = fma(${B.type.value}(a_data${b===1?"":`[${me}]`}), b_data${me}, values[${ue}]);
`}return ve};return`
  ${C.registerUniforms(ee).registerInternalVariables(O).declareVariables(...ie,N)}
  ${C.mainStart()}
    ${C.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${_})) * ${_};
    var index1 = global_idx / (uniforms.N / ${_});
    let stride1 = uniforms.M / ${x};
    let row = (index1 % stride1) * ${x};
    let batch = index1 / stride1;

    ${n.length===2?"":`let batch_indices = ${O.offsetToIndices("batch")};`}

    var a_indices: ${P.type.indices};
    ${fi("a_indices",P,P.rank-2,O.rank,"batch_indices")}
    ${P.indicesSet("a_indices",P.rank-2,0)}
    ${P.indicesSet("a_indices",P.rank-1,0)}
    let a_offset = ${P.indicesToOffset("a_indices")};

    var b_indices: ${B.type.indices};
    ${fi("b_indices",B,B.rank-2,O.rank,"batch_indices")}
    ${B.indicesSet("b_indices",B.rank-2,0)}
    ${B.indicesSet("b_indices",B.rank-1,0)}
    let b_offset = ${B.indicesToOffset("b_indices")};
    var values: array<${N.type.value}, ${x}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${b}) {
      ${_e()}
    }
    for (var i = 0u; i < ${x}u; i++) {
      var value = values[i];
      ${X}
      ${q}
      let cur_indices = ${N.type.indices}(batch, row + i, col);
      let offset = ${N.indicesToOffset("cur_indices")};
      ${N.setByOffset(`offset / ${_}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${_};${b};${x};${u}`,inputDependencies:S?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:l?l(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:E}),getShaderSource:A}}}),Pd,Dd,Br,Lr,Bd,Nr,Ld,ts,Ur=w(()=>{"use strict";re(),pe(),fe(),vn(),Dr(),Rr(),Pd=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,Dd=(e,t)=>e?`
        let ACached0 = mm_Asub[k * innerElementSize][localRow];
        let ACached1 = mm_Asub[k * innerElementSize + 1][localRow];
        let ACached2 = mm_Asub[k * innerElementSize + 2][localRow];
        ${t===3?"":"let ACached3 = mm_Asub[k * innerElementSize + 3][localRow];"}
        for (var i = 0; i < rowPerThread; i = i + 1) {
          acc[i] = BCached0 * ACached0[i] + acc[i];
          acc[i] = BCached1 * ACached1[i] + acc[i];
          acc[i] = BCached2 * ACached2[i] + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached3[i] + acc[i];"}
        }`:`
        for (var i = 0; i < rowPerThread; i = i + 1) {
          let ACached = mm_Asub[tileRow + i][k];
          acc[i] = BCached0 * ACached.x + acc[i];
          acc[i] = BCached1 * ACached.y + acc[i];
          acc[i] = BCached2 * ACached.z + acc[i];
          ${t===3?"":"acc[i] = BCached3 * ACached.w + acc[i];"}
        }`,Br=(e,t,n="f32",a,u=!1,l=32,d=!1,c=32)=>{let h=t[1]*e[1],f=t[0]*e[0],g=u?h:l,_=u?l:h,b=g/t[0],x=l/t[1];if(!((u&&b===4&&e[1]===4||!u&&(b===3||b===4))&&g%t[0]===0&&l%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${u} is true, innerElementSize ${b} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${b} must be 3 or 4.
  tileAWidth ${g} must be divisible by workgroupSize[0]${t[0]}. tileInner ${l} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${b}<${n}>, ${g/b}>, ${_}>;
var<workgroup> mm_Bsub: array<array<vec4<${n}>, ${f/e[0]}>, ${l}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${b};
const tileInner = ${l};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
  let localRow = i32(localId.y);
  let tileRow = localRow * rowPerThread;
  let tileCol = i32(localId.x);

  let globalRow =i32(globalId.y) * rowPerThread;
  let globalCol = i32(globalId.x);
  let batch = ${d?"0":"i32(globalId.z)"};
  ${a?`let batchIndices = ${a.offsetToIndices("u32(batch)")};`:""}
  let globalRowStart = i32(workgroupId.y) * ${h};

  let num_tiles = ${d?`${Math.ceil(c/l)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
  var kStart = ${d?`i32(globalId.z) * ${c}`:"0"};

  var acc: array<vec4<${n}>, rowPerThread>;

  // Loop over shared dimension.
  let tileRowB = localRow * ${x};
  for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let inputRow = tileRow + innerRow;
          let inputCol = tileCol;
          ${Pd(u,a)}
      }

      // Load one tile of B into local memory.
      for (var innerRow = 0; innerRow < ${x}; innerRow = innerRow + 1) {
          let inputRow = tileRowB + innerRow;
          let inputCol = tileCol;
          mm_Bsub[inputRow][inputCol] = mm_readB(batch, kStart + inputRow, globalCol${a?", batchIndices":""});
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      for (var k = 0; k < tileInner / innerElementSize; k = k + 1) {
          let BCached0 = mm_Bsub[k * innerElementSize][tileCol];
          let BCached1 = mm_Bsub[k * innerElementSize + 1][tileCol];
          let BCached2 = mm_Bsub[k * innerElementSize + 2][tileCol];
          ${b===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${Dd(u,b)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},Lr=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,Bd=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",Nr=(e,t,n="f32",a,u=!1,l=32,d=!1,c=32,h=!1)=>{let f=e[1]*t[1],g=e[0]*t[0],_=u?f:l,b=u?l:f;if(!(b%t[1]===0&&_%t[0]===0&&l%t[1]===0))throw new Error(`tileAHight ${b} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${_} must be divisible by workgroupSize[0]${t[0]}, tileInner ${l} must be divisible by workgroupSize[1]${t[1]}`);let x=b/t[1],v=_/t[0],S=l/t[1],T=h?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${f};
    let globalColStart = i32(workgroupId.x) * ${g};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${b}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${_}; inputCol = inputCol + ${t[0]}) {
          ${Lr(u,a)}
        }
      }
      // Load one tile of B into local memory.
      for (var inputRow = localRow; inputRow < ${l}; inputRow = inputRow + ${t[1]}) {
            for (var inputCol = localCol; inputCol < ${g}; inputCol = inputCol + ${t[0]}) {
          mm_Bsub[inputRow][inputCol] = mm_readB(batch,
            kStart + inputRow,
            globalColStart + inputCol${a?", batchIndices":""});
        }
      }
      kStart = kStart + tileInner;
      workgroupBarrier();

      // Compute acc values for a single thread.
      var BCached : array<${n}, colPerThread>;
      for (var k = 0; k < tileInner; k = k + 1) {
        for (var inner = 0; inner < colPerThread; inner = inner + 1) {
          BCached[inner] = mm_Bsub[k][localCol + inner * ${t[0]}];
        }
        for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
          let ACached = ${u?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
          for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
            acc[innerRow][innerCol] = acc[innerRow][innerCol] +
                ACached * BCached[innerCol];
          }
        }
      }
      workgroupBarrier();
    }
    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      let gRow = globalRowStart + localRow + innerRow * ${t[1]};
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        let gCol = globalColStart + localCol + innerCol * ${t[0]};
        mm_write(batch, gRow, gCol, acc[innerRow][innerCol]);
      }
    }
    `:`
let tileRow = i32(localId.y) * rowPerThread;
let tileCol = i32(localId.x) * colPerThread;

let globalRow = i32(globalId.y) * rowPerThread;
let globalCol = i32(globalId.x) * colPerThread;
let globalRowStart = i32(workgroupId.y) * ${f};

let tileRowA = i32(localId.y) * ${x};
let tileColA = i32(localId.x) * ${v};
let tileRowB = i32(localId.y) * ${S};
// Loop over shared dimension.
for (var t = 0; t < num_tiles; t = t + 1) {
  // Load one tile of A into local memory.
  for (var innerRow = 0; innerRow < ${x}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < ${v}; innerCol = innerCol + 1) {
      let inputRow = tileRowA + innerRow;
      let inputCol = tileColA + innerCol;
      ${Lr(u,a)}
    }
  }

  // Load one tile of B into local memory.
  for (var innerRow = 0; innerRow < ${S}; innerRow = innerRow + 1) {
    for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
      let inputRow = tileRowB + innerRow;
      let inputCol = tileCol + innerCol;
      mm_Bsub[inputRow][inputCol] = mm_readB(batch,
        kStart + inputRow,
        globalCol + innerCol${a?", batchIndices":""});
    }
  }
  kStart = kStart + tileInner;
  workgroupBarrier();

  // Compute acc values for a single thread.
  var BCached : array<${n}, colPerThread>;
  for (var k = 0; k < tileInner; k = k + 1) {
    for (var inner = 0; inner < colPerThread; inner = inner + 1) {
      BCached[inner] = mm_Bsub[k][tileCol + inner];
    }

    for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      ${Bd(u)}
      for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
        acc[innerRow][innerCol] = acc[innerRow][innerCol] + ACached * BCached[innerCol];
      }
    }
  }

  workgroupBarrier();
}

for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
  for (var innerCol = 0; innerCol < colPerThread; innerCol = innerCol + 1) {
    mm_write(batch, globalRow + innerRow, globalCol + innerCol,
        acc[innerRow][innerCol]);
  }
}
`;return`
  var<workgroup> mm_Asub : array<array<${n}, ${_}>, ${b}>;
  var<workgroup> mm_Bsub : array<array<${n}, ${g}>, ${l}>;
  const rowPerThread = ${e[1]};
  const colPerThread = ${e[0]};
  const tileInner = ${l};

@compute @workgroup_size(${t[0]}, ${t[1]}, ${t[2]})
fn main(@builtin(local_invocation_id) localId : vec3<u32>,
        @builtin(global_invocation_id) globalId : vec3<u32>,
        @builtin(workgroup_id) workgroupId : vec3<u32>) {
    let batch = ${d?"0":"i32(globalId.z)"};
    ${a?`let batchIndices = ${a.offsetToIndices("u32(batch)")};`:""}
    let num_tiles = ${d?`${Math.ceil(c/l)}`:"(uniforms.dim_inner - 1) / tileInner + 1"};
    var kStart = ${d?`i32(globalId.z) * ${c}`:"0"};

    var acc : array<array<${n}, colPerThread>, rowPerThread>;
    ${T}
  }
`},Ld=(e,t,n,a,u=!1)=>{let[l,d,c,h]=a,f=Ze(a[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${l.type.indices}) -> ${Ye(e,f)} {
      var value = ${Ye(e,f)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${d.type.indices};
        ${fi("aIndices",d,d.rank-2,l.rank,"batchIndices")}
        ${d.indicesSet("aIndices",d.rank-2,"u32(row)")}
        ${d.indicesSet("aIndices",d.rank-1,"u32(colIn)")}
        value = ${d.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${l.type.indices}) -> ${Ye(e,f)} {
      var value = ${Ye(e,f)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${c.type.indices};
        ${fi("bIndices",c,c.rank-2,l.rank,"batchIndices")}
        ${c.indicesSet("bIndices",c.rank-2,"u32(row)")}
        ${c.indicesSet("bIndices",c.rank-1,"u32(colIn)")}
        value = ${c.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ye(e,f)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${u?"bias[colIn]":`${Ye(e,f)}(bias[row])`};`:""}
        ${n}
        ${h.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},ts=(e,t,n,a,u=!1,l)=>{let d=e[0].dims,c=e[1].dims,h=d.slice(0,-2),f=c.slice(0,-2),g=a?a.slice(0,-2):n.slice(0,-2),_=L.size(g),b=d[d.length-2],x=d[d.length-1],v=c[c.length-1],S=x%4===0&&v%4===0,T=b<=8?[4,1,1]:[4,4,1],k=[8,8,1],E=[Math.ceil(v/k[0]/T[0]),Math.ceil(b/k[1]/T[1]),Math.ceil(_/k[2]/T[2])],A=S?4:1,C=[...h,b,x/A],O=C.length,P=[...f,x,v/A],B=P.length,N=[_,b,v/A],W=[{type:6,data:b},{type:6,data:v},{type:6,data:x}];bn(t,W),W.push(...te(g,C,P));let q=["rank","rank"],ie=e.length>2;ie&&(W.push(...te(e[2].dims)),q.push("rank")),W.push(...te(N));let X=ee=>{let _e=g.length,ve=vr("batchDims",e[0].dataType,_e,1),ue=Ze(e[0].dataType),me=U("a",e[0].dataType,O,A),we=U("b",e[1].dataType,B,A),ae=Z("result",e[0].dataType,N.length,A),De=[me,we];if(ie){let Re=u?A:1;De.push(U("bias",e[2].dataType,e[2].dims.length,Re))}let F=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];$n(t,F);let ne=Ze(ae.type.tensor),se=wn(t,ae.type.value,ne),V=Ld(A,ie,se,[ve,me,we,ae],u);return`
  ${ee.registerUniforms(F).registerInternalVariables(ve).declareVariables(...De,ae)}
  ${V}
  ${S?Br(T,k,ue,ve):Nr(T,k,ue,ve)}
                   `};return{name:"MatMul",shaderCache:{hint:`${T};${t.activation};${S};${u}`,inputDependencies:q},getRunData:()=>({outputs:[{dims:l?l(n):n,dataType:e[0].dataType}],dispatchGroup:{x:E[0],y:E[1],z:E[2]},programUniforms:W}),getShaderSource:X}}}),Nd,Ud,i0=w(()=>{"use strict";re(),Dt(),fe(),vn(),Rr(),n0(),Ur(),Nd=(e,t,n,a,u=!1,l,d=4,c=4,h=4,f="f32")=>{let g=W=>{switch(W){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${f}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${W} is not supported.`)}},_=W=>{switch(W){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${W} is not supported.`)}},b=e?`
    let coord = vec4<i32>(batch, xRow, xCol, xCh);
    `:`
    let coord = vec4<i32>(batch, xCh, xRow, xCol);
    `,x=e?`
    let coords = vec4<i32>(
      batch,
      row / outWidth,
      row % outWidth,
      col);
    `:`
    let coords = vec4<i32>(
      batch,
      row,
      col / outWidth,
      col % outWidth);
    `,v=e?"i32(uniforms.x_shape[1])":"i32(uniforms.x_shape[2])",S=e?"i32(uniforms.x_shape[2])":"i32(uniforms.x_shape[3])",T=e?"row":"col",k=e?"col":"row",E=`
    let inChannels = i32(uniforms.w_shape[2]);
    let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
    let outRow = ${T} / outWidth;
    let outCol = ${T} % outWidth;

    let WRow = ${k} / (i32(uniforms.w_shape[1]) * inChannels);
    let WCol = ${k} / inChannels % i32(uniforms.w_shape[1]);
    let xRow = outRow * uniforms.stride[0] + uniforms.dilation[0] * WRow - uniforms.pad[0];
    let xCol = outCol * uniforms.stride[1] + uniforms.dilation[1] * WCol - uniforms.pad[1];
    let xCh = ${k} % inChannels;
    var resData = ${Ye(d,f)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${v} && xCol >= 0 && xCol < ${S}) {
      ${b}
      let xIndex = getIndexFromCoords4D(coord, vec4<i32>(uniforms.x_shape));
      ${g(d)}
    }
    return resData;`,A=e?t&&a?`
    let col = colIn * ${d};
    ${E}`:`
    let col = colIn * ${d};
    if (row < uniforms.dim_a_outer && col < uniforms.dim_inner) {
      ${E}
    }
    return ${Ye(d,f)}(0.0);`:a&&n?`
    let col = colIn * ${d};
    ${E}`:`
    let col = colIn * ${d};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${E}
    }
    return ${Ye(d,f)}(0.0);`,C=e?a&&n?_(c):`
    let col = colIn * ${c};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${_(c)}
    }
    return ${Ye(c,f)}(0.0);`:`
    let col = colIn * ${c};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${_(c)}
    }
    return ${Ye(c,f)}(0.0);`,O=Ye(h,f),P=Ye(e?d:c,f),B=Ye(e?c:d,f),N=wn(l,O,f);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${P} {
      ${e?A:C}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${B} {
      ${e?C:A}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${O}) {
      let col = colIn * ${h};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${x}
      ${Md(u)}
      ${N}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},Ud=(e,t,n,a,u,l,d,c,h)=>{let f=t.format==="NHWC",g=f?e[0].dims[3]:e[0].dims[1],_=n[0],b=f?n[2]:n[3],x=f?n[1]:n[2],v=f?n[3]:n[1],S=f&&(g%4===0||g%3===0)&&v%4===0,T=f?v:b*x,k=f?b*x:v,E=[8,8,1],A=a<=8?[4,1,1]:[4,4,1],C=[Math.ceil(T/E[0]/A[0]),Math.ceil(k/E[1]/A[1]),Math.ceil(_/E[2]/A[2])];$e("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${C}`);let O=S?f&&g%4!==0?3:4:1,P=E[1]*A[1],B=E[0]*A[0],N=Math.max(E[0]*O,E[1]),W=a%P===0,q=u%B===0,ie=l%N===0,X=S?[O,4,4]:[1,1,1],ee=[{type:6,data:a},{type:6,data:u},{type:6,data:l},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];bn(t,ee),ee.push(...te(e[0].dims,e[1].dims));let _e=["rank","rank"];d&&(ee.push(...te(e[2].dims)),_e.push("rank")),ee.push(...te(n));let ve=ue=>{let me=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];$n(t,me);let we=S?4:1,ae=Ze(e[0].dataType),De=`
      fn setOutputAtIndex(flatIndex : i32, value : ${S?`vec4<${ae}>`:ae}) {
        result[flatIndex] = ${S?`vec4<${ae}>`:ae}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${S?`vec4<${ae}>`:ae}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${S?"/ 4":""}, value);
      }`,F=U("x",e[0].dataType,e[0].dims.length,O===3?1:O),ne=U("w",e[1].dataType,e[1].dims.length,we),se=[F,ne],V=Z("result",e[0].dataType,n.length,we);if(d){let Re=U("bias",e[2].dataType,e[2].dims.length,we);se.push(Re),De+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${S?`vec4<${ae}>`:ae} {
          return bias[coords.${f?"w":"y"}${S?"/ 4":""}];
        }`}return`
        ${Rd("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${ue.registerUniforms(me).declareVariables(...se,V)}
        ${De}
        ${Nd(f,W,q,ie,d,t,X[0],X[1],X[2],ae)}
        ${S?Br(A,E,ae,void 0,!f,N):Nr(A,E,ae,void 0,!f,N,!1,void 0,c)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${O};${S};${W};${q};${ie};${P};${B};${N}`,inputDependencies:_e},getRunData:()=>({outputs:[{dims:h?h(n):n,dataType:e[0].dataType}],dispatchGroup:{x:C[0],y:C[1],z:C[2]},programUniforms:ee}),getShaderSource:ve}}}),Fd,Fr,mi,Wd,Wr,jd,Vd,qd,s0=w(()=>{"use strict";re(),Dt(),pe(),fe(),vn(),Rr(),Fd=e=>{let t=1;for(let n=0;n<e.length;n++)t*=e[n];return t},Fr=e=>typeof e=="number"?[e,e,e]:e,mi=(e,t)=>t<=1?e:e+(e-1)*(t-1),Wd=(e,t,n,a=1)=>{let u=mi(t,a);return Math.floor((e[0]*(n-1)-n+u)/2)},Wr=(e,t,n,a,u)=>{u==null&&(u=Wd(e,t[0],a[0]));let l=[0,0,0,n];for(let d=0;d<3;d++)e[d]+2*u>=t[d]&&(l[d]=Math.trunc((e[d]-t[d]+2*u)/a[d]+1));return l},jd=(e,t,n,a,u,l,d,c,h,f)=>{let g,_,b,x;if(e==="VALID"&&(e=0),typeof e=="number"){g={top:e,bottom:e,left:e,right:e,front:e,back:e};let v=Wr([t,n,a,1],[c,h,f],1,[u,l,d],e);_=v[0],b=v[1],x=v[2]}else if(Array.isArray(e)){if(!e.every((S,T,k)=>S===k[0]))throw Error(`Unsupported padding parameter: ${e}`);g={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let v=Wr([t,n,a,1],[c,h,f],1,[u,l,d],e[0]);_=v[0],b=v[1],x=v[2]}else if(e==="SAME_UPPER"){_=Math.ceil(t/u),b=Math.ceil(n/l),x=Math.ceil(a/d);let v=(_-1)*u+c-t,S=(b-1)*l+h-n,T=(x-1)*d+f-a,k=Math.floor(v/2),E=v-k,A=Math.floor(S/2),C=S-A,O=Math.floor(T/2),P=T-O;g={top:A,bottom:C,left:O,right:P,front:k,back:E}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:g,outDepth:_,outHeight:b,outWidth:x}},Vd=(e,t,n,a,u,l=!1,d="channelsLast")=>{let c,h,f,g,_;if(d==="channelsLast")[c,h,f,g,_]=e;else if(d==="channelsFirst")[c,_,h,f,g]=e;else throw new Error(`Unknown dataFormat ${d}`);let[b,,x,v,S]=t,[T,k,E]=Fr(n),[A,C,O]=Fr(a),P=mi(x,A),B=mi(v,C),N=mi(S,O),{padInfo:W,outDepth:q,outHeight:ie,outWidth:X}=jd(u,h,f,g,T,k,E,P,B,N),ee=l?b*_:b,_e=[0,0,0,0,0];return d==="channelsFirst"?_e=[c,ee,q,ie,X]:d==="channelsLast"&&(_e=[c,q,ie,X,ee]),{batchSize:c,dataFormat:d,inDepth:h,inHeight:f,inWidth:g,inChannels:_,outDepth:q,outHeight:ie,outWidth:X,outChannels:ee,padInfo:W,strideDepth:T,strideHeight:k,strideWidth:E,filterDepth:x,filterHeight:v,filterWidth:S,effectiveFilterDepth:P,effectiveFilterHeight:B,effectiveFilterWidth:N,dilationDepth:A,dilationHeight:C,dilationWidth:O,inShape:e,outShape:_e,filterShape:t}},qd=(e,t,n,a,u,l)=>{let d=l==="channelsLast",c=d?e[0].dims[3]:e[0].dims[1],h=!1,f=[64,1,1],g={x:n.map((E,A)=>A)},_=[Math.ceil(Fd(g.x.map(E=>n[E]))/f[0]),1,1];$e("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${_}`);let b=h?d&&c%4!==0?3:4:1,x=L.size(n),v=[{type:12,data:x},{type:12,data:a},{type:12,data:u},{type:12,data:t.strides},{type:12,data:t.dilations}];bn(t,v),v.push(...te(e[0].dims,e[1].dims));let S=["rank","rank"],T=e.length===3;T&&(v.push(...te(e[2].dims)),S.push("rank")),v.push(...te(n));let k=E=>{let A=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:a.length},{name:"pads",type:"u32",length:u.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];$n(t,A);let C=h?4:1,O=Ze(e[0].dataType),P=U("x",e[0].dataType,e[0].dims.length,b===3?1:b),B=U("W",e[1].dataType,e[1].dims.length,C),N=[P,B],W=Z("result",e[0].dataType,n.length,C),q="";if(T){let ee=U("bias",e[2].dataType,e[2].dims.length,C);N.push(ee),q+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${h?`vec4<${O}>`:O} {
          return bias[${d?Y("coords",4,5):Y("coords",1,5)}${h?"/ 4":""}];
        }`}let ie=Ye(b,O),X=wn(t,ie,O);return`
            ${q}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${O} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${P.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${O} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${B.getByIndices("aIndices")};
            }
          ${E.registerUniforms(A).declareVariables(...N,W)}
          ${E.mainStart()}
          ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${W.offsetToIndices("global_idx")};
              let batch = ${Y("coords",0,P.rank)};
              let d2 = ${d?Y("coords",P.rank-1,P.rank):Y("coords",1,P.rank)};
              let xFRCCorner = vec3<u32>(${d?Y("coords",1,P.rank):Y("coords",2,P.rank)},
              ${d?Y("coords",2,P.rank):Y("coords",3,P.rank)},
              ${d?Y("coords",3,P.rank):Y("coords",4,P.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${d?Y("uniforms.x_shape",1,P.rank):Y("uniforms.x_shape",2,P.rank)};
              let xShapeZ = ${d?Y("uniforms.x_shape",2,P.rank):Y("uniforms.x_shape",3,P.rank)};
              let xShapeW = ${d?Y("uniforms.x_shape",3,P.rank):Y("uniforms.x_shape",4,P.rank)};
              let xShapeU = ${d?Y("uniforms.x_shape",4,P.rank):Y("uniforms.x_shape",1,P.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = ${O}(0);
              for (var wF = 0u; wF < uniforms.filter_dims[0]; wF++) {
                let xF = xFCorner + wF * uniforms.dilations[0];
                if (xF < 0 || xF >= xShapeY) {
                  continue;
                }

                for (var wR = 0u; wR < uniforms.filter_dims[1]; wR++) {
                  let xR = xRCorner + wR * uniforms.dilations[1];
                  if (xR < 0 || xR >= xShapeZ) {
                    continue;
                  }

                  for (var wC = 0u; wC < uniforms.filter_dims[2]; wC++) {
                    let xC = xCCorner + wC * uniforms.dilations[2];
                    if (xC < 0 || xC >= xShapeW) {
                      continue;
                    }

                    for (var d1 = 0u; d1 < inputDepthNearestVec4; d1 += 4) {
                      ${d?`let xValues = vec4<${O}>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<${O}>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<${O}>(
                              getW(d2, d1, wF, wR, wC),
                              getW(d2, d1 + 1, wF, wR, wC),
                              getW(d2, d1 + 2, wF, wR, wC),
                              getW(d2, d1 + 3, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                    if (inputDepthVec4Remainder == 1) {
                        ${d?`value += getX(batch, xF, xR, xC, inputDepthNearestVec4)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`:`value += getX(batch, inputDepthNearestVec4, xF, xR, xC)
                          * getW(d2, inputDepthNearestVec4, wF, wR, wC);`}
                    } else if (inputDepthVec4Remainder == 2) {
                      ${d?`let xValues = vec2<${O}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<${O}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<${O}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${d?`let xValues = vec3<${O}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<${O}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<${O}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${T?"value = value + getBiasByOutputCoords(coords)":""};
              ${X}
              result[global_idx] = ${O}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${d};${b};${T}`,inputDependencies:S},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:_[0],y:_[1],z:_[2]},programUniforms:v}),getShaderSource:k}}}),Gd,Hd,r0=w(()=>{"use strict";re(),pe(),fe(),vn(),Gd=(e,t,n,a)=>{let u=e.length>2,l=u?"value += b[output_channel];":"",d=e[0].dims,c=e[1].dims,h=t.format==="NHWC",f=h?n[3]:n[1],g=f/t.group,_=h&&g>=4?Ue(f):1,b=L.size(n)/_,x=[{type:12,data:b},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:g}];bn(t,x),x.push(...te(d,[c[0],c[1],c[2],c[3]/_]));let v=u?["rank","rank","rank"]:["rank","rank"];x.push(...te([n[0],n[1],n[2],n[3]/_]));let S=T=>{let k=Z("output",e[0].dataType,n.length,_),E=Ze(k.type.tensor),A=wn(t,k.type.value,E),C=U("x",e[0].dataType,d.length),O=U("w",e[1].dataType,c.length,_),P=[C,O];u&&P.push(U("b",e[2].dataType,e[2].dims,_));let B=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];$n(t,B);let N=h?`
      for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[0]; wHeight++) {
        let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

        if (xHeight < 0u || xHeight >= uniforms.x_shape[1]) {
          continue;
        }

        for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[1]; wWidth++) {
          let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
          if (xWidth < 0u || xWidth >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[2]; wInChannel++) {
            let input_channel = in_channel_offset + wInChannel;
            let xVal = ${C.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${O.get("wHeight","wWidth","wInChannel","output_channel")};
            value += xVal * wVal;
          }
        }
      }
      `:`
      for (var wInChannel: u32 = 0u; wInChannel < uniforms.w_shape[1]; wInChannel++) {
        let input_channel = in_channel_offset + wInChannel;
        for (var wHeight: u32 = 0u; wHeight < uniforms.w_shape[2]; wHeight++) {
          let xHeight = xRCCorner.x + wHeight * uniforms.dilations[0];

          if (xHeight < 0u || xHeight >= uniforms.x_shape[2]) {
            continue;
          }

          for (var wWidth: u32 = 0u; wWidth < uniforms.w_shape[3]; wWidth++) {
            let xWidth = xRCCorner.y + wWidth * uniforms.dilations[1];
            if (xWidth < 0u || xWidth >= uniforms.x_shape[3]) {
              continue;
            }

            let xVal = ${C.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${O.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${T.registerUniforms(B).declareVariables(...P,k)}

  ${T.mainStart()}
    ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let outputIndices = ${k.offsetToIndices("global_idx")};
    let batch: u32 = outputIndices[0];
    let output_channel: u32 = outputIndices[${h?3:1}];
    let xRCCorner: vec2<u32> = vec2<u32>(outputIndices[${h?1:2}], outputIndices[${h?2:3}]) * uniforms.strides - uniforms.pads;
    let group_id: u32 = output_channel * ${_} / uniforms.output_channels_per_group;
    var in_channel_offset = group_id * uniforms.w_shape[${h?2:1}];

    var value: ${k.type.value} = ${k.type.value}(0);
    ${N}
    ${l}
    ${A}
    ${k.setByOffset("global_idx","value")}
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${_}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:a?a(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:x}),getShaderSource:S}},Hd=(e,t,n,a)=>{let u=e.length>2,l=Ue(n[3]),d=Ue(n[2]),c=L.size(n)/l/d,h=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/l],f=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/l],g=[n[0],n[1],n[2],n[3]/l],_=[{type:12,data:c},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];bn(t,_),_.push(...te(h,f,g));let b=(d-1)*t.strides[1]+f[1],x=v=>{let S=Z("output",e[0].dataType,g.length,l),T=Ze(S.type.tensor),k=wn(t,S.type.value,T),E=U("x",e[0].dataType,h.length,l),A=U("w",e[1].dataType,f.length,l),C=[E,A];u&&C.push(U("b",e[2].dataType,e[2].dims,l));let O=u?"value += b[output_channel];":"",P=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return $n(t,P),`
  ${v.registerUniforms(P).declareVariables(...C,S)}
  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let width0 = uniforms.output_shape[3];
    let output_channel = global_idx % width0;
    var index1 = global_idx / width0;
    let width1 = uniforms.output_shape[2] / ${d}u;
    let col = (index1 % width1) * ${d}u;
    index1 = index1 / width1;
    let row = index1 % uniforms.output_shape[1];
    let batch = index1 / uniforms.output_shape[1];

    let x_corner = vec2<i32>(i32(row), i32(col)) * uniforms.strides - uniforms.pads;

    var x_vals: array<${E.type.value}, ${b}>;
    var values: array<${S.type.value}, ${d}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${f[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${b}; i++) {
          let x_width = x_corner.y + i;
          if (x_width >= 0 && u32(x_width) < uniforms.x_shape[2]) {
            x_vals[i] = ${E.get("batch","u32(x_height)","u32(x_width)","input_channel")};
          } else {
            x_vals[i] = ${E.type.value}(0);
          }
        }
        for (var w_width: u32 = 0u; w_width < ${f[1]}; w_width++) {
          let w_val = ${A.get("w_height","w_width","0","output_channel")};
          for (var i = 0u; i < ${d}u; i++) {
            values[i] = fma(x_vals[i * u32(uniforms.strides[1]) + w_width], w_val, values[i]);
          }
        }
      }
    }

    for (var i = 0u; i < ${d}u; i++) {
      var value = values[i];
      ${O}
      ${k}
      ${S.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${l};${d};${b};${f[0]};${f[1]}`,inputDependencies:u?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:_}),getShaderSource:x}}}),Kd,ns,Zd,is,jr,Vr,Jd,Xd,qr,a0=w(()=>{"use strict";pe(),i0(),s0(),Ur(),r0(),vn(),Dr(),Jt(),Kd=(e,t,n,a,u,l)=>{let d=e[0],c=e.slice(l?1:2,l?3:4),h=c.length,f=t[0],g=t.slice(2).map((b,x)=>b+(b-1)*(n[x]-1)),_=c.map((b,x)=>b+a[x]+a[x+h]).map((b,x)=>Math.floor((b-g[x]+u[x])/u[x]));return _.splice(0,0,d),_.splice(l?3:1,0,f),_},ns=[2,3,1,0],Zd=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let n=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[1]*t.group;if(n!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let u=e[0].dims.length-2;if(t.dilations.length!==u)throw new Error(`dilations should be ${u}D`);if(t.strides.length!==u)throw new Error(`strides should be ${u}D`);if(t.pads.length!==u*2)throw new Error(`pads should be ${u*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},is=(e,t)=>{let n=e.kernelShape.slice();n.length<t[1].dims.length-2&&n.push(...Array(t[1].dims.length-2-n.length).fill(0));for(let l=2;l<t[1].dims.length;++l)n[l-2]===0&&(n[l-2]=t[1].dims[l]);let a=e.pads.slice();Ki.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,n,a,e.format==="NHWC",e.autoPad);let u=Object.assign({},e);return Object.assign(u,{kernelShape:n,pads:a}),u},jr=e=>{let t=Mr(e),n=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],u=e.dilations,l=e.group,d=e.kernel_shape,c=e.pads,h=e.strides,f=e.w_is_const();return{autoPad:a,format:n,dilations:u,group:l,kernelShape:d,pads:c,strides:h,wIsConst:f,...t,cacheKey:`${e.format};${t.activation};`}},Vr=(e,t,n,a)=>{let u=n.format==="NHWC",l=Kd(t[0].dims,t[1].dims,n.dilations,n.pads,n.strides,u);if(n.group!==1){let P=[t[0]];if(u){let B=e.kernelCustomData.wT??e.compute(pt(t[1],ns),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=B),P.push(B)}else P.push(t[1]);t.length===3&&P.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&u&&t[1].dims[0]===n.group&&t[1].dims[1]===1&&n.dilations[0]===1&&n.dilations[1]===1?e.compute(Hd(P,n,l,a),{inputs:P}):e.compute(Gd(P,n,l,a),{inputs:P});return}let d=t.length===3,c=t[0].dims[u?1:2],h=t[0].dims[u?2:3],f=t[0].dims[u?3:1],g=t[1].dims[2],_=t[1].dims[3],b=l[u?1:2],x=l[u?2:3],v=l[u?3:1],S=u&&g===c&&_===h&&n.pads[0]===0&&n.pads[1]===0;if(S||g===1&&_===1&&n.dilations[0]===1&&n.dilations[1]===1&&n.strides[0]===1&&n.strides[1]===1&&n.pads[0]===0&&n.pads[1]===0){let P=l[0],B,N,W,q=[];if(u){let ee=e.kernelCustomData.wT??e.compute(pt(t[1],ns),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];if(n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=ee),S){let _e=c*h*f;B=t[0].reshape([1,P,_e]),N=ee.reshape([1,_e,v]),W=[1,P,v]}else B=t[0].reshape([P,c*h,f]),N=ee.reshape([1,f,v]),W=[P,b*x,v];q.push(B),q.push(N)}else B=t[0].reshape([P,f,c*h]),N=t[1].reshape([1,v,f]),W=[P,v,b*x],q.push(N),q.push(B);d&&q.push(t[2]);let ie=W[2],X=q[0].dims[q[0].dims.length-1];ie<8&&X<8?e.compute(Pr(q,n,l,W,u,a),{inputs:q}):e.compute(ts(q,n,l,W,u,a),{inputs:q});return}let T=!0,k=e.kernelCustomData.wT??e.compute(pt(t[1],ns),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=k);let E=[t[0],k];d&&E.push(t[2]);let A=u?b*x:v,C=u?v:b*x,O=g*_*f;e.compute(Ud(E,n,l,A,C,O,d,T,a),{inputs:E})},Jd=(e,t)=>{let n=t.format==="NHWC",a=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let u=[0,t.pads[0],0,t.pads[1]],l=[1].concat(t.strides),d=[1].concat(t.dilations),c=[1].concat(t.kernelShape),h=is({...t,pads:u,strides:l,dilations:d,kernelShape:c},a);Vr(e,a,h,f=>n?[f[0],f[2],f[3]]:[f[0],f[1],f[3]])},Xd=(e,t,n)=>{let a=n.format==="NHWC"?"channelsLast":"channelsFirst",u=is(n,t),l=n.autoPad==="NOTSET"?n.pads:n.autoPad,d=Vd(t[0].dims,t[1].dims,n.strides,n.dilations,l,!1,a);e.compute(qd(t,u,d.outShape,[d.filterDepth,d.filterHeight,d.filterWidth],[d.padInfo.front,d.padInfo.top,d.padInfo.left],a))},qr=(e,t)=>{if(Zd(e.inputs,t),e.inputs[0].dims.length===3)Jd(e,t);else if(e.inputs[0].dims.length===5)Xd(e,e.inputs,t);else{let n=is(t,e.inputs);Vr(e,e.inputs,n)}}}),Yd,o0=w(()=>{"use strict";re(),Dt(),pe(),fe(),Yd=(e,t,n)=>{let a=e.length>2,u=t.outputShape,l=t.format==="NHWC",d=t.group,c=e[1].dims,h=c[2]/d,f=c[3],g=l?Ue(h):1,_=l&&f===1&&h>=4,b=_?Math.floor(h/4)*4:Math.floor(h/g)*g,x=h-b,v=l?Ue(f):1,S=l?f===1?g:v:1,T=L.size(u)/v,k=[Math.ceil(T/64),1,1];$e("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${k}`);let E=["rank","rank"],A=[t.strides[0],t.strides[1]],C=[t.kernelShape[l?1:2],t.kernelShape[l?2:3]],O=[t.dilations[0],t.dilations[1]],P=[C[0]+(t.dilations[0]<=1?0:(t.kernelShape[l?1:2]-1)*(t.dilations[0]-1)),C[1]+(t.dilations[1]<=1?0:(t.kernelShape[l?2:3]-1)*(t.dilations[1]-1))],B=[P[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),P[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],N=[{type:12,data:T},{type:12,data:A},{type:12,data:C},{type:12,data:O},{type:12,data:P},{type:6,data:B},{type:12,data:b},{type:12,data:h},{type:12,data:f},...te(e[0].dims,e[1].dims)];a&&(N.push(...te(e[2].dims)),E.push("rank")),N.push(...te(u));let W=q=>{let ie=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:A.length},{name:"filter_dims",type:"u32",length:C.length},{name:"dilations",type:"u32",length:C.length},{name:"effective_filter_dims",type:"u32",length:P.length},{name:"pads",type:"i32",length:B.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],X=Ze(e[0].dataType),ee=l?1:2,_e=l?2:3,ve=l?3:1,ue=U("W",e[1].dataType,e[1].dims.length,S),me=U("Dy",e[0].dataType,e[0].dims.length,g),we=[me,ue];a&&we.push(U("bias",e[2].dataType,[u[ve]].length,v));let ae=Z("result",e[0].dataType,u.length,v),De=()=>{let se="";if(_)g===4?se+=`
        let xValue = ${me.getByOffset("x_offset")};
        let wValue = ${ue.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:g===2?se+=`
          dotProd = dotProd + dot(vec4<${X}>(${me.getByOffset("x_offset")}, ${me.getByOffset("x_offset + 1u")}), vec4<${X}>(${ue.getByOffset("w_offset")}, ${ue.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:g===1&&(se+=`
          dotProd = dotProd + dot(vec4<${X}>(${me.getByOffset("x_offset")}, ${me.getByOffset("x_offset + 1u")}, ${me.getByOffset("x_offset + 2u")}, ${me.getByOffset("x_offset + 3u")}), vec4<${X}>(${ue.getByOffset("w_offset")}, ${ue.getByOffset("w_offset + 1u")}, ${ue.getByOffset("w_offset + 2u")}, ${ue.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(se+=`
                  let xValue = ${l?me.getByOffset(`${me.indicesToOffset(`${me.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${g}`):me.get("batch","inputChannel","idyR","idyC")};
        `,g===1)se+=`
          let w_offset = ${ue.indicesToOffset(`${ue.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${ue.getByOffset(`w_offset / ${S}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let V=0;V<g;V++)se+=`
            let wValue${V} = ${ue.getByOffset(`${ue.indicesToOffset(`${ue.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${V}, wOutChannel)`)} / ${S}`)};
            dotProd = dotProd + xValue[${V}] * wValue${V};`;return se},F=()=>{if(x===0)return"";if(!_)throw new Error(`packInputAs4 ${_} is not true.`);let se="";if(g===1){se+="dotProd = dotProd";for(let V=0;V<x;V++)se+=`
            + ${me.getByOffset(`x_offset + ${V}`)} * ${ue.getByOffset(`w_offset + ${V}`)}`;se+=";"}else if(g===2){if(x!==2)throw new Error(`Invalid inputChannelsRemainder ${x}.`);se+=`
          let xValue = ${me.getByOffset("x_offset")};
          let wValue = ${ue.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return se},ne=`
            let outputIndices = ${ae.offsetToIndices(`global_idx * ${v}`)};
            let batch = ${ae.indicesGet("outputIndices",0)};
            let d1 = ${ae.indicesGet("outputIndices",ve)};
            let r = ${ae.indicesGet("outputIndices",ee)};
            let c = ${ae.indicesGet("outputIndices",_e)};
            let dyCorner = vec2<i32>(i32(r), i32(c)) - uniforms.pads;
            let dyRCorner = dyCorner.x;
            let dyCCorner = dyCorner.y;
            let groupId = d1 / uniforms.output_channels_per_group;
            let wOutChannel = d1 - groupId * uniforms.output_channels_per_group;
            // Convolve dy(?, ?, d2) with w(:, :, d1, d2) to compute dx(xR, xC, d1).
            // ? = to be determined. : = across all values in that axis.
            var dotProd = ${ae.type.value}(0.0);
            var wR: u32 = 0;
            if (uniforms.dilations.x == 1) {
              // Minimum wR >= 0 that satisfies (dyRCorner + wR) % (uniforms.strides.x) == 0
              wR = u32(((dyRCorner + i32(uniforms.strides.x) - 1) / i32(uniforms.strides.x)) * i32(uniforms.strides.x) - dyRCorner);
            }
            for (; wR < uniforms.effective_filter_dims.x; wR = wR + 1) {
              if (wR % uniforms.dilations.x != 0) {
                continue;
              }
              let dyR = (${X}(dyRCorner) + ${X}(wR)) / ${X}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${X}(uniforms.Dy_shape[${ee}]) || fract(dyR) > 0.0 ||
                  wRPerm < 0) {
                continue;
              }
              let idyR: u32 = u32(dyR);
              var wC: u32 = 0;
              if (uniforms.dilations.y == 1) {
                // Minimum wC >= 0 that satisfies (dyCCorner + wC) % (uniforms.strides.y) == 0
                wC = u32(((dyCCorner + i32(uniforms.strides.y) - 1) / i32(uniforms.strides.y)) * i32(uniforms.strides.y) - dyCCorner);
              }
              for (; wC < uniforms.effective_filter_dims.y; wC = wC + 1) {
                if (wC % uniforms.dilations.y != 0) {
                  continue;
                }
                let dyC = (${X}(dyCCorner) + ${X}(wC)) / ${X}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${X}(uniforms.Dy_shape[${_e}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${_?`
                var x_offset = ${me.indicesToOffset(`${me.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${g};
                var w_offset = ${ue.indicesToOffset(`${ue.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${S};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${_?4:g}) {
                  ${De()}
                  inputChannel = inputChannel + ${_?4:g};
                }
                ${F()}
                wC = wC + uniforms.strides.y - 1;
              }
              wR = wR + uniforms.strides[0] - 1;
            }
            let value = dotProd${a?` + bias[d1 / ${v}]`:""};
            ${ae.setByOffset("global_idx","value")};
          `;return`
    ${q.registerUniforms(ie).declareVariables(...we,ae)}
      ${q.mainStart()}
      ${q.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${ne}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${g}${S}${v}${_}${x}`,inputDependencies:E},getRunData:()=>({dispatchGroup:{x:k[0],y:k[1],z:k[2]},outputs:[{dims:n?n(u):u,dataType:e[0].dataType}],programUniforms:N}),getShaderSource:W}}}),Qd,ec,tc,Gr,nc,ic,Hr,sc,rc,u0=w(()=>{"use strict";o0(),vn(),Jt(),Qd=(e,t,n,a,u,l)=>(e-1)*t+n+(a-1)*u+1-l,ec=(e,t,n,a,u)=>{let l=Math.floor(e/2);t==="SAME_UPPER"?(n[a]=l,n[u]=e-l):t==="SAME_LOWER"&&(n[a]=e-l,n[u]=l)},tc=(e,t,n,a,u,l,d,c,h,f)=>{let g=e.length-2,_=f.length===0;h.length<g&&h.push(...Array(g-h.length).fill(0));let b=e[0],x=t[c?3:1]*u;for(let v=0,S=e.length-g-(c?1:0);v<g;++v,++S){let T=e[S],k=_?T*d[v]:f[v],E=Qd(T,d[v],l[v],t[S],n[v],k);ec(E,a,l,v,v+g),_&&f.push(d[v]*(T-1)+h[v]+(t[S]-1)*n[v]+1-l[v]-l[v+g])}f.splice(0,0,b),f.splice(c?3:1,0,x)},Gr=(e,t)=>{let n=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((_,b)=>_*b,1)===0){n.length=0;for(let _=2;_<t[1].dims.length;++_)n.push(t[1].dims[_])}let a=e.format==="NHWC";n.splice(0,0,t[1].dims[0]),n.splice(a?3:1,0,t[1].dims[1]);let u=e.pads.slice(),l=e.outputShape.slice(),d=e.outputPadding.slice(),c=t[0].dims,h=e.dilations.slice();if(h.reduce((_,b)=>_+b,0)===0){let _=t[0].dims.length-2;h=new Array(_).fill(1)}let f=e.strides.slice();if(f.reduce((_,b)=>_+b,0)===0){let _=t[0].dims.length-2;f=new Array(_).fill(1)}tc(c,n,h,e.autoPad,e.group,u,f,a,d,l);let g=Object.assign({},e);return Object.assign(g,{kernelShape:n,pads:u,outputPadding:d,outputShape:l,dilations:h,strides:f}),g},nc=e=>{let t=Mr(e),n=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],u=e.dilations,l=e.group??1,d=e.kernelShape,c=e.pads,h=e.strides,f=e.wIsConst(),g=e.outputPadding,_=e.outputShape;return{autoPad:a,format:n,dilations:u,group:l,kernelShape:d,outputPadding:g,outputShape:_,pads:c,strides:h,wIsConst:f,...t,cacheKey:`${e.format};${t.activation};`}},ic=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let n=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[0];if(n!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let u=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==u))throw new Error("invalid bias");let l=e[0].dims.length-2;if(t.dilations.reduce((d,c)=>d+c,0)>0&&t.dilations.length!==l)throw new Error(`dilations should be ${l}D`);if(t.strides.reduce((d,c)=>d+c,0)>0&&t.strides.length!==l)throw new Error(`strides should be ${l}D`);if(t.pads.reduce((d,c)=>d+c,0)>0&&t.pads.length!==l*2)throw new Error(`pads should be ${l*2}D`);if(t.outputPadding.length!==l&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${l}D`);if(t.kernelShape.reduce((d,c)=>d+c,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},Hr=(e,t,n,a)=>{let u=e.kernelCustomData.wT??e.compute(pt(t[1],[2,3,0,1]),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=u);let l=[t[0],u];t.length===3&&l.push(t[2]),e.compute(Yd(l,n,a),{inputs:l})},sc=(e,t)=>{let n=t.format==="NHWC",a=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let u=t.kernelShape;(u.length===0||u[0]===0)&&(u=[e.inputs[1].dims[2]]);let l=t.dilations;(l.length===0||l[0]===0)&&(l=[1]);let d=t.strides;(d.length===0||d[0]===0)&&(d=[1]);let c=t.pads;c.length===0&&(c=[0,0]),c=[0,c[0],0,c[1]],d=[1].concat(d),l=[1].concat(l),u=[1].concat(u);let h=t.outputPadding;h=[0].concat(h);let f=Gr({...t,pads:c,strides:d,dilations:l,kernelShape:u,outputPadding:h},a);Hr(e,a,f,g=>n?[g[0],g[2],g[3]]:[g[0],g[1],g[3]])},rc=(e,t)=>{if(ic(e.inputs,t),e.inputs[0].dims.length===3)sc(e,t);else{let n=Gr(t,e.inputs);Hr(e,e.inputs,n)}}}),ac,oc,uc,l0=w(()=>{"use strict";re(),pe(),Ne(),fe(),ac=(e,t,n,a)=>{let u=L.size(t),l=t.length,d=U("input",e,l),c=Z("output",e,l),h=n.dataType===6?n.getInt32Array()[0]:Number(n.getBigInt64Array()[0]),f=L.normalizeAxis(h,l),g=_=>{let b=` i32(${d.indicesGet("inputIndices","uniforms.axis")}) `,x=Y("uniforms.input_shape","uniforms.axis",l),v=a.reverse?b+(a.exclusive?" + 1":""):"0",S=a.reverse?x:b+(a.exclusive?"":" + 1");return`
                ${_.registerUniform("outputSize","u32").registerUniform("axis","u32").declareVariables(d,c)}
                ${_.mainStart()}
                  ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
                  var inputIndices = ${c.offsetToIndices("global_idx")};
                  var sum = ${c.type.value}(0);
                  let first : i32 = ${v};
                  let last : i32 = ${S};
                  for (var i : i32 = first; i < last; i++) {
                    ${d.indicesSet("inputIndices","uniforms.axis","u32(i)")};
                    sum = sum + ${d.getByIndices("inputIndices")};
                  }
                  ${c.setByOffset("global_idx","sum")};
                }`};return{name:"CumSum",shaderCache:{hint:a.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(u/64)},programUniforms:[{type:12,data:u},{type:12,data:f},...te(t,t)]}),getShaderSource:g}},oc=(e,t)=>{let n=e.inputs[0].dims,a=e.inputs[0].dataType,u=e.inputs[1];e.compute(ac(a,n,u,t),{inputs:[0]})},uc=e=>{let t=e.exclusive===1,n=e.reverse===1;return ke({exclusive:t,reverse:n})}}),lc,dc,cc,pc,hc,d0=w(()=>{"use strict";re(),pe(),Ne(),fe(),lc=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},dc=(e,t,n,a)=>{let u=[];u.push(`fn perm(i: ${a.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`);for(let l=0;l<t;++l)u.push(n.indicesSet("a",e[l],`i[${l}]`));return u.push("return a;}"),u.join(`
`)},cc=(e,t)=>{let n,a,u,l,d,c,h=t.format==="NHWC",f=t.blocksize,g=t.mode==="DCR";h?([n,a,u,l]=e.dims,d=g?[n,a,u,f,f,l/f**2]:[n,a,u,l/f**2,f,f],c=g?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([n,a,u,l]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],d=g?[n,f,f,l/f**2,a,u]:[n,l/f**2,f,f,a,u],c=g?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let _=e.reshape(d),b=_.dims.length,x=e.dataType,v=U("a",x,b),S=Z("output",x,b),T=k=>`
  ${k.registerUniform("output_size","u32").declareVariables(v,S)}

  ${dc(c,b,v,S)}

  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${S.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${S.setByOffset("global_idx",v.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:k=>{let E=h?[n,a*f,u*f,l/f**2]:[n,l/f**2,a*f,u*f],A=L.size(E),C=_.dims,O=L.sortBasedOnPerm(C,c);return{outputs:[{dims:E,dataType:k[0].dataType}],dispatchGroup:{x:Math.ceil(A/64)},programUniforms:[{type:12,data:A},...te(C,O)]}},getShaderSource:T}},pc=(e,t)=>{lc(e.inputs),e.compute(cc(e.inputs[0],t))},hc=e=>ke({blocksize:e.blocksize,mode:e.mode,format:e.format})}),Bt,gi,ss,Kr,Xt,fc,mc,gc,Zr,Jr,Xr,_c,yc,Yr,wc,bc,$c,c0=w(()=>{"use strict";re(),pe(),Ne(),fe(),Bt=256,gi=512,ss=2*Math.PI,Kr=e=>{let t=[],n=e;for(let a of[4,2,3,5])for(;n%a===0;)t.push(a),n/=a;return n===1?t:void 0},Xt=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},fc=(e,t,n,a,u)=>{let l=n/e,d=gi-a,c=f=>`smem[${d}u + base + ${f*t}u]`,h=`  for (var t = local_idx; t < ${l}u; t += ${Bt}u) {
`;h+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,h+=`    var leg: array<vec2<f32>, 5>;
`;for(let f=0;f<e;f++){let g=`${a}u + t + ${f*l}u`;if(f===0)h+=`    leg[0] = smem[${g}];
`;else{let _=u*ss*f/(e*t);h+=`    { let a = ${Xt(_)} * angleUnit; leg[${f}] = cmul(smem[${g}], vec2<f32>(cos(a), sin(a))); }
`}}if(h+=`    let base = (t / ${t}u) * ${t*e}u + twiddleIndex;
`,e===2)h+=`    ${c(0)} = leg[0] + leg[1];
    ${c(1)} = leg[0] - leg[1];
`;else if(e===4){let f=u<0?"vec2<f32>(oddDiff.y, -oddDiff.x)":"vec2<f32>(-oddDiff.y, oddDiff.x)";h+=`    let evenSum = leg[0] + leg[2]; let evenDiff = leg[0] - leg[2];
`,h+=`    let oddSum = leg[1] + leg[3]; let oddDiff = leg[1] - leg[3];
`,h+=`    let oddRot = ${f};
`,h+=`    ${c(0)} = evenSum + oddSum;
    ${c(1)} = evenDiff + oddRot;
`,h+=`    ${c(2)} = evenSum - oddSum;
    ${c(3)} = evenDiff - oddRot;
`}else for(let f=0;f<e;f++){let g=["leg[0]"];for(let _=1;_<e;_++){let b=u*ss*(_*f)/e,x=Xt(Math.cos(b)),v=Xt(Math.sin(b));g.push(`vec2<f32>(leg[${_}].x*${x} - leg[${_}].y*${v}, leg[${_}].x*${v} + leg[${_}].y*${x})`)}h+=`    ${c(f)} = ${g.join(" + ")};
`}return`${h}  }
  workgroupBarrier();
`},mc=(e,t,n)=>{let a="",u=1,l=0;for(let d of e)a+=fc(d,u,t,l,n),u*=d,l=gi-l;return{code:a,resultOffset:l}},gc=(e,t,n,a,u)=>{let l=e.dims,d=l.length,c=l[d-1],h=l[t],f=n&&a?(h-1)*2:h;u!==void 0&&(f=u);let g=n&&a?1:2,_=a&&!n?Math.floor(f/2)+1:f,b=l.slice();b[t]=_,b[d-1]=g;let x=1;for(let S=t+1;S<d-1;S++)x*=l[S];let v=L.size(l)/c/h;return{dataType:e.dataType,outputDims:b,length:f,signalLength:h,inner:x,batch:v,inputComponents:c,outputComponents:g,outputLength:_,inverse:n,onesided:a}},Zr=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),Jr=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],Xr=(e,t,n)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,n),_c=e=>{let{dataType:t,length:n,inputComponents:a,outputComponents:u,inverse:l,onesided:d}=e,c=Je(t),h=l?1:-1,f=l?1/n:1,g=Kr(n),_=b=>{let x=U("x",t,[1]),v=Z("y",t,[1]),S=O=>{let P=`inBase + (${O}) * uniforms.inner * ${a}u`,B=`f32(${x.getByOffset(P)})`,N=a===2?`f32(${x.getByOffset(`${P} + 1u`)})`:"0.0";return`vec2<f32>(${B}, ${N})`},T;if(l&&d){let O=Math.floor(n/2)+1,P=n%2===0?`select(provided, provided - 1u, provided == ${O}u)`:"provided";T=`
    let provided = min(uniforms.signalLength, ${O}u);
    for (var i = local_idx; i < ${n}u; i += ${Bt}u) {
      if (i < provided) { smem[i] = ${S("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();
    for (var k = local_idx + 1u; k < ${P}; k += ${Bt}u) {
      let h = smem[k];
      smem[${n}u - k] = vec2<f32>(h.x, -h.y);
    }
    workgroupBarrier();`}else T=`
    let loadCount = min(uniforms.signalLength, ${n}u);
    for (var i = local_idx; i < ${n}u; i += ${Bt}u) {
      if (i < loadCount) { smem[i] = ${S("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();`;let{code:k,resultOffset:E}=mc(g,n,h),A=f===1?`smem[${E}u + i]`:`smem[${E}u + i] * ${Xt(f)}`,C=u===2?v.setByOffset("off + 1u",`${c}(v.y)`):"";return`
  ${Xr(b,x,v)}
  var<workgroup> smem: array<vec2<f32>, ${2*gi}>;
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${b.mainStart(Bt)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${a}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${u}u;
    ${T}
${k}    for (var i = local_idx; i < uniforms.outputLength; i += ${Bt}u) {
      let v = ${A};
      let off = outBase + i * uniforms.inner * ${u}u;
      ${v.setByOffset("off",`${c}(v.x)`)}
      ${C}
    }
  }`};return{name:"DFT",shaderCache:{hint:Zr(e,"fft"),inputDependencies:["type"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:Jr(e),dispatchGroup:{x:e.batch}})}},yc=e=>{let{dataType:t,length:n,inputComponents:a,outputComponents:u,inverse:l,onesided:d}=e,c=Je(t),h=l?1:-1,f=l?1/n:1,g=_=>{let b=U("x",t,[1]),x=Z("y",t,[1]),v=A=>{let C=`inBase + (${A}) * uniforms.inner * ${a}u`,O=`f32(${b.getByOffset(C)})`,P=a===2?`f32(${b.getByOffset(`${C} + 1u`)})`:"0.0";return`vec2<f32>(${O}, ${P})`},S=l&&d?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
    let provided = min(uniforms.signalLength, ${Math.floor(n/2)+1}u);
    if (k < provided) { return ${v("k")}; }
    let m = ${n}u - k;
    if (m < provided) {
      let h = ${v("m")};
      return vec2<f32>(h.x, -h.y);
    }
    return vec2<f32>(0.0, 0.0);
  }`:`fn spectrum(inBase: u32, n: u32) -> vec2<f32> {
    if (n < uniforms.signalLength) { return ${v("n")}; }
    return vec2<f32>(0.0, 0.0);
  }`,T=`
      let angle = ${Xt(h*ss)} * f32(knMod) / ${Xt(n)};
      acc += cmul(spectrum(inBase, n), vec2<f32>(cos(angle), sin(angle)));
      knMod += k;
      if (knMod >= ${n}u) { knMod -= ${n}u; }`,k=u===2?x.setByOffset("off + 1u",`${c}(v.y)`):"",E=f===1?"acc":`acc * ${Xt(f)}`;return`
  ${Xr(_,b,x)}
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${S}
  ${_.mainStart(Bt)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${a}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${u}u;
    for (var k = local_idx; k < uniforms.outputLength; k += ${Bt}u) {
      var acc = vec2<f32>(0.0, 0.0);
      var knMod = 0u;
      for (var n = 0u; n < ${n}u; n++) {${T}
      }
      let v = ${E};
      let off = outBase + k * uniforms.inner * ${u}u;
      ${x.setByOffset("off",`${c}(v.x)`)}
      ${k}
    }
  }`};return{name:"DFT",shaderCache:{hint:Zr(e,"direct"),inputDependencies:["type"]},getShaderSource:g,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:Jr(e),dispatchGroup:{x:e.batch}})}},Yr=e=>{if(!e||e.dataType===0)return;if(L.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},wc=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let n=t[t.length-1];if(n!==1&&n!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},bc=(e,t)=>{wc(e.inputs);let n=e.inputs[0],a=n.dims.length,u=t.inverse!==0,l=t.onesided!==0,d=Yr(e.inputs[1]);if(d!==void 0&&d<=0)throw new Error("dft_length must be greater than zero.");let c=L.normalizeAxis(Yr(e.inputs[2])??t.axis,a);if(c===a-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(u&&l&&n.dims[a-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let h=gc(n,c,u,l,d);if(h.length<=0)throw new Error(`Invalid DFT length: ${h.length}`);let f=h.length<=gi&&Kr(h.length)!==void 0?_c(h):yc(h);e.compute(f,{inputs:[0]})},$c=e=>ke({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),rs,_i,Qr,vc,xc,Ec,kc,ea,Sc,Ic,Tc,p0=w(()=>{"use strict";re(),pe(),Ne(),fe(),rs="[a-zA-Z]|\\.\\.\\.",_i="("+rs+")+",Qr="^"+_i+"$",vc="("+_i+",)*"+_i,xc="^"+vc+"$",Ec=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let n=this.symbolToIndices.get(e);n===void 0?n=[t]:n.push(t),this.symbolToIndices.set(e,n)}},kc=class{constructor(e,t){var u;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[n,a]=t.includes("->")?t.split("->",2):[t,""];if(!n.match(RegExp(xc)))throw new Error("Invalid LHS term");if(n.split(",").forEach((l,d)=>{let c=e[d].dims.slice();if(!l.match(RegExp(Qr)))throw new Error("Invalid LHS term");let h=this.processTerm(l,!0,c,d);this.lhs.push(h)}),a==="")a+=[...this.symbolToInfo.entries()].filter(([l,d])=>d.count===1||l==="...").map(([l])=>l).join("");else if(!a.match(RegExp(_i)))throw new Error("Invalid RHS");(u=a.match(RegExp(rs,"g")))==null||u.forEach(l=>{if(l==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let d=this.symbolToInfo.get(l);if(d===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(d.dimValue)}}),this.rhs=this.processTerm(a,!1,this.outputDims)}addSymbol(e,t,n){let a=this.symbolToInfo.get(e);if(a!==void 0){if(a.dimValue!==t&&a.count!==1)throw new Error("Dimension mismatch");a.count++,a.inputIndices.push(n)}else a={count:1,dimValue:t,inputIndices:[n]};this.symbolToInfo.set(e,a)}processTerm(e,t,n,a=-1){let u=n.length,l=!1,d=[],c=0;if(!e.match(RegExp(Qr))&&!t&&e!=="")throw new Error("Invalid LHS term");let h=e.match(RegExp(rs,"g")),f=new Ec(a);return h==null||h.forEach((g,_)=>{if(g==="..."){if(l)throw new Error("Only one ellipsis is allowed per input term");l=!0;let b=u-h.length+1;if(b<0)throw new Error("Ellipsis out of bounds");if(d=n.slice(c,c+b),this.hasEllipsis){if(this.ellipsisDims.length!==d.length||this.ellipsisDims.toString()!==d.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=d;else throw new Error("Ellipsis must be specified in the LHS");for(let x=0;x<d.length;x++){let v=String.fromCharCode(48+x);f.addSymbol(v,_+x),this.addSymbol(v,n[c++],a)}}else f.addSymbol(g,_+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(g,n[c++],a)}),f}},ea=e=>e+"_max",Sc=(e,t,n,a)=>{let u=e.map(f=>f.length).map((f,g)=>U(`input${g}`,t,f)),l=L.size(a),d=Z("output",t,a.length),c=[...n.symbolToInfo.keys()].filter(f=>!n.rhs.symbolToIndices.has(f)),h=f=>{let g=[],_="var prod = 1.0;",b="var sum = 0.0;",x="sum += prod;",v=[],S=[],T=[],k=[],E=n.symbolToInfo.size===n.rhs.symbolToIndices.size;n.symbolToInfo.forEach((C,O)=>{var P;if(n.rhs.symbolToIndices.has(O)){let B=(P=n.rhs.symbolToIndices.get(O))==null?void 0:P[0];B!==void 0&&n.lhs.forEach((N,W)=>{if(C.inputIndices.includes(W)){let q=N.symbolToIndices.get(O);if(q===void 0)throw new Error("Invalid symbol error");q.forEach(ie=>{g.push(`${u[W].indicesSet(`input${W}Indices`,ie,d.indicesGet("outputIndices",B))}`)})}})}else n.lhs.forEach((B,N)=>{if(C.inputIndices.includes(N)){let W=B.symbolToIndices.get(O);if(W===void 0)throw new Error("Invalid symbol error");W.forEach(q=>{v.push(`${u[N].indicesSet(`input${N}Indices`,q,`${O}`)}`)}),k.push(`prod *= ${u[N].getByIndices(`input${N}Indices`)};`)}}),S.push(`for(var ${O}: u32 = 0; ${O} < uniforms.${ea(O)}; ${O}++) {`),T.push("}")});let A=E?[...g,`let sum = ${u.map((C,O)=>C.getByIndices(`input${O}Indices`)).join(" * ")};`]:[...g,b,...S,...v,_,...k,x,...T];return`
            ${f.registerUniforms(c.map(C=>({name:`${ea(C)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...u,d)}

            ${f.mainStart()}
            ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${d.offsetToIndices("global_idx")};
            ${u.map((C,O)=>`var input${O}Indices: ${u[O].type.indices};`).join(`
`)}
            ${A.join(`
`)};
            ${d.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:n.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let f=c.filter(_=>n.symbolToInfo.has(_)).map(_=>{var b;return{type:12,data:((b=n.symbolToInfo.get(_))==null?void 0:b.dimValue)||0}});f.push({type:12,data:l});let g=e.map((_,b)=>[...te(_)]).reduce((_,b)=>_.concat(b),f);return g.push(...te(a)),{outputs:[{dims:a,dataType:t}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:g}},getShaderSource:h}},Ic=(e,t)=>{let n=new kc(e.inputs,t.equation),a=n.outputDims,u=e.inputs.map((l,d)=>l.dims);e.compute(Sc(u,e.inputs[0].dataType,n,a))},Tc=e=>{let t=e.equation.replace(/\s+/g,"");return ke({equation:t})}}),Ac,ta,zc,Cc,Oc,h0=w(()=>{"use strict";re(),pe(),fe(),Ac=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),a=n.length<t.length?0:n.length-t.length,u=t.length<n.length?0:t.length-n.length;for(;a<n.length&&u<t.length;++a,++u)if(n[a]!==t[u]&&n[a]!==1&&t[u]!==1)throw new Error("Expand requires shape to be broadcastable to input")},ta=(e,t)=>{let n=e.length-t.length,a=[];for(let u=0;u<n;++u)a.push(e[u]);for(let u=0;u<t.length;++u)a.push(t[u]===1?e[u+n]:t[u]);return a},zc=(e,t)=>e.length>t.length?ta(e,t):ta(t,e),Cc=e=>{let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),a=zc(t,n),u=e[0].dataType,l=u===9||L.size(t)===1,d=u===9||t.length>0&&t[t.length-1]%4===0?4:1,c=l||a.length>0&&a[a.length-1]%4===0?4:1,h=Math.ceil(L.size(a)/c),f=_=>{let b=U("input",u,t.length,d),x=Z("output",u,a.length,c),v;if(u===9){let S=(T,k,E="")=>`
          let outputIndices${k} = ${x.offsetToIndices(`outputOffset + ${k}u`)};
          let offset${k} = ${b.broadcastedIndicesToOffset(`outputIndices${k}`,x)};
          let index${k} = offset${k} / 4u;
          let component${k} = offset${k} % 4u;
          ${T}[${k}] = ${E}(${b.getByOffset(`index${k}`)}[component${k}]);
        `;v=`
        let outputOffset = global_idx * ${c};
        var data = vec4<u32>(0);
        ${S("data",0,"u32")}
        ${S("data",1,"u32")}
        ${S("data",2,"u32")}
        ${S("data",3,"u32")}
        ${x.setByOffset("global_idx","data")}
      }`}else v=`
        let outputIndices = ${x.offsetToIndices(`global_idx * ${c}`)};
        let inputOffset = ${b.broadcastedIndicesToOffset("outputIndices",x)};
        let data = ${x.type.value}(${b.getByOffset(`inputOffset / ${d}`)});
        ${x.setByOffset("global_idx","data")}
      }`;return`
    ${_.registerUniform("vec_size","u32").declareVariables(b,x)}
    ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${v}`},g=[{type:12,data:h},...te(t,a)];return{name:"Expand",shaderCache:{hint:`${a.length};${d}${c}`,inputDependencies:["rank"]},getShaderSource:f,getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:g})}},Oc=e=>{Ac(e.inputs),e.compute(Cc(e.inputs),{inputs:[0]})}}),Mc,Rc,f0=w(()=>{"use strict";re(),pe(),fe(),Or(),Mc=e=>{let t=e[0].dataType,n=L.size(e[0].dims),a=L.size(e[1].dims),u=a%4===0,l=d=>{let c=U("x",t,[1],4),h=U("bias",t,[1],4),f=Z("y",t,[1],4),g=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],_=x=>`
      let bias${x}_offset: u32 = (global_idx * 4 + ${x}) % uniforms.bias_size;
      let bias${x} = ${h.getByOffset(`bias${x}_offset / 4`)}[bias${x}_offset % 4];`,b=u?`
      let bias = ${h.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${_(0)}${_(1)}${_(2)}${_(3)}
      let bias = ${c.type.value}(bias0, bias1, bias2, bias3);`;return`${d.registerUniforms(g).declareVariables(c,h,f)}

    ${zr(Je(t))}

    ${d.mainStart(Un)}
      ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${c.getByOffset("global_idx")};
      ${b}
      let x_in = x + bias;
      ${f.setByOffset("global_idx",Cr("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${u}`,inputDependencies:["type","type"]},getShaderSource:l,getRunData:d=>({outputs:[{dims:d[0].dims,dataType:d[0].dataType}],programUniforms:[{type:12,data:Math.ceil(n/4)},{type:12,data:a}],dispatchGroup:{x:Math.ceil(n/Un/4)}})}},Rc=e=>{e.inputs.length<2||L.size(e.inputs[1].dims)===0?ud(e):e.compute(Mc(e.inputs))}}),Pc,Dc,Bc,Lc,m0=w(()=>{"use strict";re(),pe(),Ne(),fe(),Pc=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},Dc=(e,t)=>{let n=e[0].dims,a=e[1].dims,u=n.length,l=L.normalizeAxis(t.axis,u),d=n.slice(0);d.splice(l,1,...a);let c=n[l],h=e[0].dataType===9?4:1,f=Math.ceil(L.size(d)/h),g=[{type:12,data:f},{type:6,data:c},{type:12,data:l},...te(e[0].dims,e[1].dims,d)],_=b=>{let x=U("data",e[0].dataType,e[0].dims.length,h),v=U("inputIndices",e[1].dataType,e[1].dims.length),S=Z("output",e[0].dataType,d.length,h),T=E=>{let A=a.length,C=`var indicesIndices${E}  = ${v.type.indices}(0);`;for(let O=0;O<A;O++)C+=`${A>1?`indicesIndices${E}[${O}]`:`indicesIndices${E}`} = ${d.length>1?`outputIndices${E}[uniforms.axis + ${O}]`:`outputIndices${E}`};`;C+=`
          var idx${E} = ${v.getByIndices(`indicesIndices${E}`)};
          if (idx${E} < 0) {
            idx${E} = idx${E} + uniforms.axisDimLimit;
          }
          var dataIndices${E} : ${x.type.indices};
        `;for(let O=0,P=0;O<u;O++)O===l?(C+=`${u>1?`dataIndices${E}[${O}]`:`dataIndices${E}`} = u32(idx${E});`,P+=A):(C+=`${u>1?`dataIndices${E}[${O}]`:`dataIndices${E}`} = ${d.length>1?`outputIndices${E}[${P}]`:`outputIndices${E}`};`,P++);return C},k;if(e[0].dataType===9){let E=(A,C,O="")=>`
          let outputIndices${C} = ${S.offsetToIndices(`outputOffset + ${C}u`)};
          ${T(C)};
          let offset${C} = ${x.indicesToOffset(`dataIndices${C}`)};
          let index${C} = offset${C} / 4u;
          let component${C} = offset${C} % 4u;
          ${A}[${C}] = ${O}(${x.getByOffset(`index${C}`)}[component${C}]);
        `;k=`
        let outputOffset = global_idx * ${h};
        var value = vec4<u32>(0);
        ${E("value",0,"u32")}
        ${E("value",1,"u32")}
        ${E("value",2,"u32")}
        ${E("value",3,"u32")}
        ${S.setByOffset("global_idx","value")}
      `}else k=`
      let outputIndices = ${S.offsetToIndices("global_idx")};
      ${T("")};
      let value = ${x.getByIndices("dataIndices")};
      ${S.setByOffset("global_idx","value")};
      `;return`
      ${b.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(x,v,S)}
      ${b.mainStart()}
        ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${k}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:g}),getShaderSource:_}},Bc=e=>ke({axis:e.axis}),Lc=(e,t)=>{let n=e.inputs;Pc(n),e.compute(Dc(e.inputs,t))}}),Nc,Uc,Fc,g0=w(()=>{"use strict";re(),pe(),fe(),Nc=(e,t,n,a,u,l,d,c,h)=>{let f=[{type:12,data:l},{type:12,data:a},{type:12,data:u},{type:12,data:n},{type:12,data:d},{type:12,data:c},{type:12,data:h}],g=[l];f.push(...te(t.dims,g));let _=b=>{let x=U("indices_data",t.dataType,t.dims.length),v=Z("input_slice_offsets_data",12,1,1),S=[x,v],T=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:u.length},{name:"sizes_from_slice_dims_data",type:"u32",length:n.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${b.registerUniforms(T).declareVariables(...S)}
  ${b.mainStart()}
    ${b.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${u.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${n.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${u.length}_${n.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:g,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:f}),getShaderSource:_},{inputs:[t],outputs:[-1]})[0]},Uc=(e,t)=>{let n=e.inputs,a=n[0].dims,u=n[0].dataType,l=n[1].dims,d=l[l.length-1],c=L.sizeToDimension(l,l.length-1),h=L.sizeFromDimension(a,t.batchDims+d),f=L.sizeToDimension(a,t.batchDims),g=L.sizeFromDimension(a,t.batchDims),_=c/f,b=new Array(d),x=h;for(let C=0;C<d;++C)b[d-1-C]=x,x*=a[t.batchDims+d-1-C];let v=Nc(e,n[1],b,t.batchDims,a,c,_,g,d),S=t.batchDims+d;if(S>a.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let T=l.slice(0,-1).concat(a.slice(S)),k=L.size(T),E=[{type:12,data:k},{type:12,data:h},...te(n[0].dims,v.dims,T)],A=C=>{let O=U("data",n[0].dataType,n[0].dims.length),P=U("slice_offsets",12,v.dims.length),B=Z("output",n[0].dataType,T.length);return`
          ${C.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(O,P,B)}
            ${C.mainStart()}
            ${C.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:T,dataType:u}],dispatchGroup:{x:Math.ceil(k/64)},programUniforms:E}),getShaderSource:A},{inputs:[n[0],v]})},Fc=e=>({batchDims:e.batch_dims,cacheKey:""})}),Wc,jc,Vc,qc,_0=w(()=>{"use strict";re(),pe(),Ne(),fe(),Wc=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let n=L.normalizeAxis(t.quantizeAxis,e[0].dims.length),a=t.blockSize,u=e[0],l=e[2],d=e.length===4?e[3]:void 0;if(l.dims.length!==u.dims.length||!u.dims.map((c,h)=>h===n?Math.ceil(c/a)===l.dims[h]:c===l.dims[h]).reduce((c,h)=>c&&h,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(d){if(d.dataType!==u.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(d.dims.length!==l.dims.length||!d.dims.map((c,h)=>c===l.dims[h]).reduce((c,h)=>c&&h,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},jc=(e,t)=>{let n=e[0].dims,a=e[1].dims,u=n.length,l=L.normalizeAxis(t.gatherAxis,u),d=L.normalizeAxis(t.quantizeAxis,u),c=n.slice(0);c.splice(l,1,...a);let h=L.size(c),f=e[2].dataType,g=e[0].dataType===22,_=[{type:12,data:h},{type:12,data:d},{type:12,data:l},{type:12,data:t.blockSize},...te(...e.map((x,v)=>x.dims),c)],b=x=>{let v=U("data",e[0].dataType,e[0].dims.length),S=U("inputIndices",e[1].dataType,e[1].dims.length),T=U("scales",e[2].dataType,e[2].dims.length),k=e.length>3?U("zeroPoint",e[3].dataType,e[3].dims.length):void 0,E=Z("output",f,c.length),A=[v,S,T];k&&A.push(k);let C=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${x.registerUniforms(C).declareVariables(...A,E)}
        ${x.mainStart()}
        let output_indices = ${E.offsetToIndices("global_idx")};
        var indices_indices = ${S.type.indices}(0);
        ${a.length>1?`
          for (var i: u32 = 0; i < ${a.length}; i++) {
            let index = ${E.indicesGet("output_indices","uniforms.gather_axis + i")};
            ${S.indicesSet("indices_indices","i","index")};
          }`:`indices_indices = ${E.indicesGet("output_indices","uniforms.gather_axis")};`};
        var data_indices = ${v.type.indices}(0);
        for (var i: u32 = 0; i < uniforms.gather_axis; i++) {
          let index = ${E.indicesGet("output_indices","i")};
          ${v.indicesSet("data_indices","i","index")};
        }
        var index_from_indices = ${S.getByIndices("indices_indices")};
        if (index_from_indices < 0) {
          index_from_indices += ${n[l]};
        }
        ${v.indicesSet("data_indices","uniforms.gather_axis","u32(index_from_indices)")};
        for (var i = uniforms.gather_axis + 1; i < ${c.length}; i++) {
          let index = ${E.indicesGet("output_indices",`i + ${a.length} - 1`)};
          ${v.indicesSet("data_indices","i","index")};
        }
        let data_offset = ${v.indicesToOffset("data_indices")};
        let data_index = data_offset % 8;
        // Convert 4-bit packed data to 8-bit packed data.
        let packed_4bit_quantized_data = ${v.getByOffset("data_offset / 8")};
        let packed_8bit_quantized_data = (packed_4bit_quantized_data >> (4 * (data_index % 2))) & 0x0f0f0f0f;
        let quantized_data_vec = ${g?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_quantized_data));
        let quantized_data = quantized_data_vec[data_index / 2];
        var scale_indices = data_indices;
        let quantize_axis_index = ${T.indicesGet("data_indices","uniforms.quantize_axis")} / uniforms.block_size;
        ${T.indicesSet("scale_indices","uniforms.quantize_axis","quantize_axis_index")};
        var scale = ${T.getByIndices("scale_indices")};
        ${k?`
              let zero_point_indices = scale_indices;
              let zero_point_offset = ${k.indicesToOffset("zero_point_indices")};
              let zero_point_index = zero_point_offset % 8;
              let packed_4bit_zero_points = ${k.getByOffset("zero_point_offset / 8")};
              let packed_8bit_zero_points = (packed_4bit_zero_points >> (4 * (zero_point_index % 2))) & 0x0f0f0f0f;
              let zero_point_vec = ${g?"unpack4xI8":"unpack4xU8"}(u32(packed_8bit_zero_points));
              let zero_point = zero_point_vec[zero_point_index / 2];`:"var zero_point = 0"};
        let dequantized_data = ${Je(f)}(quantized_data - zero_point) * scale;
        ${E.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((x,v)=>v!==1).map(x=>x.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(x,v)=>"rank")},getRunData:()=>({outputs:[{dims:c,dataType:f}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:_}),getShaderSource:b}},Vc=(e,t)=>{let n=e.inputs;Wc(n,t),e.compute(jc(e.inputs,t))},qc=e=>ke({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Gc,Hc,Kc,Zc,y0=w(()=>{"use strict";re(),pe(),Ne(),fe(),Gc=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Hc=(e,t)=>{let n=e[0].dims,a=e[0].dataType,u=n.length,l=e[1].dims,d=e[1].dataType,c=L.normalizeAxis(t.axis,u),h=n[c],f=l.slice(0),g=L.size(f),_=U("input",a,u),b=U("indicesInput",d,l.length),x=Z("output",a,f.length),v=[{type:12,data:g},{type:6,data:h},{type:12,data:c}];return v.push(...te(n,l,f)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:f,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:v}),getShaderSource:S=>`
      ${S.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,b,x)}
      ${S.mainStart()}
      ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${x.offsetToIndices("global_idx")};

      var idx = ${b.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${_.type.indices}(outputIndices);
      ${_.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${_.getByIndices("inputIndices")};

      ${x.setByOffset("global_idx","value")};
  }`}},Kc=e=>ke({axis:e.axis}),Zc=(e,t)=>{let n=e.inputs;Gc(n),e.compute(Hc(e.inputs,t))}}),Jc,Xc,Yc,Qc,w0=w(()=>{"use strict";re(),pe(),fe(),Jc=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Xc=(e,t)=>{let n=e[0].dims.slice(),a=e[1].dims.slice(),[u,l,d]=eu.getShapeOfGemmResult(n,t.transA,a,t.transB,e.length===3?e[2].dims:void 0),c=[u,l];if(!c)throw new Error("Can't use gemm on the given tensors");let h=16,f=Math.ceil(l/h),g=Math.ceil(u/h),_=!0,b=L.size(c),x=[{type:12,data:_?f:b},{type:12,data:u},{type:12,data:l},{type:12,data:d},{type:1,data:t.alpha},{type:1,data:t.beta}],v=["type","type"];e.length===3&&(x.push(...te(e[2].dims)),v.push("rank")),x.push(...te(c));let S=k=>{let E="";t.transA&&t.transB?E="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?E="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?E="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(E="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let A=t.alpha===1?"":"value *= uniforms.alpha;",C=U("a",e[0].dataType,e[0].dims),O=U("b",e[1].dataType,e[1].dims),P=C.type.value,B=null,N=[C,O];e.length===3&&(B=U("c",e[2].dataType,e[2].dims.length),N.push(B));let W=Z("output",e[0].dataType,c.length);N.push(W);let q=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${k.registerUniforms(q).declareVariables(...N)}

  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${P}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${E}
    }

    ${A}
    ${B!=null?`let cOffset = ${B.broadcastedIndicesToOffset("vec2(m, n)",W)}; value += ${P}(uniforms.beta) * ${B.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},T=k=>{let E=U("a",e[0].dataType,e[0].dims),A=U("b",e[1].dataType,e[1].dims),C=null,O=[E,A];e.length===3&&(C=U("c",e[2].dataType,e[2].dims.length),O.push(C));let P=Z("output",e[0].dataType,c.length);O.push(P);let B=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],N="",W="";t.transA&&t.transB?(W=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${E.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${A.type.value}(0);
      }
      `,N="value += tile_a[k][local_id.y] * tile_b[local_id.x][k];"):t.transA&&!t.transB?(W=`
      var col = tile_row_start + local_id.x;
      var row = k_start + local_id.y;
      if (col < uniforms.M && row < uniforms.K) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.M + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${E.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${A.type.value}(0);
      }
      `,N="value += tile_a[k][local_id.y] * tile_b[k][local_id.x];"):!t.transA&&t.transB?(W=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${E.type.value}(0);
      }

      col = k_start + local_id.x;
      row = tile_col_start + local_id.y;
      if (col < uniforms.K && row < uniforms.N) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.K + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${A.type.value}(0);
      }
      `,N="value += tile_a[local_id.y][k] * tile_b[local_id.x][k];"):!t.transA&&!t.transB&&(W=`
      var col = k_start + local_id.x;
      var row = tile_row_start + local_id.y;
      if (col < uniforms.K && row < uniforms.M) {
        tile_a[local_id.y][local_id.x] = a[row * uniforms.K + col];
      } else {
        tile_a[local_id.y][local_id.x] = ${E.type.value}(0);
      }

      col = tile_col_start + local_id.x;
      row = k_start + local_id.y;
      if (col < uniforms.N && row < uniforms.K) {
        tile_b[local_id.y][local_id.x] = b[row * uniforms.N + col];
      } else {
        tile_b[local_id.y][local_id.x] = ${A.type.value}(0);
      }
      `,N="value += tile_a[local_id.y][k] * tile_b[k][local_id.x];");let q=t.alpha===1?"":"value *= uniforms.alpha;";return`
  ${k.registerUniforms(B).declareVariables(...O)}
  var<workgroup> tile_a: array<array<${E.type.storage}, ${h}>, ${h}>;
  var<workgroup> tile_b: array<array<${A.type.storage}, ${h}>, ${h}>;
  ${k.mainStart([h,h,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${h};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${h};
    let num_tiles = (uniforms.K - 1) / ${h} + 1;
    var k_start = 0u;
    var value = ${P.type.value}(0);
    for (var t: u32 = 0u; t < num_tiles; t++) {
      ${W}
      k_start = k_start + ${h};
      workgroupBarrier();

      for (var k: u32 = 0u; k < ${h}; k++) {
        ${N}
      }
      workgroupBarrier();
    }

    ${q}
    let m = tile_row_start + local_id.y;
    let n = tile_col_start + local_id.x;
    ${C!=null?`let cOffset = ${C.broadcastedIndicesToOffset("vec2(m, n)",P)}; value += ${P.type.value}(uniforms.beta) * ${C.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return _?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:c,dataType:e[0].dataType}],dispatchGroup:{x:f*g},programUniforms:x}),getShaderSource:T}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:c,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:x}),getShaderSource:S}},Yc=e=>{let t=e.transA,n=e.transB,a=e.alpha,u=e.beta;return{transA:t,transB:n,alpha:a,beta:u,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Qc=(e,t)=>{Jc(e.inputs),e.compute(Xc(e.inputs,t))}}),At,Lt,xn,En,ep,tp,np,ip,sp,rp,ap,op,up,lp,b0=w(()=>{"use strict";re(),pe(),Ne(),fe(),[At,Lt,xn,En]=[0,1,2,3],ep=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},tp=`
  fn gs_get_cubic_coeffs(x: f32) -> vec4<f32> {
    let cubic_alpha = -0.75f;
    let x_abs = abs(x);
    var coeffs: vec4<f32>;
    coeffs[0] = (((cubic_alpha * (x_abs + 1) - 5 * cubic_alpha) * (x_abs + 1) + 8 * cubic_alpha) * (x_abs + 1) - 4 * cubic_alpha);
    coeffs[1] = (((cubic_alpha + 2) * x_abs - (cubic_alpha + 3)) * x_abs * x_abs + 1);
    coeffs[2] = (((cubic_alpha + 2) * (1 - x_abs) - (cubic_alpha + 3)) * (1 - x_abs) * (1 - x_abs) + 1);
    coeffs[3] = (((cubic_alpha * (2 - x_abs) - 5 * cubic_alpha) * (2 - x_abs) + 8 * cubic_alpha) * (2 - x_abs) - 4 * cubic_alpha);
    return coeffs;
  }
`,np=e=>`
  fn gs_bicubic_interpolate(p: mat4x4<${e}>, x: f32, y: f32) -> ${e} {
    var v: vec4<f32>;
    var coeffs = gs_get_cubic_coeffs(x);
    for (var i = 0; i < 4; i++) {
      v[i] = coeffs[0] * p[i][0] + coeffs[1] * p[i][1] + coeffs[2] * p[i][2] + coeffs[3] * p[i][3];
    }
    coeffs = gs_get_cubic_coeffs(y);
    let pixel = ${e}(coeffs[0] * v[0] + coeffs[1] * v[1] + coeffs[2] * v[2] + coeffs[3] * v[3]);
    return pixel;
  }
`,ip=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,sp=e=>`
  ${e.paddingMode==="reflection"?`
      fn gs_reflect(x: i32, x_min: f32, x_max: f32) -> u32 {
        var dx = 0.0;
        var fx = f32(x);
        let range = x_max - x_min;
        if (fx < x_min) {
          dx = x_min - fx;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_min + r;
          } else {
            fx = x_max - r;
          }
        } else if (fx > x_max) {
          dx = fx - x_max;
          let n = u32(dx / range);
          let r = dx - f32(n) * range;
          if (n % 2 == 0) {
            fx = x_max - r;
          } else {
            fx = x_min + r;
          }
        }
        return u32(fx);
      }`:""}
`,rp=(e,t,n)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${At}] = batch;
     indices[${Lt}] = channel;`+(()=>{switch(n.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${xn}] = u32(r);
            indices[${En}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${xn}] = u32(clamp(r, 0, H - 1));
          indices[${En}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${xn}] = gs_reflect(r, border[1], border[3]);
          indices[${En}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${n.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,ap=(e,t,n)=>(()=>{switch(n.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${At}], indices[${Lt}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${At}], indices[${Lt}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${At}], indices[${Lt}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${At}], indices[${Lt}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${At}], indices[${Lt}], border);

          let dx2 = ${t}(f32(x2) - x);
          let dx1 = ${t}(x - f32(x1));
          let dy2 = ${t}(f32(y2) - y);
          let dy1 = ${t}(y - f32(y1));
          let result = dy2 * (dx2 * p11 + dx1 * p12) + dy1 * (dx2 * p21 + dx1 * p22);
        `;case"bicubic":return`
          let x0 = i32(floor(x)) - 1;
          let y0 = i32(floor(y)) - 1;
          var p: mat4x4<${t}>;
          for (var h = 0; h < 4; h++) {
            for (var w = 0; w < 4; w++) {
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${At}], indices[${Lt}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${n.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,op=(e,t)=>{let n=U("x",e[0].dataType,e[0].dims.length),a=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],u=U("grid",e[1].dataType,a.length,2),l=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(l=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[At,Lt,xn,En]=[0,3,1,2]);let d=Z("output",e[0].dataType,l.length),c=n.type.value,h=L.size(l),f=[{type:12,data:h},...te(e[0].dims,a,l)],g=_=>`
  ${_.registerUniform("output_size","u32").declareVariables(n,u,d)}
  ${tp}
  ${np(c)}
  ${ip(t)}
  ${sp(t)}
  ${rp(n,c,t)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${xn}]);
      let W_in = i32(uniforms.x_shape[${En}]);

      ${t.alignCorners===0?`
      let x_min = -0.5;
      let x_max = f32(W_in) - 0.5;
      let y_min = -0.5;
      let y_max = f32(H_in) - 0.5;
      `:`
      let x_min = 0.0;
      let x_max = f32(W_in) - 1.0;
      let y_min = 0.0;
      let y_max = f32(H_in) - 1.0;
      `};
      let border = vec4<f32>(x_min, y_min, x_max, y_max);

      let indices = ${d.offsetToIndices("global_idx")};
      var grid_indices = vec3<u32>(indices[${At}], indices[${xn}], indices[${En}]);
      let nxy = ${u.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${ap(d,c,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:_=>{let b=L.size(l);return{outputs:[{dims:l,dataType:_[0].dataType}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:f}},getShaderSource:g}},up=(e,t)=>{ep(e.inputs),e.compute(op(e.inputs,t))},lp=e=>ke({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),ot,dp,cp,na,pp,yi,hp,fp=w(()=>{"use strict";re(),pe(),Ne(),_r(),Tr(),fe(),Jt(),ot=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,dp=(e,t)=>{let n=e[0],a=ot(e,1),u=ot(e,2),l=ot(e,3),d=ot(e,4),c=ot(e,5),h=ot(e,6),f=ot(e,7);if(n.dims.length!==3&&n.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let g=n.dims[0],_=n.dims[1],b=n.dims.length===3?n.dims[2]:t.numHeads*n.dims[4],x=_,v=0,S=0,T=Math.floor(b/t.numHeads);if(h&&f&&L.size(h.dims)&&L.size(f.dims)){if(h.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(h.dims[0]!==g||h.dims[1]!==t.numHeads||h.dims[3]!==T)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(f.dims[0]!==g||f.dims[1]!==t.numHeads||f.dims[3]!==T)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(h.dims[2]!==f.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(f.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');v=h.dims[2],S=h.dims[2]}else if(h&&L.size(h.dims)||f&&L.size(f.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let k;if(a&&L.size(a.dims)>0){if(n.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(a.dims[2]!==n.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');k=2,x=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==T)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(u)throw new Error('Expect "value" be none when "key" has packed kv format.');k=5,x=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==T)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');k=0,x=a.dims[2]}}else{if(n.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(n.dims[2]!==t.numHeads||n.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');k=3}if(l&&L.size(l.dims)>0){if(l.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(a&&a.dims.length===5&&a.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let E=v+x,A=0;if(d&&L.size(d.dims)>0){A=8;let B=d.dims;throw B.length===1?B[0]===g?A=1:B[0]===3*g+2&&(A=3):B.length===2&&B[0]===g&&B[1]===E&&(A=5),A===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let C=!1,O=b;if(u&&L.size(u.dims)>0){if(u.dims.length!==3&&u.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==u.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(u.dims.length===3){if(x!==u.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');O=u.dims[2]}else{if(x!==u.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');O=u.dims[1]*u.dims[3],C=!0}}let P=!1;if(d&&L.size(d.dims)>0)throw new Error("Key padding mask is not supported");if(c&&L.size(c.dims)>0){if(c.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(c.dims[0]!==g||c.dims[1]!==t.numHeads||c.dims[2]!==_||c.dims[3]!==E)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:g,sequenceLength:_,pastSequenceLength:v,kvSequenceLength:x,totalSequenceLength:E,maxSequenceLength:S,inputHiddenSize:0,hiddenSize:b,vHiddenSize:O,headSize:T,vHeadSize:Math.floor(O/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:A,scale:t.scale,broadcastResPosBias:P,passPastInKv:C,qkvFormat:k}},cp=e=>ke({...e}),na=ke({perm:[0,2,1,3]}),pp=(e,t,n,a,u,l,d)=>{let c=[a,u,l],h=L.size(c),f=[{type:12,data:h},{type:12,data:d},{type:12,data:l}],g=_=>{let b=Z("qkv_with_bias",t.dataType,c),x=U("qkv",t.dataType,c),v=U("bias",n.dataType,c),S=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${_.registerUniforms(S).declareVariables(x,v,b)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:c,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:f}),getShaderSource:g},{inputs:[t,n],outputs:[-1]})[0]},yi=(e,t,n,a,u,l,d,c)=>{let h=l;if(d&&L.size(d.dims)>0){if(a===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return h=pp(e,l,d,t,a,n*u,c),h=h.reshape([t,a,n,u]),n===1||a===1?h:e.compute(pt(h,na.perm),{inputs:[h],outputs:[-1]})[0]}else return l.dims.length===3&&(h=l.reshape([t,a,n,u])),n===1||a===1?h:e.compute(pt(h,na.perm),{inputs:[h],outputs:[-1]})[0]},hp=(e,t)=>{let n=dp(e.inputs,t),a=e.inputs[0],u=ot(e.inputs,1),l=ot(e.inputs,2),d=ot(e.inputs,3),c=ot(e.inputs,4),h=ot(e.inputs,5),f=ot(e.inputs,6),g=ot(e.inputs,7);if(a.dims.length===5)throw new Error("Packed QKV is not implemented");if((u==null?void 0:u.dims.length)===5)throw new Error("Packed KV is not implemented");let _=u&&l&&u.dims.length===4&&l.dims.length===4,b=yi(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,a,d,0);if(_)return pi(e,b,u,l,c,void 0,f,g,h,n);if(!u||!l)throw new Error("key and value must be provided");let x=yi(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.headSize,u,d,n.hiddenSize),v=yi(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.vHeadSize,l,d,2*n.hiddenSize);pi(e,b,x,v,c,void 0,f,g,h,n)}}),mp,gp,_p,yp,ia,wp,bp,$p=w(()=>{"use strict";re(),pe(),Ne(),fe(),mp=e=>{if(!e||e.length<1)throw new Error("too few inputs")},gp=(e,t)=>{let n=[],a=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(u=>n.push(Number(u))),a=n.length),ke({numOutputs:a,axis:t.axis,splitSizes:n})},_p=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${Y("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,yp=e=>{let t=e.length,n=[];for(let a=0;a<t;++a){let u=e[a].setByIndices("indices","input[global_idx]");t===1?n.push(u):a===0?n.push(`if (output_number == ${a}u) { ${u} }`):a===t-1?n.push(`else { ${u} }`):n.push(`else if (output_number == ${a}) { ${u} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${n.join(`
`)}
      }`},ia=(e,t)=>{let n=e[0].dims,a=L.size(n),u=e[0].dataType,l=L.normalizeAxis(t.axis,n.length),d=new Array(t.numOutputs),c=U("input",u,n.length),h=new Array(t.numOutputs),f=[],g=[],_=0,b=[{type:12,data:a}];for(let v=0;v<t.numOutputs;v++){_+=t.splitSizes[v],h[v]=_;let S=n.slice();S[l]=t.splitSizes[v],g.push(S),d[v]=Z(`output${v}`,u,S.length),f.push({dims:g[v],dataType:e[0].dataType})}b.push({type:12,data:h},...te(n,...g));let x=v=>`
  ${v.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",h.length).declareVariables(c,...d)}
  ${_p(h.length)}
  ${yp(d)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.input_size")}

    var indices = ${c.offsetToIndices("global_idx")};
    var index = ${c.indicesGet("indices",l)};
    let output_number = calculateOutputIndex(index);
    if (output_number != 0) {
      index -= ${Y("uniforms.size_in_split_axis","output_number - 1u",h.length)};
      ${c.indicesSet("indices",l,"index")};
    }
    writeBufferData(output_number, indices, global_idx);
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:f,dispatchGroup:{x:Math.ceil(a/64)},programUniforms:b})}},wp=(e,t)=>{mp(e.inputs);let n=e.inputs.length===1?t:gp(e.inputs,t);e.compute(ia(e.inputs,n),{inputs:[0]})},bp=e=>{let t=e.axis,n=e.splitSizes,a=e.numOutputs<0?n.length:e.numOutputs;if(a!==n.length)throw new Error("numOutputs and splitSizes length must be equal");return ke({axis:t,numOutputs:a,splitSizes:n})}}),vp,as,xp,Ep=w(()=>{"use strict";re(),pe(),Ne(),fe(),vp=(e,t)=>{let[n,a,u,l]=e,{numHeads:d,rotaryEmbeddingDim:c}=t;if(n.dims.length!==3&&n.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${n.dims.length}`);if(!L.areEqual(a.dims,[])&&!L.areEqual(a.dims,[1])&&a.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${a.dims.length}`);if(u.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${u.dims.length}`);if(l.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${l.dims.length}`);if(!L.areEqual(u.dims,l.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(c>0&&d===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let h=n.dims[0],f=n.dims[n.dims.length-2],g=u.dims[0],_=L.sizeFromDimension(n.dims,1)/f,b=c===0?u.dims[1]*2:_/d;if(c>b)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(a.dims.length===2){if(h!==a.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${a.dims[0]}`);if(f!==a.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${a.dims[1]}`)}if(f>g)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(b/2!==u.dims[1]&&c/2!==u.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${u.dims[1]}`)},as=(e,t)=>{let{interleaved:n,numHeads:a,rotaryEmbeddingDim:u,scale:l}=t,d=e[0].dims[0],c=L.sizeFromDimension(e[0].dims,1),h=e[0].dims[e[0].dims.length-2],f=c/h,g=e[2].dims[1],_=u===0?g*2:f/a,b=new Array(d,h,f/_,_-g),x=L.computeStrides(b),v=[{type:1,data:l},{type:12,data:b},{type:12,data:x},...e[0].dims.length===3?new Array({type:12,data:[c,f,_,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[c,_,h*_,1]}):[],...te(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],S=T=>{let k=U("input",e[0].dataType,e[0].dims.length),E=U("position_ids",e[1].dataType,e[1].dims.length),A=U("cos_cache",e[2].dataType,e[2].dims.length),C=U("sin_cache",e[3].dataType,e[3].dims.length),O=Z("output",e[0].dataType,e[0].dims.length);return T.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:b.length},{name:"global_strides",type:"u32",length:x.length},{name:"input_output_strides",type:"u32",length:x.length}]),`
        ${T.declareVariables(k,E,A,C,O)}

        ${T.mainStart(Un)}
          let half_rotary_emb_dim = uniforms.${A.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${T.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${E.broadcastedIndicesToOffset("bsnh.xy",Z("",E.type.tensor,2))};
            let position_id =
                u32(${E.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${n});
            let j = i + select(half_rotary_emb_dim, 1, ${n});
            let re = ${k.getByOffset("i")} * ${A.get("position_id","bsnh[3]")} -
                ${k.getByOffset("j")} * ${C.get("position_id","bsnh[3]")};
            ${O.setByOffset("i","re")}
            let im = ${k.getByOffset("i")} * ${C.get("position_id","bsnh[3]")} +
                ${k.getByOffset("j")} * ${A.get("position_id","bsnh[3]")};
            ${O.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${O.setByOffset("k",k.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:ke({interleaved:n}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:S,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(L.size(b)/Un)},programUniforms:v})}},xp=(e,t)=>{vp(e.inputs,t),e.compute(as(e.inputs,t))}}),kp,Sp,sa,Ip,Tp,$0=w(()=>{"use strict";Ne(),re(),Tr(),fp(),$p(),Jt(),Ep(),fe(),kp=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let n=e[0],a=e[1],u=e[2],l=e[3],d=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(n.dims.length!==3&&n.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=!1,h=n.dims[0],f=n.dims[1],g=n.dims.length===3?c?n.dims[2]/3:n.dims[2]:t.numHeads*n.dims[4],_=f,b=0,x=!a||a.dims.length===0,v=Math.floor(x?g/(t.numHeads+2*t.kvNumHeads):g/t.numHeads);x&&(g=v*t.numHeads);let S=l&&l.dims.length!==0,T=d&&d.dims.length!==0;if(S&&l.dims.length===4&&l.dims[0]===h&&l.dims[1]!==t.kvNumHeads&&l.dims[2]===t.kvNumHeads&&l.dims[3]===v)throw new Error("BSNH pastKey/pastValue is not supported");if(S&&T){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');b=l.dims[2]}else if(S||T)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let k=1;if(a&&a.dims.length>0){if(n.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(n.dims[2]%a.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');_=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==v)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(u)throw new Error('Expect "value" be none when "key" has packed kv format.');_=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==v)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');_=a.dims[2]}}else{if(n.dims.length!==3&&n.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(n.dims.length===5&&(n.dims[2]!==t.numHeads||n.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');k=3}let E=0,A=!1,C=t.kvNumHeads?v*t.kvNumHeads:g;if(u&&u.dims.length>0){if(u.dims.length!==3&&u.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==u.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(u.dims.length===3){if(_!==u.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');C=u.dims[2]}else{if(_!==u.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');C=u.dims[1]*u.dims[3],A=!0}}let O=e.length>4?e[5]:void 0;if(O){if(O.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let P=O.dims.reduce((B,N)=>B*N,1);if(P!==h)throw new Error(`seqlens_k must have batch_size (${h}) elements, got ${P}.`);for(let B=0;B<O.dims.length;B++)if(O.dims[B]!==1&&O.dims[B]!==h)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${h}), got dims[${B}] = ${O.dims[B]}.`)}return{batchSize:h,sequenceLength:f,pastSequenceLength:b,kvSequenceLength:_,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:g,vHiddenSize:C,headSize:v,vHeadSize:Math.floor(C/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:E,scale:t.scale,broadcastResPosBias:!1,passPastInKv:A,qkvFormat:k}},Sp=ke({perm:[0,2,1,3]}),sa=(e,t,n)=>{let a=t,u=n.kvNumHeads;return t.dims.length===3&&n.kvSequenceLength!==0&&(a=t.reshape([n.batchSize,n.kvSequenceLength,u,n.headSize]),a=e.compute(pt(a,Sp.perm),{inputs:[a],outputs:[-1]})[0]),a},Ip=(e,t,n,a)=>{let u=7,l=["type","type"],d=[e*t],c=e*t,h=[{type:12,data:c},{type:12,data:t},{type:12,data:e}],f=g=>{let _=U("seq_lens",n.dataType,n.dims),b=U("total_seq_lens",a.dataType,a.dims),x=Z("pos_ids",u,d),v=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${g.registerUniforms(v).declareVariables(_,b,x)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${b.getByOffset("0")});
    let is_subsequent_prompt = uniforms.sequence_length > 1 && uniforms.sequence_length != total_sequence_length;
    let is_first_prompt = !is_subsequent_prompt && uniforms.sequence_length == total_sequence_length;
    let batch_idx = global_idx / uniforms.sequence_length;
    let sequence_idx = i32(global_idx % uniforms.sequence_length);
    var pos_id: i32 = 0;
    let seqlen = ${_.getByOffset("batch_idx")};
    let total_seqlen = seqlen + 1;
    if (is_first_prompt) {
      if (sequence_idx < total_seqlen) {
        pos_id = sequence_idx;
      } else {
        pos_id = 1;
      }
      ${x.setByOffset("global_idx","pos_id")}
    } else if (is_subsequent_prompt) {
      let past_seqlen = total_seqlen - i32(uniforms.sequence_length);
      if (past_seqlen + sequence_idx < total_seqlen) {
        pos_id = past_seqlen + sequence_idx;
      } else {
        pos_id = 1;
      }
      ${x.setByOffset("global_idx","pos_id")}
    } else if (global_idx < uniforms.batch_size) {
      ${x.setByOffset("global_idx","seqlen")}
    };
  }
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:d,dataType:u}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:h}),getShaderSource:f}},Tp=(e,t)=>{var C;if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let n=kp(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((C=e.inputs[1])==null?void 0:C.dims.length)===5)throw new Error("Packed KV is not implemented");let a=e.inputs[0],u=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,l=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,d=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,c=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,h=e.inputs.length>4?e.inputs[5]:void 0,f=e.inputs.length>5?e.inputs[6]:void 0,g=n.kvNumHeads?n.kvNumHeads:n.numHeads,_=ke({axis:2,numOutputs:3,splitSizes:[n.numHeads*n.headSize,g*n.headSize,g*n.headSize]}),[b,x,v]=!u&&!l?e.compute(ia([a],_),{inputs:[a],outputs:[-1,-1,-1]}):[a,u,l],S,T;if(t.doRotary){let O=e.compute(Ip(n.batchSize,n.sequenceLength,h,f),{inputs:[h,f],outputs:[-1]})[0],P=e.inputs[7],B=e.inputs[8],N=ke({interleaved:t.rotaryInterleaved!==0,numHeads:n.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),W=[b,O,P,B],q=[-1];S=e.compute(as(W,N),{inputs:W,outputs:q})[0],W.splice(0,1,x);let ie=ke({interleaved:t.rotaryInterleaved!==0,numHeads:n.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});T=e.compute(as(W,ie),{inputs:W,outputs:q})[0]}let k=yi(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,t.doRotary?S:b,void 0,0),E=sa(e,t.doRotary?T:x,n),A=sa(e,v,n);pi(e,k,E,A,void 0,void 0,d,c,void 0,n,h,f)}}),ra,Ap,zp,Cp,v0=w(()=>{"use strict";re(),pe(),Jt(),fe(),ra=(e,t,n,a,u,l,d,c)=>{let h=Ue(l),f=h===1?"f32":`vec${h}f`,g=h===1?"vec2f":`mat2x${h}f`,_=u*d,b=64;_===1&&(b=256);let x=[u,d,l/h],v=[u,d,2],S=["rank","type","type"],T=[];T.push(...te(x,v));let k=E=>{let A=U("x",t.dataType,3,h),C=U("scale",n.dataType,n.dims),O=U("bias",a.dataType,a.dims),P=Z("output",1,3,2),B=[A,C,O,P];return`
  var<workgroup> workgroup_shared : array<${g}, ${b}>;
  const workgroup_size = ${b}u;
  ${E.declareVariables(...B)}
  ${E.mainStart(b)}
    let batch = workgroup_index / uniforms.x_shape[1];
    let channel = workgroup_index % uniforms.x_shape[1];
    let hight = uniforms.x_shape[2];
    // initialize workgroup memory
    var sum = ${f}(0);
    var squared_sum = ${f}(0);
    for (var h = local_idx; h < hight; h += workgroup_size) {
      let value = ${f}(${A.get("batch","channel","h")});
      sum += value;
      squared_sum += value * value;
    }
    workgroup_shared[local_idx] = ${g}(sum, squared_sum);
    workgroupBarrier();

    for (var currSize = workgroup_size >> 1;  currSize > 0; currSize = currSize >> 1) {
      if (local_idx < currSize) {
        workgroup_shared[local_idx] = workgroup_shared[local_idx] + workgroup_shared[local_idx + currSize];
      }
      workgroupBarrier();
    }
    if (local_idx == 0) {
      let sum_final = ${Zt("workgroup_shared[0][0]",h)} / f32(hight * ${h});
      let squared_sum_final = ${Zt("workgroup_shared[0][1]",h)} / f32(hight * ${h});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${c}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${h};${c};${b}`,inputDependencies:S},getRunData:()=>({outputs:[{dims:v,dataType:1}],dispatchGroup:{x:_},programUniforms:T}),getShaderSource:k},{inputs:[t,n,a],outputs:[-1]})[0]},Ap=(e,t,n)=>{let a=t[0].dims,u=a,l=2,d=a[0],c=a[1],h=L.sizeFromDimension(a,l),f=Ue(h),g=L.size(u)/f,_=ra(e,t[0],t[1],t[2],d,h,c,n.epsilon),b=[d,c,h/f],x=[d,c],v=["type","none"],S=T=>{let k=U("x",t[0].dataType,b.length,f),E=U("scale_shift",1,x.length,2),A=Z("output",t[0].dataType,b.length,f),C=[k,E,A];return`
  ${T.registerUniform("output_size","u32").declareVariables(...C)}
  ${T.mainStart()}
  ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${A.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${E.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${k.getByOffset("global_idx")} * ${A.type.value}(scale_shift.x) + ${A.type.value}(scale_shift.y);
      ${A.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${f}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:u,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},...te(b,x,b)]}),getShaderSource:S},{inputs:[t[0],_]})},zp=(e,t,n)=>{let a=t[0].dims,u=a,l=a[0],d=a[a.length-1],c=L.sizeFromDimension(a,1)/d,h=Ue(d),f=L.size(u)/h,g=[{type:12,data:c},{type:12,data:Math.floor(d/h)}],_=["type","type"],b=!1,x=[0,a.length-1];for(let k=0;k<a.length-2;k++)b=b||a[k+1]!==1,x.push(k+1);b=b&&a[a.length-1]!==1;let v=b?e.compute(pt(e.inputs[0],x),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:a.length},(k,E)=>a[x[E]])),S=ra(e,v,t[1],t[2],l,c,d,n.epsilon),T=k=>{let E=Ze(t[0].dataType),A=h===1?"vec2f":`mat${h}x2f`,C=B=>{let N=B===0?"x":"y",W=h===1?"f32":`vec${h}f`;switch(h){case 1:return`${E}(${W}(scale.${N}))`;case 2:return`vec2<${E}>(${W}(scale[0].${N}, scale[1].${N}))`;case 4:return`vec4<${E}>(${W}(scale[0].${N}, scale[1].${N}, scale[2].${N}, scale[3].${N}))`;default:throw new Error(`Not supported compoents ${h}`)}},O=U("input",t[0].dataType,t[0].dims,h),P=Z("output",t[0].dataType,u,h);return`
  @group(0) @binding(0) var<storage, read> input : array<${O.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${A}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${P.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${k.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${C(0)}, ${C(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${h}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:u,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:g}),getShaderSource:T},{inputs:[t[0],S]})},Cp=(e,t)=>{t.format==="NHWC"?zp(e,e.inputs,t):Ap(e,e.inputs,t)}}),Op,Mp,Rp,x0=w(()=>{"use strict";re(),pe(),fe(),Op=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},Mp=(e,t,n)=>{let a=t.simplified,u=e[0].dims,l=e[1],d=!a&&e[2],c=u,h=L.normalizeAxis(t.axis,u.length),f=L.sizeToDimension(u,h),g=L.sizeFromDimension(u,h),_=L.size(l.dims),b=d?L.size(d.dims):0;if(_!==g||d&&b!==g)throw new Error(`Size of X.shape()[axis:] == ${g}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${_} and bias size of ${b}`);let x=[];for(let O=0;O<u.length;++O)O<h?x.push(u[O]):x.push(1);let v=Ue(g),S=["type","type"],T=[{type:12,data:f},{type:1,data:g},{type:12,data:Math.floor(g/v)},{type:1,data:t.epsilon}];d&&S.push("type");let k=n>1,E=n>2,A=O=>{let P=Ze(e[0].dataType),B=[U("x",e[0].dataType,e[0].dims,v),U("scale",l.dataType,l.dims,v)];d&&B.push(U("bias",d.dataType,d.dims,v)),B.push(Z("output",e[0].dataType,c,v)),k&&B.push(Z("mean_data_output",1,x)),E&&B.push(Z("inv_std_output",1,x));let N=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${O.registerUniforms(N).declareVariables(...B)}
  ${O.mainStart()}
    ${O.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${$r("f32",v)};
    var mean_square_vector = ${$r("f32",v)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${Fn(P,v,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Zt("mean_vector",v)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Zt("mean_square_vector",v)} / uniforms.norm_size ${a?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${Fn(P,v,"x[j + offset]")};
      let f32scale = ${Fn(P,v,"scale[j]")};
      output[j + offset] = ${B[0].type.value}((f32input ${a?"":"- mean"}) * inv_std_dev * f32scale
        ${d?`+ ${Fn(P,v,"bias[j]")}`:""}
      );
    }

    ${k?"mean_data_output[global_idx] = mean":""};
    ${E?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},C=[{dims:c,dataType:e[0].dataType}];return k&&C.push({dims:x,dataType:1}),E&&C.push({dims:x,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${v};${n};${a}`,inputDependencies:S},getRunData:()=>({outputs:C,dispatchGroup:{x:Math.ceil(f/64)},programUniforms:T}),getShaderSource:A}},Rp=(e,t)=>{Op(e.inputs),e.compute(Mp(e.inputs,t,e.outputCount))}}),Pp,Dp,E0=w(()=>{"use strict";pe(),Dr(),Ur(),Pp=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},Dp=e=>{Pp(e.inputs);let t=Nn.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let n=t[t.length-1],a=e.inputs[0].dims[e.inputs[0].dims.length-1];if(n<8&&a<8)e.compute(Pr(e.inputs,{activation:""},t));else{let u=t[t.length-2],l=L.size(e.inputs[0].dims.slice(0,-2)),d=L.size(e.inputs[1].dims.slice(0,-2));if(l!==1&&u===1&&d===1){let c=e.inputs[0].reshape([1,l,a]),h=e.inputs[1].reshape([1,a,n]),f=[1,l,n],g=[c,h];e.compute(ts(g,{activation:""},t,f),{inputs:g})}else e.compute(ts(e.inputs,{activation:""},t))}}}),Bp,Lp,Np,Up,Fp,k0=w(()=>{"use strict";re(),pe(),Ne(),fe(),Bp=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let n=e[0],a=n.dims.length;if(n.dims[a-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let u=Math.floor((t.k+t.blockSize-1)/t.blockSize),l=t.blockSize/8*t.bits,d=e[1];if(!L.areEqual(d.dims,[t.n,u,l]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let c=e[2].dims;if(L.size(c)!==t.n*u)throw new Error("scales input size error.");if(e.length===4){let h=e[3].dims,f=t.n*(t.bits===8?u:Math.floor((u*t.bits+7)/8));if(L.size(h)!==f)throw new Error("zeroPoints input size error.")}},Lp=(e,t)=>{let n=e[0].dims,a=n.length,u=n[a-2],l=t.k,d=t.n,c=n.slice(0,a-2),h=L.size(c),f=e[1].dims[2]/4,g=e[0].dataType,_=Ue(t.k),b=Ue(f),x=Ue(d),v=c.concat([u,d]),S=u>1&&d/x%2===0?2:1,T=L.size(v)/x/S,k=64,E=[],A=[h,u,l/_],C=L.convertShape(e[1].dims).slice();C.splice(-1,1,f/b),E.push(...te(A)),E.push(...te(C)),E.push(...te(e[2].dims)),e.length===4&&E.push(...te(L.convertShape(e[3].dims)));let O=[h,u,d/x];E.push(...te(O));let P=B=>{let N=A.length,W=U("a",e[0].dataType,N,_),q=U("b",12,C.length,b),ie=U("scales",e[2].dataType,e[2].dims.length),X=[W,q,ie],ee=e.length===4?U("zero_points",12,e[3].dims.length):void 0;ee&&X.push(ee);let _e=O.length,ve=Z("output",e[0].dataType,_e,x),ue=Ze(e[0].dataType),me=(()=>{switch(_){case 1:return`array<${ue}, 8>`;case 2:return`mat4x2<${ue}>`;case 4:return`mat2x4<${ue}>`;default:throw new Error(`${_}-component is not supported.`)}})(),we=Math.floor(32/t.bits),ae=Math.floor(we/8),De=()=>{let se="";for(let V=0;V<ae;V++){let Re=V*t.bits*4,Fe=Re+t.bits;se+=`
          // reuse a data (pass ${V})
            var input_offset${V>0?V:""} = ${V===0?W.indicesToOffset(`${W.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${V>0?V:""}: ${me};
            for (var j${V>0?V:""}: u32 = 0; j${V>0?V:""} < ${8/_}; j${V>0?V:""}++) {
              a_data${V>0?V:""}[j${V>0?V:""}] = ${W.getByOffset(`input_offset${V>0?V:""}`)};
              input_offset${V>0?V:""}++;
            }
          `;for(let Pe=0;Pe<x*S;Pe++)se+=`
            b_value = ${b===1?`b${Pe}_data`:`b${Pe}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${V*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${Re}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${Fe}u) & b_mask);`}
            b_quantized_values = ${me}(${Array.from({length:4},(ft,lt)=>`${ue}(b_value_lower[${lt}]), ${ue}(b_value_upper[${lt}])`).join(", ")});
            b_dequantized_values = ${_===1?`${me}(${Array.from({length:8},(ft,lt)=>`(b_quantized_values[${lt}] - ${ee?`zero_point${Pe}`:"zero_point"}) * scale${Pe}`).join(", ")});`:`(b_quantized_values - ${me}(${Array(8).fill(`${ee?`zero_point${Pe}`:"zero_point"}`).join(",")})) * scale${Pe};`};
            workgroup_shared[local_id.x * ${S} + ${Math.floor(Pe/x)}]${x>1?`[${Pe%x}]`:""} += ${Array.from({length:8/_},(ft,lt)=>`${_===1?`a_data${V>0?V:""}[${lt}] * b_dequantized_values[${lt}]`:`dot(a_data${V>0?V:""}[${lt}], b_dequantized_values[${lt}])`}`).join(" + ")};
          `}return se},F=()=>{let se=`
            var col_index = col * ${x};
            ${ee?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${ue}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let V=0;V<x*S;V++)se+=`
            let scale${V} = ${ie.getByOffset("col_index * nBlocksPerCol + block")};
            ${ee?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${ee.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${V} = ${ue}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return se},ne=()=>{let se=`col_index = col * ${x};`;for(let V=0;V<x*S;V++)se+=`
            let b${V}_data = ${q.getByIndices(`${q.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return se+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${me};
            var b_dequantized_values: ${me};`,se};return`
        var<workgroup> workgroup_shared: array<${ve.type.value}, ${S*k}>;
        ${B.declareVariables(...X,ve)}
        ${B.mainStart([k,1,1])}
          let output_indices = ${ve.offsetToIndices(`(global_idx / ${k}) * ${S}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${k}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/_};
            ${F()}
            for (var word: u32 = 0; word < ${f}; word += ${b}) {
              ${ne()}
              for (var i: u32 = 0; i < ${b}; i++) {
                ${De()}
                word_offset += ${we/_};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${S}) {
            var output_value: ${ve.type.value} = ${ve.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${k}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${S};
            }
            ${ve.setByIndices(`${ve.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${_};${b};${x};${S};${k}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:v,dataType:g}],dispatchGroup:{x:T},programUniforms:E}),getShaderSource:P}},Np=(e,t)=>{let n=e[0].dims,a=n.length,u=n[a-2],l=t.k,d=t.n,c=n.slice(0,a-2),h=L.size(c),f=e[1].dims[2]/4,g=e[0].dataType,_=Ue(t.k),b=Ue(f),x=c.concat([u,d]),v=128,S=d%8===0?8:d%4===0?4:1,T=v/S,k=Math.floor(32/t.bits),E=T*b*k,A=E/_,C=E/t.blockSize,O=L.size(x)/S,P=[],B=[h,u,l/_],N=L.convertShape(e[1].dims).slice();N.splice(-1,1,f/b),P.push(...te(B)),P.push(...te(N)),P.push(...te(e[2].dims)),e.length===4&&P.push(...te(L.convertShape(e[3].dims)));let W=[h,u,d];P.push(...te(W));let q=ie=>{let X=B.length,ee=U("a",e[0].dataType,X,_),_e=U("b",12,N.length,b),ve=U("scales",e[2].dataType,e[2].dims.length),ue=[ee,_e,ve],me=e.length===4?U("zero_points",12,e[3].dims.length):void 0;me&&ue.push(me);let we=W.length,ae=Z("output",e[0].dataType,we),De=Ze(e[0].dataType),F=()=>{switch(_){case 1:return`
          let a_data0 = vec4<${De}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${De}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${De}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${De}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${_}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${ee.type.value}, ${A}>;
        var<workgroup> inter_results: array<array<${ae.type.value}, ${T}>, ${S}>;
        ${ie.declareVariables(...ue,ae)}
        ${ie.mainStart([T,S,1])}
          let output_indices = ${ae.offsetToIndices(`workgroup_index * ${S}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${C} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${A};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${A}; a_offset += ${v})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${ee.getByIndices(`${ee.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${ee.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${C} + local_id.x;
            ${me?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${me.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${De}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${De}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${ve.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${_e.getByIndices(`${_e.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/_};
            for (var i: u32 = 0; i < ${b}; i++) {
              let b_value = ${b===1?"b_data":"b_data[i]"};
              ${(()=>{let ne=Math.floor(k/8),se="";for(let V=0;V<ne;V++){let Re=V*t.bits*4,Fe=Re+t.bits;se+=`
              ${F()}
              {${t.bits===2?`
                let half_word = b_value >> ${V*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${Re}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${Fe}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${De}>(${Array.from({length:4},(Pe,ft)=>`${De}(b_value_lower[${ft}]), ${De}(b_value_upper[${ft}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${De}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(Pe,ft)=>`${`dot(a_data${ft}, b_dequantized_values[${ft}])`}`).join(" + ")};
              }
              word_offset += ${8/_};`}return se})()}
            }
            workgroupBarrier();
          }

          if (local_idx < ${S}) {
            var output_value: ${ae.type.value} = ${ae.type.value}(0);
            for (var b = 0u; b < ${T}; b++) {
              output_value += inter_results[local_idx][b];
            }
            if (col + local_idx < uniforms.output_shape[2])
            {
              ${ae.setByIndices(`${ae.type.indices}(batch, row, col + local_idx)`,"output_value")}
            }
          }
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${_};${b};${T};${S}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:x,dataType:g}],dispatchGroup:{x:O},programUniforms:P}),getShaderSource:q}},Up=(e,t)=>{Bp(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(Np(e.inputs,t)):e.compute(Lp(e.inputs,t))},Fp=e=>ke(e)}),Wp,jp,Vp,qp,Gp,Hp,Kp,Zp,Jp,S0=w(()=>{"use strict";re(),pe(),fe(),Wp=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},jp=(e,t,n)=>{let a="";for(let u=t-1;u>=0;--u)a+=`
            k = i32(${e.indicesGet("indices",u)}) - ${Y("uniforms.pads",u,n)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${Y("uniforms.x_shape",u,t)})) {
              break;
            }
            offset += k * i32(${Y("uniforms.x_strides",u,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${a}
            value = x[offset];
          }
      `},Vp=(e,t,n)=>{let a="";for(let u=t-1;u>=0;--u)a+=`
                k = i32(${e.indicesGet("indices",u)}) - ${Y("uniforms.pads",u,n)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${Y("uniforms.x_shape",u,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${Y("uniforms.x_shape",u,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${Y("uniforms.x_strides",u,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},qp=(e,t,n)=>{let a="";for(let u=t-1;u>=0;--u)a+=`
                k = i32(${e.indicesGet("indices",u)}) - ${Y("uniforms.pads",u,n)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${Y("uniforms.x_shape",u,t)})) {
                  k = i32(${Y("uniforms.x_shape",u,t)}) - 1;
                }
                offset += k * i32(${Y("uniforms.x_strides",u,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Gp=(e,t,n)=>{let a="";for(let u=t-1;u>=0;--u)a+=`
                k = i32(${e.indicesGet("indices",u)}) - ${Y("uniforms.pads",u,n)};
                if (k < 0)  {
                  k += i32(${Y("uniforms.x_shape",u,t)}]);
                }
                if (k >= i32(${Y("uniforms.x_shape",u,t)})) {
                  k -= i32(${Y("uniforms.x_shape",u,t)});
                }
                offset += k * i32(${Y("uniforms.x_strides",u,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Hp=(e,t,n)=>{switch(n.mode){case 0:return jp(e,t,n.pads.length);case 1:return Vp(e,t,n.pads.length);case 2:return qp(e,t,n.pads.length);case 3:return Gp(e,t,n.pads.length);default:throw new Error("Invalid mode")}},Kp=(e,t)=>{let n=L.padShape(e[0].dims.slice(),t.pads),a=e[0].dims,u=L.size(n),l=[{type:12,data:u},{type:6,data:t.pads}],d=e.length>=3&&e[2].data;t.mode===0&&l.push({type:d?e[2].dataType:1,data:t.value}),l.push(...te(e[0].dims,n));let c=["rank"],h=f=>{let g=Z("output",e[0].dataType,n.length),_=U("x",e[0].dataType,a.length),b=_.type.value,x=Hp(g,a.length,t),v=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&v.push({name:"constant_value",type:d?b:"f32"}),`
            ${f.registerUniforms(v).declareVariables(_,g)}
            ${f.mainStart()}
            ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${g.offsetToIndices("global_idx")};

            var value = ${b}(0);
            ${x}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${d}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(L.size(n)/64)},programUniforms:l}),getShaderSource:h}},Zp=(e,t)=>{if(e.length>1){let n=e[1].getBigInt64Array(),a=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,u=e[0].dims.length,l=new Int32Array(2*u).fill(0);if(e.length>=4){let c=e[3].getBigInt64Array();for(let h=0;h<c.length;h++)l[Number(c[h])]=Number(n[h]),l[Number(c[h])+u]=Number(n[h+c.length])}else n.forEach((c,h)=>l[Number(h)]=Number(c));let d=[];return l.forEach(c=>d.push(c)),{mode:t.mode,value:a,pads:d}}else return t},Jp=(e,t)=>{Wp(e.inputs);let n=Zp(e.inputs,t);e.compute(Kp(e.inputs,n),{inputs:[0]})}}),wi,aa,oa,ua,la,Xp,Yp,da,ca,Qp,eh,pa,th,nh,ha,ih,sh,rh,ah,I0=w(()=>{"use strict";qe(),re(),pe(),fe(),wi=e=>{if(ye.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},aa=(e,t,n)=>{let a=t.format==="NHWC",u=e.dims.slice();a&&u.splice(1,0,u.pop());let l=Object.hasOwnProperty.call(t,"dilations"),d=t.kernelShape.slice(),c=t.strides.slice(),h=l?t.dilations.slice():[],f=t.pads.slice();Ki.adjustPoolAttributes(n,u,d,c,h,f);let g=Ki.computePoolOutputShape(n,u,c,h,d,f,t.autoPad,t.ceilMode),_=Object.assign({},t);l?Object.assign(_,{kernelShape:d,strides:c,pads:f,dilations:h,cacheKey:t.cacheKey}):Object.assign(_,{kernelShape:d,strides:c,pads:f,cacheKey:t.cacheKey});let b=g.slice();return b.push(b.splice(1,1)[0]),[_,a?b:g]},oa=(e,t)=>{let n=t.format==="NHWC",a=L.size(e),u=L.size(t.kernelShape),l=[{type:12,data:a},{type:12,data:u}],d=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let c=t.kernelShape[t.kernelShape.length-1],h=t.strides[t.strides.length-1],f=t.pads[t.pads.length/2-1],g=t.pads[t.pads.length-1],_=!!(f+g);l.push({type:12,data:c},{type:12,data:h},{type:12,data:f},{type:12,data:g}),d.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let b=!1;if(t.kernelShape.length===2){let x=t.kernelShape[t.kernelShape.length-2],v=t.strides[t.strides.length-2],S=t.pads[t.pads.length/2-2],T=t.pads[t.pads.length-2];b=!!(S+T),l.push({type:12,data:x},{type:12,data:v},{type:12,data:S},{type:12,data:T}),d.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[l,d,!0,_,b]}else{if(n)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let c=L.computeStrides(t.kernelShape);l.push({type:12,data:c},{type:12,data:t.pads},{type:12,data:t.strides}),d.push({name:"kernelStrides",type:"u32",length:c.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let h=t.pads.reduce((f,g)=>f+g);return[l,d,!!h,!1,!1]}},ua=(e,t,n,a,u,l,d,c,h,f,g,_)=>{let b=u.format==="NHWC",x=t.type.value,v=Z("output",t.type.tensor,a);if(u.kernelShape.length<=2){let S="",T="",k="",E=n-(b?2:1);if(g?S=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${E}] = indices[${E}] * uniforms.sw - uniforms.pwStart + i;
                  if (xIndices[${E}] < 0 || xIndices[${E}]
                      >= uniforms.x_shape[${E}]) {
                    pad++;
                    continue;
                  }
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${l}
                }`:S=`
                for (var i: u32 = 0u; i < uniforms.kw; i++) {
                  xIndices[${E}] = indices[${E}] * uniforms.sw - uniforms.pwStart + i;
                  let x_val = x[${t.indicesToOffset("xIndices")}];
                  ${l}
                }`,u.kernelShape.length===2){let A=n-(b?3:2);_?T=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${A}] = indices[${A}] * uniforms.sh - uniforms.phStart + j;
                  if (xIndices[${A}] < 0 || xIndices[${A}] >= uniforms.x_shape[${A}]) {
                    pad += i32(uniforms.kw);
                    continue;
                  }
              `:T=`
                for (var j: u32 = 0u; j < uniforms.kh; j++) {
                  xIndices[${A}] = indices[${A}] * uniforms.sh - uniforms.phStart + j;
                `,k=`
              }
            `}return`
            ${e.registerUniforms(h).declareVariables(t,v)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

              let indices = ${v.offsetToIndices("global_idx")};
              var xIndices = ${v.offsetToIndices("global_idx")};

              var value = ${x}(${c});
              var pad = 0;
              ${T}
              ${S}
              ${k}
              ${d}

              output[global_idx] = value;
            }`}else{if(b)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let S=u.kernelShape.length,T=u.pads.length,k="";return f?k=`
                if (xIndices[j] >= uniforms.x_shape[j]) {
                  pad++;
                  isPad = true;
                  break;
                }
              }
              if (!isPad) {
                let x_val = x[${t.indicesToOffset("xIndices")}];
                ${l}
              }`:k=`
              }
              let x_val = x[${t.indicesToOffset("xIndices")}];
              ${l}
            `,`
            ${e.registerUniforms(h).declareVariables(t,v)}

            ${e.mainStart()}
              ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
              let indices = ${v.offsetToIndices("global_idx")};
              var xIndices = ${v.offsetToIndices("global_idx")};

              var offsets: array<u32, ${S}>;

              var value = ${x}(${c});
              var pad = 0;
              var isPad = false;

              for (var i: u32 = 0u; i < uniforms.kernelSize; i++) {
                var offset = i;
                for (var j = 0u; j < ${S-1}u; j++) {
                  offsets[j] = offset / ${Y("uniforms.kernelStrides","j",S)};
                  offset -= offsets[j] * ${Y("uniforms.kernelStrides","j",S)};
                }
                offsets[${S-1}] = offset;

                isPad = false;
                for (var j = ${n-S}u; j < ${n}u; j++) {
                  xIndices[j] = indices[j] * ${Y("uniforms.strides",`j - ${n-S}u`,S)}
                    + offsets[j - ${n-S}u] - ${Y("uniforms.pads","j - 2u",T)};
                  ${k}
              }
              ${d}

              output[global_idx] = value;
            }`}},la=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Xp=e=>`${la(e)};${e.countIncludePad}`,Yp=e=>`${la(e)};${e.storageOrder};${e.dilations}`,da=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),ca=(e,t,n,a)=>{let[u,l]=aa(t,a,n),d=U("x",t.dataType,t.dims.length),c=d.type.value,h="value += x_val;",f="";u.countIncludePad?f+=`value /= ${c}(uniforms.kernelSize);`:f+=`value /= ${c}(i32(uniforms.kernelSize) - pad);`;let[g,_,b,x,v]=oa(l,u);g.push(...te(t.dims,l));let S=["rank"];return{name:e,shaderCache:{hint:`${a.cacheKey};${b};${x};${v}`,inputDependencies:S},getRunData:()=>({outputs:[{dims:l,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(L.size(l)/64)},programUniforms:g}),getShaderSource:T=>ua(T,d,t.dims.length,l.length,u,h,f,0,_,b,x,v)}},Qp=e=>{let t=e.count_include_pad!==0,n=da(e);if(n.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let a={countIncludePad:t,...n,cacheKey:""};return{...a,cacheKey:Xp(a)}},eh=(e,t)=>{wi(e.inputs),e.compute(ca("AveragePool",e.inputs[0],!1,t))},pa={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},th=e=>{let t=e.format;return{format:t,...pa,cacheKey:t}},nh=(e,t)=>{wi(e.inputs),e.compute(ca("GlobalAveragePool",e.inputs[0],!0,t))},ha=(e,t,n,a)=>{let[u,l]=aa(t,a,n),d=`
      value = max(x_val, value);
    `,c="",h=U("x",t.dataType,t.dims.length),f=["rank"],[g,_,b,x,v]=oa(l,u);return g.push(...te(t.dims,l)),{name:e,shaderCache:{hint:`${a.cacheKey};${b};${x};${v}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:l,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(L.size(l)/64)},programUniforms:g}),getShaderSource:S=>ua(S,h,t.dims.length,l.length,u,d,c,t.dataType===10?-65504:-1e5,_,b,x,v)}},ih=(e,t)=>{wi(e.inputs),e.compute(ha("MaxPool",e.inputs[0],!1,t))},sh=e=>{let t=e.storage_order,n=e.dilations,a=da(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(a.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let u={storageOrder:t,dilations:n,...a,cacheKey:""};return{...u,cacheKey:Yp(u)}},rh=e=>{let t=e.format;return{format:t,...pa,cacheKey:t}},ah=(e,t)=>{wi(e.inputs),e.compute(ha("GlobalMaxPool",e.inputs[0],!0,t))}}),oh,uh,lh,dh,T0=w(()=>{"use strict";re(),pe(),Ne(),fe(),oh=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((n,a)=>n===e[2].dims[a]).reduce((n,a)=>n&&a,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((u,l)=>l===t.axis||u===e[0].dims[l]).reduce((u,l)=>u&&l,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let n=e[0].dims[t.axis],a=e[1].dims[t.axis];if(t.blockSize<Math.ceil(n/a)||t.blockSize>Math.ceil(n/(a-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},uh=(e,t)=>{let n=L.normalizeAxis(t.axis,e[0].dims.length),a=e[0].dataType,u=a===3,l=e[0].dims,d=e[1].dataType,c=L.size(l),h=a===3||a===2,f=h?[Math.ceil(L.size(e[0].dims)/4)]:e[0].dims,g=e[1].dims,_=e.length>2?e[2]:void 0,b=_?h?[Math.ceil(L.size(_.dims)/4)]:_.dims:void 0,x=g.length===0||g.length===1&&g[0]===1,v=x===!1&&g.length===1,S=Ue(c),T=x&&(!h||S===4),k=T?S:1,E=T&&!h?S:1,A=U("input",h?12:a,f.length,E),C=U("scale",d,g.length),O=_?U("zero_point",h?12:a,b.length):void 0,P=Z("output",d,l.length,k),B=[A,C];O&&B.push(O);let N=[f,g];_&&N.push(b);let W=[{type:12,data:c/k},{type:12,data:n},{type:12,data:t.blockSize},...te(...N,l)],q=ie=>{let X=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${ie.registerUniforms(X).declareVariables(...B,P)}
      ${ie.mainStart()}
          ${ie.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${P.offsetToIndices("global_idx")};

          // Set input x
          ${h?`
            let input = ${A.getByOffset("global_idx / 4")};
            let x_vec = ${u?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${k===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${A.getByOffset("global_idx")};`};

          // Set scale input
          ${x?`let scale_value= ${C.getByOffset("0")}`:v?`
            let scale_index = ${P.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${C.getByOffset("scale_index")};`:`
            var scale_indices: ${C.type.indices} = output_indices;
            let index = ${C.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${C.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${C.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${O?x?h?`
                let zero_point_input = ${O.getByOffset("0")};
                let zero_point_vec =  ${u?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${O.getByOffset("0")}`:v?h?`
                let zero_point_index = ${P.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${O.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${u?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${P.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${O.getByOffset("zero_point_index")};`:h?`
                let zero_point_offset = ${C.indicesToOffset("scale_indices")};
                let zero_point_input = ${O.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${u?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${O.getByIndices("scale_indices")};`:`let zero_point_value = ${h?u?"i32":"u32":A.type.value}(0);`};
      // Compute and write output
      ${P.setByOffset("global_idx",`${P.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:O?["rank","rank","rank"]:["rank","rank"]},getShaderSource:q,getRunData:()=>({outputs:[{dims:l,dataType:d}],dispatchGroup:{x:Math.ceil(c/k/64),y:1,z:1},programUniforms:W})}},lh=(e,t)=>{oh(e.inputs,t),e.compute(uh(e.inputs,t))},dh=e=>ke({axis:e.axis,blockSize:e.blockSize})}),ch,ph,hh,A0=w(()=>{"use strict";qe(),re(),fe(),ch=(e,t,n)=>{let a=e===t,u=e<t&&n<0,l=e>t&&n>0;if(a||u||l)throw new Error("Range these inputs' contents are invalid.")},ph=(e,t,n,a)=>{let u=Math.abs(Math.ceil((t-e)/n)),l=[u],d=u,c=[{type:12,data:d},{type:a,data:e},{type:a,data:n},...te(l)],h=f=>{let g=Z("output",a,l.length),_=g.type.value,b=[{name:"outputSize",type:"u32"},{name:"start",type:_},{name:"delta",type:_}];return`
        ${f.registerUniforms(b).declareVariables(g)}
        ${f.mainStart()}
        ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${_}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${a}`},getShaderSource:h,getRunData:()=>({outputs:[{dims:l,dataType:a}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c})}},hh=e=>{let t=0,n=0,a=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],n=e.inputs[1].getInt32Array()[0],a=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],n=e.inputs[1].getFloat32Array()[0],a=e.inputs[2].getFloat32Array()[0]),ye.webgpu.validateInputContent&&ch(t,n,a),e.compute(ph(t,n,a,e.inputs[0].dataType),{inputs:[]})}}),fh,mh,gh,_h,z0=w(()=>{"use strict";re(),pe(),Ne(),fe(),fh=(e,t,n,a)=>{if(e!=="none"&&a!=="i32"&&a!=="u32"&&a!=="f32")throw new Error(`Input ${a} is not supported with reduction ${e}.`);let u=`{
                var oldValue = 0;
                loop {
                  let newValueF32 =`,l=`;
                  let newValue = bitcast<i32>(newValueF32);
                  let res = atomicCompareExchangeWeak(&${t}, oldValue, newValue);
                  if res.exchanged {
                    break;
                  }
                  oldValue = res.old_value;
                }
              }`;switch(e){case"none":return`${t}=${n};`;case"add":return a==="i32"||a==="u32"?`atomicAdd(&${t}, bitcast<${a}>(${n}));`:`
              ${u}bitcast<${a}>(oldValue) + (${n})${l}`;case"max":return a==="i32"||a==="u32"?`atomicMax(&${t}, bitcast<${a}>(${n}));`:`
                ${u}max(bitcast<f32>(oldValue), (${n}))${l}`;case"min":return a==="i32"||a==="u32"?`atomicMin(&${t}, bitcast<${a}>(${n}));`:`${u}min(bitcast<${a}>(oldValue), (${n}))${l}`;case"mul":return`${u}(bitcast<${a}>(oldValue) * (${n}))${l}`;default:throw new Error(`Reduction ${e} is not supported.`)}},mh=(e,t)=>{let n=e[0].dims,a=e[1].dims,u=n,l=1,d=Math.ceil(L.sizeToDimension(a,a.length-1)/l),c=a[a.length-1],h=L.sizeFromDimension(n,c),f=[{type:12,data:d},{type:12,data:c},{type:12,data:h},...te(e[1].dims,e[2].dims,u)],g=_=>{let b=U("indices",e[1].dataType,e[1].dims.length),x=U("updates",e[2].dataType,e[2].dims.length,l),v=t.reduction!=="none"&&t.reduction!==""?gu("output",e[0].dataType,u.length):Z("output",e[0].dataType,u.length,l);return`
      ${_.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(b,x,v)}
      ${_.mainStart()}
        ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
  var data_offset = 0u;
  let indices_start = uniforms.last_index_dimension * global_idx;
  let indices_end = indices_start + uniforms.last_index_dimension;
  for (var i = indices_start; i < indices_end; i++) {
    var index = i32(indices[i].x);
    ${e[0].dims.length===1?`
    let element_count_dim = uniforms.output_strides;
    let dim_value = uniforms.output_shape;`:`
    let element_count_dim = uniforms.output_strides[i - indices_start];
    let dim_value = uniforms.output_shape[i - indices_start];`}
    if (index >= 0) {
      if (index >= i32(dim_value)) {
        index = i32(dim_value - 1);
      }
    } else {
      if (index < -i32(dim_value)) {
        index = 0;
      } else {
        index += i32(dim_value);
      }
    }
    data_offset += u32((u32(index) * element_count_dim));
  }

  for (var i = 0u; i < uniforms.num_updates_elements; i++) {
    let value = updates[uniforms.num_updates_elements * global_idx + i];
    ${fh(t.reduction,"output[data_offset + i]","value",v.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:f}),getShaderSource:g}},gh=e=>ke({reduction:e.reduction}),_h=(e,t)=>{e.compute(mh(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),yh,wh,bh,fa,$h,vh,xh,Eh,kh,Sh,Ih,Th,ma,Ah,zh,Ch,Oh,Mh,Rh,Ph,C0=w(()=>{"use strict";re(),pe(),Ne(),fe(),yh=(e,t)=>{if(e.every(n=>n>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},wh=(e,t,n)=>{t.every(u=>u>=0&&u<n||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let a=new Array(n).fill(1);return t.forEach((u,l)=>a[u]=e[l]),a},bh=(e,t,n,a,u,l)=>{let[d,c,h]=n>10?[1,2,3]:[-1,e.length>1?1:-1,-1],f=e[0].dims.length;if(d>0&&e.length>d&&e[d].dims.length>0)e[d].getFloat32Array().forEach(g=>l.push(g));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(c>0&&e.length>c&&e[c].dims.length===1&&e[c].dims[0]>0){if(e[c].getFloat32Array().forEach(g=>a.push(g)),a.length!==0&&a.length!==f&&n>=18&&a.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");yh(a,t),t.axes.length>0&&wh(a,t.axes,f).forEach((g,_)=>a[_]=g)}if(h>0&&e.length>h&&e[h].dims.length===1&&e[h].dims[0]>0&&(e[h].getBigInt64Array().forEach(g=>u.push(Number(g))),u.length!==0&&u.length!==f&&n>=18&&u.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(u.length!==0&&u.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof a<"u"&&typeof u<"u"&&a.length>0&&u.length>f)throw new Error("Resize requires only of scales or sizes to be specified")},fa=(e,t,n,a)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${a}(big / (${n}));
  let fract = ${a}(big % (${n})) / ${a}(${n});
  return whole + fract;
`,$h=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${fa("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${fa("xResized","lengthOriginal - 1","lengthResized - 1",t)}
                  }`;case"tf_crop_and_resize":return`if (lengthResized > 1) {
                    return ${t}(roiStart) * ${t}(lengthOriginal - 1) +
                        (${t}(xResized) * ${t}(roiEnd - roiStart) * ${t}(lengthOriginal - 1)) /
                        ${t}(lengthResized - 1);
                  } else {
                    return 0.5 * ${t}(roiStart + roiEnd) * ${t}(lengthOriginal - 1);
                  }`;case"half_pixel_symmetric":return`const outputWidth = ${t}xScale * ${t}(lengthResized);
                  const adjustment = ${t}(lengthResized) / outputWidth;
                  const center = ${t}(lengthOriginal) / 2;
                  const offset = center * (1 - adjustment);
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",vh=(e,t,n)=>`fn getNearestPixelFromOriginal(xOriginal: ${n}, isDownSample: bool) -> ${n} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",xh=(e,t,n)=>{let a=new Array(n).fill(0).concat(new Array(n).fill(1)),u=e.length===0?a:e.slice();return t.length>0?(t.forEach((l,d)=>{a[l]=u[d],a[d+n]=u[t.length+d]}),a):u},Eh=(e,t,n,a)=>{let u=[];if(n.length>0)if(a.length>0){if(e.forEach(l=>u.push(l)),Math.max(...a)>e.length)throw new Error("axes is out of bound");a.forEach((l,d)=>u[l]=n[d])}else n.forEach(l=>u.push(l));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");u=e.map((l,d)=>Math.round(l*t[d]))}return u},kh=(e,t,n)=>{let a=(()=>{switch(n.keepAspectRatioPolicy){case"not_larger":return n.axes.length>0?Math.min(...n.axes.map(l=>t[l]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return n.axes.length>0?Math.max(...n.axes.map(l=>t[l]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${n.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let u=e.slice();return n.axes.length>0?(n.axes.forEach(l=>t[l]=a),n.axes.forEach(l=>u[l]=Math.round(e[l]*t[l]))):(t.fill(a,0,t.length),u.forEach((l,d)=>u[d]=Math.round(l*t[d]))),u},Sh=(e,t,n,a,u)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${n.length}> {
      var original_indices: array<${e.type.value}, ${n.length}>;
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${Y("uniforms.scales","i",a)};
        var roi_low = ${Y("uniforms.roi","i",u)};
        var roi_hi = ${Y("uniforms.roi",`i + ${t.length}`,u)};
        if (scale == 1.0) {
          original_indices[i] = ${e.type.value}(output_index);
        } else {
          var input_shape_i = ${Y("uniforms.input_shape","i",t.length)};
          var output_shape_i = ${Y("uniforms.output_shape","i",n.length)};
          original_indices[i] = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                           input_shape_i, roi_low, roi_hi);
        }
      }
      return original_indices;
    }`,Ih=(e,t,n,a,u,l,d)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${a.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${Y("uniforms.scales","i",u)};
        if (scale == 1.0) {
          input_index = output_index;
        } else {
          var roi_low = ${Y("uniforms.roi","i",l)};
          var roi_hi = ${Y("uniforms.roi",`i + ${n.length}`,l)};
          var input_shape_i = ${Y("uniforms.input_shape","i",n.length)};
          var output_shape_i = ${Y("uniforms.output_shape","i",a.length)};
          var original_idx = getOriginalCoordinateFromResizedCoordinate(output_index, scale, output_shape_i,
                                                                        input_shape_i, roi_low, roi_hi);
          if (!${d} || (original_idx >= 0 && original_idx < ${t.type.value}(input_shape_i))) {
            if (original_idx < 0) {
              input_index = 0;
            } else if (original_idx > ${t.type.value}(input_shape_i - 1)) {
              input_index = input_shape_i - 1;
            } else {
              input_index = u32(getNearestPixelFromOriginal(original_idx, scale < 1));
            }
          } else {
            input_index = u32(original_idx);
          }
        }
        ${e.indicesSet("input_indices","i","input_index")}
      }
      return input_indices;
    }`,Th=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${Y("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,ma=(e,t,n,a)=>e.rank>a?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",n,"batch")};
`:"",Ah=(e,t,n,a,u)=>{let[l,d,c,h]=n.length===2?[-1,0,1,-1]:[0,2,3,1],f=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${f} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",d,`max(0, min(row, ${n[d]} - 1))`)};
      ${e.indicesSet("input_indices",c,`max(0, min(col, ${n[c]} - 1))`)};
      ${ma(e,h,l,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${f} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${f} = originalIndices[${d}];
      var col:${f} = originalIndices[${c}];
      ${a?`if (row < 0 || row > (${n[d]} - 1) || col < 0 || col > (${n[c]} - 1)) {
        return ${u};
      }`:""};
      row = max(0, min(row, ${n[d]} - 1));
      col = max(0, min(col, ${n[c]} - 1));
      var row1: u32 = u32(row);
      var col1: u32 = u32(col);
      var row2: u32 = u32(row + 1);
      var col2: u32 = u32(col + 1);
      var channel: u32 = ${n.length>2?`u32(originalIndices[${h}])`:"0"};
      var batch: u32 =  ${n.length>2?`u32(originalIndices[${l}])`:"0"};
      var x11: ${f} = getInputValue(batch, channel, row1, col1);
      var x12: ${f} = getInputValue(batch, channel, row1, col2);
      var x21: ${f} = getInputValue(batch, channel, row2, col1);
      var x22: ${f} = getInputValue(batch, channel, row2, col2);
      var dx1: ${f} = abs(row - ${f}(row1));
      var dx2: ${f} = abs(${f}(row2) - row);
      var dy1: ${f} = abs(col - ${f}(col1));
      var dy2: ${f} = abs(${f}(col2) - col);
      if (row1 == row2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (col1 == col2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      return (x11 * dx2 * dy2 + x12 * dx2 * dy1 + x21 * dx1 * dy2 + x22 * dx1 * dy1);
    }`},zh=(e,t,n,a,u,l,d,c,h,f)=>{let g=n.length===2,_=!0,[b,x]=g?[0,1]:_?[2,3]:[1,2],v=e.type.value,S=T=>{let k=T===b?"row":"col";return`
      fn ${k}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${v} {
        var output_index = ${t.indicesGet("output_indices",T)};
        var originalIdx: ${v} = getOriginalCoordinateFromResizedCoordinate(output_index, ${u[T]},
        ${a[T]}, ${n[T]}, ${l[T]}, ${l[T]} + ${n.length});
        var fractOriginalIdx: ${v} = originalIdx - floor(originalIdx);
        var coefs = getCubicInterpolationCoefs(fractOriginalIdx);

        if (${c} && (originalIdx < 0 || originalIdx > (${n[T]} - 1))) {
          return ${h};
        }
        var data: array<${v}, 4> = array<${v}, 4>(0.0, 0.0, 0.0, 0.0);
        for (var i: i32 = -1; i < 3; i++) {
          var ${k}: ${v} = originalIdx + ${v}(i);
          if (${k} < 0 || ${k} >= ${n[T]}) {
            ${f?`coefs[i + 1] = 0.0;
                        continue;`:c?`return ${h};`:`${k} = max(0, min(${k}, ${n[T]} - 1));`};
          }
        var input_indices_copy: ${e.type.indices} = input_indices;
          ${e.indicesSet("input_indices_copy",T,`u32(${k})`)};
          data[i + 1] = ${T===b?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${S(b)};
    ${S(x)};
  fn getCubicInterpolationCoefs(s: ${v}) -> array<${v}, 4> {
    var absS = abs(s);
    var coeffs: array<${v}, 4> = array<${v}, 4>(0.0, 0.0, 0.0, 0.0);
    var oneMinusAbsS: ${v} = 1.0 - absS;
    var twoMinusAbsS: ${v} = 2.0 - absS;
    var onePlusAbsS: ${v} = 1.0 + absS;
    coeffs[0] = ((${d} * onePlusAbsS - 5 * ${d}) * onePlusAbsS + 8 * ${d}) * onePlusAbsS - 4 * ${d};
    coeffs[1] = ((${d} + 2) * absS - (${d} + 3)) * absS * absS + 1;
    coeffs[2] = ((${d} + 2) * oneMinusAbsS - (${d} + 3)) * oneMinusAbsS * oneMinusAbsS + 1;
    coeffs[3] = ((${d} * twoMinusAbsS - 5 * ${d}) * twoMinusAbsS + 8 * ${d}) * twoMinusAbsS - 4 * ${d};
    return coeffs;
  }

  fn cubicInterpolation1D(x: array<${v}, 4>, coefs: array<${v}, 4>) -> ${v} {
    var coefsSum: ${v} = coefs[0] + coefs[1] + coefs[2] + coefs[3];
    return (x[0] * coefs[0] + x[1] * coefs[1]+ x[2] * coefs[2]+ x[3] * coefs[3]) / coefsSum;
  }

  fn bicubicInterpolation(output_indices: ${t.type.indices}) -> ${v} {
    var input_indices: ${e.type.indices} = output_indices;
    return colCubicInterpolation(input_indices, output_indices);
  }
    `},Ch=(e,t,n,a,u)=>{let[l,d,c,h,f]=n.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],g=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${g} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",d,`max(0, min(depth, ${n[d]} - 1))`)};
      ${e.indicesSet("input_indices",c,`max(0, min(height, ${n[c]} - 1))`)};
      ${e.indicesSet("input_indices",h,`max(0, min(width, ${n[h]} - 1))`)};
      ${ma(e,f,l,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${g} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${g} = originalIndices[${d}];
      var height:${g} = originalIndices[${c}];
      var width:${g} = originalIndices[${h}];
      ${a?`if (depth < 0 || depth > (${n[d]} - 1) || height < 0 || height > (${n[c]} - 1) || width < 0 || (width > ${n[h]} - 1)) {
      return ${u};
        }`:""};

    depth = max(0, min(depth, ${n[d]} - 1));
      height = max(0, min(height, ${n[c]} - 1));
      width = max(0, min(width, ${n[h]} - 1));
      var depth1: u32 = u32(depth);
      var height1: u32 = u32(height);
      var width1: u32 = u32(width);
      var depth2: u32 = u32(depth + 1);
      var height2: u32 = u32(height + 1);
      var width2: u32 = u32(width + 1);
      var channel: u32 = ${n.length>3?`u32(originalIndices[${f}])`:"0"};
      var batch: u32 =  ${n.length>3?`u32(originalIndices[${l}])`:"0"};

      var x111: ${g} = getInputValue(batch, channel, depth1, height1, width1);
      var x112: ${g} = getInputValue(batch, channel, depth1, height1, width2);
      var x121: ${g} = getInputValue(batch, channel, depth1, height2, width1);
      var x122: ${g} = getInputValue(batch, channel, depth1, height2, width2);
      var x211: ${g} = getInputValue(batch, channel, depth2, height1, width1);
      var x212: ${g} = getInputValue(batch, channel, depth2, height1, width2);
      var x221: ${g} = getInputValue(batch, channel, depth2, height2, width1);
      var x222: ${g} = getInputValue(batch, channel, depth2, height2, width2);
      var dx1: ${g} = abs(depth - ${g}(depth1));
      var dx2: ${g} = abs(${g}(depth2) - depth);
      var dy1: ${g} = abs(height - ${g}(height1));
      var dy2: ${g} = abs(${g}(height2) - height);
      var dz1: ${g} = abs(width - ${g}(width1));
      var dz2: ${g} = abs(${g}(width2) - width);
      if (depth1 == depth2) {
        dx1 = 0.5;
        dx2 = 0.5;
      }
      if (height1 == height2) {
        dy1 = 0.5;
        dy2 = 0.5;
      }
      if (width1 == width2) {
        dz1 = 0.5;
        dz2 = 0.5;
      }
      return (x111 * dx2 * dy2 * dz2 + x112 * dx2 * dy2 * dz1 + x121 * dx2 * dy1 *dz2 + x122 * dx2 * dy1 * dz1 +
              x211 * dx1 * dy2 * dz2 + x212 * dx1 * dy2 * dz1 + x221 * dx1 * dy1 *dz2 + x222 * dx1 * dy1 * dz1);
    }`},Oh=(e,t,n,a,u,l)=>{let d=e.dims,c=xh(l,t.axes,d.length),h=Eh(d,a,u,t.axes),f=a.slice();a.length===0&&(f=d.map((E,A)=>E===0?1:h[A]/E),t.keepAspectRatioPolicy!=="stretch"&&(h=kh(d,f,t)));let g=Z("output",e.dataType,h.length),_=U("input",e.dataType,d.length),b=L.size(h),x=d.length===h.length&&d.every((E,A)=>E===h[A]),v=t.coordinateTransformMode==="tf_crop_and_resize",S=t.extrapolationValue,T=_.type.value,k=E=>`
      ${x?"":`
      ${$h(t.coordinateTransformMode,T)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${Th(_,d)};
              ${vh(t.nearestMode,n,T)};
              ${Ih(_,g,d,h,f.length,c.length,v)};
              `;case"linear":return`
              ${Sh(g,d,h,f.length,c.length)};
              ${(()=>{if(d.length===2||d.length===4)return`${Ah(_,g,d,v,S)}`;if(d.length===3||d.length===5)return`${Ch(_,g,d,v,S)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(d.length===2||d.length===4)return`${zh(_,g,d,h,f,c,t.cubicCoeffA,v,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
            `;default:throw Error("Invalid resize mode")}})()};
      `}
      ${E.registerUniform("output_size","u32").registerUniform("scales","f32",f.length).registerUniform("roi","f32",c.length).declareVariables(_,g)}
      ${E.mainStart()}
        ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
        ${x?"output[global_idx] = input[global_idx];":`
        let output_indices = ${g.offsetToIndices("global_idx")};
        var input_indices: ${_.type.indices};
        ${(()=>{switch(t.mode){case"nearest":return`input_indices = calculateInputIndicesFromOutputIndices(output_indices);
                if (checkInputIndices(input_indices)) {
                  output[global_idx] = ${_.getByIndices("input_indices")};
                } else {
                  output[global_idx] = ${t.extrapolationValue};
                }`;case"linear":return`output[global_idx] = ${d.length===2||d.length===4?"bilinearInterpolation":"trilinearInterpolation"}(output_indices);`;case"cubic":return"output[global_idx] = bicubicInterpolation(output_indices);";default:throw Error(`Unsupported resize mode: ${t.mode}`)}})()};
`}
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${n}|${f.length>0?t.mode==="cubic"?f:f.length:""}|${u.length>0?u:""}|${c.length>0?c:""}|${x}|${t.mode==="nearest"?d.length:d}`,inputDependencies:["rank"]},getShaderSource:k,getRunData:()=>({outputs:[{dims:h,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(b/64)},programUniforms:[{type:12,data:b},{type:1,data:f},{type:1,data:c},...te(d,h)]})}},Mh=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},Rh=(e,t)=>{let n=[],a=[],u=[],l=Mh(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");bh(e.inputs,t,l,n,a,u),e.compute(Oh(e.inputs[0],t,l,n,a,u),{inputs:[0]})},Ph=e=>{let t=e.antialias,n=e.axes,a=e.coordinateTransformMode,u=e.cubicCoeffA,l=e.excludeOutside!==0,d=e.extrapolationValue,c=e.keepAspectRatioPolicy,h=e.mode,f=e.nearestMode===""?"simple":e.nearestMode;return ke({antialias:t,axes:n,coordinateTransformMode:a,cubicCoeffA:u,excludeOutside:l,extrapolationValue:d,keepAspectRatioPolicy:c,mode:h,nearestMode:f})}}),Dh,Bh,Lh,O0=w(()=>{"use strict";re(),pe(),fe(),Dh=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],n=e[1],a=e[2];if(t.dataType!==n.dataType||t.dataType!==a.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(n.dims.length!==3&&n.dims.length!==2)throw new Error("Skip must be 2D or 3D");let u=t.dims[t.dims.length-1],l=t.dims[t.dims.length-2];if(n.dims[n.dims.length-1]!==u)throw new Error("Skip must have the same hidden size as input");if(n.dims[n.dims.length-2]!==l)throw new Error("Skip must have the same sequence length as input");if(a.dims.length!==1)throw new Error("Gamma must be 1D");if(a.dims[a.dims.length-1]!==u)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let d=e[3];if(d.dims.length!==1)throw new Error("Beta must be 1D");if(d.dims[d.dims.length-1]!==u)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let d=e[4];if(d.dims.length!==1)throw new Error("Bias must be 1D");if(d.dims[d.dims.length-1]!==u)throw new Error("Bias must have the same hidden size as input")}},Bh=(e,t,n,a)=>{let u=t.simplified,l=e[0].dims,d=L.size(l),c=l,h=d,f=l.slice(-1)[0],g=a?l.slice(0,-1).concat(1):[],_=!u&&e.length>3,b=e.length>4,x=a&&n>1,v=a&&n>2,S=n>3,T=64,k=Ue(f),E=[{type:12,data:h},{type:12,data:k},{type:12,data:f},{type:1,data:t.epsilon}],A=O=>{let P=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],B=[U("x",e[0].dataType,e[0].dims,k),U("skip",e[1].dataType,e[1].dims,k),U("gamma",e[2].dataType,e[2].dims,k)];_&&B.push(U("beta",e[3].dataType,e[3].dims,k)),b&&B.push(U("bias",e[4].dataType,e[4].dims,k)),B.push(Z("output",e[0].dataType,c,k)),x&&B.push(Z("mean_output",1,g)),v&&B.push(Z("inv_std_output",1,g)),S&&B.push(Z("input_skip_bias_sum",e[0].dataType,c,k));let N=Ze(e[0].dataType),W=Ze(1,k);return`

      ${O.registerUniforms(P).declareVariables(...B)}
      var<workgroup> sum_shared : array<${W}, ${T}>;
      var<workgroup> sum_squared_shared : array<${W}, ${T}>;

      ${O.mainStart([T,1,1])}
        let ix = local_id.x;
        let iy = global_id.x / ${T};

        let hidden_size_vectorized: u32 = uniforms.hidden_size / uniforms.components;
        var stride = hidden_size_vectorized / ${T};
        let offset = ix * stride + iy * hidden_size_vectorized;
        let offset1d = stride * ix;
        if (ix == ${T-1}) {
          stride = hidden_size_vectorized - stride * ix;
        }
        for (var i: u32 = 0; i < stride; i++) {
          let skip_value = skip[offset + i];
          let bias_value = ${b?"bias[offset1d + i]":N+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${S?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${Fn(N,k,"value")};
          sum_shared[ix] += f32_value;
          sum_squared_shared[ix] += f32_value * f32_value;
        }
        workgroupBarrier();

        var reduce_size : u32 = ${T};
        for (var curr_size = reduce_size >> 1;  curr_size > 0; curr_size = reduce_size >> 1) {
          reduce_size = curr_size + (reduce_size & 1);
          if (ix < curr_size) {
            sum_shared[ix] += sum_shared[ix + reduce_size];
            sum_squared_shared[ix] += sum_squared_shared[ix + reduce_size];
          }
          workgroupBarrier();
        }

        let sum = sum_shared[0];
        let square_sum = sum_squared_shared[0];
        let mean = ${Zt("sum",k)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Zt("square_sum",k)} / f32(uniforms.hidden_size) ${u?"":"- mean * mean"} + uniforms.epsilon);
        ${x?"mean_output[global_idx] = mean;":""}
        ${v?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${u?"":`- ${N}(mean)`}) *
            ${N}(inv_std_dev) * gamma[offset1d + i]
            ${_?"+ beta[offset1d + i]":""};
        }
      }`},C=[{dims:c,dataType:e[0].dataType}];return n>1&&C.push({dims:g,dataType:1}),n>2&&C.push({dims:g,dataType:1}),n>3&&C.push({dims:l,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${k};${x};${v};${S}`,inputDependencies:e.map((O,P)=>"type")},getShaderSource:A,getRunData:()=>({outputs:C,dispatchGroup:{x:Math.ceil(h/f)},programUniforms:E})}},Lh=(e,t)=>{Dh(e.inputs);let n=[0];e.outputCount>1&&n.push(-3),e.outputCount>2&&n.push(-3),e.outputCount>3&&n.push(3),e.compute(Bh(e.inputs,t,e.outputCount,!1),{outputs:n})}}),Nh,bi,Uh,ga,Fh,Wh,jh,Vh,M0=w(()=>{"use strict";re(),pe(),Ne(),fe(),Nh=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((n,a)=>{if(e[a+1].dataType!==6&&e[a+1].dataType!==7)throw new Error(`Input ${a} must be an array of int32 or int64`)})},bi=(e,t)=>{let n=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(a=>n.push(Number(a)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(a=>n.push(Number(a)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return n},Uh=(e,t)=>{if(e.length>1){let n=bi(e,1),a=bi(e,2),u=bi(e,3);return u.length===0&&(u=[...Array(e[0].dims.length).keys()]),ke({starts:n,ends:a,axes:u})}else return t},ga=(e,t,n,a,u)=>{let l=e;return e<0&&(l+=n[a[t]]),u[t]<0?Math.max(0,Math.min(l,n[a[t]]-1)):Math.max(0,Math.min(l,n[a[t]]))},Fh=(e,t,n)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
          var input_indices: ${e.type.indices};
          var carry = 0u;
          for (var i = ${n.length-1}; i >= 0; i--) {
            let input_shape_i = ${Y("uniforms.input_shape","i",n.length)};
            let steps_i = ${Y("uniforms.steps","i",n.length)};
            let signs_i = ${Y("uniforms.signs","i",n.length)};
            let starts_i = ${Y("uniforms.starts","i",n.length)};
            var output_index = ${t.indicesGet("output_indices","i")};
            var input_index = output_index * steps_i + starts_i + carry;
            carry = input_index / input_shape_i;
            input_index = input_index % input_shape_i;
            if (signs_i < 0) {
              input_index = input_shape_i - input_index - 1u + starts_i;
            }
            ${e.indicesSet("input_indices","i","input_index")};
          }
          return input_indices;
      }`,Wh=(e,t)=>{let n=e[0].dims,a=L.size(n),u=t.axes.length>0?L.normalizeAxes(t.axes,n.length):[...Array(n.length).keys()],l=bi(e,4);l.forEach(k=>k!==0||(()=>{throw new Error("step cannot be 0")})),l.length===0&&(l=Array(u.length).fill(1));let d=t.starts.map((k,E)=>ga(k,E,n,u,l)),c=t.ends.map((k,E)=>ga(k,E,n,u,l));if(u.length!==d.length||u.length!==c.length)throw new Error("start, ends and axes should have the same number of elements");if(u.length!==n.length)for(let k=0;k<n.length;++k)u.includes(k)||(d.splice(k,0,0),c.splice(k,0,n[k]),l.splice(k,0,1));let h=l.map(k=>Math.sign(k));l.forEach((k,E,A)=>{if(k<0){let C=(c[E]-d[E])/k,O=d[E],P=O+C*l[E];d[E]=P,c[E]=O,A[E]=-k}});let f=n.slice(0);u.forEach((k,E)=>{f[k]=Math.ceil((c[k]-d[k])/l[k])});let g={dims:f,dataType:e[0].dataType},_=Z("output",e[0].dataType,f.length),b=U("input",e[0].dataType,e[0].dims.length),x=L.size(f),v=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:d.length},{name:"signs",type:"i32",length:h.length},{name:"steps",type:"u32",length:l.length}],S=[{type:12,data:x},{type:12,data:d},{type:6,data:h},{type:12,data:l},...te(e[0].dims,f)],T=k=>`
      ${k.registerUniforms(v).declareVariables(b,_)}
        ${Fh(b,_,n)}
        ${k.mainStart()}
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${_.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${_.setByOffset("global_idx",b.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${h.length}_${d.length}_${l.length}`,inputDependencies:["rank"]},getShaderSource:T,getRunData:()=>({outputs:[g],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:S})}},jh=(e,t)=>{Nh(e.inputs,t);let n=Uh(e.inputs,t);e.compute(Wh(e.inputs,n),{inputs:[0]})},Vh=e=>{let t=e.starts,n=e.ends,a=e.axes;return ke({starts:t,ends:n,axes:a})}}),qh,Gh,Hh,Kh,R0=w(()=>{"use strict";re(),pe(),Ne(),Jt(),fe(),qh=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Gh=(e,t)=>{let n=e.inputs[0],a=n.dims,u=L.size(a),l=a.length,d=L.normalizeAxis(t.axis,l),c=d<a.length-1,h,f=[];c?(f=Array.from({length:l},(B,N)=>N),f[d]=l-1,f[l-1]=d,h=e.compute(pt(n,f),{inputs:[n],outputs:[-1]})[0]):h=n;let g=h.dims,_=g[l-1],b=u/_,x=Ue(_),v=_/x,S=64;b===1&&(S=256);let T=(B,N)=>N===4?`max(max(${B}.x, ${B}.y), max(${B}.z, ${B}.w))`:N===2?`max(${B}.x, ${B}.y)`:N===3?`max(max(${B}.x, ${B}.y), ${B}.z)`:B,k=U("x",h.dataType,h.dims,x),E=Z("result",h.dataType,h.dims,x),A=k.type.value,C=Ze(h.dataType)==="f32"?`var threadMax = ${A}(-3.4028234663852886e+38f);`:`var threadMax = ${A}(-65504.0h);`,O=B=>`
      var<workgroup> rowMaxShared : ${A};
      var<workgroup> rowSumShared : ${A};
      var<workgroup> threadShared : array<${A}, ${S}>;

      fn getValue(row: i32, col: i32, row_stride: i32) -> ${A} {
        let index = row * row_stride + col;
        return x[index];
      }

      fn setValue(row: i32, col: i32, row_stride: i32, value: ${A}) {
        let index = row * row_stride + col;
        result[index] = value;
      }
      ${B.registerUniform("packedCols","i32").declareVariables(k,E)}
      ${B.mainStart(S)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${S};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${C}
        for (var col = lindex; col < cols; col += wg) {
          let value = getValue(row, col, row_stride);
          threadMax = max(threadMax, value);
        }
        if (lindex < cols) {
          threadShared[lindex] = threadMax;
        }
        workgroupBarrier();

        var reduceSize = min(cols, wg);
        for (var currSize = reduceSize >> 1;  currSize > 0; currSize = reduceSize >> 1) {
          reduceSize = currSize + (reduceSize & 1);
          if (lindex < currSize) {
            threadShared[lindex] = max(threadShared[lindex], threadShared[lindex + reduceSize]);
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowMaxShared = ${A}(${T("threadShared[0]",x)});
        }
        workgroupBarrier();

        // find the rows sum
        var threadSum = ${A}(0.0);
        for (var col = lindex; col < cols; col += wg) {
          let subExp = exp(getValue(row, col, row_stride) - rowMaxShared);
          threadSum += subExp;
        }
        threadShared[lindex] = threadSum;
        workgroupBarrier();

        for (var currSize = wg >> 1;  currSize > 0; currSize = currSize >> 1) {
          if (lindex < currSize) {
            threadShared[lindex] = threadShared[lindex] + threadShared[lindex + currSize];
          }
          workgroupBarrier();
        }
        if (lindex == 0) {
          rowSumShared = ${A}(${Zt("threadShared[0]",x)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${A}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,P=e.compute({name:"Softmax",shaderCache:{hint:`${x};${S}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:g,dataType:h.dataType}],dispatchGroup:{x:b},programUniforms:[{type:6,data:v}]}),getShaderSource:O},{inputs:[h],outputs:[c?-1:0]})[0];c&&e.compute(pt(P,f),{inputs:[P]})},Hh=(e,t)=>{qh(e.inputs),Gh(e,t)},Kh=e=>ke({axis:e.axis})}),_a,Zh,Jh,Xh,Yh,P0=w(()=>{"use strict";re(),pe(),fe(),_a=e=>Array.from(e.getBigInt64Array(),Number),Zh=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(_a(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},Jh=(e,t)=>{let n=[];for(let a=0;a<e.length;++a)n.push(e[a]*t[a]);return n},Xh=(e,t)=>{let n=e[0].dims,a=t??_a(e[1]),u=Jh(n,a),l=L.size(u),d=e[0].dataType,c=U("input",d,n.length),h=Z("output",d,u.length),f=g=>`
      const inputShape = ${c.indices(...n)};
      ${g.registerUniform("output_size","u32").declareVariables(c,h)}
      ${g.mainStart()}
      ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let output_indices = ${h.offsetToIndices("global_idx")};
      var input_indices: ${c.type.indices};
      for (var i = 0; i < ${n.length}; i++) {
        let input_dim_i = ${c.indicesGet("uniforms.input_shape","i")};
        let input_dim_value = ${h.indicesGet("output_indices","i")}  % input_dim_i;

        ${c.indicesSet("input_indices","i","input_dim_value")}
      }
      ${h.setByOffset("global_idx",c.getByIndices("input_indices"))}
    }`;return{name:"Tile",shaderCache:{hint:`${a}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:u,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:[{type:12,data:l},...te(e[0].dims,u)]}),getShaderSource:f}},Yh=e=>{Zh(e.inputs),e.compute(Xh(e.inputs),{inputs:[0]})}}),Qh,ef,tf,D0=w(()=>{"use strict";re(),pe(),fe(),Qh=(e,t,n,a,u)=>{let l=Z("output_data",u,n.length,4),d=U("a_data",t[1].dataType,t[1].dims.length,4),c=U("b_data",t[2].dataType,t[2].dims.length,4),h=U("c_data",t[0].dataType,t[0].dims.length,4),f,g=(_,b,x)=>`select(${b}, ${_}, ${x})`;if(!a)f=l.setByOffset("global_idx",g(d.getByOffset("global_idx"),c.getByOffset("global_idx"),h.getByOffset("global_idx")));else{let _=(b,x,v="")=>{let S=`a_data[index_a${x}][component_a${x}]`,T=`b_data[index_b${x}][component_b${x}]`,k=`bool(c_data[index_c${x}] & (0xffu << (component_c${x} * 8)))`;return`
            let output_indices${x} = ${l.offsetToIndices(`global_idx * 4u + ${x}u`)};
            let offset_a${x} = ${d.broadcastedIndicesToOffset(`output_indices${x}`,l)};
            let offset_b${x} = ${c.broadcastedIndicesToOffset(`output_indices${x}`,l)};
            let offset_c${x} = ${h.broadcastedIndicesToOffset(`output_indices${x}`,l)};
            let index_a${x} = offset_a${x} / 4u;
            let index_b${x} = offset_b${x} / 4u;
            let index_c${x} = offset_c${x} / 4u;
            let component_a${x} = offset_a${x} % 4u;
            let component_b${x} = offset_b${x} % 4u;
            let component_c${x} = offset_c${x} % 4u;
            ${b}[${x}] = ${v}(${g(S,T,k)});
          `};u===9?f=`
            var data = vec4<u32>(0);
            ${_("data",0,"u32")}
            ${_("data",1,"u32")}
            ${_("data",2,"u32")}
            ${_("data",3,"u32")}
            output_data[global_idx] = dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(data));`:f=`
            ${_("output_data[global_idx]",0)}
            ${_("output_data[global_idx]",1)}
            ${_("output_data[global_idx]",2)}
            ${_("output_data[global_idx]",3)}
          `}return`
        ${e.registerUniform("vec_size","u32").declareVariables(h,d,c,l)}
        ${e.mainStart()}
        ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
        ${f}
      }`},ef=e=>{let t=e[1].dims,n=e[2].dims,a=e[0].dims,u=e[1].dataType,l=!(L.areEqual(t,n)&&L.areEqual(n,a)),d=t,c=L.size(t);if(l){let f=Nn.calcShape(Nn.calcShape(t,n,!1),a,!1);if(!f)throw new Error("Can't perform where op on the given tensors");d=f,c=L.size(d)}let h=Math.ceil(c/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:f=>Qh(f,e,d,l,u),getRunData:()=>({outputs:[{dims:d,dataType:u}],dispatchGroup:{x:Math.ceil(c/64/4)},programUniforms:[{type:12,data:h},...te(a,t,n,d)]})}},tf=e=>{e.compute(ef(e.inputs))}}),nf,B0=w(()=>{"use strict";Jg(),Tr(),Xg(),Yg(),Qg(),e0(),t0(),a0(),u0(),l0(),d0(),c0(),p0(),h0(),f0(),m0(),g0(),_0(),y0(),w0(),b0(),$0(),v0(),x0(),E0(),k0(),fp(),S0(),I0(),T0(),A0(),z0(),kr(),C0(),Ep(),O0(),M0(),R0(),$p(),P0(),Jt(),Or(),D0(),nf=new Map([["Abs",[Al]],["Acos",[zl]],["Acosh",[Cl]],["Add",[wd]],["ArgMax",[fl,Ir]],["ArgMin",[hl,Ir]],["Asin",[Ol]],["Asinh",[Ml]],["Atan",[Rl]],["Atanh",[Pl]],["Attention",[bl]],["AveragePool",[eh,Qp]],["BatchNormalization",[El]],["BiasAdd",[Il]],["BiasSplitGelu",[gd]],["Cast",[Bl,Dl]],["Ceil",[Ul]],["Clip",[Nl]],["Concat",[Cd,Od]],["Conv",[qr,jr]],["ConvTranspose",[rc,nc]],["Cos",[Fl]],["Cosh",[Wl]],["CumSum",[oc,uc]],["DepthToSpace",[pc,hc]],["DequantizeLinear",[lh,dh]],["DFT",[bc,$c]],["Div",[bd]],["Einsum",[Ic,Tc]],["Elu",[jl,hi]],["Equal",[$d]],["Erf",[Vl]],["Exp",[ql]],["Expand",[Oc]],["FastGelu",[Rc]],["Floor",[Gl]],["FusedConv",[qr,jr]],["Gather",[Lc,Bc]],["GatherElements",[Zc,Kc]],["GatherBlockQuantized",[Vc,qc]],["GatherND",[Uc,Fc]],["Gelu",[Hl]],["Gemm",[Qc,Yc]],["GlobalAveragePool",[nh,th]],["GlobalMaxPool",[ah,rh]],["Greater",[kd]],["GreaterOrEqual",[Id]],["GridSample",[up,lp]],["GroupQueryAttention",[Tp]],["HardSigmoid",[td,ed]],["HardSwish",[nd]],["InstanceNormalization",[Cp]],["LayerNormalization",[Rp]],["LeakyRelu",[Kl,hi]],["Less",[Sd]],["LessOrEqual",[Td]],["Log",[dd]],["MatMul",[Dp]],["MatMulNBits",[Up,Fp]],["MaxPool",[ih,sh]],["Mul",[vd]],["MultiHeadAttention",[hp,cp]],["Neg",[Jl]],["Not",[Zl]],["Pad",[Jp]],["Pow",[xd]],["QuickGelu",[hd,hi]],["Range",[hh]],["Reciprocal",[Xl]],["ReduceMin",[ul]],["ReduceMean",[il]],["ReduceMax",[ol]],["ReduceSum",[dl]],["ReduceProd",[ll]],["ReduceL1",[sl]],["ReduceL2",[rl]],["ReduceLogSum",[pl]],["ReduceLogSumExp",[al]],["ReduceSumSquare",[cl]],["Relu",[Yl]],["Resize",[Rh,Ph]],["RotaryEmbedding",[xp]],["ScatterND",[_h,gh]],["Sigmoid",[Ql]],["Sin",[id]],["Sinh",[sd]],["Slice",[jh,Vh]],["SkipLayerNormalization",[Lh]],["Split",[wp,bp]],["Sqrt",[rd]],["Softmax",[Hh,Kh]],["Sub",[Ed]],["Tan",[ad]],["Tanh",[od]],["ThresholdedRelu",[ld,hi]],["Tile",[Yh]],["Transpose",[Eu,ku]],["Where",[tf]]])}),sf,L0=w(()=>{"use strict";qe(),Dt(),fe(),sf=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,n,a,u){Ae(e.programInfo.name);let l=this.backend.device,d=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let c=[];for(let f of t)c.push({binding:c.length,resource:{buffer:f.buffer}});for(let f of n)c.push({binding:c.length,resource:{buffer:f.buffer}});u&&c.push({binding:c.length,resource:u});let h=l.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:c,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let f={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:h,dispatchGroup:a};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(f)}d.setPipeline(e.computePipeline),d.setBindGroup(0,h),d.dispatchWorkgroups(...a),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),Le(e.programInfo.name)}dispose(){}build(e,t){Ae(e.name);let n=this.backend.device,a=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(f=>{n.features.has(f.feature)&&a.push(`enable ${f.extension};`)});let u=yu(t,this.backend.device.limits),l=e.getShaderSource(u),d=`${a.join(`
`)}
${u.additionalImplementations}
${l}`,c=n.createShaderModule({code:d,label:e.name});$e("verbose",()=>`[WebGPU] ${e.name} shader code: ${d}`);let h=n.createComputePipeline({compute:{module:c,entryPoint:"main"},layout:"auto",label:e.name});return Le(e.name),{programInfo:e,computePipeline:h,uniformVariablesInfo:u.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,n=typeof e=="number"?1:e.y||1,a=typeof e=="number"?1:e.z||1,u=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=u&&n<=u&&a<=u)return[t,n,a];let l=t*n*a,d=Math.ceil(Math.sqrt(l));if(d>u){if(d=Math.ceil(Math.cbrt(l)),d>u)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[d,d,d]}else return[d,d,1]}}}),rf={};I(rf,{WebGpuBackend:()=>lf});var af,of,uf,lf,N0=w(()=>{"use strict";qe(),re(),Dt(),iu(),Kg(),B0(),L0(),af=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let n=[];for(let a=0;a<e.length;++a){let u=e[a].dataType;switch(t[a]){case"none":{n.push("");break}case"type":{n.push(`${u}`);break}case"rank":{let l=e[a].dims.length;n.push(`${u};${l}`);break}case"dims":{let l=e[a].dims.join(",");n.push(`${u};${l}`);break}default:throw new Error(`unsupported input dependency: ${t[a]}`)}}return n.join("|")},of=(e,t,n)=>{var u,l;let a=e.name;return(u=e.shaderCache)!=null&&u.hint&&(a+="["+e.shaderCache.hint+"]"),a+=":"+n+`:${af(t,((l=e.shaderCache)==null?void 0:l.inputDependencies)??new Array(t.length).fill("dims"))}`,a},uf=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},lf=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let n=[],a={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:n},u=c=>t.features.has(c)&&n.push(c)&&!0;u("chromium-experimental-timestamp-query-inside-passes")||u("timestamp-query"),u("shader-f16"),u("subgroups"),this.device=await t.requestDevice(a);let l=t,d=t.info??(typeof l.requestAdapterInfo=="function"?await l.requestAdapterInfo():void 0);this.adapterInfo=new uf(d),this.gpuDataManager=fu(this),this.programManager=new sf(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,lr(e.logLevel,!!e.debug),this.device.onuncapturederror=c=>{c.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${c.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){var e;typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&((e=this.env)!=null&&e.webgpu)&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;Ae(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var a;let t=new BigUint64Array(e.getMappedRange()),n=this.pendingQueries.get(e);for(let u=0;u<t.length/2;u++){let l=n[u],d=l.kernelId,c=this.kernels.get(d),h=c.kernelType,f=c.kernelName,g=l.programName,_=l.inputTensorViews,b=l.outputTensorViews,x=t[u*2],v=t[u*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=x);let S=Number(x-this.queryTimeBase),T=Number(v-this.queryTimeBase);if(!Number.isSafeInteger(S)||!Number.isSafeInteger(T))throw new RangeError("incorrect timestamp range");if((a=this.env.webgpu.profiling)!=null&&a.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:_.map(k=>({dims:k.dims,dataType:Pt(k.dataType)})),outputsMetadata:b.map(k=>({dims:k.dims,dataType:Pt(k.dataType)})),kernelId:d,kernelType:h,kernelName:f,programName:g,startTime:S,endTime:T});else{let k="";_.forEach((A,C)=>{k+=`input[${C}]: [${A.dims}] | ${Pt(A.dataType)}, `});let E="";b.forEach((A,C)=>{E+=`output[${C}]: [${A.dims}] | ${Pt(A.dataType)}, `}),console.log(`[profiling] kernel "${d}|${h}|${f}|${g}" ${k}${E}start time: ${S} ns, execution time: ${T-S} ns`)}Mt("GPU",`${g}::${x}::${v}`)}e.unmap(),this.pendingQueries.delete(e)}),Le()}run(e,t,n,a,u,l){Ae(e.name);let d=[];for(let E=0;E<t.length;++E){let A=t[E].data;if(A===0)continue;let C=this.gpuDataManager.get(A);if(!C)throw new Error(`no GPU data for input: ${A}`);d.push(C)}let{outputs:c,dispatchGroup:h,programUniforms:f}=e.getRunData(t),g=n.length===0?c.map((E,A)=>A):n;if(g.length!==c.length)throw new Error(`Output size ${g.length} must be equal to ${c.length}.`);let _=[],b=[];for(let E=0;E<c.length;++E){if(!Number.isInteger(g[E])||g[E]<-3||g[E]>=l)throw new Error(`Invalid output index: ${g[E]}`);if(g[E]===-3)continue;let A=g[E]===-1,C=g[E]===-2,O=A||C?u(c[E].dataType,c[E].dims):a(g[E],c[E].dataType,c[E].dims);if(_.push(O),O.data===0)continue;let P=this.gpuDataManager.get(O.data);if(!P)throw new Error(`no GPU data for output: ${O.data}`);if(A&&this.temporaryData.push(P),C){let B=this.kernelPersistentData.get(this.currentKernelId);B||(B=[],this.kernelPersistentData.set(this.currentKernelId,B)),B.push(P)}b.push(P)}if(d.length!==t.length||b.length!==_.length){if(b.length===0)return Le(e.name),_;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let x;if(f){let E=0,A=[];f.forEach(B=>{let N=typeof B.data=="number"?[B.data]:B.data;if(N.length===0)return;let W=B.type===10?2:4,q,ie;B.type===10?(ie=N.length>4?16:N.length>2?8:N.length*W,q=N.length>4?16:W*N.length):(ie=N.length<=2?N.length*W:16,q=16),E=Math.ceil(E/ie)*ie,A.push(E);let X=B.type===10?8:4;E+=N.length>4?Math.ceil(N.length/X)*q:N.length*W});let C=16;E=Math.ceil(E/C)*C;let O=new ArrayBuffer(E);f.forEach((B,N)=>{let W=A[N],q=typeof B.data=="number"?[B.data]:B.data;if(B.type===6)new Int32Array(O,W,q.length).set(q);else if(B.type===12)new Uint32Array(O,W,q.length).set(q);else if(B.type===10)new Uint16Array(O,W,q.length).set(q);else if(B.type===1)new Float32Array(O,W,q.length).set(q);else throw new Error(`Unsupported uniform type: ${Pt(B.type)}`)});let P=this.gpuDataManager.create(E,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(P.buffer,0,O,0,E),this.gpuDataManager.release(P.id),x={offset:0,size:E,buffer:P.buffer}}let v=this.programManager.normalizeDispatchGroupSize(h),S=v[1]===1&&v[2]===1,T=of(e,t,S),k=this.programManager.getArtifact(T);if(k||(k=this.programManager.build(e,v),this.programManager.setArtifact(T,k),$e("info",()=>`[artifact] key: ${T}, programName: ${e.name}`)),f&&k.uniformVariablesInfo){if(f.length!==k.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${k.uniformVariablesInfo.length}, got ${f.length} in program "${k.programInfo.name}".`);for(let E=0;E<f.length;E++){let A=f[E],C=A.type,O=typeof A.data=="number"?1:A.data.length,[P,B]=k.uniformVariablesInfo[E];if(C!==P||O!==B)throw new Error(`Uniform variable ${E} mismatch: expect type ${P} with size ${B}, got type ${C} with size ${O} in program "${k.programInfo.name}".`)}}if($e("info",()=>`[ProgramManager] run "${e.name}" (key=${T}) with ${v[0]}x${v[1]}x${v[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let E={kernelId:this.currentKernelId,programName:k.programInfo.name,inputTensorViews:t,outputTensorViews:_};this.pendingKernels.push(E),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(E)}return this.programManager.run(k,d,b,v,x),Le(e.name),_}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,n,a){let u=nf.get(e);if(!u)throw new Error(`kernel not implemented: ${e}`);let l={kernelType:e,kernelName:a,kernelEntry:u[0],attributes:[u[1],n]};this.kernels.set(t,l)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let n of t)this.gpuDataManager.release(n.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,n){let a=this.kernels.get(e);if(!a)throw new Error(`kernel not created: ${e}`);let u=a.kernelType,l=a.kernelName,d=a.kernelEntry,c=a.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${u}] ${l}" is not allowed to be called recursively`);this.currentKernelId=e,c[0]&&(c[1]=c[0](c[1]),c[0]=void 0),$e("info",()=>`[WebGPU] Start to run kernel "[${u}] ${l}"...`);let h=this.env.debug;this.temporaryData=[];try{return h&&this.device.pushErrorScope("validation"),d(t,c[1]),0}catch(f){return n.push(Promise.resolve(`[WebGPU] Kernel "[${u}] ${l}" failed. ${f}`)),1}finally{h&&n.push(this.device.popErrorScope().then(f=>f?`GPU validation error for kernel "[${u}] ${l}": ${f.message}`:null));for(let f of this.temporaryData)this.gpuDataManager.release(f.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,n,a){let u=this.sessionExternalDataMapping.get(e);u||(u=new Map,this.sessionExternalDataMapping.set(e,u));let l=u.get(t),d=this.gpuDataManager.registerExternalBuffer(n,a,l);return u.set(t,[d,n]),d}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(n=>this.gpuDataManager.unregisterExternalBuffer(n[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,n){return async()=>{let a=await br(this,e,t);return dr(a.buffer,n)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){$e("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){$e("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){$e("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),n=e.length;this.pendingKernels=[];for(let a=0;a<n;a++){let u=this.getComputePassEncoder(),l=e[a];this.writeTimestamp(this.pendingDispatchNumber*2),u.setPipeline(l.computePipeline),u.setBindGroup(0,l.bindGroup),u.dispatchWorkgroups(...l.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[a]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),df={};I(df,{init:()=>pf});var os,cf,pf,U0=w(()=>{"use strict";re(),Dt(),pe(),Hg(),os=class Og{constructor(t,n,a,u){this.module=t,this.dataType=n,this.data=a,this.dims=u}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(L.size(t)!==L.size(this.dims))throw new Error("Invalid new shape");return new Og(this.module,this.dataType,this.data,t)}},cf=class{constructor(e,t,n){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo,this.deviceLimits=t.device.limits;let a=e.PTR_SIZE,u=n/e.PTR_SIZE,l=a===4?"i32":"i64";this.opKernelContext=Number(e.getValue(a*u++,l));let d=Number(e.getValue(a*u++,l));this.outputCount=Number(e.getValue(a*u++,l)),this.customDataOffset=Number(e.getValue(a*u++,"*")),this.customDataSize=Number(e.getValue(a*u++,l));let c=[];for(let h=0;h<d;h++){let f=Number(e.getValue(a*u++,l)),g=Number(e.getValue(a*u++,"*")),_=Number(e.getValue(a*u++,l)),b=[];for(let x=0;x<_;x++)b.push(Number(e.getValue(a*u++,l)));c.push(new os(e,f,g,b))}this.inputs=c}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var d;let n=((d=t==null?void 0:t.inputs)==null?void 0:d.map(c=>typeof c=="number"?this.inputs[c]:c))??this.inputs,a=(t==null?void 0:t.outputs)??[],u=(c,h,f)=>new os(this.module,h,this.output(c,f),f),l=(c,h)=>{let f=yn(c,h);if(!f)throw new Error(`Unsupported data type: ${c}`);let g=f>0?this.backend.gpuDataManager.create(f).id:0;return new os(this.module,c,g,h)};return this.backend.run(e,n,a,u,l,this.outputCount)}output(e,t){let n=this.module.stackSave();try{let a=this.module.PTR_SIZE,u=a===4?"i32":"i64",l=this.module.stackAlloc((1+t.length)*a);this.module.setValue(l,t.length,u);for(let d=0;d<t.length;d++)this.module.setValue(l+a*(d+1),t[d],u);return this.module._JsepOutput(this.opKernelContext,e,l)}catch(a){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${a}`)}finally{this.module.stackRestore(n)}}},pf=async(e,t,n,a)=>{let u=t.jsepInit;if(!u)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let l=(N0(),z(rf)).WebGpuBackend,d=new l;await d.initialize(n,a),u("webgpu",[d,c=>d.alloc(Number(c)),c=>d.free(c),(c,h,f,g=!1)=>{if(g)$e("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(c)}, dst=${Number(h)}, size=${Number(f)}`),d.memcpy(Number(c),Number(h));else{$e("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(c)}, gpuDataId=${Number(h)}, size=${Number(f)}`);let _=t.HEAPU8.subarray(Number(c>>>0),Number(c>>>0)+Number(f));d.upload(Number(h),_)}},async(c,h,f)=>{$e("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${c}, dataOffset=${h}, size=${f}`),await d.download(Number(c),()=>t.HEAPU8.subarray(Number(h)>>>0,Number(h+f)>>>0))},(c,h,f)=>d.createKernel(c,Number(h),f,t.UTF8ToString(t._JsepGetNodeName(Number(h)))),c=>d.releaseKernel(c),(c,h,f,g)=>{$e("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${f}, kernel=${c}, contextDataOffset=${h}`);let _=new cf(t,d,Number(h));return d.computeKernel(Number(c),_,g)},()=>d.captureBegin(),()=>d.captureEnd(),()=>d.replay()])}else{let l=new du(n);u("webnn",[l,()=>l.reserveTensorId(),d=>l.releaseTensorId(d),async(d,c,h,f,g)=>l.ensureTensor(d,c,h,f,g),(d,c)=>{l.uploadTensor(d,c)},async(d,c)=>l.downloadTensor(d,c),(d,c)=>l.registerMLContext(d,c),!!n.trace])}}}),hf,ya,wa,Yt,ff,ba,us,$a,va,$i,mf,kn,gf,_f,xa,Ea,ka,Sa,yf=w(()=>{"use strict";qe(),Vg(),qg(),re(),mn(),sr(),ur(),hf=(e,t)=>{Ie()._OrtInit(e,t)!==0&&xe("Can't initialize onnxruntime.")},ya=async e=>{hf(e.wasm.numThreads,Gi(e.logLevel))},wa=async(e,t)=>{var a,u;(u=(a=Ie()).asyncInit)==null||u.call(a);let n=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(n){if(typeof n.limits!="object"||typeof n.features!="object"||typeof n.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let l=e.webgpu.powerPreference;if(l!==void 0&&l!=="low-power"&&l!=="high-performance")throw new Error(`Invalid powerPreference setting: "${l}"`);let d=e.webgpu.forceFallbackAdapter;if(d!==void 0&&typeof d!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${d}"`);if(n=await navigator.gpu.requestAdapter({powerPreference:l,forceFallbackAdapter:d}),!n)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let l=(U0(),z(df)).init;t==="webgpu"&&await l("webgpu",Ie(),e,n),t==="webnn"&&await l("webnn",Ie(),e)}},Yt=new Map,ff=e=>{let t=Ie(),n=t.stackSave();try{let a=t.PTR_SIZE,u=t.stackAlloc(2*a);t._OrtGetInputOutputCount(e,u,u+a)!==0&&xe("Can't get session input/output count.");let l=a===4?"i32":"i64";return[Number(t.getValue(u,l)),Number(t.getValue(u+a,l))]}finally{t.stackRestore(n)}},ba=(e,t)=>{let n=Ie(),a=n.stackSave(),u=0;try{let l=n.PTR_SIZE,d=n.stackAlloc(2*l);n._OrtGetInputOutputMetadata(e,t,d,d+l)!==0&&xe("Can't get session input/output metadata.");let c=Number(n.getValue(d,"*"));u=Number(n.getValue(d+l,"*"));let h=n.HEAP32[u/4];if(h===0)return[c,0];let f=n.HEAPU32[u/4+1],g=[];for(let _=0;_<f;_++){let b=Number(n.getValue(u+8+_*l,"*"));g.push(b!==0?n.UTF8ToString(b):Number(n.getValue(u+8+(_+f)*l,"*")))}return[c,h,g]}finally{n.stackRestore(a),u!==0&&n._OrtFree(u)}},us=e=>{let t=Ie(),n=t._malloc(e.byteLength);if(n===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,n),[n,e.byteLength]},$a=async(e,t)=>{var _,b,x,v;let n,a,u=Ie();Array.isArray(e)?[n,a]=e:e.buffer===u.HEAPU8.buffer?[n,a]=[e.byteOffset,e.byteLength]:[n,a]=us(e);let l=0,d=0,c=0,h=[],f=[],g=[];try{if([d,h]=await Ho(t),(t==null?void 0:t.externalData)&&u.mountExternalData){let N=[];for(let W of t.externalData){let q=typeof W=="string"?W:W.path,ie=typeof W=="string"?W:W.data;N.push(Hi(ie).then(X=>{u.mountExternalData(q,X)}))}await Promise.all(N)}for(let N of(t==null?void 0:t.executionProviders)??[])if((typeof N=="string"?N:N.name)==="webnn"){if(u.shouldTransferToMLTensor=!1,typeof N!="string"){let W=N,q=W==null?void 0:W.context,ie=W==null?void 0:W.gpuDevice,X=W==null?void 0:W.deviceType,ee=W==null?void 0:W.powerPreference;q?u.currentContext=q:ie?u.currentContext=await u.webnnCreateMLContext(ie):u.currentContext=await u.webnnCreateMLContext({deviceType:X,powerPreference:ee})}else u.currentContext=await u.webnnCreateMLContext();break}l=await u._OrtCreateSession(n,a,d),(_=u.webgpuOnCreateSession)==null||_.call(u,l),l===0&&xe("Can't create a session."),(b=u.jsepOnCreateSession)==null||b.call(u),u.currentContext&&(u.webnnRegisterMLContext(l,u.currentContext),u.currentContext=void 0,u.shouldTransferToMLTensor=!0);let[S,T]=ff(l),k=!!(t!=null&&t.enableGraphCapture),E=[],A=[],C=[],O=[],P=[];for(let N=0;N<S;N++){let[W,q,ie]=ba(l,N);W===0&&xe("Can't get an input name."),f.push(W);let X=u.UTF8ToString(W);E.push(X),C.push(q===0?{name:X,isTensor:!1}:{name:X,isTensor:!0,type:Pt(q),shape:ie})}for(let N=0;N<T;N++){let[W,q,ie]=ba(l,N+S);W===0&&xe("Can't get an output name."),g.push(W);let X=u.UTF8ToString(W);A.push(X),O.push(q===0?{name:X,isTensor:!1}:{name:X,isTensor:!0,type:Pt(q),shape:ie});{if(k&&(t==null?void 0:t.preferredOutputLocation)===void 0){P.push("gpu-buffer");continue}let ee=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((x=t==null?void 0:t.preferredOutputLocation)==null?void 0:x[X])??"cpu",_e=u.webnnIsGraphOutput;if(ee==="cpu"&&_e&&_e(l,X)){P.push("ml-tensor-cpu-output");continue}if(ee!=="cpu"&&ee!=="cpu-pinned"&&ee!=="gpu-buffer"&&ee!=="ml-tensor")throw new Error(`Not supported preferred output location: ${ee}.`);if(k&&ee!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${ee}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);P.push(ee)}}let B=null;return P.some(N=>N==="gpu-buffer"||N==="ml-tensor"||N==="ml-tensor-cpu-output")&&(c=u._OrtCreateBinding(l),c===0&&xe("Can't create IO binding."),B={handle:c,outputPreferredLocations:P,outputPreferredLocationsEncoded:P.map(N=>N==="ml-tensor-cpu-output"?"ml-tensor":N).map(N=>or(N))}),Yt.set(l,[l,f,g,B,k,!1]),[l,E,A,C,O]}catch(S){throw f.forEach(T=>u._OrtFree(T)),g.forEach(T=>u._OrtFree(T)),c!==0&&u._OrtReleaseBinding(c)!==0&&xe("Can't release IO binding."),l!==0&&u._OrtReleaseSession(l)!==0&&xe("Can't release session."),S}finally{u._free(n),d!==0&&u._OrtReleaseSessionOptions(d)!==0&&xe("Can't release session options."),h.forEach(S=>u._free(S)),(v=u.unmountExternalData)==null||v.call(u)}},va=e=>{var h,f,g;let t=Ie(),n=Yt.get(e);if(!n)throw new Error(`cannot release session. invalid session id: ${e}`);let[a,u,l,d,c]=n;d&&(c&&t._OrtClearBoundOutputs(d.handle)!==0&&xe("Can't clear bound outputs."),t._OrtReleaseBinding(d.handle)!==0&&xe("Can't release IO binding.")),(h=t.jsepOnReleaseSession)==null||h.call(t,e),(f=t.webnnOnReleaseSession)==null||f.call(t,e),(g=t.webgpuOnReleaseSession)==null||g.call(t,e),u.forEach(_=>t._OrtFree(_)),l.forEach(_=>t._OrtFree(_)),t._OrtReleaseSession(a)!==0&&xe("Can't release session."),Yt.delete(e)},$i=new Map,mf=1,kn=new Map,gf=e=>{let t=Ie(),n=t._malloc(e.byteLength);if(n===0)throw new Error(`Can't create a LoRA adapter. failed to allocate a buffer of size ${e.byteLength}.`);try{t.HEAPU8.set(e,n);let a=t._OrtCreateLoraAdapter(n,e.byteLength);a===0&&xe("Can't create a LoRA adapter.");let u=mf++;return $i.set(u,a),u}finally{t._free(n)}},_f=e=>{let t=Ie(),n=$i.get(e);if(n===void 0)throw new Error(`cannot release LoRA adapter. invalid adapter id: ${e}`);if(kn.has(e))throw new Error(`cannot release LoRA adapter. the adapter is used by a run in progress. adapter id: ${e}`);t._OrtReleaseLoraAdapter(n)!==0&&xe("Can't release LoRA adapter."),$i.delete(e)},xa=async(e,t,n,a,u,l,d=!1)=>{if(!e){t.push(0);return}let c=Ie(),h=c.PTR_SIZE,f=e[0],g=e[1],_=e[3],b=_,x,v;if(f==="string"&&(_==="gpu-buffer"||_==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(d&&_!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${l} when enableGraphCapture is true.`);if(_==="gpu-buffer"){let k=e[2].gpuBuffer;v=yn(_n(f),g);{let E=c.jsepRegisterBuffer;if(!E)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');x=E(a,l,k,v)}}else if(_==="ml-tensor"){let k=e[2].mlTensor;v=yn(_n(f),g);let E=c.webnnRegisterMLTensor;if(!E)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');x=E(a,k,_n(f),g)}else{let k=e[2];if(Array.isArray(k)){v=h*k.length,x=c._malloc(v),n.push(x);for(let E=0;E<k.length;E++){if(typeof k[E]!="string")throw new TypeError(`tensor data at index ${E} is not a string`);c.setValue(x+E*h,yt(k[E],n),"*")}}else{let E=c.webnnIsGraphInput,A=c.webnnIsGraphOutput;if(f!=="string"&&E&&A){let C=c.UTF8ToString(u);if(E(a,C)||A(a,C)){let O=_n(f);v=yn(O,g),b="ml-tensor";let P=c.webnnCreateTemporaryTensor,B=c.webnnUploadTensor;if(!P||!B)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let N=await P(a,O,g);B(N,new Uint8Array(k.buffer,k.byteOffset,k.byteLength)),x=N}else v=k.byteLength,x=c._malloc(v),n.push(x),c.HEAPU8.set(new Uint8Array(k.buffer,k.byteOffset,v),x)}else v=k.byteLength,x=c._malloc(v),n.push(x),c.HEAPU8.set(new Uint8Array(k.buffer,k.byteOffset,v),x)}}let S=c.stackSave(),T=c.stackAlloc(4*g.length);try{g.forEach((E,A)=>c.setValue(T+A*h,E,h===4?"i32":"i64"));let k=c._OrtCreateTensor(_n(f),x,v,T,g.length,or(b));k===0&&xe(`Can't create tensor for input/output. session=${a}, index=${l}.`),t.push(k)}finally{c.stackRestore(S)}},Ea=async(e,t,n,a,u,l,d=[])=>{var _e,ve,ue,me;let c=Ie(),h=c.PTR_SIZE,f=Yt.get(e);if(!f)throw new Error(`cannot run inference. invalid session id: ${e}`);let g=f[0],_=f[1],b=f[2],x=f[3],v=f[4],S=f[5],T=[];if(d.length>0){if(x)throw new Error("LoRA adapters are not supported for a session that uses IO binding, e.g. when an output is preferred to be on GPU, or when the WebNN execution provider produces an output.");for(let we of d){let ae=$i.get(we);if(ae===void 0)throw new Error(`cannot run inference. invalid LoRA adapter id: ${we}`);T.push(ae)}}let k=t.length,E=a.length,A=0,C=[],O=[],P=[],B=[],N=[],W=c.stackSave(),q=c.stackAlloc(k*h),ie=c.stackAlloc(k*h),X=c.stackAlloc(E*h),ee=c.stackAlloc(E*h);try{for(let F of d)kn.set(F,(kn.get(F)??0)+1);[A,C]=Wo(l,T),tt("wasm prepareInputOutputTensor");for(let F=0;F<k;F++)await xa(n[F],O,B,e,_[t[F]],t[F],v);for(let F=0;F<E;F++)await xa(u[F],P,B,e,b[a[F]],k+a[F],v);rt("wasm prepareInputOutputTensor");for(let F=0;F<k;F++)c.setValue(q+F*h,O[F],"*"),c.setValue(ie+F*h,_[t[F]],"*");for(let F=0;F<E;F++)c.setValue(X+F*h,P[F],"*"),c.setValue(ee+F*h,b[a[F]],"*");if(x&&!S){let{handle:F,outputPreferredLocations:ne,outputPreferredLocationsEncoded:se}=x;if(_.length!==k)throw new Error(`input count from feeds (${k}) is expected to be always equal to model's input count (${_.length}).`);tt("wasm bindInputsOutputs");for(let V=0;V<k;V++){let Re=t[V];await c._OrtBindInput(F,_[Re],O[V])!==0&&xe(`Can't bind input[${V}] for session=${e}.`)}for(let V=0;V<E;V++){let Re=a[V];(_e=u[V])!=null&&_e[3]?(N.push(P[V]),c._OrtBindOutput(F,b[Re],P[V],0)!==0&&xe(`Can't bind pre-allocated output[${V}] for session=${e}.`)):c._OrtBindOutput(F,b[Re],0,se[Re])!==0&&xe(`Can't bind output[${V}] to ${ne[V]} for session=${e}.`)}rt("wasm bindInputsOutputs"),Yt.set(e,[g,_,b,x,v,!0])}(ve=c.jsepOnRunStart)==null||ve.call(c,g),(ue=c.webnnOnRunStart)==null||ue.call(c,g);let we;x?we=await c._OrtRunWithBinding(g,x.handle,E,X,A):we=await c._OrtRun(g,ie,q,k,ee,E,X,A),we!==0&&xe("failed to call OrtRun().");let ae=[],De=[];tt("wasm ProcessOutputTensor");for(let F=0;F<E;F++){let ne=Number(c.getValue(X+F*h,"*"));if(ne===P[F]||N.includes(P[F])){ae.push(u[F]),ne!==P[F]&&c._OrtReleaseTensor(ne)!==0&&xe("Can't release tensor.");continue}let se=c.stackSave(),V=c.stackAlloc(4*h),Re=!1,Fe,Pe=0;try{c._OrtGetTensorData(ne,V,V+h,V+2*h,V+3*h)!==0&&xe(`Can't access output tensor data on index ${F}.`);let ft=h===4?"i32":"i64",lt=Number(c.getValue(V,ft));Pe=c.getValue(V+h,"*");let Df=c.getValue(V+h*2,"*"),G0=Number(c.getValue(V+h*3,ft)),Qt=[];for(let Qe=0;Qe<G0;Qe++)Qt.push(Number(c.getValue(Df+Qe*h,ft)));c._OrtFree(Df)!==0&&xe("Can't free memory for tensor dims.");let en=Qt.reduce((Qe,He)=>Qe*He,1);Fe=Pt(lt);let Ei=x==null?void 0:x.outputPreferredLocations[a[F]];if(Fe==="string"){if(Ei==="gpu-buffer"||Ei==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let Qe=[];for(let He=0;He<en;He++){let Nt=c.getValue(Pe+He*h,"*"),H0=c.getValue(Pe+(He+1)*h,"*"),K0=He===en-1?void 0:H0-Nt;Qe.push(c.UTF8ToString(Nt,K0))}ae.push([Fe,Qt,Qe,"cpu"])}else if(Ei==="gpu-buffer"&&en>0){let Qe=c.jsepGetBuffer;if(!Qe)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let He=Qe(Pe),Nt=yn(lt,en);if(Nt===void 0||!rr(Fe))throw new Error(`Unsupported data type: ${Fe}`);Re=!0,ae.push([Fe,Qt,{gpuBuffer:He,download:c.jsepCreateDownloader(He,Nt,Fe),dispose:()=>{c._OrtReleaseTensor(ne)!==0&&xe("Can't release tensor.")}},"gpu-buffer"])}else if(Ei==="ml-tensor"&&en>0){let Qe=c.webnnEnsureTensor,He=c.webnnIsGraphInputOutputTypeSupported;if(!Qe||!He)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(yn(lt,en)===void 0||!ar(Fe))throw new Error(`Unsupported data type: ${Fe}`);if(!He(e,Fe,!1))throw new Error(`preferredLocation "ml-tensor" for ${Fe} output is not supported by current WebNN Context.`);let Nt=await Qe(e,Pe,lt,Qt,!1);Re=!0,ae.push([Fe,Qt,{mlTensor:Nt,download:c.webnnCreateMLTensorDownloader(Pe,Fe),dispose:()=>{c.webnnReleaseTensorId(Pe),c._OrtReleaseTensor(ne)}},"ml-tensor"])}else if(Ei==="ml-tensor-cpu-output"&&en>0){let Qe=c.webnnCreateMLTensorDownloader(Pe,Fe)(),He=ae.length;Re=!0,De.push((async()=>{let Nt=[He,await Qe];return c.webnnReleaseTensorId(Pe),c._OrtReleaseTensor(ne),Nt})()),ae.push([Fe,Qt,[],"cpu"])}else{let Qe=qi(Fe),He=new Qe(en);new Uint8Array(He.buffer,He.byteOffset,He.byteLength).set(c.HEAPU8.subarray(Pe,Pe+He.byteLength)),ae.push([Fe,Qt,He,"cpu"])}}finally{c.stackRestore(se),Fe==="string"&&Pe&&c._free(Pe),Re||c._OrtReleaseTensor(ne)}}x&&!v&&(c._OrtClearBoundOutputs(x.handle)!==0&&xe("Can't clear bound outputs."),Yt.set(e,[g,_,b,x,v,!1]));for(let[F,ne]of await Promise.all(De))ae[F][2]=ne;return rt("wasm ProcessOutputTensor"),ae}finally{(me=c.webnnOnRunEnd)==null||me.call(c,g),c.stackRestore(W),O.forEach(we=>c._OrtReleaseTensor(we)),P.forEach(we=>c._OrtReleaseTensor(we)),B.forEach(we=>c._free(we)),A!==0&&c._OrtReleaseRunOptions(A),C.forEach(we=>c._free(we));for(let we of d){let ae=kn.get(we)-1;ae===0?kn.delete(we):kn.set(we,ae)}}},ka=e=>{let t=Ie(),n=Yt.get(e);if(!n)throw new Error("invalid session id");let a=n[0],u=t._OrtEndProfiling(a);u===0&&xe("Can't get an profile file name."),t._OrtFree(u)},Sa=e=>{let t=[];for(let n of e){let a=n[2];!Array.isArray(a)&&"buffer"in a&&t.push(a.buffer)}return t}}),zt,ut,Wn,vi,xi,ls,Ia,ds,Sn,In,wf,bf,$f,vf,xf,Ef,kf,Sf,If,Tf,Ta=w(()=>{"use strict";qe(),yf(),mn(),er(),ur(),zt=()=>!!ye.wasm.proxy&&typeof document<"u",Wn=!1,vi=!1,xi=!1,ds=new Map,Sn=(e,t)=>{let n=ds.get(e);n?n.push(t):ds.set(e,[t])},In=()=>{if(Wn||!vi||xi||!ut)throw new Error("worker not ready")},wf=e=>{switch(e.data.type){case"init-wasm":Wn=!1,e.data.err?(xi=!0,Ia[1](e.data.err)):(vi=!0,Ia[0]()),ls&&(URL.revokeObjectURL(ls),ls=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=ds.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},bf=async()=>{if(!vi){if(Wn)throw new Error("multiple calls to 'initWasm()' detected.");if(xi)throw new Error("previous call to 'initWasm()' failed.");if(Wn=!0,zt())return new Promise((e,t)=>{ut==null||ut.terminate(),Bo().then(([n,a])=>{try{ut=a,ut.onerror=l=>t(l),ut.onmessage=wf,Ia=[e,t];let u={type:"init-wasm",in:ye};if(!u.in.wasm.wasmPaths&&n){let l=hn();l&&(u.in.wasm.wasmPaths=l)}ut.postMessage(u),ls=n}catch(u){t(u)}},t)});try{await ir(ye.wasm),await ya(ye),vi=!0}catch(e){throw xi=!0,e}finally{Wn=!1}}},$f=async e=>{if(zt())return In(),new Promise((t,n)=>{Sn("init-ep",[t,n]);let a={type:"init-ep",in:{epName:e,env:ye}};ut.postMessage(a)});await wa(ye,e)},vf=async e=>zt()?(In(),new Promise((t,n)=>{Sn("copy-from",[t,n]);let a={type:"copy-from",in:{buffer:e}};ut.postMessage(a,[e.buffer])})):us(e),xf=async(e,t)=>{if(zt()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return In(),new Promise((n,a)=>{Sn("create",[n,a]);let u={type:"create",in:{model:e,options:{...t}}},l=[];e instanceof Uint8Array&&l.push(e.buffer),ut.postMessage(u,l)})}else return $a(e,t)},Ef=async e=>{if(zt())return In(),new Promise((t,n)=>{Sn("release",[t,n]);let a={type:"release",in:e};ut.postMessage(a)});va(e)},kf=async e=>{if(zt())throw new Error("LoRA adapter is not supported for proxy.");let t=typeof e=="string"?await Hi(e):e;return gf(t)},Sf=async e=>{if(zt())throw new Error("LoRA adapter is not supported for proxy.");_f(e)},If=async(e,t,n,a,u,l,d)=>{if(zt()){if(d.length>0)throw new Error("LoRA adapter is not supported for proxy.");if(n.some(c=>c[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(u.some(c=>c))throw new Error("pre-allocated output tensor is not supported for proxy.");return In(),new Promise((c,h)=>{Sn("run",[c,h]);let f=n,g={type:"run",in:{sessionId:e,inputIndices:t,inputs:f,outputIndices:a,options:l}};ut.postMessage(g,Sa(f))})}else return Ea(e,t,n,a,u,l,d)},Tf=async e=>{if(zt())return In(),new Promise((t,n)=>{Sn("end-profiling",[t,n]);let a={type:"end-profiling",in:e};ut.postMessage(a)});ka(e)}}),Aa,Af=w(()=>{"use strict";qe(),Ta(),Aa=class{async loadAdapter(e){Ae(),this.adapterId=await kf(e),Le()}async dispose(){return Sf(this.adapterId)}}}),za,zf,Cf,F0=w(()=>{"use strict";qe(),Af(),Ta(),re(),Bn(),ur(),za=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},zf=e=>{switch(e[3]){case"cpu":return new ct(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!rr(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:n,download:a,dispose:u}=e[2];return ct.fromGpuBuffer(n,{dataType:t,dims:e[1],download:a,dispose:u})}case"ml-tensor":{let t=e[0];if(!ar(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:n,download:a,dispose:u}=e[2];return ct.fromMLTensor(n,{dataType:t,dims:e[1],download:a,dispose:u})}default:throw new Error(`invalid data location: ${e[3]}`)}},Cf=class{async fetchModelAndCopyToWasmMemory(e){return vf(await Hi(e))}async loadModel(e,t){Ae();let n;typeof e=="string"?n=await this.fetchModelAndCopyToWasmMemory(e):n=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await xf(n,t),Le()}async dispose(){return Ef(this.sessionId)}async run(e,t,n,a=[]){Ae();let u=a.map(x=>{if(!(x instanceof Aa))throw new Error("LoRA adapter was not created by the WebAssembly backend.");return x.adapterId}),l=[],d=[];Object.entries(e).forEach(x=>{let v=x[0],S=x[1],T=this.inputNames.indexOf(v);if(T===-1)throw new Error(`invalid input '${v}'`);l.push(S),d.push(T)});let c=[],h=[];Object.entries(t).forEach(x=>{let v=x[0],S=x[1],T=this.outputNames.indexOf(v);if(T===-1)throw new Error(`invalid output '${v}'`);c.push(S),h.push(T)});let f=l.map((x,v)=>za(x,()=>`input "${this.inputNames[d[v]]}"`)),g=c.map((x,v)=>x?za(x,()=>`output "${this.outputNames[h[v]]}"`):null),_=await If(this.sessionId,d,f,h,g,n,u),b={};for(let x=0;x<_.length;x++)b[this.outputNames[h[x]]]=c[x]??zf(_[x]);return Le(),b}startProfiling(){}endProfiling(){Tf(this.sessionId)}}}),Of,W0=w(()=>{"use strict";Of=e=>{if(e!=null&&e.epContextDataRead)throw new Error('session option "epContextDataRead" is not supported by ONNX Runtime Web')}}),Mf={};I(Mf,{OnnxruntimeWebAssemblyBackend:()=>Oa,initializeFlags:()=>Ca,wasmBackend:()=>Rf});var Ca,Oa,Rf,j0=w(()=>{"use strict";qe(),Af(),Ta(),F0(),W0(),Ca=()=>{(typeof ye.wasm.initTimeout!="number"||ye.wasm.initTimeout<0)&&(ye.wasm.initTimeout=0);let e=ye.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),ye.wasm.simd=!1),typeof ye.wasm.proxy!="boolean"&&(ye.wasm.proxy=!1),typeof ye.wasm.trace!="boolean"&&(ye.wasm.trace=!1),typeof ye.wasm.numThreads!="number"||!Number.isInteger(ye.wasm.numThreads)||ye.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ye.wasm.numThreads=1;else{let t=typeof navigator>"u"?$("node:os").cpus().length:navigator.hardwareConcurrency;ye.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},Oa=class{async init(e){Ca(),await bf(),await $f(e)}async createInferenceSessionHandler(e,t){Of(t);let n=new Cf;return await n.loadModel(e,t),n}async createLoraAdapterHandler(e){let t=new Aa;return await t.loadAdapter(e),t}},Rf=new Oa}),Pf={};I(Pf,{InferenceSession:()=>ai,LoraAdapter:()=>oi,TRACE:()=>Mt,TRACE_EVENT_BEGIN:()=>tt,TRACE_EVENT_END:()=>rt,TRACE_FUNC_BEGIN:()=>Ae,TRACE_FUNC_END:()=>Le,Tensor:()=>ct,default:()=>q0,env:()=>ye,registerBackend:()=>G}),qe(),qe(),qe();var V0="1.31.1",q0=Xe;{let e=(j0(),z(Mf)).wasmBackend;G("webgpu",e,5),G("webnn",e,5),G("cpu",e,10),G("wasm",e,10)}return Object.defineProperty(ye.versions,"web",{value:V0,enumerable:!0}),z(Pf)})();/**
 * @license
 * Copyright 2021 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2020 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 *//**
 * @license
 * Copyright 2019 Google LLC. All Rights Reserved.
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 * =============================================================================
 */s.exports=r})(Ag);var Bi=Ag.exports;const a2=i_(Bi),Mg=s_({__proto__:null,default:a2},[Bi]),Rg=""+new URL("ort-wasm-simd-threaded.jsep-7838b4b2.mjs",import.meta.url).href,o2=Object.freeze(Object.defineProperty({__proto__:null,default:Rg},Symbol.toStringTag,{value:"Module"})),Pg=""+new URL("ort-wasm-simd-threaded.jsep-5ab83617.wasm",import.meta.url).href,u2=Object.freeze(Object.defineProperty({__proto__:null,default:Pg},Symbol.toStringTag,{value:"Module"})),l2="3620ed788667cb76f08bd6cf2db8152c1f4c8bd1",Dg=[{name:"HF 镜像",base:"https://hf-mirror.com/"},{name:"Hugging Face",base:"https://huggingface.co/"}],d2="devtoys-web-tts-models-v1",c2="ayousanz/piper-plus-base",p2="releases/zs-v1/campplus.onnx",h2="a6ac6a63997761ae2997373e2ee1c47040854b4b759ea41ec48e4e42df0f4d73",Bg=new URL("./models/piper-plus-zs-v1/",document.baseURI).href,f2=`${Bg}pinyin_single.json`,m2=`${Bg}pinyin_phrases.json`,g2="https://tts-cache.invalid/",Kn=new Map;let Xn=null;function Dm(s,i){return`${g2}${encodeURIComponent(s)}/${i}`}function _2(){Xn||(Xn=globalThis.fetch.bind(globalThis),globalThis.fetch=(s,i)=>{const r=typeof s=="string"?s:s instanceof URL?s.href:s.url,o=Kn.get(r);return o?Promise.resolve(new Response(o.data,{headers:{"content-type":o.contentType,"content-length":String(o.data.byteLength)}})):Xn(s,i)})}function y2(){Kn.size===0&&Xn&&(globalThis.fetch=Xn,Xn=null)}let Us=null,Fs=null;Bi.env.wasm.simd=!0;Bi.env.wasm.numThreads=globalThis.crossOriginIsolated?Math.max(1,Math.min(4,navigator.hardwareConcurrency||1)):1;Bi.env.wasm.wasmPaths={mjs:Rg,wasm:Pg};const Ya=new Map;let Es=null;async function w2(){if(Us&&Fs)return;const[s,i]=await Promise.all([fetch(f2),fetch(m2)]);if(!s.ok||!i.ok)throw new Error("本地拼音词典缺失，请检查 public/models/piper-plus-zs-v1 目录");Us=new Uint8Array(await s.arrayBuffer()),Fs=new Uint8Array(await i.arrayBuffer())}async function b2(){await w2();const s=await jt(()=>import("./piper_plus_wasm-499a458b.js"),[],import.meta.url);typeof s.default=="function"&&await s.default();const i=s.WasmPhonemizer;class r extends i{constructor(p){var m;super(p),Us&&Fs&&((m=this.setChineseDictionary)==null||m.call(this,Us,Fs))}}return{default:s.default,WasmPhonemizer:r}}function $2(s,i,r,o){return`${s}${i}/resolve/${r??"main"}/${o}`}async function Bm(s){var r;if(!((r=globalThis.crypto)!=null&&r.subtle))return"";const i=await globalThis.crypto.subtle.digest("SHA-256",s);return Array.from(new Uint8Array(i),o=>o.toString(16).padStart(2,"0")).join("")}async function v2(s,i){const r=Number(s.headers.get("content-length")??0),o=Number.isFinite(r)&&r>0?r:0;if(!s.body||!i)return s.arrayBuffer();const p=s.body.getReader(),m=[];let y=0;for(;;){const{done:I,value:R}=await p.read();if(I)break;R&&(m.push(R),y+=R.byteLength,i(y,o||y))}const $=new Uint8Array(y);let w=0;for(const I of m)$.set(I,w),w+=I.byteLength;return $.buffer}async function fo(s,i,r,o,p){const m=await caches.open(d2),y=`${r}/${o??"main"}/${s}`,$=await m.match(y);if($!=null&&$.ok){const I=await $.arrayBuffer(),R=await Bm(I);if(!i||!R||R===i)return p==null||p(I.byteLength,I.byteLength),I;await m.delete(y)}let w;for(const I of Dg)try{const R=await fetch($2(I.base,r,o,s));if(!R.ok)throw new Error(`${I.name} 返回 ${R.status}`);const z=await v2(R,p),M=await Bm(z);if(i&&M&&M!==i)throw new Error(`${I.name} 模型校验失败`);return await m.put(y,new Response(z,{headers:{"content-type":"application/octet-stream","content-length":String(z.byteLength)}})),z}catch(R){w=R}throw new Error(w instanceof Error?w.message:"语音模型下载失败")}const x2={model:"正在创建本地语音引擎",phonemizer:"正在准备中文音素库",ready:"本地语音引擎就绪"};function E2(s,i){const r=Ya.get(s);if(r)return r;const o=Tg(s);if(!o)return Promise.reject(new Error("不支持的语音模型"));const p=(async()=>{let m;for(const y of Dg)try{i==null||i({stage:"download",message:`正在下载语音模型（${y.name}）`,percent:0});const $=await fo(o.onnxFile,o.sha256??"",o.repoId,o.revision,(z,M)=>{i==null||i({stage:"download",message:`正在下载语音模型 ${Math.round(z/1048576)} / ${Math.round(M/1048576)} MB`,percent:M>0?Math.min(100,Math.round(z/M*100)):void 0})}),w=await fo(`${o.onnxFile}.json`,"",o.repoId,o.revision),I=Dm(s,o.onnxFile),R=Dm(s,`${o.onnxFile}.json`);_2(),Kn.set(I,{data:$,contentType:"application/octet-stream"}),Kn.set(R,{data:w,contentType:"application/json"});try{return await Oo.initialize({model:I,ort:Mg,wasmLoader:b2,showModelNotice:!1,onProgress:z=>{i==null||i({stage:z.stage==="model"?"engine":z.stage,message:x2[z.stage]??(z.message||"正在准备本地语音模型")})}})}finally{Kn.delete(I),Kn.delete(R),y2()}}catch($){m=$,i==null||i({stage:"download",message:`${y.name} 加载失败，正在尝试备用源`})}throw m instanceof Error?m:new Error("语音模型加载失败")})().catch(m=>{throw Ya.delete(s),m});return Ya.set(s,p),p}function k2(s){return Es||(Es=(async()=>{s==null||s({stage:"encoder",message:"正在准备本地声纹模型"});const i=await fo(p2,h2,c2,l2);return yo.initialize({modelData:i,ort:Mg,frontEnd:"kaldi-fbank"})})().catch(i=>{throw Es=null,i})),Es}const Lg=[{id:"rules",name:"本地规则（默认）",description:"按标点自动插入停顿，问句放慢、感叹句加快，纯本地零下载",needsNetwork:!1},{id:"local-llm",name:"本地小模型",description:"Qwen2.5-0.5B 在浏览器内推理语气语速，效果更自然；首次下载约 470 MB",needsNetwork:!1,sizeLabel:"470 MB"},{id:"cloud",name:"云端大模型（实验）",description:"把文本发给所配置的大模型接口，生成更自然的语气标注；会外发文本",needsNetwork:!0},{id:"off",name:"关闭",description:"不做任何语气语速处理，整段按统一语速朗读",needsNetwork:!1}];function S2(s){return Lg.find(i=>i.id===s)}function Ng(s){return s.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;")}const I2={"。":420,"！":300,"？":560,"…":500,".":380,"!":280,"?":520},T2={"，":220,"、":160,"；":320,"：":300,"——":340,",":200,";":300,":":280};function A2(s){const i=s.split(/([，、；：—,\;:]+)/).filter(o=>o.length>0);let r="";for(const o of i){const p=o.trim(),m=T2[p];m!==void 0?r+=`<break time="${m}ms"/>`:p&&(r+=Ng(p))}return r}function z2(s,i){const r=/[？?]\s*$/.test(s),o=/[！!]\s*$/.test(s);let p=1/i;return r?p*=1.12:o&&(p*=.92),`${Math.round(100/p*10)/10}%`}function C2(s){const i=s.replace(/\r\n?/g,`
`).trim();return i?i.split(new RegExp("(?<=[。！？!?…])\\s*")).map(r=>r.trim()).filter(r=>r.length>0):[]}function Ug(s,i){return["<speak>",...C2(s).map(p=>{var w,I;const m=z2(p,i.rate),y=((I=(w=p.match(/[。！？!?…]\s*$/))==null?void 0:w[0])==null?void 0:I.trim())??"",$=I2[y]??300;return[`    <prosody rate="${m}">`,A2(p),"</prosody>",`    <break time="${$}ms"/>`].join("")}),'    <break time="600ms"/>',"</speak>"].join(`
`)}const Fg="onnx-community/Qwen2.5-0.5B-Instruct",O2="q4f16",M2="transformers-cache";let On=null;function R2(){const s=On;On=null,s==null||s.then(i=>{var r;return(r=i.dispose)==null?void 0:r.call(i)}).catch(()=>{})}async function mo(){const s={available:!1,cached:!1,bytes:0,files:0};if(typeof globalThis.caches>"u")return s;try{const i=await globalThis.caches.open(M2),o=(await i.keys()).filter($=>$.url.includes(Fg));let p=0;for(const $ of o)try{const w=await i.match($),I=Number((w==null?void 0:w.headers.get("content-length"))??0);Number.isFinite(I)&&I>0&&(p+=I)}catch{}const m=o.some($=>/\.onnx(?:$|\?)/i.test($.url)),y=o.some($=>/\.json(?:$|\?)/i.test($.url));return{available:!0,cached:m&&y,bytes:p,files:o.length}}catch{return s}}function Wg(s){return On||(On=(async()=>{var R,z;const i=await mo();s==null||s({stage:"download",percent:i.cached?100:0,message:i.cached?"本地小模型已在浏览器缓存中，直接复用（无需重新下载）":"正在下载本地小模型（首次约 470 MB，之后离线）"});const{pipeline:r,env:o}=await jt(()=>import("./transformers.web-293dc40c.js"),["./transformers.web-293dc40c.js","./index-1d506c20.js","./index-9ebdc9f9.css"],import.meta.url);o.allowLocalModels=!1,o.useBrowserCache=!0,o.remoteHost="https://hf-mirror.com",o.remotePathTemplate="{model}/resolve/{revision}/";const p=o.fetch??globalThis.fetch;o.fetch=(M,D)=>{if(!D)return p(M,D);const j=D.headers,G=j instanceof Headers?j.has("range"):!!(j&&Object.keys(j).some(he=>he.toLowerCase()==="range"));if(!(G||D.cache==="no-store"))return p(M,D);const J={...D};return J.cache==="no-store"&&(J.cache="default"),G&&(J.headers instanceof Headers?(J.headers=new Headers(J.headers),J.headers.delete("range")):J.headers&&(J.headers=Object.fromEntries(Object.entries(J.headers).filter(([he])=>he.toLowerCase()!=="range")))),p(M,J)};const[{default:m},{default:y}]=await Promise.all([jt(()=>Promise.resolve().then(()=>o2),void 0,import.meta.url),jt(()=>Promise.resolve().then(()=>u2),void 0,import.meta.url)]),$=(z=(R=o.backends)==null?void 0:R.onnx)==null?void 0:z.wasm;$&&($.wasmPaths={mjs:m,wasm:y});const w=new Map,I=await r("text-generation",Fg,{dtype:O2,progress_callback:M=>{const D=M;if(D.status==="progress"&&D.name&&!i.cached){w.set(D.name,{loaded:D.loaded??0,total:D.total??0});let j=0,G=0;for(const K of w.values())j+=K.loaded,G+=K.total;G>0&&(s==null||s({stage:"download",percent:Math.min(100,Math.round(j/G*100)),message:`正在下载本地小模型 ${Math.round(j/1048576)} / ${Math.round(G/1048576)} MB`}))}else D.status==="ready"&&(s==null||s({stage:"generate",message:"本地小模型就绪"}))}});return s==null||s({stage:"load",message:"正在初始化本地小模型推理"}),I})().catch(i=>{throw On=null,i}),On)}const P2=["你是语音合成韵律标注助手。把用户文本按句子输出 JSON 数组，",'每项形如 {"text":"原句","rate":1.0,"pauseMs":400}。',"rate 是 0.6 到 1.6 的语速倍率（小于 1 加快、大于 1 放慢），","pauseMs 是这句话之后停顿的毫秒数（0 到 1200）。","根据每句的情绪与语义决定数值：疑问句略放慢、长句拆短停顿、","感叹句加快并缩短停顿、陈述句用 1.0。只输出 JSON 数组，不要解释。"].join("");async function D2(s,i){var R;const p=await(await Wg())(JSON.stringify([{role:"system",content:P2},{role:"user",content:s}]),{max_new_tokens:600,temperature:.2,do_sample:!0,return_full_text:!1});if(i!=null&&i.aborted)throw new DOMException("已取消","AbortError");const m=(R=p==null?void 0:p[0])==null?void 0:R.generated_text,y=typeof m=="string"?m:(m==null?void 0:m.filter(z=>(z==null?void 0:z.role)==="assistant").map(z=>(z==null?void 0:z.content)??"").join(""))??"",$=jg(y);if(!$)throw new Error("本地小模型标注格式无法解析");const w=JSON.parse($);if(!Array.isArray(w))throw new Error("本地小模型标注不是数组");const I=w.filter(z=>typeof(z==null?void 0:z.text)=="string"&&z.text.trim().length>0).map(z=>({text:z.text.trim(),rate:Ws(z.rate,.6,1.6,1),pauseMs:Math.round(Ws(z.pauseMs,0,1200,400))}));if(!I.length)throw new Error("本地小模型标注结果为空");return I}const B2=["你是语音合成韵律标注助手。用户会给一段要转成语音的文本，",'你按句子输出 JSON 数组，每项形如 {"text":"原句","rate":1.0,"pauseMs":400}。',"rate 是 0.5 到 1.8 的语速倍率（小于 1 加快，大于 1 放慢）；","pauseMs 是这句话之后停顿的毫秒数（0 到 1500）。","根据句子的情绪与语义决定数值，例如疑问句略放慢、长句拆短停顿。只输出 JSON。"].join("");async function L2(s,i,r){var w,I,R;const o=await fetch(i.endpoint,{method:"POST",headers:{"content-type":"application/json",...i.apiKey?{authorization:`Bearer ${i.apiKey}`}:{}},body:JSON.stringify({model:i.model,messages:[{role:"system",content:B2},{role:"user",content:s}],temperature:.3}),signal:r});if(!o.ok)throw new Error(`韵律标注接口返回 ${o.status}`);const m=((R=(I=(w=(await o.json()).choices)==null?void 0:w[0])==null?void 0:I.message)==null?void 0:R.content)??"",y=jg(m);if(!y)throw new Error("韵律标注返回格式无法解析");const $=JSON.parse(y);if(!Array.isArray($))throw new Error("韵律标注返回不是数组");return $.filter(z=>typeof(z==null?void 0:z.text)=="string"&&z.text.trim().length>0).map(z=>({text:z.text.trim(),rate:Ws(z.rate,.5,1.8,1),pauseMs:Math.round(Ws(z.pauseMs,0,1500,400))}))}function Ws(s,i,r,o){const p=Number(s);return Number.isFinite(p)?Math.min(r,Math.max(i,p)):o}function jg(s){const i=s.match(/```(?:json)?\s*([\s\S]*?)```/i),r=i?i[1]:s,o=r.indexOf("["),p=r.lastIndexOf("]");return o===-1||p===-1||p<=o?null:r.slice(o,p+1)}function Lm(s,i){return["<speak>",...s.map(o=>{const p=(o.rate??1)/i.rate,m=`${Math.round(100/p*10)/10}%`,y=o.pauseMs?`
      <break time="${o.pauseMs}ms"/>`:"";return`    <prosody rate="${m}">${Ng(o.text)}</prosody>${y}`}),"</speak>"].join(`
`)}async function N2(s,i,r,o,p){if(i==="off"||!s.trim())return s;if(i==="rules")return Ug(s,r);if(i==="local-llm"){const m=await D2(s,p);return Lm(m,r)}if(i==="cloud"){if(!(o!=null&&o.endpoint))throw new Error("云端韵律引擎未配置接口地址，已回退本地规则");const m=await L2(s,o,p);if(!m.length)throw new Error("云端韵律标注结果为空，已回退本地规则");return Lm(m,r)}return s}const Vt=s=>(Nm("data-v-1478eda0"),s=s(),Um(),s),U2={class:"dt-tts"},F2={class:"dt-tts__section"},W2=Vt(()=>de("label",{class:"dt-tts__label",for:"tts-text"},"要朗读的文字",-1)),j2={class:"dt-tts__section"},V2=Vt(()=>de("p",{class:"dt-tts__hint"},"模型按需下载并缓存，不上传任何音频或文本。",-1)),q2={class:"dt-tts__row"},G2=Vt(()=>de("label",{class:"dt-tts__label",for:"tts-prosody"},"语气语速",-1)),H2=["value"],K2={key:0,class:"dt-tts__hint"},Z2={key:1,class:"dt-tts__cloud"},J2={key:0,class:"dt-tts__cloud-form"},X2=Vt(()=>de("p",{class:"dt-tts__hint"},"配置只保存在内存，刷新即清空；文本会发送到该接口。",-1)),Y2={class:"dt-tts__row"},Q2=Vt(()=>de("label",{class:"dt-tts__label",for:"tts-role"},"角色",-1)),ev={label:"默认角色（系统语音）"},tv=["value"],nv=Vt(()=>de("optgroup",{label:"模型音色"},[de("option",{value:"model-default"},"模型默认音色（可下载 WAV）")],-1)),iv={key:0,label:"自定义角色（本地声纹）"},sv=["value","disabled"],rv={class:"dt-tts__actions"},av=["disabled"],ov=["disabled"],uv=["src"],lv={key:4,class:"dt-tts__progress"},dv={key:5,class:"dt-tts__progress"},cv={class:"dt-tts__note"},pv={class:"dt-tts__section dt-tts__enroll"},hv=Vt(()=>de("h2",{class:"dt-tts__heading"},"上传音频生成角色",-1)),fv=Vt(()=>de("p",{class:"dt-tts__hint"},"仅「零样本克隆 zs-v1」支持。提供 3–10 秒清晰人声，浏览器本地提取声纹并保存角色；音频、声纹都不会上传。",-1)),mv={class:"dt-tts__row"},gv={class:"dt-tts__upload"},_v={class:"dt-tts__consent"},yv=Vt(()=>de("span",null,"我确认拥有这段声音或已获得授权，可用于本地合成",-1)),wv=["disabled"],bv={key:0,class:"dt-tts__roles"},$v=["onClick"],vv=go({__name:"TextToSpeech",props:{toolId:{},actions:{}},emits:["output-change","status-change"],setup(s,{emit:i}){const r=s,o=i,p=X0("devtoys:toolOptions",null);function m(oe,H){var le;const Se=Number(((le=p==null?void 0:p.value)==null?void 0:le[oe])??H);return Number.isFinite(Se)?Se:H}const y=dt(()=>Math.min(3,Math.max(.5,m("rate",1)))),$=dt(()=>Math.min(2,Math.max(.5,m("pitch",1)))),w=Ce(""),I=Ce("zs-v1"),R=Ce([]),z=Ce([]),M=Ce(""),D=Ce(!1),j=Ce(""),G=Ce(null),K=Ce(""),J=Ce(0),he=Ce(null),ce=Ce("rules"),be=Ce(null),Be=Ce(""),Ke=Ce(""),Et=Ce(""),Me=Ce(!1),We=Ce(null),ye=Ce(0),ht=Ce(0),Mt=Ce(0),qt=Ce(0),Ae=Ce("");let Le=null,tt=!1;const rt=Ce(""),gt=Ce(null),Gt=Ce(!1),dn=Ce(!1),kt=Ce(""),ei=dt(()=>({kind:"blob",blob:G.value??void 0,filename:"tts-result.wav",mimeType:"audio/wav"})),Rt=dt(()=>Tg(I.value)),Pn=dt(()=>M.value.startsWith("custom:")),Li=dt(()=>{if(!Pn.value)return;const oe=M.value.slice(7);return z.value.find(H=>H.id===oe)}),Ht=dt(()=>S2(ce.value)),Ni=dt(()=>{if(ce.value==="cloud")return{endpoint:Be.value.trim(),model:Ke.value.trim(),apiKey:Et.value.trim()}});function it(oe){o("output-change",{kind:"text",text:""}),o("status-change",{state:"error",message:oe})}function cn(oe){o("status-change",{state:"success",message:oe})}function Ui(){We.value=null,ye.value=0,ht.value=0,Mt.value=0,qt.value=0,Ae.value=""}function St(){tt=!0,Le==null||Le.abort(),Le=null,Ae.value="正在取消…",We.value=null,j.value="已取消本次生成。",o("status-change",{state:"idle"}),o("output-change",{kind:"text",text:""})}function It(oe){return new Promise((H,Se)=>{const le=setInterval(()=>{tt&&(clearInterval(le),Se(new DOMException("已取消","AbortError")))},100);oe.then(Xe=>{clearInterval(le),tt?Se(new DOMException("已取消","AbortError")):H(Xe)},Xe=>{clearInterval(le),Se(Xe)})})}function Kt(){if(tt)throw new DOMException("已取消","AbortError")}function ti(){if(typeof speechSynthesis>"u"){R.value=[];return}const oe=speechSynthesis.getVoices();if(R.value=oe.map(H=>({uri:H.voiceURI,label:`${H.name}（${H.lang}${H.localService?" · 本地":""}）`})),M.value!=="model-default"&&!M.value.startsWith("custom:")&&!R.value.some(H=>`system:${H.uri}`===M.value)){const H=oe.find(Se=>Se.lang.toLowerCase().startsWith("zh"))??oe[0];M.value=H?`system:${H.voiceURI}`:""}}async function ni(){be.value=await mo()}async function Dn(){try{z.value=await R$()}catch(oe){j.value=oe instanceof Error?oe.message:"本地角色库读取失败"}}function ii(){ti()}function Hs(){var oe,H;M.value.startsWith("custom:")&&!((oe=Rt.value)!=null&&oe.supportsCloning)&&(M.value="model-default"),K.value&&(URL.revokeObjectURL(K.value),K.value=""),G.value=null,o("output-change",{kind:"text",text:""}),j.value=(H=Rt.value)!=null&&H.credit?`已切换模型；使用生成音频时请标注「${Rt.value.credit}」。`:"已切换模型，重新生成即可使用新音色。"}Y0(()=>{ti(),Dn(),ni(),typeof speechSynthesis<"u"&&speechSynthesis.addEventListener("voiceschanged",ii)}),Q0(()=>{St(),R2(),typeof speechSynthesis<"u"&&(speechSynthesis.removeEventListener("voiceschanged",ii),speechSynthesis.cancel()),K.value&&URL.revokeObjectURL(K.value)});function at(oe){var Se;const H=((Se=oe.target.files)==null?void 0:Se[0])??null;if(H){if(!H.type.startsWith("audio/")){it("请选择音频文件");return}if(H.size>25*1024*1024){it("参考音频超过 25 MB，请选择更小的文件");return}gt.value=H,rt.value=H.name.replace(/\.[^.]+$/,"")}}async function si(oe){const H=window.AudioContext??window.webkitAudioContext;if(!H)throw new Error("当前浏览器不支持音频解码");const Se=new H;try{return await Se.decodeAudioData(await oe.arrayBuffer())}finally{await Se.close()}}async function ct(){var oe;if(!((oe=Rt.value)!=null&&oe.supportsCloning)){it("当前模型不支持声音克隆，请先切换到「零样本克隆 zs-v1」");return}if(!gt.value){it("请先选择一段参考音频");return}if(!rt.value.trim()){it("请为角色填写名称");return}if(!Gt.value){it("请先确认你有权使用该声音");return}dn.value=!0,kt.value="正在解码参考音频",Ui(),We.value="engine",Ae.value="正在解码参考音频",o("status-change",{state:"processing"});try{const H=await si(gt.value);if(H.duration<2||H.duration>60)throw new Error("参考音频需为 2 到 60 秒，建议使用 3 到 10 秒清晰人声");kt.value="正在提取声纹特征";const le=await(await k2(qe=>{kt.value=qe.message})).encode(H),Xe={id:B$(),name:rt.value.trim(),embedding:le,createdAt:Date.now(),duration:H.duration};await P$(Xe),await Dn(),M.value=`custom:${Xe.id}`,gt.value=null,rt.value="",Gt.value=!1,j.value=`角色「${Xe.name}」已保存在本机浏览器，未上传任何音频。`,cn("自定义音色角色已生成")}catch(H){it(H instanceof Error?H.message:"角色生成失败，请重试")}finally{dn.value=!1,kt.value="",We.value=null,Ae.value=""}}async function Fi(oe){try{await D$(oe),M.value===`custom:${oe}`&&(M.value="model-default"),await Dn(),cn("角色已从本机删除")}catch(H){it(H instanceof Error?H.message:"角色删除失败，请重试")}}function ri(){var oe;typeof speechSynthesis<"u"&&speechSynthesis.cancel(),(oe=he.value)==null||oe.pause()}function Ks(oe){K.value&&URL.revokeObjectURL(K.value),K.value=URL.createObjectURL(oe),window.setTimeout(()=>{var H;(H=he.value)==null||H.play().catch(()=>{j.value="音频已生成，可点击播放器手动播放。"})},0)}async function ai(oe){if(typeof speechSynthesis>"u")throw new Error("当前浏览器不支持系统语音朗读");ri();const H=speechSynthesis.getVoices().find(le=>le.voiceURI===oe),Se=new SpeechSynthesisUtterance(w.value);H&&(Se.voice=H,Se.lang=H.lang),Se.rate=y.value,Se.pitch=$.value,o("status-change",{state:"processing"}),Se.onend=()=>cn("朗读完成"),Se.onerror=()=>it("系统语音朗读失败，请更换角色后重试"),speechSynthesis.speak(Se),K.value&&(URL.revokeObjectURL(K.value),K.value=""),G.value=null,o("output-change",{kind:"text",text:""}),j.value="系统音色只能试听，无法导出 WAV；如需下载请选择模型音色或自定义角色。"}async function Zs(oe){var ui,Wi;const H=Rt.value;if(!H)throw new Error("请选择语音模型");if(oe&&!H.supportsCloning)throw new Error("当前模型不支持声音克隆，请切换到「零样本克隆 zs-v1」");We.value="download",Ae.value=`${H.name} · ${H.sizeLabel}`;const Se=await It(E2(I.value,Oe=>{tt||(Oe.stage==="model"?(We.value="download",ye.value=Oe.percent??ye.value,Ae.value=Oe.message):(Oe.stage==="engine"||Oe.stage==="phonemizer")&&(We.value="engine",Ae.value=Oe.message))}));if(Kt(),We.value="analyze",ce.value==="local-llm"){const Tt=(await mo()).cached;We.value=Tt?"analyze":"download",Ae.value=Tt?"本地小模型已从缓存加载，无需重新下载":"本地小模型分析语气语速（首次约 470 MB，之后离线）",await It(Wg(Ge=>{tt||Ge.stage==="download"&&!Tt&&(We.value="download",ye.value=Ge.percent??ye.value,Ae.value=Ge.message)})),We.value="analyze",Ae.value="本地小模型正在标注语气与语速",ni()}else ce.value==="cloud"?Ae.value="云端引擎分析语气与语速（文本将发送到所配置接口）":Ae.value="本地规则分析标点与语气";const le={rate:y.value};Le=new AbortController;let Xe=w.value;try{Xe=await It(N2(w.value,ce.value,le,Ni.value,Le.signal))}catch(Oe){if((Oe==null?void 0:Oe.name)==="AbortError")throw Oe;j.value=Oe instanceof Error?Oe.message:"韵律生成失败，已回退本地规则",Xe=Ug(w.value,le)}finally{Le=null}Kt(),We.value="synthesize";const qe=Eg(Xe).filter(Oe=>Oe.text.trim().length>0);Mt.value=qe.length,ht.value=0,qt.value=0,Ae.value="";const Bn=((Wi=(ui=Se.config)==null?void 0:ui.audio)==null?void 0:Wi.sample_rate)??22050;let _t=new Float32Array(0);for(const Oe of qe){Kt(),ht.value+=1,Ae.value=Oe.text.length>24?`${Oe.text.slice(0,24)}…`:Oe.text;const Tt=await It(Se.synthesize(Oe.text,{language:"zh",speakerEmbedding:oe==null?void 0:oe.embedding,lengthScale:1/y.value*(Oe.rate??1)})),Ge=new Float32Array(_t.length+Tt.samples.length);if(Ge.set(_t,0),Ge.set(Tt.samples,_t.length),_t=Ge,qt.value+=Tt.duration,Oe.breakMs>0){const hn=Math.floor(Oe.breakMs/1e3*Bn),fn=new Float32Array(_t.length+hn);fn.set(_t,0),_t=fn}await new Promise(hn=>setTimeout(hn,0))}Kt();const pn=new ks(_t,Bn),Ln=pn.toBlob();G.value=Ln,J.value=pn.duration,Ks(Ln),o("output-change",ei.value),cn(`已生成 ${pn.duration.toFixed(1)} 秒语音`),We.value="done",j.value=`${H.credit?`请标注「${H.credit}」；`:""}模型「${H.name}」在本机推理，首次使用会从公开镜像下载并缓存。`,ni()}async function oi(){if(!w.value.trim()){it("请输入要朗读的文字");return}if(!M.value){it("请选择角色");return}D.value=!0,j.value="",tt=!1,Le=null,Ui(),o("status-change",{state:"processing"});try{if(M.value.startsWith("system:"))await ai(M.value.slice(7));else{const oe=M.value==="model-default"?void 0:Li.value;if(M.value!=="model-default"&&!oe)throw new Error("自定义角色已不存在，请重新选择");await Zs(oe)}}catch(oe){(oe==null?void 0:oe.name)==="AbortError"?(We.value=null,j.value="已取消本次生成。",o("status-change",{state:"idle"}),o("output-change",{kind:"text",text:""})):(it(oe instanceof Error?oe.message:"语音生成失败，请重试"),We.value=null)}finally{D.value=!1,kt.value="",tt=!1,Le=null}}function Js(){if(!G.value){it("请先使用模型音色或自定义角色生成语音");return}r.actions.download(ei.value,"tts-result.wav")}return(oe,H)=>{var Se;return Te(),ze("div",U2,[de("section",F2,[W2,tn(de("textarea",{id:"tts-text","onUpdate:modelValue":H[0]||(H[0]=le=>w.value=le),class:"dt-tts__text",rows:"6",placeholder:"输入中文或其他支持的语言文本，所有合成均在本机完成"},null,512),[[ki,w.value]])]),de("section",j2,[e_(H$,{id:"tts-model",modelValue:I.value,"onUpdate:modelValue":H[1]||(H[1]=le=>I.value=le),label:"语音模型",models:Lf(Ig),onChange:Hs},null,8,["modelValue","models"]),V2,de("div",q2,[G2,tn(de("select",{id:"tts-prosody","onUpdate:modelValue":H[2]||(H[2]=le=>ce.value=le),class:"dt-tts__select"},[(Te(!0),ze(Ft,null,Gn(Lf(Lg),le=>(Te(),ze("option",{key:le.id,value:le.id},je(le.name),9,H2))),128))],512),[[Nf,ce.value]])]),Ht.value?(Te(),ze("p",K2,[Ma(je(Ht.value.description),1),Ht.value.needsNetwork?(Te(),ze(Ft,{key:0},[Ma("（⚠️ 使用时会外发文本）")],64)):Ht.value.sizeLabel?(Te(),ze(Ft,{key:1},[Ma("（"+je(ce.value==="local-llm"&&((Se=be.value)!=null&&Se.cached)?"✅ 小模型已缓存，刷新不会重新下载":"📦 首次下载 "+Ht.value.sizeLabel+"，之后离线")+"）",1)],64)):st("",!0)])):st("",!0),ce.value==="cloud"?(Te(),ze("div",Z2,[de("button",{class:"dt-tts__cloud-toggle",type:"button",onClick:H[3]||(H[3]=le=>Me.value=!Me.value)},je(Me.value?"收起接口配置":"配置接口（OpenAI 兼容）"),1),Me.value?(Te(),ze("div",J2,[tn(de("input",{"onUpdate:modelValue":H[4]||(H[4]=le=>Be.value=le),class:"dt-tts__input",type:"url","aria-label":"接口地址",placeholder:"接口地址，如 https://api.example.com/v1/chat/completions"},null,512),[[ki,Be.value]]),tn(de("input",{"onUpdate:modelValue":H[5]||(H[5]=le=>Ke.value=le),class:"dt-tts__input",type:"text","aria-label":"模型名称",placeholder:"模型名称，如 gpt-4o-mini"},null,512),[[ki,Ke.value]]),tn(de("input",{"onUpdate:modelValue":H[6]||(H[6]=le=>Et.value=le),class:"dt-tts__input",type:"password","aria-label":"API Key",placeholder:"API Key（可选，仅保存在当前页面）"},null,512),[[ki,Et.value]]),X2])):st("",!0)])):st("",!0),de("div",Y2,[Q2,tn(de("select",{id:"tts-role","onUpdate:modelValue":H[7]||(H[7]=le=>M.value=le),class:"dt-tts__select"},[de("optgroup",ev,[(Te(!0),ze(Ft,null,Gn(R.value,le=>(Te(),ze("option",{key:le.uri,value:`system:${le.uri}`},je(le.label),9,tv))),128))]),nv,z.value.length?(Te(),ze("optgroup",iv,[(Te(!0),ze(Ft,null,Gn(z.value,le=>{var Xe,qe;return Te(),ze("option",{key:le.id,value:`custom:${le.id}`,disabled:!((Xe=Rt.value)!=null&&Xe.supportsCloning)},je(le.name)+je((qe=Rt.value)!=null&&qe.supportsCloning?"":"（需切换克隆模型）"),9,sv)}),128))])):st("",!0)],512),[[Nf,M.value]])]),de("div",rv,[de("button",{class:"dt-tts__button",type:"button",disabled:D.value||!w.value.trim()||!M.value,onClick:oi},je(D.value?"正在生成…":"生成语音"),9,av),de("button",{class:"dt-tts__button dt-tts__button--ghost",type:"button",onClick:ri},"停止"),de("button",{class:"dt-tts__button dt-tts__button--ghost",type:"button",disabled:!G.value,onClick:Js}," 下载 WAV ",8,ov)]),We.value?(Te(),t_(s2,{key:2,stage:We.value,percent:ye.value,"sentence-index":ht.value,"sentence-total":Mt.value,"synthesized-seconds":qt.value,detail:Ae.value,cancellable:D.value,onCancel:St},null,8,["stage","percent","sentence-index","sentence-total","synthesized-seconds","detail","cancellable"])):st("",!0),K.value?(Te(),ze("audio",{key:3,ref_key:"audioElement",ref:he,class:"dt-tts__audio",controls:"",src:K.value},null,8,uv)):st("",!0),J.value?(Te(),ze("p",lv,"生成时长 "+je(J.value.toFixed(1))+" 秒",1)):st("",!0),kt.value?(Te(),ze("p",dv,je(kt.value),1)):st("",!0),de("p",cv,je(j.value||"语气语速开关在上方；系统音色只能试听，模型音色和自定义音色可试听并下载。"),1)]),de("section",pv,[hv,fv,de("div",mv,[de("label",gv,[de("input",{type:"file",accept:"audio/*",onChange:at},null,32),de("span",null,je(gt.value?gt.value.name:"选择本地音频（25 MB 以内）"),1)]),tn(de("input",{"onUpdate:modelValue":H[8]||(H[8]=le=>rt.value=le),class:"dt-tts__input",type:"text","aria-label":"角色名称",placeholder:"角色名称"},null,512),[[ki,rt.value]])]),de("label",_v,[tn(de("input",{"onUpdate:modelValue":H[9]||(H[9]=le=>Gt.value=le),type:"checkbox"},null,512),[[n_,Gt.value]]),yv]),de("button",{class:"dt-tts__button",type:"button",disabled:dn.value||!gt.value,onClick:ct},je(dn.value?"正在生成角色…":"生成角色"),9,wv),z.value.length?(Te(),ze("ul",bv,[(Te(!0),ze(Ft,null,Gn(z.value,le=>(Te(),ze("li",{key:le.id},[de("span",null,je(le.name)+" · "+je(le.duration.toFixed(1))+" 秒",1),de("button",{type:"button",onClick:Xe=>Fi(le.id)},"删除",8,$v)]))),128))])):st("",!0)])])}}});const Iv=_o(vv,[["__scopeId","data-v-1478eda0"]]);export{Iv as default};
