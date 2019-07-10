 $( document ).ready( function () {

  // Add salt for every request 
  require.config({
      urlArgs: "salt=" +  (new Date()).getTime()
  });
  
  
  //	create content
	v("vjs.examples.content.main", {callback: function(){
		// if content loaded init Menu
		v("vjs.examples.menu.link1");         
		v("vjs.examples.menu.link2");        
		v("vjs.examples.menu.link3");        
	}
	});
	
});