// Beta Version 1.1 by Simone Luise - infoWishlist@simoneluise.com

(function($){
	
	// window.wishlist: oggetto che verrà popolato dalle impostazini generali di wishlist che varranno per tutte le istanze del plugin e che al suo interno conterrà tutti le collection
	// serve per reperire tutte le informazioni all'esterno del plugin, anche dopo che è stato richiamato, le varie collection sono richiamabili tramite:
	// var collezione = window.wishlist[cookieName]
	// dove "cookieName" è il nome del cookies impostato nel plugin.
	
	window.wishlist = {};
	
	window.wishlist.debug = false; 					//modalità debug generale del plugin
	
	$.fn.wishlist = function(options){
	
		var that = this;
	
		var settings = $.extend({
			cookieName : that.attr("id"), 			// nome del cookie da interrogare e aggiornare (utilizza l'id dell'elemnto in this)
			BackboneModel : {				// modello Backbone di "default" della struttura del cookies
				defaults : {
					id : null,
				}
			},										
			BackboneCollection : {},			// Colleczione Backbone che contiene tutti i cookies
			removeClass : "removeToWish",			// classe su cui bindare l'evento per rimuovere elementi dal cookies
			addClass : "addToWish",				// classe su cui bindare l'evento per aggiungere elmenti al cookies
			triggerClass : "wishAction",			// classe statica su cui bindare tutti gli eventi di modifica
			clearId : "clearWish",				// classe su cui bindare l'evento di l'eliminazione del cookie
			triggerEvent : ["click", "click"],		// eventi sui quali bindare [0] -> aggiunta e [1] -> rimozione di elementi del cookies
			
			//override funzioni
			
			loadOverride : null,				// funzione che viene richiamata all'aggiunta di un elmento al cookie nonché al load del plugin
			removeOverride : null,				// funzione che viene richiamata alla rimozione di un elemento al cookie
			
			clearAllCallback : null,			// funzione che viene richiamata quando si elimina l'intero cookie
			wishTriggerFunction : null,			// funzione che viene richiamata per definire e aggiungere una nuova proprietà al modello prima che venga inserito nel cookie
			unbindAll : null,				// funzione che viene richiamata per prevenire l'evento che scatena il Clear, il remove e l'aggiunta di un cookie (es. quando il browser non accetta cookie)
			
			debug : false,					// controllo modalità debug {tramite console.log - NON ATTIVARE SE SI USA IE} sovrascrive la generale all'interno dell'esecuzione del plugin
			
			text : {					// testi
				noCookies : "Questa funzione è utilizzabile solo con cookies attivi.",
				add : "Aggiungi ",
				remove : "Rimuovi "
			}
		}, options );
		
		// eseguo dei controlli sui setaggi per sapere se sono corretti se il debug è attivo
		
		if(typeof window.wishlist[settings.cookieName] != "undefined"){
			settings.cookieName = "_" + settings.cookieName;
			var nameError = 1;
		}
		
		if(settings.debug == true){
			console.log("Inizio Debug");
			
			//controlli sulle librerie necessarie
			if(typeof _ == "undefined"){
				console.log("Undescrore: Not Found!");
			} else {
				console.log("Underscore: Ready!");
			}
			if(typeof Backbone == "undefined"){
				console.log("Backbone: Not Found!");
			} else {
				console.log("Backbone: Ready!");
			}
			
			if(typeof nameError != "undefined"){
				console.log("Cookie's name already in use: change it please. the name is change in '_yourcookiename'");
			}
			
			//controlli di routine sui settaggi
			
			console.log("Nessun Errore trovato nei settaggi");
			
		}
		
		//fine controlli
		
		that.cookiesList = $.cookie(settings.cookieName);	
/* #DBmode */ (settings.debug) ? console.log('Cookie Rilevato:', that.cookiesList) : null;
		
		//funzioni di callback
		
		laodWishlist = (typeof settings.loadCallback == "function") ? settings.loadOverride : function(){
			
			that.wishList.forEach(function(value, key){
				
				var iId = value.id;
				var $item = $("#wItem_" + value.id);
				
				if($item.length < 1){
					that.append("<li data-id='"+iId+"' id='wItem_"+iId+"'>"+iId+"</li>");
					$("."+settings.addClass+"[data-id='"+iId+"']").addClass(settings.removeClass).removeClass(settings.addClass).text(settings.text.remove+iId);
				} else {
					$item.data("id", iId);
					$item.text(iId);
					$item.attr("id", "wItem_"+iId);
				}
			});
	
		}
		
		removeCallback = (typeof settings.removeCallback == "function") ? settings.removeOverride : function(item, id){
			item.removeClass(settings.removeClass).addClass(settings.addClass).text(settings.text.add+id);
			$("#wItem_"+id).remove();
		}
		
		clearAllCallback = (typeof settings.clearAllCallback == "function") ? settings.clearAllCallback : function(){
			that.wishList.forEach(function(value){
				removeCallback($("a[data-id='"+value.id+"']"), value.id);
			});
			that.wishList.remove(that.wishList.models);
			window.wishlist[settings.cookieName] = that.wishList;
			$("#"+settings.cookieName + " > li").remove();
		}
		
		//funzione che determina il comportamento dei bottoni
		bindAllEvent = function(){
		
			$("."+settings.triggerClass).on(settings.triggerEvent[0]+".triggerEvent", function(event){
				event.preventDefault();
				
				if(typeof settings.WishTriggerFunction == "function"){
					settings.WishTriggerFunction();
				} else {
					var nId = $(this).data("id");
					if($(this).hasClass(settings.removeClass)){
						removeCallback($(this), nId);
						that.wishList.remove(that.wishList.get(nId));
					} else {
						that.wishList.add({id : nId});
						laodWishlist();
					}
					window.wishlist[settings.cookieName] = that.wishList;
				}
				
				window.wishlist[settings.cookieName] = that.wishList;
/* #DBmode */	(settings.debug) ? console.log('Collection:', that.wishList) : null;
				$.cookie(settings.cookieName, that.wishList.toJSONString(), { expires: 7, path: "/" });
/* #DBmode */	(settings.debug) ? console.log('Cookie:', $.cookie(settings.cookieName)) : null;

			});
		
			$("#"+settings.clearId).on(settings.triggerEvent[1]+".triggerClear", function(event){
				event.preventDefault();
				clearAllCallback();
			
				$.removeCookie(settings.cookieName, { path: '/' });
/* #DBmode */ 	(settings.debug) ? console.log('Collection:', that.wishList, 'Unset cookie:', (typeof $.cookie(settings.cookieName) == "undefined") ? true : false ) : null;
			});
			$.removeCookie('wishtest', { path: '/' });
		}
		
		//funzione per impedire di aggiungere cookies
		unbindAllEvent = (typeof settings.unbindAll == "function") ? settings.unbindAll : function(){
/* #DBmode */ (settings.debug) ? console.log("Error: Can't set cookies") : null;
			$("#"+settings.clearId, "."+settings.triggerClass).on("click", function(){
				alert(settings.text.noCookies);
			});
			
		}
		
		//Definisco il model e la collection di backbone
		
		that.wishCookie = Backbone.Model.extend(settings.BackboneModel);
		that.wishCookies = Backbone.Collection.extend({
			model : that.wishCookie
		});
		
		//controllo sulla possibilità di settare cookies se non posso prevengo tutti i click!
		$.cookie('wishtest', 1, { path: '/' });
		($.cookie('wishtest')) ? bindAllEvent() : unbindAllEvent();
		
		//inizializzazione
		window.wishlist[settings.cookieName] = that.wishList = (!that.cookiesList || that.cookiesList == null) ? new that.wishCookies() : that.wishList = new that.wishCookies(that.cookiesList.parseJSON());
		laodWishlist();
		
		return this;
	}
	
	// altri metodi statici
	
	//recuperare il contenuto della wishlist in formato json
	$.wishListToJSON = function(name){
		if(typeof name == "undefined"){
			(window.wishlist.debug) ? console.log("name arguments needed: ex. $.wishListToJSON('cookiename')") : null;
/* #DBmode */ 
			return false;
			
		}
		return window.wishlist[name].toJSON();
	}
	
}( jQuery ));
