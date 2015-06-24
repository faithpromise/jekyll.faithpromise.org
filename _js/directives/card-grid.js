(function (module) {
    'use strict';

    module.directive('cardGrid', directive);

    function directive() {
        return {
            restrict: 'A',
            link: Link,
            scope: {}
        };
    }

    function Link(scope, elem) {

        var i,
            paragraph,
            heighest = 0,
            textParagraphs = angular.element(elem).find('p');

        for(i = 0; i < textParagraphs.length; i++) {

            paragraph = angular.element(textParagraphs[i]);

            if (paragraph.hasClass('Card-text')) {
                heighest = Math.max(textParagraphs[i].offsetHeight, heighest);
            }

        }

        for(i = 0; i < textParagraphs.length; i++) {

            paragraph = angular.element(textParagraphs[i]);

            if (paragraph.hasClass('Card-text')) {
                paragraph.css('min-height', heighest + 'px');
            }

        }

    }

})(angular.module('app'));