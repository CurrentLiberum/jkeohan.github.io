/*
  Please add all Javascript code to this file.
*/

var feedrApp = angular.module('feedrApp', ['ui.router', 'ngAnimate'])

//used for routing
feedrApp.config(function($stateProvider, $urlRouterProvider) {
  $urlRouterProvider.otherwise('/');
  $stateProvider
    // .state('/', {
    //   url:"/",
    //   templateUrl:'partials/home.html'
    // })
    // .state('/mapping', {
    //   url:"/mapping",
    //   templateUrl:"chloropleth/mapping.html"
    // })
})

feedrApp.controller('apiCtrl', ['$scope','$rootScope','$http', function($scope,$rootScope,$http){
      $scope.test = [];
      $scope.sources = {};
      $scope.sourceKeys; 
      $scope.activeSource = [];
      var url = "http://digg.com/api/news/popular.json"
   
      $scope.sources = {
        Mashable: {
          url: "https://accesscontrolalloworiginall.herokuapp.com/http://mashable.com/stories.json",
          keys: {
            main: 'new',
            title: 'title',
            image: "image",
            rank: 'shares.total',
            description: 'content.plain',
            tags: 'channel',  
            url: 'link'
          },
          data: {
            articles: []
          }
        },
        Digg: {
          url: 'https://accesscontrolalloworiginall.herokuapp.com/http://digg.com/api/news/popular.json',
          //url: 'http://digg.com/api/news/popular.json',
          keys: {
            main: 'data.feed',
            title: "content.title",
            image: "content.media.images[0].url",
            rank: "digg_score",
            description: "content.description",
            tags: 'content.tags',//'content.tags[0].name'
            url: 'content.url'
          },
          data: {
            articles: [],
          }
        },
         Reddit: {
              url: "https://www.reddit.com/top.json",
          keys: {
            articles: "new",
            image: "feature_image"
          }
        }
      }


    function buildObjPath(json,obj,key) {
      //locate key and determine if if has more than one path
      if((obj.key).split(".").length > 1) { console.log(obj.key)}
      return obj.key
    }
    $scope.sourceKeys = Object.keys($scope.sources)
    //console.log($scope.sourceKeys)
    //if search is !empty show currently choosen feed
    //if search is true than filter article titles for search term
    //this will require attaching event listener to input field
    //and calling a function that filters and then renders results

    // $.get($scope.url)
    // .done(function(response) { console.log(response)})
    // .fail(function(response) {console.log(response )})

    //console.log($scope.sources.Digg)
    function buildObject () {};
    function updateSearchName(sourceName) { 
      $('.sourceName').html(sourceName)
    };
    // this 
    $scope.overlay = function(source) {
      $('#popUp').removeClass()
      $('#popUp').find('h1').html(source.title)
      $('#popUp').find('p').html(source.description)
      $('#popUp').find('.popUpAction').attr('href',source.url)
    }

    function objPath(layer, path, value) {
      //console.log("layer: ",layer)
      //console.log("path: ",path)
    var i = 0,
    path = path.split('.');
      //console.log(path) 
    for (; i < path.length; i++)
        if (value != null && i + 1 === path.length)
             { layer[path[i]] = value; }
        else { 

          //console.log("layer before concatenation: ", layer)
          console.log("path as path[i] : ", path[i])
          console.log("layer as layer[path[i]]: ", layer[path[i]])
          layer = layer[path[i]]; } 
          //console.log(layer)
    return layer;
};

    function createObj(articles,source,mediaSourceKeys){
        //var articles = objPath(response.data,mediaSourceKeys.main)//.data.feed
          $scope.activeSource = [];
          var obj = {}
          $.each(articles, function(i,e){
            obj.title = objPath(articles[i],mediaSourceKeys.title)
            if(source == "Digg") {
              obj.img = articles[i]['content']['media']['images'][0].url
            } else { 
              obj.img = objPath(articles[i],mediaSourceKeys.image) }
            obj.count = objPath(articles[i],mediaSourceKeys.rank)
            obj.description = objPath(articles[i],mediaSourceKeys.description)
            if(source == "Digg") {
              obj.tags = [articles[i]['content']['tags'][0].name]
            } else { 
              obj.tags = [objPath(articles[i],mediaSourceKeys.tags)] }
            obj.url = objPath(articles[i],mediaSourceKeys.url)
 
            $scope.sources[source].data.articles.push(obj)
            $scope.activeSource.push(obj)
            obj = {}
          })//each
    }

    $scope.getContent =  function(url,source){
      $('.loader').removeClass("hidden")
      var mediaSourceKeys = $scope.sources[source].keys

      $http.get(url.url)
        .then(function(response) {
          console.log(mediaSourceKeys)
          var articles = objPath(response.data,mediaSourceKeys.main)//.data.feed
          console.log(articles)
          createObj(articles,source,mediaSourceKeys)
          updateSearchName(source)
        }, function(response) {
        //Second function handles error
          alert("Something went wrong");
        }).finally(function(){
          $('.loader').addClass("hidden")
          console.log($scope.activeSource)
        })//then

        //this doesn't work while inside the controller
        //opted to use ng-click
        // $('.feeds').on("click", "li", function(){
        //     var val = $(this).val()
        //    console.log(val,$scope.sources[val])
        //   getContent($scope.sources[val],val)
        // })
       
    }//function
}])

var help = models
help.hello("world")

function value(layer, path, value) {
    var i = 0,
        path = path.split('.');
  console.log(path) 
    for (; i < path.length; i++)
        if (value != null && i + 1 === path.length)
             { console.log("yes"); layer[path[i]] = value; }
        else { layer = layer[path[i]]; } 
    console.log(layer)
    return layer;
};
