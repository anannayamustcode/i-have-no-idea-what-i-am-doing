import { Player } from '../gameObjects/Player.js';

export class Game extends Phaser.Scene {
    constructor() {
        super('Game');
    }

    create() {
        // Background
        this.add.image(400, 300, 'sky');

        // Platforms
        this.platforms = this.physics.add.staticGroup();
        this.platforms.create(400, 568, 'ground').setScale(2).refreshBody();
        this.platforms.create(600, 400, 'ground');
        this.platforms.create(50, 250, 'ground');
        this.platforms.create(750, 220, 'ground');

        // Player
        this.player = new Player(this, 100, 500);
        this.physics.add.collider(this.player, this.platforms);
        this.cursors = this.input.keyboard.createCursorKeys();

        // Score
        this.score = 0;
        this.scoreText = this.add.text(16, 16, 'Score: 0', { 
            fontSize: '32px', 
            fill: '#000',
            fontStyle: 'bold'
        });

        // Scroll - starts closed
        this.scroll = this.add.image(750, 50, 'scroll')
            .setScale(0.6)
            .setDepth(10)
            .setInteractive({ cursor: 'pointer' })
            .on('pointerdown', this.handleScrollClick, this);
        
        this.scrollOpen = false;
        this.letterVisible = false;
        this.scrollUnlocked = false;

        // Letter (hidden initially)
        this.letter = this.add.image(400, 300, 'letter')
            .setScale(0.8)
            .setDepth(20)
            .setVisible(false)
            .setInteractive()
            .on('pointerdown', this.closeLetter, this);

        // Stars
        this.stars = this.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });

        this.stars.children.iterate(child => {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });

        this.physics.add.collider(this.stars, this.platforms);
        this.physics.add.overlap(this.player, this.stars, this.collectStar, null, this);

        // Bombs
        this.bombs = this.physics.add.group();
        this.physics.add.collider(this.bombs, this.platforms);
        this.physics.add.collider(this.player, this.bombs, this.hitBomb, null, this);
    }

    update() {
        // Player controls
        if (this.cursors.left.isDown) {
            this.player.moveLeft();
        } else if (this.cursors.right.isDown) {
            this.player.moveRight();
        } else {
            this.player.idle();
        }

        if (this.cursors.up.isDown && this.player.body.blocked.down) {
            this.player.jump();
        }
    }

    handleScrollClick() {
        if (this.scrollOpen && !this.letterVisible) {
            this.showLetter();
        }
    }

    showLetter() {
        this.letter.setVisible(true);
        this.letterVisible = true;
        this.physics.pause();
        this.player.setTint(0x888888);
    }

    closeLetter() {
        this.letter.setVisible(false);
        this.letterVisible = false;
        this.physics.resume();
        this.player.clearTint();
    }

    collectStar(player, star) {
        star.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);

        // Automatically open scroll at 300+ points
        if (this.score >= 100 && !this.scrollUnlocked) {
            this.scrollUnlocked = true;
            this.scrollOpen = true;
            this.scroll.setTexture('scrollOpen');
            this.scroll.setTint(0xffffff);
            this.tweens.add({
                targets: this.scroll,
                scale: 0.65,
                duration: 500,
                yoyo: true,
                repeat: -1
            });
        }

        if (this.stars.countActive(true) === 0) {
            this.stars.children.iterate(child => {
                child.enableBody(true, child.x, 0, true, true);
            });
            this.releaseBomb();
        }
    }

    hitBomb(player, bomb) {
        this.physics.pause();
        player.setTint(0xff0000);
        player.anims.play('turn');
        this.time.delayedCall(2000, () => {
            this.scene.start('GameOver');
        });
    }

    releaseBomb() {
        const x = (this.player.x < 400) 
            ? Phaser.Math.Between(400, 800) 
            : Phaser.Math.Between(0, 400);

        const bomb = this.bombs.create(x, 16, 'bomb');
        bomb.setBounce(1);
        bomb.setCollideWorldBounds(true);
        bomb.setVelocity(Phaser.Math.Between(-200, 200), 20);
    }
}