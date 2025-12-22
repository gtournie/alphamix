<script lang="ts">
	let {
		size = 100,
		opacity = 0.15,
    rotation = 24,
    corners = 6,
		color = '#ffffff',
		left = null,
		right = null,
		top = null,
		bottom = null
	} = $props();

	// Create the path of the hexagon with rounded corners using Bézier curves
	function createHexagonPath(size: number) {
		const path = [];
		const angleStep = (2 * Math.PI) / corners;
		const cornerRadius = size * 0.2; // Adjust the corner radius as needed

		for (let i = 0; i < corners; ++i) {
			const angle = i * angleStep;
			const nextAngle = (i + 1) * angleStep;

			// Start and end points of the edge
			const startX = (size - cornerRadius) * Math.cos(angle);
			const startY = (size - cornerRadius) * Math.sin(angle);
			const endX = (size - cornerRadius) * Math.cos(nextAngle);
			const endY = (size - cornerRadius) * Math.sin(nextAngle);

			// Control points for Bézier curve
			const controlX = size * Math.cos(angle);
			const controlY = size * Math.sin(angle);

			// Add the path commands
			if (i === 0) {
				path.push(`M ${startX},${startY}`);
			} else {
				path.push(`L ${startX},${startY}`);
			}
			path.push(`Q ${controlX},${controlY} ${endX},${endY}`);
		}

		// Close the path
		path.push('Z');
		return path.join(' ');
	}

	// Ajustez les dimensions du conteneur SVG en fonction de la taille et de la position
	const containerWidth = size * 2;
	const containerHeight = size * 2;
</script>

<svg class="hexagon-container" 
  width="{containerWidth}" 
  height="{containerHeight}"
  style:left="{left}px"
  style:right="{right}px"
  style:top="{top}px"
  style:bottom="{bottom}px">
	<defs>
		<linearGradient id="white-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
			<stop offset="0%" style="stop-color: {color}; stop-opacity: 1" />
			<stop offset="100%" style="stop-color: {color}; stop-opacity: 0" />
		</linearGradient>
	</defs>
	<path
		d={createHexagonPath(size / 2)}
		style="
			fill: url(#white-gradient); 
			opacity: {opacity};
			transform: translate({containerWidth / 2}px, {containerHeight / 2}px) rotate({rotation}deg);
		"
	/>
</svg>

<style>
	.hexagon-container {
		position: absolute;
    z-index: -1;
		overflow: visible; /* Assurez-vous que le contenu dépasse si nécessaire */
	}
</style>
