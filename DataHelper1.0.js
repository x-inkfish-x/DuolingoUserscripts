// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Data get helpers

var DuolingoHelper = {};
DuolingoHelper.skillStrengthFieldId = "skillStrength";

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.isMainPage = function () {
    return window.location.pathname.replace("/", "").length == 0;
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.hasStrengthFields = function () {
    return !(!document.getElementById(this.skillStrengthFieldId));
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.requestCourse = function (success, error, userId = undefined) {
    if (userId) {
        var requestUrl = "https://www.duolingo.com/2017-06-30/users/" + userId + "?fields=currentCourse";
        var succesFunc = function (response) {
            if (response) {
                var obj = JSON.parse(response);

                if (obj) {
                    success(obj.currentCourse);
                } else {
                    error();
                }
            }
        }

        makeGetRequest(requestUrl, succesFunc, error);
    } else if (this.userId) {
        this.requestCourse(success, error, this.userId);
    }
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.requestVocabulary = function (success, error) {
    makeGetRequest("/vocabulary/overview", function (result) {
        success(JSON.parse(result));
    }, error);
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.requestDictionaryDefinition = function (lexemeId, success, error) {
    makeGetRequest("/api/1/dictionary_page?lexeme_id=" + lexemeId, function (result) {
        success(JSON.parse(result));
    }, error);
}

// ---------------------------------------------------------------------------------------------------------

function makeGetRequest(url, success, error) {
    var xhttp = new XMLHttpRequest();
    xhttp.onerror = error;
    xhttp.onreadystatechange = function () {
        delete xhttp.responseText;
        var ret = xhttp.responseText;
        success(ret);
        return ret;
    }
    xhttp.open("GET", url);
    xhttp.send();
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Page markup helpers

DuolingoHelper.getSkillFields = function () {
    return document.getElementsByClassName("Af4up");
}

// ---------------------------------------------------------------------------------------------------------

// Stump function, to be implemented
DuolingoHelper.markSkillFieldsWithId = function () {
    var fields = this.getSkillFields();
    var skillIndex = 0;

    this.course.skills.forEach(function (skillRow) {
        skillRow.forEach(function (skill) {
            var id = skill.id;
            
            skillIndex++;
        });
    });
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Setup to catch incoming Http request responses

var rawOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function () {
    if (!this._hooked) {
        this._hooked = true;
        setupHook(this);
    }
    rawOpen.apply(this, arguments);
}

// ---------------------------------------------------------------------------------------------------------

function setupHook(xhr) {
    function getter() {
        delete xhr.responseText;
        var ret = xhr.responseText;

        if (ret.length > 0) {
            var obj = JSON.parse(ret);

            if (obj && obj.currentCourse && obj.id) {
                DuolingoHelper.userId = obj.id;
                if (DuolingoHelper.onCaughtUserId) {
                    DuolingoHelper.onCaughtUserId(DuolingoHelper.userId);
                }
            }
        }

        setup();
        return ret;
    }

    function setup() {
        Object.defineProperty(xhr, 'responseText', {
            get: getter,
            configurable: true
        });
    }
    setup();
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Listen for changes on page

var target = document.querySelector("body");

var observer = new MutationObserver(function (mutations) {
    if (DuolingoHelper.onPageUpdate) {
        DuolingoHelper.onPageUpdate(mutations);
    }
});

var config = {
    attributes: true,
    childList: true,
    characterData: true
}

observer.observe(target, config);

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
