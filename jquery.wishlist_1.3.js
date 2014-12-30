/* 
 *	Last Version 1.3 by Simone Luise - infoWishlist@simoneluise.com
 */

(function($){
	
	window.wishList = {
		length : 0
	};
	
	if(typeof _ == "undefined" || typeof Backbone == "undefined") return wishlist = false;

	//fine controlli
	
	$.fn.wishItem = function(WISHLIST,options){

		var $that = this;
		var settings = this.settings = $.extend({
			removeClass : "removeToWish",			// classe su cui bindare l'evento per rimuovere elementi dal cookies
			addClass : "addToWish",					// classe su cui bindare l'evento per aggiungere elmenti al cookies
			triggerClass : "wishAction",			// classe statica su cui bindare tutti gli eventi di modifica
			sameButton : true,						// usare lo stesso bottone per aggiungere e rimuovere gli elementi
			triggerEvent : "click",					// eventi sui quali bindare [0] -> aggiunta e [1] -> rimozione di elementi del cookies
			picker : null							// funzione che sovrascrive il metodo di raccolta delle informazioni
		},options);

		//ALTRI METODI
		//metodo che raccoglie tutte le da inserire nel modello backbone
		this.picker = (typeof settings.pickerOverride == "function") ? settings.picker : function(item){

			//per il local storage prendo tutti i dati per i cookie solo l'ID
			var data = (WISHLIST.settings.useStorage) ? item.data() : {id:item.data("id")};
			/*debug*/ toConsole('i data presi', data);
			return data;
			//--> gestione elmenti multipli
		}

		this.changeAdd = function(){
			try{
				if(that.wishList.length < 1) return false
				that.wishList.each(function(a){
					$("[data-id="+a.id+"]").removeClass("addToWish").addClass("removeToWish");
				});
			}catch(err){return false}
		}
		
		//COLLECATORI DEI GESTORI AGLI EVENTI
		
		//metodo che definisce i trigger
		unsetAttHandler = function(){
			$that.addClass("wishDisabled");
			$that.on("click",function(){
				console.log("COOKIE DISABLED");
			});
		}

		if(settings.useStorage){
			localStorage.wishlist = {};
			setHandler = true;
		}else{
			setHandler = (navigator.cookieEnabled) ? true : false;
		}

		if(!setHandler) return unsetAttHandler();

		WISHLIST.propagate.wishItem = function(action,item){
			switch(action){
				case "remove" : $that.find("[data-id="+item.id+"]").removeClass($that.settings.addClass).addClass($that.settings.removeClass);
				break;
				case "add" : $that.find("[data-id="+item.id+"]").addClass($that.settings.addClass).removeClass($that.settings.removeClass);
				break;
				case "reset" : $that.find("."+settings.triggerClass).addClass($that.settings.addClass).removeClass($that.settings.removeClass);
				break;
			}
		}

		return this.each(function(){
			$(this).data("wishList",WISHLIST);
			if(typeof WISHLIST.data.get($(this).find("."+settings.triggerClass).data("id")) !== "undefined") $(this).find("."+settings.triggerClass).removeClass(settings.addClass).addClass(settings.removeClass);
			$(this).on(settings.triggerEvent + ".wish","."+settings.triggerClass, function(event){
				event.preventDefault();
				var data = $that.picker($(this));

				if($(this).hasClass(settings.addClass)){
					WISHLIST.addToWish(data);
					if(settings.addClass) $(this).removeClass(settings.addClass).addClass(settings.removeClass);
				}else{
					WISHLIST.removeToWish(data.id);
					if(settings.addClass) $(this).removeClass(settings.removeClass).addClass(settings.addClass);
				}
			});
		});
	}

	$.fn.wishBar = function(WISHLIST,options){
	
		var that = this;

		var settings = this.settings = $.extend({
			
			//template underscore che verrà inserito negli item 
			template : "<div rel='"+WISHLIST.ID+"' id='wishItem_<%- id %>' class='wishedItem' data-id='<%- id %>'><img src='<%- img %>'><p><%- title %></p></div>",

			//override dei metodi di manipolazione del DOM
			loadHtml : null,						// sovrascrive il metodo costruttore della struttura HTML della wishlist
			addItemHtml : null,						// sovrascrive il metodo di manipolazione del DOM all'aggiunta di un item (attrbutes: data)
			removeItemHtml : null,					// sovrascrive il metodo di manipolazione del DOM alla rimozione di un item (attrbutes: id)
			
		},options);
		
		//METODI DI MANIPOLAZIONE DEL DOM
		//invocato quando si aggiunge un elemento
		this.itemList = (typeof settings.addItemHtml == "function") ? settings.addItemHtml : function(data){
			var tmpl = _.template(settings.template);
			var wishedHtml = tmpl(data);
			that.append(wishedHtml);
		}
		
		//invocato quando si rimuove un elemento
		this.removeItem = (typeof settings.removeItemHtml == "function") ? settings.removeItemHtml : function(id){
			if(typeof id == "undefined"){
				$("*[rel="+WISHLIST.ID+"]").fadeOut().remove();
				return;
			}
			$("#wishItem_"+id).fadeOut().remove();
		}

		WISHLIST.propagate.wishBar = function(action,item){
			switch(action){
				case "remove" : that.removeItem(item.id);
				break;
				case "add" : that.itemList(item);
				break;
				case "reset" : that.removeItem();
				break;
			}
		}

		that.data("wishList",WISHLIST);
		WISHLIST.data.forEach(function(value){
			that.itemList(value.attributes);
		});
		
		return this;
	}

	$.Wishlist = function(ID,options){

		if(typeof ID === "undefined") return false;

		var WARN = [];
		var WISHLIST = window.wishList[ID] = {};
		window.wishList.length++;
		var settings = WISHLIST.settings = $.extend({

			//a parte il cookie possiamo usare i webstorage
			useStorage : (typeof localStorage === "undefined")?false:true,	

			storegeName : ID,			//nome con il quale verrà salvata la wishlist nel local storage
			setCookie : {
				name : ID,				// nome del cookie da interrogare e aggiornare (utilizza l'id dell'elemnto in this)
				expire : 365,			// durata del cookies
				path : "/"				// path ("/" consigliata)
			},
			BackboneModel : {			// modello Backbone di "default" della struttura del cookies
				defaults : {
					id : null,
					title : null,
					img : null
				}
			},
			BackboneCollection : {},	// Oggetto di estensione della collection che rappresenta la wishlist

			useCustomElements : false,
			$wishBar : $("#wishList"),
			$wishItem : $(".wishItem"),
			barOptions : {},
			itemOptions : {},
			counterClass : "wishCounter",			// classe su cui bindare l'evento di l'eliminazione del cookie
			clearId : "clearWish",					// classe su cui bindare l'evento di l'eliminazione del cookie
			
			//funzioni di callback eseguite...
			onClean : null,				// ... prima del gestore di pulizia della wishlist estendendolo
			onLoad : null,				// ... dopo il costruttore 
			onChange : null,			// ... dopo il gestore dell'evento di modifica della collection

			//altre properieta secondarie
			debug : false,				// controllo modalità debug {tramite console.log - NON ATTIVARE SE SI USA IE} sovrascrive la generale all'interno dell'esecuzione del plugin
			
			text : {
				noStorage : "Questa funzione &egrave; utilizzabile solo se hai attivi i cookie o il LocalStorage.",
				add : "Aggiungi ",
				remove : "Rimuovi "
			}
		},options);

		WISHLIST.ID = ID;
		WISHLIST.propagate = {};

		//METODI GESTIONE OGGETTI COLLEZIONI BACKBONE DI WISHLIST
		//invocato per aggiungere un'istanza all'oggetto locale wishlist
		WISHLIST.addToWish = function(data){
			options = (typeof data != "array") ? new Array(data) : data;
			WISHLIST.data.add(data);
		}
		
		//invocato per eliminare un'istanza dall'oggetto locale wishlist
		WISHLIST.removeToWish = function(id){
			WISHLIST.data.remove(WISHLIST.data.get(id));
		}
		
		//invocato per ripulire tutto l'oggetto locale wishlist
		WISHLIST.clearWish = function(){
			WISHLIST.data.reset();
		}
		
		//metodo per aggiornare la versione globale di wishlist
		WISHLIST.toGlobal = function(){
			window.wishList[ID] = WISHLIST;
		}
		
		//METODI DI GESTIONE DISAMBIGUITA' COOKIE/LOCALSTORAGE
		//metodi utilizzati per gestire lo store dei dati nei cookie piuttosto che nel localStorage

		WISHLIST.loadStorage = function(){
			var res = (settings.useStorage) ? WISHLIST.loadLocalStorage() : WISHLIST.loadCookieStorage();
			return (!res || res == null) ? false : $.parseJSON(res);
		} 

		WISHLIST.updateStorege = function(){
			(settings.useStorage) ? WISHLIST.wishToLocal() : WISHLIST.wishToCookie();
			debWish();
		}

		WISHLIST.cleanStorege = function(){
			(settings.useStorage) ? WISHLIST.clearLocal() : WISHLIST.clearCookies();
			WISHLIST.toGlobal();
			debWish();
		}

		//METODI GESTIONE LOCAL STORAGE

		WISHLIST.loadLocalStorage = function(){
			return localStorage.getItem(settings.storegeName);
		}

		WISHLIST.wishToLocal = function(){
			localStorage.setItem(settings.storegeName,JSON.stringify(WISHLIST.data));
		}

		WISHLIST.clearLocal = function(){
			localStorage.removeItem(settings.storegeName);
		}

		//METODI GESTIONE COOKIE WISHLIST
		// invocato ogni volta che cambia l'oggetto locale wishlist

		WISHLIST.loadCookieStorage = function(){
			return $.cookie(settings.setCookie.name);
		}

		WISHLIST.wishToCookie = function(){
			$.cookie(settings.setCookie.name, JSON.stringify(WISHLIST.data), { expires: settings.setCookie.expire, path: settings.setCookie.path });
		}
		
		// invocato ogni volta che si pulisce l'oggetto locale wishlist
		WISHLIST.clearCookies = function(){
			$.removeCookie(settings.setCookie.name, {path: settings.setCookie.path});
		}

		//GESTORE MODIFICA DELLA COLLECTION 

		collectionChange = function(actionName,model,collection,options){
			var item = model.attributes;
			switch(actionName){
				case "remove" : WISHLIST.updateStorege();
				break;
				case "add" : WISHLIST.updateStorege();
				break;
				case "reset" : WISHLIST.cleanStorege();
				break;
			}
			$("."+settings.counterClass).text(WISHLIST.data.length);
			for (fun in WISHLIST.propagate) {
				if(typeof WISHLIST.propagate[fun] === "function") WISHLIST.propagate[fun](actionName,item);
			}
			if(typeof settings.onChange== "function") settings.onChange(WISHLIST,actionName,model,collection);
		}

		$("#"+settings.clearId).on("click.triggerClear", function(e){
			e.preventDefault();
			WISHLIST.clearWish();
			if(typeof settings.onClean == "function") settings.onClean.call(WISHLIST);
		});

		debWish = function(){ (settings.debug) ? console.log('Stored elements:', WISHLIST.loadStorage()) : function(){}; };
		debCookie = function(){ (settings.debug) ? console.log('Collection:', WISHLIST.data) : function(){}; };
		toConsole = function(msg, value){ (settings.debug) ? console.log(msg+': ', value) : function(){}; };
		logWARN = function(){try{if(settings.debug) console.warn(WARN)}catch(err){}}

		//COSTRUTTORE
	
		//Definisco il model e la collection di backbone
		settings.BackboneCollection.model = Backbone.Model.extend(settings.BackboneModel);
		var wishStorage = Backbone.Collection.extend(settings.BackboneCollection);

		//inizializzazione degli oggetti wishlist (locale e globale)
		var JSONStorage = WISHLIST.loadStorage();
		WISHLIST.data = new wishStorage();
		
		WISHLIST.data.on("all",collectionChange,WISHLIST);

		if(JSONStorage) WISHLIST.data.add(JSONStorage);

		if(!settings.useCustomElements){
			if(settings.$wishBar.length > 0) settings.$wishBar.wishBar(WISHLIST,settings.barOptions);
			if(settings.$wishItem.length > 0) settings.$wishItem.wishItem(WISHLIST,settings.itemOptions);
		}
	
		if(typeof settings.onLoad == "function") settings.onLoad.call(WISHLIST);

		WISHLIST.toGlobal();
		debWish();

		return WISHLIST;
	}
	
}( jQuery ));
