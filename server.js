// ====================
// Setup
// ====================

// Modules
var express = require('express');
var hoedown = require('hoedown');

// App
var app = express(); // Express app
var http = require('http').Server(app); // HTTP server
var port = process.env.PORT || 8080;
var io = require('socket.io')(http); // Socket.io layer

// Markdown Converter
var md = hoedown(); // Hoedown instance
var updateOptions = function(options) { // Update Hoedown instance with new options
  var bitmask; // Where options are set
  var optionBits = { // Option bit values (can be bitwise ORed together)
    tables: hoedown.Extensions.TABLES,
    fencedCode: hoedown.Extensions.FENCED_CODE,
    footnotes: hoedown.Extensions.FOOTNOTES,
    autolink: hoedown.Extensions.AUTOLINK,
    strikethrough: hoedown.Extensions.STRIKETHROUGH,
    underline: hoedown.Extensions.UNDERLINE,
    highlight: hoedown.Extensions.HIGHLIGHT,
    quote: hoedown.Extensions.QUOTE,
    superscript: hoedown.Extensions.SUPERSCRIPT,
    laxSpacing: hoedown.Extensions.LAX_SPACING,
    noIntraEmphasis: hoedown.Extensions.NO_INTRA_EMPHASIS,
    spaceHeaders: hoedown.Extensions.SPACE_HEADERS,
    disableIndentedCode: hoedown.Extensions.DISABLE_INDENTED_CODE
  };

  // Set options
  for (var option in options) {
    if (options[option]) { // Is option set (true)?
      if (bitmask === undefined) { // First option to be set?
        bitmask = optionBits[option];
      } else {
        bitmask = bitmask | optionBits[option];
      }
    }
  }

  // Return a new Hoedown instance with updated options
  md = hoedown({
    extensions: bitmask
  });
};

// ====================
// Configure
// ====================
app.use(express.static('public'));

// ====================
// Routes
// ====================
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

// ====================
// Listen
// ====================
http.listen(port, function() {
  console.log('server up');
});

// Socket.io listeners
io.on('connection', function(socket) {
  console.log('user connected');

  // On receiving new Markdown Options
  socket.on('options', function(data) {
    updateOptions(data); // Update Markdown options
    console.log('options updated');
  });

  // On receiving Markdown input
  socket.on('convert', function(data) {
    socket.emit('convert', md.do(data)); // Send converted markdown to client
    console.log('Markdown converted');
  });
});
