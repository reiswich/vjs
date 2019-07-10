v.define("vjs.examples.menu.link3", {
	parent : "{{vjs.examples.menu.main}}",
	
	menu_id: "link_3",
	
	set_html: function(){
		debugger;
		v.get_html("vjs.examples.content.body", function(html_data){
			$(".body_content_holder").empty().append($(".body_content_holder",html_data).html());
		});
	}
});