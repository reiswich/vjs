v.define("vjs.examples.menu.link2", {
	parent : "{{vjs.examples.menu.main}}",
	last_parent_tag: ".link_2",
	
	
	menu_id: "link_2",
	click_event: function(e, that){
		debugger;
		$(".loader_ajax").css("display","inline-block").show();
		 kendo.ui.progress($("body"), true);
		that.set_active();
	},
	
	
	set_grid: function(data, row_content){
		$(".grid").kendoGrid({
            dataSource: new kendo.data.DataSource( {
                data : data,
                sort: { field: "Country", dir: "asc" },
                pageSize : data.length,
                 pageSize: 200,
            } ),
            filterable: true,
            sortable: {
                mode: "single",
                allowUnsort: false
            },
            pageable: true,
            editable: "popup",
            //editable: "incell",
            selectable: true,
            selectable: "row",
            height: 550,
            dataBinding: function(){
            	debugger;
            	 kendo.ui.progress($("body"), false);
            	 $(".loader_ajax").css("display","inline-block").hide();
            },
            columns: [
                { field:"Country",title:"Country" },
                { field: "Name", title: "Name" },
                { field: "State", title: "State" },
                { field: "PostalCode", title: "PostalCode" },
                { field: "City", title:"City"}
            ],
        });
	},
	
	set_html: function(){
		debugger;
		var that = this;
		var row_content = $(".row_content").empty();
		row_content.append("<div class='grid'></div>");
		 v.ajax({
				type : "GET",
				url:"https://oemobiledemo.progress.com/OEMobileDemoServices/rest/CustomerService/Customer"
			}, function(data){
				that.set_grid(data.dsCustomer.ttCustomer, row_content) // .slice(0,1000)
		 });
	}	
});
