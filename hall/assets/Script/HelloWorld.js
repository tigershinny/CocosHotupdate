const SubgameManager = require('SubgameManager');

cc.Class({
    extends: cc.Component,

    properties: {

        downloadBtn: {
            default: null,
            type: cc.Node
        },
        
        label: {
            default: null,
            type: cc.Label
        },
        // defaults, set visually when attaching this script to the Canvas
        text: 'Hello, World!'
    },

    // use this for initialization
    onLoad: function () {

        //     const hallGame = 'hall';

        // if (HallManager.isGameDownLoad(hallGame)) {
        //     //已下载，判断是否需要更新
        //     HallManager.needUpdateGame(hallGame, (success) => {
        //         if (success) {
        //             console.log("大厅游戏需要更新");
        //         } else {
        //             console.log("大厅游戏不需要更新");
        //         }
        //     }, () => {
        //         console.log('大厅游戏下载出错了');
        //     });
        // } else {
        //      HallManager.downloadGame(hallGame, (progress) => {
        //         if (isNaN(progress)) {
        //             progress = 0;
        //         }
        //         console.log("大厅资源下载中   " + parseInt(progress * 100) + "%");
        //     }, function(success) {
        //         console.log("大厅游戏下载成功！");
        //     });
        // }

        var name = 'flowergarden';  

        // if (cc.sys.OS_ANDROID == cc.sys.os) {
        //     name = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/GameNameProvider", "getName", "()Ljava/lang/String;");
        //     console.log("OS_ANDROID platform provides: " + name);
        // }  

        // if (cc.sys.OS_IOS == cc.sys.os) {
        //     name = jsb.reflection.callStaticMethod("GameNameProvider", "getName");
        //     console.log("OS_IOS platform provides: " + name);
            
        // }  

        //判断子游戏有没有下载
        if (SubgameManager.isSubgameDownLoad(name)) {
            //已下载，判断是否需要更新
            SubgameManager.needUpdateSubgame(name, (success) => {
                if (success) {
                    this.label.string = "子游戏需要更新";
                    console.log("子游戏需要更新");
                } else {
                    this.label.string = "子游戏不需要更新";
                    console.log("子游戏不需要更新");
                }
            }, () => {
                console.log('出错了');
            });
        } else {
            console.log("子游戏未下载");
            this.label.string = "子游戏未下载";
        }

        this.downloadBtn.on('click', () => {
            //下载子游戏/更新子游戏
            console.log("downloadBtn clicked");
            SubgameManager.downloadSubgame(name, (progress) => {
                if (isNaN(progress)) {
                    progress = 0;
                }
                this.label.string = "资源下载中   " + parseInt(progress * 100) + "%";
                console.log(this.label.string);
            }, function(success) {
                if (success) {
                    SubgameManager.enterSubgame(name);
                    console.log("进入子游戏");
                } else {
                    console.log('下载失败');
                }
            });
        }, this);
    },

    // called every frame
    update: function (dt) {

    },
});
