import{p as z,f as d,a as U,s as e,n as g,b as i,c as C,g as n,d as h,e as l,r as c}from"./iframe-B6Xu6Fgz.js";import{c as w,d as H}from"./create-runtime-stories-BluNYEpp.js";import{S as o}from"./separator-ugExfeGY.js";import{i as I}from"./lifecycle-CZCTT3tj.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-DuQb-ZiT.js";import"./attributes-C6SbQsrD.js";import"./create-id-8ROD_mwL.js";import"./index-257lgZP2.js";const V={title:"UI/Separator",component:o,tags:["autodocs"],argTypes:{orientation:{control:"select",options:["horizontal","vertical"]}},args:{orientation:"horizontal"}},{Story:p}=H();var D=d('<div><div class="space-y-1"><h4 class="text-sm leading-none font-medium">Bits UI Primitives</h4> <p class="text-muted-foreground text-sm">Une bibliothèque de composants UI open source.</p></div> <!> <div class="flex h-5 items-center space-x-4 text-sm"><div>Blog</div> <!> <div>Docs</div> <!> <div>Source</div></div></div>'),E=d('<div class="w-75 space-y-2"><p class="text-sm font-medium">Au-dessus</p> <!> <p class="text-sm text-muted-foreground">En-dessous</p></div>'),q=d('<div class="flex h-8 items-center gap-3"><span class="text-sm">Gauche</span> <!> <span class="text-sm">Droite</span></div>'),A=d("<!> <!> <!>",1);function S($,B){z(B,!1),I();var v=A(),_=U(v);p(_,{name:"Basic",parameters:{controls:{disable:!0},__svelteCsf:{rawCode:`<div>
	<div class="space-y-1">
		<h4 class="text-sm leading-none font-medium">Bits UI Primitives</h4>
		<p class="text-muted-foreground text-sm">
			Une bibliothèque de composants UI open source.
		</p>
	</div>
	<Separator class="my-4" />
	<div class="flex h-5 items-center space-x-4 text-sm">
		<div>Blog</div>
		<Separator orientation="vertical" />
		<div>Docs</div>
		<Separator orientation="vertical" />
		<div>Source</div>
	</div>
</div>`}},template:r=>{var s=D(),t=e(n(s),2);o(t,{class:"my-4"});var a=e(t,2),x=e(n(a),2);o(x,{orientation:"vertical"});var b=e(x,4);o(b,{orientation:"vertical"}),l(2),c(a),c(s),i(r,s)},$$slots:{template:!0}});var u=e(_,2);p(u,{name:"Horizontal",template:(r,s=g)=>{var t=E(),a=e(n(t),2);o(a,h(s)),l(2),c(t),i(r,t)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="w-75 space-y-2">
	<p class="text-sm font-medium">Au-dessus</p>
	<Separator {...args} />
	<p class="text-sm text-muted-foreground">En-dessous</p>
</div>`}}});var y=e(u,2);p(y,{name:"Vertical",args:{orientation:"vertical"},template:(r,s=g)=>{var t=q(),a=e(n(t),2);o(a,h(s)),l(2),c(t),i(r,t)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="flex h-8 items-center gap-3">
	<span class="text-sm">Gauche</span>
	<Separator {...args} />
	<span class="text-sm">Droite</span>
</div>`}}}),i($,v),C()}S.__docgen={data:[],name:"separator.stories.svelte"};const m=w(S,V),J=["Basic","Horizontal","Vertical"],K={...m.Basic,tags:["svelte-csf-v5"]},L={...m.Horizontal,tags:["svelte-csf-v5"]},N={...m.Vertical,tags:["svelte-csf-v5"]};export{K as Basic,L as Horizontal,N as Vertical,J as __namedExportsOrder,V as default};
