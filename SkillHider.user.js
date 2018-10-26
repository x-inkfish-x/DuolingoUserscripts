// ==UserScript==
// @name         Skill Hider Beta
// @namespace    https://github.com/x-inkfish-x/
// @version      1.0.3
// @description  A Duolinge userscript that hides skills exceeding a strength treshold
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @run-at       document-start

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/beta/SkillHider.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/beta/SkillHider.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/DuolingoHelper2.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

// var helper = new DuolingoHelper({
//     onCaughtUserId: ,
//     onPageUpdate:
// });

var hiderId = 'skill-hider';

$(function () {
    if ($('div#' + hiderId).length == 0) {
        $('div.mAsUf').prepend(
            '<div class="_3LN9C _3e75V _3f25b _3hso2 _3skMI oNqWF _3hso2 _3skMI" id="{0}"><span>Hide</span></div>'.format(hiderId));
    }
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------