/* 
 * Last Version 1.3.2 by Simone Luise
 * http://github.com/Frogmouth/jQuery.Wishlist/
 */

(function($){
	
	// window.wishList: oggetto che verrà popolato dalle impostazini generali di wishlist che varranno per tutte le istanze del plugin e che al suo interno conterrà tutti le collection
	// serve per reperire tutte le informazioni all'esterno del plugin, anche dopo che è stato richiamato, le varie collection sono richiamabili tramite:
	// var collezione = window.wishList[setCookie.name]
	// dove "setCookie.name" è il nome del cookies impostato nel plugin.
	
	window.wishList = {
		length : 0
	};
	
	if(typeof _ == "undefined" || typeof Backbone == "undefined") return wishlist = false;

	//fine controlli
	
	$.fn.wishItem = function(options,WISHLIST){

		var $that = this;
		var settings = this.settings = $.extend({
			removeClass : "removeToWish",			// classe su cui bindare l'evento per rimuovere elementi dal cookies
			addClass : "addToWish",					// classe su cui bindare l'evento per aggiungere elmenti al cookies
			triggerClass : "wishAction",			// classe statica su cui bindare tutti gli eventi di modifica
			sameButton : true,						// usare lo stesso bottone per aggiungere e rimuovere gli elementi
			triggerEvent : "click",					// eventi sui quali bindare [0] -> aggiunta e [1] -> rimozione di elementi del cookies
			picker : null,							// funzione che sovrascrive il metodo di raccolta delle informazioni

			//override methods

			onRemove : null,
			onAdd : null,
			onClean : null

		},options);

		//ALTRI METODI
		//metodo che raccoglie tutte le da inserire nel modello backbone
		var picker =  settings.picker || function(item){
			//per il local storage prendo tutti i dati per i cookie solo l'ID
			var data = (WISHLIST.settings.useStorage) ? item.data() : {id:item.data("id")};
			return data;
			//--> gestione elmenti multipli
		}
		
		//COLLECATORI DEI GESTORI AGLI EVENTI

		//metodo che definisce i trigger
		var unsetAttHandler = function(){
			$that.addClass("wishDisabled");
			$that.on("click",function(){
				console.log("COOKIE DISABLED");
			});
		}

		var defOnClean = settings.onClean || function(){
			$that.find("."+settings.triggerClass).addClass($that.settings.addClass).removeClass($that.settings.removeClass);
		}

		var defOnAdd = settings.onAdd || function(item){
			$that.find("[data-id="+item.id+"]").addClass($that.settings.addClass).removeClass($that.settings.removeClass);
		}

		var defOnRemove = settings.onRemove || function(item){
			$that.find("[data-id="+item.id+"]").removeClass($that.settings.addClass).addClass($that.settings.removeClass);
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
				case "remove" : defOnRemove(item);
				break;
				case "add" : defOnAdd(item);
				break;
				case "reset" : defOnClean();
				break;
			}
		}

		return this.each(function(){
			$(this).data("wishList",WISHLIST);
			if(typeof WISHLIST.data.get($(this).find("."+settings.triggerClass).data("id")) !== "undefined") $(this).find("."+settings.triggerClass).removeClass(settings.addClass).addClass(settings.removeClass);
			$(this).on(settings.triggerEvent + ".wish","."+settings.triggerClass, function(event){
				event.preventDefault();
				var data = picker($(this));

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

	$.fn.wishBar = function(options,WISHLIST){
	
		var that = this;

		var settings = this.settings = $.extend({
			
			//template underscore che verrà inserito negli item 
			template : "<div rel='"+WISHLIST.ID+"' id='wishItem_<%- id %>' class='wishedItem' data-id='<%- id %>'><img src='<%- img %>'><p><%- title %></p></div>",

			//override dei metodi di manipolazione del DOM
			addItemHtml : null,						// sovrascrive il metodo di manipolazione del DOM all'aggiunta di un item (attrbutes: data)
			removeItemHtml : null,					// sovrascrive il metodo di manipolazione del DOM alla rimozione di un item (attrbutes: id)
			
		},options);
		
		//METODI DI MANIPOLAZIONE DEL DOM
		//invocato quando si aggiunge un elemento
		var itemList = settings.addItemHtml || function(data){
			var tmpl = _.template(settings.template);
			var wishedHtml = tmpl(data);
			that.append(wishedHtml);
		}
		
		//invocato quando si rimuove un elemento
		var removeItem = settings.removeItemHtml || function(id){
			if(typeof id == "undefined"){
				$("*[rel="+WISHLIST.ID+"]").fadeOut().remove();
				return;
			}
			$("#wishItem_"+id).fadeOut().remove();
		}

		WISHLIST.propagate.wishBar = function(action,item){
			switch(action){
				case "remove" : removeItem(item.id);
				break;
				case "add" : itemList(item);
				break;
				case "reset" : removeItem();
				break;
			}
		}

		that.data("wishList",WISHLIST);
		WISHLIST.data.forEach(function(value){
			itemList(value.attributes);
		});
		
		return this;
	}

	$.Wishlist = function(ID,options){

		if(typeof ID === "undefined") return false;

		var WARN = [];
		var WISHLIST = window.wishList[ID] = {};
		window.wishList.length++;
		var settings = WISHLIST.settings = $.extend({

			$wishBar : $("#wishList"),
			$wishItem : $(".wishItem"),
			barOption : {},
			itemOption : {},
			counterClass : "wishCounter",			// classe su cui bindare l'evento di l'eliminazione del cookie
			clearId : "clearWish",					// classe su cui bindare l'evento di l'eliminazione del cookie
			//a parte il cookie possiamo usare i webstorage
			useStorage : (typeof localStorage === "undefined")?false:true,	
			storeID : (typeof localStorage === "undefined")?false:true,

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
					url : null
				}
			},
			BackboneCollection : {},	// Oggetto di estensione della collection che rappresenta la wishlist
			
			//funzioni di callback eseguite...
			onClean : null,				// ... prima del gestore di pulizia della wishlist estendendolo
			onLoad : null,				// ... dopo il costruttore 
			onChange : null,			// ... dopo il gestore dell'evento di modifica della collection
			
			text : {
				noStorage : "Wishlist needs cookie enabled.",
				add : "Add ",
				remove : "Remove "
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
			var res = (settings.useStorage) ? loadLocalStorage() : loadCookieStorage();
			return (!res || res == null) ? false : $.parseJSON(res);
		} 

		WISHLIST.updateStorege = function(){
			(settings.useStorage) ? wishToLocal() : wishToCookie();
		}

		WISHLIST.cleanStorege = function(){
			(settings.useStorage) ? clearLocal() : clearCookies();
			WISHLIST.toGlobal();
		}

		//METODI GESTIONE LOCAL STORAGE

		var loadLocalStorage = function(){
			return localStorage.getItem(settings.storegeName);
		}

		var wishToLocal = function(){
			localStorage.setItem(settings.storegeName,JSON.stringify(WISHLIST.data));
			if(settings.storeID) storeIDinCookie();
		}

		var clearLocal = function(){
			localStorage.removeItem(settings.storegeName);
			if(settings.storeID) storeIDinCookie();
		}
 
		var storeIDinCookie = function(){
			var ids = [];
			WISHLIST.data.each(function(item){
				ids.push(item.id)
			});
			$.cookie(settings.setCookie.name+ "_IDS",JSON.stringify(ids));
			console.log($.cookie(settings.setCookie.name+ "_IDS"));
		}

		//METODI GESTIONE COOKIE WISHLIST
		// invocato ogni volta che cambia l'oggetto locale wishlist

		var loadCookieStorage = function(){
			return $.cookie(settings.setCookie.name);
		}

		var wishToCookie = function(){
			$.cookie(settings.setCookie.name, JSON.stringify(WISHLIST.data), { expires: settings.setCookie.expire, path: settings.setCookie.path });
		}
		
		// invocato ogni volta che si pulisce l'oggetto locale wishlist
		var clearCookies = function(){
			$.removeCookie(settings.setCookie.name, {path: settings.setCookie.path});
		}

		//GESTORE MODIFICA DELLA COLLECTION 

		var collectionChange = function(actionName,model,collection,options){
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
			if(typeof settings.onChange== "function") settings.onChange.call(WISHLIST,actionName,model,collection);
		}

		$("#"+settings.clearId).on("click.triggerClear", function(e){
			e.preventDefault();
			WISHLIST.clearWish();
			if(typeof settings.onClean == "function") settings.onClean.call(WISHLIST);
		});

		//COSTRUTTORE
	
		//Definisco il model e la collection di backbone
		settings.BackboneCollection.model = Backbone.Model.extend(settings.BackboneModel);
		var wishStorage = Backbone.Collection.extend(settings.BackboneCollection);

		//inizializzazione degli oggetti wishlist (locale e globale)
		var JSONStorage = WISHLIST.loadStorage();
		WISHLIST.data = new wishStorage();
		
		WISHLIST.data.on("all",collectionChange,WISHLIST);

		if(JSONStorage) WISHLIST.data.add(JSONStorage);

		if(settings.$wishBar.length > 0) settings.$wishBar.wishBar(settings.barOption,WISHLIST);
		if(settings.$wishItem.length > 0) settings.$wishItem.wishItem(settings.itemOption,WISHLIST);
	
		if(typeof settings.onLoad == "function") settings.onLoad.call(WISHLIST);

		WISHLIST.toGlobal();

		return WISHLIST;
	}

}( jQuery ));
