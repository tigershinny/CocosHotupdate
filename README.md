
工作中，需要把cocos creator创建的多个游戏适配到Android和ios应用中，经过调研，可以利用大厅子游戏模式实现。大厅本身作为一个游戏工程，可以有加载页面，和热加载子游戏。


热更新：
https://www.jianshu.com/p/9fc813fe9e4c

大厅子游戏：
https://www.jianshu.com/p/fe54ca980384

如何动态加载和更新子游戏：
自从jsb 3.0以来，可以用反射调用Android或者ios的代码：

```javascript
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

        var name = 'subgame';  

        if (cc.sys.OS_ANDROID == cc.sys.os) {
            name = jsb.reflection.callStaticMethod("org/cocos2dx/javascript/GameNameProvider", "getName", "()Ljava/lang/String;");
            console.log("OS_ANDROID platform provides: " + name);
        }  

        if (cc.sys.OS_IOS == cc.sys.os) {
            name = jsb.reflection.callStaticMethod("GameNameProvider", "getName");
            console.log("OS_IOS platform provides: " + name);
            
        }  

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

```

Android代码：
```java
package org.cocos2dx.javascript;

public class GameNameProvider {

    public static String getName() {
        return "subgame";
    }
}
```
iOS代码：
```
#import <Foundation/Foundation.h>

@interface GameNameProvider:NSObject {
}

+ (NSString *)getName;
@end
```

```objective-c
#import "GameNameProvider.h"
#import <Foundation/Foundation.h>

@implementation GameNameProvider

// request login
+ (NSString *) getName {
    return @"subgame";
}
@end
```

demo地址:
https://github.com/tigershinny/CocosHotupdate

