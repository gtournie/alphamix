import{p as q,f as p,a as u,s,b as t,c as J,e as d,t as i,g as W,r as j}from"./iframe-B6Xu6Fgz.js";import{c as K,d as Q}from"./create-runtime-stories-BluNYEpp.js";import{C as P,a as w,b as B,c as z,d as T,e as b,f as X}from"./card-action-ZSIit_dD.js";import{B as x}from"./button-D1TQAHUS.js";import{I as M}from"./input-BQCmUIJ_.js";import{L as U}from"./label-C5okEdJd.js";import{i as Y}from"./lifecycle-CZCTT3tj.js";import"./preload-helper-Dp1pzeXC.js";import"./attributes-C6SbQsrD.js";import"./this-BWUIJTEM.js";import"./utils-DuQb-ZiT.js";import"./index-BWQi_4Ky.js";import"./input-CIAyiIlm.js";import"./create-id-8ROD_mwL.js";import"./index-257lgZP2.js";const Z={title:"UI/Card",component:P,tags:["autodocs"],argTypes:{}},{Story:A}=Q();var tt=p("<!> <!>",1),et=p('<p class="text-muted-foreground">Contenu principal de la carte.</p>'),rt=p("<!> <!>",1),at=p("<!> <!> <!>",1),ot=p("<!> <!>",1),st=p('<p class="text-muted-foreground">Contenu compact.</p>'),nt=p("<!> <!>",1),lt=p("<!> <!> <!>",1),dt=p("<!> <!> <!>",1),it=p('<p class="text-muted-foreground">Vous avez 3 nouvelles notifications.</p>'),ct=p("<!> <!>",1),pt=p("<!> <!>",1),$t=p('<div class="flex flex-col gap-1.5"><!> <!></div> <div class="flex flex-col gap-1.5"><!> <!></div>',1),ut=p("<!> <!> <!>",1),vt=p("<!> <!> <!> <!>",1);function G(N,V){q(V,!1),Y();var D=vt(),H=u(D);A(H,{name:"Basic",template:C=>{P(C,{class:"w-88",children:(h,R)=>{var v=at(),f=u(v);w(f,{children:(n,$)=>{var a=tt(),o=u(a);B(o,{children:(r,c)=>{d();var e=i("Titre de la carte");t(r,e)},$$slots:{default:!0}});var l=s(o,2);z(l,{children:(r,c)=>{d();var e=i("Une description courte et informative.");t(r,e)},$$slots:{default:!0}}),t(n,a)},$$slots:{default:!0}});var m=s(f,2);T(m,{children:(n,$)=>{var a=et();t(n,a)},$$slots:{default:!0}});var _=s(m,2);b(_,{class:"flex justify-end gap-2",children:(n,$)=>{var a=rt(),o=u(a);x(o,{variant:"outline",size:"sm",children:(r,c)=>{d();var e=i("Annuler");t(r,e)},$$slots:{default:!0}});var l=s(o,2);x(l,{size:"sm",children:(r,c)=>{d();var e=i("Confirmer");t(r,e)},$$slots:{default:!0}}),t(n,a)},$$slots:{default:!0}}),t(h,v)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Card.Root class="w-88">
	<Card.Header>
		<Card.Title>Titre de la carte</Card.Title>
		<Card.Description
			>Une description courte et informative.</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<p class="text-muted-foreground">Contenu principal de la carte.</p>
	</Card.Content>
	<Card.Footer class="flex justify-end gap-2">
		<Button variant="outline" size="sm">Annuler</Button>
		<Button size="sm">Confirmer</Button>
	</Card.Footer>
</Card.Root>`}}});var F=s(H,2);A(F,{name:"Small",template:C=>{P(C,{class:"w-88","data-size":"sm",children:(h,R)=>{var v=lt(),f=u(v);w(f,{children:(n,$)=>{var a=ot(),o=u(a);B(o,{children:(r,c)=>{d();var e=i("Carte compacte");t(r,e)},$$slots:{default:!0}});var l=s(o,2);z(l,{children:(r,c)=>{d();var e=i("Taille réduite pour les espaces restreints.");t(r,e)},$$slots:{default:!0}}),t(n,a)},$$slots:{default:!0}});var m=s(f,2);T(m,{children:(n,$)=>{var a=st();t(n,a)},$$slots:{default:!0}});var _=s(m,2);b(_,{class:"flex justify-end gap-2",children:(n,$)=>{var a=nt(),o=u(a);x(o,{variant:"outline",size:"sm",children:(r,c)=>{d();var e=i("Annuler");t(r,e)},$$slots:{default:!0}});var l=s(o,2);x(l,{size:"sm",children:(r,c)=>{d();var e=i("Confirmer");t(r,e)},$$slots:{default:!0}}),t(n,a)},$$slots:{default:!0}}),t(h,v)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Card.Root class="w-88" data-size="sm">
	<Card.Header>
		<Card.Title>Carte compacte</Card.Title>
		<Card.Description
			>Taille réduite pour les espaces restreints.</Card.Description
		>
	</Card.Header>
	<Card.Content>
		<p class="text-muted-foreground">Contenu compact.</p>
	</Card.Content>
	<Card.Footer class="flex justify-end gap-2">
		<Button variant="outline" size="sm">Annuler</Button>
		<Button size="sm">Confirmer</Button>
	</Card.Footer>
</Card.Root>`}}});var E=s(F,2);A(E,{name:"WithAction",template:C=>{P(C,{class:"w-88",children:(h,R)=>{var v=ct(),f=u(v);w(f,{children:(_,n)=>{var $=dt(),a=u($);B(a,{children:(r,c)=>{d();var e=i("Notifications");t(r,e)},$$slots:{default:!0}});var o=s(a,2);z(o,{children:(r,c)=>{d();var e=i("Gérez vos préférences de notification.");t(r,e)},$$slots:{default:!0}});var l=s(o,2);X(l,{children:(r,c)=>{x(r,{variant:"outline",size:"sm",children:(e,I)=>{d();var g=i("Paramètres");t(e,g)},$$slots:{default:!0}})},$$slots:{default:!0}}),t(_,$)},$$slots:{default:!0}});var m=s(f,2);T(m,{children:(_,n)=>{var $=it();t(_,$)},$$slots:{default:!0}}),t(h,v)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Card.Root class="w-88">
	<Card.Header>
		<Card.Title>Notifications</Card.Title>
		<Card.Description
			>Gérez vos préférences de notification.</Card.Description
		>
		<Card.Action>
			<Button variant="outline" size="sm">Paramètres</Button>
		</Card.Action>
	</Card.Header>
	<Card.Content>
		<p class="text-muted-foreground">
			Vous avez 3 nouvelles notifications.
		</p>
	</Card.Content>
</Card.Root>`}}});var O=s(E,2);A(O,{name:"Login",template:C=>{P(C,{class:"w-88",children:(h,R)=>{var v=ut(),f=u(v);w(f,{children:(n,$)=>{var a=pt(),o=u(a);B(o,{children:(r,c)=>{d();var e=i("Connexion");t(r,e)},$$slots:{default:!0}});var l=s(o,2);z(l,{children:(r,c)=>{d();var e=i("Entrez vos identifiants pour accéder à votre compte.");t(r,e)},$$slots:{default:!0}}),t(n,a)},$$slots:{default:!0}});var m=s(f,2);T(m,{class:"flex flex-col gap-4",children:(n,$)=>{var a=$t(),o=u(a),l=W(o);U(l,{for:"email",children:(g,k)=>{d();var S=i("E-mail");t(g,S)},$$slots:{default:!0}});var r=s(l,2);M(r,{id:"email",type:"email",placeholder:"vous@exemple.com"}),j(o);var c=s(o,2),e=W(c);U(e,{for:"password",children:(g,k)=>{d();var S=i("Mot de passe");t(g,S)},$$slots:{default:!0}});var I=s(e,2);M(I,{id:"password",type:"password",placeholder:"••••••••"}),j(c),t(n,a)},$$slots:{default:!0}});var _=s(m,2);b(_,{children:(n,$)=>{x(n,{class:"w-full",children:(a,o)=>{d();var l=i("Se connecter");t(a,l)},$$slots:{default:!0}})},$$slots:{default:!0}}),t(h,v)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Card.Root class="w-88">
	<Card.Header>
		<Card.Title>Connexion</Card.Title>
		<Card.Description
			>Entrez vos identifiants pour accéder à votre compte.</Card.Description
		>
	</Card.Header>
	<Card.Content class="flex flex-col gap-4">
		<div class="flex flex-col gap-1.5">
			<Label for="email">E-mail</Label>
			<Input id="email" type="email" placeholder="vous@exemple.com" />
		</div>
		<div class="flex flex-col gap-1.5">
			<Label for="password">Mot de passe</Label>
			<Input id="password" type="password" placeholder="••••••••" />
		</div>
	</Card.Content>
	<Card.Footer>
		<Button class="w-full">Se connecter</Button>
	</Card.Footer>
</Card.Root>`}}}),t(N,D),J()}G.__docgen={data:[],name:"card.stories.svelte"};const L=K(G,Z),Rt=["Basic","Small","WithAction","Login"],St={...L.Basic,tags:["svelte-csf-v5"]},bt={...L.Small,tags:["svelte-csf-v5"]},Dt={...L.WithAction,tags:["svelte-csf-v5"]},Ht={...L.Login,tags:["svelte-csf-v5"]};export{St as Basic,Ht as Login,bt as Small,Dt as WithAction,Rt as __namedExportsOrder,Z as default};
