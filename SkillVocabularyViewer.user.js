// ==UserScript==
// @name         Skill Vocabulary Viewer Beta
// @namespace    https://github.com/x-inkfish-x/
// @version      1.0.0
// @description  A Duolingo userscript to see the vocabulary associated with a skill
// @author       Legato né Mikael
// @match        https://www.duolingo.com/
// @run-at       document-start
// @grant        GM_addStyle

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/SkillVocabularyViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/Beta/SkillVocabularyViewer.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/DuolingoHelper2.0.js

// ==/UserScript==

var css = `
.skill-vocab{

}
`;

// ---------------------------------------------------------------------------------------------------------

var helper = new DuolingoHelper({
    onPageUpdate: startBuildVocabulary
});

// ---------------------------------------------------------------------------------------------------------

function addVocabList(vocab, skillField) {
    if ($(skillField).find('div.skill-vocab').length == 0) {
        var vocabString = "<div>&#x24cc;</div>";
        vocab.forEach(function (v) {
            vocabString += '<div>{v}</div>'.format({
                v: v.word_string
            });
        });

        var vocField = $('<div class="skill-vocab">{v}</div>'.format({
            v: vocabString
        })).hide();

        $(skillField).append(vocField);
        vocField.fadeIn(500);
    }
}

// ---------------------------------------------------------------------------------------------------------

function startBuildVocabulary() {
    helper.requestVocabulary({
        success: function (vocab) {
            if (vocab) {
                var skills = helper.getLocalCurrentSkills();
                helper.forEachSkill({
                    skills: skills,
                    func: function (skill, skillField) {
                        var filteredVocab = vocab.vocab_overview.filter(v => skill.urlName == v.skill_url_title);

                        if (filteredVocab.length > 0) {
                            addVocabList(filteredVocab, skillField);
                        }
                    }
                });
            }
        }
    });
}

// ---------------------------------------------------------------------------------------------------------

$(function(){
    GM_addStyle(css);
    startBuildVocabulary();
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------