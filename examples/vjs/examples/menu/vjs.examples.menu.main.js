v.define("vjs.examples.menu.main", {
	parent : "{.menu_main_holder}",
	
	
	init: function(optionen){
		var that = this
		
		debugger;
		that.that_obj = $("." + that.menu_id);
		that.add_event_click();
	},
	
	set_html: function(){
		
	},
	
		
	set_active: function(){
		debugger;
		$("a", $(this)[0]).removeClass("active");
		this.that_obj.addClass("active");
		debugger;
		this.set_html();
	},
	
	click_event: function(e, that){
		debugger;
		that.set_active();
	},
	
	add_event_click: function(){
		var that = this;
		debugger;
		$("." + that.menu_id).click(function(e){
			debugger;
			that.click_event.call(this, e, that);
		});
	}
		
	
	
});