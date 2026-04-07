import{p as S,f,a as C,s as t,b as l,c as R,g as $,e as d,t as _,r as h}from"./iframe-B6Xu6Fgz.js";import{c as A,d as V}from"./create-runtime-stories-BluNYEpp.js";import{I as n}from"./input-BQCmUIJ_.js";import{L as b}from"./label-C5okEdJd.js";import{F as M,a as O}from"./field-description--z4BXJ6q.js";import{i as T}from"./lifecycle-CZCTT3tj.js";import"./separator-ugExfeGY.js";import"./preload-helper-Dp1pzeXC.js";import"./attributes-C6SbQsrD.js";import"./input-CIAyiIlm.js";import"./this-BWUIJTEM.js";import"./utils-DuQb-ZiT.js";import"./create-id-8ROD_mwL.js";import"./index-257lgZP2.js";import"./index-BWQi_4Ky.js";const U={title:"UI/Input",component:n,tags:["autodocs"],argTypes:{type:{control:"select",options:["text","email","password","number","search","tel","url","file"]},disabled:{control:"boolean"},placeholder:{control:"text"}}},{Story:p}=V();var j=f('<div class="flex flex-col gap-1.5 max-w-xs"><!> <!></div>'),k=f("<!> <!> <!>",1),q=f('<div class="flex flex-col gap-1.5 max-w-xs"><!> <!> <p id="invalid-input-error" class="text-destructive text-xs">Adresse e-mail invalide.</p></div>'),z=f('<div class="flex flex-col gap-1.5 max-w-xs"><!> <!></div>'),G=f("<!> <!> <!> <!> <!> <!>",1);function W(D,E){S(E,!1),T();var F=G(),g=C(F);p(g,{name:"Basic",template:a=>{n(a,{class:"max-w-xs",placeholder:"Saisir du texte…"})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:'<Input class="max-w-xs" placeholder="Saisir du texte…" />'}}});var w=t(g,2);p(w,{name:"WithLabel",template:a=>{var e=j(),s=$(e);b(s,{for:"email",children:(r,v)=>{d();var o=_("E-mail");l(r,o)},$$slots:{default:!0}});var i=t(s,2);n(i,{id:"email",type:"email",placeholder:"vous@exemple.com"}),h(e),l(a,e)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="flex flex-col gap-1.5 max-w-xs">
	<Label for="email">E-mail</Label>
	<Input id="email" type="email" placeholder="vous@exemple.com" />
</div>`}}});var I=t(w,2);p(I,{name:"WithField",template:a=>{(void 0)(a,{class:"max-w-xs",children:(e,s)=>{var i=k(),r=C(i);M(r,{children:(u,B)=>{d();var x=_("E-mail");l(u,x)},$$slots:{default:!0}});var v=t(r,2);n(v,{type:"email",placeholder:"vous@exemple.com"});var o=t(v,2);O(o,{children:(u,B)=>{d();var x=_("Votre adresse e-mail professionnelle.");l(u,x)},$$slots:{default:!0}}),l(e,i)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Field.Root class="max-w-xs">
	<Field.Label>E-mail</Field.Label>
	<Input type="email" placeholder="vous@exemple.com" />
	<Field.Description
		>Votre adresse e-mail professionnelle.</Field.Description
	>
</Field.Root>`}}});var L=t(I,2);p(L,{name:"Disabled",template:a=>{n(a,{class:"max-w-xs",placeholder:"Désactivé",disabled:!0})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:'<Input class="max-w-xs" placeholder="Désactivé" disabled />'}}});var y=t(L,2);p(y,{name:"Invalid",template:a=>{var e=q(),s=$(e);b(s,{for:"invalid-input",children:(r,v)=>{d();var o=_("E-mail");l(r,o)},$$slots:{default:!0}});var i=t(s,2);n(i,{id:"invalid-input",type:"email",placeholder:"vous@exemple.com","aria-invalid":"true","aria-describedby":"invalid-input-error"}),d(2),h(e),l(a,e)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="flex flex-col gap-1.5 max-w-xs">
	<Label for="invalid-input">E-mail</Label>
	<Input
		id="invalid-input"
		type="email"
		placeholder="vous@exemple.com"
		aria-invalid="true"
		aria-describedby="invalid-input-error"
	/>
	<p id="invalid-input-error" class="text-destructive text-xs">
		Adresse e-mail invalide.
	</p>
</div>`}}});var P=t(y,2);p(P,{name:"File",template:a=>{var e=z(),s=$(e);b(s,{for:"file-input",children:(r,v)=>{d();var o=_("Fichier");l(r,o)},$$slots:{default:!0}});var i=t(s,2);n(i,{id:"file-input",type:"file"}),h(e),l(a,e)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<div class="flex flex-col gap-1.5 max-w-xs">
	<Label for="file-input">Fichier</Label>
	<Input id="file-input" type="file" />
</div>`}}}),l(D,F),R()}W.__docgen={data:[],name:"input.stories.svelte"};const m=A(W,U),oe=["Basic","WithLabel","WithField","Disabled","Invalid","File"],ne={...m.Basic,tags:["svelte-csf-v5"]},de={...m.WithLabel,tags:["svelte-csf-v5"]},pe={...m.WithField,tags:["svelte-csf-v5"]},me={...m.Disabled,tags:["svelte-csf-v5"]},ce={...m.Invalid,tags:["svelte-csf-v5"]},ve={...m.File,tags:["svelte-csf-v5"]};export{ne as Basic,me as Disabled,ve as File,ce as Invalid,pe as WithField,de as WithLabel,oe as __namedExportsOrder,U as default};
