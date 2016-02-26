// We will be building a page consisting of two parts: a text input field 
// and associated button, for adding new e-mail addresses to our list of stored
// addresses, and a list displaying the stored e-mail addresses with a 
// "remove" button beside each to allow us to remove email addresses
// from the list of stored addresses.
// We will also define a generic View which acts as a holder for multiple
// child views, and we'll use this as a way of linking the two views together in
// ch-08-03.js. As with the Model in listing ch-08-01.js, we will be taking 
// advantage of the observer pattern methods.

// Define a View representing a simple form for adding new e-mail addresses
// to the displayed list. We define this as a "class" so that we can create
// and display as many instances of this form as we wish within our user 
// interface.

"use strict";
function EmailFormView() {
	// Create new DOM elements to represent the form we are creating (you may wish
	// to store the HTML tags you need directly within your page rather than create
	// them here)
	this.form = document.createElement("form");
	this.input = document.createElement("input");
	this.button = document.createElement("button");
	
	// Ensure we are creating an input type text field with appropriate placeholder
	this.input.setAttribute("type", "text");
	this.input.setAttribute("placeholder", "New e-mail address");
	
	// Ensure we are creating a submit button
	this.button.setAttribute("type", "submit");
	this.button.innerHTML = "Add";
}

EmailFormView.prototype = {
	// All Views should have a render() method, which is called by the controller
	// at some point after its instantiation by the controller. It would typically
	// be passed the data from the Model also, though in this particular case we
	// do not need that data.
	render: function() {
		// Nest the input field and button tag within the form tag.
		this.form.appendChild(this.input);
		this.form.appendChild(this.button);
		// Add the form to the bottom of the html page.
		document.body.appendChild(this.form);
		
		// Connect up any events to the DOM elements represented in this View.
		this.bindEvents();
	},
	// Define a method for connecting this View to system wide events.
	bindEvents: function() {
		var that = this;
		
		// When the form represented by this View is submitted, publish a system-wide event
		// indicating that a new e-mail address has been added via the UI, passing across 
		// this new e-mail address value
		this.form.addEventListener("submit", function(evt) {
          // Prevent the default behaviour.
		  evt.preventDefault();
		  
		  // Broadcast a system-wide event indicating that a new e-mail address has been 
		  // added via the form represented by this view. The Controller will be listening
		  // for this event and will interact with the Model on behalf of the View to
		  // add the data to the list of stored addresses.
		  observer.publish("view.email-view.add", that.input.value);
        }, false);
		
		// Hook into the event triggered by the Model that tells us that a new email address
		// has been added in the system, clearing the text in the input field when this 
		// occurs.
		observer.subscribe("model.email-address.added", function() {
          that.clearInputField();
        });
	}, 
	// Define a method for emptying the text value in the input field, called whenever 
	// an e-mail address is added to the Model.
	clearInputField: function() {
		this.input.value = "";
	}
};

// Define a second View, representing the list of e-mail addresses in the system. 
// Each item in the list is displayed with a "Remove" button beside it to allow its
// associated address to be removed from the list of stored addresses.
function EmailListView() {
	// Create DOM elements for ul li span and button tags.
	this.list = document.createElement("ul");
	this.listItem = document.createElement("li");
	this.listItemText = document.createElement("span");
	this.listItemRemoveButton = document.createElement("button");
	this.listItemRemoveButton.setAttribute("type", "submit");
	this.listItemRemoveButton.innerHTML = "Remove";
}

EmailListView.prototype = {
	// Define the render() method for this View, which takes the provided
	// Model data and renders a list, with a list item for each e-mail
	// address stored in the Model.
	render: function(modelData) {
		var index = 0, 
		length = modelData.length,
		email;
		
		// Loop through the array of Model data containing the list 
		// of stored e-mail addresses and create a list item for each,
		// appending it to the list.
		for(; index < length; index++) {
			email = modelData[index];
			this.list.appendChild(this.createListItem(email));
		}
		// Append the list to the end of the current HTML page
		document.body.appendChild(this.list);
		
		// Connect this View up to the system wide events.
		this.bindEvents();
	},
	// Define a method which, given an e-mail address, creates and returns 
	// a populated list item <li> tag representing that e-mail.
	createListItem: function(email) {
		// Cloning the existing, configured DOM elements is more efficient
		// than creating new ones from scratch each time.
		var listItem = this.listItem.cloneNode(false),
		listItemText = this.listItemText.cloneNode(false),
		listItemRemoveButton = this.listItemRemoveButton.cloneNode(false);
		
		// Assign a "data-email" attribute to the li element, populated with
		// the e-mail address it represents -- this simplifies the attempt to 
		// locate the list item associated with a particular e-mail address
		// in the removeEmail() method later.
		listItem.setAttribute("data-email", email);
		listItemRemoveButton.setAttribute("data-email", email);
		listItemRemoveButton.setAttribute("type", "submit");
	    listItemRemoveButton.innerHTML = "Remove";
		
		// Display the e-mail address within the span element, and append this,
		// together with the "Remove" button, to the list item element.
		listItemText.innerHTML = email;
		listItem.appendChild(listItemText).appendChild(listItemRemoveButton);
		
		// Return the new list item to the calling function.
		return listItem;
	},
	// Define a method for connecting this View to system-wide events.
	bindEvents: function() {
		var that = this;
		
		// Create an event delegate on the list itself to handle clicks of the button
		// within.
		this.list.addEventListener("click", function(evt){
			if(evt.target && evt.target.tagName === "BUTTON"){
				// when the button is clicked, broadcast a system-wide event which 
				// will be picked up by the Controller. Pass the e-mail address 
				// associated with the button to the event.
				observer.publish("view.email-view.remove", evt.target.getAttribute("data-email"));
			}
        },false);
		
		// Listen for the event fired by the Model indicating that a new e-mail address has been
		// added, and execute the addEmail() method.
		observer.subscribe("model.email-address.added", function(email){
			that.addEmail(email);
        });
		
		// Listen for the event fired by the Model indicating that an e-mail address has been
		// removed, and executed the removeEmail() method.
		observer.subscribe("model.email-address.removed", function(email){
			that.removeEmail(email);
        });
	},
	
	// Define a method, called when an e-mail address is added to the Model, which inserts 
	// a new list item to the top of the list represented by this View.
	addEmail: function(email) {
		this.list.insertBefore(this.createListItem(email), this.list.firstChild);
	},
	
	// Define a method, called when an e-mail address is removed from the Model, which removes 
	// the associated list item from the list represented by this View.
	removeEmail: function(email) {
		var listItems = this.list.getElementsByTagName("li"),
		index = 0,
		length = listItems.length;
		
		// Loop through all the list items, locating the one representing the provided e-mail
		// address, and removing it once found.
		for(; index < length; index++) {
			if(listItems[index].getAttribute("data-email") === email) {
				this.list.removeChild(listItems[index]);
				// Exit loop once found.
				break;
			}
		}
	}
};

// Define a generic View which can contain child Views. When its render() method is called,
// it calls the render() methods of its child Views in turn, passing along any Model data
// provided upon instantiation.
function EmailView(views) {
	this.views = views || [];
}

EmailView.prototype = {
	// All views need to have a render() method. In the case of this generic View, it simply
	// executes the render() method of each of its child Views.
	render: function(modelData){
		var index = 0,
		length = this.views.length;
		
		// Loop through the child views, executing their render() methods, passing along
		// any Model data provided upon instantiation.
		for(; index < length; index++){
			this.views[index].render(modelData);
		}
		
	}
};





/*******************
*** D3 CHART
*******************/

function BargraphView() {
	// Create new DOM elements to represent the chart we are creating (you may wish
	// to store the HTML tags you need directly within your page rather than create
	// them here)
	this.chartDiv = document.createElement("div");
	this.button = document.createElement("button");
	
	// class = chart.
	this.chartDiv.setAttribute("id", "chart");
	// Ensure we are creating a submit button
	this.button.setAttribute("type", "submit");
	this.button.innerHTML = "Add";
}

BargraphView.prototype = {
	// All Views should have a render() method, which is called by the controller
	// at some point after its instantiation by the controller. It receives
	// the data from the Model.
	render: function(modelData) {
		console.log(modelData);
		// Nest the input field and button tag within the form tag.
		this.chartDiv.appendChild(this.button);
		// Add the form to the bottom of the html page.
		document.body.appendChild(this.chartDiv);
	    // Data Generation Functions
        // -------------------------

        // Compute a random interval using an Exponential Distribution of
        // parameter lambda = (1 / avgSeconds).
        function randomInterval(avgSeconds) {
            return Math.floor(-Math.log(Math.random()) * 1000 * avgSeconds);
        };

        // Create or extend an array of increasing dates by adding a random
        // time interval using an exponential distribution.
        function addData(data, numItems, avgSeconds) {
            // Compute the most recent time in the data array. If the array is
            // empty, uses the current time.
            var n = data.length,
                t = (n > 0) ? data[n - 1].date : new Date();

            // Append items with increasing times in the data array.
            for (var k = 0; k < numItems - 1; k += 1) {
                t = new Date(t.getTime() + randomInterval(avgSeconds));
                data.push({date: t});
            }

            return data;
        }

        //  Generate a random dataset with dates.
        var data = addData([], 150, 300);
        
		// OK to here.

		// Closure to create a private scope for the charting function. I believe that the closure is the chart
        // function, which uses variables in its outer scope.
		var barcodeChart5 = function() {
	
			// Chart variables
			var width = 600,
				height = 30,
				margin = {top: 5, right: 5, bottom: 5, left: 5};
	
			var value = function(d) { return d.date; };
	
			function chart(selection) {
				selection.each(function(data) {
	
					// Bind the dataset to the svg selection.
					var div = d3.select(this),
						svg = div.selectAll('svg').data([data]);
	
					// SVG Initialization.
					svg.enter().append('svg').call(svgInit);
	
					// Compute the horizontal scale.
					var xScale = d3.time.scale()
						.domain(d3.extent(data, value))
						.range([0, width - margin.left - margin.right]);
	
					// Select the chart group.
					var g = svg.select('g.chart-content');
	
					// Bind the data to the bars selection.
					var bars = g.selectAll('line').data(data, value);
	
					// Create the bars on enter and set their attributes.
					bars.enter().append('line')
						.attr('x1', function(d) { return xScale(value(d)); })
						.attr('x2', function(d) { return xScale(value(d)); })
						.attr('y1', 0)
						.attr('y2', height - margin.top - margin.bottom)
						.attr('stroke', '#000')
						.attr('stroke-opacity', 0.5);
				});
			}
	
			// Initialize the SVG Element
			function svgInit(svg) {
				// Set the SVG size
				svg
					.attr('width', width)
					.attr('height', height);
	
				// Create and translate the container group
				var g = svg.append('g')
					.attr('class', 'chart-content')
					.attr('transform', 'translate(' + [margin.top, margin.left] + ')');
	
				// Add a background rectangle
				g.append('rect')
					.attr('width', width - margin.left - margin.right)
					.attr('height', height - margin.top - margin.bottom)
					.attr('fill', 'white');
			};
	
			// Accessor Methods
	
			// Width
			chart.width = function(value) {
				if (!arguments.length) { return width; }
				width = value;
				return chart;
			};
	
			// Height
			chart.height = function(value) {
				if (!arguments.length) { return height; }
				height = value;
				return chart;
			};
	
			// Margin
			chart.margin = function(value) {
				if (!arguments.length) { return margin; }
				margin = value;
				return chart;
			};
	
			// Date Accessor Method
			chart.value = function(accessorFunction) {
				if (!arguments.length) { return value; }
				value = accessorFunction;
				return chart;
			};
	
			return chart;
		};
		
		// Get the charting function and set the date accessor function.
		var barcode05 = barcodeChart5()
			.value(function(d) { return d.date; });
	
		// Create the selection, bind the data and call the chart.
		d3.select('#chart').selectAll('div.data-item')
			.data([data])
			.enter()
			.append('div')
			.attr('class', 'data-item')
			.call(barcode05);		

		// Connect up any events to the DOM elements represented in this View.
		this.bindEvents();
	},
	// Define a method for connecting this View to system wide events.
	bindEvents: function() {
		var that = this;
		
		// When the form represented by this View is submitted, publish a system-wide event
		// indicating that a new e-mail address has been added via the UI, passing across 
		// this new e-mail address value
		//this.form.addEventListener("submit", function(evt) {
          // Prevent the default behaviour.
		  //evt.preventDefault();
		  
		  // Broadcast a system-wide event indicating that a new e-mail address has been 
		  // added via the form represented by this view. The Controller will be listening
		  // for this event and will interact with the Model on behalf of the View to
		  // add the data to the list of stored addresses.
		  //observer.publish("view.email-view.add", that.input.value);
        //}, false);
		
		// Hook into the event triggered by the Model that tells us that a new email address
		// has been added in the system, clearing the text in the input field when this 
		// occurs.
		
        //This is also not applicable
		//observer.subscribe("model.email-address.added", function() {
        //  that.clearInputField();
        //});
	}, 
	// This has been modified to point to some actual div, but it has no use in this state.

	// Define a method for emptying the text value in the input field, called whenever 
	// an e-mail address is added to the Model.
	clearChartDiv: function() {
		this.chartDiv.innerHTML = "";
	}
};