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
			// #wishList is the <ul> tag that will contain the list of wished item <li>
			$("#wishList").wishlist();
		});
	</script>

### basic example of HTML

A basic exaple to wishing an element by his ID:

	<!-- wish button -->
	<a class="wishAction addToWish" data-id="1" href="#">Add 1</a></li>
	
	<!-- wished list -->
	<ul id="wishList">
	</ul>
	
	<!-- clear wish list -->
	<a id="clearWish" href="#!/ClearWishlist">Pulisi Lista</a>

Method and Properties
---------

`Wishlist` allowe some useful **properties** and **methods** for customize the pluing's behavior.

####Properties
* ##### `cookieName` #####

	+ **Definition** : name of the cookies that contain information
	+ **Default** : `"wishList"`

* #####`BackboneModel` #####

	+ **Definition** : Backbone model that represents Wishlist item
	+ **Default** :  `{ defaults : { id : null, } }`

* #####`BackboneCollection` #####

	+ **Definition** : Backbone Collection that containall wishlist Model
	+ **Default** :  `{}`

* #####`removeClass` #####

	+ **Definition** : class which bind the event for remove some elment to wishlist
	+ **Default** :  "removeToWish"

* #####`addClass` #####

	+ **Definition** : class which bind the event for add some elment to wishlist
	+ **Default** :  `"addToWish"`

* #####`triggerClass`#####

	+ **Definition** : class which bind all edit event
	+ **Default** :  `"wishAction"`

* #####`clearId` #####

	+ **Definition** : id which bind for clear wishlist
	+ **Default** :  `"clearWish"`

* #####`triggerEvent`#####

	+ **Definition** : binded type event [0] -> add event [1] -> remove event
	+ **Default** :  `["click", "click"]`

* #####`debug` #####

	+ **Definition** : debug mode, show return information on browser console (not use in IE)
	+ **Default** :  `false`

* #####`text` #####

	+ **Definition** : Testi di default
	+ **Default** :  `{ noCookies : "Questa funzione è utilizzabile solo con cookies attivi.", add : "Aggiungi ",remove : "Rimuovi "}`
