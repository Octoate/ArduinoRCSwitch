
/*
 * Needed to set default transition for JQuery Mobile, otherwise
 * page transitions will flicker
 * --- needs to be include _BEFORE_ JQuery Mobile is loaded ---
 */
$(document).bind("mobileinit", function(){
    $.mobile.defaultPageTransition = 'none'; 
    $.mobile.pushStateEnabled = false;  
});