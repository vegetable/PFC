
/**
 * Module dependencies.
 */
 
 // For cloud foundry
require("cf-autoconfig");

var express = require('express')
	, routes = require('./routes')
	, redis = require('node-redis')
	, http = require('http')
	, app = express()
	, server = http.createServer(app)
	, sio = require('socket.io').listen(server, {
		log: false
	})
	, path = require('path');

// all environments
app.set('port', process.env.VCAP_APP_PORT || process.env.PORT || 3000);

// carpeta de vistas
app.set('views', path.join(__dirname, 'views'));

// motor para generar las vistas
app.set('view engine', 'jade');

// módulo favicon
app.use(express.favicon());

// Activamos log a nivel de desarrollo
app.use(express.logger('dev'));

// para conocer el tipo de petición (multipart / url-encoded)
app.use(express.bodyParser());

// si el navegador no soporta algunos metodos http como PUT, se usa un parámetro y fuerza el método
app.use(express.methodOverride());

// utilizamos routing para MVC
app.use(app.router);

// donde reside la carpeta de ficheros estáticos
app.use(express.static(path.join(__dirname, 'public')));

// Añadimos less-middleware para compilar los ficheros .less a .css
app.use(require('less-middleware')({
		src: __dirname + '/public',
		compress: 'auto',
		force: true 
}));

// configuración para el entorno de desarrollo
if ('development' == app.get('env')) {
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
}

// Acción a ejecutar al acceder al raiz
app.get('/', routes.index);

app.clientes = 0;
sio.sockets.on('connection', function(socket) {
	socket.on('disconnect', function() {
		console.log('Se ha ido un cliente, ya somos', --app.clientes);
	});
	console.log('Se ha conectado un cliente, ya somos', ++app.clientes);
});

// Iniciamos el servidor
server.listen(app.get('port'), function(){
	console.log('Express server listening on port ' + app.get('port'));
});
