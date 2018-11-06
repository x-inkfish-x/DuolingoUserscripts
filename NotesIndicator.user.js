// ==UserScript==
// @name         Tips and Notes Indicator
// @namespace    https://github.com/x-inkfish-x/
// @version      0.1.1
// @description  A Duolingo userscripts that adds an indicator to skills with tips and notes
// @author       Legato né Mikael
// @match        https://www.duolingo.com/
// @run-at       document-start

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/NotesIndicator.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/NotesIndicator.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/DuolingoHelper2.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

var helper = new DuolingoHelper({
    onPageUpdate: addHintsIndicator
});

function addHintsIndicator() {
    if ($("#hints-indicator").length == 0) {
        var skills = helper.getLocalCurrentSkills();

        helper.forEachSkill({
            skills: skills,
            func: function (skill, skillHtml) {
                if (skill.tipsAndNotes) {
                    $(skillHtml).append('<div style="color: gold; font-size: 3em; position: absolute; top:0; left:0;" id="hints-indicator">&#128712;</div>');
                }
            }
        });
    }
}

$(function () {
    addHintsIndicator();
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------