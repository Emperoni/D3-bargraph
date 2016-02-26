//Define an object called Class with a create() method for use to create classes.
//Use a closure to maintain inner functions without exposing them publicly.
var Class = (function() {
	function create(classDefinition, parentPrototype) {
		var _NewClass = function() {
			if (this.initialize && typeof this.initialize === 'function'){
				this.initialize.apply(this, arguments);
			}
		}, 
		_name;
		if(parentPrototype) {
			_NewClass.prototype = new parentPrototype.constructor();
			for (_name in parentPrototype) {
				if(parentPrototype.hasOwnProperty(_name)) {
					_NewClass.prototype[_name] = parentPrototype[_name];
				}
			}
		}
		function polymorph(thisFunction, parentFunction) {
			return function() {
				var output;
				this.__parent = parentFunction;
				output = thisFunction.apply(this, arguments);
				delete this.__parent;
				return output;
			};
		}
		//continue here location 930
		for (_name in classDefinition) {
			if(classDefinition.hasOwnProperty(_name)) {
				if(parentPrototype && parentPrototype[_name] && typeof classDefinition[_name] === 'function') {
					_NewClass.prototype[_name] = polymorph(classDefinition[_name], parentPrototype[_name]);
				} else {
					_NewClass.prototype[_name] = classDefinition[_name];
				}
			}
		}
		_NewClass.prototype.constructor = _NewClass;
		_NewClass.extend = extend;
		
		return _NewClass
	}
	function extend(classDefinition) {
		return create(classDefinition, this.prototype);
	}
	return { create: create };
}());