<script module lang="ts">
	const BRAND_LETTERS = 'ALPHAMIX'.split('');
	const radius = 1000;
	const width = 386;
	const height = 100; // 100 is a magic height number
	const centerX = width / 2;
	const centerY = height / 1.44 + radius; // 1.44 is a magic number to center the text vertically
	const letterSpacing = 0.93;
	const fontSize = 70; // 70 is a magic number fill the view with the text
  const fontWeight = "bold";
	const fontFamily = 'CoreSans';

	function calculateTranslate(rotation: number, radius: number) {
		const angleInRadians = (rotation * Math.PI) / 180;
		const x = centerX + radius * Math.sin(angleInRadians);
		const y = centerY - radius * Math.cos(angleInRadians);
		return [Math.round(x * 100) / 100, Math.round(y * 100) / 100];
	}
	function angle(letterWidth) {
		const rad = Math.asin(letterWidth / 2 / radius) * 2;
		const deg = rad * (180 / Math.PI);
		return deg;
	}

	function getTextWidth(text, font) {
		const canvas = getTextWidth.canvas || (getTextWidth.canvas = document.createElement('canvas'));
		const context = canvas.getContext('2d');
		context.font = font;
		const metrics = context.measureText(text);
		return metrics.width * letterSpacing;
	}
	function getRotation(index: number) {
		const count = BRAND_LETTERS.length;
		const middle = count / 2;
		return Math.trunc((index - middle) * 2.9);
	}

	let angles = BRAND_LETTERS.map((letter) => {
		const letterWidth = getTextWidth(letter, `${fontWeight} ${fontSize}px ${fontFamily}`);
		return angle(letterWidth);
	});
	const halfTotalAngle = angles.reduce((sum, angle) => sum + angle, 0) / 2;
	let ref = -halfTotalAngle;
	angles = angles.map((a, index) => {
		if (index !== 0) ref += angles[index - 1];
		return ref;
	});

	const letters = Object.keys(BRAND_LETTERS).reduce((acc, key, index) => {
		const rotation = angles[index];
		acc.push({
			value: BRAND_LETTERS[key],
			translate: calculateTranslate(rotation, radius).join(','),
			rotation
		});
		return acc;
	}, []);
</script>

<script lang="ts">
	const { color, borderColor, depthColor } = $props();
</script>

<svg viewBox="0 0 {width} {height}" version="1.1" style="display: inline;">
	<!-- <circle class="Rang" layer="0" id="Rang0" cx={centerX} cy={centerY} r={radius} fill="none" stroke="#090a0b" stroke-width="2" /> -->
	<g
		data-svg
		font-size={fontSize}
		font-weight={fontWeight}
		font-family={fontFamily}
		style="transform: translate(1px, 5px)"
		stroke={depthColor}
	>
		{#each letters as letter}
			<text transform="translate({letter.translate}) rotate({letter.rotation}) scale(1, 1.2)">
				<tspan>{letter.value}</tspan>
			</text>
		{/each}
	</g>
	<g
		data-svg
		font-size={fontSize}
		font-weight={fontWeight}
		font-family={fontFamily}
		stroke={borderColor}
	>
		{#each letters as letter}
			<text transform="translate({letter.translate}) rotate({letter.rotation}) scale(1, 1.2)">
				<tspan>{letter.value}</tspan>
			</text>
		{/each}
	</g>
	<g
		font-size={fontSize}
		font-weight={fontWeight}
		font-family={fontFamily}
		fill={color}
		stroke="none"
	>
		{#each letters as letter}
			<text transform="translate({letter.translate}) rotate({letter.rotation}) scale(1, 1.2)">
				<tspan>{letter.value}</tspan>
			</text>
		{/each}
	</g>
</svg>

<style>
	@font-face {
		font-family: 'CoreSans';
		src: url($lib/fonts/Core-Sans-ar65.otf) format('opentype');
	}
  svg {
    width: 100%;
  }
	svg [data-svg] {
		paint-order: stroke;
		stroke-width: 3px;
		stroke-linecap: butt;
		stroke-linejoin: round;
	}
</style>
