
'use strict';
function Play() {}
Play.prototype = {
	create: function() {
		this.game.world.setBounds(0, 0, this.game.width, this.game.height);
		this.game.physics.startSystem(Phaser.Physics.P2JS);
		this.game.physics.p2.restituion = 0.8;

		this.apple = this.game.add.sprite(340, 550, "playAtlas", "apple0");
		this.apple.anchor.setTo(0.5, 0.5);
		this.game.physics.p2.enable(this.apple);
		this.apple.body.clearShapes();
		this.appleShape = this.apple.body.addCircle(250);
		this.apple.body.debug = true;
		this.haveToUpdate = true;
		//this.apple.width = this.apple.height = 250;
		//this.appleShape.radius = 100;
		//this.appleShape.updateBoundingRadius();

		this.sachockTop = this.game.add.sprite(100, 100, "playAtlas", "sachockEnterTop");
		this.sachockBottom = this.game.add.sprite(100, 300, "playAtlas", "sachockEnterBottom");
		this.game.physics.p2.enable([this.sachockTop, this.sachockBottom]);
		this.sachockTop.body.kinematic = true;
		this.sachockBottom.body.kinematic = true;

		this.cursors = this.game.input.keyboard.createCursorKeys();
	},
	update: function() {

		this.appleShape.radius -= 0.01;
		this.apple.width -= 0.45;
		this.apple.height -= 0.45;
		this.appleShape.updateBoundingRadius();
		this.apple.body.debugBody.draw();

		if (this.cursors.left.isDown)
		{
			this.apple.body.rotateLeft(80);
		}
		else if (this.cursors.right.isDown)
		{
			this.apple.body.rotateRight(80);
		}
		else
		{
			this.apple.body.setZeroRotation();
		}

		if (this.cursors.up.isDown)
		{
			this.apple.body.thrust(400);
		}
		else if (this.cursors.down.isDown)
		{
			this.apple.body.reverse(400);
		}
	}
};
  
  module.exports = Play;