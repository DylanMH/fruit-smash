<script lang="ts">
	import { onMount } from 'svelte';
	import { GameService } from '$lib/GameService';

	// Instantiate the game service
	const gameService = new GameService();

	// Reactive statements for fruits and to update gamestate
	$: fruits = gameService.getFruits();

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
	<h1 class="text-2xl font-bold text-center text-green-500">Score:{score}</h1>
	<div class="flex justify-center items-center min-h-screen">
		<div class="game-board overflow-hidden relative bg-green-200 w-[800px] h-[800px]">
			{#each fruits as fruit (fruit.id)}
				<!-- svelte-ignore a11y-click-events-have-key-events -->
				<!-- svelte-ignore a11y-no-static-element-interactions -->
				<div
					class="fruit absolute"
					style="top: {fruit.y}px; left: {fruit.x}px; width: {fruit.size}px; height: {fruit.size}px; background-image: url({fruit.imagePath});"
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
