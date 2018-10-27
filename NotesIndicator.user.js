// ==UserScript==
// @name         Tips and Notes Indicator
// @namespace    https://github.com/x-inkfish-x/
// @version      0.1.0
// @description  A Duolingo userscripts that adds an indicator to skills with tips and notes
// @author       Legato né Mikael
// @match        https://www.duolingo.com/
// @run-at       document-start

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Experimental/NotesIndicator.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Experimental/NotesIndicator.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://raw.githubusercontent.com/x-inkfish-x/DuolingoUserscripts/Experimental/DataHelper1.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

function addNoteIndicator(skill, skillDom) {
    var something = true;
}

DuolingoHelper.onCaughtUserId = DuolingoHelper.requestCourse(addNoteIndicator);

DuolingoHelper.onPageUpdate = DuolingoHelper.onCaughtUserId;

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------