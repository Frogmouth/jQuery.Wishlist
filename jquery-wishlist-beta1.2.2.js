/* Beta Version 1.2.2 by Simone Luise - infoWishlist@simoneluise.com
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
		(typeof _ == "undefined") ? console.log("Undescrore: Not Found!") : console.log("Underscore: Ready!");
		(typeof Backbone == "undefined") ? console.log("Backbone: Not Found!") : console.log("Backbone: Ready!");
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
			
			//override dei gestori degli eventi
			handlerLoad : null,						// sovrascrive il metodo costruttore dei dati
			handlerAdd : null,						// sovrascrive tutta la gestione dei dati e il loro inserimento nel DOM durante l'evento di aggiunta di un elmento
			handlerRemove : null,					// sovrascrive tutta la gestione dei dati e il loro inserimento nel DOM durante la rimozione di un elmento
			handlerCler : null,						// sovrascrive tutta la gestione dei dati e il loro inserimento nel DOM durante la rimozione di tutti gli elementi
			
			//middlewere
			pickerOverride : null,					// eseguito prima del gestore di aggiunta e rimozione sovrascrive il metodo di "ricerca" dei dati [deve ritornare un oggetto formattato come i default backbone] (attr: item)
			toClear : null,							// eseguito prima del gestore di pulizia della wishlist estendendolo
			
			//override dei metodi di manipolazione del DOM
			loadHtml : null,						// sovrascrive il metodo costruttore della struttura HTML della wishlist
			addItemHtml : null,						// sovrascrive il metodo di manipolazione del DOM all'aggiunta di un item (attrbutes: data)
			removeItemHtml : null,					// sovrascrive il metodo di manipolazione del DOM alla rimozione di un item (attrbutes: id)
			
			//funzioni di callback eseguite:
			onLoadCallback : null,					// dopo il costruttore
			onAddCallback : null,					// dopo il gestore dell'evento di aggiunta
			onRemoveCallback : null,				// dopo il gestore dell'evento di rimozione
			onClearCallback : null,					// dopo il gestore dell'evento di rimozione totale
			
			//altre properieta secondarie
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

			(settings.debug == true) ? console.log("Inizio Debug") : (typeof nameError != "undefined") ? console.log("Cookie's name already in use: change it please. the name is change in '_yoursetCookie.name'") : null;
			
			debWish = function(){ (settings.debug) ? console.log('Cookie:', $.cookie(settings.setCookie.name)) : function(){}; };
			debCookie = function(){ (settings.debug) ? console.log('Collection:', that.wishList) : function(){}; };
			toConsole = function(msg, value){ (settings.debug) ? console.log(msg+': ', value) : function(){}; };
		
		//fine controlli locali
		
		//METODI GESTIONE OGGETTI COLLEZIONI BACKBONE DI WISHLIST
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
			debWish();
		};
		
		//invocato per ripulire tutto l'oggetto locale wishlist
		clearWish = function(){
			that.wishList.remove(that.wishList.models);
			debWish();
		};
		
		//metodo per aggiornare la versione globale di wishlist
		toGlobal = function(){
			window.wishlist[settings.setCookie.name] = that.wishList;
		};
		
		//METODI GESTIONE COOKIE WISHLIST
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
		
		//METODI DI MANIPOLAZIONE DEL DOM
		//incovato quando si aggiunge un elemento
		addItemList = (typeof settings.addItemHtml == "function") ? settings.addItemHtml : function(data){
			var rel = settings.setCookie.name;
			var TAG = settings.itemType;
			var list = "";
			for(key in data){
				list = (typeof data[key] != "function") ? list + "<li class='"+key+"'>"+data[key]+"</li>": list;
			}
			
			var html = "<"+TAG+" rel='"+rel+"' id='item_"+data.id+"' data-id="+data.id+"><ul>"+list+"</ul></"+TAG+">";
			($("#item_"+data.id).length < 1) ? that.append(html) :  $("#item_"+data.id).replaceWith(html);
		};
		
		//incovato quando si rimuove un elemento
		removeItemList = (typeof settings.removeItemHtml == "function") ? settings.removeItemHtml : function(id){
			if(typeof id == "undefined"){
				$("*[rel="+settings.setCookie.name+"]").fadeOut().remove();
				return;
			}
			$("#item_"+id).fadeOut().remove();
		};
		
		//ALTRI METODI
		//metodo che raccoglie tutte le da inserire nel modello backbone
		picker = (typeof settings.pickerOverride == "function") ? settings.pickerOverride : function(item){
			var data = item.data();
			return data;
			//--> gestione elmenti multipli
			
		};
		
		//GESTORI
		
		//gestore dell'evento di aggiunta
		handlerAdd = (typeof settings.handlerAdd == "function") ? settings.handlerAdd : function(data){
			addToWish(data);
			addItemList(data);
			toGlobal();
		}
		
		//gestore dell'evento di rimozione
		handlerRemove = (typeof settings.handlerRemove == "function") ? settings.handlerRemove : function(data){
			removeToWish(data.id);
			removeItemList(data.id);
			toGlobal();
		}
		
		//gestore dell'evento di pulizia
		handlerClear = (typeof settings.handlerClear == "function") ? settings.handlerClear : function(){
			clearWish();
			removeItemList();
		}
		
		//COLLECATORI DEI GESTORI AGLI EVENTI
		
		//metodo che definisce i trigger
		setAttHandler = function(){
			$("."+settings.triggerClass).on(settings.triggerEvent[0]+".triggerEvent", function(event){
				event.preventDefault();
				
				var data = picker($(this));
				
				/*debug*/ toConsole('i data presi', data);
				
				if($(this).hasClass(settings.addClass)){
					handlerAdd(data);
					(typeof settings.onAddCallback == "function") ? settings.onAdd($(this), data) : null;
					
				}else{
					handlerRemove(data);
					(typeof settings.onRemoveCallback == "function") ? settings.onRemoveCallback($(this), data) : null;
				}
				
				wishToCookie();
			});
			$("#"+settings.clearId).on(settings.triggerEvent[1]+".triggerClear", function(event){
				event.preventDefault();
				
				(typeof settings.toClear == "function") ? settings.toClear($(this)) : null;
				
				handlerClear();
				clearCookies();
				
				(typeof settings.onClearCallback == "function") ? settings.onClearCallback() : null;
				
			});
		};
		
		unsetAttHandler = function(){
			toConsole("cookie", "disattivati! Attivali e riprova.");
			$("#"+settings.clearId, "."+settings.triggerClass).on("click", function(){
				alert(settings.text.noCookies);
			});
		};
		
		//metodo richiamato al load
		wishLoad = (typeof settings.handlerLoad == "function") ? settings.handlerLoad : function(){
			//rilevo il cookie
			that.cookiesList = $.cookie(settings.setCookie.name);

			//Definisco il model e la collection di backbone
			that.wishCookie = Backbone.Model.extend(settings.BackboneModel);
			settings.BackboneCollection.model = that.wishCookie; // (!!!!) sovrascrivo il model che deve per forza essere quello appena creato
			that.wishCookies = Backbone.Collection.extend(settings.BackboneCollection);

			//inizializzazione degli oggetti wishlist (locale e globale)
			window.wishlist[settings.setCookie.name] = that.wishList = (!that.cookiesList || that.cookiesList == null) ? new that.wishCookies() : that.wishList = new that.wishCookies($.parseJSON(that.cookiesList));
			debCookie();
		};
		
		//metodo che stampa la lista al load del plugin
		wishLoadHTML = (typeof settings.loadHtml == "function") ? settings.loadHtml : function(){
			//stampo la lista nel documento HTML
			that.wishList.forEach(function(value){
				addItemList(value.attributes);
			});
		};
		
		//COSTRUTTORE
		//controllo sulla possibilità di settare cookies se non posso prevengo tutti i click!
		$.cookie('wishtest', 1, { path: '/' });
		($.cookie('wishtest')) ? setAttHandler() : unsetAttHandler();
		
		wishLoad();
		wishLoadHTML();
	
		(typeof settings.onLoadCallback == "function") ? settings.onLoadCallback() : null;
		
		return this;
	}
	
	// Funzione che restituisce la wishlist selezionata
	$.getWishlist = function(name){
		if(typeof name == "undefined"){
			/* #DBmode */ (window.wishlist.debug) ? console.log("name arguments needed: ex. $.wishListToJSON('cookiename')") : null; 
			return false;
		}
		return window.wishlist[name];
	}
	
}( jQuery ));
