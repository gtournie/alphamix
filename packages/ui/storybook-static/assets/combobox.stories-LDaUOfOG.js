import{p as De,j as Y,k as Ne,f as l,a as o,s as n,b as t,c as qe,l as f,m as r,e as U,t as Ce,o as e,u as ce,h as K,i as H,q as S,d as ge}from"./iframe-B6Xu6Fgz.js";import{c as Ke,d as He}from"./create-runtime-stories-BluNYEpp.js";import{P as we,a as be,b as Pe}from"./popover-trigger-Bjlwt5hI.js";import{e as ue}from"./each-DogT8R8i.js";import{c as ie}from"./utils-DuQb-ZiT.js";import{C as ke,a as ye,b as xe,c as Se,d as de,e as ve,f as Je}from"./command-shortcut-V0Vilc_9.js";import{B as Ve}from"./button-D1TQAHUS.js";import{C as fe}from"./check-Cx94_jVH.js";import{C as Re}from"./chevrons-up-down-CiKaogIM.js";import"./preload-helper-Dp1pzeXC.js";import"./popper-layer-force-mount-D5ubLT2m.js";import"./scroll-lock-1opjqm5x.js";import"./noop-DX6rZLP_.js";import"./create-id-8ROD_mwL.js";import"./attributes-C6SbQsrD.js";import"./index-257lgZP2.js";import"./escape-layer-CXi_dPcM.js";import"./watch.svelte--muhUWzz.js";import"./key-Bs4PgzsJ.js";import"./is-BHm3n0EP.js";import"./prop-resolvers-CZqMPH3V.js";import"./context-D0XnMbwk.js";import"./kbd-constants-n4TqMfRz.js";import"./dom-context.svelte-CPf2O-mD.js";import"./arrays-D8QdbQbh.js";import"./roving-focus-group-CBNdfFHi.js";import"./get-directional-keys-BbiU1xeD.js";import"./presence-manager.svelte-DF0bvKLa.js";import"./after-tick-DDHVDzN0.js";import"./map-DLkVwbjf.js";import"./use-id-CnMg5bH0.js";import"./index-client-DOodR3d_.js";import"./is-BGFdVicR.js";import"./safe-polygon.svelte-Btinpljg.js";import"./floating-layer-anchor-C7qMB51W.js";import"./this-BWUIJTEM.js";import"./dialog-close-CpHXYVXu.js";import"./dialog-content-B15xu5T4.js";import"./dialog-description-D4yA7rlF.js";import"./x-DgpBJJ8V.js";import"./Icon-CL6lX1Aa.js";import"./svelte-element-BjQqVbS1.js";import"./index-BWQi_4Ky.js";import"./input-BQCmUIJ_.js";import"./input-CIAyiIlm.js";import"./textarea-slF0AiTm.js";import"./search-CcbtR74z.js";import"./clone-BprWJeAc.js";import"./sr-only-styles-DkvRP7Nh.js";const me=[{value:"next.js",label:"Next.js"},{value:"sveltekit",label:"SvelteKit"},{value:"nuxt.js",label:"Nuxt.js"},{value:"remix",label:"Remix"},{value:"astro",label:"Astro"}],Le=[{value:"vite",label:"Vite"},{value:"parcel",label:"Parcel"}],Qe={title:"UI/Combobox",tags:["autodocs"],parameters:{docs:{description:{component:"Saisie autocomplète composée à partir des primitives Popover + Command. Aucun composant dédié — copiez les extraits directement."}}}},{Story:Ie}=He();var Xe=l(" <!>",1),Ye=l("<!> ",1),Ze=l("<!> <!>",1),et=l("<!> <!>",1),tt=l("<!> <!>",1),ot=l(" <!>",1),rt=l(" <!>",1),at=l(" <!>",1),nt=l("<!> <!> <!> <!>",1),st=l("<!> <!>",1),lt=l("<!> <!>",1),mt=l(" <!>",1),pt=l("<!> ",1),ct=l("<!> <!>",1),ut=l("<!> <!>",1),it=l("<!> <!>",1),dt=l("<!> <!> <!>",1);function Me(Te,Fe){De(Fe,!0);let _e=Y(!1),Z=Y(""),pe=Y(!1),O=Y(""),Be=Y(!1),A=Y(Ne([]));function We(J){e(A).includes(J)?S(A,e(A).filter(D=>D!==J),!0):S(A,[...e(A),J],!0)}var je=dt(),Oe=o(je);Ie(Oe,{name:"Basic",template:D=>{var G=f(),ee=o(G);r(ee,()=>Pe,(te,oe)=>{oe(te,{get open(){return e(_e)},set open(g){S(_e,g,!0)},children:(g,Ge)=>{var E=tt(),L=o(E);{const w=(s,a)=>{Ve(s,ge({variant:"outline",role:"combobox",class:"w-52 justify-between"},()=>a==null?void 0:a().props,{children:(i,M)=>{U();var d=Xe(),v=o(d),b=n(v);Re(b,{class:"ml-2 size-4 shrink-0 opacity-50"}),K(h=>H(v,`${h??""} `),[()=>{var h;return e(Z)?(h=me.find($=>$.value===e(Z)))==null?void 0:h.label:"Sélectionner un framework…"}]),t(i,d)},$$slots:{default:!0}}))};r(L,()=>we,(s,a)=>{a(s,{child:w,$$slots:{child:!0}})})}var re=n(L,2);r(re,()=>be,(w,s)=>{s(w,{class:"w-52 p-0",children:(a,ae)=>{var i=f(),M=o(i);r(M,()=>ke,(d,v)=>{v(d,{children:(b,h)=>{var $=et(),T=o($);r(T,()=>ye,(P,k)=>{k(P,{placeholder:"Rechercher un framework…"})});var ne=n(T,2);r(ne,()=>xe,(P,k)=>{k(P,{children:(se,Ee)=>{var F=Ze(),W=o(F);r(W,()=>Se,(V,I)=>{I(V,{children:(m,y)=>{U();var p=Ce("Aucun résultat trouvé.");t(m,p)},$$slots:{default:!0}})});var Q=n(W,2);r(Q,()=>de,(V,I)=>{I(V,{children:(m,y)=>{var p=f(),X=o(p);ue(X,17,()=>me,c=>c.value,(c,C)=>{var _=f(),x=o(_);r(x,()=>ve,(z,N)=>{N(z,{get value(){return e(C).value},onSelect:R=>{S(Z,R===e(Z)?"":R,!0),S(_e,!1)},children:(R,le)=>{var u=Ye(),q=o(u);{let j=ce(()=>ie("mr-2 size-4",e(Z)===e(C).value?"opacity-100":"opacity-0"));fe(q,{get class(){return e(j)}})}var B=n(q);K(()=>H(B,` ${e(C).label??""}`)),t(R,u)},$$slots:{default:!0}})}),t(c,_)}),t(m,p)},$$slots:{default:!0}})}),t(se,F)},$$slots:{default:!0}})}),t(b,$)},$$slots:{default:!0}})}),t(a,i)},$$slots:{default:!0}})}),t(g,E)},$$slots:{default:!0}})}),t(D,G)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Popover.Root bind:open={defaultOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				role="combobox"
				class="w-52 justify-between"
				{...props}
			>
				{defaultValue
					? frameworks.find((f) => f.value === defaultValue)?.label
					: "Sélectionner un framework…"}
				<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-52 p-0">
		<Command.Root>
			<Command.Input placeholder="Rechercher un framework…" />
			<Command.List>
				<Command.Empty>Aucun résultat trouvé.</Command.Empty>
				<Command.Group>
					{#each frameworks as framework (framework.value)}
						<Command.Item
							value={framework.value}
							onSelect={(currentValue) => {
								defaultValue =
									currentValue === defaultValue ? "" : currentValue;
								defaultOpen = false;
							}}
						>
							<CheckIcon
								class={cn(
									"mr-2 size-4",
									defaultValue === framework.value
										? "opacity-100"
										: "opacity-0",
								)}
							/>
							{framework.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>`}}});var Ae=n(Oe,2);Ie(Ae,{name:"WithSearch",template:D=>{var G=f(),ee=o(G);r(ee,()=>Pe,(te,oe)=>{oe(te,{get open(){return e(pe)},set open(g){S(pe,g,!0)},children:(g,Ge)=>{var E=lt(),L=o(E);{const w=(s,a)=>{Ve(s,ge({variant:"outline",role:"combobox",class:"w-64 justify-between"},()=>a==null?void 0:a().props,{children:(i,M)=>{U();var d=ot(),v=o(d),b=n(v);Re(b,{class:"ml-2 size-4 shrink-0 opacity-50"}),K(h=>H(v,`${h??""} `),[()=>{var h;return e(O)?(h=[...me,...Le].find($=>$.value===e(O)))==null?void 0:h.label:"Sélectionner…"}]),t(i,d)},$$slots:{default:!0}}))};r(L,()=>we,(s,a)=>{a(s,{child:w,$$slots:{child:!0}})})}var re=n(L,2);r(re,()=>be,(w,s)=>{s(w,{class:"w-64 p-0",children:(a,ae)=>{var i=f(),M=o(i);r(M,()=>ke,(d,v)=>{v(d,{children:(b,h)=>{var $=st(),T=o($);r(T,()=>ye,(P,k)=>{k(P,{placeholder:"Rechercher…",class:"h-9"})});var ne=n(T,2);r(ne,()=>xe,(P,k)=>{k(P,{children:(se,Ee)=>{var F=nt(),W=o(F);r(W,()=>Se,(m,y)=>{y(m,{children:(p,X)=>{U();var c=Ce("Aucun résultat.");t(p,c)},$$slots:{default:!0}})});var Q=n(W,2);r(Q,()=>de,(m,y)=>{y(m,{heading:"Récents",children:(p,X)=>{var c=f(),C=o(c);ue(C,17,()=>Le,_=>_.value,(_,x)=>{var z=f(),N=o(z);r(N,()=>ve,(R,le)=>{le(R,{get value(){return e(x).value},onSelect:u=>{S(O,u===e(O)?"":u,!0),S(pe,!1)},children:(u,q)=>{U();var B=rt(),j=o(B),he=n(j);{let $e=ce(()=>ie("ml-auto size-4",e(O)===e(x).value?"opacity-100":"opacity-0"));fe(he,{get class(){return e($e)}})}K(()=>H(j,`${e(x).label??""} `)),t(u,B)},$$slots:{default:!0}})}),t(_,z)}),t(p,c)},$$slots:{default:!0}})});var V=n(Q,2);r(V,()=>Je,(m,y)=>{y(m,{})});var I=n(V,2);r(I,()=>de,(m,y)=>{y(m,{heading:"Frameworks",children:(p,X)=>{var c=f(),C=o(c);ue(C,17,()=>me,_=>_.value,(_,x)=>{var z=f(),N=o(z);r(N,()=>ve,(R,le)=>{le(R,{get value(){return e(x).value},onSelect:u=>{S(O,u===e(O)?"":u,!0),S(pe,!1)},children:(u,q)=>{U();var B=at(),j=o(B),he=n(j);{let $e=ce(()=>ie("ml-auto size-4",e(O)===e(x).value?"opacity-100":"opacity-0"));fe(he,{get class(){return e($e)}})}K(()=>H(j,`${e(x).label??""} `)),t(u,B)},$$slots:{default:!0}})}),t(_,z)}),t(p,c)},$$slots:{default:!0}})}),t(se,F)},$$slots:{default:!0}})}),t(b,$)},$$slots:{default:!0}})}),t(a,i)},$$slots:{default:!0}})}),t(g,E)},$$slots:{default:!0}})}),t(D,G)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Popover.Root bind:open={searchOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				role="combobox"
				class="w-64 justify-between"
				{...props}
			>
				{searchValue
					? [...frameworks, ...recentFrameworks].find(
							(f) => f.value === searchValue,
						)?.label
					: "Sélectionner…"}
				<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-64 p-0">
		<Command.Root>
			<Command.Input placeholder="Rechercher…" class="h-9" />
			<Command.List>
				<Command.Empty>Aucun résultat.</Command.Empty>
				<Command.Group heading="Récents">
					{#each recentFrameworks as framework (framework.value)}
						<Command.Item
							value={framework.value}
							onSelect={(currentValue) => {
								searchValue =
									currentValue === searchValue ? "" : currentValue;
								searchOpen = false;
							}}
						>
							{framework.label}
							<CheckIcon
								class={cn(
									"ml-auto size-4",
									searchValue === framework.value
										? "opacity-100"
										: "opacity-0",
								)}
							/>
						</Command.Item>
					{/each}
				</Command.Group>
				<Command.Separator />
				<Command.Group heading="Frameworks">
					{#each frameworks as framework (framework.value)}
						<Command.Item
							value={framework.value}
							onSelect={(currentValue) => {
								searchValue =
									currentValue === searchValue ? "" : currentValue;
								searchOpen = false;
							}}
						>
							{framework.label}
							<CheckIcon
								class={cn(
									"ml-auto size-4",
									searchValue === framework.value
										? "opacity-100"
										: "opacity-0",
								)}
							/>
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>`}}});var Ue=n(Ae,2);Ie(Ue,{name:"MultiSelect",template:D=>{var G=f(),ee=o(G);r(ee,()=>Pe,(te,oe)=>{oe(te,{get open(){return e(Be)},set open(g){S(Be,g,!0)},children:(g,Ge)=>{var E=it(),L=o(E);{const w=(s,a)=>{Ve(s,ge({variant:"outline",role:"combobox",class:"w-64 justify-between"},()=>a==null?void 0:a().props,{children:(i,M)=>{U();var d=mt(),v=o(d),b=n(v);Re(b,{class:"ml-2 size-4 shrink-0 opacity-50"}),K(()=>H(v,`${e(A).length>0?`${e(A).length} sélectionné(s)`:"Sélectionner des frameworks…"} `)),t(i,d)},$$slots:{default:!0}}))};r(L,()=>we,(s,a)=>{a(s,{child:w,$$slots:{child:!0}})})}var re=n(L,2);r(re,()=>be,(w,s)=>{s(w,{class:"w-64 p-0",children:(a,ae)=>{var i=f(),M=o(i);r(M,()=>ke,(d,v)=>{v(d,{children:(b,h)=>{var $=ut(),T=o($);r(T,()=>ye,(P,k)=>{k(P,{placeholder:"Rechercher…"})});var ne=n(T,2);r(ne,()=>xe,(P,k)=>{k(P,{children:(se,Ee)=>{var F=ct(),W=o(F);r(W,()=>Se,(V,I)=>{I(V,{children:(m,y)=>{U();var p=Ce("Aucun résultat.");t(m,p)},$$slots:{default:!0}})});var Q=n(W,2);r(Q,()=>de,(V,I)=>{I(V,{children:(m,y)=>{var p=f(),X=o(p);ue(X,17,()=>me,c=>c.value,(c,C)=>{var _=f(),x=o(_);r(x,()=>ve,(z,N)=>{N(z,{get value(){return e(C).value},onSelect:()=>We(e(C).value),children:(R,le)=>{var u=pt(),q=o(u);{let j=ce(()=>ie("mr-2 size-4",e(A).includes(e(C).value)?"opacity-100":"opacity-0"));fe(q,{get class(){return e(j)}})}var B=n(q);K(()=>H(B,` ${e(C).label??""}`)),t(R,u)},$$slots:{default:!0}})}),t(c,_)}),t(m,p)},$$slots:{default:!0}})}),t(se,F)},$$slots:{default:!0}})}),t(b,$)},$$slots:{default:!0}})}),t(a,i)},$$slots:{default:!0}})}),t(g,E)},$$slots:{default:!0}})}),t(D,G)},$$slots:{template:!0},parameters:{__svelteCsf:{rawCode:`<Popover.Root bind:open={multiOpen}>
	<Popover.Trigger>
		{#snippet child({ props })}
			<Button
				variant="outline"
				role="combobox"
				class="w-64 justify-between"
				{...props}
			>
				{selectedValues.length > 0
					? \`\${selectedValues.length} sélectionné(s)\`
					: "Sélectionner des frameworks…"}
				<ChevronsUpDownIcon class="ml-2 size-4 shrink-0 opacity-50" />
			</Button>
		{/snippet}
	</Popover.Trigger>
	<Popover.Content class="w-64 p-0">
		<Command.Root>
			<Command.Input placeholder="Rechercher…" />
			<Command.List>
				<Command.Empty>Aucun résultat.</Command.Empty>
				<Command.Group>
					{#each frameworks as framework (framework.value)}
						<Command.Item
							value={framework.value}
							onSelect={() => toggleValue(framework.value)}
						>
							<CheckIcon
								class={cn(
									"mr-2 size-4",
									selectedValues.includes(framework.value)
										? "opacity-100"
										: "opacity-0",
								)}
							/>
							{framework.label}
						</Command.Item>
					{/each}
				</Command.Group>
			</Command.List>
		</Command.Root>
	</Popover.Content>
</Popover.Root>`}}}),t(Te,je),qe()}Me.__docgen={data:[],name:"combobox.stories.svelte"};const ze=Ke(Me,Qe),po=["Basic","WithSearch","MultiSelect"],co={...ze.Basic,tags:["svelte-csf-v5"]},uo={...ze.WithSearch,tags:["svelte-csf-v5"]},io={...ze.MultiSelect,tags:["svelte-csf-v5"]};export{co as Basic,io as MultiSelect,uo as WithSearch,po as __namedExportsOrder,Qe as default};
