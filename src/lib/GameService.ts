// GameService.ts
import { writable, get } from 'svelte/store';

// Type definitions and IFruit interface
export type FruitType = 'small' | 'medium' | 'large';

type Bonus = {
	apply: () => void;
	revert: () => void;
};

export interface IFruit {
	id: string;
	type: FruitType;
	points: number;
	clicksRequired: number;
	isSpecial: boolean;
	y: number;
	isFalling: boolean;
	size: number;
}

// Fruit class that implements IFruit. Represents a single fruit object in the game. Contains all of the properties of a single fruit
export class Fruit implements IFruit {
	imagePath: string;
	y: number = 0;
	x: number;
	isFalling: boolean = true;
	size: number;
	fallSpeed: number = 1;
	originalFallSpeed: number;
	originalClicksRequired: number;

	constructor(
		public id: string,
		public type: FruitType,
		public points: number,
		public clicksRequired: number,
		public isSpecial: boolean = false,
		public bonusType?: string
	) {
		this.imagePath = this.getImagePath(type);
		this.size = this.calculateSize(type);
		this.fallSpeed = this.calculateFallSpeed(this.size);
		this.x = this.randomXPosition();
		this.originalClicksRequired = this.clicksRequired;
		this.originalFallSpeed = this.fallSpeed;
	}

	public applyFallSpeedModifier(modifier: number) {
		this.fallSpeed *= modifier;
	}

	public applyOneClickModifier() {
		this.clicksRequired = 1;
	}

	public revertToOriginalFallSpeed() {
		this.fallSpeed = this.originalFallSpeed;
	}

	public revertToOriginalClicksRequired() {
		this.clicksRequired = this.originalClicksRequired;
	}

	calculateFallSpeed(size: number): number {
		const minSize = 100;
		const maxSize = 300;
		const minSpeed = 0.3;
		const maxSpeed = 1.5;

		const speed = minSpeed + ((size - minSize) / (maxSize - minSize)) * (maxSpeed - minSpeed);
		return speed;
	}

	randomXPosition(): number {
		const maxPosition = GameService.gameBoardWidth - this.size;
		return Math.floor(Math.random() * maxPosition);
	}

	calculateSize(type: FruitType): number {
		const sizeRange = {
			small: { min: 100, max: 150 },
			medium: { min: 170, max: 220 },
			large: { min: 230, max: 300 }
		};
		const range = sizeRange[type];
		return Math.floor(Math.random() * (range.max - range.min) + range.min);
	}

	getImagePath(type: FruitType): string {
		const basePath = '/images/fruits';
		const fruitImages = {
			small: ['banana.png', 'cherry.png', 'grape.png'],
			medium: ['orange.png', 'apple.png', 'peach.png'],
			large: ['watermelon.png', 'pineapple.png', 'cantaloupe.png']
		};
		const imageName = fruitImages[type][Math.floor(Math.random() * fruitImages[type].length)];
		return `${basePath}/${type}/${imageName}`;
	}

	fall() {
		if (this.isFalling) {
			this.y += this.fallSpeed;
		}
	}

	smash() {
		this.clicksRequired -= 1;
		return this.clicksRequired <= 0;
	}
}
// END OF FUIT CLASS //

// Gameservice class manages the overall game state and logic. Contains methods and properties that control the game environment.
// Deals with multiple 'Fruit' objects and other aspects of the game that are not specific to a single fruit.
export class GameService {
	private fruits: Fruit[] = [];
	private gameInterval?: ReturnType<typeof setInterval>;
	public gameBoardHeight: number = 800; // The height of your game board
	static gameBoardWidth: number = 800; // The width of your game board
	private _isGameOver = writable(false);
	private globalFallSpeed = writable(0.5);
	private activeBonuses: Record<string, Bonus> = {};

	private score = writable(0);
	private nextSpawnTime: number = 0;
	private missedFruits: number = 0;
	private difficultyLevel: number = 1;
	private spawnRate: number = 500;

	private bonusState = {
		reduceFallSpeedActive: false,
		oneClickActive: false
	};

	constructor() {
		this.initGame();
	}

	// functions to return fruit values to components as reactive variables
	public getScore() {
		return this.score;
	}

	public getFruits(): Fruit[] {
		return [...this.fruits];
	}

	public gameOver() {
		return this._isGameOver;
	}

	private initGame() {
		// Initialize or reset game state
		this.fruits = [];
		this.missedFruits = 0;
		this.difficultyLevel = 1;
		this.spawnRate = 2000;
		this.nextSpawnTime = 0;
		this.score.set(0);
		// Possibly set up initial fruits or other starting state
	}

	private addScore(points: number) {
		this.score.update((prevScore) => prevScore + points);
	}

	// START OF HELPER FUNCTIONS FOR SPAWNING FRUITS
	// method to generate a unique id for each fruit
	private generateUniqueId(): string {
		return Date.now().toString(36) + Math.random().toString(36).substr(2);
	}

	// method to calculate what fruits are going to spawn based on the users score
	private calculateFruitType(): FruitType {
		const currentScore = get(this.score);
		const types: FruitType[] = ['small'];

		if (currentScore > 50) {
			types.push('medium');
		}

		if (currentScore > 100) {
			types.push('large');
		}

		const randomIndex = Math.floor(Math.random() * types.length);
		return types[randomIndex];
	}

	// method to calculate the amount of times the user needs to click the fruit to smash it
	private calculateFruitClicksRequired(type: FruitType): number {
		const clicksMap = {
			small: { min: 1, max: 2 },
			medium: { min: 3, max: 4 },
			large: { min: 5, max: 7 }
		};
		const range = clicksMap[type];

		return Math.floor(Math.random() * (range.max - range.min + 1) + range.min);
	}

	// method to calculate the amount of points the user gets for smashing the fruit
	private calculateFruitPoints(type: FruitType): number {
		const pointsMap = {
			small: { min: 10, max: 20 },
			medium: { min: 30, max: 50 },
			large: { min: 50, max: 150 }
		};
		const range = pointsMap[type];
		return Math.floor(Math.random() * (range.max - range.min + 1) + range.min);
	}

	// method to check if the fruit is a special fruit
	private checkIfSpecial(fruit: Fruit): void {
		if (Math.random() < 0.4) {
			fruit.isSpecial = true;
			// assign a random bonus to the fruit
			const bonusType = ['reduceFallSpeed', 'oneClickFruit'];
			const randomBonus = bonusType[Math.floor(Math.random() * bonusType.length)];
			fruit.bonusType = randomBonus;
		}
	}

	// FRUIT SPAWNING FUNCTION THAT USES THE ABOVE HELPER FUNCTIONS
	private spawnFruit() {
		const id = this.generateUniqueId();
		const type = this.calculateFruitType();
		const clicksRequired = this.calculateFruitClicksRequired(type);
		const points = this.calculateFruitPoints(type);

		const fruit = new Fruit(id, type, points, clicksRequired, false);
		fruit.y = -fruit.size; // Start above the board
		fruit.x = fruit.randomXPosition();
		this.checkIfSpecial(fruit);

		// apply active bonuses to the fruit
		if (this.bonusState.reduceFallSpeedActive) {
			fruit.applyFallSpeedModifier(0.8);
		}
		if (this.bonusState.oneClickActive) {
			fruit.applyOneClickModifier();
		}
		this.fruits.push(fruit);
	}

	// method to increase the difficulty of the game based on users score (needs work)
	public increaseDifficulty() {
		const currentScore = get(this.score);
		if (currentScore % 50 === 0 && currentScore !== 0) {
			// every 50 points
			this.difficultyLevel++;
			this.spawnRate *= 0.9; // increase spawn rate by 10%
			this.fruits.forEach((fruit) => {
				fruit.fallSpeed = Math.max(fruit.fallSpeed, this.difficultyLevel);
			});
		}
	}

	private moveFruitsDown() {
		this.fruits = this.fruits.filter((fruit) => {
			fruit.fall();
			const hitBottom = fruit.y > this.gameBoardHeight;
			if (hitBottom) {
				this.missedFruits++;
			}
			return !hitBottom;
		});
	}

	private checkForMissedFruits() {
		const maxMissedFruits = 5;
		if (this.missedFruits >= maxMissedFruits) {
			this.endGame();
		}
	}

	// method to update the game state
	public updateGame() {
		const currentTime = Date.now(); // get the current time in milliseconds
		// check if the current time is greater than the next spawn time
		if (currentTime >= this.nextSpawnTime) {
			this.spawnFruit(); // spawn a new fruit
			this.nextSpawnTime = currentTime + this.spawnRate; // update the spawn time
		}
		this.moveFruitsDown();
		this.checkForMissedFruits();
		if (this._isGameOver) {
			return;
		}
	}

	public startGame() {
		this.initGame();
		this.gameInterval = setInterval(() => {
			this.spawnFruit(); // Spawn fruits on an interval
			this.updateGame();
		}, this.spawnRate);
	}

	// FRUIT MODIFIERS / BONUSES //
	fallSpeedModifier(modifier: number, duration: number) {
		this.fruits.forEach((fruit) => {
			fruit.applyFallSpeedModifier(modifier);
		});
		setTimeout(() => {
			this.fruits.forEach((fruit) => {
				fruit.revertToOriginalFallSpeed();
			});
			this.bonusState.reduceFallSpeedActive = false;
		}, duration);
	}

	oneClickModifier(duration: number) {
		this.fruits.forEach((fruit) => {
			fruit.applyOneClickModifier();
		});
		setTimeout(() => {
			this.fruits.forEach((fruit) => {
				fruit.revertToOriginalClicksRequired();
			});
			this.bonusState.oneClickActive = false;
		}, duration);
	}

	public smashFruit(fruitId: string) {
		const fruitIndex = this.fruits.findIndex((fruit) => fruit.id === fruitId);
		if (fruitIndex !== -1) {
			const fruit = this.fruits[fruitIndex];
			const smashed = fruit.smash();
			if (smashed) {
				this.addScore(fruit.points);
				this.fruits.splice(fruitIndex, 1);
			}

			if (fruit.isSpecial && fruit.bonusType) {
				switch (fruit.bonusType) {
					case 'reduceFallSpeed':
						if (!this.bonusState.reduceFallSpeedActive) {
							console.log('starting reduce fall speed');
							this.fallSpeedModifier(0.8, 10000);
							this.bonusState.reduceFallSpeedActive = true;
						}
						break;
					case 'oneClickFruit':
						if (!this.bonusState.oneClickActive) {
							console.log('starting one click smash');
							this.oneClickModifier(3000); // One click smash for 3 seconds
							this.bonusState.oneClickActive = true;
						}
						break;
				}
			}
		}
	}

	public endGame() {
		this._isGameOver.set(true);
		if (this.gameInterval) {
			clearInterval(this.gameInterval);
			this.gameInterval = undefined;
		}
		console.log('Game over');
	}
}
