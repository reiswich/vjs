v.define("vjs.examples.menu.link1", {
	parent : "{{vjs.examples.menu.main}}",
	
	
	menu_id: "link_1",
	
	set_html: function(){
		debugger;
		v.get_html("vjs.examples.menu.link1_tabel", function(html_data){
			$(".row_content").empty().append(html_data);
		});
	},
	
	
	init: function(optionen){
		//that.add_event_click();
	}

	
	
	
	
	
	
	
	
});