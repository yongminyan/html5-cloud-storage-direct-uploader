// Notice: 
//     This is code is based on the following tutorial 
//     http://www.elated.com/articles/elegant-sliding-image-gallery-with-jquery/

//  --- Begin Config ---
var preloadImages = 3;                // Number of Images to preload before showing gallery
var loadingMessageDelay = 2000;       // How long to wait before showing loading message (in ms)
var loadingMessageSpeed = 1200;       // Duration of each pulse in/out of the loading message (in ms)
var loadingMessageMinOpacity = 0.4;   // Minimum opacity of the loading message
var loadingMessageMaxOpacity = 1;     // Maximum opacity of the loading message
var captionSpeed = 1200;              // Duration of the caption fade in/out (in ms)
var captionOpacity = 0.5;             // Maximum opacity of the caption when faded in
var swipeXThreshold = 30;             // X-axis minimum threshold for swipe action (in px) 
var swipeYThreshold = 90;             // Y-axis maximum threshold for swipe action (in px) 
var leftKeyCode = 37;                 // Character code for "move left" key (default: left arrow)
var rightKeyCode = 39;                // Character code for "move right" key (default: right arrow)
var currentSlideOpacity = 1.0;        // Opacity of the current (centre) slide
var backgroundSlideOpacity = 0.5;     // Opacity of the Images either side of the current slide
//  --- End Config ---

var slideHorizMargin = 0;             // Number of pixels either side of each slide
var buttonHeight = 0;                 // Temporary store for the button heights
var currentSlide = 0;                 // The slide that the user is currently viewing
var totalImages = 0;                  // Total number of Images in the gallery
var Images = new Array();             // Holds jQuery objects representing each slide image
var slideWidths = new Array();        // Holds the widths (in pixels) of each slide
var slideLoaded = new Array();        // True if the given slide image has loaded
var loading = true;                   // True if we're still preloading images prior to displaying the gallery

$( init );


// Set up the gallery once the document is ready

function init() {

  // Grab the horizontal margin between Images for later calculations
  slideHorizMargin = parseInt( $('#gallery img').css('margin-left') );

  // Hide the gallery and left/right buttons
  $('#gallery').fadeTo( 0, 0 );
  $('#gallery').css('top','-999em');
  buttonHeight = $('#leftButton').css('height');
  $('#leftButton').css('height',0);
  $('#rightButton').css('height',0);

  // If the requried number of Images haven't loaded after 'loadingMessageDelay' ms,
  // start fading in the loading message

  $('#loading').delay( loadingMessageDelay );
  fadeInLoadingMessage();

  // Bind the handleSlideLoad() handler function to each slide's load event
  $('#gallery img').load( handleSlideLoad );

  // For each of the slide images:
  // 1. Hide the slide
  // 2. Record its serial number (0 = the first slide)
  // 3. Store it in the Images array
  // 4. Trigger the load event if the image is already cached (for IE and Opera)

  $('#gallery img').each( function() {
    $(this).hide();
    $(this).data( 'slideNum', totalImages );
    Images[totalImages++] = $(this);
    if ( this.complete ) $(this).trigger("load");
    $(this).attr( 'src', $(this).attr('src') );
  } );

  // Re-centre the current slide whenever the user resizes the browser
  $(window).resize( centreCurrentSlide ); 

  // Set the initial show/hide states of the left and right buttons
  setButtonStates();

  // Set the caption text to the alt text of the first slide
  $('#caption').html( Images[currentSlide].attr('alt') );

  // Bind the moveRight() and moveLeft() functions to
  // the swipeLeft and swipeRight events respectively.
  // (IE chokes on the swipe plugin, so skip this code on IE)

  if ( !$.browser.msie ) {

    $('#gallery').swipe( {
         swipeLeft: moveRight,
         swipeRight: moveLeft,
         threshold: { x:swipeXThreshold, y:swipeYThreshold }
    } );
  }

  // Bind the moveleft() and moveRight() functions to the
  // "move left" and "move right" keys on the keyboard

  $(document).keydown( function(event) {
    if ( event.which == leftKeyCode ) moveLeft();
    if ( event.which == rightKeyCode ) moveRight();
  } );

  // Show/hide the tutorial info message when touched (for touch devices)
  // $('#info').bind( 'touchstart', function() { $(this).toggleClass('hover'); } );
}


// Process each slide once it's finished loading

function handleSlideLoad() {

  // Record the slide's width in the slideWidths array
  slideWidths[$(this).data('slideNum')] = $(this).width();

  // Increase the gallery div's width to encompass this newly-loaded slide
  $('#gallery').width( $('#gallery').width() + $(this).width() + slideHorizMargin*2 );

  // Record the fact that this slide has loaded in the slideLoaded array
  slideLoaded[$(this).data('slideNum')] = true;

  // Are we still preloading the Images?

  if ( loading ) {

    // Yes: Calculate how many Images we've now preloaded

    var preloaded = 0;

    for ( var i=0; i < preloadImages; i++ ) {
      if ( slideLoaded[i] ) preloaded++;
    }

    // If we've preloaded enough Images, fade in the gallery and enable the left/right buttons

    if ( preloaded == preloadImages || preloaded == totalImages ) {
      $('#loading').clearQueue().stop().fadeTo('slow', 0 );
      $('#gallery').css('top',0);
      $('#gallery').fadeTo('slow', 1 );
      $('#leftButton').css('height',buttonHeight);
      $('#rightButton').css('height',buttonHeight);
      $('#rightButton').show();
      addSlideHover();
      loading = false;
    }
  }

  // If this newly-loaded slide is the first slide in the gallery,
  // centre it in the browser viewport and set its opacity to currentSlideOpacity.
  // Otherwise, set its opacity to backgroundSlideOpacity.

  if ( $(this).data('slideNum') == 0 ) {
    centreCurrentSlide();
    $(this).fadeTo( 'slow', currentSlideOpacity );
  } else {
    $(this).fadeTo( 'slow', backgroundSlideOpacity );
  }

}


// Move one slide to the left by sliding the gallery left-to-right

function moveLeft() {

  // Don't move if this is the first slide, or if we don't yet have a width for the previous slide
  if ( currentSlide == 0 ) return;
  if ( slideWidths[currentSlide-1] == undefined ) return;

  // Cancel all event handlers on the current slide
  Images[currentSlide].unbind('mouseenter').unbind('mouseleave').unbind('touchstart');

  // Stop any fades on the caption and hide it
  $('#caption').stop().clearQueue().hide();

  // Slide the whole gallery right so that the previous slide is now centred
  var offset = slideWidths[currentSlide]/2 + slideHorizMargin*2 + slideWidths[currentSlide-1]/2;
  $('#gallery').animate( { left: '+=' + offset } );

  // Fade the old slide to backgroundSlideOpacity, and the new slide to currentSlideOpacity
  Images[currentSlide].animate( { opacity: backgroundSlideOpacity } );
  Images[currentSlide-1].animate( { opacity: currentSlideOpacity } );

  // Update the current slide index
  currentSlide--;

  // Update the shown/hidden states of left/right buttons as appropriate
  setButtonStates();

  // Set the caption to the new current slide's alt text,
  // and attach the hover events to the new slide
  $('#caption').html( Images[currentSlide].attr('alt') );
  addSlideHover();
}


// Move one slide to the right by sliding the gallery right-to-left

function moveRight() {

  // Don't move if this is the final slide, or if we don't yet have a width for the next slide
  if ( currentSlide == totalImages - 1 ) return;
  if ( slideWidths[currentSlide+1] == undefined ) return;

  // Cancel all event handlers on the current slide
  Images[currentSlide].unbind('mouseenter').unbind('mouseleave').unbind('touchstart');

  // Stop any fades on the caption and hide it
  $('#caption').stop().clearQueue().hide();

  // Slide the whole gallery left so that the next slide is now centred
  var offset = slideWidths[currentSlide]/2 + slideHorizMargin*2 + slideWidths[currentSlide+1]/2;
  $('#gallery').animate( { left: '-=' + offset } );

  // Fade the old slide to backgroundSlideOpacity, and the new slide to currentSlideOpacity
  Images[currentSlide].animate( { opacity: backgroundSlideOpacity } );
  Images[currentSlide+1].animate( { opacity: currentSlideOpacity } );

  // Update the current slide index
  currentSlide++

  // Update the shown/hidden states of left/right buttons as appropriate
  setButtonStates();

  // Set the caption to the new current slide's alt text,
  // and attach the hover events to the new slide
  $('#caption').html( Images[currentSlide].attr('alt') );
  addSlideHover();
}


// Centre the current slide horizontally in the viewport

function centreCurrentSlide() {

  // Work out how far the left edge of the slide is from the
  // left hand edge of the gallery div

  var offsetFromGalleryStart = 0;

  for ( var i=0; i<currentSlide; i++ ) {
    offsetFromGalleryStart += slideWidths[i] + slideHorizMargin*2;
  }

  // Find the horizontal centre of the browser window
  var windowCentre = $(window).width() / 2;

  // Compute the left position of the slide based on the window centre and slide width
  var slideLeftPos = windowCentre - ( slideWidths[currentSlide] / 2 );

  // Compute the offset for the gallery div based on the slide position and
  // the slide offset from the gallery start. Also allow for the
  // horizontal margin on the left side of the slide.
  var offset = slideLeftPos - offsetFromGalleryStart - slideHorizMargin;

  // Move the gallery div to the new offset
  $('#gallery').css( 'left', offset );
}


// Show or hide the left and right buttons depending on the current slide:
// 1. If we're showing the first slide, hide the left button
// 2. If we're showing the last slide, hide the right button

function setButtonStates() {

  if ( currentSlide == 0 ) {
    $('#leftButton').hide();
  } else {
    $('#leftButton').show();
  }

  if ( currentSlide == totalImages - 1 ) {
    $('#rightButton').hide();
  } else {
    $('#rightButton').show();
  }

}

// Attach mouseenter and mouseleave event handlers to the current slide to fade the caption in and out
// However, if the device supports touch events then fade the caption in/out when the slide is touched

function addSlideHover() {

  if ( 'ontouchstart' in document.documentElement ) {
    Images[currentSlide].bind( 'touchstart', function() {
      if ( $('#caption').is(':visible') ) {
        $('#caption').stop().clearQueue().fadeOut( captionSpeed );
      } else {
        $('#caption').stop().clearQueue().fadeTo( captionSpeed, captionOpacity );
      }
    } );
  } else {
    Images[currentSlide].hover(
      function() { $('#caption').stop().fadeTo( captionSpeed, captionOpacity ) },
      function() { $('#caption').stop().fadeTo( captionSpeed, 0 ) }
    );
  }
}


// Functions to pulse the loading message

function fadeInLoadingMessage() {
  $('#loading').animate( { opacity: loadingMessageMaxOpacity }, loadingMessageSpeed, 'swing', fadeOutLoadingMessage );
}

function fadeOutLoadingMessage(){
  $('#loading').animate( { opacity: loadingMessageMinOpacity }, loadingMessageSpeed, 'swing', fadeInLoadingMessage );
}

