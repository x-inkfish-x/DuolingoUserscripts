// ==UserScript==
// @name         Vocabulary Viewer Experimental
// @namespace    https://github.com/x-inkfish-x/
// @version      0.1.17
// @description  A Duolinge userscript that adds a skill strength indicator
// @author       Legato né Mikael
// @match        https://www.duolingo.com/
// @run-at       document-start

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/VocabularyViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/VocabularyViewer.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://raw.githubusercontent.com/x-inkfish-x/DuolingoUserscripts/master/DataHelper1.0.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

function addVocabulary(vocab) {
    if ($("#vocabulary-field").length == 0) {
        var vocabString = '';

        vocab.vocab_overview.sort(function (left, right) {
            if (left.strength > right.strength) {
                return 1;
            }
            if (left.strength < right.strength) {
                return -1;
            }

            return 0;
        });

        vocab.vocab_overview.forEach(function (v) {
            vocabString += '<tr><td><a href="/dictionary/{0}/{1}/{2}">'.format(vocab.language_string, v.normalized_string, v.lexeme_id) +
                '{0}</a></td><td>{1}%</td></tr>'.format(v.word_string, Math.round(v.strength * 100));
        });

        vocabString += "</table></div>";
        $("div._2_lzu div._21w25").after(
            '<div class="_2SCNP _1E3L7" id="vocabulary-field"><table id="vocabulary-table" style="width:100%"><div id="vocabulary-label" class="_6Hq2p _3FQrh _1uzK0 _3f25b _2arQ0 _3skMI _2ESN4">Word strength - {0}</div>{1}</table></div>'.format(vocab.vocab_overview.length, vocabString)).after(toggleVocabularyTable);
    }
}

function toggleVocabularyTable() {
    var vocabTable = $('#vocabulary-table');

    $(vocabTable).toggle();
}

$('body').on('click', '#vocabulary-label', function () {
    toggleVocabularyTable();
});

$(function () {
    DuolingoHelper.requestVocabulary(
        addVocabulary,
        function () {}
    );
});

function addVocabularyField() {
    $("#vocabulary-field").remove();
    DuolingoHelper.requestVocabulary(
        addVocabulary,
        function () {}
    );
}

DuolingoHelper.onCaughtUserId.push(addVocabularyField);

DuolingoHelper.onPageUpdate.push(function (mutations) {
    mutations.forEach(function (mutation) {
        mutation.addedNodes.forEach(function (addedNode) {
            if (addedNode.localName == "div") {
                addVocabularyField();
            }
        });
    });
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
