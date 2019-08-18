// ==UserScript==
// @name         Vocabulary Viewer
// @namespace    https://github.com/x-inkfish-x/
// @version      1.0.5
// @description  A Duolinge userscript that adds a sidebar with the currently know vocabulary in the current language
// @author       Legato né Mikael
// @match        https://www.duolingo.com/

// @downloadURL  https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/VocabularyViewer.user.js
// @updateURL    https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/VocabularyViewer.user.js

// @require      https://code.jquery.com/jquery-3.3.1.min.js
// @require      https://raw.githubusercontent.com/x-inkfish-x/DuolingoUserscripts/master/DuolingoHelper/DuolingoHelper2.2.js

// ==/UserScript==

// ---------------------------------------------------------------------------------------------------------

var helper = new DuolingoHelper({
    onPageUpdate: function () {
        helper.requestVocabulary({
            success: addVocabulary
        });
    }
});

var css = `
.vocabulary-viewer{
    
}

.vocabulary-viewer .container{
    height: 50em;
    overflow-y: auto;
}

.vocabulary-viewer table{
    width: 100%;
}

.vocabulary-viewer a{
    color: #534;
}

.vocabulary-viewer a:visited{
    color: #534;
}

.vocabulary-viewer tr .word{
    min-width: 12em;
}

.vocabulary-viewer tr{
    display: block;
    border-radius: 2em;
    background-color: #dddddd;
}

.vocabulary-viewer tr:nth-child(odd){
    background-color: #cccccc;
}

.vocabulary-viewer ::-webkit-scrollbar{
    width: 15px;
}

.vocabulary-viewer ::-webkit-scrollbar-track
{
    box-shadow: inset 0 0 5px grey;
    background: #f1f1f1;
    border-radius: 15px;
}

.vocabulary-viewer ::-webkit-scrollbar-thumb
{
    box-shadow: inset 0 0 10px #666;
    background: #aaa;
    border-radius: 15px;
}

.vocabulary-viewer ::-webkit-scrollbar-thumb:hover
{
    box-shadow: inset 0 0 10px #333;
    background: #888;
}
`;

var vocabTable;
var title;

// ---------------------------------------------------------------------------------------------------------

function makeVocabEntry(vocab, v) {
    var vocabField = $('<td class="word"><a href="/dictionary/{lang}/{normstr}/{id}" target="_blank">{str}</a></td>'
        .format({
            lang: vocab.language_string,
            normstr: v.normalized_string,
            id: v.lexeme_id,
            str: v.word_string
        }));

    var strengthField = $('<td class="strength">{strength}%</td>'.format({
        strength: Math.round(v.strength * 100)
    }));

    return $('<tr></tr>').append(vocabField).append(strengthField);
}

// ---------------------------------------------------------------------------------------------------------

var timeoutHandle;

function addVocabularyEntry(vocab, i) {
    if (i < vocab.vocab_overview.length && vocabTable) {
        var line = makeVocabEntry(vocab, vocab.vocab_overview[i]);
        line.hide();
        $(vocabTable).append(line);
        line.fadeIn(400);
        timeoutHandle = setTimeout(function () {
            addVocabularyEntry(vocab, i + 1);
        }, 1);
    }
}

// ---------------------------------------------------------------------------------------------------------

function abortTimeout() {
    clearTimeout(timeoutHandle);
}

// ---------------------------------------------------------------------------------------------------------
var previousVocab;

function addVocabulary(vocab) {
    if (vocab) {
        var hasVocabTable = $("#vocab-table").length > 0;
        if (!hasVocabTable ||
            (!previousVocab ||
                vocab.from_language != previousVocab.from_language &&
                vocab.learning_language != previousVocab.learning_language ||
                vocab.vocab_overview.length != previousVocab.vocab_overview.length)) {
            previousVocab = vocab;

            if (!hasVocabTable) {

                vocabTable = $('<table id="vocab-table"></table>');
                title = $('<h2></h2>');
                var tableContainer = $('<div class="container"></div>').append(vocabTable);
                var vocabContainer = $('<div class="_2SCNP _1E3L7 vocabulary-viewer"></div>').append(title).append(tableContainer);
                
                $("div._2_lzu div._2SCNP._1E3L7").after(vocabContainer);
            }

            $(title).text('Loading...');

            vocabTable.empty();

            vocab.vocab_overview.sort(function (left, right) {
                if (left.strength > right.strength) {
                    return 1;
                }
                if (left.strength < right.strength) {
                    return -1;
                }

                return 0;
            });

            $(title).text('Vocab - {vocabCount} words learned'.format({
                vocabCount: vocab.vocab_overview.length
            }));
            abortTimeout();
            addVocabularyEntry(vocab, 0);
        }
    }
}

// ---------------------------------------------------------------------------------------------------------

$(function () {
    helper.addStyle(css);
    helper.requestVocabulary({
        success: addVocabulary
    });
});

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------