// ==UserScript==
// @name         Strength Viewer
// @namespace    https://github.com/x-inkfish-x/
// @version      0.1
// @description  A Duolinge userscript that adds a skill strength indicator
// @author       Legato né Mikael
// @match        https://www.duolingo.com/
// @run-at       document-start

// @require http://code.jquery.com/jquery-3.3.1.min.js
// @require 

// ==/UserScript==

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
        var strengthSpan = $(skillHtmlElement).find( "span#" + DuolingoDataObj.skillStrengthFieldId );
        var strengthIndicator = makeStrengthIndicator( skill.strength );
        var strengthColor = "color:" + makeStrengthColour( skill.strength );

        if( strengthSpan.length === 0 )
        {
            var strengthHtml = '<span class="_3qO9M _33VdW" id="' + DuolingoDataObj.skillStrengthFieldId + '" style="' + strengthColor + '">' + strengthIndicator + '</span>';
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
    return $( "span#" + DuolingoDataObj.skillStrengthFieldId ).length > 0;
}

// ---------------------------------------------------------------------------------------------------------

function insertSkillStrengths()
{
    var course = DuolingoDataObj.course;
    // Check if the current page already contains the skill strength fields
    if( course !== undefined && course.skills !== undefined && isMainPage() && !hasStrengthFields() )
    {
        var skillElements = $( "div._2albn" );
        var skillIndex = 0;
        course.skills.forEach( function( skillRow )
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
