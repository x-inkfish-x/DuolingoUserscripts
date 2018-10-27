// Legato né Mikael
// https://github.com/x-inkfish-x/DuolingoUserscripts/blob/master/LICENSE

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

class DuolingoHelper {
    constructor(args) {
        if (args) {
            this.onCaughtUserId = args.onCaughtUserId;
            this.onPageUpdate = args.onPageUpdate;
        }

        this.startListenForHttpResponse();
        this.startListenForContentUpdate();
    }
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Request helpers

DuolingoHelper.prototype.requestCourse = function (args) {
    if (args.userId) {
        this.makeGetRequest({
            url: "/2017-06-30/users/" + args.userId + "?fields=currentCourse",
            success: function (res) {
                if (res.length > 0) {
                    var obj = JSON.parse(res);

                    if (obj) {
                        args.success(obj.currentCourse);
                        return;
                    }
                    args.success();
                    return;
                }
                args.success();
            },
            error: args.error
        });
    } else if (this.userId) {
        args.userId = this.userId;
        this.requestCourse(args);
    }
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.prototype.requestVocabulary = function (args) {
    this.makeGetRequest({
        url: "/vocabulary/overview",
        success: function (res) {
            if (res.length > 0) {
                args.success(JSON.parse(res));
                return;
            }
            args.success();
        },
        error: args.error
    })
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.prototype.requestDictionaryDefinition = function (args) {
    this.makeGetRequest({
        url: "/api/1/dictionary_page?lexeme_id=" + args.lexemeId,
        success: function (res) {
            if (res.length > 0) {
                args.success(JSON.parse(res));
                return;
            }
            args.success();
        },
        error: args.error
    })
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.prototype.makeGetRequest = function (args) {
    var xhr = new XMLHttpRequest();
    xhr.onabort = args.error;
    xhr.onreadystatechange = function () {
        delete xhr.responseText;
        var res = xhr.responseText;
        args.success(res);
        return res;
    }

    xhr.open("GET", args.url);
    xhr.send();
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Iteration helpers

DuolingoHelper.prototype.forEachSkill = function (args) {
    var skillElements = this.getSkillFields();

    var skillElementMap = new Map();

    for (var i = 0; i < skillElements.length; i++) {
        var elementsOfClass = skillElements[i].getElementsByClassName("_33VdW");

        if (elementsOfClass.length > 0) {
            skillElementMap[elementsOfClass[0].textContent] = i;
        }
    }

    args.course.skills.forEach(function (skillRow) {
        skillRow.forEach(function (skill) {
            args.func(skill, skillElements[skillElementMap[skill.shortName]]);
        });
    });
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Page area helpers

DuolingoHelper.prototype.getSkillFields = function () {
    return document.getElementsByClassName("Af4up");
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Page state helpers

DuolingoHelper.prototype.isMainPage = function () {
    return window.location.pathname.replace("/", "").length == 0;
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Listening

DuolingoHelper.prototype.startListenForContentUpdate = function () {
    this.observer = new MutationObserver(function (mutations) {
        if (this.onPageUpdate) {
            this.onPageUpdate(mutations);
        }
    }.bind(this));

    var target = document.querySelector("body");

    var config = {
        attributes: true,
        childList: true,
        characterData: true
    }

    this.observer.observe(target, config);
}

// ---------------------------------------------------------------------------------------------------------

DuolingoHelper.prototype.startListenForHttpResponse = function () {
    var rawOpen = XMLHttpRequest.prototype.open;

    XMLHttpRequest.prototype.open = function () {
        if(this._hooked)
        {
            this._hooked = true;
            setupHook(this);
        }
        
        rawOpen.apply(this, arguments);
    }

    var setupHook = function (xhr) {
        var getter = function () {
            delete xhr.responseText;
            var ret = xhr.responseText;

            if (ret.length > 0) {
                var obj = JSON.parse(ret);

                if (obj && obj.currentCourse && obj.id && obj.id != this.userId) {
                    this.userId = obj.id;

                    if(this.onCaughtUserId)
                    {
                        this.onCaughtUserId(this.userId);
                    }
                }
            }

            setup();
            return ret;
        }.bind(this)

        var setup = function(){
            Object.defineProperty(xhr, 'responseText',{
                get: getter,
                configurable: true
            });
        }

        setup();
    }.bind(this)
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Other useful functions
String.prototype.format = function () {
    a = this;

    for (k in arguments) {
        a = a.replace("{" + k + "}", arguments[k]);
    }

    return a;
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------