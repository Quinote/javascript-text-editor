/* Quinote Software Group 2015
 *
 * Author: Cameron Basham
 *
 *
 *
 * TODO:
 *    • Find meaningful way to handle user's text formatting
 *    • Take more efficient approach to rebuilding list on text input
 *    • Build more logical and aesthetically pleasing list
 *    • Handle oddities like double input (in BuildList)
 */

var editor;

var main = function() {
  // Initialize Quill editor
  editor = new Quill('#editor', {
    modules: {
      'toolbar': {
        container: '.editor-wrapper .toolbar'
      }
    },
    styles: false
  });

  // Set event handlers
  editor
      .on('text-change', function(delta, source) {
        //console.log(editor.getHTML());
        //console.log(parseEditorText());
        buildList(parseEditorText());
      })
  ;

  // Must use JQuery here to grab actual html object
  $('#editor')
      .click(function() {
        editor.focus();
      })
  ;

  $(window).resize(resizeEditor);


  // Set up initial environment
  resizeEditor();
  editor.focus();
};

$(document).ready(main);

/*************************************
* Helper functions
*************************************/

var resizeEditor = function() {
  /* Resizes the editor box based on window height,
   * top margin size, and toolbar height.
   *
   */
  var spaceLeft = $(window).height()
      - ($('.editor-wrapper').height() - $('#editor').height())
      - (2 * parseInt($('#container-fluid').css('margin-top')))
      - 2;
  $('#editor').height(spaceLeft);
  console.log($('#editor').height());
};





/* The functions below deal with parsing text
 * and handling the returned object.  They probably
 * belong in their own file.
 */

var parseEditorText = function() {
  /* Parses the text inside of the editor
   * after first formatting it appropriately.
   *
   * TODO:
   *    • Parse results from getHTML() rather that getText()
   */
  var textArray = editor.getText().split("\n");
  return parseInput(textArray);
};

var buildList = function(parseResult) {
  /* Takes in a parse result, and rebuilds the
   * .notes-list ordered list with it.
   *
   * TODO:
   *    • Make this not so horribly inefficient
   *    • Figure out how we should separate/format the types of keys
   *    • Handle double entry when only a colon comes after an identifier
   */
  list = $('.notes-list ol');
  list.empty();
  for (i=0; i<parseResult.identifiers.length; i++) {
    list.append($('<li>').text(parseResult.identifiers[i].identifier));
  }
  for (i=0; i<parseResult.dates.length; i++) {
    list.append($('<li>').text(parseResult.dates[i].date));
  }
  for (i=0; i<parseResult.other.length; i++) {
    list.append($('<li>').text(parseResult.other[i].identifier));
  }
};