import BezierEasing from 'bezier-easing';

const easing = BezierEasing(0.25, 0.9, 0.5, 1.2);

// 0.5 0.75
// 0   0.25
// 0   1


function getTForInterval(start, end, t) {
	const interval = end - start;
	const factor = 1 / interval;
	return (t - start) * factor;
}

export function fall(node, { fromLeft, delay = 0, duration = 1000, rotate = 0 }) {
	const horizontalShift = fromLeft ? -20 : 20;

	return {
		delay,
		duration,
		css: (t: number, u: number) => {
			const rotation = rotate * getTForInterval(0.5, 0.9, t);

			// const eased = easing(u);
			// const rev = easing(t);
			// console.log(eased);
			// if (t < 0.6) {
			// 	return `transform: translateY(${eased * -200}px) scale(${rev * 0.95}); opacity: ${eased};`;
			// }
			// if (t < 0.75) {
			if (t < 0.75) {
				t = getTForInterval(0, 0.75, t);
				u = 1 - t;
				const eased = easing(u);
				const rev = easing(t);
				return `transform: translate(${eased * horizontalShift}px, ${eased * -200}px) scale(${rev * 0.75}) rotate(${rotation}deg);`;
			}
			if (t < 0.9) {
				t = getTForInterval(0.75, 0.9, t);
				u = 1 - t;
				// const eased = easing(u);
				// const rev = easing(t);
				return `transform: translateY(${t * -15}px) rotate(${rotation}deg);`;
			}
			t = getTForInterval(0.9, 1, t);
			u = 1 - t;
			return `transform: translateY(${u * -15}px) rotate(${rotation}deg);`;
			// }
			// if (t < 0.9) {
				// return `transform: translateY(${eased * -20}px) scale(${rev});`;
			// }
			// if (t < 1) {
			// 	return `transform: translateY(0) scale(${eased * 1.05 });`;
			// }
			return '';
		}
	};
}