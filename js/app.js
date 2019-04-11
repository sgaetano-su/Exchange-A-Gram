(function(){
    
    //Create a module
    let app = angular.module('app', ['ui.router', 'istAuth']);


    //Config Block
    app.config(function($stateProvider, $urlRouterProvider) {
        //Configure the routes for the application
		$stateProvider
			.state('index', {
				url: '',
				templateUrl: '/templates/index.html',
				controller: 'indexCtrl'
            })
        
        //If the user requests a URL that isn't mapped to a route, redirect them to the homepage
        $urlRouterProvider.otherwise('index');
	});


    //Run Block
    app.run(function($rootScope, $auth, $state){
        //Globally available functions to toggle Bootstrap modals
        $rootScope.openModal = function(selector) {
            $(selector).modal('show');
        };

        $rootScope.closeModal = function(selector) {
            $(selector).modal('hide');
        };


        //Check to see if the user is already logged in. If not, redirect to the homepage
        var isLoggedIn = $auth.checkAuth();
        if(!isLoggedIn) {
            $state.go('index');
        }
        //If user is already logged in, set the $rootScope.user and $rootScope.token objects
        $auth.loginFromSaved();
    });


    //Controllers
    app.controller('indexCtrl', function(){
        //Controller logic here
    });


    //Components

    
})();