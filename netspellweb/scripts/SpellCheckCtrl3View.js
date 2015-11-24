function AppViewModel() {
    this.instantaneousValue = ko.observable();
    this.throttledValue = ko.computed(this.instantaneousValue)
                            .extend({ throttle: 400 });

    // Keep a log of the throttled values
    this.loggedValues = ko.observableArray([]);
    this.throttledValue.subscribe(function (val) {
        if (val !== '')
            this.loggedValues.push(val);
    }, this);
}

