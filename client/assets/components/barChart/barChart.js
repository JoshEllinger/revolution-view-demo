(function () {
  angular
    .module('lucidworksView.components.barChart', ['gridshore.c3js.chart'])
    .directive('barChart', barChart);

  function barChart() {
    'ngInject';
    return {
      templateUrl: 'assets/components/barChart/barChart.html',
      scope: true,
      controller: Controller,
      controllerAs: 'vm',
      bindToController: {
        doc: '='
      }
    };
  }

  function Controller($log) {
    'ngInject';
    var vm = this;
    vm.chartObj = {
      data: {
        columns: []
      }
    };
    vm.getColorFromInt = getColorFromInt;
    vm.getCastNamesList = getCastNamesList;
    vm.chartId = makeId();

    init();

    ///////////

    function init() {
      populateChart();
    }

    var colors =[
      {name: 'teal',       value:'#009688'},
      {name: 'amber',      value:'#FFC107'},
      {name: 'deepOrange', value:'#FF5722'},
      {name: 'lightBlue',  value:'#03A9F4'},
      {name: 'lime',       value:'#CDDC39'},
      {name: 'pink',       value:'#E91E63'},
      {name: 'red',        value:'#F44336'},
      {name: 'cyan',       value:'#00BCD4'},
      {name: 'yellow',     value:'#FFEB3B'},
      {name: 'lightGreen', value:'#8BC34A'},
    ];

  /**
   * Gets a color based on an integer.
   * @memberOf ColorService
   * @param  {integer} integer The color is consistant based on the integer used.
   * @return {object}          Returns a color object in the format {name, value}
   */
    function getColorFromInt(integer){
      return colors[(integer % 10)];
    }

    function populateChart(type) {
      setChartType(type);
      vm.chartObj.columns = getFacebookLikeColumns();
    }

    function makeId() {
      var text = '';
      var possible = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';

      for (var i = 0; i < 5; i++) {
        text += possible.charAt(Math.floor(Math.random() * possible.length)); 
      }

      return text;
    }

    /**
   * Creates userActivityColumns from activity data.
   * @return {array} An array of columns.
   */
    function getFacebookLikeColumns(){
      var columns = [];
      var id = 0;


      columns.push(formatColumn(vm.doc['director_info.director_name'], [vm.doc['director_info.director_facebook_likes']], id));
      id++;

      // separate by email address
      // var emailsGrouped = _.groupBy(self.activities, function (n) { return n.lead_email_s; });
      _.forOwn(vm.doc, function (value, key) {
        var split = key.split('.');
        if (split.length === 3 && split[2] === 'actor_facebook_likes') {
          var actorIterator = split[1];
          columns.push(formatColumn(vm.doc['cast_info.' + actorIterator + '.actor_name'], [value], id));
          id++;
        }
      });

      $log.debug('getting columns',columns);
      return columns;
    }
    
    /**
     * Simply formats a column.
     * @param  {integer} id    column id
     * @param  {string} key    column key (email)
     * @param  {array} values  column values
     * @return {object}        An object combining elements.
     */
    function formatColumn(key, values, id){
      return {
        id: id,
        key: key,
        values: values
      };
    }

    /**
     * Sets the chart type
     * @param {[type]} type = 'bar' [description]
     */
    function setChartType(type){
      vm.chartObj.type = type;
      switch(type){
      case 'bar':
        vm.chartObj.width = {};
        vm.chartObj.width.ratio = 1;
      }
    }

  /**
   * Get a list of activity types.
   *
   * @return {array} Activity names.
   */
    function getCastNamesList() {
      var list = [];
      list.push(vm.doc['director_info.director_name']);
      _.forOwn(vm.doc, function (value, key) {
        var split = key.split('.');
        if (split.length === 3 && split[2] === 'actor_name') {
          list.push(value);
        }
      });
      return list;
    }


  }
})();