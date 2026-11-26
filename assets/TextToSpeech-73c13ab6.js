var _f=(s,i,r)=>{if(!i.has(s))throw TypeError("Cannot "+r)};var ut=(s,i,r)=>(_f(s,i,"read from private field"),r?r.call(s):i.get(s)),Ri=(s,i,r)=>{if(i.has(s))throw TypeError("Cannot add the same private member more than once");i instanceof WeakSet?i.add(s):i.set(s,r)},Di=(s,i,r,u)=>(_f(s,i,"write to private field"),u?u.call(s,r):i.set(s,r),r);import{d as gm,c as dn,b as Ge,e as He,f as Ee,t as Ke,g as Vt,F as ni,j as Xi,_ as _m,s as In,i as T0,r as Ye,u as A0,x as z0,k as Bi,v as yf,q as C0,y as O0,z as M0,A as P0,p as R0,h as D0}from"./index-16e3a32e.js";import{g as B0}from"./_commonjsHelpers-de833af9.js";import{c as $n}from"./_commonjs-dynamic-modules-302442b1.js";function L0(s,i){for(var r=0;r<i.length;r++){const u=i[r];if(typeof u!="string"&&!Array.isArray(u)){for(const p in u)if(p!=="default"&&!(p in s)){const m=Object.getOwnPropertyDescriptor(u,p);m&&Object.defineProperty(s,p,m.get?m:{enumerable:!0,get:()=>u[p]})}}}return Object.freeze(Object.defineProperty(s,Symbol.toStringTag,{value:"Module"}))}const N0="devtoys-web-tts",ss="voice-profiles";function U0(){return new Promise((s,i)=>{if(typeof indexedDB>"u"){i(new Error("当前浏览器不支持本地角色存储，请使用现代浏览器"));return}const r=indexedDB.open(N0,1);r.onupgradeneeded=()=>{const u=r.result;u.objectStoreNames.contains(ss)||u.createObjectStore(ss,{keyPath:"id"})},r.onsuccess=()=>s(r.result),r.onerror=()=>i(new Error("本地角色库打开失败，请检查浏览器存储权限"))})}function Fa(s,i){return U0().then(r=>new Promise((u,p)=>{const m=r.transaction(ss,s),y=i(m.objectStore(ss));y.onsuccess=()=>u(y.result),y.onerror=()=>p(new Error("本地角色库读写失败，请重试")),m.oncomplete=()=>r.close(),m.onerror=()=>p(new Error("本地角色库事务失败，请重试"))}))}async function F0(){return(await Fa("readonly",i=>i.getAll())).sort((i,r)=>r.createdAt-i.createdAt)}async function W0(s){await Fa("readwrite",i=>i.put(s))}async function V0(s){await Fa("readwrite",i=>i.delete(s))}function j0(){var r,u;const s=(u=(r=globalThis.crypto)==null?void 0:r.getRandomValues)==null?void 0:u.call(r,new Uint8Array(8));return`voice-${s?Array.from(s,p=>p.toString(16).padStart(2,"0")).join(""):Date.now().toString(16)}`}const q0={class:"dt-model-select"},G0={class:"dt-model-select__row"},H0=["for"],K0=["id","value","disabled"],Z0={key:0,value:"",disabled:""},X0=["value"],Y0={class:"dt-model-select__hint"},J0={key:0,class:"dt-model-select__hint"},Q0=gm({__name:"ModelSelect",props:{modelValue:{},models:{},label:{default:"语音模型"},id:{default:"model-select"},disabled:{type:Boolean,default:!1},showDetails:{type:Boolean,default:!0}},emits:["update:modelValue","change"],setup(s,{emit:i}){const r=s,u=i,p=dn(()=>r.models.find(y=>y.id===r.modelValue));function m(y){const b=y.target.value;u("update:modelValue",b),u("change",b)}return(y,b)=>(Ge(),He("div",q0,[Ee("div",G0,[Ee("label",{class:"dt-model-select__label",for:y.id},Ke(y.label),9,H0),Ee("select",{id:y.id,class:"dt-model-select__control",value:y.modelValue,disabled:y.disabled,onChange:m},[y.models.length?Vt("",!0):(Ge(),He("option",Z0,"暂无可用模型")),(Ge(!0),He(ni,null,Xi(y.models,$=>(Ge(),He("option",{key:$.id,value:$.id},Ke($.name)+" · "+Ke($.sizeLabel)+Ke($.supportsCloning?" · 可克隆":""),9,X0))),128))],40,K0)]),y.showDetails&&p.value?(Ge(),He(ni,{key:0},[Ee("p",Y0,Ke(p.value.description),1),p.value.credit?(Ge(),He("p",J0," 使用说明：生成音频需标注「"+Ke(p.value.credit)+"」。 ",1)):Vt("",!0)],64)):Vt("",!0)]))}});const e_=_m(Q0,[["__scopeId","data-v-fefefca9"]]),t_="3620ed788667cb76f08bd6cf2db8152c1f4c8bd1",ym=[{id:"zs-v1",name:"零样本克隆 zs-v1",description:"支持上传音频生成角色，中英日等 6 语言",repoId:"ayousanz/piper-plus-base",onnxFile:"releases/zs-v1/base.onnx",revision:t_,supportsCloning:!0,sizeLabel:"40.8 MB"},{id:"tsukuyomi",name:"月读酱 6 语言",description:"固定女声，适合日语与中文朗读，不支持克隆",repoId:"ayousanz/piper-plus-tsukuyomi-chan",onnxFile:"tsukuyomi-chan-6lang-fp16.onnx",supportsCloning:!1,credit:"Piper Plus:つくよみちゃん",sizeLabel:"39.7 MB"},{id:"css10",name:"CSS10 6 语言",description:"固定音色，偏清晰平稳，不支持克隆",repoId:"ayousanz/piper-plus-css10-ja-6lang",onnxFile:"css10-ja-6lang-fp16.onnx",supportsCloning:!1,sizeLabel:"39.7 MB"}];function wm(s){return ym.find(i=>i.id===s)}const wf=new Set(["int64","uint64"]);class n_{constructor({ort:i,gpu:r}){this._ort=i,this._gpu=r,this.currentProvider=null}async createSession(i){const r=this._gpu?["webgpu","wasm"]:["wasm"],u=[];for(const p of r)try{const m={executionProviders:[p],graphOptimizationLevel:"extended",enableMemPattern:!0},y=await this._ort.InferenceSession.create(i,m);if(p==="webgpu"&&this._hasUnsupportedDtypes(y)){console.warn("[piper-plus] Model uses int64 tensors unsupported by WebGPU (WGSL has no i64). Falling back to WASM execution provider."),typeof y.release=="function"&&await y.release(),u.push("webgpu: model uses int64 tensors (unsupported by WGSL)");continue}return this.currentProvider=p,y}catch(m){u.push(`${typeof p=="string"?p:p.name}: ${(m==null?void 0:m.message)??String(m)}`)}throw new Error(`All execution providers failed: ${u.join("; ")}`)}_hasUnsupportedDtypes(i){var r;try{const u=i.inputNames;if(!u)return!1;for(const m of u){const y=(r=i.inputMetadata)==null?void 0:r[m];if(y&&wf.has(y.dataType))return!0}const p=i.handler||i._handler;if(p!=null&&p.inputTypes){for(const m of p.inputTypes)if(wf.has(m))return!0}}catch{}return!1}async checkGPUCapacity(i){if(!this._gpu)return!1;const r=await this._gpu.requestAdapter();if(!r)return!1;const u=await r.requestDevice();try{return u.limits.maxBufferSize>=i&&u.limits.maxStorageBufferBindingSize>=i}finally{u.destroy()}}}const i_=/(?:Mr|Dr|Mrs|Ms|Prof|Sr|Jr|St|Mt|Inc|Ltd|Corp|Co|vs|etc|Vol|Dept|Est|approx|Gen|Gov|Sgt|Cpl|Pvt|Capt|Lt|Col|Maj|Rev|Ph\.D)\./gi,s_=Object.freeze(["e.g.","i.e."]),$f=s=>s>="0"&&s<="9"||s>="０"&&s<="９",r_=s=>/^[0-9A-Za-z]$/.test(s);function a_(s,i){if(s[i]!=="."&&s[i]!=="．")return!1;if(i>0&&i+1<s.length&&$f(s[i-1])&&$f(s[i+1]))return!0;for(const r of s_)for(let u=0;u<r.length;u++){if(r[u]!==".")continue;const p=i-u,m=p+r.length;if(!(p<0||m>s.length)&&s.slice(p,m).replace(/[A-Z]/g,y=>y.toLowerCase())===r&&(p===0||!r_(s[p-1])))return!0}return!1}class rs{static split(i,r){return i?r==="ja"?rs._splitJapanese(i):rs._splitEnglish(i):[]}static _splitJapanese(i){const r=[];let u="";for(let p=0;p<i.length;p++)u+=i[p],"。！？!?".includes(i[p])&&(r.push(u),u="");return u&&r.push(u),r}static _splitEnglish(i){const r="\0",u=i.replace(i_,(y,b)=>y.slice(0,-1)+r),p=[];let m="";for(let y=0;y<u.length;y++)m+=u[y],".!?".includes(u[y])&&!a_(i,y)&&(p.push(m.replaceAll(r,".")),m="");return m&&p.push(m.replaceAll(r,".")),p.map((y,b)=>b===0?y:y.trimStart()).filter(y=>y.length>0)}}class o_{constructor({phonemize:i,synthesize:r,onAudioChunk:u}){if(typeof i!="function")throw new TypeError("phonemize must be a function");if(typeof r!="function")throw new TypeError("synthesize must be a function");if(typeof u!="function")throw new TypeError("onAudioChunk must be a function");this._phonemize=i,this._synthesize=r,this._onAudioChunk=u}async synthesizeAndPlay(i,r){const u=rs.split(i,r);if(u.length===0)return;let p=await this._phonemize(u[0]);for(let m=0;m<u.length;m++){const y=p,b=this._synthesize(y),$=m+1<u.length?this._phonemize(u[m+1]):Promise.resolve(null),[I,P]=await Promise.all([b,$]);this._onAudioChunk(I),p=P}}}const u_="piper-plus-models",Ut="models",Ft="dictionaries",l_=2,d_="https://huggingface.co/api/models",Ia="https://huggingface.co",c_="e9860701a941db02149c7cfbe19cfb578c235c5e25020f1f592131d9b3b30f84",p_=Object.freeze([Object.freeze({key:"ja_JP-tsukuyomi-chan-medium",repoId:"ayousanz/piper-plus-tsukuyomi-chan",onnxFile:"tsukuyomi-chan-6lang-fp16.onnx",configFile:"config.json",aliases:Object.freeze(["tsukuyomi","tsukuyomi-chan","ja-tsukuyomi","ayousanz/piper-plus-tsukuyomi-chan"])}),Object.freeze({key:"ja_JP-css10-6lang-medium",repoId:"ayousanz/piper-plus-css10-ja-6lang",onnxFile:"css10-ja-6lang-fp16.onnx",configFile:"config.json",aliases:Object.freeze(["css10","css10-6lang","css10-ja","ja-css10","ayousanz/piper-plus-css10-ja-6lang"])}),Object.freeze({key:"multilingual-zero-shot-base-zs-v1",repoId:"ayousanz/piper-plus-base",revision:"3620ed788667cb76f08bd6cf2db8152c1f4c8bd1",onnxFile:"releases/zs-v1/base.onnx",configFile:"releases/zs-v1/base.onnx.json",sha256:c_,aliases:Object.freeze(["base","zero-shot-base-zs-v1","ayousanz/piper-plus-base"])})]),$m=new Map(p_.flatMap(s=>[s.key,...s.aliases].map(i=>[i,s])));function h_(s){const i=`${Ia}/${s.repoId}/resolve/${s.revision??"main"}/`,r=i+s.onnxFile,u={modelUrl:r,configUrl:i+s.configFile,configFallbackUrl:null,cacheKey:s.revision?r:s.repoId};return s.sha256&&(u.sha256=s.sha256),u}const f_=[{repoId:"ayousanz/piper-plus-tsukuyomi-chan",names:["ja_JP-tsukuyomi-chan-medium","tsukuyomi","tsukuyomi-chan","ja-tsukuyomi"],lines:Object.freeze(["[piper-plus] つくよみちゃんモデルの利用条件 / Terms for the Tsukuyomi-chan model","生成した音声を使うときは「Piper Plus:つくよみちゃん」のクレジット表記が必須です。","Credit 'Piper Plus:つくよみちゃん' is required when you use the generated audio.","非公式の作品です。夢前黎様は開発・サポートに携わっていません。お問い合わせは開発者へ。","Unofficial work. Rei Yumesaki is not involved in development or support; contact the developer.","禁止事項と規約 / Terms and prohibited uses: https://huggingface.co/ayousanz/piper-plus-tsukuyomi-chan"]),files:["tsukuyomi-chan-6lang-fp16.onnx","tsukuyomi.onnx"]}],m_="(この表示は PIPER_PLUS_DISABLE_MODEL_NOTICE=1 で消せます / Set PIPER_PLUS_DISABLE_MODEL_NOTICE=1 to hide this notice.)",g_="PIPER_PLUS_DISABLE_MODEL_NOTICE",__=/^[a-z][a-z0-9+.-]*:\/\//i;let bf=!1;function Ta(s){var m;if(typeof s!="string"||s==="")return null;const i=__.test(s);let r=s;i&&(r=r.split(/[?#]/,1)[0]);const u=r.split(/[/\\]/),p=u[u.length-1];for(const y of f_)if(s===y.repoId||y.names.includes(s)||((m=$m.get(s))==null?void 0:m.repoId)===y.repoId||i&&s.includes(`/${y.repoId}/`)||y.files.includes(p))return y.lines;return null}function y_(s=(i=>(i=globalThis.process)==null?void 0:i.env)()){const r=s==null?void 0:s[g_];return typeof r!="string"?!1:["1","true","yes"].includes(r.trim().toLowerCase())}function bm(s,i={}){return!s||s.length===0||bf||i.showModelNotice===!1||y_()?!1:(bf=!0,(i.logger??(u=>console.warn(u)))([...s,m_].join(`
`)),!0)}function w_(s){return new Promise((i,r)=>{const u=globalThis.indexedDB.open(s,l_);u.onupgradeneeded=p=>{const m=p.target.result;m.objectStoreNames.contains(Ut)||m.createObjectStore(Ut),m.objectStoreNames.contains(Ft)||m.createObjectStore(Ft)},u.onsuccess=()=>i(u.result),u.onerror=()=>r(u.error)})}function bn(s){return new Promise((i,r)=>{s.onsuccess=()=>i(s.result),s.onerror=()=>r(s.error)})}async function vf(s,i){const r=await fetch(s);if(!r.ok)throw new Error(`Failed to fetch ${s}: ${r.status} ${r.statusText}`);if(!i||!r.body)return r.arrayBuffer();const u=r.headers.get("Content-Length"),p=u?parseInt(u,10):0,m=r.body.getReader(),y=[];let b=0;for(;;){const{done:P,value:O}=await m.read();if(P)break;y.push(O),b+=O.byteLength;const R=p>0?Math.round(b/p*100):0;i({loaded:b,total:p,percentage:R})}const $=new Uint8Array(b);let I=0;for(const P of y)$.set(P,I),I+=P.byteLength;return $.buffer}async function $_(s){const i=`${d_}/${s}`,r=await fetch(i);if(!r.ok)throw new Error(`Failed to query HuggingFace API for "${s}": ${r.status} ${r.statusText}`);const m=((await r.json()).siblings||[]).map(R=>R.rfilename),y=m.filter(R=>R.endsWith(".onnx"));if(y.length===0)throw new Error(`No .onnx file found in repository "${s}"`);const $=y.find(R=>R.includes("fp16"))||y[0],I=`${$}.json`,P=$.slice(0,$.lastIndexOf("/")+1)+"config.json";let O;if(m.includes(I))O=I;else if(m.includes(P))O=P;else throw new Error(`No config file found in repository "${s}"; expected "${I}" or "${P}"`);return{onnxFilename:$,configFilename:O}}class b_{constructor(i={}){this._dbName=i.cachePrefix||u_,this._db=null,this._verifyOnCacheHit=i.verifyOnCacheHit||!1,this._showModelNotice=i.showModelNotice!==!1}async _getDb(){return this._db||(this._db=await w_(this._dbName)),this._db}async _computeSha256(i){if(typeof globalThis.crypto>"u"||!globalThis.crypto.subtle||typeof globalThis.crypto.subtle.digest!="function")return null;try{const r=await globalThis.crypto.subtle.digest("SHA-256",i),u=new Uint8Array(r);return Array.from(u).map(p=>p.toString(16).padStart(2,"0")).join("")}catch{return null}}async _resolveUrls(i){const r=await this._resolveLocations(i);return r.notice=Ta(i)??Ta(r.modelUrl),r}async _resolveLocations(i){const r=$m.get(i);if(r)return h_(r);if(/^https?:\/\//i.test(i)){const $=i,I=$+".json",P=$.lastIndexOf("/"),O=P>=0?$.substring(0,P+1)+"config.json":null;return{modelUrl:$,configUrl:I,configFallbackUrl:O,cacheKey:$}}const u=i,{onnxFilename:p,configFilename:m}=await $_(u),y=`${Ia}/${u}/resolve/main/${p}`,b=`${Ia}/${u}/resolve/main/${m}`;return{modelUrl:y,configUrl:b,configFallbackUrl:null,cacheKey:u}}async resolveUrls(i){return this._resolveUrls(i)}async loadModel(i,r={}){const{onProgress:u}=r,{modelUrl:p,configUrl:m,configFallbackUrl:y,cacheKey:b,notice:$,sha256:I}=await this._resolveUrls(i);bm($,{showModelNotice:this._showModelNotice});const P=await this.getFromCache(b);if(P)return{...P,notice:$};let O=await fetch(m);if(O.status===404&&y&&(O=await fetch(y)),!O.ok){const he=y?`${m} and ${y}`:m;throw new Error(`Failed to fetch model config from ${he}: ${O.status} ${O.statusText}`)}const R=await O.json(),B=await vf(p,u),V=await this._computeSha256(B);if(V===null)console.warn("[piper-plus] crypto.subtle unavailable — skipping SHA-256 integrity verification. Serve over HTTPS for full integrity checks.");else{const he=I??R.sha256;if(he&&V!==he)throw new Error(`SHA-256 mismatch for downloaded model: expected ${he}, got ${V}`)}const Z=(await this._getDb()).transaction(Ut,"readwrite").objectStore(Ut);return await bn(Z.put({modelData:B,config:R,timestamp:Date.now(),sha256:V},b)),{modelData:B,config:R,notice:$}}async getFromCache(i){const p=(await this._getDb()).transaction(Ut,"readonly").objectStore(Ut),m=await bn(p.get(i));if(!m)return null;if(this._verifyOnCacheHit&&m.sha256){const y=await this._computeSha256(m.modelData);if(y!==null&&y!==m.sha256)return console.warn(`[piper-plus] Cached model "${i}" failed SHA-256 integrity check (expected ${m.sha256}, got ${y}). Re-downloading.`),null}return{modelData:m.modelData,config:m.config}}async getDictionaryFromCache(i){const p=(await this._getDb()).transaction(Ft,"readonly").objectStore(Ft),m=await bn(p.get(i));return m?m.data:null}async cacheDictionary(i,r){const m=(await this._getDb()).transaction(Ft,"readwrite").objectStore(Ft);await bn(m.put({data:r,timestamp:Date.now()},i))}async fetchAndCacheDictionary(i,r,u={}){const p=await this.getDictionaryFromCache(r);if(p)return p;const m=await vf(i,u.onProgress);return await this.cacheDictionary(r,m),m}async clearCache(){const r=(await this._getDb()).transaction([Ut,Ft],"readwrite");await bn(r.objectStore(Ut).clear()),await bn(r.objectStore(Ft).clear())}}let Kn=null;function v_(){if(!Kn){const s=globalThis.AudioContext||globalThis.webkitAudioContext;if(!s)throw new Error("AudioContext is not available in this environment");Kn=new s}return Kn.state==="suspended"&&Kn.resume().catch(s=>{typeof console<"u"&&console.warn&&console.warn("[piper-plus] AudioContext.resume() failed:",s)}),Kn}function x_(s,i){const m=s.length*2,y=44,b=new ArrayBuffer(y+m),$=new DataView(b);Li($,0,"RIFF"),$.setUint32(4,36+m,!0),Li($,8,"WAVE"),Li($,12,"fmt "),$.setUint32(16,16,!0),$.setUint16(20,1,!0),$.setUint16(22,1,!0),$.setUint32(24,i,!0),$.setUint32(28,i*1*2,!0),$.setUint16(32,1*2,!0),$.setUint16(34,16,!0),Li($,36,"data"),$.setUint32(40,m,!0);const I=y;for(let P=0;P<s.length;P++){const O=Math.max(-1,Math.min(1,s[P])),R=O<0?O*32768:O*32767;$.setInt16(I+P*2,R,!0)}return b}function Li(s,i,r){for(let u=0;u<r.length;u++)s.setUint8(i+u,r.charCodeAt(u))}function E_(s){if(s&&Array.isArray(s.phonemes)){for(const i of s.phonemes)Object.freeze(i);Object.freeze(s.phonemes)}return Object.freeze(s)}var zt,jt,Sn;class oa{constructor(i,r=22050,u=null){Ri(this,zt,void 0);Ri(this,jt,void 0);Ri(this,Sn,void 0);if(!(i instanceof Float32Array))throw new TypeError("samples must be a Float32Array");if(typeof r!="number"||r<=0)throw new TypeError("sampleRate must be a positive number");Di(this,zt,i),Di(this,jt,r),Di(this,Sn,u!=null?E_(u):null)}get samples(){return ut(this,zt)}get sampleRate(){return ut(this,jt)}get duration(){return ut(this,zt).length/ut(this,jt)}get timing(){return ut(this,Sn)}get hasTimingInfo(){return ut(this,Sn)!=null}async play(){const i=v_(),r=i.createBuffer(1,ut(this,zt).length,ut(this,jt));r.copyToChannel(ut(this,zt),0);const u=i.createBufferSource();return u.buffer=r,u.connect(i.destination),new Promise(p=>{u.onended=()=>p(),u.start()})}toBlob(){const i=this.toWav();return new Blob([i],{type:"audio/wav"})}toWav(){return x_(ut(this,zt),ut(this,jt))}download(i="output.wav"){const r=this.toBlob(),u=URL.createObjectURL(r),p=document.createElement("a");p.href=u,p.download=i,p.style.display="none",document.body.appendChild(p),p.click(),setTimeout(()=>{document.body.removeChild(p),URL.revokeObjectURL(u)},100)}}zt=new WeakMap,jt=new WeakMap,Sn=new WeakMap;const xf=16e3,En=80,bt=400,Ef=160,pn=512,k_=.97,S_=20,I_=11920928955078125e-23,T_={lowpassFilterWidth:64,rolloff:.9475937167399596,beta:14.769656459379492};function A_(s,i){for(;i;)[s,i]=[i,s%i];return s}function kf(s){const i=s*s/4;let r=1,u=1;for(let p=1;r>u*1e-17;p++)r*=i/(p*p),u+=r;return u}const Sf=new Map;function z_(s,i){const r=`${s}:${i}`,u=Sf.get(r);if(u)return u;const{lowpassFilterWidth:p,rolloff:m,beta:y}=T_,b=Math.min(s,i)*m,$=Math.ceil(p*s/b),I=2*$+s,P=b/s,O=kf(y),R=new Float64Array(i*I);for(let V=0;V<i;V++)for(let G=0;G<I;G++){let te=(-V/i+(G-$)/s)*b;te=Math.max(-p,Math.min(p,te));const Z=te/p,he=kf(y*Math.sqrt(1-Z*Z))/O,fe=te*Math.PI;R[V*I+G]=(fe===0?1:Math.sin(fe)/fe)*he*P}const B={kernel:R,width:$,taps:I};return Sf.set(r,B),B}function C_(s,i,r){for(const R of[i,r])if(!Number.isInteger(R)||R<=0)throw new RangeError(`sample rate must be a positive integer, got ${R}`);if(i===r)return s;const u=A_(i,r),p=i/u,m=r/u,{kernel:y,width:b,taps:$}=z_(p,m),I=s.length,P=Math.ceil(m*I/p),O=new Float32Array(P);for(let R=0;R<P;R++){const B=Math.floor(R/m),V=R-B*m,G=B*p-b,te=V*$,Z=Math.max(0,-G),he=Math.min($,I-G);let fe=0;for(let me=Z;me<he;me++)fe+=s[G+me]*y[te+me];O[R]=fe}return O}function ua(s){return 1127*Math.log(1+s/700)}let Ni=null,Ui=null,la=null;function O_(){if(!Ni){Ni=new Float64Array(bt);for(let s=0;s<bt;s++){const i=.5-.5*Math.cos(2*Math.PI*s/(bt-1));Ni[s]=Math.pow(i,.85)}}return Ni}function M_(){if(!Ui){const s=pn/2,i=xf/pn,r=ua(S_),p=(ua(xf/2)-r)/(En+1);Ui=new Float64Array(En*s);for(let m=0;m<En;m++){const y=r+m*p,b=r+(m+1)*p,$=r+(m+2)*p;for(let I=0;I<s;I++){const P=ua(i*I),O=(P-y)/(b-y),R=($-P)/($-b);Ui[m*s+I]=Math.max(0,Math.min(O,R))}}}return Ui}function P_(){if(!la){const s=pn,i=Math.log2(s),r=new Uint16Array(s);for(let m=0;m<s;m++){let y=0;for(let b=0;b<i;b++)y=y<<1|m>>b&1;r[m]=y}const u=new Float64Array(s/2),p=new Float64Array(s/2);for(let m=0;m<s/2;m++)u[m]=Math.cos(2*Math.PI*m/s),p[m]=-Math.sin(2*Math.PI*m/s);la={reverse:r,cos:u,sin:p}}return la}function R_(s,i){const r=pn,{reverse:u,cos:p,sin:m}=P_();for(let y=0;y<r;y++){const b=u[y];b>y&&([s[y],s[b]]=[s[b],s[y]],[i[y],i[b]]=[i[b],i[y]])}for(let y=2;y<=r;y<<=1){const b=y>>1,$=r/y;for(let I=0;I<r;I+=y)for(let P=0;P<b;P++){const O=p[P*$],R=m[P*$],B=I+P,V=B+b,G=s[V]*O-i[V]*R,te=s[V]*R+i[V]*O;s[V]=s[B]-G,i[V]=i[B]-te,s[B]+=G,i[B]+=te}}}function D_(s){const i=s.length>=bt?1+Math.floor((s.length-bt)/Ef):0,r=pn/2,u=O_(),p=M_(),m=new Float32Array(i*En),y=new Float64Array(bt),b=new Float64Array(pn),$=new Float64Array(pn),I=new Float64Array(r);for(let P=0;P<i;P++){const O=P*Ef;let R=0;for(let B=0;B<bt;B++)y[B]=s[O+B],R+=y[B];R/=bt;for(let B=0;B<bt;B++)y[B]-=R;b.fill(0),$.fill(0);for(let B=bt-1;B>=0;B--){const V=B>0?y[B-1]:y[0];b[B]=(y[B]-k_*V)*u[B]}R_(b,$);for(let B=0;B<r;B++)I[B]=b[B]*b[B]+$[B]*$[B];for(let B=0;B<En;B++){let V=0;const G=B*r;for(let te=0;te<r;te++)V+=p[G+te]*I[te];m[P*En+B]=Math.log(Math.max(V,I_))}}return m}const Yn=16e3,Wt=400,If=160,Ze=80,B_=20,L_=7600,N_=new Set(["mel","kaldi-fbank"]);class Wa{constructor(){this._session=null,this._ort=null,this._frontEnd="mel"}static async initialize(i={}){const r=new Wa,u=i.ort||globalThis.ort;if(!u)throw new Error("onnxruntime-web is required. Pass it via options.ort or load it globally.");r._ort=u;const p=i.frontEnd??"mel";if(!N_.has(p))throw new Error(`options.frontEnd must be "mel" or "kaldi-fbank", got ${p}`);r._frontEnd=p;const m=i.modelData??i.modelUrl;if(!m)throw new Error("options.modelUrl or options.modelData is required for SpeakerEncoder");return r._session=await u.InferenceSession.create(m,{executionProviders:["wasm"],graphOptimizationLevel:p==="kaldi-fbank"?"disabled":"all"}),r}async encode(i,r){if(!this._session)throw new Error("SpeakerEncoder not initialized. Call SpeakerEncoder.initialize() first.");let u,p;if(typeof AudioBuffer<"u"&&i instanceof AudioBuffer)u=i.getChannelData(0),p=i.sampleRate;else if(i instanceof Float32Array)u=i,p=r||Yn;else throw new TypeError("audio must be an AudioBuffer or Float32Array");if(u.length===0)throw new Error("Audio samples cannot be empty");const m=this._frontEnd==="kaldi-fbank";let y=u;p!==Yn&&(y=m?C_(u,p,Yn):W_(u,p,Yn));const b=m?U_(D_(y)):V_(y),$=b.length/Ze;if($===0)throw new Error("Audio is too short for mel spectrogram computation");const I=this._ort,P=new I.Tensor("float32",b,[1,$,Ze]),O=this._session.inputNames&&this._session.inputNames[0]||"feats",R=await this._session.run({[O]:P}),B=R.output||R[Object.keys(R)[0]],V=new Float32Array(B.data);return m?F_(V):V}dispose(){this._session&&(typeof this._session.release=="function"&&this._session.release(),this._session=null),this._ort=null}}function U_(s){const i=s.length/Ze;for(let r=0;r<Ze;r++){let u=0;for(let m=0;m<i;m++)u+=s[m*Ze+r];const p=u/i;for(let m=0;m<i;m++)s[m*Ze+r]-=p}return s}function F_(s){let i=0;for(const u of s)i+=u*u;const r=Math.sqrt(i);if(!Number.isFinite(r)||r===0)throw new Error("Speaker encoder returned a zero or non-finite embedding");return s.map(u=>u/r)}function W_(s,i,r){if(i===r)return s;const u=i/r,p=Math.ceil(s.length/u),m=new Float32Array(p);for(let y=0;y<p;y++){const b=y*u,$=Math.floor(b),I=b-$;$+1<s.length?m[y]=s[$]*(1-I)+s[$+1]*I:$<s.length&&(m[y]=s[$])}return m}const J=Math.fround;function V_(s){const i=q_(),r=j_(Wt),u=s.length>=Wt?Math.floor((s.length-Wt)/If)+1:0,p=Math.floor(Wt/2)+1,m=new Float32Array(u*Ze);for(let y=0;y<u;y++){const b=y*If,$=new Float32Array(p);for(let I=0;I<p;I++){let P=J(0),O=J(0);const R=J(J(-2*Math.PI)*J(I)/J(Wt));for(let B=0;B<Wt;B++){const V=b+B<s.length?J(J(s[b+B])*J(r[B])):J(0),G=J(R*J(B));P=J(P+J(V*J(Math.cos(G)))),O=J(O+J(V*J(Math.sin(G))))}$[I]=J(J(P*P)+J(O*O))}for(let I=0;I<Ze;I++){let P=J(0);for(let O=0;O<p;O++)P=J(P+J(i[I*p+O]*$[O]));m[y*Ze+I]=J(Math.log(Math.max(J(P),1e-10)))}}if(u>0)for(let y=0;y<Ze;y++){let b=J(0);for(let I=0;I<u;I++)b=J(b+m[I*Ze+y]);const $=J(b/J(u));for(let I=0;I<u;I++)m[I*Ze+y]=J(m[I*Ze+y]-$)}return m}function j_(s){const i=new Float32Array(s);for(let r=0;r<s;r++)i[r]=J(J(.5)*J(1-Math.cos(J(2*Math.PI)*J(r)/J(s))));return i}function q_(){const s=Math.floor(Wt/2)+1,i=new Float32Array(Ze*s),r=Tf(J(B_)),u=Tf(J(L_)),p=[];for(let y=0;y<=Ze+1;y++)p.push(J(r+J(J(u-r)*J(y)/J(Ze+1))));const m=p.map(y=>J(J(G_(y))*J(Wt)/J(Yn)));for(let y=0;y<Ze;y++){const b=Math.floor(m[y]);let $=Math.floor(m[y+1]),I=Math.floor(m[y+2]);b===$&&$===I?($=Math.min($+1,s-1),I=Math.min(I+2,s-1)):b===$&&($=Math.min($+1,s-1)),$===I&&(I=Math.min(I+1,s-1));for(let P=b;P<$;P++)$>b&&(i[y*s+P]=J(J(P-b)/J($-b)));for(let P=$;P<I;P++)I>$&&(i[y*s+P]=J(J(I-P)/J(I-$)));$<s&&(i[y*s+$]=Math.max(i[y*s+$],1))}return i}function Tf(s){return J(J(2595)*J(Math.log10(J(1+J(s)/J(700)))))}function G_(s){return J(J(700)*J(Math.pow(10,J(s)/J(2595))-1))}function H_(s){const i=new Set(s.inputNames||[]),r=(m,y,b)=>{if(!i.has(m))return null;if(!Array.isArray(s.inputMetadata))throw new Error("ONNX inputMetadata is required for speaker inputs; use onnxruntime-web >=1.22.0.");const $=s.inputMetadata.find(P=>P.name===m);if(!$)throw new Error(`${m}: missing ONNX input metadata.`);if($.isTensor===!1||$.type!==y||!Array.isArray($.shape)||!b.includes($.shape.length))throw new Error(`${m}: expected ${y} tensor of rank ${b.join(" or ")}.`);const I=$.shape[0];if(I!==1&&typeof I!="string")throw new Error(`${m}: only batch size 1 is supported; declared ${I}.`);return{shape:[...$.shape]}},u=r("speaker_embedding","float32",[2]);if(u){const m=u.shape[1];if(typeof m!="string"&&(!Number.isSafeInteger(m)||m<=0))throw new Error(`speaker_embedding: invalid declared dimension ${m}.`)}const p=r("speaker_embedding_mask","int64",[1,2]);if(p&&p.shape.length===2&&p.shape[1]!==1)throw new Error("speaker_embedding_mask: expected shape [batch, 1].");return{embedding:u,mask:p}}function Af(s,i,r){const u=r!=null,{embedding:p,mask:m}=i;if(u&&!(r instanceof Float32Array))throw new TypeError("speaker_embedding must be a Float32Array.");if(u&&!p)throw new Error("speaker_embedding is not an input of the loaded model.");const y={};if(p){const b=p.shape[1],$=typeof b=="string";if(!u&&$)throw new Error("speaker_embedding has a dynamic dimension; provide an explicit speakerEmbedding.");const I=$?r.length:b;if(u&&(r.length===0||r.length!==I))throw new Error(`speaker_embedding: expected ${I} values, got ${r.length}.`);if(u&&!r.every(Number.isFinite))throw new Error("speaker_embedding must contain only finite values.");y.speaker_embedding=new s.Tensor("float32",u?r:new Float32Array(I),[1,I])}return m&&(y.speaker_embedding_mask=new s.Tensor("int64",new BigInt64Array([u?1n:0n]),m.shape.length===1?[1]:[1,1])),y}const K_={"a:":"","i:":"","u:":"","e:":"","o:":"",cl:"",ky:"",kw:"",gy:"",gw:"",sh:"",ch:"",ts:"",ny:"",hy:"",my:"",ry:"",ty:"",dy:"",by:"",py:"",N_m:"",N_n:"",N_ng:"",N_uvular:""},Z_=/-([^-+]+)\+/,X_=/\/A:([\d-]+)\+/,zf=/\+([0-9]+)\+/,Y_=/\+([0-9]+)\//,J_=new Set(["_","#","[","]","^","$","?","?!","?.","?~"]);function Q_(s){const i=[];for(let r=0;r<s.length;r++){if(s[r]!=="N"){i.push(s[r]);continue}let u=null;for(let p=r+1;p<s.length;p++)if(!J_.has(s[p])){u=s[p];break}u===null?i.push("N_uvular"):["m","my","b","by","p","py"].includes(u)?i.push("N_m"):["n","ny","t","ty","d","dy","ts","ch"].includes(u)?i.push("N_n"):["k","ky","kw","g","gy","gw"].includes(u)?i.push("N_ng"):i.push("N_uvular")}return i}function ey(s){return s.map(i=>K_[i]||i)}function ty(s){const i=s.split(`
`).filter(y=>y.trim()),r=[],u=[];for(let y=0;y<i.length;y++){const b=i[y],$=b.match(Z_);if(!$)continue;const I=$[1];if(I==="sil"){y===0?(r.push("^"),u.push(null)):y===i.length-1&&(r.push("$"),u.push(null));continue}if(I==="pau"){r.push("_"),u.push(null);continue}const P=b.match(X_),O=b.match(zf),R=b.match(Y_);let B=null,V=null,G=null;if(P&&O&&R&&(B=parseInt(P[1],10),V=parseInt(O[1],10),G=parseInt(R[1],10)),r.push(I),u.push(B!==null?{a1:B,a2:V,a3:G}:null),B===null)continue;let te=-1;if(y<i.length-1){const Z=i[y+1].match(zf);Z&&(te=parseInt(Z[1],10))}B===0&&te===V+1&&(r.push("]"),u.push(null)),V===G&&te===1&&(r.push("#"),u.push(null)),V===1&&te===2&&(r.push("["),u.push(null))}const p=Q_(r);return{tokens:ey(p),prosody:u}}const ny=/[\u000B\u000C\u0085]/g,iy=/[\u0000-\u0008\u000E-\u001F\u007F-\u0084\u0086-\u009F]/g;function De(s){return typeof s!="string"?s:s.replace(ny," ").replace(iy,"")}const Cf=["char.bin","matrix.bin","sys.dic","unk.dic","left-id.def","pos-id.def","rewrite.def","right-id.def"];class sy{constructor(i={}){this._openjtalkModule=i.openjtalkModule||null,this._jaDict=i.jaDict||null,this._initialized=!1}get initialized(){return this._initialized}async initialize(i={}){const r=this._openjtalkModule||i.openjtalkModule,u=this._jaDict||i.jaDict;if(!r)throw new Error("openjtalkModule is required. Pass it via new JapaneseG2P({ openjtalkModule }) or initialize({ openjtalkModule }).");this._openjtalkModule=r,u&&this._loadDict(u);const p=r.allocateUTF8("/dict"),m=r._openjtalk_initialize(p);if(r._free(p),m!==0)throw new Error(`OpenJTalk initialization failed with code: ${m}`);this._initialized=!0}phonemize(i){i=De(i);const{tokens:r}=this._synthesizeLabelsAndExtract(i);return{tokens:r,prosody:r.map(()=>null)}}phonemizeWithProsody(i){return i=De(i),this._synthesizeLabelsAndExtract(i)}dispose(){this._openjtalkModule&&this._openjtalkModule._openjtalk_clear&&this._openjtalkModule._openjtalk_clear(),this._initialized=!1}_synthesizeLabelsAndExtract(i){if(!this._initialized)throw new Error("JapaneseG2P is not initialized. Call initialize() first.");const r=this._openjtalkModule,u=r.allocateUTF8(i),p=r._openjtalk_synthesis_labels(u),m=r.UTF8ToString(p);if(r._openjtalk_free_string(p),r._free(u),m.startsWith("ERROR:"))throw new Error(`OpenJTalk synthesis failed: ${m}`);return ty(m)}_loadDict(i){const r=this._openjtalkModule,u=i.dictFiles||i.dictData;if(!u)throw new Error("jaDict must have { dictFiles: { [filename]: ArrayBuffer } }.");const p=Cf.filter(m=>!(u[m]instanceof ArrayBuffer));if(p.length>0)throw new Error(`Missing required dictionary files: ${p.join(", ")}. All 8 OpenJTalk dictionary files must be provided.`);try{r.FS.mkdir("/dict")}catch{}for(const m of Cf)r.FS.writeFile(`/dict/${m}`,new Uint8Array(u[m]))}}let qt=null,Fi=null;const ry="../../data/cmudict_data.json";function Va(s){if(s instanceof Map)return s;if(!s||typeof s!="object")throw new TypeError("CMU dictionary must be an object mapping words to ARPAbet strings");const i=new Map;for(const[r,u]of Object.entries(s))typeof u=="string"&&i.set(r,u);return i}function vm(){return qt?Promise.resolve(qt):(Fi||(Fi=In(()=>import("./cmudict_data-eedadc10.js"),[],import.meta.url).then(s=>(qt??(qt=Va(s.default)),qt),s=>{throw Fi=null,s})),Fi)}function ay(){var u;if(qt)return qt;const s=(u=globalThis.process)==null?void 0:u.getBuiltinModule;if(typeof s!="function")return null;let i;try{i=new URL(ry,import.meta.url)}catch{return null}const r=s.call(globalThis.process,"node:fs");return i.protocol!=="file:"||!r||typeof r.readFileSync!="function"?null:(qt=Va(JSON.parse(r.readFileSync(i,"utf8"))),qt)}const oy=/([0-9][0-9,]+[0-9])/g,uy=/£([0-9,]*[0-9]+)/g,ly=/\$([0-9.,]*[0-9]+)/g,dy=/([0-9]+\.[0-9]+)/g,cy=/[0-9]+(st|nd|rd|th)/g,py=/[0-9]+/g,hy=/\s+,/g,fy=/, (\S+)\s+$/,my=/\s+/g,hs=["","one","two","three","four","five","six","seven","eight","nine"],gy=["ten","eleven","twelve","thirteen","fourteen","fifteen","sixteen","seventeen","eighteen","nineteen"],_y=["","","twenty","thirty","forty","fifty","sixty","seventy","eighty","ninety"],Tn=[" "," thousand"," million"," billion"," trillion"," quadrillion"," quintillion"],yy=["zero","one","two","three","four","five","six","seven","eight","nine"],wy=[["ty","tieth"],["one","first"],["two","second"],["three","third"],["five","fifth"],["eight","eighth"],["nine","ninth"],["twelve","twelfth"]];function $y(s){let i=s.replace(oy,(r,u)=>u.replace(/,/g,""));return i=i.replace(uy,"$1 pounds"),i=i.replace(ly,(r,u)=>by(u)),i=i.replace(dy,(r,u)=>u.replace(/\./g," point ")),i=i.replace(cy,r=>vy(r)),i.replace(py,r=>xy(r))}function as(s){const i=s.replace(/[^0-9]/g,"").replace(/^0+/,"");return i===""?"0":i}function by(s){const i=s.split(".");if(i.length>2)return`${s} dollars`;const r=as(i[0]??""),u=as(i[1]??""),p=r==="1"?"dollar":"dollars",m=u==="1"?"cent":"cents";return r!=="0"&&u!=="0"?`${r} ${p}, ${u} ${m}`:r!=="0"?`${r} ${p}`:u!=="0"?`${u} ${m}`:"zero dollars"}function vy(s){return Sy(os(as(s.slice(0,-2)),"and"))}function xy(s){const i=as(s);if(i.length===4){const r=Number(i);if(r>1e3&&r<3e3)return Ey(r)}return os(i,"")}function Ey(s){if(s===2e3)return"two thousand";if(s>2e3&&s<2010)return`two thousand ${os(String(s%100),"and")}`;if(s%100===0)return`${os(String(s/100),"and")} hundred`;const i=s%100,r=i<10?`oh ${hs[i]}`:ii(Math.floor(i/10),i%10,0).trimEnd(),u=Math.floor(s/100);return`${ii(Math.floor(u/10),u%10,0).trimEnd()} ${r}`}function ii(s,i,r){if(s===1)return`${gy[i]}${Tn[r]}`;const u=s>0&&i>0?"-":"";return`${_y[s]}${u}${hs[i]}${Tn[r]}`}function ky(s,i,r,u,p){if(s>0){const m=i>0||r>0?` ${p} `:"";return`${hs[s]} hundred${m}${ii(i,r,0)}${Tn[u]}, `}return i>0||r>0?`${ii(i,r,0)}${Tn[u]}, `:""}function os(s,i){if(s==="0")return"zero";if(s==="1")return"one";const r=[...s].map(y=>y.charCodeAt(0)-48);if(r.length>3*Tn.length)return r.map(y=>yy[y]).join(" ");const u=Math.floor(r.length/3),p=r.length%3;let m="";p===2?m+=`${ii(r[0],r[1],u)}, `:p===1&&(m+=`${hs[r[0]]}${Tn[u]}, `);for(let y=0;y<u;y++){const b=p+3*y;m+=ky(r[b],r[b+1],r[b+2],u-1-y,i)}return m.endsWith(", ")&&(m=m.slice(0,-2)),m=m.replace(hy,","),m=m.replace(fy,(y,b)=>` ${i} ${b}`),m.replace(my," ").trim()}function Sy(s){for(const[i,r]of wy)if(s.endsWith(i))return s.slice(0,-i.length)+r;return`${s}th`}const Iy="AAAAAA-CEEEEIIII-NOOOOO--UUUUY--aaaaaa-ceeeeiiii-nooooo--uuuuy-yAaAaAaCcCcCcCcDd--EeEeEeEeEeGgGgGgGgHh--IiIiIiIiI---JjKk-LlLlLl----NnNnNn---OoOoOo--RrRrRrSsSsSsSsTtTt--UuUuUuUuUuUuWwYyYZzZzZz---------------------------------Oo-------------Uu----------------------------AaIiOoUuUuUuUuUu-AaAa----GgKkOoOo--j---Gg--NnAa----AaAaEeEeIiIiOoOoRrRrUuUuSsTt--Hh------AaEeOoOoOoOoYy----------------------------",Ty="AaBbBbBbCcDdDdDdDdDdEeEeEeEeEeFfGgHhHhHhHhHhIiIiKkKkKkLlLlLlLlMmMmMmNnNnNnNnOoOoOoOoPpPpRrRrRrRrSsSsSsSsSsTtTtTtTtUuUuUuUuUuVvVvWwWwWwWwWwXxXxYyZzZzZzhtwy------AaAaAaAaAaAaAaAaAaAaAaAaEeEeEeEeEeEeEeEeIiIiOoOoOoOoOoOoOoOoOoOoOoOoUuUuUuUuUuUuUuYyYyYyYy------",Ay=/^[\t\n\v\f\r \u0085\u00a0\u1680\u2000-\u200a\u2028\u2029\u202f\u205f\u3000]$/,zy=/^[A-Za-z '.,?!-]$/;function Cy(s){let i="-";return s>=192&&s<=591?i=Iy[s-192]??"-":s>=7680&&s<=7935?i=Ty[s-7680]??"-":s===8490?i="K":s===8491&&(i="A"),i==="-"?null:i}function Oy(s){let i="";for(const r of s){let u=r;if(Ay.test(r))u=" ";else{const p=r.codePointAt(0)??0;p>127&&(u=Cy(p)??"")}u&&zy.test(u)&&(i+=u)}return i}function kn(s){return s>="a"&&s<="z"||s>="A"&&s<="Z"}function My(s){return kn(s)||s>="0"&&s<="9"}function Py(s){let i="",r=0;for(;r<s.length;){const u=s[r];let p=r+1;for(;p<s.length&&s[p]===u;)p++;i+=u.repeat(My(u)?p-r:Math.min(p-r,3)),r=p}return i}function Aa(s,i){let r=i;for(;r<s.length&&kn(s[r]);)r++;return r}function Ry(s,i){let r=Aa(s,i);if(r===i)return null;const u=[];for(;r+1<s.length&&(s[r]==="."||s[r]==="-")&&kn(s[r+1]);){const p=Aa(s,r+1);u.push([s[r],r+1,p]),r=p}for(let p=Math.min(u.length-1,126);p>=0;p--){const[m,y,b]=u[p];if(m==="."&&b-y>=2&&b-y<=13)return b}return null}function Dy(s,i){if(!kn(s[i]))return null;let r=i+1;for(;r<s.length&&(kn(s[r])||s[r]==="'"||s[r]==="-");)r++;for(let u=r-1;u>=i+2;u--)if(kn(s[u]))return u+1;return null}function By(s,i){if(s[i]!==".")return null;let r=null,u=i+1;for(;;){let p=u;for(;p<s.length&&s[p]===" ";)p++;if(p<s.length&&s[p]===".")r=p+1,u=p+1;else return r}}function Ly(s){const i=Py(s),r=[];let u=0;for(;u<i.length;){if(i[u]===" "){u++;continue}let p=Ry(i,u)??Dy(i,u);if(p===null){const m=Aa(i,u);p=m>u?m:By(i,u)??u+1}r.push(i.slice(u,p)),u=p}return r}function Ny(s){let i=Oy($y(s));return i=i.replace(/i\.e\./gi,"that is"),i=i.replace(/e\.g\./gi,"for example"),Ly(i)}const Of={AA:"ɑ",AE:"æ",AH:"ʌ",AO:"ɔː",AW:"aʊ",AY:"aɪ",B:"b",CH:"tʃ",D:"d",DH:"ð",EH:"ɛ",ER:"ɚ",EY:"eɪ",F:"f",G:"ɡ",HH:"h",IH:"ɪ",IY:"iː",JH:"dʒ",K:"k",L:"l",M:"m",N:"n",NG:"ŋ",OW:"oʊ",OY:"ɔɪ",P:"p",R:"ɹ",S:"s",SH:"ʃ",T:"t",TH:"θ",UH:"ʊ",UW:"uː",V:"v",W:"w",Y:"j",Z:"z",ZH:"ʒ"},Uy="ə",Fy=new Set([",",".",";",":","!","?"]),Wy=new Set(["a","an","the","i","me","my","mine","myself","you","your","yours","yourself","he","him","his","himself","she","her","hers","herself","it","its","itself","we","us","our","ours","ourselves","they","them","their","theirs","themselves","am","is","are","was","were","be","been","being","have","has","had","having","do","does","did","will","would","shall","should","can","could","may","might","must","at","by","for","from","in","of","on","to","with","about","after","before","between","into","through","under","and","but","or","nor","so","yet","if","that","than","when","while","as","because","since","not","no"]);function Vy(s){return(s.match(/[a-zA-Z']+/g)??[]).map(i=>i.toLowerCase())}function jy(s){return s.length===1&&Fy.has(s)}const qy=new Map([["a","EY1"],["b","B IY1"],["c","S IY1"],["d","D IY1"],["e","IY1"],["f","EH1 F"],["g","JH IY1"],["h","EY1 CH"],["i","AY1"],["j","JH EY1"],["k","K EY1"],["l","EH1 L"],["m","EH1 M"],["n","EH1 N"],["o","OW1"],["p","P IY1"],["q","K Y UW1"],["r","AA1 R"],["s","EH1 S"],["t","T IY1"],["u","Y UW1"],["v","V IY1"],["w","D AH1 B AH0 L Y UW0"],["x","EH1 K S"],["y","W AY1"],["z","Z IY1"]]);function Mf(s){return s>="A"&&s<="Z"}function Wi(s){return s>="a"&&s<="z"}function Gy(s){const i=(p,m)=>{let y=p;for(;y<s.length&&m(s[y]);)y++;return y},r=[];let u=0;for(;u<s.length;)if(Mf(s[u])){const p=i(u,Mf),m=p<s.length&&Wi(s[p]);if(m&&p-u>=2)r.push(s.slice(u,p-1)),u=p-1;else if(m){const y=i(p,Wi);r.push(s.slice(u,y)),u=y}else r.push(s.slice(u,p)),u=p}else if(Wi(s[u])){const p=i(u,Wi);r.push(s.slice(u,p)),u=p}else u++;return r}function Hy(s){return s.split(/\s+/).filter(i=>i).map(i=>{const r=i[i.length-1];return i.length>1&&(r==="0"||r==="1"||r==="2")?[i.slice(0,-1),Number(r)]:[i,-1]})}function Ky(s){const i=[];let r=0;for(;r<s.length;){const[u,p]=s[r],m=s[r+1];if(u==="AA"&&m&&m[0]==="R"&&m[1]===-1){i.push(["ɑːɹ",p]),r+=2;continue}u==="ER"&&p===1?i.push(["ɜː",p]):u==="AH"&&p===0?i.push([Uy,p]):Object.hasOwn(Of,u)&&i.push([Of[u],p]),r+=1}return i}function Zy(s,i){const r=s.length,u=(m,y)=>{const b=i.get(m);return b===void 0?null:`${b} ${y}`},p=m=>m.length>=2&&m[m.length-1]===m[m.length-2];if(r>4&&s.endsWith("ing")){const m=s.slice(0,-3),y=u(m,"IH0 NG")??(p(m)?u(m.slice(0,-1),"IH0 NG"):null)??u(`${m}e`,"IH0 NG");if(y!==null)return y}if(r>3&&s.endsWith("ed")){const m=s.slice(0,-2),y=u(m,"D")??(p(m)?u(m.slice(0,-1),"D"):null)??u(s.slice(0,-1),"D");if(y!==null)return y}if(r>2&&s.endsWith("s")){const m=(r>4&&s.endsWith("ies")?u(`${s.slice(0,-3)}y`,"Z"):null)??(r>3&&s.endsWith("es")?u(s.slice(0,-2),"IH0 Z"):null)??u(s.slice(0,-1),"Z");if(m!==null)return m}if(r>3&&s.endsWith("er")){const m=s.slice(0,-2),y=u(m,"ER0")??(p(m)?u(m.slice(0,-1),"ER0"):null);if(y!==null)return y}if(r>3&&s.endsWith("ly")){const m=u(s.slice(0,-2),"L IY0")??(r>4&&s[r-3]==="i"?u(`${s.slice(0,-3)}y`,"L IY0"):null);if(m!==null)return m}return r>4&&s.endsWith("est")?u(s.slice(0,-3),"AH0 S T"):null}const Xy="EnglishG2P: the CMU dictionary is not loaded. Call `await englishG2P.initialize()` (EnglishG2P.create() and G2P.create() do this) before phonemizing, or pass a preloaded dictionary as `new EnglishG2P({ cmuDict })`.";class ja{constructor(i={}){this._options=i,this._dict=i.cmuDict?Va(i.cmuDict):null}static async create(i={}){const r=new ja(i);return await r.initialize(),r}async initialize(){return this._dict||(this._dict=await vm()),this}get isInitialized(){return this._dict!==null}_requireDict(){if(!this._dict&&(this._dict=ay(),!this._dict))throw new Error(Xy);return this._dict}_lookup(i){const r=this._requireDict(),u=i.toLowerCase();return r.get(u)??Zy(u,r)}_wordArpabet(i){const r=this._lookup(i);if(r!==null)return r;const u=y=>{const b=y.map($=>this._wordArpabet($)).filter($=>$!==null);return b.length>0?b.join(" "):null};if(i.includes("-")||i.includes("."))return u(i.split(/[-.]/).filter(y=>y));if(i.includes("'"))return this._wordArpabet(i.replace(/'/g,""));const p=Gy(i);if(p.length>1)return u(p);const m=[...i.toLowerCase()].map(y=>qy.get(y)).filter(y=>y!==void 0);return m.length>0?m.join(" "):null}_phonemize(i){const r=[],u=[];if(!i||typeof i!="string")return{tokens:r,prosody:u};const p=Ny(i),m=Vy(i);let y=!1,b=0;for(const $ of p){const I=jy($);let P;if(/[A-Za-z]/.test($)){const R=this._wordArpabet($);if(R===null)continue;P=Ky(Hy(R))}else P=[[$,-1]];I||(b<m.length&&(Wy.has(m[b])&&(P=P.map(([R,B])=>[R,B>=1?0:B])),b+=1),y&&(r.push(" "),u.push({a1:0,a2:0,a3:0})));const O=P.reduce((R,[B])=>R+[...B].length,0);for(const[R,B]of P){const V=B===1?2:B===2?1:0;B===1?(r.push("ˈ"),u.push({a1:0,a2:V,a3:O})):B===2&&(r.push("ˌ"),u.push({a1:0,a2:V,a3:O}));for(const G of R)r.push(G),u.push({a1:0,a2:V,a3:O})}y=!0}return{tokens:r,prosody:u}}phonemize(i){i=De(i);const{tokens:r}=this._phonemize(i);return{tokens:r,prosody:new Array(r.length).fill(null)}}phonemizeWithProsody(i){return i=De(i),this._phonemize(i)}}class Pf{constructor(i,r){this._single=i,this._phrases=r}lookupChar(i){const r=String(i);if(!Object.hasOwn(this._single,r))return null;let u=this._single[r];return Array.isArray(u)&&(u=u[0]),typeof u!="string"||u===""?null:u.split(",")[0]}lookupPhrase(i){if(!Object.hasOwn(this._phrases,i))return null;const r=this._phrases[i];let u=[];if(typeof r=="string")u=r.split(/\s+/).filter(p=>p!=="");else if(Array.isArray(r))for(const p of r)typeof p=="string"?u.push(p):Array.isArray(p)&&typeof p[0]=="string"&&u.push(p[0]);return u.length>0?u:null}}function Rf(s,i){let r=s;if(typeof r=="string"?r=JSON.parse(r):(r instanceof Uint8Array||r instanceof ArrayBuffer)&&(r=JSON.parse(new TextDecoder().decode(r))),r===null||typeof r!="object"||Array.isArray(r))throw new TypeError(`pinyinDict.${i} must be a JSON object (or its JSON text)`);return r}function us(s){if(s instanceof Pf)return s;if(s===null||typeof s!="object")throw new TypeError("pinyinDict must be { single, phrases }");return new Pf(Rf(s.single,"single"),Rf(s.phrases,"phrases"))}let Vi=null,Df=null;function xm(){return Vi||(Vi=Promise.all([In(()=>import("./pinyin_single-ac3a3825.js"),[],import.meta.url),In(()=>import("./pinyin_phrases-3f3ff634.js"),[],import.meta.url)]).then(([s,i])=>(Df=us({single:s.default,phrases:i.default}),Df),s=>{throw Vi=null,new Error(`@piper-plus/g2p: failed to load the bundled pinyin dictionaries (data/pinyin_single.json, data/pinyin_phrases.json): ${(s==null?void 0:s.message)??s}. Pass pinyinDict to G2P.create() / ChineseG2P, or leave "zh" out of languages.`,{cause:s})})),Vi}const Yy=new Map([["b","p"],["p","pʰ"],["m","m"],["f","f"],["d","t"],["t","tʰ"],["n","n"],["l","l"],["g","k"],["k","kʰ"],["h","x"],["j","tɕ"],["q","tɕʰ"],["x","ɕ"],["zh","tʂ"],["ch","tʂʰ"],["sh","ʂ"],["r","ɻ"],["z","ts"],["c","tsʰ"],["s","s"]]),Bf=new Map([["a","a"],["o","o"],["e","ɤ"],["i","i"],["u","u"],["ü","y_vowel"],["v","y_vowel"],["ai","aɪ"],["ei","eɪ"],["ao","aʊ"],["ou","oʊ"],["an","an"],["en","ən"],["ang","aŋ"],["eng","əŋ"],["ong","uŋ"],["er","ɚ"],["ia","ia"],["ie","iɛ"],["iao","iaʊ"],["iu","iou"],["iou","iou"],["ian","iɛn"],["in","in"],["iang","iaŋ"],["ing","iŋ"],["iong","iuŋ"],["ua","ua"],["uo","uo"],["uai","uaɪ"],["ui","ueɪ"],["uei","ueɪ"],["uan","uan"],["un","uən"],["uen","uən"],["uang","uaŋ"],["ueng","uəŋ"],["üe","yɛ"],["ve","yɛ"],["üan","yɛn"],["van","yɛn"],["ün","yn"],["vn","yn"],["-i_retroflex","ɻ̩"],["-i_alveolar","ɨ"]]),Jy=["zh","ch","sh","b","p","m","f","d","t","n","l","g","k","h","j","q","x","r","z","c","s"],Qy=new Set(["zh","ch","sh","r"]),e1=new Set(["z","c","s"]),Em=new Map([["。","."],["，",","],["！","!"],["？","?"],["、",","],["；",";"],["：",":"],["…","."],["—",","],["“",'"'],["”",'"'],["‘","'"],["’","'"]]),t1=new Set([",",".",";",":","!","?",...Em.keys()]),n1=/^\p{White_Space}$/u,i1=/^\p{Alphabetic}$/u,s1=/^[0-9]$/;function km(s){return s>=19968&&s<=40959||s>=13312&&s<=19903}function za(s){const i=s.replaceAll("v","ü");if(i.startsWith("yu"))return`ü${i.slice(2)}`;if(i.startsWith("y")){const r=i.slice(1);return r.startsWith("i")?r:`i${r}`}if(i.startsWith("w")){const r=i.slice(1);return r.startsWith("u")?r:`u${r}`}return i}function r1(s){for(const i of Jy)if(s.startsWith(i)){let r=s.slice(i.length);if(r==="i"){if(Qy.has(i))return[i,"-i_retroflex"];if(e1.has(i))return[i,"-i_alveolar"]}return(i==="j"||i==="q"||i==="x")&&r.startsWith("u")&&(r=`ü${r.slice(1)}`),[i,r]}return["",s]}function Sm(s,i){const[r,u]=r1(s),p=[];if(r!==""){const m=Yy.get(r);m!==void 0&&p.push(m)}if(u!==""){const m=Bf.get(u);if(m!==void 0)p.push(m);else for(const y of u)y>="a"&&y<="z"&&p.push(Bf.get(y)??y)}return i>=1&&i<=5&&p.push(`tone${i}`),p}function Ca(s){const i=s.charCodeAt(s.length-1);return i>=49&&i<=53?[s.slice(0,-1),i-48]:[s,5]}function a1(s){for(let i=0;i+1<s.length;i++){const r=s[i].tone,u=s[i+1].tone;if(r===3&&u===3){s[i].tone=2;continue}if(s[i].syllable==="i"&&r===1){u===4?s[i].tone=2:u>=1&&u<=3&&(s[i].tone=4);continue}s[i].syllable==="bu"&&r===4&&u===4&&(s[i].tone=2)}}function o1(s){const i=new Map;let r=[];const u=()=>{r.forEach((p,m)=>i.set(p,[m+1,r.length])),r=[]};return s.forEach((p,m)=>{km(p.codePointAt(0))?r.push(m):r.length>0&&u()}),r.length>0&&u(),i}function u1(s,i){const r=[];let u=0;for(;u<s.length;){if(!km(s[u].codePointAt(0))){r.push({isChinese:!1,syllable:"",tone:0}),u++;continue}let p=!1;for(let y=Math.min(s.length-u,8);y>=2;y--){const b=i.lookupPhrase(s.slice(u,u+y).join(""));if(b){for(let $=0;$<y;$++){const[I,P]=$<b.length?Ca(b[$]):["",5];r.push({isChinese:!0,syllable:za(I),tone:P})}u+=y,p=!0;break}}if(p)continue;const m=i.lookupChar(s[u].codePointAt(0));if(m!==null){const[y,b]=Ca(m);r.push({isChinese:!0,syllable:za(y),tone:b})}else r.push({isChinese:!1,syllable:"",tone:0});u++}return r}function l1(s){let i=0;for(;i<s.length;){if(!s[i].isChinese){i++;continue}const r=i;for(;i<s.length&&s[i].isChinese;)i++;i-r>=2&&a1(s.slice(r,i))}}function d1(s,i){const r=Array.from(s),u=o1(r),p=u1(r,i);l1(p);const m=[],y=[];return p.forEach((b,$)=>{const I=r[$];if(!b.isChinese){const G=Em.get(I);G!==void 0?(m.push(G),y.push(null)):t1.has(I)?(m.push(I),y.push(null)):n1.test(I)?(m.push(" "),y.push({a1:0,a2:0,a3:0})):(s1.test(I)||i1.test(I))&&(m.push(I),y.push({a1:0,a2:0,a3:1}));return}let P=b.syllable;const O=P.length>1&&P!=="er"&&P.endsWith("r");O&&(P=P.slice(0,-1));const R=Sm(P,b.tone);O&&R.length>0&&(R[R.length-1].startsWith("tone")?R.splice(R.length-1,0,"ɚ"):R.push("ɚ"));const[B,V]=u.get($)??[1,1];for(const G of R)m.push(G),y.push({a1:b.tone,a2:B,a3:V})}),{tokens:m,prosody:y}}function c1(s){const i=[],r=[];for(const u of s){const[p,m]=Ca(u);for(const y of Sm(za(p),m))i.push(y),r.push({a1:m,a2:1,a3:1})}return{tokens:i,prosody:r}}const p1=1,h1="ZH-EN code-switching loanword dictionary. Maps English acronyms, loanwords, and individual letters to Mandarin pinyin syllables for phonemization in Chinese-context mixed text.",f1={license:"MIT",schema:"Each entry maps a token to a list of pinyin syllables with tone numbers (e.g. 'ji4' = tone 4). letter_fallback covers A-Z for tokens not in acronyms or loanwords. All pinyin syllables MUST use standard Mandarin pinyin so that phonemize_from_pinyin_syllables can convert them to IPA without errors.",lookup_priority:"case-sensitive loanwords -> uppercase acronyms -> letter_fallback (char by char on uppercased text)"},m1={GPS:["ji4","pi4","ai1","si4"],USB:["you1","ai1","si4","bi4"],CPU:["si4","pi4","you1"],GPU:["ji4","pi4","you1"],AI:["ei1","ai4"],API:["ei1","pi4","ai4"],URL:["you1","a4","er2","ai1","er2"],SDK:["ai1","si4","di4","kei4"],HTML:["ai1","chi4","ti4","ai1","mu5","ai1","er2"],CSS:["si4","ai1","si4","ai1","si4"],JS:["jie4","ai1","si4"],CSV:["si4","ai1","si4","wei1"],PDF:["pi4","di4","ai1","fu2"],XML:["ai4","ke4","si1","ai1","mu5","ai1","er2"],SQL:["ai1","si4","kiu1","ai1","er2"],UI:["you1","ai4"],UX:["you1","ai4","ke4","si1"],DNS:["di4","en1","ai1","si4"],IP:["ai4","pi4"],TCP:["ti4","si4","pi4"],UDP:["you1","di4","pi4"],SSH:["ai1","si4","ai1","si4","ai1","chi4"],SSL:["ai1","si4","ai1","si4","ai1","er2"],TLS:["ti4","ai1","er2","ai1","si4"],VPN:["wei1","pi4","en1"],NPC:["en1","pi4","si4"],RPG:["a4","er2","pi4","ji4"],FPS:["ai1","fu2","pi4","ai1","si4"],CEO:["si4","yi1","ou1"],CFO:["si4","ai1","fu2","ou1"],CTO:["si4","ti4","ou1"],COO:["si4","ou1","ou1"],PR:["pi4","a4","er2"],HR:["ai1","chi4","a4","er2"],KPI:["kei4","pi4","ai4"],ROI:["a4","er2","ou1","ai4"],OKR:["ou1","kei4","a4","er2"],CRM:["si4","a4","er2","ai1","mu5"],ERP:["yi1","a4","er2","pi4"],IOT:["ai4","ou1","ti4"],AR:["ei1","a4","er2"],VR:["wei1","a4","er2"],MR:["ai1","mu5","a4","er2"],ML:["ai1","mu5","ai1","er2"],DL:["di4","ai1","er2"],NLP:["en1","ai1","er2","pi4"],LED:["ai1","er2","yi1","di4"],LCD:["ai1","er2","si4","di4"],OLED:["ou1","ai1","er2","yi1","di4"],PHP:["pi4","ai1","chi4","pi4"],PNG:["pi4","en1","ji4"],JPG:["jie4","pi4","ji4"],MP3:["ai1","mu5","pi4","san1"],MP4:["ai1","mu5","pi4","si4"],FBI:["ai1","fu2","bi4","ai4"],CIA:["si4","ai4","ei1"],NBA:["en1","bi4","ei1"],UN:["you1","en1"],EU:["yi1","you1"],UK:["you1","kei4"],US:["you1","ai1","si4"],USA:["you1","ai1","si4","ei1"],ATM:["ei1","ti4","ai1","mu5"],PIN:["pi4","ai4","en1"],FAQ:["ai1","fu2","ei1","kiu1"],WTO:["shuang1","bi3","you1","ti4","ou1"]},g1={Python:["pai4","sen1"],iPhone:["ai4","feng1"],iPad:["ai4","pa4"],ChatGPT:["chai4","ti2","ji4","pi4","ti4"],Java:["jia3","wa3"],Google:["gu3","ge1"],Facebook:["fei4","si1","bu4","ke4"],Microsoft:["wei2","ruan3"],Twitter:["tui1","te4"],YouTube:["you1","tu4","bei4"],WhatsApp:["hua2","ci2","a1","pu1"],WeChat:["wei1","xin4"],TikTok:["ti4","ke4","ti4","ke4"],Linux:["li4","nei4","ke4","si1"],Docker:["dao4","ke4"],Kubernetes:["ku4","bo2","nei4","ti4","si1"],GitHub:["ji2","te4","ha2","bu4"],Slack:["si1","la1","ke4"],Zoom:["zu4","mu3"],Spotify:["si1","bo1","ti4","fei1"],Netflix:["nai4","fei1"],Amazon:["ya4","ma3","xun4"],Tesla:["te4","si1","la1"],Bitcoin:["bi3","te4","bi4"],Ethereum:["yi3","tai4","fang1"],Discord:["di2","si1","ke1","de2"],Reddit:["rui4","di2","te4"],Steam:["si1","ti4","mu3"],Minecraft:["mai4","ke4","la1","fu1","te4"],Excel:["yi1","ke4","sai1","er3"],Word:["wo4","de2"],PowerPoint:["pao4","wei4","pin3","te4"],Skype:["si1","kai1","pu3"],LinkedIn:["ling3","ying1"],Android:["an1","zhuo2"],iOS:["ai4","ou1","ai1","si4"],macOS:["ma3","ke4","ou1","ai1","si4"],Windows:["wen2","duo1","si1"],Apple:["a1","pou1"],Office:["ao4","fei1","si1"]},_1={A:["ei1"],B:["bi4"],C:["si4"],D:["di4"],E:["yi1"],F:["ai1","fu2"],G:["ji4"],H:["ai1","chi4"],I:["ai4"],J:["jie4"],K:["kei4"],L:["ai1","er2"],M:["ai1","mu5"],N:["en1"],O:["ou1"],P:["pi4"],Q:["kiu1"],R:["a4","er2"],S:["ai1","si4"],T:["ti4"],U:["you1"],V:["wei1"],W:["shuang1","bi3","you1"],X:["ai4","ke4","si1"],Y:["wai4"],Z:["zi4"]},y1={version:p1,description:h1,metadata:f1,acronyms:m1,loanwords:g1,letter_fallback:_1};function da(){return{acronyms:new Map,loanwords:new Map,letterFallback:new Map}}function w1(s){const i=da();if(s===null||typeof s!="object"||Array.isArray(s))return i;const r=[["acronyms",i.acronyms],["loanwords",i.loanwords],["letter_fallback",i.letterFallback]];for(const[u,p]of r){const m=s[u];if(m!==void 0){if(m===null||typeof m!="object"||Array.isArray(m))return da();for(const[y,b]of Object.entries(m)){if(!Array.isArray(b)||!b.every($=>typeof $=="string"))return da();p.set(y,b)}}}return i}const $1=w1(y1);function b1(s){return s.match(/[A-Za-z0-9]+/g)??[]}function Lf(s,i=$1){const r=[];for(const u of b1(typeof s=="string"?s:"")){const p=i.loanwords.get(u);if(p){r.push(...p);continue}const m=u.toUpperCase(),y=i.acronyms.get(m);if(y){r.push(...y);continue}for(const b of m){const $=i.letterFallback.get(b);$&&r.push(...$)}}return c1(r)}class v1{constructor(i={}){this.phonemeIdMap=i.phonemeIdMap||null,this._wasmPhonemizer=i.wasmPhonemizer||null,this._pinyinDict=i.pinyinDict?us(i.pinyinDict):null,this._zhEnDispatch=!0,this._lastError=null}async initialize(){return this._pinyinDict||(this._pinyinDict=await xm()),this}setPinyinDictionary(i){this._pinyinDict=i?us(i):null}get lastError(){return this._lastError}get mode(){return this._wasmPhonemizer?"wasm":this._pinyinDict?"dictionary":"fallback"}setPhonemeIdMap(i){this.phonemeIdMap=i}setWasmPhonemizer(i){this._wasmPhonemizer=i||null,this._lastError=null}setZhEnDispatch(i){this._zhEnDispatch=!!i,this._wasmPhonemizer&&typeof this._wasmPhonemizer.setZhEnDispatch=="function"&&this._wasmPhonemizer.setZhEnDispatch(!!i)}isZhEnDispatchEnabled(){return this._wasmPhonemizer?typeof this._wasmPhonemizer.isZhEnDispatchEnabled=="function"?!!this._wasmPhonemizer.isZhEnDispatchEnabled():null:this._pinyinDict?this._zhEnDispatch:null}phonemize(i){i=De(i);const{tokens:r}=this._phonemize(i);return{tokens:r,prosody:new Array(r.length).fill(null)}}phonemizeWithProsody(i){return i=De(i),this._phonemize(i)}phonemizeEmbeddedEnglish(i){i=De(i);const{tokens:r}=Lf(i);return{tokens:r,prosody:new Array(r.length).fill(null)}}phonemizeEmbeddedEnglishWithProsody(i){return i=De(i),Lf(i)}_phonemize(i){if(!i||typeof i!="string")return{tokens:[],prosody:[]};if(this._wasmPhonemizer)try{const r=this._wasmPhonemizer.phonemize(i,"zh");this._lastError=null;const u=r.tokens||[];return{tokens:u,prosody:u.map(()=>({a1:0,a2:0,a3:0}))}}catch(r){this._lastError=`WASM phonemize failed: ${r.message||r}`}return this._pinyinDict?d1(i,this._pinyinDict):this._fallbackPhonemize(i)}_fallbackPhonemize(i){const r=Array.from(i);return{tokens:r,prosody:r.map(()=>({a1:0,a2:0,a3:0}))}}}const qa=new Set([",",".",";",":","!","?","¡","¿","—","–","…","«","»"]);function si(s){return qa.has(s)}const Yi=new Map;function ge(s,i,r){Yi.has(s)||Yi.set(s,new Map),Yi.get(s).set(i,r)}ge("̀","A","À");ge("̀","a","à");ge("̀","E","È");ge("̀","e","è");ge("̀","U","Ù");ge("̀","u","ù");ge("́","A","Á");ge("́","a","á");ge("́","E","É");ge("́","e","é");ge("́","I","Í");ge("́","i","í");ge("́","O","Ó");ge("́","o","ó");ge("́","U","Ú");ge("́","u","ú");ge("̂","A","Â");ge("̂","a","â");ge("̂","E","Ê");ge("̂","e","ê");ge("̂","I","Î");ge("̂","i","î");ge("̂","O","Ô");ge("̂","o","ô");ge("̂","U","Û");ge("̂","u","û");ge("̃","A","Ã");ge("̃","a","ã");ge("̃","N","Ñ");ge("̃","n","ñ");ge("̃","O","Õ");ge("̃","o","õ");ge("̈","E","Ë");ge("̈","e","ë");ge("̈","I","Ï");ge("̈","i","ï");ge("̈","U","Ü");ge("̈","u","ü");ge("̧","C","Ç");ge("̧","c","ç");function Ga(s){if(s.length<2)return s.slice();const i=[];let r=0;const u=s.length;for(;r<u;){if(r+1<u){const p=s[r],m=s[r+1],y=Yi.get(m);if(y){const b=y.get(p);if(b!==void 0){i.push(b),r+=2;continue}}}i.push(s[r]),r+=1}return i}function Im(s){const i=[];let r=!0;for(const u of s)u===" "||u==="	"||u===`
`||u==="\r"?(r||i.push(" "),r=!0):(i.push(u),r=!1);return i.length>0&&i[i.length-1]===" "&&i.pop(),i}function Tm(s,i){const r=[],u=s.length;let p=0;for(;p<u;){const m=s[p];if(i(m)){const y=[];for(;p<u&&i(s[p]);)y.push(s[p]),p+=1;r.push({chars:y,isPunct:!1})}else si(m)&&r.push({chars:[m],isPunct:!0}),p+=1}return r}const x1="β",E1="ð",ca="ɡ",Nf="ɣ",k1="ɲ",S1="ɾ",Uf="ʝ",Ji="ˈ",pa="",I1="",T1=new Set([",",".",";",":","!","?","¡","¿"]);function Ff(s){return T1.has(s)}function ri(s){return s==="a"||s==="e"||s==="i"||s==="o"||s==="u"}function Wf(s){return s==="a"||s==="e"||s==="o"}function Vf(s){return s==="i"||s==="u"}function hn(s){switch(s){case"á":return"a";case"é":return"e";case"í":return"i";case"ó":return"o";case"ú":return"u";case"ü":return"u";default:return s}}function ls(s){return s==="á"||s==="é"||s==="í"||s==="ó"||s==="ú"}function A1(s){return ri(s)||ls(s)||s==="ü"}function jf(s){const i=s.codePointAt(0);return i>=97&&i<=122?!0:s==="ñ"||s==="á"||s==="é"||s==="í"||s==="ó"||s==="ú"||s==="ü"}function z1(s){const i=s.codePointAt(0);if(i>=65&&i<=90)return String.fromCodePoint(i+32);switch(s){case"Á":return"á";case"É":return"é";case"Í":return"í";case"Ó":return"ó";case"Ú":return"ú";case"Ü":return"ü";case"Ñ":return"ñ";default:return s}}function Am(s){const i=[...s];return Ga(i).map(u=>z1(u))}function zm(s){const i=[],r=s.length;let u=0;for(;u<r;)if(jf(s[u])){const p=[];for(;u<r&&jf(s[u]);)p.push(s[u]),u+=1;i.push({type:"word",chars:p})}else if(Ff(s[u])){const p=[];for(;u<r&&Ff(s[u]);)p.push(s[u]),u+=1;i.push({type:"punct",chars:p})}else u+=1;return i}const Cm=new Set(["el","la","los","las","un","una","de","del","al","a","en","con","por","y","o","que","se","me","te","le","lo","nos","su","mi","tu","es","no","si"]);function C1(s){const i=s.map(m=>hn(m)),r=[],u=s.length;let p=0;for(;p<u;){const m=i[p];if(m==="q"&&p+1<u&&i[p+1]==="u"){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="g"&&p+1<u&&s[p+1]==="ü"&&p+2<u&&(i[p+2]==="e"||i[p+2]==="i")){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="g"&&p+1<u&&i[p+1]==="u"&&p+2<u&&(i[p+2]==="e"||i[p+2]==="i")){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="c"&&p+1<u&&i[p+1]==="h"){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="l"&&p+1<u&&i[p+1]==="l"){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="r"&&p+1<u&&i[p+1]==="r"){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="s"&&p+1<u&&i[p+1]==="c"&&p+2<u&&(i[p+2]==="e"||i[p+2]==="i")){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="x"&&p+1<u&&i[p+1]==="c"&&p+2<u&&(i[p+2]==="e"||i[p+2]==="i")){r.push({chars:[s[p],s[p+1]],isVowel:!1,isSilent:!1}),p+=2;continue}if(m==="h"){r.push({chars:[s[p]],isVowel:!1,isSilent:!0}),p+=1;continue}if(ri(m)){r.push({chars:[s[p]],isVowel:!0,isSilent:!1}),p+=1;continue}r.push({chars:[s[p]],isVowel:!1,isSilent:!1}),p+=1}return r}function qf(s,i){return i==="l"?s==="b"||s==="c"||s==="f"||s==="g"||s==="p"||s==="t":i==="r"?s==="b"||s==="c"||s==="d"||s==="f"||s==="g"||s==="p"||s==="t":!1}function ji(s){return hn(s.chars[s.chars.length-1])}function O1(s){const i=[],r=[];for(let y=0;y<s.length;y++)s[y].isSilent||(i.push(y),r.push(s[y].isVowel));const u=i.length;if(u===0)return[0];const p=[0];let m=1;for(;m<u;)if(r[m]){if(m>0&&r[m-1]){const y=s[i[m-1]].chars[s[i[m-1]].chars.length-1],b=s[i[m]].chars[s[i[m]].chars.length-1],$=hn(y),I=hn(b);(Wf($)&&Wf(I)||Vf(I)&&ls(b)||Vf($)&&ls(y))&&p.push(m)}m+=1}else{const y=m;for(;m<u&&!r[m];)m+=1;const b=m-y;if(m<u)if(b===1)p.push(y);else if(b===2){const $=ji(s[i[y]]),I=ji(s[i[y+1]]);qf($,I)?p.push(y):p.push(y+1)}else{const $=ji(s[i[m-2]]),I=ji(s[i[m-1]]);qf($,I)?p.push(m-2):p.push(m-1)}}return p.map(y=>i[y])}function M1(s){for(let i=0;i<s.length;i++)if(ls(s[i]))return i;return-1}function P1(s,i,r){const u=r.length;if(u===0)return 0;const p=M1(s);if(p>=0){let y=0,b=0;for(let $=0;$<i.length;$++){const I=i[$].chars.length;if(y<=p&&p<y+I){b=$;break}y+=I}for(let $=u-1;$>=0;$--)if(r[$]<=b)return $;return 0}if(u===1)return 0;const m=hn(s[s.length-1]);return ri(m)||m==="n"||m==="s"?Math.max(0,u-2):u-1}function Om(s){const i=[],r=s.length,u=s.map(O=>hn(O)),p=O=>O>0&&A1(s[O-1]),m=O=>O>0&&(u[O-1]==="m"||u[O-1]==="n"),y=O=>O===0;let b=0;for(;b<r;){const O=u[b];if(ri(O)){i.push(O),b+=1;continue}if(O==="q"&&b+1<r&&u[b+1]==="u"){i.push("k"),b+=2;continue}if(O==="c"&&b+1<r&&u[b+1]==="h"){i.push(I1),b+=2;continue}if(O==="l"&&b+1<r&&u[b+1]==="l"){i.push(Uf),b+=2;continue}if(O==="r"&&b+1<r&&u[b+1]==="r"){i.push(pa),b+=2;continue}if(O==="g"&&b+1<r&&s[b+1]==="ü"&&b+2<r&&(u[b+2]==="e"||u[b+2]==="i")){i.push(ca),i.push("w"),b+=2;continue}if(O==="g"&&b+1<r&&u[b+1]==="u"&&b+2<r&&(u[b+2]==="e"||u[b+2]==="i")){p(b)&&!m(b)?i.push(Nf):i.push(ca),b+=2;continue}if(O==="s"&&b+1<r&&u[b+1]==="c"&&b+2<r&&(u[b+2]==="e"||u[b+2]==="i")){i.push("s"),b+=2;continue}if(O==="b"||O==="v"){y(b)||m(b)||b>0&&u[b-1]==="l"?i.push("b"):i.push(x1),b+=1;continue}if(O==="c"){b+1<r&&(u[b+1]==="e"||u[b+1]==="i")?i.push("s"):i.push("k"),b+=1;continue}if(O==="d"){y(b)||m(b)||b>0&&u[b-1]==="l"?i.push("d"):i.push(E1),b+=1;continue}if(O==="f"){i.push("f"),b+=1;continue}if(O==="g"){b+1<r&&(u[b+1]==="e"||u[b+1]==="i")?i.push("x"):y(b)||m(b)||b>0&&u[b-1]==="l"?i.push(ca):i.push(Nf),b+=1;continue}if(O==="h"){b+=1;continue}if(O==="j"){i.push("x"),b+=1;continue}if(O==="k"){i.push("k"),b+=1;continue}if(O==="l"){i.push("l"),b+=1;continue}if(O==="m"){i.push("m"),b+=1;continue}if(O==="n"){i.push("n"),b+=1;continue}if(O==="ñ"){i.push(k1),b+=1;continue}if(O==="p"){i.push("p"),b+=1;continue}if(O==="r"){y(b)||b>0&&(u[b-1]==="l"||u[b-1]==="n"||u[b-1]==="s")?i.push(pa):i.push(S1),b+=1;continue}if(O==="s"){i.push("s"),b+=1;continue}if(O==="t"){i.push("t"),b+=1;continue}if(O==="w"){i.push("w"),b+=1;continue}if(O==="x"){if(b+1<r&&u[b+1]==="c"&&b+2<r&&(u[b+2]==="e"||u[b+2]==="i")){i.push("k"),i.push("s"),b+=2;continue}i.push("k"),i.push("s"),b+=1;continue}if(O==="y"){b===r-1?i.push("i"):i.push(Uf),b+=1;continue}if(O==="z"){i.push("s"),b+=1;continue}b+=1}const $=C1(s),I=O1($),P=P1(s,$,I);return{phonemes:i,stressedSyl:P,units:$,boundaries:I}}function R1(s){const i=s.chars.map(r=>hn(r));return i.length===1&&i[0]==="h"?0:i.length===2&&i[0]==="g"&&s.chars[1]==="ü"||i.length===2&&i[0]==="x"&&i[1]==="c"||i.length===1&&i[0]==="x"?2:1}function Mm(s,i,r,u){if(s.length===0||r.length===0||u>=r.length)return;const p=i.length,m=r[u],y=u+1<r.length?r[u+1]:p;let b=-1;for(let I=0;I<Math.min(y,p)-m;I++)if(i[m+I].isVowel){b=m+I;break}if(b<0)return;let $=0;for(let I=0;I<i.length;I++){if(I===b){s.splice($,0,Ji);return}$+=R1(i[I])}}function D1(s){if(!s)return[];const i=Am(s),r=zm(i);if(r.length===0)return[];const u=[];let p=!1;for(const m of r)if(m.type==="punct")for(const y of m.chars)u.push(y);else if(m.type==="word"){p&&u.push(" ");const y=Om(m.chars),b=m.chars.join("");Cm.has(b)||Mm(y.phonemes,y.units,y.boundaries,y.stressedSyl);for(const I of y.phonemes)u.push(I);p=!0}return u}class B1{constructor(i={}){this.phonemeIdMap=i.phonemeIdMap||null}get languageCode(){return"es"}setPhonemeIdMap(i){this.phonemeIdMap=i}phonemize(i){if(i=De(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=D1(i),u=new Array(r.length).fill(null);return{tokens:r,prosody:u}}phonemizeWithProsody(i){if(i=De(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=Am(i),u=zm(r);if(u.length===0)return{tokens:[],prosody:[]};const p=[],m=[];let y=!1;for(const b of u)if(b.type==="punct")for(const $ of b.chars)p.push($),m.push({a1:0,a2:0,a3:0});else if(b.type==="word"){y&&(p.push(" "),m.push({a1:0,a2:0,a3:0}));const $=Om(b.chars),I=b.chars.join("");Cm.has(I)||Mm($.phonemes,$.units,$.boundaries,$.stressedSyl);const O=$.phonemes.filter(R=>R!==Ji).length;for(let R=0;R<$.phonemes.length;R++){const B=$.phonemes[R];if(B===Ji)p.push(B),m.push({a1:0,a2:2,a3:O});else{const V=R>0&&$.phonemes[R-1]===Ji&&ri(B);p.push(B),m.push({a1:0,a2:V?2:0,a3:O})}}y=!0}return{tokens:p,prosody:m}}}const Qi="",Lt="",Pm="",Oa="",At="ɛ",Rm="ɔ",Dm="ə",ha="ɡ",L1="ʃ",Gf="ʒ",N1="ʁ",U1="ɲ",F1="ɥ",Bm="ø",es="œ",W1=new Set(["a","e","i","o","u","y","à","â","æ","é","è","ê","ë","î","ï","ô","ù","û","ü","œ"]),V1=new Set(["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z"]),j1=new Set(["d","g","h","m","n","p","s","t","x","z"]),q1=new Set(["e","i","y","é","è","ê","ë","î","ï"]);function fa(s){const i=s.codePointAt(0);return i>=97&&i<=122?!0:s==="à"||s==="â"||s==="æ"||s==="é"||s==="è"||s==="ê"||s==="ë"||s==="î"||s==="ï"||s==="ô"||s==="ù"||s==="û"||s==="ü"||s==="œ"||s==="ç"||s==="ñ"}function qe(s){return W1.has(s)}function qi(s){return V1.has(s)}function Gi(s){return j1.has(s)}function ma(s){return q1.has(s)}const G1=new Set(["a","e","i","o","u",At,Rm,Dm,Bm,es,Qi,Lt,Pm,Oa]);function H1(s){return G1.has(s)}const K1=new Set(["ville","mille","tranquille"]),Z1=new Set(["hiver","enfer","amer","cancer","super","laser","hamster","master","poster","cluster","starter","leader","transfer","fer"]);function X1(s){const i=s.codePointAt(0);return i>=65&&i<=90||i>=192&&i<=214||i>=216&&i<=222?String.fromCodePoint(i+32):i===338?"œ":s}function Y1(s){let i=Ga([...s]);return i=i.map(X1),Im(i)}const J1=new Set(["l","d","j","n","s","c","m","t","qu"]),Q1=new Map([["les","z"],["des","z"],["ces","z"],["mes","z"],["tes","z"],["ses","z"],["nos","z"],["vos","z"],["aux","z"],["petits","z"],["grands","z"],["gros","z"],["deux","z"],["trois","z"],["six","z"],["dix","z"],["nous","z"],["vous","z"],["ils","z"],["elles","z"],["on","n"],["en","n"],["dans","z"],["sans","z"],["chez","z"],["un","n"],["mon","n"],["ton","n"],["son","n"],["tout","t"],["quand","t"],["très","z"],["plus","z"],["est","t"],["ont","t"],["sont","t"],["font","t"],["vont","t"]]);function ew(s){const i=s.map(m=>m==="’"||m==="‘"?"'":m),r=[],u=i.length;let p=0;for(;p<u;){const m=i[p];if(qa.has(m)){r.push({chars:[m],isPunct:!0}),p++;continue}if(!fa(m)){p++;continue}const y=[[]];for(;p<u;)if(fa(i[p]))y[y.length-1].push(i[p]),p++;else if(i[p]==="'"&&p+1<u&&fa(i[p+1]))y.push([]),p++;else break;let b=null;y.forEach(($,I)=>{b?b.push(...$):I<y.length-1&&J1.has($.join(""))?b=[...$]:r.push({chars:$,isPunct:!1})}),b&&r.push({chars:b,isPunct:!1})}return r}function tw(s){return s.length===0?!1:qe(s[0])?!0:s[0]==="h"&&s.length>1&&qe(s[1])}function nw(s){let i=0;for(const r of s)qe(r)&&i++;return i}function iw(s){return K1.has(s.join(""))}function sw(s){return Z1.has(s.join(""))}function Zn(s,i,r,u,p){if(i+1>=r)return!1;const m=s[i+1];return m!=="n"&&m!=="m"?!1:i+2>=r?(p.push(u),i+2):qe(s[i+2])||s[i+2]===m?!1:(p.push(u),i+2)}function rw(s){const i=[];let r=0;const u=s.length;for(;r<u;){const p=s[r];if(p==="e"&&r+1===u-1&&s[r+1]==="r"&&nw(s)>=2&&!sw(s)){i.push("e"),r+=2;continue}if(p==="e"&&r+2<u&&s[r+1]==="a"&&s[r+2]==="u"){i.push("o"),r+=3;continue}if(p==="o"&&r+5<u&&s[r+1]==="u"&&s[r+2]==="i"&&s[r+3]==="l"&&s[r+4]==="l"&&s[r+5]==="e"&&(r+6>=u||!qe(s[r+6]))){i.push("u"),i.push("j"),r+=6;continue}if(p==="a"&&r+4<u&&s[r+1]==="i"&&s[r+2]==="l"&&s[r+3]==="l"&&s[r+4]==="e"&&(r+5>=u||!qe(s[r+5]))){i.push("a"),i.push("j"),r+=5;continue}if(p==="e"&&r+5<u&&s[r+1]==="u"&&s[r+2]==="i"&&s[r+3]==="l"&&s[r+4]==="l"&&s[r+5]==="e"&&r+6>=u){i.push(es),i.push("j"),r+=6;continue}if(p==="e"&&r+2<u&&s[r+1]==="i"&&s[r+2]==="l"&&r+3>=u){i.push(At),i.push("j"),r+=3;continue}if(p==="e"&&r+4<u&&s[r+1]==="i"&&s[r+2]==="l"&&s[r+3]==="l"&&s[r+4]==="e"&&(r+5>=u||!qe(s[r+5]))){i.push(At),i.push("j"),r+=5;continue}if(p==="a"&&r+2<u&&s[r+1]==="i"&&(s[r+2]==="n"||s[r+2]==="m")&&(r+3>=u||!qe(s[r+3]))){i.push(Lt),r+=3;continue}if(p==="e"&&r+2<u&&s[r+1]==="i"&&(s[r+2]==="n"||s[r+2]==="m")&&(r+3>=u||!qe(s[r+3]))){i.push(Lt),r+=3;continue}if(p==="o"&&r+2<u&&s[r+1]==="i"&&s[r+2]==="n"&&(r+3>=u||!qe(s[r+3]))){i.push("w"),i.push(Lt),r+=3;continue}if(p==="i"&&r+2<u&&s[r+1]==="e"&&s[r+2]==="n"&&(r+3>=u||!qe(s[r+3]))){i.push("j"),i.push(Lt),r+=3;continue}if(p==="t"&&r+3<u&&s[r+1]==="i"&&s[r+2]==="o"&&s[r+3]==="n"&&(r+4>=u||!qe(s[r+4]))){r>0&&s[r-1]==="s"?i.push("t"):i.push("s"),i.push("j"),i.push(Oa),r+=4;continue}if(p==="i"&&r+3<u&&s[r+1]==="l"&&s[r+2]==="l"&&s[r+3]==="e"&&(r+4>=u||!qe(s[r+4]))){i.push("i"),iw(s)?i.push("l"):i.push("j"),r+=4;continue}if(p==="g"&&r+1<u&&s[r+1]==="n"){i.push(U1),r+=2;continue}if(p==="p"&&r+1<u&&s[r+1]==="h"){i.push("f"),r+=2;continue}if(p==="t"&&r+1<u&&s[r+1]==="h"){i.push("t"),r+=2;continue}if(p==="c"&&r+1<u&&s[r+1]==="h"){i.push(L1),r+=2;continue}if(p==="q"&&r+1<u&&s[r+1]==="u"){i.push("k"),r+=2;continue}if(p==="g"&&r+1<u&&s[r+1]==="u"&&r+2<u&&ma(s[r+2])){i.push(ha),r+=2;continue}if(p==="a"||p==="e"){const b=Zn(s,r,u,Pm,i);if(b!==!1){r=b;continue}}if(p==="i"){const b=Zn(s,r,u,Lt,i);if(b!==!1){r=b;continue}}if(p==="o"){const b=Zn(s,r,u,Oa,i);if(b!==!1){r=b;continue}}if(p==="u"){const b=Zn(s,r,u,Lt,i);if(b!==!1){r=b;continue}}if(p==="y"){const b=Zn(s,r,u,Lt,i);if(b!==!1){r=b;continue}}if(p==="o"&&r+1<u&&s[r+1]==="u"){i.push("u"),r+=2;continue}if(p==="a"&&r+1<u&&s[r+1]==="u"){i.push("o"),r+=2;continue}if(p==="o"&&r+1<u&&s[r+1]==="i"){i.push("w"),i.push("a"),r+=2;continue}if(p==="a"&&r+1<u&&s[r+1]==="i"){i.push(At),r+=2;continue}if(p==="e"&&r+1<u&&s[r+1]==="i"){i.push(At),r+=2;continue}if((p==="e"||p==="œ")&&r+1<u&&s[r+1]==="u"){r+2<u&&qi(s[r+2])&&!Gi(s[r+2])?i.push(es):i.push(Bm),r+=2;continue}if(p==="é"){i.push("e"),r+=1;continue}if(p==="è"||p==="ê"){i.push(At),r+=1;continue}if(p==="ë"){i.push(At),r+=1;continue}if(p==="à"||p==="â"){i.push("a"),r+=1;continue}if(p==="a"){i.push("a"),r+=1;continue}if(p==="î"||p==="ï"){i.push("i"),r+=1;continue}if(p==="i"){r+1<u&&qe(s[r+1])?r+1===u-1&&s[r+1]==="e"?i.push("i"):i.push("j"):i.push("i"),r+=1;continue}if(p==="ô"){i.push("o"),r+=1;continue}if(p==="o"){const b=r+1;let $=u;$>b&&($-b>=2&&s[$-2]==="e"&&s[$-1]==="s"?$-=2:s[$-1]==="e"&&($-=1));let I=!1,P=!0,O=!1;for(let R=b;R<$;R++){if(I=!0,!qi(s[R])){P=!1;break}Gi(s[R])||(O=!0)}I&&P&&O?i.push(Rm):i.push("o"),r+=1;continue}if(p==="ù"||p==="û"){i.push(Qi),r+=1;continue}if(p==="ü"){i.push(Qi),r+=1;continue}if(p==="u"){if(r+1<u&&s[r+1]==="i"){i.push(F1),i.push("i"),r+=2;continue}i.push(Qi),r+=1;continue}if(p==="y"){r+1<u&&qe(s[r+1])?i.push("j"):i.push("i"),r+=1;continue}if(p==="œ"){i.push(es),r+=1;continue}if(p==="æ"){i.push("e"),r+=1;continue}if(p==="e"){if(r===u-1){r+=1;continue}let b=0;for(let O=r+1;O<u&&qi(s[O]);O++)b++;if(b>=2){i.push(At),r+=1;continue}const $=s.slice(r+1),I=$.length>0&&$.every(O=>qi(O)),P=$.some(O=>!Gi(O));$.length>0&&I&&P?i.push(At):i.push(Dm),r+=1;continue}if(p==="c"){r+1<u&&ma(s[r+1])?i.push("s"):i.push("k"),r+=1;continue}if(p==="ç"){i.push("s"),r+=1;continue}if(p==="g"){r+1<u&&ma(s[r+1])?i.push(Gf):i.push(ha),r+=1;continue}if(p==="j"){i.push(Gf),r+=1;continue}if(p==="r"){i.push(N1),r+1<u&&s[r+1]==="r"?r+=2:r+=1;continue}if(p==="x"){if(r===u-1){r+=1;continue}{const b=u-(r+1);let $=!1;if((b===1&&s[r+1]==="e"||b===2&&s[r+1]==="e"&&s[r+2]==="s")&&($=!0),$){r+=1;continue}}if(r>0&&s[r-1]==="e"&&r+1<u&&qe(s[r+1])){i.push(ha),i.push("z"),r+=1;continue}i.push("k"),i.push("s"),r+=1;continue}if(p==="h"){r+=1;continue}const y={b:"b",d:"d",f:"f",k:"k",l:"l",m:"m",n:"n",p:"p",s:"s",t:"t",v:"v",w:"w",z:"z"}[p];if(y!==void 0){const b=r===u-1,$=u>=2&&r===u-2&&s[u-1]==="s";if((b||$)&&Gi(p)){r+=1;continue}if(p==="s"){const P=r>0&&qe(s[r-1]),O=r+1<u&&qe(s[r+1]),R=!(r+1<u&&s[r+1]==="s");if(P&&O&&R){i.push("z"),r+=1;continue}}i.push(y),r+1<u&&s[r+1]===p?r+=2:r+=1;continue}if(qa.has(p)){i.push(p),r+=1;continue}r+=1}return i}function Hf(s){if(!s)return{phonemes:[],prosody:[]};const i=Y1(s),r=ew(i),u=[],p=[];let m=!1;for(let y=0;y<r.length;y++){const b=r[y];if(!b.isPunct&&m&&(u.push(" "),p.push({a1:0,a2:0,a3:0})),b.isPunct)for(const $ of b.chars)u.push($),p.push({a1:0,a2:0,a3:0});else{const $=rw(b.chars),I=Q1.get(b.chars.join("")),P=r[y+1];I&&P&&!P.isPunct&&tw(P.chars)&&$.push(I);const O=$.length;let R=-1;for(let B=$.length-1;B>=0;B--)if(H1($[B])){R=B;break}for(let B=0;B<$.length;B++){const V=B===R?2:0;u.push($[B]),p.push({a1:0,a2:V,a3:O})}}m=!0}return{phonemes:u,prosody:p}}class aw{constructor(i={}){this.phonemeIdMap=i.phonemeIdMap||null}get languageCode(){return"fr"}setPhonemeIdMap(i){this.phonemeIdMap=i}phonemize(i){if(i=De(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const{phonemes:r}=Hf(i),u=new Array(r.length).fill(null);return{tokens:r,prosody:u}}phonemizeWithProsody(i){if(i=De(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const{phonemes:r,prosody:u}=Hf(i);return{tokens:r,prosody:u}}}const fs="",ms="",Lm="ɛ",Nm="ɔ",Ma="ɡ",ts="ʃ",Pa="ʒ",Ra="ʁ",Um="ɲ",Fm="ɾ",Wm="ʎ",Ha="ã",Ka="ẽ",Za="ĩ",Xa="õ",Ya="ũ",ow=new Set(["a","e","i","o","u","á","à","â","ã","é","ê","í","ó","ô","õ","ú","ü"]);function vt(s){return ow.has(s)}const uw=new Set(["á","é","í","ó","ú"]);function Da(s){return uw.has(s)}const lw=new Set(["â","ê","ô"]);function Ba(s){return lw.has(s)}function La(s){return s==="ã"||s==="õ"}function dw(s){switch(s){case"á":case"à":case"â":case"ã":return"a";case"é":case"ê":return"e";case"í":return"i";case"ó":case"ô":case"õ":return"o";case"ú":case"ü":return"u";default:return s}}const cw=new Set(["a","e","i","o","u",Lm,Nm]);function pw(s){return cw.has(s)}const hw=new Set([Ha,Ka,Za,Xa,Ya]);function Vm(s){return hw.has(s)}function fw(s){return pw(s)||Vm(s)}const mw=new Set(["b","c","d","f","h","j","k","l","m","n","p","s","t","v","w","z",Ma,Um,Fm,Ra,ts,Wm,Pa]);function gw(s){return mw.has(s)}const _w=new Set(["e","i","é","ê","í"]);function cn(s){return _w.has(s)}function jm(s){const i=s.codePointAt(0);return i>=97&&i<=122||i>=224&&i<=255&&i!==247||s==="ç"||s==="ñ"||s==="ẽ"||s==="ĩ"||s==="ũ"}function yw(s){const i=s.codePointAt(0);return i>=65&&i<=90||i>=192&&i<=222&&i!==215?String.fromCodePoint(i+32):s}function qm(s){let i=[...s];return i=Ga(i),i=i.map(yw),Im(i)}function Gm(s){let i=0,r=0;const u=s.length;for(;r<u;){const p=s[r];if(p==="q"&&r+1<u&&s[r+1]==="u"){r+=2;continue}if(p==="g"&&r+1<u&&s[r+1]==="u"&&r+2<u&&cn(s[r+2])){r+=2;continue}if(p==="o"&&r+1<u&&s[r+1]==="u"){i+=1,r+=2;continue}vt(p)&&(i+=1),r+=1}return i}function ww(s){const i=Gm(s);let r=-1,u=0,p=0;const m=s.length;for(;p<m;){const I=s[p];if(I==="q"&&p+1<m&&s[p+1]==="u"){p+=2;continue}if(I==="g"&&p+1<m&&s[p+1]==="u"&&p+2<m&&cn(s[p+2])){p+=2;continue}if(I==="o"&&p+1<m&&s[p+1]==="u"){(Da(I)||Ba(I)||La(I))&&(r=u),u+=1,p+=2;continue}vt(I)&&((Da(I)||Ba(I)||La(I))&&(r=u),u+=1),p+=1}if(i===0)return 0;if(r>=0)return i-1-r;const y=s.slice();for(;y.length>0&&y[y.length-1]==="s";)y.pop();const b=y.length;let $=!1;if(b>=1){const I=y[b-1];(I==="a"||I==="e"||I==="o")&&($=!0)}if(!$&&b>=2){const I=y[b-2],P=y[b-1];(I==="a"&&P==="m"||I==="e"&&P==="m"||I==="e"&&P==="n")&&($=!0)}return $?Math.min(1,i-1):0}function $w(s,i){return s===0||s>=i.length-1?!1:vt(i[s-1])&&vt(i[s+1])}function bw(s){switch(s){case"a":return Ha;case"e":return Ka;case"i":return Za;case"o":return Xa;case"u":return Ya;default:return s}}function vw(s){switch(s){case"a":return"a";case"e":return Lm;case"i":return"i";case"o":return Nm;case"u":return"u";default:return s}}function xw(s){const i=[];let r=-1,u=0;const p=s.length,m=ww(s),b=Gm(s)-1-m;let $=0;for(;u<p;){const I=s[u];if(I==="n"&&u+1<p&&s[u+1]==="h"){i.push(Um),u+=2;continue}if(I==="l"&&u+1<p&&s[u+1]==="h"){i.push(Wm),u+=2;continue}if(I==="c"&&u+1<p&&s[u+1]==="h"){i.push(ts),u+=2;continue}if(I==="r"&&u+1<p&&s[u+1]==="r"){i.push(Ra),u+=2;continue}if(I==="s"&&u+1<p&&s[u+1]==="s"){i.push("s"),u+=2;continue}if(I==="s"&&u+1<p&&s[u+1]==="c"&&u+2<p&&cn(s[u+2])){i.push("s"),u+=2;continue}if(I==="q"&&u+1<p&&s[u+1]==="u"){i.push("k"),u+2<p&&cn(s[u+2])||i.push("w"),u+=2;continue}if(I==="g"&&u+1<p&&s[u+1]==="u"&&u+2<p&&cn(s[u+2])){i.push(Ma),u+=2;continue}if(I==="o"&&u+1<p&&s[u+1]==="u"){$===b&&(r=i.length),i.push("o"),$+=1,u+=2;continue}if(I==="r"){$w(u,s)?i.push(Fm):i.push(Ra),u+=1;continue}if(I==="s"){u>0&&u+1<p&&vt(s[u-1])&&vt(s[u+1])?i.push("z"):i.push("s"),u+=1;continue}if(I==="x"){u===0?i.push(ts):u>0&&vt(s[u-1])&&u+1<p&&vt(s[u+1])?i.push("z"):i.push(ts),u+=1;continue}if(I==="c"){u+1<p&&cn(s[u+1])?i.push("s"):i.push("k"),u+=1;continue}if(I==="ç"){i.push("s"),u+=1;continue}if(I==="g"){u+1<p&&cn(s[u+1])?i.push(Pa):i.push(Ma),u+=1;continue}if(I==="j"){i.push(Pa),u+=1;continue}if(I==="t"){u+1<p&&(s[u+1]==="i"||s[u+1]==="í")?i.push(fs):i.push("t"),u+=1;continue}if(I==="d"){u+1<p&&(s[u+1]==="i"||s[u+1]==="í")?i.push(ms):i.push("d"),u+=1;continue}if(I==="h"){u+=1;continue}if(I==="b"||I==="f"||I==="k"||I==="l"||I==="m"||I==="n"||I==="p"||I==="v"){i.push(I),u+=1;continue}if(I==="z"){i.push("z"),u+=1;continue}if(I==="w"){i.push("w"),u+=1;continue}if(vt(I)){const P=$===b,O=dw(I);let R=!1,B=!1;La(I)?R=!0:u+1<p&&(s[u+1]==="n"||s[u+1]==="m")&&(s[u+1]==="n"&&u+2<p&&s[u+2]==="h"||(u+2>=p?(R=!0,B=!0):vt(s[u+2])||(R=!0,B=!0)));let V;R?V=bw(O):Da(I)?V=vw(O):(Ba(I),V=O),P&&(r=i.length),i.push(V),$+=1,B?u+=2:u+=1;continue}if(si(I)){i.push(I),u+=1;continue}u+=1}return{phonemes:i,stressIdx:r}}function Ew(s,i){let r=s.length-1;for(;r>=1;)(s[r]==="n"||s[r]==="m")&&Vm(s[r-1])&&(r===s.length-1||s[r+1]===" "||si(s[r+1]))&&(i>=0&&r<i&&(i-=1),s.splice(r,1)),r-=1;return{phonemes:s,stressIdx:i}}function kw(s){for(let i=0;i<s.length;i++){if(s[i]!=="l")continue;if(i===s.length-1){s[i]="w";continue}const r=s[i+1];if(r===" "||si(r)){s[i]="w";continue}(gw(r)||r===fs||r===ms)&&!fw(r)&&(s[i]="w")}}function Sw(s){const i=[];let r=0;for(let u=0;u<s.length;u++)s[u]===" "&&(u>r&&i.push([r,u]),r=u+1);return r<s.length&&i.push([r,s.length]),i}function Iw(s,i){const r=Sw(s);for(const[u,p]of r){if(p-u<2)continue;let m=p-1;for(;m>=u&&si(s[m]);)m-=1;if(!(m<u))if(s[m]==="e"&&m!==i){if(m>u&&s[m-1]==="t"){s[m-1]=fs,s[m]="i";continue}if(m>u&&s[m-1]==="d"){s[m-1]=ms,s[m]="i";continue}s[m]="i"}else s[m]==="o"&&m!==i&&(s[m]="u")}}function Hm(s){let i=xw(s);return i=Ew(i.phonemes,i.stressIdx),kw(i.phonemes),Iw(i.phonemes,i.stressIdx),i}function Tw(s){if(!s)return[];const i=qm(s),r=Tm(i,jm),u=[];let p=!1;for(const m of r)if(m.isPunct){for(const y of m.chars)u.push(y);p=!0}else{p&&u.push(" ");const y=Hm(m.chars);for(const b of y.phonemes)u.push(b);p=!0}return u}class Km{constructor(i={}){this.phonemeIdMap=i.phonemeIdMap||null}get languageCode(){return"pt"}setPhonemeIdMap(i){this.phonemeIdMap=i}phonemize(i){if(i=De(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=Tw(i),u=new Array(r.length).fill(null);return{tokens:r,prosody:u}}phonemizeWithProsody(i){if(i=De(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=qm(i),u=Tm(r,jm),p=[],m=[];let y=!1;for(const b of u)if(b.isPunct){for(const $ of b.chars)p.push($),m.push({a1:0,a2:0,a3:0});y=!0}else{y&&(p.push(" "),m.push({a1:0,a2:0,a3:0}));const $=Hm(b.chars),I=$.phonemes.length;for(let P=0;P<$.phonemes.length;P++){const O=P===$.stressIdx?2:0;p.push($.phonemes[P]),m.push({a1:0,a2:O,a3:I})}y=!0}return{tokens:p,prosody:m}}}const Aw=new Set(["a","e","i","o","u","ɛ","ɔ",Ha,Ka,Za,Xa,Ya,"ɨ"]),zw=new Set(["b","d","f","k","l","m","n","p","r","s","t","v","w","z","ɡ","ɲ","ɾ","ʁ","ʃ","ʎ","ʒ","ʔ","h","ɫ"]),ga=new Set([",",".",";",":","!","?","—","–","…"]);function Zm(s){return typeof s=="string"&&s.length>0?s[0]:""}function _a(s){return zw.has(Zm(s))}function ns(s){return Aw.has(Zm(s))}function Cw(s,i){for(let r=i+1;r<s.length;r++)if(s[r]!==" ")return ns(s[r]);return!1}function Kf(s){const i=s.slice(),r=i.length;for(let u=0;u<r;u++){if(i[u]!=="i")continue;const p=u+1<r?i[u+1]:"";if(p===""||p===" "||ga.has(p)){if(u>=1&&i[u-1]===fs){i[u-1]="t",i[u]="ɨ";continue}if(u>=1&&i[u-1]===ms){i[u-1]="d",i[u]="ɨ";continue}u>=1&&_a(i[u-1])&&(i[u]="ɨ")}}for(let u=0;u<r;u++){if(i[u]!=="s"&&i[u]!=="z")continue;const p=u+1<r?i[u+1]:"";if(p===""||p===" "||ga.has(p)){if(Cw(i,u)){i[u]="ʒ";continue}i[u]=i[u]==="s"?"ʃ":"ʒ"}else _a(p)&&!ns(p)&&(i[u]=i[u]==="s"?"ʃ":"ʒ")}for(let u=0;u<r;u++){if(i[u]!=="w"||u===0||!ns(i[u-1]))continue;const p=u+1<r?i[u+1]:"";(p===""||p===" "||ga.has(p)||_a(p)&&!ns(p))&&(i[u]="ɫ")}for(let u=0;u<r;u++)i[u]==="h"&&(i[u]="ʁ");return i}class Ow{constructor(i={}){this.brG2P=new Km(i),this.phonemeIdMap=this.brG2P.phonemeIdMap}get languageCode(){return"pt-PT"}phonemize(i){const r=this.brG2P.phonemizeWithProsody(i);return Kf(r.tokens)}phonemizeWithProsody(i){const r=this.brG2P.phonemizeWithProsody(i);return{tokens:Kf(r.tokens),prosody:r.prosody}}}const ya=new Set(["e","i","y","ä","ö"]),Xm=new Set(["a","e","i","o","u","y","å","ä","ö"]),Ym=new Set(["b","c","d","f","g","h","j","k","l","m","n","p","q","r","s","t","v","w","x","z"]),Mw=new Set([".",",",";",":","!","?"]),Pw={a:"ɑː",e:"eː",i:"iː",o:"uː",u:"ʉː",y:"yː",å:"oː",ä:"ɛː",ö:"øː"},Jn={a:"a",e:"ɛ",i:"ɪ",o:"ɔ",u:"ɵ",y:"ʏ",å:"ɔ",ä:"ɛ",ö:"œ"},Rw="oː",Dw={b:"b",c:"k",d:"d",f:"f",g:"ɡ",h:"h",j:"j",k:"k",l:"l",m:"m",n:"n",p:"p",q:"k",r:"r",s:"s",t:"t",v:"v",w:"v",x:"ks",z:"s"},Bw=new Set(["backe","bricka","docka","dricka","dyker","dyket","enkel","ficka","flicka","fröken","kebab","kennel","kent","keps","kerna","keso","ketchup","kex","kibbutz","kick","kikare","kille","kilo","kilt","kimono","kines","kinesisk","kiosk","kirke","kissa","kitsch","kiwi","leken","leker","lekerska","läker","läket","märke","märker","märket","mörker","naken","ocker","onkel","paket","pojke","raket","rike","ryker","räcker","röker","röket","silke","sjunker","skelett","skicka","smeker","sockel","socker","staket","steker","steket","sticker","stryker","säker","söker","söket","tecken","trycke","tänker","tänket","vacker","viker","vinkel","väcker"]),Lw=new Set(["back","block","brick","dock","drick","dyk","fick","flick","lek","lock","läk","märk","pack","rock","ryk","räck","rök","sack","sick","sjunk","skick","smek","sock","stek","stick","stryk","sök","tack","trick","tryck","tänk","vik","väck"]),Nw=new Set(["agera","arrangera","bagel","bageri","berg","borg","bygel","bygge","båge","dager","delegera","duger","engagera","finger","flygel","flyger","fogel","fågel","ge","gecko","gel","ger","hage","hagel","hunger","ignorera","intrigera","lager","ligger","ljuger","läge","läger","lägger","mage","nagel","navigera","negera","reagera","regel","segel","seger","segregera","spegel","stege","stiger","suger","tagel","tangera","tegel","tiger","tigger","tygel","väger","äger","ängel"]),Uw=new Set(["bag","berg","borg","byg","dag","drag","dug","flyg","lag","lig","ljug","lägg","mag","nag","reg","seg","stig","sug","tag","tig","vag","väg","äg"]),Fw=new Set(["blod","bo","bror","dom","flod","fon","fot","god","ion","jord","ko","kol","kontroll","lo","lov","mod","mol","mor","nod","ord","pol","ro","rod","roll","rot","son","tog","ton","tro","zon"]),Ww=new Set(["dam","dom","dröm","dum","fem","glöm","gum","ham","hem","kam","lam","lem","ram","rum","som","stam","ström","tom"]),Jm=new Set(["att","av","de","dem","den","det","din","du","en","ett","från","för","han","har","hon","hos","i","inte","jag","kan","med","men","min","när","och","om","på","sig","sin","ska","som","till","ur","var","vi","vill","är"]),Vw=new Set(["människa","marskalk"]),jw=new Set(["krist","kristus","kron","kronik","och"]),qw=new Set(["bage","dage","drage","frage","hage","klage","lage","mage","plage","sage","tage"]),Gw=[{suffix:"ssion",phonemes:["ɧ","uː","n"]},{suffix:"tion",phonemes:["ɧ","uː","n"]},{suffix:"sion",phonemes:["ɧ","uː","n"]},{suffix:"age",phonemes:["ɑː","ɧ"]},{suffix:"eur",phonemes:["øː","r"]},{suffix:"eum",phonemes:["eː","ɵ","m"]},{suffix:"ium",phonemes:["ɪ","ɵ","m"]}],Hw=["ssion","tion","sion","itet","eri","era","ist","ör","ment","ans","ens","ell","ent","ant","ik","ur","al","ös"],Kw=["för","be","ge","er","an"],Zw=new Set(["a","e","i","o","u","y","å","ä","ö","ɑ","ɛ","ɪ","ɔ","ʊ","ʉ","ʏ","œ","ø","ɵ"]),Zf={t:"ʈ",d:"ɖ",s:"ʂ",n:"ɳ",l:"ɭ"},Xf=new Set(["ʈ","ɖ","ʂ","ɳ"]);function Xw(s){return s=s.trim(),s=s.normalize("NFC"),s=s.toLowerCase(),s=s.replace(/\s+/g," "),s}function Yf(s){return s>=97&&s<=122||s===229||s===228||s===246||s===233||s===224||s===252||s===225||s===232||s===235||s===239}function Yw(s){const i=[],r=[...s];let u=0;const p=r.length;for(;u<p;){const m=r[u],y=m.codePointAt(0);if(m===" "||m==="	"||m===`
`){u++;continue}if(Mw.has(m)){i.push({text:m,isPun:!0}),u++;continue}if(Yf(y)){const b=u;for(;u<p&&Yf(r[u].codePointAt(0));)u++;i.push({text:r.slice(b,u).join(""),isPun:!1});continue}u++}return i}function Na(s){let i=0,r=!1;for(const u of s)Xm.has(u)?(r||i++,r=!0):r=!1;return i===0?1:i}function Jw(s){for(const i of Gw)if(s.endsWith(i.suffix)&&s.length>i.suffix.length){if(i.suffix==="age"&&qw.has(s))continue;return{stem:s.slice(0,s.length-i.suffix.length),phonemes:i.phonemes,found:!0}}return{stem:"",phonemes:null,found:!1}}function Qw(s){if(Bw.has(s))return!0;const i=[...s];for(let r=3;r>=1;r--)if(i.length>r){const u=i.slice(0,i.length-r).join("");if(Lw.has(u))return!0}return!1}function e$(s){if(Nw.has(s)||s.endsWith("era")||s.endsWith("erar")||s.endsWith("erade"))return!0;const i=[...s];for(let r=3;r>=1;r--)if(i.length>r){const u=i.slice(0,i.length-r).join("");if(Uw.has(u))return!0}return!1}function t$(s,i,r){const u=s.length,p=u-i,m=s[i],y=i+1<u?s[i+1]:"";if(p>=3)switch(s[i]+s[i+1]+s[i+2]){case"skj":return{ipa:["ɧ"],consumed:3};case"stj":return{ipa:["ɧ"],consumed:3};case"sch":return{ipa:["ɧ"],consumed:3};case"sng":return{ipa:["s","n"],consumed:3};case"ckj":return{ipa:["ɕ"],consumed:3}}if(p>=2){const $=s[i]+s[i+1];if($==="sk")return p>=3&&ya.has(s[i+2])&&!Vw.has(r)?{ipa:["ɧ"],consumed:2}:{ipa:["s","k"],consumed:2};if($==="sj")return{ipa:["ɧ"],consumed:2};if($==="sh")return{ipa:["ɧ"],consumed:2};if($==="ch")return jw.has(r)?{ipa:["k"],consumed:2}:{ipa:["ɧ"],consumed:2};if($==="ph")return{ipa:["f"],consumed:2};if($==="th")return{ipa:["t"],consumed:2};if($==="tj")return{ipa:["ɕ"],consumed:2};if($==="kj")return{ipa:["ɕ"],consumed:2};if($==="gn")return i===0?{ipa:["ɡ","n"],consumed:2}:{ipa:["ŋ","n"],consumed:2};if($==="ng")return{ipa:["ŋ"],consumed:2};if($==="nk")return{ipa:["ŋ","k"],consumed:2};if($==="ck")return{ipa:["k"],consumed:2};if($==="gj"&&i===0)return{ipa:["j"],consumed:2};if($==="lj"&&i===0)return{ipa:["j"],consumed:2};if($==="dj"&&i===0)return{ipa:["j"],consumed:2};if($==="hj"&&i===0)return{ipa:["j"],consumed:2}}if(m==="k"&&ya.has(y))return Qw(r)?{ipa:["k"],consumed:1}:{ipa:["ɕ"],consumed:1};if(m==="g"&&ya.has(y))return e$(r)?{ipa:["ɡ"],consumed:1}:{ipa:["j"],consumed:1};if(m==="g")return{ipa:["ɡ"],consumed:1};if(m==="c")return y==="e"||y==="i"?{ipa:["s"],consumed:1}:{ipa:["k"],consumed:1};if(m==="x")return{ipa:["k","s"],consumed:1};const b=Dw[m];return b!==void 0?b.length>1?{ipa:[...b],consumed:1}:{ipa:[b],consumed:1}:{ipa:[m],consumed:1}}function n$(s,i){let r=0,u=i+1;for(;u<s.length&&Ym.has(s[u]);)r++,u++;return r}function wa(s,i){return s==="o"&&Fw.has(i)?Rw:Pw[s]||s}function i$(s,i,r,u){const p=s[i];if(!u||Jm.has(r)||Ww.has(r))return Jn[p]||p;const m=n$(s,i);return m===0&&i===s.length-1||m===2&&p!=="o"&&i+1<s.length&&s[i+1]==="r"?wa(p,r):m>=2?Jn[p]||p:wa(p,r)}function Jf(s,i,r){const u=[...s],p=u.length,m=[];let y=0,b=0,$=!1;for(;y<p;){const I=u[y];if(Xm.has(I)){if($)m.push(Jn[I]||I);else{const P=b===r&&r>=0,O=i$(u,y,i,P);m.push(O),b++}$=!0,y++}else if(Ym.has(I)){$=!1;const{ipa:P,consumed:O}=t$(u,y,i);m.push(...P),y+=O}else $=!1,y++}return m}const on=0,$a=1,Qf=2;function s$(s){const i=[];let r=on;for(const u of s)switch(r){case on:u==="r"?r=$a:i.push(u);break;case $a:{if(u==="r")i.push("r","r"),r=on;else{const p=Zf[u];p?(i.push(p),r=Xf.has(p)?Qf:on):(i.push("r",u),r=on)}break}case Qf:{const p=Zf[u];p?(i.push(p),Xf.has(p)||(r=on)):(i.push(u),r=on);break}}return r===$a&&i.push("r"),i}function r$(s){if(Jm.has(s))return-1;if(Na(s)<=1)return 0;for(const r of Hw)if(s.endsWith(r)&&s.length>r.length){const u=s.slice(0,s.length-r.length);return Na(u)}for(const r of Kw)if(s.startsWith(r)&&s.length>r.length+1)return 1;return 0}function em(s){for(const i of s)if(Zw.has(i))return!0;return!1}function a$(s,i){if(i<0||s.length===0)return s;let r=0,u=-1,p=!1;for(let b=0;b<s.length;b++){const $=em(s[b]);if($&&!p){if(r===i){u=b;break}r++}p=$}if(u<0)return s;let m=u;for(;m>0&&!em(s[m-1]);)m--;return i===0&&(m=0),[...s.slice(0,m),"ˈ",...s.slice(m)]}function o$(s){if(!s)return[];const i=r$(s);let r;const u=Jw(s);if(u.found){const m=Na(u.stem),y=i>=m?-1:i;r=[...Jf(u.stem,s,y),...u.phonemes]}else r=Jf(s,s,i);let p=s$(r);return p=a$(p,i),p}class u${constructor(i={}){this._options=i}get languageCode(){return"sv"}phonemize(i){if(i=De(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=this._phonemizeInternal(i);return{tokens:r.tokens,prosody:new Array(r.tokens.length).fill(null)}}phonemizeWithProsody(i){return i=De(i),!i||typeof i!="string"?{tokens:[],prosody:[]}:this._phonemizeInternal(i)}_phonemizeInternal(i){const r=Xw(i),u=Yw(r),p=[],m=[];let y=!1;for(const b of u)if(b.isPun)for(const $ of b.text)p.push($),m.push({a1:0,a2:0,a3:0});else{y&&(p.push(" "),m.push({a1:0,a2:0,a3:0}));const $=o$(b.text);let I=0;for(const P of $)P!=="ˈ"&&P!=="ˌ"&&I++;for(const P of $){let O=0;P==="ˈ"&&(O=2),p.push(P),m.push({a1:0,a2:O,a3:I})}y=!0}return{tokens:p,prosody:m}}}const Qm=44032,l$=55203,d$=19,Ua=21,xn=28,c$="",p$="",h$="",f$="",m$="",g$="",_$="",y$="",w$="",$$="",Xn="",un="",ba="",b$="ɾ",v$="ŋ",va="ɛ",xa="ʌ",x$="ɯ",E$="ɰ",k$=["k",y$,"n","t",_$,b$,"m","p",g$,"s",w$,null,f$,$$,m$,h$,p$,c$,"h"],S$=[["a",null],[va,null],["j","a"],["j",va],[xa,null],["e",null],["j",xa],["j","e"],["o",null],["w","a"],["w",va],["w","e"],["j","o"],["u",null],["w",xa],["w","e"],["w","i"],["j","u"],[x$,null],[E$,"i"],["i",null]],eg=[{ph:null,liaisonInitial:-1,residualFinal:0},{ph:Xn,liaisonInitial:0,residualFinal:0},{ph:Xn,liaisonInitial:1,residualFinal:0},{ph:Xn,liaisonInitial:9,residualFinal:1},{ph:"n",liaisonInitial:-1,residualFinal:0},{ph:"n",liaisonInitial:12,residualFinal:4},{ph:"n",liaisonInitial:-1,residualFinal:0},{ph:un,liaisonInitial:3,residualFinal:0},{ph:"l",liaisonInitial:5,residualFinal:0},{ph:Xn,liaisonInitial:0,residualFinal:8},{ph:"m",liaisonInitial:6,residualFinal:8},{ph:"l",liaisonInitial:7,residualFinal:8},{ph:"l",liaisonInitial:9,residualFinal:8},{ph:"l",liaisonInitial:16,residualFinal:8},{ph:"l",liaisonInitial:17,residualFinal:8},{ph:"l",liaisonInitial:-1,residualFinal:0},{ph:"m",liaisonInitial:-1,residualFinal:0},{ph:ba,liaisonInitial:7,residualFinal:0},{ph:ba,liaisonInitial:9,residualFinal:17},{ph:un,liaisonInitial:9,residualFinal:0},{ph:un,liaisonInitial:10,residualFinal:0},{ph:v$,liaisonInitial:-1,residualFinal:0},{ph:un,liaisonInitial:12,residualFinal:0},{ph:un,liaisonInitial:14,residualFinal:0},{ph:Xn,liaisonInitial:15,residualFinal:0},{ph:un,liaisonInitial:16,residualFinal:0},{ph:ba,liaisonInitial:17,residualFinal:0},{ph:un,liaisonInitial:-1,residualFinal:0}],I$=new Set([",",".",";",":","!","?","。","，","！","？","、"]);function tm(s){return s>=Qm&&s<=l$}function T$(s){const i=s-Qm,r=Math.floor(i/(Ua*xn)),u=Math.floor(i%(Ua*xn)/xn),p=i%xn;return{initial:r,medial:u,final_:p}}function A$(s){return s>=4352&&s<=4370}function z$(s){return s>=4449&&s<=4469}function C$(s){return s>=4520&&s<=4546}function O$(s){const i=[],r=s.length;let u=0;for(;u<r;)if(A$(s[u])&&u+1<r&&z$(s[u+1])){const p=s[u]-4352,m=s[u+1]-4449;let y;u+2<r&&C$(s[u+2])?(y=s[u+2]-4520+1,u+=3):(y=0,u+=2);const b=(p*21+m)*28+y+44032;i.push(b)}else i.push(s[u]),u+=1;return i}function M$(s,i){if(s.initial<d$){const r=k$[s.initial];r!==null&&i.push(r)}if(s.medial<Ua){const[r,u]=S$[s.medial];i.push(r),u!==null&&i.push(u)}if(s.final_>0&&s.final_<xn){const r=eg[s.final_];r.ph!==null&&i.push(r.ph)}}function P$(s,i){if(s.length===0)return;const r=s.map(u=>T$(u));for(let u=0;u<r.length-1;u++){const p=r[u].final_;if(p===0||p>=xn||r[u+1].initial!==11)continue;const m=eg[p];m.liaisonInitial<0||(r[u+1].initial=m.liaisonInitial,r[u].final_=m.residualFinal)}for(const u of r)M$(u,i)}function nm(s){if(!s)return[];let i=[];for(const y of s)i.push(y.codePointAt(0));i=O$(i);const r=[];let u=!1;const p=i.length;let m=0;for(;m<p;){const y=i[m],b=String.fromCodePoint(y);if(b===" "||b==="	"||b===`
`||b==="\r"){u=!0,m++;continue}if(I$.has(b)){r.push(b),u=!1,m++;continue}if(tm(y)){u&&r.length>0&&r.push(" ");const $=m;for(;m<p&&tm(i[m]);)m++;P$(i.slice($,m),r),u=!0;continue}if(y>=65&&y<=90||y>=97&&y<=122){u&&r.length>0&&r.push(" "),r.push(b.toLowerCase()),u=!0,m++;continue}m++}return r}class R${constructor(i={}){this._options=i}get languageCode(){return"ko"}phonemize(i){if(i=De(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=nm(i),u=new Array(r.length).fill(null);return{tokens:r,prosody:u}}phonemizeWithProsody(i){if(i=De(i),!i||typeof i!="string")return{tokens:[],prosody:[]};const r=nm(i),u=r.map(()=>({a1:0,a2:0,a3:0}));return{tokens:r,prosody:u}}}const D$=1,B$=["å","Å"],L$=["och","att","jag","det","den","inte","som","han","hon","var","har","kan","ska","med","för","sig","sin","min","din","vill","från","när","här","där","också","alla","denna","efter","eller","under","utan","mycket","mellan","genom","bara","sedan","redan","aldrig","alltid","igen","något","några","varje","vilken","vilket","är"],N$={schema_version:D$,strong_chars:B$,function_words:L$};function U$(s){const i=new Set,r=new Set;if(!s||typeof s!="object")return{functionWords:i,strongChars:r};if(Array.isArray(s.function_words))for(const u of s.function_words)typeof u=="string"&&u&&i.add(u.toLowerCase());if(Array.isArray(s.strong_chars)){for(const u of s.strong_chars)if(typeof u=="string"&&u)for(const p of u)r.add(p)}return{functionWords:i,strongChars:r}}const{functionWords:F$,strongChars:W$}=U$(N$),V$=new Map([[12289,","],[12290,"."],[65377,"."],[65380,","]]);function Ja(s){return s>=12288&&s<=12351||s>=65280&&s<=65312||s>=65339&&s<=65344||s>=65371&&s<=65380||s>=65504&&s<=65519}function j$(s){const i=s.codePointAt(0);return Ja(i)?i>=65281&&i<=65374?String.fromCodePoint(i-65248):V$.get(i)??" ":s}function q$(s){let i=!1;for(const u of s)if(Ja(u.codePointAt(0))){i=!0;break}if(!i)return s;let r="";for(const u of s)r+=j$(u);return r}class im{constructor(i=["ja","en","zh","es","fr","pt","sv"],r={}){this.languages=new Set(i),this.defaultLatinLanguage=r.defaultLatinLanguage||"en",this._hasJa=this.languages.has("ja"),this._hasZh=this.languages.has("zh"),this._hasKo=this.languages.has("ko"),this._hasSv=this.languages.has("sv");const u=new Set;for(const p of this.languages)(p==="en"||p==="es"||p==="pt"||p==="fr"||p==="sv")&&u.add(p);this._detectSwedish=this._hasSv&&u.size>=2}_isKana(i){return i>=12352&&i<=12447||i>=12448&&i<=12543||i>=12784&&i<=12799}_isCJK(i){return i>=19968&&i<=40959||i>=13312&&i<=19903||i>=63744&&i<=64255}_isHangul(i){return i>=44032&&i<=55215||i>=4352&&i<=4607||i>=12592&&i<=12687}_isFullwidthLatin(i){return i>=65313&&i<=65338||i>=65345&&i<=65370}_isHalfwidthScript(i){return i>=65381&&i<=65503}_isLatin(i){return i>=65&&i<=90||i>=97&&i<=122||i>=192&&i<=214||i>=216&&i<=246||i>=248&&i<=255}hasKana(i){for(const r of i)if(this._isKana(r.codePointAt(0)))return!0;return!1}detectChar(i,r=!1){const u=i.codePointAt(0);return this._isKana(u)?this._hasJa?"ja":null:this._isHangul(u)?this._hasKo?"ko":null:this._isCJK(u)?this._hasJa&&this._hasZh?r?"ja":"zh":this._hasJa?"ja":this._hasZh?"zh":null:this._isFullwidthLatin(u)?this.languages.has(this.defaultLatinLanguage)?this.defaultLatinLanguage:null:Ja(u)?null:this._isHalfwidthScript(u)?this._hasJa?"ja":null:this._isLatin(u)&&this.languages.has(this.defaultLatinLanguage)?this.defaultLatinLanguage:null}detectLanguage(i){const r=this.segmentText(i);if(r.length===0)return this.defaultLatinLanguage;const u=new Map;for(const y of r){const b=u.get(y.language)||0;u.set(y.language,b+y.text.length)}let p=this.defaultLatinLanguage,m=0;for(const[y,b]of u)b>m&&(m=b,p=y);return u.size<=1&&p===this.defaultLatinLanguage&&m>0&&console.debug(`[g2p/detect] Latin-only text detected -- defaulting to '${p}'. If this text is ES, FR, PT, or SV, pass options.language explicitly.`),p}segmentText(i){if(!i||!i.trim())return[];const r=this.hasKana(i),u=[];let p=null,m=[];for(const y of i){const b=this.detectChar(y,r);b!==null&&b!==p&&p!==null&&(u.push({language:p,text:m.join("")}),m=[]),b!==null&&(p=b),m.push(y)}return m.length>0&&p!==null&&u.push({language:p,text:m.join("")}),u.length===0&&i.trim()&&u.push({language:this.defaultLatinLanguage,text:i}),this._detectSwedish?this._refineLatinSegmentsForSwedish(u):u}_refineLatinSegmentsForSwedish(i){const r=this.defaultLatinLanguage;if(r==="sv")return i;const u=[];for(const p of i){if(p.language!==r){u.push(p);continue}let m=!1;for(const y of p.text.split(/\s+/)){const b=G$(y).toLowerCase();if(!b)continue;if(F$.has(b)){m=!0;break}let $=!1;for(const I of b)if(W$.has(I)){$=!0;break}if($){m=!0;break}}u.push(m?{language:"sv",text:p.text}:p)}return u}}function G$(s){const i=new Set([".",",",";",":","!","?"]);let r=0,u=s.length;for(;r<u&&i.has(s[r]);)r+=1;for(;u>r&&i.has(s[u-1]);)u-=1;return s.slice(r,u)}const sm=2;function H$(s){return s==null?{compatible:!0}:s===sm?{compatible:!0}:{compatible:!1,message:`PUA version mismatch: model has pua_compat_version=${s}, but @piper-plus/g2p expects version ${sm}. Some phoneme tokens may not encode correctly.`}}const gs={"a:":"","i:":"","u:":"","e:":"","o:":"",cl:"",ky:"",kw:"",gy:"",gw:"",ty:"",dy:"",py:"",by:"",ch:"",ts:"",sh:"",zy:"",hy:"",ny:"",my:"",ry:"","?!":"","?.":"","?~":"",N_m:"",N_n:"",N_ng:"",N_uvular:"",rr:"",y_vowel:"",pʰ:"",tʰ:"",kʰ:"",tɕ:"",tɕʰ:"",tʂ:"",tʂʰ:"",tsʰ:"",aɪ:"",eɪ:"",aʊ:"",oʊ:"",an:"",ən:"",aŋ:"",əŋ:"",uŋ:"",ia:"",iɛ:"",iou:"",iaʊ:"",iɛn:"",in:"",iaŋ:"",iŋ:"",iuŋ:"",ua:"",uo:"",uaɪ:"",ueɪ:"",uan:"",uən:"",uaŋ:"",uəŋ:"",yɛ:"",yɛn:"",yn:"",ɻ̩:"",tone1:"",tone2:"",tone3:"",tone4:"",tone5:"",p͈:"",t͈:"",k͈:"",s͈:"",t͈ɕ:"",k̚:"",t̚:"",p̚:"",tʃ:"",dʒ:"",ɛ̃:"",ɑ̃:"",ɔ̃:"",iː:"",yː:"",eː:"",ɛː:"",øː:"",ɑː:"",oː:"",uː:"",ʉː:"",ɔɪ:"",œ̃:"",ɐ̃:""},K$=Object.create(null);for(const[s,i]of Object.entries(gs))K$[i]=s;function Z$(s){return gs[s]??s}class X${constructor(i,r={}){if(!i||typeof i!="object")throw new Error("phonemeIdMap is required and must be an object");this._map=i,this._strict=r.strict===!0,this._lookupMap=new Map;for(const[u,p]of Object.entries(i))this._lookupMap.set(u,p);for(const[u,p]of Object.entries(gs))if(!this._lookupMap.has(u)){const m=i[p];m&&this._lookupMap.set(u,m)}this._bos=this._resolveId("^","BOS"),this._eos=this._resolveId("$","EOS"),this._pad=this._resolveId("_","PAD")}_resolveId(i,r){const u=this._lookupMap.get(i);if(!u||u.length===0)throw new Error(`phonemeIdMap is missing required '${i}' (${r}) entry`);return u[0]}_lookupToken(i){return this._lookupMap.get(i)??null}encode(i){const r=[this._bos],u=new Set;for(let p=0;p<i.length;p++){const m=this._lookupToken(i[p]);if(m)r.push(...m);else{if(this._strict)throw new Error(`Unknown phoneme symbol "${i[p]}" not in phonemeIdMap`);u.add(i[p])}r.push(this._pad)}return r.push(this._eos),{phonemeIds:r,droppedSymbols:[...u]}}encodeWithProsody(i,r){if(!r)return{...this.encode(i),prosodyFlat:null};if(r.length!==i.length)throw new Error(`prosody length (${r.length}) must match tokens length (${i.length})`);const u=[],p=[],m=new Set;u.push(this._bos),p.push(0,0,0);for(let y=0;y<i.length;y++){const b=r[y],$=b?b.a1:0,I=b?b.a2:0,P=b?b.a3:0,O=this._lookupToken(i[y]);if(O)for(const R of O)u.push(R),p.push($,I,P);else{if(this._strict)throw new Error(`Unknown phoneme symbol "${i[y]}" not in phonemeIdMap`);m.add(i[y])}u.push(this._pad),p.push(0,0,0)}return u.push(this._eos),p.push(0,0,0),{phonemeIds:u,prosodyFlat:p,droppedSymbols:[...m]}}}const rm=1e5,am=Object.freeze({none:0,"x-weak":100,weak:200,medium:400,strong:700,"x-strong":1e3}),om=Object.freeze({"x-slow":1.5,slow:1.25,medium:1,fast:.8,"x-fast":.6}),Y$=/^\s*<speak[\s>]/s;function tg(s){return typeof s!="string"?!1:Y$.test(s)}function J$(s){const i=s.trim().toLowerCase();if(i.endsWith("ms")){const u=parseFloat(i.slice(0,-2));return Number.isFinite(u)?Math.trunc(u):0}if(i.endsWith("s")){const u=parseFloat(i.slice(0,-1));return Number.isFinite(u)?Math.trunc(u*1e3):0}const r=parseFloat(i);return Number.isFinite(r)?Math.trunc(r):0}function Q$(s){const i=s.trim().toLowerCase();if(i in om)return om[i];if(i.endsWith("%")){const u=parseFloat(i.slice(0,-1));return Number.isFinite(u)&&u>0?100/u:1}const r=parseFloat(i);return Number.isFinite(r)&&r>0?r:1}function eb(s){const i=s.indexOf("}");return i>=0?s.slice(i+1):s}const um=Object.freeze({amp:"&",lt:"<",gt:">",quot:'"',apos:"'"});function ng(s){return s.replace(/&([a-zA-Z]+|#\d+|#x[0-9a-fA-F]+);/g,(i,r)=>{if(r.startsWith("#x")){const u=parseInt(r.slice(2),16);return Number.isFinite(u)?String.fromCodePoint(u):i}if(r.startsWith("#")){const u=parseInt(r.slice(1),10);return Number.isFinite(u)?String.fromCodePoint(u):i}return r in um?um[r]:i})}function lm(s){const i={},r=/([a-zA-Z_:][\w:.-]*)\s*=\s*("([^"]*)"|'([^']*)')/g;let u;for(;(u=r.exec(s))!==null;){const p=u[1],m=u[3]!==void 0?u[3]:u[4];i[p]=ng(m)}return i}function tb(s){const i=[];let r=0;const u=s.length;for(;r<u;){if(s[r]!=="<"){let R=s.indexOf("<",r);R===-1&&(R=u);const B=s.slice(r,R);i.push({kind:"text",text:ng(B)}),r=R;continue}if(s.startsWith("<!--",r)){const R=s.indexOf("-->",r+4);if(R===-1)throw new SyntaxError("unterminated comment");r=R+3;continue}if(s.startsWith("<![CDATA[",r)){const R=s.indexOf("]]>",r+9);if(R===-1)throw new SyntaxError("unterminated CDATA");i.push({kind:"text",text:s.slice(r+9,R)}),r=R+3;continue}if(s.startsWith("<?",r)){const R=s.indexOf("?>",r+2);if(R===-1)throw new SyntaxError("unterminated processing instruction");r=R+2;continue}if(s.startsWith("<!",r))throw new SyntaxError("DTD / declaration not supported");const p=s.indexOf(">",r+1);if(p===-1)throw new SyntaxError("unterminated tag");let m=s.slice(r+1,p);r=p+1;let y=!1,b=!1;if(m.startsWith("/")&&(y=!0,m=m.slice(1)),m.endsWith("/")&&(b=!0,m=m.slice(0,-1)),m=m.trim(),m.length===0)throw new SyntaxError("empty tag");const $=m.search(/\s/),I=$===-1?m:m.slice(0,$),P=$===-1?"":m.slice($),O=eb(I);if(y){if(P.trim().length>0)throw new SyntaxError(`close tag with attributes: ${O}`);i.push({kind:"close",name:O})}else b?i.push({kind:"self",name:O,attrs:lm(P)}):i.push({kind:"open",name:O,attrs:lm(P)})}return i}function nb(s){if(s.time!==void 0)return J$(s.time);if(s.strength!==void 0){const i=s.strength.toLowerCase();return am[i]??400}return am.medium}function ib(s){const i=[],r=[];let u=1;for(const p of s)if(p.kind==="text"){const m=p.text.trim();m&&i.push({text:m,breakMs:0,rate:u})}else if(p.kind==="open"){const m=u;p.name==="prosody"&&p.attrs.rate!==void 0&&(u=Q$(p.attrs.rate)),r.push({name:p.name,prevRate:m})}else if(p.kind==="self")p.name==="break"?i.push({text:"",breakMs:nb(p.attrs),rate:u}):p.name==="prosody"&&p.attrs.rate;else if(p.kind==="close"){let m;for(;r.length>0&&(m=r.pop(),m.name!==p.name););if(m===void 0)throw new SyntaxError(`unmatched close tag: ${p.name}`);u=m.prevRate}if(r.length>0){const p=r.map(m=>m.name).join(", ");throw new SyntaxError(`unclosed tag(s): ${p}`)}return i}function sb(s){return s.filter(i=>i.text.trim().length>0||i.breakMs>0)}function dm(s){let i=s,r;do r=i,i=i.replace(/<[^>]*>/g,"");while(i!==r);return i.trim()}function rb(s){if(typeof s!="string")throw new TypeError("parseSsml: expected a string");if(!tg(s))return[{text:s,breakMs:0,rate:1}];if(s.length>rm)throw new RangeError(`SSML input too large: ${s.length} bytes (max: ${rm})`);let i;try{i=tb(s)}catch{return[{text:dm(s)||s,breakMs:0,rate:1}]}let r;try{r=ib(i)}catch{return[{text:dm(s)||s,breakMs:0,rate:1}]}const u=sb(r);return u.length>0?u:[{text:"",breakMs:0,rate:1}]}const Ea=["ja","en","zh","ko","es","fr","pt","pt-PT","sv"],ab={en:s=>new ja({cmuDict:s.cmuDict}),ko:()=>new R$,es:()=>new B1,fr:()=>new aw,pt:()=>new Km,"pt-PT":()=>new Ow,sv:()=>new u$},ob=new Set(["en","es","fr","pt","pt-PT","sv"]),ub=new Set(["^","$","?",...["?!","?.","?~"].flatMap(s=>[s,Z$(s)])]);class Qa{constructor(i,r,u=null){this._phonemizers=i,this._detector=r,this._zhDetector=u,this._disposed=!1}static async create(i={}){const r=i.languages?i.languages.filter(y=>Ea.includes(y)):[...Ea];if(r.length===0)throw new Error(`G2P.create(): no valid languages specified. Supported languages: ${Ea.join(", ")}`);const u=new Map,p=new im(r);if(r.includes("ja")){const y=new sy({openjtalkModule:i.openjtalkModule,jaDict:i.jaDict});await y.initialize(),u.set("ja",y)}let m=null;if(r.includes("zh")){const y=i.pinyinDict?us(i.pinyinDict):await xm();u.set("zh",new v1({pinyinDict:y})),m=new im(r,{defaultLatinLanguage:r.includes("en")?"en":"zh"})}for(const y of r){if(y==="ja"||y==="zh")continue;const b=ab[y];if(b){const $=b(i);typeof $.initialize=="function"&&await $.initialize(),i.customDicts&&typeof $.setCustomDicts=="function"&&$.setCustomDicts(i.customDicts),u.set(y,$)}}return new Qa(u,p,m)}phonemize(i,r={}){this._ensureNotDisposed(),i=De(i);const u=this._resolveLanguage(i,r),p=this._getPhonemizerOrThrow(u),m=u==="zh"?this._phonemizeChineseText(i):p.phonemize(this._prepareText(i,u));return{tokens:m.tokens,prosody:new Array(m.tokens.length).fill(null),language:u}}phonemizeWithProsody(i,r={}){this._ensureNotDisposed(),i=De(i);const u=this._resolveLanguage(i,r),p=this._getPhonemizerOrThrow(u);if(u==="zh"){const y=this._phonemizeChineseText(i);return{tokens:y.tokens,prosody:y.prosody,language:u}}if(i=this._prepareText(i,u),typeof p.phonemizeWithProsody=="function"){const y=p.phonemizeWithProsody(i);return{tokens:y.tokens,prosody:y.prosody,language:u}}const m=p.phonemize(i);return{tokens:m.tokens,prosody:new Array(m.tokens.length).fill(null),language:u}}encode(i,r,u={}){this._ensureNotDisposed();const{tokens:p,prosody:m}=this.phonemizeWithProsody(i,u);return new X$(r).encodeWithProsody(p,m)}detectLanguage(i){return this._ensureNotDisposed(),i=De(i),this._detector.detectLanguage(i)}segmentText(i){return this._ensureNotDisposed(),i=De(i),this._detector.segmentText(i)}dispose(){if(!this._disposed){this._disposed=!0;for(const[,i]of this._phonemizers)typeof i.dispose=="function"&&i.dispose();this._phonemizers.clear()}}_resolveLanguage(i,r){return r.language?r.language:this._detector.detectLanguage(i)}_phonemizeChineseText(i){const r=this._getPhonemizerOrThrow("zh");if(typeof i!="string"||!this._zhDetector)return r.phonemizeWithProsody(i);const u=this._zhDetector.segmentText(i),p=u.some($=>$.language==="zh"),m=r.isZhEnDispatchEnabled()===!0,y=[],b=[];return u.forEach(($,I)=>{var G,te;const P=$.language,O=this._prepareText($.text,P),R=((G=u[I-1])==null?void 0:G.language)==="zh"||((te=u[I+1])==null?void 0:te.language)==="zh";if(m&&P==="en"&&p&&R){const Z=r.phonemizeEmbeddedEnglishWithProsody(O);y.push(...Z.tokens),b.push(...Z.prosody);return}const B=this._getPhonemizerOrThrow(P),V=typeof B.phonemizeWithProsody=="function"?B.phonemizeWithProsody(O):B.phonemize(O);V.tokens.forEach((Z,he)=>{var me;(P==="ja"?ub.has(Z):Z==="^"||Z==="$")||(y.push(Z),b.push(((me=V.prosody)==null?void 0:me[he])??null))})}),{tokens:y,prosody:b}}_prepareText(i,r){return typeof i!="string"||!ob.has(r)?i:q$(i)}_getPhonemizerOrThrow(i){const r=this._phonemizers.get(i);if(!r){const u=[...this._phonemizers.keys()];throw new Error(`G2P: language "${i}" is not initialised. Available languages: [${u.join(", ")}]. Pass the language in G2P.create({ languages: [...] }) to enable it.`)}return r}_ensureNotDisposed(){if(this._disposed)throw new Error("G2P: instance has been disposed. Create a new instance with G2P.create().")}}const lb=/[\u000B\u000C\u0085]/g,db=/[\u0000-\u0008\u000E-\u001F\u007F-\u0084\u0086-\u009F]/g;function ln(s){return typeof s!="string"?s:s.replace(lb," ").replace(db,"")}const ig=256,cb=new Set([0,1,2]);function pb(s,i){if(!s||!i||i.length!==s.phonemes.length)return s;const r=[];for(let u=0;u<s.phonemes.length;u++)cb.has(i[u])||r.push(s.phonemes[u]);return s.phonemes=r,s}function hb(s,i,r=ig,u=null){var P,O;if(!Number.isFinite(i)||i<=0)throw new TypeError(`sampleRate must be a positive finite number (Hz), got ${i}`);if(!Number.isFinite(r)||r<=0)throw new TypeError(`hopLength must be a positive finite number (samples), got ${r}`);if(s==null||typeof s.length!="number")throw new TypeError("durations must be a Float32Array, Array, or indexable with a numeric length property");const p=s.length;if(u!=null){if(!Array.isArray(u))throw new TypeError("phonemeTokens must be an array of strings");if(u.length!==p)throw new RangeError(`length mismatch: durations has ${p} elements but phonemeTokens has ${u.length}`)}const m=r/i*1e3,y=new Array(p);let b=0,$=0;const I=u!=null;for(let R=0;R<p;R++){const B=s[R];B<0&&((O=(P=globalThis.console)==null?void 0:P.warn)==null||O.call(P,`negative phoneme duration clamped to 0 (index=${R}, value=${B})`));const G=Math.ceil(B>0?B:0)*m,te=b,Z=b+G,he=I?u[R]:`ph_${R}`;y[R]={phoneme:he,start_ms:te,end_ms:Z,duration_ms:G},b=Z,$+=G}return{phonemes:y,total_duration_ms:$,sample_rate:i}}function fb(s,i=null){const r={};if(!s)return r;const u=Object.entries(s).sort(([p],[m])=>p<m?-1:p>m?1:0);for(const[p,m]of u){if(!Array.isArray(m))continue;let y=p;if(i&&i[p]!==void 0)y=i[p];else if(p.length===1){const b=p.charCodeAt(0);b>=57344&&b<=63743&&(y=`U+${b.toString(16).toUpperCase().padStart(4,"0")}`)}for(const b of m)typeof b=="number"&&!(b in r)&&(r[b]=y)}return r}class eo{constructor(i,r,u="not-requested"){this._wasm=i,this._languages=r,this._disposed=!1,this._japaneseDictionaryStatus=u}get japaneseDictionaryStatus(){return this._japaneseDictionaryStatus}static async create(i,r={}){let u;if(r.wasmLoader)u=await r.wasmLoader();else{const b=r.wasmUrl;if(!b)throw new Error("Either wasmUrl or wasmLoader must be provided");u=await In(()=>import(b),[],import.meta.url),await u.default()}const p=new u.WasmPhonemizer(i);if(typeof p.setChineseDictionary=="function")try{const b=r.zhDictBaseUrl||new URL("../../assets/",self.location).href,[$,I]=await Promise.all([fetch(new URL("pinyin_single.json",b)),fetch(new URL("pinyin_phrases.json",b))]);if($.ok&&I.ok){const P=new Uint8Array(await $.arrayBuffer()),O=new Uint8Array(await I.arrayBuffer());p.setChineseDictionary(P,O)}else console.warn("[piper-plus] Chinese pinyin dictionaries not found, zh will use passthrough")}catch(b){console.warn("[piper-plus] Failed to load Chinese dictionaries:",b.message)}const m=r.jaDict?await gb(p,r.jaDict):"not-requested",y=typeof p.getSupportedLanguages=="function"?Array.from(p.getSupportedLanguages()):["ja","en","zh","ko","es","fr","pt","sv"];return new eo(p,y,m)}async loadEnglishDictionary(i){if(typeof this._wasm.setEnglishDictionary!="function")return"unsupported";if(typeof i!="function")return console.warn("[piper-plus] @piper-plus/g2p has no loadCmuDict (CMU dictionary); digits and Latin words inside Chinese text are read letter by letter. Update @piper-plus/g2p."),"failed";try{const r=await i(),u=JSON.stringify(Object.fromEntries(r));return this._wasm.setEnglishDictionary(new TextEncoder().encode(u)),"loaded"}catch(r){return console.warn("[piper-plus] Failed to load the English dictionary into the Rust WASM G2P; English inside Chinese text will use passthrough:",r.message),"failed"}}encode(i,r){const u=this._wasm.phonemize(i,r);try{const p=Array.from(u.phonemeIds);let m=null;const y=u.prosodyFeatures;if(y&&y.length>0){m=[];for(let I=0;I<y.length;I+=3)m.push([y[I],y[I+1],y[I+2]])}const b=u.droppedSymbols,$=b===void 0?null:Array.from(b);return{phonemeIds:p,prosodyFeatures:m,droppedSymbols:$}}finally{u.free()}}detectLanguage(i){return this._wasm.detectLanguage(i)}get supportedLanguages(){return this._languages}dispose(){this._disposed||(this._disposed=!0,this._wasm.free())}}async function mb(s){if(typeof crypto>"u"||!crypto.subtle)return null;const i=await crypto.subtle.digest("SHA-256",s);return Array.from(new Uint8Array(i)).map(r=>r.toString(16).padStart(2,"0")).join("")}async function gb(s,i){if(typeof s.setJapaneseDictionary!="function")return console.warn("[piper-plus] jaDict was provided but this WASM build bundles its own Japanese dictionary; the option has no effect."),"unsupported";try{const r=await fetch(i.url);if(!r.ok)return console.warn(`[piper-plus] Japanese dictionary fetch failed (${r.status}); ja will use passthrough.`),"failed";const u=await r.arrayBuffer();if(i.sha256){const p=await mb(u);if(p===null)console.warn("[piper-plus] crypto.subtle unavailable -- skipping Japanese dictionary integrity check. Serve over HTTPS for full verification.");else if(p!==i.sha256)return console.warn(`[piper-plus] Japanese dictionary SHA-256 mismatch (expected ${i.sha256}, got ${p}); ja will use passthrough.`),"failed"}return s.setJapaneseDictionary(new Uint8Array(u)),"loaded"}catch(r){return console.warn("[piper-plus] Failed to load Japanese dictionary:",r.message),"failed"}}class to{constructor(i,r,u){this._g2p=i,this._phonemeIdMap=r,this._languages=u,this._disposed=!1}static async create(i,r,u={}){const p=await Qa.create({languages:i,...u});return new to(p,r,i)}encode(i,r){const u=this._g2p.encode(i,this._phonemeIdMap,{language:r});let p=null;if(u.prosodyFlat&&u.prosodyFlat.length>0){const b=u.prosodyFlat;p=[];for(let $=0;$<b.length;$+=3)p.push([b[$],b[$+1],b[$+2]])}const m={phonemeIds:u.phonemeIds,prosodyFeatures:p};if(Array.isArray(u.droppedSymbols))return m.droppedSymbols=u.droppedSymbols,m;let y;return Object.defineProperty(m,"droppedSymbols",{enumerable:!0,get:()=>y??(y=this._findDroppedSymbols(i,r))}),m}_findDroppedSymbols(i,r){const u=this._phonemeIdMap,{tokens:p}=this._g2p.phonemizeWithProsody(i,{language:r}),m=p.filter(y=>!Object.hasOwn(u,y)&&!Object.hasOwn(u,gs[y]??""));return[...new Set(m)]}detectLanguage(i){return this._g2p.detectLanguage(i)}get supportedLanguages(){return this._languages}dispose(){this._disposed||(this._disposed=!0,this._g2p.dispose())}}class _b{constructor({phonemizers:i,fallback:r,detector:u}){this._phonemizers=i,this._fallback=r||null,this._detector=u||null,this._disposed=!1}encode(i,r){const u=r||this.detectLanguage(i),p=this._phonemizers.get(u)||this._fallback;if(!p)throw new Error(`No phonemizer registered for language "${u}" and no fallback configured`);return p.encode(i,u)}detectLanguage(i){if(this._detector)return this._detector.detectLanguage(i);const r=this._phonemizers.values().next().value;if(r)return r.detectLanguage(i);if(this._fallback)return this._fallback.detectLanguage(i);throw new Error("No phonemizers registered")}get supportedLanguages(){const i=new Set;for(const[r]of this._phonemizers)i.add(r);if(this._fallback)for(const r of this._fallback.supportedLanguages)i.add(r);return[...i]}dispose(){if(this._disposed)return;this._disposed=!0;const i=new Set;for(const r of this._phonemizers.values())i.has(r)||(i.add(r),r.dispose());this._fallback&&!i.has(this._fallback)&&this._fallback.dispose()}}const ds=15,yb=3,sg=0,Hi=256,cm=.01,vn=2205;function pm(s,i){const r=s.length;if(r-2<yb)return{phonemeIds:s,prosodyFeatures:i,wasPadded:!1,frontPad:0,backPad:0};if(r>=ds)return{phonemeIds:s,prosodyFeatures:i,wasPadded:!1,frontPad:0,backPad:0};const p=ds-r,m=Math.floor(p/2),y=p-m,b=s.slice(0,1),$=s.slice(1,-1),I=s.slice(-1),P=[...b,...new Array(m).fill(0),...$,...new Array(y).fill(0),...I];let O=null;if(i!=null){const R=i.slice(0,1),B=i.slice(1,-1),V=i.slice(-1);O=[...R,...new Array(m).fill(null).map(()=>[0,0,0]),...B,...new Array(y).fill(null).map(()=>[0,0,0]),...V]}return{phonemeIds:P,prosodyFeatures:O,wasPadded:!0,frontPad:m,backPad:y}}function wb(s,i,r,u,p,m=sg){if(r<=0&&u<=0||i==null||p<=0)return s;const y=1+r+u+1;if(i.length<y)return s;let b=0;for(let Z=0;Z<1+r;Z++)b+=i[Z];const $=Math.trunc(b*p);let I=0;if(u>0){const Z=i.length-1-u;for(let he=Z;he<i.length-1;he++)I+=i[he]}const P=Math.trunc(I*p),O=i[i.length-1],R=Math.max(0,O-m),B=P+Math.trunc(R*p),V=s.length,G=Math.max(0,$);let te=V-B;return te<G&&(te=G),G>=V||te<=0||G>=te?s:s.subarray(G,te)}function $b(s,i,r,u=sg){if(r<=0||i==null||i.length===0)return s;const p=i[i.length-1],m=Math.ceil(p),y=Math.max(0,m-u);if(y<=0)return s;const b=Math.trunc(y*r);return b>=s.length?s:s.subarray(0,s.length-b)}function hm(s,i=256){const r=s.length;if(r<=vn)return s;const u=Math.floor(r/i);if(u===0)return s;let p=-1,m=-1;for(let P=0;P<u;P++){const O=P*i;let R=0;for(let V=0;V<i;V++){const G=s[O+V];R+=G*G}Math.sqrt(R/i)>cm&&(p<0&&(p=P),m=P)}const y=r%i;if(y>0){const P=u*i;let O=0;for(let B=0;B<y;B++){const V=s[P+B];O+=V*V}Math.sqrt(O/y)>cm&&(p<0&&(p=u),m=u)}if(p<0)return s.slice(0,vn);let b=p*i,$=Math.min((m+1)*i,r);if($-b<vn){const P=Math.floor((b+$)/2),O=Math.floor(vn/2);b=Math.max(0,P-O),$=Math.min(r,b+vn),b=Math.max(0,$-vn)}return s.slice(b,$)}function fm(s,i,r){if(s>=ds)return{noiseScale:i,noiseW:r};const u=Math.min(1,s/ds);return{noiseScale:i*Math.max(.5,u),noiseW:r*Math.max(.4,u)}}const Qn=.4,ei=1,ti=.5,Ki=22050,ka=100,bb=1,vb=2,xb=8,Eb=2,kb=Qn,Sb=ei,Ib=ti,Tb=/[\u3040-\u30FF]/,Ab=/[\u3400-\u9FFF]/;class no{constructor(){this._session=null,this._config=null,this._phonemizer=null,this._unavailableLanguages=new Map,this._loadWasmEnglishDictionary=null,this._ort=null,this._initialized=!1,this._warmupPromise=null,this._speakerInputSession=null,this._speakerInputContract=null}static async initialize(i={}){const r=new no;return await r._init(i),r}async synthesize(i,r={}){var Ie,Le,lt,Ce,nt,ke;if(i=ln(i),this._assertReady(),this._warmupPromise&&(await this._warmupPromise,this._warmupPromise=null),!i)throw new Error("text is required");if(r.speakerEmbedding!==void 0&&r.speakerEmbedding!==null&&!(r.speakerEmbedding instanceof Float32Array))throw new TypeError("options.speakerEmbedding must be a Float32Array");if(r.ssml!==!1&&tg(i))return this.synthesizeSsml(i,r);const u=r.language||this._detectLanguage(i);let p=r.noiseScale??((Ie=this._config.inference)==null?void 0:Ie.noise_scale)??Qn;const m=r.lengthScale??((Le=this._config.inference)==null?void 0:Le.length_scale)??ei;let y=r.noiseW??((lt=this._config.inference)==null?void 0:lt.noise_w)??ti,{phonemeIds:b,prosodyFeatures:$}=await this._textToPhonemeIds(i,u);const I=b.length,P=fm(I,p,y);p=P.noiseScale,y=P.noiseW;const O=b,R=pm(b,$);b=R.phonemeIds,$=R.prosodyFeatures;const B=R.wasPadded,V=R.frontPad,G=R.backPad,te=await this._infer(b,$,{noiseScale:p,lengthScale:m,noiseW:y,language:u,speakerEmbedding:r.speakerEmbedding});let Z=te.audio;const he=te.durations;if(B)if(he!=null){const xt=((Ce=this._config.audio)==null?void 0:Ce.hop_size)??Hi;Z=wb(Z,he,V,G,xt>0?xt:Hi)}else Z=hm(Z);else if(he!=null){const xt=((nt=this._config.audio)==null?void 0:nt.hop_size)??Hi;Z=$b(Z,he,xt>0?xt:Hi)}const fe=((ke=this._config.audio)==null?void 0:ke.sample_rate)??Ki,me=this._createTiming(he,O);return new oa(Z,fe,me)}async synthesizeSsml(i,r={}){var R,B,V,G;if(i=ln(i),this._assertReady(),this._warmupPromise&&(await this._warmupPromise,this._warmupPromise=null),typeof i!="string"||i.length===0)throw new Error("ssmlText is required");const u=rb(i),p=((R=this._config.audio)==null?void 0:R.sample_rate)??Ki,m=r.noiseScale??((B=this._config.inference)==null?void 0:B.noise_scale)??Qn,y=r.lengthScale??((V=this._config.inference)==null?void 0:V.length_scale)??ei,b=r.noiseW??((G=this._config.inference)==null?void 0:G.noise_w)??ti,$=[];for(const te of u){const Z=ln(te.text);if(Z&&Z.length>0){const he=r.language||this._detectLanguage(Z),{phonemeIds:fe,prosodyFeatures:me}=await this._textToPhonemeIds(Z,he);if(fe.length!==0){const Ie=await this._infer(fe,me,{noiseScale:m,lengthScale:y*(te.rate??1),noiseW:b,language:he});$.push(Ie.audio)}}if(te.breakMs&&te.breakMs>0){const he=Math.max(0,Math.floor(te.breakMs/1e3*p));he>0&&$.push(new Float32Array(he))}}let I=0;for(const te of $)I+=te.length;const P=new Float32Array(I);let O=0;for(const te of $)P.set(te,O),O+=te.length;return new oa(P,p,null)}async synthesizeWithVoiceCloning(i,r,u={}){var fe,me,Ie,Le;if(i=ln(i),this._assertReady(),this._warmupPromise&&(await this._warmupPromise,this._warmupPromise=null),!i)throw new Error("text is required");if(!r||!(r instanceof Float32Array))throw new Error("speakerEmbedding must be a Float32Array");if(r.length===0)throw new Error("speakerEmbedding must be non-empty");const p=u.language||this._detectLanguage(i);let m=u.noiseScale??((fe=this._config.inference)==null?void 0:fe.noise_scale)??Qn;const y=u.lengthScale??((me=this._config.inference)==null?void 0:me.length_scale)??ei;let b=u.noiseW??((Ie=this._config.inference)==null?void 0:Ie.noise_w)??ti,{phonemeIds:$,prosodyFeatures:I}=await this._textToPhonemeIds(i,p);const P=$.length,O=fm(P,m,b);m=O.noiseScale,b=O.noiseW;const R=pm($,I);$=R.phonemeIds,I=R.prosodyFeatures;const B=R.wasPadded,V=await this._infer($,I,{noiseScale:m,lengthScale:y,noiseW:b,language:p,speakerEmbedding:r});let G=V.audio;const te=V.durations;B&&(G=hm(G));const Z=((Le=this._config.audio)==null?void 0:Le.sample_rate)??Ki,he=this._createTiming(te,$);return new oa(G,Z,he)}async synthesizeFromReferenceAudio({text:i,referenceWav:r,encoder:u,sampleRate:p,options:m={}}){if(i=ln(i),!i)throw new Error("text is required");if(!r)throw new Error("referenceWav is required");if(!u||typeof u.encode!="function")throw new TypeError("encoder must be an initialized SpeakerEncoder instance");const y=await u.encode(r,p);return this.synthesize(i,{...m,speakerEmbedding:y})}async findDroppedSymbols(i,r={}){if(i=ln(i),this._assertReady(),!i)throw new Error("text is required");const u=r.language||this._detectLanguage(i),{droppedSymbols:p}=await this._textToPhonemeIds(i,u);if(!Array.isArray(p))throw new Error(`The ${u} phonemizer does not report dropped symbols (outdated WASM or G2P build).`);return p}async synthesizeStreaming(i,r={}){var I,P,O;if(i=ln(i),this._assertReady(),!i)throw new Error("text is required");const u=r.language||this._detectLanguage(i),p=r.noiseScale??((I=this._config.inference)==null?void 0:I.noise_scale)??Qn,m=r.lengthScale??((P=this._config.inference)==null?void 0:P.length_scale)??ei,y=r.noiseW??((O=this._config.inference)==null?void 0:O.noise_w)??ti,b=r.onChunk||(()=>{});await new o_({phonemize:async R=>{const{phonemeIds:B}=await this._textToPhonemeIds(R,u);return B},synthesize:async R=>(await this._infer(R,null,{noiseScale:p,lengthScale:m,noiseW:y,language:u,speakerEmbedding:r.speakerEmbedding})).audio,onAudioChunk:b}).synthesizeAndPlay(i,u)}dispose(){this._session&&(typeof this._session.release=="function"&&this._session.release(),this._session=null),this._phonemizer&&(this._phonemizer.dispose(),this._phonemizer=null),this._sessionManager=null,this._speakerInputSession=null,this._speakerInputContract=null,this._modelUrl=null,this._warmupPromise=null,this._initialized=!1}get isInitialized(){return this._initialized}get config(){return this._config}async _init(i){const r=i.ort||globalThis.ort;if(!r)throw new Error("onnxruntime-web is required. Pass it via options.ort or load it globally.");this._ort=r;const u=i.onProgress||(()=>{});try{u({stage:"model",progress:0,message:"Resolving model..."});const m=await new b_({showModelNotice:i.showModelNotice}).resolveUrls(i.model),{modelUrl:y,configUrl:b,configFallbackUrl:$}=m;bm(m.notice??Ta(i.model),{showModelNotice:i.showModelNotice}),u({stage:"model",progress:.1,message:"Downloading config..."});let I=await fetch(b);if(!I.ok&&I.status===404&&$&&(I=await fetch($)),!I.ok)throw new Error(`Failed to fetch config: ${I.status} ${I.statusText}`);this._config=await I.json();const P=H$(this._config.pua_compat_version);P.compatible||console.warn(`[piper-plus] ${P.message}`),u({stage:"model",progress:.3,message:"Creating ONNX session..."}),this._sessionManager=new n_({ort:r,gpu:void 0}),this._modelUrl=y,this._session=await this._sessionManager.createSession(y),this._refreshInputContract(),u({stage:"model",progress:.7,message:"Model loaded."}),u({stage:"phonemizer",progress:0,message:"Initializing phonemizer..."});let O=this._config.language_id_map?Object.keys(this._config.language_id_map):void 0;const R=new Map;let B=null;this._unavailableLanguages.clear();const V=new Set(["ja","zh"]),G=new Set(["en"]);if(O&&O.some(me=>V.has(me)))try{B=await eo.create(JSON.stringify(this._config),{wasmUrl:i.wasmG2pUrl||"../../dist/rust-wasm/piper_plus_wasm.js",wasmLoader:i.wasmLoader});const me=B.supportedLanguages;for(const Ie of O)me.includes(Ie)&&!G.has(Ie)&&R.set(Ie,B)}catch(me){const Ie=O.filter(Le=>V.has(Le));if(O=O.filter(Le=>!V.has(Le)),O.length===0)throw new Error(`[piper-plus] Rust WASM G2P failed to load and the model has no other language (${Ie.join(", ")}): ${me.message}. Check that options.wasmG2pUrl points to a reachable piper_plus_wasm.js.`);console.warn(`[piper-plus] Rust WASM G2P failed to load, excluding ${Ie.join(", ")}:`,me.message);for(const Le of Ie)this._unavailableLanguages.set(Le,me.message)}const Z=O==null?void 0:O.filter(me=>!R.has(me)),he=!Z||Z.length>0;let fe=null;if(he&&(fe=await to.create(Z,this._config.phoneme_id_map),Z))for(const me of Z)R.set(me,fe);if(this._loadWasmEnglishDictionary=null,B&&R.get("zh")===B&&O.includes("en")){let me=null;this._loadWasmEnglishDictionary=()=>(me??(me=B.loadEnglishDictionary(vm).finally(()=>{this._loadWasmEnglishDictionary=null})),me)}this._phonemizer=new _b({phonemizers:R,fallback:fe||B,detector:B||fe}),u({stage:"phonemizer",progress:1,message:"Phonemizer ready."}),this._initialized=!0,u({stage:"ready",progress:1,message:"PiperPlus ready."})}catch(p){throw this.dispose(),p}}_detectLanguage(i){const r=this._phonemizer.detectLanguage(i),u=this._unavailableLanguages;if(u.has("ja")&&Tb.test(i))return"ja";if(Ab.test(i)){if(u.has("zh"))return"zh";if(u.has("ja"))return"ja"}return r}async _textToPhonemeIds(i,r){const u=this._unavailableLanguages.get(r);if(u!==void 0)throw new Error(`[piper-plus] Cannot synthesize "${r}": the Rust WASM G2P failed to load (${u}). Check that options.wasmG2pUrl points to a reachable piper_plus_wasm.js.`);return this._loadWasmEnglishDictionary&&(r||this._phonemizer.detectLanguage(i))==="zh"&&await this._loadWasmEnglishDictionary(),this._phonemizer.encode(i,r)}_getPhonemeIdToTokenMap(){var i;return this._phonemeIdToTokenMap===void 0&&(this._phonemeIdToTokenMap=fb(((i=this._config)==null?void 0:i.phoneme_id_map)??null)),this._phonemeIdToTokenMap}_createTiming(i,r){var I,P;if(!i)return null;const u=((P=(I=this._config)==null?void 0:I.audio)==null?void 0:P.sample_rate)??Ki,p=this._getPhonemeIdToTokenMap(),m=Math.min(i.length,r.length),y=new Array(m);for(let O=0;O<m;O++)y[O]=p[r[O]]??`ph_${O}`;const b=m===i.length?i:i.subarray?i.subarray(0,m):Array.from(i).slice(0,m),$=hb(b,u,ig,y);return pb($,r.slice(0,m))}async _infer(i,r,{noiseScale:u,lengthScale:p,noiseW:m,language:y,speakerEmbedding:b}){var Z,he;const $=this._ort;this._speakerInputSession!==this._session&&this._refreshInputContract();const I=new $.Tensor("int64",new BigInt64Array(Array.from(i,fe=>BigInt(fe))),[1,i.length]),P=new $.Tensor("int64",new BigInt64Array([BigInt(i.length)]),[1]),O=new $.Tensor("float32",new Float32Array([u,p,m]),[3]),R={input:I,input_lengths:P,scales:O};if(this._config.language_id_map&&y){const fe=this._config.language_id_map[y];fe!==void 0&&(R.lid=new $.Tensor("int64",new BigInt64Array([BigInt(fe)]),[1]))}if(Object.assign(R,Af($,this._speakerInputContract,b)),r&&this._config.prosody_id_map&&this._hasProsodyFeatures){const fe=[];for(const[me,Ie,Le]of r)fe.push(BigInt(me),BigInt(Ie),BigInt(Le));R.prosody_features=new $.Tensor("int64",new BigInt64Array(fe),[1,i.length,3])}let B;try{B=await this._session.run(R)}catch(fe){if(((Z=this._sessionManager)==null?void 0:Z.currentProvider)==="webgpu"&&((he=fe==null?void 0:fe.message)!=null&&he.includes("Unsupported data type")))console.warn("[piper-plus] WebGPU inference failed (likely int64 unsupported). Recreating session with WASM backend.",fe.message),typeof this._session.release=="function"&&await this._session.release(),this._sessionManager._gpu=void 0,this._session=await this._sessionManager.createSession(this._modelUrl),this._refreshInputContract(),delete R.speaker_embedding,delete R.speaker_embedding_mask,Object.assign(R,Af($,this._speakerInputContract,b)),B=await this._session.run(R);else throw fe}const V=B.output||B[Object.keys(B)[0]],G=new Float32Array(V.data);let te=null;return B.durations&&B.durations.data&&(te=new Float32Array(B.durations.data)),{audio:G,durations:te}}async _runWarmup(i=Eb){const r=new Array(ka);r[0]=bb;for(let u=1;u<ka-1;u++)r[u]=xb;r[ka-1]=vb;for(let u=0;u<i;u++)try{await this._infer(r,null,{noiseScale:kb,lengthScale:Sb,noiseW:Ib})}catch(p){console.warn(`[piper-plus] warmup run ${u+1}/${i} failed:`,p);return}}_assertReady(){if(!this._initialized)throw new Error("PiperPlus is not initialized. Call PiperPlus.initialize() first.")}_refreshInputContract(){const i=H_(this._session);this._speakerInputContract=i,this._speakerInputSession=this._session,this._hasSpeakerEmbedding=i.embedding!==null,this._hasProsodyFeatures=(this._session.inputNames||[]).includes("prosody_features")}}var rg={exports:{}};(function(s,i){var r=(()=>{var u=Object.defineProperty,p=Object.getOwnPropertyDescriptor,m=Object.getOwnPropertyNames,y=Object.prototype.hasOwnProperty,b=(e=>typeof $n<"u"?$n:typeof Proxy<"u"?new Proxy(e,{get:(t,n)=>(typeof $n<"u"?$n:t)[n]}):e)(function(e){if(typeof $n<"u")return $n.apply(this,arguments);throw Error('Dynamic require of "'+e+'" is not supported')}),$=(e,t,n)=>()=>{if(n)throw n[0];try{return e&&(t=e(e=0)),t}catch(a){throw n=[a],a}},I=(e,t)=>{for(var n in t)u(e,n,{get:t[n],enumerable:!0})},P=(e,t,n,a)=>{if(t&&typeof t=="object"||typeof t=="function")for(let o of m(t))!y.call(e,o)&&o!==n&&u(e,o,{get:()=>t[o],enumerable:!(a=p(t,o))||a.enumerable});return e},O=e=>P(u({},"__esModule",{value:!0}),e),R,B,V,G,te,Z,he,fe=$(()=>{"use strict";R=new Map,B=[],V=new WeakMap,G=(e,t,n)=>{if(t&&typeof t.init=="function"&&typeof t.createInferenceSessionHandler=="function"){let a=R.get(e);if(a===void 0)R.set(e,{backend:t,priority:n});else{if(a.priority>n)return;if(a.priority===n&&a.backend!==t)throw new Error(`cannot register backend "${e}" using priority ${n}`)}if(n>=0){let o=B.indexOf(e);o!==-1&&B.splice(o,1);for(let l=0;l<B.length;l++)if(R.get(B[l]).priority<=n){B.splice(l,0,e);return}B.push(e)}return}throw new TypeError("not a valid backend")},te=async e=>{let t=R.get(e);if(!t)return"backend not found.";if(t.initialized)return t.backend;if(t.aborted)return t.error;{let n=!!t.initPromise;try{if(!n){let a=t.backend,o=V.get(a);t.initPromise=o?o.then(async()=>a.init(e),async()=>a.init(e)):a.init(e),V.set(a,t.initPromise)}return await t.initPromise,t.initialized=!0,t.backend}catch(a){return n||(t.error=`${a}`,t.aborted=!0),t.error}finally{delete t.initPromise}}},Z=async e=>{let t=e.executionProviders||[],n=t.map(h=>typeof h=="string"?h:h.name),a=n.length===0?B:n,o,l=[],d=new Set;for(let h of a){let f=await te(h);typeof f=="string"?l.push({name:h,err:f}):(o||(o=f),o===f&&d.add(h))}if(!o)throw new Error(`no available backend found. ERR: ${l.map(h=>`[${h.name}] ${h.err}`).join(", ")}`);for(let{name:h,err:f}of l)n.includes(h)&&console.warn(`removing requested execution provider "${h}" from session options because it is not available: ${f}`);let c=t.filter(h=>d.has(typeof h=="string"?h:h.name));return[o,new Proxy(e,{get:(h,f)=>f==="executionProviders"?c:Reflect.get(h,f)})]},he=async()=>{let e=[];for(let n of B){if(typeof R.get(n).backend.createLoraAdapterHandler!="function")continue;let a=await te(n);if(typeof a!="string")return a;e.push({name:n,err:a})}let t=e.length===0?"":` ERR: ${e.map(n=>`[${n.name}] ${n.err}`).join(", ")}`;throw new Error(`no available backend supports LoRA adapters.${t}`)}}),me=$(()=>{"use strict";fe()}),Ie,Le=$(()=>{"use strict";Ie="1.31.1"}),lt,Ce,nt=$(()=>{"use strict";Le(),lt="warning",Ce={wasm:{},webgl:{},webgpu:{},versions:{common:Ie},set logLevel(e){if(e!==void 0){if(typeof e!="string"||["verbose","info","warning","error","fatal"].indexOf(e)===-1)throw new Error(`Unsupported logging level: ${e}`);lt=e}},get logLevel(){return lt}},Object.defineProperty(Ce,"logLevel",{enumerable:!0})}),ke,xt=$(()=>{"use strict";nt(),ke=Ce}),Ne,Ct,Xe,We,dt,yt,An=$(()=>{"use strict";nt(),Ne=(e,t)=>{(typeof Ce.trace>"u"?!Ce.wasm.trace:!Ce.trace)||console.timeStamp(`${e}::ORT::${t}`)},Ct=(e,t)=>{var o;let n=((o=new Error().stack)==null?void 0:o.split(/\r\n|\r|\n/g))||[],a=!1;for(let l=0;l<n.length;l++){if(a&&!n[l].includes("TRACE_FUNC")){let d=`FUNC_${e}::${n[l].trim().split(" ")[1]}`;t&&(d+=`::${t}`),Ne("CPU",d);return}n[l].includes("TRACE_FUNC")&&(a=!0)}},Xe=e=>{(typeof Ce.trace>"u"?!Ce.wasm.trace:!Ce.trace)||Ct("BEGIN",e)},We=e=>{(typeof Ce.trace>"u"?!Ce.wasm.trace:!Ce.trace)||Ct("END",e)},dt=e=>{(typeof Ce.trace>"u"?!Ce.wasm.trace:!Ce.trace)||console.time(`ORT::${e}`)},yt=e=>{(typeof Ce.trace>"u"?!Ce.wasm.trace:!Ce.trace)||console.timeEnd(`ORT::${e}`)}}),zn,oi=$(()=>{"use strict";fe(),An(),zn=class ag{constructor(t,n){this.backend=t,this.handler=n}static async create(t){if(Xe(),typeof t!="string"&&!(t instanceof Uint8Array))throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let n=await he(),a=await n.createLoraAdapterHandler(t);return We(),new ag(n,a)}async release(){return this.handler.dispose()}}}),ui,Cn,_s=$(()=>{"use strict";ui=(e,t)=>{let n=typeof document<"u"?document.createElement("canvas"):new OffscreenCanvas(1,1);n.width=e.dims[3],n.height=e.dims[2];let a=n.getContext("2d");if(a!=null){let o,l;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(o=e.dims[2],l=e.dims[3]):(o=e.dims[3],l=e.dims[2]);let d=(t==null?void 0:t.format)!==void 0?t.format:"RGB",c=t==null?void 0:t.norm,h,f;c===void 0||c.mean===void 0?h=[255,255,255,255]:typeof c.mean=="number"?h=[c.mean,c.mean,c.mean,c.mean]:(h=[c.mean[0],c.mean[1],c.mean[2],0],c.mean[3]!==void 0&&(h[3]=c.mean[3])),c===void 0||c.bias===void 0?f=[0,0,0,0]:typeof c.bias=="number"?f=[c.bias,c.bias,c.bias,c.bias]:(f=[c.bias[0],c.bias[1],c.bias[2],0],c.bias[3]!==void 0&&(f[3]=c.bias[3]));let g=l*o,_=0,w=g,x=g*2,v=-1;d==="RGBA"?(_=0,w=g,x=g*2,v=g*3):d==="RGB"?(_=0,w=g,x=g*2):d==="RBG"&&(_=0,x=g,w=g*2);for(let S=0;S<l;S++)for(let T=0;T<o;T++){let k=(e.data[_++]-f[0])*h[0],E=(e.data[w++]-f[1])*h[1],A=(e.data[x++]-f[2])*h[2],z=v===-1?255:(e.data[v++]-f[3])*h[3];a.fillStyle="rgba("+k+","+E+","+A+","+z+")",a.fillRect(T,S,1,1)}if("toDataURL"in n)return n.toDataURL();throw new Error("toDataURL is not supported")}else throw new Error("Can not access image data")},Cn=(e,t)=>{let n=typeof document<"u"?document.createElement("canvas").getContext("2d"):new OffscreenCanvas(1,1).getContext("2d"),a;if(n!=null){let o,l,d;(t==null?void 0:t.tensorLayout)!==void 0&&t.tensorLayout==="NHWC"?(o=e.dims[2],l=e.dims[1],d=e.dims[3]):(o=e.dims[3],l=e.dims[2],d=e.dims[1]);let c=t!==void 0&&t.format!==void 0?t.format:"RGB",h=t==null?void 0:t.norm,f,g;h===void 0||h.mean===void 0?f=[255,255,255,255]:typeof h.mean=="number"?f=[h.mean,h.mean,h.mean,h.mean]:(f=[h.mean[0],h.mean[1],h.mean[2],255],h.mean[3]!==void 0&&(f[3]=h.mean[3])),h===void 0||h.bias===void 0?g=[0,0,0,0]:typeof h.bias=="number"?g=[h.bias,h.bias,h.bias,h.bias]:(g=[h.bias[0],h.bias[1],h.bias[2],0],h.bias[3]!==void 0&&(g[3]=h.bias[3]));let _=l*o;if(t!==void 0&&(t.format!==void 0&&d===4&&t.format!=="RGBA"||d===3&&t.format!=="RGB"&&t.format!=="BGR"))throw new Error("Tensor format doesn't match input tensor dims");let w=4,x=0,v=1,S=2,T=3,k=0,E=_,A=_*2,z=-1;c==="RGBA"?(k=0,E=_,A=_*2,z=_*3):c==="RGB"?(k=0,E=_,A=_*2):c==="RBG"&&(k=0,A=_,E=_*2),a=n.createImageData(o,l);for(let C=0;C<l*o;x+=w,v+=w,S+=w,T+=w,C++)a.data[x]=(e.data[k++]-g[0])*f[0],a.data[v]=(e.data[E++]-g[1])*f[1],a.data[S]=(e.data[A++]-g[2])*f[2],a.data[T]=z===-1?255:(e.data[z++]-g[3])*f[3]}else throw new Error("Can not access image data");return a}}),mn,li,di,ci,ue,X,pe=$(()=>{"use strict";ys(),mn=(e,t)=>{if(e===void 0)throw new Error("Image buffer must be defined");if(t.height===void 0||t.width===void 0)throw new Error("Image height and width must be defined");if(t.tensorLayout==="NHWC")throw new Error("NHWC Tensor layout is not supported yet");let{height:n,width:a}=t,o=t.norm??{mean:255,bias:0},l,d;typeof o.mean=="number"?l=[o.mean,o.mean,o.mean,o.mean]:l=[o.mean[0],o.mean[1],o.mean[2],o.mean[3]??255],typeof o.bias=="number"?d=[o.bias,o.bias,o.bias,o.bias]:d=[o.bias[0],o.bias[1],o.bias[2],o.bias[3]??0];let c=t.format!==void 0?t.format:"RGBA",h=t.tensorFormat!==void 0&&t.tensorFormat!==void 0?t.tensorFormat:"RGB",f=n*a,g=h==="RGBA"?new Float32Array(f*4):new Float32Array(f*3),_=4,w=0,x=1,v=2,S=3,T=0,k=f,E=f*2,A=-1;c==="RGB"&&(_=3,w=0,x=1,v=2,S=-1),h==="RGBA"?A=f*3:h==="RBG"?(T=0,E=f,k=f*2):h==="BGR"&&(E=0,k=f,T=f*2);for(let z=0;z<f;z++,w+=_,v+=_,x+=_,S+=_)g[T++]=(e[w]+d[0])/l[0],g[k++]=(e[x]+d[1])/l[1],g[E++]=(e[v]+d[2])/l[2],A!==-1&&S!==-1&&(g[A++]=(e[S]+d[3])/l[3]);return h==="RGBA"?new it("float32",g,[1,4,n,a]):new it("float32",g,[1,3,n,a])},li=async(e,t)=>{let n=typeof HTMLImageElement<"u"&&e instanceof HTMLImageElement,a=typeof ImageData<"u"&&e instanceof ImageData,o=typeof ImageBitmap<"u"&&e instanceof ImageBitmap,l=typeof e=="string",d,c=t??{},h=()=>{if(typeof document<"u")return document.createElement("canvas");if(typeof OffscreenCanvas<"u")return new OffscreenCanvas(1,1);throw new Error("Canvas is not supported")},f=g=>typeof HTMLCanvasElement<"u"&&g instanceof HTMLCanvasElement||g instanceof OffscreenCanvas?g.getContext("2d"):null;if(n){let g=h();g.width=e.width,g.height=e.height;let _=f(g);if(_!=null){let w=e.height,x=e.width;if(t!==void 0&&t.resizedHeight!==void 0&&t.resizedWidth!==void 0&&(w=t.resizedHeight,x=t.resizedWidth),t!==void 0){if(c=t,t.tensorFormat!==void 0)throw new Error("Image input config format must be RGBA for HTMLImageElement");c.tensorFormat="RGBA",c.height=w,c.width=x}else c.tensorFormat="RGBA",c.height=w,c.width=x;_.drawImage(e,0,0),d=_.getImageData(0,0,x,w).data}else throw new Error("Can not access image data")}else if(a){let g,_;if(t!==void 0&&t.resizedWidth!==void 0&&t.resizedHeight!==void 0?(g=t.resizedHeight,_=t.resizedWidth):(g=e.height,_=e.width),t!==void 0&&(c=t),c.format="RGBA",c.height=g,c.width=_,t!==void 0){let w=h();w.width=_,w.height=g;let x=f(w);if(x!=null)x.putImageData(e,0,0),d=x.getImageData(0,0,_,g).data;else throw new Error("Can not access image data")}else d=e.data}else if(o){if(t===void 0)throw new Error("Please provide image config with format for Imagebitmap");let g=h();g.width=e.width,g.height=e.height;let _=f(g);if(_!=null){let w=e.height,x=e.width;return _.drawImage(e,0,0,x,w),d=_.getImageData(0,0,x,w).data,c.height=w,c.width=x,mn(d,c)}else throw new Error("Can not access image data")}else{if(l)return new Promise((g,_)=>{let w=h(),x=f(w);if(!e||!x)return _();let v=new Image;v.crossOrigin="Anonymous",v.src=e,v.onload=()=>{w.width=v.width,w.height=v.height,x.drawImage(v,0,0,w.width,w.height);let S=x.getImageData(0,0,w.width,w.height);c.height=w.height,c.width=w.width,g(mn(S.data,c))}});throw new Error("Input data provided is not supported - aborted tensor creation")}if(d!==void 0)return mn(d,c);throw new Error("Input data provided is not supported - aborted tensor creation")},di=(e,t)=>{let{width:n,height:a,download:o,dispose:l}=t,d=[1,a,n,4];return new it({location:"texture",type:"float32",texture:e,dims:d,download:o,dispose:l})},ci=(e,t)=>{let{dataType:n,dims:a,download:o,dispose:l}=t;return new it({location:"gpu-buffer",type:n??"float32",gpuBuffer:e,dims:a,download:o,dispose:l})},ue=(e,t)=>{let{dataType:n,dims:a,download:o,dispose:l}=t;return new it({location:"ml-tensor",type:n??"float32",mlTensor:e,dims:a,download:o,dispose:l})},X=(e,t,n)=>new it({location:"cpu-pinned",type:e,data:t,dims:n??[t.length]})}),Re,Je,Gt,io,hg=$(()=>{"use strict";Re=new Map([["float32",Float32Array],["uint8",Uint8Array],["int8",Int8Array],["uint16",Uint16Array],["int16",Int16Array],["int32",Int32Array],["bool",Uint8Array],["float64",Float64Array],["uint32",Uint32Array],["int4",Uint8Array],["uint4",Uint8Array]]),Je=new Map([[Float32Array,"float32"],[Uint8Array,"uint8"],[Int8Array,"int8"],[Uint16Array,"uint16"],[Int16Array,"int16"],[Int32Array,"int32"],[Float64Array,"float64"],[Uint32Array,"uint32"]]),Gt=!1,io=()=>{if(!Gt){Gt=!0;let e=typeof BigInt64Array<"u"&&BigInt64Array.from,t=typeof BigUint64Array<"u"&&BigUint64Array.from,n=globalThis.Float16Array,a=typeof n<"u"&&n.from;e&&(Re.set("int64",BigInt64Array),Je.set(BigInt64Array,"int64")),t&&(Re.set("uint64",BigUint64Array),Je.set(BigUint64Array,"uint64")),a?(Re.set("float16",n),Je.set(n,"float16")):Re.set("float16",Uint16Array)}}}),so,ro,fg=$(()=>{"use strict";ys(),so=e=>{let t=1;for(let n=0;n<e.length;n++){let a=e[n];if(typeof a!="number"||!Number.isSafeInteger(a))throw new TypeError(`dims[${n}] must be an integer, got: ${a}`);if(a<0)throw new RangeError(`dims[${n}] must be a non-negative integer, got: ${a}`);t*=a}return t},ro=(e,t)=>{switch(e.location){case"cpu":return new it(e.type,e.data,t);case"cpu-pinned":return new it({location:"cpu-pinned",data:e.data,type:e.type,dims:t});case"texture":return new it({location:"texture",texture:e.texture,type:e.type,dims:t});case"gpu-buffer":return new it({location:"gpu-buffer",gpuBuffer:e.gpuBuffer,type:e.type,dims:t});case"ml-tensor":return new it({location:"ml-tensor",mlTensor:e.mlTensor,type:e.type,dims:t});default:throw new Error(`tensorReshape: tensor location ${e.location} is not supported`)}}}),it,ys=$(()=>{"use strict";_s(),pe(),hg(),fg(),it=class{constructor(e,t,n){io();let a,o;if(typeof e=="object"&&"location"in e)switch(this.dataLocation=e.location,a=e.type,o=e.dims,e.location){case"cpu-pinned":{let d=Re.get(a);if(!d)throw new TypeError(`unsupported type "${a}" to create tensor from pinned buffer`);if(!(e.data instanceof d))throw new TypeError(`buffer should be of type ${d.name}`);this.cpuData=e.data;break}case"texture":{if(a!=="float32")throw new TypeError(`unsupported type "${a}" to create tensor from texture`);this.gpuTextureData=e.texture,this.downloader=e.download,this.disposer=e.dispose;break}case"gpu-buffer":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from gpu buffer`);this.gpuBufferData=e.gpuBuffer,this.downloader=e.download,this.disposer=e.dispose;break}case"ml-tensor":{if(a!=="float32"&&a!=="float16"&&a!=="int32"&&a!=="int64"&&a!=="uint32"&&a!=="uint64"&&a!=="int8"&&a!=="uint8"&&a!=="bool"&&a!=="uint4"&&a!=="int4")throw new TypeError(`unsupported type "${a}" to create tensor from MLTensor`);this.mlTensorData=e.mlTensor,this.downloader=e.download,this.disposer=e.dispose;break}default:throw new Error(`Tensor constructor: unsupported location '${this.dataLocation}'`)}else{let d,c;if(typeof e=="string")if(a=e,c=n,e==="string"){if(!Array.isArray(t))throw new TypeError("A string tensor's data must be a string array.");d=t}else{let h=Re.get(e);if(h===void 0)throw new TypeError(`Unsupported tensor type: ${e}.`);if(Array.isArray(t)){if(e==="float16"&&h===Uint16Array||e==="uint4"||e==="int4")throw new TypeError(`Creating a ${e} tensor from number array is not supported. Please use ${h.name} as data.`);e==="uint64"||e==="int64"?d=h.from(t,BigInt):d=h.from(t)}else if(t instanceof h)d=t;else if(t instanceof Uint8ClampedArray)if(e==="uint8")d=Uint8Array.from(t);else throw new TypeError("A Uint8ClampedArray tensor's data must be type of uint8");else if(e==="float16"&&t instanceof Uint16Array&&h!==Uint16Array)d=new globalThis.Float16Array(t.buffer,t.byteOffset,t.length);else throw new TypeError(`A ${a} tensor's data must be type of ${h}`)}else if(c=t,Array.isArray(e)){if(e.length===0)throw new TypeError("Tensor type cannot be inferred from an empty array.");let h=typeof e[0];if(h==="string")a="string",d=e;else if(h==="boolean")a="bool",d=Uint8Array.from(e);else throw new TypeError(`Invalid element type of data array: ${h}.`)}else if(e instanceof Uint8ClampedArray)a="uint8",d=Uint8Array.from(e);else{let h=Je.get(e.constructor);if(h===void 0)throw new TypeError(`Unsupported type for tensor data: ${e.constructor}.`);a=h,d=e}if(c===void 0)c=[d.length];else if(!Array.isArray(c))throw new TypeError("A tensor's dims must be a number array");o=c,this.cpuData=d,this.dataLocation="cpu"}let l=so(o);if(this.cpuData&&l!==this.cpuData.length&&!((a==="uint4"||a==="int4")&&Math.ceil(l/2)===this.cpuData.length))throw new Error(`Tensor's size(${l}) does not match data length(${this.cpuData.length}).`);this.type=a,this.dims=o,this.size=l}static async fromImage(e,t){return li(e,t)}static fromTexture(e,t){return di(e,t)}static fromGpuBuffer(e,t){return ci(e,t)}static fromMLTensor(e,t){return ue(e,t)}static fromPinnedBuffer(e,t,n){return X(e,t,n)}toDataURL(e){return ui(this,e)}toImageData(e){return Cn(this,e)}get data(){if(this.ensureValid(),!this.cpuData)throw new Error("The data is not on CPU. Use `getData()` to download GPU data to CPU, or use `texture` or `gpuBuffer` property to access the GPU data directly.");return this.cpuData}get location(){return this.dataLocation}get texture(){if(this.ensureValid(),!this.gpuTextureData)throw new Error("The data is not stored as a WebGL texture.");return this.gpuTextureData}get gpuBuffer(){if(this.ensureValid(),!this.gpuBufferData)throw new Error("The data is not stored as a WebGPU buffer.");return this.gpuBufferData}get mlTensor(){if(this.ensureValid(),!this.mlTensorData)throw new Error("The data is not stored as a WebNN MLTensor.");return this.mlTensorData}async getData(e){switch(this.ensureValid(),this.dataLocation){case"cpu":case"cpu-pinned":return this.data;case"texture":case"gpu-buffer":case"ml-tensor":{if(!this.downloader)throw new Error("The current tensor is not created with a specified data downloader.");if(this.isDownloading)throw new Error("The current tensor is being downloaded.");try{this.isDownloading=!0;let t=await this.downloader();return this.downloader=void 0,this.dataLocation="cpu",this.cpuData=t,e&&this.disposer&&(this.disposer(),this.disposer=void 0),t}finally{this.isDownloading=!1}}default:throw new Error(`cannot get data from location: ${this.dataLocation}`)}}dispose(){if(this.isDownloading)throw new Error("The current tensor is being downloaded.");this.disposer&&(this.disposer(),this.disposer=void 0),this.cpuData=void 0,this.gpuTextureData=void 0,this.gpuBufferData=void 0,this.mlTensorData=void 0,this.downloader=void 0,this.isDownloading=void 0,this.dataLocation="none"}ensureValid(){if(this.dataLocation==="none")throw new Error("The tensor is disposed.")}reshape(e){if(this.ensureValid(),this.downloader||this.disposer)throw new Error("Cannot reshape a tensor that owns GPU resource.");return ro(this,e)}}}),ct,ao=$(()=>{"use strict";ys(),ct=it}),oo,mg=$(()=>{"use strict";fe(),oi(),ao(),An(),oo=class og{constructor(t,n){this.handler=t,this.backend=n}async run(t,n,a){Xe(),dt("InferenceSession.run");let o={},l={};if(typeof t!="object"||t===null||t instanceof ct||Array.isArray(t))throw new TypeError("'feeds' must be an object that use input names as keys and OnnxValue as corresponding values.");let d=!0;if(typeof n=="object"){if(n===null)throw new TypeError("Unexpected argument[1]: cannot be null.");if(n instanceof ct)throw new TypeError("'fetches' cannot be a Tensor");if(Array.isArray(n)){if(n.length===0)throw new TypeError("'fetches' cannot be an empty array.");d=!1;for(let g of n){if(typeof g!="string")throw new TypeError("'fetches' must be a string array or an object.");if(this.outputNames.indexOf(g)===-1)throw new RangeError(`'fetches' contains invalid output name: ${g}.`);o[g]=null}if(typeof a=="object"&&a!==null)l=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else{let g=!1,_=Object.getOwnPropertyNames(n);for(let w of this.outputNames)if(_.indexOf(w)!==-1){let x=n[w];(x===null||x instanceof ct)&&(g=!0,d=!1,o[w]=x)}if(g){if(typeof a=="object"&&a!==null)l=a;else if(typeof a<"u")throw new TypeError("'options' must be an object.")}else l=n}}else if(typeof n<"u")throw new TypeError("Unexpected argument[1]: must be 'fetches' or 'options'.");for(let g of this.inputNames)if(typeof t[g]>"u")throw new Error(`input '${g}' is missing in 'feeds'.`);if(d)for(let g of this.outputNames)o[g]=null;let c;if(l.activeLoraAdapters!==void 0){if(!Array.isArray(l.activeLoraAdapters))throw new TypeError("'activeLoraAdapters' must be an array.");c=l.activeLoraAdapters.map(g=>{if(!(g instanceof zn))throw new TypeError("'activeLoraAdapters' must be an array of LoraAdapter objects.");if(g.backend!==this.backend)throw new Error("LoRA adapter was created by a different backend than the session.");return g.handler})}let h=await this.handler.run(t,o,l,c),f={};for(let g in h)if(Object.hasOwnProperty.call(h,g)){let _=h[g];_ instanceof ct?f[g]=_:f[g]=new ct(_.type,_.data,_.dims)}return yt("InferenceSession.run"),We(),f}async release(){return this.handler.dispose()}static async create(t,n,a,o){Xe(),dt("InferenceSession.create");let l,d={};if(typeof t=="string"){if(l=t,typeof n=="object"&&n!==null)d=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof Uint8Array){if(l=t,typeof n=="object"&&n!==null)d=n;else if(typeof n<"u")throw new TypeError("'options' must be an object.")}else if(t instanceof ArrayBuffer||typeof SharedArrayBuffer<"u"&&t instanceof SharedArrayBuffer){let g=t,_=0,w=t.byteLength;if(typeof n=="object"&&n!==null)d=n;else if(typeof n=="number"){if(_=n,!Number.isSafeInteger(_))throw new RangeError("'byteOffset' must be an integer.");if(_<0||_>=g.byteLength)throw new RangeError(`'byteOffset' is out of range [0, ${g.byteLength}).`);if(w=t.byteLength-_,typeof a=="number"){if(w=a,!Number.isSafeInteger(w))throw new RangeError("'byteLength' must be an integer.");if(w<=0||_+w>g.byteLength)throw new RangeError(`'byteLength' is out of range (0, ${g.byteLength-_}].`);if(typeof o=="object"&&o!==null)d=o;else if(typeof o<"u")throw new TypeError("'options' must be an object.")}else if(typeof a<"u")throw new TypeError("'byteLength' must be a number.")}else if(typeof n<"u")throw new TypeError("'options' must be an object.");l=new Uint8Array(g,_,w)}else throw new TypeError("Unexpected argument[0]: must be 'path' or 'buffer'.");let[c,h]=await Z(d),f=await c.createInferenceSessionHandler(l,h);return yt("InferenceSession.create"),We(),new og(f,c)}startProfiling(){this.handler.startProfiling()}endProfiling(){this.handler.endProfiling()}get inputNames(){return this.handler.inputNames}get outputNames(){return this.handler.outputNames}get inputMetadata(){return this.handler.inputMetadata}get outputMetadata(){return this.handler.outputMetadata}}}),ws,gg=$(()=>{"use strict";mg(),ws=oo}),$s,_g=$(()=>{"use strict";oi(),$s=zn}),yg=$(()=>{"use strict"}),wg=$(()=>{"use strict"}),$g=$(()=>{"use strict"}),bg=$(()=>{"use strict"}),uo={};I(uo,{InferenceSession:()=>ws,LoraAdapter:()=>$s,TRACE:()=>Ne,TRACE_EVENT_BEGIN:()=>dt,TRACE_EVENT_END:()=>yt,TRACE_FUNC_BEGIN:()=>Xe,TRACE_FUNC_END:()=>We,Tensor:()=>ct,env:()=>ke,registerBackend:()=>G});var st=$(()=>{"use strict";me(),xt(),gg(),_g(),ao(),yg(),wg(),An(),$g(),bg()}),bs=$(()=>{"use strict"}),lo={};I(lo,{default:()=>co});var vs,xs,co,vg=$(()=>{var e;"use strict";Yh(),Ht(),Ts(),vs="ort-wasm-proxy-worker",xs=((e=globalThis.self)==null?void 0:e.name)===vs,xs&&(self.onmessage=t=>{let{type:n,in:a}=t.data;try{switch(n){case"init-wasm":Cs(a.wasm).then(()=>{Gr(a).then(()=>{postMessage({type:n})},o=>{postMessage({type:n,err:o})})},o=>{postMessage({type:n,err:o})});break;case"init-ep":{let{epName:o,env:l}=a;Hr(l,o).then(()=>{postMessage({type:n})},d=>{postMessage({type:n,err:d})});break}case"copy-from":{let{buffer:o}=a,l=Oi(o);postMessage({type:n,out:l});break}case"create":{let{model:o,options:l}=a;Zr(o,l).then(d=>{postMessage({type:n,out:d})},d=>{postMessage({type:n,err:d})});break}case"release":Xr(a),postMessage({type:n});break;case"run":{let{sessionId:o,inputIndices:l,inputs:d,outputIndices:c,options:h}=a;Jr(o,l,d,c,new Array(c.length).fill(null),h).then(f=>{f.some(g=>g[3]!=="cpu")?postMessage({type:n,err:"Proxy does not support non-cpu tensor location."}):postMessage({type:n,out:f},ea([...d,...f]))},f=>{postMessage({type:n,err:f})});break}case"end-profiling":Qr(a),postMessage({type:n});break;default:}}catch(o){postMessage({type:n,err:o})}}),co=xs?null:t=>new Worker(t??rt,{type:"classic",name:vs})}),po,ho,rt,Es,pi,fo,mo,ks,go,Ss,_o,Is,yo,Ts=$(()=>{"use strict";bs(),po=typeof location>"u"?void 0:location.origin,ho=()=>{var e,t;return typeof document<"u"?(e=document.currentScript)==null?void 0:e.src:typeof self<"u"?(t=self.location)==null?void 0:t.href:void 0},rt=ho(),Es=()=>{if(rt&&!rt.startsWith("blob:"))return rt.substring(0,rt.lastIndexOf("/")+1)},pi=(e,t)=>{try{let n=t??rt;return(n?new URL(e,n):new URL(e)).origin===po}catch{return!1}},fo=(e,t)=>{let n=t??rt;try{return(n?new URL(e,n):new URL(e)).href}catch{return}},mo=(e,t)=>`${t??"./"}${e}`,ks=async e=>{let t=await(await fetch(e,{credentials:"same-origin"})).blob();return URL.createObjectURL(t)},go=async e=>(await In(()=>import(e),[],import.meta.url)).default,Ss=(vg(),O(lo)).default,_o=async()=>{if(!rt)throw new Error("Failed to load proxy worker: cannot determine the script source URL.");if(pi(rt))return[void 0,Ss()];let e=await ks(rt);return[e,Ss(e)]},Is=void 0,yo=async(e,t,n,a)=>{let o=Is&&!(e||t);if(o)if(rt)o=pi(rt)||a&&!n;else if(a&&!n)o=!0;else throw new Error("cannot determine the script source URL.");if(o)return[void 0,Is];{let l="ort-wasm-simd-threaded.jsep.mjs",d=e??fo(l,t),c=n&&d&&!pi(d,t),h=c?await ks(d):d??mo(l,t);return[c?h:void 0,await go(h)]}}}),As,hi,On,zs,wo,$o,bo,Cs,Se,Ht=$(()=>{"use strict";Ts(),hi=!1,On=!1,zs=!1,wo=()=>{if(typeof SharedArrayBuffer>"u")return!1;try{return typeof MessageChannel<"u"&&new MessageChannel().port1.postMessage(new SharedArrayBuffer(1)),WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,5,4,1,3,1,1,10,11,1,9,0,65,0,254,16,2,0,26,11]))}catch{return!1}},$o=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,4,1,96,0,0,3,2,1,0,10,30,1,28,0,65,0,253,15,253,12,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,253,186,1,26,11]))}catch{return!1}},bo=()=>{try{return WebAssembly.validate(new Uint8Array([0,97,115,109,1,0,0,0,1,5,1,96,0,1,123,3,2,1,0,10,19,1,17,0,65,1,253,15,65,2,253,15,65,3,253,15,253,147,2,11]))}catch{return!1}},Cs=async e=>{if(hi)return Promise.resolve();if(On)throw new Error("multiple calls to 'initializeWebAssembly()' detected.");if(zs)throw new Error("previous call to 'initializeWebAssembly()' failed.");On=!0;let t=e.initTimeout,n=e.numThreads;if(e.simd!==!1){if(e.simd==="relaxed"){if(!bo())throw new Error("Relaxed WebAssembly SIMD is not supported in the current environment.")}else if(!$o())throw new Error("WebAssembly SIMD is not supported in the current environment.")}let a=wo();n>1&&!a&&(typeof self<"u"&&!self.crossOriginIsolated&&console.warn("env.wasm.numThreads is set to "+n+", but this will not work unless you enable crossOriginIsolated mode. See https://web.dev/cross-origin-isolation-guide/ for more info."),console.warn("WebAssembly multi-threading is not supported in the current environment. Falling back to single-threading."),e.numThreads=n=1);let o=e.wasmPaths,l=typeof o=="string"?o:void 0,d=o==null?void 0:o.mjs,c=(d==null?void 0:d.href)??d,h=o==null?void 0:o.wasm,f=(h==null?void 0:h.href)??h,g=e.wasmBinary,[_,w]=await yo(c,l,n>1,!!g||!!f),x=!1,v=[];if(t>0&&v.push(new Promise(S=>{setTimeout(()=>{x=!0,S()},t)})),v.push(new Promise((S,T)=>{let k={numThreads:n};if(g)k.wasmBinary=g,k.locateFile=E=>E;else if(f||l)k.locateFile=E=>f??l+E;else if(c&&c.indexOf("blob:")!==0)k.locateFile=E=>new URL(E,c).href;else if(_){let E=Es();E&&(k.locateFile=A=>E+A)}w(k).then(E=>{On=!1,hi=!0,As=E,S(),_&&URL.revokeObjectURL(_)},E=>{On=!1,zs=!0,T(E)})})),await Promise.race(v),x)throw new Error(`WebAssembly backend initializing failed due to timeout: ${t}ms`)},Se=()=>{if(hi&&As)return As;throw new Error("WebAssembly is not initialized yet.")}}),pt,fi,be,Os=$(()=>{"use strict";Ht(),pt=(e,t)=>{let n=Se(),a=n.lengthBytesUTF8(e)+1,o=n._malloc(a);return n.stringToUTF8(e,o,a),t.push(o),o},fi=(e,t,n,a)=>{if(typeof e=="object"&&e!==null){if(n.has(e))throw new Error("Circular reference in options");n.add(e)}Object.entries(e).forEach(([o,l])=>{let d=t?t+o:o;if(typeof l=="object")fi(l,d+".",n,a);else if(typeof l=="string"||typeof l=="number")a(d,l.toString());else if(typeof l=="boolean")a(d,l?"1":"0");else throw new Error(`Can't handle extra config type: ${typeof l}`)})},be=e=>{let t=Se(),n=t.stackSave();try{let a=t.PTR_SIZE,o=t.stackAlloc(2*a);t._OrtGetLastError(o,o+a);let l=Number(t.getValue(o,a===4?"i32":"i64")),d=t.getValue(o+a,"*"),c=d?t.UTF8ToString(d):"";throw new Error(`${e} ERROR_CODE: ${l}, ERROR_MESSAGE: ${c}`)}finally{t.stackRestore(n)}}}),vo,xg=$(()=>{"use strict";Ht(),Os(),vo=(e,t)=>{let n=Se(),a=0,o=[],l=e||{};try{if((e==null?void 0:e.logSeverityLevel)===void 0)l.logSeverityLevel=2;else if(typeof e.logSeverityLevel!="number"||!Number.isInteger(e.logSeverityLevel)||e.logSeverityLevel<0||e.logSeverityLevel>4)throw new Error(`log severity level is not valid: ${e.logSeverityLevel}`);if((e==null?void 0:e.logVerbosityLevel)===void 0)l.logVerbosityLevel=0;else if(typeof e.logVerbosityLevel!="number"||!Number.isInteger(e.logVerbosityLevel))throw new Error(`log verbosity level is not valid: ${e.logVerbosityLevel}`);(e==null?void 0:e.terminate)===void 0&&(l.terminate=!1);let d=0;(e==null?void 0:e.tag)!==void 0&&(d=pt(e.tag,o)),a=n._OrtCreateRunOptions(l.logSeverityLevel,l.logVerbosityLevel,!!l.terminate,d),a===0&&be("Can't create run options."),(e==null?void 0:e.extra)!==void 0&&fi(e.extra,"",new WeakSet,(c,h)=>{let f=pt(c,o),g=pt(h,o);n._OrtAddRunConfigEntry(a,f,g)!==0&&be(`Can't set a run config entry: ${c} - ${h}.`)});for(let c of t)n._OrtRunOptionsAddActiveLoraAdapter(a,c)!==0&&be("Can't add an active LoRA adapter.");return[a,o]}catch(d){throw a!==0&&n._OrtReleaseRunOptions(a),o.forEach(c=>n._free(c)),d}}}),xo,Eo,ko,Kt,So,Io,Eg=$(()=>{"use strict";Ht(),Os(),xo=e=>{switch(e){case"disabled":return 0;case"basic":return 1;case"extended":return 2;case"layout":return 3;case"all":return 99;default:throw new Error(`unsupported graph optimization level: ${e}`)}},Eo=e=>{switch(e){case"sequential":return 0;case"parallel":return 1;default:throw new Error(`unsupported execution mode: ${e}`)}},ko=e=>{e.extra||(e.extra={}),e.extra.session||(e.extra.session={});let t=e.extra.session;t.use_ort_model_bytes_directly||(t.use_ort_model_bytes_directly="1"),e.executionProviders&&e.executionProviders.some(n=>(typeof n=="string"?n:n.name)==="webgpu")&&(e.enableMemPattern=!1)},Kt=(e,t,n,a)=>{let o=pt(t,a),l=pt(n,a);Se()._OrtAddSessionConfigEntry(e,o,l)!==0&&be(`Can't set a session config entry: ${t} - ${n}.`)},So=async(e,t,n)=>{let a=t.executionProviders;for(let o of a){let l=typeof o=="string"?o:o.name,d=[],c;switch(l){case"webnn":if(l="WEBNN",Kt(e,"session.disable_quant_qdq","1",n),Kt(e,"session.disable_qdq_constant_folding","1",n),typeof o!="string"){let w=o==null?void 0:o.deviceType;w&&Kt(e,"deviceType",w,n)}break;case"webgpu":if(l="JS",typeof o!="string"){let w=o;if(w!=null&&w.preferredLayout){if(w.preferredLayout!=="NCHW"&&w.preferredLayout!=="NHWC")throw new Error(`preferredLayout must be either 'NCHW' or 'NHWC': ${w.preferredLayout}`);Kt(e,"preferredLayout",w.preferredLayout,n)}}break;case"wasm":case"cpu":continue;default:throw new Error(`not supported execution provider: ${l}`)}let h=d.length,f=0,g=0;if(h>0){f=Se()._malloc(h*Se().PTR_SIZE),n.push(f),g=Se()._malloc(h*Se().PTR_SIZE),n.push(g);for(let w=0;w<h;w++)Se().setValue(f+w*Se().PTR_SIZE,d[w][0],"*"),Se().setValue(g+w*Se().PTR_SIZE,d[w][1],"*")}let _;if(c===void 0){let w=pt(l,n);_=await Se()._OrtAppendExecutionProvider(e,w,f,g,h)}_!==0&&be(`Can't append execution provider: ${l}.`)}},Io=async e=>{let t=Se(),n=0,a=[],o=e||{};ko(o);try{let l=xo(o.graphOptimizationLevel??"all"),d=Eo(o.executionMode??"sequential"),c=typeof o.logId=="string"?pt(o.logId,a):0,h=o.logSeverityLevel??2;if(!Number.isInteger(h)||h<0||h>4)throw new Error(`log severity level is not valid: ${h}`);let f=o.logVerbosityLevel??0;if(!Number.isInteger(f)||f<0||f>4)throw new Error(`log verbosity level is not valid: ${f}`);let g=typeof o.optimizedModelFilePath=="string"?pt(o.optimizedModelFilePath,a):0;if(n=t._OrtCreateSessionOptions(l,!!o.enableCpuMemArena,!!o.enableMemPattern,d,!!o.enableProfiling,0,c,h,f,g),n===0&&be("Can't create session options."),o.executionProviders&&await So(n,o,a),o.enableGraphCapture!==void 0){if(typeof o.enableGraphCapture!="boolean")throw new Error(`enableGraphCapture must be a boolean value: ${o.enableGraphCapture}`);Kt(n,"enableGraphCapture",o.enableGraphCapture.toString(),a)}if(o.freeDimensionOverrides)for(let[_,w]of Object.entries(o.freeDimensionOverrides)){if(typeof _!="string")throw new Error(`free dimension override name must be a string: ${_}`);if(typeof w!="number"||!Number.isInteger(w)||w<0)throw new Error(`free dimension override value must be a non-negative integer: ${w}`);let x=pt(_,a);t._OrtAddFreeDimensionOverride(n,x,w)!==0&&be(`Can't set a free dimension override: ${_} - ${w}.`)}return o.extra!==void 0&&fi(o.extra,"",new WeakSet,(_,w)=>{Kt(n,_,w,a)}),[n,a]}catch(l){throw n!==0&&t._OrtReleaseSessionOptions(n)!==0&&be("Can't release session options."),a.forEach(d=>t._free(d)),l}}}),Zt,Et,Xt,mi,gi,Ms,Ps,Rs,re=$(()=>{"use strict";Zt=e=>{switch(e){case"int8":return 3;case"uint8":return 2;case"bool":return 9;case"int16":return 5;case"uint16":return 4;case"int32":return 6;case"uint32":return 12;case"float16":return 10;case"float32":return 1;case"float64":return 11;case"string":return 8;case"int64":return 7;case"uint64":return 13;case"int4":return 22;case"uint4":return 21;default:throw new Error(`unsupported data type: ${e}`)}},Et=e=>{switch(e){case 3:return"int8";case 2:return"uint8";case 9:return"bool";case 5:return"int16";case 4:return"uint16";case 6:return"int32";case 12:return"uint32";case 10:return"float16";case 1:return"float32";case 11:return"float64";case 8:return"string";case 7:return"int64";case 13:return"uint64";case 22:return"int4";case 21:return"uint4";default:throw new Error(`unsupported data type: ${e}`)}},Xt=(e,t)=>{let n=[-1,4,1,1,2,2,4,8,-1,1,2,8,4,8,-1,-1,-1,-1,-1,-1,-1,.5,.5][e],a=typeof t=="number"?t:t.reduce((o,l)=>o*l,1);return n>0?Math.ceil(a*n):void 0},mi=e=>{switch(e){case"float16":return typeof Float16Array<"u"?Float16Array:Uint16Array;case"float32":return Float32Array;case"uint8":return Uint8Array;case"int8":return Int8Array;case"uint16":return Uint16Array;case"int16":return Int16Array;case"int32":return Int32Array;case"bool":return Uint8Array;case"float64":return Float64Array;case"uint32":return Uint32Array;case"int64":return BigInt64Array;case"uint64":return BigUint64Array;default:throw new Error(`unsupported type: ${e}`)}},gi=e=>{switch(e){case"verbose":return 0;case"info":return 1;case"warning":return 2;case"error":return 3;case"fatal":return 4;default:throw new Error(`unsupported logging level: ${e}`)}},Ms=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Ps=e=>e==="float32"||e==="float16"||e==="int32"||e==="int64"||e==="uint32"||e==="uint64"||e==="int8"||e==="uint8"||e==="bool"||e==="uint4"||e==="int4",Rs=e=>{switch(e){case"none":return 0;case"cpu":return 1;case"cpu-pinned":return 2;case"texture":return 3;case"gpu-buffer":return 4;case"ml-tensor":return 5;default:throw new Error(`unsupported data location: ${e}`)}}}),_i,Ds=$(()=>{"use strict";bs(),_i=async e=>{if(typeof e=="string"){let t=await fetch(e);if(!t.ok)throw new Error(`failed to load external data file: ${e}`);let n=t.headers.get("Content-Length"),a=n?parseInt(n,10):0;if(a<1073741824)return new Uint8Array(await t.arrayBuffer());{if(!t.body)throw new Error(`failed to load external data file: ${e}, no response body.`);let o=t.body.getReader(),l;try{l=new ArrayBuffer(a)}catch(c){if(c instanceof RangeError){let h=Math.ceil(a/65536);l=new WebAssembly.Memory({initial:h,maximum:h}).buffer}else throw c}let d=0;for(;;){let{done:c,value:h}=await o.read();if(c)break;let f=h.byteLength;new Uint8Array(l,d,f).set(h),d+=f}return new Uint8Array(l,0,a)}}else return e instanceof Blob?new Uint8Array(await e.arrayBuffer()):e instanceof Uint8Array?e:new Uint8Array(e)}}),To,Ao,zo,Co,Bs,Oo,we,kt=$(()=>{"use strict";re(),To=["V","I","W","E","F"],Ao=(e,t)=>{console.log(`[${To[e]},${new Date().toISOString()}]${t}`)},Bs=(e,t)=>{zo=e,Co=t},Oo=(e,t)=>{let n=gi(e),a=gi(zo);n>=a&&Ao(n,typeof t=="function"?t():t)},we=(...e)=>{Co&&Oo(...e)}}),Mo,gn,L,yi,Po,Ro,Do,le=$(()=>{"use strict";Mo=class{static calcMatMulShape(e,t){return e[1]!==t[0]?void 0:[e[0],t[1]]}},gn=class{static calcShape(e,t,n=!1){let a=e.length,o=t.length;if(a===0)return t;if(o===0)return e;let l=Math.max(e.length,t.length),d=new Array(l);if(n){if(a<2||o<2)return;let c=Mo.calcMatMulShape([e[a-2],e[a-1]],[t[o-2],t[o-1]]);if(c===void 0)return;[d[l-2],d[l-1]]=c}for(let c=n?3:1;c<=l;c++){let h=a-c<0?1:e[a-c],f=o-c<0?1:t[o-c];if(h!==f&&h>1&&f>1)return;let g=Math.max(h,f);if(h&&f)d[l-c]=Math.max(h,f);else{if(g>1)return;d[l-c]=0}}return d}static isValidBroadcast(e,t){let n=e.length,a=t.length;if(n>a)return!1;for(let o=1;o<=n;o++)if(e[n-o]!==1&&e[n-o]!==t[a-o])return!1;return!0}},L=class is{static size(t){return is.getSizeFromDimensionRange(t,0,t.length)}static convertShape(t,n=4){let a=t.length;if(a===0)return[];let o=new Array(a),l=a-1;for(;l>=0;){if(t[l]%n===0){o[l]=t[l]/n;break}if(n%t[l]!==0)throw new Error("cannot convert shape");o[l]=1,n/=t[l],l--}for(l--;l>=0;l--)o[l]=t[l];return o}static sizeFromDimension(t,n){if(n<0||n>t.length)throw new Error(`invalid dimension of ${n} for sizeFromDimension as Tensor has ${t.length} dimensions.`);return is.getSizeFromDimensionRange(t,n,t.length)}static sizeToDimension(t,n){if(n<0||n>t.length)throw new Error(`invalid dimension of ${n} for sizeToDimension as Tensor has ${t.length} dimensions.`);return is.getSizeFromDimensionRange(t,0,n)}static getSizeFromDimensionRange(t,n,a){let o=1;for(let l=n;l<a;l++){if(t[l]<0)throw new Error("cannot get valid size from specified dimension range. Most likely the range contains negative values in them.");o*=Number(t[l])}return o}static computeStrides(t){let n=t.length;if(n===0)return[];if(n===1)return[1];let a=new Array(n);a[n-1]=1,a[n-2]=t[n-1];for(let o=n-3;o>=0;--o)a[o]=a[o+1]*t[o+1];return a}static normalizeAxis(t,n){if(t<-n&&t>=n)throw new Error("unsupported axis for this operation.");return t<0?t+n:t}static normalizeAxes(t,n){return t.map(a=>this.normalizeAxis(a,n??t.length))}static sortBasedOnPerm(t,n){return n?n.map(a=>t[a]):t.slice().reverse()}static padShape(t,n){let a=t.length;return t.map((o,l)=>o+n[l]+n[l+a])}static areEqual(t,n){return t.length!==n.length?!1:t.every((a,o)=>a===n[o])}},yi=class Nt{static adjustPoolAttributes(t,n,a,o,l,d){if(!t&&a.length!==n.length-2)throw new Error("length of specified kernel shapes should be 2 less than length of input dimensions");if(t)for(let c=0;c<n.length-2;c++)c>=a.length?a.push(n[c+2]):a[c]=n[c+2];for(let c=0;c<a.length;c++)if(c<o.length){if(o[c]<0)throw new Error("strides should be greater than or equal to 1")}else o.push(1);for(let c=0;c<a.length;c++)if(c<l.length){if(l[c]<0)throw new Error("dilations should be greater than or equal to 1")}else l.push(1);for(let c=0;c<a.length*2;c++)if(c<d.length){if(d[c]<0)throw new Error("pad should be greater than or equal to 1")}else d.push(0);for(let c=0;c<a.length;c++){if(a[c]<=0)throw new Error("kernel shapes need to be greater than 0");if(d[c]>=a[c]||d[c+a.length]>=a[c])throw new Error("pads should be smaller than kernel")}}static adjustPadsBasedOnAutoPad(t,n,a,o,l,d,c){if(c){if(l.length!==2*(t.length-2))throw new Error("length of pads should be twice the length of data dimensions");if(n.length!==t.length-2)throw new Error("length of strides should be the length of data dimensions");if(o.length!==t.length-2)throw new Error("length of kernel shapes should be the length of data dimensions");for(let h=0;h<t.length-2;h++)Nt.adjustPadAndReturnShape(t[h+(d?1:2)],n[h],a[h],o[h],l,h,h+t.length-2,c)}}static computePoolOutputShape(t,n,a,o,l,d,c,h=0){if(n.length<=0)throw new Error("input shape must be of size greater than 0");let f=[n[0],n[1]];return Nt.computeShapeHelper(t,n,f,a,o,l,d,c,h),f}static computeConvOutputShape(t,n,a,o,l,d,c){if(t.length<=0||n.length<=0)throw new Error("invalid input tensor dims or invalid filter tensor dims");let h=[t[0],n[0]];return Nt.computeShapeHelper(!1,t,h,a,o,l,d,c),h}static computeShapeHelper(t,n,a,o,l,d,c,h,f=0){if(t)for(let g=0;g<n.length-2;g++)a.push(1);else for(let g=0;g<n.length-2;g++)a.push(Nt.adjustPadAndReturnShape(n[g+2],o[g],l[g],d[g],c,g,g+n.length-2,h,f))}static computeOutputSize(t,n,a,o,l){let d=Math.floor(t/n)+1;return l===1&&(d=Math.ceil(t/n)+1,(d-1)*n>=a+o&&(d-=1)),d}static adjustPadAndReturnShape(t,n,a,o,l,d,c,h,f=0){let g=a*(o-1)+1;if(h&&h!=="NOTSET")switch(h){case"VALID":return l[d]=0,l[c]=0,Nt.computeOutputSize(t-g,n,t,0,f);case"SAME_LOWER":case"SAME_UPPER":if(a!==1)throw new Error("Dilation not supported for SAME_UPPER or SAME_LOWER");{let _=(Math.floor((t+n-1)/n)-1)*n+o-t;return l[d]=Math.floor(h==="SAME_LOWER"?(_+1)/2:_/2),l[c]=_-l[d],Nt.computeOutputSize(t+l[d]+l[c]-g,n,t,l[d],f)}default:throw new Error("Unsupported AutoPad type")}else return Nt.computeOutputSize(t+l[d]+l[c]-g,n,t,l[d],f)}},Po=class{static getShapeOfGemmResult(e,t,n,a,o){if(e.length!==2||n.length!==2)throw new Error("shape need to be of size 2");let l,d,c;t?(l=e[1],d=e[0]):(l=e[0],d=e[1]);let h=-1;if(a?(c=n[0],h=1):(c=n[1],h=0),n[h]!==d)throw new Error("dimension mismatch");if(l<=0||c<=0||d<=0)throw new Error("invalid shape specified");if(o&&!gn.isValidBroadcast(o,[l,c]))throw new Error("gemm: invalid bias shape for broadcast");return[l,c,d]}},Ro=-34028234663852886e22,Do=34028234663852886e22}),Ls,Bo=$(()=>{"use strict";re(),Ls=(e,t)=>new(mi(t))(e)}),Ns,Lo,Us,No,Fs,Uo,Ws,Vs,js,Fo,Wo,kg=$(()=>{"use strict";re(),kt(),Ns=new Map([["float32",32],["float16",16],["int32",32],["uint32",32],["int64",64],["uint64",64],["int8",8],["uint8",8],["int4",4],["uint4",4]]),Lo=(e,t)=>{if(t==="int32")return e;let n=Ns.get(t);if(!n)throw new Error(`WebNN backend does not support data type: ${t}`);let a=n/8;if(e.byteLength%a!==0)throw new Error(`Invalid Uint8Array length - must be a multiple of ${a}.`);let o=e.byteLength/a,l=new(mi(t))(e.buffer,e.byteOffset,o);switch(t){case"int64":case"uint64":{let d=new Int32Array(o);for(let c=0;c<o;c++){let h=l[c];if(h>2147483647n||h<-2147483648n)throw new Error("Can not convert int64 data to int32 - value out of range.");d[c]=Number(h)}return new Uint8Array(d.buffer)}case"int8":case"uint8":case"uint32":{if(t==="uint32"&&l.some(c=>c>2147483647))throw new Error("Can not convert uint32 data to int32 - value out of range.");let d=Int32Array.from(l,Number);return new Uint8Array(d.buffer)}default:throw new Error(`Unsupported data conversion from ${t} to 'int32'`)}},Us=(e,t)=>{if(t==="int32")return e;if(e.byteLength%4!==0)throw new Error("Invalid Uint8Array length - must be a multiple of 4 (int32).");let n=e.byteLength/4,a=new Int32Array(e.buffer,e.byteOffset,n);switch(t){case"int64":{let o=BigInt64Array.from(a,BigInt);return new Uint8Array(o.buffer)}case"uint64":{if(a.some(l=>l<0))throw new Error("Can not convert int32 data to uin64 - negative value found.");let o=BigUint64Array.from(a,BigInt);return new Uint8Array(o.buffer)}case"int8":{if(a.some(l=>l<-128||l>127))throw new Error("Can not convert int32 data to int8 - value out of range.");let o=Int8Array.from(a,Number);return new Uint8Array(o.buffer)}case"uint8":{if(a.some(o=>o<0||o>255))throw new Error("Can not convert int32 data to uint8 - value out of range.");return Uint8Array.from(a,Number)}case"uint32":{if(a.some(l=>l<0))throw new Error("Can not convert int32 data to uint32 - negative value found.");let o=Uint32Array.from(a,Number);return new Uint8Array(o.buffer)}default:throw new Error(`Unsupported data conversion from 'int32' to ${t}`)}},No=1,Fs=()=>No++,Uo=new Map([["int8","int32"],["uint8","int32"],["uint32","int32"],["int64","int32"]]),Ws=(e,t)=>{let n=Ns.get(e);if(!n)throw new Error(`WebNN backend does not support data type: ${e}`);return t.length>0?Math.ceil(t.reduce((a,o)=>a*o)*n/8):0},Vs=class{constructor(e){this.isDataConverted=!1;let{sessionId:t,context:n,tensor:a,dataType:o,shape:l,fallbackDataType:d}=e;this.sessionId=t,this.mlContext=n,this.mlTensor=a,this.dataType=o,this.tensorShape=l,this.fallbackDataType=d}get tensor(){return this.mlTensor}get type(){return this.dataType}get fallbackType(){return this.fallbackDataType}get shape(){return this.tensorShape}get byteLength(){return Ws(this.dataType,this.tensorShape)}destroy(){we("verbose",()=>"[WebNN] TensorWrapper.destroy"),this.mlTensor.destroy()}write(e){this.mlContext.writeTensor(this.mlTensor,e)}async read(e){if(this.fallbackDataType){let t=await this.mlContext.readTensor(this.mlTensor),n=Us(new Uint8Array(t),this.dataType);if(e){(e instanceof ArrayBuffer?new Uint8Array(e):new Uint8Array(e.buffer,e.byteOffset,e.byteLength)).set(n);return}else return new Uint8Array(n).buffer}else return e?this.mlContext.readTensor(this.mlTensor,e):this.mlContext.readTensor(this.mlTensor)}canReuseTensor(e,t,n){return this.mlContext===e&&this.dataType===t&&this.tensorShape.length===n.length&&this.tensorShape.every((a,o)=>a===n[o])}setIsDataConverted(e){this.isDataConverted=e}},js=class{constructor(e,t){this.tensorManager=e,this.wrapper=t}get tensorWrapper(){return this.wrapper}releaseTensor(){this.tensorWrapper&&(this.tensorManager.releaseTensor(this.tensorWrapper),this.wrapper=void 0)}async ensureTensor(e,t,n,a){let o=this.tensorManager.getMLContext(e),l=this.tensorManager.getMLOpSupportLimits(e),d;if(!(l!=null&&l.input.dataTypes.includes(t))){if(d=Uo.get(t),!d||!(l!=null&&l.input.dataTypes.includes(d)))throw new Error(`WebNN backend does not support data type: ${t}`);we("verbose",()=>`[WebNN] TensorIdTracker.ensureTensor: fallback dataType from ${t} to ${d}`)}if(this.wrapper){if(this.wrapper.canReuseTensor(o,t,n))return this.wrapper.tensor;if(a){if(this.wrapper.byteLength!==Ws(t,n))throw new Error("Unable to copy data to tensor with different size.");this.activeUpload=new Uint8Array(await this.wrapper.read())}this.tensorManager.releaseTensor(this.wrapper)}let c=typeof MLTensorUsage>"u"?void 0:MLTensorUsage.READ|MLTensorUsage.WRITE;return this.wrapper=await this.tensorManager.getCachedTensor(e,t,n,c,!0,!0,d),a&&this.activeUpload&&(this.wrapper.write(this.activeUpload),this.activeUpload=void 0),this.wrapper.tensor}upload(e){let t=e;if(this.wrapper){if(this.wrapper.fallbackType)if(this.wrapper.fallbackType==="int32")t=Lo(e,this.wrapper.type),this.wrapper.setIsDataConverted(!0);else throw new Error(`Unsupported fallback data type: ${this.wrapper.fallbackType}`);if(e.byteLength===this.wrapper.byteLength){this.wrapper.write(t);return}else we("verbose",()=>"Data size does not match tensor size. Releasing tensor."),this.releaseTensor()}this.activeUpload?this.activeUpload.set(t):this.activeUpload=new Uint8Array(t)}async download(e){var t,n;if(this.activeUpload){let a=(t=this.wrapper)!=null&&t.isDataConverted?Us(this.activeUpload,(n=this.wrapper)==null?void 0:n.type):this.activeUpload;if(e){e instanceof ArrayBuffer?new Uint8Array(e).set(a):new Uint8Array(e.buffer,e.byteOffset,e.byteLength).set(a);return}else return a.buffer}if(!this.wrapper)throw new Error("Tensor has not been created.");return e?this.wrapper.read(e):this.wrapper.read()}},Fo=class{constructor(e){this.backend=e,this.tensorTrackersById=new Map,this.freeTensors=[],this.externalTensors=new Set}getMLContext(e){let t=this.backend.getMLContext(e);if(!t)throw new Error("MLContext not found for session.");return t}getMLOpSupportLimits(e){return this.backend.getMLOpSupportLimits(e)}reserveTensorId(){let e=Fs();return this.tensorTrackersById.set(e,new js(this)),e}releaseTensorId(e){let t=this.tensorTrackersById.get(e);t&&(this.tensorTrackersById.delete(e),t.tensorWrapper&&this.releaseTensor(t.tensorWrapper))}async ensureTensor(e,t,n,a,o){we("verbose",()=>`[WebNN] TensorManager.ensureTensor {tensorId: ${t}, dataType: ${n}, shape: ${a}, copyOld: ${o}}`);let l=this.tensorTrackersById.get(t);if(!l)throw new Error("Tensor not found.");return l.ensureTensor(e,n,a,o)}upload(e,t){let n=this.tensorTrackersById.get(e);if(!n)throw new Error("Tensor not found.");n.upload(t)}async download(e,t){we("verbose",()=>`[WebNN] TensorManager.download {tensorId: ${e}, dstBuffer: ${t==null?void 0:t.byteLength}}`);let n=this.tensorTrackersById.get(e);if(!n)throw new Error("Tensor not found.");return n.download(t)}releaseTensorsForSession(e){for(let t of this.freeTensors)t.sessionId===e&&t.destroy();this.freeTensors=this.freeTensors.filter(t=>t.sessionId!==e)}registerTensor(e,t,n,a){let o=this.getMLContext(e),l=Fs(),d=new Vs({sessionId:e,context:o,tensor:t,dataType:n,shape:a});return this.tensorTrackersById.set(l,new js(this,d)),this.externalTensors.add(d),l}async getCachedTensor(e,t,n,a,o,l,d){let c=this.getMLContext(e);for(let[f,g]of this.freeTensors.entries())if(g.canReuseTensor(c,t,n)){we("verbose",()=>`[WebNN] Reusing tensor {dataType: ${t}, ${d?`fallbackDataType: ${d},`:""} shape: ${n}`);let _=this.freeTensors.splice(f,1)[0];return _.sessionId=e,_}we("verbose",()=>`[WebNN] MLContext.createTensor {dataType: ${t}, ${d?`fallbackDataType: ${d},`:""} shape: ${n}}`);let h=await c.createTensor({dataType:d??t,shape:n,dimensions:n,usage:a,writable:o,readable:l});return new Vs({sessionId:e,context:c,tensor:h,dataType:t,shape:n,fallbackDataType:d})}releaseTensor(e){this.externalTensors.has(e)&&this.externalTensors.delete(e),this.freeTensors.push(e)}},Wo=(...e)=>new Fo(...e)}),Mn,Vo,jo,Sg=$(()=>{"use strict";re(),Ht(),Bo(),kg(),kt(),Mn=new Map([[1,"float32"],[10,"float16"],[6,"int32"],[12,"uint32"],[7,"int64"],[13,"uint64"],[22,"int4"],[21,"uint4"],[3,"int8"],[2,"uint8"],[9,"uint8"]]),Vo=(e,t)=>{if(e===t)return!0;if(e===void 0||t===void 0)return!1;let n=Object.keys(e).sort(),a=Object.keys(t).sort();return n.length===a.length&&n.every((o,l)=>o===a[l]&&e[o]===t[o])},jo=class{constructor(e){this.tensorManager=Wo(this),this.mlContextBySessionId=new Map,this.sessionIdsByMLContext=new Map,this.mlContextCache=[],this.sessionGraphInputs=new Map,this.sessionGraphOutputs=new Map,this.temporaryGraphInputs=[],this.temporaryGraphOutputs=[],this.temporarySessionTensorIds=new Map,this.mlOpSupportLimitsBySessionId=new Map,Bs(e.logLevel,!!e.debug)}get currentSessionId(){if(this.activeSessionId===void 0)throw new Error("No active session");return this.activeSessionId}onRunStart(e){we("verbose",()=>`[WebNN] onRunStart {sessionId: ${e}}`),this.activeSessionId=e}onRunEnd(e){we("verbose",()=>`[WebNN] onRunEnd {sessionId: ${e}}`);let t=this.temporarySessionTensorIds.get(e);if(t){for(let n of t)we("verbose",()=>`[WebNN] releasing temporary tensor {tensorId: ${n}}`),this.tensorManager.releaseTensorId(n);this.temporarySessionTensorIds.delete(e),this.activeSessionId=void 0}}async createMLContext(e){if(e instanceof GPUDevice){let n=this.mlContextCache.findIndex(a=>a.gpuDevice===e);if(n!==-1)return this.mlContextCache[n].mlContext;{let a=await navigator.ml.createContext(e);return this.mlContextCache.push({gpuDevice:e,mlContext:a}),a}}else if(e===void 0){let n=this.mlContextCache.findIndex(a=>a.options===void 0&&a.gpuDevice===void 0);if(n!==-1)return this.mlContextCache[n].mlContext;{let a=await navigator.ml.createContext();return this.mlContextCache.push({mlContext:a}),a}}let t=this.mlContextCache.findIndex(n=>Vo(n.options,e));if(t!==-1)return this.mlContextCache[t].mlContext;{let n=await navigator.ml.createContext(e);return this.mlContextCache.push({options:e,mlContext:n}),n}}registerMLContext(e,t){this.mlContextBySessionId.set(e,t);let n=this.sessionIdsByMLContext.get(t);n||(n=new Set,this.sessionIdsByMLContext.set(t,n)),n.add(e),this.mlOpSupportLimitsBySessionId.has(e)||this.mlOpSupportLimitsBySessionId.set(e,t.opSupportLimits()),this.temporaryGraphInputs.length>0&&(this.sessionGraphInputs.set(e,this.temporaryGraphInputs),this.temporaryGraphInputs=[]),this.temporaryGraphOutputs.length>0&&(this.sessionGraphOutputs.set(e,this.temporaryGraphOutputs),this.temporaryGraphOutputs=[])}onReleaseSession(e){this.sessionGraphInputs.delete(e),this.sessionGraphOutputs.delete(e);let t=this.mlContextBySessionId.get(e);if(!t)return;this.tensorManager.releaseTensorsForSession(e),this.mlContextBySessionId.delete(e),this.mlOpSupportLimitsBySessionId.delete(e);let n=this.sessionIdsByMLContext.get(t);if(n.delete(e),n.size===0){this.sessionIdsByMLContext.delete(t);let a=this.mlContextCache.findIndex(o=>o.mlContext===t);a!==-1&&this.mlContextCache.splice(a,1)}}getMLContext(e){return this.mlContextBySessionId.get(e)}getMLOpSupportLimits(e){return this.mlOpSupportLimitsBySessionId.get(e)}reserveTensorId(){return this.tensorManager.reserveTensorId()}releaseTensorId(e){we("verbose",()=>`[WebNN] releaseTensorId {tensorId: ${e}}`),this.tensorManager.releaseTensorId(e)}async ensureTensor(e,t,n,a,o){let l=Mn.get(n);if(!l)throw new Error(`Unsupported ONNX data type: ${n}`);return this.tensorManager.ensureTensor(e??this.currentSessionId,t,l,a,o)}async createTemporaryTensor(e,t,n){we("verbose",()=>`[WebNN] createTemporaryTensor {onnxDataType: ${t}, shape: ${n}}`);let a=Mn.get(t);if(!a)throw new Error(`Unsupported ONNX data type: ${t}`);let o=this.tensorManager.reserveTensorId();await this.tensorManager.ensureTensor(e,o,a,n,!1);let l=this.temporarySessionTensorIds.get(e);return l?l.push(o):this.temporarySessionTensorIds.set(e,[o]),o}uploadTensor(e,t){if(!Se().shouldTransferToMLTensor)throw new Error("Trying to upload to a MLTensor while shouldTransferToMLTensor is false");we("verbose",()=>`[WebNN] uploadTensor {tensorId: ${e}, data: ${t.byteLength}}`),this.tensorManager.upload(e,t)}async downloadTensor(e,t){return this.tensorManager.download(e,t)}createMLTensorDownloader(e,t){return async()=>{let n=await this.tensorManager.download(e);return Ls(n,t)}}registerMLTensor(e,t,n,a){let o=Mn.get(n);if(!o)throw new Error(`Unsupported ONNX data type: ${n}`);let l=this.tensorManager.registerTensor(e,t,o,a);return we("verbose",()=>`[WebNN] registerMLTensor {tensor: ${t}, dataType: ${o}, dimensions: ${a}} -> {tensorId: ${l}}`),l}registerGraphInput(e){this.temporaryGraphInputs.push(e)}registerGraphOutput(e){this.temporaryGraphOutputs.push(e)}isGraphInput(e,t){let n=this.sessionGraphInputs.get(e);return n?n.includes(t):!1}isGraphOutput(e,t){let n=this.sessionGraphOutputs.get(e);return n?n.includes(t):!1}isGraphInputOutputTypeSupported(e,t,n=!0){let a=Mn.get(Zt(t)),o=this.mlOpSupportLimitsBySessionId.get(e);return typeof a>"u"?!1:n?!!(o!=null&&o.input.dataTypes.includes(a)):!!(o!=null&&o.output.dataTypes.includes(a))}flush(){}}}),qs=$(()=>{"use strict"}),Gs,wi,$i,qo,Go,Hs,Ks,Ho,Ko,Ig=$(()=>{"use strict";kt(),qs(),Gs=new Map([[64,250],[128,200],[256,200],[512,200],[2048,230],[4096,200],[8192,50],[16384,50],[32768,50],[65536,50],[131072,50],[262144,50],[524288,50],[1048576,50],[2097152,30],[4194304,20],[8388608,10],[12582912,10],[16777216,10],[26214400,15],[33554432,22],[44236800,2],[58982400,6],[67108864,6],[134217728,6],[167772160,6]]),wi=[],$i=e=>Math.ceil(Number(e)/16)*16,qo=e=>{for(let t=0;t<wi.length;t++){let n=wi[t];if(e<=n)return n}return Math.ceil(e/16)*16},Go=1,Hs=()=>Go++,Ks=async(e,t,n,a)=>{let o=$i(n),l=e.device.createBuffer({size:o,usage:GPUBufferUsage.COPY_DST|GPUBufferUsage.MAP_READ});try{let d=e.getCommandEncoder();e.endComputePass(),d.copyBufferToBuffer(t,0,l,0,o),e.flush(),await l.mapAsync(GPUMapMode.READ);let c=l.getMappedRange();if(a){let h=a();return h.set(new Uint8Array(c,0,n)),h}else return new Uint8Array(c.slice(0,n))}finally{l.destroy()}},Ho=class{constructor(e){this.backend=e,this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.buffersPending=[],this.capturedPendingBuffers=new Map;for(let[t]of Gs)wi.push(t),this.freeBuffers.set(t,[]),this.freeUniformBuffers.set(t,[]);this.sessionCount=0}upload(e,t){let n=t.buffer,a=t.byteOffset,o=t.byteLength,l=$i(o),d=this.storageCache.get(e);if(!d)throw new Error("gpu data for uploading does not exist");if(Number(d.originalSize)!==o)throw new Error(`inconsistent data size. gpu data size=${d.originalSize}, data size=${o}`);if(l===o&&a%4===0)this.backend.device.queue.writeBuffer(d.gpuData.buffer,0,n,a,o);else{let c=new Uint8Array(l);c.set(t),this.backend.device.queue.writeBuffer(d.gpuData.buffer,0,c,0,l)}we("verbose",()=>`[WebGPU] GpuDataManager.upload(id=${e})`)}memcpy(e,t){let n=this.storageCache.get(e);if(!n)throw new Error("source gpu data for memcpy does not exist");let a=this.storageCache.get(t);if(!a)throw new Error("destination gpu data for memcpy does not exist");if(n.originalSize!==a.originalSize)throw new Error("inconsistent source and destination gpu data size");let o=$i(n.originalSize),l=this.backend.getCommandEncoder();this.backend.endComputePass(),l.copyBufferToBuffer(n.gpuData.buffer,0,a.gpuData.buffer,0,o)}registerExternalBuffer(e,t,n){let a;if(n){if(a=n[0],e===n[1])return we("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, buffer is the same, skip.`),a;if(this.backend.capturedCommandList.has(this.backend.currentSessionId))throw new Error(`Registering a different external buffer under graph capture mode is not supported yet.
             Please use the previous external buffer!`)}else a=Hs();return this.storageCache.set(a,{gpuData:{id:a,type:0,buffer:e},originalSize:t}),we("verbose",()=>`[WebGPU] GpuDataManager.registerExternalBuffer(size=${t}) => id=${a}, registered.`),a}unregisterExternalBuffer(e){e!==void 0&&(this.storageCache.delete(e),we("verbose",()=>`[WebGPU] GpuDataManager.unregisterExternalBuffer() => id=${e}`))}create(e,t=GPUBufferUsage.STORAGE|GPUBufferUsage.COPY_SRC|GPUBufferUsage.COPY_DST){let n=qo(e),a,o=(t&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE,l=(t&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM;if(o||l){let c=(o?this.freeBuffers:this.freeUniformBuffers).get(n);c?c.length>0?a=c.pop():a=this.backend.device.createBuffer({size:n,usage:t}):a=this.backend.device.createBuffer({size:n,usage:t})}else a=this.backend.device.createBuffer({size:n,usage:t});let d={id:Hs(),type:0,buffer:a};return this.storageCache.set(d.id,{gpuData:d,originalSize:Number(e)}),we("verbose",()=>`[WebGPU] GpuDataManager.create(size=${e}) => id=${d.id}`),d}get(e){var t;return(t=this.storageCache.get(e))==null?void 0:t.gpuData}release(e){let t=typeof e=="bigint"?Number(e):e,n=this.storageCache.get(t);if(!n){if(this.storageCache.size===0)return 0;throw new Error("releasing data does not exist")}return we("verbose",()=>`[WebGPU] GpuDataManager.release(id=${t}), gpuDataId=${n.gpuData.id}`),this.storageCache.delete(t),this.buffersPending.push(n.gpuData.buffer),n.originalSize}async download(e,t){let n=this.storageCache.get(Number(e));if(!n)throw new Error("data does not exist");await Ks(this.backend,n.gpuData.buffer,n.originalSize,t)}refreshPendingBuffers(){if(this.buffersPending.length!==0)if(this.backend.sessionStatus==="default"){for(let e of this.buffersPending){let t=Gs.get(e.size);if((e.usage&GPUBufferUsage.STORAGE)===GPUBufferUsage.STORAGE){let n=this.freeBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else if((e.usage&GPUBufferUsage.UNIFORM)===GPUBufferUsage.UNIFORM){let n=this.freeUniformBuffers.get(e.size)||[];t===void 0||n.length>=t?e.destroy():n.push(e)}else e.destroy()}this.buffersPending=[]}else{let e=this.capturedPendingBuffers.get(this.backend.currentSessionId);e||(e=[],this.capturedPendingBuffers.set(this.backend.currentSessionId,e));for(let t of this.buffersPending)e.push(t);this.buffersPending=[]}}dispose(){this.freeBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.freeUniformBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache.forEach(e=>{e.gpuData.buffer.destroy()}),this.capturedPendingBuffers.forEach(e=>{e.forEach(t=>{t.destroy()})}),this.storageCache=new Map,this.freeBuffers=new Map,this.freeUniformBuffers=new Map,this.capturedPendingBuffers=new Map}onCreateSession(){this.sessionCount+=1}onReleaseSession(e){let t=this.capturedPendingBuffers.get(e);t&&(t.forEach(n=>{n.destroy()}),this.capturedPendingBuffers.delete(e)),this.sessionCount-=1,this.sessionCount===0&&(we("warning",()=>"[WebGPU] Clearing webgpu buffer cache"),this.storageCache.forEach(n=>{n.gpuData.buffer.destroy()}),this.storageCache=new Map)}},Ko=(...e)=>new Ho(...e)}),Zo,xe,Oe=$(()=>{"use strict";Zo=class{constructor(e){Object.assign(this,e)}get cacheKey(){return this.key||(this.key=Object.getOwnPropertyNames(this).sort().map(e=>`${this[e]}`).join(";")),this.key}},xe=e=>new Zo(e)}),_n,bi,Ue,Fe,ee,Me,Zs,yn,Ot,Y,Pn,U,H,Xo,Xs,Yo,Jo,de=$(()=>{"use strict";re(),le(),_n=64,bi=(e,t)=>{if(t===3)throw new Error("vec3 has same alignment as vec4, use vec4 instead");switch(Number(e)){case 10:return t>1?`vec${t}<f16>`:"f16";case 1:return t>1?`vec${t}<f32>`:"f32";case 6:return t>1?`vec${t}<i32>`:"i32";case 12:return t>1?`vec${t}<u32>`:"u32";case 7:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","i32"];case 13:if(t>1)throw new Error("currently not supported vecX of uint64 yet");return["vec2<u32>","u32"];case 9:if(t!==4)throw new Error("bool must be vec4");return["u32","vec4<bool>"];case 22:return"i32";case 21:return"u32";default:throw new Error(`Unknown data type: ${e}`)}},Ue=(e,t=1)=>{let n=bi(e,t);return typeof n=="string"?n:n[0]},Fe=(e,t=1)=>{let n=bi(e,t);return typeof n=="string"?n:n[1]},ee=(...e)=>{let t=[];return e.forEach(n=>{n.length!==0&&t.push({type:12,data:n},{type:12,data:L.computeStrides(n)})}),t},Me=e=>e%4===0?4:e%2===0?2:1,Zs=(e="f32",t,n="0")=>!t||t===1?`${e}(${n})`:`vec${t}<${e}>(${n})`,yn=(e,t,n)=>e==="f32"?n:t===1?`f32(${n})`:`vec${t}<f32>(${n})`,Ot=(e,t)=>t===4?`(${e}.x + ${e}.y + ${e}.z + ${e}.w)`:t===2?`(${e}.x + ${e}.y)`:t===3?`(${e}.x + ${e}.y + ${e}.z)`:e,Y=(e,t,n,a)=>e.startsWith("uniforms.")&&n>4?typeof t=="string"?a==="f16"?`${e}[(${t}) / 8][(${t}) % 8 / 4][(${t}) % 8 % 4]`:`${e}[(${t}) / 4][(${t}) % 4]`:a==="f16"?`${e}[${Math.floor(t/8)}][${Math.floor(t%8/4)}][${t%8%4}]`:`${e}[${Math.floor(t/4)}][${t%4}]`:n>1?`${e}[${t}]`:e,Pn=(e,t,n,a,o)=>{let l=typeof n=="number",d=l?n:n.length,c=[...new Array(d).keys()],h=d<2?"u32":d<=4?`vec${d}<u32>`:`array<u32, ${d}>`,f=bi(t,o),g=typeof f=="string"?f:f[1],_=typeof f=="string"?f:f[0],w={indices:h,value:g,storage:_,tensor:t},x=F=>typeof F=="string"?F:`${F}u`,v={offsetToIndices:!1,indicesToOffset:!1,broadcastedIndicesToOffset:!1,set:!1,setByIndices:!1,get:!1,getByIndices:!1},S=l?"uniforms.":"",T=`${S}${e}_shape`,k=`${S}${e}_strides`,E="";for(let F=0;F<d-1;F++)E+=`
    let dim${F} = current / ${Y(k,F,d)};
    let rest${F} = current % ${Y(k,F,d)};
    indices[${F}] = dim${F};
    current = rest${F};
    `;E+=`indices[${d-1}] = current;`;let A=d<2?"":`
  fn o2i_${e}(offset: u32) -> ${w.indices} {
    var indices: ${w.indices};
    var current = offset;
    ${E}
    return indices;
  }`,z=F=>(v.offsetToIndices=!0,d<2?F:`o2i_${e}(${F})`),C=[];if(d>=2)for(let F=d-1;F>=0;F--)C.push(`${Y(k,F,d)} * (indices[${F}])`);let M=d<2?"":`
  fn i2o_${e}(indices: ${w.indices}) -> u32 {
    return ${C.join("+")};
  }`,D=F=>(v.indicesToOffset=!0,d<2?F:`i2o_${e}(${F})`),N=(...F)=>d===0?"0u":`${w.indices}(${F.map(x).join(",")})`,W=(F,ne)=>d<2?`${F}`:`${Y(F,ne,d)}`,q=(F,ne,se)=>d<2?`${F}=${se};`:`${Y(F,ne,d)}=${se};`,ie={},K=(F,ne)=>{v.broadcastedIndicesToOffset=!0;let se=`${ne.name}broadcastedIndicesTo${e}Offset`;if(se in ie)return`${se}(${F})`;let j=[];for(let Te=d-1;Te>=0;Te--){let Pe=ne.indicesGet("outputIndices",Te+ne.rank-d);j.push(`${W(k,Te)} * (${Pe} % ${W(T,Te)})`)}return ie[se]=`fn ${se}(outputIndices: ${ne.type.indices}) -> u32 {
             return ${j.length>0?j.join("+"):"0u"};
           }`,`${se}(${F})`},Q=(F,ne)=>(()=>{if(w.storage===w.value)return`${e}[${F}]=${ne};`;if(w.storage==="vec2<u32>"&&w.value==="i32")return`${e}[${F}]=vec2<u32>(u32(${ne}), select(0u, 0xFFFFFFFFu, ${ne} < 0));`;if(w.storage==="vec2<u32>"&&w.value==="u32")return`${e}[${F}]=vec2<u32>(u32(${ne}), 0u);`;if(w.storage==="u32"&&w.value==="vec4<bool>")return`${e}[${F}]=dot(vec4<u32>(0x1, 0x100, 0x10000, 0x1000000), vec4<u32>(${ne}));`;throw new Error(`not supported combination of storage type ${w.storage} and value type ${w.value} yet`)})(),_e=F=>(()=>{if(w.storage===w.value)return`${e}[${F}]`;if(w.storage==="vec2<u32>"&&w.value==="i32")return`i32(${e}[${F}].x)`;if(w.storage==="vec2<u32>"&&w.value==="u32")return`u32(${e}[${F}].x)`;if(w.storage==="u32"&&w.value==="vec4<bool>")return`vec4<bool>(bool(${e}[${F}] & 0xFFu), bool(${e}[${F}] & 0xFF00u), bool(${e}[${F}] & 0xFF0000u), bool(${e}[${F}] & 0xFF000000u))`;throw new Error(`not supported combination of storage type ${w.storage} and value type ${w.value} yet`)})(),$e=d<2?"":`
  fn get_${e}ByIndices(indices: ${w.indices}) -> ${g} {
    return ${_e(`i2o_${e}(indices)`)};
  }`,oe=d<2?"":(()=>{let F=c.map(se=>`d${se}: u32`).join(", "),ne=c.map(se=>`d${se}`).join(", ");return`
  fn get_${e}(${F}) -> ${g} {
    return get_${e}ByIndices(${N(ne)});
  }`})(),ce=(...F)=>{if(F.length!==d)throw new Error(`indices length must be ${d}`);let ne=F.map(x).join(",");return d===0?_e("0u"):d===1?_e(ne[0]):(v.get=!0,v.getByIndices=!0,v.indicesToOffset=!0,`get_${e}(${ne})`)},ye=F=>d<2?_e(F):(v.getByIndices=!0,v.indicesToOffset=!0,`get_${e}ByIndices(${F})`),ae=d<2?"":`
  fn set_${e}ByIndices(indices: ${w.indices}, value: ${g}) {
    ${Q(`i2o_${e}(indices)`,"value")}
  }`,ze=d<2?"":(()=>{let F=c.map(se=>`d${se}: u32`).join(", "),ne=c.map(se=>`d${se}`).join(", ");return`
  fn set_${e}(${F}, value: ${g}) {
    set_${e}ByIndices(${N(ne)}, value);
  }`})();return{impl:()=>{let F=[],ne=!1;return v.offsetToIndices&&(F.push(A),ne=!0),v.indicesToOffset&&(F.push(M),ne=!0),v.broadcastedIndicesToOffset&&(Object.values(ie).forEach(se=>F.push(se)),ne=!0),v.set&&(F.push(ze),ne=!0),v.setByIndices&&(F.push(ae),ne=!0),v.get&&(F.push(oe),ne=!0),v.getByIndices&&(F.push($e),ne=!0),!l&&ne&&F.unshift(`const ${T} = ${w.indices}(${n.join(",")});`,`const ${k} = ${w.indices}(${L.computeStrides(n).join(",")});`),F.join(`
`)},type:w,offsetToIndices:z,indicesToOffset:D,broadcastedIndicesToOffset:K,indices:N,indicesGet:W,indicesSet:q,set:(...F)=>{if(F.length!==d+1)throw new Error(`indices length must be ${d}`);let ne=F[d];if(typeof ne!="string")throw new Error("value must be string");let se=F.slice(0,d).map(x).join(",");return d===0?Q("0u",ne):d===1?Q(se[0],ne):(v.set=!0,v.setByIndices=!0,v.indicesToOffset=!0,`set_${e}(${se}, ${ne})`)},setByOffset:Q,setByIndices:(F,ne)=>d<2?Q(F,ne):(v.setByIndices=!0,v.indicesToOffset=!0,`set_${e}ByIndices(${F}, ${ne});`),get:ce,getByOffset:_e,getByIndices:ye,usage:a,name:e,strides:k,shape:T,rank:d}},U=(e,t,n,a=1)=>Pn(e,t,n,"input",a),H=(e,t,n,a=1)=>Pn(e,t,n,"output",a),Xo=(e,t,n)=>Pn(e,t,n,"atomicOutput",1),Xs=(e,t,n,a=1)=>Pn(e,t,n,"internal",a),Yo=class{constructor(e,t){this.normalizedDispatchGroup=e,this.limits=t,this.internalVariables=[],this.variables=[],this.uniforms=[],this.variableIndex=0}guardAgainstOutOfBoundsWorkgroupSizes(e){return`if (global_idx >= ${typeof e=="number"?`${e}u`:e}) { return; }`}mainStart(e=_n){let t=typeof e=="number"?e:e[0],n=typeof e=="number"?1:e[1],a=typeof e=="number"?1:e[2];if(t>this.limits.maxComputeWorkgroupSizeX||n>this.limits.maxComputeWorkgroupSizeY||a>this.limits.maxComputeWorkgroupSizeZ)throw new Error(`workgroup size [${t}, ${n}, ${a}] exceeds the maximum workgroup size [${this.limits.maxComputeWorkgroupSizeX}, ${this.limits.maxComputeWorkgroupSizeY}, ${this.limits.maxComputeWorkgroupSizeZ}].`);if(t*n*a>this.limits.maxComputeInvocationsPerWorkgroup)throw new Error(`workgroup size [${t}, ${n}, ${a}] exceeds the maximum workgroup invocations ${this.limits.maxComputeInvocationsPerWorkgroup}.`);let o=this.normalizedDispatchGroup[1]===1&&this.normalizedDispatchGroup[2]===1,l=o?`@builtin(global_invocation_id) global_id : vec3<u32>,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(local_invocation_id) local_id : vec3<u32>`:`@builtin(global_invocation_id) global_id : vec3<u32>,
                                             @builtin(local_invocation_id) local_id : vec3<u32>,
    @builtin(local_invocation_index) local_idx : u32,
    @builtin(workgroup_id) workgroup_id : vec3<u32>,
    @builtin(num_workgroups) num_workgroups : vec3<u32>`,d=o?`let global_idx = global_id.x;
         let workgroup_index = workgroup_id.x;`:`let workgroup_index = workgroup_id.z * num_workgroups[0] * num_workgroups[1] +
             workgroup_id.y * num_workgroups[0] + workgroup_id.x;
         let global_idx = workgroup_index * ${t*n*a}u + local_idx;`;return`@compute @workgroup_size(${t}, ${n}, ${a})
  fn main(${l}) {
    ${d}
  `}appendVariableUniforms(e){e.rank!==0&&(e.shape.startsWith("uniforms.")&&this.uniforms.push({name:e.shape.replace("uniforms.",""),type:"u32",length:e.rank}),e.strides.startsWith("uniforms.")&&this.uniforms.push({name:e.strides.replace("uniforms.",""),type:"u32",length:e.rank}))}declareVariable(e,t){if(e.usage==="internal")throw new Error("cannot use internal variable with declareVariable(). use registerInternalVariables() instead.");this.variables.push(e),this.appendVariableUniforms(e);let n=e.usage==="input"?"read":"read_write",a=e.usage==="atomicOutput"?"atomic<i32>":e.type.storage;return`@group(0) @binding(${t}) var<storage, ${n}> ${e.name}: array<${a}>;`}declareVariables(...e){return e.map(t=>this.declareVariable(t,this.variableIndex++)).join(`
`)}registerInternalVariable(e){if(e.usage!=="internal")throw new Error("cannot use input or output variable with registerInternalVariable(). use declareVariables() instead.");this.internalVariables.push(e),this.appendVariableUniforms(e)}registerInternalVariables(...e){return e.forEach(t=>this.registerInternalVariable(t)),this}registerUniform(e,t,n=1){return this.uniforms.push({name:e,type:t,length:n}),this}registerUniforms(e){return this.uniforms=this.uniforms.concat(e),this}uniformDeclaration(){if(this.uniforms.length===0)return"";let e=[];for(let{name:t,type:n,length:a}of this.uniforms)if(a&&a>4)n==="f16"?e.push(`@align(16) ${t}:array<mat2x4<${n}>, ${Math.ceil(a/8)}>`):e.push(`${t}:array<vec4<${n}>, ${Math.ceil(a/4)}>`);else{let o=a==null||a===1?n:`vec${a}<${n}>`;e.push(`${t}:${o}`)}return`
      struct Uniforms { ${e.join(", ")} };
      @group(0) @binding(${this.variableIndex}) var<uniform> uniforms: Uniforms;`}get additionalImplementations(){return this.uniformDeclaration()+this.variables.map(e=>e.impl()).join(`
`)+this.internalVariables.map(e=>e.impl()).join(`
`)}get variablesInfo(){if(this.uniforms.length===0)return;let e=t=>[12,10,1,6][["u32","f16","f32","i32"].indexOf(t)];return this.uniforms.map(t=>[e(t.type),t.length??1])}},Jo=(e,t)=>new Yo(e,t)}),Qo,Ys,eu,tu,nu,iu,at,su,ru,Mt=$(()=>{"use strict";re(),le(),Oe(),de(),Qo=(e,t)=>{if(!e||e.length!==1)throw new Error("Transpose requires 1 input.");if(t.length!==0&&t.length!==e[0].dims.length)throw new Error(`perm size ${t.length} does not match input rank ${e[0].dims.length}`)},Ys=(e,t)=>t.length!==0?t:[...new Array(e).keys()].reverse(),eu=(e,t)=>L.sortBasedOnPerm(e,Ys(e.length,t)),tu=(e,t,n,a)=>{let o=`fn perm(i: ${a.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`;for(let l=0;l<t;++l)o+=`a[${e[l]}]=i[${l}];`;return o+="return a;}"},nu=(e,t)=>{let n=[],a=[];for(let o=0;o<e.length;++o)e[o]!==1&&n.push(e[o]),e[t[o]]!==1&&a.push(t[o]);return{newShape:n,newPerm:a}},iu=(e,t)=>{let n=0;for(let a=0;a<e.length;++a)if(t[e[a]]!==1){if(e[a]<n)return!1;n=e[a]}return!0},at=(e,t)=>{let n=e.dataType,a=e.dims.length,o=Ys(a,t),l=eu(e.dims,o),d=e.dims,c=l,h=a<2||iu(o,e.dims),f;if(h)return f=v=>{let S=U("input",n,d,4),T=H("output",n,c,4);return`
  ${v.registerUniform("output_size","u32").declareVariables(S,T)}
  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    output[global_idx] = input[global_idx];
  }`},{name:"TransposeCopy",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let v=L.size(l);return{outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(v/64/4)},programUniforms:[{type:12,data:Math.ceil(v/4)}]}},getShaderSource:f};let{newShape:g,newPerm:_}=nu(e.dims,o),w=L.areEqual(_,[2,3,1]),x=L.areEqual(_,[3,1,2]);if(g.length===2||w||x){d=w?[g[0],g[1]*g[2]]:x?[g[0]*g[1],g[2]]:g,c=[d[1],d[0]];let v=16;return f=S=>{let T=U("a",n,d.length),k=H("output",n,c.length);return`
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
  }`},{name:"TransposeShared",shaderCache:{inputDependencies:["type"]},getRunData:()=>{let S=L.size(l);return{outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(c[1]/v),y:Math.ceil(c[0]/v)},programUniforms:[{type:12,data:S},...ee(d,c)]}},getShaderSource:f}}return f=v=>{let S=U("a",n,d.length),T=H("output",n,c.length);return`
  ${v.registerUniform("output_size","u32").declareVariables(S,T)}

  ${tu(o,a,S,T)}

  ${v.mainStart()}
    ${v.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${T.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${T.setByOffset("global_idx",S.getByIndices("aIndices"))}
  }`},{name:"Transpose",shaderCache:{hint:`${t}`,inputDependencies:["rank"]},getRunData:()=>{let v=L.size(l);return{outputs:[{dims:l,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:[{type:12,data:v},...ee(d,c)]}},getShaderSource:f}},su=(e,t)=>{Qo(e.inputs,t.perm),e.compute(at(e.inputs[0],t.perm))},ru=e=>xe({perm:e.perm})}),au,ou,uu,lu,du,cu,pu,hu,fu,mu,ht,gu,_u,yu,wu,$u,bu,vu,xu,Eu,ku,Tg=$(()=>{"use strict";re(),le(),de(),Qs(),Mt(),au={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate * candidate",logSumExp:"bestValue + exp(candidate)",l1:"bestValue + abs(candidate)",l2:"bestValue + candidate * candidate",logSum:"bestValue + candidate"},ou={max:"select(bestValue, candidate, candidate > bestValue)",min:"select(bestValue, candidate, candidate < bestValue)",mean:"bestValue + candidate",sum:"bestValue + candidate",prod:"bestValue * candidate",sumSquare:"bestValue + candidate",logSumExp:"bestValue + candidate",l1:"bestValue + candidate",l2:"bestValue + candidate",logSum:"bestValue + candidate"},uu={max:"_A[offset]",min:"_A[offset]",mean:"0",sum:"0",prod:"1",sumSquare:"0",logSumExp:"0",l1:"0",l2:"0",logSum:"0"},lu={max:"bestValue",min:"bestValue",sum:"bestValue",prod:"bestValue",sumSquare:"bestValue",logSumExp:"log(bestValue)",l1:"bestValue",l2:"sqrt(bestValue)",logSum:"log(bestValue)"},du=(e,t)=>{let n=[];for(let a=t-e;a<t;++a)n.push(a);return n},cu=(e,t)=>{let n=[],a=e.length;for(let l=0;l<a;l++)t.indexOf(l)===-1&&n.push(e[l]);let o=t.map(l=>e[l]);return[n,o]},pu=(e,t)=>{let n=e.length+t.length,a=[],o=0;for(let l=0;l<n;l++)t.indexOf(l)===-1?a.push(e[o++]):a.push(1);return a},hu=(e,t)=>{for(let n=0;n<e.length;++n)if(e[e.length-n-1]!==t-1-n)return!1;return!0},fu=(e,t)=>{let n=[];if(!hu(e,t)){for(let a=0;a<t;++a)e.indexOf(a)===-1&&n.push(a);e.forEach(a=>n.push(a))}return n},mu=(e,t,n,a,o,l,d)=>{let c=n[0].dims,h=L.size(l),f=L.size(d),g=U("_A",n[0].dataType,c),_=H("output",o,l),w=64;h===1&&(w=256);let x=`
          var<workgroup> aBestValues : array<f32, ${w}>;
       `,v=S=>`
        ${S.registerUniform("reduceSize","u32").declareVariables(g,_)}
        ${x}
        fn DIV_CEIL(a : u32, b : u32) -> u32 {
          return ((a - 1u) / b + 1u);
         }
         ${S.mainStart(w)}

          let outputIndex = global_idx / ${w};
          let offset = outputIndex * uniforms.reduceSize;

          var bestValue = f32(${uu[a]});
          let Length = uniforms.reduceSize;
          for (var k = local_idx; k < Length; k = k + ${w}) {
           let candidate = f32(${g.getByOffset("offset + k")});
           bestValue = ${au[a]};
          }
          aBestValues[local_idx] = bestValue;
          workgroupBarrier();

         var reduceSize = min(Length, ${w}u);
         for (var currentSize = reduceSize / 2u; reduceSize > 1u;
             currentSize = reduceSize / 2u) {
           let interval = DIV_CEIL(reduceSize, 2u);
           if (local_idx < currentSize) {
            let candidate = aBestValues[local_idx + interval];
            bestValue = ${ou[a]};
            aBestValues[local_idx] = bestValue;
           }
           reduceSize = interval;
           workgroupBarrier();
         }

         if (local_idx == 0u) {
          ${_.setByOffset("outputIndex",`${a==="mean"?`${_.type.storage}(bestValue / f32(uniforms.reduceSize))`:`${_.type.storage}(${lu[a]})`}`)};
         }
        }`;return{name:e,shaderCache:{hint:`${t};${w}`,inputDependencies:["type"]},getShaderSource:v,getRunData:()=>({outputs:[{dims:l,dataType:o}],dispatchGroup:{x:h},programUniforms:[{type:12,data:f}]})}},ht=(e,t,n,a)=>{let o=e.inputs.length===1?n:Js(e.inputs,n),l=o.axes;l.length===0&&!o.noopWithEmptyAxes&&(l=e.inputs[0].dims.map((x,v)=>v));let d=L.normalizeAxes(l,e.inputs[0].dims.length),c=d,h=e.inputs[0],f=fu(c,e.inputs[0].dims.length);f.length>0&&(h=e.compute(at(e.inputs[0],f),{inputs:[0],outputs:[-1]})[0],c=du(c.length,h.dims.length));let[g,_]=cu(h.dims,c),w=g;o.keepDims&&(w=pu(g,d)),e.compute(mu(t,o.cacheKey,[h],a,e.inputs[0].dataType,w,_),{inputs:[h]})},gu=(e,t)=>{ht(e,"ReduceMeanShared",t,"mean")},_u=(e,t)=>{ht(e,"ReduceL1Shared",t,"l1")},yu=(e,t)=>{ht(e,"ReduceL2Shared",t,"l2")},wu=(e,t)=>{ht(e,"ReduceLogSumExpShared",t,"logSumExp")},$u=(e,t)=>{ht(e,"ReduceMaxShared",t,"max")},bu=(e,t)=>{ht(e,"ReduceMinShared",t,"min")},vu=(e,t)=>{ht(e,"ReduceProdShared",t,"prod")},xu=(e,t)=>{ht(e,"ReduceSumShared",t,"sum")},Eu=(e,t)=>{ht(e,"ReduceSumSquareShared",t,"sumSquare")},ku=(e,t)=>{ht(e,"ReduceLogSumShared",t,"logSum")}}),ft,Su,vi,Js,mt,Iu,Tu,Au,zu,Cu,Ou,Mu,Pu,Ru,Du,gt,Bu,Lu,Nu,Uu,Fu,Wu,Vu,ju,qu,Gu,Qs=$(()=>{"use strict";re(),le(),Oe(),de(),Tg(),ft=e=>{if(!e||e.length===0||e.length>2)throw new Error("Reduce op requires 1 or 2 inputs.");if(e.length===2&&e[1].dims.length!==1)throw new Error("Invalid axes input dims.")},Su=e=>["","",`var value = ${e.getByIndices("input_indices")};`,""],vi=(e,t,n,a,o,l,d=!1,c=!1)=>{let h=[],f=n[0].dims,g=f.length,_=L.normalizeAxes(o,g),w=!c&&_.length===0;f.forEach((S,T)=>{w||_.indexOf(T)>=0?d&&h.push(1):h.push(S)});let x=h.length,v=L.size(h);return{name:e,shaderCache:t,getShaderSource:S=>{let T=[],k=U("_A",n[0].dataType,g),E=H("output",l,x),A=a(k,E,_),z=A[2];for(let C=0,M=0;C<g;C++)w||_.indexOf(C)>=0?(d&&M++,z=`for(var j${C}: u32 = 0; j${C} < ${f[C]}; j${C}++) {
                  ${A[2].includes("last_index")?`let last_index = j${C};`:""}
                  ${k.indicesSet("input_indices",C,`j${C}`)}
                  ${z}
                }`):(T.push(`${k.indicesSet("input_indices",C,E.indicesGet("output_indices",M))};`),M++);return`

        ${S.registerUniform("output_size","u32").declareVariables(k,E)}

        ${S.mainStart()}
          ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          var input_indices: ${k.type.indices};
          let output_indices = ${E.offsetToIndices("global_idx")};

          ${T.join(`
`)}
          ${A[0]}       // init ops for reduce max/min
          ${A[1]}
          ${z}
          ${A[3]}
          ${A.length===4?E.setByOffset("global_idx","value"):A.slice(4).join(`
`)}
        }`},getRunData:()=>({outputs:[{dims:h,dataType:l}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:[{type:12,data:v},...ee(f,h)]})}},Js=(e,t)=>{let n=[];return e[1].dims[0]>0&&e[1].getBigInt64Array().forEach(a=>n.push(Number(a))),xe({axes:n,keepDims:t.keepDims,noopWithEmptyAxes:t.noopWithEmptyAxes})},mt=(e,t,n,a)=>{let o=e.inputs,l=o.length===1?n:Js(o,n);e.compute(vi(t,{hint:l.cacheKey,inputDependencies:["rank"]},[o[0]],l.noopWithEmptyAxes&&l.axes.length===0?Su:a,l.axes,o[0].dataType,l.keepDims,l.noopWithEmptyAxes),{inputs:[0]})},Iu=(e,t)=>{ft(e.inputs),mt(e,"ReduceLogSum",t,(n,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${n.getByIndices("input_indices")};`,"value = log(value);"])},Tu=(e,t)=>{ft(e.inputs),mt(e,"ReduceL1",t,(n,a)=>[`var value = ${a.type.storage}(0);`,"",`value += abs(${n.getByIndices("input_indices")});`,""])},Au=(e,t)=>{ft(e.inputs),mt(e,"ReduceL2",t,(n,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${n.getByIndices("input_indices")}; value += (t * t);`,"value = sqrt(value);"])},zu=(e,t)=>{ft(e.inputs),mt(e,"ReduceLogSumExp",t,(n,a)=>[`var value = ${a.type.storage}(0);`,"",`value += exp(${n.getByIndices("input_indices")});`,"value = log(value);"])},Cu=(e,t)=>{ft(e.inputs),mt(e,"ReduceMax",t,(n,a,o)=>{let l=[];for(let d=0;d<n.rank;d++)(o.indexOf(d)>=0||o.length===0)&&l.push(n.indicesSet("input_indices",d,0));return[`${l.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};`,`value = max(value, ${n.getByIndices("input_indices")});`,""]})},Ou=(e,t)=>{ft(e.inputs),mt(e,"ReduceMean",t,(n,a,o)=>{let l=1;for(let d=0;d<n.rank;d++)(o.indexOf(d)>=0||o.length===0)&&(l*=e.inputs[0].dims[d]);return["var sum = f32(0);","",`sum += f32(${n.getByIndices("input_indices")});`,`let value = ${a.type.value}(sum / ${l});`]})},Mu=(e,t)=>{ft(e.inputs),mt(e,"ReduceMin",t,(n,a,o)=>{let l=[];for(let d=0;d<n.rank;d++)(o.indexOf(d)>=0||o.length===0)&&l.push(`input_indices[${d}] = 0;`);return[`${l.join(`
`)}`,`var value = ${n.getByIndices("input_indices")};`,`value = min(value, ${n.getByIndices("input_indices")});`,""]})},Pu=(e,t)=>{ft(e.inputs),mt(e,"ReduceProd",t,(n,a)=>[`var value = ${a.type.storage}(1);`,"",`value *= ${n.getByIndices("input_indices")};`,""])},Ru=(e,t)=>{ft(e.inputs),mt(e,"ReduceSum",t,(n,a)=>[`var value = ${a.type.storage}(0);`,"",`value += ${n.getByIndices("input_indices")};`,""])},Du=(e,t)=>{ft(e.inputs),mt(e,"ReduceSumSquare",t,(n,a)=>[`var t = ${a.type.value}(0); var value = ${a.type.value}(0);`,"",`t = ${n.getByIndices("input_indices")}; value += t * t;`,""])},gt=(e,t,n)=>{if(t.length===0)return n;let a=1,o=1;for(let l=0;l<t.length;l++)t.indexOf(l)===-1?a*=e[l]:o*=e[l];return o<32&&a>1024},Bu=(e,t)=>{gt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ou(e,t):gu(e,t)},Lu=(e,t)=>{gt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Tu(e,t):_u(e,t)},Nu=(e,t)=>{gt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Au(e,t):yu(e,t)},Uu=(e,t)=>{gt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?zu(e,t):wu(e,t)},Fu=(e,t)=>{gt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Cu(e,t):$u(e,t)},Wu=(e,t)=>{gt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Mu(e,t):bu(e,t)},Vu=(e,t)=>{gt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Pu(e,t):vu(e,t)},ju=(e,t)=>{gt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Ru(e,t):xu(e,t)},qu=(e,t)=>{gt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Du(e,t):Eu(e,t)},Gu=(e,t)=>{gt(e.inputs[0].dims,t.axes,t.noopWithEmptyAxes)?Iu(e,t):ku(e,t)}}),er,Hu,Ku,tr,Ag=$(()=>{"use strict";re(),Oe(),Qs(),er=e=>{if(!e||e.length===0||e.length>2)throw new Error("ArgMinMaxOp op requires 1 or 2 inputs.");if(e[0].dataType!==1)throw new Error("Invalid input type.")},Hu=(e,t)=>{er(e.inputs);let n=(a,o,l)=>{let d=[];for(let c=0;c<a.rank;c++)(l.indexOf(c)>=0||l.length===0)&&d.push(`input_indices[${c}] = 0;`);return[`${d.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?"<=":"<"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",o.setByOffset("global_idx","best_index")]};e.compute(vi("ArgMin",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],n,[t.axis],7,t.keepDims),{inputs:[0]})},Ku=(e,t)=>{er(e.inputs);let n=(a,o,l)=>{let d=[];for(let c=0;c<a.rank;c++)(l.indexOf(c)>=0||l.length===0)&&d.push(`input_indices[${c}] = 0;`);return[`${d.join(`
`)}`,`var value = ${a.getByIndices("input_indices")};
var best_index : i32 = 0;`,`if (${a.getByIndices("input_indices")} ${t.selectLastIndex>0?">=":">"} value) {
         value = ${a.getByIndices("input_indices")};
         best_index = i32(last_index);
       }`,"",o.setByOffset("global_idx","best_index")]};e.compute(vi("argMax",{hint:t.cacheKey,inputDependencies:["rank"]},[e.inputs[0]],n,[t.axis],7,t.keepDims),{inputs:[0]})},tr=e=>xe(e)}),Zu,xi,Xu,Yu,Ju,Rn,Qu,el,nr=$(()=>{"use strict";re(),le(),qs(),de(),Zu=(e,t)=>{let n=e[0],a=e[1],o=e[2],l=e[3],d=e[4],c=e[5];if(d&&c)throw new Error("Attention cannot have both past and attention_bias");if(n.dims.length!==3)throw new Error('Input "input" must have 3 dimensions');let h=n.dims[0],f=n.dims[1],g=n.dims[2];if(o.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimensions');if(a.dims.length!==2)throw new Error('Input "weights" is expected to have 2 dimensions');if(a.dims[0]!==g)throw new Error("Input 1 dimension 0 should have same length as dimension 2 of input 0");if(o.dims[0]!==a.dims[1])throw new Error('Input "bias" dimension 0 should have same length as dimension 1 of input "weights"');let _=o.dims[0]/3,w=_,x=w;if(t.qkvHiddenSizes.length>0){if(t.qkvHiddenSizes.length!==3)throw new Error("qkv_hidden_sizes attribute should have 3 elements");for(let A of t.qkvHiddenSizes)if(A%t.numHeads!==0)throw new Error("qkv_hidden_sizes should be divisible by num_heads");_=t.qkvHiddenSizes[0],w=t.qkvHiddenSizes[1],x=t.qkvHiddenSizes[2]}let v=f;if(_!==w)throw new Error("qkv_hidden_sizes first element should be same as the second");if(o.dims[0]!==_+w+x)throw new Error('Input "bias" dimension 0 should have same length as sum of Q/K/V hidden sizes');let S=0;if(d){if(w!==x)throw new Error('Input "past" expect k_hidden_size == v_hidden_size');if(d.dims.length!==5)throw new Error('Input "past" must have 5 dimensions');if(d.dims[0]!==2)throw new Error('Input "past" first dimension must be 2');if(d.dims[1]!==h)throw new Error('Input "past" second dimension must be batch_size');if(d.dims[2]!==t.numHeads)throw new Error('Input "past" third dimension must be num_heads');if(d.dims[4]!==w/t.numHeads)throw new Error('Input "past" fifth dimension must be k_hidden_size / num_heads');t.pastPresentShareBuffer||(S=d.dims[3])}let T=v+S,k=-1,E=0;if(l)throw new Error("Mask not supported");if(d)throw new Error("past is not supported");if(c){if(c.dims.length!==4)throw new Error('Input "attention_bias" must have 4 dimensions');if(c.dims[0]!==h||c.dims[1]!==t.numHeads||c.dims[2]!==f||c.dims[3]!==T)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:h,sequenceLength:f,pastSequenceLength:S,kvSequenceLength:v,totalSequenceLength:T,maxSequenceLength:k,inputHiddenSize:g,hiddenSize:_,vHiddenSize:x,headSize:Math.floor(_/t.numHeads),vHeadSize:Math.floor(x/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:E,scale:t.scale,broadcastResPosBias:!1,passPastInKv:!1,qkvFormat:1}},xi=(e,t,n)=>t&&e?`
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
    `,Xu=(e,t,n,a,o,l,d,c)=>{let h=Me(d?1:l),f=64,g=l/h;g<f&&(f=32);let _=Math.ceil(l/h/f),w=[{type:12,data:t},{type:12,data:n},{type:12,data:a},{type:12,data:o},{type:12,data:g},{type:12,data:_}],x=Ue(e.dataType,h),v=Fe(1,h),S=["type"];d&&S.push("type"),c&&S.push("type");let T=k=>{let E=H("x",e.dataType,e.dims,h),A=[E],z=d?U("seq_lens",d.dataType,d.dims):void 0;z&&A.push(z);let C=c?U("total_sequence_length_input",c.dataType,c.dims):void 0;C&&A.push(C);let M=Fe(e.dataType),D=[{name:"batch_size",type:"u32"},{name:"num_heads",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"sequence_length",type:"u32"},{name:"total_sequence_length",type:"u32"},{name:"elements_per_thread",type:"u32"}];return`
  var<workgroup> thread_max: array<f32, ${f}>;
  var<workgroup> thread_sum: array<f32, ${f}>;
  ${k.registerUniforms(D).declareVariables(...A)}
  ${k.mainStart([f,1,1])}
    let batchIdx = workgroup_id.z / uniforms.num_heads;
    let headIdx = workgroup_id.z % uniforms.num_heads;
    let sequence_length = uniforms.sequence_length;
    var total_sequence_length = uniforms.total_sequence_length;
    ${xi(z,C,!1)}
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
        x[offset + i] = ${E.type.value}(${M}(1.0) / ${M}(seq_causal_length));
      }
    } else {
      for (var i: u32 = 0; i < uniforms.elements_per_thread && i + local_offset < seq_causal_length; i++) {
        var f32input = ${v}(x[offset + i]);
        x[offset + i] = ${E.type.value}(exp(f32input - max_value) / sum);
      }
    }
      ${d?`
        for (var total_seq_id: u32 = seq_causal_length; total_seq_id + local_offset < uniforms.total_sequence_length; total_seq_id++) {
          x[offset + total_seq_id] = ${E.type.value}(${M}(0));
        }`:""};
  }`};return{name:"AttentionProbsSoftmax",shaderCache:{hint:`${f};${x};${h}`,inputDependencies:S},getShaderSource:T,getRunData:()=>({outputs:[],dispatchGroup:{x:1,y:o,z:t*n},programUniforms:w})}},Yu=(e,t,n,a,o,l,d,c,h)=>{let f=d+l.kvSequenceLength,g=[l.batchSize,l.numHeads,l.sequenceLength,f],_=e>1&&a,w=l.kvNumHeads?l.kvNumHeads:l.numHeads,x=_?[l.batchSize,w,f,l.headSize]:void 0,v=l.nReps?l.nReps:1,S=l.scale===0?1/Math.sqrt(l.headSize):l.scale,T=Me(l.headSize),k=l.headSize/T,E=12,A={x:Math.ceil(f/E),y:Math.ceil(l.sequenceLength/E),z:l.batchSize*l.numHeads},z=[{type:12,data:l.sequenceLength},{type:12,data:k},{type:12,data:f},{type:12,data:l.numHeads},{type:12,data:l.headSize},{type:1,data:S},{type:12,data:d},{type:12,data:l.kvSequenceLength},{type:12,data:v}],C=_&&a&&L.size(a.dims)>0,M=["type","type"];C&&M.push("type"),o&&M.push("type"),c&&M.push("type"),h&&M.push("type");let D=[{dims:g,dataType:t.dataType,gpuDataType:0}];_&&D.push({dims:x,dataType:t.dataType,gpuDataType:0});let N=W=>{let q=U("q",t.dataType,t.dims,T),ie=U("key",n.dataType,n.dims,T),K=[q,ie];if(C){let ae=U("past_key",a.dataType,a.dims,T);K.push(ae)}o&&K.push(U("attention_bias",o.dataType,o.dims));let Q=c?U("seq_lens",c.dataType,c.dims):void 0;Q&&K.push(Q);let _e=h?U("total_sequence_length_input",h.dataType,h.dims):void 0;_e&&K.push(_e);let $e=H("output",t.dataType,g),oe=[$e];_&&oe.push(H("present_key",t.dataType,x,T));let ce=Fe(1,T),ye=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"alpha",type:"f32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${E}u;

  var<workgroup> tileQ: array<${q.type.storage}, ${E*E}>;
  var<workgroup> tileK: array<${q.type.storage}, ${E*E}>;
  ${W.registerUniforms(ye).declareVariables(...K,...oe)}
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
    ${xi(Q,_e,!0)}
    let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx;
    let qOffset = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
    ${C&&_?"let pastKeyOffset = absKvHeadIdx * uniforms.past_sequence_length * uniforms.K;":""};
    let kOffset = absKvHeadIdx * uniforms.kv_sequence_length * uniforms.K;
    ${_?"let presentKeyOffset = absKvHeadIdx * uniforms.N * uniforms.K;":""}
    var value = ${ce}(0);
    for (var w: u32 = 0u; w < uniforms.K; w += TILE_SIZE) {
      if (global_id.y < uniforms.M && w + local_id.x < uniforms.K) {
        tileQ[TILE_SIZE * local_id.y + local_id.x] = q[qOffset + local_id.y * uniforms.K + w + local_id.x];
      }
      if (n + local_id.y < uniforms.N && w + local_id.x < uniforms.K) {
        var idx = TILE_SIZE * local_id.y + local_id.x;
      ${C&&_?`
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
          value += ${ce}(tileQ[TILE_SIZE * local_id.y + k] * tileK[TILE_SIZE * local_id.x + k]);
      }

      workgroupBarrier();
    }

    if (global_id.y < uniforms.M && global_id.x < total_sequence_length) {
      let headOffset = workgroup_id.z * uniforms.M * uniforms.N;
      let outputIdx = headOffset + global_id.y * uniforms.N + global_id.x;
      var sum: f32 = ${(()=>{switch(T){case 1:return"value";case 2:return"value.x + value.y";case 4:return"value.x + value.y + value.z + value.w";default:throw new Error(`Unsupported components: ${T}`)}})()};
        output[outputIdx] = ${$e.type.value} (sum * uniforms.alpha) + ${o?"attention_bias[outputIdx]":"0.0"};
    }
  }`};return{name:"AttentionProbs",shaderCache:{hint:`${T};${o!==void 0};${a!==void 0};${e}`,inputDependencies:M},getRunData:()=>({outputs:D,dispatchGroup:A,programUniforms:z}),getShaderSource:N}},Ju=(e,t,n,a,o,l,d=void 0,c=void 0)=>{let h=l+o.kvSequenceLength,f=o.nReps?o.nReps:1,g=o.vHiddenSize*f,_=e>1&&a,w=o.kvNumHeads?o.kvNumHeads:o.numHeads,x=_?[o.batchSize,w,h,o.headSize]:void 0,v=[o.batchSize,o.sequenceLength,g],S=12,T={x:Math.ceil(o.vHeadSize/S),y:Math.ceil(o.sequenceLength/S),z:o.batchSize*o.numHeads},k=[{type:12,data:o.sequenceLength},{type:12,data:h},{type:12,data:o.vHeadSize},{type:12,data:o.numHeads},{type:12,data:o.headSize},{type:12,data:g},{type:12,data:l},{type:12,data:o.kvSequenceLength},{type:12,data:f}],E=_&&a&&L.size(a.dims)>0,A=["type","type"];E&&A.push("type"),d&&A.push("type"),c&&A.push("type");let z=[{dims:v,dataType:t.dataType,gpuDataType:0}];_&&z.push({dims:x,dataType:t.dataType,gpuDataType:0});let C=M=>{let D=U("probs",t.dataType,t.dims),N=U("v",n.dataType,n.dims),W=[D,N];E&&W.push(U("past_value",a.dataType,a.dims));let q=d?U("seq_lens",d.dataType,d.dims):void 0;d&&W.push(q);let ie=c?U("total_sequence_length_input",c.dataType,c.dims):void 0;c&&W.push(ie);let K=[H("output",t.dataType,v)];_&&K.push(H("present_value",t.dataType,x));let Q=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"v_hidden_size",type:"u32"},{name:"past_sequence_length",type:"u32"},{name:"kv_sequence_length",type:"u32"},{name:"n_reps",type:"u32"}];return`
  const TILE_SIZE = ${S}u;
  var<workgroup> tileQ: array<${D.type.value}, ${S*S}>;
  var<workgroup> tileV: array<${D.type.value}, ${S*S}>;
  ${M.registerUniforms(Q).declareVariables(...W,...K)}
  ${M.mainStart([S,S,1])}
   let headIdx = workgroup_id.z % uniforms.num_heads;
   let batchIdx = workgroup_id.z / uniforms.num_heads;
   let kvHeadIdx = ${f===1?"headIdx":"headIdx / uniforms.n_reps"};
   let kv_num_heads = ${f===1?"uniforms.num_heads":"uniforms.num_heads / uniforms.n_reps"};
   let m = global_id.y;
   let n = global_id.x;
   let sequence_length = uniforms.M;
   var total_sequence_length = uniforms.K;
   ${xi(q,ie,!0)}
   let offsetA = workgroup_id.z * uniforms.M * uniforms.K + m * uniforms.K;
   let absKvHeadIdx = batchIdx * kv_num_heads + kvHeadIdx; // kvHeadIdx is relative to the batch
   ${E&&_?"let pastValueOffset = absKvHeadIdx * uniforms.N * uniforms.past_sequence_length + n;":""};
   let vOffset = absKvHeadIdx * uniforms.N * uniforms.kv_sequence_length + n;
   ${_?"let presentValueOffset = absKvHeadIdx * uniforms.N * uniforms.K + n;":""}
   var value = ${D.type.storage}(0);
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
  }`};return{name:"AttentionScore",shaderCache:{hint:`${a!==void 0};${e}`,inputDependencies:A},getRunData:()=>({outputs:z,dispatchGroup:T,programUniforms:k}),getShaderSource:C}},Rn=(e,t,n,a,o,l,d,c,h,f,g=void 0,_=void 0)=>{let w=Math.min(e.outputCount,1+(d?1:0)+(c?1:0)),x=w>1?d:void 0,v=w>1?c:void 0,S=w>1?f.pastSequenceLength:0,T=S+f.kvSequenceLength,k=h&&L.size(h.dims)>0?h:void 0,E=[t,n];x&&L.size(x.dims)>0&&E.push(x),k&&E.push(k),g&&E.push(g),_&&E.push(_);let A=e.compute(Yu(w,t,n,x,k,f,S,g,_),{inputs:E,outputs:w>1?[-1,1]:[-1]})[0];e.compute(Xu(A,f.batchSize,f.numHeads,S,f.sequenceLength,T,g,_),{inputs:g&&_?[A,g,_]:[A],outputs:[]});let z=[A,a];v&&L.size(v.dims)>0&&z.push(v),g&&z.push(g),_&&z.push(_),e.compute(Ju(w,A,a,v,f,S,g,_),{inputs:z,outputs:w>1?[0,2]:[0]})},Qu=(e,t)=>{let n=[t.batchSize,t.numHeads,t.sequenceLength,t.headSize],a=t.sequenceLength,o=t.inputHiddenSize,l=t.headSize,d=12,c={x:Math.ceil(t.headSize/d),y:Math.ceil(t.sequenceLength/d),z:t.batchSize*t.numHeads},h=[e.inputs[0],e.inputs[1],e.inputs[2]],f=[{type:12,data:a},{type:12,data:o},{type:12,data:l},{type:12,data:t.numHeads},{type:12,data:t.headSize},{type:12,data:t.hiddenSize},{type:12,data:t.hiddenSize+t.hiddenSize+t.vHiddenSize}],g=_=>{let w=H("output_q",h[0].dataType,n),x=H("output_k",h[0].dataType,n),v=H("output_v",h[0].dataType,n),S=U("input",h[0].dataType,h[0].dims),T=U("weight",h[1].dataType,h[1].dims),k=U("bias",h[2].dataType,h[2].dims),E=S.type.storage,A=[{name:"M",type:"u32"},{name:"K",type:"u32"},{name:"N",type:"u32"},{name:"num_heads",type:"u32"},{name:"head_size",type:"u32"},{name:"hidden_size",type:"u32"},{name:"ldb",type:"u32"}];return`
  const TILE_SIZE = ${d}u;
  var<workgroup> tileInput: array<${E}, ${d*d}>;
  var<workgroup> tileWeightQ: array<${E}, ${d*d}>;
  var<workgroup> tileWeightK: array<${E}, ${d*d}>;
  var<workgroup> tileWeightV: array<${E}, ${d*d}>;
  ${_.registerUniforms(A).declareVariables(S,T,k,w,x,v)}
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
  }`};return e.compute({name:"AttentionPrepare",shaderCache:{inputDependencies:["type","type","type"]},getRunData:()=>({outputs:[{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0},{dims:n,dataType:e.inputs[0].dataType,gpuDataType:0}],dispatchGroup:c,programUniforms:f}),getShaderSource:g},{inputs:h,outputs:[-1,-1,-1]})},el=(e,t)=>{let n=Zu(e.inputs,t),[a,o,l]=Qu(e,n);return Rn(e,a,o,l,e.inputs[4],void 0,void 0,void 0,e.inputs[5],n)}}),tl,nl,il,sl,zg=$(()=>{"use strict";st(),re(),le(),Oe(),de(),tl=(e,t)=>{if(!e||e.length!==5)throw new Error("BatchNormalization requires 5 inputs");let n=(a,o,l)=>{let d=o.length;if(d!==a.length)throw new Error(`${l}: num dimensions != ${d}`);o.forEach((c,h)=>{if(c!==a[h])throw new Error(`${l}: dim[${h}] do not match`)})};if(e[0].dims.length>1){let a=t.format==="NHWC"?t.spatial?e[0].dims.slice(-1):e[0].dims.slice(-1).concat(e[0].dims.slice(1,e[0].dims.length-1)):e[0].dims.slice(1,t.spatial?2:void 0);n(e[1].dims,a,"Invalid input scale"),n(e[2].dims,a,"Invalid input B"),n(e[3].dims,a,"Invalid input mean"),n(e[4].dims,a,"Invalid input var")}else n(e[1].dims,[1],"Invalid input scale"),n(e[2].dims,[1],"Invalid input B"),n(e[3].dims,[1],"Invalid input mean"),n(e[4].dims,[1],"Invalid input var")},nl=(e,t)=>{let{epsilon:n,spatial:a,format:o}=t,l=e[0].dims,d=a?Me(l[l.length-1]):1,c=o==="NHWC"&&l.length>1?d:1,h=L.size(l)/d,f=a,g=f?l.length:l,_=U("x",e[0].dataType,e[0].dims,d),w=U("scale",e[1].dataType,e[1].dims,c),x=U("bias",e[2].dataType,e[2].dims,c),v=U("inputMean",e[3].dataType,e[3].dims,c),S=U("inputVar",e[4].dataType,e[4].dims,c),T=H("y",e[0].dataType,g,d),k=()=>{let A="";if(a)A=`let cOffset = ${l.length===1?"0u":o==="NHWC"?`outputIndices[${l.length-1}] / ${d}`:"outputIndices[1]"};`;else if(o==="NCHW")A=`
            ${T.indicesSet("outputIndices","0","0")}
            let cOffset = ${T.indicesToOffset("outputIndices")};`;else{A=`var cIndices = ${w.type.indices}(0);
                       cIndices[0] = outputIndices[${l.length-1}];`;for(let z=1;z<w.rank;z++)A+=`cIndices[${z}] = outputIndices[${z}];`;A+=`let cOffset = ${w.indicesToOffset("cIndices")};`}return A},E=A=>`
  const epsilon = ${n};
  ${A.registerUniform("outputSize","u32").declareVariables(_,w,x,v,S,T)}
  ${A.mainStart()}
  ${A.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
    var outputIndices = ${T.offsetToIndices(`global_idx * ${d}`)};
    ${k()}
    let scale = ${w.getByOffset("cOffset")};
    let bias = ${x.getByOffset("cOffset")};
    let inputMean = ${v.getByOffset("cOffset")};
    let inputVar = ${S.getByOffset("cOffset")};
    let x = ${_.getByOffset("global_idx")};
    let value = (x - inputMean) * inverseSqrt(inputVar + epsilon) * scale + bias;
    ${T.setByOffset("global_idx","value")}
  }`;return{name:"BatchNormalization",shaderCache:{hint:`${t.epsilon}_${t.format}_${a}_${d}`,inputDependencies:f?["rank","type","type","type","type"]:void 0},getShaderSource:E,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:f?[{type:12,data:h},...ee(l)]:[{type:12,data:h}]})}},il=e=>xe(e),sl=(e,t)=>{let{inputs:n,outputCount:a}=e,o=il({...t,outputCount:a});if(ke.webgpu.validateInputContent&&tl(n,o),t.trainingMode)throw new Error("BatchNormalization trainingMode is not supported yet.");e.compute(nl(n,o))}}),rl,al,ol,Cg=$(()=>{"use strict";le(),de(),rl=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![320,640,1280].includes(e[0].dims[2]))throw new Error("number of channels should be 320, 640 or 1280");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},al=e=>{let t=e[0].dims,n=e[0].dims[2],a=L.size(t)/4,o=e[0].dataType,l=U("input",o,t,4),d=U("bias",o,[n],4),c=U("residual",o,t,4),h=H("output",o,t,4);return{name:"BiasAdd",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(a/64)}}),getShaderSource:f=>`
  const channels = ${n}u / 4;
  ${f.declareVariables(l,d,c,h)}

  ${f.mainStart()}
    ${f.guardAgainstOutOfBoundsWorkgroupSizes(a)}
    let value = ${l.getByOffset("global_idx")}
      + ${d.getByOffset("global_idx % channels")} + ${c.getByOffset("global_idx")};
    ${h.setByOffset("global_idx","value")}
  }`}},ol=e=>{rl(e.inputs),e.compute(al(e.inputs))}}),ul,ve,ll,dl,cl,pl,hl,fl,ml,gl,_l,yl,wl,$l,bl,vl,Dn,xl,Ei,El,kl,Sl,Il,Tl,Al,zl,Cl,Ol,Ml,Pl,Rl,Dl,Bl,Ll,Nl,Ul,ir,Fl,sr,rr,Wl,Vl,jl,ql,Gl,Hl,ar=$(()=>{"use strict";re(),le(),Oe(),de(),ul=(e,t,n,a,o,l,d)=>{let c=Math.ceil(t/4),h="";typeof o=="string"?h=`${o}(a)`:h=o("a");let f=U("inputData",n,[c],4),g=H("outputData",a,[c],4),_=[{name:"vec_size",type:"u32"}];return d&&_.push(...d),`
      ${e.registerUniforms(_).declareVariables(f,g)}

  ${l??""}

  ${e.mainStart()}
    ${e.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}

    let a = ${f.getByOffset("global_idx")};
    ${g.setByOffset("global_idx",h)}
  }`},ve=(e,t,n,a,o,l=e.dataType,d,c)=>{let h=[{type:12,data:Math.ceil(L.size(e.dims)/4)}];return d&&h.push(...d),{name:t,shaderCache:{hint:o,inputDependencies:["type"]},getShaderSource:f=>ul(f,L.size(e.dims),e.dataType,l,n,a,c),getRunData:f=>({outputs:[{dims:e.dims,dataType:l}],dispatchGroup:{x:Math.ceil(L.size(f[0].dims)/64/4)},programUniforms:h})}},ll=e=>{e.compute(ve(e.inputs[0],"Abs","abs"))},dl=e=>{e.compute(ve(e.inputs[0],"Acos","acos"))},cl=e=>{e.compute(ve(e.inputs[0],"Acosh","acosh"))},pl=e=>{e.compute(ve(e.inputs[0],"Asin","asin"))},hl=e=>{e.compute(ve(e.inputs[0],"Asinh","asinh"))},fl=e=>{e.compute(ve(e.inputs[0],"Atan","atan"))},ml=e=>{e.compute(ve(e.inputs[0],"Atanh","atanh"))},gl=e=>xe(e),_l=(e,t)=>{let n;switch(t.to){case 10:n="vec4<f16>";break;case 1:n="vec4<f32>";break;case 12:n="vec4<u32>";break;case 6:n="vec4<i32>";break;case 9:n="vec4<bool>";break;default:throw new RangeError(`not supported type (specified in attribute 'to' from 'Cast' operator): ${t.to}`)}e.compute(ve(e.inputs[0],"Cast",n,void 0,t.cacheKey,t.to))},yl=e=>{let t,n,a=e.length>=2&&e[1].data!==0,o=e.length>=3&&e[2].data!==0;switch(e[0].dataType){case 1:t=a?e[1].getFloat32Array()[0]:-34028234663852886e22,n=o?e[2].getFloat32Array()[0]:34028234663852886e22;break;case 10:t=a?e[1].getUint16Array()[0]:64511,n=o?e[2].getUint16Array()[0]:31743;break;default:throw new Error("Unsupport data type")}return xe({min:t,max:n})},wl=(e,t)=>{let n=t||yl(e.inputs),a=Fe(e.inputs[0].dataType);e.compute(ve(e.inputs[0],"Clip",o=>`clamp(${o}, vec4<${a}>(uniforms.min), vec4<${a}>(uniforms.max))`,void 0,n.cacheKey,void 0,[{type:e.inputs[0].dataType,data:n.min},{type:e.inputs[0].dataType,data:n.max}],[{name:"min",type:a},{name:"max",type:a}]),{inputs:[0]})},$l=e=>{e.compute(ve(e.inputs[0],"Ceil","ceil"))},bl=e=>{e.compute(ve(e.inputs[0],"Cos","cos"))},vl=e=>{e.compute(ve(e.inputs[0],"Cosh","cosh"))},Dn=e=>xe(e),xl=(e,t)=>{let n=Fe(e.inputs[0].dataType);e.compute(ve(e.inputs[0],"Elu",a=>`elu_vf32(${a})`,`
  const elu_alpha_ = ${n}(${t.alpha});

  fn elu_f32(a: ${n}) -> ${n} {
  return select((exp(a) - 1.0) * elu_alpha_, a, a >= 0.0);
  }

  fn elu_vf32(v: vec4<${n}>) -> vec4<${n}> {
  return vec4(elu_f32(v.x), elu_f32(v.y), elu_f32(v.z), elu_f32(v.w));
  }`,t.cacheKey))},Ei=(e="f32")=>`
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
}`,El=e=>{let t=Fe(e.inputs[0].dataType);e.compute(ve(e.inputs[0],"Erf",n=>`erf_vf32(${n})`,Ei(t)))},kl=e=>{e.compute(ve(e.inputs[0],"Exp","exp"))},Sl=e=>{e.compute(ve(e.inputs[0],"Floor","floor"))},Il=e=>{let t=Fe(e.inputs[0].dataType);e.compute(ve(e.inputs[0],"Gelu",n=>`0.5 * ${n} * (1.0 + erf_vf32(${n} * 0.7071067811865475))`,Ei(t)))},Tl=(e,t)=>{let n=Fe(e.inputs[0].dataType);e.compute(ve(e.inputs[0],"LeakyRelu",a=>`select(leaky_relu_alpha_ * ${a}, ${a}, ${a} >= vec4<${n}>(0.0))`,`const leaky_relu_alpha_ = ${n}(${t.alpha});`,t.cacheKey))},Al=e=>{e.compute(ve(e.inputs[0],"Not",t=>`!${t}`))},zl=e=>{e.compute(ve(e.inputs[0],"Neg",t=>`-${t}`))},Cl=e=>{e.compute(ve(e.inputs[0],"Reciprocal",t=>`1.0/${t}`))},Ol=e=>{let t=Fe(e.inputs[0].dataType);e.compute(ve(e.inputs[0],"Relu",n=>`select(vec4<${t}>(0.0), ${n}, ${n} > vec4<${t}>(0.0))`))},Ml=e=>{e.compute(ve(e.inputs[0],"Sigmoid",t=>`(1.0 / (1.0 + exp(-${t})))`))},Pl=e=>xe(e),Rl=(e,t)=>{let n=Fe(e.inputs[0].dataType);e.compute(ve(e.inputs[0],"HardSigmoid",a=>`max(vec4<${n}>(0.0), min(vec4<${n}>(1.0), ${t.alpha} * ${a} + vec4<${n}>(${t.beta})))`,void 0,t.cacheKey))},Dl=e=>{let t=Fe(e.inputs[0].dataType);e.compute(ve(e.inputs[0],"HardSwish",n=>`${n} * max(vec4<${t}>(0.0), min(vec4<${t}>(1.0), vec4<${t}>(${t}(1.0 / 6.0)) * ${n} + vec4<${t}>(0.5)))`))},Bl=e=>{e.compute(ve(e.inputs[0],"Sin","sin"))},Ll=e=>{e.compute(ve(e.inputs[0],"Sinh","sinh"))},Nl=e=>{e.compute(ve(e.inputs[0],"Sqrt","sqrt"))},Ul=e=>{e.compute(ve(e.inputs[0],"Tan","tan"))},ir=e=>`sign(${e}) * (1 - exp(-2 * abs(${e}))) / (1 + exp(-2 * abs(${e})))`,Fl=e=>{e.compute(ve(e.inputs[0],"Tanh",ir))},sr=(e="f32")=>`
const fast_gelu_a: ${e} = 0.5;
const fast_gelu_b: ${e} = 0.7978845608028654;
const fast_gelu_c: ${e} = 0.035677408136300125;

fn tanh_v(v: vec4<${e}>) -> vec4<${e}> {
  return ${ir("v")};
}
`,rr=e=>`(fast_gelu_a + fast_gelu_a * tanh_v(${e} * (fast_gelu_c * ${e} * ${e} + fast_gelu_b))) * ${e}`,Wl=e=>{let t=Fe(e.inputs[0].dataType);e.compute(ve(e.inputs[0],"FastGelu",rr,sr(t),void 0,e.inputs[0].dataType))},Vl=(e,t)=>{let n=Fe(e.inputs[0].dataType);return e.compute(ve(e.inputs[0],"ThresholdedRelu",a=>`select(vec4<${n}>(0.0), ${a}, ${a} > thresholded_relu_alpha_)`,`const thresholded_relu_alpha_ = vec4<${n}>(${t.alpha});`,t.cacheKey)),0},jl=e=>{e.compute(ve(e.inputs[0],"Log","log"))},ql=(e,t)=>`
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
`,Gl=e=>`quick_gelu_impl(${e})`,Hl=(e,t)=>{let n=Fe(e.inputs[0].dataType);e.compute(ve(e.inputs[0],"QuickGelu",Gl,ql(n,t.alpha),t.cacheKey,e.inputs[0].dataType))}}),Kl,Zl,Xl,Og=$(()=>{"use strict";le(),de(),ar(),Kl=e=>{if(e[0].dims.length!==3)throw new Error("input should have 3 dimensions");if(![2560,5120,10240].includes(e[0].dims[2]))throw new Error("hidden state should be 2560, 5120 or 10240");if(e[1].dims.length!==1)throw new Error("bias is expected to have 1 dimensions");if(e[0].dims[2]!==e[1].dims[0])throw new Error("last dimension of input and bias are not the same")},Zl=e=>{let t=e[0].dims.slice();t[2]=t[2]/2;let n=U("input",e[0].dataType,e[0].dims,4),a=U("bias",e[0].dataType,[e[0].dims[2]],4),o=H("output",e[0].dataType,t,4),l=L.size(t)/4,d=Ue(e[0].dataType);return{name:"BiasSplitGelu",getRunData:()=>({outputs:[{dims:t,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)}}),getShaderSource:c=>`
  const M_SQRT2 = sqrt(2.0);
  const halfChannels = ${e[0].dims[2]/4/2}u;

  ${c.declareVariables(n,a,o)}

  ${Ei(d)}

  ${c.mainStart()}
    ${c.guardAgainstOutOfBoundsWorkgroupSizes(l)}
    let biasIdx = global_idx % halfChannels;
    let batchIndex = global_idx / halfChannels;
    let inputOffset = biasIdx + batchIndex * halfChannels * 2;
    let valueLeft = input[inputOffset] + bias[biasIdx];
    let valueRight = input[inputOffset + halfChannels] + bias[biasIdx + halfChannels];
    let geluRight = valueRight * 0.5 * (erf_vf32(valueRight / M_SQRT2) + 1);

    ${o.setByOffset("global_idx","valueLeft * geluRight")}
  }`}},Xl=e=>{Kl(e.inputs),e.compute(Zl(e.inputs))}}),Yl,Jl,_t,Ql,ed,td,nd,id,sd,rd,ad,od,ud,Mg=$(()=>{"use strict";re(),le(),de(),Yl=(e,t,n,a,o,l,d,c,h,f,g,_)=>{let w,x;typeof c=="string"?w=x=(E,A)=>`${c}((${E}),(${A}))`:typeof c=="function"?w=x=c:(w=c.scalar,x=c.vector);let v=H("outputData",g,a.length,4),S=U("aData",h,t.length,4),T=U("bData",f,n.length,4),k;if(o)if(l){let E=L.size(t)===1,A=L.size(n)===1,z=t.length>0&&t[t.length-1]%4===0,C=n.length>0&&n[n.length-1]%4===0;E||A?k=v.setByOffset("global_idx",x(E?`${S.type.value}(${S.getByOffset("0")}.x)`:S.getByOffset("global_idx"),A?`${T.type.value}(${T.getByOffset("0")}.x)`:T.getByOffset("global_idx"))):k=`
            let outputIndices = ${v.offsetToIndices("global_idx * 4u")};
            let offsetA = ${S.broadcastedIndicesToOffset("outputIndices",v)};
            let offsetB = ${T.broadcastedIndicesToOffset("outputIndices",v)};
            ${v.setByOffset("global_idx",x(d||z?S.getByOffset("offsetA / 4u"):`${S.type.value}(${S.getByOffset("offsetA / 4u")}[offsetA % 4u])`,d||C?T.getByOffset("offsetB / 4u"):`${T.type.value}(${T.getByOffset("offsetB / 4u")}[offsetB % 4u])`))}
          `}else k=v.setByOffset("global_idx",x(S.getByOffset("global_idx"),T.getByOffset("global_idx")));else{if(!l)throw new Error("no necessary to use scalar implementation for element-wise binary op implementation.");let E=(A,z,C="")=>{let M=`aData[indexA${z}][componentA${z}]`,D=`bData[indexB${z}][componentB${z}]`;return`
            let outputIndices${z} = ${v.offsetToIndices(`global_idx * 4u + ${z}u`)};
            let offsetA${z} = ${S.broadcastedIndicesToOffset(`outputIndices${z}`,v)};
            let offsetB${z} = ${T.broadcastedIndicesToOffset(`outputIndices${z}`,v)};
            let indexA${z} = offsetA${z} / 4u;
            let indexB${z} = offsetB${z} / 4u;
            let componentA${z} = offsetA${z} % 4u;
            let componentB${z} = offsetB${z} % 4u;
            ${A}[${z}] = ${C}(${w(M,D)});
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
      }`},Jl=(e,t,n,a,o,l,d=n.dataType)=>{let c=n.dims.map(Number),h=a.dims.map(Number),f=!L.areEqual(c,h),g=c,_=L.size(c),w=!1,x=!1,v=[f];if(f){let S=gn.calcShape(c,h,!1);if(!S)throw new Error("Can't perform binary op on the given tensors");g=S.slice(),_=L.size(g);let T=L.size(c)===1,k=L.size(h)===1,E=c.length>0&&c[c.length-1]%4===0,A=h.length>0&&h[h.length-1]%4===0;v.push(T),v.push(k),v.push(E),v.push(A);let z=1;for(let C=1;C<g.length;C++){let M=c[c.length-C],D=h[h.length-C];if(M===D)z*=M;else break}z%4===0?(x=!0,w=!0):(T||k||E||A)&&(w=!0)}else w=!0;return v.push(w),{name:e,shaderCache:{hint:t+v.map(S=>S.toString()).join("_"),inputDependencies:["rank","rank"]},getShaderSource:S=>Yl(S,c,h,g,w,f,x,o,n.dataType,a.dataType,d,l),getRunData:()=>({outputs:[{dims:g,dataType:d}],dispatchGroup:{x:Math.ceil(_/64/4)},programUniforms:[{type:12,data:Math.ceil(L.size(g)/4)},...ee(c,h,g)]})}},_t=(e,t,n,a,o,l)=>{e.compute(Jl(t,o??"",e.inputs[0],e.inputs[1],n,a,l))},Ql=e=>{_t(e,"Add",(t,n)=>`${t}+${n}`)},ed=e=>{_t(e,"Div",(t,n)=>`${t}/${n}`)},td=e=>{_t(e,"Equal",{scalar:(t,n)=>`u32(${t}==${n})`,vector:(t,n)=>`vec4<u32>(${t}==${n})`},void 0,void 0,9)},nd=e=>{_t(e,"Mul",(t,n)=>`${t}*${n}`)},id=e=>{let t=U("input",e.inputs[0].dataType,e.inputs[0].dims).type.value;_t(e,"Pow",{scalar:(n,a)=>`pow_custom(${n},${a})`,vector:(n,a)=>`pow_vector_custom(${n},${a})`},`
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
      `)},sd=e=>{_t(e,"Sub",(t,n)=>`${t}-${n}`)},rd=e=>{_t(e,"Greater",{scalar:(t,n)=>`u32(${t}>${n})`,vector:(t,n)=>`vec4<u32>(${t}>${n})`},void 0,void 0,9)},ad=e=>{_t(e,"Less",{scalar:(t,n)=>`u32(${t}<${n})`,vector:(t,n)=>`vec4<u32>(${t}<${n})`},void 0,void 0,9)},od=e=>{_t(e,"GreaterOrEqual",{scalar:(t,n)=>`u32(${t}>=${n})`,vector:(t,n)=>`vec4<u32>(${t}>=${n})`},void 0,void 0,9)},ud=e=>{_t(e,"LessOrEqual",{scalar:(t,n)=>`u32(${t}<=${n})`,vector:(t,n)=>`vec4<u32>(${t}<=${n})`},void 0,void 0,9)}}),ld,dd,cd,pd,Pg=$(()=>{"use strict";re(),le(),Oe(),de(),ld=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");let n=0,a=e[n],o=a.dataType,l=a.dims.length;e.forEach((d,c)=>{if(c!==n){if(d.dataType!==o)throw new Error("input tensors should be one type");if(d.dims.length!==l)throw new Error("input tensors should have the same shape");d.dims.forEach((h,f)=>{if(f!==t&&h!==a.dims[f])throw new Error("non concat dimensions must match")})}})},dd=(e,t,n,a,o=0)=>{let l=e.reduce((k,E)=>k+L.size(E.dims),0),d=new Array(e.length),c=new Array(e.length),h=new Array(e.length),f=0,g=o,_=[],w=[],x=[{type:12,data:l}];for(let k=0;k<e.length;++k)d[k]=f,c[k]=g,f+=L.size(e[k].dims),g+=e[k].dims[t],w.push(e[k].dims.length),h[k]=U(`input${k}`,a,w[k]),_.push("rank"),x.push({type:12,data:d[k]}),x.push({type:12,data:c[k]});for(let k=0;k<e.length;++k)x.push(...ee(e[k].dims));x.push(...ee(n));let v=H("output",a,n.length),S=h.map((k,E)=>{let A=`
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
  }`;return{name:"Concat",shaderCache:{hint:`${t}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:n,dataType:a}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:x}),getShaderSource:T}},cd=(e,t)=>{let n=e.inputs,a=n[0].dims,o=L.normalizeAxis(t.axis,a.length);ld(n,o);let l=a.slice();l[o]=n.reduce((f,g)=>f+(g.dims.length>o?g.dims[o]:0),0);let d=n.filter(f=>L.size(f.dims)>0);if(d.length===0){e.output(0,l);return}let c=e.deviceLimits.maxStorageBuffersPerShaderStage-1,h=0;for(let f=0;f<d.length;f+=c){let g=d.slice(f,f+c);e.compute(dd(g,o,l,n[0].dataType,h),{inputs:g,outputs:[0]}),h+=g.reduce((_,w)=>_+w.dims[o],0)}},pd=e=>xe({axis:e.axis})}),Yt,Jt,Qt,or,en=$(()=>{"use strict";re(),le(),Yt=(e,t,n="f32")=>{switch(e.activation){case"Relu":return`value = max(value, ${t}(0.0));`;case"Sigmoid":return`value = (${t}(1.0) / (${t}(1.0) + exp(-value)));`;case"Clip":return`value = clamp(value, ${t}(${n}(uniforms.clip_min)), ${t}(${n}(uniforms.clip_max)));`;case"HardSigmoid":return`value = max(${t}(0.0), min(${t}(1.0), ${n}(uniforms.alpha) * value + ${n}(uniforms.beta)));`;case"LeakyRelu":return`value = select(${n}(uniforms.alpha) * value, value, value >= ${t}(0.0));`;case"Tanh":return`let e2x = exp(-2.0 * abs(value));
              value = sign(value) * (1.0 - e2x) / (1.0 + e2x);
        `;case"":return"";default:throw new Error(`Unsupported activation ${e.activation}`)}},Jt=(e,t)=>{e.activation==="Clip"?t.push({type:1,data:e.clipMax},{type:1,data:e.clipMin}):e.activation==="HardSigmoid"?t.push({type:1,data:e.alpha},{type:1,data:e.beta}):e.activation==="LeakyRelu"&&t.push({type:1,data:e.alpha})},Qt=(e,t)=>{e.activation==="Clip"?t.push({name:"clip_max",type:"f32"},{name:"clip_min",type:"f32"}):e.activation==="HardSigmoid"?t.push({name:"alpha",type:"f32"},{name:"beta",type:"f32"}):e.activation==="LeakyRelu"&&t.push({name:"alpha",type:"f32"})},or=e=>{let t=(e==null?void 0:e.activation)||"";if(t==="HardSigmoid"){let[n,a]=(e==null?void 0:e.activation_params)||[.2,.5];return{activation:t,alpha:n,beta:a}}else if(t==="Clip"){let[n,a]=(e==null?void 0:e.activation_params)||[Ro,Do];return{activation:t,clipMax:a,clipMin:n}}else if(t==="LeakyRelu"){let[n]=(e==null?void 0:e.activation_params)||[.01];return{activation:t,alpha:n}}return{activation:t}}}),Ve,hd,ur=$(()=>{"use strict";Ve=(e,t)=>{switch(e){case 1:return t;case 2:return`vec2<${t}>`;case 3:return`vec3<${t}>`;case 4:return`vec4<${t}>`;default:throw new Error(`${e}-component is not supported.`)}},hd=e=>`
      ${e?"value = value + getBiasByOutputCoords(coords);":""}
      `}),fd,Rg=$(()=>{"use strict";fd=e=>`
fn getIndexFromCoords4D(coords : vec4<i32>, shape : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
      shape.y * shape.z * shape.w, shape.z * shape.w, shape.w, 1));
}
fn getOutputIndexFromCoords(coords : vec4<i32>) -> i32 {
  return dot(coords, vec4<i32>(
    i32(${e}.x), i32(${e}.y), i32(${e}.z), 1));
}
`}),Bn,lr,dr=$(()=>{"use strict";re(),le(),de(),en(),Bn=(e,t,n,a,o)=>{let l=a-n;return`
      ${Array.from({length:n}).map((d,c)=>`
      if (${Y(t.shape,c,t.rank)} != 1) {
        ${t.indicesSet(e,c,Y(o,c+l,a))}
      } else {
        ${t.indicesSet(e,c,0)}
      }`).join("")}
`},lr=(e,t,n,a,o=!1,l)=>{let d=e[0].dims,c=e[1].dims,h=d[d.length-2],f=c[c.length-1],g=d[d.length-1],_=Me(f),w=Me(g),x=Me(h),v=L.size(n)/_/x,S=e.length>2,T=a?a.slice(0,-2):n.slice(0,-2),k=[L.size(T),h,f],E=[{type:12,data:v},{type:12,data:h},{type:12,data:f},{type:12,data:g}];Jt(t,E),E.push(...ee(T,d,c)),S&&E.push(...ee(e[2].dims)),E.push(...ee(k));let A=z=>{let C=Xs("batch_dims",e[0].dataType,T.length),M=U("a",e[0].dataType,d.length,w),D=U("b",e[1].dataType,c.length,_),N=H("output",e[0].dataType,k.length,_),W=Ue(N.type.tensor),q=Yt(t,N.type.value,W),ie=[M,D],K="";if(S){let $e=o?_:1;ie.push(U("bias",e[2].dataType,e[2].dims.length,$e)),K=`${o?`value += bias[col / ${$e}];`:`value += ${N.type.value}(bias[row + i]);`}`}let Q=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"}];Qt(t,Q);let _e=()=>{let $e=`var a_data: ${M.type.value};`;for(let oe=0;oe<w;oe++)$e+=`
              let b_data${oe} = b[(b_offset + (k + ${oe}) * uniforms.N + col) / ${_}];`;for(let oe=0;oe<x;oe++){$e+=`a_data = a[(a_offset + (row + ${oe}) * uniforms.K + k) / ${w}];`;for(let ce=0;ce<w;ce++)$e+=`
            values[${oe}] = fma(${D.type.value}(a_data${w===1?"":`[${ce}]`}), b_data${ce}, values[${oe}]);
`}return $e};return`
  ${z.registerUniforms(Q).registerInternalVariables(C).declareVariables(...ie,N)}
  ${z.mainStart()}
    ${z.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let col = (global_idx % (uniforms.N / ${_})) * ${_};
    var index1 = global_idx / (uniforms.N / ${_});
    let stride1 = uniforms.M / ${x};
    let row = (index1 % stride1) * ${x};
    let batch = index1 / stride1;

    ${n.length===2?"":`let batch_indices = ${C.offsetToIndices("batch")};`}

    var a_indices: ${M.type.indices};
    ${Bn("a_indices",M,M.rank-2,C.rank,"batch_indices")}
    ${M.indicesSet("a_indices",M.rank-2,0)}
    ${M.indicesSet("a_indices",M.rank-1,0)}
    let a_offset = ${M.indicesToOffset("a_indices")};

    var b_indices: ${D.type.indices};
    ${Bn("b_indices",D,D.rank-2,C.rank,"batch_indices")}
    ${D.indicesSet("b_indices",D.rank-2,0)}
    ${D.indicesSet("b_indices",D.rank-1,0)}
    let b_offset = ${D.indicesToOffset("b_indices")};
    var values: array<${N.type.value}, ${x}>;
    for (var k: u32 = 0u; k < uniforms.K; k = k + ${w}) {
      ${_e()}
    }
    for (var i = 0u; i < ${x}u; i++) {
      var value = values[i];
      ${K}
      ${q}
      let cur_indices = ${N.type.indices}(batch, row + i, col);
      let offset = ${N.indicesToOffset("cur_indices")};
      ${N.setByOffset(`offset / ${_}`,"value")};
    }
  }
  `};return{name:"MatMulNaive",shaderCache:{hint:`${t.activation};${_};${w};${x};${o}`,inputDependencies:S?["rank","rank","rank"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:l?l(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(v/64)},programUniforms:E}),getShaderSource:A}}}),md,gd,cr,pr,_d,hr,yd,ki,fr=$(()=>{"use strict";re(),le(),de(),en(),dr(),ur(),md=(e,t)=>e?`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          kStart + inputRow,
          globalRowStart / innerElementSize + inputCol${t?", batchIndices":""});
        `:`
        mm_Asub[inputRow][inputCol] = mm_readA(batch,
          globalRow + innerRow,
          kStart / innerElementSize + inputCol${t?", batchIndices":""});
        `,gd=(e,t)=>e?`
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
        }`,cr=(e,t,n="f32",a,o=!1,l=32,d=!1,c=32)=>{let h=t[1]*e[1],f=t[0]*e[0],g=o?h:l,_=o?l:h,w=g/t[0],x=l/t[1];if(!((o&&w===4&&e[1]===4||!o&&(w===3||w===4))&&g%t[0]===0&&l%t[1]===0&&e[0]===4))throw new Error(`If transposeA ${o} is true, innerElementSize ${w} and workPerThread[1] ${e[1]} must be 4.
      Otherwise, innerElementSize ${w} must be 3 or 4.
  tileAWidth ${g} must be divisible by workgroupSize[0]${t[0]}. tileInner ${l} must be divisible by workgroupSize[1] ${t[1]}. colPerThread ${e[0]} must be 4.`);return`
var<workgroup> mm_Asub: array<array<vec${w}<${n}>, ${g/w}>, ${_}>;
var<workgroup> mm_Bsub: array<array<vec4<${n}>, ${f/e[0]}>, ${l}>;

const rowPerThread = ${e[1]};
const colPerThread = ${e[0]};
const innerElementSize = ${w};
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
          ${md(o,a)}
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
          ${w===3?"":"let BCached3 = mm_Bsub[k * innerElementSize + 3][tileCol];"}

          ${gd(o,w)}
      }

      workgroupBarrier();
  }

  for (var innerRow = 0; innerRow < rowPerThread; innerRow = innerRow + 1) {
      mm_write(batch, globalRow + innerRow, globalCol, acc[innerRow]);
  }
}`},pr=(e,t)=>e?`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              kStart + inputRow,
              globalRowStart + inputCol${t?", batchIndices":""});
            `:`
            mm_Asub[inputRow][inputCol] = mm_readA(batch,
              globalRowStart + inputRow,
              kStart + inputCol${t?", batchIndices":""});
            `,_d=e=>e?"let ACached = mm_Asub[k][tileRow + innerRow];":"let ACached = mm_Asub[tileRow + innerRow][k];",hr=(e,t,n="f32",a,o=!1,l=32,d=!1,c=32,h=!1)=>{let f=e[1]*t[1],g=e[0]*t[0],_=o?f:l,w=o?l:f;if(!(w%t[1]===0&&_%t[0]===0&&l%t[1]===0))throw new Error(`tileAHight ${w} must be divisible by workgroupSize[1]${t[1]}, tileAWidth ${_} must be divisible by workgroupSize[0]${t[0]}, tileInner ${l} must be divisible by workgroupSize[1]${t[1]}`);let x=w/t[1],v=_/t[0],S=l/t[1],T=h?`
    let localRow = i32(localId.y);
    let localCol = i32(localId.x);
    let globalRowStart = i32(workgroupId.y) * ${f};
    let globalColStart = i32(workgroupId.x) * ${g};

    // Loop over shared dimension.
    for (var t = 0; t < num_tiles; t = t + 1) {
      // Load one tile of A into local memory.
      for (var inputRow = localRow; inputRow < ${w}; inputRow = inputRow + ${t[1]}) {
        for (var inputCol = localCol; inputCol < ${_}; inputCol = inputCol + ${t[0]}) {
          ${pr(o,a)}
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
          let ACached = ${o?`mm_Asub[k][localRow + innerRow * ${t[1]}];`:`mm_Asub[localRow + innerRow * ${t[1]}][k];`}
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
      ${pr(o,a)}
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
      ${_d(o)}
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
  var<workgroup> mm_Asub : array<array<${n}, ${_}>, ${w}>;
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
`},yd=(e,t,n,a,o=!1)=>{let[l,d,c,h]=a,f=Ue(a[0].type.tensor);return`
    fn mm_readA(batch: i32, row: i32, colIn: i32, batchIndices: ${l.type.indices}) -> ${Ve(e,f)} {
      var value = ${Ve(e,f)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_a_outer && col < uniforms.dim_inner)
      {
        var aIndices: ${d.type.indices};
        ${Bn("aIndices",d,d.rank-2,l.rank,"batchIndices")}
        ${d.indicesSet("aIndices",d.rank-2,"u32(row)")}
        ${d.indicesSet("aIndices",d.rank-1,"u32(colIn)")}
        value = ${d.getByIndices("aIndices")};
      }
      return value;
    }

    fn mm_readB(batch: i32, row: i32, colIn: i32, batchIndices: ${l.type.indices}) -> ${Ve(e,f)} {
      var value = ${Ve(e,f)}(0.0);
      let col = colIn * ${e};
      if(row < uniforms.dim_inner && col < uniforms.dim_b_outer)
      {
        var bIndices: ${c.type.indices};
        ${Bn("bIndices",c,c.rank-2,l.rank,"batchIndices")}
        ${c.indicesSet("bIndices",c.rank-2,"u32(row)")}
        ${c.indicesSet("bIndices",c.rank-1,"u32(colIn)")}
        value = ${c.getByIndices("bIndices")};
      }
      return value;
    }

    fn mm_write(batch: i32, row: i32, colIn: i32, valueIn: ${Ve(e,f)}) {
      let col = colIn * ${e};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer) {
        var value = valueIn;
        let coords = vec3<i32>(batch, row, colIn);
        ${t?`value = value + ${o?"bias[colIn]":`${Ve(e,f)}(bias[row])`};`:""}
        ${n}
        ${h.setByIndices("vec3<u32>(coords)","value")}
      }
    }
    `},ki=(e,t,n,a,o=!1,l)=>{let d=e[0].dims,c=e[1].dims,h=d.slice(0,-2),f=c.slice(0,-2),g=a?a.slice(0,-2):n.slice(0,-2),_=L.size(g),w=d[d.length-2],x=d[d.length-1],v=c[c.length-1],S=x%4===0&&v%4===0,T=w<=8?[4,1,1]:[4,4,1],k=[8,8,1],E=[Math.ceil(v/k[0]/T[0]),Math.ceil(w/k[1]/T[1]),Math.ceil(_/k[2]/T[2])],A=S?4:1,z=[...h,w,x/A],C=z.length,M=[...f,x,v/A],D=M.length,N=[_,w,v/A],W=[{type:6,data:w},{type:6,data:v},{type:6,data:x}];Jt(t,W),W.push(...ee(g,z,M));let q=["rank","rank"],ie=e.length>2;ie&&(W.push(...ee(e[2].dims)),q.push("rank")),W.push(...ee(N));let K=Q=>{let _e=g.length,$e=Xs("batchDims",e[0].dataType,_e,1),oe=Ue(e[0].dataType),ce=U("a",e[0].dataType,C,A),ye=U("b",e[1].dataType,D,A),ae=H("result",e[0].dataType,N.length,A),ze=[ce,ye];if(ie){let Te=o?A:1;ze.push(U("bias",e[2].dataType,e[2].dims.length,Te))}let F=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"}];Qt(t,F);let ne=Ue(ae.type.tensor),se=Yt(t,ae.type.value,ne),j=yd(A,ie,se,[$e,ce,ye,ae],o);return`
  ${Q.registerUniforms(F).registerInternalVariables($e).declareVariables(...ze,ae)}
  ${j}
  ${S?cr(T,k,oe,$e):hr(T,k,oe,$e)}
                   `};return{name:"MatMul",shaderCache:{hint:`${T};${t.activation};${S};${o}`,inputDependencies:q},getRunData:()=>({outputs:[{dims:l?l(n):n,dataType:e[0].dataType}],dispatchGroup:{x:E[0],y:E[1],z:E[2]},programUniforms:W}),getShaderSource:K}}}),wd,$d,Dg=$(()=>{"use strict";re(),kt(),de(),en(),ur(),Rg(),fr(),wd=(e,t,n,a,o=!1,l,d=4,c=4,h=4,f="f32")=>{let g=W=>{switch(W){case 1:return"resData = x[xIndex];";case 3:return`resData = vec3<${f}>(x[xIndex], x[xIndex + 1], x[xIndex + 2]);`;case 4:return"resData = x[xIndex / 4];";default:throw new Error(`innerElementSize ${W} is not supported.`)}},_=W=>{switch(W){case 1:return"return w[row * i32(uniforms.w_shape[3]) + colIn];";case 4:return"return w[row * i32(uniforms.w_shape[3]) / 4 + colIn];";default:throw new Error(`innerElementSize ${W} is not supported.`)}},w=e?`
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
    var resData = ${Ve(d,f)}(0.0);
    // The bounds checking is always needed since we use it to pad zero for
    // the 'same' padding type.
    if (xRow >= 0 && xRow < ${v} && xCol >= 0 && xCol < ${S}) {
      ${w}
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
    return ${Ve(d,f)}(0.0);`:a&&n?`
    let col = colIn * ${d};
    ${E}`:`
    let col = colIn * ${d};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${E}
    }
    return ${Ve(d,f)}(0.0);`,z=e?a&&n?_(c):`
    let col = colIn * ${c};
    if (row < uniforms.dim_inner && col < uniforms.dim_b_outer) {
      ${_(c)}
    }
    return ${Ve(c,f)}(0.0);`:`
    let col = colIn * ${c};
    if (row < uniforms.dim_inner && col < uniforms.dim_a_outer) {
      ${_(c)}
    }
    return ${Ve(c,f)}(0.0);`,C=Ve(h,f),M=Ve(e?d:c,f),D=Ve(e?c:d,f),N=Yt(l,C,f);return`
    fn mm_readA(batch: i32, row : i32, colIn : i32) -> ${M} {
      ${e?A:z}
    }

    fn mm_readB(batch: i32, row : i32, colIn : i32) -> ${D} {
      ${e?z:A}
    }

    fn mm_write(batch: i32, row : i32, colIn : i32, valueIn : ${C}) {
      let col = colIn * ${h};
      if (row < uniforms.dim_a_outer && col < uniforms.dim_b_outer)
      {
      var value = valueIn;
      let outWidth = ${e?"i32(uniforms.result_shape[2])":"i32(uniforms.result_shape[3])"};
      ${x}
      ${hd(o)}
      ${N}
      setOutputAtCoords(coords[0], coords[1], coords[2], coords[3], value);
      }
    }`},$d=(e,t,n,a,o,l,d,c,h)=>{let f=t.format==="NHWC",g=f?e[0].dims[3]:e[0].dims[1],_=n[0],w=f?n[2]:n[3],x=f?n[1]:n[2],v=f?n[3]:n[1],S=f&&(g%4===0||g%3===0)&&v%4===0,T=f?v:w*x,k=f?w*x:v,E=[8,8,1],A=a<=8?[4,1,1]:[4,4,1],z=[Math.ceil(T/E[0]/A[0]),Math.ceil(k/E[1]/A[1]),Math.ceil(_/E[2]/A[2])];we("verbose",()=>`[conv2d_mm_webgpu] dispatch = ${z}`);let C=S?f&&g%4!==0?3:4:1,M=E[1]*A[1],D=E[0]*A[0],N=Math.max(E[0]*C,E[1]),W=a%M===0,q=o%D===0,ie=l%N===0,K=S?[C,4,4]:[1,1,1],Q=[{type:6,data:a},{type:6,data:o},{type:6,data:l},{type:6,data:[t.pads[0],t.pads[1]]},{type:6,data:t.strides},{type:6,data:t.dilations}];Jt(t,Q),Q.push(...ee(e[0].dims,e[1].dims));let _e=["rank","rank"];d&&(Q.push(...ee(e[2].dims)),_e.push("rank")),Q.push(...ee(n));let $e=oe=>{let ce=[{name:"dim_a_outer",type:"i32"},{name:"dim_b_outer",type:"i32"},{name:"dim_inner",type:"i32"},{name:"pad",type:"i32",length:2},{name:"stride",type:"i32",length:2},{name:"dilation",type:"i32",length:2}];Qt(t,ce);let ye=S?4:1,ae=Ue(e[0].dataType),ze=`
      fn setOutputAtIndex(flatIndex : i32, value : ${S?`vec4<${ae}>`:ae}) {
        result[flatIndex] = ${S?`vec4<${ae}>`:ae}(value);
      }
      fn setOutputAtCoords(d0 : i32, d1 : i32, d2 : i32, d3 : i32, value : ${S?`vec4<${ae}>`:ae}) {
        let flatIndex = getOutputIndexFromCoords(vec4<i32>(d0, d1, d2, d3));
        setOutputAtIndex(flatIndex ${S?"/ 4":""}, value);
      }`,F=U("x",e[0].dataType,e[0].dims.length,C===3?1:C),ne=U("w",e[1].dataType,e[1].dims.length,ye),se=[F,ne],j=H("result",e[0].dataType,n.length,ye);if(d){let Te=U("bias",e[2].dataType,e[2].dims.length,ye);se.push(Te),ze+=`
        fn getBiasByOutputCoords(coords : vec4<i32>) -> ${S?`vec4<${ae}>`:ae} {
          return bias[coords.${f?"w":"y"}${S?"/ 4":""}];
        }`}return`
        ${fd("uniforms.result_strides")}
        //struct Uniforms { xShape : vec4<i32>, wShape : vec4<i32>, outShape : vec4<i32>,
        //  outShapeStrides: vec3<i32>, filterDims : vec2<i32>, pad : vec2<i32>, stride : vec2<i32>,
        //  dilation : vec2<i32>, dimAOuter : i32, dimBOuter : i32, dimInner : i32 };
        ${oe.registerUniforms(ce).declareVariables(...se,j)}
        ${ze}
        ${wd(f,W,q,ie,d,t,K[0],K[1],K[2],ae)}
        ${S?cr(A,E,ae,void 0,!f,N):hr(A,E,ae,void 0,!f,N,!1,void 0,c)}`};return{name:"Conv2DMatMul",shaderCache:{hint:`${t.cacheKey};${C};${S};${W};${q};${ie};${M};${D};${N}`,inputDependencies:_e},getRunData:()=>({outputs:[{dims:h?h(n):n,dataType:e[0].dataType}],dispatchGroup:{x:z[0],y:z[1],z:z[2]},programUniforms:Q}),getShaderSource:$e}}}),bd,mr,Ln,vd,gr,xd,Ed,kd,Bg=$(()=>{"use strict";re(),kt(),le(),de(),en(),ur(),bd=e=>{let t=1;for(let n=0;n<e.length;n++)t*=e[n];return t},mr=e=>typeof e=="number"?[e,e,e]:e,Ln=(e,t)=>t<=1?e:e+(e-1)*(t-1),vd=(e,t,n,a=1)=>{let o=Ln(t,a);return Math.floor((e[0]*(n-1)-n+o)/2)},gr=(e,t,n,a,o)=>{o==null&&(o=vd(e,t[0],a[0]));let l=[0,0,0,n];for(let d=0;d<3;d++)e[d]+2*o>=t[d]&&(l[d]=Math.trunc((e[d]-t[d]+2*o)/a[d]+1));return l},xd=(e,t,n,a,o,l,d,c,h,f)=>{let g,_,w,x;if(e==="VALID"&&(e=0),typeof e=="number"){g={top:e,bottom:e,left:e,right:e,front:e,back:e};let v=gr([t,n,a,1],[c,h,f],1,[o,l,d],e);_=v[0],w=v[1],x=v[2]}else if(Array.isArray(e)){if(!e.every((S,T,k)=>S===k[0]))throw Error(`Unsupported padding parameter: ${e}`);g={top:e[0],bottom:e[1],left:e[2],right:e[3],front:e[4],back:e[5]};let v=gr([t,n,a,1],[c,h,f],1,[o,l,d],e[0]);_=v[0],w=v[1],x=v[2]}else if(e==="SAME_UPPER"){_=Math.ceil(t/o),w=Math.ceil(n/l),x=Math.ceil(a/d);let v=(_-1)*o+c-t,S=(w-1)*l+h-n,T=(x-1)*d+f-a,k=Math.floor(v/2),E=v-k,A=Math.floor(S/2),z=S-A,C=Math.floor(T/2),M=T-C;g={top:A,bottom:z,left:C,right:M,front:k,back:E}}else throw Error(`Unknown padding parameter: ${e}`);return{padInfo:g,outDepth:_,outHeight:w,outWidth:x}},Ed=(e,t,n,a,o,l=!1,d="channelsLast")=>{let c,h,f,g,_;if(d==="channelsLast")[c,h,f,g,_]=e;else if(d==="channelsFirst")[c,_,h,f,g]=e;else throw new Error(`Unknown dataFormat ${d}`);let[w,,x,v,S]=t,[T,k,E]=mr(n),[A,z,C]=mr(a),M=Ln(x,A),D=Ln(v,z),N=Ln(S,C),{padInfo:W,outDepth:q,outHeight:ie,outWidth:K}=xd(o,h,f,g,T,k,E,M,D,N),Q=l?w*_:w,_e=[0,0,0,0,0];return d==="channelsFirst"?_e=[c,Q,q,ie,K]:d==="channelsLast"&&(_e=[c,q,ie,K,Q]),{batchSize:c,dataFormat:d,inDepth:h,inHeight:f,inWidth:g,inChannels:_,outDepth:q,outHeight:ie,outWidth:K,outChannels:Q,padInfo:W,strideDepth:T,strideHeight:k,strideWidth:E,filterDepth:x,filterHeight:v,filterWidth:S,effectiveFilterDepth:M,effectiveFilterHeight:D,effectiveFilterWidth:N,dilationDepth:A,dilationHeight:z,dilationWidth:C,inShape:e,outShape:_e,filterShape:t}},kd=(e,t,n,a,o,l)=>{let d=l==="channelsLast",c=d?e[0].dims[3]:e[0].dims[1],h=!1,f=[64,1,1],g={x:n.map((E,A)=>A)},_=[Math.ceil(bd(g.x.map(E=>n[E]))/f[0]),1,1];we("verbose",()=>`[conv3d_naive_webgpu] dispatch = ${_}`);let w=h?d&&c%4!==0?3:4:1,x=L.size(n),v=[{type:12,data:x},{type:12,data:a},{type:12,data:o},{type:12,data:t.strides},{type:12,data:t.dilations}];Jt(t,v),v.push(...ee(e[0].dims,e[1].dims));let S=["rank","rank"],T=e.length===3;T&&(v.push(...ee(e[2].dims)),S.push("rank")),v.push(...ee(n));let k=E=>{let A=[{name:"output_size",type:"u32"},{name:"filter_dims",type:"u32",length:a.length},{name:"pads",type:"u32",length:o.length},{name:"strides",type:"u32",length:t.strides.length},{name:"dilations",type:"u32",length:t.dilations.length}];Qt(t,A);let z=h?4:1,C=Ue(e[0].dataType),M=U("x",e[0].dataType,e[0].dims.length,w===3?1:w),D=U("W",e[1].dataType,e[1].dims.length,z),N=[M,D],W=H("result",e[0].dataType,n.length,z),q="";if(T){let Q=U("bias",e[2].dataType,e[2].dims.length,z);N.push(Q),q+=`
        fn getBiasByOutputCoords(coords : array<u32, 5>) -> ${h?`vec4<${C}>`:C} {
          return bias[${d?Y("coords",4,5):Y("coords",1,5)}${h?"/ 4":""}];
        }`}let ie=Ve(w,C),K=Yt(t,ie,C);return`
            ${q}
            fn getX(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${C} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${M.getByIndices("aIndices")};
            }
            fn getW(d0 : u32, d1 : u32, d2 : u32, d3 : u32, d4 : u32) -> ${C} {
              let aIndices = array<u32, 5>(d0, d1, d2, d3, d4);
              return ${D.getByIndices("aIndices")};
            }
          ${E.registerUniforms(A).declareVariables(...N,W)}
          ${E.mainStart()}
          ${E.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
              let coords = ${W.offsetToIndices("global_idx")};
              let batch = ${Y("coords",0,M.rank)};
              let d2 = ${d?Y("coords",M.rank-1,M.rank):Y("coords",1,M.rank)};
              let xFRCCorner = vec3<u32>(${d?Y("coords",1,M.rank):Y("coords",2,M.rank)},
              ${d?Y("coords",2,M.rank):Y("coords",3,M.rank)},
              ${d?Y("coords",3,M.rank):Y("coords",4,M.rank)}) * uniforms.strides - uniforms.pads;
              let xFCorner = xFRCCorner.x;
              let xRCorner = xFRCCorner.y;
              let xCCorner = xFRCCorner.z;
              let xShapeY = ${d?Y("uniforms.x_shape",1,M.rank):Y("uniforms.x_shape",2,M.rank)};
              let xShapeZ = ${d?Y("uniforms.x_shape",2,M.rank):Y("uniforms.x_shape",3,M.rank)};
              let xShapeW = ${d?Y("uniforms.x_shape",3,M.rank):Y("uniforms.x_shape",4,M.rank)};
              let xShapeU = ${d?Y("uniforms.x_shape",4,M.rank):Y("uniforms.x_shape",1,M.rank)};
              let inputDepthNearestVec4 = (xShapeU / 4) * 4;
              let inputDepthVec4Remainder = xShapeU % 4;

              var value = ${C}(0);
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
                      ${d?`let xValues = vec4<${C}>(
                               getX(batch, xF, xR, xC, d1),
                               getX(batch, xF, xR, xC, d1 + 1),
                               getX(batch, xF, xR, xC, d1 + 2),
                               getX(batch, xF, xR, xC, d1 + 3));
                            `:`let xValues = vec4<${C}>(
                               getX(batch, d1, xF, xR, xC),
                               getX(batch, d1 + 1, xF, xR, xC),
                               getX(batch, d1 + 2, xF, xR, xC),
                               getX(batch, d1 + 3, xF, xR, xC));
                            `}
                            let wValues = vec4<${C}>(
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
                      ${d?`let xValues = vec2<${C}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1));
                      `:`let xValues = vec2<${C}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC));
                    `}
                    let wValues = vec2<${C}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC));
                      value += dot(xValues, wValues);
                    } else if (inputDepthVec4Remainder == 3) {
                      ${d?`let xValues = vec3<${C}>(
                        getX(batch, xF, xR, xC, inputDepthNearestVec4),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 1),
                        getX(batch, xF, xR, xC, inputDepthNearestVec4 + 2));
                      `:`let xValues = vec3<${C}>(
                        getX(batch, inputDepthNearestVec4, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 1, xF, xR, xC),
                        getX(batch, inputDepthNearestVec4 + 2, xF, xR, xC));
                    `}
                    let wValues = vec3<${C}>(
                      getW(d2, inputDepthNearestVec4, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 1, wF, wR, wC),
                      getW(d2, inputDepthNearestVec4 + 2, wF, wR, wC));
                      value += dot(xValues, wValues);
                    }
                  }
                }
              }
              ${T?"value = value + getBiasByOutputCoords(coords)":""};
              ${K}
              result[global_idx] = ${C}(value);
          }`};return{name:"Conv3DNaive",shaderCache:{hint:`${t.cacheKey};${d};${w};${T}`,inputDependencies:S},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:_[0],y:_[1],z:_[2]},programUniforms:v}),getShaderSource:k}}}),Sd,Id,Lg=$(()=>{"use strict";re(),le(),de(),en(),Sd=(e,t,n,a)=>{let o=e.length>2,l=o?"value += b[output_channel];":"",d=e[0].dims,c=e[1].dims,h=t.format==="NHWC",f=h?n[3]:n[1],g=f/t.group,_=h&&g>=4?Me(f):1,w=L.size(n)/_,x=[{type:12,data:w},{type:12,data:t.dilations},{type:12,data:[t.strides[0],t.strides[1]]},{type:12,data:[t.pads[0],t.pads[1]]},{type:12,data:g}];Jt(t,x),x.push(...ee(d,[c[0],c[1],c[2],c[3]/_]));let v=o?["rank","rank","rank"]:["rank","rank"];x.push(...ee([n[0],n[1],n[2],n[3]/_]));let S=T=>{let k=H("output",e[0].dataType,n.length,_),E=Ue(k.type.tensor),A=Yt(t,k.type.value,E),z=U("x",e[0].dataType,d.length),C=U("w",e[1].dataType,c.length,_),M=[z,C];o&&M.push(U("b",e[2].dataType,e[2].dims,_));let D=[{name:"output_size",type:"u32"},{name:"dilations",type:"u32",length:t.dilations.length},{name:"strides",type:"u32",length:2},{name:"pads",type:"u32",length:2},{name:"output_channels_per_group",type:"u32"}];Qt(t,D);let N=h?`
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
            let xVal = ${z.get("batch","xHeight","xWidth","input_channel")};
            let wVal = ${C.get("wHeight","wWidth","wInChannel","output_channel")};
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

            let xVal = ${z.get("batch","input_channel","xHeight","xWidth")};
            let wVal = ${C.get("output_channel","wInChannel","wHeight","wWidth")};
            value += xVal * wVal;
          }
        }
      }
      `;return`
  ${T.registerUniforms(D).declareVariables(...M,k)}

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
  }`};return{name:"GroupedConv",shaderCache:{hint:`${t.cacheKey}_${_}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:a?a(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:x}),getShaderSource:S}},Id=(e,t,n,a)=>{let o=e.length>2,l=Me(n[3]),d=Me(n[2]),c=L.size(n)/l/d,h=[e[0].dims[0],e[0].dims[1],e[0].dims[2],e[0].dims[3]/l],f=[e[1].dims[0],e[1].dims[1],e[1].dims[2],e[1].dims[3]/l],g=[n[0],n[1],n[2],n[3]/l],_=[{type:12,data:c},{type:6,data:[t.strides[0],t.strides[1]]},{type:6,data:[t.pads[0],t.pads[1]]}];Jt(t,_),_.push(...ee(h,f,g));let w=(d-1)*t.strides[1]+f[1],x=v=>{let S=H("output",e[0].dataType,g.length,l),T=Ue(S.type.tensor),k=Yt(t,S.type.value,T),E=U("x",e[0].dataType,h.length,l),A=U("w",e[1].dataType,f.length,l),z=[E,A];o&&z.push(U("b",e[2].dataType,e[2].dims,l));let C=o?"value += b[output_channel];":"",M=[{name:"output_size",type:"u32"},{name:"strides",type:"i32",length:2},{name:"pads",type:"i32",length:2}];return Qt(t,M),`
  ${v.registerUniforms(M).declareVariables(...z,S)}
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

    var x_vals: array<${E.type.value}, ${w}>;
    var values: array<${S.type.value}, ${d}>;
    let input_channel = output_channel;
    // Use constant instead of uniform can give better performance for w's height/width.
    for (var w_height: u32 = 0u; w_height < ${f[0]}; w_height++) {
      let x_height = x_corner.x + i32(w_height);
      if (x_height >= 0 && u32(x_height) < uniforms.x_shape[1]) {
        for (var i = 0; i < ${w}; i++) {
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
      ${C}
      ${k}
      ${S.set("batch","row","col + i","output_channel","value")};
    }
  }`};return{name:"GroupedConv-Vectorize",shaderCache:{hint:`${t.cacheKey};${l};${d};${w};${f[0]};${f[1]}`,inputDependencies:o?["rank","rank","type"]:["rank","rank"]},getRunData:()=>({outputs:[{dims:a?a(n):n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:_}),getShaderSource:x}}}),Td,Si,Ad,Ii,_r,yr,zd,Cd,wr,Ng=$(()=>{"use strict";le(),Dg(),Bg(),fr(),Lg(),en(),dr(),Mt(),Td=(e,t,n,a,o,l)=>{let d=e[0],c=e.slice(l?1:2,l?3:4),h=c.length,f=t[0],g=t.slice(2).map((w,x)=>w+(w-1)*(n[x]-1)),_=c.map((w,x)=>w+a[x]+a[x+h]).map((w,x)=>Math.floor((w-g[x]+o[x])/o[x]));return _.splice(0,0,d),_.splice(l?3:1,0,f),_},Si=[2,3,1,0],Ad=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length>5)throw new Error("greater than 5D is not supported");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let n=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[1]*t.group;if(n!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");if(e.length===3&&(e[2].dims.length!==1||e[1].dims[0]!==e[2].dims[0]))throw new Error("invalid bias");let o=e[0].dims.length-2;if(t.dilations.length!==o)throw new Error(`dilations should be ${o}D`);if(t.strides.length!==o)throw new Error(`strides should be ${o}D`);if(t.pads.length!==o*2)throw new Error(`pads should be ${o*2}D`);if(t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape")},Ii=(e,t)=>{let n=e.kernelShape.slice();n.length<t[1].dims.length-2&&n.push(...Array(t[1].dims.length-2-n.length).fill(0));for(let l=2;l<t[1].dims.length;++l)n[l-2]===0&&(n[l-2]=t[1].dims[l]);let a=e.pads.slice();yi.adjustPadsBasedOnAutoPad(t[0].dims,e.strides,e.dilations,n,a,e.format==="NHWC",e.autoPad);let o=Object.assign({},e);return Object.assign(o,{kernelShape:n,pads:a}),o},_r=e=>{let t=or(e),n=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],o=e.dilations,l=e.group,d=e.kernel_shape,c=e.pads,h=e.strides,f=e.w_is_const();return{autoPad:a,format:n,dilations:o,group:l,kernelShape:d,pads:c,strides:h,wIsConst:f,...t,cacheKey:`${e.format};${t.activation};`}},yr=(e,t,n,a)=>{let o=n.format==="NHWC",l=Td(t[0].dims,t[1].dims,n.dilations,n.pads,n.strides,o);if(n.group!==1){let M=[t[0]];if(o){let D=e.kernelCustomData.wT??e.compute(at(t[1],Si),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=D),M.push(D)}else M.push(t[1]);t.length===3&&M.push(t[2]),!e.adapterInfo.isArchitecture("ampere")&&o&&t[1].dims[0]===n.group&&t[1].dims[1]===1&&n.dilations[0]===1&&n.dilations[1]===1?e.compute(Id(M,n,l,a),{inputs:M}):e.compute(Sd(M,n,l,a),{inputs:M});return}let d=t.length===3,c=t[0].dims[o?1:2],h=t[0].dims[o?2:3],f=t[0].dims[o?3:1],g=t[1].dims[2],_=t[1].dims[3],w=l[o?1:2],x=l[o?2:3],v=l[o?3:1],S=o&&g===c&&_===h&&n.pads[0]===0&&n.pads[1]===0;if(S||g===1&&_===1&&n.dilations[0]===1&&n.dilations[1]===1&&n.strides[0]===1&&n.strides[1]===1&&n.pads[0]===0&&n.pads[1]===0){let M=l[0],D,N,W,q=[];if(o){let Q=e.kernelCustomData.wT??e.compute(at(t[1],Si),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];if(n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=Q),S){let _e=c*h*f;D=t[0].reshape([1,M,_e]),N=Q.reshape([1,_e,v]),W=[1,M,v]}else D=t[0].reshape([M,c*h,f]),N=Q.reshape([1,f,v]),W=[M,w*x,v];q.push(D),q.push(N)}else D=t[0].reshape([M,f,c*h]),N=t[1].reshape([1,v,f]),W=[M,v,w*x],q.push(N),q.push(D);d&&q.push(t[2]);let ie=W[2],K=q[0].dims[q[0].dims.length-1];ie<8&&K<8?e.compute(lr(q,n,l,W,o,a),{inputs:q}):e.compute(ki(q,n,l,W,o,a),{inputs:q});return}let T=!0,k=e.kernelCustomData.wT??e.compute(at(t[1],Si),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=k);let E=[t[0],k];d&&E.push(t[2]);let A=o?w*x:v,z=o?v:w*x,C=g*_*f;e.compute($d(E,n,l,A,z,C,d,T,a),{inputs:E})},zd=(e,t)=>{let n=t.format==="NHWC",a=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let o=[0,t.pads[0],0,t.pads[1]],l=[1].concat(t.strides),d=[1].concat(t.dilations),c=[1].concat(t.kernelShape),h=Ii({...t,pads:o,strides:l,dilations:d,kernelShape:c},a);yr(e,a,h,f=>n?[f[0],f[2],f[3]]:[f[0],f[1],f[3]])},Cd=(e,t,n)=>{let a=n.format==="NHWC"?"channelsLast":"channelsFirst",o=Ii(n,t),l=n.autoPad==="NOTSET"?n.pads:n.autoPad,d=Ed(t[0].dims,t[1].dims,n.strides,n.dilations,l,!1,a);e.compute(kd(t,o,d.outShape,[d.filterDepth,d.filterHeight,d.filterWidth],[d.padInfo.front,d.padInfo.top,d.padInfo.left],a))},wr=(e,t)=>{if(Ad(e.inputs,t),e.inputs[0].dims.length===3)zd(e,t);else if(e.inputs[0].dims.length===5)Cd(e,e.inputs,t);else{let n=Ii(t,e.inputs);yr(e,e.inputs,n)}}}),Od,Ug=$(()=>{"use strict";re(),kt(),le(),de(),Od=(e,t,n)=>{let a=e.length>2,o=t.outputShape,l=t.format==="NHWC",d=t.group,c=e[1].dims,h=c[2]/d,f=c[3],g=l?Me(h):1,_=l&&f===1&&h>=4,w=_?Math.floor(h/4)*4:Math.floor(h/g)*g,x=h-w,v=l?Me(f):1,S=l?f===1?g:v:1,T=L.size(o)/v,k=[Math.ceil(T/64),1,1];we("verbose",()=>`[conv2d_backprop_webgpu] dispatch = ${k}`);let E=["rank","rank"],A=[t.strides[0],t.strides[1]],z=[t.kernelShape[l?1:2],t.kernelShape[l?2:3]],C=[t.dilations[0],t.dilations[1]],M=[z[0]+(t.dilations[0]<=1?0:(t.kernelShape[l?1:2]-1)*(t.dilations[0]-1)),z[1]+(t.dilations[1]<=1?0:(t.kernelShape[l?2:3]-1)*(t.dilations[1]-1))],D=[M[0]-1-Math.floor((t.pads[0]+t.pads[2])/2),M[1]-1-Math.floor((t.pads[1]+t.pads[3])/2)],N=[{type:12,data:T},{type:12,data:A},{type:12,data:z},{type:12,data:C},{type:12,data:M},{type:6,data:D},{type:12,data:w},{type:12,data:h},{type:12,data:f},...ee(e[0].dims,e[1].dims)];a&&(N.push(...ee(e[2].dims)),E.push("rank")),N.push(...ee(o));let W=q=>{let ie=[{name:"output_size",type:"u32"},{name:"strides",type:"u32",length:A.length},{name:"filter_dims",type:"u32",length:z.length},{name:"dilations",type:"u32",length:z.length},{name:"effective_filter_dims",type:"u32",length:M.length},{name:"pads",type:"i32",length:D.length},{name:"input_channels_per_group_int",type:"u32"},{name:"input_channels_per_group",type:"u32"},{name:"output_channels_per_group",type:"u32"}],K=Ue(e[0].dataType),Q=l?1:2,_e=l?2:3,$e=l?3:1,oe=U("W",e[1].dataType,e[1].dims.length,S),ce=U("Dy",e[0].dataType,e[0].dims.length,g),ye=[ce,oe];a&&ye.push(U("bias",e[2].dataType,[o[$e]].length,v));let ae=H("result",e[0].dataType,o.length,v),ze=()=>{let se="";if(_)g===4?se+=`
        let xValue = ${ce.getByOffset("x_offset")};
        let wValue = ${oe.getByOffset("w_offset")};
        dotProd = dotProd + dot(xValue, wValue);
        x_offset += 1u;
        w_offset += 1u;`:g===2?se+=`
          dotProd = dotProd + dot(vec4<${K}>(${ce.getByOffset("x_offset")}, ${ce.getByOffset("x_offset + 1u")}), vec4<${K}>(${oe.getByOffset("w_offset")}, ${oe.getByOffset("w_offset + 1u")}));
          x_offset += 2u;
          w_offset += 2u;`:g===1&&(se+=`
          dotProd = dotProd + dot(vec4<${K}>(${ce.getByOffset("x_offset")}, ${ce.getByOffset("x_offset + 1u")}, ${ce.getByOffset("x_offset + 2u")}, ${ce.getByOffset("x_offset + 3u")}), vec4<${K}>(${oe.getByOffset("w_offset")}, ${oe.getByOffset("w_offset + 1u")}, ${oe.getByOffset("w_offset + 2u")}, ${oe.getByOffset("w_offset + 3u")}));
          x_offset += 4u;
          w_offset += 4u;`);else if(se+=`
                  let xValue = ${l?ce.getByOffset(`${ce.indicesToOffset(`${ce.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${g}`):ce.get("batch","inputChannel","idyR","idyC")};
        `,g===1)se+=`
          let w_offset = ${oe.indicesToOffset(`${oe.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel, wOutChannel)`)};
          let wValue = ${oe.getByOffset(`w_offset / ${S}`)};
          dotProd = dotProd + xValue * wValue;`;else for(let j=0;j<g;j++)se+=`
            let wValue${j} = ${oe.getByOffset(`${oe.indicesToOffset(`${oe.type.indices}(u32(wRPerm), u32(wCPerm), inputChannel + ${j}, wOutChannel)`)} / ${S}`)};
            dotProd = dotProd + xValue[${j}] * wValue${j};`;return se},F=()=>{if(x===0)return"";if(!_)throw new Error(`packInputAs4 ${_} is not true.`);let se="";if(g===1){se+="dotProd = dotProd";for(let j=0;j<x;j++)se+=`
            + ${ce.getByOffset(`x_offset + ${j}`)} * ${oe.getByOffset(`w_offset + ${j}`)}`;se+=";"}else if(g===2){if(x!==2)throw new Error(`Invalid inputChannelsRemainder ${x}.`);se+=`
          let xValue = ${ce.getByOffset("x_offset")};
          let wValue = ${oe.getByOffset("w_offset")};
          dotProd = dotProd + dot(xValue, wValue);`}return se},ne=`
            let outputIndices = ${ae.offsetToIndices(`global_idx * ${v}`)};
            let batch = ${ae.indicesGet("outputIndices",0)};
            let d1 = ${ae.indicesGet("outputIndices",$e)};
            let r = ${ae.indicesGet("outputIndices",Q)};
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
              let dyR = (${K}(dyRCorner) + ${K}(wR)) / ${K}(uniforms.strides[0]);
              let wRPerm = uniforms.filter_dims.x - 1 - wR / uniforms.dilations.x;
              if (dyR < 0.0 || dyR >= ${K}(uniforms.Dy_shape[${Q}]) || fract(dyR) > 0.0 ||
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
                let dyC = (${K}(dyCCorner) + ${K}(wC)) / ${K}(uniforms.strides.y);
                let wCPerm = uniforms.filter_dims.y - 1 - wC / uniforms.dilations.y;
                if (dyC < 0.0 || dyC >= ${K}(uniforms.Dy_shape[${_e}]) ||
                    fract(dyC) > 0.0 || wCPerm < 0) {
                  continue;
                }
                let idyC: u32 = u32(dyC);
                var inputChannel = groupId * uniforms.input_channels_per_group;
                ${_?`
                var x_offset = ${ce.indicesToOffset(`${ce.type.indices}(batch, idyR, idyC, inputChannel)`)} / ${g};
                var w_offset = ${oe.indicesToOffset(`${oe.type.indices}(wRPerm, wCPerm, inputChannel, wOutChannel)`)} / ${S};
                  `:""}
                for (var d2: u32 = 0; d2 < uniforms.input_channels_per_group_int; d2 = d2 + ${_?4:g}) {
                  ${ze()}
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
    ${q.registerUniforms(ie).declareVariables(...ye,ae)}
      ${q.mainStart()}
      ${q.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")};
    ${ne}}`};return{name:"ConvTranspose2D",shaderCache:{hint:`${t.cacheKey};${g}${S}${v}${_}${x}`,inputDependencies:E},getRunData:()=>({dispatchGroup:{x:k[0],y:k[1],z:k[2]},outputs:[{dims:n?n(o):o,dataType:e[0].dataType}],programUniforms:N}),getShaderSource:W}}}),Md,Pd,Rd,$r,Dd,Bd,br,Ld,Nd,Fg=$(()=>{"use strict";Ug(),en(),Mt(),Md=(e,t,n,a,o,l)=>(e-1)*t+n+(a-1)*o+1-l,Pd=(e,t,n,a,o)=>{let l=Math.floor(e/2);t==="SAME_UPPER"?(n[a]=l,n[o]=e-l):t==="SAME_LOWER"&&(n[a]=e-l,n[o]=l)},Rd=(e,t,n,a,o,l,d,c,h,f)=>{let g=e.length-2,_=f.length===0;h.length<g&&h.push(...Array(g-h.length).fill(0));let w=e[0],x=t[c?3:1]*o;for(let v=0,S=e.length-g-(c?1:0);v<g;++v,++S){let T=e[S],k=_?T*d[v]:f[v],E=Md(T,d[v],l[v],t[S],n[v],k);Pd(E,a,l,v,v+g),_&&f.push(d[v]*(T-1)+h[v]+(t[S]-1)*n[v]+1-l[v]-l[v+g])}f.splice(0,0,w),f.splice(c?3:1,0,x)},$r=(e,t)=>{let n=e.kernelShape.slice();if(e.kernelShape.length===0||e.kernelShape.reduce((_,w)=>_*w,1)===0){n.length=0;for(let _=2;_<t[1].dims.length;++_)n.push(t[1].dims[_])}let a=e.format==="NHWC";n.splice(0,0,t[1].dims[0]),n.splice(a?3:1,0,t[1].dims[1]);let o=e.pads.slice(),l=e.outputShape.slice(),d=e.outputPadding.slice(),c=t[0].dims,h=e.dilations.slice();if(h.reduce((_,w)=>_+w,0)===0){let _=t[0].dims.length-2;h=new Array(_).fill(1)}let f=e.strides.slice();if(f.reduce((_,w)=>_+w,0)===0){let _=t[0].dims.length-2;f=new Array(_).fill(1)}Rd(c,n,h,e.autoPad,e.group,o,f,a,d,l);let g=Object.assign({},e);return Object.assign(g,{kernelShape:n,pads:o,outputPadding:d,outputShape:l,dilations:h,strides:f}),g},Dd=e=>{let t=or(e),n=e.format,a=["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][typeof e.autoPad>"u"?0:e.autoPad],o=e.dilations,l=e.group??1,d=e.kernelShape,c=e.pads,h=e.strides,f=e.wIsConst(),g=e.outputPadding,_=e.outputShape;return{autoPad:a,format:n,dilations:o,group:l,kernelShape:d,outputPadding:g,outputShape:_,pads:c,strides:h,wIsConst:f,...t,cacheKey:`${e.format};${t.activation};`}},Bd=(e,t)=>{if(!e||e.length!==2&&e.length!==3)throw new Error("Conv requires 2 or 3 inputs");if(e[0].dims.length!==4&&e[0].dims.length!==3)throw new Error("currently only support 2-dimensional conv");if(e[0].dims.length!==e[1].dims.length)throw new Error("filter does not have same dimension as input");let n=e[0].dims[t.format==="NHWC"?e[0].dims.length-1:1],a=e[1].dims[0];if(n!==a)throw new Error("FILTER_IN_CHANNEL should be equal to DATA_CHANNEL");let o=e[1].dims[1]*t.group;if(e.length===3&&(e[2].dims.length!==1||e[2].dims[0]!==o))throw new Error("invalid bias");let l=e[0].dims.length-2;if(t.dilations.reduce((d,c)=>d+c,0)>0&&t.dilations.length!==l)throw new Error(`dilations should be ${l}D`);if(t.strides.reduce((d,c)=>d+c,0)>0&&t.strides.length!==l)throw new Error(`strides should be ${l}D`);if(t.pads.reduce((d,c)=>d+c,0)>0&&t.pads.length!==l*2)throw new Error(`pads should be ${l*2}D`);if(t.outputPadding.length!==l&&t.outputPadding.length!==0)throw new Error(`output_padding should be ${l}D`);if(t.kernelShape.reduce((d,c)=>d+c,0)>0&&t.kernelShape.length!==0&&t.kernelShape.length!==e[1].dims.length-2)throw new Error("invalid kernel shape");if(t.outputShape.length!==0&&t.outputShape.length!==e[0].dims.length-2)throw new Error("invalid output shape")},br=(e,t,n,a)=>{let o=e.kernelCustomData.wT??e.compute(at(t[1],[2,3,0,1]),{inputs:[1],outputs:[n.wIsConst?-2:-1]})[0];n.wIsConst&&!e.kernelCustomData.wT&&(e.kernelCustomData.wT=o);let l=[t[0],o];t.length===3&&l.push(t[2]),e.compute(Od(l,n,a),{inputs:l})},Ld=(e,t)=>{let n=t.format==="NHWC",a=[e.inputs[0].reshape(n?[e.inputs[0].dims[0],1,e.inputs[0].dims[1],e.inputs[0].dims[2]]:[e.inputs[0].dims[0],e.inputs[0].dims[1],1,e.inputs[0].dims[2]]),e.inputs[1].reshape([e.inputs[1].dims[0],e.inputs[1].dims[1],1,e.inputs[1].dims[2]])];e.inputs.length===3&&a.push(e.inputs[2]);let o=t.kernelShape;(o.length===0||o[0]===0)&&(o=[e.inputs[1].dims[2]]);let l=t.dilations;(l.length===0||l[0]===0)&&(l=[1]);let d=t.strides;(d.length===0||d[0]===0)&&(d=[1]);let c=t.pads;c.length===0&&(c=[0,0]),c=[0,c[0],0,c[1]],d=[1].concat(d),l=[1].concat(l),o=[1].concat(o);let h=t.outputPadding;h=[0].concat(h);let f=$r({...t,pads:c,strides:d,dilations:l,kernelShape:o,outputPadding:h},a);br(e,a,f,g=>n?[g[0],g[2],g[3]]:[g[0],g[1],g[3]])},Nd=(e,t)=>{if(Bd(e.inputs,t),e.inputs[0].dims.length===3)Ld(e,t);else{let n=$r(t,e.inputs);br(e,e.inputs,n)}}}),Ud,Fd,Wd,Wg=$(()=>{"use strict";re(),le(),Oe(),de(),Ud=(e,t,n,a)=>{let o=L.size(t),l=t.length,d=U("input",e,l),c=H("output",e,l),h=n.dataType===6?n.getInt32Array()[0]:Number(n.getBigInt64Array()[0]),f=L.normalizeAxis(h,l),g=_=>{let w=` i32(${d.indicesGet("inputIndices","uniforms.axis")}) `,x=Y("uniforms.input_shape","uniforms.axis",l),v=a.reverse?w+(a.exclusive?" + 1":""):"0",S=a.reverse?x:w+(a.exclusive?"":" + 1");return`
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
                }`};return{name:"CumSum",shaderCache:{hint:a.cacheKey,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:t,dataType:e}],dispatchGroup:{x:Math.ceil(o/64)},programUniforms:[{type:12,data:o},{type:12,data:f},...ee(t,t)]}),getShaderSource:g}},Fd=(e,t)=>{let n=e.inputs[0].dims,a=e.inputs[0].dataType,o=e.inputs[1];e.compute(Ud(a,n,o,t),{inputs:[0]})},Wd=e=>{let t=e.exclusive===1,n=e.reverse===1;return xe({exclusive:t,reverse:n})}}),Vd,jd,qd,Gd,Hd,Vg=$(()=>{"use strict";re(),le(),Oe(),de(),Vd=e=>{if(!e||e.length!==1)throw new Error("DepthToSpace requires 1 input.");if(e[0].dims.length!==4)throw new Error("DepthToSpace requires 4D input.")},jd=(e,t,n,a)=>{let o=[];o.push(`fn perm(i: ${a.type.indices}) -> ${n.type.indices} {
    var a: ${n.type.indices};`);for(let l=0;l<t;++l)o.push(n.indicesSet("a",e[l],`i[${l}]`));return o.push("return a;}"),o.join(`
`)},qd=(e,t)=>{let n,a,o,l,d,c,h=t.format==="NHWC",f=t.blocksize,g=t.mode==="DCR";h?([n,a,o,l]=e.dims,d=g?[n,a,o,f,f,l/f**2]:[n,a,o,l/f**2,f,f],c=g?[0,1,3,2,4,5]:[0,1,4,2,5,3]):([n,a,o,l]=[e.dims[0],e.dims[2],e.dims[3],e.dims[1]],d=g?[n,f,f,l/f**2,a,o]:[n,l/f**2,f,f,a,o],c=g?[0,3,4,1,5,2]:[0,1,4,2,5,3]);let _=e.reshape(d),w=_.dims.length,x=e.dataType,v=U("a",x,w),S=H("output",x,w),T=k=>`
  ${k.registerUniform("output_size","u32").declareVariables(v,S)}

  ${jd(c,w,v,S)}

  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let indices = ${S.offsetToIndices("global_idx")};
    let aIndices = perm(indices);

    ${S.setByOffset("global_idx",v.getByIndices("aIndices"))}
  }`;return{name:"DepthToSpace",shaderCache:{hint:`${e.dims};${t.blocksize};${t.mode}`,inputDependencies:["rank"]},getRunData:k=>{let E=h?[n,a*f,o*f,l/f**2]:[n,l/f**2,a*f,o*f],A=L.size(E),z=_.dims,C=L.sortBasedOnPerm(z,c);return{outputs:[{dims:E,dataType:k[0].dataType}],dispatchGroup:{x:Math.ceil(A/64)},programUniforms:[{type:12,data:A},...ee(z,C)]}},getShaderSource:T}},Gd=(e,t)=>{Vd(e.inputs),e.compute(qd(e.inputs[0],t))},Hd=e=>xe({blocksize:e.blocksize,mode:e.mode,format:e.format})}),St,Nn,Ti,vr,Pt,Kd,Zd,Xd,xr,Er,kr,Yd,Jd,Sr,Qd,ec,tc,jg=$(()=>{"use strict";re(),le(),Oe(),de(),St=256,Nn=512,Ti=2*Math.PI,vr=e=>{let t=[],n=e;for(let a of[4,2,3,5])for(;n%a===0;)t.push(a),n/=a;return n===1?t:void 0},Pt=e=>{let t=e.toPrecision(9);return/[.eE]/.test(t)?t:`${t}.0`},Kd=(e,t,n,a,o)=>{let l=n/e,d=Nn-a,c=f=>`smem[${d}u + base + ${f*t}u]`,h=`  for (var t = local_idx; t < ${l}u; t += ${St}u) {
`;h+=`    let twiddleIndex = t % ${t}u;
    let angleUnit = f32(twiddleIndex);
`,h+=`    var leg: array<vec2<f32>, 5>;
`;for(let f=0;f<e;f++){let g=`${a}u + t + ${f*l}u`;if(f===0)h+=`    leg[0] = smem[${g}];
`;else{let _=o*Ti*f/(e*t);h+=`    { let a = ${Pt(_)} * angleUnit; leg[${f}] = cmul(smem[${g}], vec2<f32>(cos(a), sin(a))); }
`}}if(h+=`    let base = (t / ${t}u) * ${t*e}u + twiddleIndex;
`,e===2)h+=`    ${c(0)} = leg[0] + leg[1];
    ${c(1)} = leg[0] - leg[1];
`;else if(e===4){let f=o<0?"vec2<f32>(oddDiff.y, -oddDiff.x)":"vec2<f32>(-oddDiff.y, oddDiff.x)";h+=`    let evenSum = leg[0] + leg[2]; let evenDiff = leg[0] - leg[2];
`,h+=`    let oddSum = leg[1] + leg[3]; let oddDiff = leg[1] - leg[3];
`,h+=`    let oddRot = ${f};
`,h+=`    ${c(0)} = evenSum + oddSum;
    ${c(1)} = evenDiff + oddRot;
`,h+=`    ${c(2)} = evenSum - oddSum;
    ${c(3)} = evenDiff - oddRot;
`}else for(let f=0;f<e;f++){let g=["leg[0]"];for(let _=1;_<e;_++){let w=o*Ti*(_*f)/e,x=Pt(Math.cos(w)),v=Pt(Math.sin(w));g.push(`vec2<f32>(leg[${_}].x*${x} - leg[${_}].y*${v}, leg[${_}].x*${v} + leg[${_}].y*${x})`)}h+=`    ${c(f)} = ${g.join(" + ")};
`}return`${h}  }
  workgroupBarrier();
`},Zd=(e,t,n)=>{let a="",o=1,l=0;for(let d of e)a+=Kd(d,o,t,l,n),o*=d,l=Nn-l;return{code:a,resultOffset:l}},Xd=(e,t,n,a,o)=>{let l=e.dims,d=l.length,c=l[d-1],h=l[t],f=n&&a?(h-1)*2:h;o!==void 0&&(f=o);let g=n&&a?1:2,_=a&&!n?Math.floor(f/2)+1:f,w=l.slice();w[t]=_,w[d-1]=g;let x=1;for(let S=t+1;S<d-1;S++)x*=l[S];let v=L.size(l)/c/h;return{dataType:e.dataType,outputDims:w,length:f,signalLength:h,inner:x,batch:v,inputComponents:c,outputComponents:g,outputLength:_,inverse:n,onesided:a}},xr=(e,t)=>[t,e.length,e.inputComponents,e.outputComponents,e.inverse,e.onesided].join(";"),Er=e=>[{type:12,data:e.batch},{type:12,data:e.signalLength},{type:12,data:e.inner},{type:12,data:e.outputLength}],kr=(e,t,n)=>e.registerUniform("batch","u32").registerUniform("signalLength","u32").registerUniform("inner","u32").registerUniform("outputLength","u32").declareVariables(t,n),Yd=e=>{let{dataType:t,length:n,inputComponents:a,outputComponents:o,inverse:l,onesided:d}=e,c=Fe(t),h=l?1:-1,f=l?1/n:1,g=vr(n),_=w=>{let x=U("x",t,[1]),v=H("y",t,[1]),S=C=>{let M=`inBase + (${C}) * uniforms.inner * ${a}u`,D=`f32(${x.getByOffset(M)})`,N=a===2?`f32(${x.getByOffset(`${M} + 1u`)})`:"0.0";return`vec2<f32>(${D}, ${N})`},T;if(l&&d){let C=Math.floor(n/2)+1,M=n%2===0?`select(provided, provided - 1u, provided == ${C}u)`:"provided";T=`
    let provided = min(uniforms.signalLength, ${C}u);
    for (var i = local_idx; i < ${n}u; i += ${St}u) {
      if (i < provided) { smem[i] = ${S("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();
    for (var k = local_idx + 1u; k < ${M}; k += ${St}u) {
      let h = smem[k];
      smem[${n}u - k] = vec2<f32>(h.x, -h.y);
    }
    workgroupBarrier();`}else T=`
    let loadCount = min(uniforms.signalLength, ${n}u);
    for (var i = local_idx; i < ${n}u; i += ${St}u) {
      if (i < loadCount) { smem[i] = ${S("i")}; } else { smem[i] = vec2<f32>(0.0); }
    }
    workgroupBarrier();`;let{code:k,resultOffset:E}=Zd(g,n,h),A=f===1?`smem[${E}u + i]`:`smem[${E}u + i] * ${Pt(f)}`,z=o===2?v.setByOffset("off + 1u",`${c}(v.y)`):"";return`
  ${kr(w,x,v)}
  var<workgroup> smem: array<vec2<f32>, ${2*Nn}>;
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${w.mainStart(St)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${a}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${o}u;
    ${T}
${k}    for (var i = local_idx; i < uniforms.outputLength; i += ${St}u) {
      let v = ${A};
      let off = outBase + i * uniforms.inner * ${o}u;
      ${v.setByOffset("off",`${c}(v.x)`)}
      ${z}
    }
  }`};return{name:"DFT",shaderCache:{hint:xr(e,"fft"),inputDependencies:["type"]},getShaderSource:_,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:Er(e),dispatchGroup:{x:e.batch}})}},Jd=e=>{let{dataType:t,length:n,inputComponents:a,outputComponents:o,inverse:l,onesided:d}=e,c=Fe(t),h=l?1:-1,f=l?1/n:1,g=_=>{let w=U("x",t,[1]),x=H("y",t,[1]),v=A=>{let z=`inBase + (${A}) * uniforms.inner * ${a}u`,C=`f32(${w.getByOffset(z)})`,M=a===2?`f32(${w.getByOffset(`${z} + 1u`)})`:"0.0";return`vec2<f32>(${C}, ${M})`},S=l&&d?`fn spectrum(inBase: u32, k: u32) -> vec2<f32> {
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
      let angle = ${Pt(h*Ti)} * f32(knMod) / ${Pt(n)};
      acc += cmul(spectrum(inBase, n), vec2<f32>(cos(angle), sin(angle)));
      knMod += k;
      if (knMod >= ${n}u) { knMod -= ${n}u; }`,k=o===2?x.setByOffset("off + 1u",`${c}(v.y)`):"",E=f===1?"acc":`acc * ${Pt(f)}`;return`
  ${kr(_,w,x)}
  fn cmul(a: vec2<f32>, b: vec2<f32>) -> vec2<f32> {
    return vec2<f32>(a.x * b.x - a.y * b.y, a.x * b.y + a.y * b.x);
  }
  ${S}
  ${_.mainStart(St)}
    let row = workgroup_index;
    if (row >= uniforms.batch) { return; }
    let outer = row / uniforms.inner;
    let within = row % uniforms.inner;
    let inBase = (outer * uniforms.signalLength * uniforms.inner + within) * ${a}u;
    let outBase = (outer * uniforms.outputLength * uniforms.inner + within) * ${o}u;
    for (var k = local_idx; k < uniforms.outputLength; k += ${St}u) {
      var acc = vec2<f32>(0.0, 0.0);
      var knMod = 0u;
      for (var n = 0u; n < ${n}u; n++) {${T}
      }
      let v = ${E};
      let off = outBase + k * uniforms.inner * ${o}u;
      ${x.setByOffset("off",`${c}(v.x)`)}
      ${k}
    }
  }`};return{name:"DFT",shaderCache:{hint:xr(e,"direct"),inputDependencies:["type"]},getShaderSource:g,getRunData:()=>({outputs:[{dims:e.outputDims,dataType:t}],programUniforms:Er(e),dispatchGroup:{x:e.batch}})}},Sr=e=>{if(!e||e.dataType===0)return;if(L.size(e.dims)!==1)throw new Error("DFT optional scalar inputs must have exactly 1 element.");if(e.dataType===6)return e.getInt32Array()[0];let t=Number(e.getBigInt64Array()[0]);if(!Number.isSafeInteger(t))throw new Error("DFT optional scalar inputs are out of JavaScript safe integer range.");return t},Qd=e=>{if(!e||e.length<1)throw new Error("DFT requires at least 1 input.");let t=e[0].dims;if(t.length<2)throw new Error("DFT input must have at least 2 dimensions.");let n=t[t.length-1];if(n!==1&&n!==2)throw new Error("DFT input's innermost dimension must be 1 (real) or 2 (complex).")},ec=(e,t)=>{Qd(e.inputs);let n=e.inputs[0],a=n.dims.length,o=t.inverse!==0,l=t.onesided!==0,d=Sr(e.inputs[1]);if(d!==void 0&&d<=0)throw new Error("dft_length must be greater than zero.");let c=L.normalizeAxis(Sr(e.inputs[2])??t.axis,a);if(c===a-1)throw new Error("DFT axis must refer to a signal dimension, not the innermost (real/imaginary) dimension.");if(o&&l&&n.dims[a-1]!==2)throw new Error("Inverse one-sided DFT (IRFFT) requires complex-valued input (innermost dimension 2).");let h=Xd(n,c,o,l,d);if(h.length<=0)throw new Error(`Invalid DFT length: ${h.length}`);let f=h.length<=Nn&&vr(h.length)!==void 0?Yd(h):Jd(h);e.compute(f,{inputs:[0]})},tc=e=>xe({axis:e.axis??1,inverse:e.inverse??0,onesided:e.onesided??0})}),Ai,Un,Ir,nc,ic,sc,rc,Tr,ac,oc,uc,qg=$(()=>{"use strict";re(),le(),Oe(),de(),Ai="[a-zA-Z]|\\.\\.\\.",Un="("+Ai+")+",Ir="^"+Un+"$",nc="("+Un+",)*"+Un,ic="^"+nc+"$",sc=class{constructor(e=-1){this.symbolToIndices=new Map,this.inputIndex=e}addSymbol(e,t){let n=this.symbolToIndices.get(e);n===void 0?n=[t]:n.push(t),this.symbolToIndices.set(e,n)}},rc=class{constructor(e,t){var o;this.equation=t,this.hasEllipsis=!1,this.symbolToInfo=new Map,this.lhs=new Array,this.outputDims=[];let[n,a]=t.includes("->")?t.split("->",2):[t,""];if(!n.match(RegExp(ic)))throw new Error("Invalid LHS term");if(n.split(",").forEach((l,d)=>{let c=e[d].dims.slice();if(!l.match(RegExp(Ir)))throw new Error("Invalid LHS term");let h=this.processTerm(l,!0,c,d);this.lhs.push(h)}),a==="")a+=[...this.symbolToInfo.entries()].filter(([l,d])=>d.count===1||l==="...").map(([l])=>l).join("");else if(!a.match(RegExp(Un)))throw new Error("Invalid RHS");(o=a.match(RegExp(Ai,"g")))==null||o.forEach(l=>{if(l==="...")this.outputDims=this.outputDims.concat(this.ellipsisDims);else{let d=this.symbolToInfo.get(l);if(d===void 0)throw new Error("Invalid RHS symbol");this.outputDims.push(d.dimValue)}}),this.rhs=this.processTerm(a,!1,this.outputDims)}addSymbol(e,t,n){let a=this.symbolToInfo.get(e);if(a!==void 0){if(a.dimValue!==t&&a.count!==1)throw new Error("Dimension mismatch");a.count++,a.inputIndices.push(n)}else a={count:1,dimValue:t,inputIndices:[n]};this.symbolToInfo.set(e,a)}processTerm(e,t,n,a=-1){let o=n.length,l=!1,d=[],c=0;if(!e.match(RegExp(Ir))&&!t&&e!=="")throw new Error("Invalid LHS term");let h=e.match(RegExp(Ai,"g")),f=new sc(a);return h==null||h.forEach((g,_)=>{if(g==="..."){if(l)throw new Error("Only one ellipsis is allowed per input term");l=!0;let w=o-h.length+1;if(w<0)throw new Error("Ellipsis out of bounds");if(d=n.slice(c,c+w),this.hasEllipsis){if(this.ellipsisDims.length!==d.length||this.ellipsisDims.toString()!==d.toString())throw new Error("Ellipsis dimensions mismatch")}else if(t)this.hasEllipsis=!0,this.ellipsisDims=d;else throw new Error("Ellipsis must be specified in the LHS");for(let x=0;x<d.length;x++){let v=String.fromCharCode(48+x);f.addSymbol(v,_+x),this.addSymbol(v,n[c++],a)}}else f.addSymbol(g,_+(this.hasEllipsis?this.ellipsisDims.length-1:0)),this.addSymbol(g,n[c++],a)}),f}},Tr=e=>e+"_max",ac=(e,t,n,a)=>{let o=e.map(f=>f.length).map((f,g)=>U(`input${g}`,t,f)),l=L.size(a),d=H("output",t,a.length),c=[...n.symbolToInfo.keys()].filter(f=>!n.rhs.symbolToIndices.has(f)),h=f=>{let g=[],_="var prod = 1.0;",w="var sum = 0.0;",x="sum += prod;",v=[],S=[],T=[],k=[],E=n.symbolToInfo.size===n.rhs.symbolToIndices.size;n.symbolToInfo.forEach((z,C)=>{var M;if(n.rhs.symbolToIndices.has(C)){let D=(M=n.rhs.symbolToIndices.get(C))==null?void 0:M[0];D!==void 0&&n.lhs.forEach((N,W)=>{if(z.inputIndices.includes(W)){let q=N.symbolToIndices.get(C);if(q===void 0)throw new Error("Invalid symbol error");q.forEach(ie=>{g.push(`${o[W].indicesSet(`input${W}Indices`,ie,d.indicesGet("outputIndices",D))}`)})}})}else n.lhs.forEach((D,N)=>{if(z.inputIndices.includes(N)){let W=D.symbolToIndices.get(C);if(W===void 0)throw new Error("Invalid symbol error");W.forEach(q=>{v.push(`${o[N].indicesSet(`input${N}Indices`,q,`${C}`)}`)}),k.push(`prod *= ${o[N].getByIndices(`input${N}Indices`)};`)}}),S.push(`for(var ${C}: u32 = 0; ${C} < uniforms.${Tr(C)}; ${C}++) {`),T.push("}")});let A=E?[...g,`let sum = ${o.map((z,C)=>z.getByIndices(`input${C}Indices`)).join(" * ")};`]:[...g,w,...S,...v,_,...k,x,...T];return`
            ${f.registerUniforms(c.map(z=>({name:`${Tr(z)}`,type:"u32"}))).registerUniform("outputSize","u32").declareVariables(...o,d)}

            ${f.mainStart()}
            ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
            var outputIndices = ${d.offsetToIndices("global_idx")};
            ${o.map((z,C)=>`var input${C}Indices: ${o[C].type.indices};`).join(`
`)}
            ${A.join(`
`)};
            ${d.setByOffset("global_idx","sum")};
          }`};return{name:"Einsum",shaderCache:{hint:n.equation,inputDependencies:e.map(()=>"rank")},getRunData:()=>{let f=c.filter(_=>n.symbolToInfo.has(_)).map(_=>{var w;return{type:12,data:((w=n.symbolToInfo.get(_))==null?void 0:w.dimValue)||0}});f.push({type:12,data:l});let g=e.map((_,w)=>[...ee(_)]).reduce((_,w)=>_.concat(w),f);return g.push(...ee(a)),{outputs:[{dims:a,dataType:t}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:g}},getShaderSource:h}},oc=(e,t)=>{let n=new rc(e.inputs,t.equation),a=n.outputDims,o=e.inputs.map((l,d)=>l.dims);e.compute(ac(o,e.inputs[0].dataType,n,a))},uc=e=>{let t=e.equation.replace(/\s+/g,"");return xe({equation:t})}}),lc,Ar,dc,cc,pc,Gg=$(()=>{"use strict";re(),le(),de(),lc=e=>{if(!e||e.length!==2)throw new Error("Expand requires 2 input.");let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),a=n.length<t.length?0:n.length-t.length,o=t.length<n.length?0:t.length-n.length;for(;a<n.length&&o<t.length;++a,++o)if(n[a]!==t[o]&&n[a]!==1&&t[o]!==1)throw new Error("Expand requires shape to be broadcastable to input")},Ar=(e,t)=>{let n=e.length-t.length,a=[];for(let o=0;o<n;++o)a.push(e[o]);for(let o=0;o<t.length;++o)a.push(t[o]===1?e[o+n]:t[o]);return a},dc=(e,t)=>e.length>t.length?Ar(e,t):Ar(t,e),cc=e=>{let t=e[0].dims,n=Array.from(e[1].getBigInt64Array(),Number),a=dc(t,n),o=e[0].dataType,l=o===9||L.size(t)===1,d=o===9||t.length>0&&t[t.length-1]%4===0?4:1,c=l||a.length>0&&a[a.length-1]%4===0?4:1,h=Math.ceil(L.size(a)/c),f=_=>{let w=U("input",o,t.length,d),x=H("output",o,a.length,c),v;if(o===9){let S=(T,k,E="")=>`
          let outputIndices${k} = ${x.offsetToIndices(`outputOffset + ${k}u`)};
          let offset${k} = ${w.broadcastedIndicesToOffset(`outputIndices${k}`,x)};
          let index${k} = offset${k} / 4u;
          let component${k} = offset${k} % 4u;
          ${T}[${k}] = ${E}(${w.getByOffset(`index${k}`)}[component${k}]);
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
        let inputOffset = ${w.broadcastedIndicesToOffset("outputIndices",x)};
        let data = ${x.type.value}(${w.getByOffset(`inputOffset / ${d}`)});
        ${x.setByOffset("global_idx","data")}
      }`;return`
    ${_.registerUniform("vec_size","u32").declareVariables(w,x)}
    ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.vec_size")}
    ${v}`},g=[{type:12,data:h},...ee(t,a)];return{name:"Expand",shaderCache:{hint:`${a.length};${d}${c}`,inputDependencies:["rank"]},getShaderSource:f,getRunData:()=>({outputs:[{dims:a,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:g})}},pc=e=>{lc(e.inputs),e.compute(cc(e.inputs),{inputs:[0]})}}),hc,fc,Hg=$(()=>{"use strict";re(),le(),de(),ar(),hc=e=>{let t=e[0].dataType,n=L.size(e[0].dims),a=L.size(e[1].dims),o=a%4===0,l=d=>{let c=U("x",t,[1],4),h=U("bias",t,[1],4),f=H("y",t,[1],4),g=[{name:"output_vec_size",type:"u32"},{name:"bias_size",type:"u32"}],_=x=>`
      let bias${x}_offset: u32 = (global_idx * 4 + ${x}) % uniforms.bias_size;
      let bias${x} = ${h.getByOffset(`bias${x}_offset / 4`)}[bias${x}_offset % 4];`,w=o?`
      let bias = ${h.getByOffset("global_idx % (uniforms.bias_size / 4)")};`:`${_(0)}${_(1)}${_(2)}${_(3)}
      let bias = ${c.type.value}(bias0, bias1, bias2, bias3);`;return`${d.registerUniforms(g).declareVariables(c,h,f)}

    ${sr(Fe(t))}

    ${d.mainStart(_n)}
      ${d.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_vec_size")}

      let x = ${c.getByOffset("global_idx")};
      ${w}
      let x_in = x + bias;
      ${f.setByOffset("global_idx",rr("x_in"))}
    }`};return{name:"FastGeluWithBias",shaderCache:{hint:`${o}`,inputDependencies:["type","type"]},getShaderSource:l,getRunData:d=>({outputs:[{dims:d[0].dims,dataType:d[0].dataType}],programUniforms:[{type:12,data:Math.ceil(n/4)},{type:12,data:a}],dispatchGroup:{x:Math.ceil(n/_n/4)}})}},fc=e=>{e.inputs.length<2||L.size(e.inputs[1].dims)===0?Wl(e):e.compute(hc(e.inputs))}}),mc,gc,_c,yc,Kg=$(()=>{"use strict";re(),le(),Oe(),de(),mc=e=>{if(!e||e.length!==2)throw new Error("Gather requires 2 inputs.")},gc=(e,t)=>{let n=e[0].dims,a=e[1].dims,o=n.length,l=L.normalizeAxis(t.axis,o),d=n.slice(0);d.splice(l,1,...a);let c=n[l],h=e[0].dataType===9?4:1,f=Math.ceil(L.size(d)/h),g=[{type:12,data:f},{type:6,data:c},{type:12,data:l},...ee(e[0].dims,e[1].dims,d)],_=w=>{let x=U("data",e[0].dataType,e[0].dims.length,h),v=U("inputIndices",e[1].dataType,e[1].dims.length),S=H("output",e[0].dataType,d.length,h),T=E=>{let A=a.length,z=`var indicesIndices${E}  = ${v.type.indices}(0);`;for(let C=0;C<A;C++)z+=`${A>1?`indicesIndices${E}[${C}]`:`indicesIndices${E}`} = ${d.length>1?`outputIndices${E}[uniforms.axis + ${C}]`:`outputIndices${E}`};`;z+=`
          var idx${E} = ${v.getByIndices(`indicesIndices${E}`)};
          if (idx${E} < 0) {
            idx${E} = idx${E} + uniforms.axisDimLimit;
          }
          var dataIndices${E} : ${x.type.indices};
        `;for(let C=0,M=0;C<o;C++)C===l?(z+=`${o>1?`dataIndices${E}[${C}]`:`dataIndices${E}`} = u32(idx${E});`,M+=A):(z+=`${o>1?`dataIndices${E}[${C}]`:`dataIndices${E}`} = ${d.length>1?`outputIndices${E}[${M}]`:`outputIndices${E}`};`,M++);return z},k;if(e[0].dataType===9){let E=(A,z,C="")=>`
          let outputIndices${z} = ${S.offsetToIndices(`outputOffset + ${z}u`)};
          ${T(z)};
          let offset${z} = ${x.indicesToOffset(`dataIndices${z}`)};
          let index${z} = offset${z} / 4u;
          let component${z} = offset${z} % 4u;
          ${A}[${z}] = ${C}(${x.getByOffset(`index${z}`)}[component${z}]);
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
      ${w.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(x,v,S)}
      ${w.mainStart()}
        ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        ${k}
      }`};return{name:"Gather",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:d,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:g}),getShaderSource:_}},_c=e=>xe({axis:e.axis}),yc=(e,t)=>{let n=e.inputs;mc(n),e.compute(gc(e.inputs,t))}}),wc,$c,bc,Zg=$(()=>{"use strict";re(),le(),de(),wc=(e,t,n,a,o,l,d,c,h)=>{let f=[{type:12,data:l},{type:12,data:a},{type:12,data:o},{type:12,data:n},{type:12,data:d},{type:12,data:c},{type:12,data:h}],g=[l];f.push(...ee(t.dims,g));let _=w=>{let x=U("indices_data",t.dataType,t.dims.length),v=H("input_slice_offsets_data",12,1,1),S=[x,v],T=[{name:"output_size",type:"u32"},{name:"batch_dims",type:"u32"},{name:"input_dims",type:"u32",length:o.length},{name:"sizes_from_slice_dims_data",type:"u32",length:n.length},{name:"num_slices_per_batch",type:"u32"},{name:"input_batch_stride",type:"u32"},{name:"num_slice_dims",type:"u32"}];return`
  ${w.registerUniforms(T).declareVariables(...S)}
  ${w.mainStart()}
    ${w.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let batch_idx = global_idx / uniforms.num_slices_per_batch;
    let base_offset = batch_idx * uniforms.input_batch_stride;

    let slice_indices_base_offset = global_idx * uniforms.num_slice_dims;
    var relative_slice_offset = 0;
    for (var dim_idx = 0u; dim_idx < uniforms.num_slice_dims; dim_idx ++) {
      var index = i32(indices_data[dim_idx + slice_indices_base_offset].x);
      let input_dim_idx = uniforms.batch_dims + dim_idx;
      if (index < 0) {
        ${o.length===1?"index += i32(uniforms.input_dims);":"index += i32(uniforms.input_dims[input_dim_idx]);"}
      }
      ${n.length===1?"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data);":"relative_slice_offset += index * i32(uniforms.sizes_from_slice_dims_data[dim_idx]);"}
    }

    input_slice_offsets_data[global_idx] =  base_offset + u32(relative_slice_offset);
  }`};return e.compute({name:"computeSliceOffsets",shaderCache:{hint:`${o.length}_${n.length}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:g,dataType:e.inputs[1].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:f}),getShaderSource:_},{inputs:[t],outputs:[-1]})[0]},$c=(e,t)=>{let n=e.inputs,a=n[0].dims,o=n[0].dataType,l=n[1].dims,d=l[l.length-1],c=L.sizeToDimension(l,l.length-1),h=L.sizeFromDimension(a,t.batchDims+d),f=L.sizeToDimension(a,t.batchDims),g=L.sizeFromDimension(a,t.batchDims),_=c/f,w=new Array(d),x=h;for(let z=0;z<d;++z)w[d-1-z]=x,x*=a[t.batchDims+d-1-z];let v=wc(e,n[1],w,t.batchDims,a,c,_,g,d),S=t.batchDims+d;if(S>a.length)throw new Error("last dimension of indices must not be larger than rank of input tensor");let T=l.slice(0,-1).concat(a.slice(S)),k=L.size(T),E=[{type:12,data:k},{type:12,data:h},...ee(n[0].dims,v.dims,T)],A=z=>{let C=U("data",n[0].dataType,n[0].dims.length),M=U("slice_offsets",12,v.dims.length),D=H("output",n[0].dataType,T.length);return`
          ${z.registerUniform("output_size","u32").registerUniform("slice_size","u32").declareVariables(C,M,D)}
            ${z.mainStart()}
            ${z.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let slice_offset = slice_offsets[global_idx / uniforms.slice_size];
          output[global_idx] = data[u32(slice_offset) + global_idx % uniforms.slice_size];
        }`};e.compute({name:"GatherND",shaderCache:{hint:t.cacheKey,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:T,dataType:o}],dispatchGroup:{x:Math.ceil(k/64)},programUniforms:E}),getShaderSource:A},{inputs:[n[0],v]})},bc=e=>({batchDims:e.batch_dims,cacheKey:""})}),vc,xc,Ec,kc,Xg=$(()=>{"use strict";re(),le(),Oe(),de(),vc=(e,t)=>{if(e.length<3||e.length>4)throw new Error("GatherBlockQuantized requires 3 or 4 inputs.");let n=L.normalizeAxis(t.quantizeAxis,e[0].dims.length),a=t.blockSize,o=e[0],l=e[2],d=e.length===4?e[3]:void 0;if(l.dims.length!==o.dims.length||!o.dims.map((c,h)=>h===n?Math.ceil(c/a)===l.dims[h]:c===l.dims[h]).reduce((c,h)=>c&&h,!0))throw new Error("Scales must have the same rank as the input tensor and the dims should match except on gatherAxis.");if(d){if(d.dataType!==o.dataType)throw new Error("Zero point must have the same data type as the input tensor.");if(d.dims.length!==l.dims.length||!d.dims.map((c,h)=>c===l.dims[h]).reduce((c,h)=>c&&h,!0))throw new Error("Zero point must have the same rank as the input tensor and the dims should match except on quantizeAxis.")}},xc=(e,t)=>{let n=e[0].dims,a=e[1].dims,o=n.length,l=L.normalizeAxis(t.gatherAxis,o),d=L.normalizeAxis(t.quantizeAxis,o),c=n.slice(0);c.splice(l,1,...a);let h=L.size(c),f=e[2].dataType,g=e[0].dataType===22,_=[{type:12,data:h},{type:12,data:d},{type:12,data:l},{type:12,data:t.blockSize},...ee(...e.map((x,v)=>x.dims),c)],w=x=>{let v=U("data",e[0].dataType,e[0].dims.length),S=U("inputIndices",e[1].dataType,e[1].dims.length),T=U("scales",e[2].dataType,e[2].dims.length),k=e.length>3?U("zeroPoint",e[3].dataType,e[3].dims.length):void 0,E=H("output",f,c.length),A=[v,S,T];k&&A.push(k);let z=[{name:"output_size",type:"u32"},{name:"quantize_axis",type:"u32"},{name:"gather_axis",type:"u32"},{name:"block_size",type:"u32"}];return`
        ${x.registerUniforms(z).declareVariables(...A,E)}
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
        let dequantized_data = ${Fe(f)}(quantized_data - zero_point) * scale;
        ${E.setByOffset("global_idx","dequantized_data")};
    }`};return{name:"GatherBlockQuantized",shaderCache:{hint:`${t.cacheKey};${e.filter((x,v)=>v!==1).map(x=>x.dims.join("_")).join(";")}`,inputDependencies:Array.from({length:e.length},(x,v)=>"rank")},getRunData:()=>({outputs:[{dims:c,dataType:f}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:_}),getShaderSource:w}},Ec=(e,t)=>{let n=e.inputs;vc(n,t),e.compute(xc(e.inputs,t))},kc=e=>xe({blockSize:e.blockSize,gatherAxis:e.gatherAxis,quantizeAxis:e.quantizeAxis})}),Sc,Ic,Tc,Ac,Yg=$(()=>{"use strict";re(),le(),Oe(),de(),Sc=e=>{if(!e||e.length!==2)throw new Error("GatherElements requires 2 inputs.");if(e[0].dims.length<1)throw new Error("GatherElements requires that the data input be rank >= 1.");if(e[0].dims.length!==e[1].dims.length)throw new Error(`GatherElements requires that the data input and
                     indices input tensors be of same rank.`)},Ic=(e,t)=>{let n=e[0].dims,a=e[0].dataType,o=n.length,l=e[1].dims,d=e[1].dataType,c=L.normalizeAxis(t.axis,o),h=n[c],f=l.slice(0),g=L.size(f),_=U("input",a,o),w=U("indicesInput",d,l.length),x=H("output",a,f.length),v=[{type:12,data:g},{type:6,data:h},{type:12,data:c}];return v.push(...ee(n,l,f)),{name:"GatherElements",shaderCache:{inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:f,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:v}),getShaderSource:S=>`
      ${S.registerUniform("outputSize","u32").registerUniform("axisDimLimit","i32").registerUniform("axis","u32").declareVariables(_,w,x)}
      ${S.mainStart()}
      ${S.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}

      let outputIndices = ${x.offsetToIndices("global_idx")};

      var idx = ${w.getByOffset("global_idx")};
      if (idx < 0) {
        idx = idx + uniforms.axisDimLimit;
      }
      var inputIndices = ${_.type.indices}(outputIndices);
      ${_.indicesSet("inputIndices","uniforms.axis","u32(idx)")};
      let value = ${_.getByIndices("inputIndices")};

      ${x.setByOffset("global_idx","value")};
  }`}},Tc=e=>xe({axis:e.axis}),Ac=(e,t)=>{let n=e.inputs;Sc(n),e.compute(Ic(e.inputs,t))}}),zc,Cc,Oc,Mc,Jg=$(()=>{"use strict";re(),le(),de(),zc=e=>{if(!e)throw new Error("Input is missing");if(e.length<2||e.length>3)throw new Error("Invaid input number.");if(e.length===3&&e[2].dims.length>2)throw new Error("Invalid input shape of C");if(e[0].dataType!==e[1].dataType||e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("Input types are mismatched")},Cc=(e,t)=>{let n=e[0].dims.slice(),a=e[1].dims.slice(),[o,l,d]=Po.getShapeOfGemmResult(n,t.transA,a,t.transB,e.length===3?e[2].dims:void 0),c=[o,l];if(!c)throw new Error("Can't use gemm on the given tensors");let h=16,f=Math.ceil(l/h),g=Math.ceil(o/h),_=!0,w=L.size(c),x=[{type:12,data:_?f:w},{type:12,data:o},{type:12,data:l},{type:12,data:d},{type:1,data:t.alpha},{type:1,data:t.beta}],v=["type","type"];e.length===3&&(x.push(...ee(e[2].dims)),v.push("rank")),x.push(...ee(c));let S=k=>{let E="";t.transA&&t.transB?E="value += a[k * uniforms.M + m] * b[n * uniforms.K + k];":t.transA&&!t.transB?E="value += a[k * uniforms.M + m] * b[k * uniforms.N + n];":!t.transA&&t.transB?E="value += a[m * uniforms.K + k] * b[n * uniforms.K + k];":!t.transA&&!t.transB&&(E="value += a[m * uniforms.K + k] * b[k * uniforms.N + n];");let A=t.alpha===1?"":"value *= uniforms.alpha;",z=U("a",e[0].dataType,e[0].dims),C=U("b",e[1].dataType,e[1].dims),M=z.type.value,D=null,N=[z,C];e.length===3&&(D=U("c",e[2].dataType,e[2].dims.length),N.push(D));let W=H("output",e[0].dataType,c.length);N.push(W);let q=[{name:"output_size",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}];return`
  ${k.registerUniforms(q).declareVariables(...N)}

  ${k.mainStart()}
    ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

    let m = global_idx / uniforms.N;
    let n = global_idx % uniforms.N;

    var value = ${M}(0);
    for (var k: u32 = 0u; k < uniforms.K; k++) {
      ${E}
    }

    ${A}
    ${D!=null?`let cOffset = ${D.broadcastedIndicesToOffset("vec2(m, n)",W)}; value += ${M}(uniforms.beta) * ${D.getByOffset("cOffset")};`:""}
    output[global_idx] = value;
  }`},T=k=>{let E=U("a",e[0].dataType,e[0].dims),A=U("b",e[1].dataType,e[1].dims),z=null,C=[E,A];e.length===3&&(z=U("c",e[2].dataType,e[2].dims.length),C.push(z));let M=H("output",e[0].dataType,c.length);C.push(M);let D=[{name:"num_tile_n",type:"u32"},{name:"M",type:"u32"},{name:"N",type:"u32"},{name:"K",type:"u32"},{name:"alpha",type:"f32"},{name:"beta",type:"f32"}],N="",W="";t.transA&&t.transB?(W=`
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
  ${k.registerUniforms(D).declareVariables(...C)}
  var<workgroup> tile_a: array<array<${E.type.storage}, ${h}>, ${h}>;
  var<workgroup> tile_b: array<array<${A.type.storage}, ${h}>, ${h}>;
  ${k.mainStart([h,h,1])}
    let tile_col_start = (workgroup_index % uniforms.num_tile_n) * ${h};
    let tile_row_start = (workgroup_index / uniforms.num_tile_n) * ${h};
    let num_tiles = (uniforms.K - 1) / ${h} + 1;
    var k_start = 0u;
    var value = ${M.type.value}(0);
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
    ${z!=null?`let cOffset = ${z.broadcastedIndicesToOffset("vec2(m, n)",M)}; value += ${M.type.value}(uniforms.beta) * ${z.getByOffset("cOffset")};`:""}
    if (m < uniforms.M && n < uniforms.N) {
      output[m * uniforms.N + n] = value;
    }
  }`};return _?{name:"GemmShared",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:c,dataType:e[0].dataType}],dispatchGroup:{x:f*g},programUniforms:x}),getShaderSource:T}:{name:"Gemm",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:c,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:x}),getShaderSource:S}},Oc=e=>{let t=e.transA,n=e.transB,a=e.alpha,o=e.beta;return{transA:t,transB:n,alpha:a,beta:o,cacheKey:`${e.transA};${e.transB};${e.alpha===1}`}},Mc=(e,t)=>{zc(e.inputs),e.compute(Cc(e.inputs,t))}}),wt,It,tn,nn,Pc,Rc,Dc,Bc,Lc,Nc,Uc,Fc,Wc,Vc,Qg=$(()=>{"use strict";re(),le(),Oe(),de(),[wt,It,tn,nn]=[0,1,2,3],Pc=e=>{if(e[0].dims.length!==4)throw new Error("only 4-D tensor is supported.");if(e[0].dims.length!==e[1].dims.length)throw new Error("input dimensions must be equal to grid dimensions");if(e[0].dims.length-2!==e[1].dims[e[1].dims.length-1])throw new Error(`last dimension of grid must be equal to ${e[0].dims.length-2}`);if(e[0].dims[0]!==e[1].dims[0])throw new Error("grid batch size must match input batch size")},Rc=`
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
`,Dc=e=>`
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
`,Bc=e=>`
  fn gs_denormalize(n: f32, length: i32) -> f32 {
    ${e.alignCorners===0?`
    // alignCorners: false => [-1, 1] to [-0.5, length - 0.5]
    return ((n + 1.0) * f32(length) - 1.0) / 2.0;
    `:`
    // alignCorners: true => [-1, 1] to [0, length - 1]
    return (n + 1.0) / 2.0 * (f32(length - 1));
    `}
  }
`,Lc=e=>`
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
`,Nc=(e,t,n)=>`
  fn pixel_at_grid(r: i32, c: i32, H: i32, W: i32, batch: u32, channel: u32, border: vec4<f32>) -> ${t} {
     var pixel = ${t}(0);
     var indices = vec4<u32>(0);
     indices[${wt}] = batch;
     indices[${It}] = channel;`+(()=>{switch(n.paddingMode){case"zeros":return`
          if (r >= 0 && r < H && c >=0 && c < W) {
            indices[${tn}] = u32(r);
            indices[${nn}] = u32(c);
          } else {
            return ${t}(0);
          }
        `;case"border":return`
          indices[${tn}] = u32(clamp(r, 0, H - 1));
          indices[${nn}] = u32(clamp(c, 0, W - 1));
        `;case"reflection":return`
          indices[${tn}] = gs_reflect(r, border[1], border[3]);
          indices[${nn}] = gs_reflect(c, border[0], border[2]);
        `;default:throw new Error(`padding mode ${n.paddingMode} is not supported`)}})()+`
    return ${e.getByIndices("indices")};
  }
`,Uc=(e,t,n)=>(()=>{switch(n.mode){case"nearest":return`
          let result = pixel_at_grid(i32(round(y)), i32(round(x)), H_in, W_in, indices[${wt}], indices[${It}], border);
        `;case"bilinear":return`
          let x1 = i32(floor(x));
          let y1 = i32(floor(y));
          let x2 = x1 + 1;
          let y2 = y1 + 1;

          let p11 = pixel_at_grid(y1, x1, H_in, W_in, indices[${wt}], indices[${It}], border);
          let p12 = pixel_at_grid(y1, x2, H_in, W_in, indices[${wt}], indices[${It}], border);
          let p21 = pixel_at_grid(y2, x1, H_in, W_in, indices[${wt}], indices[${It}], border);
          let p22 = pixel_at_grid(y2, x2, H_in, W_in, indices[${wt}], indices[${It}], border);

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
              p[h][w] = pixel_at_grid(h + y0, w + x0, H_in, W_in, indices[${wt}], indices[${It}], border);
            }
          }

          let dx = x - f32(x0 + 1);
          let dy = y - f32(y0 + 1);
          let result = gs_bicubic_interpolate(p, dx, dy);
        `;default:throw new Error(`mode ${n.mode} is not supported`)}})()+`${e.setByOffset("global_idx","result")}`,Fc=(e,t)=>{let n=U("x",e[0].dataType,e[0].dims.length),a=[e[1].dims[0],e[1].dims[1],e[1].dims[2]],o=U("grid",e[1].dataType,a.length,2),l=[e[0].dims[0],e[0].dims[1],e[1].dims[1],e[1].dims[2]];t.format==="NHWC"&&(l=[e[0].dims[0],e[1].dims[1],e[1].dims[2],e[0].dims[3]],[wt,It,tn,nn]=[0,3,1,2]);let d=H("output",e[0].dataType,l.length),c=n.type.value,h=L.size(l),f=[{type:12,data:h},...ee(e[0].dims,a,l)],g=_=>`
  ${_.registerUniform("output_size","u32").declareVariables(n,o,d)}
  ${Rc}
  ${Dc(c)}
  ${Bc(t)}
  ${Lc(t)}
  ${Nc(n,c,t)}

  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let H_in = i32(uniforms.x_shape[${tn}]);
      let W_in = i32(uniforms.x_shape[${nn}]);

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
      var grid_indices = vec3<u32>(indices[${wt}], indices[${tn}], indices[${nn}]);
      let nxy = ${o.getByIndices("grid_indices")};
      var x = gs_denormalize(f32(nxy[0]), W_in);
      var y = gs_denormalize(f32(nxy[1]), H_in);

      ${Uc(d,c,t)}
  }`;return{name:"GridSample",shaderCache:{hint:`${t.cacheKey}`,inputDependencies:["type","type"]},getRunData:_=>{let w=L.size(l);return{outputs:[{dims:l,dataType:_[0].dataType}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:f}},getShaderSource:g}},Wc=(e,t)=>{Pc(e.inputs),e.compute(Fc(e.inputs,t))},Vc=e=>xe({alignCorners:e.align_corners,mode:e.mode,paddingMode:e.padding_mode,format:e.format})}),Qe,jc,qc,zr,Gc,Fn,Hc,Kc=$(()=>{"use strict";re(),le(),Oe(),qs(),nr(),de(),Mt(),Qe=(e,t)=>e.length>t&&e[t].dims.length>0?e[t]:void 0,jc=(e,t)=>{let n=e[0],a=Qe(e,1),o=Qe(e,2),l=Qe(e,3),d=Qe(e,4),c=Qe(e,5),h=Qe(e,6),f=Qe(e,7);if(n.dims.length!==3&&n.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let g=n.dims[0],_=n.dims[1],w=n.dims.length===3?n.dims[2]:t.numHeads*n.dims[4],x=_,v=0,S=0,T=Math.floor(w/t.numHeads);if(h&&f&&L.size(h.dims)&&L.size(f.dims)){if(h.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(h.dims[0]!==g||h.dims[1]!==t.numHeads||h.dims[3]!==T)throw new Error('Input "past_key" shape (batch_size, num_heads, past_sequence_length, head_size)');if(f.dims[0]!==g||f.dims[1]!==t.numHeads||f.dims[3]!==T)throw new Error('Input "past_value" shape (batch_size, num_heads, past_sequence_length, head_size)');if(h.dims[2]!==f.dims[2])throw new Error('Input "past_key" and "past_value" shall have same dim 2 (past_sequence_length)');if(f.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');v=h.dims[2],S=h.dims[2]}else if(h&&L.size(h.dims)||f&&L.size(f.dims))throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let k;if(a&&L.size(a.dims)>0){if(n.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(a.dims[2]!==n.dims[2])throw new Error('Input "query" and "key" shall have same dim 2 (hidden_size)');k=2,x=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==T)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(o)throw new Error('Expect "value" be none when "key" has packed kv format.');k=5,x=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==T)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');k=0,x=a.dims[2]}}else{if(n.dims.length!==5)throw new Error('Input "query" is expected to have 5 dimensions when key is empty');if(n.dims[2]!==t.numHeads||n.dims[3]!==3)throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');k=3}if(l&&L.size(l.dims)>0){if(l.dims.length!==1)throw new Error('Input "bias" is expected to have 1 dimension');if(a&&a.dims.length===5&&a.dims[3]===2)throw new Error("bias is not allowed for packed kv.")}let E=v+x,A=0;if(d&&L.size(d.dims)>0){A=8;let D=d.dims;throw D.length===1?D[0]===g?A=1:D[0]===3*g+2&&(A=3):D.length===2&&D[0]===g&&D[1]===E&&(A=5),A===8?new Error('Input "key_padding_mask" shape shall be (batch_size) or (batch_size, total_sequence_length)'):new Error("Mask not supported")}let z=!1,C=w;if(o&&L.size(o.dims)>0){if(o.dims.length!==3&&o.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==o.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(o.dims.length===3){if(x!==o.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');C=o.dims[2]}else{if(x!==o.dims[2])throw new Error('Input "key" and "value" shall have the same dim 2 (kv_sequence_length)');C=o.dims[1]*o.dims[3],z=!0}}let M=!1;if(d&&L.size(d.dims)>0)throw new Error("Key padding mask is not supported");if(c&&L.size(c.dims)>0){if(c.dims.length!==4)throw new Error('Input "attention_bias" is expected to have 4 dimensions');if(c.dims[0]!==g||c.dims[1]!==t.numHeads||c.dims[2]!==_||c.dims[3]!==E)throw new Error('Expect "attention_bias" shape (batch_size, num_heads, sequence_length, total_sequence_length)')}return{batchSize:g,sequenceLength:_,pastSequenceLength:v,kvSequenceLength:x,totalSequenceLength:E,maxSequenceLength:S,inputHiddenSize:0,hiddenSize:w,vHiddenSize:C,headSize:T,vHeadSize:Math.floor(C/t.numHeads),numHeads:t.numHeads,isUnidirectional:!1,pastPresentShareBuffer:!1,maskFilterValue:t.maskFilterValue,maskType:A,scale:t.scale,broadcastResPosBias:M,passPastInKv:z,qkvFormat:k}},qc=e=>xe({...e}),zr=xe({perm:[0,2,1,3]}),Gc=(e,t,n,a,o,l,d)=>{let c=[a,o,l],h=L.size(c),f=[{type:12,data:h},{type:12,data:d},{type:12,data:l}],g=_=>{let w=H("qkv_with_bias",t.dataType,c),x=U("qkv",t.dataType,c),v=U("bias",n.dataType,c),S=[{name:"output_size",type:"u32"},{name:"bias_offset",type:"u32"},{name:"hidden_size",type:"u32"}];return`
  ${_.registerUniforms(S).declareVariables(x,v,w)}
  ${_.mainStart()}
    ${_.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let bias_offset_idx = (global_idx % uniforms.hidden_size) + uniforms.bias_offset;

    qkv_with_bias[global_idx] = qkv[global_idx] + bias[bias_offset_idx];
  }`};return e.compute({name:"MultiHeadAttentionAddBias",shaderCache:{inputDependencies:["type","type"]},getRunData:()=>({outputs:[{dims:c,dataType:t.dataType,gpuDataType:0}],dispatchGroup:{x:Math.ceil(h/64)},programUniforms:f}),getShaderSource:g},{inputs:[t,n],outputs:[-1]})[0]},Fn=(e,t,n,a,o,l,d,c)=>{let h=l;if(d&&L.size(d.dims)>0){if(a===1)throw new Error("AddBiasReshape is not implemented. Please export your model with packed QKV or KV");return h=Gc(e,l,d,t,a,n*o,c),h=h.reshape([t,a,n,o]),n===1||a===1?h:e.compute(at(h,zr.perm),{inputs:[h],outputs:[-1]})[0]}else return l.dims.length===3&&(h=l.reshape([t,a,n,o])),n===1||a===1?h:e.compute(at(h,zr.perm),{inputs:[h],outputs:[-1]})[0]},Hc=(e,t)=>{let n=jc(e.inputs,t),a=e.inputs[0],o=Qe(e.inputs,1),l=Qe(e.inputs,2),d=Qe(e.inputs,3),c=Qe(e.inputs,4),h=Qe(e.inputs,5),f=Qe(e.inputs,6),g=Qe(e.inputs,7);if(a.dims.length===5)throw new Error("Packed QKV is not implemented");if((o==null?void 0:o.dims.length)===5)throw new Error("Packed KV is not implemented");let _=o&&l&&o.dims.length===4&&l.dims.length===4,w=Fn(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,a,d,0);if(_)return Rn(e,w,o,l,c,void 0,f,g,h,n);if(!o||!l)throw new Error("key and value must be provided");let x=Fn(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.headSize,o,d,n.hiddenSize),v=Fn(e,n.batchSize,n.numHeads,n.kvSequenceLength,n.vHeadSize,l,d,2*n.hiddenSize);Rn(e,w,x,v,c,void 0,f,g,h,n)}}),Zc,Xc,Yc,Jc,Cr,Qc,ep,tp=$(()=>{"use strict";re(),le(),Oe(),de(),Zc=e=>{if(!e||e.length<1)throw new Error("too few inputs")},Xc=(e,t)=>{let n=[],a=t.numOutputs;return e[1].dims[0]>0&&(e[1].getBigInt64Array().forEach(o=>n.push(Number(o))),a=n.length),xe({numOutputs:a,axis:t.axis,splitSizes:n})},Yc=e=>`
fn calculateOutputIndex(index: u32) -> u32 {
    for (var i: u32 = 0u; i < ${e}u; i += 1u ) {
    if (index < ${Y("uniforms.size_in_split_axis","i",e)}) {
        return i;
    }
    }
    return ${e}u;
}`,Jc=e=>{let t=e.length,n=[];for(let a=0;a<t;++a){let o=e[a].setByIndices("indices","input[global_idx]");t===1?n.push(o):a===0?n.push(`if (output_number == ${a}u) { ${o} }`):a===t-1?n.push(`else { ${o} }`):n.push(`else if (output_number == ${a}) { ${o} }`)}return`
      fn writeBufferData(output_number: u32, indices: ${e[0].type.indices}, global_idx: u32) {
        ${n.join(`
`)}
      }`},Cr=(e,t)=>{let n=e[0].dims,a=L.size(n),o=e[0].dataType,l=L.normalizeAxis(t.axis,n.length),d=new Array(t.numOutputs),c=U("input",o,n.length),h=new Array(t.numOutputs),f=[],g=[],_=0,w=[{type:12,data:a}];for(let v=0;v<t.numOutputs;v++){_+=t.splitSizes[v],h[v]=_;let S=n.slice();S[l]=t.splitSizes[v],g.push(S),d[v]=H(`output${v}`,o,S.length),f.push({dims:g[v],dataType:e[0].dataType})}w.push({type:12,data:h},...ee(n,...g));let x=v=>`
  ${v.registerUniform("input_size","u32").registerUniform("size_in_split_axis","u32",h.length).declareVariables(c,...d)}
  ${Yc(h.length)}
  ${Jc(d)}

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
  }`;return{name:"Split",shaderCache:{hint:t.cacheKey,inputDependencies:["rank"]},getShaderSource:x,getRunData:()=>({outputs:f,dispatchGroup:{x:Math.ceil(a/64)},programUniforms:w})}},Qc=(e,t)=>{Zc(e.inputs);let n=e.inputs.length===1?t:Xc(e.inputs,t);e.compute(Cr(e.inputs,n),{inputs:[0]})},ep=e=>{let t=e.axis,n=e.splitSizes,a=e.numOutputs<0?n.length:e.numOutputs;if(a!==n.length)throw new Error("numOutputs and splitSizes length must be equal");return xe({axis:t,numOutputs:a,splitSizes:n})}}),np,zi,ip,sp=$(()=>{"use strict";re(),le(),Oe(),de(),np=(e,t)=>{let[n,a,o,l]=e,{numHeads:d,rotaryEmbeddingDim:c}=t;if(n.dims.length!==3&&n.dims.length!==4)throw new Error(`Input 'x' is expected to have 3 or 4 dimensions, got ${n.dims.length}`);if(!L.areEqual(a.dims,[])&&!L.areEqual(a.dims,[1])&&a.dims.length!==2)throw new Error(`Input 'position_ids' is expected to have 0, 1, or 2 dimensions, got ${a.dims.length}`);if(o.dims.length!==2)throw new Error(`Input 'cos_cache' is expected to have 2 dimensions, got ${o.dims.length}`);if(l.dims.length!==2)throw new Error(`Input 'sin_cache' is expected to have 2 dimensions, got ${l.dims.length}`);if(!L.areEqual(o.dims,l.dims))throw new Error("Inputs 'cos_cache' and 'sin_cache' are expected to have the same shape");if(c>0&&d===0)throw new Error("num_heads must be provided if rotary_embedding_dim is specified");let h=n.dims[0],f=n.dims[n.dims.length-2],g=o.dims[0],_=L.sizeFromDimension(n.dims,1)/f,w=c===0?o.dims[1]*2:_/d;if(c>w)throw new Error("rotary_embedding_dim must be less than or equal to head_size");if(a.dims.length===2){if(h!==a.dims[0])throw new Error(`Input 'position_ids' dimension 0 should be of size batch_size, got ${a.dims[0]}`);if(f!==a.dims[1])throw new Error(`Input 'position_ids' dimension 1 should be of size sequence_length, got ${a.dims[1]}`)}if(f>g)throw new Error("Updating cos_cache and sin_cache in RotaryEmbedding is not currently supported");if(w/2!==o.dims[1]&&c/2!==o.dims[1])throw new Error(`Input 'cos_cache' dimension 1 should be same as head_size / 2 or rotary_embedding_dim / 2, got ${o.dims[1]}`)},zi=(e,t)=>{let{interleaved:n,numHeads:a,rotaryEmbeddingDim:o,scale:l}=t,d=e[0].dims[0],c=L.sizeFromDimension(e[0].dims,1),h=e[0].dims[e[0].dims.length-2],f=c/h,g=e[2].dims[1],_=o===0?g*2:f/a,w=new Array(d,h,f/_,_-g),x=L.computeStrides(w),v=[{type:1,data:l},{type:12,data:w},{type:12,data:x},...e[0].dims.length===3?new Array({type:12,data:[c,f,_,1]}):[],...e[0].dims.length===4?new Array({type:12,data:[c,_,h*_,1]}):[],...ee(e[0].dims,e[1].dims,e[2].dims,e[3].dims,e[0].dims)],S=T=>{let k=U("input",e[0].dataType,e[0].dims.length),E=U("position_ids",e[1].dataType,e[1].dims.length),A=U("cos_cache",e[2].dataType,e[2].dims.length),z=U("sin_cache",e[3].dataType,e[3].dims.length),C=H("output",e[0].dataType,e[0].dims.length);return T.registerUniforms([{name:"scale",type:"f32"},{name:"global_shape",type:"u32",length:w.length},{name:"global_strides",type:"u32",length:x.length},{name:"input_output_strides",type:"u32",length:x.length}]),`
        ${T.declareVariables(k,E,A,z,C)}

        ${T.mainStart(_n)}
          let half_rotary_emb_dim = uniforms.${A.name}_shape[1];
          let bsnh = global_idx / uniforms.global_strides % uniforms.global_shape;
          let size = uniforms.global_shape[0] * uniforms.global_strides[0];
          ${T.guardAgainstOutOfBoundsWorkgroupSizes("size")}

          if (bsnh[3] < half_rotary_emb_dim) {
            let position_ids_idx =
                ${E.broadcastedIndicesToOffset("bsnh.xy",H("",E.type.tensor,2))};
            let position_id =
                u32(${E.getByOffset("position_ids_idx")}) + select(0, bsnh[1], position_ids_idx == 0);
            let i = dot(bsnh, uniforms.input_output_strides) + select(0, bsnh[3], ${n});
            let j = i + select(half_rotary_emb_dim, 1, ${n});
            let re = ${k.getByOffset("i")} * ${A.get("position_id","bsnh[3]")} -
                ${k.getByOffset("j")} * ${z.get("position_id","bsnh[3]")};
            ${C.setByOffset("i","re")}
            let im = ${k.getByOffset("i")} * ${z.get("position_id","bsnh[3]")} +
                ${k.getByOffset("j")} * ${A.get("position_id","bsnh[3]")};
            ${C.setByOffset("j","im")}
          } else {
            let k = dot(bsnh, uniforms.input_output_strides) + half_rotary_emb_dim;
            ${C.setByOffset("k",k.getByOffset("k"))}
          }
        }`};return{name:"RotaryEmbedding",shaderCache:{hint:xe({interleaved:n}).cacheKey,inputDependencies:["rank","rank","rank","rank"]},getShaderSource:S,getRunData:()=>({outputs:[{dims:e[0].dims,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(L.size(w)/_n)},programUniforms:v})}},ip=(e,t)=>{np(e.inputs,t),e.compute(zi(e.inputs,t))}}),rp,ap,Or,op,up,e0=$(()=>{"use strict";Oe(),re(),nr(),Kc(),tp(),Mt(),sp(),de(),rp=(e,t)=>{if(t.doRotary&&e.length<=7)throw new Error("cos_cache and sin_cache inputs are required if do_rotary is specified");let n=e[0],a=e[1],o=e[2],l=e[3],d=e[4];if(t.doRotary!==0&&e.length<=7)throw new Error("cos_cast and sin_cache are expected if do_rotary attribute is non-zero");if(t.localWindowSize!==-1)throw new Error("Local attention is not supported");if(t.softcap!==0)throw new Error("Softcap is not supported");if(t.rotaryInterleaved!==0)throw new Error("Rotary interleaved is not supported");if(t.smoothSoftmax)throw new Error("Smooth softmax is not supported");if(n.dims.length!==3&&n.dims.length!==5)throw new Error("Input query is expected to have 3 or 5 dimensions");let c=!1,h=n.dims[0],f=n.dims[1],g=n.dims.length===3?c?n.dims[2]/3:n.dims[2]:t.numHeads*n.dims[4],_=f,w=0,x=!a||a.dims.length===0,v=Math.floor(x?g/(t.numHeads+2*t.kvNumHeads):g/t.numHeads);x&&(g=v*t.numHeads);let S=l&&l.dims.length!==0,T=d&&d.dims.length!==0;if(S&&l.dims.length===4&&l.dims[0]===h&&l.dims[1]!==t.kvNumHeads&&l.dims[2]===t.kvNumHeads&&l.dims[3]===v)throw new Error("BSNH pastKey/pastValue is not supported");if(S&&T){if(l.dims.length!==4)throw new Error('Input "past_key" is expected to have 4 dimensions');if(d.dims.length!==4)throw new Error('Input "past_value" is expected to have 4 dimensions');w=l.dims[2]}else if(S||T)throw new Error('Input "past_key" and "past_value" shall be both present or both absent');let k=1;if(a&&a.dims.length>0){if(n.dims.length!==3)throw new Error('Input "query" is expected to have 3 dimensions when key is given');if(a.dims.length<3||a.dims.length>5)throw new Error('Input "key" is expected to have 3, 4, or 5 dimensions');if(n.dims[0]!==a.dims[0])throw new Error('Input "query" and "key" shall have same dim 0 (batch size)');if(a.dims.length===3){if(n.dims[2]%a.dims[2]!==0)throw new Error('Dimension 2 of "query" should be a multiple of "key"');_=a.dims[1]}else if(a.dims.length===5){if(a.dims[2]!==t.numHeads||a.dims[3]!==2||a.dims[4]!==v)throw new Error('Expect "key" shape (batch_size, kv_sequence_length, num_heads, 2, head_size) for packed kv');if(o)throw new Error('Expect "value" be none when "key" has packed kv format.');_=a.dims[1]}else{if(a.dims[1]!==t.numHeads||a.dims[3]!==v)throw new Error('Expect "key" shape (batch_size, num_heads, kv_sequence_length, head_size) for past_key');_=a.dims[2]}}else{if(n.dims.length!==3&&n.dims.length!==5)throw new Error('Input "query" is expected to have 3 or 5 dimensions when key is empty');if(n.dims.length===5&&(n.dims[2]!==t.numHeads||n.dims[3]!==3))throw new Error('Expect "query" shape (batch_size, kv_sequence_length, num_heads, 3, head_size) for packed kv');k=3}let E=0,A=!1,z=t.kvNumHeads?v*t.kvNumHeads:g;if(o&&o.dims.length>0){if(o.dims.length!==3&&o.dims.length!==4)throw new Error('Input "value" is expected to have 3 or 4 dimensions');if(n.dims[0]!==o.dims[0])throw new Error('Input "query" and "value" shall have same dim 0 (batch_size)');if(o.dims.length===3){if(_!==o.dims[1])throw new Error('Input "key" and "value" shall have the same dim 1 (kv_sequence_length)');z=o.dims[2]}else{if(_!==o.dims[2])throw new Error('Input "past_key" and "past_value" shall have the same dim 2 (kv_sequence_length)');z=o.dims[1]*o.dims[3],A=!0}}let C=e.length>4?e[5]:void 0;if(C){if(C.dims.length===0)throw new Error("seqlens_k must be at least 1D, got scalar.");let M=C.dims.reduce((D,N)=>D*N,1);if(M!==h)throw new Error(`seqlens_k must have batch_size (${h}) elements, got ${M}.`);for(let D=0;D<C.dims.length;D++)if(C.dims[D]!==1&&C.dims[D]!==h)throw new Error(`seqlens_k has unexpected shape. Each dimension must be 1 or batch_size (${h}), got dims[${D}] = ${C.dims[D]}.`)}return{batchSize:h,sequenceLength:f,pastSequenceLength:w,kvSequenceLength:_,totalSequenceLength:-1,maxSequenceLength:-1,inputHiddenSize:0,hiddenSize:g,vHiddenSize:z,headSize:v,vHeadSize:Math.floor(z/t.kvNumHeads),numHeads:t.numHeads,kvNumHeads:t.kvNumHeads,nReps:t.numHeads/t.kvNumHeads,pastPresentShareBuffer:!1,maskType:E,scale:t.scale,broadcastResPosBias:!1,passPastInKv:A,qkvFormat:k}},ap=xe({perm:[0,2,1,3]}),Or=(e,t,n)=>{let a=t,o=n.kvNumHeads;return t.dims.length===3&&n.kvSequenceLength!==0&&(a=t.reshape([n.batchSize,n.kvSequenceLength,o,n.headSize]),a=e.compute(at(a,ap.perm),{inputs:[a],outputs:[-1]})[0]),a},op=(e,t,n,a)=>{let o=7,l=["type","type"],d=[e*t],c=e*t,h=[{type:12,data:c},{type:12,data:t},{type:12,data:e}],f=g=>{let _=U("seq_lens",n.dataType,n.dims),w=U("total_seq_lens",a.dataType,a.dims),x=H("pos_ids",o,d),v=[{name:"output_size",type:"u32"},{name:"sequence_length",type:"u32"},{name:"batch_size",type:"u32"}];return`
  ${g.registerUniforms(v).declareVariables(_,w,x)}
  ${g.mainStart()}
    ${g.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
    let total_sequence_length = u32(${w.getByOffset("0")});
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
  `};return{name:"GeneratePositionIds",shaderCache:{hint:`${e};${t}`,inputDependencies:l},getRunData:()=>({outputs:[{dims:d,dataType:o}],dispatchGroup:{x:Math.ceil(c/64)},programUniforms:h}),getShaderSource:f}},up=(e,t)=>{var z;if(e.inputs.length>14&&e.inputs[14]||e.inputs.length>15&&e.inputs[15])throw new Error("GroupQueryAttention (JSEP): q_norm_weight / k_norm_weight inputs are not supported. The per-head Q/K RMS normalization prologue is implemented only on the CUDA and native WebGPU EPs.");let n=rp(e.inputs,t);if(e.inputs[0].dims.length===5)throw new Error("Packed QKV is not implemented");if(((z=e.inputs[1])==null?void 0:z.dims.length)===5)throw new Error("Packed KV is not implemented");let a=e.inputs[0],o=e.inputs[1]&&e.inputs[1].dims.length>0?e.inputs[1]:void 0,l=e.inputs[2]&&e.inputs[2].dims.length>0?e.inputs[2]:void 0,d=e.inputs[3]&&e.inputs[3].dims.length!==0?e.inputs[3]:void 0,c=e.inputs[4]&&e.inputs[4].dims.length!==0?e.inputs[4]:void 0,h=e.inputs.length>4?e.inputs[5]:void 0,f=e.inputs.length>5?e.inputs[6]:void 0,g=n.kvNumHeads?n.kvNumHeads:n.numHeads,_=xe({axis:2,numOutputs:3,splitSizes:[n.numHeads*n.headSize,g*n.headSize,g*n.headSize]}),[w,x,v]=!o&&!l?e.compute(Cr([a],_),{inputs:[a],outputs:[-1,-1,-1]}):[a,o,l],S,T;if(t.doRotary){let C=e.compute(op(n.batchSize,n.sequenceLength,h,f),{inputs:[h,f],outputs:[-1]})[0],M=e.inputs[7],D=e.inputs[8],N=xe({interleaved:t.rotaryInterleaved!==0,numHeads:n.numHeads,rotaryEmbeddingDim:0,scale:t.scale}),W=[w,C,M,D],q=[-1];S=e.compute(zi(W,N),{inputs:W,outputs:q})[0],W.splice(0,1,x);let ie=xe({interleaved:t.rotaryInterleaved!==0,numHeads:n.kvNumHeads,rotaryEmbeddingDim:0,scale:t.scale});T=e.compute(zi(W,ie),{inputs:W,outputs:q})[0]}let k=Fn(e,n.batchSize,n.numHeads,n.sequenceLength,n.headSize,t.doRotary?S:w,void 0,0),E=Or(e,t.doRotary?T:x,n),A=Or(e,v,n);Rn(e,k,E,A,void 0,void 0,d,c,void 0,n,h,f)}}),Mr,lp,dp,cp,t0=$(()=>{"use strict";re(),le(),Mt(),de(),Mr=(e,t,n,a,o,l,d,c)=>{let h=Me(l),f=h===1?"f32":`vec${h}f`,g=h===1?"vec2f":`mat2x${h}f`,_=o*d,w=64;_===1&&(w=256);let x=[o,d,l/h],v=[o,d,2],S=["rank","type","type"],T=[];T.push(...ee(x,v));let k=E=>{let A=U("x",t.dataType,3,h),z=U("scale",n.dataType,n.dims),C=U("bias",a.dataType,a.dims),M=H("output",1,3,2),D=[A,z,C,M];return`
  var<workgroup> workgroup_shared : array<${g}, ${w}>;
  const workgroup_size = ${w}u;
  ${E.declareVariables(...D)}
  ${E.mainStart(w)}
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
      let sum_final = ${Ot("workgroup_shared[0][0]",h)} / f32(hight * ${h});
      let squared_sum_final = ${Ot("workgroup_shared[0][1]",h)} / f32(hight * ${h});

      let inv_std_dev = inverseSqrt(squared_sum_final - sum_final * sum_final + f32(${c}));
      let channel_scale = inv_std_dev * f32(scale[channel]);
      let channel_shift = f32(bias[channel]) - sum_final * channel_scale;
      output[workgroup_index] = vec2f(channel_scale, channel_shift);
    }
  }`};return e.compute({name:"InstanceNormComputeChannelScaleShift",shaderCache:{hint:`${h};${c};${w}`,inputDependencies:S},getRunData:()=>({outputs:[{dims:v,dataType:1}],dispatchGroup:{x:_},programUniforms:T}),getShaderSource:k},{inputs:[t,n,a],outputs:[-1]})[0]},lp=(e,t,n)=>{let a=t[0].dims,o=a,l=2,d=a[0],c=a[1],h=L.sizeFromDimension(a,l),f=Me(h),g=L.size(o)/f,_=Mr(e,t[0],t[1],t[2],d,h,c,n.epsilon),w=[d,c,h/f],x=[d,c],v=["type","none"],S=T=>{let k=U("x",t[0].dataType,w.length,f),E=U("scale_shift",1,x.length,2),A=H("output",t[0].dataType,w.length,f),z=[k,E,A];return`
  ${T.registerUniform("output_size","u32").declareVariables(...z)}
  ${T.mainStart()}
  ${T.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
      let outputIndices = ${A.offsetToIndices("global_idx")};
      let batch = outputIndices[0];
      let channel = outputIndices[1];
      let scale_shift = ${E.getByIndices("vec2<u32>(batch, channel)")};
      let value = ${k.getByOffset("global_idx")} * ${A.type.value}(scale_shift.x) + ${A.type.value}(scale_shift.y);
      ${A.setByOffset("global_idx","value")};
  }`};e.compute({name:"InstanceNormalization",shaderCache:{hint:`${f}`,inputDependencies:v},getRunData:()=>({outputs:[{dims:o,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(g/64)},programUniforms:[{type:12,data:g},...ee(w,x,w)]}),getShaderSource:S},{inputs:[t[0],_]})},dp=(e,t,n)=>{let a=t[0].dims,o=a,l=a[0],d=a[a.length-1],c=L.sizeFromDimension(a,1)/d,h=Me(d),f=L.size(o)/h,g=[{type:12,data:c},{type:12,data:Math.floor(d/h)}],_=["type","type"],w=!1,x=[0,a.length-1];for(let k=0;k<a.length-2;k++)w=w||a[k+1]!==1,x.push(k+1);w=w&&a[a.length-1]!==1;let v=w?e.compute(at(e.inputs[0],x),{inputs:[e.inputs[0]],outputs:[-1]})[0]:e.inputs[0].reshape(Array.from({length:a.length},(k,E)=>a[x[E]])),S=Mr(e,v,t[1],t[2],l,c,d,n.epsilon),T=k=>{let E=Ue(t[0].dataType),A=h===1?"vec2f":`mat${h}x2f`,z=D=>{let N=D===0?"x":"y",W=h===1?"f32":`vec${h}f`;switch(h){case 1:return`${E}(${W}(scale.${N}))`;case 2:return`vec2<${E}>(${W}(scale[0].${N}, scale[1].${N}))`;case 4:return`vec4<${E}>(${W}(scale[0].${N}, scale[1].${N}, scale[2].${N}, scale[3].${N}))`;default:throw new Error(`Not supported compoents ${h}`)}},C=U("input",t[0].dataType,t[0].dims,h),M=H("output",t[0].dataType,o,h);return`
  @group(0) @binding(0) var<storage, read> input : array<${C.type.storage}>;
  @group(0) @binding(1) var<storage, read> scale_input : array<${A}>;
  @group(0) @binding(2) var<storage, read_write> output : array<${M.type.storage}>;
  struct Uniforms {H: u32, C : u32};
  @group(0) @binding(3) var<uniform> uniforms: Uniforms;

  ${k.mainStart()}
    let current_image_number = global_idx / (uniforms.C * uniforms.H);
    let current_channel_number = global_idx % uniforms.C;

    let scale_offset = current_image_number * uniforms.C + current_channel_number;
    let scale = scale_input[scale_offset];
    output[global_idx] = fma(input[global_idx], ${z(0)}, ${z(1)});
  }`};e.compute({name:"InstanceNormalizationNHWC",shaderCache:{hint:`${h}`,inputDependencies:_},getRunData:()=>({outputs:[{dims:o,dataType:t[0].dataType}],dispatchGroup:{x:Math.ceil(f/64)},programUniforms:g}),getShaderSource:T},{inputs:[t[0],S]})},cp=(e,t)=>{t.format==="NHWC"?dp(e,e.inputs,t):lp(e,e.inputs,t)}}),pp,hp,fp,n0=$(()=>{"use strict";re(),le(),de(),pp=e=>{if(!e||e.length<2)throw new Error("layerNorm requires at least 2 inputs.")},hp=(e,t,n)=>{let a=t.simplified,o=e[0].dims,l=e[1],d=!a&&e[2],c=o,h=L.normalizeAxis(t.axis,o.length),f=L.sizeToDimension(o,h),g=L.sizeFromDimension(o,h),_=L.size(l.dims),w=d?L.size(d.dims):0;if(_!==g||d&&w!==g)throw new Error(`Size of X.shape()[axis:] == ${g}.
       Size of scale and bias (if provided) must match this.
       Got scale size of ${_} and bias size of ${w}`);let x=[];for(let C=0;C<o.length;++C)C<h?x.push(o[C]):x.push(1);let v=Me(g),S=["type","type"],T=[{type:12,data:f},{type:1,data:g},{type:12,data:Math.floor(g/v)},{type:1,data:t.epsilon}];d&&S.push("type");let k=n>1,E=n>2,A=C=>{let M=Ue(e[0].dataType),D=[U("x",e[0].dataType,e[0].dims,v),U("scale",l.dataType,l.dims,v)];d&&D.push(U("bias",d.dataType,d.dims,v)),D.push(H("output",e[0].dataType,c,v)),k&&D.push(H("mean_data_output",1,x)),E&&D.push(H("inv_std_output",1,x));let N=[{name:"norm_count",type:"u32"},{name:"norm_size",type:"f32"},{name:"norm_size_vectorized",type:"u32"},{name:"epsilon",type:"f32"}];return`
  ${C.registerUniforms(N).declareVariables(...D)}
  ${C.mainStart()}
    ${C.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.norm_count")}
    let offset = global_idx * uniforms.norm_size_vectorized;
    var mean_vector = ${Zs("f32",v)};
    var mean_square_vector = ${Zs("f32",v)};

    for (var h: u32 = 0u; h < uniforms.norm_size_vectorized; h++) {
      let value = ${yn(M,v,"x[h + offset]")};
      mean_vector += value;
      mean_square_vector += value * value;
    }
    let mean = ${Ot("mean_vector",v)} / uniforms.norm_size;
    let inv_std_dev = inverseSqrt(${Ot("mean_square_vector",v)} / uniforms.norm_size ${a?"":"- mean * mean"} + uniforms.epsilon);

    for (var j: u32 = 0; j < uniforms.norm_size_vectorized; j++) {
      let f32input = ${yn(M,v,"x[j + offset]")};
      let f32scale = ${yn(M,v,"scale[j]")};
      output[j + offset] = ${D[0].type.value}((f32input ${a?"":"- mean"}) * inv_std_dev * f32scale
        ${d?`+ ${yn(M,v,"bias[j]")}`:""}
      );
    }

    ${k?"mean_data_output[global_idx] = mean":""};
    ${E?"inv_std_output[global_idx] = inv_std_dev":""};
  }`},z=[{dims:c,dataType:e[0].dataType}];return k&&z.push({dims:x,dataType:1}),E&&z.push({dims:x,dataType:1}),{name:"LayerNormalization",shaderCache:{hint:`${v};${n};${a}`,inputDependencies:S},getRunData:()=>({outputs:z,dispatchGroup:{x:Math.ceil(f/64)},programUniforms:T}),getShaderSource:A}},fp=(e,t)=>{pp(e.inputs),e.compute(hp(e.inputs,t,e.outputCount))}}),mp,gp,i0=$(()=>{"use strict";le(),dr(),fr(),mp=e=>{if(!e||e.length!==2)throw new Error("MatMul requires 2 inputs.");if(e[0].dims[e[0].dims.length-1]!==e[1].dims[e[1].dims.length-2])throw new Error("shared dimension does not match.")},gp=e=>{mp(e.inputs);let t=gn.calcShape(e.inputs[0].dims,e.inputs[1].dims,!0);if(!t)throw new Error("Can't use matmul on the given tensors");let n=t[t.length-1],a=e.inputs[0].dims[e.inputs[0].dims.length-1];if(n<8&&a<8)e.compute(lr(e.inputs,{activation:""},t));else{let o=t[t.length-2],l=L.size(e.inputs[0].dims.slice(0,-2)),d=L.size(e.inputs[1].dims.slice(0,-2));if(l!==1&&o===1&&d===1){let c=e.inputs[0].reshape([1,l,a]),h=e.inputs[1].reshape([1,a,n]),f=[1,l,n],g=[c,h];e.compute(ki(g,{activation:""},t,f),{inputs:g})}else e.compute(ki(e.inputs,{activation:""},t))}}}),_p,yp,wp,$p,bp,s0=$(()=>{"use strict";re(),le(),Oe(),de(),_p=(e,t)=>{if(e.length<3||e.length>4)throw new Error("MatMulNBits requires 3 or 4 inputs");let n=e[0],a=n.dims.length;if(n.dims[a-1]!==t.k)throw new Error("The last dim of input shape does not match the k value");let o=Math.floor((t.k+t.blockSize-1)/t.blockSize),l=t.blockSize/8*t.bits,d=e[1];if(!L.areEqual(d.dims,[t.n,o,l]))throw new Error("The second inputs must be 3D tensor with shape N X nBlocksPerCol X blobSize");let c=e[2].dims;if(L.size(c)!==t.n*o)throw new Error("scales input size error.");if(e.length===4){let h=e[3].dims,f=t.n*(t.bits===8?o:Math.floor((o*t.bits+7)/8));if(L.size(h)!==f)throw new Error("zeroPoints input size error.")}},yp=(e,t)=>{let n=e[0].dims,a=n.length,o=n[a-2],l=t.k,d=t.n,c=n.slice(0,a-2),h=L.size(c),f=e[1].dims[2]/4,g=e[0].dataType,_=Me(t.k),w=Me(f),x=Me(d),v=c.concat([o,d]),S=o>1&&d/x%2===0?2:1,T=L.size(v)/x/S,k=64,E=[],A=[h,o,l/_],z=L.convertShape(e[1].dims).slice();z.splice(-1,1,f/w),E.push(...ee(A)),E.push(...ee(z)),E.push(...ee(e[2].dims)),e.length===4&&E.push(...ee(L.convertShape(e[3].dims)));let C=[h,o,d/x];E.push(...ee(C));let M=D=>{let N=A.length,W=U("a",e[0].dataType,N,_),q=U("b",12,z.length,w),ie=U("scales",e[2].dataType,e[2].dims.length),K=[W,q,ie],Q=e.length===4?U("zero_points",12,e[3].dims.length):void 0;Q&&K.push(Q);let _e=C.length,$e=H("output",e[0].dataType,_e,x),oe=Ue(e[0].dataType),ce=(()=>{switch(_){case 1:return`array<${oe}, 8>`;case 2:return`mat4x2<${oe}>`;case 4:return`mat2x4<${oe}>`;default:throw new Error(`${_}-component is not supported.`)}})(),ye=Math.floor(32/t.bits),ae=Math.floor(ye/8),ze=()=>{let se="";for(let j=0;j<ae;j++){let Te=j*t.bits*4,Pe=Te+t.bits;se+=`
          // reuse a data (pass ${j})
            var input_offset${j>0?j:""} = ${j===0?W.indicesToOffset(`${W.type.indices}(batch, row, word_offset)`):"input_offset"};
            var a_data${j>0?j:""}: ${ce};
            for (var j${j>0?j:""}: u32 = 0; j${j>0?j:""} < ${8/_}; j${j>0?j:""}++) {
              a_data${j>0?j:""}[j${j>0?j:""}] = ${W.getByOffset(`input_offset${j>0?j:""}`)};
              input_offset${j>0?j:""}++;
            }
          `;for(let Ae=0;Ae<x*S;Ae++)se+=`
            b_value = ${w===1?`b${Ae}_data`:`b${Ae}_data[i]`};
            ${t.bits===2?`{
              let half_word = b_value >> ${j*16}u;
              let byte_lo = half_word & 0xFFu;
              let byte_hi = (half_word >> 8u) & 0xFFu;
              let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
              b_value_lower = unpack4xU8(spread_word & b_mask);
              b_value_upper = unpack4xU8((spread_word >> 2u) & b_mask);
            }`:`b_value_lower = unpack4xU8((b_value >> ${Te}u) & b_mask);
            b_value_upper = unpack4xU8((b_value >> ${Pe}u) & b_mask);`}
            b_quantized_values = ${ce}(${Array.from({length:4},(ot,tt)=>`${oe}(b_value_lower[${tt}]), ${oe}(b_value_upper[${tt}])`).join(", ")});
            b_dequantized_values = ${_===1?`${ce}(${Array.from({length:8},(ot,tt)=>`(b_quantized_values[${tt}] - ${Q?`zero_point${Ae}`:"zero_point"}) * scale${Ae}`).join(", ")});`:`(b_quantized_values - ${ce}(${Array(8).fill(`${Q?`zero_point${Ae}`:"zero_point"}`).join(",")})) * scale${Ae};`};
            workgroup_shared[local_id.x * ${S} + ${Math.floor(Ae/x)}]${x>1?`[${Ae%x}]`:""} += ${Array.from({length:8/_},(ot,tt)=>`${_===1?`a_data${j>0?j:""}[${tt}] * b_dequantized_values[${tt}]`:`dot(a_data${j>0?j:""}[${tt}], b_dequantized_values[${tt}])`}`).join(" + ")};
          `}return se},F=()=>{let se=`
            var col_index = col * ${x};
            ${Q?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (nBlocksPerCol + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            var zero_point_byte_count: u32;
            var zero_point_word_index: u32;
            var zero_point_byte_offset: u32;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            var zero_point_bits_offset: u32;
            var zero_point_word: u32;`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${oe}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            `;for(let j=0;j<x*S;j++)se+=`
            let scale${j} = ${ie.getByOffset("col_index * nBlocksPerCol + block")};
            ${Q?`
            zero_point_byte_count = col_index * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            zero_point_word_index = zero_point_byte_count >> 0x2u;
            zero_point_byte_offset = zero_point_byte_count & 0x3u;
            zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            zero_point_word = ${Q.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point${j} = ${oe}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:""}
            col_index += 1;`;return se},ne=()=>{let se=`col_index = col * ${x};`;for(let j=0;j<x*S;j++)se+=`
            let b${j}_data = ${q.getByIndices(`${q.type.indices}(col_index, block, word)`)};
            col_index += 1;`;return se+=`
            var b_value: u32;
            let b_mask: u32 = ${t.bits===2?"0x03030303u":"0x0F0F0F0Fu"};
            var b_value_lower: vec4<u32>;
            var b_value_upper: vec4<u32>;
            var b_quantized_values: ${ce};
            var b_dequantized_values: ${ce};`,se};return`
        var<workgroup> workgroup_shared: array<${$e.type.value}, ${S*k}>;
        ${D.declareVariables(...K,$e)}
        ${D.mainStart([k,1,1])}
          let output_indices = ${$e.offsetToIndices(`(global_idx / ${k}) * ${S}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let nBlocksPerCol = uniforms.b_shape[1];

          for (var block = local_id.x; block < nBlocksPerCol; block += ${k}) {
            //process one block
            var word_offset: u32 = block * ${t.blockSize/_};
            ${F()}
            for (var word: u32 = 0; word < ${f}; word += ${w}) {
              ${ne()}
              for (var i: u32 = 0; i < ${w}; i++) {
                ${ze()}
                word_offset += ${ye/_};
              }
            }
          }
          workgroupBarrier();

          if (local_id.x < ${S}) {
            var output_value: ${$e.type.value} = ${$e.type.value}(0);
            var workgroup_shared_offset: u32 = local_id.x;
            for (var b: u32 = 0u; b < ${k}u; b++) {
              output_value += workgroup_shared[workgroup_shared_offset];
              workgroup_shared_offset += ${S};
            }
            ${$e.setByIndices(`${$e.type.indices}(batch, row, col + local_id.x)`,"output_value")};
          }
        }`};return{name:"MatMulNBits",shaderCache:{hint:`${t.blockSize};${t.bits};${_};${w};${x};${S};${k}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:v,dataType:g}],dispatchGroup:{x:T},programUniforms:E}),getShaderSource:M}},wp=(e,t)=>{let n=e[0].dims,a=n.length,o=n[a-2],l=t.k,d=t.n,c=n.slice(0,a-2),h=L.size(c),f=e[1].dims[2]/4,g=e[0].dataType,_=Me(t.k),w=Me(f),x=c.concat([o,d]),v=128,S=d%8===0?8:d%4===0?4:1,T=v/S,k=Math.floor(32/t.bits),E=T*w*k,A=E/_,z=E/t.blockSize,C=L.size(x)/S,M=[],D=[h,o,l/_],N=L.convertShape(e[1].dims).slice();N.splice(-1,1,f/w),M.push(...ee(D)),M.push(...ee(N)),M.push(...ee(e[2].dims)),e.length===4&&M.push(...ee(L.convertShape(e[3].dims)));let W=[h,o,d];M.push(...ee(W));let q=ie=>{let K=D.length,Q=U("a",e[0].dataType,K,_),_e=U("b",12,N.length,w),$e=U("scales",e[2].dataType,e[2].dims.length),oe=[Q,_e,$e],ce=e.length===4?U("zero_points",12,e[3].dims.length):void 0;ce&&oe.push(ce);let ye=W.length,ae=H("output",e[0].dataType,ye),ze=Ue(e[0].dataType),F=()=>{switch(_){case 1:return`
          let a_data0 = vec4<${ze}>(sub_a[word_offset], sub_a[word_offset + 1], sub_a[word_offset + 2], sub_a[word_offset + 3]);
          let a_data1 = vec4<${ze}>(sub_a[word_offset + 4], sub_a[word_offset + 5], sub_a[word_offset + 6], sub_a[word_offset + 7]);`;case 2:return`
          let a_data0 = vec4<${ze}>(sub_a[word_offset], sub_a[word_offset + 1]);
          let a_data1 = vec4<${ze}>(sub_a[word_offset + 2], sub_a[word_offset + 3]);`;case 4:return`
          let a_data0 = sub_a[word_offset];
          let a_data1 = sub_a[word_offset + 1];`;default:throw new Error(`${_}-component is not supported.`)}};return`
        var<workgroup> sub_a: array<${Q.type.value}, ${A}>;
        var<workgroup> inter_results: array<array<${ae.type.value}, ${T}>, ${S}>;
        ${ie.declareVariables(...oe,ae)}
        ${ie.mainStart([T,S,1])}
          let output_indices = ${ae.offsetToIndices(`workgroup_index * ${S}`)};
          let col = output_indices[2];
          let row = output_indices[1];
          let batch = output_indices[0];
          let n_blocks_per_col = uniforms.b_shape[1];
          let num_tiles =  (n_blocks_per_col - 1) / ${z} + 1;

          // Loop over shared dimension.
          for (var tile: u32 = 0; tile < num_tiles; tile += 1) {
            let a_col_start = tile * ${A};
            // load one tile A data into shared memory.
            for (var a_offset = local_idx; a_offset < ${A}; a_offset += ${v})
            {
              let a_col = a_col_start + a_offset;
              if (a_col < uniforms.a_shape[2])
              {
                sub_a[a_offset] = ${Q.getByIndices(`${Q.type.indices}(batch, row, a_col)`)};
              } else {
                sub_a[a_offset] = ${Q.type.value}(0);
              }
            }
            workgroupBarrier();

            // each thread process one block
            let b_row = col + local_id.y;
            let block = tile * ${z} + local_id.x;
            ${ce?`
            let zero_point_values_per_byte: u32 = ${Math.floor(8/t.bits)}u;
            let zero_point_bytes_per_col = (n_blocks_per_col + zero_point_values_per_byte - 1u) / zero_point_values_per_byte;
            let zero_point_byte_count = b_row * zero_point_bytes_per_col + (block / zero_point_values_per_byte);
            let zero_point_word_index = zero_point_byte_count >> 0x2u;
            let zero_point_byte_offset = zero_point_byte_count & 0x3u;
            let zero_point_sub_offset: u32 = block % zero_point_values_per_byte;
            let zero_point_bits_offset = (zero_point_byte_offset << 3) + (zero_point_sub_offset * ${t.bits}u);
            let zero_point_word = ${ce.getByOffset("zero_point_word_index")} >> zero_point_bits_offset;
            let zero_point = ${ze}((zero_point_word) & ${t.bits===2?"0x3u":"0xFu"});`:`
            // The default zero point is ${Math.pow(2,t.bits-1)} for unsigned ${t.bits}-bit quantization.
            let zero_point = ${ze}(${Math.pow(2,t.bits-1).toFixed(1)});`}
            let scale = ${$e.getByOffset("b_row * n_blocks_per_col + block")};
            let b_data = ${_e.getByIndices(`${_e.type.indices}(b_row, block, 0)`)};
            var word_offset = local_id.x * ${t.blockSize/_};
            for (var i: u32 = 0; i < ${w}; i++) {
              let b_value = ${w===1?"b_data":"b_data[i]"};
              ${(()=>{let ne=Math.floor(k/8),se="";for(let j=0;j<ne;j++){let Te=j*t.bits*4,Pe=Te+t.bits;se+=`
              ${F()}
              {${t.bits===2?`
                let half_word = b_value >> ${j*16}u;
                let byte_lo = half_word & 0xFFu;
                let byte_hi = (half_word >> 8u) & 0xFFu;
                let spread_word = (byte_lo & 0xFu) | ((byte_lo >> 4u) << 8u) | ((byte_hi & 0xFu) << 16u) | ((byte_hi >> 4u) << 24u);
                let b_value_lower = unpack4xU8(spread_word & 0x03030303u);
                let b_value_upper = unpack4xU8((spread_word >> 2u) & 0x03030303u);`:`
                let b_value_lower = unpack4xU8((b_value >> ${Te}u) & 0x0F0F0F0Fu);
                let b_value_upper = unpack4xU8((b_value >> ${Pe}u) & 0x0F0F0F0Fu);`}
                let b_quantized_values = mat2x4<${ze}>(${Array.from({length:4},(Ae,ot)=>`${ze}(b_value_lower[${ot}]), ${ze}(b_value_upper[${ot}])`).join(", ")});
                let b_dequantized_values = (b_quantized_values - mat2x4<${ze}>(${Array(8).fill("zero_point").join(",")})) * scale;
                inter_results[local_id.y][local_id.x] += ${Array.from({length:2},(Ae,ot)=>`${`dot(a_data${ot}, b_dequantized_values[${ot}])`}`).join(" + ")};
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
        }`};return{name:"BlockwiseMatMulNBits32",shaderCache:{hint:`${t.blockSize};${_};${w};${T};${S}`,inputDependencies:Array(e.length).fill("rank")},getRunData:()=>({outputs:[{dims:x,dataType:g}],dispatchGroup:{x:C},programUniforms:M}),getShaderSource:q}},$p=(e,t)=>{_p(e.inputs,t),t.blockSize===32&&e.adapterInfo.isVendor("intel")&&e.adapterInfo.isArchitecture("gen-12lp")?e.compute(wp(e.inputs,t)):e.compute(yp(e.inputs,t))},bp=e=>xe(e)}),vp,xp,Ep,kp,Sp,Ip,Tp,Ap,zp,r0=$(()=>{"use strict";re(),le(),de(),vp=e=>{if(!e||e.length<1)throw new Error("Too few inputs");if(e[0].dataType!==1&&e[0].dataType!==10)throw new Error("Input type must be float or float16.");if(e.length>=2){let t=e[0].dims.length*2===e[1].dims[0];if(e.length===4&&(t=e[3].dims[0]*2===e[1].dims[0]),!t)throw new Error("The pads should be a 1D tensor of shape [2 * input_rank] or [2 * num_axes].")}},xp=(e,t,n)=>{let a="";for(let o=t-1;o>=0;--o)a+=`
            k = i32(${e.indicesGet("indices",o)}) - ${Y("uniforms.pads",o,n)};
            if (k < 0) {
              break;
            }
            if (k >= i32(${Y("uniforms.x_shape",o,t)})) {
              break;
            }
            offset += k * i32(${Y("uniforms.x_strides",o,t)});
        `;return`
          value = ${e.type.value}(uniforms.constant_value);
          for (var i = 0; i < 1; i++) {
            var offset = 0;
            var k = 0;
            ${a}
            value = x[offset];
          }
      `},Ep=(e,t,n)=>{let a="";for(let o=t-1;o>=0;--o)a+=`
                k = i32(${e.indicesGet("indices",o)}) - ${Y("uniforms.pads",o,n)};
                if (k < 0) {
                  k = -k;
                }
                {
                  let _2n_1 = 2 * (i32(${Y("uniforms.x_shape",o,t)}) - 1);
                  k = k % _2n_1;
                  if(k >= i32(${Y("uniforms.x_shape",o,t)})) {
                    k = _2n_1 - k;
                  }
                }
                offset += k * i32(${Y("uniforms.x_strides",o,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},kp=(e,t,n)=>{let a="";for(let o=t-1;o>=0;--o)a+=`
                k = i32(${e.indicesGet("indices",o)}) - ${Y("uniforms.pads",o,n)};
                if (k < 0) {
                  k = 0;
                }
                if (k >= i32(${Y("uniforms.x_shape",o,t)})) {
                  k = i32(${Y("uniforms.x_shape",o,t)}) - 1;
                }
                offset += k * i32(${Y("uniforms.x_strides",o,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Sp=(e,t,n)=>{let a="";for(let o=t-1;o>=0;--o)a+=`
                k = i32(${e.indicesGet("indices",o)}) - ${Y("uniforms.pads",o,n)};
                if (k < 0)  {
                  k += i32(${Y("uniforms.x_shape",o,t)}]);
                }
                if (k >= i32(${Y("uniforms.x_shape",o,t)})) {
                  k -= i32(${Y("uniforms.x_shape",o,t)});
                }
                offset += k * i32(${Y("uniforms.x_strides",o,t)});
            `;return`
              var offset = 0;
              var k = 0;
              ${a}
              value = x[offset];
          `},Ip=(e,t,n)=>{switch(n.mode){case 0:return xp(e,t,n.pads.length);case 1:return Ep(e,t,n.pads.length);case 2:return kp(e,t,n.pads.length);case 3:return Sp(e,t,n.pads.length);default:throw new Error("Invalid mode")}},Tp=(e,t)=>{let n=L.padShape(e[0].dims.slice(),t.pads),a=e[0].dims,o=L.size(n),l=[{type:12,data:o},{type:6,data:t.pads}],d=e.length>=3&&e[2].data;t.mode===0&&l.push({type:d?e[2].dataType:1,data:t.value}),l.push(...ee(e[0].dims,n));let c=["rank"],h=f=>{let g=H("output",e[0].dataType,n.length),_=U("x",e[0].dataType,a.length),w=_.type.value,x=Ip(g,a.length,t),v=[{name:"output_size",type:"u32"},{name:"pads",type:"i32",length:t.pads.length}];return t.mode===0&&v.push({name:"constant_value",type:d?w:"f32"}),`
            ${f.registerUniforms(v).declareVariables(_,g)}
            ${f.mainStart()}
            ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}

            let indices = ${g.offsetToIndices("global_idx")};

            var value = ${w}(0);
            ${x}
            output[global_idx] = value;
        }`};return{name:"Pad",shaderCache:{hint:`${t.mode}${d}`,inputDependencies:c},getRunData:()=>({outputs:[{dims:n,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(L.size(n)/64)},programUniforms:l}),getShaderSource:h}},Ap=(e,t)=>{if(e.length>1){let n=e[1].getBigInt64Array(),a=e.length>=3&&e[2].data?e[2].dataType===10?e[2].getUint16Array()[0]:e[2].getFloat32Array()[0]:0,o=e[0].dims.length,l=new Int32Array(2*o).fill(0);if(e.length>=4){let c=e[3].getBigInt64Array();for(let h=0;h<c.length;h++)l[Number(c[h])]=Number(n[h]),l[Number(c[h])+o]=Number(n[h+c.length])}else n.forEach((c,h)=>l[Number(h)]=Number(c));let d=[];return l.forEach(c=>d.push(c)),{mode:t.mode,value:a,pads:d}}else return t},zp=(e,t)=>{vp(e.inputs);let n=Ap(e.inputs,t);e.compute(Tp(e.inputs,n),{inputs:[0]})}}),Wn,Pr,Rr,Dr,Br,Cp,Op,Lr,Nr,Mp,Pp,Ur,Rp,Dp,Fr,Bp,Lp,Np,Up,a0=$(()=>{"use strict";st(),re(),le(),de(),Wn=e=>{if(ke.webgpu.validateInputContent&&(!e||e.length!==1))throw new Error("Pool ops requires 1 input.")},Pr=(e,t,n)=>{let a=t.format==="NHWC",o=e.dims.slice();a&&o.splice(1,0,o.pop());let l=Object.hasOwnProperty.call(t,"dilations"),d=t.kernelShape.slice(),c=t.strides.slice(),h=l?t.dilations.slice():[],f=t.pads.slice();yi.adjustPoolAttributes(n,o,d,c,h,f);let g=yi.computePoolOutputShape(n,o,c,h,d,f,t.autoPad,t.ceilMode),_=Object.assign({},t);l?Object.assign(_,{kernelShape:d,strides:c,pads:f,dilations:h,cacheKey:t.cacheKey}):Object.assign(_,{kernelShape:d,strides:c,pads:f,cacheKey:t.cacheKey});let w=g.slice();return w.push(w.splice(1,1)[0]),[_,a?w:g]},Rr=(e,t)=>{let n=t.format==="NHWC",a=L.size(e),o=L.size(t.kernelShape),l=[{type:12,data:a},{type:12,data:o}],d=[{name:"outputSize",type:"u32"},{name:"kernelSize",type:"u32"}];if(t.kernelShape.length<=2){let c=t.kernelShape[t.kernelShape.length-1],h=t.strides[t.strides.length-1],f=t.pads[t.pads.length/2-1],g=t.pads[t.pads.length-1],_=!!(f+g);l.push({type:12,data:c},{type:12,data:h},{type:12,data:f},{type:12,data:g}),d.push({name:"kw",type:"u32"},{name:"sw",type:"u32"},{name:"pwStart",type:"u32"},{name:"pwEnd",type:"u32"});let w=!1;if(t.kernelShape.length===2){let x=t.kernelShape[t.kernelShape.length-2],v=t.strides[t.strides.length-2],S=t.pads[t.pads.length/2-2],T=t.pads[t.pads.length-2];w=!!(S+T),l.push({type:12,data:x},{type:12,data:v},{type:12,data:S},{type:12,data:T}),d.push({name:"kh",type:"u32"},{name:"sh",type:"u32"},{name:"phStart",type:"u32"},{name:"phEnd",type:"u32"})}return[l,d,!0,_,w]}else{if(n)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let c=L.computeStrides(t.kernelShape);l.push({type:12,data:c},{type:12,data:t.pads},{type:12,data:t.strides}),d.push({name:"kernelStrides",type:"u32",length:c.length},{name:"pads",type:"u32",length:t.pads.length},{name:"strides",type:"u32",length:t.strides.length});let h=t.pads.reduce((f,g)=>f+g);return[l,d,!!h,!1,!1]}},Dr=(e,t,n,a,o,l,d,c,h,f,g,_)=>{let w=o.format==="NHWC",x=t.type.value,v=H("output",t.type.tensor,a);if(o.kernelShape.length<=2){let S="",T="",k="",E=n-(w?2:1);if(g?S=`
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
                }`,o.kernelShape.length===2){let A=n-(w?3:2);_?T=`
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
            }`}else{if(w)throw new Error("Pooling with kernelShape.length > 2 is not supported for NHWC format.");let S=o.kernelShape.length,T=o.pads.length,k="";return f?k=`
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
            }`}},Br=e=>`${e.format};${e.ceilMode};${e.autoPad};${e.kernelShape.length}`,Cp=e=>`${Br(e)};${e.countIncludePad}`,Op=e=>`${Br(e)};${e.storageOrder};${e.dilations}`,Lr=e=>({format:e.format,autoPad:["NOTSET","VALID","SAME_UPPER","SAME_LOWER"][e.auto_pad],ceilMode:e.ceil_mode,kernelShape:e.kernel_shape,strides:e.strides,pads:e.pads}),Nr=(e,t,n,a)=>{let[o,l]=Pr(t,a,n),d=U("x",t.dataType,t.dims.length),c=d.type.value,h="value += x_val;",f="";o.countIncludePad?f+=`value /= ${c}(uniforms.kernelSize);`:f+=`value /= ${c}(i32(uniforms.kernelSize) - pad);`;let[g,_,w,x,v]=Rr(l,o);g.push(...ee(t.dims,l));let S=["rank"];return{name:e,shaderCache:{hint:`${a.cacheKey};${w};${x};${v}`,inputDependencies:S},getRunData:()=>({outputs:[{dims:l,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(L.size(l)/64)},programUniforms:g}),getShaderSource:T=>Dr(T,d,t.dims.length,l.length,o,h,f,0,_,w,x,v)}},Mp=e=>{let t=e.count_include_pad!==0,n=Lr(e);if(n.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding/divisor) is not yet implemented in the WebGPU AveragePool kernel");let a={countIncludePad:t,...n,cacheKey:""};return{...a,cacheKey:Cp(a)}},Pp=(e,t)=>{Wn(e.inputs),e.compute(Nr("AveragePool",e.inputs[0],!1,t))},Ur={autoPad:"",ceilMode:0,countIncludePad:!1,kernelShape:[],strides:[],pads:[],storageOrder:0,dilations:[]},Rp=e=>{let t=e.format;return{format:t,...Ur,cacheKey:t}},Dp=(e,t)=>{Wn(e.inputs),e.compute(Nr("GlobalAveragePool",e.inputs[0],!0,t))},Fr=(e,t,n,a)=>{let[o,l]=Pr(t,a,n),d=`
      value = max(x_val, value);
    `,c="",h=U("x",t.dataType,t.dims.length),f=["rank"],[g,_,w,x,v]=Rr(l,o);return g.push(...ee(t.dims,l)),{name:e,shaderCache:{hint:`${a.cacheKey};${w};${x};${v}`,inputDependencies:f},getRunData:()=>({outputs:[{dims:l,dataType:t.dataType}],dispatchGroup:{x:Math.ceil(L.size(l)/64)},programUniforms:g}),getShaderSource:S=>Dr(S,h,t.dims.length,l.length,o,d,c,t.dataType===10?-65504:-1e5,_,w,x,v)}},Bp=(e,t)=>{Wn(e.inputs),e.compute(Fr("MaxPool",e.inputs[0],!1,t))},Lp=e=>{let t=e.storage_order,n=e.dilations,a=Lr(e);if(t!==0)throw new Error("column major storage order is not yet supported for MaxPool");if(a.ceilMode!==0)throw new Error("ceil_mode output-shape is computed, but ceil_mode kernel execution (padding) is not yet implemented in the WebGPU MaxPool kernel");let o={storageOrder:t,dilations:n,...a,cacheKey:""};return{...o,cacheKey:Op(o)}},Np=e=>{let t=e.format;return{format:t,...Ur,cacheKey:t}},Up=(e,t)=>{Wn(e.inputs),e.compute(Fr("GlobalMaxPool",e.inputs[0],!0,t))}}),Fp,Wp,Vp,jp,o0=$(()=>{"use strict";re(),le(),Oe(),de(),Fp=(e,t)=>{if(e.length<2||e.length>3)throw new Error("DequantizeLinear requires 2 or 3 inputs.");if(e.length===3&&e[1].dims===e[2].dims)throw new Error("x-scale and x-zero-point must have the same shape.");if(e.length===3&&e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==0&&e[1].dims.length!==1&&e[1].dims.length!==e[0].dims.length)throw new Error("scale input must be a scalar, a 1D tensor, or have the same rank as the input tensor.");if(e.length>2){if(e[0].dataType!==e[2].dataType)throw new Error("x and x-zero-point must have the same data type.");if(e[1].dims.length!==e[2].dims.length)throw new Error("scale and zero-point inputs must have the same rank.");if(!e[1].dims.map((n,a)=>n===e[2].dims[a]).reduce((n,a)=>n&&a,!0))throw new Error("scale and zero-point inputs must have the same shape.")}if(t.blockSize>0){if(e[1].dims.length===0||e[1].dims.length===1&&e[1].dims[0]===1)throw new Error("blockSize must be set only for block quantization.");if(!e[1].dims.map((o,l)=>l===t.axis||o===e[0].dims[l]).reduce((o,l)=>o&&l,!0))throw new Error("For block qunatization, scale input shape to match the input shape except for the axis");if(e[1].dims.length!==e[0].dims.length)throw new Error("For block qunatization the scale input rank must be the same as the x rank.");let n=e[0].dims[t.axis],a=e[1].dims[t.axis];if(t.blockSize<Math.ceil(n/a)||t.blockSize>Math.ceil(n/(a-1)-1))throw new Error("blockSize must be with in the range [ceil(dI / Si), ceil(dI / (Si - 1) - 1)].")}},Wp=(e,t)=>{let n=L.normalizeAxis(t.axis,e[0].dims.length),a=e[0].dataType,o=a===3,l=e[0].dims,d=e[1].dataType,c=L.size(l),h=a===3||a===2,f=h?[Math.ceil(L.size(e[0].dims)/4)]:e[0].dims,g=e[1].dims,_=e.length>2?e[2]:void 0,w=_?h?[Math.ceil(L.size(_.dims)/4)]:_.dims:void 0,x=g.length===0||g.length===1&&g[0]===1,v=x===!1&&g.length===1,S=Me(c),T=x&&(!h||S===4),k=T?S:1,E=T&&!h?S:1,A=U("input",h?12:a,f.length,E),z=U("scale",d,g.length),C=_?U("zero_point",h?12:a,w.length):void 0,M=H("output",d,l.length,k),D=[A,z];C&&D.push(C);let N=[f,g];_&&N.push(w);let W=[{type:12,data:c/k},{type:12,data:n},{type:12,data:t.blockSize},...ee(...N,l)],q=ie=>{let K=[{name:"output_size",type:"u32"},{name:"axis",type:"u32"},{name:"block_size",type:"u32"}];return`
      ${ie.registerUniforms(K).declareVariables(...D,M)}
      ${ie.mainStart()}
          ${ie.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.output_size")}
          let output_indices = ${M.offsetToIndices("global_idx")};

          // Set input x
          ${h?`
            let input = ${A.getByOffset("global_idx / 4")};
            let x_vec = ${o?"unpack4xI8(input)":"unpack4xU8(input)"};
            let x_value = ${k===1?"x_vec[global_idx % 4]":"x_vec"};`:`let x_value = ${A.getByOffset("global_idx")};`};

          // Set scale input
          ${x?`let scale_value= ${z.getByOffset("0")}`:v?`
            let scale_index = ${M.indicesGet("output_indices","uniforms.axis")};
            let scale_value= ${z.getByOffset("scale_index")};`:`
            var scale_indices: ${z.type.indices} = output_indices;
            let index = ${z.indicesGet("scale_indices","uniforms.axis")} / uniforms.block_size;
            ${z.indicesSet("scale_indices","uniforms.axis","index")};
            let scale_value= ${z.getByIndices("scale_indices")};`};

          // Set zero-point input
          ${C?x?h?`
                let zero_point_input = ${C.getByOffset("0")};
                let zero_point_vec =  ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value= zero_point_vec[0]`:`let zero_point_value = ${C.getByOffset("0")}`:v?h?`
                let zero_point_index = ${M.indicesGet("output_indices","uniforms.axis")};
                let zero_point_input = ${C.getByOffset("zero_point_index / 4")};
                let zero_point_vec =  ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_index % 4]`:`
                let zero_point_index = ${M.indicesGet("output_indices","uniforms.axis")};
                let zero_point_value = ${C.getByOffset("zero_point_index")};`:h?`
                let zero_point_offset = ${z.indicesToOffset("scale_indices")};
                let zero_point_input = ${C.getByOffset("zero_point_offset / 4")};
                let zero_point_vec = ${o?"unpack4xI8(zero_point_input)":"unpack4xU8(zero_point_input)"};
                let zero_point_value = zero_point_vec[zero_point_offset % 4];`:`let zero_point_value = ${C.getByIndices("scale_indices")};`:`let zero_point_value = ${h?o?"i32":"u32":A.type.value}(0);`};
      // Compute and write output
      ${M.setByOffset("global_idx",`${M.type.value}(x_value - zero_point_value) * scale_value`)};
      }`};return{name:"DequantizeLinear",shaderCache:{hint:t.cacheKey,inputDependencies:C?["rank","rank","rank"]:["rank","rank"]},getShaderSource:q,getRunData:()=>({outputs:[{dims:l,dataType:d}],dispatchGroup:{x:Math.ceil(c/k/64),y:1,z:1},programUniforms:W})}},Vp=(e,t)=>{Fp(e.inputs,t),e.compute(Wp(e.inputs,t))},jp=e=>xe({axis:e.axis,blockSize:e.blockSize})}),qp,Gp,Hp,u0=$(()=>{"use strict";st(),re(),de(),qp=(e,t,n)=>{let a=e===t,o=e<t&&n<0,l=e>t&&n>0;if(a||o||l)throw new Error("Range these inputs' contents are invalid.")},Gp=(e,t,n,a)=>{let o=Math.abs(Math.ceil((t-e)/n)),l=[o],d=o,c=[{type:12,data:d},{type:a,data:e},{type:a,data:n},...ee(l)],h=f=>{let g=H("output",a,l.length),_=g.type.value,w=[{name:"outputSize",type:"u32"},{name:"start",type:_},{name:"delta",type:_}];return`
        ${f.registerUniforms(w).declareVariables(g)}
        ${f.mainStart()}
        ${f.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
        output[global_idx] = uniforms.start + ${_}(global_idx) * uniforms.delta;
      }`};return{name:"Range",shaderCache:{hint:`${a}`},getShaderSource:h,getRunData:()=>({outputs:[{dims:l,dataType:a}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:c})}},Hp=e=>{let t=0,n=0,a=0;e.inputs[0].dataType===6?(t=e.inputs[0].getInt32Array()[0],n=e.inputs[1].getInt32Array()[0],a=e.inputs[2].getInt32Array()[0]):e.inputs[0].dataType===1&&(t=e.inputs[0].getFloat32Array()[0],n=e.inputs[1].getFloat32Array()[0],a=e.inputs[2].getFloat32Array()[0]),ke.webgpu.validateInputContent&&qp(t,n,a),e.compute(Gp(t,n,a,e.inputs[0].dataType),{inputs:[]})}}),Kp,Zp,Xp,Yp,l0=$(()=>{"use strict";re(),le(),Oe(),de(),Kp=(e,t,n,a)=>{if(e!=="none"&&a!=="i32"&&a!=="u32"&&a!=="f32")throw new Error(`Input ${a} is not supported with reduction ${e}.`);let o=`{
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
              ${o}bitcast<${a}>(oldValue) + (${n})${l}`;case"max":return a==="i32"||a==="u32"?`atomicMax(&${t}, bitcast<${a}>(${n}));`:`
                ${o}max(bitcast<f32>(oldValue), (${n}))${l}`;case"min":return a==="i32"||a==="u32"?`atomicMin(&${t}, bitcast<${a}>(${n}));`:`${o}min(bitcast<${a}>(oldValue), (${n}))${l}`;case"mul":return`${o}(bitcast<${a}>(oldValue) * (${n}))${l}`;default:throw new Error(`Reduction ${e} is not supported.`)}},Zp=(e,t)=>{let n=e[0].dims,a=e[1].dims,o=n,l=1,d=Math.ceil(L.sizeToDimension(a,a.length-1)/l),c=a[a.length-1],h=L.sizeFromDimension(n,c),f=[{type:12,data:d},{type:12,data:c},{type:12,data:h},...ee(e[1].dims,e[2].dims,o)],g=_=>{let w=U("indices",e[1].dataType,e[1].dims.length),x=U("updates",e[2].dataType,e[2].dims.length,l),v=t.reduction!=="none"&&t.reduction!==""?Xo("output",e[0].dataType,o.length):H("output",e[0].dataType,o.length,l);return`
      ${_.registerUniform("output_size","u32").registerUniform("last_index_dimension","u32").registerUniform("num_updates_elements","u32").declareVariables(w,x,v)}
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
    ${Kp(t.reduction,"output[data_offset + i]","value",v.type.value)}
  }

      }`};return{name:"ScatterND",shaderCache:{hint:`${t.cacheKey}_${t.reduction}`,inputDependencies:["rank","rank"]},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(d/64)},programUniforms:f}),getShaderSource:g}},Xp=e=>xe({reduction:e.reduction}),Yp=(e,t)=>{e.compute(Zp(e.inputs,t),{inputs:[e.inputs[1],e.inputs[2]],outputs:[]})}}),Jp,Qp,eh,Wr,th,nh,ih,sh,rh,ah,oh,uh,Vr,lh,dh,ch,ph,hh,fh,mh,d0=$(()=>{"use strict";re(),le(),Oe(),de(),Jp=(e,t)=>{if(e.every(n=>n>0||(()=>{throw new Error("Resize requires scales input values to be positive")})),e.length>0){if(t.mode==="linear"){if(!(e.length===2||e.length===3||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1||e.length===5&&e[0]===1&&e[1]===1))throw new Error(`For linear mode, Resize requires scales to be 2D, 3D, 4D with either two outermost or one innermost and
            one outermost scale values equal to 1, or 5D with two outermost scale values equal to 1`)}else if(t.mode==="cubic"&&!(e.length===2||e.length===4&&e[0]===1&&e[1]===1||e.length===4&&e[0]===1&&e[3]===1))throw new Error("Resize requires scales input size to be 2 or 4 for cubic mode")}},Qp=(e,t,n)=>{t.every(o=>o>=0&&o<n||(()=>{throw new Error("Resize requires axes input values to be positive and less than rank")}));let a=new Array(n).fill(1);return t.forEach((o,l)=>a[o]=e[l]),a},eh=(e,t,n,a,o,l)=>{let[d,c,h]=n>10?[1,2,3]:[-1,e.length>1?1:-1,-1],f=e[0].dims.length;if(d>0&&e.length>d&&e[d].dims.length>0)e[d].getFloat32Array().forEach(g=>l.push(g));else if(t.coordinateTransformMode==="tf_crop_and_resize")throw new Error("Resize requires RoI input to be specified when coordinateTransformMode is tfCropAndResize");if(c>0&&e.length>c&&e[c].dims.length===1&&e[c].dims[0]>0){if(e[c].getFloat32Array().forEach(g=>a.push(g)),a.length!==0&&a.length!==f&&n>=18&&a.length!==t.axes.length)throw new Error("Resize requires scales input size to be same as input rank or axes size for opset 18 and up");Jp(a,t),t.axes.length>0&&Qp(a,t.axes,f).forEach((g,_)=>a[_]=g)}if(h>0&&e.length>h&&e[h].dims.length===1&&e[h].dims[0]>0&&(e[h].getBigInt64Array().forEach(g=>o.push(Number(g))),o.length!==0&&o.length!==f&&n>=18&&o.length!==t.axes.length))throw new Error("Resize requires sizes input size to be same as input rank or axes size for opset 18 and up");if(t.axes.length>0){if(a.length!==0&&a.length!==t.axes.length)throw new Error('Resize requires "scales" input size to be of axes rank when axes attributes is specified');if(o.length!==0&&o.length!==t.axes.length)throw new Error('Resize requires "sizes" input size to be of rank axes rank when axes attributes is specified')}if(typeof a<"u"&&typeof o<"u"&&a.length>0&&o.length>f)throw new Error("Resize requires only of scales or sizes to be specified")},Wr=(e,t,n,a)=>`
  // The whole part and the fractional part are calculated separately due to inaccuracy of floating
  // point division. As an example, f32(21) / f32(7) may evaluate to 2.99... instead of 3, causing an
  // offset-by-one error later in floor().
  let big = (${e}) * (${t});
  let whole = ${a}(big / (${n}));
  let fract = ${a}(big % (${n})) / ${a}(${n});
  return whole + fract;
`,th=(e,t)=>`fn getOriginalCoordinateFromResizedCoordinate(xResized: u32, xScale: f32, lengthResized: u32,
     lengthOriginal: u32, roiStart: f32, roiEnd: f32) -> ${t} { `+(()=>{switch(e){case"asymmetric":return`
          if (xScale < 1.0 || floor(xScale) != xScale) {
            return ${t}(xResized) / ${t}(xScale);
          } else {
            ${Wr("xResized","lengthOriginal","lengthResized",t)}
          }
        `;case"pytorch_half_pixel":return`if (lengthResized > 1) {
                    return (${t}(xResized) + 0.5) / ${t}(xScale) - 0.5;
                  } else {
                    return 0.0;
                  }`;case"tf_half_pixel_for_nn":return`return (${t}(xResized) + 0.5) / ${t}(xScale);`;case"align_corners":return`if (lengthResized == 1) {
                    return 0.0;
                  } else {
                    ${Wr("xResized","lengthOriginal - 1","lengthResized - 1",t)}
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
                  return offset + ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;case"half_pixel":return`return ((${t}(xResized) + 0.5) / ${t}(xScale)) - 0.5;`;default:throw new Error(`Coordinate transform mode ${e} is not supported`)}})()+"}",nh=(e,t,n)=>`fn getNearestPixelFromOriginal(xOriginal: ${n}, isDownSample: bool) -> ${n} {`+(()=>{switch(e){case"round_prefer_ceil":return"if (fract(xOriginal) == 0.5) {             return ceil(xOriginal);           } else {             return round(xOriginal);           }";case"floor":return"return floor(xOriginal);";case"ceil":return"return ceil(xOriginal);";case"round_prefer_floor":return"if (fract(xOriginal) == 0.5) {                     return floor(xOriginal);                   } else {                     return round(xOriginal);                   }";default:if(t<11)return"if (isDownSample)                     {                       return ceil(xOriginal);                     } else {                       return xOriginal;                     }";throw new Error(`Nearest mode ${e} is not supported`)}})()+"}",ih=(e,t,n)=>{let a=new Array(n).fill(0).concat(new Array(n).fill(1)),o=e.length===0?a:e.slice();return t.length>0?(t.forEach((l,d)=>{a[l]=o[d],a[d+n]=o[t.length+d]}),a):o},sh=(e,t,n,a)=>{let o=[];if(n.length>0)if(a.length>0){if(e.forEach(l=>o.push(l)),Math.max(...a)>e.length)throw new Error("axes is out of bound");a.forEach((l,d)=>o[l]=n[d])}else n.forEach(l=>o.push(l));else{if(t.length===0)throw new Error("Resize requires either scales or sizes.");o=e.map((l,d)=>Math.round(l*t[d]))}return o},rh=(e,t,n)=>{let a=(()=>{switch(n.keepAspectRatioPolicy){case"not_larger":return n.axes.length>0?Math.min(...n.axes.map(l=>t[l]),Number.MAX_VALUE):Math.min(...t,Number.MAX_VALUE);case"not_smaller":return n.axes.length>0?Math.max(...n.axes.map(l=>t[l]),Number.MIN_VALUE):Math.max(...t,Number.MIN_VALUE);default:throw new Error(`Keep aspect ratio policy ${n.keepAspectRatioPolicy} is not supported`)}})();t.fill(1,0,t.length);let o=e.slice();return n.axes.length>0?(n.axes.forEach(l=>t[l]=a),n.axes.forEach(l=>o[l]=Math.round(e[l]*t[l]))):(t.fill(a,0,t.length),o.forEach((l,d)=>o[d]=Math.round(l*t[d]))),o},ah=(e,t,n,a,o)=>`
    fn calculateOriginalIndicesFromOutputIndices(output_indices: ${e.type.indices}) -> array<${e.type.value}, ${n.length}> {
      var original_indices: array<${e.type.value}, ${n.length}>;
      for (var i:u32 = 0; i < ${n.length}; i++) {
        var output_index = ${e.indicesGet("output_indices","i")};
        var scale = ${Y("uniforms.scales","i",a)};
        var roi_low = ${Y("uniforms.roi","i",o)};
        var roi_hi = ${Y("uniforms.roi",`i + ${t.length}`,o)};
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
    }`,oh=(e,t,n,a,o,l,d)=>`
    fn calculateInputIndicesFromOutputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
      var input_indices: ${e.type.indices};
      for (var i:u32 = 0; i < ${a.length}; i++) {
        var output_index = ${t.indicesGet("output_indices","i")};
        var input_index: u32;
        var scale = ${Y("uniforms.scales","i",o)};
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
    }`,uh=(e,t)=>`
    fn checkInputIndices(input_indices: ${e.type.indices}) -> bool {
      for (var i:u32 = 0; i < ${t.length}; i++) {
        var input_index = ${e.indicesGet("input_indices","i")};
        if (input_index < 0 || input_index >= ${Y("uniforms.input_shape","i",t.length)}) {
          return false;
        }
      }
      return true;
    }`,Vr=(e,t,n,a)=>e.rank>a?`
    ${e.indicesSet("input_indices",t,"channel")};
    ${e.indicesSet("input_indices",n,"batch")};
`:"",lh=(e,t,n,a,o)=>{let[l,d,c,h]=n.length===2?[-1,0,1,-1]:[0,2,3,1],f=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, row: u32, col: u32) -> ${f} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",d,`max(0, min(row, ${n[d]} - 1))`)};
      ${e.indicesSet("input_indices",c,`max(0, min(col, ${n[c]} - 1))`)};
      ${Vr(e,h,l,2)}
      return ${e.getByIndices("input_indices")};
    }

    fn bilinearInterpolation(output_indices: ${t.type.indices}) -> ${f} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var row:${f} = originalIndices[${d}];
      var col:${f} = originalIndices[${c}];
      ${a?`if (row < 0 || row > (${n[d]} - 1) || col < 0 || col > (${n[c]} - 1)) {
        return ${o};
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
    }`},dh=(e,t,n,a,o,l,d,c,h,f)=>{let g=n.length===2,_=!0,[w,x]=g?[0,1]:_?[2,3]:[1,2],v=e.type.value,S=T=>{let k=T===w?"row":"col";return`
      fn ${k}CubicInterpolation(input_indices: ${e.type.indices}, output_indices: ${t.type.indices}) -> ${v} {
        var output_index = ${t.indicesGet("output_indices",T)};
        var originalIdx: ${v} = getOriginalCoordinateFromResizedCoordinate(output_index, ${o[T]},
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
          data[i + 1] = ${T===w?e.getByIndices("input_indices_copy"):"rowCubicInterpolation(input_indices_copy, output_indices)"};
        }
        return cubicInterpolation1D(data, coefs);
      }`};return`
    ${S(w)};
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
    `},ch=(e,t,n,a,o)=>{let[l,d,c,h,f]=n.length===3?[-1,0,1,2,-1]:[0,2,3,4,1],g=e.type.value;return`
    fn getInputValue(batch: u32, channel: u32, depth:u32, height: u32, width: u32) -> ${g} {
      var input_indices: ${e.type.indices};
      ${e.indicesSet("input_indices",d,`max(0, min(depth, ${n[d]} - 1))`)};
      ${e.indicesSet("input_indices",c,`max(0, min(height, ${n[c]} - 1))`)};
      ${e.indicesSet("input_indices",h,`max(0, min(width, ${n[h]} - 1))`)};
      ${Vr(e,f,l,3)}
      return ${e.getByIndices("input_indices")};
    }

    fn trilinearInterpolation(output_indices: ${t.type.indices}) -> ${g} {
      var originalIndices = calculateOriginalIndicesFromOutputIndices(output_indices);
      var depth:${g} = originalIndices[${d}];
      var height:${g} = originalIndices[${c}];
      var width:${g} = originalIndices[${h}];
      ${a?`if (depth < 0 || depth > (${n[d]} - 1) || height < 0 || height > (${n[c]} - 1) || width < 0 || (width > ${n[h]} - 1)) {
      return ${o};
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
    }`},ph=(e,t,n,a,o,l)=>{let d=e.dims,c=ih(l,t.axes,d.length),h=sh(d,a,o,t.axes),f=a.slice();a.length===0&&(f=d.map((E,A)=>E===0?1:h[A]/E),t.keepAspectRatioPolicy!=="stretch"&&(h=rh(d,f,t)));let g=H("output",e.dataType,h.length),_=U("input",e.dataType,d.length),w=L.size(h),x=d.length===h.length&&d.every((E,A)=>E===h[A]),v=t.coordinateTransformMode==="tf_crop_and_resize",S=t.extrapolationValue,T=_.type.value,k=E=>`
      ${x?"":`
      ${th(t.coordinateTransformMode,T)};
      ${(()=>{switch(t.mode){case"nearest":return`
              ${uh(_,d)};
              ${nh(t.nearestMode,n,T)};
              ${oh(_,g,d,h,f.length,c.length,v)};
              `;case"linear":return`
              ${ah(g,d,h,f.length,c.length)};
              ${(()=>{if(d.length===2||d.length===4)return`${lh(_,g,d,v,S)}`;if(d.length===3||d.length===5)return`${ch(_,g,d,v,S)}`;throw Error("Linear mode only supports input dims 2, 3, 4 and 5 are supported in linear mode.")})()};
            `;case"cubic":return`
            ${(()=>{if(d.length===2||d.length===4)return`${dh(_,g,d,h,f,c,t.cubicCoeffA,v,t.extrapolationValue,t.excludeOutside)}`;throw Error("Cubic mode only supports input dims 2 and 4 are supported in linear mode.")})()};
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
      }`;return{name:"Resize",shaderCache:{hint:`${t.cacheKey}|${n}|${f.length>0?t.mode==="cubic"?f:f.length:""}|${o.length>0?o:""}|${c.length>0?c:""}|${x}|${t.mode==="nearest"?d.length:d}`,inputDependencies:["rank"]},getShaderSource:k,getRunData:()=>({outputs:[{dims:h,dataType:e.dataType}],dispatchGroup:{x:Math.ceil(w/64)},programUniforms:[{type:12,data:w},{type:1,data:f},{type:1,data:c},...ee(d,h)]})}},hh=e=>{let t=e.customDataBuffer;return new Uint32Array(t.buffer,t.byteOffset,1)[0]},fh=(e,t)=>{let n=[],a=[],o=[],l=hh(e);if(t.antialias!==0)throw Error("Only default value (0) for Antialias attribute is supported");eh(e.inputs,t,l,n,a,o),e.compute(ph(e.inputs[0],t,l,n,a,o),{inputs:[0]})},mh=e=>{let t=e.antialias,n=e.axes,a=e.coordinateTransformMode,o=e.cubicCoeffA,l=e.excludeOutside!==0,d=e.extrapolationValue,c=e.keepAspectRatioPolicy,h=e.mode,f=e.nearestMode===""?"simple":e.nearestMode;return xe({antialias:t,axes:n,coordinateTransformMode:a,cubicCoeffA:o,excludeOutside:l,extrapolationValue:d,keepAspectRatioPolicy:c,mode:h,nearestMode:f})}}),gh,_h,yh,c0=$(()=>{"use strict";re(),le(),de(),gh=e=>{if(!e||e.length<3)throw new Error("layerNorm requires at least 3 inputs.");let t=e[0],n=e[1],a=e[2];if(t.dataType!==n.dataType||t.dataType!==a.dataType)throw new Error("All inputs must have the same data type");if(t.dims.length!==3&&t.dims.length!==2)throw new Error("Input must be 2D or 3D");if(n.dims.length!==3&&n.dims.length!==2)throw new Error("Skip must be 2D or 3D");let o=t.dims[t.dims.length-1],l=t.dims[t.dims.length-2];if(n.dims[n.dims.length-1]!==o)throw new Error("Skip must have the same hidden size as input");if(n.dims[n.dims.length-2]!==l)throw new Error("Skip must have the same sequence length as input");if(a.dims.length!==1)throw new Error("Gamma must be 1D");if(a.dims[a.dims.length-1]!==o)throw new Error("Gamma must have the same hidden size as input");if(e.length>3){let d=e[3];if(d.dims.length!==1)throw new Error("Beta must be 1D");if(d.dims[d.dims.length-1]!==o)throw new Error("Beta must have the same hidden size as input")}if(e.length>4){let d=e[4];if(d.dims.length!==1)throw new Error("Bias must be 1D");if(d.dims[d.dims.length-1]!==o)throw new Error("Bias must have the same hidden size as input")}},_h=(e,t,n,a)=>{let o=t.simplified,l=e[0].dims,d=L.size(l),c=l,h=d,f=l.slice(-1)[0],g=a?l.slice(0,-1).concat(1):[],_=!o&&e.length>3,w=e.length>4,x=a&&n>1,v=a&&n>2,S=n>3,T=64,k=Me(f),E=[{type:12,data:h},{type:12,data:k},{type:12,data:f},{type:1,data:t.epsilon}],A=C=>{let M=[{name:"output_size",type:"u32"},{name:"components",type:"u32"},{name:"hidden_size",type:"u32"},{name:"epsilon",type:"f32"}],D=[U("x",e[0].dataType,e[0].dims,k),U("skip",e[1].dataType,e[1].dims,k),U("gamma",e[2].dataType,e[2].dims,k)];_&&D.push(U("beta",e[3].dataType,e[3].dims,k)),w&&D.push(U("bias",e[4].dataType,e[4].dims,k)),D.push(H("output",e[0].dataType,c,k)),x&&D.push(H("mean_output",1,g)),v&&D.push(H("inv_std_output",1,g)),S&&D.push(H("input_skip_bias_sum",e[0].dataType,c,k));let N=Ue(e[0].dataType),W=Ue(1,k);return`

      ${C.registerUniforms(M).declareVariables(...D)}
      var<workgroup> sum_shared : array<${W}, ${T}>;
      var<workgroup> sum_squared_shared : array<${W}, ${T}>;

      ${C.mainStart([T,1,1])}
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
          let bias_value = ${w?"bias[offset1d + i]":N+"(0.0)"};
          let input_value = x[offset + i];
          let value = input_value + skip_value + bias_value;
          ${S?"input_skip_bias_sum[offset + i] = value;":""}
          output[offset + i] = value;
          let f32_value = ${yn(N,k,"value")};
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
        let mean = ${Ot("sum",k)} / f32(uniforms.hidden_size);
        let inv_std_dev = inverseSqrt(${Ot("square_sum",k)} / f32(uniforms.hidden_size) ${o?"":"- mean * mean"} + uniforms.epsilon);
        ${x?"mean_output[global_idx] = mean;":""}
        ${v?"inv_std_output[global_idx] = inv_std_dev;":""}

        for (var i: u32 = 0; i < stride; i++) {
          output[offset + i] = (output[offset + i] ${o?"":`- ${N}(mean)`}) *
            ${N}(inv_std_dev) * gamma[offset1d + i]
            ${_?"+ beta[offset1d + i]":""};
        }
      }`},z=[{dims:c,dataType:e[0].dataType}];return n>1&&z.push({dims:g,dataType:1}),n>2&&z.push({dims:g,dataType:1}),n>3&&z.push({dims:l,dataType:e[0].dataType}),{name:"SkipLayerNormalization",shaderCache:{hint:`${k};${x};${v};${S}`,inputDependencies:e.map((C,M)=>"type")},getShaderSource:A,getRunData:()=>({outputs:z,dispatchGroup:{x:Math.ceil(h/f)},programUniforms:E})}},yh=(e,t)=>{gh(e.inputs);let n=[0];e.outputCount>1&&n.push(-3),e.outputCount>2&&n.push(-3),e.outputCount>3&&n.push(3),e.compute(_h(e.inputs,t,e.outputCount,!1),{outputs:n})}}),wh,Vn,$h,jr,bh,vh,xh,Eh,p0=$(()=>{"use strict";re(),le(),Oe(),de(),wh=(e,t)=>{if(!e||e.length<1)throw new Error("too few inputs");if(t.axes.length!==0){if(t.axes.length!==t.starts.length||t.axes.length!==t.ends.length)throw new Error("axes, starts and ends must have the same length")}else if(t.starts.length!==t.ends.length)throw new Error("starts and ends must have the same length");e.slice(1).forEach((n,a)=>{if(e[a+1].dataType!==6&&e[a+1].dataType!==7)throw new Error(`Input ${a} must be an array of int32 or int64`)})},Vn=(e,t)=>{let n=[];if(e.length>t)if(e[t].dataType===7)e[t].getBigInt64Array().forEach(a=>n.push(Number(a)));else if(e[t].dataType===6)e[t].getInt32Array().forEach(a=>n.push(Number(a)));else throw new Error(`Input ${t} must be an array of int32 or int64`);return n},$h=(e,t)=>{if(e.length>1){let n=Vn(e,1),a=Vn(e,2),o=Vn(e,3);return o.length===0&&(o=[...Array(e[0].dims.length).keys()]),xe({starts:n,ends:a,axes:o})}else return t},jr=(e,t,n,a,o)=>{let l=e;return e<0&&(l+=n[a[t]]),o[t]<0?Math.max(0,Math.min(l,n[a[t]]-1)):Math.max(0,Math.min(l,n[a[t]]))},bh=(e,t,n)=>`fn calculateInputIndices(output_indices: ${t.type.indices}) -> ${e.type.indices} {
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
      }`,vh=(e,t)=>{let n=e[0].dims,a=L.size(n),o=t.axes.length>0?L.normalizeAxes(t.axes,n.length):[...Array(n.length).keys()],l=Vn(e,4);l.forEach(k=>k!==0||(()=>{throw new Error("step cannot be 0")})),l.length===0&&(l=Array(o.length).fill(1));let d=t.starts.map((k,E)=>jr(k,E,n,o,l)),c=t.ends.map((k,E)=>jr(k,E,n,o,l));if(o.length!==d.length||o.length!==c.length)throw new Error("start, ends and axes should have the same number of elements");if(o.length!==n.length)for(let k=0;k<n.length;++k)o.includes(k)||(d.splice(k,0,0),c.splice(k,0,n[k]),l.splice(k,0,1));let h=l.map(k=>Math.sign(k));l.forEach((k,E,A)=>{if(k<0){let z=(c[E]-d[E])/k,C=d[E],M=C+z*l[E];d[E]=M,c[E]=C,A[E]=-k}});let f=n.slice(0);o.forEach((k,E)=>{f[k]=Math.ceil((c[k]-d[k])/l[k])});let g={dims:f,dataType:e[0].dataType},_=H("output",e[0].dataType,f.length),w=U("input",e[0].dataType,e[0].dims.length),x=L.size(f),v=[{name:"outputSize",type:"u32"},{name:"starts",type:"u32",length:d.length},{name:"signs",type:"i32",length:h.length},{name:"steps",type:"u32",length:l.length}],S=[{type:12,data:x},{type:12,data:d},{type:6,data:h},{type:12,data:l},...ee(e[0].dims,f)],T=k=>`
      ${k.registerUniforms(v).declareVariables(w,_)}
        ${bh(w,_,n)}
        ${k.mainStart()}
          ${k.guardAgainstOutOfBoundsWorkgroupSizes("uniforms.outputSize")}
          let output_indices = ${_.offsetToIndices("global_idx")};
          let input_indices = calculateInputIndices(output_indices);
          ${_.setByOffset("global_idx",w.getByIndices("input_indices"))}
      }`;return{name:"Slice",shaderCache:{hint:`${h.length}_${d.length}_${l.length}`,inputDependencies:["rank"]},getShaderSource:T,getRunData:()=>({outputs:[g],dispatchGroup:{x:Math.ceil(a/64)},programUniforms:S})}},xh=(e,t)=>{wh(e.inputs,t);let n=$h(e.inputs,t);e.compute(vh(e.inputs,n),{inputs:[0]})},Eh=e=>{let t=e.starts,n=e.ends,a=e.axes;return xe({starts:t,ends:n,axes:a})}}),kh,Sh,Ih,Th,h0=$(()=>{"use strict";re(),le(),Oe(),Mt(),de(),kh=e=>{if(!e||e.length!==1)throw new Error("Softmax op requires 1 input.")},Sh=(e,t)=>{let n=e.inputs[0],a=n.dims,o=L.size(a),l=a.length,d=L.normalizeAxis(t.axis,l),c=d<a.length-1,h,f=[];c?(f=Array.from({length:l},(D,N)=>N),f[d]=l-1,f[l-1]=d,h=e.compute(at(n,f),{inputs:[n],outputs:[-1]})[0]):h=n;let g=h.dims,_=g[l-1],w=o/_,x=Me(_),v=_/x,S=64;w===1&&(S=256);let T=(D,N)=>N===4?`max(max(${D}.x, ${D}.y), max(${D}.z, ${D}.w))`:N===2?`max(${D}.x, ${D}.y)`:N===3?`max(max(${D}.x, ${D}.y), ${D}.z)`:D,k=U("x",h.dataType,h.dims,x),E=H("result",h.dataType,h.dims,x),A=k.type.value,z=Ue(h.dataType)==="f32"?`var threadMax = ${A}(-3.4028234663852886e+38f);`:`var threadMax = ${A}(-65504.0h);`,C=D=>`
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
      ${D.registerUniform("packedCols","i32").declareVariables(k,E)}
      ${D.mainStart(S)}
        let gindex = i32(global_idx);
        let lindex = i32(local_idx);
        const wg = ${S};
        let row = gindex / wg;
        let cols = uniforms.packedCols;
        let row_stride : i32 = uniforms.packedCols;

        // find the rows max
        ${z}
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
          rowSumShared = ${A}(${Ot("threadShared[0]",x)});
        }
        workgroupBarrier();

        // calculate final value for each element in the row
        for (var col = lindex; col < cols; col += wg) {
          var value = exp(getValue(row, col, row_stride) - rowMaxShared) / rowSumShared;
          // max operation protects against NaN since all values should be >=0
          value = max(value, ${A}(0.0));
          setValue(row, col, row_stride, value);
        }
      }`,M=e.compute({name:"Softmax",shaderCache:{hint:`${x};${S}`,inputDependencies:["type"]},getRunData:()=>({outputs:[{dims:g,dataType:h.dataType}],dispatchGroup:{x:w},programUniforms:[{type:6,data:v}]}),getShaderSource:C},{inputs:[h],outputs:[c?-1:0]})[0];c&&e.compute(at(M,f),{inputs:[M]})},Ih=(e,t)=>{kh(e.inputs),Sh(e,t)},Th=e=>xe({axis:e.axis})}),qr,Ah,zh,Ch,Oh,f0=$(()=>{"use strict";re(),le(),de(),qr=e=>Array.from(e.getBigInt64Array(),Number),Ah=e=>{if(!e||e.length!==2)throw new Error("Tile requires 2 inputs.");if(e[0].dataType!==1&&e[0].dataType!==10&&e[0].dataType!==6&&e[0].dataType!==12)throw new Error("Tile only support float, float16, int32, and uint32 data types");if(e[1].dataType!==7)throw new Error("Tile `repeats` input should be of int64 data type");if(e[1].dims.length!==1)throw new Error("Tile `repeats` input should be 1-D");if(qr(e[1]).length!==e[0].dims.length)throw new Error("Tile `repeats` input should have same number of elements as rank of input data tensor")},zh=(e,t)=>{let n=[];for(let a=0;a<e.length;++a)n.push(e[a]*t[a]);return n},Ch=(e,t)=>{let n=e[0].dims,a=t??qr(e[1]),o=zh(n,a),l=L.size(o),d=e[0].dataType,c=U("input",d,n.length),h=H("output",d,o.length),f=g=>`
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
    }`;return{name:"Tile",shaderCache:{hint:`${a}`,inputDependencies:["rank"]},getRunData:()=>({outputs:[{dims:o,dataType:e[0].dataType}],dispatchGroup:{x:Math.ceil(l/64)},programUniforms:[{type:12,data:l},...ee(e[0].dims,o)]}),getShaderSource:f}},Oh=e=>{Ah(e.inputs),e.compute(Ch(e.inputs),{inputs:[0]})}}),Mh,Ph,Rh,m0=$(()=>{"use strict";re(),le(),de(),Mh=(e,t,n,a,o)=>{let l=H("output_data",o,n.length,4),d=U("a_data",t[1].dataType,t[1].dims.length,4),c=U("b_data",t[2].dataType,t[2].dims.length,4),h=U("c_data",t[0].dataType,t[0].dims.length,4),f,g=(_,w,x)=>`select(${w}, ${_}, ${x})`;if(!a)f=l.setByOffset("global_idx",g(d.getByOffset("global_idx"),c.getByOffset("global_idx"),h.getByOffset("global_idx")));else{let _=(w,x,v="")=>{let S=`a_data[index_a${x}][component_a${x}]`,T=`b_data[index_b${x}][component_b${x}]`,k=`bool(c_data[index_c${x}] & (0xffu << (component_c${x} * 8)))`;return`
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
            ${w}[${x}] = ${v}(${g(S,T,k)});
          `};o===9?f=`
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
      }`},Ph=e=>{let t=e[1].dims,n=e[2].dims,a=e[0].dims,o=e[1].dataType,l=!(L.areEqual(t,n)&&L.areEqual(n,a)),d=t,c=L.size(t);if(l){let f=gn.calcShape(gn.calcShape(t,n,!1),a,!1);if(!f)throw new Error("Can't perform where op on the given tensors");d=f,c=L.size(d)}let h=Math.ceil(c/4);return{name:"Where",shaderCache:{inputDependencies:["rank","rank","rank"]},getShaderSource:f=>Mh(f,e,d,l,o),getRunData:()=>({outputs:[{dims:d,dataType:o}],dispatchGroup:{x:Math.ceil(c/64/4)},programUniforms:[{type:12,data:h},...ee(a,t,n,d)]})}},Rh=e=>{e.compute(Ph(e.inputs))}}),Dh,g0=$(()=>{"use strict";Ag(),nr(),zg(),Cg(),Og(),Mg(),Pg(),Ng(),Fg(),Wg(),Vg(),jg(),qg(),Gg(),Hg(),Kg(),Zg(),Xg(),Yg(),Jg(),Qg(),e0(),t0(),n0(),i0(),s0(),Kc(),r0(),a0(),o0(),u0(),l0(),Qs(),d0(),sp(),c0(),p0(),h0(),tp(),f0(),Mt(),ar(),m0(),Dh=new Map([["Abs",[ll]],["Acos",[dl]],["Acosh",[cl]],["Add",[Ql]],["ArgMax",[Ku,tr]],["ArgMin",[Hu,tr]],["Asin",[pl]],["Asinh",[hl]],["Atan",[fl]],["Atanh",[ml]],["Attention",[el]],["AveragePool",[Pp,Mp]],["BatchNormalization",[sl]],["BiasAdd",[ol]],["BiasSplitGelu",[Xl]],["Cast",[_l,gl]],["Ceil",[$l]],["Clip",[wl]],["Concat",[cd,pd]],["Conv",[wr,_r]],["ConvTranspose",[Nd,Dd]],["Cos",[bl]],["Cosh",[vl]],["CumSum",[Fd,Wd]],["DepthToSpace",[Gd,Hd]],["DequantizeLinear",[Vp,jp]],["DFT",[ec,tc]],["Div",[ed]],["Einsum",[oc,uc]],["Elu",[xl,Dn]],["Equal",[td]],["Erf",[El]],["Exp",[kl]],["Expand",[pc]],["FastGelu",[fc]],["Floor",[Sl]],["FusedConv",[wr,_r]],["Gather",[yc,_c]],["GatherElements",[Ac,Tc]],["GatherBlockQuantized",[Ec,kc]],["GatherND",[$c,bc]],["Gelu",[Il]],["Gemm",[Mc,Oc]],["GlobalAveragePool",[Dp,Rp]],["GlobalMaxPool",[Up,Np]],["Greater",[rd]],["GreaterOrEqual",[od]],["GridSample",[Wc,Vc]],["GroupQueryAttention",[up]],["HardSigmoid",[Rl,Pl]],["HardSwish",[Dl]],["InstanceNormalization",[cp]],["LayerNormalization",[fp]],["LeakyRelu",[Tl,Dn]],["Less",[ad]],["LessOrEqual",[ud]],["Log",[jl]],["MatMul",[gp]],["MatMulNBits",[$p,bp]],["MaxPool",[Bp,Lp]],["Mul",[nd]],["MultiHeadAttention",[Hc,qc]],["Neg",[zl]],["Not",[Al]],["Pad",[zp]],["Pow",[id]],["QuickGelu",[Hl,Dn]],["Range",[Hp]],["Reciprocal",[Cl]],["ReduceMin",[Wu]],["ReduceMean",[Bu]],["ReduceMax",[Fu]],["ReduceSum",[ju]],["ReduceProd",[Vu]],["ReduceL1",[Lu]],["ReduceL2",[Nu]],["ReduceLogSum",[Gu]],["ReduceLogSumExp",[Uu]],["ReduceSumSquare",[qu]],["Relu",[Ol]],["Resize",[fh,mh]],["RotaryEmbedding",[ip]],["ScatterND",[Yp,Xp]],["Sigmoid",[Ml]],["Sin",[Bl]],["Sinh",[Ll]],["Slice",[xh,Eh]],["SkipLayerNormalization",[yh]],["Split",[Qc,ep]],["Sqrt",[Nl]],["Softmax",[Ih,Th]],["Sub",[sd]],["Tan",[Ul]],["Tanh",[Fl]],["ThresholdedRelu",[Vl,Dn]],["Tile",[Oh]],["Transpose",[su,ru]],["Where",[Rh]]])}),Bh,_0=$(()=>{"use strict";st(),kt(),de(),Bh=class{constructor(e){this.backend=e,this.repo=new Map,this.attributesBound=!1}getArtifact(e){return this.repo.get(e)}setArtifact(e,t){this.repo.set(e,t)}run(e,t,n,a,o){Xe(e.programInfo.name);let l=this.backend.device,d=this.backend.getComputePassEncoder();this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2);let c=[];for(let f of t)c.push({binding:c.length,resource:{buffer:f.buffer}});for(let f of n)c.push({binding:c.length,resource:{buffer:f.buffer}});o&&c.push({binding:c.length,resource:o});let h=l.createBindGroup({layout:e.computePipeline.getBindGroupLayout(0),entries:c,label:e.programInfo.name});if(this.backend.sessionStatus==="capturing"){let f={kernelId:this.backend.currentKernelId,computePipeline:e.computePipeline,bindGroup:h,dispatchGroup:a};this.backend.capturedCommandList.get(this.backend.currentSessionId).push(f)}d.setPipeline(e.computePipeline),d.setBindGroup(0,h),d.dispatchWorkgroups(...a),this.backend.writeTimestamp(this.backend.pendingDispatchNumber*2+1),this.backend.pendingDispatchNumber++,(this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber||this.backend.queryType==="at-passes")&&this.backend.endComputePass(),this.backend.pendingDispatchNumber>=this.backend.maxDispatchNumber&&this.backend.flush(),We(e.programInfo.name)}dispose(){}build(e,t){Xe(e.name);let n=this.backend.device,a=[];[{feature:"shader-f16",extension:"f16"},{feature:"subgroups",extension:"subgroups"}].forEach(f=>{n.features.has(f.feature)&&a.push(`enable ${f.extension};`)});let o=Jo(t,this.backend.device.limits),l=e.getShaderSource(o),d=`${a.join(`
`)}
${o.additionalImplementations}
${l}`,c=n.createShaderModule({code:d,label:e.name});we("verbose",()=>`[WebGPU] ${e.name} shader code: ${d}`);let h=n.createComputePipeline({compute:{module:c,entryPoint:"main"},layout:"auto",label:e.name});return We(e.name),{programInfo:e,computePipeline:h,uniformVariablesInfo:o.variablesInfo}}normalizeDispatchGroupSize(e){let t=typeof e=="number"?e:e.x,n=typeof e=="number"?1:e.y||1,a=typeof e=="number"?1:e.z||1,o=this.backend.device.limits.maxComputeWorkgroupsPerDimension;if(t<=o&&n<=o&&a<=o)return[t,n,a];let l=t*n*a,d=Math.ceil(Math.sqrt(l));if(d>o){if(d=Math.ceil(Math.cbrt(l)),d>o)throw new Error("Total dispatch size exceeds WebGPU maximum.");return[d,d,d]}else return[d,d,1]}}}),Lh={};I(Lh,{WebGpuBackend:()=>Wh});var Nh,Uh,Fh,Wh,y0=$(()=>{"use strict";st(),re(),kt(),Bo(),Ig(),g0(),_0(),Nh=(e,t)=>{if(t.length!==e.length)throw new Error(`inputDependencies length ${t.length} is not equal to inputTensors length ${e.length}.`);let n=[];for(let a=0;a<e.length;++a){let o=e[a].dataType;switch(t[a]){case"none":{n.push("");break}case"type":{n.push(`${o}`);break}case"rank":{let l=e[a].dims.length;n.push(`${o};${l}`);break}case"dims":{let l=e[a].dims.join(",");n.push(`${o};${l}`);break}default:throw new Error(`unsupported input dependency: ${t[a]}`)}}return n.join("|")},Uh=(e,t,n)=>{var o,l;let a=e.name;return(o=e.shaderCache)!=null&&o.hint&&(a+="["+e.shaderCache.hint+"]"),a+=":"+n+`:${Nh(t,((l=e.shaderCache)==null?void 0:l.inputDependencies)??new Array(t.length).fill("dims"))}`,a},Fh=class{constructor(e){e&&(this.architecture=e.architecture,this.vendor=e.vendor)}isArchitecture(e){return this.architecture===e}isVendor(e){return this.vendor===e}},Wh=class{constructor(){this.currentSessionId=null,this.currentKernelId=null,this.commandEncoder=null,this.computePassEncoder=null,this.maxDispatchNumber=16,this.pendingDispatchNumber=0,this.pendingKernels=[],this.pendingQueries=new Map,this.sessionStatus="default",this.capturedCommandList=new Map,this.capturedPendingKernels=new Map,this.sessionExternalDataMapping=new Map}get currentKernelCustomData(){if(this.currentKernelId===null)throw new Error("currentKernelCustomData(): currentKernelId is null. (should not happen)");let e=this.kernelCustomData.get(this.currentKernelId);return e||(e={},this.kernelCustomData.set(this.currentKernelId,e)),e}async initialize(e,t){this.env=e;let n=[],a={requiredLimits:{maxComputeWorkgroupStorageSize:t.limits.maxComputeWorkgroupStorageSize,maxComputeWorkgroupsPerDimension:t.limits.maxComputeWorkgroupsPerDimension,maxStorageBufferBindingSize:t.limits.maxStorageBufferBindingSize,maxBufferSize:t.limits.maxBufferSize,maxComputeInvocationsPerWorkgroup:t.limits.maxComputeInvocationsPerWorkgroup,maxComputeWorkgroupSizeX:t.limits.maxComputeWorkgroupSizeX,maxComputeWorkgroupSizeY:t.limits.maxComputeWorkgroupSizeY,maxComputeWorkgroupSizeZ:t.limits.maxComputeWorkgroupSizeZ},requiredFeatures:n},o=c=>t.features.has(c)&&n.push(c)&&!0;o("chromium-experimental-timestamp-query-inside-passes")||o("timestamp-query"),o("shader-f16"),o("subgroups"),this.device=await t.requestDevice(a);let l=t,d=t.info??(typeof l.requestAdapterInfo=="function"?await l.requestAdapterInfo():void 0);this.adapterInfo=new Fh(d),this.gpuDataManager=Ko(this),this.programManager=new Bh(this),this.kernels=new Map,this.kernelPersistentData=new Map,this.kernelCustomData=new Map,Bs(e.logLevel,!!e.debug),this.device.onuncapturederror=c=>{c.error instanceof GPUValidationError&&console.error(`An uncaught WebGPU validation error was raised: ${c.error.message}`)},Object.defineProperty(this.env.webgpu,"device",{value:this.device,writable:!1,enumerable:!0,configurable:!0}),Object.defineProperty(this.env.webgpu,"adapter",{value:t,writable:!1,enumerable:!0,configurable:!1}),this.setQueryType()}dispose(){var e;typeof this.querySet<"u"&&this.querySet.destroy(),this.gpuDataManager.dispose(),this.device&&((e=this.env)!=null&&e.webgpu)&&this.device.lost.then(()=>{delete this.env.webgpu.device})}getCommandEncoder(){return this.commandEncoder||(this.commandEncoder=this.device.createCommandEncoder()),this.commandEncoder}getComputePassEncoder(){if(!this.computePassEncoder){let e=this.getCommandEncoder(),t={};this.queryType==="at-passes"&&(t.timestampWrites={querySet:this.querySet,beginningOfPassWriteIndex:this.pendingDispatchNumber*2,endOfPassWriteIndex:this.pendingDispatchNumber*2+1}),this.computePassEncoder=e.beginComputePass(t)}return this.computePassEncoder}endComputePass(){this.computePassEncoder&&(this.computePassEncoder.end(),this.computePassEncoder=null)}flush(){if(!this.commandEncoder)return;Xe(),this.endComputePass();let e;this.queryType!=="none"&&(this.commandEncoder.resolveQuerySet(this.querySet,0,this.pendingDispatchNumber*2,this.queryResolveBuffer,0),e=this.device.createBuffer({size:this.pendingDispatchNumber*2*8,usage:GPUBufferUsage.MAP_READ|GPUBufferUsage.COPY_DST}),this.pendingQueries.set(e,this.pendingKernels),this.pendingKernels=[],this.commandEncoder.copyBufferToBuffer(this.queryResolveBuffer,0,e,0,this.pendingDispatchNumber*2*8)),this.device.queue.submit([this.commandEncoder.finish()]),this.gpuDataManager.refreshPendingBuffers(),this.commandEncoder=null,this.pendingDispatchNumber=0,this.queryType!=="none"&&e.mapAsync(GPUMapMode.READ).then(()=>{var a;let t=new BigUint64Array(e.getMappedRange()),n=this.pendingQueries.get(e);for(let o=0;o<t.length/2;o++){let l=n[o],d=l.kernelId,c=this.kernels.get(d),h=c.kernelType,f=c.kernelName,g=l.programName,_=l.inputTensorViews,w=l.outputTensorViews,x=t[o*2],v=t[o*2+1];typeof this.queryTimeBase>"u"&&(this.queryTimeBase=x);let S=Number(x-this.queryTimeBase),T=Number(v-this.queryTimeBase);if(!Number.isSafeInteger(S)||!Number.isSafeInteger(T))throw new RangeError("incorrect timestamp range");if((a=this.env.webgpu.profiling)!=null&&a.ondata)this.env.webgpu.profiling.ondata({version:1,inputsMetadata:_.map(k=>({dims:k.dims,dataType:Et(k.dataType)})),outputsMetadata:w.map(k=>({dims:k.dims,dataType:Et(k.dataType)})),kernelId:d,kernelType:h,kernelName:f,programName:g,startTime:S,endTime:T});else{let k="";_.forEach((A,z)=>{k+=`input[${z}]: [${A.dims}] | ${Et(A.dataType)}, `});let E="";w.forEach((A,z)=>{E+=`output[${z}]: [${A.dims}] | ${Et(A.dataType)}, `}),console.log(`[profiling] kernel "${d}|${h}|${f}|${g}" ${k}${E}start time: ${S} ns, execution time: ${T-S} ns`)}Ne("GPU",`${g}::${x}::${v}`)}e.unmap(),this.pendingQueries.delete(e)}),We()}run(e,t,n,a,o,l){Xe(e.name);let d=[];for(let E=0;E<t.length;++E){let A=t[E].data;if(A===0)continue;let z=this.gpuDataManager.get(A);if(!z)throw new Error(`no GPU data for input: ${A}`);d.push(z)}let{outputs:c,dispatchGroup:h,programUniforms:f}=e.getRunData(t),g=n.length===0?c.map((E,A)=>A):n;if(g.length!==c.length)throw new Error(`Output size ${g.length} must be equal to ${c.length}.`);let _=[],w=[];for(let E=0;E<c.length;++E){if(!Number.isInteger(g[E])||g[E]<-3||g[E]>=l)throw new Error(`Invalid output index: ${g[E]}`);if(g[E]===-3)continue;let A=g[E]===-1,z=g[E]===-2,C=A||z?o(c[E].dataType,c[E].dims):a(g[E],c[E].dataType,c[E].dims);if(_.push(C),C.data===0)continue;let M=this.gpuDataManager.get(C.data);if(!M)throw new Error(`no GPU data for output: ${C.data}`);if(A&&this.temporaryData.push(M),z){let D=this.kernelPersistentData.get(this.currentKernelId);D||(D=[],this.kernelPersistentData.set(this.currentKernelId,D)),D.push(M)}w.push(M)}if(d.length!==t.length||w.length!==_.length){if(w.length===0)return We(e.name),_;throw new Error(`Program ${e.name} has zero-sized tensor(s) in inputs or outputs. This is not supported now.`)}let x;if(f){let E=0,A=[];f.forEach(D=>{let N=typeof D.data=="number"?[D.data]:D.data;if(N.length===0)return;let W=D.type===10?2:4,q,ie;D.type===10?(ie=N.length>4?16:N.length>2?8:N.length*W,q=N.length>4?16:W*N.length):(ie=N.length<=2?N.length*W:16,q=16),E=Math.ceil(E/ie)*ie,A.push(E);let K=D.type===10?8:4;E+=N.length>4?Math.ceil(N.length/K)*q:N.length*W});let z=16;E=Math.ceil(E/z)*z;let C=new ArrayBuffer(E);f.forEach((D,N)=>{let W=A[N],q=typeof D.data=="number"?[D.data]:D.data;if(D.type===6)new Int32Array(C,W,q.length).set(q);else if(D.type===12)new Uint32Array(C,W,q.length).set(q);else if(D.type===10)new Uint16Array(C,W,q.length).set(q);else if(D.type===1)new Float32Array(C,W,q.length).set(q);else throw new Error(`Unsupported uniform type: ${Et(D.type)}`)});let M=this.gpuDataManager.create(E,GPUBufferUsage.COPY_DST|GPUBufferUsage.UNIFORM);this.device.queue.writeBuffer(M.buffer,0,C,0,E),this.gpuDataManager.release(M.id),x={offset:0,size:E,buffer:M.buffer}}let v=this.programManager.normalizeDispatchGroupSize(h),S=v[1]===1&&v[2]===1,T=Uh(e,t,S),k=this.programManager.getArtifact(T);if(k||(k=this.programManager.build(e,v),this.programManager.setArtifact(T,k),we("info",()=>`[artifact] key: ${T}, programName: ${e.name}`)),f&&k.uniformVariablesInfo){if(f.length!==k.uniformVariablesInfo.length)throw new Error(`Uniform variables count mismatch: expect ${k.uniformVariablesInfo.length}, got ${f.length} in program "${k.programInfo.name}".`);for(let E=0;E<f.length;E++){let A=f[E],z=A.type,C=typeof A.data=="number"?1:A.data.length,[M,D]=k.uniformVariablesInfo[E];if(z!==M||C!==D)throw new Error(`Uniform variable ${E} mismatch: expect type ${M} with size ${D}, got type ${z} with size ${C} in program "${k.programInfo.name}".`)}}if(we("info",()=>`[ProgramManager] run "${e.name}" (key=${T}) with ${v[0]}x${v[1]}x${v[2]}`),this.queryType!=="none"||this.sessionStatus==="capturing"){let E={kernelId:this.currentKernelId,programName:k.programInfo.name,inputTensorViews:t,outputTensorViews:_};this.pendingKernels.push(E),this.sessionStatus==="capturing"&&this.capturedPendingKernels.get(this.currentSessionId).push(E)}return this.programManager.run(k,d,w,v,x),We(e.name),_}upload(e,t){this.gpuDataManager.upload(e,t)}memcpy(e,t){this.gpuDataManager.memcpy(e,t)}async download(e,t){await this.gpuDataManager.download(e,t)}alloc(e){return this.gpuDataManager.create(e).id}free(e){return this.gpuDataManager.release(e)}createKernel(e,t,n,a){let o=Dh.get(e);if(!o)throw new Error(`kernel not implemented: ${e}`);let l={kernelType:e,kernelName:a,kernelEntry:o[0],attributes:[o[1],n]};this.kernels.set(t,l)}releaseKernel(e){let t=this.kernelPersistentData.get(e);if(t){for(let n of t)this.gpuDataManager.release(n.id);this.kernelPersistentData.delete(e)}this.kernelCustomData.delete(e),this.kernels.delete(e)}computeKernel(e,t,n){let a=this.kernels.get(e);if(!a)throw new Error(`kernel not created: ${e}`);let o=a.kernelType,l=a.kernelName,d=a.kernelEntry,c=a.attributes;if(this.currentKernelId!==null)throw new Error(`kernel "[${o}] ${l}" is not allowed to be called recursively`);this.currentKernelId=e,c[0]&&(c[1]=c[0](c[1]),c[0]=void 0),we("info",()=>`[WebGPU] Start to run kernel "[${o}] ${l}"...`);let h=this.env.debug;this.temporaryData=[];try{return h&&this.device.pushErrorScope("validation"),d(t,c[1]),0}catch(f){return n.push(Promise.resolve(`[WebGPU] Kernel "[${o}] ${l}" failed. ${f}`)),1}finally{h&&n.push(this.device.popErrorScope().then(f=>f?`GPU validation error for kernel "[${o}] ${l}": ${f.message}`:null));for(let f of this.temporaryData)this.gpuDataManager.release(f.id);this.temporaryData=[],this.currentKernelId=null}}registerBuffer(e,t,n,a){let o=this.sessionExternalDataMapping.get(e);o||(o=new Map,this.sessionExternalDataMapping.set(e,o));let l=o.get(t),d=this.gpuDataManager.registerExternalBuffer(n,a,l);return o.set(t,[d,n]),d}unregisterBuffers(e){let t=this.sessionExternalDataMapping.get(e);t&&(t.forEach(n=>this.gpuDataManager.unregisterExternalBuffer(n[0])),this.sessionExternalDataMapping.delete(e))}getBuffer(e){let t=this.gpuDataManager.get(e);if(!t)throw new Error(`no GPU data for buffer: ${e}`);return t.buffer}createDownloader(e,t,n){return async()=>{let a=await Ks(this,e,t);return Ls(a.buffer,n)}}writeTimestamp(e){this.queryType==="inside-passes"&&this.computePassEncoder.writeTimestamp(this.querySet,e)}setQueryType(){var e;this.queryType="none",(((e=this.env.webgpu.profiling)==null?void 0:e.mode)==="default"||(typeof this.env.trace>"u"?this.env.wasm.trace:this.env.trace))&&(this.device.features.has("chromium-experimental-timestamp-query-inside-passes")?this.queryType="inside-passes":this.device.features.has("timestamp-query")&&(this.queryType="at-passes"),this.queryType!=="none"&&typeof this.querySet>"u"&&(this.querySet=this.device.createQuerySet({type:"timestamp",count:this.maxDispatchNumber*2}),this.queryResolveBuffer=this.device.createBuffer({size:this.maxDispatchNumber*2*8,usage:GPUBufferUsage.COPY_SRC|GPUBufferUsage.QUERY_RESOLVE})))}captureBegin(){we("info","captureBegin"),this.capturedCommandList.get(this.currentSessionId)||this.capturedCommandList.set(this.currentSessionId,[]),this.capturedPendingKernels.get(this.currentSessionId)||this.capturedPendingKernels.set(this.currentSessionId,[]),this.flush(),this.sessionStatus="capturing"}captureEnd(){we("info","captureEnd"),this.flush(),this.sessionStatus="default"}replay(){we("info","replay"),this.sessionStatus="replaying";let e=this.capturedCommandList.get(this.currentSessionId),t=this.capturedPendingKernels.get(this.currentSessionId),n=e.length;this.pendingKernels=[];for(let a=0;a<n;a++){let o=this.getComputePassEncoder(),l=e[a];this.writeTimestamp(this.pendingDispatchNumber*2),o.setPipeline(l.computePipeline),o.setBindGroup(0,l.bindGroup),o.dispatchWorkgroups(...l.dispatchGroup),this.writeTimestamp(this.pendingDispatchNumber*2+1),this.pendingDispatchNumber++,this.queryType!=="none"&&this.pendingKernels.push(t[a]),(this.pendingDispatchNumber>=this.maxDispatchNumber||this.queryType==="at-passes")&&this.endComputePass(),this.pendingDispatchNumber>=this.maxDispatchNumber&&this.flush()}this.flush(),this.sessionStatus="default"}onCreateSession(){this.gpuDataManager.onCreateSession()}onReleaseSession(e){this.unregisterBuffers(e),this.capturedCommandList.has(e)&&this.capturedCommandList.delete(e),this.capturedPendingKernels.has(e)&&this.capturedPendingKernels.delete(e),this.gpuDataManager.onReleaseSession(e)}onRunStart(e){this.currentSessionId=e,this.setQueryType()}}}),Vh={};I(Vh,{init:()=>qh});var Ci,jh,qh,w0=$(()=>{"use strict";re(),kt(),le(),Sg(),Ci=class ug{constructor(t,n,a,o){this.module=t,this.dataType=n,this.data=a,this.dims=o}getFloat32Array(){if(this.dataType!==1)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new Float32Array:new Float32Array(this.module.HEAP8.buffer,this.data,t)}getBigInt64Array(){if(this.dataType!==7)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new BigInt64Array:new BigInt64Array(this.module.HEAP8.buffer,this.data,t)}getInt32Array(){if(this.dataType!==6)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new Int32Array:new Int32Array(this.module.HEAP8.buffer,this.data,t)}getUint16Array(){if(this.dataType!==10&&this.dataType!==4)throw new Error("Invalid data type");let t=L.size(this.dims);return t===0?new Uint16Array:new Uint16Array(this.module.HEAP8.buffer,this.data,t)}reshape(t){if(L.size(t)!==L.size(this.dims))throw new Error("Invalid new shape");return new ug(this.module,this.dataType,this.data,t)}},jh=class{constructor(e,t,n){this.module=e,this.backend=t,this.customDataOffset=0,this.customDataSize=0,this.adapterInfo=t.adapterInfo,this.deviceLimits=t.device.limits;let a=e.PTR_SIZE,o=n/e.PTR_SIZE,l=a===4?"i32":"i64";this.opKernelContext=Number(e.getValue(a*o++,l));let d=Number(e.getValue(a*o++,l));this.outputCount=Number(e.getValue(a*o++,l)),this.customDataOffset=Number(e.getValue(a*o++,"*")),this.customDataSize=Number(e.getValue(a*o++,l));let c=[];for(let h=0;h<d;h++){let f=Number(e.getValue(a*o++,l)),g=Number(e.getValue(a*o++,"*")),_=Number(e.getValue(a*o++,l)),w=[];for(let x=0;x<_;x++)w.push(Number(e.getValue(a*o++,l)));c.push(new Ci(e,f,g,w))}this.inputs=c}get kernelCustomData(){return this.backend.currentKernelCustomData}get customDataBuffer(){return this.module.HEAPU8.subarray(this.customDataOffset,this.customDataOffset+this.customDataSize)}compute(e,t){var d;let n=((d=t==null?void 0:t.inputs)==null?void 0:d.map(c=>typeof c=="number"?this.inputs[c]:c))??this.inputs,a=(t==null?void 0:t.outputs)??[],o=(c,h,f)=>new Ci(this.module,h,this.output(c,f),f),l=(c,h)=>{let f=Xt(c,h);if(!f)throw new Error(`Unsupported data type: ${c}`);let g=f>0?this.backend.gpuDataManager.create(f).id:0;return new Ci(this.module,c,g,h)};return this.backend.run(e,n,a,o,l,this.outputCount)}output(e,t){let n=this.module.stackSave();try{let a=this.module.PTR_SIZE,o=a===4?"i32":"i64",l=this.module.stackAlloc((1+t.length)*a);this.module.setValue(l,t.length,o);for(let d=0;d<t.length;d++)this.module.setValue(l+a*(d+1),t[d],o);return this.module._JsepOutput(this.opKernelContext,e,l)}catch(a){throw new Error(`Failed to generate kernel's output[${e}] with dims [${t}]. If you are running with pre-allocated output, please make sure the output type/dims are correct. Error: ${a}`)}finally{this.module.stackRestore(n)}}},qh=async(e,t,n,a)=>{let o=t.jsepInit;if(!o)throw new Error("Failed to initialize JSEP. The WebAssembly module is not built with JSEP support.");if(e==="webgpu"){let l=(y0(),O(Lh)).WebGpuBackend,d=new l;await d.initialize(n,a),o("webgpu",[d,c=>d.alloc(Number(c)),c=>d.free(c),(c,h,f,g=!1)=>{if(g)we("verbose",()=>`[WebGPU] jsepCopyGpuToGpu: src=${Number(c)}, dst=${Number(h)}, size=${Number(f)}`),d.memcpy(Number(c),Number(h));else{we("verbose",()=>`[WebGPU] jsepCopyCpuToGpu: dataOffset=${Number(c)}, gpuDataId=${Number(h)}, size=${Number(f)}`);let _=t.HEAPU8.subarray(Number(c>>>0),Number(c>>>0)+Number(f));d.upload(Number(h),_)}},async(c,h,f)=>{we("verbose",()=>`[WebGPU] jsepCopyGpuToCpu: gpuDataId=${c}, dataOffset=${h}, size=${f}`),await d.download(Number(c),()=>t.HEAPU8.subarray(Number(h)>>>0,Number(h+f)>>>0))},(c,h,f)=>d.createKernel(c,Number(h),f,t.UTF8ToString(t._JsepGetNodeName(Number(h)))),c=>d.releaseKernel(c),(c,h,f,g)=>{we("verbose",()=>`[WebGPU] jsepRun: sessionHandle=${f}, kernel=${c}, contextDataOffset=${h}`);let _=new jh(t,d,Number(h));return d.computeKernel(Number(c),_,g)},()=>d.captureBegin(),()=>d.captureEnd(),()=>d.replay()])}else{let l=new jo(n);o("webnn",[l,()=>l.reserveTensorId(),d=>l.releaseTensorId(d),async(d,c,h,f,g)=>l.ensureTensor(d,c,h,f,g),(d,c)=>{l.uploadTensor(d,c)},async(d,c)=>l.downloadTensor(d,c),(d,c)=>l.registerMLContext(d,c),!!n.trace])}}}),Gh,Gr,Hr,Rt,Hh,Kr,Oi,Zr,Xr,jn,Kh,sn,Zh,Xh,Yr,Jr,Qr,ea,Yh=$(()=>{"use strict";st(),xg(),Eg(),re(),Ht(),Os(),Ds(),Gh=(e,t)=>{Se()._OrtInit(e,t)!==0&&be("Can't initialize onnxruntime.")},Gr=async e=>{Gh(e.wasm.numThreads,gi(e.logLevel))},Hr=async(e,t)=>{var a,o;(o=(a=Se()).asyncInit)==null||o.call(a);let n=e.webgpu.adapter;if(t==="webgpu"){if(typeof navigator>"u"||!navigator.gpu)throw new Error("WebGPU is not supported in current environment");if(n){if(typeof n.limits!="object"||typeof n.features!="object"||typeof n.requestDevice!="function")throw new Error("Invalid GPU adapter set in `env.webgpu.adapter`. It must be a GPUAdapter object.")}else{let l=e.webgpu.powerPreference;if(l!==void 0&&l!=="low-power"&&l!=="high-performance")throw new Error(`Invalid powerPreference setting: "${l}"`);let d=e.webgpu.forceFallbackAdapter;if(d!==void 0&&typeof d!="boolean")throw new Error(`Invalid forceFallbackAdapter setting: "${d}"`);if(n=await navigator.gpu.requestAdapter({powerPreference:l,forceFallbackAdapter:d}),!n)throw new Error('Failed to get GPU adapter. You may need to enable flag "--enable-unsafe-webgpu" if you are using Chrome.')}}if(t==="webnn"&&(typeof navigator>"u"||!navigator.ml))throw new Error("WebNN is not supported in current environment");{let l=(w0(),O(Vh)).init;t==="webgpu"&&await l("webgpu",Se(),e,n),t==="webnn"&&await l("webnn",Se(),e)}},Rt=new Map,Hh=e=>{let t=Se(),n=t.stackSave();try{let a=t.PTR_SIZE,o=t.stackAlloc(2*a);t._OrtGetInputOutputCount(e,o,o+a)!==0&&be("Can't get session input/output count.");let l=a===4?"i32":"i64";return[Number(t.getValue(o,l)),Number(t.getValue(o+a,l))]}finally{t.stackRestore(n)}},Kr=(e,t)=>{let n=Se(),a=n.stackSave(),o=0;try{let l=n.PTR_SIZE,d=n.stackAlloc(2*l);n._OrtGetInputOutputMetadata(e,t,d,d+l)!==0&&be("Can't get session input/output metadata.");let c=Number(n.getValue(d,"*"));o=Number(n.getValue(d+l,"*"));let h=n.HEAP32[o/4];if(h===0)return[c,0];let f=n.HEAPU32[o/4+1],g=[];for(let _=0;_<f;_++){let w=Number(n.getValue(o+8+_*l,"*"));g.push(w!==0?n.UTF8ToString(w):Number(n.getValue(o+8+(_+f)*l,"*")))}return[c,h,g]}finally{n.stackRestore(a),o!==0&&n._OrtFree(o)}},Oi=e=>{let t=Se(),n=t._malloc(e.byteLength);if(n===0)throw new Error(`Can't create a session. failed to allocate a buffer of size ${e.byteLength}.`);return t.HEAPU8.set(e,n),[n,e.byteLength]},Zr=async(e,t)=>{var _,w,x,v;let n,a,o=Se();Array.isArray(e)?[n,a]=e:e.buffer===o.HEAPU8.buffer?[n,a]=[e.byteOffset,e.byteLength]:[n,a]=Oi(e);let l=0,d=0,c=0,h=[],f=[],g=[];try{if([d,h]=await Io(t),(t==null?void 0:t.externalData)&&o.mountExternalData){let N=[];for(let W of t.externalData){let q=typeof W=="string"?W:W.path,ie=typeof W=="string"?W:W.data;N.push(_i(ie).then(K=>{o.mountExternalData(q,K)}))}await Promise.all(N)}for(let N of(t==null?void 0:t.executionProviders)??[])if((typeof N=="string"?N:N.name)==="webnn"){if(o.shouldTransferToMLTensor=!1,typeof N!="string"){let W=N,q=W==null?void 0:W.context,ie=W==null?void 0:W.gpuDevice,K=W==null?void 0:W.deviceType,Q=W==null?void 0:W.powerPreference;q?o.currentContext=q:ie?o.currentContext=await o.webnnCreateMLContext(ie):o.currentContext=await o.webnnCreateMLContext({deviceType:K,powerPreference:Q})}else o.currentContext=await o.webnnCreateMLContext();break}l=await o._OrtCreateSession(n,a,d),(_=o.webgpuOnCreateSession)==null||_.call(o,l),l===0&&be("Can't create a session."),(w=o.jsepOnCreateSession)==null||w.call(o),o.currentContext&&(o.webnnRegisterMLContext(l,o.currentContext),o.currentContext=void 0,o.shouldTransferToMLTensor=!0);let[S,T]=Hh(l),k=!!(t!=null&&t.enableGraphCapture),E=[],A=[],z=[],C=[],M=[];for(let N=0;N<S;N++){let[W,q,ie]=Kr(l,N);W===0&&be("Can't get an input name."),f.push(W);let K=o.UTF8ToString(W);E.push(K),z.push(q===0?{name:K,isTensor:!1}:{name:K,isTensor:!0,type:Et(q),shape:ie})}for(let N=0;N<T;N++){let[W,q,ie]=Kr(l,N+S);W===0&&be("Can't get an output name."),g.push(W);let K=o.UTF8ToString(W);A.push(K),C.push(q===0?{name:K,isTensor:!1}:{name:K,isTensor:!0,type:Et(q),shape:ie});{if(k&&(t==null?void 0:t.preferredOutputLocation)===void 0){M.push("gpu-buffer");continue}let Q=typeof(t==null?void 0:t.preferredOutputLocation)=="string"?t.preferredOutputLocation:((x=t==null?void 0:t.preferredOutputLocation)==null?void 0:x[K])??"cpu",_e=o.webnnIsGraphOutput;if(Q==="cpu"&&_e&&_e(l,K)){M.push("ml-tensor-cpu-output");continue}if(Q!=="cpu"&&Q!=="cpu-pinned"&&Q!=="gpu-buffer"&&Q!=="ml-tensor")throw new Error(`Not supported preferred output location: ${Q}.`);if(k&&Q!=="gpu-buffer")throw new Error(`Not supported preferred output location: ${Q}. Only 'gpu-buffer' location is supported when enableGraphCapture is true.`);M.push(Q)}}let D=null;return M.some(N=>N==="gpu-buffer"||N==="ml-tensor"||N==="ml-tensor-cpu-output")&&(c=o._OrtCreateBinding(l),c===0&&be("Can't create IO binding."),D={handle:c,outputPreferredLocations:M,outputPreferredLocationsEncoded:M.map(N=>N==="ml-tensor-cpu-output"?"ml-tensor":N).map(N=>Rs(N))}),Rt.set(l,[l,f,g,D,k,!1]),[l,E,A,z,C]}catch(S){throw f.forEach(T=>o._OrtFree(T)),g.forEach(T=>o._OrtFree(T)),c!==0&&o._OrtReleaseBinding(c)!==0&&be("Can't release IO binding."),l!==0&&o._OrtReleaseSession(l)!==0&&be("Can't release session."),S}finally{o._free(n),d!==0&&o._OrtReleaseSessionOptions(d)!==0&&be("Can't release session options."),h.forEach(S=>o._free(S)),(v=o.unmountExternalData)==null||v.call(o)}},Xr=e=>{var h,f,g;let t=Se(),n=Rt.get(e);if(!n)throw new Error(`cannot release session. invalid session id: ${e}`);let[a,o,l,d,c]=n;d&&(c&&t._OrtClearBoundOutputs(d.handle)!==0&&be("Can't clear bound outputs."),t._OrtReleaseBinding(d.handle)!==0&&be("Can't release IO binding.")),(h=t.jsepOnReleaseSession)==null||h.call(t,e),(f=t.webnnOnReleaseSession)==null||f.call(t,e),(g=t.webgpuOnReleaseSession)==null||g.call(t,e),o.forEach(_=>t._OrtFree(_)),l.forEach(_=>t._OrtFree(_)),t._OrtReleaseSession(a)!==0&&be("Can't release session."),Rt.delete(e)},jn=new Map,Kh=1,sn=new Map,Zh=e=>{let t=Se(),n=t._malloc(e.byteLength);if(n===0)throw new Error(`Can't create a LoRA adapter. failed to allocate a buffer of size ${e.byteLength}.`);try{t.HEAPU8.set(e,n);let a=t._OrtCreateLoraAdapter(n,e.byteLength);a===0&&be("Can't create a LoRA adapter.");let o=Kh++;return jn.set(o,a),o}finally{t._free(n)}},Xh=e=>{let t=Se(),n=jn.get(e);if(n===void 0)throw new Error(`cannot release LoRA adapter. invalid adapter id: ${e}`);if(sn.has(e))throw new Error(`cannot release LoRA adapter. the adapter is used by a run in progress. adapter id: ${e}`);t._OrtReleaseLoraAdapter(n)!==0&&be("Can't release LoRA adapter."),jn.delete(e)},Yr=async(e,t,n,a,o,l,d=!1)=>{if(!e){t.push(0);return}let c=Se(),h=c.PTR_SIZE,f=e[0],g=e[1],_=e[3],w=_,x,v;if(f==="string"&&(_==="gpu-buffer"||_==="ml-tensor"))throw new Error("String tensor is not supported on GPU.");if(d&&_!=="gpu-buffer")throw new Error(`External buffer must be provided for input/output index ${l} when enableGraphCapture is true.`);if(_==="gpu-buffer"){let k=e[2].gpuBuffer;v=Xt(Zt(f),g);{let E=c.jsepRegisterBuffer;if(!E)throw new Error('Tensor location "gpu-buffer" is not supported without using WebGPU.');x=E(a,l,k,v)}}else if(_==="ml-tensor"){let k=e[2].mlTensor;v=Xt(Zt(f),g);let E=c.webnnRegisterMLTensor;if(!E)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');x=E(a,k,Zt(f),g)}else{let k=e[2];if(Array.isArray(k)){v=h*k.length,x=c._malloc(v),n.push(x);for(let E=0;E<k.length;E++){if(typeof k[E]!="string")throw new TypeError(`tensor data at index ${E} is not a string`);c.setValue(x+E*h,pt(k[E],n),"*")}}else{let E=c.webnnIsGraphInput,A=c.webnnIsGraphOutput;if(f!=="string"&&E&&A){let z=c.UTF8ToString(o);if(E(a,z)||A(a,z)){let C=Zt(f);v=Xt(C,g),w="ml-tensor";let M=c.webnnCreateTemporaryTensor,D=c.webnnUploadTensor;if(!M||!D)throw new Error('Tensor location "ml-tensor" is not supported without using WebNN.');let N=await M(a,C,g);D(N,new Uint8Array(k.buffer,k.byteOffset,k.byteLength)),x=N}else v=k.byteLength,x=c._malloc(v),n.push(x),c.HEAPU8.set(new Uint8Array(k.buffer,k.byteOffset,v),x)}else v=k.byteLength,x=c._malloc(v),n.push(x),c.HEAPU8.set(new Uint8Array(k.buffer,k.byteOffset,v),x)}}let S=c.stackSave(),T=c.stackAlloc(4*g.length);try{g.forEach((E,A)=>c.setValue(T+A*h,E,h===4?"i32":"i64"));let k=c._OrtCreateTensor(Zt(f),x,v,T,g.length,Rs(w));k===0&&be(`Can't create tensor for input/output. session=${a}, index=${l}.`),t.push(k)}finally{c.stackRestore(S)}},Jr=async(e,t,n,a,o,l,d=[])=>{var _e,$e,oe,ce;let c=Se(),h=c.PTR_SIZE,f=Rt.get(e);if(!f)throw new Error(`cannot run inference. invalid session id: ${e}`);let g=f[0],_=f[1],w=f[2],x=f[3],v=f[4],S=f[5],T=[];if(d.length>0){if(x)throw new Error("LoRA adapters are not supported for a session that uses IO binding, e.g. when an output is preferred to be on GPU, or when the WebNN execution provider produces an output.");for(let ye of d){let ae=jn.get(ye);if(ae===void 0)throw new Error(`cannot run inference. invalid LoRA adapter id: ${ye}`);T.push(ae)}}let k=t.length,E=a.length,A=0,z=[],C=[],M=[],D=[],N=[],W=c.stackSave(),q=c.stackAlloc(k*h),ie=c.stackAlloc(k*h),K=c.stackAlloc(E*h),Q=c.stackAlloc(E*h);try{for(let F of d)sn.set(F,(sn.get(F)??0)+1);[A,z]=vo(l,T),dt("wasm prepareInputOutputTensor");for(let F=0;F<k;F++)await Yr(n[F],C,D,e,_[t[F]],t[F],v);for(let F=0;F<E;F++)await Yr(o[F],M,D,e,w[a[F]],k+a[F],v);yt("wasm prepareInputOutputTensor");for(let F=0;F<k;F++)c.setValue(q+F*h,C[F],"*"),c.setValue(ie+F*h,_[t[F]],"*");for(let F=0;F<E;F++)c.setValue(K+F*h,M[F],"*"),c.setValue(Q+F*h,w[a[F]],"*");if(x&&!S){let{handle:F,outputPreferredLocations:ne,outputPreferredLocationsEncoded:se}=x;if(_.length!==k)throw new Error(`input count from feeds (${k}) is expected to be always equal to model's input count (${_.length}).`);dt("wasm bindInputsOutputs");for(let j=0;j<k;j++){let Te=t[j];await c._OrtBindInput(F,_[Te],C[j])!==0&&be(`Can't bind input[${j}] for session=${e}.`)}for(let j=0;j<E;j++){let Te=a[j];(_e=o[j])!=null&&_e[3]?(N.push(M[j]),c._OrtBindOutput(F,w[Te],M[j],0)!==0&&be(`Can't bind pre-allocated output[${j}] for session=${e}.`)):c._OrtBindOutput(F,w[Te],0,se[Te])!==0&&be(`Can't bind output[${j}] to ${ne[j]} for session=${e}.`)}yt("wasm bindInputsOutputs"),Rt.set(e,[g,_,w,x,v,!0])}($e=c.jsepOnRunStart)==null||$e.call(c,g),(oe=c.webnnOnRunStart)==null||oe.call(c,g);let ye;x?ye=await c._OrtRunWithBinding(g,x.handle,E,K,A):ye=await c._OrtRun(g,ie,q,k,Q,E,K,A),ye!==0&&be("failed to call OrtRun().");let ae=[],ze=[];dt("wasm ProcessOutputTensor");for(let F=0;F<E;F++){let ne=Number(c.getValue(K+F*h,"*"));if(ne===M[F]||N.includes(M[F])){ae.push(o[F]),ne!==M[F]&&c._OrtReleaseTensor(ne)!==0&&be("Can't release tensor.");continue}let se=c.stackSave(),j=c.stackAlloc(4*h),Te=!1,Pe,Ae=0;try{c._OrtGetTensorData(ne,j,j+h,j+2*h,j+3*h)!==0&&be(`Can't access output tensor data on index ${F}.`);let ot=h===4?"i32":"i64",tt=Number(c.getValue(j,ot));Ae=c.getValue(j+h,"*");let gf=c.getValue(j+h*2,"*"),k0=Number(c.getValue(j+h*3,ot)),Dt=[];for(let je=0;je<k0;je++)Dt.push(Number(c.getValue(gf+je*h,ot)));c._OrtFree(gf)!==0&&be("Can't free memory for tensor dims.");let Bt=Dt.reduce((je,Be)=>je*Be,1);Pe=Et(tt);let Hn=x==null?void 0:x.outputPreferredLocations[a[F]];if(Pe==="string"){if(Hn==="gpu-buffer"||Hn==="ml-tensor")throw new Error("String tensor is not supported on GPU.");let je=[];for(let Be=0;Be<Bt;Be++){let Tt=c.getValue(Ae+Be*h,"*"),S0=c.getValue(Ae+(Be+1)*h,"*"),I0=Be===Bt-1?void 0:S0-Tt;je.push(c.UTF8ToString(Tt,I0))}ae.push([Pe,Dt,je,"cpu"])}else if(Hn==="gpu-buffer"&&Bt>0){let je=c.jsepGetBuffer;if(!je)throw new Error('preferredLocation "gpu-buffer" is not supported without using WebGPU.');let Be=je(Ae),Tt=Xt(tt,Bt);if(Tt===void 0||!Ms(Pe))throw new Error(`Unsupported data type: ${Pe}`);Te=!0,ae.push([Pe,Dt,{gpuBuffer:Be,download:c.jsepCreateDownloader(Be,Tt,Pe),dispose:()=>{c._OrtReleaseTensor(ne)!==0&&be("Can't release tensor.")}},"gpu-buffer"])}else if(Hn==="ml-tensor"&&Bt>0){let je=c.webnnEnsureTensor,Be=c.webnnIsGraphInputOutputTypeSupported;if(!je||!Be)throw new Error('preferredLocation "ml-tensor" is not supported without using WebNN.');if(Xt(tt,Bt)===void 0||!Ps(Pe))throw new Error(`Unsupported data type: ${Pe}`);if(!Be(e,Pe,!1))throw new Error(`preferredLocation "ml-tensor" for ${Pe} output is not supported by current WebNN Context.`);let Tt=await je(e,Ae,tt,Dt,!1);Te=!0,ae.push([Pe,Dt,{mlTensor:Tt,download:c.webnnCreateMLTensorDownloader(Ae,Pe),dispose:()=>{c.webnnReleaseTensorId(Ae),c._OrtReleaseTensor(ne)}},"ml-tensor"])}else if(Hn==="ml-tensor-cpu-output"&&Bt>0){let je=c.webnnCreateMLTensorDownloader(Ae,Pe)(),Be=ae.length;Te=!0,ze.push((async()=>{let Tt=[Be,await je];return c.webnnReleaseTensorId(Ae),c._OrtReleaseTensor(ne),Tt})()),ae.push([Pe,Dt,[],"cpu"])}else{let je=mi(Pe),Be=new je(Bt);new Uint8Array(Be.buffer,Be.byteOffset,Be.byteLength).set(c.HEAPU8.subarray(Ae,Ae+Be.byteLength)),ae.push([Pe,Dt,Be,"cpu"])}}finally{c.stackRestore(se),Pe==="string"&&Ae&&c._free(Ae),Te||c._OrtReleaseTensor(ne)}}x&&!v&&(c._OrtClearBoundOutputs(x.handle)!==0&&be("Can't clear bound outputs."),Rt.set(e,[g,_,w,x,v,!1]));for(let[F,ne]of await Promise.all(ze))ae[F][2]=ne;return yt("wasm ProcessOutputTensor"),ae}finally{(ce=c.webnnOnRunEnd)==null||ce.call(c,g),c.stackRestore(W),C.forEach(ye=>c._OrtReleaseTensor(ye)),M.forEach(ye=>c._OrtReleaseTensor(ye)),D.forEach(ye=>c._free(ye)),A!==0&&c._OrtReleaseRunOptions(A),z.forEach(ye=>c._free(ye));for(let ye of d){let ae=sn.get(ye)-1;ae===0?sn.delete(ye):sn.set(ye,ae)}}},Qr=e=>{let t=Se(),n=Rt.get(e);if(!n)throw new Error("invalid session id");let a=n[0],o=t._OrtEndProfiling(a);o===0&&be("Can't get an profile file name."),t._OrtFree(o)},ea=e=>{let t=[];for(let n of e){let a=n[2];!Array.isArray(a)&&"buffer"in a&&t.push(a.buffer)}return t}}),$t,et,wn,qn,Gn,Mi,ta,Pi,rn,an,Jh,Qh,ef,tf,nf,sf,rf,af,of,uf,na=$(()=>{"use strict";st(),Yh(),Ht(),Ts(),Ds(),$t=()=>!!ke.wasm.proxy&&typeof document<"u",wn=!1,qn=!1,Gn=!1,Pi=new Map,rn=(e,t)=>{let n=Pi.get(e);n?n.push(t):Pi.set(e,[t])},an=()=>{if(wn||!qn||Gn||!et)throw new Error("worker not ready")},Jh=e=>{switch(e.data.type){case"init-wasm":wn=!1,e.data.err?(Gn=!0,ta[1](e.data.err)):(qn=!0,ta[0]()),Mi&&(URL.revokeObjectURL(Mi),Mi=void 0);break;case"init-ep":case"copy-from":case"create":case"release":case"run":case"end-profiling":{let t=Pi.get(e.data.type);e.data.err?t.shift()[1](e.data.err):t.shift()[0](e.data.out);break}default:}},Qh=async()=>{if(!qn){if(wn)throw new Error("multiple calls to 'initWasm()' detected.");if(Gn)throw new Error("previous call to 'initWasm()' failed.");if(wn=!0,$t())return new Promise((e,t)=>{et==null||et.terminate(),_o().then(([n,a])=>{try{et=a,et.onerror=l=>t(l),et.onmessage=Jh,ta=[e,t];let o={type:"init-wasm",in:ke};if(!o.in.wasm.wasmPaths&&n){let l=Es();l&&(o.in.wasm.wasmPaths=l)}et.postMessage(o),Mi=n}catch(o){t(o)}},t)});try{await Cs(ke.wasm),await Gr(ke),qn=!0}catch(e){throw Gn=!0,e}finally{wn=!1}}},ef=async e=>{if($t())return an(),new Promise((t,n)=>{rn("init-ep",[t,n]);let a={type:"init-ep",in:{epName:e,env:ke}};et.postMessage(a)});await Hr(ke,e)},tf=async e=>$t()?(an(),new Promise((t,n)=>{rn("copy-from",[t,n]);let a={type:"copy-from",in:{buffer:e}};et.postMessage(a,[e.buffer])})):Oi(e),nf=async(e,t)=>{if($t()){if(t!=null&&t.preferredOutputLocation)throw new Error('session option "preferredOutputLocation" is not supported for proxy.');return an(),new Promise((n,a)=>{rn("create",[n,a]);let o={type:"create",in:{model:e,options:{...t}}},l=[];e instanceof Uint8Array&&l.push(e.buffer),et.postMessage(o,l)})}else return Zr(e,t)},sf=async e=>{if($t())return an(),new Promise((t,n)=>{rn("release",[t,n]);let a={type:"release",in:e};et.postMessage(a)});Xr(e)},rf=async e=>{if($t())throw new Error("LoRA adapter is not supported for proxy.");let t=typeof e=="string"?await _i(e):e;return Zh(t)},af=async e=>{if($t())throw new Error("LoRA adapter is not supported for proxy.");Xh(e)},of=async(e,t,n,a,o,l,d)=>{if($t()){if(d.length>0)throw new Error("LoRA adapter is not supported for proxy.");if(n.some(c=>c[3]!=="cpu"))throw new Error("input tensor on GPU is not supported for proxy.");if(o.some(c=>c))throw new Error("pre-allocated output tensor is not supported for proxy.");return an(),new Promise((c,h)=>{rn("run",[c,h]);let f=n,g={type:"run",in:{sessionId:e,inputIndices:t,inputs:f,outputIndices:a,options:l}};et.postMessage(g,ea(f))})}else return Jr(e,t,n,a,o,l,d)},uf=async e=>{if($t())return an(),new Promise((t,n)=>{rn("end-profiling",[t,n]);let a={type:"end-profiling",in:e};et.postMessage(a)});Qr(e)}}),ia,lf=$(()=>{"use strict";st(),na(),ia=class{async loadAdapter(e){Xe(),this.adapterId=await rf(e),We()}async dispose(){return af(this.adapterId)}}}),sa,df,cf,$0=$(()=>{"use strict";st(),lf(),na(),re(),bs(),Ds(),sa=(e,t)=>{switch(e.location){case"cpu":return[e.type,e.dims,e.data,"cpu"];case"gpu-buffer":return[e.type,e.dims,{gpuBuffer:e.gpuBuffer},"gpu-buffer"];case"ml-tensor":return[e.type,e.dims,{mlTensor:e.mlTensor},"ml-tensor"];default:throw new Error(`invalid data location: ${e.location} for ${t()}`)}},df=e=>{switch(e[3]){case"cpu":return new ct(e[0],e[2],e[1]);case"gpu-buffer":{let t=e[0];if(!Ms(t))throw new Error(`not supported data type: ${t} for deserializing GPU tensor`);let{gpuBuffer:n,download:a,dispose:o}=e[2];return ct.fromGpuBuffer(n,{dataType:t,dims:e[1],download:a,dispose:o})}case"ml-tensor":{let t=e[0];if(!Ps(t))throw new Error(`not supported data type: ${t} for deserializing MLTensor tensor`);let{mlTensor:n,download:a,dispose:o}=e[2];return ct.fromMLTensor(n,{dataType:t,dims:e[1],download:a,dispose:o})}default:throw new Error(`invalid data location: ${e[3]}`)}},cf=class{async fetchModelAndCopyToWasmMemory(e){return tf(await _i(e))}async loadModel(e,t){Xe();let n;typeof e=="string"?n=await this.fetchModelAndCopyToWasmMemory(e):n=e,[this.sessionId,this.inputNames,this.outputNames,this.inputMetadata,this.outputMetadata]=await nf(n,t),We()}async dispose(){return sf(this.sessionId)}async run(e,t,n,a=[]){Xe();let o=a.map(x=>{if(!(x instanceof ia))throw new Error("LoRA adapter was not created by the WebAssembly backend.");return x.adapterId}),l=[],d=[];Object.entries(e).forEach(x=>{let v=x[0],S=x[1],T=this.inputNames.indexOf(v);if(T===-1)throw new Error(`invalid input '${v}'`);l.push(S),d.push(T)});let c=[],h=[];Object.entries(t).forEach(x=>{let v=x[0],S=x[1],T=this.outputNames.indexOf(v);if(T===-1)throw new Error(`invalid output '${v}'`);c.push(S),h.push(T)});let f=l.map((x,v)=>sa(x,()=>`input "${this.inputNames[d[v]]}"`)),g=c.map((x,v)=>x?sa(x,()=>`output "${this.outputNames[h[v]]}"`):null),_=await of(this.sessionId,d,f,h,g,n,o),w={};for(let x=0;x<_.length;x++)w[this.outputNames[h[x]]]=c[x]??df(_[x]);return We(),w}startProfiling(){}endProfiling(){uf(this.sessionId)}}}),pf,b0=$(()=>{"use strict";pf=e=>{if(e!=null&&e.epContextDataRead)throw new Error('session option "epContextDataRead" is not supported by ONNX Runtime Web')}}),hf={};I(hf,{OnnxruntimeWebAssemblyBackend:()=>aa,initializeFlags:()=>ra,wasmBackend:()=>ff});var ra,aa,ff,v0=$(()=>{"use strict";st(),lf(),na(),$0(),b0(),ra=()=>{(typeof ke.wasm.initTimeout!="number"||ke.wasm.initTimeout<0)&&(ke.wasm.initTimeout=0);let e=ke.wasm.simd;if(typeof e!="boolean"&&e!==void 0&&e!=="fixed"&&e!=="relaxed"&&(console.warn(`Property "env.wasm.simd" is set to unknown value "${e}". Reset it to \`false\` and ignore SIMD feature checking.`),ke.wasm.simd=!1),typeof ke.wasm.proxy!="boolean"&&(ke.wasm.proxy=!1),typeof ke.wasm.trace!="boolean"&&(ke.wasm.trace=!1),typeof ke.wasm.numThreads!="number"||!Number.isInteger(ke.wasm.numThreads)||ke.wasm.numThreads<=0)if(typeof self<"u"&&!self.crossOriginIsolated)ke.wasm.numThreads=1;else{let t=typeof navigator>"u"?b("node:os").cpus().length:navigator.hardwareConcurrency;ke.wasm.numThreads=Math.min(4,Math.ceil((t||1)/2))}},aa=class{async init(e){ra(),await Qh(),await ef(e)}async createInferenceSessionHandler(e,t){pf(t);let n=new cf;return await n.loadModel(e,t),n}async createLoraAdapterHandler(e){let t=new ia;return await t.loadAdapter(e),t}},ff=new aa}),mf={};I(mf,{InferenceSession:()=>ws,LoraAdapter:()=>$s,TRACE:()=>Ne,TRACE_EVENT_BEGIN:()=>dt,TRACE_EVENT_END:()=>yt,TRACE_FUNC_BEGIN:()=>Xe,TRACE_FUNC_END:()=>We,Tensor:()=>ct,default:()=>E0,env:()=>ke,registerBackend:()=>G}),st(),st(),st();var x0="1.31.1",E0=uo;{let e=(v0(),O(hf)).wasmBackend;G("webgpu",e,5),G("webnn",e,5),G("cpu",e,10),G("wasm",e,10)}return Object.defineProperty(ke.versions,"web",{value:x0,enumerable:!0}),O(mf)})();/**
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
 */s.exports=r})(rg);var ai=rg.exports;const zb=B0(ai),lg=L0({__proto__:null,default:zb},[ai]),Cb=""+new URL("ort-wasm-simd-threaded.jsep-7838b4b2.mjs",import.meta.url).href,Ob=""+new URL("ort-wasm-simd-threaded.jsep-5ab83617.wasm",import.meta.url).href,Mb="3620ed788667cb76f08bd6cf2db8152c1f4c8bd1",dg=[{name:"HF 镜像",base:"https://hf-mirror.com/"},{name:"Hugging Face",base:"https://huggingface.co/"}],Pb="devtoys-web-tts-models-v1",Rb="ayousanz/piper-plus-base",Db="releases/zs-v1/campplus.onnx",Bb="a6ac6a63997761ae2997373e2ee1c47040854b4b759ea41ec48e4e42df0f4d73",cg=new URL("./models/piper-plus-zs-v1/",document.baseURI).href,Lb=`${cg}pinyin_single.json`,Nb=`${cg}pinyin_phrases.json`;let cs=null,ps=null;ai.env.wasm.simd=!0;ai.env.wasm.numThreads=globalThis.crossOriginIsolated?Math.max(1,Math.min(4,navigator.hardwareConcurrency||1)):1;ai.env.wasm.wasmPaths={mjs:Cb,wasm:Ob};const Sa=new Map;let Zi=null;async function Ub(){if(cs&&ps)return;const[s,i]=await Promise.all([fetch(Lb),fetch(Nb)]);if(!s.ok||!i.ok)throw new Error("本地拼音词典缺失，请检查 public/models/piper-plus-zs-v1 目录");cs=new Uint8Array(await s.arrayBuffer()),ps=new Uint8Array(await i.arrayBuffer())}async function Fb(){await Ub();const s=await In(()=>import("./piper_plus_wasm-499a458b.js"),[],import.meta.url),i=s.WasmPhonemizer;class r extends i{constructor(p){var m;super(p),cs&&ps&&((m=this.setChineseDictionary)==null||m.call(this,cs,ps))}}return{default:s.default,WasmPhonemizer:r}}function pg(s,i,r,u){return`${s}${i}/resolve/${r??"main"}/${u}`}async function mm(s){var r;if(!((r=globalThis.crypto)!=null&&r.subtle))return"";const i=await globalThis.crypto.subtle.digest("SHA-256",s);return Array.from(new Uint8Array(i),u=>u.toString(16).padStart(2,"0")).join("")}async function Wb(s,i,r,u){const p=await caches.open(Pb),m=`${r}/${u??"main"}/${s}`,y=await p.match(m);if(y!=null&&y.ok){const $=await y.arrayBuffer(),I=await mm($);if(!I||I===i)return $;await p.delete(m)}let b;for(const $ of dg)try{const I=await fetch(pg($.base,r,u,s));if(!I.ok)throw new Error(`${$.name} 返回 ${I.status}`);const P=await I.arrayBuffer(),O=await mm(P);if(O&&O!==i)throw new Error(`${$.name} 模型校验失败`);return await p.put(m,new Response(P,{headers:{"content-type":"application/octet-stream"}})),P}catch(I){b=I}throw new Error(b instanceof Error?b.message:"语音模型下载失败")}const Vb={model:"正在下载语音模型",phonemizer:"正在准备中文音素库",ready:"本地语音引擎就绪"};function jb(s,i){const r=Sa.get(s);if(r)return r;const u=wm(s);if(!u)return Promise.reject(new Error("不支持的语音模型"));const p=(async()=>{let m;for(const y of dg)try{return await no.initialize({model:pg(y.base,u.repoId,u.revision,u.onnxFile),ort:lg,wasmLoader:Fb,showModelNotice:!1,onProgress:b=>{i==null||i({stage:b.stage,message:Vb[b.stage]??(b.message||"正在准备本地语音模型")})}})}catch(b){m=b,i==null||i({stage:"model",message:`${y.name} 加载失败，正在尝试备用源`})}throw m instanceof Error?m:new Error("语音模型加载失败")})().catch(m=>{throw Sa.delete(s),m});return Sa.set(s,p),p}function qb(s){return Zi||(Zi=(async()=>{s==null||s({stage:"encoder",message:"正在准备本地声纹模型"});const i=await Wb(Db,Bb,Rb,Mb);return Wa.initialize({modelData:i,ort:lg,frontEnd:"kaldi-fbank"})})().catch(i=>{throw Zi=null,i})),Zi}const fn=s=>(R0("data-v-db849d56"),s=s(),D0(),s),Gb={class:"dt-tts"},Hb={class:"dt-tts__section"},Kb=fn(()=>Ee("label",{class:"dt-tts__label",for:"tts-text"},"要朗读的文字",-1)),Zb={class:"dt-tts__section"},Xb=fn(()=>Ee("p",{class:"dt-tts__hint"},"模型按需下载并缓存，不上传任何音频或文本。",-1)),Yb={class:"dt-tts__row"},Jb=fn(()=>Ee("label",{class:"dt-tts__label",for:"tts-role"},"角色",-1)),Qb={label:"默认角色（系统语音）"},e2=["value"],t2=fn(()=>Ee("optgroup",{label:"模型音色"},[Ee("option",{value:"model-default"},"模型默认音色（可下载 WAV）")],-1)),n2={key:0,label:"自定义角色（本地声纹）"},i2=["value","disabled"],s2={class:"dt-tts__actions"},r2=["disabled"],a2=["disabled"],o2=["src"],u2={key:1,class:"dt-tts__progress"},l2={key:2,class:"dt-tts__progress"},d2={class:"dt-tts__note"},c2={class:"dt-tts__section dt-tts__enroll"},p2=fn(()=>Ee("h2",{class:"dt-tts__heading"},"上传音频生成角色",-1)),h2=fn(()=>Ee("p",{class:"dt-tts__hint"},"仅「零样本克隆 zs-v1」支持。提供 3–10 秒清晰人声，浏览器本地提取声纹并保存角色；音频、声纹都不会上传。",-1)),f2={class:"dt-tts__row"},m2={class:"dt-tts__upload"},g2={class:"dt-tts__consent"},_2=fn(()=>Ee("span",null,"我确认拥有这段声音或已获得授权，可用于本地合成",-1)),y2=["disabled"],w2={key:0,class:"dt-tts__roles"},$2=["onClick"],b2=gm({__name:"TextToSpeech",props:{toolId:{},actions:{}},emits:["output-change","status-change"],setup(s,{emit:i}){const r=s,u=i,p=T0("devtoys:toolOptions",null);function m(ue,X){var Re;const pe=Number(((Re=p==null?void 0:p.value)==null?void 0:Re[ue])??X);return Number.isFinite(pe)?pe:X}const y=dn(()=>Math.min(3,Math.max(.5,m("rate",1)))),b=dn(()=>Math.min(2,Math.max(.5,m("pitch",1)))),$=Ye(""),I=Ye("zs-v1"),P=Ye([]),O=Ye([]),R=Ye(""),B=Ye(!1),V=Ye(""),G=Ye(""),te=Ye(null),Z=Ye(""),he=Ye(0),fe=Ye(null),me=Ye(""),Ie=Ye(null),Le=Ye(!1),lt=Ye(!1),Ce=dn(()=>({kind:"blob",blob:te.value??void 0,filename:"tts-result.wav",mimeType:"audio/wav"})),nt=dn(()=>wm(I.value)),ke=dn(()=>R.value.startsWith("custom:")),xt=dn(()=>{if(!ke.value)return;const ue=R.value.slice(7);return O.value.find(X=>X.id===ue)});function Ne(ue){u("output-change",{kind:"text",text:""}),u("status-change",{state:"error",message:ue})}function Ct(ue){u("status-change",{state:"success",message:ue})}function Xe(){if(typeof speechSynthesis>"u"){P.value=[];return}const ue=speechSynthesis.getVoices();if(P.value=ue.map(X=>({uri:X.voiceURI,label:`${X.name}（${X.lang}${X.localService?" · 本地":""}）`})),R.value!=="model-default"&&!R.value.startsWith("custom:")&&!P.value.some(X=>`system:${X.uri}`===R.value)){const X=ue.find(pe=>pe.lang.toLowerCase().startsWith("zh"))??ue[0];R.value=X?`system:${X.voiceURI}`:""}}async function We(){try{O.value=await F0()}catch(ue){G.value=ue instanceof Error?ue.message:"本地角色库读取失败"}}function dt(){Xe()}function yt(){var ue,X;R.value.startsWith("custom:")&&!((ue=nt.value)!=null&&ue.supportsCloning)&&(R.value="model-default"),Z.value&&(URL.revokeObjectURL(Z.value),Z.value=""),te.value=null,u("output-change",{kind:"text",text:""}),G.value=(X=nt.value)!=null&&X.credit?`已切换模型；使用生成音频时请标注「${nt.value.credit}」。`:"已切换模型，重新生成即可使用新音色。"}A0(()=>{Xe(),We(),typeof speechSynthesis<"u"&&speechSynthesis.addEventListener("voiceschanged",dt)}),z0(()=>{typeof speechSynthesis<"u"&&(speechSynthesis.removeEventListener("voiceschanged",dt),speechSynthesis.cancel()),Z.value&&URL.revokeObjectURL(Z.value)});function An(ue){var pe;const X=((pe=ue.target.files)==null?void 0:pe[0])??null;if(X){if(!X.type.startsWith("audio/")){Ne("请选择音频文件");return}if(X.size>25*1024*1024){Ne("参考音频超过 25 MB，请选择更小的文件");return}Ie.value=X,me.value=X.name.replace(/\.[^.]+$/,"")}}async function zn(ue){const X=window.AudioContext??window.webkitAudioContext;if(!X)throw new Error("当前浏览器不支持音频解码");const pe=new X;try{return await pe.decodeAudioData(await ue.arrayBuffer())}finally{await pe.close()}}async function oi(){var ue;if(!((ue=nt.value)!=null&&ue.supportsCloning)){Ne("当前模型不支持声音克隆，请先切换到「零样本克隆 zs-v1」");return}if(!Ie.value){Ne("请先选择一段参考音频");return}if(!me.value.trim()){Ne("请为角色填写名称");return}if(!Le.value){Ne("请先确认你有权使用该声音");return}lt.value=!0,V.value="正在解码参考音频",u("status-change",{state:"processing"});try{const X=await zn(Ie.value);if(X.duration<2||X.duration>60)throw new Error("参考音频需为 2 到 60 秒，建议使用 3 到 10 秒清晰人声");V.value="正在提取声纹特征";const Re=await(await qb(Gt=>{V.value=Gt.message})).encode(X),Je={id:j0(),name:me.value.trim(),embedding:Re,createdAt:Date.now(),duration:X.duration};await W0(Je),await We(),R.value=`custom:${Je.id}`,Ie.value=null,me.value="",Le.value=!1,G.value=`角色「${Je.name}」已保存在本机浏览器，未上传任何音频。`,Ct("自定义音色角色已生成")}catch(X){Ne(X instanceof Error?X.message:"角色生成失败，请重试")}finally{lt.value=!1,V.value=""}}async function ui(ue){try{await V0(ue),R.value===`custom:${ue}`&&(R.value="model-default"),await We(),Ct("角色已从本机删除")}catch(X){Ne(X instanceof Error?X.message:"角色删除失败，请重试")}}function Cn(){var ue;typeof speechSynthesis<"u"&&speechSynthesis.cancel(),(ue=fe.value)==null||ue.pause()}function _s(ue){Z.value&&URL.revokeObjectURL(Z.value),Z.value=URL.createObjectURL(ue),window.setTimeout(()=>{var X;(X=fe.value)==null||X.play().catch(()=>{G.value="音频已生成，可点击播放器手动播放。"})},0)}async function mn(ue){if(typeof speechSynthesis>"u")throw new Error("当前浏览器不支持系统语音朗读");Cn();const X=speechSynthesis.getVoices().find(Re=>Re.voiceURI===ue),pe=new SpeechSynthesisUtterance($.value);X&&(pe.voice=X,pe.lang=X.lang),pe.rate=y.value,pe.pitch=b.value,u("status-change",{state:"processing"}),pe.onend=()=>Ct("朗读完成"),pe.onerror=()=>Ne("系统语音朗读失败，请更换角色后重试"),speechSynthesis.speak(pe),Z.value&&(URL.revokeObjectURL(Z.value),Z.value=""),te.value=null,u("output-change",{kind:"text",text:""}),G.value="系统音色只能试听，无法导出 WAV；如需下载请选择模型音色或自定义角色。"}async function li(ue){const X=nt.value;if(!X)throw new Error("请选择语音模型");if(ue&&!X.supportsCloning)throw new Error("当前模型不支持声音克隆，请切换到「零样本克隆 zs-v1」");V.value=`正在加载 ${X.name}`;const pe=await jb(I.value,Gt=>{V.value=Gt.message});V.value=ue?"正在生成克隆语音":"正在生成语音";const Re=await pe.synthesize($.value,{language:"zh",speakerEmbedding:ue==null?void 0:ue.embedding,lengthScale:1/y.value}),Je=Re.toBlob();te.value=Je,he.value=Re.duration,_s(Je),u("output-change",Ce.value),Ct(`已生成 ${Re.duration.toFixed(1)} 秒语音`),G.value=`${X.credit?`请标注「${X.credit}」；`:""}模型「${X.name}」在本机推理，首次使用会从公开镜像下载并缓存。`}async function di(){if(!$.value.trim()){Ne("请输入要朗读的文字");return}if(!R.value){Ne("请选择角色");return}B.value=!0,G.value="",u("status-change",{state:"processing"});try{if(R.value.startsWith("system:"))await mn(R.value.slice(7));else{const ue=R.value==="model-default"?void 0:xt.value;if(R.value!=="model-default"&&!ue)throw new Error("自定义角色已不存在，请重新选择");await li(ue)}}catch(ue){Ne(ue instanceof Error?ue.message:"语音生成失败，请重试")}finally{B.value=!1,V.value=""}}function ci(){if(!te.value){Ne("请先使用模型音色或自定义角色生成语音");return}r.actions.download(Ce.value,"tts-result.wav")}return(ue,X)=>(Ge(),He("div",Gb,[Ee("section",Hb,[Kb,Bi(Ee("textarea",{id:"tts-text","onUpdate:modelValue":X[0]||(X[0]=pe=>$.value=pe),class:"dt-tts__text",rows:"6",placeholder:"输入中文或其他支持的语言文本，所有合成均在本机完成"},null,512),[[yf,$.value]])]),Ee("section",Zb,[C0(e_,{id:"tts-model",modelValue:I.value,"onUpdate:modelValue":X[1]||(X[1]=pe=>I.value=pe),label:"语音模型",models:O0(ym),onChange:yt},null,8,["modelValue","models"]),Xb,Ee("div",Yb,[Jb,Bi(Ee("select",{id:"tts-role","onUpdate:modelValue":X[2]||(X[2]=pe=>R.value=pe),class:"dt-tts__select"},[Ee("optgroup",Qb,[(Ge(!0),He(ni,null,Xi(P.value,pe=>(Ge(),He("option",{key:pe.uri,value:`system:${pe.uri}`},Ke(pe.label),9,e2))),128))]),t2,O.value.length?(Ge(),He("optgroup",n2,[(Ge(!0),He(ni,null,Xi(O.value,pe=>{var Re,Je;return Ge(),He("option",{key:pe.id,value:`custom:${pe.id}`,disabled:!((Re=nt.value)!=null&&Re.supportsCloning)},Ke(pe.name)+Ke((Je=nt.value)!=null&&Je.supportsCloning?"":"（需切换克隆模型）"),9,i2)}),128))])):Vt("",!0)],512),[[M0,R.value]])]),Ee("div",s2,[Ee("button",{class:"dt-tts__button",type:"button",disabled:B.value||!$.value.trim()||!R.value,onClick:di},Ke(B.value?"正在生成…":"生成语音"),9,r2),Ee("button",{class:"dt-tts__button dt-tts__button--ghost",type:"button",onClick:Cn},"停止"),Ee("button",{class:"dt-tts__button dt-tts__button--ghost",type:"button",disabled:!te.value,onClick:ci}," 下载 WAV ",8,a2)]),Z.value?(Ge(),He("audio",{key:0,ref_key:"audioElement",ref:fe,class:"dt-tts__audio",controls:"",src:Z.value},null,8,o2)):Vt("",!0),he.value?(Ge(),He("p",u2,"生成时长 "+Ke(he.value.toFixed(1))+" 秒",1)):Vt("",!0),V.value?(Ge(),He("p",l2,Ke(V.value),1)):Vt("",!0),Ee("p",d2,Ke(G.value||"语速由工具页上方的选项控制；系统音色可直接试听，模型音色和自定义音色可试听并下载。"),1)]),Ee("section",c2,[p2,h2,Ee("div",f2,[Ee("label",m2,[Ee("input",{type:"file",accept:"audio/*",onChange:An},null,32),Ee("span",null,Ke(Ie.value?Ie.value.name:"选择本地音频（25 MB 以内）"),1)]),Bi(Ee("input",{"onUpdate:modelValue":X[3]||(X[3]=pe=>me.value=pe),class:"dt-tts__input",type:"text","aria-label":"角色名称",placeholder:"角色名称"},null,512),[[yf,me.value]])]),Ee("label",g2,[Bi(Ee("input",{"onUpdate:modelValue":X[4]||(X[4]=pe=>Le.value=pe),type:"checkbox"},null,512),[[P0,Le.value]]),_2]),Ee("button",{class:"dt-tts__button",type:"button",disabled:lt.value||!Ie.value,onClick:oi},Ke(lt.value?"正在生成角色…":"生成角色"),9,y2),O.value.length?(Ge(),He("ul",w2,[(Ge(!0),He(ni,null,Xi(O.value,pe=>(Ge(),He("li",{key:pe.id},[Ee("span",null,Ke(pe.name)+" · "+Ke(pe.duration.toFixed(1))+" 秒",1),Ee("button",{type:"button",onClick:Re=>ui(pe.id)},"删除",8,$2)]))),128))])):Vt("",!0)])]))}});const S2=_m(b2,[["__scopeId","data-v-db849d56"]]);export{S2 as default};
