// Injecting jquery

if (!document.getElementById("jquery-include")) {
    var script = document.createElement("script");
    script.setAttribute("id", "jquery-include");
    script.setAttribute("src", "https://code.jquery.com/jquery-3.3.1.min.js");
    script.setAttribute("type", "text/javascript");

    document.getElementsByTagName("head")[0].appendChild(script);
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Define Duolingo utility functions

var DuolingoDataObj = {};
DuolingoDataObj.skillStrengthFieldId = "skillStrength";

// ---------------------------------------------------------------------------------------------------------

DuolingoDataObj.requestCourse = function (success, error, userId) {
    if (userId) {
        var requestUrl = "/2017-06-30/users/" + userId + "?fields=currentCourse";

        $.ajax({
            url: requestUrl,
            success: function (response) {
                var obj = JSON.parse(response);

                if (obj) {
                    success(obj.currentCourse);
                } else {
                    error();
                }
            },
            error: error
        });
    } else {
        this.requestCourse(DuolingoDataObj.userId, success, error);
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

        var obj = JSON.parse(ret);
        var userId = getSkillsObject(ret);

        if (obj && obj.userId) {
            DuolingoDataObj.userId = userId;
            if (DuolingoDataObj.onCaughtUserId) {
                DuolingoDataObj.onCaughtUserId(DuolingoDataObj.userId);
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
    if (DuolingoDataObj.onPageUpdate) {
        DuolingoDataObj.onPageUpdate(mutations);
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