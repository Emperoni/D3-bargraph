// The Model represents the data in the system. In this system we wish to 
// manage a list of e-mail addresses on screen, allowing them to 
// be added and removed from the displayed list. 
// The Model here, therefore represents the stored e-mail addresses
// themselves. When addresses are added or removed, the Model broadcasts
// this fact using the observer pattern methods.

// Define the Model as a "class" such that multiple object 
// instances can be created if desired. 

function EmailModel(data) {
	// Create a storage array for e-mail addresses, defaulting to an empty array
	// if no addresses are provided at instantiation.
	this.emailAddresses = data || [];
}
EmailModel.prototype = {
	// Define a method which will add a new e-mail address to the list of 
	// stored addresses.
	add: function(email) {
		// Add the new e-mail address to the start of the array.
		this.emailAddresses.unshift(email);
		
		// Broadcast an event to the system, indicating that a new email address
		// has been added, and passing across that e-mail address to any code
		// module listening for this event.
		observer.publish("model.email-address.added", email);
	},
	// Define a method to remove an e-mail address from the list of stored
	// addresses.
	remove: function(email) {
		var index = 0,
		length = this.emailAddresses.length;
		
		// Loop through the list of stored addresses, locating the provided e-mail
		// address
		for(; index < length; index++) {
			if(this.emailAddresses[index] === email) {
				// Once the e-mail address is located, remove it from the list.
				this.emailAddresses.splice(index, 1);
				// Broadcast an event to the system, indicating that an email address
				// has been removed from the list, passing across the e-mail address
				// that was removed.
				observer.publish("model.email-address.removed", email);
				// break out of the loop so as not to waste processor cycles.
				break;
			}
		}
	},
	//Define a method to return the entire list of stored email addresses.
	getAll: function() {
		return this.emailAddresses;
	}
}