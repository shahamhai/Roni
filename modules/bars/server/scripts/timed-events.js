'use strict';

var path = require('path'),
  mongoose = require('mongoose'),
  HighValue = mongoose.model('HighValue'),
  Bar = mongoose.model('Bar'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash'),
  minute = 60000,
  io = app.get('socketio');

setInterval(newHighValue,minute);

function newHighValue(){
	var now = new Date();
	var minuteAgo = new Date(now.getTime - minute);
	Bar.find().where('startTime').gte(minuteAgo).exec(function(err,bars){
		var tickTime = Date(minuteAgo);
		var highValues = [];
		for (var i=0; i<bars.length && tickTime<=now; i++) {
			if (i===bars.length-1 || (bars[i+1].closeTime)>tickTime) {
				var highValue = new HighValue();
					highValue.timeOfDay = tickTime;
					highValue.highValue = bars[i].highPrice;
					if (bars[i].sellFilledAt)
						highValue.tradeActivity = 'Sell';
					else if (bars[i].buyFilledAt)
						highValue.tradeActivity = 'Buy';
					else if (bars[i].profitTakenAt)
						highValue.tradeActivity = 'e-profit';
					else if (bars[i].stoplossHitAt)
						highValue.tradeActivity = 'e-stoploss';
					highValue.save(function(){});
					highValues.push(highValue);
					tickTime = new Date(tickTime.getTime()+5000);

			}
			io.emit('new time bars', highValues);//
		}
	});
}