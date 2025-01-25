class MainScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MainScene' });
    }

    preload() {
        // Load a simple colored rectangle as a placeholder sprite
        this.load.image('player', 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAYAAABzenr0AAAAEklEQVRYw+3BAQEAAACCIP+vbkhAAQAAAO8GECAAAZf3V9sAAAAASUVORK5CYII=');
    }

    create() {
        this.player = this.physics.add.sprite(400, 300, 'player');
        this.player.setCollideWorldBounds(true);
        
        // Create cursor keys for movement
        this.cursors = this.input.keyboard.createCursorKeys();
    }

    update() {
        const speed = 200;

        // Reset velocity
        this.player.setVelocity(0);

        // Handle movement
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-speed);
        }
        if (this.cursors.right.isDown) {
            this.player.setVelocityX(speed);
        }
        if (this.cursors.up.isDown) {
            this.player.setVelocityY(-speed);
        }
        if (this.cursors.down.isDown) {
            this.player.setVelocityY(speed);
        }
    }
}
