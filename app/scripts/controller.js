'use strict';

var app = angular.module('app');
app.controller('questionsController', ['$scope', 'appAjaxService','$location', function ($scope, appService,$location) {
    $scope.answers = appService.getAnswerData();
    $scope.questions = appService.getQuestionsData();
    $scope.showAddButton = true;
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
    $scope.addQuestion=function(text){
        if(text){
            var questionObj = {
                Text: text,
                created_at: new Date(),
                Id : ($scope.questions.length+1).toString(),
                upvotes : 0,
                downvotes : 0,
                votes : 0
            };
            $scope.questions.unshift(questionObj);
            $scope.showAddButton = true;
        }
    }
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