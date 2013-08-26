3 ways to populate Wishlist
===========

It's primary to understand how you can populate the wishlist (object and cookies) width custom proprierties (like: url, string text, other value). By default the only one proprierty searched and sored in wishlist is the ID of the wished element.


> **note:** it is good practice, whatever the chosen way, to set the Backbone model so that it is an exact copy of the pull of property which will be populated with the same model in the making.
> Remember **ID** is the primary kay of the plugin and ID must be stored in wishlist.
> in the example below the Model Default is:

Defaults property Backbone Model:

    defaults : {
        id : null,
        href : null,
        title : null
    }

There are 3 ways to stored customize the proprierties that be stored in the wishlist object:

1.  Default way
----------
The simplest way is that set HTML5 `data-` attributes on the tag element that fire the Add hendler. All the *Data* of the tag is stored inseide the wishlist.

example:

    <!-- html -->
    <a href="#!" title="Add Item" data-id="1" data-href="https://github.com/Frogmouth/jQuery.Wishlist" data-title="Wishlist on Github" class="addToWish wishAction">Add to Wishlist</a>
    
Clicks this button invoke and hendler that populate the wishlist with a new Backbone model who has this proprierty.

    {
        id : 1,
        href : https://github.com/Frogmouth/jQuery.Wishlist,
        title : Wishlist on Github
    }

2.Picker method override *(raccomaned)*
----------

Another way is that to override the `picker()` local plugin's method.

`picker()` is the method to has the task of taking the data of the item:
Its simple code:

    function(item){
    	var data = item.data();
		return data;
    }

where `item` is the DOM element that trigger the add event, and returned `data` is an object that reflects the Backbone Model.

You can modify this method by defining a new method for acquisition the information by returning an object that reflects the Backbone model. 

3.Extend Backbome Model
----------

There are two other ways to change the method to populate the Backbone Model ( `BackboneModel` ):

* ###Extend default proprierties ###

    One way is to change the property values of the `BackboneModel : {defaults}` so that they know already where to get the data needed to populate.
    
    > **note:** the two ways display below need however to override the picker() methoto return a empty object `{}`.
    
    Such as:
    
        defaults : {
            id : $(this).attr("id"),
            href : window.location.href,
            title : $("meta[name=description]").attr("content")
        }

    > This way is possible but nor raccomanded.

* ###Extend constructor method ###
    
    The last way is to customize the  `BackboneModel : {constructor}` to change the method for the information acquisition to populate the Backbone Model attributes.
    It's an alternative to `picker()`.

For this two method consult the backbone [Documentation](http://backbonejs.org/#Model 'Documentation') about Model customize.
