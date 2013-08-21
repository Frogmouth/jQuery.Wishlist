Wisthlist
==========

### Libs include needed


First include in your `<head>` the script:

``
<script type="text/javascript" src="http://code.jquery.com/jquery-1.10.2.min.js"></script>
<script type="text/javascript" src="http://underscorejs.org/underscore-min.js"></script>
<script type="text/javascript" src="http://backbonejs.org/backbone-min.js"></script>

<!-- dowload and include local -->
<script type="text/javascript" src="/path/to/jquery.cookie.js"></script>
<script type="text/javascript" src="/path/to/json2.js"></script>

<!-- lastone jquery Wishlist libs -->
<script type="text/javascript" src="/path/to/jquery_wish.js"></script>
``

### call Wisthlist

``
<script type="text/javascript">
	$(document).ready(function(){
		$("#wishList").wishlist();
	});
</script>
``

### basic example of HTML

A basic exaple to wishing an element by his ID:

``
<!-- wish button -->
<a class="wishAction addToWish" data-id="1" href="#">Add 1</a></li>

<!-- wished list -->
<ul id="wishList">
</ul>

<!-- clear wish list -->
<a id="clearWish" href="#!/ClearWishlist">Pulisi Lista</a>
``

