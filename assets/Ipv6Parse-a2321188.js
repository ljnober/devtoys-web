import{d as s}from"./factory-01bb99de.js";import{e as n,a}from"./ip-9285082a.js";import"./index-1d506c20.js";const p=(r,i)=>{const e=r.trim();if(!e)return{kind:"text",text:""};try{const t=n(e),o=a(t);return{kind:"text",text:`展开：${t}
压缩：${o}`}}catch(t){throw new Error(t instanceof Error?t.message:"IPv6 地址格式无效")}},x=s("ipv6-parse",p);export{x as default};
