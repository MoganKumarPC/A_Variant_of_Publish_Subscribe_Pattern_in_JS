    var eventBus = {},
        pubNsub = function() {

        },
        errorMessage = "";

    pubNsub.prototype.subscribe = pubNsub.prototype.on = function(event, handler) {

        var createEvt = {
                'eventName': event,
                'eventHandler': handler.bind(this),
                'eventOriginator': this
            },
            instance = this,
            isExistingInstance = false;

        if (!(event in eventBus)) {
            eventBus[event] = [];
        }
        
        isExistingInstance = typeof eventBus[event] != "undefined" && eventBus[event].some(function(evtObj, evt) {
            thisEvt = evtObj;
            return (evtObj.eventOriginator == instance);
        });
        if (!isExistingInstance)
            eventBus[event].push(createEvt);
        console.log('event subscribed...');
        errorMessage = "event subscribed...";

    };

    pubNsub.prototype.publish = pubNsub.prototype.emit = function(event, message) {

        var instance = this,
            thisEvt = {},
            isInstanceBoundToEvt = typeof eventBus[event] != "undefined" && eventBus[event].some(function(evtObj, evt) {
                thisEvt = evtObj;
                return (evtObj.eventOriginator == instance);
            });

        if ((event in eventBus) && isInstanceBoundToEvt) {
            thisEvt.eventHandler.call(thisEvt.eventOriginator)
            console.log('event published...', message);
            errorMessage = "event published..." + JSON.stringify(message);
        } else {
            console.log('Attempt to \'publish/emit\' the non-subscribed event with message [ ', JSON.stringify(message), ']');
            errorMessage = 'Attempt to \'publish/emit\' the non-subscribed event with message [ ' + JSON.stringify(message) + ' ]';
        }

    };

    pubNsub.prototype.unsubscribe = pubNsub.prototype.off = function(event, handler) {

        var instance = this,
            indx = -1,
            isEvtAlreadySubscribed = typeof eventBus[event] != "undefined" && eventBus[event].some(function(evtObj, evt) {
                thisEvt = evtObj;
                return (evtObj.eventOriginator == instance);
            });

        if (isEvtAlreadySubscribed) {
            eventBus[event].some(function(obj, key) {
                if (obj.eventOriginator == instance)
                    indx = key;
            });
            if (indx >= 0)
                eventBus[event].splice(indx, 1);
            console.log('event unsubscribed...');
            errorMessage = "event unsubscribed...";
        } else {
            console.log('Attempt to \'unsubscribe/off\' for the event [', event, '] which has not been subscribed for the instance');
            errorMessage = 'Attempt to \'unsubscribe/off\' for the event [' + event + '] which has not been subscribed for the instance';
        }

    };