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

var css = `
.language-level{
    line-height: 3em;
    cursor: default;
}

.language-level .circle{
    margin-left: auto;
    margin-right: auto;
    border-style: solid;
    width: 4em;
    height: 4em;
    border-radius: 2em;
}

.language-level .level{
    text-align: center;
    transform: translateY(0.15em);
    font-size: 2em;
}
`;

var helper = new DuolingoHelper({
    onPageUpdate: setLanguageLevel
});

var levelTextField;

// ---------------------------------------------------------------------------------------------------------

function getLanguageLevel() {
    var cutoffs = helper.getLocalState().config.xpLevelCutoffs;
    var currentCourse = helper.getCurrentCourse();
    return 25 - cutoffs.filter(c => c > currentCourse.xp).length;
}

// ---------------------------------------------------------------------------------------------------------

function setLanguageLevel() {
    if ($('div.language-level').length == 0) {
        GM_addStyle(css);
        var levelParentField = $('div.aFqnr._1E3L7')

        levelTextField = $('<div class="level">{level}</div>');
        var levelCircle = $('<div class="circle"></div>')
            .append(levelTextField);
        var levelTitle = $('<h2>Language Level</h2>');
        var levelBox = $('<div class="aFqnr _1E3L7 language-level"></div>')
            .append(levelTitle)
            .append(levelCircle);
        $(levelParentField).before(levelBox);
    }

    levelTextField.text(getLanguageLevel);
}

// ---------------------------------------------------------------------------------------------------------

$(setLanguageLevel);

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------