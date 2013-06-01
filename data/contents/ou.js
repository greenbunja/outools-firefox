self.port.on("getData", function(storage) {
	function setStorages(items)
	{
		for (var key in items) {
			storage[key] = items[key];
		}
		self.port.emit("setStorages", items);
	}

	(function() {
		var dblclickEnable = storage.dblclickEnable;

		if (dblclickEnable == undefined) {
		    setStorages({"dblclickEnable": {"ou": true, "every": false}});
		    dblclickEnable = {"ou": true, "every": false};
		    return;
		}

		if (!storage.dblclickEnable.ou) {
		    document.ondblclick = null;
		}
	})();

	(function() {
		var bookmarkEnable = storage.bookmarkEnable;
		if (bookmarkEnable == undefined) {
		    setStorages({"bookmarkEnable": true});
		    bookmarkEnable = true;
		}

		if (!bookmarkEnable) {
		    return;
		}

		var bookmarks = storage.bookmarks;

		if (bookmarks == undefined || bookmarks.length == 0) {
		    return;
		}

		var bookmarksSelect = $('<select></select>')
					   		 .attr('id', 'bookmarks')
					  		 .append('<option>북마크</option>')
							 .appendTo("#logo_line_container")
					 		 .change(function() {
								 location.replace(this.options[this.selectedIndex].value);
							 });

		for (var i = 0; i < bookmarks.length; i++) {
			var bookmark = bookmarks[i];

			$('<option></options>')
			.text(bookmark.name)
			.val(bookmark.url)
			.appendTo(bookmarksSelect);
		};
	})();

	(function() {
		var shortcutEnable = storage.shortcutEnable;

		if (shortcutEnable == undefined) {
			setStorages({"shortcutEnable": true});
		    shortcutEnable = true;
		}
		if (!shortcutEnable) {
		    return;
		}

		var shortcuts = storage.shortcuts;
		if (shortcuts == undefined || shortcuts.length == 0) {
		    return;
		}

		var altPressed = false;
		var focused = false;

		$(':input').focus(function() {
			focused = true;
		});

		$(':input').blur(function() {
			focused = false;
		});

		$(document).keydown(function (e) {
			if (focused) {
			    return;
			}

			if (e.which == 18) {
			    altPressed = true;
			} else if (altPressed && e.which >= 48 && e.which <= 57) {
				var url = $.trim(shortcuts[e.which - 48]);
				if (url) {
					location.replace(url);
				}
			}
		});

		$(document).keyup(function (e) {
			if (e.which == 18) {
			    altPressed = false;
			}
		});
	})();
});