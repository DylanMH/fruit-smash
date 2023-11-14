<script lang="ts">
	import { onMount } from 'svelte';
	import { GameService } from '$lib/GameService';

	import { StatsDisplay } from '$lib/components';

	// Instantiate the game service
	const gameService = new GameService();

	// Reactive statements for fruits and to update gamestate
	$: fruits = gameService.getFruits();

	let difficultyLevel: number;
	gameService.getDifficultyLevel().subscribe((value) => (difficultyLevel = value));

	let missedFruits: number;
	gameService.getMissedFruits().subscribe((value) => (missedFruits = value));

	let gameOver: boolean = false;
	gameService.gameOver().subscribe((value) => (gameOver = value));

	let score: number;
	gameService.getScore().subscribe((value) => (score = value));

	onMount(() => {
		gameService.startGame();

		// If you want to use requestAnimationFrame for smoother animations, you can set it up here
		let animationFrameId: number;
		function animate() {
			gameService.updateGame(); // Update game state
			fruits = gameService.getFruits(); // This line may not be necessary if $: fruits = ... is used
			animationFrameId = requestAnimationFrame(animate);
		}
		animate();

		return () => {
			// Cleanup on component destruction
			gameService.endGame();
			cancelAnimationFrame(animationFrameId);
		};
	});
</script>

{#if !gameOver}
	<div class="flex flex-row items-center justify-center">
		<StatsDisplay text="Score: {score}" color="red" />
		<StatsDisplay text="Missed fruits: {missedFruits}" color="green" />
		<StatsDisplay text="Level: {difficultyLevel}" color="blue" />
	</div>
	<div class="flex justify-center items-center min-h-screen">
		<div
			class="game-board overflow-hidden relative w-[800px] h-[800px] rounded-lg"
			style="background-image: url(/images/boardbackground.png); background-size: cover;"
		>
			{#each fruits as fruit (fruit.id)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="fruit absolute"
					style="top: {fruit.y}px; left: {fruit.x}px; width: {fruit.size}px; height: {fruit.size}px; background-image: url({fruit.imagePath}); {fruit.specialEffect};		animation: rotate-{fruit.rotationDirection} {fruit.rotationSpeed}s linear infinite;"
					on:click={() => gameService.smashFruit(fruit.id)}
				/>
			{/each}
		</div>
	</div>
{:else}
	<h1 class="text-2xl font-bold text-center text-red-5">Game Over!</h1>
{/if}

<style>
	.fruit {
		background-size: cover;
		background-position: center;
		user-select: none;
		-webkit-user-select: none;
		-moz-user-select: none;
		-ms-user-select: none;
	}
</style>
