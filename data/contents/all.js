self.port.on("addEvent", function() {
	var toggle = 0;
	function dblclick() {
	    if (toggle == 0) {
	        var sc = 99999; 
	        toggle = 1;
	    } else {
	        var sc = 0; 
	        toggle = 0;
	    }
	    window.scrollTo(0,sc);
	}

	$(document).dblclick(dblclick);
});