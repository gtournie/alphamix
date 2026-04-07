import{p as B,f as c,a as G,s as o,b as a,c as W,g as p,e as v,t as m,r as n,h as A,i as N}from"./iframe-B6Xu6Fgz.js";import{c as V,d as E}from"./create-runtime-stories-BluNYEpp.js";import{C as _}from"./checkbox-COu-p5uL.js";import{L as h}from"./label-C5okEdJd.js";import{F as M,a as O}from"./field-description--z4BXJ6q.js";import{e as T,i as U}from"./each-DogT8R8i.js";import{i as j}from"./lifecycle-CZCTT3tj.js";import"./separator-ugExfeGY.js";import"./preload-helper-Dp1pzeXC.js";import"./utils-DuQb-ZiT.js";import"./attributes-C6SbQsrD.js";import"./clone-BprWJeAc.js";import"./watch.svelte--muhUWzz.js";import"./context-D0XnMbwk.js";import"./create-id-8ROD_mwL.js";import"./index-257lgZP2.js";import"./is-BHm3n0EP.js";import"./kbd-constants-n4TqMfRz.js";import"./hidden-input-BbxrRJBP.js";import"./input-CIAyiIlm.js";import"./sr-only-styles-DkvRP7Nh.js";import"./check-Cx94_jVH.js";import"./Icon-CL6lX1Aa.js";import"./svelte-element-BjQqVbS1.js";import"./minus-CovxXBAi.js";import"./index-BWQi_4Ky.js";import"./this-BWUIJTEM.js";const q={title:"UI/Checkbox",component:_,tags:["autodocs"],argTypes:{checked:{control:"boolean"},indeterminate:{control:"boolean"},disabled:{control:"boolean"}}},{Story:f}=E();var z=c('<div class="flex items-center gap-2"><!> <!></div>'),H=c('<div class="flex items-center gap-2"><!> <!></div>'),J=c('<div class="flex items-start gap-2"><!> <div class="flex flex-col gap-0.5"><!> <!></div></div>'),K=c('<div class="flex items-center gap-2"><!> <!></div>'),Q=c('<div class="flex items-center gap-2"><!> <!></div>'),X=c('<div class="flex items-center gap-2"><!> <!></div>'),Y=c('<div class="flex flex-col gap-2"></div>'),Z=c("<!> <!> <!> <!> <!> <!>",1);function R(y,I){B(I,!1),j();var k=Z(),D=G(k);f(D,{name:"Basic",template:l=>{var e=z(),s=p(e);_(s,{id:"terms"});var t=o(s,2);h(t,{for:"terms",children:(r,d)=>{v();var i=m("Accepter les conditions");a(r,i)},$$slots:{default:!0}}),n(e),a(l,e)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="flex items-center gap-2">
	<Checkbox id="terms" />
	<Label for="terms">Accepter les conditions</Label>
</div>`}}});var L=o(D,2);f(L,{name:"Checked",template:l=>{var e=H(),s=p(e);_(s,{id:"checked",checked:!0});var t=o(s,2);h(t,{for:"checked",children:(r,d)=>{v();var i=m("Coché par défaut");a(r,i)},$$slots:{default:!0}}),n(e),a(l,e)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="flex items-center gap-2">
	<Checkbox id="checked" checked />
	<Label for="checked">Coché par défaut</Label>
</div>`}}});var w=o(L,2);f(w,{name:"WithDescription",template:l=>{(void 0)(l,{children:(e,s)=>{var t=J(),r=p(t);_(r,{id:"newsletter"});var d=o(r,2),i=p(d);M(i,{for:"newsletter",children:(x,u)=>{v();var C=m("Newsletter");a(x,C)},$$slots:{default:!0}});var g=o(i,2);O(g,{children:(x,u)=>{v();var C=m("Recevoir les dernières nouvelles par e-mail.");a(x,C)},$$slots:{default:!0}}),n(d),n(t),a(e,t)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Field.Root>
	<div class="flex items-start gap-2">
		<Checkbox id="newsletter" />
		<div class="flex flex-col gap-0.5">
			<Field.Label for="newsletter">Newsletter</Field.Label>
			<Field.Description
				>Recevoir les dernières nouvelles par e-mail.</Field.Description
			>
		</div>
	</div>
</Field.Root>`}}});var F=o(w,2);f(F,{name:"Indeterminate",template:l=>{var e=K(),s=p(e);_(s,{id:"indeterminate",indeterminate:!0});var t=o(s,2);h(t,{for:"indeterminate",children:(r,d)=>{v();var i=m("Sélection partielle");a(r,i)},$$slots:{default:!0}}),n(e),a(l,e)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="flex items-center gap-2">
	<Checkbox id="indeterminate" indeterminate />
	<Label for="indeterminate">Sélection partielle</Label>
</div>`}}});var P=o(F,2);f(P,{name:"Disabled",template:l=>{var e=Q(),s=p(e);_(s,{id:"disabled",disabled:!0});var t=o(s,2);h(t,{for:"disabled",children:(r,d)=>{v();var i=m("Désactivé");a(r,i)},$$slots:{default:!0}}),n(e),a(l,e)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="flex items-center gap-2">
	<Checkbox id="disabled" disabled />
	<Label for="disabled">Désactivé</Label>
</div>`}}});var S=o(P,2);f(S,{name:"Group",template:l=>{var e=Y();T(e,4,()=>[{id:"recits",label:"Récits"},{id:"sports",label:"Sports"},{id:"voyages",label:"Voyages"}],U,(s,t)=>{var r=X(),d=p(r);_(d,{get id(){return t.id}});var i=o(d,2);h(i,{get for(){return t.id},children:(g,x)=>{v();var u=m();A(()=>N(u,t.label)),a(g,u)},$$slots:{default:!0}}),n(r),a(s,r)}),n(e),a(l,e)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="flex flex-col gap-2">
	{#each [{ id: "recits", label: "Récits" }, { id: "sports", label: "Sports" }, { id: "voyages", label: "Voyages" }] as item}
		<div class="flex items-center gap-2">
			<Checkbox id={item.id} />
			<Label for={item.id}>{item.label}</Label>
		</div>
	{/each}
</div>`}}}),a(y,k),W()}R.__docgen={data:[],name:"checkbox.stories.svelte"};const $=V(R,q),Fe=["Basic","Checked","WithDescription","Indeterminate","Disabled","Group"],Pe={...$.Basic,tags:["svelte-csf-v5"]},Re={...$.Checked,tags:["svelte-csf-v5"]},ye={...$.WithDescription,tags:["svelte-csf-v5"]},Ie={...$.Indeterminate,tags:["svelte-csf-v5"]},Se={...$.Disabled,tags:["svelte-csf-v5"]},Be={...$.Group,tags:["svelte-csf-v5"]};export{Pe as Basic,Re as Checked,Se as Disabled,Be as Group,Ie as Indeterminate,ye as WithDescription,Fe as __namedExportsOrder,q as default};
