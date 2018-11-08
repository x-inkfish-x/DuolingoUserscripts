// ==UserScript==
// @name         Skill Vocabulary Viewer Beta
// @namespace    https://github.com/x-inkfish-x/
// @version      1.0.0
// @description  A Duolingo userscript to see the vocabulary associated with a skill
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @run-at       document-start
// @grant        GM_addStyle

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/SkillVocabularyViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/SkillVocabularyViewer.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/DuolingoHelper2.0.js

// ==/UserScript==

var css = `
.skill-vocab{
    font-size: 3em;
}

.skill-vocab .icon{
    cursor: pointer;  
    color: gold;
    position: absolute;
    top:0;
    right:0;
}

.skill-vocab .container{
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -45%);

    width: 17em;
    height: 85%;

    padding-top: 1em;
    padding-bottom: 1em;

    border-style: solid;
    border-color: #555;
    border-radius: 1em;

    z-index: 100;

    background-color: #dddddd;
}

.skill-vocab .container .text{
    overflow-y: auto;
    font-size: 0.5em;

    text-align: left;
    line-height: 1.5em;

    padding: 1em;
    padding-left: 2em;

    color: #333;

    max-height: 100%;
    max-width: 100%;
}

.skill-vocab .close{
    position: absolute;
    top: 0.45em;
    left: 0.42em;
    font-size: 1em;
    color: #534;
}

.skill-vocab .dictionary{
    position: relative;
    width: 100%;
}

.skill-vocab .dictionary .word{
    width: 50%;
}

.skill-vocab .dictionary .definition{
    width: 100%;
    margin: 2em;
}

.skill-vocab .dictionary a{
    color: #534;
}

.skill-vocab .dictionary a:visited{
    color: #534;
}
`;;

// ---------------------------------------------------------------------------------------------------------

var helper = new DuolingoHelper({
    onPageUpdate: addVocabButtons
});

// ---------------------------------------------------------------------------------------------------------

function addDefinition(element, def) {
    var defLine = $('<div class="dictionary" id="{id}"><a href="{path}" class="word" target="_blank">{word}</a><span class="definition">{translation}</span></div>'.format({
        word: def.word,
        translation: def.translations,
        path: def.canonical_path,
        id: def.lexeme_id
    })).hide();
    $(element).append(defLine);
    defLine.fadeIn(500);
}

// ---------------------------------------------------------------------------------------------------------

function addError(element, vocab) {
    $(element).append("<div>Failed to get dictionary definition for {v}</div>".format({
        v: vocab.word_string
    }));
}

// ---------------------------------------------------------------------------------------------------------

function populateContainer(element, vocab) {
    var text = $(element).find('div.container .text');
    $(text).empty();

    vocab.forEach(function (v) {
        helper.requestDictionaryDefinition({
            lexemeId: v.lexeme_id,
            success: function (obj) {
                if (obj) {
                    addDefinition(text, obj);
                }
            },
            error: function () {
                addError(text, v);
            }
        });
    });
}

function showContainer(element) {

}

// ---------------------------------------------------------------------------------------------------------

function addVocabButton(skillElement, vocab) {
    if ($(skillElement).find('div.skill-vocab').length == 0) {
        var exit = $('<span class="close" title="Close">&times;</span>')
            .click(function (obj) {
                var container = $(obj.target).closest('div.container');
                if ($(container).css('display') != 'none') {
                    obj.stopPropagation();
                    $(container).fadeOut(500);
                    return false;
                }
            });

        var button = $('<span class="icon">&#x24cc;</span>');

        var container = $('<div class="container"><div class="text">eououououe</div></div>')
            .hide()
            .append(exit);

        var skill = $('<div class="skill-vocab"></div>')
            .click(function (obj) {

                var container = $(obj.currentTarget).find('div.container');
                var containerVisible = $(container).css('display');
                if (containerVisible == 'none') {
                    populateContainer(obj.currentTarget, vocab);
                    $(container).fadeIn(500);
                }
            });

        $(skill).append(container);
        $(skill).append(button);
        $(skillElement).append(skill);
    }
}

function addVocabButtons() {
    helper.requestVocabulary({
        success: function (vocab) {
            if (vocab) {
                var skills = helper.getLocalCurrentSkills();
                helper.forEachSkill({
                    skills: skills,
                    func: function (skill, skillField) {
                        var filteredVocab = vocab.vocab_overview.filter(v => skill.urlName == v.skill_url_title);

                        if (filteredVocab.length > 0) {
                            addVocabButton(skillField, filteredVocab);
                        }
                    }
                });
            }
        }
    })
}

// ---------------------------------------------------------------------------------------------------------

$(function () {
    GM_addStyle(css);
    addVocabButtons();
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------