self.port.on('block', function() {
	var warningFrame = $('<iframe></iframe>')
					   .attr("id", "warning")
					   .attr("src", "http://warning.or.kr/")
					   .appendTo("body");

	if (confirm("일베입니다.\n정말로 가시겠습니가?")) {
	    warningFrame.css("display", "none");
	}	    
});