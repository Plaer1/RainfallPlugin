//META{"name":"Rainfall","displayName":"Rainfall"}*//
/* globals BdApi */

class Rainfall {
	getName() {
		return "Rainfall";
	}

	getDescription() {
		return "Adds a rain effect to your BetterDiscord client.";
	}

	getVersion() {
		return "1.1.0";
	}

	getAuthor() {
		return "Plær1â€™";
	}

	start() {
		class RainfallEffect {
	constructor() {
		this.canvas = null;
		this.ctx = null;
		this.drops = [];
		this.splashes = [];
		this.animationFrame = null;
	}

	start() {
		this.initCanvas();
		this.initRainDrops();
		this.animate();
		window.addEventListener('resize', () => this.resizeCanvas());
	}

	stop() {
		cancelAnimationFrame(this.animationFrame);
		document.body.removeChild(this.canvas);
	}

	initCanvas() {
		this.canvas = document.createElement('canvas');
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.canvas.style.position = 'fixed';
		this.canvas.style.top = '0';
		this.canvas.style.left = '0';
		this.canvas.style.pointerEvents = 'none';
		this.canvas.style.zIndex = '9999'; // Set a high z-index value
		this.ctx = this.canvas.getContext('2d');
		document.body.appendChild(this.canvas);
	}

	resizeCanvas() {
		this.canvas.width = window.innerWidth;
		this.canvas.height = window.innerHeight;
		this.drops.forEach(drop => {
			drop.width = this.canvas.width;
			drop.height = this.canvas.height;
		});
	}

	initRainDrops() {
		for (let i = 0; i < 100; i++) {
			this.drops.push(new Drop(window.innerWidth, window.innerHeight));
		}
	}

	animate() {
		this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

		for (const drop of this.drops) {
			drop.update();
			drop.draw(this.ctx);

			if (drop.splash) {
				this.splashes.push(new Splash(drop.x, 0));
				drop.reset();
			}
		}

		for (let i = this.splashes.length - 1; i >= 0; i--) {
			const splash = this.splashes[i];
			splash.update();
			splash.draw(this.ctx);

			if (splash.finished) {
				this.splashes.splice(i, 1);
			}
		}

		this.animationFrame = requestAnimationFrame(() => this.animate());
	}
}

class Drop {
	constructor(width, height) {
		this.width = width;
		this.height = height;
		this.reset();
	}

	reset() {
		this.x = Math.random() * this.width;
		this.y = Math.random() * this.height;
		this.length = Math.random() * 20 + 10;
		this.speed = Math.random() * 4 + 2;
		this.splash = false;
	}

	update() {
		this.y += this.speed;

		if (this.y > this.height - 5) {
			this.splash = true;
		}
	}

	draw(ctx) {
		const grad = ctx.createLinearGradient(this.x, this.y, this.x, this.y - this.length);
		grad.addColorStop(1, `rgba(0, 100, 255, 0.1)`);
		grad.addColorStop(0.5, `rgba(0, 100, 255, 0.2)`);
		grad.addColorStop(0, `rgba(0, 100, 255, 0.3)`);

		ctx.strokeStyle = grad;
		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.moveTo(this.x, this.y);
		ctx.lineTo(this.x, this.y - this.length);
		ctx.stroke();
	}
}


class Splash {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.particles = [];
		this.finished = false;

		for (let i = 0; i < 5; i++) {
			this.particles.push(new Particle(x, window.innerHeight));
		}
	}

	update() {
		let allParticlesOffScreen = true;

		for (const particle of this.particles) {
			particle.update();

			if (particle.y > 0) {
				allParticlesOffScreen = false;
			}
		}

		if (allParticlesOffScreen) {
			this.finished = true;
		}
	}

	draw(ctx) {
		for (const particle of this.particles) {
			particle.draw(ctx);
		}
	}
}

class Particle {
	constructor(x, y) {
		this.x = x;
		this.y = y;
		this.vx = Math.random() * 6 - 3;
		this.vy = -(Math.random() * 2 + 1);
		this.alpha = 1;
		this.decay = Math.random() * 0.04 + 0.01;
	}

	update() {
		this.x += this.vx;
		this.y += this.vy;
		this.alpha -= this.decay;

		if (this.alpha < 0) {
			this.alpha = 0;
		}
	}

	draw(ctx) {
		ctx.fillStyle = `rgba(50, 100, 255, ${(2/3) * this.alpha})`;
		ctx.beginPath();
		ctx.arc(this.x, this.y, 1.5, 0, 2 * Math.PI);
		ctx.fill();
	}
}
this.rainfallEffect = new RainfallEffect();
this.rainfallEffect.start();
	}

	stop() {
		this.rainfallEffect.stop();
	}
}