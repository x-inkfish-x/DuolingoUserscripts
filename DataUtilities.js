// Injecting jquery
if( !document.getElementById( "jquery-include" ) )
{
    var script = document.createElement( "script" );
    script.setAttribute( "id", "jquery-include" );
    script.setAttribute( "src", "http://code.jquery.com/jquery-3.3.1.min.js");
    script.setAttribute( "type", "text/javascript" );

    document.getElementsByTagName( "head")[0].appendChild( script );
}

var DuolingoDataObj = {};
DuolingoDataObj.skillStrengthFieldId = "skillStrength";

// ---------------------------------------------------------------------------------------------------------

function getSkillsObject( jsonString )
{
    if( jsonString !== undefined )
    {
        var obj = JSON.parse( jsonString );

        if( obj !== undefined )
        {
            return obj.currentCourse;
        }
    }

    return undefined;
}

// Setup to catch incoming Http request responses

var rawOpen = XMLHttpRequest.prototype.open;

XMLHttpRequest.prototype.open = function()
{
    if ( !this._hooked )
    {
        this._hooked = true;
        setupHook( this );
    }
    rawOpen.apply( this, arguments );
}

// ---------------------------------------------------------------------------------------------------------

function setupHook(xhr)
{
    function getter()
    {
        delete xhr.responseText;
        var ret = xhr.responseText;

        var c = getSkillsObject( ret );

        // If the response contains the course skills
        if( c !== undefined )
        {
            DuolingoDataObj.course = c;
            if( DuolingoDataObj.onGetCourse )
            {
                DuolingoDataObj.onGetCourse( DuolingoDataObj.course );
            }
        }

        setup();
        return ret;
    }

    function setup()
    {
        Object.defineProperty( xhr, 'responseText', {
            get: getter,
            configurable: true
        } );
    }
    setup();
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

// Listen for changes on page

var target = document.querySelector( "body" );

var observer = new MutationObserver( function( mutations ) {
    if( DuolingoDataObj.onPageUpdate )
    {
        DuolingoDataObj.onPageUpdate( mutations );
    }
} );

var config = { attributes: true, childList: true, characterData: true }

observer.observe( target, config );

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
