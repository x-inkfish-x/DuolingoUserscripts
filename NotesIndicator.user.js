// ==UserScript==
// @name         Tips and Notes Indicator
// @namespace    https://github.com/x-inkfish-x/
// @version      1.0.0
// @description  A Duolingo userscripts that adds an indicator to skills with tips and notes
// @author       Legato né Mikael
// @match        https://www.duolingo.com/
// @run-at       document-start
// @grant        GM_addStyle

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/NotesIndicator.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/NotesIndicator.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/DuolingoHelper2.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

var hintCss = `
.hover-hint{
   color: gold;
   font-size: 3em;
   position: absolute;
   top:0;
   left:0;
}

.hover-hint .hover-hint-text{
   position: fixed;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);
   
   width: 60%;
   max-height: 85%;
   overflow-y: scroll;
   font-size: 0.5em;

   visibility: hidden;
   
   background-color: #dddddd;
   color: #333;
   text-align: left;
   border-radius: 0.25em;
   padding: 1em;
   padding-left: 2em;
   z-index: 100;
   opacity: 0;
   transition: opacity 1s;

   border-style: solid;
   border-color: #555;
}

.hover-hint:hover .hover-hint-text {
   visibility: visible;
   opacity: 1;
   transition-delay:1s;
}
`;

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
                    $(skillHtml).append('<div class="hover-hint" id="hints-indicator">&#128712;<span class="hover-hint-text">' + skill.tipsAndNotes + '</span></div>');
                }
            }
        });
    }
}

$(function () {
    GM_addStyle(hintCss);
    addHintsIndicator();
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------