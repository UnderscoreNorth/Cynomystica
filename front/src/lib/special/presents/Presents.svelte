<script lang="ts">
	import { getRandomElement } from '$lib/utilities/getRandomElement';
	import { getRandomInt } from '$lib/utilities/getRandomInt';
	import { presentsStore } from './PresentsStore';
	import { effectStore } from '../EffectStore';
	import { browser } from '$app/environment';
	import { onMount } from 'svelte';
	import './Presents.css';
	let el: HTMLDivElement;
	onMount(() => {
		$presentsStore.state.curr_img = 0;
		$presentsStore.state.max_img = $presentsStore.img_bank.length;
		setTimeout(() => {
			$effectStore['Presents'].is_on = false;
		}, $presentsStore.presents_duration_s * 1000);
		_faceAnimation();
		_flashingText();
		_runPresentsAnimation();
		function addElement(element: HTMLElement) {
			console.log(el);
			el.appendChild(element);
		}

		async function cachePresents() {
			const images = $presentsStore.img_bank;

			// Load images in chunks
			const chunk_size = 5;
			for (let i = 0; i < images.length; i += chunk_size) {
				const chunk = images.slice(i, i + chunk_size);
				//console.log(chunk);

				await new Promise((resolve) => setTimeout(resolve, getRandomInt(0, 20 * 1000)));
				const loading_promises = [];
				for (const url of chunk) {
					loading_promises.push(cacheImage(url));
				}

				try {
					await Promise.all(loading_promises);
				} catch (e) {
					// One of the images failed to load but we don't really care here
				}
			}
		}
		function cacheImage(url: string) {
			const img = new Image();
			img.style.position = 'absolute';
			img.style.left = '-10000px';
			img.style.top = '-10000px';
			img.src = url;

			document.documentElement.appendChild(img);
			return new Promise<void>((resolve, reject) => {
				img.onload = () => {
					if (img.parentElement !== null) img.parentElement.removeChild(img);
					resolve();
				};
				img.onerror = () => {
					if (img.parentElement !== null) img.parentElement.removeChild(img);
					reject();
				};
			});
		}

		///////////////////////////////////////////
		// Timed Static methods
		///////////////////////////////////////////
		function _flashingText() {
			// console.log('In label')
			// console.log($presentsStore.label)
			if ($presentsStore.label !== 'None') {
				const labelText = document.createElement('P');
				labelText.classList.add(`c-effect__presents-label`);
				labelText.innerText = $presentsStore.label;

				addElement(labelText);

				const fn = () => {
					if (labelText.parentElement !== null) labelText.parentElement.removeChild(labelText);
					labelText.removeEventListener('animationend', fn);
				};
				labelText.addEventListener('animationend', fn);
			}
		}

		function _faceAnimation() {
			const face_img = $presentsStore.padoru_img;

			const face_effect = document.createElement('img');
			face_effect.classList.add('c-effect__presents-face-inner');
			face_effect.src = face_img;

			const outer = document.createElement('div');
			outer.classList.add('c-effect__presents-face-outer');

			const fling1 = document.createElement('img');
			fling1.classList.add('c-effect__presents-face-fling');
			fling1.classList.add('c-effect__presents-face-fling-type1');
			fling1.src = $presentsStore.present_img;

			const fling2 = document.createElement('img');
			fling2.classList.add('c-effect__presents-face-fling');
			fling2.classList.add('c-effect__presents-face-fling-type2');
			fling2.src = $presentsStore.present_img;

			const fling3 = document.createElement('img');
			fling3.classList.add('c-effect__presents-face-fling');
			fling3.classList.add('c-effect__presents-face-fling-type3');
			fling3.src = $presentsStore.present_img;

			outer.appendChild(face_effect);
			outer.appendChild(fling1);
			outer.appendChild(fling2);
			outer.appendChild(fling3);

			addElement(outer);
			const fn = () => {
				if (face_effect.parentElement !== null) {
					face_effect.parentElement.removeChild(fling1);
					face_effect.parentElement.removeChild(fling2);
					face_effect.parentElement.removeChild(fling3);
					face_effect.parentElement.removeChild(face_effect);
				}

				face_effect.removeEventListener('animationend', fn);
				//TODO: $presentsStore.removeElement(outer)
			};
			face_effect.addEventListener('animationend', fn);
		}

		function _runPresentsAnimation() {
			const create_fn = (is_left: boolean) => {
				_create_present(is_left);
				setTimeout(() => create_fn(!is_left), $presentsStore.spawn_rate);
			};
			setTimeout(() => create_fn(true), $presentsStore.spawn_rate);
		}
		function _create_present(is_left: boolean) {
			//const present_img = $presentsStore.shiz_img; // replace with random
			const present_img = $presentsStore.img_bank[$presentsStore.state.curr_img];
			$presentsStore.state.curr_img = $presentsStore.state.curr_img + 1;
			if ($presentsStore.state.curr_img >= $presentsStore.img_bank.length) {
				$presentsStore.state.curr_img = 0;
			}
			const animation = getRandomElement($presentsStore.present_animations);

			let offset = -500;
			if (is_left) {
				offset = 10;
			} else {
				offset = 55;
			}

			const random_location = (Math.random() * 35 + offset).toFixed(4);

			const inner = document.createElement('img');
			inner.classList.add(`c-effect__presents-present-fall`);
			inner.classList.add(`c-effect__presents-present-fall-${animation}`);
			inner.style.left = `${random_location}%`;
			inner.src = present_img;
			addElement(inner);

			const fn = () => {
				if (inner.parentElement !== null) inner.parentElement.removeChild(inner);
				inner.removeEventListener('animationend', fn);
			};
			inner.addEventListener('animationend', fn);
		}
	});
</script>

<div style:z-index={9} style:position="absolute" style:top="0" style:left="0">
	<div bind:this={el}></div>
</div>
