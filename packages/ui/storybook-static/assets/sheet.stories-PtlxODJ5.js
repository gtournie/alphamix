import{p as ee,f as h,a as $,n as te,s as r,b as e,c as re,t as o,g as J,o as oe,L as se,e as s,r as K}from"./iframe-B6Xu6Fgz.js";import{c as ae,d as ne}from"./create-runtime-stories-BluNYEpp.js";import{S as R,a as H,b as L,c as N,d as O,e as w,f as M,g as A}from"./sheet-description-2rq75Cvn.js";import{B as Q}from"./button-D1TQAHUS.js";import{I as le}from"./input-BQCmUIJ_.js";import{L as ie}from"./label-C5okEdJd.js";import{i as de}from"./lifecycle-CZCTT3tj.js";import"./preload-helper-Dp1pzeXC.js";import"./dialog-content-B15xu5T4.js";import"./dialog-description-D4yA7rlF.js";import"./attributes-C6SbQsrD.js";import"./create-id-8ROD_mwL.js";import"./index-257lgZP2.js";import"./watch.svelte--muhUWzz.js";import"./context-D0XnMbwk.js";import"./presence-manager.svelte-DF0bvKLa.js";import"./after-tick-DDHVDzN0.js";import"./kbd-constants-n4TqMfRz.js";import"./noop-DX6rZLP_.js";import"./escape-layer-CXi_dPcM.js";import"./key-Bs4PgzsJ.js";import"./is-BHm3n0EP.js";import"./prop-resolvers-CZqMPH3V.js";import"./dom-context.svelte-CPf2O-mD.js";import"./arrays-D8QdbQbh.js";import"./roving-focus-group-CBNdfFHi.js";import"./get-directional-keys-BbiU1xeD.js";import"./scroll-lock-1opjqm5x.js";import"./map-DLkVwbjf.js";import"./use-id-CnMg5bH0.js";import"./utils-DuQb-ZiT.js";import"./x-DgpBJJ8V.js";import"./Icon-CL6lX1Aa.js";import"./each-DogT8R8i.js";import"./svelte-element-BjQqVbS1.js";import"./this-BWUIJTEM.js";import"./index-BWQi_4Ky.js";import"./input-CIAyiIlm.js";const $e={title:"UI/Sheet",component:R,tags:["autodocs"],argTypes:{side:{control:"select",options:["top","right","bottom","left"]}}},{Story:y}=ne();var he=h("<!> <!>",1),pe=h("<!> <!>",1),ve=h('<!> <div class="flex flex-col gap-4 px-4 py-4"><div class="flex flex-col gap-1.5"><!> <!></div></div> <!>',1),ue=h("<!> <!>",1),_e=h("<!> <!>",1),me=h("<!> <!>",1),fe=h("<!> <!>",1),ce=h("<!> <!>",1),Se=h("<!> <!>",1),ge=h("<!> <!>",1),Pe=h("<!> <!>",1),Ce=h("<!> <!>",1),xe=h("<!> <!>",1),Te=h("<!> <!>",1),Be=h("<!> <!>",1),Fe=h("<!> <!>",1),Re=h("<!> <!>",1),be=h("<!> <!> <!> <!> <!>",1);function W(X,Y){ee(Y,!1),de();var q=be(),E=$(q);y(E,{name:"Right",args:{side:"right"},template:(C,x=te)=>{R(C,{children:(b,f)=>{var _=ue(),g=$(_);H(g,{children:(c,a)=>{s();var m=o("Ouvrir (droite)");e(c,m)},$$slots:{default:!0}});var p=r(g,2);{let c=se(()=>x().side??"right");L(p,{get side(){return oe(c)},children:(a,m)=>{var P=ve(),d=$(P);N(d,{children:(u,n)=>{var T=he(),D=$(T);O(D,{children:(B,V)=>{s();var F=o("Modifier le profil");e(B,F)},$$slots:{default:!0}});var I=r(D,2);w(I,{children:(B,V)=>{s();var F=o("Faites des modifications à votre profil ici.");e(B,F)},$$slots:{default:!0}}),e(u,T)},$$slots:{default:!0}});var S=r(d,2),t=J(S),i=J(t);ie(i,{for:"sheet-name",children:(u,n)=>{s();var T=o("Nom");e(u,T)},$$slots:{default:!0}});var v=r(i,2);le(v,{id:"sheet-name",placeholder:"Guillaume Tournier"}),K(t),K(S);var l=r(S,2);M(l,{children:(u,n)=>{var T=pe(),D=$(T);Q(D,{children:(B,V)=>{s();var F=o("Sauvegarder");e(B,F)},$$slots:{default:!0}});var I=r(D,2);A(I,{children:(B,V)=>{s();var F=o("Annuler");e(B,F)},$$slots:{default:!0}}),e(u,T)},$$slots:{default:!0}}),e(a,P)},$$slots:{default:!0}})}e(b,_)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Sheet.Root>
	<Sheet.Trigger>Ouvrir (droite)</Sheet.Trigger>
	<Sheet.Content side={args.side ?? 'right'}>
		<Sheet.Header>
			<Sheet.Title>Modifier le profil</Sheet.Title>
			<Sheet.Description>Faites des modifications à votre profil ici.</Sheet.Description>
		</Sheet.Header>
		<div class="flex flex-col gap-4 px-4 py-4">
			<div class="flex flex-col gap-1.5">
				<Label for="sheet-name">Nom</Label>
				<Input id="sheet-name" placeholder="Guillaume Tournier" />
			</div>
		</div>
		<Sheet.Footer>
			<Button>Sauvegarder</Button>
			<Sheet.Close>Annuler</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>`}}});var U=r(E,2);y(U,{name:"Left",template:C=>{R(C,{children:(x,b)=>{var f=fe(),_=$(f);H(_,{children:(p,c)=>{s();var a=o("Ouvrir (gauche)");e(p,a)},$$slots:{default:!0}});var g=r(_,2);L(g,{side:"left",children:(p,c)=>{var a=me(),m=$(a);N(m,{children:(d,S)=>{var t=_e(),i=$(t);O(i,{children:(l,u)=>{s();var n=o("Navigation");e(l,n)},$$slots:{default:!0}});var v=r(i,2);w(v,{children:(l,u)=>{s();var n=o("Menu de navigation principal.");e(l,n)},$$slots:{default:!0}}),e(d,t)},$$slots:{default:!0}});var P=r(m,2);M(P,{children:(d,S)=>{A(d,{children:(t,i)=>{s();var v=o("Fermer");e(t,v)},$$slots:{default:!0}})},$$slots:{default:!0}}),e(p,a)},$$slots:{default:!0}}),e(x,f)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Sheet.Root>
	<Sheet.Trigger>Ouvrir (gauche)</Sheet.Trigger>
	<Sheet.Content side="left">
		<Sheet.Header>
			<Sheet.Title>Navigation</Sheet.Title>
			<Sheet.Description>Menu de navigation principal.</Sheet.Description>
		</Sheet.Header>
		<Sheet.Footer>
			<Sheet.Close>Fermer</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>`}}});var j=r(U,2);y(j,{name:"Top",template:C=>{R(C,{children:(x,b)=>{var f=ge(),_=$(f);H(_,{children:(p,c)=>{s();var a=o("Ouvrir (haut)");e(p,a)},$$slots:{default:!0}});var g=r(_,2);L(g,{side:"top",children:(p,c)=>{var a=Se(),m=$(a);N(m,{children:(d,S)=>{var t=ce(),i=$(t);O(i,{children:(l,u)=>{s();var n=o("Annonce");e(l,n)},$$slots:{default:!0}});var v=r(i,2);w(v,{children:(l,u)=>{s();var n=o("Message important en haut de page.");e(l,n)},$$slots:{default:!0}}),e(d,t)},$$slots:{default:!0}});var P=r(m,2);M(P,{children:(d,S)=>{A(d,{children:(t,i)=>{s();var v=o("Fermer");e(t,v)},$$slots:{default:!0}})},$$slots:{default:!0}}),e(p,a)},$$slots:{default:!0}}),e(x,f)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Sheet.Root>
	<Sheet.Trigger>Ouvrir (haut)</Sheet.Trigger>
	<Sheet.Content side="top">
		<Sheet.Header>
			<Sheet.Title>Annonce</Sheet.Title>
			<Sheet.Description>Message important en haut de page.</Sheet.Description>
		</Sheet.Header>
		<Sheet.Footer>
			<Sheet.Close>Fermer</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>`}}});var k=r(j,2);y(k,{name:"Bottom",template:C=>{R(C,{children:(x,b)=>{var f=xe(),_=$(f);H(_,{children:(p,c)=>{s();var a=o("Ouvrir (bas)");e(p,a)},$$slots:{default:!0}});var g=r(_,2);L(g,{side:"bottom",children:(p,c)=>{var a=Ce(),m=$(a);N(m,{children:(d,S)=>{var t=Pe(),i=$(t);O(i,{children:(l,u)=>{s();var n=o("Paramètres");e(l,n)},$$slots:{default:!0}});var v=r(i,2);w(v,{children:(l,u)=>{s();var n=o("Gérez vos préférences.");e(l,n)},$$slots:{default:!0}}),e(d,t)},$$slots:{default:!0}});var P=r(m,2);M(P,{children:(d,S)=>{A(d,{children:(t,i)=>{s();var v=o("Fermer");e(t,v)},$$slots:{default:!0}})},$$slots:{default:!0}}),e(p,a)},$$slots:{default:!0}}),e(x,f)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Sheet.Root>
	<Sheet.Trigger>Ouvrir (bas)</Sheet.Trigger>
	<Sheet.Content side="bottom">
		<Sheet.Header>
			<Sheet.Title>Paramètres</Sheet.Title>
			<Sheet.Description>Gérez vos préférences.</Sheet.Description>
		</Sheet.Header>
		<Sheet.Footer>
			<Sheet.Close>Fermer</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>`}}});var Z=r(k,2);y(Z,{name:"NoCloseButton",template:C=>{R(C,{children:(x,b)=>{var f=Re(),_=$(f);H(_,{children:(p,c)=>{s();var a=o("Sans bouton fermer");e(p,a)},$$slots:{default:!0}});var g=r(_,2);L(g,{side:"right",showCloseButton:!1,children:(p,c)=>{var a=Fe(),m=$(a);N(m,{children:(d,S)=>{var t=Te(),i=$(t);O(i,{children:(l,u)=>{s();var n=o("Confirmation");e(l,n)},$$slots:{default:!0}});var v=r(i,2);w(v,{children:(l,u)=>{s();var n=o("Veuillez confirmer votre choix avant de fermer.");e(l,n)},$$slots:{default:!0}}),e(d,t)},$$slots:{default:!0}});var P=r(m,2);M(P,{children:(d,S)=>{var t=Be(),i=$(t);Q(i,{children:(l,u)=>{s();var n=o("Confirmer");e(l,n)},$$slots:{default:!0}});var v=r(i,2);A(v,{children:(l,u)=>{s();var n=o("Annuler");e(l,n)},$$slots:{default:!0}}),e(d,t)},$$slots:{default:!0}}),e(p,a)},$$slots:{default:!0}}),e(x,f)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Sheet.Root>
	<Sheet.Trigger>Sans bouton fermer</Sheet.Trigger>
	<Sheet.Content side="right" showCloseButton={false}>
		<Sheet.Header>
			<Sheet.Title>Confirmation</Sheet.Title>
			<Sheet.Description>Veuillez confirmer votre choix avant de fermer.</Sheet.Description>
		</Sheet.Header>
		<Sheet.Footer>
			<Button>Confirmer</Button>
			<Sheet.Close>Annuler</Sheet.Close>
		</Sheet.Footer>
	</Sheet.Content>
</Sheet.Root>`}}}),e(X,q),re()}W.__docgen={data:[],name:"sheet.stories.svelte"};const z=ae(W,$e),vt=["Right","Left","Top","Bottom","NoCloseButton"],ut={...z.Right,tags:["svelte-csf-v5"]},_t={...z.Left,tags:["svelte-csf-v5"]},mt={...z.Top,tags:["svelte-csf-v5"]},ft={...z.Bottom,tags:["svelte-csf-v5"]},ct={...z.NoCloseButton,tags:["svelte-csf-v5"]};export{ft as Bottom,_t as Left,ct as NoCloseButton,ut as Right,mt as Top,vt as __namedExportsOrder,$e as default};
