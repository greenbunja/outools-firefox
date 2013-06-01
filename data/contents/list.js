self.port.on("getData", function(storage) {
	function setStorages(items)
	{
		for (var key in items) {
			storage[key] = items[key];
		}
		self.port.emit("setStorages", items);
	}


	function isBlockedUser(blockedUsers, usernum)
	{
		var blockedCount = $.grep(blockedUsers, function(item) {
			return item.usernum == usernum;
		}).length;

		return blockedCount > 0;
	}

	(function() {
		if (storage.blockEnable == undefined) {
			setStorages({"blockEnable": true});
		    blockEnable = true;
		    return;
		}
		if (!storage.blockEnable) {
		    return;
		}


		var blockedUsers = storage.blockedUsers;

		if (blockedUsers == undefined) {
		    return;
		}

		if (blockedUsers.length == 0) {
			return;
		}

		$("tr:has(td > a > font > b)").each(function(index) {
			var usernum = $(this).find("td > a:has(font > b)").attr("href").split('mn=')[1];

			if (isBlockedUser(blockedUsers, usernum)) {
				$(this).find("td > a:not(:has(font))").css("color", "#FF0000")
									   	  			  .css("text-decoration", "line-through");
			}
		});

		var memoEnable = storage.memoEnable;

		if (memoEnable == undefined) {
			setStorages({"memoEnable": true});
		    memoEnable = true;
		}

		if (!memoEnable) {
		    return;
		}

		var usermemos = storage.usermemos;

		if (usermemos == undefined) {
		    return;
		}

		if ($.isEmptyObject(usermemos)) {
		    return;
		}

		$("a:has(font > b)").each(function(index) {
			var usernum = $(this).attr("href").split('mn=')[1];
			var usermemo = usermemos[usernum];

			if (usermemo == undefined) {
				return;
			}

			var memo = usermemo.memo;

			$(this).parent().prev().append("\n<b>[" + memo + "]</b>");
		});
	})();
});