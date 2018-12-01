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
'use strict';

var app = angular.module('app');
app.controller('questionsController', ['$scope', 'appAjaxService','$location', function ($scope, appService,$location) {
    $scope.answers = appService.getAnswerData();
    $scope.questions = appService.getQuestionsData();
    if ($scope.questions.length == 0) {
        appService.getQuestionsAJAX().then(function () {
            $scope.questions = appService.getQuestionsData();
            appService.getAnswersAJAX().then(function () {
                $scope.answers = appService.getAnswerData();
            })
        })
    }
    $scope.upvote = function (question){
        question.upvotes++
        calculateVotes(question);
    };
    function calculateVotes(question){
        question.votes = parseInt(question.upvotes) - parseInt(question.downvotes);
    }
    $scope.downvote = function(answer){
        answer.downvotes++
        calculateVotes(answer);
    };
    
    $scope.openDetails = function(id){
        $location.path('/app/'+id)
    };
}]);
app.controller('questionController', ['$scope', 'appAjaxService', '$location', '$routeParams', function ($scope, appService, $location, $routeParams) {
    console.log($routeParams);
    $scope.answers = appService.getAnswerData();
    $scope.question = {};
    var questions = appService.getQuestionsData();
    if (questions.length > 0) {
        $scope.question = setQuestion(questions, $routeParams.id);
    } else {
        appService.getQuestionsAJAX().then(function () {
            $scope.question = setQuestion(appService.getQuestionsData(), $routeParams.id);
            appService.getAnswersAJAX().then(function () {
                $scope.answers = appService.getAnswerData();
            })
        })
    };
    function setQuestion(questions, id) {
        var questionObj = {};
        questions.forEach(function (question) {
            if (question.Id === id) {
                questionObj = question;
            }
        })
        return questionObj;
    };
    $scope.upvote = function (question) {
        question.upvotes++
        calculateVotes(question);
    };
    function calculateVotes(question) {
        question.votes = parseInt(question.upvotes) - parseInt(question.downvotes);
    }
    $scope.downvote = function (answer) {
        answer.downvotes++
        calculateVotes(answer);
    };
    
    
}]);
'use strict';

var app = angular.module('app');

app.filter('unsafe', ["$sce", function ($sce) { return $sce.trustAsHtml; }]);
app.filter('filterAnswerArray',function(){
    return function(arr,id){
        var filterArray = [];
        arr.forEach(function(el){
            if(el["Question-Id"] === id){
                filterArray.push(el);
            }
        })
        return filterArray;
    }
});
var app = angular.module("app");

app.service('appAjaxService',['$http','$q',function($http,$q){
    var service = this;
    this.questions = [];
    this.answers = [];
    function setQuestions(questions) {
        questions.forEach(function(question) {
            if (!question.upvotes) {
                question.upvotes = 0
            }
            if (!question.downvotes) {
                question.downvotes = 0
            }
            question.votes = parseInt(question.upvotes) - parseInt(question.downvotes);
        });
        this.questions = questions;
    };
    var bindSetQuestions = setQuestions.bind(this);
    this.getQuestionsAJAX=function(){
        var deferred = $q.defer()
        $http.get('https://api.myjson.com/bins/dck5b').then(function(result){
            if(result.data && Array.isArray(result.data.feed_questions)){
                bindSetQuestions(result.data.feed_questions)
                deferred.resolve();
            } 
        },function(err){
            deferred.reject(err)
        })
        return deferred.promise;
    };
    function setAnswers(answers){
        answers.forEach(function(answer) {
            if (!answer.upvotes) {
                answer.upvotes = 0
            }
            if (!answer.downvotes) {
                answer.downvotes = 0
            }
            answer.votes = parseInt(answer.upvotes) - parseInt(answer.downvotes);
        });
        this.answers = answers;
    }
    var bindSetAnswers = setAnswers.bind(this);
    this.getAnswersAJAX = function(){
        var deferred = $q.defer();
        $http.get('https://api.myjson.com/bins/hildr').then(function(result){
            if(result.data && Array.isArray(result.data.feed_answers)){
                bindSetAnswers(result.data.feed_answers);
                deferred.resolve()
            }
        },function(err){
            deferred.reject(err);
        })
        return deferred.promise;
    }
    this.getQuestionsData = function () {
        return this.questions;
    }
    this.getAnswerData = function(){
        return this.answers;
    }
}]);