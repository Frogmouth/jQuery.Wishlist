/* Beta Version 1.2.1 by Simone Luise - infoWishlist@simoneluise.com
*
*  //--> (si riferisce a future evoluzioni)
*
*/
(function($){
	
	// window.wishlist: oggetto che verrà popolato dalle impostazini generali di wishlist che varranno per tutte le istanze del plugin e che al suo interno conterrà tutti le collection
	// serve per reperire tutte le informazioni all'esterno del plugin, anche dopo che è stato richiamato, le varie collection sono richiamabili tramite:
	// var collezione = window.wishlist[setCookie.name]
	// dove "setCookie.name" è il nome del cookies impostato nel plugin.
	
	window.wishlist = {};
	
	wishlist.debug = false; 					//modalità debug generale del plugin
	
	//controlli sulle librerie necessarie
	if(window.wishlist.debug){
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
	}
	//fine controlli

	$.fn.wishlist = function(options){
	
		var that = this;
	
		var settings = $.extend({
			setCookie : {
				name : that.attr("id"),		// nome del cookie da interrogare e aggiornare (utilizza l'id dell'elemnto in this)
				expire : 365,				// durata del cookies
				path : "/"					// path ("/" consigliata)
			},								
			BackboneModel : {				// modello Backbone di "default" della struttura del cookies
				defaults : {
					id : null,
				}
			},										
			BackboneCollection : {},				// Colleczione Backbone che contiene tutti i cookies
			
			removeClass : "removeToWish",			// classe su cui bindare l'evento per rimuovere elementi dal cookies
			addClass : "addToWish",					// classe su cui bindare l'evento per aggiungere elmenti al cookies
			triggerClass : "wishAction",			// classe statica su cui bindare tutti gli eventi di modifica
			clearId : "clearWish",					// classe su cui bindare l'evento di l'eliminazione del cookie
			itemType : "div",						// in che tipo di tag devono essere mostrati i dati
			template : null,						//--> template underscore che verrà inserito negli item 
			
			
			triggerEvent : ["click", "click"],		// eventi sui quali bindare [0] -> aggiunta e [1] -> rimozione di elementi del cookies
			//override funzioni
			
			loadOverride : null,				// funzione che viene richiamata all'aggiunta di un elmento al cookie nonché al load del plugin
			removeOverride : null,				// funzione che viene richiamata alla rimozione di un elemento al cookie
			
			clearAllWishedItems : null,			// funzione che viene richiamata quando si elimina l'intero cookie
			wishTriggerFunction : null,			// funzione che viene richiamata per definire e aggiungere una nuova proprietà al modello prima che venga inserito nel cookie
			unbindAll : null,					// funzione che viene richiamata per prevenire l'evento che scatena il Clear, il remove e l'aggiunta di un cookie (es. quando il browser non accetta cookie)
			
			debug : false,						// controllo modalità debug {tramite console.log - NON ATTIVARE SE SI USA IE} sovrascrive la generale all'interno dell'esecuzione del plugin
			
			text : {							// testi
				noCookies : "Questa funzione è utilizzabile solo con cookies attivi.",
				add : "Aggiungi ",
				remove : "Rimuovi "
			}
		}, options );
		
		//controlli locali
		
			if(typeof window.wishlist[settings.setCookie.name] != "undefined"){
				settings.setCookie.name = "_" + settings.setCookie.name;
				var nameError = 1;
			}

			if(settings.debug == true){
				console.log("Inizio Debug");

				if(typeof nameError != "undefined"){
					console.log("Cookie's name already in use: change it please. the name is change in '_yoursetCookie.name'");
				}
				
			}
			
			debWish = function(){ (settings.debug) ? console.log('Cookie:', $.cookie(settings.setCookie.name)) : function(){}; };
			debCookie = function(){ (settings.debug) ? console.log('Collection:', that.wishList) : function(){}; };
			toConsole = function(msg, value){ (settings.debug) ? console.log(msg+': ', value) : function(){}; };
		
		//fine controlli locali
		
		//METODI GESTIONE COOKIE E OGGETTI COLLEZIONI BACKBONE DI WISHLIST
		//invocato per aggiungere un'istanza all'oggetto locale wishlist
		addToWish = function(options){
			options = (typeof options != "array") ? new Array(options) : options;
			that.wishList.add(options);
			toGlobal();
			debWish();
		};
		
		//invocato per eliminare un'istanza dall'oggetto locale wishlist
		removeToWish = function(id){
			that.wishList.remove(that.wishList.get(id));
			toGlobal();
			debWish();
		};
		
		//invocato per ripulire tutto l'oggetto locale wishlist
		clearWish = function(){
			that.wishList.remove(that.wishList.models);
			toGlobal();
			debWish();
		};
		
		// invocato ogni volta che cambia l'oggetto locale wishlist
		wishToCookie = function(){
			$.cookie(settings.setCookie.name, JSON.stringify(that.wishList), { expires: settings.setCookie.expire, path: settings.setCookie.path });
			debCookie();
		};
		
		// invocato ogni volta che si pulisce l'oggetto locale wishlist
		clearCookies = function(){
			$.removeCookie(settings.setCookie.name, { path: settings.setCookie.path });
			debCookie();
		};
		
		//metodo per aggiornare la versione globale di wishlist
		toGlobal = function(){
			window.wishlist[settings.setCookie.name] = that.wishList;
		};
		
		//METODI DI MANIPOLAZIONE DEL DOM
		
		addItemList = function(data){
			var rel = settings.setCookie.name;
			var TAG = settings.itemType;
			var list = "";
			for(key in data){
				list = (typeof data[key] != "function") ? list + "<li class='"+key+"'>"+data[key]+"</li>": list;
			}
			
			var html = "<"+TAG+" rel='"+rel+"' id='item_"+data.id+"' data-id="+data.id+"><ul>"+list+"</ul></"+TAG+">";
			($("#item_"+data.id).length < 1) ? that.append(html) :  $("#item_"+data.id).replaceWith(html);
		};
		
		removeItemList = function(id){
			if(typeof id == "undefined"){
				$("*[rel="+settings.setCookie.name+"]").fadeOut().remove();
				return;
			}
			$("#item_"+id).fadeOut().remove();
		};
		
		//ALTRI METODI
		//metodo che raccoglie tutte le da inserire nel modello backbone
		picker = function(element){
			
			var data = element.data();
			return data;
			//--> gestione elmenti multipli
			
		};
		
		//GESTORI DEGLI EVENTI
		
		//metodo che definisce i trigger
		setHandler = function(){
			$("."+settings.triggerClass).on(settings.triggerEvent[0]+".triggerEvent", function(event){
				event.preventDefault();
				//--> funzione da richiamare prima dell'evento.
				
				var data = picker($(this));
				
				/*debug*/ toConsole('i data presi', data);
				
				if($(this).hasClass(settings.addClass)){
					addToWish(data);
					addItemList(data);
					//-->inserire la manipolazione qui
					
				}else{
					removeToWish(data.id);
					removeItemList(data.id);
					//-->inserire la manipolazione qui
				}

				wishToCookie();
				
				//--> funzione callback
			});
			$("#"+settings.clearId).on(settings.triggerEvent[1]+".triggerClear", function(event){
				event.preventDefault();
				
				//--> funzione da richiamare prima dell'evento clear.
				
				clearWish();
				clearCookies();
				removeItemList();
				
				//--> funzione callback
				
			});
		};
		
		unsetHandler = function(){
			toConsole("cookie", "disattivati! Attivali e riprova.");
			$("#"+settings.clearId, "."+settings.triggerClass).on("click", function(){
				alert(settings.text.noCookies);
			});
		};
		
		//COSTRUTTORE
		//controllo sulla possibilità di settare cookies se non posso prevengo tutti i click!
		$.cookie('wishtest', 1, { path: '/' });
		($.cookie('wishtest')) ? setHandler() : unsetHandler();
		
		//rilevo il cookie
		that.cookiesList = $.cookie(settings.setCookie.name);
		
		//Definisco il model e la collection di backbone
		that.wishCookie = Backbone.Model.extend(settings.BackboneModel);
		settings.BackboneCollection.model = that.wishCookie; // (!!!!) sovrascrivo il model che deve per forza essere quello appena creato
		that.wishCookies = Backbone.Collection.extend(settings.BackboneCollection);
		
		//inizializzazione degli oggetti wishlist (locale e globale)
		window.wishlist[settings.setCookie.name] = that.wishList = (!that.cookiesList || that.cookiesList == null) ? new that.wishCookies() : that.wishList = new that.wishCookies($.parseJSON(that.cookiesList));
		debCookie();
		
		//--> manipolatore al load - carico la lista
		
		that.wishList.forEach(function(value){
			addItemList(value.attributes);
		});
		
		return this;
	}
	
}( jQuery ));
