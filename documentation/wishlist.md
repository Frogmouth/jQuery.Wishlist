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

Now you can instance `$.wishlist(ID)`, `ID` is an unique alphanumeric String, the name of your wishlist: 

	$(document).ready(function(){
		$.wishlist("Wishlist");
	});

### basic example of HTML

A basic exaple to wishing an element by his ID:

	<!-- wish counter -->
	<a class="wishCounter">0</a>

	<!-- clear wish list -->
	<a id="clearWish" href="#!">Clean Wishlist</a>
	
	<!-- wish ITEMS -->
	<div class="item wishItem">
		<a class="wishAction addToWish" data-title="Foo" data-id="1" href="#">ADD Foo to wishlist</a>
	</div>
	<div class="item wishItem">
		<a class="wishAction addToWish" data-title="Fish" data-id="2" href="#">ADD Fish to wishlist</a>
	</div>
	<div class="item wishItem">
		<a class="wishAction addToWish" data-title="Mug" data-id="10" href="#">ADD Mug to wishlist</a>
	</div>

	<!-- wished list -->
	<div id="wishList">
	</div>
	
References
---------

 + [$.whislist()](#wishlist)
 + [$.fn.wishBar()](#wishbar)
 + [$.fn.wishItem()](#wishitem)

--- 

### Wishlist
`$.whislist(ID [,options])`

**Return** : [_object_] wishlist instance	

	$.Wishlist(ID,{
		/* insert here properties and methods for override it */
	});

- `ID` [**required**] : is an unique alpanumeric string, the name of wishlist

- `options` [_optional_] : is an object that extend the default properties of wishlist and methods 

####Properties

* ##### `useStorage` #####

	+   **Definition** : allows to force the use of localStorage instead Cookie
	+	**Value** : true/false
	+   **Default** : `(typeof localStorage === "undefined") ? false : true`

* ##### `storeID` #####

	+   **Definition** : allows to store the items ID inside a Cookie (useful if you need this information for backend)
	+	**Value** : false/true
	+   **Default** : `(typeof localStorage === "undefined") ? false : true`
	+	**See also**: [How wishlist communicates with the backend](#how-wishlist-communicates-with-the-backend)

* #####`storegeName` #####

	+   **Definition** : allows you to force the name (ID) of your wishlist
	+   **Default** :  `ID` - ID passed like attribute of `$.wishlist()`

* #####`setCookie` #####

	+   **Definition** : The property of cookie
	+   **Default** :  
			{
				"name" : ID, /*ID passed like attribute $.wishlist()*/
				"expire" : 365,
				"path" : "/"
			}

* #####`BackboneModel` #####

	+   **Definition** : object that extends the Backbone model
	+   **Default** :  
			{
				"defaults" : {
					id : null,
					title : null,
					img : null
				}
			}

* #####`BackboneCollection` #####

	+   **Definition** : object that extends the Backbone collection, by default the attributes `model` of beckbone collection is the `BackboneModel`
	+   **Default** :  `{}`
	+	**Important: `model` _property of this object will be overwritten_**

* #####`useCustomElements` #####

	+   **Definition** : allow you to force the plugin to ignore the default elements rendered by wishlist
	+   **Default** :  `false`

* #####`$wishBar` #####

	+   **Definition** : a jquery selector of a DOM element where render the list of wished item
	+   **Default** : `$(".wishItem")`

* #####`$wishItem` #####

	+   **Definition** : a jquery selector of DOM elements that rapresents the elemen to wish
	+   **Default** : `$("#wishList")`

* #####`barOptions` #####

	+   **Definition** : an object that override the default option of wishlist bar
	+   **Default** :  `{}`
	+	**REF** : [$.fn.wishBar()](#wishbar)

* #####`itemOptions` #####

	+   **Definition** : an object that override the default option of wishlist items
	+   **Default** : `{}`
	+	**REF** : [$.fn.wishItem()](#wishitem)


* #####`counterClass` #####

	+   **Definition** : the name of the class where wishlist place the number of the elements inside the wishlist
	+   **Default** :  `"wishCounter"`

* #####`clearId` #####

	+   **Definition** : id which bind for clear wishlist
	+   **Default** :  `"clearWish"`

* #####`text` #####

	+   **Definition** : Testi di default
	+   **Default** :
			{
				"noStorage" : "Enable Cookie, please",
				"add" : "Add ",
				"remove" : "Remove "
			}

 ####Methods

	There are some local methods that allow to altering or extending the behavior of the plugin. By default all of this methods value is `null`, you can sat a function that override or extend the default behavior.
	    
	* ##### `onLoad()` #####
		+   **Definition** : invoked when the wishlist was loaded
		+   **Default** : `null`
		+	**Context** : wishlist inscance

	* ##### `onClean` #####
		+   **Definition** : invoked when the wishlist was cleaning
		+   **Default** : `null`
		+	**Context** : wishlist inscance

	* ##### `onChange(actionName,model,collection)` #####
		+   **Definition** : invoked when add or remove some element on wishlist
		+   **Default** : `null`
		+	**Context** : wishlist inscance
		+	**attributes** : 
			* `actionName` : **[String]** `"add"` `"remove"`
			* `model` : **[Backbone model object]**
			* `collection` : **[Backbone Collection object]**

--- 

### WishBar
`$.fn.wishBar(WISHLIST [,options])`
	
- `WISHLIST` [**required**] : is the Wishlist istance
- `options` [_optional_] : is an object that extend the default properties and methods

####Properties
* #####`template`#####

    +   **Definition** : underscore template uses for display the information
	+   **Default** :  `"<div rel='"+WISHLIST.ID+"' id='wishItem_<%- id %>' class='wishedItem' data-id='<%- id %>'><img src='<%- img %>'><p><%- title %></p></div>",`
    
####Method
* ##### `addItemHtml` #####
	+   **Definition** : this function override the default method uses for generate and place the element inside of wishbar 
	+	**Attributes** :
		- `data` [object] the attributes of the model added to wishbar 

* ##### `removeItemHtml` #####
	+   **Definition** : this function override the default method to remove an element inside the wishbar
	+	**Attributes** :
		- `id` [object] the id of the element to remove from wishbar 

--- 

### WishItem
`$.fn.wishItem(WISHLIST [,options])`
	
- `WISHLIST` [**required**] : is the Wishlist istance
- `options` [_optional_] : is an object that extend the default properties and methods
	
####Properties
* #####`removeClass` #####

	+   **Definition** : class which bind the event for remove some elment to wishlist
	+   **Default** :  "removeToWish"

* #####`addClass` #####

	+   **Definition** : class which bind the event for add some elment to wishlist
	+   **Default** :  `"addToWish"`

* #####`triggerClass`#####

	+   **Definition** : class which bind all edit event
	+   **Default** :  `"wishAction"`

* #####`triggerEvent`#####

	+   **Definition** : binded event type 
	+   **Default** :  `"click"`

* #####`sameButton`#####

	+   **Definition** : use same element to add and remove item from wishlist
	+   **Default** :  `true`

####Method
 * ##### `picker(item)` #####
	+   **Definition** : this function override the default method to pick the data when click for "ADD" an element
	+   **Attributes** : 
		- `item`: jquery object that rapresent the clicked element

--- 

How wishlist communicates with the backend
---

Right now, the only method to read the element inside wishlist of a user are the `Cookies`. Also with localStorage, Wishlist store the ids of the item inside a cookie callad `ID + "_IDS"` where `ID` is the string passed like attribute of `$.whislist`. If localStorge isn't enable in user browser the reference name (of the cookie) is only the `ID`.
