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

.xp-level .level{
    text-align: right;
    font-size: 1em;
}

.xp-level .bar{
    border: solid 0.1em #000;
    border-radius: 0.5em;
    height: 1em;
}

.xp-level .bar .progress{
    background-color: #0f0;
    height: 95%;
    border-radius: 0.5em;
}
`;

var helper = new DuolingoHelper({
    onPageUpdate: setXpUntilNextLevel
});

var xpTextField;
var progressBar;

// ---------------------------------------------------------------------------------------------------------

function rgbToHex(rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

// ---------------------------------------------------------------------------------------------------------

function getXpUntilNextLevel() {
    var currentXp = helper.getCurrentCourse().xp;
    var cutoffs = helper.getLocalState().config.xpLevelCutoffs;

    for (var i = 0; i < cutoffs.length; i++) {
        var nextXp = currentXp - cutoffs[i];

        if (nextXp < 0) {
            var cutoff = cutoffs[i];
            var prevCutoff = 0;

            if (i > 0) {
                prevCutoff = cutoffs[i - 1];
            }

            return {
                fReq: currentXp - prevCutoff,
                req: cutoff - prevCutoff
            };
        }
    }

    var maxCutoff = cutoffs[cutoffs.length - 1];

    return {
        req: maxCutoff,
        fReq: currentXp % maxCutoff
    };
}

// ---------------------------------------------------------------------------------------------------------

function setXpUntilNextLevel() {
    if ($('div.xp-level').length == 0) {
        GM_addStyle(css);
        var parentField = $('div.aFqnr._1E3L7')

        xpTextField = $('<div class="level"></div>');
        progressBar = $('<div class="progress"></div>');
        var barOutline = $('<div class="bar"></div>')
            .append(progressBar);

        var xpTitle = $('<h2>Level progress</h2>');
        var xpBox = $('<div class="aFqnr _1E3L7 xp-level"></div>')
            .append(xpTitle)
            .append(xpTextField)
            .append(barOutline);
        $(parentField).first().before(xpBox);
    }
    var xpStuff = getXpUntilNextLevel();
    xpTextField.text('{fReq}/{req}'.format(xpStuff));

    var progressFraction = xpStuff.fReq / xpStuff.req;

    progressBar.css('width', '{prog}%'.format({
        prog: progressFraction * 100
    }));

    var colorString = '#{red}{green}{blue}{alpha}'
        .format({
            red: rgbToHex(Math.round(255 * (1 - progressFraction * progressFraction))),
            green: rgbToHex(Math.round(255 * Math.sqrt(progressFraction))),
            blue: '00',
            alpha: '88'
        });
    progressBar.css('background-color', colorString);
}

// ---------------------------------------------------------------------------------------------------------

$(setXpUntilNextLevel);

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------