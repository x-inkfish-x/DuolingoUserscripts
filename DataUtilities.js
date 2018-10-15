export DuolingoDataUtilities = {};

DuolingoDataUtilities.parseCourseData = function (jsonString) {
    var jsonStringObject = jsonString !== undefined ? jsonString : GM_getValue(courseDataSaveName);
    if (jsonStringObject !== undefined) {
        var obj = JSON.parse(jsonStringObject);

        if (obj !== undefined) {
            return obj.currentCourse;
        }
    }

    return undefined;
}

DuolingDataUtilities.setupHook = function (xhr) {
    function getter() {
        delete xhr.responseText;
        var ret = xhr.responseText;

        var courseData = parseCourseData(ret);
        // If the response contains the course skills
        if ( courseData !== undefined) {
            this.courseData = courseData;

            if (this.retrievedDataCallback) {
                retrievedDataCallback( this );
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

// Setup to catch incoming Http request responses
var rawOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function () {
    if (!this._hooked) {
        this._hooked = true;
        DuolingoDataUtilities.setupHook(this);
    }
    rawOpen.apply(this, arguments);
}
