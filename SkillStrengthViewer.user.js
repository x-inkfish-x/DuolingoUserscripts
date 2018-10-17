// ==UserScript==
// @name         Strength Viewer Experimental
// @namespace    https://github.com/x-inkfish-x/
// @version      0.1.3
// @description  A Duolinge userscript that adds a skill strength indicator
// @author       Legato né Mikael
// @match        https://www.duolingo.com/
// @run-at       document-start

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Experimental/SkillStrengthViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Experimental/SkillStrengthViewer.user.js

// @require      https://raw.githubusercontent.com/x-inkfish-x/DuolingoUserscripts/Experimental/DataUtilities.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

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

function makeStrengthIndicator(strength) {
    var circles = "";

    for (var i = 0; i < strength; i += 0.25) {
        circles += '\u25C9';
    }

    return circles
}

// ---------------------------------------------------------------------------------------------------------

function insertSkillStrength(skill, skillHtmlElement) {
    if (skillHtmlElement && skill.accessible === true && skill.strength) {
        var strengthSpan = $(skillHtmlElement).find("span#" + DuolingoHelper.skillStrengthFieldId);
        
        if (strengthSpan.length === 0) {
            var strengthIndicator = makeStrengthIndicator(skill.strength);
            var strengthColor = "color:" + makeStrengthColour(skill.strength);
            var strengthHtml = '<span class="_3qO9M _33VdW" id="' + DuolingoHelper.skillStrengthFieldId + '" style="' + strengthColor + '">' + strengthIndicator + '</span>';
            $(skillHtmlElement).append(strengthHtml);
        }
    }
}

// ---------------------------------------------------------------------------------------------------------

function insertSkillStrengths() {
    var course = DuolingoHelper.course;
    // Check if the current page already contains the skill strength fields
    if (course &&
        !DuolingoHelper.hasStrengthFields()) {
        var skillElements = DuolingoHelper.getSkillFields();
        var skillIndex = 0;
        course.skills.forEach(function (skillRow) {
            skillRow.forEach(function (skill) {
                insertSkillStrength(skill, skillElements[skillIndex]);
                skillIndex++;
            });
        });
    }
}

DuolingoHelper.onGetCourse = insertSkillStrength;
DuolingoHelper.onPageUpdate = insertSkillStrengths;

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------