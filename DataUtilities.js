// Injecting jquery
if (!document.getElementById("jquery-include")) {
    var script = document.createElement("script");
    script.setAttribute("id", "jquery-include");
    script.setAttribute("src", "https://code.jquery.com/jquery-3.3.1.min.js");
    script.setAttribute("type", "text/javascript");
    script.async = false;
    document.getElementsByTagName("head")[0].appendChild(script);
}

var DuolingoHelper = {};
DuolingoHelper.skillStrengthFieldId = "skillStrength";

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.isMainPage = function () {
    return window.location.href = "https://www.duolingo.com";
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.hasStrengthFields = function () {
    return $("span#" + DuolingoHelper.skillStrengthFieldId).length > 0;
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.requestVocabulary = function (success, failure) {
    $.ajax({
        url: "/vocabulary/overview",
        success: function (result) {
            success(JSON.parse(result));
        },
        error: failure
    });
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.requestDictionaryDefinition = function (lexemeId, success, failure) {
    $.ajax({
        url: "/api/1/dictionary_page?lexeme_id=" + lexemeId,
        success: function (result) {
            success(JSON.parse(result));
        },
        error: failure
    });
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.getSkillFields = function () {
    return $("a.Af4up");
}

// ---------------------------------------------------------------------------------------------------------

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

function makeCourseObject(jsonString) {
    if (jsonString) {
        var obj = JSON.parse(jsonString);

        if (obj) {
            return obj.currentCourse;
        }
    }

    return undefined;
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

        var course = makeCourseObject(ret);

        // If the response contains the course
        if (course !== undefined) {
            DuolingoHelper.course = course;
            if (DuolingoHelper.onGetCourse) {
                DuolingoHelper.onGetCourse(DuolingoHelper.course);
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