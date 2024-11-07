<script lang="ts">
	import { getRandomInt } from '$lib/utilities/getRandomInt';
	import { onMount } from 'svelte';
	import './Wonderland.css';
	let el: HTMLDivElement;

	const tree_type_1 = {
		svg: `<svg class="c-christmas-tree__tree" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 110 154" xml:space="preserve"> <path d="M108.05,132.55c0,0-12.7-10.8-24.8-29c7.3-1.4,11.8-3.3,11.8-5.4c0,0-12.3-10.4-22.3-27.6c7.5-1,12.4-2.7,12.4-4.6 c0,0-12.4-10.5-20.2-27.3c6.2-0.7,10.4-1.9,10.4-3.4c0,0-14.8-12.5-17.3-30.9c-0.4-2.7-5.8-2.9-6.2,0c-2.4,20.2-17.3,30.9-17.3,30.9 c0,1.5,4.4,2.8,10.9,3.4c-7.7,17.9-20.7,27.3-20.7,27.3c0,2,5.3,3.7,13.3,4.8c-10.1,18.1-23.2,27.5-23.2,27.5 c0,2.2,5.1,4.3,13.2,5.7c-12.4,19-26.1,28.8-26.1,28.8c0,5,19.1,9.2,44.2,10v5.2c0,2.1,1.7,3.8,3.8,3.8h10.1c2.1,0,3.8-1.7,3.8-3.8 v-5.2C88.85,141.65,108.05,137.55,108.05,132.55z"/> </svg>`,
		lights: [
			{ left: '56.122%', top: '16.66%', width: '3.63%' },
			{ left: '82.142%', top: '81.89%', width: '7.27%' },
			{ left: '71.683%', top: '77.08%', width: '5.45%' },
			{ left: '24.489%', top: '56.41%', width: '7.27%' },
			{ left: '34.948%', top: '71.79%', width: '7.27%' },
			{ left: '43.112%', top: '22.11%', width: '5.45%' },
			{ left: '27.806%', top: '82.53%', width: '5.45%' },
			{ left: '46.938%', top: '56.57%', width: '3.63%' },
			{ left: '70.408%', top: '58.49%', width: '3.63%' },
			{ left: '62.755%', top: '42.14%', width: '3.63%' },
			{ left: '59.693%', top: '70.51%', width: '7.27%' },
			{ left: '55.867%', top: '28.52%', width: '7.27%' },
			{ left: '60.204%', top: '50.00%', width: '5.45%' },
			{ left: '37.244%', top: '42.62%', width: '5.45%' }
		]
	};
	const tree_type_2 = {
		svg: `<svg class="c-christmas-tree__tree" version="1.1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 98 156" xml:space="preserve"> <path d="M95.7,133.8l-17.2-30.6c4-1.1,6.3-2.4,6.3-3.9L68.6,70.5c5-1,8-2.3,8-3.7l-16-28.7c5.4-0.7,8.9-1.9,8.9-3.2L52.1,4.1 c-1.4-2.4-4.8-2.4-6.2,0L28.6,34.9c0,1.3,3.5,2.5,8.9,3.2L21.4,66.8c0,1.4,3.1,2.8,8,3.7L13.2,99.3c0,1.4,2.3,2.8,6.3,3.9L2.3,133.8 c0,4.2,15.2,7.7,35.7,8.6v7.6c0,2,1.6,3.7,3.7,3.7h14.7c2,0,3.7-1.6,3.7-3.7v-7.6C80.5,141.5,95.7,138,95.7,133.8z"/> </svg>`,
		lights: [
			{ left: '56.30%', top: '16.88%', width: '3.63%' },
			{ left: '50.90%', top: '57.14%', width: '7.27%' },
			{ left: '68.60%', top: '62.01%', width: '5.45%' },
			{ left: '28.10%', top: '57.14%', width: '7.27%' },
			{ left: '42.70%', top: '19.48%', width: '7.27%' },
			{ left: '39.50%', top: '71.10%', width: '5.45%' },
			{ left: '24.00%', top: '84.74%', width: '5.45%' },
			{ left: '56.30%', top: '48.05%', width: '3.63%' },
			{ left: '80.00%', top: '83.76%', width: '3.63%' },
			{ left: '43.60%', top: '31.16%', width: '3.63%' },
			{ left: '62.70%', top: '39.25%', width: '7.27%' },
			{ left: '42.70%', top: '83.11%', width: '7.27%' },
			{ left: '63.10%', top: '76.94%', width: '5.45%' },
			{ left: '39.50%', top: '43.18%', width: '5.45%' }
		]
	};
	const kfc_bucket_image = `Images/kfc.png`;
	onMount(() => {
		el.classList.add('has-effect-wonderland');
		el.classList.add('c-effect__christmas-wonderland');

		const lightrope = buildLightrope();
		el.appendChild(lightrope);

		const left_candy_cane = buildCandyCane('l');
		const right_candy_cane = buildCandyCane('r');
		el.appendChild(left_candy_cane);
		el.appendChild(right_candy_cane);

		const left_tree = buildTree(1, 'l');
		const middle_tree = buildTree(1, 'm');
		const right_tree = buildTree(2, 'r');
		el.appendChild(left_tree);
		el.appendChild(middle_tree);
		el.appendChild(right_tree);

		const kfc_bucket = buildKfcBucket();
		el.appendChild(kfc_bucket);

		function buildLightrope() {
			const container = document.createElement('div');
			container.classList.add('c-effect__lightrope');

			// TODO: Change css to set display: none on many of the unused lights
			for (let i = 0; i < 50; i++) {
				const light = document.createElement('div');
				light.classList.add('c-effect__lightrope-light');

				const bulb = document.createElement('div');
				bulb.classList.add('c-effect__lightrope-bulb');
				light.appendChild(bulb);

				const socket = document.createElement('div');
				socket.classList.add('c-effect__lightrope-socket');
				light.appendChild(socket);

				const rope = document.createElement('div');
				rope.classList.add('c-effect__lightrope-rope');
				light.appendChild(rope);

				container.appendChild(light);
			}

			return container;
		}

		function buildCandyCane(direction = 'l') {
			const container = document.createElement('div');
			container.classList.add('c-candy-cane');
			if (direction === 'r') {
				container.classList.add('c-candy-cane--right');
			}

			for (let i = 0; i < 150; i++) {
				const ring = document.createElement('div');
				ring.classList.add('c-candy-cane-ring');
				if (i % 2) {
					ring.classList.add('c-candy-cane-ring--red');
				} else {
					ring.classList.add('c-candy-cane-ring--white');
				}

				container.appendChild(ring);
			}

			return container;
		}

		function buildTree(type_number = 1, location = 'l') {
			const container = document.createElement('div');
			container.classList.add('c-christmas-tree');

			let tree_config;
			if (type_number === 1) {
				container.classList.add('c-christmas-tree--type-1');
				tree_config = tree_type_1;
			} else {
				container.classList.add('c-christmas-tree--type-2');
				tree_config = tree_type_2;
			}

			if (location === 'l') {
				container.classList.add('c-christmas-tree--left');
			} else if (location === 'm') {
				container.classList.add('c-christmas-tree--middle');
			} else {
				container.classList.add('c-christmas-tree--right');
			}

			container.innerHTML = tree_config.svg;

			const lights_container = document.createElement('div');
			lights_container.classList.add('c-christmas-tree__lights');

			for (const light_config of tree_config.lights) {
				const light = document.createElement('div');
				light.classList.add('c-christmas-tree__light');

				light.style.left = light_config.left;
				light.style.top = light_config.top;
				light.style.width = light_config.width;

				const type = getRandomInt(1, 3);
				light.classList.add(`c-christmas-tree__light--${type}`);

				lights_container.appendChild(light);
			}

			container.appendChild(lights_container);

			return container;
		}

		function buildKfcBucket() {
			const container = document.createElement('div');
			container.classList.add('c-kfc-bucket');

			const image = document.createElement('img');
			image.src = kfc_bucket_image;
			container.appendChild(image);

			return container;
		}
	});
</script>

<div style:z-index={9} style:position="absolute" style:top="0" style:left="0">
	<div bind:this={el}></div>
</div>
