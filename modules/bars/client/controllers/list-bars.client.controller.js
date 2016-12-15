(function () {
  'use strict';

  angular
    .module('bars')
    .controller('BarsListController', BarsListController);

  BarsListController.$inject = ['BarsService', 'CurrentValuesService', 'HighValuesService', '$scope', 'Socket','Authentication', '$state'];


  function BarsListController(BarsService, CurrentValuesService, HighValuesService, $scope, Socket, Authentication, $state) {
    var vm = this,
    barsOpen = [],
    barsClose = [],
    barsHigh = [],
    barsLow = [],
    barsDates = [],
    barsAnnotation = [],
    barsAnnotationD3 = [],
    barsAnnotationD4 = [],
    entery = {},
    enteryD4 = {},
    currentValue = {},
    highValues = [];
    $scope.dailyResult = {
      startTime: null,
      endTime: null,
      closedDeals: 0,
      contractAmountD2: 0,
      contractAmountD3: 0,
      contractAmountD4: 0,
      profitD2: 0,
      profitD3: 0,
      profitD4: 0
    };
    $scope.tab = 2;
    $scope.roles = (Authentication.user && Authentication.user.roles.length) ? Authentication.user.roles : ['guest'];
    $scope.isGuest = ($scope.roles[0]==='guest') ? true : false;

    if(!Authentication.user){
      $state.go('home');
    }

    BarsService.query(function(bars){
      CurrentValuesService.query(function(value){
        HighValuesService.query(function(highValues1){
          highValues=highValues1;
          currentValue = value[0];
          $scope.dailyResult.contractAmountD2 = (bars&&bars[bars.length-1]) ? bars[bars.length-1].contractsAmountD2 : 0; //enter non accumulated data to table
          $scope.dailyResult.contractAmountD3 = (bars&&bars[bars.length-1]) ? bars[bars.length-1].contractsAmountD3 : 0;
          $scope.dailyResult.contractAmountD4 = (bars&&bars[bars.length-1]) ? bars[bars.length-1].contractsAmountD4 : 0;
          $scope.dailyResult.startTime = (bars&&bars[0]) ? bars[0].closeTime : new Date();
          $scope.dailyResult.endTime = (bars&&bars[bars.length-1]) ? bars[bars.length-1].closeTime : new Date();
          
          for (var i=0;i<bars.length;i++)// arrange data to draw candlestick chart
            pushBar(bars[i]);
          drawChart();
        });

      });
    });

    

    Socket.on('new bar', function(bar){
      $scope.dailyResult.endTime = bar.closeTime;
      pushBar(bar);
      drawChart();
    });
    Socket.on('current value update', function(newValue){
      currentValue = newValue;
      drawChart();
    });
    Socket.on('high value update', function(newValues){
      highValues = highValues.concat(newValues);
      drawChart();
    });

    $scope.setTab = function(tabNum){
      if (tabNum ===2 || tabNum ===3 || tabNum ===4) {
        $scope.tab = tabNum;
        drawChart();
      }
    };
    

    function pushBar(bar){
      var xval = barsOpen.push(parseFloat(bar.openPrice));
      barsClose.push(parseFloat(bar.closePrice));
      barsHigh.push(parseFloat(bar.highPrice));
      barsLow.push(parseFloat(bar.lowPrice));
      barsDates.push(bar.startTime);
      $scope.dailyResult.profitD2 += bar.profit;
      $scope.dailyResult.profitD3 += bar.profitD3;
      $scope.dailyResult.profitD4 += bar.profitD4;
      var annotation = resolveAnnotation(bar,xval-1);// entery and enteryD4 are opened here
      if (annotation) {
        barsAnnotation.push(annotation);
        annotation = resolveAnnotationD3(bar,xval-1);// entery is closed here
        if (annotation)
          barsAnnotationD3.push(annotation);
        annotation = resolveAnnotationD4(bar,xval-1);// enteryD4 is closed here
        if (annotation)
          barsAnnotationD4.push(annotation);
      }

    }

    function drawChart(){
      var fig = PlotlyFinance.createCandlestick({
        open: barsOpen,
        high: barsHigh,
        low: barsLow,
        close: barsClose,
        //x: barsDates
      });
      //
      //fig.layout.yaxis.fixedrange=false;
      //fig.layout.paper_bgcolor = '#eee';
      fig.layout.xaxis.showticklabels=false; // make the x values invisible
      fig.layout.width = angular.element(document.getElementsByClassName('plotly'))[0].clientWidth;
      fig.layout.yaxis.dtick = 0.25;
      //

      
      //$scope.data = fig.data;
      $scope.layout = fig.layout;
      $scope.options = {showLink: false, displayLogo: false};
      $scope.plotlyEvents = function (chart) {
        chart.on('plotly_selected', function(event){
          if (event) {
            $timeout(function() {
              $scope.NumberOfSelectedPoints = event.points.length;
            });
          }
        });
      };

      
      fig.data.push({  // add the current value to the chart
        x:[barsOpen.length],
        y:[currentValue.currentValue],
        mode:'markers',
        opacity:1,
        marker:{color:'blue', size:[20]},
        name: 'Current Value'
      });
      
      // the user is admin
      var highValuesTrace={type:'scatter', x:[], y:[]};
      if ($scope.roles.indexOf('admin') !== -1){
        for (let i=0,j=0;i<barsDates.length&&j<highValues.length;i++){
          console.log(barsDates[i]<highValues[j].timeOfDay);
          // if (barsDates[i]<highValues[j].timeOfDay && !(barsDates[i+1]<highValues[j].timeOfDay)){
          //   console.log('in condition');
          //   highValuesTrace.x.push(i);
          //   highValuesTrace.y.push(highValues[j].highValue);
          //   //maybe add text
          //   j++;
          // }
        }
        fig.data.push(highValuesTrace);
        $scope.chartPlot = fig.data;
      }
      // the user is guest
      else {
        //delete unneeded data
        fig.data=[];
        barsOpen = [];
        barsClose = [];
        barsHigh = [];
        barsLow = [];
        barsDates= [];
        barsAnnotation = [];
        barsAnnotationD3 = [];
        //create trace
        for (let i=0;i<highValues.length;i++) {
          if (i+1<highValues.length&&highValues[i].highValue>highValues[i+1].highValue){
            barsOpen.push(highValues[i].highValue);
            barsClose.push(highValues[i].highValue-0.5);
            barsHigh.push(highValues[i].highValue);
            barsLow.push(highValues[i].highValue-0.5);
            barsDates.push(highValues[i].timeOfDay);
          }
          else{
            barsOpen.push(highValues[i].highValue-0.5);
            barsClose.push(highValues[i].highValue);
            barsHigh.push(highValues[i].highValue);
            barsLow.push(highValues[i].highValue-0.5);
            barsDates.push(highValues[i].timeOfDay);
          }
        }
        var fig2=PlotlyFinance.createCandlestick({
          open: barsOpen,
          close: barsClose,
          high: barsHigh,
          low: barsLow,
          dates: barsDates
        });
        $scope.chartPlot = fig2.data;
      }
      if ($scope.tab === 2)
        fig.layout.annotations = barsAnnotation;
      if ($scope.tab === 3)
        fig.layout.annotations = barsAnnotationD3;
      if ($scope.tab === 4)
        fig.layout.annotations = barsAnnotationD4;
    }

    function resolveAnnotation(bar, xval){
      if (bar.sellFilledAt) {
        entery = {eType:'sell'};
        enteryD4 = {eType:'sell'};
        if (bar.missedHit===-1){
          entery.missed=true;
          enteryD4.missed=true;
        }
        else{
          entery.missed=false;
          enteryD4.missed=false;
        }
        return {text:'Sell', x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
      }
      if (bar.buyFilledAt){
        entery = {eType:'buy'};
        enteryD4 = {eType:'buy'};
        if (bar.missedHit===-1){
          entery.missed=true;
          enteryD4.missed=true;
        }
        else{
          entery.missed=false;
          enteryD4.missed=false;
        }
        return {text:'Buy', x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
      }
      if (bar.profitTakenAt)
        return {text:'e-profit', x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
      if (bar.stoplossHitAt)
        return {text:'e-stoploss', x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
      return false;
    }
    function resolveAnnotationD3(bar, xval){// not implemented yet
      var text, annotation;
      if (bar.sellFilledAt) {
        annotation = {text:'Sell', x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
        if (entery.missed){
          annotation.text = 'Missed ' + annotation.text;
          annotation.font = {color:'red'};
        }
        return annotation;
      }
      if (bar.buyFilledAt){
        annotation = {text:'Buy', x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
        if (entery.missed) {
          annotation.text = 'Missed ' + annotation.text;
          annotation.font = {color:'red'};
        }
        return annotation;
      }
      if (bar.profitTakenAt) {
        text = 'e-profit';
        if (entery.eType==='buy' && entery.missed)
          return false;
        entery = {}; //buy entery is closed
        if (isToday(bar.closeTime)){
          $scope.dailyResult.closedDeals ++;
        }
        return {text:text, x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
      }
      if (bar.stoplossHitAt) {
        if (entery.eType==='sell' && entery.missed)
          return false;
        entery = {}; //sell entery is closed
        if (isToday(bar.closeTime)){
          $scope.dailyResult.closedDeals ++;
        }
        return {text:'e-stoploss', x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
      }
      return false;
    }

        function resolveAnnotationD4(bar, xval){// not implemented yet
      var text, annotation;
      if (bar.sellFilledAt) {
        annotation = {text:'Sell', x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
        if (enteryD4.missed){
          annotation.text = 'Missed ' + annotation.text;
          annotation.font = {color:'red'};
        }
        return annotation;
      }
      if (bar.buyFilledAt){
        annotation = {text:'Buy', x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
        if (enteryD4.missed) {
          annotation.text = 'Missed ' + annotation.text;
          annotation.font = {color:'red'};
        }
        return annotation;
      }
      if (bar.profitTakenAt) {
        text = 'e-profit';
        if (enteryD4.eType==='buy' && enteryD4.missed)
          return false;
        enteryD4 = {}; //buy entery is closed
        if (isToday(bar.closeTime)){
          $scope.dailyResult.closedDeals ++;
        }
        return {text:text, x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
      }
      if (bar.stoplossHitAt) {
        if (enteryD4.eType==='sell' && enteryD4.missed)
          return false;
        enteryD4 = {}; //sell entery is closed
        if (isToday(bar.closeTime)){
          $scope.dailyResult.closedDeals ++;
        }
        return {text:'e-stoploss', x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
      }
      return false;
    }

    function isToday(date){
      var then = new Date(date).setHours(0,0,0,0);
      var now = new Date().setHours(0,0,0,0);

      return now===then;
    }
  }
})();
