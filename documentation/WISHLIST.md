Wisthlist
==========

How to use
----------

### Libs include needed


First include in your `<head>` the script:

    <script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
	<script type="text/javascript" src="http://underscorejs.org/underscore-min.js"></script>
	<script type="text/javascript" src="http://backbonejs.org/backbone-min.js"></script>
	
	<!-- dowload and include local -->
	<script type="text/javascript" src="/path/to/jquery.cookie.js"></script>
	<script type="text/javascript" src="/path/to/json2.js"></script>
	
	<!-- lastone jquery Wishlist libs -->
	<script type="text/javascript" src="/path/to/jquery_wish.js"></script>`

Now you can instance `.wishlist()`: 

	<script type="text/javascript">
		$(document).ready(function(){
			// #wishList is the <div> tag that will contain the list of wished item <div>
			$("#wishList").wishlist();
		});
	</script>

### basic example of HTML

A basic exaple to wishing an element by his ID:

	<!-- wish button -->
	<a class="wishAction addToWish" data-id="1" href="#!">Add 1</a></li>
	
	<!-- wished list -->
	<div id="wishList">
	</div>
	
	<!-- clear wish list -->
	<a id="clearWish" href="#!">Pulisi Lista</a>
	
Global Variable, Method and Properties
---------

`Wishlist` extend `$` with object some useful **properties** and **methods** accessible from window.
Use those only befoure call `$(*someelement*).Wishlist()`.

#### Properties
* ##### `window.whislist` #####

	+   **Definition** : a object that contain all wishlist global settings and all Backbone collection create every time call new `whislist()`
	+   **Default** : `{}`
	+   **Object properties** :
	
		- **`debug`** 
		
			+   **Definition** : active the global wishlist debug for visualize the global error log {if active IE become not supported}
			+   **Default** : `false`
			
		-  **{Cookie Name}**
		
			+   **Definition** : every time you call `whislist()` the plug in store in `window.whislist[*cookieName*]` a Backbone collection with all element preset inside the wishlist.
			+   **Default** : [Backbone Collection](http://backbonejs.org/#Collection 'See Domcumentation')


#### Methods
* ##### `$.wishListToJSON` #####

	+   **Definition** : a function to get the data in the cookie (select by cookie name) in JSON format.
	+   **Attributes** : `name`
	+   **return** : JSON object
    +   **avablility** : from **1.2.2 version**
	

Local Method and Properties
---------

`Wishlist` allowe some useful **properties** and **methods** for customize the pluing's local behavior.

	$(someelement).Wishlist({
		//insert here properties and methods for override it
	});

####Properties
* ##### `setCookie` #####

	+   **Definition** : json object that contain cookie information
	+   **Default** : `{ name : that.attr("id"), exipred : 365, path : "/"}`

* #####`BackboneModel` #####

	+   **Definition** : Backbone model that represents Wishlist item
	+   **Default** :  `{ defaults : { id : null, } }`

* #####`BackboneCollection` #####

	+   **Definition** : Backbone Collection that containall wishlist Model
	+   **Default** :  `{}`
    
        **Important: `modal` _property of this object will be overwritten_**

* #####`removeClass` #####

	+   **Definition** : class which bind the event for remove some elment to wishlist
	+   **Default** :  "removeToWish"

* #####`addClass` #####

	+   **Definition** : class which bind the event for add some elment to wishlist
	+   **Default** :  `"addToWish"`

* #####`triggerClass`#####

	+   **Definition** : class which bind all edit event
	+   **Default** :  `"wishAction"`

* #####`clearId` #####

	+   **Definition** : id which bind for clear wishlist
	+   **Default** :  `"clearWish"`
    
* #####`itemType`#####

    +   **Definition** : tag taht wrap the cookies information when printed
	+   **Default** :  `div`
    
* #####`template`#####

    +   **Definition** : underscore template uses for display the information
	+   **Default** :  `null`
    
        **Important: _unavailable, it's a future update._**


* #####`triggerEvent`#####

	+   **Definition** : binded type event [0] -> add event [1] -> remove event
	+   **Default** :  `["click", "click"]`

* #####`debug` #####

	+   **Definition** : debug mode, show return information on browser console (not use in IE)
	+   **Default** :  `false`

* #####`text` #####

	+   **Definition** : Testi di default
	+   **Default** :  `{ noCookies : "Questa funzione è utilizzabile solo con cookies attivi.", add : "Aggiungi ",remove : "Rimuovi "}`

####Method

There are some local methods that allow to altering or extending the behavior of the plugin. By default all of this methods value is `null`, you can sat a function that override or extend the default behavior.

**Important:** Up to *version **1.2.1*** this method not override method's behavior!
**Methods override end extended documentation coming soon...**
