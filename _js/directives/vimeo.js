(function (module) {
    'use strict';

    module.directive('vimeo', directive);

    function directive() {
        return {
            template: '<iframe ng-src="{{ src }}" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>',
            restrict: 'E',
            controller: Controller,
            //replace: true,
            scope: {
                id: '@'
            }
        };
    }

    Controller.$inject = ['$scope', '$sce', '$window', 'localStorageService', 'LOCAL_STORAGE_KEYS'];

    function Controller($scope, $sce, $window, localStorageService, LOCAL_STORAGE_KEYS) {

        init();

        removeAutoPlay();

        function init() {
            var autoplay = shouldAutoPlay();
            $scope.src = $sce.trustAsResourceUrl('https://player.vimeo.com/video/' + $scope.id + '?title=0&byline=0&portrait=0&autoplay=' + autoplay);
        }

        function shouldAutoPlay() {
            return (localStorageService.get(LOCAL_STORAGE_KEYS.AUTO_PLAY_VIDEO) == $window.location.pathname) ? 1 : 0;
        }

        function removeAutoPlay() {
            localStorageService.remove(LOCAL_STORAGE_KEYS.AUTO_PLAY_VIDEO);
        }

    }

})(angular.module('app'));