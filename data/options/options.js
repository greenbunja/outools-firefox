// 표
self.port.on("getStorages", function(storage) {
	function setStorages(items)
	{
		for (var key in items) {
			storage[key] = items[key];
		}
		self.port.emit("setStorages", items);
	}

	function showUsermemosTable()
	{
		var usermemos = storage.usermemos;

		if ($.isEmptyObject(usermemos)) {
		    $("#MemosTableDiv").text("회원메모가 존재하지 않습니다.");
		    return;
		}

		var table = document.getElementById("MemosTableDiv").appendChild(document.createElement("table"));

		var row = table.appendChild(document.createElement("thead"))
					   .appendChild(document.createElement("tr"));


		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("회원이름"));
		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("메모내용"));
		row.appendChild(document.createElement("th"));

		var tbody = table.appendChild(document.createElement("tbody"));

		for (var usernum in usermemos) {
			var row = tbody.appendChild(document.createElement("tr"));

			var user = row.appendChild(document.createElement("td"))
				    	  .appendChild(document.createElement("a"));


			var userpage = "http://todayhumor.co.kr/board/list.php?kind=member&mn=" + usernum;

  			user.href = userpage;
			user.target = "_blank";
			user.appendChild(document.createTextNode(usermemos[usernum].username));
			var memo = row.appendChild(document.createElement("td"))
						  .appendChild(document.createElement("input"));

			memo.value = usermemos[usernum].memo;
			memo.name = usernum;
			  
			var deleteButton = row.appendChild(document.createElement("td"))
			   		 	    	  .appendChild(document.createElement("a"));
			deleteButton = $(deleteButton);
			deleteButton.attr("href", 'javascript:;')
						.attr("usernum", usernum)
						.text("삭제")
						.click(function() {
				if (!confirm("정말로 삭제하시겠습니까?")) {
				    return
				}

				var usernum = $(this).attr("usernum");	
				var usermemos = storage.usermemos;

				delete usermemos[usernum];
				setStorages({"usermemos": usermemos});

				location.reload();
			});
		}

		$("#editMemos").append('<input type="submit" id="saveMemo" value="변경 저장">');
	}

	function showBlockedUsersTable()
	{
		var blockedUsers = storage.blockedUsers;

		if (blockedUsers == undefined || blockedUsers.length == 0) {
		    $("#BlockedUsersTableDiv").text("차단된 회원이 없습니다.");
		    return;
		}

		blockedUsers.sort(function(a, b) {
			aPart = a.ip.split('.');
			bPart = b.ip.split('.');

			aFirstPart = parseInt(aPart[0]);
			bFirstPart = parseInt(bPart[0]);

			if (aFirstPart == null || bFirstPart == null) {
			    return;
			}

			if (aFirstPart != bFirstPart) {
			    return aFirstPart - bFirstPart;
			}

			aSecondPart = parseInt(aPart[1]);
			bSecondPart = parseInt(bPart[1]);

			if (aSecondPart == null || bSecondPart == null) {
			    return;
			}

			if (aSecondPart != bSecondPart) {
				return aSecondPart - bSecondPart;			    
			}

			aFourthPart = parseInt(aPart[3]);
			bFourthPart = parseInt(bPart[3]);

			if (aFourthPart == null || bFourthPart == null) {
			    return;
			}

			return aFourthPart - bFourthPart;			    
		});

		setStorages({"blockedUsers": blockedUsers});

		var table = document.getElementById("BlockedUsersTableDiv").appendChild(document.createElement("table"));


		var row = table.appendChild(document.createElement("thead"))
					   .appendChild(document.createElement("tr"));


		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("회원이름"));
		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("IP"));
		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("차단사유"));
		row.appendChild(document.createElement("th"));

		var tbody = table.appendChild(document.createElement("tbody"));

		for (var i = 0; i < blockedUsers.length ; i++) {
			blocked = blockedUsers[i];
			var row = tbody.appendChild(document.createElement("tr"));

			if (blocked.username == "") {
				row.appendChild(document.createElement("td"))
				   .appendChild(document.createTextNode("비회원"));
			} else {
				var user = row.appendChild(document.createElement("td"))
					    	  .appendChild(document.createElement("a"));

				var userpage = "http://todayhumor.co.kr/board/list.php?kind=member&mn=" + blocked.usernum;
				user.href = userpage;
				user.target = "_blank";
				user.appendChild(document.createTextNode(blocked.username));
			}

			row.appendChild(document.createElement("td"))
 			   .appendChild(document.createTextNode(blocked.ip));

			var memoInput = row.appendChild(document.createElement("td"))
							   .appendChild(document.createElement("input"));

			memoInput.type = "text";
			memoInput.name = "BlockedMemo"

			if (blocked.memo) {
			    memoInput.value = blocked.memo;
			}
			var deleteButton = row.appendChild(document.createElement("td"))
			   		 	    	  .appendChild(document.createElement("a"));
			deleteButton = $(deleteButton);
			deleteButton.attr("href", 'javascript:;')
						.attr("index", i)
						.text("삭제")
						.click(function() {
				if (!confirm("정말로 삭제하시겠습니까?")) {
				    return
				}

				var index = $(this).attr("index");

				var blockedUsers = storage.blockedUsers;

				blockedUsers.splice(index, 1);

				setStorages({"blockedUsers": blockedUsers});

				location.reload();
			});
		}

		$("#editBlocked").append('<input type="submit" id="saveBlocked" value="변경 저장">');
	}

	function showSavedTextsTable() {
		var savedTexts = storage.savedTexts;

		if (savedTexts == undefined || savedTexts.length == 0) {
		    $("#SavedTextsTableDiv").text("임시저장된 글이 없습니다.");
		    return;
		} 

		var table = document.getElementById("SavedTextsTableDiv").appendChild(document.createElement("table"));


		var row = table.appendChild(document.createElement("thead"))
					   .appendChild(document.createElement("tr"));


		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("제목"));
		row.appendChild(document.createElement("th"))
		   .appendChild(document.createTextNode("날짜"));
		row.appendChild(document.createElement("th"));

		var tbody = table.appendChild(document.createElement("tbody"));

		for (var i = 0; i < savedTexts.length ; i++) {
			var savedText = savedTexts[i];

			var row = tbody.appendChild(document.createElement("tr"));

			var text = row.appendChild(document.createElement("td"))
				    	  .appendChild(document.createElement("a"));
			text.href = "javascript:;";
			$(text).click({text: savedText.text}, function(event) {
				var html = '<textarea autofocus style="width:100%;height:100%" onfocus="this.select()">' +
						   event.data.text + '</textarea>';
				window.open("data:text/html," + encodeURIComponent(html), '', "width=500px, height=500px");
			});
			
			if ($.trim(savedText.subject) == "") {
			    savedText.subject = "[무제]";
			}

			text.appendChild(document.createTextNode(savedText.subject));

			row.appendChild(document.createElement("td"))
			   .appendChild(document.createTextNode(savedText.date));

			  
			var deleteButton = row.appendChild(document.createElement("td"))
			   		 	    	  .appendChild(document.createElement("a"));
			deleteButton = $(deleteButton);
			deleteButton.attr("href", 'javascript:;')
						.attr("index", i)
						.text("삭제")
						.click(function() {
				if (!confirm("정말로 삭제하시겠습니까?")) {
				    return
				}

				var index = $(this).attr("index");

				var savedTexts = storage.savedTexts;

				savedTexts.splice(index, 1);				

				setStorages({"savedTexts": savedTexts});

				location.reload();
			});
		}
	}

	function showBookmarksTable()
	{
		var bookmarks = storage.bookmarks;

		if ($.isEmptyObject(bookmarks)) {
		    $("#bookmarks_div").text("북마크가 없습니다.");
		    return;
		}

		var table = document.getElementById("bookmarks_div").appendChild(document.createElement("table"));

		table.id = "bookmarks_table";

		var row = table.appendChild(document.createElement("thead"))
					   .appendChild(document.createElement("tr"));

		$(row).append("<th>번호</th>")
			  .append("<th>이름</th>")
			  .append("<th>주소</th>")
			  .append("<th></th>");

		var tbody = table.appendChild(document.createElement("tbody"));

		for (var i = 0; i < bookmarks.length; i++) {
			var bookmark = bookmarks[i];

			var row = tbody.appendChild(document.createElement("tr"));

			$('<input></input>')
			.val(i + 1)
			.attr("size", "3")
			.addClass("bookmark_num_input")
			.appendTo($('<td></td>').appendTo(row));

			$('<input></input>')
			.val(bookmark.name)
			.attr("size", "15")
			.addClass("bookmark_name_input")
			.appendTo($('<td></td>').appendTo(row));

			$('<input></input>')
			.val(bookmark.url)
			.attr("size", "60")
			.addClass("bookmark_url_input")
			.appendTo($('<td></td>').appendTo(row));

			$('<a></a>')
			.attr("href", "javascript:;")
			.attr("index", i)
			.text("삭제")
			.appendTo($('<td></td>').appendTo(row))
			.click(function() {
				if (!confirm("정말로 삭제하시겠습니까?")) {
				    return
				}

				var index = $(this).attr("index");

				var bookmarks = storage.bookmarks;

				bookmarks.splice(index, 1);				

				setStorages({"bookmarks": bookmarks});

				location.reload();
			});
		}

		$('<input></input>')
		.attr("type", "submit")
		.val("변경저장")
		.appendTo("#edit_bookmarks_num");
	}

	$("#editMemos").submit(function() {
		var elements = this.elements;

	 	var usermemos = storage.usermemos;
		for (var i = 0; i < elements.length; i++) {
			var memoInput = elements[i];
			var memo = memoInput.value;

			if (memoInput.type != "text") {
			    continue;
			}

			usermemos[memoInput.name].memo = memo;
		}

		setStorages({"usermemos": usermemos});

		alert("저장 되었습니다.");
	});

	$("#editBlocked").submit(function() {
		var elements = this.elements;

	 	var blockedUsers = storage.blockedUsers;
		for (var i = 0; i < elements.length; i++) {
			var memoInput = elements[i];
			var memo = memoInput.value;

			if (memoInput.type != "text") {
			    continue;
			}

			blockedUsers[i].memo = memo;
		}

		setStorages({"blockedUsers": blockedUsers});

		alert("저장 되었습니다.");
	});

	$("#editOptions").submit(function() {
		var interval = parseInt(this.interval.value);
		if (isNaN(interval)) {
		    alert("자동저장 간격이 숫자가 아닙니다.")
		    return;
		}
		var bestReplyEnable = this.bestReplyEnable.checked;
		var blockEnable = this.blockEnable.checked;
		var memoEnable = this.memoEnable.checked;
		var dblclickEnable = {"ou": this.dblclick_ou.checked, "every": this.dblclick_every.checked};
		var bookmarkEnable = this.bookmark_enable.checked;
		var shortcutEnable = this.shortcut_enable.checked;
		var blockIlbe = this.block_ilbe.checked;
		var styleRemoveEnable = this.style_remove_enable.checked;
		var remoconEnable = this.remocon_enable.checked;
		var jjalsEnable = this.jjals_enable.checked;
		var savetextEnable = this.savetext_enable.checked;

		setStorages({"AutosaveInterval": interval,
					 "bestReplyEnable": bestReplyEnable,
					 "blockEnable": blockEnable,
					 "memoEnable": memoEnable,
					 "dblclickEnable": dblclickEnable,
					 "bookmarkEnable": bookmarkEnable,
					 "shortcutEnable": shortcutEnable,
					 "blockIlbe": blockIlbe,
					 "styleRemoveEnable": styleRemoveEnable,
					 "remoconEnable": remoconEnable,
					 "jjalsEnable": jjalsEnable,
					 "savetextEnable": savetextEnable});
		alert("저장 되었습니다.");
	});

	$("#add_bookmark").submit(function() {
		var name = this.bookmark_name.value;
		var url = this.url.value;

		if ($.trim(name) == "") {
			alert("이름을 입력해주세요");
			return;
		}
		if ($.trim(url) == "") {
			alert("주소를 입력해주세요");
			return;
		}

		if (url.slice(0, 4) != "http") {
		   url = "http://" + url;
		}

		var bookmarks = storage.bookmarks;
		if (bookmarks == undefined) {
		    bookmarks = [];
		}
		bookmarks.push({"name": name, "url": url});
		setStorages({"bookmarks": bookmarks});

		location.reload();
	});

	$("#edit_bookmarks_num").submit(function() {
		var elements = this.elements;

 		var bookmarks = [];
	 	var bookmarksCopy = storage.bookmarks;
	 	var bookmarkNumbers = [];

	 	var nameIndex = 0, urlIndex = 0, numIndex = 0;
		for (var i = 0; i < elements.length; i++) {
			var input = elements[i];
			
			if (input.type == "text") {
				if (input.className == "bookmark_name_input") {
   					var name = input.value;
   					
					bookmarksCopy[nameIndex++].name = name;
					continue; 
				} else if(input.className == "bookmark_url_input") {
					var url = input.value;
					if ($.trim(url) != "" && url.slice(0, 4) != "http") {
					   url = "http://" + url;
					}
					bookmarksCopy[urlIndex++].url = url;
					continue;
				} else if (input.className == "bookmark_num_input") {
					var bookmarkNumber = parseInt(input.value);
					if (isNaN(bookmarkNumber)) {
					    bookmarkNumber = i + 1;
					}
					bookmarkNumbers.push({"i": numIndex++, "num": bookmarkNumber - 1});
				}
			}
		}

		bookmarkNumbers.sort(function(a,b){return a.num-b.num});

		for (var i = 0; i < bookmarkNumbers.length; i++) {
			bookmarks[i] = bookmarksCopy[bookmarkNumbers[i].i];
		}


		setStorages({"bookmarks": bookmarks});

		alert("저장 되었습니다.");
		location.reload();
	});

	$('#edit_shortcuts').submit(function() {
		var elements = this.elements;
		delete elements[elements.length - 1];

 		var shortcuts = storage.shortcuts;

 		if (shortcuts == undefined) {
 		    shortcuts = [];
 		}

 		for (var i = 0; i < elements.length; i++) {
 			if (elements[i].type != "text") {
 			    continue;
 			}

 			var url = elements[i].value;
			if ($.trim(url) != "" && url.slice(0, 4) != "http") {
			   url = "http://" + url;
			}

 			shortcuts[(i+1) % 10] = url;
 		}

		setStorages({"shortcuts": shortcuts});

		alert("저장 되었습니다.");
		location.reload();
	});

	$('#export_options').click(function() {
		var optionsString = JSON.stringify(storage);
		var html = '아래텍스트를 복사해서 텍스트파일에 저장해주세요.<br>' +
				   '<textarea autofocus style="width:100%;height:95%" onfocus="this.select()">' +
				   optionsString + '</textarea>';
		var w = window.open("data:text/html," + encodeURIComponent(html));
	});

	$('#import_options').click(function() {
		if (!(confirm("정말로 불러오시겠습니까?"))) {
		    return;
		}

		optionsString = $('#options_text').val();
		try {
			var optionsObject = JSON.parse(optionsString);
			setStorages(optionsObject);
			alert("성공적으로 불러왔습니다.");
			location.reload();
		} catch(e) {
			alert("텍스트가 형식에 맞지 않습니다.");
			return;
		}
	});

	(function() {
		var interval = storage.AutosaveInterval;
		if (interval === undefined) {
		    setStorages({"AutosaveInterval": 3});
		    interval = 3;
		}

		var enableList = storage.enableList;

		var bestReplyEnable = storage.bestReplyEnable;
		if (bestReplyEnable == undefined) {
		    setStorages({"bestReplyEnable": false});
		    bestReplyEnable = false;
		}

		var blockEnable = storage.blockEnable;
		if (blockEnable == undefined) {
		    setStorages({"blockEnable": true});
		    blockEnable = true;
		}

		var memoEnable = storage.memoEnable;
		if (memoEnable == undefined) {
		    setStorages({"memoEnable": true});
		    memoEnable = true;
		}

		var dblclickEnable = storage.dblclickEnable;
		if (dblclickEnable == undefined) {
		    setStorages({"dblclickEnable": {"ou": true, "every": false}});
		    dblclickEnable = {"ou": true, "every": false};
		}

		var bookmarkEnable = storage.bookmarkEnable;
		if (bookmarkEnable == undefined) {
		    setStorages({"bookmarkEnable": true});
		    bookmarkEnable = true;
		}

		var shortcutEnable = storage.shortcutEnable;
		if (shortcutEnable == undefined) {
		    setStorages({"shortcutEnable": true});
		    shortcutEnable = true;
		}

		var blockIlbe = storage.blockIlbe;
		if (blockIlbe == undefined) {
		    setStorages({"blockIlbe": false});
		    blockIlbe = false;
		}

		var styleRemoveEnable = storage.styleRemoveEnable;
		if (styleRemoveEnable == undefined) {
		    setStorages({"styleRemoveEnable": false});
		    styleRemoveEnable = false;
		}

		var remoconEnable = storage.remoconEnable;
		if (remoconEnable == undefined) {
		    setStorages({"remoconEnable": true});
		    remoconEnable = true;
		}

		var jjalsEnable = storage.jjalsEnable;
		if (jjalsEnable == undefined) {
		    setStorages({"jjalsEnable": true});
		    jjalsEnable = true;
		}

		var savetextEnable = storage.savetextEnable;
		if (savetextEnable == undefined) {
		    setStorages({"savetextEnable": true});
		    savetextEnable = true;
		}

		$("#bestReplyEnable").attr("checked", bestReplyEnable);
		$("#blockEnable").attr("checked", blockEnable);
		$("#memoEnable").attr("checked", memoEnable);
		$("#interval").val(interval);
		$("#dblclick_ou").attr("checked", dblclickEnable.ou);
		$("#dblclick_every").attr("checked", dblclickEnable.every);
		$("#bookmark_enable").attr("checked", bookmarkEnable);
		$("#shortcut_enable").attr("checked", shortcutEnable);
		$("#block_ilbe").attr("checked", blockIlbe);
		$("#style_remove_enable").attr("checked", styleRemoveEnable);
		$("#remocon_enable").attr("checked", remoconEnable);
		$("#jjals_enable").attr("checked", jjalsEnable);
		$("#savetext_enable").attr("checked", savetextEnable);
	})();

	showUsermemosTable();
	showBlockedUsersTable();
	showSavedTextsTable();
	showBookmarksTable();
	
	(function () {
		var elements = document.getElementById("edit_shortcuts").elements;
		var shortcuts = storage.shortcuts;

		if (shortcuts == undefined) {
		    return;
		}

		for (var i = shortcuts.length - 1; i >= 0; i--) {
			if (elements[i].type != "text") {
				    continue;
				}

			elements[i].value = shortcuts[(i+1) % 10];
		}
	})();

	$("#addBlockedUser").click(function() {
		var username = prompt("닉네임을 입력해주세요.(비회원일시 비움)");
		if (username == null) {
		    return;
		}

		var usernum = prompt("회원번호를 입력해주세요(비회원일시 비움)");
		if (usernum == null) {
		    return;
		}

		var ip = prompt("IP를 입력해주세요");
		if (ip == null || ip == "") {
		    return;
		}

		if (!(/^([0-9]{1,3})\.([0-9]{1,3})\.\*\*\*\.([0-9]{1,3})$/.test(ip))) {
		    alert("오유의 IP 형식이랑 맞지 않습니다");
		    return;
		}

		var blockedUsers = storage.blockedUsers;

		if (blockedUsers == undefined) {
		    blockedUsers = [];
		}

		blockedUsers.unshift({"username": username, "usernum": usernum, "ip": ip});
		setStorages({"blockedUsers": blockedUsers});

		location.reload();
	});

	(function() {
		var dblclickEnable = storage.dblclickEnable;

		if (dblclickEnable == undefined) {
		    setStorages({"dblclickEnable": {"ou": true, "every": false}});
		    dblclickEnable = {"ou": true, "every": false};
		    return;
		}

		if (storage.dblclickEnable.every) {
			var toggle = 0;
			function dblclick() {
			    if (toggle == 0) {
			        var sc = 99999; toggle = 1;
			    } else {
			        var sc = 0; toggle = 0;
			    }
			    window.scrollTo(0,sc);
			}

			$(document).dblclick(dblclick);
		}
	})();
});