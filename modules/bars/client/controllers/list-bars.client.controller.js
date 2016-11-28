(function () {
  'use strict';

  angular
    .module('bars')
    .controller('BarsListController', BarsListController);

  BarsListController.$inject = ['BarsService', 'CurrentValuesService', '$scope', 'Socket'];


  function BarsListController(BarsService, CurrentValuesService, $scope, Socket) {
    var vm = this,
    barsOpen = [],
    barsClose = [],
    barsHigh = [],
    barsLow = [],
    barsDates = [],
    barsNum=0,
    barsAnnotation = [],
    barsAnnotationD3 = [],
    entery={},
    currentValue = {};
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


    BarsService.query(function(bars){
      CurrentValuesService.query(function(value){
        currentValue = value.$promise;
        barsNum=bars.length;
        $scope.dailyResult.contractAmountD2 = bars[barsNum-1].contractAmountD2; //enter non accumulated data to table
        $scope.dailyResult.contractAmountD3 = bars[barsNum-1].contractAmountD3;
        $scope.dailyResult.contractAmountD4 = bars[barsNum-1].contractAmountD4;
        $scope.dailyResult.profitD2 = bars[barsNum-1].profit;
        $scope.dailyResult.profitD3 = bars[barsNum-1].profitD3;
        $scope.dailyResult.profitD4 = bars[barsNum-1].profitD4;
        
        for (var i=0;i<bars.length;i++)// arrange data to draw candlestick chart
          pushBar(bars[i],i);
        drawChart();
      });
    });

    

    Socket.on('new bar', function(bar){
      console.log(bar);
      pushBar(bar,barsNum);
      barsNum++;
      drawChart();
    });
    Socket.on('current value update', function(newValue){
      currentValue = newValue;
      drawChart();
    });

    function pushBar(bar,i){
      barsOpen.push(parseFloat(bar.openPrice));
      barsClose.push(parseFloat(bar.closePrice));
      barsHigh.push(parseFloat(bar.highPrice));
      barsLow.push(parseFloat(bar.lowPrice));
      barsDates.push(bar.startTime);
      var annotation = resolveAnnotation(bar,i);// entery is opened here
      if (annotation) {
        barsAnnotation.push(annotation);
        annotation = resolveAnnotationD3(bar,i);// entery is closed here
        if (annotation)
          barsAnnotationD3.push(annotation);
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
      //fig.data[0].y[3]=2166;
      fig.layout.yaxis.fixedrange=false;
      fig.layout.paper_bgcolor = '#eee';
      fig.layout.xaxis.showticklabels=false; // make the x values invisible
      fig.layout.annotations=barsAnnotationD3;
      //
      $scope.data = fig.data;
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

      //
      fig.data.push({  // add the current value to the chart
        x:[barsOpen.length],
        y:[currentValue.currentValue],
        mode:'markers',
        opacity:1,
        marker:{color:'blue', size:[20]},
        name: 'Current Value'
      });
      //
      $scope.chartPlot = fig.data;
    }
    function resolveAnnotation(bar, xval){
      if (bar.sellFilledAt) {
        entery = {eType:'sell'};
        if (bar.missedHit===-1)
          entery.missed=true;
        else
          entery.missed=false;
        return {text:'Sell', x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
      }
      if (bar.buyFilledAt){
        entery = {eType:'buy'};
        if (bar.missedHit===-1)
          entery.missed=true;
        else
          entery.missed=false;
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
          annotation.bordercolor = 'rgba(255,0,0,0)';
        }
        return annotation;
      }
      if (bar.buyFilledAt){
        annotation = {text:'Buy', x:xval, y:bar.lowPrice, ay:30, arrowhead:4};
        if (entery.missed) {
          annotation.text = 'Missed ' + annotation.text;
          annotation.bordercolor = 'rgba(255,0,0,0)';
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

    function isToday(date){
      var then = new Date(date).setHours(0,0,0,0);
      var now = new Date().setHours(0,0,0,0);

      return now===then;
    }
  }
})();
