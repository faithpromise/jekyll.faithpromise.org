(function(angular) {

    angular.module('app', [
        'siteConfig',
        'ngAnimate',
        'ui.bootstrap.dropdown',
        'template-cache'
    ]);

    angular.module('template-cache', []); // Empty for dev. Overwritten on production

})(angular);
