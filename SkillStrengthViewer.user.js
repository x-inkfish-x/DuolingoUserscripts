// ==UserScript==
// @name         Strength Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A Duolinge userscript that adds a skill strength indicator
// @author       Legato né Mikael
// @match        https://www.duolingo.com/
// @run-at       document-start

// @require http://code.jquery.com/jquery-3.3.1.min.js

// ==/UserScript==

var courseDataSaveName = "duolingoCourseData";
var skillStrengthFieldId = "skillStrength";
var skills;

// ---------------------------------------------------------------------------------------------------------

function getSkillsObject( jsonString )
{
    if( jsonString !== undefined )
    {
        var obj = JSON.parse( jsonString );

        if( obj !== undefined )
        {
            var currentCourse = obj.currentCourse;

            if( currentCourse !== undefined )
            {
                return currentCourse.skills;
            }
        }
    }


    return undefined;
}

// ---------------------------------------------------------------------------------------------------------

function makeStrengthColour( strength )
{
    var color = "000000";
    if( strength <= 0.25 )
    {
       color = "d1102a";
    }
    else if( strength <= 0.5 )
    {
       color = "ed850e";
    }
    else if( strength <= 0.75 )
    {
       color = "f4e21d";
    }
    else if( strength <= 1 )
    {
       color = "33c40b";
    }

    return "#" + color;
}

// ---------------------------------------------------------------------------------------------------------

function makeStrengthIndicator( strength )
{
    var circles = "";

    for( var i = 0; i < strength; i += 0.25 )
    {
        circles += '\u25C9';
    }

    return circles
}

// ---------------------------------------------------------------------------------------------------------

function insertSkillStrength( skill, skillHtmlElement )
{
    if( skillHtmlElement !== undefined && skill.accessible === true && skill.strength !== undefined )
    {
        var strengthSpan = $(skillHtmlElement).find( "span#" + skillStrengthFieldId );
        var strengthIndicator = makeStrengthIndicator( skill.strength );
        var strengthColor = "color:" + makeStrengthColour( skill.strength );

        if( strengthSpan.length === 0 )
        {
            var strengthHtml = '<span class="_3qO9M _33VdW" id="' + skillStrengthFieldId + '" style="' + strengthColor + '">' + strengthIndicator + '</span>';
            $( skillHtmlElement ).append( strengthHtml );
        }
    }
}

// ---------------------------------------------------------------------------------------------------------

function isMainPage()
{
    return $( "div#root" ).length > 0;
}

// ---------------------------------------------------------------------------------------------------------

function hasStrengthFields()
{
    return $( "span#" + skillStrengthFieldId ).length > 0;
}

// ---------------------------------------------------------------------------------------------------------

function insertSkillStrengths()
{
    // Check if the current page already contains the skill strength fields
    if( skills !== undefined && isMainPage() && !hasStrengthFields() )
    {
        var skillElements = $( "div._2albn" );
        var skillIndex = 0;
        skills.forEach( function( skillRow )
            {
                skillRow.forEach( function( skill )
                    {
                        insertSkillStrength( skill, skillElements[skillIndex] );
                        skillIndex++;
                    }
                );
            }
        );
    }
}

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------

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

        var s = getSkillsObject( ret );

        // If the response contains the course skills
        if( s !== undefined )
        {
            skills = s;
            insertSkillStrengths();
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

var target = document.querySelector( "html" );

var observer = new MutationObserver( function( mutations ) {
    insertSkillStrengths();
} );

var config = { attributes: true, childList: true, characterData: true }

observer.observe( target, config );

// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------
