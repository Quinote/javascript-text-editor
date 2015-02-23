/* Quinote Software Group 2015
 *
 * Author(s): Cameron Basham, Elliott Warkus
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
            //buildList(parseEditorText());
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
     */
    list = $('.notes-list ol');
    list.empty();

    for (i=0; i<parseResult.parsedElements.length; i++) {
        var nextElement = parseResult.parsedElements[i];

        list.append($('<li>').text(nextElement.getIdentifier()));

        if (nextElement.subelements.length > 0) {
            // call recursive function on any subelements
            list.append(buildSublist(nextElement.subelements, list, 1));
        }
    }
};

function buildSublist(elements, indentLevel) {
    // recursively build sublists within the sidebar to reflect tab organization

    var newList = "<ol>";

    // create string of indents of length == indentLevel
    var indents = "";
    for (var i=0; i<indentLevel; i++) {
        indents += "\t";
    }

    for (i=0; i<elements.length; i++) {
        var nextElement = elements[i];
        newList += indents + "<li>" + nextElement.getIdentifier() + "<\li>";
        if (nextElement.subelements.length > 0) {
            // recurse on sublists
            newList += buildSublist(nextElement.subelements, indentLevel+1);
        }
    }
    newList += "</ol>";

    return newList;
}
