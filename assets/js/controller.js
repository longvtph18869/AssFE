const app = angular.module("myApp", ["ngRoute"]);
app.config(function ($routeProvider, $locationProvider) {
  $locationProvider.hashPrefix("");
  $routeProvider
    .when("/shop", {
      templateUrl: "pages/shop.html",
      controller: "myController",
    })
    .when("/products/:name", {
      templateUrl: "pages/product.html",
      controller: "myController",
    })
    .when("/cart", {
      templateUrl: "pages/cart.html",
      controller: "myController",
    })
    .otherwise({
      redirectTo: "/",
      templateUrl: "pages/home.html",
      controller: "myController",
    });
});
let productApi = "https://634cfd91acb391d34a90bab4.mockapi.io/api/v1/products";
let categoryApi =
  "https://634cfd91acb391d34a90bab4.mockapi.io/api/v1/categorys";
app.controller("myController", function ($scope, $routeParams, $http, Cart) {
  $scope.cart = Cart.getCart("myApp");
  $scope.products = [];
  $scope.categorys = [];
  $http.get(productApi).then(function (response) {
    $scope.products = response.data;
  });
  $http.get(categoryApi).then(function (response) {
    $scope.categorys = response.data;
  });

  $scope.catFun = function (category) {
    $scope.filtered = category;
  };

  $scope.getFilter = function () {
    return { category: $scope.filtered };
  };
  //gọi detail product
  if ($routeParams.name != null) {
    $http.get(productApi).then(function successCallback(response) {
      angular.forEach(response.data, function (value, key) {
        if (value.name == $routeParams.name) {
          $scope.product = value;
        }
      });
    });
  }
  $scope.findNameById = function (id) {
    for (var i = 0; i < $scope.categorys.length; i++) {
      if ($scope.categorys[i].id === id) {
        return $scope.categorys[i].name;
      }
    }
  };
  $(".input-counter").each(function () {
    var spinner = jQuery(this),
      input = spinner.find('input[type="text"]'),
      btnUp = spinner.find(".plus-btn"),
      btnDown = spinner.find(".minus-btn"),
      min = input.attr("min"),
      max = input.attr("max");
    btnUp.on("click", function () {
      var oldValue = parseFloat(input.val());
      if (oldValue >= max) {
        var newVal = oldValue;
      } else {
        var newVal = oldValue + 1;
      }
      spinner.find("input").val(newVal);
      spinner.find("input").trigger("change");
    });
    btnDown.on("click", function () {
      var oldValue = parseFloat(input.val());
      if (oldValue <= min) {
        var newVal = oldValue;
      } else {
        var newVal = oldValue - 1;
      }
      spinner.find("input").val(newVal);
      spinner.find("input").trigger("change");
    });
  });
});

//Cart
app.service("Cart", [
  "$rootScope",
  function ($rootScope) {
    //--------------- Initialize shopping cart ----------------------//
    this.getCart = function (cartName) {
      this.cartName = cartName;
      this.clearCart = false;
      this.items = [];
      // load items from local storage when initializing
      this.loadItems();
      // save items to local storage when unloading
      var self = this;
      $(window).unload(function () {
        if (self.clearCart) {
          self.clearItems();
        }
        self.saveItems();
        self.clearCart = false;
      });
      return this;
    };

    //------ load data from localStorage of Browser --------------------------------------------//
    this.loadItems = function () {
      var items =
        localStorage != null ? localStorage[this.cartName + "_items"] : null;
      console.log(localStorage.getItem(this.cartName + "_items"));
      if (items != null && JSON != null) {
        try {
          var items = JSON.parse(items);
          for (var i = 0; i < items.length; i++) {
            var item = items[i];
            if (item.id != null) {
              item = new cartItem(
                item.id,
                item.name,
                item.price,
                item.quantity
              );
              this.items.push(item);
            }
          }
        } catch (err) {
          // ignore errors while loading...
        }
      }
    };

    //----- Add new item /(increase/decrease) already selected  item to cart -----------------------------//
    this.addItem = function (id, name, price, quantity) {
      quantity = this.toNumber(quantity);
      if (quantity != 0) {
        // update quantity for existing item
        var found = false;
        for (var i = 0; i < this.items.length && !found; i++) {
          var item = this.items[i];
          if (item.id == id) {
            found = true;
            item.quantity = this.toNumber(item.quantity) + quantity;
            if (item.quantity <= 0) {
              this.items.splice(i, 1);
            }
          }
        }

        // new item, add now
        if (!found) {
          var item = new cartItem(id, name, price, quantity);
          this.items.push(item);
        }

        // save changes
        this.saveItems();
      }
    };

    // ----  number converter function ------------------------------------//
    this.toNumber = function (value) {
      value = value * 1;
      return isNaN(value) ? 0 : value;
    };

    //--------------- save item to localStorage ---------------------------//
    this.saveItems = function () {
      if (localStorage != null && JSON != null) {
        localStorage[this.cartName + "_items"] = JSON.stringify(this.items);
      }
    };

    //--------------------clear the localStorage and cart --------------------------//
    this.clearItems = function () {
      this.items = [];
      this.saveItems();
    };

    //--- get total price of products--------------------------------//
    this.getTotalPrice = function (id) {
      var total = 0;
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (id == null || item.id == id) {
          total += this.toNumber(item.quantity * item.price);
        }
      }
      return total;
    };
    this.getLength = function () {
      var a = 0;
      for (var i = 0; i < this.items.length; i++) {
        a += 1;
      }
      return a;
    };

    //-----------get total Quantity of products---------------------//
    this.getTotalCount = function (id) {
      var count = 0;
      for (var i = 0; i < this.items.length; i++) {
        var item = this.items[i];
        if (id == null || item.id == id) {
          count += this.toNumber(item.quantity);
        }
      }
      return count;
    };

    //----- create a new cartItem to store in localStorage --------------//
    function cartItem(id, name, price, quantity) {
      this.id = id;
      this.name = name;
      this.price = price * 1;
      this.quantity = quantity * 1;
    }
  },
]);
