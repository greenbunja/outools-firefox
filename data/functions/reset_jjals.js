function resetJjals(callback)
{
	self.port.on('resetedJjals', function(jjals) {
		callback(jjals);
	});
	self.port.emit("resetJjals");
}