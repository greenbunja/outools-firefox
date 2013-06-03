var data = require("sdk/self").data;
var cm = require("sdk/context-menu");

var pageMod = require("sdk/page-mod");
var self = require("sdk/self");
var ss = require("simple-storage");
var tabs = require("sdk/tabs");

var workers = [];

pageMod.PageMod({
	include: "*",
	contentScriptFile: [data.url("jquery.js"),
						data.url("contents/all.js")],
	onAttach: function(worker) {
		var dblclickEnable = ss.storage.dblclickEnable;
		if (dblclickEnable == undefined) {
		    ss.storage.dblclickEnable =  {"ou": true, "every": false};
		    return;
		}

		if (dblclickEnable) {
			worker.port.emit('addEvent');		    
		}
	},
	contentScriptWhen: "end"
});

pageMod.PageMod({
	include: "http://todayhumor.co.kr*",
	contentScriptFile: [data.url("jquery.js"),
						data.url("contents/ou.js")],
	contentStyleFile: self.data.url("contents/ou.css"),
	onAttach: function(worker) {
		worker.port.emit('getData', ss.storage);
		worker.port.on('setStorages', function(items) {
			for (var key in items) {
				ss.storage[key] = items[key];
			}
		});
	},
	contentScriptWhen: "end"
});

pageMod.PageMod({
	include: "http://todayhumor.co.kr/board/view.php*",
	contentScriptFile: [data.url("jquery.js"),
						data.url("functions/reset_jjals.js"),
						data.url("contents/view.js")],
	contentStyleFile: self.data.url("contents/view.css"),
	onAttach: function(worker) {
        workers.push(worker);
        worker.on('detach', function() {
            var index = workers.indexOf(worker);
            if (index >= 0) {
                workers.splice(index, 1);
            }
        });

		worker.port.emit('getData', {'storage': ss.storage, 'xbutton': self.data.url('images/xbutton.png')});
		worker.port.on('setStorages', function(items) {
			for (var key in items) {
				ss.storage[key] = items[key];
			}
		});
		worker.port.on('resetJjals', function() {
			worker.port.emit('resetedJjals', resetJjals());
		});
	},
	contentScriptWhen: "end"
});

pageMod.PageMod({
	include: "http://todayhumor.co.kr/board/list.php*",
	contentScriptFile: [data.url("jquery.js"),
						data.url("contents/list.js")],
	onAttach: function(worker) {
		worker.port.emit('getData', ss.storage);
		worker.port.on('setStorages', function(items) {
			for (var key in items) {
				ss.storage[key] = items[key];
			}
		});
	},
	contentScriptWhen: "end"
});

pageMod.PageMod({
	include: ["http://todayhumor.co.kr/board/write.php*",
        	  "http://todayhumor.co.kr/board/modify.php*"],
	contentScriptFile: [data.url("jquery.js"),
						data.url("contents/write.js")],
	onAttach: function(worker) {
		worker.port.emit('getData', {'storage': ss.storage});
		worker.port.on('setStorages', function(items) {
			for (var key in items) {
				ss.storage[key] = items[key];
			}
		});
	},
	contentScriptWhen: "end"
});

pageMod.PageMod({
	include: [self.data.url("options/options.html*")],
	contentScriptFile: [self.data.url("jquery.js"),
						self.data.url("options/options.js")],
	onAttach: function(worker) {
		worker.port.emit('getStorages', ss.storage);
		worker.port.on('setStorages', function(items) {
			for (var key in items) {
				ss.storage[key] = items[key];
			}
		});
	},
	contentScriptWhen: "end"
});

pageMod.PageMod({
	include: [self.data.url("options/jjals_options.html*")],
	contentScriptFile: [self.data.url("jquery.js"),
						self.data.url("functions/reset_jjals.js"),
						self.data.url("options/jjals_options.js")],
	onAttach: function(worker) {
		worker.port.emit('getStorages', ss.storage);
		worker.port.on('setStorages', function(items) {
			for (var key in items) {
				ss.storage[key] = items[key];
			}
		});
		worker.port.on('resetJjals', function() {
			worker.port.emit('resetedJjals', resetJjals());
		});
	},
	contentScriptWhen: "end"
});

pageMod.PageMod({
	include: "http://www.ilbe.com*",
	contentScriptFile: [self.data.url("jquery.js"),
						self.data.url("contents/ilbe.js")],
	contentStyleFile: self.data.url("contents/ilbe.css"),
	onAttach: function(worker) {
		var blockIlbe = ss.storage.blockIlbe;
		if (blockIlbe == undefined) {
		    ss.storage.blockIlbe =  false;
		    return;
		}

		if (blockIlbe) {
			worker.port.emit('block');		    
		}
	},
	contentScriptWhen: "end"
});




var addToJjals = cm.Item({
	context: cm.SelectorContext("img"),
 	label: "자주쓰는짤에 추가",
	contentScript: 'self.on("click", function(node) {' +
	  			   '	self.postMessage(node.src);' +
	  			   '    alert("추가 되었습니다.");' +
	               '});',

	onMessage: function (src) {
		var jjals = ss.storage.jjals;

		if (ss.storage.jjals == undefined) {
		    jjals = resetJjals();
		}

		jjals.unshift(src);
		ss.storage.jjals = jjals;
	}
});
var addToBookmark = cm.Item({
 	label: "오유북마크에 현재페이지 추가",
 	contentScriptFile: data.url('jquery.js'),
	contentScript: 'self.on("click", function() {' +
				   '	var url = document.URL;' +
	  			   ' 	var name;' +
	  			   '    do {' +
	  			   '		name = prompt("북마크 이름을 입력해주세요", document.title);' +
				   '		if (name == null) {' +
				   '			return;' +
				   '        }' +
				   '	} while ($.trim(name) == "")' +
				   '	self.postMessage({"url": url, "name": name});' +
	  			   '    alert("추가 되었습니다.");' +
	               '});',

	onMessage: function(data) {
		var name = data.name;
		var url = data.url;
		console.log(name + url);
		var bookmarks = ss.storage.bookmarks;
		if (bookmarks == undefined) {
		    bookmarks = [];
		}
		bookmarks.push({"name": name, "url": url});
		ss.storage.bookmarks = bookmarks;
	}
});
var addLinkToBookmark = cm.Item({
 	label: "오유북마크에 링크주소 추가",
	context: cm.SelectorContext("a"),
 	contentScriptFile: data.url('jquery.js'),
	contentScript: 'self.on("click", function(node) {' +
				   '	var url = node.href;' +
	  			   ' 	var name;' +
	  			   '    do {' +
	  			   '		name = prompt("북마크 이름을 입력해주세요");' +
				   '		if (name == null) {' +
				   '			return;' +
				   '        }' +
				   '	} while ($.trim(name) == "")' +
				   '	self.postMessage({"url": url, "name": name});' +
	  			   '    alert("추가 되었습니다.");' +
	               '});',

	onMessage: function(data) {
		var name = data.name;
		var url = data.url;
		console.log(name + url);
		var bookmarks = ss.storage.bookmarks;
		if (bookmarks == undefined) {
		    bookmarks = [];
		}
		bookmarks.push({"name": name, "url": url});
		ss.storage.bookmarks = bookmarks;
	}
});
var offBGMs = cm.Item({
 	label: "이글의 BGM 제거",
	context: cm.URLContext("http://todayhumor.co.kr/board/view.php?*"),
	contentScript: 'self.on("click", function() {' +
				   '	self.postMessage();' +
	               '});',
	onMessage: function() {
		for (var i = workers.length - 1; i >= 0; i--) {
			if (workers[i].tab.index == tabs.activeTab.index) {
				workers[i].port.emit('offBGMs');				    
			}
		}
	}
});
var toggleBGMs = cm.Item({
 	label: "모든글에서 BGM 자동제거",
	contentScript: 'self.on("click", function() {' +
				   '	self.postMessage();' +
	               '});',
	onMessage: function() {
		if (!ss.storage.offBGMs) {
			ss.storage.offBGMs = true;
			for (var i = workers.length - 1; i >= 0; i--) {
				workers[i].port.emit('offBGMs');				    
			}
			this.label = "모든글에서 BGM 자동제거 해제";
		} else {
			ss.storage.offBGMs = false;
			this.label = "모든글에서 BGM 자동제거";
		}
	}
});
if (ss.storage.offBGMs) {
	toggleBGMs.label = "모든글에서 BGM 자동제거 해제";    
}

var lottery = cm.Item({
 	label: "당첨자 추첨",
	context: cm.URLContext("http://todayhumor.co.kr/board/view.php?*"),
	contentScript: 'self.on("click", function() {' +
				   '	self.postMessage();' +
	               '});',
	onMessage: function() {
		for (var i = workers.length - 1; i >= 0; i--) {
			if (workers[i].tab.index == tabs.activeTab.index) {
				workers[i].port.emit('lottery');				    
			}
		}
	}
});

var removeStyle = cm.Item({
 	label: "이글의 배경 없애기",
	context: cm.URLContext("http://todayhumor.co.kr/board/view.php?*"),
	contentScript: 'self.on("click", function() {' +
				   '	self.postMessage();' +
	               '});',
	onMessage: function() {
		for (var i = workers.length - 1; i >= 0; i--) {
			if (workers[i].tab.index == tabs.activeTab.index) {
				workers[i].port.emit('removeStyle');				    
			}
		}
	}
});
var options = cm.Item({
	label: "옵션",
	contentScript: 'self.on("click", function () {' +
	  			   '	self.postMessage()' +
                   '});',

	onMessage: function () {
		tabs.open(self.data.url("options/options.html"));
	}
});

var contextMenu = cm.Menu({
	label: "OU Tools",
	context: cm.SelectorContext('*'),
	image: data.url("images/icon16.png"),
	items: [addToBookmark, addLinkToBookmark, cm.Separator(),
			offBGMs, toggleBGMs, cm.Separator(),
			addToJjals, lottery, removeStyle, cm.Separator(), options]
});




function resetJjals()
{
	var defaultJjals = ['http://i.imgur.com/cn7QOaW.png', 'http://i.imgur.com/OiBRlw9.png',
						'http://i.imgur.com/209M28V.png', 'http://i.imgur.com/f6z4ZJb.png',
						'http://i.imgur.com/vFBgCih.png', 'http://i.imgur.com/pHXQMOV.png',
						'http://i.imgur.com/keXmiA3.png', 'http://i.imgur.com/LZu0BTJ.png',
						'http://i.imgur.com/rVZ6e6T.png', 'http://i.imgur.com/1vS8Cds.png',
						'http://i.imgur.com/DVpSJdk.png', 'http://i.imgur.com/BnGNj7p.png',
						'http://i.imgur.com/sUfc1RA.png', 'http://i.imgur.com/whDkOfU.png',
						'http://i.imgur.com/f4d02yK.png', 'http://i.imgur.com/OPKvJEs.png',
						'http://i.imgur.com/z54kM2q.png', 'http://i.imgur.com/k90QIBV.png',
						'http://i.imgur.com/dYSEPNb.png', 'http://i.imgur.com/51adQbx.png',
						'http://i.imgur.com/QHGxXJS.png', 'http://i.imgur.com/Be7G3d0.png',
						'http://i.imgur.com/zaNVKo2.png', 'http://i.imgur.com/MZpQdPD.png',
						'http://i.imgur.com/Q3oNbEy.png', 'http://i.imgur.com/m38yL7v.png',
						'http://i.imgur.com/SukljFr.png', 'http://i.imgur.com/01UqUQU.png',
						'http://i.imgur.com/vtzKdJy.png', 'http://i.imgur.com/wkaX2VL.png',
						'http://i.imgur.com/7lHYvqN.png', 'http://i.imgur.com/8ruvQa9.png',
						'http://i.imgur.com/7SMhWTj.png', 'http://i.imgur.com/vJSJQz1.png',
						'http://i.imgur.com/a7d6JVC.png', 'http://i.imgur.com/mJkHPTi.png',
						'http://i.imgur.com/JzDGrvL.png', 'http://i.imgur.com/DJIqw4H.png',
						'http://i.imgur.com/e7I2gYC.png', 'http://i.imgur.com/54lSFdJ.png',
						'http://i.imgur.com/oCndH3h.png', 'http://i.imgur.com/mjTFXoL.png',
						'http://i.imgur.com/wgao0R8.jpg', 'http://i.imgur.com/k8mB0ms.png',
						'http://i.imgur.com/JBDnA0h.png', 'http://i.imgur.com/nc2sKjO.png',
						'http://i.imgur.com/KKzUkpY.png', 'http://i.imgur.com/VawZh8T.png',
						'http://i.imgur.com/i1C0vDj.png', 'http://i.imgur.com/9qwf0Fb.png',
						'http://i.imgur.com/d9Kfc4X.png', 'http://i.imgur.com/34GAAFj.jpg',
						'http://i.imgur.com/h0qhAT6.png', 'http://i.imgur.com/PMa6KUs.png',
						'http://i.imgur.com/SBemsD4.png', 'http://i.imgur.com/XKcScn6.png',
						'http://i.imgur.com/cRpXgbP.png', 'http://i.imgur.com/CgjMPnh.png',
						'http://i.imgur.com/qC9GwgE.png', 'http://i.imgur.com/pv0LySM.png',
						'http://i.imgur.com/rgHoQoS.png', 'http://i.imgur.com/qZbIeoe.png',
						'http://i.imgur.com/gfXEqe9.png', 'http://i.imgur.com/taSiLzk.png',
						'http://i.imgur.com/YB4fxcK.png', 'http://i.imgur.com/kFAOb5m.png',
						'http://i.imgur.com/5XnWfLZ.png', 'http://i.imgur.com/enLoyWR.png',
						'http://i.imgur.com/KHQe86E.png', 'http://i.imgur.com/FPCsToA.png',
						'http://i.imgur.com/3PduKPm.png',
						'http://i.imgur.com/DwLyhvU.png', 'http://i.imgur.com/NQLniV9.png',
						'http://i.imgur.com/ZBLswRI.png', 'http://i.imgur.com/hITMJDh.png',
						'http://i.imgur.com/gfUYqJA.png', 'http://i.imgur.com/mrpAO0c.png',
						'http://i.imgur.com/SrIXRcM.png'];

    var jjals = ss.storage.jjals;

	if (jjals == undefined || jjals.length == 0) {
		ss.storage.jjals = defaultJjals;
	    return defaultJjals;
	}

	for (var i = 0; i < defaultJjals.length; i++) {
		if (jjals.indexOf(defaultJjals[i]) == -1) {
		    jjals.push(defaultJjals[i]);
		}
	};

	ss.storage.jjals = jjals;
	return jjals;
}