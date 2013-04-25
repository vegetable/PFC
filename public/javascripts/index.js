// Onload
$(function(){
	socket = io.connect(location.protocol + '//' + location.host);
	socket.once('connect', function() {
		$.jGrowl('<p>Conexión realizada con éxito');
	});
	socket.on('draw', function(data) {
		if (data) {
			$('#hand').append($('<img />').attr('src', data));
		} else {
			// no hay más cartas
			$('#hand').append($('<img />').attr('src', 'http://www.wizards.com/magic/images/mtgcom/fcpics/making/mr224_back.jpg'));
			socket.removeAllListeners('draw');
		}
	});
	socket.on('view deck', function(data) {
		var $div = $("#deck");
		$div.empty();
		if (data.length) {
			$(data).each(function() {
				$div.append($('<img />').attr('src', this));
			});
		} else {
			$div.append($('<img />').attr('src', 'http://www.wizards.com/magic/images/mtgcom/fcpics/making/mr224_back.jpg'));
		}
	});
});
var socket = null;

function accion(nombre) {
	socket.emit(nombre);
}