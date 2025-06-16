export class GameOver extends Phaser.Scene {
    constructor() {
        super('GameOver');
    }

    create() {
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(512, 300, 'Game Over', {
            fontFamily: 'Arial Black', 
            fontSize: 64, 
            color: '#ffffff',
            stroke: '#000000', 
            strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        // Add Try Again button
        const tryAgain = this.add.text(512, 450, 'TRY AGAIN', {
            fontFamily: 'Arial',
            fontSize: 32,
            color: '#ffffff',
            backgroundColor: '#880000',
            padding: { left: 20, right: 20, top: 10, bottom: 10 },
            align: 'center'
        })
        .setOrigin(0.5)
        .setInteractive();

        // Button hover effect
        tryAgain.on('pointerover', () => {
            tryAgain.setStyle({ fill: '#ffff00' });
        });

        tryAgain.on('pointerout', () => {
            tryAgain.setStyle({ fill: '#ffffff' });
        });

        // Button click action
        tryAgain.on('pointerdown', () => {
            this.scene.start('Game');
        });
    }
}