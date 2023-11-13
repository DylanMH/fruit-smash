<script lang="ts">
	export let text: string;
	export let color = 'blue';

	const colorClass: Record<string, string> = {
		red: 'bg-red-500 text-white',
		blue: 'bg-blue-500 text-white',
		green: 'bg-green-500 text-white',
		yellow: 'bg-yellow-500 text-white',
		pink: 'bg-pink-500 text-white',
		purple: 'bg-purple-500 text-white',
		teal: 'bg-teal-500 text-white'
	};
</script>

<button
	style="user-select: none; cursor: default;"
	class={`text-white font-bold py-2 px-3 rounded mx-3 mt-3 ${colorClass[color]}`}>{text}</button
>
