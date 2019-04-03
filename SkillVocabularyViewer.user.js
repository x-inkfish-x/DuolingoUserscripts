// ==UserScript==
// @name         Skill Vocabulary Viewer Beta
// @namespace    https://github.com/x-inkfish-x/
// @version      1.4.1
// @description  A Duolingo userscript to see the vocabulary associated with a skill
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @grant        GM_addStyle

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/SkillVocabularyViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/SkillVocabularyViewer.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/DuolingoHelper/DuolingoHelper2.2.js

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

    width: 20em;
    height: 85%;

    padding-top: 1.1em;
    padding-bottom: 1em;

    border-style: solid;
    border-color: #555;
    border-radius: 1em;

    z-index: 100;

    background-color: #d8d8d8;
}

.skill-vocab .container .text{
    overflow-y: auto;
    font-size: 0.45em;

    text-align: left;
    line-height: 1.5em;

    padding: 1em;
    padding-left: 2em;

    color: #333;

    max-height: 100%;
    max-width: 100%;

    cursor: default;
}

.skill-vocab .close{
    position: absolute;
    top: 0.45em;
    left: 0.42em;
    font-size: 1em;
    color: #534;
    cursor: default;
}

.skill-vocab .dictionary{
    margin-bottom: 1em;
    position: relative;
    width: 100%;
}

.skill-vocab .dictionary tr{
    display: block;
    border-radius: 1em;
    background-color: #dddddd;
}

.skill-vocab .dictionary tr:nth-child(odd){
    background-color: #cccccc;
}

.skill-vocab .dictionary .pos{
    min-width: 4.5em;
    font-style: italic;
}

.skill-vocab .dictionary .word{
    padding-left: 1.5em;
    min-width: 13em;
}

.skill-vocab .dictionary .translations{
    width: 100%;
    margin: 2em;
}

.skill-vocab .dictionary a{
    color: #534;
}

.skill-vocab .dictionary a:visited{
    color: #534;
}

.skill-vocab .loader {
    border: 0.2em solid #8ca5cc;
    border-top: 0.5em solid #0048ba;
    border-radius: 50%;
    width: 2em;
    height: 2em;
    animation: spin 1.75s linear infinite, bob 1s linear infinite;
    margin-top 2em;
    margin-left: auto;
    margin-right: auto;
}

@keyframes spin{
    0% { transform: rotate(0deg) scale(0.8); }
    50% { transform: rotate(180deg) scale(1.2); }
    100% { transform: rotate(360deg) scale(0.8); }
}

@keyframes bob{
    0% {
        border: 0.4em solid #8ca5cc;
        border-top: 0.3em solid #0048ba; }
    50% {
        border: 0.2em solid #8ca5cc;
        border-top: 0.6em solid #0048ba; }
    100% {
        border: 0.4em solid #8ca5cc;
        border-top: 0.3em solid #0048ba;
    }
}
`;

// ---------------------------------------------------------------------------------------------------------

var helper = new DuolingoHelper({
    onSkillAdded: addVocabButtons
});

var container;

// ---------------------------------------------------------------------------------------------------------

function makePartOfSpeech(vocab) {
    if (vocab.pos) {
        var pos = vocab.pos.toLowerCase();
        var gender = '';
        if(vocab.gender){
            gender = vocab.gender.toLowerCase()[0];
        }
        if (pos == 'adjective' || pos == 'adverb') {
            pos = vocab.pos.toLowerCase().substring(0, 3);
        } else if (pos == 'noun') {
            pos = pos[0];
        } else if (pos == 'pronoun') {
            pos = 'pn';
        } else if (pos == 'interjection') {
            pos = 'intrj';
        } else {
            pos = pos[0];
        }

        return pos + gender + '.';
    }

    return '';
}

// ---------------------------------------------------------------------------------------------------------

function addDefinition(element, def, vocab) {
    var defLine = $('<tr><td class="word"><a href="{path}" target="_blank">{word}</a></td><td class="translations">{translation}</td><td class="pos">{pos}</td></tr>'.format({
        word: def.word,
        pos: makePartOfSpeech(vocab),
        translation: def.translations,
        path: def.canonical_path
    })).hide();
    var defTable = $(element).find('table.dictionary');
    defTable.append(defLine);
    defLine.fadeIn(500);
}

// ---------------------------------------------------------------------------------------------------------

function addError(element, vocab) {
    $(element).append("<div>Failed to get dictionary definition for {v}</div>".format({
        v: vocab.word_string
    }));
}

// ---------------------------------------------------------------------------------------------------------


function doNextVocab(text, vocab, i) {
    i = i + 1;
    if (i < vocab.length && $(container).css('display') != 'none') {
        populateSingleWord(text, vocab, i);
    } else {
        $(text).find('.loader').fadeOut(500);
    }
}

// ---------------------------------------------------------------------------------------------------------

function populateSingleWord(text, vocab, i) {
    var v = vocab[i];

    helper.requestDictionaryDefinition({
        lexemeId: v.lexeme_id,
        success: function (obj) {
            if (obj) {
                addDefinition(text, obj, v);
            }

            doNextVocab(text, vocab, i);
        },
        error: function () {
            addError(text, v);
            doNextVocab(text, vocab, i);
        }
    });
}

// ---------------------------------------------------------------------------------------------------------

function populateContainer(element, vocab) {
    if (vocab.length > 0) {
        $(container).find('.loader').show();
        var text = $(container).find('.text');

        $(text).empty();
        var table = $('<table class="dictionary"></table>');
        $(text).append(table);
        $(text).append('<div class="loader"></div>');

        populateSingleWord(text, vocab, 0);
    }
}

function showContainer(element) {

}

// ---------------------------------------------------------------------------------------------------------

function addVocabButton(skillElement, vocab) {
    if ($(skillElement).find('div.skill-vocab').length == 0) {

        var button = $('<span class="icon">&#x24cc;</span>');

        var skill = $('<div class="skill-vocab"></div>')
            .click(function (obj) {
                var containerVisible = $(container).css('display');
                if (containerVisible == 'none') {
                    populateContainer(obj.currentTarget, vocab);
                    $(container).fadeIn(500);
                }
            });


        $(skill).append(button);
        $(skillElement).append(skill);
    }
}

// ---------------------------------------------------------------------------------------------------------

function addVocabButtons() {
    if (helper.isMainPage()) {
        helper.requestVocabulary({
            success: function (vocab) {
                if (vocab) {
                    var vocabFieldTarget = $('div#root');

                    if ($(vocabFieldTarget.find('div.skill-vocab')).length == 0) {
                        var exit = $('<span class="close" title="Close">&times;</span>')
                            .click(function (obj) {
                                container = $(obj.target).closest('div.container');
                                if ($(container).css('display') != 'none') {
                                    obj.stopPropagation();
                                    $(container).fadeOut(500);
                                    return false;
                                }
                            });


                        var text = $('<div class="text"></div>');

                        container = $('<div class="container"></div>')
                            .hide()
                            .append(text)
                            .append(exit)

                        var vocabField = $('<div class="skill-vocab"></div>').append(container);

                        $(vocabFieldTarget).append(vocabField);
                    }

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
}

// ---------------------------------------------------------------------------------------------------------

$(function () {
    GM_addStyle(css);
    addVocabButtons();
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------