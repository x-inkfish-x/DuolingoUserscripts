// ==UserScript==
// @name         Strength Viewer
// @namespace    http://tampermonkey.net/
// @version      0.1
// @description  A Duolinge userscript that adds a skill strength indicator
// @author       Legato né Mikael
// @match        https://www.duolingo.com/*
// @run-at       document-start

// @grant        GM_setValue
// @grant        GM_getValue

// @require http://code.jquery.com/jquery-3.3.1.min.js

// ==/UserScript==

var courseDataSaveName = "duolingoCourseData";
var skillStrengthFieldId = "skillStrength";

function getSkillsObject( jsonString )
{
    var jsonStringObject = jsonString !== undefined ? jsonString : GM_getValue( courseDataSaveName );
    if( jsonStringObject !== undefined )
    {
        var obj = JSON.parse( jsonStringObject );

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

function makeStrengthIndicator( strength )
{
    var circles = "";

    for( var i = 0; i < strength; i += 0.25 )
    {
        circles += '\u25C9';
    }

    return circles
}

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

var timer;

function insertSkillStrengths()
{
    // Get the skills for the course
    var skills = getSkillsObject();

    // Check if the current page already contains the skill strength fields
    if( $( "span#" + skillStrengthFieldId ).length === 0 )
    {
        if( skills !== undefined )
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

function setupHook(xhr)
{
    function getter()
    {
        delete xhr.responseText;
        var ret = xhr.responseText;

        // If the response contains the course skills
        if( getSkillsObject( ret ) !== undefined )
        {
            GM_setValue( courseDataSaveName, ret );
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