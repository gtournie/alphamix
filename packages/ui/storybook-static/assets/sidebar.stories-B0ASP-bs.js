var nt=Object.defineProperty;var Qe=n=>{throw TypeError(n)};var st=(n,e,r)=>e in n?nt(n,e,{enumerable:!0,configurable:!0,writable:!0,value:r}):n[e]=r;var Ae=(n,e,r)=>st(n,typeof e!="symbol"?e+"":e,r),Xe=(n,e,r)=>e.has(n)||Qe("Cannot "+r);var fe=(n,e,r)=>(Xe(n,e,"read from private field"),r?r.call(n):e.get(n)),Ee=(n,e,r)=>e.has(n)?Qe("Cannot add the same private member more than once"):e instanceof WeakSet?e.add(n):e.set(n,r),Ze=(n,e,r,u)=>(Xe(n,e,"write to private field"),u?u.call(n,r):e.set(n,r),r);import{G as it,H as ot,u as Se,o as _,q as Fe,j as lt,w as D,l as F,a as i,au as je,b as t,c as J,p as Q,f as o,v as te,g as y,n as L,r as h,m as me,d as ue,e as V,t as be,s as p,h as _e,i as Pe,bi as dt,bj as ct,L as Be}from"./iframe-B6Xu6Fgz.js";import{s as K,c as ut,d as vt}from"./create-runtime-stories-BluNYEpp.js";import{a as le,c as pt,b as Ne,s as ft}from"./attributes-C6SbQsrD.js";import{b as de}from"./this-BWUIJTEM.js";import{b as bt,c as mt,d as gt,e as $t,S as _t}from"./sheet-description-2rq75Cvn.js";import{c as ee}from"./utils-DuQb-ZiT.js";import{M as ht}from"./media-query-B9xH0_jD.js";import{e as xe,i as ye}from"./each-DogT8R8i.js";import{i as St}from"./lifecycle-CZCTT3tj.js";import"./input-BQCmUIJ_.js";import{t as xt}from"./index-BWQi_4Ky.js";import{b as yt,c as Pt,T as Mt,a as It}from"./tooltip-content-PeHDQGND.js";import{m as wt}from"./create-id-8ROD_mwL.js";import"./skeleton-7w6KWB6m.js";import"./separator-ugExfeGY.js";import{B as kt}from"./button-D1TQAHUS.js";import{I as Ue}from"./Icon-CL6lX1Aa.js";import{C as Ct}from"./calendar-lgOChvOZ.js";import{S as zt}from"./search-CcbtR74z.js";import{S as At,U as Bt}from"./settings-C9PEyz_h.js";import{C as Gt}from"./chevron-up-DJz2z5OZ.js";import"./preload-helper-Dp1pzeXC.js";import"./dialog-content-B15xu5T4.js";import"./dialog-description-D4yA7rlF.js";import"./watch.svelte--muhUWzz.js";import"./context-D0XnMbwk.js";import"./presence-manager.svelte-DF0bvKLa.js";import"./after-tick-DDHVDzN0.js";import"./kbd-constants-n4TqMfRz.js";import"./noop-DX6rZLP_.js";import"./escape-layer-CXi_dPcM.js";import"./key-Bs4PgzsJ.js";import"./is-BHm3n0EP.js";import"./prop-resolvers-CZqMPH3V.js";import"./dom-context.svelte-CPf2O-mD.js";import"./arrays-D8QdbQbh.js";import"./roving-focus-group-CBNdfFHi.js";import"./get-directional-keys-BbiU1xeD.js";import"./scroll-lock-1opjqm5x.js";import"./map-DLkVwbjf.js";import"./use-id-CnMg5bH0.js";import"./x-DgpBJJ8V.js";import"./input-CIAyiIlm.js";import"./popper-layer-force-mount-D5ubLT2m.js";import"./index-client-DOodR3d_.js";import"./is-BGFdVicR.js";import"./safe-polygon.svelte-Btinpljg.js";import"./on-mount-effect.svelte-CyqCpUzU.js";import"./index-257lgZP2.js";import"./svelte-element-BjQqVbS1.js";const Ht="sidebar:state",Tt=60*60*24*7,Rt="16rem",Lt="18rem",Et="3rem",jt="b",Ot=768;class Vt extends ht{constructor(e=Ot){super(`max-width: ${e-1}px`)}}var Oe,Ve,Re,De;class Dt{constructor(e){Ae(this,"props");Ee(this,Oe,Se(()=>this.props.open()));Ee(this,Ve,lt(!1));Ae(this,"setOpen");Ee(this,Re);Ee(this,De,Se(()=>this.open?"expanded":"collapsed"));Ae(this,"handleShortcutKeydown",e=>{e.key===jt&&(e.metaKey||e.ctrlKey)&&(e.preventDefault(),this.toggle())});Ae(this,"setOpenMobile",e=>{this.openMobile=e});Ae(this,"toggle",()=>fe(this,Re).current?this.openMobile=!this.openMobile:this.setOpen(!this.open));this.setOpen=e.setOpen,Ze(this,Re,new Vt),this.props=e}get open(){return _(fe(this,Oe))}set open(e){Fe(fe(this,Oe),e)}get openMobile(){return _(fe(this,Ve))}set openMobile(e){Fe(fe(this,Ve),e,!0)}get state(){return _(fe(this,De))}set state(e){Fe(fe(this,De),e)}get isMobile(){return fe(this,Re).current}}Oe=new WeakMap,Ve=new WeakMap,Re=new WeakMap,De=new WeakMap;const et="scn-sidebar";function Nt(n){return ot(Symbol.for(et),new Dt(n))}function qe(){return it(Symbol.for(et))}var qt=o("<div><!></div>"),Ft=o("<!> <!>",1),Kt=o('<!> <div class="flex h-full w-full flex-col"><!></div>',1),Ut=o('<div class="text-sidebar-foreground group peer hidden md:block" data-slot="sidebar"><div data-slot="sidebar-gap"></div> <div><div data-sidebar="sidebar" data-slot="sidebar-inner" class="bg-sidebar group-data-[variant=floating]:ring-sidebar-border group-data-[variant=floating]:rounded-lg group-data-[variant=floating]:shadow-sm group-data-[variant=floating]:ring-1 flex size-full flex-col"><!></div></div></div>');function he(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=D(e,"side",3,"left"),a=D(e,"variant",3,"sidebar"),v=D(e,"collapsible",3,"offcanvas"),s=te(e,["$$slots","$$events","$$legacy","ref","side","variant","collapsible","class","children"]);const z=qe();var oe=F(),G=i(oe);{var k=E=>{var d=qt();le(d,H=>({class:H,...s}),[()=>ee("bg-sidebar text-sidebar-foreground flex h-full w-(--sidebar-width) flex-col",e.class)]);var g=y(d);K(g,()=>e.children??L),h(d),de(d,H=>r(H),()=>r()),t(E,d)},N=E=>{var d=F(),g=i(d),H=()=>z.openMobile,P=O=>z.setOpenMobile(O);me(g,()=>_t,(O,l)=>{l(O,ue({get open(){return H()},set open(b){P(b)}},()=>s,{children:(b,q)=>{var m=F(),A=i(m);{let S=Se(()=>ee("bg-sidebar text-sidebar-foreground w-(--sidebar-width) p-0 [&>button]:hidden",e.class));me(A,()=>bt,(B,f)=>{f(B,{"data-sidebar":"sidebar","data-slot":"sidebar","data-mobile":"true",get class(){return _(S)},get style(){return`--sidebar-width: ${Lt};`},get side(){return u()},get ref(){return r()},set ref(M){r(M)},children:(M,T)=>{var $=Kt(),I=i($);me(I,()=>mt,(x,w)=>{w(x,{class:"sr-only",children:(X,R)=>{var ce=Ft(),Z=i(ce);me(Z,()=>gt,(Y,re)=>{re(Y,{children:(j,U)=>{V();var ae=be("Sidebar");t(j,ae)},$$slots:{default:!0}})});var ve=p(Z,2);me(ve,()=>$t,(Y,re)=>{re(Y,{children:(j,U)=>{V();var ae=be("Displays the mobile sidebar.");t(j,ae)},$$slots:{default:!0}})}),t(X,ce)},$$slots:{default:!0}})});var c=p(I,2),C=y(c);K(C,()=>e.children??L),h(c),t(M,$)},$$slots:{default:!0}})})}t(b,m)},$$slots:{default:!0}}))}),t(E,d)},W=E=>{var d=Ut(),g=y(d),H=p(g,2);le(H,l=>({"data-slot":"sidebar-container",class:l,...s}),[()=>ee("fixed inset-y-0 z-10 hidden h-svh w-(--sidebar-width) transition-[left,right,width] duration-200 ease-linear md:flex",u()==="left"?"start-0 group-data-[collapsible=offcanvas]:start-[calc(var(--sidebar-width)*-1)]":"end-0 group-data-[collapsible=offcanvas]:end-[calc(var(--sidebar-width)*-1)]",a()==="floating"||a()==="inset"?"p-2 group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4))+2px)]":"group-data-[collapsible=icon]:w-(--sidebar-width-icon) group-data-[side=left]:border-e group-data-[side=right]:border-s",e.class)]);var P=y(H),O=y(P);K(O,()=>e.children??L),h(P),h(H),h(d),de(d,l=>r(l),()=>r()),_e(l=>{Ne(d,"data-state",z.state),Ne(d,"data-collapsible",z.state==="collapsed"?v():""),Ne(d,"data-variant",a()),Ne(d,"data-side",u()),ft(g,1,l)},[()=>pt(ee("transition-[width] duration-200 ease-linear relative w-(--sidebar-width) bg-transparent","group-data-[collapsible=offcanvas]:w-0","group-data-[side=right]:rotate-180",a()==="floating"||a()==="inset"?"group-data-[collapsible=icon]:w-[calc(var(--sidebar-width-icon)+(--spacing(4)))]":"group-data-[collapsible=icon]:w-(--sidebar-width-icon)"))]),t(E,d)};je(G,E=>{v()==="none"?E(k):z.isMobile?E(N,1):E(W,-1)})}t(n,oe),J()}he.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLElement"},static:!1,readonly:!1,defaultValue:"..."},{name:"side",visibility:"public",keywords:[],kind:"let",type:{kind:"union",type:[{kind:"const",type:"string",value:"left",text:'"left"'},{kind:"const",type:"string",value:"right",text:'"right"'}],text:'"left" | "right"'},static:!1,readonly:!1,defaultValue:'"left"'},{name:"variant",visibility:"public",keywords:[],kind:"let",type:{kind:"union",type:[{kind:"const",type:"string",value:"sidebar",text:'"sidebar"'},{kind:"const",type:"string",value:"floating",text:'"floating"'},{kind:"const",type:"string",value:"inset",text:'"inset"'}],text:'"sidebar" | "floating" | "inset"'},static:!1,readonly:!1,defaultValue:'"sidebar"'},{name:"collapsible",visibility:"public",keywords:[],kind:"let",type:{kind:"union",type:[{kind:"const",type:"string",value:"none",text:'"none"'},{kind:"const",type:"string",value:"offcanvas",text:'"offcanvas"'},{kind:"const",type:"string",value:"icon",text:'"icon"'}],text:'"none" | "offcanvas" | "icon"'},static:!1,readonly:!1,defaultValue:'"offcanvas"'}],name:"sidebar.svelte"};var Wt=o("<div><!></div>");function Me(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=te(e,["$$slots","$$events","$$legacy","ref","class","children"]);var a=Wt();le(a,s=>({"data-slot":"sidebar-content","data-sidebar":"content",class:s,...u}),[()=>ee("no-scrollbar gap-0 flex min-h-0 flex-1 flex-col overflow-auto group-data-[collapsible=icon]:overflow-hidden",e.class)]);var v=y(a);K(v,()=>e.children??L),h(a),de(a,s=>r(s),()=>r()),t(n,a),J()}Me.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLElement"},static:!1,readonly:!1,defaultValue:"..."}],name:"sidebar-content.svelte"};var Yt=o("<div><!></div>");function tt(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=te(e,["$$slots","$$events","$$legacy","ref","class","children"]);var a=Yt();le(a,s=>({"data-slot":"sidebar-footer","data-sidebar":"footer",class:s,...u}),[()=>ee("gap-2 p-2 flex flex-col",e.class)]);var v=y(a);K(v,()=>e.children??L),h(a),de(a,s=>r(s),()=>r()),t(n,a),J()}tt.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLElement"},static:!1,readonly:!1,defaultValue:"..."}],name:"sidebar-footer.svelte"};var Jt=o("<div><!></div>");function ge(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=te(e,["$$slots","$$events","$$legacy","ref","class","children"]);var a=Jt();le(a,s=>({"data-slot":"sidebar-group-content","data-sidebar":"group-content",class:s,...u}),[()=>ee("text-xs w-full",e.class)]);var v=y(a);K(v,()=>e.children??L),h(a),de(a,s=>r(s),()=>r()),t(n,a),J()}ge.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLElement"},static:!1,readonly:!1,defaultValue:"..."}],name:"sidebar-group-content.svelte"};var Qt=o("<div><!></div>");function Ie(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=te(e,["$$slots","$$events","$$legacy","ref","children","child","class"]);const a=Se(()=>({class:ee("text-sidebar-foreground/70 ring-sidebar-ring h-8 rounded-md px-2 text-xs transition-[margin,opacity] duration-200 ease-linear group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0 focus-visible:ring-2 [&>svg]:size-4 flex shrink-0 items-center outline-hidden [&>svg]:shrink-0",e.class),"data-slot":"sidebar-group-label","data-sidebar":"group-label",...u}));var v=F(),s=i(v);{var z=G=>{var k=F(),N=i(k);K(N,()=>e.child,()=>({props:_(a)})),t(G,k)},oe=G=>{var k=Qt();le(k,()=>({..._(a)}));var N=y(k);K(N,()=>e.children??L),h(k),de(k,W=>r(W),()=>r()),t(G,k)};je(s,G=>{e.child?G(z):G(oe,-1)})}t(n,v),J()}Ie.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLElement"},static:!1,readonly:!1,defaultValue:"..."},{name:"child",visibility:"public",keywords:[],kind:"let",type:{kind:"function",text:"Snippet<[{ props: Record<string, unknown>; }]>"},static:!1,readonly:!1}],name:"sidebar-group-label.svelte"};var Xt=o("<div><!></div>");function $e(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=te(e,["$$slots","$$events","$$legacy","ref","class","children"]);var a=Xt();le(a,s=>({"data-slot":"sidebar-group","data-sidebar":"group",class:s,...u}),[()=>ee("px-2 py-1 relative flex w-full min-w-0 flex-col",e.class)]);var v=y(a);K(v,()=>e.children??L),h(a),de(a,s=>r(s),()=>r()),t(n,a),J()}$e.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLElement"},static:!1,readonly:!1,defaultValue:"..."}],name:"sidebar-group.svelte"};var Zt=o("<div><!></div>");function we(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=te(e,["$$slots","$$events","$$legacy","ref","class","children"]);var a=Zt();le(a,s=>({"data-slot":"sidebar-header","data-sidebar":"header",class:s,...u}),[()=>ee("gap-2 p-2 flex flex-col",e.class)]);var v=y(a);K(v,()=>e.children??L),h(a),de(a,s=>r(s),()=>r()),t(n,a),J()}we.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLElement"},static:!1,readonly:!1,defaultValue:"..."}],name:"sidebar-header.svelte"};var ea=o("<main><!></main>");function ke(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=te(e,["$$slots","$$events","$$legacy","ref","class","children"]);var a=ea();le(a,s=>({"data-slot":"sidebar-inset",class:s,...u}),[()=>ee("bg-background md:peer-data-[variant=inset]:m-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow-sm md:peer-data-[variant=inset]:peer-data-[state=collapsed]:ml-2 relative flex w-full flex-1 flex-col",e.class)]);var v=y(a);K(v,()=>e.children??L),h(a),de(a,s=>r(s),()=>r()),t(n,a),J()}ke.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLElement"},static:!1,readonly:!1,defaultValue:"..."}],name:"sidebar-inset.svelte"};const ta=xt({base:"ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground active:bg-sidebar-accent active:text-sidebar-accent-foreground data-active:bg-sidebar-accent data-active:text-sidebar-accent-foreground data-open:hover:bg-sidebar-accent data-open:hover:text-sidebar-accent-foreground gap-2 rounded-[calc(var(--radius-sm)+2px)] p-2 text-left text-xs transition-[width,height,padding] group-has-data-[sidebar=menu-action]/menu-item:pr-8 group-data-[collapsible=icon]:size-8! group-data-[collapsible=icon]:p-2! focus-visible:ring-2 data-active:font-medium peer/menu-button group/menu-button flex w-full items-center overflow-hidden outline-hidden disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&_svg]:size-4 [&_svg]:shrink-0 [&>span:last-child]:truncate",variants:{variant:{default:"hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",outline:"bg-background hover:bg-sidebar-accent hover:text-sidebar-accent-foreground shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]"},size:{default:"h-8 text-xs",sm:"h-7 text-xs",lg:"h-12 text-xs group-data-[collapsible=icon]:p-0!"}},defaultVariants:{variant:"default",size:"default"}});var aa=o("<button><!></button>"),ra=o("<!> <!>",1);function ne(n,e){Q(e,!0);const r=(d,g)=>{let H=()=>g==null?void 0:g().props;const P=Se(()=>wt(_(G),H()));var O=F(),l=i(O);{var b=m=>{var A=F(),S=i(A);K(S,()=>e.child,()=>({props:_(P)})),t(m,A)},q=m=>{var A=aa();le(A,()=>({..._(P)}));var S=y(A);K(S,()=>e.children??L),h(A),de(A,B=>u(B),()=>u()),t(m,A)};je(l,m=>{e.child?m(b):m(q,-1)})}t(d,O)};let u=D(e,"ref",15,null),a=D(e,"variant",3,"default"),v=D(e,"size",3,"default"),s=D(e,"isActive",3,!1),z=te(e,["$$slots","$$events","$$legacy","ref","class","children","child","variant","size","isActive","tooltipContent","tooltipContentProps"]);const oe=qe(),G=Se(()=>({class:ee(ta({variant:a(),size:v()}),e.class),"data-slot":"sidebar-menu-button","data-sidebar":"menu-button","data-size":v(),"data-active":s(),...z}));var k=F(),N=i(k);{var W=d=>{r(d,()=>({}))},E=d=>{var g=F(),H=i(g);me(H,()=>Mt,(P,O)=>{O(P,{children:(l,b)=>{var q=ra(),m=i(q);{const S=(B,f)=>{let M=()=>f==null?void 0:f().props;r(B,()=>({props:M()}))};me(m,()=>yt,(B,f)=>{f(B,{child:S,$$slots:{child:!0}})})}var A=p(m,2);{let S=Se(()=>oe.state!=="collapsed"||oe.isMobile);me(A,()=>Pt,(B,f)=>{f(B,ue({side:"right",align:"center",get hidden(){return _(S)}},()=>e.tooltipContentProps,{children:(M,T)=>{var $=F(),I=i($);{var c=x=>{var w=be();_e(()=>Pe(w,e.tooltipContent)),t(x,w)},C=x=>{var w=F(),X=i(w);K(X,()=>e.tooltipContent),t(x,w)};je(I,x=>{typeof e.tooltipContent=="string"?x(c):e.tooltipContent&&x(C,1)})}t(M,$)},$$slots:{default:!0}}))})}t(l,q)},$$slots:{default:!0}})}),t(d,g)};je(N,d=>{e.tooltipContent?d(E,-1):d(W)})}t(n,k),J()}ne.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLButtonElement"},static:!1,readonly:!1,defaultValue:"..."},{name:"isActive",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"boolean",text:"boolean"},static:!1,readonly:!1,defaultValue:"false"},{name:"variant",visibility:"public",keywords:[],kind:"let",type:{kind:"union",type:[{kind:"const",type:"string",value:"default",text:'"default"'},{kind:"const",type:"string",value:"outline",text:'"outline"'}],text:'"default" | "outline"'},static:!1,readonly:!1,defaultValue:'"default"'},{name:"size",visibility:"public",keywords:[],kind:"let",type:{kind:"union",type:[{kind:"const",type:"string",value:"default",text:'"default"'},{kind:"const",type:"string",value:"sm",text:'"sm"'},{kind:"const",type:"string",value:"lg",text:'"lg"'}],text:'"default" | "sm" | "lg"'},static:!1,readonly:!1,defaultValue:'"default"'},{name:"tooltipContent",visibility:"public",keywords:[],kind:"let",type:{kind:"union",type:[{kind:"type",type:"string",text:"string"},{kind:"function",text:"Snippet<[]>"}],text:"string | Snippet<[]>"},static:!1,readonly:!1},{name:"tooltipContentProps",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"any",text:"any"},static:!1,readonly:!1},{name:"child",visibility:"public",keywords:[],kind:"let",type:{kind:"function",text:"Snippet<[{ props: Record<string, unknown>; }]>"},static:!1,readonly:!1}],name:"sidebar-menu-button.svelte"};var na=o("<li><!></li>");function se(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=te(e,["$$slots","$$events","$$legacy","ref","class","children"]);var a=na();le(a,s=>({"data-slot":"sidebar-menu-item","data-sidebar":"menu-item",class:s,...u}),[()=>ee("group/menu-item relative",e.class)]);var v=y(a);K(v,()=>e.children??L),h(a),de(a,s=>r(s),()=>r()),t(n,a),J()}se.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLLIElement"},static:!1,readonly:!1,defaultValue:"..."}],name:"sidebar-menu-item.svelte"};var sa=o("<ul><!></ul>");function ie(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=te(e,["$$slots","$$events","$$legacy","ref","class","children"]);var a=sa();le(a,s=>({"data-slot":"sidebar-menu","data-sidebar":"menu",class:s,...u}),[()=>ee("gap-px flex w-full min-w-0 flex-col",e.class)]);var v=y(a);K(v,()=>e.children??L),h(a),de(a,s=>r(s),()=>r()),t(n,a),J()}ie.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLUListElement"},static:!1,readonly:!1,defaultValue:"..."}],name:"sidebar-menu.svelte"};var ia=o("<div><!></div>");function Ce(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=D(e,"open",15,!0),a=D(e,"onOpenChange",3,()=>{}),v=te(e,["$$slots","$$events","$$legacy","ref","open","onOpenChange","class","style","children"]);const s=Nt({open:()=>u(),setOpen:G=>{u(G),a()(G),document.cookie=`${Ht}=${u()}; path=/; max-age=${Tt}`}});var z=F();dt("keydown",ct,function(...G){var k;(k=s.handleShortcutKeydown)==null||k.apply(this,G)});var oe=i(z);me(oe,()=>It,(G,k)=>{k(G,{delayDuration:0,children:(N,W)=>{var E=ia();le(E,g=>({"data-slot":"sidebar-wrapper",style:`--sidebar-width: ${Rt}; --sidebar-width-icon: ${Et}; ${e.style??""}`,class:g,...v}),[()=>ee("group/sidebar-wrapper has-data-[variant=inset]:bg-sidebar flex min-h-svh w-full",e.class)]);var d=y(E);K(d,()=>e.children??L),h(E),de(E,g=>r(g),()=>r()),t(N,E)},$$slots:{default:!0}})}),t(n,z),J()}Ce.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLElement"},static:!1,readonly:!1,defaultValue:"..."},{name:"open",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"boolean",text:"boolean"},static:!1,readonly:!1,defaultValue:"..."},{name:"onOpenChange",visibility:"public",keywords:[],kind:"let",type:{kind:"function",text:"(open: boolean) => void"},static:!1,readonly:!1,defaultValue:"function"}],name:"sidebar-provider.svelte"};var oa=o("<button><!></button>");function Ke(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=te(e,["$$slots","$$events","$$legacy","ref","class","children"]);const a=qe();var v=oa();le(v,z=>({"data-sidebar":"rail","data-slot":"sidebar-rail","aria-label":"Toggle Sidebar",tabindex:-1,onclick:a.toggle,title:"Toggle Sidebar",class:z,...u}),[()=>ee("hover:after:bg-sidebar-border absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear group-data-[side=left]:-right-4 group-data-[side=right]:left-0 after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] sm:flex","in-data-[side=left]:cursor-w-resize in-data-[side=right]:cursor-e-resize","[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize","hover:group-data-[collapsible=offcanvas]:bg-sidebar group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full","[[data-side=left][data-collapsible=offcanvas]_&]:-right-2","[[data-side=right][data-collapsible=offcanvas]_&]:-left-2",e.class)]);var s=y(v);K(s,()=>e.children??L),h(v),de(v,z=>r(z),()=>r()),t(n,v),J()}Ke.__docgen={data:[{name:"ref",visibility:"public",keywords:[],kind:"let",type:{kind:"type",type:"object",text:"HTMLButtonElement"},static:!1,readonly:!1,defaultValue:"..."}],name:"sidebar-rail.svelte"};function la(n,e){Q(e,!0);/**
 * @license @lucide/svelte v1.7.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) 2026 Lucide Icons and Contributors
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The following Lucide icons are derived from the Feather project:
 *
 * airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
 *
 * The MIT License (MIT) (for the icons listed above)
 *
 * Copyright (c) 2013-present Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */let r=te(e,["$$slots","$$events","$$legacy"]);const u=[["rect",{width:"18",height:"18",x:"3",y:"3",rx:"2"}],["path",{d:"M9 3v18"}]];Ue(n,ue({name:"panel-left"},()=>r,{get iconNode(){return u},children:(a,v)=>{var s=F(),z=i(s);K(z,()=>e.children??L),t(a,s)},$$slots:{default:!0}})),J()}var da=o('<!> <span class="sr-only">Toggle Sidebar</span>',1);function Te(n,e){Q(e,!0);let r=D(e,"ref",15,null),u=te(e,["$$slots","$$events","$$legacy","ref","class","onclick"]);const a=qe();{let v=Se(()=>ee("cn-sidebar-trigger",e.class));kt(n,ue({"data-sidebar":"trigger","data-slot":"sidebar-trigger",variant:"ghost",size:"icon-sm",get class(){return _(v)},type:"button",onclick:s=>{var z;(z=e.onclick)==null||z.call(e,s),a.toggle()}},()=>u,{get ref(){return r()},set ref(s){r(s)},children:(s,z)=>{var oe=da(),G=i(oe);la(G,{}),V(2),t(s,oe)},$$slots:{default:!0}}))}J()}Te.__docgen={data:[],name:"sidebar-trigger.svelte"};function ze(n,e){Q(e,!0);/**
 * @license @lucide/svelte v1.7.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) 2026 Lucide Icons and Contributors
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The following Lucide icons are derived from the Feather project:
 *
 * airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
 *
 * The MIT License (MIT) (for the icons listed above)
 *
 * Copyright (c) 2013-present Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */let r=te(e,["$$slots","$$events","$$legacy"]);const u=[["path",{d:"M15 21v-8a1 1 0 0 0-1-1h-4a1 1 0 0 0-1 1v8"}],["path",{d:"M3 10a2 2 0 0 1 .709-1.528l7-6a2 2 0 0 1 2.582 0l7 6A2 2 0 0 1 21 10v9a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"}]];Ue(n,ue({name:"house"},()=>r,{get iconNode(){return u},children:(a,v)=>{var s=F(),z=i(s);K(z,()=>e.children??L),t(a,s)},$$slots:{default:!0}})),J()}function ca(n,e){Q(e,!0);/**
 * @license @lucide/svelte v1.7.0 - ISC
 *
 * ISC License
 *
 * Copyright (c) 2026 Lucide Icons and Contributors
 *
 * Permission to use, copy, modify, and/or distribute this software for any
 * purpose with or without fee is hereby granted, provided that the above
 * copyright notice and this permission notice appear in all copies.
 *
 * THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES
 * WITH REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF
 * MERCHANTABILITY AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR
 * ANY SPECIAL, DIRECT, INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES
 * WHATSOEVER RESULTING FROM LOSS OF USE, DATA OR PROFITS, WHETHER IN AN
 * ACTION OF CONTRACT, NEGLIGENCE OR OTHER TORTIOUS ACTION, ARISING OUT OF
 * OR IN CONNECTION WITH THE USE OR PERFORMANCE OF THIS SOFTWARE.
 *
 * ---
 *
 * The following Lucide icons are derived from the Feather project:
 *
 * airplay, alert-circle, alert-octagon, alert-triangle, aperture, arrow-down-circle, arrow-down-left, arrow-down-right, arrow-down, arrow-left-circle, arrow-left, arrow-right-circle, arrow-right, arrow-up-circle, arrow-up-left, arrow-up-right, arrow-up, at-sign, calendar, cast, check, chevron-down, chevron-left, chevron-right, chevron-up, chevrons-down, chevrons-left, chevrons-right, chevrons-up, circle, clipboard, clock, code, columns, command, compass, corner-down-left, corner-down-right, corner-left-down, corner-left-up, corner-right-down, corner-right-up, corner-up-left, corner-up-right, crosshair, database, divide-circle, divide-square, dollar-sign, download, external-link, feather, frown, hash, headphones, help-circle, info, italic, key, layout, life-buoy, link-2, link, loader, lock, log-in, log-out, maximize, meh, minimize, minimize-2, minus-circle, minus-square, minus, monitor, moon, more-horizontal, more-vertical, move, music, navigation-2, navigation, octagon, pause-circle, percent, plus-circle, plus-square, plus, power, radio, rss, search, server, share, shopping-bag, sidebar, smartphone, smile, square, table-2, tablet, target, terminal, trash-2, trash, triangle, tv, type, upload, x-circle, x-octagon, x-square, x, zoom-in, zoom-out
 *
 * The MIT License (MIT) (for the icons listed above)
 *
 * Copyright (c) 2013-present Cole Bemis
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 *
 */let r=te(e,["$$slots","$$events","$$legacy"]);const u=[["polyline",{points:"22 12 16 12 14 15 10 15 8 12 2 12"}],["path",{d:"M5.45 5.11 2 12v6a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2v-6l-3.45-6.89A2 2 0 0 0 16.76 4H7.24a2 2 0 0 0-1.79 1.11z"}]];Ue(n,ue({name:"inbox"},()=>r,{get iconNode(){return u},children:(a,v)=>{var s=F(),z=i(s);K(z,()=>e.children??L),t(a,s)},$$slots:{default:!0}})),J()}const Ge=[{label:"Home",icon:ze,active:!0},{label:"Inbox",icon:ca,active:!1},{label:"Calendar",icon:Ct,active:!1},{label:"Search",icon:zt,active:!1}],ua={title:"UI/Sidebar",component:he,tags:["autodocs"],argTypes:{side:{control:"select",options:["left","right"]},variant:{control:"select",options:["sidebar","floating","inset"]},collapsible:{control:"select",options:["offcanvas","icon","none"]}},args:{side:"left",variant:"sidebar",collapsible:"offcanvas"}},{Story:He}=vt();var va=o('<div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"><!></div> <div class="flex flex-col gap-0.5 leading-none"><span class="font-semibold">Acme Inc</span> <span class="text-xs">v1.0.0</span></div>',1),pa=o("<!> <span> </span>",1),fa=o("<!> <!>",1),ba=o("<!> <span>Settings</span>",1),ma=o("<!> <!>",1),ga=o("<!> <!>",1),$a=o('<!> <div class="grid flex-1 text-left text-sm leading-tight"><span class="truncate font-semibold">Jane Doe</span> <span class="truncate text-xs">jane@example.com</span></div> <!>',1),_a=o("<!> <!> <!> <!>",1),ha=o('<div class="bg-muted/50 aspect-video rounded-xl"></div>'),Sa=o('<div class="flex flex-1 flex-col gap-4 p-4"><div class="flex items-center gap-2"><!> <h1 class="text-lg font-semibold">Dashboard</h1></div> <div class="grid auto-rows-min gap-4 md:grid-cols-3"></div> <div class="bg-muted/50 min-h-[200px] flex-1 rounded-xl"></div></div>'),xa=o("<!> <!>",1),ya=o('<div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"><!></div> <div class="flex flex-col gap-0.5 leading-none"><span class="font-semibold">Acme Inc</span></div>',1),Pa=o("<!> <span> </span>",1),Ma=o("<!> <!> <!>",1),Ia=o('<div class="flex items-center gap-2 p-4"><!> <span class="text-muted-foreground text-sm">Toggle sidebar with the button or rail</span></div>'),wa=o("<!> <!>",1),ka=o('<div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"><!></div> <div class="flex flex-col gap-0.5 leading-none"><span class="font-semibold">Acme Inc</span></div>',1),Ca=o("<!> <span> </span>",1),za=o("<!> <!>",1),Aa=o("<!> <!>",1),Ba=o('<div class="flex items-center gap-2 p-4"><!> <span class="text-muted-foreground text-sm">Floating sidebar variant</span></div>'),Ga=o("<!> <!>",1),Ha=o('<div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"><!></div> <div class="flex flex-col gap-0.5 leading-none"><span class="font-semibold">Acme Inc</span></div>',1),Ta=o("<!> <span> </span>",1),Ra=o("<!> <!>",1),La=o("<!> <!>",1),Ea=o('<div class="flex items-center gap-2 p-4"><!> <span class="text-muted-foreground text-sm">Inset sidebar variant</span></div>'),ja=o("<!> <!>",1),Oa=o('<div class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"><!></div> <div class="flex flex-col gap-0.5 leading-none"><span class="font-semibold">Acme Inc</span></div>',1),Va=o("<!> <span> </span>",1),Da=o("<!> <!>",1),Na=o("<!> <!>",1),qa=o('<div class="flex items-center gap-2 p-4"><span class="text-muted-foreground text-sm">Always-visible sidebar (collapsible="none")</span></div>'),Fa=o("<!> <!>",1),Ka=o('<div class="flex items-center gap-2 p-4"><!> <span class="text-muted-foreground text-sm">Main content area</span></div>'),Ua=o("<!> <span>Right Sidebar</span>",1),Wa=o("<!> <span> </span>",1),Ya=o("<!> <!>",1),Ja=o("<!> <!>",1),Qa=o("<!> <!>",1),Xa=o("<!> <!> <!> <!> <!> <!>",1);function at(n,e){Q(e,!1),St();var r=Xa(),u=i(r);He(u,{name:"Basic",args:{side:"left",variant:"sidebar",collapsible:"offcanvas"},template:(k,N=L)=>{Ce(k,{style:"min-height: 400px; width: 100%;",children:(W,E)=>{var d=xa(),g=i(d);he(g,ue(N,{children:(P,O)=>{var l=_a(),b=i(l);we(b,{children:(S,B)=>{ie(S,{children:(f,M)=>{se(f,{children:(T,$)=>{ne(T,{size:"lg",children:(I,c)=>{var C=va(),x=i(C),w=y(x);ze(w,{class:"size-4"}),h(x),V(2),t(I,C)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var q=p(b,2);Me(q,{children:(S,B)=>{var f=ga(),M=i(f);$e(M,{children:($,I)=>{var c=fa(),C=i(c);Ie(C,{children:(w,X)=>{V();var R=be("Application");t(w,R)},$$slots:{default:!0}});var x=p(C,2);ge(x,{children:(w,X)=>{ie(w,{children:(R,ce)=>{var Z=F(),ve=i(Z);xe(ve,1,()=>Ge,ye,(Y,re)=>{const j=Be(()=>_(re).icon);se(Y,{children:(U,ae)=>{ne(U,{get isActive(){return _(re).active},children:(pe,Za)=>{var We=pa(),Ye=i(We);_(j)(Ye,{});var Je=p(Ye,2),rt=y(Je,!0);h(Je),_e(()=>Pe(rt,_(re).label)),t(pe,We)},$$slots:{default:!0}})},$$slots:{default:!0}})}),t(R,Z)},$$slots:{default:!0}})},$$slots:{default:!0}}),t($,c)},$$slots:{default:!0}});var T=p(M,2);$e(T,{children:($,I)=>{var c=ma(),C=i(c);Ie(C,{children:(w,X)=>{V();var R=be("Settings");t(w,R)},$$slots:{default:!0}});var x=p(C,2);ge(x,{children:(w,X)=>{ie(w,{children:(R,ce)=>{se(R,{children:(Z,ve)=>{ne(Z,{children:(Y,re)=>{var j=ba(),U=i(j);At(U,{}),V(2),t(Y,j)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}}),t($,c)},$$slots:{default:!0}}),t(S,f)},$$slots:{default:!0}});var m=p(q,2);tt(m,{children:(S,B)=>{ie(S,{children:(f,M)=>{se(f,{children:(T,$)=>{ne(T,{size:"lg",children:(I,c)=>{var C=$a(),x=i(C);Bt(x,{class:"size-8 rounded-lg"});var w=p(x,4);Gt(w,{class:"ml-auto size-4"}),t(I,C)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var A=p(m,2);Ke(A,{}),t(P,l)},$$slots:{default:!0}}));var H=p(g,2);ke(H,{children:(P,O)=>{var l=Sa(),b=y(l),q=y(b);Te(q,{}),V(2),h(b);var m=p(b,2);xe(m,4,()=>[1,2,3],ye,(A,S)=>{var B=ha();t(A,B)}),h(m),V(2),h(l),t(P,l)},$$slots:{default:!0}}),t(W,d)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Sidebar.Provider style="min-height: 400px; width: 100%;">
	<Sidebar.Root {...args}>
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton size="lg">
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<HomeIcon class="size-4" />
						</div>
						<div class="flex flex-col gap-0.5 leading-none">
							<span class="font-semibold">Acme Inc</span>
							<span class="text-xs">v1.0.0</span>
						</div>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each navItems as item}
							{@const Icon = item.icon}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={item.active}>
									<Icon />
									<span>{item.label}</span>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Settings</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						<Sidebar.MenuItem>
							<Sidebar.MenuButton>
								<SettingsIcon />
								<span>Settings</span>
							</Sidebar.MenuButton>
						</Sidebar.MenuItem>
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
		<Sidebar.Footer>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton size="lg">
						<UserIcon class="size-8 rounded-lg" />
						<div class="grid flex-1 text-left text-sm leading-tight">
							<span class="truncate font-semibold">Jane Doe</span>
							<span class="truncate text-xs">jane@example.com</span>
						</div>
						<ChevronUpIcon class="ml-auto size-4" />
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Footer>
		<Sidebar.Rail />
	</Sidebar.Root>
	<Sidebar.Inset>
		<div class="flex flex-1 flex-col gap-4 p-4">
			<div class="flex items-center gap-2">
				<Sidebar.Trigger />
				<h1 class="text-lg font-semibold">Dashboard</h1>
			</div>
			<div class="grid auto-rows-min gap-4 md:grid-cols-3">
				{#each [1, 2, 3] as _}
					<div class="bg-muted/50 aspect-video rounded-xl"></div>
				{/each}
			</div>
			<div class="bg-muted/50 min-h-[200px] flex-1 rounded-xl"></div>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>`}}});var a=p(u,2);He(a,{name:"Collapsible Icon",args:{side:"left",variant:"sidebar",collapsible:"icon"},template:(k,N=L)=>{Ce(k,{style:"min-height: 400px; width: 100%;",children:(W,E)=>{var d=wa(),g=i(d);he(g,ue(N,{children:(P,O)=>{var l=Ma(),b=i(l);we(b,{children:(A,S)=>{ie(A,{children:(B,f)=>{se(B,{children:(M,T)=>{ne(M,{size:"lg",tooltipContent:"Acme Inc",children:($,I)=>{var c=ya(),C=i(c),x=y(C);ze(x,{class:"size-4"}),h(C),V(2),t($,c)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var q=p(b,2);Me(q,{children:(A,S)=>{$e(A,{children:(B,f)=>{ge(B,{children:(M,T)=>{ie(M,{children:($,I)=>{var c=F(),C=i(c);xe(C,1,()=>Ge,ye,(x,w)=>{const X=Be(()=>_(w).icon);se(x,{children:(R,ce)=>{ne(R,{get isActive(){return _(w).active},get tooltipContent(){return _(w).label},children:(Z,ve)=>{var Y=Pa(),re=i(Y);_(X)(re,{});var j=p(re,2),U=y(j,!0);h(j),_e(()=>Pe(U,_(w).label)),t(Z,Y)},$$slots:{default:!0}})},$$slots:{default:!0}})}),t($,c)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var m=p(q,2);Ke(m,{}),t(P,l)},$$slots:{default:!0}}));var H=p(g,2);ke(H,{children:(P,O)=>{var l=Ia(),b=y(l);Te(b,{}),V(2),h(l),t(P,l)},$$slots:{default:!0}}),t(W,d)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Sidebar.Provider style="min-height: 400px; width: 100%;">
	<Sidebar.Root {...args}>
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton size="lg" tooltipContent="Acme Inc">
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<HomeIcon class="size-4" />
						</div>
						<div class="flex flex-col gap-0.5 leading-none">
							<span class="font-semibold">Acme Inc</span>
						</div>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each navItems as item}
							{@const Icon = item.icon}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton
									isActive={item.active}
									tooltipContent={item.label}
								>
									<Icon />
									<span>{item.label}</span>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
		<Sidebar.Rail />
	</Sidebar.Root>
	<Sidebar.Inset>
		<div class="flex items-center gap-2 p-4">
			<Sidebar.Trigger />
			<span class="text-muted-foreground text-sm"
				>Toggle sidebar with the button or rail</span
			>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>`}}});var v=p(a,2);He(v,{name:"Floating",args:{side:"left",variant:"floating",collapsible:"offcanvas"},template:(k,N=L)=>{Ce(k,{style:"min-height: 400px; width: 100%;",children:(W,E)=>{var d=Ga(),g=i(d);he(g,ue(N,{children:(P,O)=>{var l=Aa(),b=i(l);we(b,{children:(m,A)=>{ie(m,{children:(S,B)=>{se(S,{children:(f,M)=>{ne(f,{size:"lg",children:(T,$)=>{var I=ka(),c=i(I),C=y(c);ze(C,{class:"size-4"}),h(c),V(2),t(T,I)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var q=p(b,2);Me(q,{children:(m,A)=>{$e(m,{children:(S,B)=>{var f=za(),M=i(f);Ie(M,{children:($,I)=>{V();var c=be("Application");t($,c)},$$slots:{default:!0}});var T=p(M,2);ge(T,{children:($,I)=>{ie($,{children:(c,C)=>{var x=F(),w=i(x);xe(w,1,()=>Ge,ye,(X,R)=>{const ce=Be(()=>_(R).icon);se(X,{children:(Z,ve)=>{ne(Z,{get isActive(){return _(R).active},children:(Y,re)=>{var j=Ca(),U=i(j);_(ce)(U,{});var ae=p(U,2),pe=y(ae,!0);h(ae),_e(()=>Pe(pe,_(R).label)),t(Y,j)},$$slots:{default:!0}})},$$slots:{default:!0}})}),t(c,x)},$$slots:{default:!0}})},$$slots:{default:!0}}),t(S,f)},$$slots:{default:!0}})},$$slots:{default:!0}}),t(P,l)},$$slots:{default:!0}}));var H=p(g,2);ke(H,{children:(P,O)=>{var l=Ba(),b=y(l);Te(b,{}),V(2),h(l),t(P,l)},$$slots:{default:!0}}),t(W,d)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Sidebar.Provider style="min-height: 400px; width: 100%;">
	<Sidebar.Root {...args}>
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton size="lg">
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<HomeIcon class="size-4" />
						</div>
						<div class="flex flex-col gap-0.5 leading-none">
							<span class="font-semibold">Acme Inc</span>
						</div>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each navItems as item}
							{@const Icon = item.icon}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={item.active}>
									<Icon />
									<span>{item.label}</span>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
	<Sidebar.Inset>
		<div class="flex items-center gap-2 p-4">
			<Sidebar.Trigger />
			<span class="text-muted-foreground text-sm"
				>Floating sidebar variant</span
			>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>`}}});var s=p(v,2);He(s,{name:"Inset",args:{side:"left",variant:"inset",collapsible:"offcanvas"},template:(k,N=L)=>{Ce(k,{style:"min-height: 400px; width: 100%;",children:(W,E)=>{var d=ja(),g=i(d);he(g,ue(N,{children:(P,O)=>{var l=La(),b=i(l);we(b,{children:(m,A)=>{ie(m,{children:(S,B)=>{se(S,{children:(f,M)=>{ne(f,{size:"lg",children:(T,$)=>{var I=Ha(),c=i(I),C=y(c);ze(C,{class:"size-4"}),h(c),V(2),t(T,I)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var q=p(b,2);Me(q,{children:(m,A)=>{$e(m,{children:(S,B)=>{var f=Ra(),M=i(f);Ie(M,{children:($,I)=>{V();var c=be("Application");t($,c)},$$slots:{default:!0}});var T=p(M,2);ge(T,{children:($,I)=>{ie($,{children:(c,C)=>{var x=F(),w=i(x);xe(w,1,()=>Ge,ye,(X,R)=>{const ce=Be(()=>_(R).icon);se(X,{children:(Z,ve)=>{ne(Z,{get isActive(){return _(R).active},children:(Y,re)=>{var j=Ta(),U=i(j);_(ce)(U,{});var ae=p(U,2),pe=y(ae,!0);h(ae),_e(()=>Pe(pe,_(R).label)),t(Y,j)},$$slots:{default:!0}})},$$slots:{default:!0}})}),t(c,x)},$$slots:{default:!0}})},$$slots:{default:!0}}),t(S,f)},$$slots:{default:!0}})},$$slots:{default:!0}}),t(P,l)},$$slots:{default:!0}}));var H=p(g,2);ke(H,{children:(P,O)=>{var l=Ea(),b=y(l);Te(b,{}),V(2),h(l),t(P,l)},$$slots:{default:!0}}),t(W,d)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Sidebar.Provider style="min-height: 400px; width: 100%;">
	<Sidebar.Root {...args}>
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton size="lg">
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<HomeIcon class="size-4" />
						</div>
						<div class="flex flex-col gap-0.5 leading-none">
							<span class="font-semibold">Acme Inc</span>
						</div>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each navItems as item}
							{@const Icon = item.icon}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={item.active}>
									<Icon />
									<span>{item.label}</span>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
	<Sidebar.Inset>
		<div class="flex items-center gap-2 p-4">
			<Sidebar.Trigger />
			<span class="text-muted-foreground text-sm"
				>Inset sidebar variant</span
			>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>`}}});var z=p(s,2);He(z,{name:"Non Collapsible",args:{side:"left",variant:"sidebar",collapsible:"none"},template:(k,N=L)=>{Ce(k,{style:"min-height: 400px; width: 100%;",children:(W,E)=>{var d=Fa(),g=i(d);he(g,ue(N,{children:(P,O)=>{var l=Na(),b=i(l);we(b,{children:(m,A)=>{ie(m,{children:(S,B)=>{se(S,{children:(f,M)=>{ne(f,{size:"lg",children:(T,$)=>{var I=Oa(),c=i(I),C=y(c);ze(C,{class:"size-4"}),h(c),V(2),t(T,I)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var q=p(b,2);Me(q,{children:(m,A)=>{$e(m,{children:(S,B)=>{var f=Da(),M=i(f);Ie(M,{children:($,I)=>{V();var c=be("Application");t($,c)},$$slots:{default:!0}});var T=p(M,2);ge(T,{children:($,I)=>{ie($,{children:(c,C)=>{var x=F(),w=i(x);xe(w,1,()=>Ge,ye,(X,R)=>{const ce=Be(()=>_(R).icon);se(X,{children:(Z,ve)=>{ne(Z,{get isActive(){return _(R).active},children:(Y,re)=>{var j=Va(),U=i(j);_(ce)(U,{});var ae=p(U,2),pe=y(ae,!0);h(ae),_e(()=>Pe(pe,_(R).label)),t(Y,j)},$$slots:{default:!0}})},$$slots:{default:!0}})}),t(c,x)},$$slots:{default:!0}})},$$slots:{default:!0}}),t(S,f)},$$slots:{default:!0}})},$$slots:{default:!0}}),t(P,l)},$$slots:{default:!0}}));var H=p(g,2);ke(H,{children:(P,O)=>{var l=qa();t(P,l)},$$slots:{default:!0}}),t(W,d)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Sidebar.Provider style="min-height: 400px; width: 100%;">
	<Sidebar.Root {...args}>
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton size="lg">
						<div
							class="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-lg"
						>
							<HomeIcon class="size-4" />
						</div>
						<div class="flex flex-col gap-0.5 leading-none">
							<span class="font-semibold">Acme Inc</span>
						</div>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Application</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each navItems as item}
							{@const Icon = item.icon}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton isActive={item.active}>
									<Icon />
									<span>{item.label}</span>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
	<Sidebar.Inset>
		<div class="flex items-center gap-2 p-4">
			<span class="text-muted-foreground text-sm"
				>Always-visible sidebar (collapsible="none")</span
			>
		</div>
	</Sidebar.Inset>
</Sidebar.Provider>`}}});var oe=p(z,2);He(oe,{name:"Right Side",args:{side:"right",variant:"sidebar",collapsible:"offcanvas"},template:(k,N=L)=>{Ce(k,{style:"min-height: 400px; width: 100%;",children:(W,E)=>{var d=Qa(),g=i(d);ke(g,{children:(P,O)=>{var l=Ka(),b=y(l);Te(b,{}),V(2),h(l),t(P,l)},$$slots:{default:!0}});var H=p(g,2);he(H,ue(N,{children:(P,O)=>{var l=Ja(),b=i(l);we(b,{children:(m,A)=>{ie(m,{children:(S,B)=>{se(S,{children:(f,M)=>{ne(f,{children:(T,$)=>{var I=Ua(),c=i(I);ze(c,{}),V(2),t(T,I)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{default:!0}});var q=p(b,2);Me(q,{children:(m,A)=>{$e(m,{children:(S,B)=>{var f=Ya(),M=i(f);Ie(M,{children:($,I)=>{V();var c=be("Navigation");t($,c)},$$slots:{default:!0}});var T=p(M,2);ge(T,{children:($,I)=>{ie($,{children:(c,C)=>{var x=F(),w=i(x);xe(w,1,()=>Ge,ye,(X,R)=>{const ce=Be(()=>_(R).icon);se(X,{children:(Z,ve)=>{ne(Z,{children:(Y,re)=>{var j=Wa(),U=i(j);_(ce)(U,{});var ae=p(U,2),pe=y(ae,!0);h(ae),_e(()=>Pe(pe,_(R).label)),t(Y,j)},$$slots:{default:!0}})},$$slots:{default:!0}})}),t(c,x)},$$slots:{default:!0}})},$$slots:{default:!0}}),t(S,f)},$$slots:{default:!0}})},$$slots:{default:!0}}),t(P,l)},$$slots:{default:!0}})),t(W,d)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Sidebar.Provider style="min-height: 400px; width: 100%;">
	<Sidebar.Inset>
		<div class="flex items-center gap-2 p-4">
			<Sidebar.Trigger />
			<span class="text-muted-foreground text-sm">Main content area</span>
		</div>
	</Sidebar.Inset>
	<Sidebar.Root {...args}>
		<Sidebar.Header>
			<Sidebar.Menu>
				<Sidebar.MenuItem>
					<Sidebar.MenuButton>
						<HomeIcon />
						<span>Right Sidebar</span>
					</Sidebar.MenuButton>
				</Sidebar.MenuItem>
			</Sidebar.Menu>
		</Sidebar.Header>
		<Sidebar.Content>
			<Sidebar.Group>
				<Sidebar.GroupLabel>Navigation</Sidebar.GroupLabel>
				<Sidebar.GroupContent>
					<Sidebar.Menu>
						{#each navItems as item}
							{@const Icon = item.icon}
							<Sidebar.MenuItem>
								<Sidebar.MenuButton>
									<Icon />
									<span>{item.label}</span>
								</Sidebar.MenuButton>
							</Sidebar.MenuItem>
						{/each}
					</Sidebar.Menu>
				</Sidebar.GroupContent>
			</Sidebar.Group>
		</Sidebar.Content>
	</Sidebar.Root>
</Sidebar.Provider>`}}}),t(n,r),J()}at.__docgen={data:[],name:"sidebar.stories.svelte"};const Le=ut(at,ua),Qr=["Basic","CollapsibleIcon","Floating","Inset","NonCollapsible","RightSide"],Xr={...Le.Basic,tags:["svelte-csf-v5"]},Zr={...Le.CollapsibleIcon,tags:["svelte-csf-v5"]},en={...Le.Floating,tags:["svelte-csf-v5"]},tn={...Le.Inset,tags:["svelte-csf-v5"]},an={...Le.NonCollapsible,tags:["svelte-csf-v5"]},rn={...Le.RightSide,tags:["svelte-csf-v5"]};export{Xr as Basic,Zr as CollapsibleIcon,en as Floating,tn as Inset,an as NonCollapsible,rn as RightSide,Qr as __namedExportsOrder,ua as default};
