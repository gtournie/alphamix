import { crossfade } from 'svelte/transition';
import { writable, get } from 'svelte/store';
// import { quintOut } from 'svelte/easing';

// export const [send, receive] = crossfade({
//   duration: (d) => Math.sqrt(d * 200),

//   fallback(node, params) {
//     const style = getComputedStyle(node);
//     const transform = style.transform === 'none' ? '' : style.transform;

//     return {
//       duration: 160000,
//       easing: quintOut,
//       css: (t) => `
// 				transform: ${transform} scale(${t});
// 				opacity: ${t}
// 			`
//     };
//   }
// });

// export const [send, receive] = crossfade({ duration: 3000 });

const [send, receive] = crossfade({ duration: 3000 });

export const animateStore = writable(false);

export function conditionalSend(node, params) {
  return get(animateStore) ? send(node, params) : { duration: 0 };
}

export function conditionalReceive(node, params) {
  return get(animateStore) ? receive(node, params) : { duration: 0 };
}