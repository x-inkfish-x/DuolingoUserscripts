// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Data get helpers

var DefaultResponseHandling = function () {};
var DuolingoHelper = {};
DuolingoHelper.skillStrengthFieldId = "skillStrength";
DuolingoHelper.hostName = "https://www.duolingo.com";

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.requestCourse = function (success = DefaultResponseHandling, error = DefaultResponseHandling, userId = undefined) {
    if (userId) {
        var requestUrl = DuolingoHelper.hostName + "/2017-06-30/users/" + userId + "?fields=currentCourse";
        var succesFunc = function (response) {
            if (response) {
                var obj = JSON.parse(response);

                if (obj) {
                    success(obj.currentCourse);
                } else {
                    error();
                }
            } else {
                error();
            }
        }

        DuolingoHelper.makeGetRequest(requestUrl, succesFunc, error);
    } else if (DuolingoHelper.userId) {
        DuolingoHelper.requestCourse(success, error, DuolingoHelper.userId);
    }
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.requestVocabulary = function (success = DefaultResponseHandling, error = DefaultResponseHandling) {
    DuolingoHelper.makeGetRequest(DuolingoHelper.hostName + "/vocabulary/overview", function (response) {
        if (response) {
            success(JSON.parse(response));
        } else {
            error();
        }
    }, error);
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.requestDictionaryDefinition = function (lexemeId, success = DefaultResponseHandling, error = DefaultResponseHandling) {
    DuolingoHelper.makeGetRequest(DuolingoHelper.hostName + "/api/1/dictionary_page?lexeme_id=" + lexemeId, function (response) {
        if (response) {
            success(JSON.parse(response));
        } else {
            error();
        }
    }, error);
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.makeGetRequest = function (url, success, error) {
    var xhttp = new XMLHttpRequest();
    xhttp.onerror = error;
    xhttp.onreadystatechange = function () {
        delete xhttp.responseText;
        var res = xhttp.responseText;
        success(res);
    }
    xhttp.open("GET", url);
    xhttp.send();
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Page state query functions

DuolingoHelper.isMainPage = function () {
    return window.location.pathname.replace("/", "").length == 0;
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.hasStrengthFields = function () {
    return !(!document.getElementById(DuolingoHelper.skillStrengthFieldId));
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
    var fields = DuolingoHelper.getSkillFields();
    var skillIndex = 0;

    DuolingoHelper.course.skills.forEach(function (skillRow) {
        skillRow.forEach(function (skill) {
            var id = skill.id;

            skillIndex++;
        });
    });
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Decorator functions

DuolingoHelper.makeSkillStrengthDecorator = function (course) {
    if (DuolingoHelper.skillStrengthDecorator) {
        if (course) {
            var skillElements = DuolingoHelper.getSkillFields();
            var skillIndex = 0;
            course.skills.forEach(function (skillRow) {
                skillRow.forEach(function (skill) {
                    DuolingoHelper.skillStrengthDecorator(skill, skillElements[skillIndex]);
                    skillIndex++;
                });
            });
        } else {
            DuolingoHelper.requestCourse(DuolingoHelper.makeSkillStrengthDecorator);
        }
    }
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

            if (obj && 
                obj.currentCourse && 
                obj.id && 
                DuolingoHelper.userId != obj.id) {
                    
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