// Create an instance of our e-mail Model "class", populating it with a few
// e-mail addresses to get started with.
var emailModel = new EmailModel(["daniele@marcopoloni.com","dg2@marcopoloni.com","dg22@marcopoloni.com"]),
	// Create instances of our form View and our list View "classes".
	emailFormView = new EmailFormView(),
	emailListView = new EmailListView(),
	bargraphView = new BargraphView(),

    // Combine together the form and list Views as children of a single View object.
	emailView = new EmailView([emailFormView, emailListView, bargraphView]),
    
    // Create an instance of our email system Controller, passing it the Model instance
	// and the View to use. Note that the Controller does not need to be aware whether
	// the View contains a single View or multiple, combined Views, as it does here --
	// this is an example of the composite pattern in action.
	emailController = new EmailController(emailModel, emailView);
	
// Finally, initialize the Controller which gets the data from the Model and passes it
// to the render() method of the View, which, in turn, connects up the user interface
// to the system-wide events, bringing the whole application together.
emailController.initialize();