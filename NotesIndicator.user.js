// ==UserScript==
// @name         Tips and Notes Indicator
// @namespace    https://github.com/x-inkfish-x/
// @version      1.3.3
// @description  A Duolingo userscripts that adds an indicator to skills with tips and notes
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @grant        GM_addStyle

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/NotesIndicator.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/NotesIndicator.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/DuolingoHelper2.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

var hintCss = `
.hover-hint{
    font-size: 3em;
}

.hover-hint .icon{
    cursor: pointer;  
    color: gold;
    position: absolute;
    top:0;
    left:0;
}

.hover-hint .container{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -45%);

    width: 60%;
    height: 85%;

    padding-top: 1em;
    padding-bottom: 1em;

    border-style: solid;
    border-color: #555;
    border-radius: 1em;

    z-index: 100;

    background-color: #dddddd;
}

.hover-hint .container .text{
    overflow-y: auto;
    font-size: 0.5em;

    text-align: left;
    line-height: 1.2em;

    padding: 1em;
    padding-left: 2em;

    color: #333;

    max-height: 100%;
    max-width: 100%;
}

.exit{
    position: absolute;
    top: 0.45em;
    left: 0.42em;
    font-size: 1em;
    color: #534;
    cursor: default;
}
`;

var helper = new DuolingoHelper({
    onPageUpdate: addHintsIndicator
});

var container;

// ---------------------------------------------------------------------------------------------------------

function makeHintContainer() {
    var hintFieldTarget = $('div#root');

    var exit =
        $('<span class="exit" title="Close">&times;</span>')
        .click(function (obj) {
            var hoverHintEl = $(obj.target).closest('div.container');
            if ($(hoverHintEl).css('display') != 'none') {
                obj.stopPropagation();
                $(hoverHintEl).fadeOut(500, function () {
                    $(container).parent().remove();
                    container = undefined;
                });
                return false;
            }
        });
    var text = $('<div class="text"></div>')
    container = $('<div class="container"></div>')
        .append(text)
        .append(exit)
        .hide();

    var hintField = $('<div class="hover-hint"></div>').append(container);
    $(hintFieldTarget).append(hintField);
}

// ---------------------------------------------------------------------------------------------------------

function addHintButton(element) {
    if ($(element).find('hover-hint').length == 0) {
        var skillTipsIcon = $('<span class="icon">&#128712;</span>');

        var skillTips =
            $('<div class="hover-hint"></div>')
            .click(function (obj) {
                var hintVisible = $(container).css('display');
                if (!container) {
                    makeHintContainer();
                    var text = $(container).find('.text');
                    var skill = helper.getSkillForElement(element);
                    if (skill) {
                        $(text).html(skill.tipsAndNotes);
                        $(container).fadeIn(500);
                    }
                }
            }).append(skillTipsIcon);

        $(element).append(skillTips);
    }
}

// ---------------------------------------------------------------------------------------------------------

function addHintsIndicator() {
    if (helper.isMainPage() && $(".hover-hint").length == 0) {
        //makeHintContainer();

        var skills = helper.getLocalCurrentSkills();

        helper.forEachSkill({
            skills: skills,
            func: function (skill, skillHtml) {
                if (skill.tipsAndNotes) {
                    addHintButton(skillHtml);
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