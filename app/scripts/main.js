

if (!((window.DocumentTouch && document instanceof DocumentTouch) || 'ontouchstart' in window)) {
    var script = document.createElement("script");
    script.src = "bower_components/intel-appframework/plugins/af.desktopBrowsers.js";
    var tag = $("head").append(script);
}

$.ui.autoLaunch = false; //By default, it is set to true and you're app will run right away.  We set it to false to show a splashscreen

/* This function runs when the body is loaded.*/
var init = function () {
    $.ui.backButtonText = "Back";// We override the back button text to always say "Back"
    window.setTimeout(function () {
        $.ui.launch();
        viewMgr.domReady();
    }, 1500);//We wait 1.5 seconds to call $.ui.launch after DOMContentLoaded fires
};
document.addEventListener("DOMContentLoaded", init, false);
         
/* This code is used for Intel native apps */
var onDeviceReady = function () {                    
    intel.xdk.device.hideSplashScreen();
 
};
document.addEventListener("intel.xdk.device.ready", onDeviceReady, false);


var viewMgr = new ViewMgr();
var eventMgr = new EventMgr();








