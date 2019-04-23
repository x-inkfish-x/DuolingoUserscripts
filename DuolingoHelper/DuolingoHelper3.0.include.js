// Insert global duolingo helper into page

const DuolingoHelperId = 'GlobarDuolingoHelperId';
if (document.getElementById(DuolingoHelperId) == undefined) {
    var script = document.createElement('script');
    
    script.type = 'text/javascript';
    script.src = 'https://github.com/x-inkfish-x/DuolingoUserscripts/raw/master/DuolingoHelper/DuolingoHelper2.2.js';
    script.id = DuolingoHelperId;
    
    var head = document.getElementsByTagName('head')[0];
    head.appendChild(script);
}
