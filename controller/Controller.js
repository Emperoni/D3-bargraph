// The Controller connects a Model to a View, defining the logic of the system.
// This allows alternative Models and Views to be provided whilst still enabling
// a similar system behavior, provided the Model provides add(), remove() and getAll()
// methods for accessing its data, and the View provides a render() method--this is
// the strategy pattern in action. 

// Define a "class" to represent the Controller for connecting the Model and Views
// in our e-mail address system. The Controller is instantiated after the Model and
// View, and their object instances provided as inputs.
function EmailController(model, view) {
	// Store the provided model and view objects.
	this.model = model;
	this.view = view;
}

EmailController.prototype = {
	// Define a method to use to initialize the system, which gets the data from the
	// Model using its getAll() method and passes it to the associated View by 
	// executing that View's render() method.
	initialize: function() {
		// Get the list of e-mail addresses from the associated Model.
		var modelData = this.model.getAll();
		
		// Pass that data to the render() method of the associated View.
		this.view.render(modelData);
		// Connect controller logic to system-wide events.
		this.bindEvents();
	},
	// Define a method for connecting Controller logic to system-wide events.
	bindEvents: function() {
		var that = this;
		
		// When the View indicates that a new e-mail address has been added via the 
		// user interface, call the addEmail() method.
		console.log('binding controller events');
		observer.subscribe("view.email-view.add", function(email){
	        that.addEmail(email);
	    });
		
		// When the View indicates that an e-mail address has been removed via the
		// user interface, call the removeEmail() method.
		observer.subscribe("view.email-view.remove", function(email){
            that.removeEmail(email);
        });
	},
	
	// Define a method for adding an e-mail address to the Model, called when an
	// e-mail address has been added via the View's user interface.
	addEmail: function(email) {
		
		// Call the add() method on the Model directly, passing the e-mail address
		// added via the View. The Model will then broadcast an event indicating 
		// a new e-mail address has been added, and the View will respond to this 
		// event directly, updating the UI.
		this.model.add(email);
	},
	
	// Define a method for removing an e-mail address from the Model, called when
	// an e-mail address has been removed via the View's user interface.
	removeEmail: function(email){
		// Call the remove() method on the Model directly, passing the e-mail address
		// removed via the View. The Model will then broadcast an event indicating
		// an e-mail address has been removed, and the View will respond to this
		// event directly, updating the UI.
		this.model.remove(email);
	}
};