var express = require('express');
var hoedown = require('hoedown');
var app = express();
var http = require('http').Server(app);
var io = require('socket.io')(http);

var mdConvert = hoedown();
var mdConvertOptionsBit = function(options) {
  var bitmask;
  var optionBits = {
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

  for (var option in options) {
    if (options[option]) {
      if (bitmask === undefined) {
        // 1st option
        bitmask = optionBits[option];
      } else {
        bitmask = bitmask | optionBits[option];
      }
    }
  }

  return bitmask;
};

http.listen(3333, 'localhost', function() {
  console.log('server up');
});

app.use(express.static('public'));
app.get('/', function(req, res) {
  res.sendFile(__dirname + '/index.html');
});

io.on('connection', function(socket) {
  console.log('user connected');

  socket.on('options', function(mdOptions) {
    console.log('options changed');
    mdConvert = hoedown({
      extensions: mdConvertOptionsBit(mdOptions)
    });
  });

  socket.on('convert', function(md) {
    console.log('convert md');
    socket.emit('convert', mdConvert.do(md));
  });
});
