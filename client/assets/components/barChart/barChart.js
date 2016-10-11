(function () {
  angular.module('lucidworksView.components.barChart', ['gridshore.c3js.chart'])
      .directive('barChart', barChart);

  function barChart() {
    'ngInject';
    return {
      templateUrl: 'assets/components/barChart/barChart.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      replace: true
    };
  }

  function Controller() {
    
  }
})();