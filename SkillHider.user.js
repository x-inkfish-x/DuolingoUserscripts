// ==UserScript==
// @name         Skill Hider
// @namespace    https://github.com/x-inkfish-x/
// @version      1.0.14
// @description  A Duolinge userscript that hides skills exceeding a strength threshold
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @run-at       document-start

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/SkillHider.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/SkillHider.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/DuolingoHelper2.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

var helper = new DuolingoHelper({
    onPageUpdate: addSkillButton
});

var hiderId = 'skill-hider';
var maxSkillStrength = 4;
var maxStrengthToShow = maxSkillStrength;
var filteredSkills;
var trimButton;

// ---------------------------------------------------------------------------------------------------------

function hasClearedSkills(skills) {
    return skills.filter(skill => skill.finishedLevels > 0).length > 0;
}

// ---------------------------------------------------------------------------------------------------------

function setButtonText(skills) {
    var maxSkillFraction = maxStrengthToShow / maxSkillStrength;
    var shouldTrim = hasClearedSkills(filteredSkills);

    if (shouldTrim && !isMinStrengthLessThanMaxShown(skills)) {
        $(trimButton).text("Trim");
    } else {
        $(trimButton).text("Grow");
    }
}

function trim() {
    var skills = helper.getLocalCurrentSkills();
    calculateMaxStrength(skills);
    helper.forEachSkill({
        skills: skills,
        func: hideSkills
    });
    setButtonText(skills);
}

// ---------------------------------------------------------------------------------------------------------

function addSkillButton() {
    filteredSkills = helper.getLocalCurrentSkills();
    if ($('div#' + hiderId).length == 0) {
        trimButton = $('<div class="_3LN9C _3e75V _3f25b _3hso2 _3skMI oNqWF _3hso2 _3skMI" id="{id}" style="margin-left: 0.5em;"><span>Trim</span></div>'
            .format({
                id:hiderId
            }));

        trimButton.hide();
        trimButton.click(trim);
        $('div.mAsUf').prepend(trimButton);
        trimButton.fadeIn(750);
    }
}

// ---------------------------------------------------------------------------------------------------------

function hideSkills(skill, skillElement) {
    // This multiplication is because the max skill strength is a normalised value
    if (skill.strength * maxSkillStrength <= maxStrengthToShow) {
        $(skillElement).fadeIn();
    } else {
        $(skillElement).fadeOut();
    }
}

// ---------------------------------------------------------------------------------------------------------

function isMinStrengthLessThanMaxShown(skills) {
    var minSkillStrength = 1;

    skills.forEach(function (skill) {
        if (minSkillStrength > skill.strength) {
            minSkillStrength = skill.strength;
        }
    });

    return minSkillStrength * maxSkillStrength > maxStrengthToShow;
}

// ---------------------------------------------------------------------------------------------------------

function calculateMaxStrength(skills) {
    maxStrengthToShow--;

    if (isMinStrengthLessThanMaxShown(skills) || !hasClearedSkills(filteredSkills)) {
        filteredSkills = helper.getLocalCurrentSkills();
        maxStrengthToShow = maxSkillStrength;
    }

    var maxSkillFraction = maxStrengthToShow / maxSkillStrength;
    filteredSkills = filteredSkills.filter(skill => skill.strength <= maxSkillFraction && skill.accessible);
}

// ---------------------------------------------------------------------------------------------------------

$(addSkillButton);

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------