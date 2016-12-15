'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  HighValue = mongoose.model('HighValue'),
  Bar = mongoose.model('Bar'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  minute = 60000,
highValues = [];


exports.activate = function(req, res, next) { // run on /bars/ POST before bars controller
	var io = req.app.get('socketio');
	HighValue.find().sort('_id').limit(1).exec(function(err,lastHighValue){
		
		var timeSinceUpdate = 0;
		if (lastHighValue && lastHighValue.length && lastHighValue[0].timeOfDay){ //create and save one if the collection is empty
			timeSinceUpdate = req.body.closeTime*1000 - lastHighValue[0].timeOfDay;
		}
		if (Date(req.body.closeTime*1000).getDay()!==lastHighValue[0].timeOfDay.getDay()){ //empty previous day values if a new trade day started
			HighValue.find().where('closeTime').lt(lastHighValue[0].timeOfDay).exec(function(err,lastDayValues){
				for (var i = lastDayValues.length - 1; i >= 0; i--) {
					lastDayValues[i].remove();
				}
			});
		}
		if (timeSinceUpdate>=5000 || !lastHighValue.length) {
			Bar.find().sort('_id').where('closeTime').gt(lastHighValue[0].timeOfDay).exec(function(err,bars){
				var numberOfHighValues = (bars[bars.length-1].closeTime-lastHighValue[0].closeTime)%5000;
				for(var j=0; j<numberOfHighValues; j++){
					var highValue = new HighValue();
					highValue.tradeActivity = '';
					highValue.timeOfDay = new Date(lastHighValue[0]+j*5000);
					while(bars.length && bars[0].closeTime<=highValue.timeOfDay){
						highValue.highValue = bars[0].highPrice;
						if (req.body.sellFilledAt)
							highValue.tradeActivity += 'Sell ';
						else if (req.body.buyFilledAt)
							highValue.tradeActivity += 'Buy ';
						else if (req.body.profitTakenAt)
							highValue.tradeActivity += 'e-profit ';
						else if (req.body.stoplossHitAt)
							highValue.tradeActivity += 'e-stoploss ';
						bars = bars.slice(1, bars.length);
					}
					highValue.save();
					highValues.push(highValue);
				}
				io.emit('high value update', highValues);
			});
		}
	});
	next();
};
