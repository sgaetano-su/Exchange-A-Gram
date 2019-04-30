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


    app.controller('feedCtrl', function(){
        //Controller logic here
    });

    app.controller('feedItemCtrl', function(){
        //Controller logic here
    });

    app.controller('uploadCtrl', function(){
        //Controller logic here
    });

    app.controller('profileCtrl', function(){
        //Controller logic here
    });



    app.controller('mainCtrl', function($scope, $auth, $rootScope) {
        $scope.username = '';
        $scope.password = '';

        $scope.log_user_in = function() {
            $auth.login($scope.username, $scope.password, function() {
                console.log('user logged in successfully');
                //Closes Modal Automatically
                $rootScope.closeModal('#modal_login');

            });
        }

        $scope.log_user_out = function() {

        $auth.logout()
            
        }
    });


    //Components
    app.component('mainHeader', {
        templateUrl:'/templates/main-header.html', 
        controller: 'mainCtrl'

    })

    app.component('postPreview', {
        templateUrl:'/templates/post-preview.html', 
        controller: 'indexCtrl'

    })

    app.component('index', {
        templateUrl:'/templates/index.html', 
        controller: 'indexCtrl'

    })

    app.component('feed', {
        templateUrl:'/templates/feed.html', 
        controller: 'mainCtrl'

    })

    app.component('feedItem', {
        templateUrl:'/templates/feed-item.html', 
        controller: 'mainCtrl'

    })

    app.component('upload', {
        templateUrl:'/templates/upload.html', 
        controller: 'mainCtrl'

    })

    app.component('profile', {
        templateUrl:'/templates/profile.html', 
        controller: 'mainCtrl'

    })


    
})();