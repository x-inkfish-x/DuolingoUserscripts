// ==UserScript==
// @name         Language Level Viewer
// @namespace    https://github.com/x-inkfish-x/
// @version      1.0.1
// @description  A Duolinge userscript that hides skills exceeding a strength threshold
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @grant        GM_addStyle

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/LanguageLevelViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/LanguageLevelViewer.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/DuolingoHelper2.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

var helper = new DuolingoHelper({
    onPageUpdate: addLanguageLevel
});

// ---------------------------------------------------------------------------------------------------------

var css = `
.language-level{
    margin-left: auto;
    margin-right: auto;
    cursor: default;
}

.language-level .level{
    margin: 0.2em;
    font-size: 2em;
}
`;

// ---------------------------------------------------------------------------------------------------------

function addLanguageLevel() {
    var levelParentField = $('div.aFqnr._1E3L7')
    if ($(levelParentField).find('.language-level').length == 0) {
        GM_addStyle(css);
        var cutoffs = helper.getLocalState().config.xpLevelCutoffs;
        var currentCourse = helper.getCurrentCourse();
        var currentLevel = 25 - cutoffs.filter(c => c > currentCourse.xp).length;

        $(levelParentField).prepend('<div class="_3LN9C _3e75V _3f25b _3hso2 _3skMI language-level"><div class="level">Lvl. {level}</div></div>'.format({
            level: currentLevel
        }));
    }

}

// ---------------------------------------------------------------------------------------------------------

$(addLanguageLevel);

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------