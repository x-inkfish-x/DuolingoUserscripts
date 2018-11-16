// ==UserScript==
// @name         Language Level Viewer Beta
// @namespace    https://github.com/x-inkfish-x/
// @version      1.1.0
// @description  A Duolinge userscript that hides skills exceeding a strength threshold
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @grant        GM_addStyle

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/LanguageLevelViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/LanguageLevelViewer.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/DuolingoHelper2.0.js

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
    var xp = helper.getCurrentCourse().xp;
    var remainingCutoffs = cutoffs.filter(c => c > xp).length;

    if (remainingCutoffs == 0) {
        var levels = cutoffs.length;
        var maxCutoff = cutoffs[levels - 1];
        
        while (true) {
            xp = xp - maxCutoff;
            if (xp < 0) {
                return levels;
            }

            levels = levels + 1;
        }
    }

    return 25 - remainingCutoffs;
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