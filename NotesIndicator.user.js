// ==UserScript==
// @name         Tips and Notes Indicator
// @namespace    https://github.com/x-inkfish-x/
// @version      1.0.2
// @description  A Duolingo userscripts that adds an indicator to skills with tips and notes
// @author       Legato né Mikael
// @match        https://www.duolingo.com/
// @run-at       document-start
// @grant        GM_addStyle

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/NotesIndicator.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/NotesIndicator.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/DuolingoHelper2.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

var hintCss = `
.hover-hint{
   color: gold;
   font-size: 3em;
   position: absolute;
   top:0;
   left:0;
}

.hover-hint .hover-hint-container{
   position: fixed;
   top: 50%;
   left: 50%;
   transform: translate(-50%, -50%);

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

.hover-hint-container .hover-hint-text{
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

.exit-hint{
   position: absolute;
   top: 0.45em;
   left: 0.42em;
   font-size: 1em;
   color: #534;
}
`;

var helper = new DuolingoHelper({
    onPageUpdate: addHintsIndicator
});

var delay=1000, setTimeoutConst;

var hideHint = function(obj){
    var hoverHintEl = $(obj.target).closest('div.hover-hint-container');
    if($(hoverHintEl).css('display') != 'none'){
        obj.stopPropagation();
        $(hoverHintEl).fadeOut(500);
        return false;
    }
}

function addHintsIndicator() {
    if ($("#hints-indicator").length == 0) {
        var skills = helper.getLocalCurrentSkills();

        helper.forEachSkill({
            skills: skills,
            func: function (skill, skillHtml) {
                if (skill.tipsAndNotes) {
                    var skillTips = $('<div class="hover-hint-container"><div class="hover-hint-text">' + skill.tipsAndNotes + '</div></div>').hide();

                    $(skillHtml).append('<div class="hover-hint" id="hints-indicator">&#128712;</div>').find('div.hover-hint')
                        .hover( function(obj){
                            var hoverHintEl = $(obj.currentTarget).find('div.hover-hint-container');
                            var hintVisible = $(hoverHintEl).css('display');
                            if( hintVisible == 'none')
                            {
                                setTimeoutConst = setTimeout( function(){
                                {
                                    $(hoverHintEl).fadeIn(500);
                                }
                            }, delay);
                        }
                    }
                               , function(){
                            clearTimeout(setTimeoutConst);
                        }).on('dblclick', function(obj){
                        hideHint(obj, '');
                    }).append(skillTips).find('div.hover-hint-container').click(function(obj){
                           if( $(obj.target).hasClass('exit-hint')){
                               hideHint(obj)
                           }

                    }).append('<span class="exit-hint" title="Close">&times;</span>');
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