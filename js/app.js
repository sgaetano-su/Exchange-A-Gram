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

            .state('feed', {
                url:'/feed',
                templateUrl:'/templates/feed.html',
                controller:'feedCtrl'
            })

            .state('feedItem', {
                url:'/feed/:id',
                templateUrl:'/templates/feed-item.html',
                controller:'feedItemCtrl'
            })

            .state('upload', {
                url:'/upload',
                templateUrl:'/templates/upload.html',
                controller:'uploadCtrl'
            })


            .state('profile', {
                url:'/profile/:id',
                templateUrl:'/templates/profile.html',
                controller:'profileCtrl',

            
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


    app.controller('feedCtrl', function($scope, $http, $rootScope){
        $scope.posts=[];
        $scope.pageCount = 1
        $http({
            url: 'https://exchangeagram.azurewebsites.net/api/media',
            method: 'GET',
            params: {
                token:$rootScope.token,
                page:$scope.pageCount,
                count:12, 
   
            }

            })
            .then(function(response) {
                console.log(response.data.data);
                $scope.posts = response.data.data;
            },
            function(error) {
                console.log(error);

        });

        $scope.loadmore = function() {
           
           $scope.pageCount = $scope.pageCount + 1;

            $http({
                url: 'https://exchangeagram.azurewebsites.net/api/media',
                method: 'GET',
                params: {
                    token:$rootScope.token,
                    page:$scope.pageCount,
                    count:12, 
   
                }
                
                })
                .then(function(response) {
                    console.log(response);

                    response.data.data.forEach(function(post) {
                        $scope.posts.push(post);
                    })
                    
                },
                function(error) {
                    console.log(error);
    
            });
        
        } 
    });
    
    app.controller('uploadCtrl', function($scope, $rootScope, $state, $window){
        let url = $window.location.href;

        if (url.includes('success=') && url.includes('id=')) { 
            let url_success = url.split('success=')[1].split('&')[0]
            let url_id = url.split('id=')[1].split('&')[0];

            $state.go('feedItem',{id:url_id});
        }
        
    });

    app.controller('feedItemCtrl', function($scope, $http, $rootScope, $stateParams) {
        $scope.posts = [];


        $http({
            url: 'https://exchangeagram.azurewebsites.net/api/media',
            method: 'GET',
            params: {
                token:$rootScope.token,
                count:12,
                id:$stateParams.id,      
            }

            })
            .then(function(response) {
                console.log(response.data.data);
                
                $scope.posts=response.data.data[0];

            },
            function(error) {
                console.log(error);

        });

    });

    app.controller('profileCtrl', function($scope,$stateParams, $http, $rootScope) {
        $scope.posts = [];

        $scope.profileinfo = [];

        $http({
            url: 'https://exchangeagram.azurewebsites.net/api/user',
            method: 'GET',
            params: {
                token:$rootScope.token,
                id:$stateParams.id,
            }

            })
            .then(function(response) {
                console.log(response.data.data);
                
                $scope.posts=response.data.data.media;
                
                $scope.profileinfo = response.data.data;
            },
            function(error) {
                console.log(error);

        });

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
        bindings:{
            post:'<'
        }

    })


    
})();