/*!
 * v.js v2.0.0
 * (c) 2017 Victor Reiswich
 * Released under the MIT License.
 * https://github.com/reiswich/vjs
 */
;
"use strict";
( function ( window ) {
	var v = function ( selector, content ) {
		// var arg = arguments;
		// var selector = arg[ 0 ];
		// var content = arg[ 1 ];
		var object = v.objects[ selector ];
		if ( object ) {
			if ( !object[ 0 ][ 0 ].parents( "html" ).length ) {
				delete v.objects[ selector ];
				if ( selector ) {
					v.create( selector, content );
				}
			} else {
				if (typeof object[0].run_init == "function"){
					object[0].run_init(content);
				}else{
					return object;
				}
			}

		} else {
			if ( selector ) {
				v.create( selector, content );
			}
		}
	};
	var v_methoden = {
		project_config : "",
		triggers : {},
		ajaxSetup : false,
		log : {
			error : function ( text ) {
				console.error( text );
			},
			email_error : function ( text ) {
				// TODO
			}
		},

		objects : {
			body : document.body,
			head : document.head,
			style : document.styleSheets[ 0 ],
			css : {}
		},

		get_config_project_name : function () {
			var domain = v.subdomain;
			var prifex = "_config.js";
			return "/main/config/" + ( v.subdomain ? "dev/" + domain + "/main" + prifex : document.domain.split( "." )[ 0 ] + prifex );
		},
		// get Subdomain, domain
		subdomain : window.location.host.split( location.hostname.split( '.' ).slice( -2 ).join( '.' ) )[ 0 ].split( "." )[ 0 ],
		append_dom_funcs : {},
		project : {
			i : function ( callback ) {
				callback();
			}
		},
		row_objects : {},
		v_store : {},
		loaded_files : {},
		secret_key : "",
		actions_liste : "",
		token_id : "",
		session : {
			static_data : {

			},
			request : {
			// TODO FOR TOKENS, or ajax
			},
			tokens : {
				methoden : {},
				secret : ""
			}
		// logged : false
		},
		sessionID : "",
		socket : {
			main : ""
		},
		
	get_files : function(e, file, that, callback, empty_file, validator_option){
//			$('form').on('submit', function (e) {
		    e.preventDefault();
		
		if (empty_file){
			callback([{
            	filename:"",
            	typ:"",
            	file:""
            }]);
            return;
		}else{
					var reader = new FileReader();
					if (!file.files.length) {
						alert('no file uploaded');
						return false;
					}
					var name = file.files[0].name;
					var file_size = file.files[0].size;
					var typ = name.split('.').pop();
					validator_option.typ = typ;
					validator_option.file_size = file_size;
					l.checkFileType.call(this, validator_option, function(is_valis){
						if (is_valis){
							reader.onload = function () {
								var data = reader.result
								var base64 = data.replace(/^[^,]*,/, '');
								
								callback([{
									filename:name,
									typ:typ,
									file:base64
								}]);
							};
							reader.readAsDataURL(file.files[0]);
		}
	});
				
		}
	},
		
	 checkFileType : function(options, callback) {
	        var defaults = {
	            allowedExtensions: ["*"], // alle files
	            success: function() {},
	            error: function() {},
	            max_size: 20971520 // 20 Mb
	        };
	        options = $.extend(defaults, options);

//	        return this.each(function() {
//	            $(this).on('change', function() {
	        
//	                var value = $(this).val(),
//	                    file = value.toLowerCase(),
                    var extension = options.type;//file.substring(file.lastIndexOf('.') + 1);
	                var file_size = options.file_size;
	                
	                
	                if (file_size > options.max_size){
	                	l.alert("warning", "Upload nicht möglich: Maximale Dateigröße ist 20 MB!");
	                	callback(false);
	                	return;
	                }
	                if (options.allowedExtensions.indexOf("*") !== -1 || options.allowedExtensions.indexOf(options.typ) === -1) {
	                   // options.error();
	                	l.alert("warning", 'Upload nicht möglich: Es sind nur Dateien vom Typ " ' +  options.allowedExtensions.join(", ") + ' " erlaubt!');
	                	callback(false);
//	                    $(this).focus();
	                } else {
	                	callback(true);
//	                    options.success();
	                }
//	            });
//	        });
	    },

		empty : function ( name ) {
			var obj = v.objects[ this.type ][ 0 ];
			obj.empty();
			obj[ 0 ].empty();
			delete v.objects[ this.type ];
		},

		event_timeout : function ( e, _this, callback ) {
			if ( !_this.v_event_timeout ) {
				( function ( e, _this, callback ) {
					_this.v_event_timeout = true;
					setTimeout( function () {
						_this.v_event_timeout = false;
						callback.call( _this, e );
					}, 150 );
				} )( e, _this, callback );
			}
		},

		event : function ( event_name, data, clbk ) {
			var objects = v.objects;
			var is_event_exist = false;
			var objects_i, objects_i_0;
			for ( var i in objects ) {
				objects_i = objects[ i ];
				if ( objects_i && objects_i[ 0 ] ) {
					objects_i_0 = objects_i[ 0 ];
					if ( typeof objects_i_0.event === "object" ) {
						if ( objects_i_0.event.params ) {
							if ( typeof objects_i_0.event.params === "string" && objects_i_0.event.params === event_name || ( $.isArray( objects_i_0.event.params ) && objects_i_0.event.params.indexOf( event_name ) !== -1 ) ) {
								is_event_exist = true;
								objects_i_0.event.callback.call( objects_i_0, event_name, data, clbk );
							}
						} else {
							objects_i_0.event.callback.call( objects_i_0, event_name, data, clbk );
						}
					}
				}
			}
			if ( !is_event_exist ) {
				// keine events gefunden
				clbk && clbk( data, true );
			}
		},

		get_origin : function ( str ) {
			// IE10 Doesn't have window.location.origin
			str = str ? str : "";
			if ( !window.location.origin ) {
				var port = window.location.port ? ':' + window.location.port : '';
				return window.location.protocol + "//" + window.location.hostname + port + str;
			} else {
				return window.location.origin + str;
			}
		},

		form_is_edit : function ( obj, callback ) {

		},

		/* Password strength indicator */
		passwordStrength : function ( password ) {

			var desc = [
					{
						'width' : '0px'
					}, {
						'width' : '20%'
					}, {
						'width' : '40%'
					}, {
						'width' : '60%'
					}, {
						'width' : '80%'
					}, {
						'width' : '100%'
					}
			];

			var descClass = [
					'', 'progress-bar-danger', 'progress-bar-danger', 'progress-bar-warning', 'progress-bar-success', 'progress-bar-success'
			];

			var score = 0;

			// if password bigger than 6 give 1 point
			if ( password.length > 6 )
				score++;

			// if password has both lower and uppercase characters give 1 point
			if ( ( password.match( /[a-z]/ ) ) && ( password.match( /[A-Z]/ ) ) )
				score++;

			// if password has at least one number give 1 point
			if ( password.match( /d+/ ) )
				score++;

			// if password has at least one special caracther give 1 point
			if ( password.match( /.[!,@,#,$,%,^,&,*,?,_,~,-,(,)]/ ) )
				score++;

			// if password bigger than 12 give another 1 point
			if ( password.length > 10 )
				score++;

			// display indicator
			$( "#jak_pstrength" ).removeClass( descClass[ score - 1 ] ).addClass( descClass[ score ] ).css( desc[ score ] );
		},

		data_is_edit : function ( arr_inputs, obj, callback, callback_with_empty_dic ) {
			var is_edit = false;
			var check_val = function ( check_obj, val ) {
				val = ( typeof val == "indefined" || typeof val == "null" ) ? "" : val;
				if ( check_obj.is( ":checkbox" ) || check_obj.is( ":radio" ) ) {
					return check_obj.prop( "checked" ).toString().trim() !== val.toString().trim();
				} else {
					var obl_val = check_obj.val();
					return ( ( obl_val !== null && obl_val ) ? obl_val.toString() : "" ).trim() !== val.toString().trim();
				}
			};
			if ( !$.isEmptyObject( obj ) && arr_inputs.length ) {
				// var arr_alte_value = $("input[alte_value], select[alte_value]", obj);
				var check_obj, i;
				// for ( i = len_alte_value; i--; ) {
				for ( var i in obj ) {
					check_obj = arr_inputs.filter( $( "#" + i ) );
					if ( check_obj.length ) {
						if ( check_val( check_obj, ( typeof obj[ i ] !== "undefined" && obj[ i ] !== null || typeof obj[ i ] == "boolean" ) ? obj[ i ] : "" ) ) {
							is_edit = true;
							console.log( "Value '" + obj[ i ] + "' different, Feld " + i );
							break;
						}
					}
				}
				callback( is_edit );
			} else {
				if ( typeof callback_with_empty_dic === "function" ) {
					callback_with_empty_dic( arr_inputs, check_val, function ( is_edit ) {
						callback( is_edit );
					} );
				}
			}
		},

		set_value : function ( inputs, dic ) {
			var set_val = function ( $el, val ) {
				if ( $( $el ).is( ":checkbox" ) || $( $el ).is( ":radio" ) ) {
					if ( typeof val !== "undefined" ) {
						$el.prop( "checked", val ).trigger( "change" );
						// $el.attr("alte_value", $el.prop("checked"));
					}
				} else {
					if ( $( $el ).is( "select" ) ) {
						$el.val( val );
						$el.change();
					}
					else{
						var kendo_list = $( $el ).data("kendoDropDownList") || $( $el ).data("kendoComboBox");
						if (kendo_list){
							kendo_list.text(val);
						}
					}
					if(val){
						$el.val( val );
					}
				}
			};

			if ( dic && typeof dic === "object" ) {
				var id, name, val, $el, inputs_i;
				var len = inputs.length;
				for ( var i = len; i--; ) {
					// inputs.each(function(index, el) {
					inputs_i = inputs[ i ];
					$el = $( inputs_i );
					id = $el.attr( "id" ) || "";
					name = $el.attr( "name" ) || "";
					set_val.call( this, $el, ( typeof dic[ id ] !== "undefined" ) ? dic[ id ] : ( typeof dic[ name ] !== "undefined" ) ? dic[ name ] : "" );
				}
			}
		},
		
		set_farbe_validator: function(inputs){
			var that = this;
			var is_valid = true;
			inputs.each(function(index, element){
				if ($(this).prop('required') && !$(this).val()){
					$(this).parent("div").addClass("has-error has-danger");
					is_valid = false;
				}else{
					$(this).parent("div").removeClass("has-error has-danger");
				}
			});
			return is_valid;
		},

		get_value : function ( inputs, dic, callback ) {
			if ( typeof dic !== "object" ) {
				dic = {};
			}
			var $this, id;
			$.each( inputs, function ( i, elm ) {
				$this = $( this );
				id = $this.attr( "id" );
				if ( id ) {
					if ( $this.is( ":checkbox" ) ) {
						dic[ id ] = $this.prop( "checked" );
					} else {
						if ( $this.is( ":radio" ) ) {
							if ( $this.is( ':checked' ) ) {
								dic[ id ] = $this.val();
							}
						} else {
							dic[ id ] = $this.val() || "";
						}
					}
				}
			} );
			callback && callback( dic );
		},

		timeout_ajax : function ( ajax_name, time, callback ) {
			v.session.request[ ajax_name ] = true;
			v.delay.call( this, function () {
				delete v.session.request[ ajax_name ];
				callback && callback();
			}, time || 2000 );
		},

		delay : ( function () {
			var timer = 0;
			return function ( callback, ms ) {
				clearTimeout( timer );
				var self = this;
				timer = setTimeout( function () {
					callback.call( self );
				}, ms );
			};
		} ).call( this ),

		load_md5 : function ( callback ) {
			requirejs( [
				"/main/external/js/hmac-md5.min.js"
			], callback );
		},

		get_md5 : function ( method, dic, callback ) {
			v.load_md5( function () {
				if ( !method || !v.session.tokens.secret ) {
					callback && callback( "" );
				} else {
					callback && callback( dic, CryptoJS.HmacMD5( v.session.tokens.methoden[ method ][ "tksid" ], v.session.tokens.secret ).toString() );
				}
			} );
		},

		create_hash : function ( dic, callback ) {
			var action = dic && dic.data_db && dic.data_db[ "function" ] && dic.data_db[ "function" ].action;
			if ( action ) {
				v.get_md5( action, dic, function ( dic, md5 ) {
					callback && callback( dic, md5 );
				} );
			} else {
				callback && callback( dic, "" );
			}
		},

		set_dic_md5 : function ( dic, callback ) {
			if ( dic ) {
				v.create_hash( dic, function ( dic, md5 ) {
					dic[ "tksid" ] = md5;
					callback && callback();
				} );
			} else {
				callback();
			}
		},
		ws : {
			get_connected_socket : function ( name ) {
				if ( name && v.socket[ name ] ) {
					return v.socket[ name ];
				} else {
					return v.socket.main;
				}
			},

			error_event : function ( socket ) {
				socket.on( 'error', function ( msg ) {
					if ( msg === "Unauthorized" || msg === "Not authorized" && !v.session.usel.logged_info ) {
						v.objects[ v.session.login_js ][ 0 ].session_expired( 401 );
						v.session_expired( {
							responseText : "Unauthorized"
						} );
						console.log( 'WebSocket Error  ' + msg.responseText );
					}
				} );
				socket.on( 'disconnect', function ( msg ) {
					if ( msg === "io server disconnect" ) {
						console.log( "Message from Websocket.io disconnect" );
						/*
						 * v.session_expired({ responseText:"Unauthorized" });
						 */
					}
					// v.objects[v.session.login_js][0].session_expired(401);
					console.log( 'disconnect ' + msg );
				} );
			},

			connect : function ( namespace, url ) {
				// io.connect('http://' + host, {reconnect: false, 'try multiple
				// transports': false});
				v.socket[ namespace ] = io.connect( url, {
					reconnect : false,
					'try multiple transports' : false
				} );
				// io.connect(url);
				v.ws.error_event( v.socket[ namespace ] );
			},
			/*
			 * reconnect : function(namespace, callback) { namespace = namespace?"/" + namespace:"main"; if (!v.socket[namespace]){ console.log(" ERROR ***** Socket is not Connected *****"); callback && callback(false); }else{ console.log('Socket is reconnect');
			 * v.socket[namespace].socket.reconnect(); } },
			 */
			disconnect : function ( namespace, callback ) {
				namespace = namespace ? "/" + namespace : "main";
				if ( !v.socket[ namespace ] ) {
					console.log( " ERROR  ***** Socket " + namespace + " is not Connected *****" );
					callback && callback( false );
				} else {
					v.socket[ namespace ].disconnect();
					console.log( 'Socket ' + namespace + ' is disconnect' );
				}
			},

			emit : function ( socket_namespace, rooter_name, message, callback ) {
				rooter_name = rooter_name ? rooter_name : "set_get_db";
				socket_namespace = v.ws.get_connected_socket( socket_namespace );
				var dic = {
					data_db : message
				};
				v.set_dic_md5( dic, function () {
					if ( !socket_namespace.connected ) {
						socket_namespace.disconnect();
						socket_namespace.connect();
					}
					socket_namespace.emit( rooter_name, dic, function ( request ) {
						var res = request.result_db ? request.result_db : request;
						// alert("OK request --_> " + JSON.stringify(request));
						if ( request.status == 401 ) {
							v.session_is_expired( res );
						}
						if ( request.status == 550 ) {
							console.log( request.responseText + " !!!!!!" );
							callback && callback( request.responseText, true );
						} else {
							v.new_action_tksid( request );
							callback && callback( res );
							// socket_namespace.emit(rooter_name, message, callback);
						}
					} );
				} );
			},
			on : function ( socket_namespace, rooter_name, callback ) {
				alert( "Socket ON" );
				socket_namespace = v.ws.get_connected_socket( socket_namespace );
				socket_namespace.on( rooter_name, callback );
			}
		},

		new_action_tksid : function ( result ) {
			var new_method_key = result.new_method_key;
			if ( new_method_key ) {
				// set only methode tksid
				v.session.tokens.methoden[ new_method_key.action ] = new_method_key.new_tksid;
			} else {
				if ( result.tokens ) {
					// set all methode tksid and secret tksid
					v.set_tokens( result.tokens );
				} else {
					console.log( "*** ERROR *** Keine Tokens vom Server erhalten." );
				}
			}
		},

		set_tokens : function ( tokens ) {
			var tksids = v.session.tokens;
			tksids.secret = tokens.secret;
			tksids.methoden = tokens.methoden;
		},

		add_v_store : function ( object ) {
			// Add data to Tag (Analog, Jquery .data())
			// Jquery Data, nur für Visual
			// v.clear_cash();
			v.store_count++;
			var count = v.store_count;
			object[ 0 ][ "v_store" ] = count;
			v.v_store[ count ] = object;
		},

		getCookies : function () {
			var pairs = document.cookie.split( ";" );
			var cookies = {};
			for ( var i = 0; i < pairs.length; i++ ) {
				var pair = pairs[ i ].split( "=" );
				cookies[ pair[ 0 ] ] = unescape( pair[ 1 ] );
			}
			return cookies;
		},
		
		
		pasoe_ajax: function(dic, callback){
			dic.xhrFields = {
				withCredentials:true
			};
			var func_success = dic.success;
			 dic.contentType =  'application/json; charset=utf-8';
			dic.url = l.session.serviceURI + dic.url;
			dic.success = function(result){
				if (typeof result == "string" && !$.isPlainObject(result)){
					var $result = $(result);
					if ($result && $("input[name='j_username']", $result).length){
						// Unauthorised
						l.session.login_js.open();
						return;
					}
				}
				func_success(result);
			};
			l.ajax(dic);
		},

		ajax : function ( dic, callback ) {
			// v.set_dic_md5( dic.data, function () {
			var extend_dic = $.extend( {
				async : false,
				cache : false,
				// contentType: "application/json",
				// "url" : dic.url,
				type : "POST",
				data : "",   // JSON.stringify(data)
				success : function ( result ) {
					// v.new_action_tksid( result );
					// var res = result.result_db ? result.result_db : result;
					callback && callback( result );
					// dic.success ? dic.success( result ) : callback( result );
				}
			}, dic );
			$.ajax( extend_dic );
		},

		define : function ( proj_name, property ) {
			property.type = proj_name;
			v.row_objects[ proj_name ] = [
				jQuery.extend( true, {}, property )
			];

			/*
			 * if (!v.objects[proj_name]) { v.objects[proj_name] = [property]; } else { v.objects[proj_name].push(property); }
			 * 
			 */
		},

		set_in_objects : function ( proj_name, property ) {
			if ( !v.objects[ proj_name ] ) {
				v.objects[ proj_name ] = [
					property
				];
			} else {
				v.objects[ proj_name ].push( property );

			}
		},

		parce_path_project : function ( path ) {
			return path;
			/*
			 * var project = path.split("/")[0] if (("/" + path.split("/")[0] + "/").indexOf(location.pathname) !== -1) { return path.replace(location.pathname.replace(/\//g, "") + "/", ""); } else { return path; }
			 */
		},

		get_html : function ( js_file_name, callback ) {
			var path = v.parce_path_project( v.get_js_name( js_file_name ) );
			if ( path ) {
				$.get( v.get_origin( "/" + path + ".html" ), function ( data ) {
					callback && callback( data );
				} );
			} else {
				console.log( "Falsche Dateiname '" + js_file_name + "'" );
				callback && callback();
			}
		},

		run_onjects_settings : function ( settings, object ) {
			v.project.i( function () {
				object.hashchange = v.url.add_hashchange_event;
				var init = ( settings && settings.init && object.init ) ? object.init : "";
				if ( settings && typeof settings === "object" ) {
					$.extend( true, object, settings );
					if ( typeof init === "function" ) {
						init.call( object, object );
					}
				}
				v.set_in_objects( object.type, object );
				if ( typeof object.init == "function" ) {
					object.init.call( object, settings );
				}
				if ( settings && typeof settings._v_callback == "function" ) {
					settings._v_callback( object );
				} else {
					if ( settings && typeof settings.callback == "function" ) {
						settings.callback.call( object, object );
					}
				}
				// v.set_in_objects( object.type, object );
				if ( typeof object.run_hashchange === "object" ) {
					v.__run_auto_hashchange.call( object, object.run_hashchange );
				}
			} );
		},

		object_in_html : function ( parent, object, class_name ) {
			parent = parent.replace( /\{|\}/g, "" );
			object[ 0 ] = $( parent ).addClass( class_name );
			object.class_name = class_name;
		},

		load_in_object_html : function ( parent, object, class_name, settings ) {
			v.get_html( parent.substring( 0, parent.length - 5 ), function ( data ) {
				// TODO html_string --> name from File !!!!
				// object["html_string"] = data;
				var add_html_in = object && object.add_html_in;
				if ( add_html_in ) {
					var $add_html_in = $( add_html_in );
					object[ 0 ] = $add_html_in;
					/*
					 * if ( typeof object.append_dom_before === "function") { object.append_dom_before(settings); }
					 */
					$add_html_in.append( $( data ) ).addClass( class_name );
				}
				object.class_name = class_name;
				v.run_onjects_settings( settings, object );
			} );

		},

		inherit_object : function ( parent, object, settings, class_name ) {
			parent = parent.replace( /\{|\}/ig, "" );
			object.parent = parent;
			object.class_name = class_name;
			$.extend( true, object, settings );
			( function ( object, settings, object ) {
				v.create( parent, $.extend( true, object, {
					_v_callback : function ( parent_object ) {
						object = $.extend( {}, parent_object, object );
						$( object[ 0 ] ).addClass( object.class_name );
						if ( settings && typeof settings.callback == "function" ) {
							settings.callback.call( object, object );
						}
					}
				} ), object );
			} )( object, settings, object );

		},

		set_in_html : function ( obj, settings ) {
			if ( obj[ 0 ] && obj[ 0 ].length && obj.add_in || ( settings && settings.add_in ) ) {
				$( obj[ 0 ] ).appendTo( $( obj.add_in || settings.add_in ) );
			}
		},

		find : function ( object, param ) {
			var obj = v.objects[ object ];
			if ( obj ) {
				if ( typeof param === "object" ) {
					var found_arr = [];
					var is_found, i, k;
					for ( i in obj ) {
						is_found = false;
						for ( k in param ) {
							if ( typeof obj[ i ][ k ] !== "undefined" ) {
								is_found = true;
							}
						}
						is_found ? found_arr.push( obj[ i ] ) : "";
					}
					return found_arr;
				} else {
					if ( obj[ 0 ][ 0 ].parents( "html" ).length ) {
						return obj[ 0 ];
					} else {
						delete v.objects[ object ];
						return false;
					}
				}
			} else {
				return false;
			}
		},

		create : function ( load_js_name, settings, prev_object ) {
			v.load_ajax_js( load_js_name, settings, function ( object, settings ) {
				var parent = object && object.parent;
				if ( !object[ 0 ] ) {
					if ( parent ) {
						var class_name;
						class_name = load_js_name.replace( /\./g, "_" );
						if ( parent.indexOf( "{{" ) !== -1 && parent.lastIndexOf( "}}" ) !== -1 ) {
							// Wenn in HTML
							v.inherit_object( parent, object, settings, class_name );
							// v.run_onjects_settings(settings, object, load_js_name);
						} else {
							if ( parent.indexOf( "{" ) !== -1 ) {
								// Wenn in HTML
								v.object_in_html( parent, object, class_name );
								v.run_onjects_settings( settings, object );
							} else {
								if ( parent.lastIndexOf( ".html" ) !== -1 ) {
									// Get HTML
									v.load_in_object_html( parent, object, class_name, settings );
								} else {
									// last_parent_tag überschreibt parent
									var last_parent_tag = prev_object && prev_object.last_parent_tag;
									if ( last_parent_tag ) {
										if ( last_parent_tag.lastIndexOf( ".html" ) !== -1 ) {
											object[ "add_html_in" ] = prev_object.add_html_in;
											v.load_in_object_html( last_parent_tag, object, class_name, settings );
											return;
										} else {
											if ( last_parent_tag.indexOf( "{" ) !== -1 ) {
												v.object_in_html( last_parent_tag, object, class_name );
												v.run_onjects_settings( settings, object );
												return;
											}
										}
										parent = object.last_parent_tag;
									}
									object[ 0 ] = $( document.createElement( parent ) ).addClass( load_js_name.replace( /\./g, "_" ) );
									object.class_name = load_js_name;
									v.set_in_html( object, settings );
									v.run_onjects_settings( settings, object );
								}
							}

						}

					}
				} else {
					v.run_onjects_settings( object, settings );
//
//					return;
//
//					if ( settings && typeof settings.callback == "function" ) {
//						settings.callback( [] );
//					}
//					console.log( " ERROR   ---> Script " + load_js_name + "wurde früher geladen !!!!!!!!" );

				}
			} );
		},

		get_js_name : function ( js_file ) {
			js_file = js_file.replace( /{|}/g, "" );
			var path = js_file.split( "." );
			delete path[ path.length - 1 ];
			path = path.join( "/" );
			return path + js_file;
		},

		load_ajax_js : function ( js_file_name, settings, callback ) {
			( function ( js_file_name, settings, callback ) {
				var run_eval_data = function () {
					var name_file = path + ".js";

					var load_ajax_js = function ( loaded_obj ) {
						if ( !loaded_obj ) {
							console.log( "### ERROR ### : Die Datei " + js_file_name + " kann nicht erstellt werden." );
							callback && callback( [] );
						} else {
							if ( typeof callback === "function" ) {
								var l_object = loaded_obj[ loaded_obj.length - 1 ];
								l_object.length = 1;
								callback && callback( l_object, settings );
							}
						}

					};

					var loaded_obj = v.row_objects[ js_file_name ];
					if ( loaded_obj ) {
						load_ajax_js( [
							jQuery.extend( true, {}, loaded_obj[ 0 ] )
						] );
						// load_ajax_js(loaded_obj);
					} else {
						require( [
							v.get_origin( "/" + name_file )
						], function () {
							// load_ajax_js(v.objects[js_file_name]);
							load_ajax_js( [
								jQuery.extend( true, {}, v.row_objects[ js_file_name ][ 0 ] )
							] );
						} );
					}

				};

				// *** Anfang ***
				var path = v.get_js_name( js_file_name );
				if ( path ) {
					run_eval_data();
				} else {
					console.log( "load_ajax_js kann nich ausgeürt, weil kein filename. " + path );
					if ( typeof callback === "function" ) {
						callback( [] );
					}
				}

			} )( js_file_name, settings, callback );
		},

		alert : function ( typ, text ) {
			// http://isabelcastillo.com/error-info-messages-css
			var div = $( "#ajax_content" );
			if ( !div.length ) {
				div = $( "<div id='ajax_content'></div>" );
				div.appendTo( $( "body" ) );
			}
			div.removeClass().addClass( typ ).text( text ).slideDown( "fast" );
			setTimeout( function () {
				div.slideUp( "slow" );
			}, 6000 );
		},

		run_popup : function ( holder, callback ) {
			// var holder = $(this);
			$( ".popup_hintergrund", $( holder ).fadeIn( "normal" ) ).css( "opacity", "0.7" ).fadeIn( "normal" );
			return false;
		},

		popup_close : function ( holder, callback ) {
			holdel.hide( "slow", function () {
				$( ".popup_hintergrund", holder ).hide();
				if ( typeof callback === "function" ) {
					callback();
				}
			} );
		},

		session_expired : function ( request ) {
			if ( request && request.responseText ) {
				console.log( "request.responseText " + request.responseText );
				if ( request.responseText ) {
					var login = v.session.login_js;
					if ( login ) {
						login = v.objects[ login ];
						if ( typeof login == "object" ) {
							if ( typeof login[ 0 ].session_expired === "function" ) {
								login[ 0 ].session_expired( 401 );
							} else {
								console.log( "Function 'session_expired' für Login existiert nicht." );
							}
						}
					} else {
						if ( typeof v.alert === "function" ) {
							v.alert( "error", request.responseText );
						} else {
							alert( "error", request.responseText );
						}
					}
				}
			}
		},
		session_is_expired : function ( request ) {
			if ( request.status == 401 || request.responseText === "Unauthorized" ) {
				v.session_expired( request );
			} else {
				if ( request.status !== 0 ) {
					v.alert( "warning", "Es ist ein Netzwerkfehler aufgetreten." );
				}
			}
		},

		add_events_global_obj : function ( type, callback ) {
			var that = this;
			switch ( type ) {
				case "hashchange":
					// Add hashchange
					v.url.add_hashchange.call( this, callback );
					if ( that.hash_append_dom ) {
						if ( !v.append_dom_funcs[ that.hash_append_dom ] ) {
							v.append_dom_funcs[ that.hash_append_dom ] = [];
						}
						v.append_dom_funcs[ that.hash_append_dom ].push( {
							func : callback,
							that : this
						} );
					}
					break;
			}
		},

		url : {
			hashchange : function ( params ) {

				if ( typeof params === "object" ) {
					var string = "", and = "";
					for ( var i in params ) {
						string = string + and + i + "=" + params[ i ];
						and = "&";
					}
					location.hash = string;
				} else {
					if ( typeof params === "string" ) {
						location.hash = params;
					} else {
						console.log( "Keine Value für hashchange." );
					}
				}
			},
			encode_uri : function ( txt ) {
				return encodeURIComponent( txt ).replace( /%2F/g, "/" );
			},
			decode_uri : function ( txt ) {
				return decodeURIComponent( txt ).replace( /%2F/g, "/" );
			},

			arr_hashchange : [],
			hashchange_one_params : [],
			add_hashchange_event : function ( dic ) {
				/*******************************************************************************************************************************************************************************************************************************************************************************************
				 * dic ={ callback:function(){}, params:["file","path"], settings:{} oder [] oder "String" }
				 ******************************************************************************************************************************************************************************************************************************************************************************************/
				if ( dic && dic.params ) {
					v.url.arr_hashchange.push( {
						callback : dic.callback,
						this_obj : this,
						params : dic.params
					} );
				} else {
					if ( typeof dic === "function" ) {
						v.url.hashchange_one_params.push( {
							callback : dic,
							this_obj : this
						} );
					} else {
						console.log( "Hashchange hatt keine callback !!!" );
					}
				}
			},

			del_hashchange : function ( dic ) {
				var params = v.url.get_params_url();
				for ( var i in dic ) {
					delete params[ dic[ i ] ];
				}
				v.url.hashchange( params );
			},

			add_hashchange : function ( dic ) {
				var params = v.url.get_params_url();
				for ( var i in dic ) {
					params[ i ] = dic[ i ];
				}
				v.url.hashchange( params );
			},

			get_params_url : function ( hash_string ) {
				var hash = hash_string ? hash_string.split( "#" )[ 1 ] : location.hash.split( "#" )[ 1 ];
				if ( hash ) {
					var dic = {};
					var split_hash = hash.split( "&" );
					if ( split_hash && split_hash.length ) {
						var key;
						for ( key in split_hash ) {
							split_hash_key = split_hash[ key ].split( "=" );
							dic[ split_hash_key[ 0 ] ] = split_hash_key[ 1 ] || true;
						}
						return dic;
					}
					return dic;
				} else {
					return {};
				}
			},
			// return alles nach dem #
			get_hash_path : function () {
				return location.hash.split( "#" )[ 1 ];
			}
		},

		haupt_hashchange : function ( e ) {
			v.params = v.url.get_params_url();
			// Clear undefined Object
			var hashchange_one_params = $.grep( v.url.hashchange_one_params, function ( n, i ) {
				return !!n.this_obj[ 0 ].parents( "html" ).length;
			} );

			v.url.hashchange_one_params = hashchange_one_params;

			// Run Hashchange Ohne Params !!!
			if ( hashchange_one_params.length ) {
				for ( var i in hashchange_one_params ) {
					hashchange_one_params[ i ].callback.call( hashchange_one_params[ i ].this_obj );
					// hashchange_one_params[i].params
				}
			}

			var hashchange_arr = $.grep( v.url.arr_hashchange, function ( n, i ) {
				return !!n.this_obj[ 0 ].parents( "html" ).length;
			} );
			v.url.arr_hashchange = hashchange_arr;
			// Run Hashchange Mit Params !!!
			if ( e && hashchange_arr && hashchange_arr.length ) {
				// var params = hashchange_arr[0].params;
				var new_href = e.newURL;
				var old_href = e.oldURL;
				var key, key_in_params;
				var old_params = v.url.get_params_url( old_href );
				var new_params = v.url.get_params_url( new_href );
				var changed_dic = {};
				var changed = false;
				var arr_run_hashchange = [];

				for ( key in new_params ) {
					// wenn Params in der url wurde geÃ¤ndert
					if ( old_params[ key ] !== new_params[ key ] ) {
						changed_dic[ key ] = true;
						changed = true;
					}
				}
				// wenn params wurde geloescht
				for ( key in old_params ) {
					if ( !new_params[ key ] ) {
						changed_dic[ key ] = false;
						changed = true;
						// }
					}
				}

				if ( changed ) {
					var params;
					for ( var i in hashchange_arr ) {
						params = hashchange_arr[ i ].params;
						if ( typeof params === "object" ) {
							for ( key in params ) {
								if ( params[ key ] in changed_dic ) {
									arr_run_hashchange.push( hashchange_arr[ i ] );
									break;
								}
							}
						}
					}
					if ( arr_run_hashchange.length ) {
						for ( var i in arr_run_hashchange ) {
							arr_run_hashchange[ i ].callback.call( arr_run_hashchange[ i ].this_obj, changed_dic, new_params );
						}
					}
				}
			}
		},

		__run_auto_hashchange : function ( hashchange_arr ) {
			var that = this;
			var url_params = v.url.get_params_url( location.hash );
			var arr_run_hashchange = [];
			// Clear undefined Object
			// Run Hashchange Ohne Params !!!
			if ( Array.isArray( hashchange_arr ) ) {
				for ( var i in hashchange_arr ) {
					hashchange_arr[ i ][ "this_obj" ] = that;
					if ( !hashchange_arr[ i ].params ) {
						v.url.hashchange_one_params = v.url.hashchange_one_params.concat( hashchange_arr[ i ] );
						hashchange_arr[ i ].callback.call( hashchange_arr[ i ].this_obj );
					}
				}
			} else {
				if ( !hashchange_arr.params ) {
					v.url.hashchange_one_params.push( hashchange_arr[ "this_obj" ] = that );
					hashchange_arr.callback.call( hashchange_arr.this_obj );
				}
			}
			// var params = hashchange_arr[0].params;
			if ( jQuery.isEmptyObject( v.url.get_params_url( location.hash ) ) ) {
				if ( Array.isArray( hashchange_arr ) ) {
					for ( var i in hashchange_arr ) {
						v.url.add_hashchange_event.call( that, hashchange_arr[ i ] );
					}
				} else {

					v.url.add_hashchange_event.call( that, hashchange_arr );
				}

			} else {

				// Mit Params ADD ONLY!!!
				if ( Array.isArray( hashchange_arr ) ) {
					for ( var i in hashchange_arr ) {
						for ( var key in url_params ) {
							if ( hashchange_arr[ i ].params.indexOf( key ) !== -1 ) {
								hashchange_arr[ i ][ "this_obj" ] = that
								arr_run_hashchange.push( hashchange_arr[ i ] );
								break;
							}
						}
					}

				} else {

					// Add and RUN !!
					for ( var i in hashchange_arr.params ) {
						if ( hashchange_arr.params[ i ] in url_params ) {
							hashchange_arr[ "this_obj" ] = that;
							arr_run_hashchange.push( hashchange_arr );
							break;
						}
					}
				}
				if ( arr_run_hashchange.length ) {
					for ( var i in arr_run_hashchange ) {

						arr_run_hashchange[ i ].callback.call( that, url_params, url_params );
					}
					v.url.arr_hashchange = v.url.arr_hashchange.concat( arr_run_hashchange );
				}
			}

		},

		set_new_name : function ( name ) {
			window[ name ] = v;
		}
	};

	/** ****************************************************************************************************
	 * */

	$( document ).ready( function () {
		$.extend( v, v_methoden );
		// Default False
		$.ajaxSetup( {
			cache : v.ajaxSetup
		} );

		// // Initialisierung Hashchange.
		if ( !( 'onhashchange' in window ) ) {
			var oldhref = location.href;
			setInterval( function () {
				var newhref = location.href;
				if ( oldHref !== newhref ) {
					oldhref = newhref;
					v.haupt_hashchange.call( window, {
						'type' : 'hashchange',
						'newURL' : newhref,
						'oldURL' : oldhref
					} );
				}
			}, 100 );
		} else if ( window.addEventListener ) {
			window.addEventListener( "hashchange", v.haupt_hashchange, false );
		} else if ( window.attachEvent ) {
			window.attachEvent( "onhashchange", v.haupt_hashchange );
		}

		window[ "v" ] = v;
		v.params = v.url.get_params_url();
		v.add_v_store( $( "html" ) );
		v.add_v_store( $( "body" ) );
		$( document ).ajaxError( function ( event, request, settings ) {
			console.error( "ajaxError" );
			v.session_is_expired( request );
		} );
	} );

} )( window );