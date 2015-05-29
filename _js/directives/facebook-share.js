(function (module, FB) {
    'use strict';

    module.directive('facebookShare', directive);

    directive.$inject = ['$window'];

    function directive($window) {
        return {
            restrict: 'A',
            link: Link
        };

        function Link(scope, elem, attr) {

            elem.on('click', function() {
                var shareUrl = attr.facebookShare || $window.location.href;
                FB.ui({
                    method: 'share',
                    href: shareUrl,
                }, function(response){});
            });

        }
    }

})(angular.module('app'), FB);