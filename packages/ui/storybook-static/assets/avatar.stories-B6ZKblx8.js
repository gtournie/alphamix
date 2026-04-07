import{p as H,f as v,a as h,n as z,s as r,b as a,c as J,d as P,e as _,t as g,g as M,r as O}from"./iframe-B6Xu6Fgz.js";import{c as K,d as Q}from"./create-runtime-stories-BluNYEpp.js";import{A as u,a as f,b as A,c as I,d as V,e as W}from"./avatar-group-count-BiEQ9zYQ.js";import{i as X}from"./lifecycle-CZCTT3tj.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-DuQb-ZiT.js";import"./attributes-C6SbQsrD.js";import"./create-id-8ROD_mwL.js";import"./index-257lgZP2.js";import"./watch.svelte--muhUWzz.js";import"./context-D0XnMbwk.js";import"./dom-context.svelte-CPf2O-mD.js";import"./this-BWUIJTEM.js";const Y={title:"UI/Avatar",component:u,tags:["autodocs"],argTypes:{size:{control:"select",options:["default","sm","lg"],description:"Avatar size"},loadingStatus:{control:"select",options:["loading","loaded","error"],description:"Controlled loading state. Note: bits-ui updates this automatically on image load/error, so the control may fall out of sync in live stories."}},args:{size:"default",loadingStatus:"loading"}},{Story:C}=Q();var Z=v("<!> <!>",1),aa=v("<!> <!>",1),ta=v("<!> <!>",1),ra=v("<!> <!>",1),ea=v("<!> <!>",1),sa=v("<!> <!>",1),oa=v('<div class="flex items-center gap-4"><!> <!> <!></div>'),la=v("<!> <!> <!>",1),na=v("<!> <!> <!>",1),da=v("<!> <!> <!>",1),ca=v('<div class="flex items-center gap-4"><!> <!> <!></div>'),va=v("<!> <!>",1),ia=v("<!> <!>",1),pa=v("<!> <!>",1),$a=v("<!> <!> <!> <!>",1),ha=v("<!> <!> <!> <!> <!> <!> <!>",1);function U(j,q){H(q,!1),X();var B=ha(),S=h(B);C(S,{name:"Basic",template:(m,l=z)=>{u(m,P(l,{children:(p,b)=>{var c=Z(),s=h(c);f(s,{src:"https://github.com/shadcn.png",alt:"@shadcn"});var $=r(s,2);A($,{children:(e,o)=>{_();var t=g("CN");a(e,t)},$$slots:{default:!0}}),a(p,c)},$$slots:{default:!0}}))},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Avatar.Root {...args}>
	<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
	<Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>`}}});var G=r(S,2);C(G,{name:"Fallback",args:{},parameters:{controls:{disable:!0},docs:{description:{story:"Intentional fallback with no Avatar.Image. Controls are disabled because this story deliberately omits the image slot."}},__svelteCsf:{rawCode:`<Avatar.Root>
	<Avatar.Fallback>GT</Avatar.Fallback>
</Avatar.Root>`}},template:m=>{u(m,{children:(l,p)=>{A(l,{children:(b,c)=>{_();var s=g("GT");a(b,s)},$$slots:{default:!0}})},$$slots:{default:!0}})},$$slots:{template:!0}});var y=r(G,2);C(y,{name:"Error Fallback",args:{loadingStatus:"error"},parameters:{docs:{description:{story:"Simulates a load error to keep the fallback visible. Toggle loadingStatus to loaded to verify the image takes over, or to loading to see the intermediate state."}},__svelteCsf:{rawCode:`<Avatar.Root {...args}>
	<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
	<Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>`}},template:(m,l=z)=>{u(m,P(l,{children:(p,b)=>{var c=aa(),s=h(c);f(s,{src:"https://github.com/shadcn.png",alt:"@shadcn"});var $=r(s,2);A($,{children:(e,o)=>{_();var t=g("CN");a(e,t)},$$slots:{default:!0}}),a(p,c)},$$slots:{default:!0}}))},$$slots:{template:!0}});var w=r(y,2);C(w,{name:"Rounded",template:(m,l=z)=>{u(m,P(l,{class:"rounded-lg",children:(p,b)=>{var c=ta(),s=h(c);f(s,{src:"https://github.com/shadcn.png",alt:"@shadcn"});var $=r(s,2);A($,{children:(e,o)=>{_();var t=g("CN");a(e,t)},$$slots:{default:!0}}),a(p,c)},$$slots:{default:!0}}))},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Avatar.Root {...args} class="rounded-lg">
	<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
	<Avatar.Fallback>CN</Avatar.Fallback>
</Avatar.Root>`}}});var E=r(w,2);C(E,{name:"Sizes",parameters:{controls:{disable:!0},__svelteCsf:{rawCode:`<div class="flex items-center gap-4">
	<Avatar.Root size="sm">
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Root size="default">
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Root size="lg">
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
</div>`}},template:m=>{var l=oa(),p=M(l);u(p,{size:"sm",children:(s,$)=>{var e=ra(),o=h(e);f(o,{src:"https://github.com/shadcn.png",alt:"@shadcn"});var t=r(o,2);A(t,{children:(i,n)=>{_();var d=g("CN");a(i,d)},$$slots:{default:!0}}),a(s,e)},$$slots:{default:!0}});var b=r(p,2);u(b,{size:"default",children:(s,$)=>{var e=ea(),o=h(e);f(o,{src:"https://github.com/shadcn.png",alt:"@shadcn"});var t=r(o,2);A(t,{children:(i,n)=>{_();var d=g("CN");a(i,d)},$$slots:{default:!0}}),a(s,e)},$$slots:{default:!0}});var c=r(b,2);u(c,{size:"lg",children:(s,$)=>{var e=sa(),o=h(e);f(o,{src:"https://github.com/shadcn.png",alt:"@shadcn"});var t=r(o,2);A(t,{children:(i,n)=>{_();var d=g("CN");a(i,d)},$$slots:{default:!0}}),a(s,e)},$$slots:{default:!0}}),O(l),a(m,l)},$$slots:{template:!0}});var T=r(E,2);C(T,{name:"Badge",parameters:{controls:{disable:!0},__svelteCsf:{rawCode:`<div class="flex items-center gap-4">
	<Avatar.Root size="sm">
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
		<Avatar.Badge />
	</Avatar.Root>
	<Avatar.Root>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
		<Avatar.Badge />
	</Avatar.Root>
	<Avatar.Root size="lg">
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
		<Avatar.Badge />
	</Avatar.Root>
</div>`}},template:m=>{var l=ca(),p=M(l);u(p,{size:"sm",children:(s,$)=>{var e=la(),o=h(e);f(o,{src:"https://github.com/shadcn.png",alt:"@shadcn"});var t=r(o,2);A(t,{children:(n,d)=>{_();var k=g("CN");a(n,k)},$$slots:{default:!0}});var i=r(t,2);I(i,{}),a(s,e)},$$slots:{default:!0}});var b=r(p,2);u(b,{children:(s,$)=>{var e=na(),o=h(e);f(o,{src:"https://github.com/shadcn.png",alt:"@shadcn"});var t=r(o,2);A(t,{children:(n,d)=>{_();var k=g("CN");a(n,k)},$$slots:{default:!0}});var i=r(t,2);I(i,{}),a(s,e)},$$slots:{default:!0}});var c=r(b,2);u(c,{size:"lg",children:(s,$)=>{var e=da(),o=h(e);f(o,{src:"https://github.com/shadcn.png",alt:"@shadcn"});var t=r(o,2);A(t,{children:(n,d)=>{_();var k=g("CN");a(n,k)},$$slots:{default:!0}});var i=r(t,2);I(i,{}),a(s,e)},$$slots:{default:!0}}),O(l),a(m,l)},$$slots:{template:!0}});var D=r(T,2);C(D,{name:"Group",template:(m,l=z)=>{V(m,{children:(p,b)=>{var c=$a(),s=h(c);u(s,P(l,{children:(t,i)=>{var n=va(),d=h(n);f(d,{src:"https://github.com/shadcn.png",alt:"@shadcn"});var k=r(d,2);A(k,{children:(x,L)=>{_();var N=g("CN");a(x,N)},$$slots:{default:!0}}),a(t,n)},$$slots:{default:!0}}));var $=r(s,2);u($,P(l,{children:(t,i)=>{var n=ia(),d=h(n);f(d,{src:"https://github.com/leerob.png",alt:"@leerob"});var k=r(d,2);A(k,{children:(x,L)=>{_();var N=g("LR");a(x,N)},$$slots:{default:!0}}),a(t,n)},$$slots:{default:!0}}));var e=r($,2);u(e,P(l,{children:(t,i)=>{var n=pa(),d=h(n);f(d,{src:"https://github.com/shadcn.png",alt:"@shadcn2"});var k=r(d,2);A(k,{children:(x,L)=>{_();var N=g("ER");a(x,N)},$$slots:{default:!0}}),a(t,n)},$$slots:{default:!0}}));var o=r(e,2);W(o,{children:(t,i)=>{_();var n=g("+2");a(t,n)},$$slots:{default:!0}}),a(p,c)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Avatar.Group>
	<Avatar.Root {...args}>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn" />
		<Avatar.Fallback>CN</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Root {...args}>
		<Avatar.Image src="https://github.com/leerob.png" alt="@leerob" />
		<Avatar.Fallback>LR</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.Root {...args}>
		<Avatar.Image src="https://github.com/shadcn.png" alt="@shadcn2" />
		<Avatar.Fallback>ER</Avatar.Fallback>
	</Avatar.Root>
	<Avatar.GroupCount>+2</Avatar.GroupCount>
</Avatar.Group>`}}}),a(j,B),J()}U.__docgen={data:[],name:"avatar.stories.svelte"};const F=K(U,Y),Na=["Basic","Fallback","ErrorFallback","Rounded","Sizes","Badge","Group"],za={...F.Basic,tags:["svelte-csf-v5"]},Ia={...F.Fallback,tags:["svelte-csf-v5"]},Ba={...F.ErrorFallback,tags:["svelte-csf-v5"]},Sa={...F.Rounded,tags:["svelte-csf-v5"]},Ga={...F.Sizes,tags:["svelte-csf-v5"]},ya={...F.Badge,tags:["svelte-csf-v5"]},wa={...F.Group,tags:["svelte-csf-v5"]};export{ya as Badge,za as Basic,Ba as ErrorFallback,Ia as Fallback,wa as Group,Sa as Rounded,Ga as Sizes,Na as __namedExportsOrder,Y as default};
