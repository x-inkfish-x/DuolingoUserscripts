// ==UserScript==
// @name         Strength Viewer Beta
// @namespace    https://github.com/x-inkfish-x/
// @version      2.0.7
// @description  A Duolinge userscript that adds a skill strength indicator
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @run-at       document-start

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/beta/SkillStrengthViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/beta/SkillStrengthViewer.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/DuolingoHelper2.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

var helper = new DuolingoHelper({
    onCaughtUserId: addSkillStrength,
    onPageUpdate: addSkillStrength
});

var skillStrengthFieldId = "skillStrength";

function makeStrengthColour(strength) {
    var color = "000000";
    if (strength <= 0.25) {
        color = "d1102a";
    } else if (strength <= 0.5) {
        color = "ed850e";
    } else if (strength <= 0.75) {
        color = "f4e21d";
    } else if (strength <= 1) {
        color = "33c40b";
    }

    return "#" + color;
}

// ---------------------------------------------------------------------------------------------------------

function hasStrengthFields() {
    return $("#" + skillStrengthFieldId).length > 0;
}

// ---------------------------------------------------------------------------------------------------------

function makeStrengthIndicator(strength) {
    var circles = "";

    for (var i = 0; i < strength; i += 0.25) {
        circles += '\u25C9';
    }

    return circles
}

// ---------------------------------------------------------------------------------------------------------

function insertSkillStrength(skill, skillHtmlElement) {
    if (skillHtmlElement && skill.accessible && skill.strength && skill.finishedLevels > 0) {
        var strengthSpan = $(skillHtmlElement).find("span#" + skillStrengthFieldId);
        var strengthIndicator = makeStrengthIndicator(skill.strength);
        var strengthColor = "color:" + makeStrengthColour(skill.strength);

        if (strengthSpan.length === 0) {
            var strengthHtml = '<span class="_3qO9M _33VdW" id="' + skillStrengthFieldId + '" style="' + strengthColor + '">' + strengthIndicator + '</span>';
            $(skillHtmlElement).append(strengthHtml);
        }
    }
}

// ---------------------------------------------------------------------------------------------------------

function addSkillStrength() {
    if (helper.isMainPage() && !hasStrengthFields()) {
        helper.requestCourse({
            success: function (course) {
                if (course) {
                    helper.forEachSkill({
                        course: course,
                        func: insertSkillStrength
                    });
                }
            }
        });
    }
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
