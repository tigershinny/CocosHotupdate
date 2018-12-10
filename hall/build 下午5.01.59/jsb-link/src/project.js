window.__require = function e(s, a, t) {
function n(l, o) {
if (!a[l]) {
if (!s[l]) {
var c = l.split("/");
c = c[c.length - 1];
if (!s[c]) {
var r = "function" == typeof __require && __require;
if (!o && r) return r(c, !0);
if (i) return i(c, !0);
throw new Error("Cannot find module '" + l + "'");
}
}
var b = a[l] = {
exports: {}
};
s[l][0].call(b.exports, function(e) {
return n(s[l][1][e] || e);
}, b, b.exports, e, s, a, t);
}
return a[l].exports;
}
for (var i = "function" == typeof __require && __require, l = 0; l < t.length; l++) n(t[l]);
return n;
}({
HallManager: [ function(e, s, a) {
"use strict";
cc._RF.push(s, "a7acbLEcFpKRraHnQE8+TYY", "HallManager");
var t = {
_storagePath: [],
_getfiles: function(e, s, a, t) {
this._storagePath[e] = jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/";
this._downloadCallback = a;
this._finishCallback = t;
this._fileName = e;
var n = "http://192.168.58.72:8000/" + e + "/remote-assets", i = this._storagePath[e] + "/project.manifest", l = JSON.stringify({
packageUrl: n,
remoteManifestUrl: n + "/project.manifest",
remoteVersionUrl: n + "/version.manifest",
version: "1.0.1",
assets: {},
searchPaths: []
});
this._am = new jsb.AssetsManager("", this._storagePath[e], function(e, s) {
for (var a = e.split("."), t = s.split("."), n = 0; n < a.length; ++n) {
var i = parseInt(a[n]), l = parseInt(t[n] || 0);
if (i !== l) return i - l;
}
return t.length > a.length ? -1 : 0;
});
this._am.setVerifyCallback(function(e, s) {
s.compressed;
return !0;
});
cc.sys.os === cc.sys.OS_ANDROID && this._am.setMaxConcurrentTask(2);
1 === s ? this._am.setEventCallback(this._updateCb.bind(this)) : 2 == s ? this._am.setEventCallback(this._checkCb.bind(this)) : this._am.setEventCallback(this._needUpdate.bind(this));
if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
var o = new jsb.Manifest(l, this._storagePath[e]);
this._am.loadLocalManifest(o, this._storagePath[e]);
}
if (1 === s) {
this._am.update();
this._failCount = 0;
} else this._am.checkUpdate();
this._updating = !0;
console.log("更新文件:" + i);
},
_updateCb: function(e) {
var s = !1;
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
console.log("updateCb本地没有配置文件");
s = !0;
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
console.log("updateCb下载配置文件错误");
s = !0;
break;

case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
console.log("updateCb解析文件错误");
s = !0;
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
console.log("updateCb发现新的更新");
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
console.log("updateCb已经是最新的");
s = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
this._downloadCallback && this._downloadCallback(e.getPercentByFile());
break;

case jsb.EventAssetsManager.ASSET_UPDATED:
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
console.log("updateCb更新错误");
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
this._finishCallback && this._finishCallback(!0);
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
this._failCount++;
if (this._failCount <= 3) {
this._am.downloadFailedAssets();
console.log("updateCb更新失败" + this._failCount + " 次");
} else {
console.log("updateCb失败次数过多");
this._failCount = 0;
s = !0;
this._updating = !1;
}
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
console.log("updateCb解压失败");
}
if (s) {
_am.setEventCallback(null);
this._updating = !1;
this._finishCallback && this._finishCallback(!1);
}
},
_checkCb: function(e) {
var s = !1;
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
console.log("checkCb本地没有配置文件");
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
console.log("checkCb下载配置文件错误");
s = !0;
break;

case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
console.log("checkCb解析文件错误");
s = !0;
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
this._getfiles(this._fileName, 1, this._downloadCallback, this._finishCallback);
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
console.log("checkCb已经是最新的");
this._finishCallback && this._finishCallback(!0);
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
case jsb.EventAssetsManager.ASSET_UPDATED:
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
console.log("checkCb更新错误");
s = !0;
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
console.log("checkCb更新完成");
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
console.log("checkCb更新失败");
s = !0;
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
console.log("checkCb解压失败");
}
this._updating = !1;
s && this._finishCallback && this._finishCallback(!1);
},
_needUpdate: function(e) {
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
console.log("子游戏已经是最新的，不需要更新");
this._finishCallback && this._finishCallback(!1);
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
console.log("子游戏需要更新");
this._finishCallback && this._finishCallback(!0);
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
case jsb.EventAssetsManager.ERROR_UPDATING:
case jsb.EventAssetsManager.UPDATE_FAILED:
this._downloadCallback();
}
},
downloadGame: function(e, s, a) {
this._getfiles(e, 2, s, a);
},
enterGame: function(e) {
if (this._storagePath[e]) {
console.log("enterGame: require " + this._storagePath[e] + "/src/main.js");
window.require(this._storagePath[e] + "/src/main.js");
} else this.downloadGame(e);
},
isGameDownLoad: function(e) {
var s = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "ALLGame/" + e + "/project.manifest";
return !!jsb.fileUtils.isFileExist(s);
},
needUpdateGame: function(e, s, a) {
this._getfiles(e, 3, a, s);
}
};
s.exports = t;
cc._RF.pop();
}, {} ],
HelloWorld: [ function(e, s, a) {
"use strict";
cc._RF.push(s, "280c3rsZJJKnZ9RqbALVwtK", "HelloWorld");
var t = e("SubgameManager");
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
text: "Hello, World!"
},
onLoad: function() {
var e = this, s = "flowergarden";
if (t.isSubgameDownLoad(s)) t.needUpdateSubgame(s, function(s) {
if (s) {
e.label.string = "子游戏需要更新";
console.log("子游戏需要更新");
} else {
e.label.string = "子游戏不需要更新";
console.log("子游戏不需要更新");
}
}, function() {
console.log("出错了");
}); else {
console.log("子游戏未下载");
this.label.string = "子游戏未下载";
}
this.downloadBtn.on("click", function() {
console.log("downloadBtn clicked");
t.downloadSubgame(s, function(s) {
isNaN(s) && (s = 0);
e.label.string = "资源下载中   " + parseInt(100 * s) + "%";
console.log(e.label.string);
}, function(e) {
if (e) {
t.enterSubgame("subgame");
console.log("进入子游戏");
} else console.log("下载失败");
});
}, this);
},
update: function(e) {}
});
cc._RF.pop();
}, {
SubgameManager: "SubgameManager"
} ],
SubgameManager: [ function(e, s, a) {
"use strict";
cc._RF.push(s, "f0c9eaTHHJAw58tnxWTjsF/", "SubgameManager");
var t = {
_storagePath: [],
_getfiles: function(e, s, a, t) {
this._storagePath[e] = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "ALLGame/" + e;
this._downloadCallback = a;
this._finishCallback = t;
this._fileName = e;
var n = "http://192.168.58.72:8000/" + e + "/remote-assets", i = this._storagePath[e] + "/project.manifest", l = JSON.stringify({
packageUrl: n,
remoteManifestUrl: n + "/project.manifest",
remoteVersionUrl: n + "/version.manifest",
version: "1.0.1",
assets: {},
searchPaths: []
});
this._am = new jsb.AssetsManager("", this._storagePath[e], function(e, s) {
for (var a = e.split("."), t = s.split("."), n = 0; n < a.length; ++n) {
var i = parseInt(a[n]), l = parseInt(t[n] || 0);
if (i !== l) return i - l;
}
return t.length > a.length ? -1 : 0;
});
this._am.setVerifyCallback(function(e, s) {
s.compressed;
return !0;
});
cc.sys.os === cc.sys.OS_ANDROID && this._am.setMaxConcurrentTask(2);
1 === s ? this._am.setEventCallback(this._updateCb.bind(this)) : 2 == s ? this._am.setEventCallback(this._checkCb.bind(this)) : this._am.setEventCallback(this._needUpdate.bind(this));
if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
var o = new jsb.Manifest(l, this._storagePath[e]);
this._am.loadLocalManifest(o, this._storagePath[e]);
}
if (1 === s) {
this._am.update();
this._failCount = 0;
} else this._am.checkUpdate();
this._updating = !0;
console.log("更新文件:" + i);
},
_updateCb: function(e) {
var s = !1;
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
console.log("updateCb本地没有配置文件");
s = !0;
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
console.log("updateCb下载配置文件错误");
s = !0;
break;

case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
console.log("updateCb解析文件错误");
s = !0;
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
console.log("updateCb发现新的更新");
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
console.log("updateCb已经是最新的");
s = !0;
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
this._downloadCallback && this._downloadCallback(e.getPercentByFile());
break;

case jsb.EventAssetsManager.ASSET_UPDATED:
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
console.log("updateCb更新错误");
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
this._finishCallback && this._finishCallback(!0);
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
this._failCount++;
if (this._failCount <= 3) {
this._am.downloadFailedAssets();
console.log("updateCb更新失败" + this._failCount + " 次");
} else {
console.log("updateCb失败次数过多");
this._failCount = 0;
s = !0;
this._updating = !1;
}
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
console.log("updateCb解压失败");
}
if (s) {
_am.setEventCallback(null);
this._updating = !1;
this._finishCallback && this._finishCallback(!1);
}
},
_checkCb: function(e) {
var s = !1;
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
console.log("checkCb本地没有配置文件");
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
console.log("checkCb下载配置文件错误");
s = !0;
break;

case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
console.log("checkCb解析文件错误");
s = !0;
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
this._getfiles(this._fileName, 1, this._downloadCallback, this._finishCallback);
break;

case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
console.log("checkCb已经是最新的");
this._finishCallback && this._finishCallback(!0);
break;

case jsb.EventAssetsManager.UPDATE_PROGRESSION:
case jsb.EventAssetsManager.ASSET_UPDATED:
break;

case jsb.EventAssetsManager.ERROR_UPDATING:
console.log("checkCb更新错误");
s = !0;
break;

case jsb.EventAssetsManager.UPDATE_FINISHED:
console.log("checkCb更新完成");
break;

case jsb.EventAssetsManager.UPDATE_FAILED:
console.log("checkCb更新失败");
s = !0;
break;

case jsb.EventAssetsManager.ERROR_DECOMPRESS:
console.log("checkCb解压失败");
}
this._updating = !1;
s && this._finishCallback && this._finishCallback(!1);
},
_needUpdate: function(e) {
switch (e.getEventCode()) {
case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
console.log("子游戏已经是最新的，不需要更新");
this._finishCallback && this._finishCallback(!1);
break;

case jsb.EventAssetsManager.NEW_VERSION_FOUND:
console.log("子游戏需要更新");
this._finishCallback && this._finishCallback(!0);
break;

case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
case jsb.EventAssetsManager.ERROR_UPDATING:
case jsb.EventAssetsManager.UPDATE_FAILED:
this._downloadCallback();
}
},
downloadSubgame: function(e, s, a) {
this._getfiles(e, 2, s, a);
},
enterSubgame: function(e) {
if (this._storagePath[e]) {
console.log("enterSubgame: require " + this._storagePath[e] + "/src/main.js");
window.require(this._storagePath[e] + "/src/main.js");
} else this.downloadSubgame(e);
},
isSubgameDownLoad: function(e) {
var s = (jsb.fileUtils ? jsb.fileUtils.getWritablePath() : "/") + "ALLGame/" + e + "/project.manifest";
return !!jsb.fileUtils.isFileExist(s);
},
needUpdateSubgame: function(e, s, a) {
this._getfiles(e, 3, a, s);
}
};
s.exports = t;
cc._RF.pop();
}, {} ]
}, {}, [ "HallManager", "HelloWorld", "SubgameManager" ]);