import{p as U,f as l,a as f,n as k,s as r,b as e,c as G,t as v,g as A,e as u,r as B}from"./iframe-B6Xu6Fgz.js";import{c as J,d as K}from"./create-runtime-stories-BluNYEpp.js";import{b as $,P as h,a as P}from"./popover-trigger-Bjlwt5hI.js";import{i as N}from"./lifecycle-CZCTT3tj.js";import{B as Q}from"./button-D1TQAHUS.js";import{I}from"./input-BQCmUIJ_.js";import{L as W}from"./label-C5okEdJd.js";import"./preload-helper-Dp1pzeXC.js";import"./popper-layer-force-mount-D5ubLT2m.js";import"./scroll-lock-1opjqm5x.js";import"./noop-DX6rZLP_.js";import"./create-id-8ROD_mwL.js";import"./attributes-C6SbQsrD.js";import"./index-257lgZP2.js";import"./escape-layer-CXi_dPcM.js";import"./watch.svelte--muhUWzz.js";import"./key-Bs4PgzsJ.js";import"./is-BHm3n0EP.js";import"./prop-resolvers-CZqMPH3V.js";import"./context-D0XnMbwk.js";import"./kbd-constants-n4TqMfRz.js";import"./dom-context.svelte-CPf2O-mD.js";import"./arrays-D8QdbQbh.js";import"./roving-focus-group-CBNdfFHi.js";import"./get-directional-keys-BbiU1xeD.js";import"./presence-manager.svelte-DF0bvKLa.js";import"./after-tick-DDHVDzN0.js";import"./map-DLkVwbjf.js";import"./use-id-CnMg5bH0.js";import"./index-client-DOodR3d_.js";import"./is-BGFdVicR.js";import"./utils-DuQb-ZiT.js";import"./safe-polygon.svelte-Btinpljg.js";import"./floating-layer-anchor-C7qMB51W.js";import"./index-BWQi_4Ky.js";import"./this-BWUIJTEM.js";import"./input-CIAyiIlm.js";const V={title:"UI/Popover",component:$,tags:["autodocs"],argTypes:{align:{control:"select",options:["start","center","end"]},side:{control:"select",options:["top","right","bottom","left"]}}},{Story:x}=K();var X=l('<div class="flex flex-col gap-2"><p class="font-medium">Dimensions</p> <p class="text-muted-foreground">Ajustez les dimensions du calque.</p></div>'),Y=l("<!> <!>",1),Z=l('<div class="flex flex-col gap-3"><p class="font-medium">Dimensions</p> <div class="flex flex-col gap-1.5"><!> <!></div> <div class="flex flex-col gap-1.5"><!> <!></div> <!></div>'),ee=l("<!> <!>",1),te=l('<p class="text-muted-foreground">Contenu aligné au début du déclencheur.</p>'),oe=l("<!> <!>",1),re=l('<p class="text-muted-foreground">Contenu aligné à la fin du déclencheur.</p>'),se=l("<!> <!>",1),ae=l("<!> <!> <!> <!>",1);function q(z,D){U(D,!1),N();var R=ae(),T=f(R);x(T,{name:"Basic",args:{align:"center",side:"bottom"},template:(d,i=k)=>{$(d,{children:(_,a)=>{var s=Y(),p=f(s);h(p,{children:(n,t)=>{u();var m=v("Ouvrir le popover");e(n,m)},$$slots:{default:!0}});var o=r(p,2);P(o,{class:"w-64",get align(){return i().align},get side(){return i().side},children:(n,t)=>{var m=X();e(n,m)},$$slots:{default:!0}}),e(_,s)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Popover.Root>
	<Popover.Trigger>Ouvrir le popover</Popover.Trigger>
	<Popover.Content class="w-64" align={args.align} side={args.side}>
		<div class="flex flex-col gap-2">
			<p class="font-medium">Dimensions</p>
			<p class="text-muted-foreground">Ajustez les dimensions du calque.</p>
		</div>
	</Popover.Content>
</Popover.Root>`}}});var L=r(T,2);x(L,{name:"WithForm",template:d=>{$(d,{children:(i,_)=>{var a=ee(),s=f(a);h(s,{children:(o,n)=>{u();var t=v("Modifier les dimensions");e(o,t)},$$slots:{default:!0}});var p=r(s,2);P(p,{class:"w-72",children:(o,n)=>{var t=Z(),m=r(A(t),2),y=A(m);W(y,{for:"width",children:(c,F)=>{u();var g=v("Largeur");e(c,g)},$$slots:{default:!0}});var O=r(y,2);I(O,{id:"width",type:"number",placeholder:"100"}),B(m);var w=r(m,2),E=A(w);W(E,{for:"height",children:(c,F)=>{u();var g=v("Hauteur");e(c,g)},$$slots:{default:!0}});var j=r(E,2);I(j,{id:"height",type:"number",placeholder:"100"}),B(w);var H=r(w,2);Q(H,{size:"sm",class:"w-full",children:(c,F)=>{u();var g=v("Appliquer");e(c,g)},$$slots:{default:!0}}),B(t),e(o,t)},$$slots:{default:!0}}),e(i,a)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Popover.Root>
	<Popover.Trigger>Modifier les dimensions</Popover.Trigger>
	<Popover.Content class="w-72">
		<div class="flex flex-col gap-3">
			<p class="font-medium">Dimensions</p>
			<div class="flex flex-col gap-1.5">
				<Label for="width">Largeur</Label>
				<Input id="width" type="number" placeholder="100" />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="height">Hauteur</Label>
				<Input id="height" type="number" placeholder="100" />
			</div>
			<Button size="sm" class="w-full">Appliquer</Button>
		</div>
	</Popover.Content>
</Popover.Root>`}}});var S=r(L,2);x(S,{name:"AlignStart",template:d=>{$(d,{children:(i,_)=>{var a=oe(),s=f(a);h(s,{children:(o,n)=>{u();var t=v("Aligner au début");e(o,t)},$$slots:{default:!0}});var p=r(s,2);P(p,{class:"w-64",align:"start",children:(o,n)=>{var t=te();e(o,t)},$$slots:{default:!0}}),e(i,a)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Popover.Root>
	<Popover.Trigger>Aligner au début</Popover.Trigger>
	<Popover.Content class="w-64" align="start">
		<p class="text-muted-foreground">
			Contenu aligné au début du déclencheur.
		</p>
	</Popover.Content>
</Popover.Root>`}}});var M=r(S,2);x(M,{name:"AlignEnd",template:d=>{$(d,{children:(i,_)=>{var a=se(),s=f(a);h(s,{children:(o,n)=>{u();var t=v("Aligner à la fin");e(o,t)},$$slots:{default:!0}});var p=r(s,2);P(p,{class:"w-64",align:"end",children:(o,n)=>{var t=re();e(o,t)},$$slots:{default:!0}}),e(i,a)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Popover.Root>
	<Popover.Trigger>Aligner à la fin</Popover.Trigger>
	<Popover.Content class="w-64" align="end">
		<p class="text-muted-foreground">
			Contenu aligné à la fin du déclencheur.
		</p>
	</Popover.Content>
</Popover.Root>`}}}),e(z,R),G()}q.__docgen={data:[],name:"popover.stories.svelte"};const C=J(q,V),Ue=["Basic","WithForm","AlignStart","AlignEnd"],ke={...C.Basic,tags:["svelte-csf-v5"]},Ge={...C.WithForm,tags:["svelte-csf-v5"]},Je={...C.AlignStart,tags:["svelte-csf-v5"]},Ke={...C.AlignEnd,tags:["svelte-csf-v5"]};export{Ke as AlignEnd,Je as AlignStart,ke as Basic,Ge as WithForm,Ue as __namedExportsOrder,V as default};
