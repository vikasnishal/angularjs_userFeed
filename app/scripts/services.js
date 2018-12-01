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