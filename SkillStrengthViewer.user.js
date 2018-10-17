// ==UserScript==
// @name         Strength Viewer
// @namespace    https://github.com/x-inkfish-x/
// @version      1.0
// @description  A Duolinge userscript that adds a skill strength indicator
// @author       Legato né Mikael
// @match        https://www.duolingo.com/
// @run-at       document-start

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/SkillStrengthViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/SkillStrengthViewer.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/DataHelper1.0.js

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
    if (skillHtmlElement !== undefined && skill.accessible === true && skill.strength !== undefined) {
        var strengthSpan = $(skillHtmlElement).find("span#" + DuolingoHelper.skillStrengthFieldId);
        var strengthIndicator = makeStrengthIndicator(skill.strength);
        var strengthColor = "color:" + makeStrengthColour(skill.strength);

        if (strengthSpan.length === 0) {
            var strengthHtml = '<span class="_3qO9M _33VdW" id="' + DuolingoHelper.skillStrengthFieldId + '" style="' + strengthColor + '">' + strengthIndicator + '</span>';
            $(skillHtmlElement).append(strengthHtml);
        }
    }
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.onCaughtUserId = function () {
    if ( DuolingoHelper.isMainPage() &&
        !DuolingoHelper.hasStrengthFields()) {
            DuolingoHelper.makeSkillStrengthDecorator();
    }
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.onPageUpdate = DuolingoHelper.onCaughtUserId;

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.skillStrengthDecorator = insertSkillStrength;

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
