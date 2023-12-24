<script lang="ts">
	import { schedule, type ScheduleItem } from '$lib/stores/schedule';
	import moment from 'moment';
	import type { Moment } from 'moment';
	import { io } from '$lib/realtime';
	export let changeSelectedID: Function;
	let date = moment().startOf('day');
	let week = [] as Array<Moment>;
	let scheduleArray:Array<ScheduleItem> = [];
	let timeSet:Set<number> = new Set();
	let minSplit = 0;
	let maxSplit = 1000;
	io.emit('get-schedule');
	const splitToTime = (split: number) => {
		let hour = Math.floor(split / 60)
			.toString()
			.padStart(2, '0');
		let minute = (split % 60).toString().padStart(2, '0');
		return `${hour}:${minute}`;
	};
	const getSchedule = () => {
		week = [];
		scheduleArray = [];
		timeSet = new Set();
		minSplit = 1500;
		maxSplit = 0;
		for (let i = 0; i < 7; i++) {
			week.push(date.clone().add(i, 'days'));
		}
		for (let item of $schedule) {
			let itemMoment = moment.utc(item.playTimeUTC).local();
			let diff = Math.floor(itemMoment.diff(date) / 86400000);
			if (diff < 7 && diff >= 0) {
				let startingSplit = Math.floor(
					parseInt(itemMoment.format('H')) * 60 + parseInt(itemMoment.format('m'))
				);
				let endingMinute = itemMoment.clone().add(item.duration, 's');
				let endingSplit =
					Math.floor(parseInt(endingMinute.format('H')) * 60 + parseInt(endingMinute.format('m'))) +
					1;
				if (endingSplit < startingSplit) {
					endingSplit += 1440;
				}
				item.gridArea = `${startingSplit + 2}/${diff + 2}/${endingSplit + 2}/${diff + 3}`;
				scheduleArray.push(item);
				if (startingSplit < minSplit) minSplit = startingSplit;
				if (endingSplit > maxSplit) maxSplit = endingSplit;
			}
		}
		for (let i = minSplit; i < maxSplit; i++) {
			timeSet.add(i);
		}
	};
	const moveDate = (int: number) => {
		date.add(int, 'days');
		io.emit('get-schedule');
	};
	schedule.subscribe(() => {
		getSchedule();
	});
</script>

<div id="scheduleGrid">
	<div class="scheduleHeader" style="grid-area:1/1/2/2">
		<span>
			<button
				on:click={() => {
					moveDate(-1);
				}}>{`<`}</button
			>
			<button
				on:click={() => {
					moveDate(1);
				}}>{`>`}</button
			>
		</span>
	</div>
	{#each week as day, i}
		<div class="scheduleHeader" style={`grid-area:1/${i + 2}/2/${i + 3};font-weight:bold`}>
			{day.format('ddd DD')}
		</div>
	{/each}
	{#each scheduleArray as item}		
		<!-- svelte-ignore a11y-click-events-have-key-events -->
		<div
		class="scheduleItem"
		style={`grid-area:${item.gridArea}`}
		on:click={() => changeSelectedID(item)}
		>
			{item.title}
		</div>
	{/each}
	{#each Array.from(timeSet) as item}
		<div class="scheduleTime" style={`grid-area:${item + 2}/1/${item + 3}/2`}>
			{#if item % 5 == 0}
				{splitToTime(item)}
			{/if}
		</div>
	{/each}
</div>

<style>
	#scheduleGrid {
		display: grid;
		width: 100%;
		background: var(--color-bg-4);
		color: var(--color-fg-4);
		grid-template-columns: 4rem 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
		grid-template-rows: repeat(1800, 1);
		grid-column-gap: 0;
		grid-row-gap: 0;
		max-height: calc(100svh - 13rem);
		overflow-y: scroll;
		padding-bottom: 1px;
	}
	#scheduleGrid>div {
		display: flex;
		justify-content: center;
		align-content: center;
		text-align: center;
		flex-direction: column;
		border: 1px solid;
		margin-left: -1px;
		margin-bottom: -1px;
		font-size: 0.8rem;
	}
	.scheduleHeader {
		position: sticky;
		top: 0;
		background: inherit;
		white-space:nowrap;
		min-width: 4rem;
		z-index: 1;
	}
	.scheduleTime {
		font-size: 0.6rem !important;
		min-height: 4px;
		border: none !important;
		position:sticky;
		left:0;
		background:inherit;
		margin-right:2px
	}
	.scheduleItem {
		background: rgba(0, 0, 0, 0.05);
	}
</style>
