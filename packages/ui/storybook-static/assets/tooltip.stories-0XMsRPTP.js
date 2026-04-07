import{p as M,f as l,a as u,s as p,b as e,c as O,e as v,t as m,d as A,g as U,r as k}from"./iframe-B6Xu6Fgz.js";import{c as q,d as F}from"./create-runtime-stories-BluNYEpp.js";import{T as _,a as c,b as T,c as f}from"./tooltip-content-PeHDQGND.js";import{B as z}from"./button-D1TQAHUS.js";import{K as J}from"./kbd-DPQptXhx.js";import{i as N}from"./lifecycle-CZCTT3tj.js";import"./preload-helper-Dp1pzeXC.js";import"./create-id-8ROD_mwL.js";import"./attributes-C6SbQsrD.js";import"./index-257lgZP2.js";import"./popper-layer-force-mount-D5ubLT2m.js";import"./scroll-lock-1opjqm5x.js";import"./noop-DX6rZLP_.js";import"./escape-layer-CXi_dPcM.js";import"./watch.svelte--muhUWzz.js";import"./key-Bs4PgzsJ.js";import"./is-BHm3n0EP.js";import"./prop-resolvers-CZqMPH3V.js";import"./context-D0XnMbwk.js";import"./kbd-constants-n4TqMfRz.js";import"./dom-context.svelte-CPf2O-mD.js";import"./arrays-D8QdbQbh.js";import"./roving-focus-group-CBNdfFHi.js";import"./get-directional-keys-BbiU1xeD.js";import"./presence-manager.svelte-DF0bvKLa.js";import"./after-tick-DDHVDzN0.js";import"./map-DLkVwbjf.js";import"./use-id-CnMg5bH0.js";import"./index-client-DOodR3d_.js";import"./is-BGFdVicR.js";import"./utils-DuQb-ZiT.js";import"./safe-polygon.svelte-Btinpljg.js";import"./on-mount-effect.svelte-CyqCpUzU.js";import"./index-BWQi_4Ky.js";import"./this-BWUIJTEM.js";const Q={title:"UI/Tooltip",component:_,tags:["autodocs"]},{Story:h}=F();var V=l("<p>Ceci est un tooltip</p>"),X=l("<!> <!>",1),Y=l("<p>Ajouter un nouvel élément</p>"),Z=l("<!> <!>",1),tt=l('<p class="flex items-center gap-1.5">Enregistrer <!></p>'),ot=l("<!> <!>",1),et=l("<p>Tooltip en haut</p>"),rt=l("<!> <!>",1),st=l("<p>Tooltip à droite</p>"),it=l("<!> <!>",1),lt=l("<p>Tooltip en bas</p>"),pt=l("<!> <!>",1),at=l("<p>Tooltip à gauche</p>"),nt=l("<!> <!>",1),dt=l("<!> <!> <!> <!> <!> <!> <!>",1);function D(G,H){M(H,!1),N();var x=dt(),W=u(x);h(W,{name:"Basic",template:a=>{c(a,{children:(n,C)=>{_(n,{children:(d,S)=>{var r=X(),s=u(r);T(s,{children:(o,i)=>{v();var t=m("Survolez-moi");e(o,t)},$$slots:{default:!0}});var $=p(s,2);f($,{children:(o,i)=>{var t=V();e(o,t)},$$slots:{default:!0}}),e(d,r)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>Survolez-moi</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Ceci est un tooltip</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>`}}});var K=p(W,2);h(K,{name:"WithButton",template:a=>{c(a,{children:(n,C)=>{_(n,{children:(d,S)=>{var r=Z(),s=u(r);T(s,{asChild:!0,child:(i,t)=>{z(i,A({variant:"outline"},()=>t==null?void 0:t().props,{children:(B,j)=>{v();var R=m("Ajouter");e(B,R)},$$slots:{default:!0}}))},$$slots:{child:!0}});var $=p(s,2);f($,{children:(o,i)=>{var t=Y();e(o,t)},$$slots:{default:!0}}),e(d,r)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger asChild>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>Ajouter</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p>Ajouter un nouvel élément</p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>`}}});var w=p(K,2);h(w,{name:"WithKeyboardShortcut",template:a=>{c(a,{children:(n,C)=>{_(n,{children:(d,S)=>{var r=ot(),s=u(r);T(s,{asChild:!0,child:(i,t)=>{z(i,A({variant:"outline"},()=>t==null?void 0:t().props,{children:(B,j)=>{v();var R=m("Enregistrer");e(B,R)},$$slots:{default:!0}}))},$$slots:{child:!0}});var $=p(s,2);f($,{children:(o,i)=>{var t=tt(),b=p(U(t));J(b,{children:(B,j)=>{v();var R=m("⌘S");e(B,R)},$$slots:{default:!0}}),k(t),e(o,t)},$$slots:{default:!0}}),e(d,r)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger asChild>
			{#snippet child({ props })}
				<Button variant="outline" {...props}>Enregistrer</Button>
			{/snippet}
		</Tooltip.Trigger>
		<Tooltip.Content>
			<p class="flex items-center gap-1.5">Enregistrer <Kbd>⌘S</Kbd></p>
		</Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>`}}});var y=p(w,2);h(y,{name:"SideTop",template:a=>{c(a,{children:(n,C)=>{_(n,{children:(d,S)=>{var r=rt(),s=u(r);T(s,{children:(o,i)=>{v();var t=m("Haut");e(o,t)},$$slots:{default:!0}});var $=p(s,2);f($,{side:"top",children:(o,i)=>{var t=et();e(o,t)},$$slots:{default:!0}}),e(d,r)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>Haut</Tooltip.Trigger>
		<Tooltip.Content side="top"><p>Tooltip en haut</p></Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>`}}});var E=p(y,2);h(E,{name:"SideRight",template:a=>{c(a,{children:(n,C)=>{_(n,{children:(d,S)=>{var r=it(),s=u(r);T(s,{children:(o,i)=>{v();var t=m("Droite");e(o,t)},$$slots:{default:!0}});var $=p(s,2);f($,{side:"right",children:(o,i)=>{var t=st();e(o,t)},$$slots:{default:!0}}),e(d,r)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>Droite</Tooltip.Trigger>
		<Tooltip.Content side="right"><p>Tooltip à droite</p></Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>`}}});var L=p(E,2);h(L,{name:"SideBottom",template:a=>{c(a,{children:(n,C)=>{_(n,{children:(d,S)=>{var r=pt(),s=u(r);T(s,{children:(o,i)=>{v();var t=m("Bas");e(o,t)},$$slots:{default:!0}});var $=p(s,2);f($,{side:"bottom",children:(o,i)=>{var t=lt();e(o,t)},$$slots:{default:!0}}),e(d,r)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>Bas</Tooltip.Trigger>
		<Tooltip.Content side="bottom"><p>Tooltip en bas</p></Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>`}}});var I=p(L,2);h(I,{name:"SideLeft",template:a=>{c(a,{children:(n,C)=>{_(n,{children:(d,S)=>{var r=nt(),s=u(r);T(s,{children:(o,i)=>{v();var t=m("Gauche");e(o,t)},$$slots:{default:!0}});var $=p(s,2);f($,{side:"left",children:(o,i)=>{var t=at();e(o,t)},$$slots:{default:!0}}),e(d,r)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Tooltip.Provider>
	<Tooltip.Root>
		<Tooltip.Trigger>Gauche</Tooltip.Trigger>
		<Tooltip.Content side="left"><p>Tooltip à gauche</p></Tooltip.Content>
	</Tooltip.Root>
</Tooltip.Provider>`}}}),e(G,x),O()}D.__docgen={data:[],name:"tooltip.stories.svelte"};const g=q(D,Q),Ft=["Basic","WithButton","WithKeyboardShortcut","SideTop","SideRight","SideBottom","SideLeft"],Jt={...g.Basic,tags:["svelte-csf-v5"]},Nt={...g.WithButton,tags:["svelte-csf-v5"]},Qt={...g.WithKeyboardShortcut,tags:["svelte-csf-v5"]},Vt={...g.SideTop,tags:["svelte-csf-v5"]},Xt={...g.SideRight,tags:["svelte-csf-v5"]},Yt={...g.SideBottom,tags:["svelte-csf-v5"]},Zt={...g.SideLeft,tags:["svelte-csf-v5"]};export{Jt as Basic,Yt as SideBottom,Zt as SideLeft,Xt as SideRight,Vt as SideTop,Nt as WithButton,Qt as WithKeyboardShortcut,Ft as __namedExportsOrder,Q as default};
