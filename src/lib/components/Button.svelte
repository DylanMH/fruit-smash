<script lang="ts">
	export let text: string;
	export let color = 'blue';

	const colorClass: Record<string, string> = {
		blue: 'bg-blue-500 hover:bg-blue-700',
		red: 'bg-red-500 hover:bg-red-700',
		green: 'bg-green-500 hover:bg-green-700',
		yellow: 'bg-yellow-500 hover:bg-yellow-700',
		purple: 'bg-purple-500 hover:bg-purple-700',
		pink: 'bg-pink-500 hover:bg-pink-700'
	};
</script>

<button class={`text-white font-bold py-2 px-3 rounded ${colorClass[color]}`} on:click
	>{text}</button
>
