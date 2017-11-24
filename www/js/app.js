// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('starter', ['ionic', 'firebase'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){

  $stateProvider.state('index', {
    url: '/index', 
    templateUrl: 'index.html'//path
  })

  $stateProvider.state('login', {
    url: '/login', 
    templateUrl: 'templates/login.html',//path
    controller: 'LoginCtrl'
  })

 .state('cadastro', {
    url: '/cadastro',
    templateUrl: 'templates/cadastro.html',
    controller: 'CadastroCtrl'
  })

  .state('listaFuncionarios', {
    url: '/listaFuncionarios',
    templateUrl: 'templates/listaFuncionarios.html',
    controller: 'ListaFuncionariosCtrl'
  })

  .state('registros', {
    url: '/registros',
    templateUrl: 'templates/registros.html'
  })

  .state('registroUsuarios', {
    url: '/registrUsuarios',
    templateUrl: 'templates/registroUsuarios.html',
    controller: 'registroUsuariosCtrl'
  })

  $stateProvider.state('registroHorarios', {
    url: '/registroHorarios', 
    templateUrl: 'templates/registroHorarios.html',//path
    controller: 'registroHorariosCtrl'
  })

  $urlRouterProvider.otherwise("/login");
})

.controller('IndexCtrl', function($scope) {
  console.log('IndexCtrl');
})

.controller('LoginCtrl', function($scope, $firebaseAuth, $firebaseObject, $state) {

  $scope.colaborador = {};

  $scope.entrar = function(colaborador) {

    $firebaseAuth().$signInWithEmailAndPassword(colaborador.email, colaborador.password)
      .then(function(firebaseUser) {
          // autenticado com sucesso.

          //https://registropontoapp.firebaseio.com/colaboradores/feSlwwxmtyPN0YKja0GW0NaWhcq2
          var ref = firebase.database().ref("colaboradores").child(firebaseUser.uid);
          $firebaseObject(ref).$loaded().then(function(dados) {
            if(dados.admin != null && dados.admin == true) {
              $state.go("listaFuncionarios");
            }
            else {
              $state.go("registroUsuarios");
            }
          })
                    
      })
      .catch(function(error) {
          // falha na autenticação.
          alert(error);
      });

  }
})

.controller('ListaFuncionariosCtrl', function($scope, $state, $firebaseArray, $firebaseAuth) {

  var ref = firebase.database().ref().child('colaboradores');
  $scope.colaboradores = $firebaseArray(ref);

  $scope.sair = function() {
    $firebaseAuth().$signOut().then(function() {
      $state.go('login');
    })
  }

})

.controller('RegistroHorariosCtrl', function($scope, $state, $firebaseArray, $firebaseAuth) {
  
    var ref = firebase.database().ref().child('registros');
    $scope.registros = $firebaseArray(ref);
  
    $scope.sair = function() {
      $firebaseAuth().$signOut().then(function() {
        $state.go('login');
      })
    }
  
  })


.controller('CadastroCtrl', function($scope,$state, $firebaseArray, $firebaseAuth) {

    $scope.enviar = function(colaborador){

      $firebaseAuth().$createUserWithEmailAndPassword(colaborador.email, colaborador.password)
        .then(function(firebaseUser) {

          // colaborador.id = firebaseUser.uid;

          var ref = firebase.database().ref().child('colaboradores').child(firebaseUser.uid);
          ref.set(colaborador);
          // $firebaseArray(ref).$add(colaborador);
    
          $state.go('listaFuncionarios');
        })        
      }
})

.controller('registroHorariosCtrl', function($scope, $state, $firebaseArray, $firebaseAuth) {
  
    var ref = firebase.database().ref().child('registros');
    $scope.colaboradores = $firebaseArray(ref);
  
    $scope.sair = function() {
      $firebaseAuth().$signOut().then(function() {
        $state.go('login');
      })
    }
  })

.controller('registroUsuariosCtrl', function($scope, $state, $firebaseArray, $firebaseObject, $firebaseAuth) {

  $scope.usuario = firebase.auth().currentUser;

  var ref = firebase.database().ref().child('registros').child($scope.usuario.uid);
  // var query = ref.orderByChild('entrada').limitToFirst(1);
  $scope.registros = $firebaseArray(ref);

  $scope.registrarEntrada = function(){
   
      $scope.registros.$add({
        entrada: new Date().getTime(),
        lat: -20,
        lng: -40,
        status: 'aberto'
      });
    }
    
  $scope.registrarSaida = function(id){

    var ref = firebase.database().ref("registros").child($scope.usuario.uid).child(id);
    $firebaseObject(ref).$loaded(function(registro) {
      registro.saida = new Date().getTime();
      
            registro.status = 'fechado';
      
            registro.$save().then(function() {
              alert('Registro finalizado');
            });
    })
  }
})



//  .factory('ContatoService', function(){

//    var database = [];

//    return {
//      read: function(){
//        return database;
//      },

//      create: function(objeto) {
//        database.push(objeto);
//      }
//    }
// }

  // $scope.registro = undefined;

  // for(var i = 0; i < $scope.registros.length; i++) {
  //   if($scope.registros[i].status == 'aberto') {
  //     $scope.registro = $scope.registros[i];
  //   }
  // }