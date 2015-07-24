
'use strict';
function Preload() {
  this.asset = null;
  this.ready = false;
}

Preload.prototype = {
	preload: function() {
		this.asset = this.add.sprite(this.width/2,this.height/2, 'preloader');
		this.asset.anchor.setTo(0.5, 0.5);
		this.game.stage.backgroundColor = 0xffffff;

		this.load.onLoadComplete.addOnce(this.onLoadComplete, this);
		this.load.setPreloadSprite(this.asset);
		this.game.load.atlasJSONHash("menuAtlas", "assets/menu_ss.png", "assets/menu_ss.json");
		this.game.load.atlasJSONHash("playAtlas", "assets/play_ss.png", "assets/play_ss.json");
	},
  create: function() {
    this.asset.cropEnabled = false;
  },
  update: function() {
    if(!!this.ready) {
      this.game.state.start('play');
    }
  },
  onLoadComplete: function() {
    this.ready = true;
  }
};

module.exports = Preload;
