self.port.on("getData", function(data) {
	var storage = data.storage;
	function setStorages(items)
	{
		for (var key in items) {
			storage[key] = items[key];
		}
		self.port.emit("setStorages", items);
	}

	function wrapOKText()
	{
		$("#ok_layer").contents().filter(function() {
			  return this.nodeType == 3;
		})
		.wrap('<span class="okSpan"></span>');
	}

	function addOKListButtonsDivs()
	{
		$("#ok_layer > .okSpan").each(function() {
			var $this = $(this);

			var text = $(this).text();
			if ($.trim(text) == "") {
				return;
			}

			var words = text.split(" ");

			var ip = $.trim(words[words.length - 3]);
			var username = $.trim(words[words.length - 2]);
			var usernum = $(this).next("a").text();

			if (username == "") {
			    usernum = "";
			}

			var buttonsSpan = $('<span></span>')
							  .addClass("buttonsSpan")
		  					  .attr("username", username)
							  .attr("usernum", usernum)
							  .attr("ip", ip);

			var num = $(this).next("a");
			if (num.length == 0) {
				buttonsSpan.insertAfter($this);
			} else {
				buttonsSpan.insertAfter(num);
			}
		});
	}

	function addButtonsSpans()
	{
		var writerDiv = $(".writerInfoContents");

		var writerName = writerDiv.find("div > a > font > b").text();

		if (writerName != "") {
			var writerNumber = writerDiv.find("div > a").attr("href").slice(24);

			var writerIp = writerDiv.children(":eq(5)").html();
			writerIp = writerIp.slice(5);

			var buttonsSpan = $('<span></span>')
							  .addClass("buttonsSpan")
					  		  .attr("username", writerName)
							  .attr("usernum", writerNumber)
							  .attr("ip", writerIp)
							  .appendTo(writerDiv.children(":eq(1)"));
		}

		$(".memoInfoDiv").each(function() {
			var $this = $(this);

			var username = $this.find("a > font > b").text();

			if (username != "") {
	    		var usernum = $this.children("a").attr("href").slice(15);

				var ip = $this.children("font[color='red']:last").text();
				ip = ip.slice(3);

				var buttonsSpan = $('<span></span>')
								  .addClass("buttonsSpan")
			  					  .attr("username", username)
								  .attr("usernum", usernum)
								  .attr("ip", ip)
								  .appendTo($this);
			}
		});

		addOKListButtonsDivs();
	}

	function addBlockButton(parent, isBlocked)
	{
		if (isBlocked) {
			$("<button></button>")
			.attr("class", "blockButton")
			.text("차단해제")
			.click(disableBlockedUser)
			.appendTo(parent);
		} else {
			$("<button></button>")
			.attr("class", "blockButton")
			.text("차단")
			.click(blockUser)
			.appendTo(parent);
		}
	}

	function addMemoButton(parent)
	{
		$("<button></button>")
		.attr("class", "memoButton")
		.text("메모")
		.appendTo(parent)
		.click(function() {
			var username = $(this).parent().attr("username");
			var usernum = $(this).parent().attr("usernum");

			var usermemos = storage.usermemos;

			if (usermemos == undefined) {
			    usermemos = {};
			}

			var memo = prompt("메모내용을 입력해주세요.");

			if (memo == null) {
				return;
			}

			if ($.trim(memo) == "") {
				if (usermemos[usernum] == undefined){
					return;
				}

			    delete usermemos[usernum];
			    $('.memoSpan[usernum="' + usernum + '"]').remove();
			} else {
				usermemos[usernum] = {"username": username, "memo": memo};
			}

			setStorages({"usermemos": usermemos});
			
			showUsermemos(usermemos);
		});
	}

	function addMemoButtons(selector)
	{
		if (!selector) {
		    selector = "";
		}

		$(selector + ' .buttonsSpan').each(function() {
			var $this = $(this);

			if ($this.children(".memoButton").length != 0) {
			    return;
			}

			var usernum = $this.attr("usernum");

			if (usernum != "") {
				addMemoButton($this);
			}
		});
	}

	function addBlockButtons(blockedUsers, selector)
	{
		if (blockedUsers == undefined) {
		    blockedUsers = [];
		}

		if (!selector) {
		    selector = "";
		}

		$(selector + ' .buttonsSpan').each(function() {
			var $this = $(this);

			if ($this.children(".blockButton").length != 0) {
			    return;
			}

			var username = $this.attr("username");

			var usernum = $this.attr("usernum");
			var ip = $this.attr("ip");
			ip = ip.slice(3);

			if (username != "") {
				var isBlocked = isBlockedUser(blockedUsers, usernum, ip);
				addBlockButton($this, isBlocked);
			} else if (username == "" && ip != "") {
				var isBlocked = isBlockedUser(blockedUsers, "", ip);
				addBlockButton($this, isBlocked);
			}
		});
	}

	// 회원메모

	function showOKListUsermemos(usermemos)
	{
		$("#ok_layer > .okSpan").each(function() {
			var usernum = $(this).next('a').text();
			var usermemo = usermemos[usernum];
			
			if (usermemo != undefined) {
				var memoSpan = $(this).children("span.memoSpan");
				if (memoSpan.length == 0) {
				    $(this).append('<span class="memoSpan" usernum="' + usernum + '"><b>[' + usermemo.memo + ']</b></span>');
				} else {
				    memoSpan.children().text("[" + usermemo.memo + "]");
				}
			}
		});
	}

	function showUsermemos(usermemos)
	{
		if ($.isEmptyObject(usermemos)) {
		    return;
		}

		$("a:has(font > b)").each(function(index) {
			var $this = $(this);
			var usernum = $this.attr("href").split('mn=')[1];
			var usermemo = usermemos[usernum];

			if (usermemo != undefined) {
				if ($(this).parent("td").length != 0) {
				    var parent = $this.parent().prev();
	    			var memoSpan = parent.children("span.memoSpan");
					if (memoSpan.length == 0) {
						parent.append('<span class="memoSpan" usernum="' + usernum + '"><b>[' + usermemo.memo + ']</b></span>');
					} else {
					    memoSpan.children().text("[" + usermemo.memo + "]");
					}
				} else {
					var memoSpan = $this.next("span.memoSpan");
					if (memoSpan.length == 0) {
						$this.after('<span class="memoSpan" usernum="' + usernum +'"><b>[' + usermemo.memo + ']</b></span>');
					} else {
					    memoSpan.children().text("[" + usermemo.memo + "]");
					}
				}
			}
		});

		showOKListUsermemos(usermemos);
	}

	// 차단 

	function isBlockedUser(blockedUsers, usernum, ip)
	{
		if (usernum == "") {
			var blockedCount = $.grep(blockedUsers, function(item) {
				return item.ip == ip;
			}).length;
		} else {
			var blockedCount = $.grep(blockedUsers, function(item) {
				return (item.usernum == usernum) || (item.ip == ip);
			}).length;
		}

		return blockedCount > 0;
	}

	function blockUser()
	{
		if (!confirm("정말로 차단 하시겠습니까?")) {
			return;
		} 

		var $this = $(this);

		var usernum = $this.parent().attr("usernum");
		var username = $this.parent().attr("username");
		var ip = $this.parent().attr("ip");

		var blockedUsers = storage.blockedUsers;

		if (blockedUsers == undefined) {
		    blockedUsers = [];
		}

		if (ip == "") {
			ip = $(".writerInfoContents").children().eq(5).text().slice(5);			
		}
		if (isBlockedUser(blockedUsers, usernum, ip)) {
		    return;
		}

		blockedUsers.unshift({"username": username, "usernum": usernum, "ip": ip});
		setStorages({"blockedUsers": blockedUsers});
		
		showBlockedUsers(blockedUsers);

		$this.text("차단해제")
			 .unbind("click", blockUser)
			 .click(disableBlockedUser);
	}

	function disableBlockedUser()
	{
		if (!confirm("정말로 차단 해제 하시겠습니까?")) {
			return;
		} 

		var usernum = $(this).parent().attr("usernum");
		var ip = $(this).parent().attr("ip");

		var blockedUsers = storage.blockedUsers;

		if (blockedUsers == undefined) {
		    blockedUsers = [];
		}

		if (ip == "") {
			ip = $(".writerInfoContents").children(":eq(5)").text().slice(5);			
		}

		for (var i = 0; i < blockedUsers.length; i++) {
			blockedUser = blockedUsers[i];
			if (usernum == "") {
			    if (blockedUser.ip == ip) {
			    	blockedUsers.splice(i, 1);
				}
			} else {
				if (blockedUser.usernum == usernum || blockedUser.ip == ip) {
			    	blockedUsers.splice(i, 1);
				}
			}
		}

		setStorages({"blockedUsers": blockedUsers});
		
		location.reload();
	}

	function showWriterIsBlocked(blockedUsers)
	{
		writerIP =  $(".writerInfoContents > div:eq(5)").text();
		writerIP = writerIP.slice(5);

		writerNum = $(".writerInfoContents > div > button").attr("usernum");

		if (isBlockedUser(blockedUsers, writerNum, writerIP)) {
			$(".whole_box").attr("style", "width:100%;margin:0;padding:0;text-align:center;");
			$(".whole_box").addClass("blocked");
		}
	}

	function showOKListBlockedUsers(blockedUsers)
	{
		if (blockedUsers == undefined) {
		    blockedUsers = [];
		}

		$("#ok_layer > span.okSpan").each(function() {
			var usernum = $(this).next("a").text();

			var text = $(this).text();
			if ($.trim(text) == "") {
				return;
			}

			var words = text.split(" ");
			var ip = $.trim(words[words.length - 3]);
			if (($.trim(words[words.length - 2])) == "") {
			    usernum = "";
			}

			if (isBlockedUser(blockedUsers, usernum, ip)) {
			    $(this).addClass("blockedOK");
			}
		});
	}

	function showReplyBlockedUsers(blockedUsers)
	{
		$(".memoInfoDiv > font[color='red']:last-of-type").each(function() {
			var ip = $(this).text();
			ip = ip.slice(3);

			var usernum = $(this).parent().children("button").attr("usernum");

			if (isBlockedUser(blockedUsers, usernum, ip)) {
			    $(this).parent().parent().css("background-color", "#B3B2B2");
			}
		});
	}

	function showListBlockedUsers(blockedUsers)
	{
		$("tr:has(td > a > font > b)").each(function(index) {
			var usernum = $(this).find("td > a:has(font > b)").attr("href").slice(24);

			if (isBlockedUser(blockedUsers, usernum)) {
				$(this).find("td > a:not(:has(font))").css("color", "#FF0000")
									   	  			  .css("text-decoration", "line-through");
			}
		});
	}

	function showBlockedUsers(blockedUsers)
	{
		if (blockedUsers == undefined || blockedUsers.length == 0) {
		    return;
		}

		showWriterIsBlocked(blockedUsers);
		showReplyBlockedUsers(blockedUsers);
		showListBlockedUsers(blockedUsers);
		showOKListBlockedUsers(blockedUsers);
	}

	// 짤
	function addJjal(event)
	{
		var jjalURL = this.src;
		$("textarea").val($("textarea").val() + jjalURL);
		hideJjals();
	}

	function hideJjals()
	{
		$("#jjals").css("display", "none");
	}

	// 소스코드 출처
	//
	// 오늘의유머 '젠젠젠틀맨'님
	// http://todayhumor.com/?humorbest_385560
	function offBGMs()
	{
		function R(w) {
			try {
				var d=w.document,j,i,t,T,N,b,r=1,C;
				for(j=0;t=["object", "embed", "applet", "iframe", "video", "audio"][j];++j) {
					T=d.getElementsByTagName(t);

					for(i=T.length-1;(i+1)&&(N=T[i]);--i) {
						var parents = $(T[i]).parents(".contentContainer, #tail_layer");
						if (parents.length == 0) {
						    continue;
						}

						if(j!=3||!R((C=N.contentWindow)?C:N.contentDocument.defaultView)) {
							b=d.createElement("div");
							b.style.width=N.width;
							b.style.height=N.height;b.innerHTML="<del>BGM</del>";
							N.parentNode.replaceChild(b,N);
						}
					}
				}
			}catch(E) {
				r=0;
			}
			return r
		}
		R(window);
		var i,x;
		for(i=0;x=frames[i];++i)
			R(x);
	}


	(function() {
		var jjalsEnable = storage.jjalsEnable;
		if (jjalsEnable == undefined) {
		    setStorages({"jjalsEnable": true});
		    jjalsEnable = true;
		}

		if (!jjalsEnable) {
		    return;
		}

		var loaded = false;
		var count  = 0;

		$('<input type="button" value="자주쓰는 짤중에서 선택하기">')
		.appendTo($("#memo_insert_submit_image").parent().next())
		.click(function () {
			if (loaded == true) {
				$('#jjals').css('display', 'block');
			    return;
			}

			var xbutton = $('<img src="' + data.xbutton + '" id="xbutton">')
						  .click(hideJjals);
			var jjalsDiv = $('<div id="jjals"></div>').append(xbutton)
									   .appendTo($("body"));

			function showJjals(jjals) {
				var length = jjals.length;
				var loadCount = length < count+50 ? length : count+50;
				for (var i = count; i < loadCount; i++) {
					var jjalURL = jjals[i];
					$('<img></img>')
					.attr("src", jjalURL)
					.addClass("jjal")
				    .appendTo(jjalsDiv)
				    .click(function() {
			    		var jjalURL = this.src;
						$("textarea").val($("textarea").val() + jjalURL);
						hideJjals();
				    })
				    .error(function() {
				    	this.parentNode.removeChild(this);
				    });
				    count++;
				}

				if (length > count) {
				    $('<button></button>')
				    .text("50개 더 로드")
				    .attr("id", "more_jjals_button")
				    .appendTo(jjalsDiv)
				    .click(function() {
				    	$(this).remove();
				    	showJjals(jjals);
				    });
				}
				loaded = true;
			}

			var jjals = storage.jjals;
			if (jjals == undefined) {
			    resetJjals(function(jjals) {
			    	showJjals(jjals);
			    });
			} else if(jjals.length == 0) {
				jjalsDiv.text("짤이 없습니다.");
				return;
			} else {
				showJjals(jjals);
			}
		});
	})();


	(function() {
		wrapOKText();
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

		if (!blockEnable && !memoEnable) {
		    return;
		}

		addButtonsSpans();

		// Firefox에서는 전체추천목록 표시가 안됨
		//
		// $("center > input").click(function () {
		// 	wrapOKText();

		// 	var usermemos = storage.usermemos;
		// 	var blockedUsers = storage.blockedUsers;

		// 	if (!memoEnable && !blockEnable) {
		// 	    return;
		// 	}

		// 	addOKListButtonsDivs();

		// 	if (memoEnable) {
		// 		if (usermemos != undefined) {
		//     		showOKListUsermemos(usermemos);
		// 		}
		// 		addMemoButtons('#ok_layer');
		// 	}
		// 	if (blockEnable) {
		// 		if (blockedUsers != undefined) {
		// 			showOKListBlockedUsers(blockedUsers);
		// 		}
		// 		addBlockButtons(blockedUsers, '#ok_layer');
		// 	}
		// });

		var usermemos = storage.usermemos;
		if (usermemos == undefined) {
		    usermemos = {};
		}

		if (memoEnable) {
			addMemoButtons();
			showUsermemos(usermemos);					    
		}

		var blockedUsers = storage.blockedUsers;
		if (blockedUsers == undefined) {
		    blockedUsers = [];
		}

		if (blockEnable) {
			addBlockButtons(blockedUsers);
			showBlockedUsers(blockedUsers);
		}
	})();

	(function() {
		var bestReplyEnable = storage.bestReplyEnable;

		if (bestReplyEnable == undefined) {
		    setStorages({"bestReplyEnable": false});
		    bestReplyEnable = false;
		}

		if (bestReplyEnable) {
	    	var bestReply, secondReply;
			var maxOK = 0, secondOK = 0;
			$('.memoInfoDiv').each(function(index) {
				var okAndNokDiv = $(this).children('font[color="red"]');

				var html = okAndNokDiv.html();
				var okAndNokString = html.split(' / ');
				var okCount = parseInt(okAndNokString[0].split(':')[1]);
				var nokCount = parseInt(okAndNokString[1].split(':')[1]);
				
				if ((okCount >= 10) && (okCount/3 >= nokCount)) {
					if (okCount > secondOK) {
						if (okCount > maxOK) {
						    secondReply = bestReply;
						    bestReply = index;
						    secondOK = maxOK;
						    maxOK = okCount;
						} else {
							secondReply = index;
							secondOK = okCount;
						}
					}
				}
			});

			if (bestReply !== undefined) {
				var bestReplysDiv = $("<div></div>")
								   .attr("id", "bestReplyDiv")
								   .insertBefore($(".memoContainerDiv:first"));

				var firstReplyDiv = $('.memoContainerDiv:eq(' + bestReply + ')').clone(true, true);
				bestReplysDiv.append(firstReplyDiv);

				if (secondReply !== undefined) {
					var secondReplyHtml = $('.memoContainerDiv:eq(' + (secondReply+1) + ')').clone(true, true);
					bestReplysDiv.append(secondReplyHtml);	    
				}
			}	
		}
	})();

	if (storage.offBGMs == true) {
		offBGMs();	    
	}

	if (storage.styleRemoveEnable == true) {
		$("#tail_layer style, contentContainer style").remove();
	}

	(function() {
		var remoconEnable = storage.remoconEnable;
		if (remoconEnable == undefined) {
		    setStorages({"remoconEnable": true});
		    remoconEnable = true;
		}

		if (!remoconEnable) {
		    return;
		}

		$('.viewSubjectDiv').attr("id", "content_anchor");
		$('.okListDiv + .viewHorizonBar + div').attr("id", "memo_anchor");
		var num = parseInt(location.search.match(/no\=(\d+)/)[1]);
		var prev = document.URL.replace(/no=\d+/, "no=" + (num - 1));
		var next = document.URL.replace(/no=\d+/, "no=" + (num + 1));

		$('<div></div>')
		.attr("id", "remocon")
		.appendTo("body")
		.append($('<span id="remocon_xbutton">x</span>')
				.click(function(){$(this).parent().remove()}))
		.append('<a href="javascript:window.scrollTo(0, 0);">위로</a> ')
		.append('<a href="javascript:window.scrollTo(0, 99999);">아래로</a><br><br>')
		.append('<a href="#content_anchor">본문</a><br>')
		.append('<a href="#okNokBookDiv">추천/반대</a><br>')
		.append('<a href="#memo_anchor">댓글</a><br><br>')
		.append('<a href="' + prev +'">이전</a> ')
		.append('<a href="' + next +'">다음</a>');
	})();

	self.port.on('offBGMs', function() {
		offBGMs();
	});

	self.port.on('removeStyle', function() {
		$("#tail_layer style, contentContainer style").remove();
	});

	self.port.on('lottery', function() {
		var writer = $(".writerInfoContents > div > a > font > b").text();
		var commentWriters = [];
		$(".memoInfoDiv > a > font > b").each(function(index) {
			var username = this.firstChild.nodeValue;

			if (username == writer) {
				return;
			}
			if (commentWriters.indexOf(username) !== -1) {
				return;
			}

			commentWriters.push(username);
		});

		var users = [];

		var lotteryDiv = $('<div></div>')
						 .append($('<span id="lottery_xbutton">x</span>')
								 .click(function(){$(this).parent().remove()}))
						 .attr("id", "lottery_div")
						 .appendTo("body");

		var usersDiv = $('<div></div>')
					   .attr("id", "lottery_users_div")
					   .appendTo(lotteryDiv);

		function addUser(name)
		{
			users.push(name);
			$('<span></span>')
			.append($('<button>삭제</button>')
					.attr("name", name)
					.click(function(event) {
						var index = users.indexOf($(this).attr("name"));
						users.splice(index, 1);
						$(this).parent().remove();
					}))
			.append(name + '<br>')
			.appendTo(usersDiv);	
		}

		for (var i = 0; i < commentWriters.length; i++) {
			addUser(commentWriters[i]);
		}

		var newUser = $('<input></input>')
					  .attr("type", "text")
					  .appendTo(lotteryDiv);

		$('<input></input>')
		.attr("type", "submit")
		.val("추가")
		.appendTo(lotteryDiv)
		.click(function () {
			addUser(newUser.val());
		});

		lotteryDiv.append('<br><br>');

		var winnerSpan = $('<span></span>').appendTo(lotteryDiv);

		$('<button></button>')
		.text('추첨하기')
		.attr("id", "lottery_button")
		.appendTo(lotteryDiv)
		.click(function() {
			var winner = users[Math.floor(Math.random() * users.length)];
			if (winner == undefined) {
			    winnerSpan.html('추첨할 사람이 없습니다.<br>'); 
			} else {
				winnerSpan.html("당첨자: <strong>" + winner + '</strong><br>');
			}
		});
	});
});