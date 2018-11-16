// ==UserScript==
// @name         XP to Next Level Beta
// @namespace    https://github.com/x-inkfish-x/
// @version      0.1.0
// @description  A script to show how much XP remains until next level
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @grant        GM_addStyle

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/LevelUpXPViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/LevelUpXPViewer.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/DuolingoHelper2.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

var css = `
.xp-level{
    line-height: 3em;
    cursor: default;
}

.xp-level .circle{
    margin-left: auto;
    margin-right: auto;
    border-style: solid;
    width: 4em;
    height: 4em;
    border-radius: 2em;
}

.xp-level .level{
    text-align: center;
    transform: translateY(0.15em);
    font-size: 2em;
}
`;

var helper = new DuolingoHelper({
    onPageUpdate: setXpUntilNextLevel
});

var xpTextField;

// ---------------------------------------------------------------------------------------------------------

function getXpUntilNextLevel() {
    var currentXp = helper.getCurrentCourse().xp;
    var cutoffs = helper.getLocalState().config.xpLevelCutoffs;

    for (var i = 1; i < cutoffs.length; i++) {
        var nextXp = currentXp - cutoffs[i];

        if( nextXp <= 0 ){
            return currentXp - cutoffs[i - 1];
        }
    }

    var maxCutoff = cutoffs[cutoffs.length - 1];
    return maxCutoff - currentXp % maxCutoff;
}

// ---------------------------------------------------------------------------------------------------------

function setXpUntilNextLevel() {
    if ($('div.xp-level').length == 0) {
        GM_addStyle(css);
        var parentField = $('div.aFqnr._1E3L7')

        xpTextField = $('<div class="level">{level}</div>');
        var xpCircle = $('<div class="circle"></div>')
            .append(xpTextField);
        var xpTitle = $('<h2>XP Remaining</h2>');
        var xpBox = $('<div class="aFqnr _1E3L7 xp-level"></div>')
            .append(xpTitle)
            .append(xpCircle);
        $(parentField).before(xpBox);
    }

    xpTextField.text(getXpUntilNextLevel);
}

// ---------------------------------------------------------------------------------------------------------

$(setXpUntilNextLevel);

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------