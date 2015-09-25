$(document).ready(function() {
  var socket = io();

  var optionsInput = $('#options input[type="checkbox"]');
  var padArea = $('#pad');
  var mdArea = $('#markdown');

  var mdOptions = {
    tables: true,
    fencedCode: true,
    footnotes: true,
    autolink: true,
    strikethrough: true,
    underline: true,
    highlight: true,
    quote: true,
    superscript: true,
    laxSpacing: true,
    noIntraEmphasis: true,
    spaceHeaders: true,
    disableIndentedCode: true
  };

  var updateOptions = function() {
    for (var option in mdOptions) {
      $('#' + option).prop('checked', mdOptions[option]);
    }
  };

  socket.on('connect', function() {
    updateOptions();
    socket.emit('options', mdOptions);
  });

  optionsInput.change(function() {
    for (var option in mdOptions) {
      mdOptions[option] = $('#' + option).prop('checked');
    }

    socket.emit('options', mdOptions);
    socket.emit('convert', padArea.val());
    return false;
  });

  padArea.on('input', function() {
    socket.emit('convert', padArea.val());
  });

  socket.on('convert', function(html) {
    mdArea.html(html);
  });
});
