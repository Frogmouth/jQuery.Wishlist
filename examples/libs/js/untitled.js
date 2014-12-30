$.fn.wishBar = function(options,WISHLIST){
	
		var that = this;

		var settings = $.extend({
					
			//template underscore che verrà inserito negli item 
			template : "<div rel='"+that.attr("id")+"' id='item_<%- id %>'' class='wishedItem' data-id='<%- id %>'><img src='<%- img %>'><p><%- title %></p></div>",
			
			//override dei metodi di manipolazione del DOM
			loadHtml : null,						// sovrascrive il metodo costruttore della struttura HTML della wishlist
			addItemHtml : null,						// sovrascrive il metodo di manipolazione del DOM all'aggiunta di un item (attrbutes: data)
			removeItemHtml : null,					// sovrascrive il metodo di manipolazione del DOM alla rimozione di un item (attrbutes: id)
			
		},options);
		
		//METODI DI MANIPOLAZIONE DEL DOM
		//invocato quando si aggiunge un elemento
		this.addItemList = (typeof settings.addItemHtml == "function") ? settings.addItemHtml : function(data){
			var tmpl = _.template(settings.template);
			var wishedHtml = tmpl(data);
			that.append(wishedHtml);
		}
		
		//invocato quando si rimuove un elemento
		this.removeItemList = (typeof settings.removeItemHtml == "function") ? settings.removeItemHtml : function(id){
			if(typeof id == "undefined"){
				$("*[rel="+settings.setCookie.name+"]").fadeOut().remove();
				return;
			}
			$("#item_"+id).fadeOut().remove();
		}

		WISHLIST.forEach(function(value){
			addItemList(value.attributes);
		});
		
		return this;
	}