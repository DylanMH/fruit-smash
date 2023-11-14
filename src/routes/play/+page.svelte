<script>
	import { goto } from '$app/navigation';
	import { Button } from '$lib/components/';

	let highScore = 12345; // Replace with the actual high score from user data
</script>

<div class="flex flex-col items-center justify-center min-h-screen">
	<h1 class="text-6xl font-bold text-gray-800 mb-8">Fruit Smasher</h1>
	<p class="text-xl font-bold"><a href="/"> Go Back</a></p>

	<div class="flex flex-row items-center justify-center border rounded-lg p-8 bg-gray-400 shadow">
		<div class="flex flex-col items-center mr-8">
			<h2 class="text-4xl font-semibold text-gray-700 mb-4">Singleplayer</h2>
			<p class="text-xl text-black mb-4">High Score: {highScore}</p>
			<Button
				text="Play Singleplayer"
				color="green"
				on:click={() => {
					goto('/game/singleplayer');
				}}
			/>
		</div>

		<div class="border h-24 border-blue-600" />

		<div class="flex flex-col items-center ml-8">
			<h2 class="text-4xl font-semibold text-gray-700 mb-4">Multiplayer</h2>
			<p class="text-xl text-red-800 font-bold uppercase">Coming Soon</p>
			<div class="space-y-4">
				<Button
					text="Ranked"
					color="blue"
					on:click={() => {
						/* future functionality */
					}}
				/>
				<Button
					text="Unranked"
					color="purple"
					on:click={() => {
						/* future functionality */
					}}
				/>
			</div>
		</div>
	</div>
</div>
