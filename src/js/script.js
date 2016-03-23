/**
 * Simple script which changes progress DOM element after 1 sec
**/
(function() {
  'use strict';

  var initLoad = function() {
    window.console.log('Loading script');
  };

  var finishLoad = function() {
    var progressElement = document.getElementById('progress');
    progressElement.innerHTML = 'Loaded!';
    progressElement.className = 'loaded';

    window.console.log('Finishing script');
  };

  initLoad();
  window.setTimeout(finishLoad, 1000);

})(window, document);