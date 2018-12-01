'use strict';

// Declare app level module which depends on views, and core components
angular.module('app', [
    'ngRoute',
]).
    config(['$locationProvider', '$routeProvider', function ($locationProvider, $routeProvider) {
        $locationProvider.hashPrefix('');
        $routeProvider.when('/app',{
            templateUrl : './views/questions.html',
            controller:'questionsController'
        }).when('/app/:id', {
            templateUrl: './views/question.html',
            controller: 'questionController'
        }).otherwise({ redirectTo: '/app' });
    }]);