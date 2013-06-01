self.port.on("getStorages", function(storage) {
	function setStorages(items)
	{
		for (var key in items) {
			storage[key] = items[key];
		}
		self.port.emit("setStorages", items);
	}

	$("#editJjalNumber").submit(function() {
		var elements = this.elements;

 		var jjals = [];
	 	var jjalsCopy = storage.jjals;
	 	var jjalNumbers = [];
		for (var i = 0; i < elements.length; i++) {

			var jjalNumberInput = elements[i];
			var jjalNumber = jjalNumberInput.value;

			if (jjalNumberInput.type != "text") {
			    continue;
			}

			if (isNaN(jjalNumber)) {
			    jjalNumber = i + 1;
			}

			jjalNumbers.push({"i": i, "num": jjalNumber - 1});
		}

		jjalNumbers.sort(function(a,b){return a.num-b.num});

		for (var i = 0; i < jjalNumbers.length; i++) {
			jjals[i] = jjalsCopy[jjalNumbers[i].i];
		}


		setStorages({"jjals": jjals});

		alert("저장 되었습니다.");
		location.reload();
	});


	$("#resetJjals").click(function() {
		if (!confirm("정말로 초기화 하시겠습니까?")) {
		    return;
		}

		resetJjals(function() {
			location.reload();
		});
	});

	function ShowJjalsTable(jjals) {
		if (jjals == undefined) {
    		if (storage.jjals == undefined) {
				resetJjals(function(jjals) {
					ShowJjalsTable(jjals);
				});
			} else if (storage.jjals.length == 0) {
			    $("#JjalsTableDiv").text("짤이 없습니다.");
			    return;
			} else {
				ShowJjalsTable(storage.jjals);
			}
		} else {
			var table = document.getElementById("JjalsTableDiv").appendChild(document.createElement("table"));

			var row = table.appendChild(document.createElement("thead"))
						   .appendChild(document.createElement("tr"));

			$(row).append("<th>번호</th>")
				  .append("<th>짤</th>")
				  .append("<th></th>")
				  .append("<th>번호</th>")
				  .append("<th>짤</th>")
				  .append("<th></th>")
				  .append("<th>번호</th>")
				  .append("<th>짤</th>")
				  .append("<th></th>");
				  
			var tbody = table.appendChild(document.createElement("tbody"));

			var row;
			for (var i = 0; i < jjals.length ; i++) {
				var jjal = jjals[i];

				if (i%3 == 0) {
					row = tbody.appendChild(document.createElement("tr"));
				}

				$('<input/>')
				.attr("size", 3)
				.val(i + 1)
				.appendTo($('<td></td>').appendTo(row));

				var image = row.appendChild(document.createElement("td"))
					    	   .appendChild(document.createElement("img"));
				image.src = jjal;
				image.className = "jjal";
				  
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

					var jjals = storage.jjals;

					jjals.splice(index, 1);
					

					setStorages({"jjals": jjals});

					location.reload();
				});
			}
			$('<input></input>')
			.attr("type", "submit")
			.val("변경저장")
			.appendTo("#editJjalNumber");
		}
	}

	ShowJjalsTable();

	$("#addJjal").click(function() {
		var jjalURL = prompt("추가할 짤의 주소를 입력해주세요.");
		if (!($.trim(jjalURL))) {
			return
		}

		function addJjal(jjals)
		{
			if (jjals == undefined) {
		        resetJjals(addJjal);
			} else {
				jjals.unshift(jjalURL);
				setStorages({"jjals": jjals});
				location.reload();
			}
		}
		addJjal(storage.jjals)
	});


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
});