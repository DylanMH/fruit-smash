<script lang="ts">
	// component imports
	import { Button } from '$lib/components';
	import { goto } from '$app/navigation';
	import { signIn, signOut } from '@auth/sveltekit/client';
	import { page } from '$app/stores';
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<h1 class="text-6xl font-bold text-red-400 mb-8">Fruit Smasher</h1>
	{#if Object.keys(page).length < 0}
		<h2 class="text-2xl font-semibold text-gray-700 mb-4">Login</h2>
		<div class="space-y-4">
			<Button
				text="Discord"
				color="blue"
				on:click={() => {
					signIn('discord');
				}}
			/>
			<Button
				text="Github"
				color="red"
				on:click={() => {
					/*Handle login*/
				}}
			/>
			<Button
				text="Google"
				color="green"
				on:click={() => {
					/*Handle login*/
				}}
			/>
		</div>
	{:else}
		<Button text="Play" color="red" on:click={() => goto('play')} />
	{/if}
</div>
