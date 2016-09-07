// public/core.js
var angular;

const meanChat = angular.module('meanChat', []);


meanChat.controller('mainController', ($scope, $http) => {
  $scope.formData = {};

  $http.get('/api/v0/todos')
       .success((data) => {
         $scope.todos = data;
         console.log(data);
       })
       .error((data) => {
         console.log('Error: ' + data);
       });

  $scope.createTodo = () => {
    $http.post('/api/v0/todos', $scope.formData,
               {headers: {'Content-Type': 'application/json'}})
         .success((data) => {
           $scope.formData = {};
           $scope.todos = data;
           console.log(data);
         })
         .error((data) => {
           console.log('Error: ' + data);
         });
  };

  $scope.deleteTodo = (id) => {
    $http.delete('/api/v0/todos/' + id)
         .success((data) => {
           $scope.todos = data;
           console.log(data);
         })
         .error((data) => {
           console.log('Error: ' + data);
         });
  };
});

