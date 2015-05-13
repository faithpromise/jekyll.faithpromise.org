(function (module, Waypoint) {
    'use strict';

    module.directive('waypointAddClass', directive);

    function directive() {
        return {
            restrict: 'A',
            link: Link
        };
    }

    function Link(scope, elem, attr) {

        var params = {
            element: elem[0],
            target: elem[0],
            addDirection: 'down',
            handler: function(direction) {
                if (direction === params.addDirection) {
                    angular.element(params.target).addClass(params.class);
                } else {
                    angular.element(params.target).removeClass(params.class);
                }
            }
        };

        angular.extend(params, scope.$eval(attr.waypointAddClass));

        if (params.target === 'body') {
            params.target = document.body;
        }

        new Waypoint(params);

    }

})(angular.module('app'), window.Waypoint);
