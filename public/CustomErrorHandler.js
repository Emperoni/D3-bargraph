//Define a custom error handler.
var ElementNotFoundError = Class.create({
	id: "",
	message: "The element could not be found by the given id.",
	initialize: function(id){
        this.id = id;
	}
});


