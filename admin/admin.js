const admin = angular.module("myAdmin", ["ngRoute"]);
admin.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");
  $routeProvider
    .when("/product-manager", {
      templateUrl: "pages-admin/product-manager.html",
      controller: "adminController",
    })
    .when("/category-manager", {
      templateUrl: "pages-admin/category-manager.html",
      controller: "adminController",
    })
    .otherwise({
      templateUrl: "pages-admin/product-manager.html",
      controller: "adminController",
    });
});
let productApi = "https://634cfd91acb391d34a90bab4.mockapi.io/api/v1/products";
let categoryApi =
  "https://634cfd91acb391d34a90bab4.mockapi.io/api/v1/categorys";
admin.controller("adminController", function ($scope, $http) {
  $scope.products = [];
  $scope.categorys = [];
  $http.get(productApi).then(function (response) {
    $scope.products = response.data;
  });
  $http.get(categoryApi).then(function (response) {
    $scope.categorys = response.data;
  });
  $scope.findNameById = function (id) {
    for (var i = 0; i < $scope.categorys.length; i++) {
      if ($scope.categorys[i].id === id) {
        return $scope.categorys[i].name;
      }
    }
  };
  $scope.onFormProductSubmit = function (event) {
    event.preventDefault();
    for (var i = 0; i < $scope.categorys.length; i++) {
      if ($scope.categorys[i].name === $scope.product.category) {
        $scope.product.category = $scope.categorys[i].id;
      }
    }
    $http
      .post(productApi, $scope.product)
      .then(function () {
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  $scope.onFormCategorySubmit = function (event) {
    event.preventDefault();
    $http
      .post(categoryApi, $scope.category)
      .then(function () {
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };

  $scope.deleteProduct = function (item) {
    let id = item.id;
    $http
      .delete(productApi + "/" + id)
      .then(function () {
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  $scope.deleteCategory = function (item) {
    let id = item.id;
    $http
      .delete(categoryApi + "/" + id)
      .then(function () {
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  $scope.selectProduct = function (item) {
    let id = item.id;
    $http
      .get(productApi + "/" + id)
      .then(function (response) {
        $scope.product = response.data;
        for (var i = 0; i < $scope.categorys.length; i++) {
          if ($scope.categorys[i].id === $scope.product.category) {
            $scope.product.category = $scope.categorys[i].name;
          }
        }
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  $scope.selectCategory = function (item) {
    let id = item.id;
    $http
      .get(categoryApi + "/" + id)
      .then(function (response) {
        $scope.category = response.data;
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  $scope.editProduct = function (item) {
    let id = item.id;
    for (var i = 0; i < $scope.categorys.length; i++) {
      if ($scope.categorys[i].name === $scope.product.category) {
        $scope.product.category = $scope.categorys[i].id;
      }
    }
    $http
      .put(productApi + "/" + id, $scope.product)
      .then(function () {
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  $scope.editCategory = function (item) {
    let id = item.id;
    $http
      .put(categoryApi + "/" + id, $scope.category)
      .then(function () {
        window.location.reload();
      })
      .catch(function (error) {
        console.log(error);
      });
  };
  $scope.catFun = function (catVal) {
    $scope.filtered = catVal;
  };

  $scope.getFilter = function () {
    if ($scope.filtered == "All") {
      return;
    }
    return { category: $scope.filtered };
  };
});
