// ==UserScript==
// @name         Skill Hider Beta
// @namespace    https://github.com/x-inkfish-x/
// @version      1.0.12
// @description  A Duolinge userscript that hides skills exceeding a strength threshold
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @run-at       document-start

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/beta/SkillHider.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/beta/SkillHider.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/DuolingoHelper2.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

var helper = new DuolingoHelper();
var hiderId = 'skill-hider';
var maxSkillStrength = 4;
var maxStrengthToShow = maxSkillStrength;

// ---------------------------------------------------------------------------------------------------------

function hideSkills(skill, skillElement) {
    // This multiplication is because the max skill strength is a normalised value
    if (skill.strength * maxSkillStrength <= maxStrengthToShow) {
        $(skillElement).show();
    } else {
        $(skillElement).hide();
    }
}

// ---------------------------------------------------------------------------------------------------------

function calculateMaxStrength(skills) {
    var minSkillStrength = 1;

    skills.forEach(function (skillRow) {
        skillRow.forEach(function (skill) {
            if (minSkillStrength > skill.strength) {
                minSkillStrength = skill.strength;
            }
        });
    });

    maxStrengthToShow--;

    if (minSkillStrength * maxSkillStrength >= maxStrengthToShow) {
        maxStrengthToShow = maxSkillStrength;
    }
}

// ---------------------------------------------------------------------------------------------------------

$(function () {
    if ($('div#' + hiderId).length == 0) {
        $('div.mAsUf').prepend(
            '<div class="_3LN9C _3e75V _3f25b _3hso2 _3skMI oNqWF _3hso2 _3skMI" id="{0}"><span>Hide</span></div>'.format(hiderId)
        );
    }
});

// ---------------------------------------------------------------------------------------------------------

$('body').on('click', '#' + hiderId, function () {
    helper.requestCourse({
        success: function (course) {
            calculateMaxStrength(course.skills);
            helper.forEachSkill({
                course: course,
                func: hideSkills
            })
        }
    });
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------