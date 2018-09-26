const canvas = document.getElementById("myCanvas");
const ctx = canvas.getContext("2d");

window.addEventListener("keydown", function(e){
	switch(e.which) {
		case 37:
		player.moveLeft = true;
		break;
		case 39:
		player.moveRight = true;
		break;
	}		
})

window.addEventListener("keyup", function(e) {
	switch(e.which) {
		case 37:
		player.moveLeft = false;
		break;
		case 39:
		player.moveRight = false;
	}
})

class Game {
	init() {
		this.loop();
	}

	update() {
		player.move();
		ball.move();
		ball.colidePlayer();
		ball.colideEnemy();
		ball.colideWalls();	
	}

	render() {
		ctx.clearRect(0, 0, canvas.width, canvas.height);
		player.draw();
		enemy.draw();
		ball.draw();
	}

	loop() {
		requestAnimationFrame(game.loop, canvas);
		game.update();
		game.render();
	}
}

class Player {
	constructor() {
		this.width = 80;
		this.height = 30;
		this.x = canvas.width / 2 - this.width / 2;
		this.y = 560;
		this.color = "White";
		this.moveLeft = this.moveRight = false;
		this.speed = 8;
	}

	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	move() {
		if(this.moveLeft && this.x >= 10) {
			this.x -= this.speed;
		} else if(this.moveRight && this.x + this.width <= canvas.width - 10) {
			this.x += this.speed;
		}
	}
}

class Enemy {
	constructor(color, x, y, width, height) {
		this.width = width;
		this.height = height;
		this.x = x;
		this.y = y;
		this.color = color;
		this.enemies = [];
	}

	addEnemies() {
		for(var i = 0; i < 28; i++) {			
			if(i <= 6) {
				this.enemies.push(new Enemy("White", 90 * (i + 1), 100, 80, 30));
			} else if(i > 6 && i <= 13) {
				this.enemies.push(new Enemy("White", 90 * (i - 7 + 1), 140, 80, 30));
			} else if(i > 13 && i <= 20) {
				this.enemies.push(new Enemy("White", 90 * (i - 14 + 1), 180, 80, 30));
			} else {
				this.enemies.push(new Enemy("White", 90 * (i - 21 + 1), 220, 80, 30));
			}
		}
	}

	draw() {
		for(var i = 0; i < this.enemies.length; i++) {
			this.currentEnemy = this.enemies[i];
			ctx.fillStyle = this.currentEnemy.color;
			ctx.fillRect(this.currentEnemy.x, this.currentEnemy.y, this.currentEnemy.width, this.currentEnemy.height);
		}
	}
}

class Ball {
	constructor() {
		this.width = 10;
		this.height = 10;
		this.x = canvas.width / 2 - this.width / 2;
		this.y = 350;
		this.speedY = 4;
		this.speedX = 2;
		this.color = "White";
		this.directionX = null;
		this.directionY = 1;
	}

	draw() {
		ctx.fillStyle = this.color;
		ctx.fillRect(this.x, this.y, this.width, this.height);
	}

	move() {
		if(this.directionY == 1) {
			this.y += this.speedY;
		} else {
			this.y -= this.speedY;
		}

		if(this.directionX == 1) {
			this.x += this.speedX;
		} else if(this.directionX == 0) {
			this.x -= this.speedX;
		}
	}

	colidePlayer() {
		if(this.y + this.height >= player.y &&
			 this.y <= player.y + player.height &&
			 this.x + this.width >= player.x &&
			 this.x <= player.x + player.width) {
			this.directionY = 0;
			if(this.directionX == null) {
				this.directionX = 1;
			}
		}
	}

	colideEnemy() {
		for(var i = 0; i < enemy.enemies.length; i++) {
			this.currentEnemy = enemy.enemies[i];

			if(this.y <= this.currentEnemy.y + this.currentEnemy.height &&
				 this.y + this.height >= this.currentEnemy.y &&
				 this.x <= this.currentEnemy.x + this.currentEnemy.width &&
				 this.x + this.width >= this.currentEnemy.x) {
				enemy.enemies.splice(enemy.enemies.indexOf(this.currentEnemy), 1);
				if(this.y < this.currentEnemy.y) {
					this.directionY = 0;
				} else if(this.y > this.currentEnemy.y) {
					this.directionY = 1;
				}
			}
		}
	}

	colideWalls() {
		if(this.x <= 0) {
			this.directionX = 1;
		} else if(this.x + this.width >= canvas.width) {
			this.directionX = 0;
		}

		if(this.y <= 5) {
			this.directionY = 1;
		}
	}
}

game = new Game();
player = new Player();
enemy = new Enemy();
ball = new Ball();

enemy.addEnemies();
game.init();
