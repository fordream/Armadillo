var gameLayer;
var ball;
var scoreLabel;
var score = 0;
var bg1, bg2;
var vSpeed = 0;
var bs = [];
var size;
var ice;

var HelloWorldLayer = cc.Layer.extend({
    space:null,
    ctor:function () {
        this._super();
        this.scheduleUpdate();
        cc.eventManager.addListener(listener, this);

        size = cc.winSize;

        scoreLabel = new cc.LabelTTF("", "Arial", 20);
        scoreLabel.setAnchorPoint(0, 0);
        scoreLabel.setPosition(50, 400);
        this.addChild(scoreLabel, 8);

        bg1 = new cc.Sprite(res.bg_png);
        bg1.setAnchorPoint(0, 0);
        bg1.setPosition(0, 0);
        bg1.setScale(5, 5);
        this.addChild(bg1, 0);

        bg2 = new cc.Sprite(res.bg_png);
        bg2.setAnchorPoint(0, 0);
        bg2.setPosition(800, 0);
        bg2.setScale(5, 5);
        this.addChild(bg2, 0);

        for(var i = 0; i < 15; i++) {
          var block = new cc.Sprite(res.block_png);
          block.setPosition(i * 64 - 32, 32);
          block.setScale(2, 2);
          this.addChild(block, 1);
          bs.push(block);
          if(i === 14) {
            ice = new cc.Sprite(res.ice_png);
            ice.setPosition(block.getPosition().x + 64, 96);
            ice.setScale(2, 2);
            this.addChild(ice, 1);
          }
        }

        ball = new cc.Sprite(res.Circle_png);
        ball.setPosition(size.width/2, 128);
        ball.setScale(2, 2);
        this.addChild(ball, 1);

        return true;
    },
    update: function(dt) {

      ice.setPosition(ice.getPosition().x - 10, ice.getPosition().y);
      if(ice.getPosition().x < 0) {
        ice.setPosition(900, ice.getPosition().y);
      }

      for(var i = 0; i < bs.length; i++) {
        var b = bs[i];
        b.setPosition(b.getPosition().x - 10, b.getPosition().y);
      }
      var last = bs[bs.length-1];
      if(last.getPosition().x < 900) {
        var block = new cc.Sprite(res.block_png);
        block.setPosition(last.getPosition().x + 64, 32);
        block.setScale(2, 2);
        this.addChild(block, 1);
        bs.push(block);
      }

      bg1.setPosition(bg1.getPosition().x - 3, bg1.getPosition().y);
      bg2.setPosition(bg2.getPosition().x - 3, bg2.getPosition().y);
      if (bg1.getPosition().x < -780) {
        bg1.setPosition(800, 0);
      }
      if (bg2.getPosition().x < -780) {
        bg2.setPosition(800, 0);
      }

      var r = ball.getRotation();
      r += 10;
      ball.setRotation(r);

      score++;
      scoreLabel.setString("SCORE:" + score + " m ");

      var ballRect = ball.getBoundingBox();
      var iceRect = ice.getBoundingBox();

      if(cc.rectIntersectsRect(ballRect, iceRect)) {
        this.gameOver();
      }
    },
    gameOver: function() {

      this.unscheduleUpdate();

      cc.eventManager.removeAllListeners();

      var gameover = new cc.LabelTTF("Game Over!", "Arial", 50);
      gameover.setPosition(size.width/2, size.height/2);
      this.addChild(gameover, 10);

      var resetButton = new cc.MenuItemFont("Try again", this.onReset);
      resetButton.setFontSize(30);

      var menu = new cc.Menu(resetButton);
      menu.setPosition(800/2, 100);
      this.addChild(menu, 20);
    },
    onReset: function() {
      ball = null;
      scoreLabel = null;
      bg1 = null;
      bg2 = null;
      block1 = null;
      block2 = null;
      vSpeed = 0;
      ice = null;
      bs = [];
      score = 0;
      cc.director.runScene(new HelloWorldScene);
    },
});

var listener = new cc.EventListener.create({
    event:cc.EventListener.TOUCH_ONE_BY_ONE,
    onTouchBegan:function (touch, event) {
        var pos = ball.getPosition();
        if(pos.y <= 129) {
          var j = new cc.JumpBy(0.5, {x: 100, y: 0}, 250, 1);
          ball.runAction(new cc.Sequence(j, new cc.JumpBy(0.5, {x: -100, y: 0}, 100, 1)));
        }
        return true;
    },
});

var HelloWorldScene = cc.Scene.extend({
    onEnter:function () {
        this._super();
        gameLayer = new HelloWorldLayer();
        this.addChild(gameLayer);
    }
});
