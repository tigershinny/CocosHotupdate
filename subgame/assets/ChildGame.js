cc.Class({
    extends: cc.Component,

    properties: {
        retButton: {
            default: null,
            type: cc.Node
        },
    },

    onLoad: function () {
        cc.find('Canvas/label').getComponent(cc.Label).string = '子游戏  Hello World!!'
        this.retButton.on('click', () => {
           this.datingclicked();
        }, this);
    },

    datingclicked: function () {
        console.log('========点击了返回大厅===================');
        cc.INGAME = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : '/') + "ALLGame/subgame";
        window.require(cc.INGAME+"/src/dating.js");
    }

});
