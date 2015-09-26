$(document).ready(function() {

  // ====================
  // Setup
  // ====================

  // New Socket.io client
  var socket = io();

  // jQuery handles
  var optionsInput = $('#options input[type="checkbox"]');
  var padArea = $('#pad');
  var mdArea = $('#markdown');

  // Markdown options
  var options = {
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

  // Update option checkboxes
  var updateOptions = function() {
    for (var option in options) {
      $('#' + option).prop('checked', options[option]);
    }
  };

  // ====================
  // Socket.io client
  // ====================

  // On connecting to server
  socket.on('connect', function() {
    updateOptions(); // Update option checkboxes
    socket.emit('options', options); // Send options to server
  });

  // On checkbox change
  optionsInput.change(function() {
    // Update Markdown options
    for (var option in options) {
      options[option] = $('#' + option).prop('checked');
    }
    socket.emit('options', options); // Send Markdown options to server
    socket.emit('convert', padArea.val()); // Send Markdown input to server
  });

  // On new input
  padArea.on('input', function() {
    socket.emit('convert', padArea.val()); // Send Markdown input to server
  });

  // On recieving HTML output
  socket.on('convert', function(data) {
    mdArea.html(data); // Display HTML output
  });
});
