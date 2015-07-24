
'use strict';
function Menu() {}

Menu.prototype = {
	preload: function() {

	},
	create: function() {
		this.background = this.game.add.sprite(0, this.game.height - 406, "menuAtlas", "menu_bg");
		this.background.width = this.game.width;
		this.title = this.game.add.sprite(0, 155, "menuAtlas", "menu_title");
		this.tap_text = this.game.add.sprite(43, 631, "menuAtlas", "tap_to_start");
		//this.tap_text.anchor.setTo(0.5, 0.5);
		this.game.add.tween(this.tap_text)
			.to({alpha:0.3}, 2000, Phaser.Easing.Cubic.InOut, true, 0, 1000, true);
	},
	update: function() {
		if (this.game.input.activePointer.justPressed()) {
			this.game.state.start("play");
		}
	}
};

module.exports = Menu;
