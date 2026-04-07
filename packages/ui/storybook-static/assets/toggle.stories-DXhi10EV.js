import{p as G,f as _,a as v,n as i,s as o,b as $,c as O,d as l,g as D,e as q,r as L}from"./iframe-B6Xu6Fgz.js";import{c as W,d as U}from"./create-runtime-stories-BluNYEpp.js";import{T as s,I as u,B as j,U as y,a as f}from"./bookmark-qfwuhAPW.js";import{i as A}from"./lifecycle-CZCTT3tj.js";import"./preload-helper-Dp1pzeXC.js";import"./index-BWQi_4Ky.js";import"./utils-DuQb-ZiT.js";import"./attributes-C6SbQsrD.js";import"./create-id-8ROD_mwL.js";import"./index-257lgZP2.js";import"./noop-DX6rZLP_.js";import"./Icon-CL6lX1Aa.js";import"./each-DogT8R8i.js";import"./svelte-element-BjQqVbS1.js";const E={title:"UI/Toggle",component:s,tags:["autodocs"],argTypes:{variant:{control:"select",options:["default","outline"]},size:{control:"select",options:["sm","default","lg"]},pressed:{control:"boolean"},disabled:{control:"boolean"}},args:{variant:"default",size:"default",pressed:!1,disabled:!1}},{Story:g}=U();var R=_("<!> Signet",1),F=_("<!> Italique",1),H=_('<div class="flex items-center gap-2"><!> <!> <!></div>'),J=_("<!> <!> <!> <!> <!> <!> <!> <!>",1);function M(x,P){G(P,!1),A();var b=J(),T=v(b);g(T,{name:"Basic",template:(t,e=i)=>{s(t,l({"aria-label":"Mettre en italique"},e,{children:(a,r)=>{u(a,{})},$$slots:{default:!0}}))},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Toggle aria-label="Mettre en italique" {...args}>
	<ItalicIcon />
</Toggle>`}}});var I=o(T,2);g(I,{name:"Bookmark",args:{size:"sm",variant:"outline"},template:(t,e=i)=>{s(t,l({"aria-label":"Ajouter un signet",class:"data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"},e,{children:(a,r)=>{var n=R(),c=v(n);j(c,{}),q(),$(a,n)},$$slots:{default:!0}}))},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Toggle
	aria-label="Ajouter un signet"
	class="data-[state=on]:bg-transparent data-[state=on]:*:[svg]:fill-blue-500 data-[state=on]:*:[svg]:stroke-blue-500"
	{...args}
>
	<BookmarkIcon />
	Signet
</Toggle>`}}});var h=o(I,2);g(h,{name:"Outline",args:{variant:"outline"},template:(t,e=i)=>{s(t,l({"aria-label":"Mettre en italique"},e,{children:(a,r)=>{u(a,{})},$$slots:{default:!0}}))},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Toggle aria-label="Mettre en italique" {...args}>
	<ItalicIcon />
</Toggle>`}}});var B=o(h,2);g(B,{name:"WithText",template:(t,e=i)=>{s(t,l({"aria-label":"Mettre en italique"},e,{children:(a,r)=>{var n=F(),c=v(n);u(c,{}),q(),$(a,n)},$$slots:{default:!0}}))},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Toggle aria-label="Mettre en italique" {...args}>
	<ItalicIcon />
	Italique
</Toggle>`}}});var k=o(B,2);g(k,{name:"Small",args:{size:"sm"},template:(t,e=i)=>{s(t,l({"aria-label":"Mettre en italique"},e,{children:(a,r)=>{u(a,{})},$$slots:{default:!0}}))},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Toggle aria-label="Mettre en italique" {...args}>
	<ItalicIcon />
</Toggle>`}}});var z=o(k,2);g(z,{name:"Large",args:{size:"lg"},template:(t,e=i)=>{s(t,l({"aria-label":"Mettre en italique"},e,{children:(a,r)=>{u(a,{})},$$slots:{default:!0}}))},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Toggle aria-label="Mettre en italique" {...args}>
	<ItalicIcon />
</Toggle>`}}});var C=o(z,2);g(C,{name:"Disabled",args:{disabled:!0},template:(t,e=i)=>{s(t,l({"aria-label":"Souligner"},e,{children:(a,r)=>{y(a,{})},$$slots:{default:!0}}))},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Toggle aria-label="Souligner" {...args}>
	<UnderlineIcon />
</Toggle>`}}});var w=o(C,2);g(w,{name:"Sizes",template:(t,e=i)=>{var a=H(),r=D(a);s(r,l(e,{size:"sm","aria-label":"Gras petit",children:(p,S)=>{f(p,{})},$$slots:{default:!0}}));var n=o(r,2);s(n,l(e,{size:"default","aria-label":"Gras normal",children:(p,S)=>{f(p,{})},$$slots:{default:!0}}));var c=o(n,2);s(c,l(e,{size:"lg","aria-label":"Gras grand",children:(p,S)=>{f(p,{})},$$slots:{default:!0}})),L(a),$(t,a)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="flex items-center gap-2">
	<Toggle {...args} size="sm" aria-label="Gras petit">
		<BoldIcon />
	</Toggle>
	<Toggle {...args} size="default" aria-label="Gras normal">
		<BoldIcon />
	</Toggle>
	<Toggle {...args} size="lg" aria-label="Gras grand">
		<BoldIcon />
	</Toggle>
</div>`}}}),$(x,b),O()}M.__docgen={data:[],name:"toggle.stories.svelte"};const d=W(M,E),ne=["Basic","Bookmark","Outline","WithText","Small","Large","Disabled","Sizes"],ie={...d.Basic,tags:["svelte-csf-v5"]},ge={...d.Bookmark,tags:["svelte-csf-v5"]},de={...d.Outline,tags:["svelte-csf-v5"]},me={...d.WithText,tags:["svelte-csf-v5"]},ce={...d.Small,tags:["svelte-csf-v5"]},pe={...d.Large,tags:["svelte-csf-v5"]},ue={...d.Disabled,tags:["svelte-csf-v5"]},$e={...d.Sizes,tags:["svelte-csf-v5"]};export{ie as Basic,ge as Bookmark,ue as Disabled,pe as Large,de as Outline,$e as Sizes,ce as Small,me as WithText,ne as __namedExportsOrder,E as default};
