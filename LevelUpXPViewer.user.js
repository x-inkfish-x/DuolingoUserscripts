// ==UserScript==
// @name         XP to Next Level
// @namespace    https://github.com/x-inkfish-x/
// @version      1.0.0
// @description  A script to show how much XP remains until next level
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @grant        GM_addStyle

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/LevelUpXPViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/LevelUpXPViewer.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/DuolingoHelper/DuolingoHelper2.2.js

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

.xp-level .progress{
    width: 100%;
}

.xp-level table{
    width: 100%;
    margin: 0;
}

.xp-level table .bar-cell{
    width:100%;
}

.xp-level .progress .bar{
    display: inline-block;
    width: 100%;
    height: 1em;
    border: solid 0.1em #000;
    border-radius: 0.5em;
}

.xp-level .progress .bar .progress-bar{
    display: block;
    height: 95%;
    border-radius: 0.5em;
}
`;

var helper = new DuolingoHelper({
    onPageUpdate: function (mutations) {
        setXpUntilNextLevel();
    }
});

var xpTextField;
var progressBar;
var fromLevel;
var toLevel;

// ---------------------------------------------------------------------------------------------------------

function rgbToHex(rgb) {
    var hex = Number(rgb).toString(16);
    if (hex.length < 2) {
        hex = "0" + hex;
    }
    return hex;
}

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
        helper.addStyle(css);
        var parentField = $('div.aFqnr._1E3L7')

        xpTextField = $('<div class="level"></div>');

        progressBar = $('<span class="progress-bar"></span>');
        var barOutline = $('<span class="bar"></span>')
            .append(progressBar);
        var barCell = $('<td class="bar-cell"></td>')
            .append(barOutline);

        fromLevel = $('<td>0</td>');
        toLevel = $('<td></td>');

        var progressField = $('<tr class="progress"></tr>')
            .append(fromLevel)
            .append(barCell)
            .append(toLevel);

        var progressTable = $('<table></table>')
            .append(progressField);

        var xpTitle = $('<h2>Level progress</h2>');
        var xpBox = $('<div class="aFqnr _1E3L7 xp-level"></div>')
            .append(xpTitle)
            .append(xpTextField)
            .append(progressTable);
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

    var level = getLanguageLevel();

    fromLevel.text(level);
    toLevel.text(level + 1);
}

// ---------------------------------------------------------------------------------------------------------

$(setXpUntilNextLevel);

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------