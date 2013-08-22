_Sorry for my bad English :: FrogMouth_

jQuery.Wishlist
===============

A simple jquery plugin for manage a wishlist with cookies and without registration needed.

### Current Version: 1.0 Beta

Requirements
---------------------

*Wishlist* needs some library for works 100%, in the future, we want to creating a light versione without these libs, but today for boost developing plug-in we need it.

* [jQuery](http://jquery.com/ "jQuery Home") (> 1.8 raccomanded)
* [jCookies](https://github.com/carhartl/jquery-cookie "jquery-cookie") (> 1.8 raccomanded)
* [Underscore JS](http://underscorejs.org/ "Underscore Home")
* [Backbone JS](http://backbonejs.org/ "Backbone Home")
* [JSON2](https://github.com/douglascrockford/JSON-js "Json2 GitHub")

What can we do?
---------------------

With *Wishlist* you can create a simple bar or button (or what you like) who save page's information into a cookie for create a simple wishlist (or reminder, or cart, ...).
Use cookies? **Yes!** Why? Because, today all big sites (like FB o bigG) need those who the client accept Cookies, and therefore... why not exploit them?
It's an alternative to the registration, **a simple way to do a complex thing**.

**Backbone**, why? Because it allows me to have some very useful tools for the development, which: MVC architecture and a route system.
Collections and models of Backbone allow to manipulate the information with smart and powerfull tools, like: filtering, ordering, ecc... and in the future it allows the possibility to integrate with a server side app.

It's a jQuery plugin only because it's friendly for more developer, rather that Backbone only, but in the future maybe we will use jQuery only for the View.

Do and To do list:
---------------------

- Create the plugin Core 1.0 Beta Versione

This is a beta version, developed for future needs. There are a lot of things to do, such as:

- Light Version (whitout Backbone & Underscore)
- Exploit the possibilities of Backbone
- Develop client management wisthlist (like item order, item prop, ecc...)
- Crossbrowser bug fix (> IE7)
- Dev some **RedyToUse** exaples with graphics (CSS/HTML - button and bar)

**Remote Dev**

- Integrate the ability to communicate with a server ( _REST_ ) via Backbone
- Dev an HTML-JS and iFrame for external use of wishlistbar
