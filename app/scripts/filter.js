'use strict';

var app = angular.module('app');

app.filter('unsafe', function ($sce) { return $sce.trustAsHtml; });
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