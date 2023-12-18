<script>
	export let propItemNumber;
	export let propData;
	export let propHoveredItemNumber = 5e-6;
	export let dropCallback = function () {};
	const functionDrop = function (parEvent, parTarget) {
		if (parEvent.dataTransfer === null) return;
		parEvent.dataTransfer.dropEffect = 'move';
		const start = parseInt(parEvent.dataTransfer.getData('text/plain'));
		const newTracklist = propData;
		if (start < parTarget) {
			newTracklist.splice(parTarget + 1, 0, newTracklist[start]);
			newTracklist.splice(start, 1);
		} else {
			newTracklist.splice(parTarget, 0, newTracklist[start]);
			newTracklist.splice(start + 1, 1);
		}
		propData = newTracklist;
		propHoveredItemNumber = 5e-6;
		dropCallback();
	};
	const functionDragStart = function (parEvent, parIndex) {
		if (parEvent.dataTransfer === null) return;
		parEvent.dataTransfer.effectAllowed = 'move';
		parEvent.dataTransfer.dropEffect = 'move';
		const start = parIndex;
		parEvent.dataTransfer.setData('text/plain', start.toString());
	};
</script>

<span
	role="list"
	class={$$restProps.class || ''}
	draggable="true"
	on:dragstart={(parEvent) => functionDragStart(parEvent, propItemNumber)}
	on:drop|preventDefault={(event) => functionDrop(event, propItemNumber)}
	on:dragover|preventDefault={() => false}
	on:dragenter|preventDefault={() => (propHoveredItemNumber = propItemNumber)}
>
	<slot />
</span>
