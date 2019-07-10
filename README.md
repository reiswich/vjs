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
		// logik ...			
	},
	
	click_event: function(e, that){
		// logik ...
	},
	
	add_event_click: function(){
		// logik ...
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
		// logik ...			
	},
	add_event_click: function(){
	// logik ...
	},
	menu_id: "link_1"
});
```
