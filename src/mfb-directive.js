+(function(window, angular, undefined){

  var mfb = angular.module('ng-mfb', []);

  mfb.directive('mfbMenu', ['$timeout',function($timeout){

    var templateUrl = 'menu.tpl.html',
        iconTemplate = 'NGMFB_main-icon-template';

    return {
      restrict: 'EA',
      transclude: true,
      replace: true,
      scope: {
        position: '@',
        effect: '@',
        label: '@',
        resting: '@restingIcon',
        active: '@activeIcon',
        customContent: '@',

        menuState: '@',
        togglingMethod: '@',
      },
      templateUrl: templateUrl,
      controller: function($scope){
        return ctrl($scope, iconTemplate);
      },
      link: function(scope, elem, attrs) {
        var openState = 'open',
            closedState = 'closed';

        /**
         * Check if we're on a touch-enabled device.
         * Requires Modernizr to run, otherwise simply returns false
         */
        function _isTouchDevice(){
          return window.Modernizr && Modernizr.touch;
        }

        function _isHoverActive(){
          return scope.togglingMethod === 'hover';
        }

        /**
         * Convert the toggling method to 'click'.
         * This is used when 'hover' is selected by the user
         * but a touch device is enabled.
         */
        function useClick(){
          scope.$apply(function(){
            scope.togglingMethod = 'click';
          });
        }

        /**
         * Set the state to user-defined value. Fallback to closed if no
         * value is passed from the outside.
         */
        scope.menuState = attrs.menuState || closedState;

        /**
         * Invert the current state of the menu.
         *
         * The click handler is always attached, so we prevent this callback
         * from firing when hover is selected.
         */
        scope.toggleMenu = function() {
          if ( _isHoverActive() ){ return; }
          scope.menuState = scope.menuState === openState ? closedState : openState;
        };

        /**
         * If on touch device AND 'hover' method is selected:
         * wait for the digest to perform and then change hover to click.
         */
        if ( _isTouchDevice() && _isHoverActive() ){
          $timeout(useClick);
        }

        attrs.$observe('menuState', function(){
          scope.currentState = scope.menuState;
        });

      }
    };
  }]);


  mfb.directive('mfbButton', [function(){

    var templateUrl = 'button.tpl.html',
        iconTemplate = 'NGMFB_child-icon-template';

    return {
      require: '^mfbMenu',
      restrict: 'EA',
      transclude: true,
      replace: true,
      scope: {
        icon: '@',
        label: '@',
        customContent: '@'
      },
      templateUrl: templateUrl,
      controller: function($scope){
        return ctrl($scope, iconTemplate);
      },
    };
  }]);

  function ctrl($scope, iconTemplate) {
    $scope.customContent =  $scope.customContent ?
                            $scope.customContent :
                            iconTemplate;
  }

})(window, angular);
