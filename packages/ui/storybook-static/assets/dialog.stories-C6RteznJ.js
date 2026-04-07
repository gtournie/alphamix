import{p as ot,f as m,a as d,s as r,b as t,c as et,e as a,t as i,g as S,r as M}from"./iframe-B6Xu6Fgz.js";import{c as rt,d as at}from"./create-runtime-stories-BluNYEpp.js";import{D as y,a as N,b as q,c as z,d as H,e as L,f as k,g as J}from"./dialog-close-CpHXYVXu.js";import{B as E}from"./button-D1TQAHUS.js";import{I as K}from"./input-BQCmUIJ_.js";import{L as Q}from"./label-C5okEdJd.js";import{i as it}from"./lifecycle-CZCTT3tj.js";import"./preload-helper-Dp1pzeXC.js";import"./escape-layer-CXi_dPcM.js";import"./watch.svelte--muhUWzz.js";import"./key-Bs4PgzsJ.js";import"./is-BHm3n0EP.js";import"./prop-resolvers-CZqMPH3V.js";import"./context-D0XnMbwk.js";import"./create-id-8ROD_mwL.js";import"./attributes-C6SbQsrD.js";import"./index-257lgZP2.js";import"./noop-DX6rZLP_.js";import"./kbd-constants-n4TqMfRz.js";import"./dom-context.svelte-CPf2O-mD.js";import"./arrays-D8QdbQbh.js";import"./roving-focus-group-CBNdfFHi.js";import"./get-directional-keys-BbiU1xeD.js";import"./presence-manager.svelte-DF0bvKLa.js";import"./after-tick-DDHVDzN0.js";import"./dialog-content-B15xu5T4.js";import"./dialog-description-D4yA7rlF.js";import"./scroll-lock-1opjqm5x.js";import"./map-DLkVwbjf.js";import"./use-id-CnMg5bH0.js";import"./utils-DuQb-ZiT.js";import"./this-BWUIJTEM.js";import"./x-DgpBJJ8V.js";import"./Icon-CL6lX1Aa.js";import"./each-DogT8R8i.js";import"./svelte-element-BjQqVbS1.js";import"./index-BWQi_4Ky.js";import"./input-CIAyiIlm.js";const lt={title:"UI/Dialog",component:y,tags:["autodocs"]},{Story:I}=at();var st=m("<!> <!>",1),nt=m('<!> <div class="flex flex-col gap-4 py-4"><div class="flex flex-col gap-1.5"><!> <!></div> <div class="flex flex-col gap-1.5"><!> <!></div></div> <!>',1),dt=m("<!> <!>",1),mt=m("<!> <!>",1),pt=m("<!> <!>",1),ut=m(`<!> <div class="py-4"><p class="text-muted-foreground text-sm">En utilisant ce service, vous acceptez nos conditions générales
						d'utilisation et notre politique de confidentialité.</p></div> <!>`,1),ct=m("<!> <!>",1),$t=m("<!> <!>",1),vt=m("<!> <!>",1),ft=m("<!> <!>",1),gt=m("<!> <!>",1),_t=m("<!> <!> <!>",1);function W(X,Y){ot(Y,!1),it();var G=_t(),V=d(G);I(V,{name:"Basic",template:h=>{y(h,{children:(C,j)=>{var v=dt(),f=d(v);N(f,{children:(p,B)=>{a();var l=i("Modifier le profil");t(p,l)},$$slots:{default:!0}});var P=r(f,2);q(P,{class:"sm:max-w-md",children:(p,B)=>{var l=nt(),g=d(l);z(g,{children:(o,T)=>{var _=st(),w=d(_);H(w,{children:(b,tt)=>{a();var R=i("Modifier le profil");t(b,R)},$$slots:{default:!0}});var F=r(w,2);L(F,{children:(b,tt)=>{a();var R=i("Modifiez vos informations de profil ici.");t(b,R)},$$slots:{default:!0}}),t(o,_)},$$slots:{default:!0}});var D=r(g,2),u=S(D),x=S(u);Q(x,{for:"name",children:(o,T)=>{a();var _=i("Nom");t(o,_)},$$slots:{default:!0}});var n=r(x,2);K(n,{id:"name",value:"Guillaume Tournier"}),M(u);var s=r(u,2),c=S(s);Q(c,{for:"email",children:(o,T)=>{a();var _=i("E-mail");t(o,_)},$$slots:{default:!0}});var e=r(c,2);K(e,{id:"email",type:"email",value:"guillaume@exemple.com"}),M(s),M(D);var $=r(D,2);k($,{children:(o,T)=>{E(o,{type:"submit",children:(_,w)=>{a();var F=i("Sauvegarder");t(_,F)},$$slots:{default:!0}})},$$slots:{default:!0}}),t(p,l)},$$slots:{default:!0}}),t(C,v)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Dialog.Root>
	<Dialog.Trigger>Modifier le profil</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Modifier le profil</Dialog.Title>
			<Dialog.Description
				>Modifiez vos informations de profil ici.</Dialog.Description
			>
		</Dialog.Header>
		<div class="flex flex-col gap-4 py-4">
			<div class="flex flex-col gap-1.5">
				<Label for="name">Nom</Label>
				<Input id="name" value="Guillaume Tournier" />
			</div>
			<div class="flex flex-col gap-1.5">
				<Label for="email">E-mail</Label>
				<Input id="email" type="email" value="guillaume@exemple.com" />
			</div>
		</div>
		<Dialog.Footer>
			<Button type="submit">Sauvegarder</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>`}}});var O=r(V,2);I(O,{name:"StickyFooter",template:h=>{y(h,{children:(C,j)=>{var v=ct(),f=d(v);N(f,{children:(p,B)=>{a();var l=i("Conditions d'utilisation");t(p,l)},$$slots:{default:!0}});var P=r(f,2);q(P,{class:"sm:max-w-md",children:(p,B)=>{var l=ut(),g=d(l);z(g,{children:(u,x)=>{var n=mt(),s=d(n);H(s,{children:(e,$)=>{a();var o=i("Conditions d'utilisation");t(e,o)},$$slots:{default:!0}});var c=r(s,2);L(c,{children:(e,$)=>{a();var o=i("Veuillez lire et accepter avant de continuer.");t(e,o)},$$slots:{default:!0}}),t(u,n)},$$slots:{default:!0}});var D=r(g,4);k(D,{children:(u,x)=>{var n=pt(),s=d(n);J(s,{children:(e,$)=>{a();var o=i("Refuser");t(e,o)},$$slots:{default:!0}});var c=r(s,2);E(c,{children:(e,$)=>{a();var o=i("Accepter");t(e,o)},$$slots:{default:!0}}),t(u,n)},$$slots:{default:!0}}),t(p,l)},$$slots:{default:!0}}),t(C,v)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Dialog.Root>
	<Dialog.Trigger>Conditions d'utilisation</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md">
		<Dialog.Header>
			<Dialog.Title>Conditions d'utilisation</Dialog.Title>
			<Dialog.Description
				>Veuillez lire et accepter avant de continuer.</Dialog.Description
			>
		</Dialog.Header>
		<div class="py-4">
			<p class="text-muted-foreground text-sm">
				En utilisant ce service, vous acceptez nos conditions générales
				d'utilisation et notre politique de confidentialité.
			</p>
		</div>
		<Dialog.Footer>
			<Dialog.Close>Refuser</Dialog.Close>
			<Button>Accepter</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>`}}});var Z=r(O,2);I(Z,{name:"NoCloseButton",template:h=>{y(h,{children:(C,j)=>{var v=gt(),f=d(v);N(f,{children:(p,B)=>{a();var l=i("Confirmation requise");t(p,l)},$$slots:{default:!0}});var P=r(f,2);q(P,{class:"sm:max-w-md",showCloseButton:!1,children:(p,B)=>{var l=ft(),g=d(l);z(g,{children:(u,x)=>{var n=$t(),s=d(n);H(s,{children:(e,$)=>{a();var o=i("Confirmation requise");t(e,o)},$$slots:{default:!0}});var c=r(s,2);L(c,{children:(e,$)=>{a();var o=i("Cette action nécessite votre confirmation explicite.");t(e,o)},$$slots:{default:!0}}),t(u,n)},$$slots:{default:!0}});var D=r(g,2);k(D,{children:(u,x)=>{var n=vt(),s=d(n);J(s,{children:(e,$)=>{a();var o=i("Annuler");t(e,o)},$$slots:{default:!0}});var c=r(s,2);E(c,{children:(e,$)=>{a();var o=i("Confirmer");t(e,o)},$$slots:{default:!0}}),t(u,n)},$$slots:{default:!0}}),t(p,l)},$$slots:{default:!0}}),t(C,v)},$$slots:{default:!0}})},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Dialog.Root>
	<Dialog.Trigger>Confirmation requise</Dialog.Trigger>
	<Dialog.Content class="sm:max-w-md" showCloseButton={false}>
		<Dialog.Header>
			<Dialog.Title>Confirmation requise</Dialog.Title>
			<Dialog.Description>
				Cette action nécessite votre confirmation explicite.
			</Dialog.Description>
		</Dialog.Header>
		<Dialog.Footer>
			<Dialog.Close>Annuler</Dialog.Close>
			<Button>Confirmer</Button>
		</Dialog.Footer>
	</Dialog.Content>
</Dialog.Root>`}}}),t(X,G),et()}W.__docgen={data:[],name:"dialog.stories.svelte"};const A=rt(W,lt),ro=["Basic","StickyFooter","NoCloseButton"],ao={...A.Basic,tags:["svelte-csf-v5"]},io={...A.StickyFooter,tags:["svelte-csf-v5"]},lo={...A.NoCloseButton,tags:["svelte-csf-v5"]};export{ao as Basic,lo as NoCloseButton,io as StickyFooter,ro as __namedExportsOrder,lt as default};
