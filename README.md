### VSJ - is a fast, lightweight, client-side framework for building powerful JavaScript applications.
Based on jQuery version >= 1.6+  and Requirejs >= 1.0.0+

# Live Demo

http://danevi.de/vjs/examples/start.html

#### Integrate into HTML page

```html
// Jquery 
<script src="https://code.jquery.com/jquery-3.4.1.min.js"></script>
// Require.JS
<script  src="https://requirejs.org/docs/release/2.3.6/r.js"></script>
// VJS
<script src="vjs-2.0.0.js"></script>
```


### Example
### Define object in JavaScript

![directory structure](https://github.com/reiswich/vjs/blob/master/directory_structure.jpg)

```javascript
// file - vjs.examples.menu.main.js

v.define("vjs.examples.menu.main", {
	parent : "{.menu_main_holder}",
	
	init: function(optionen){
		// initialization
	},
	set_active: function(){
		// logic ...			
	},
	
	click_event: function(e, that){
		// logic ...
	},
	
	add_event_click: function(){
		// logic ...
	}
});

// File - vjs.examples.menu.link1.js  inherits file - vjs.examples.menu.main.js
v.define("vjs.examples.menu.link1", {
	parent : "{{vjs.examples.menu.main}}",
	
	init: function(optionen){
		// initialization
		this.add_event_click();
	},
	set_active: function(){
		// logic ...			
	},
	add_event_click: function(){
	// logik ...
	},
	menu_id: "link_1"
});
```
### Examples

#### Parent
```javascript

// As the parent, the file will be inherited - path.to.file.js
 v.define("path.to.file", {
	parent : "{{path.to.file}}",

// A DOM object will be created (div, input, span ...)
v.define( "path.to.file", {
	parent : "div",	

// Any DOM object in the HTML page (class .container-fluid)
// As the parent will be taken the tag "container-fluid" from the DOM (Document Object Model)
v.define( "path.to.file", {
	parent : "{.container-fluid}",	 // This is equivalent to $(.container-fluid)

// The file will be loaded as the parent, and the .container-liquid object will be inserted into the DOM.
// Parent is ".container-fluid" in the DOM object
v.define( "path", {
	parent : "path.to.html.html",
	add_html_in : ".container-fluid",

```
#### Events

## Add Event
```javascript
v.define("project.path.file", { 
  parent: "path.to.id",
  
  event:{
  	params:"event_name", or ["event_name","event_name_2","event_name_3"], // String or Array
 	callback: function(event_name, data, callback){
  			if ("event_name_2" == event_name){....}
			if ("event_name_3" == event_name){....}
  	}
  },

// Or without parameters. Will always be called
event:{
 	 callback: function(event_name, data, callback){
  		// ..... Logic
	 } 
}
});
```
## Run Event
```javascript
 v.event("event_name", { text:"Hallo World" }); 

// With Callback
 v.event("event_name", { text:"Hallo World" }, function(data){
 	...
 });

```
