_Sorry for my bad English :: FrogMouth_

jQuery.Wishlist
===============

A simple jquery plugin for manage a wishlist with cookies and without registration needed.

### Current Version: 1.3.1

Requirements
---------------------

*Wishlist* needs some library for works 100%, in the future, we want to creating a light versione without these libs, but today for boost developing plug-in we need it.

* [jQuery](http://jquery.com/ "jQuery Home") (> 1.8 raccomanded)
* [Underscore JS](http://underscorejs.org/ "Underscore Home")
* [Backbone JS](http://backbonejs.org/ "Backbone Home")
* [JSON2](https://github.com/douglascrockford/JSON-js "Json2 GitHub")
* [jCookies](https://github.com/carhartl/jquery-cookie "jquery-cookie")

What can we do?
---------------------

With *Wishlist* you can create a simple bar or button (or what you like) who save page's information into a cookie for create a simple wishlist (or reminder, or cart, ...).
To do that we use **localStorage** or **cookie** (if localstorage is disabled). It's an alternative to the registration, **a simple way to do a complex thing**.

**Backbone**, why? Because it allows me to have some very useful tools for the development.
Collections and models of Backbone allow to manipulate the information with smart and powerfull tools, like: filtering, ordering, ecc... and in the future it allows the possibility to integrate with a server side app.

It's a jQuery plugin only because it's friendly for more developer, rather that Backbone only, but in the future maybe we will use jQuery only for the View.

Done and To do list:
---------------------

**DONE:**

- NEW 1.3 version (deep rebuild)
- Implement **localStorage** as an alternative of COOKIE (using cookie only for send items id to backend)
- a NEW Working example
- wishlist bar
- wishlist item

**TO DO:**

- Continue to Developed the Core Script
- Exploit the possibilities of Backbone
- Develop client management wisthlist (like item order, item prop, ecc...)
- Crossbrowser bug fix (> IE8)
- Dev other some **RedyToUse** exaples with graphics (CSS/HTML - button and bar)
- Use some customs methods instead jquery Cookie to work with Cookie

**Remote Dev**

- Integrate the ability to communicate with a server ( _REST_ ) via Backbone

Quick start:
---

Calls inside document ready `$.Wishlist(ID)` where `ID` is a unique string that represents the ID of your wishlist, in every page the ID must be the same to get the wishlist item.

    $(function(){
		window.MYwishlist = $.Wishlist("wishlist");
	});

`MYwishlist.data` is the Backbone collection of your wished ITEM.