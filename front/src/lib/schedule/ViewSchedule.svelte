<script lang="ts">
	import { schedule, type ScheduleItem } from '$lib/stores/schedule';
	import moment from 'moment';
	import type { Moment } from 'moment';
	import { io } from '$lib/realtime';
	import { tempSettings } from '$lib/stores/tempSettings';
	import { userSettings } from '$lib/stores/userSettings';
	export let changeSelectedID: Function;
	let date = moment().startOf('day');
	let week = [] as Array<Moment>;
	let scheduleArray: Array<ScheduleItem> = [];
	let timeSet: Set<number> = new Set();
	let minSplit = 0;
	let maxSplit = 1000;
	io.emit('get-schedule', date.toString());
	const splitToTime = (split: number) => {
		let hour =
			parseInt(
				Math.floor(split / 60)
					.toString()
					.padStart(2, '0')
			) % 24;
		let minute = (split % 60).toString().padStart(2, '0');
		return `${hour}:${minute}`;
	};
	const getSchedule = () => {
		week = [];
		scheduleArray = [];
		const calendarStart = parseInt($userSettings.scheduleModalStart.split(':')[0]);
		timeSet = new Set();
		minSplit = 1500;
		maxSplit = 0;
		let offset = 0;
		let displayDate = date.clone();
		if (moment().hour() < calendarStart) {
			displayDate.subtract(1, 'day');
		}
		for (let i = 0; i < 7; i++) {
			week.push(displayDate.clone().add(i, 'days'));
		}
		let prevStart = moment.utc('2000-01-01 00:00:00').local();
		let prevFinish = moment.utc('2001-01-01 00:00:00').local();
		let prevItem: ScheduleItem;
		for (let item of $schedule) {
			let itemMoment = moment.utc(item.playTimeUTC).local();
			let finishMoment = moment.utc(item.finishTimeUTC).local();
			let conflict =
				(itemMoment > prevStart && itemMoment < prevFinish) ||
				(finishMoment > prevStart && finishMoment < prevFinish);
			if (conflict) {
				item.conflict = conflict;
				//@ts-ignore
				if (typeof prevItem !== 'undefined') prevItem.conflict = conflict;
			}
			prevStart = itemMoment.clone();
			prevFinish = finishMoment.clone();
			prevItem = item;
			let diff = Math.floor(itemMoment.diff(displayDate) / 86400000);
			if (diff < 7 && diff >= 0) {
				let startingSplit = Math.round(
					parseInt(itemMoment.format('H')) * 60 + parseInt(itemMoment.format('m'))
				);
				let endingMinute = itemMoment.clone().add(item.duration, 's');
				let endingSplit = Math.round(
					parseInt(endingMinute.format('H')) * 60 + parseInt(endingMinute.format('m'))
				);
				if (endingSplit < startingSplit) {
					endingSplit += 1440;
				}
				item.startingSplit = startingSplit;
				item.endingSplit = endingSplit;
				item.diff = diff;
				if (startingSplit < minSplit) minSplit = startingSplit;
			}
		}
		if (minSplit < calendarStart * 60) {
			offset = calendarStart * 60 - minSplit;
			minSplit = calendarStart * 60;
		}
		for (let item of $schedule) {
			if (
				item.diff !== undefined &&
				item.startingSplit !== undefined &&
				item.endingSplit !== undefined
			) {
				if (item.startingSplit < minSplit) {
					if (item.diff == 0) continue;
					item.diff--;
					item.startingSplit += 1440;
					item.endingSplit += 1440;
				}
				item.gridArea = `${item.startingSplit + 2}/${item.diff + 2}/${item.endingSplit + 2}/${
					item.diff + 3
				}`;
				scheduleArray.push(item);
				if (item.endingSplit > maxSplit) maxSplit = item.endingSplit;
			}
		}
		for (let i = minSplit; i < maxSplit; i++) {
			timeSet.add(i);
		}
	};
	const moveDate = (int: number) => {
		date.add(int, 'days');
		io.emit('get-schedule', date.toString());
	};
	const getTimeGrid = (int: number) => {
		if (int >= 1440) int++;
		return `grid-area:${int + 2}/1/${int + 3}/2`;
	};
	schedule.subscribe(() => {
		getSchedule();
	});
	userSettings.subscribe(() => {
		getSchedule();
	});
</script>

{#if $tempSettings.scheduleView == 'calendar'}
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
				class={!item.visible ? 'scheduleItem hidden' : 'scheduleItem'}
				style={`grid-area:${item.gridArea}`}
				style:border={item.conflict ? 'dashed 2px red' : ''}
				style:background={`hsla(${item?.hsl?.[0] ?? 0},${item?.hsl?.[1] ?? 0},${
					item?.hsl?.[2] ?? 0
				},0.5)`}
				on:click={() => changeSelectedID(item)}
			>
				{item.title}
			</div>
		{/each}
		{#each Array.from(timeSet) as item}
			<div class="scheduleTime" style={getTimeGrid(item)}>
				{#if item % 5 == 0}
					{splitToTime(item)}
				{/if}
			</div>
		{/each}
		{#if timeSet.has(1440)}
			{#each week as day, i}
				<div
					class="scheduleHeader"
					style={`grid-area:1442/${i + 2}/1443/${i + 3};font-weight:bold`}
				>
					{day.clone().add(1, 'day').format('ddd DD')}
				</div>
			{/each}
		{/if}
	</div>
{:else}
	<table id="scheduleList">
		<tr>
			<th>Item</th>
			<th colspan="4">Date</th>
		</tr>
		{#each $schedule as item}
			{#if moment.utc(item.playTimeUTC).isAfter(moment.utc())}
				<tr
					style:background={`hsla(${item?.hsl?.[0] ?? 0},${item?.hsl?.[1] ?? 0},${
						item?.hsl?.[2] ?? 0
					},0.3)`}
				>
					<td style:padding-right={'0.5rem'}>{item.title}</td>
					<td>{moment.utc(item.playTimeUTC).local().format('ddd MMM Do')}</td>
					<td>{moment.utc(item.playTimeUTC).local().format('HH:mm')}</td>
					<td>-</td>
					<td>{moment.utc(item.finishTimeUTC).local().format('HH:mm')}</td>
				</tr>
			{/if}
		{/each}
	</table>
{/if}

<style>
	#scheduleList tr {
		border-bottom: solid 2px rgba(0, 0, 0, 0.5);
	}
	#scheduleList td {
		padding: 0 5px;
	}
	#scheduleList {
		border-collapse: collapse;
	}
	#scheduleGrid {
		display: grid;
		width: 100%;
		background: var(--color-bg-4);
		color: var(--color-fg-4);
		grid-template-columns: 4rem 1fr 1fr 1fr 1fr 1fr 1fr 1fr;
		grid-template-rows: repeat(1800, 1);
		grid-column-gap: 0;
		grid-row-gap: 0;
		max-height: calc(90svh - 13rem);
		overflow-y: scroll;
		padding-bottom: 1px;
	}
	#scheduleGrid > div {
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
		white-space: nowrap;
		min-width: 4rem;
		z-index: 1;
	}
	.scheduleTime {
		font-size: 0.6rem !important;
		min-height: 4px;
		border: none !important;
		position: sticky;
		left: 0;
		background: inherit;
		margin-right: 2px;
	}
	.scheduleItem.hidden {
		background: repeating-linear-gradient(
			45deg,
			rgba(0, 0, 0, 0.05),
			rgba(0, 0, 0, 0.05) 10px,
			rgba(0, 0, 0, 0.1) 10px,
			rgba(0, 0, 0, 0.1) 20px
		);
		border: 1px dashed !important;
	}
</style>
