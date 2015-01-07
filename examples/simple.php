<!DOCTYPE html>

<?php
	$items_ids = json_decode($_COOKIE["wishlist_IDS"]);
?>

<html lang="en">
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=utf-8">
	<title>Simple Wished ELEMENT</title>
	<meta name="author" content="simone luise">
	<link rel="stylesheet" href="libs/css/index.css">
	<script type="text/javascript" src="libs/js/jq.js"></script>
	<script type="text/javascript" src="libs/js/jquery_cookies.js"></script>
	<script type="text/javascript" src="libs/js/json2.js"></script>
	<script type="text/javascript" src="libs/js/underscore.js"></script>
	<script type="text/javascript" src="libs/js/backbone.js"></script>
	<script type="text/javascript" src="libs/js/jquery-wishlist.js"></script>
</head>
<body>
	<div class="wrapper">
		<div class="header">
			<h2>jQuery Wishlist - Example</h2>
		</div>
		<div class="content">
			<div class="userbar">
				<div class="right">
					<a class="wishCounter">0</a>
				</div>
			</div>
			<div class="page listing">
			<?php 
			if(count($items_ids) == 0){
				?>
				<div class="error"> No wished item... <a class="wish" href="simple.html">Wish One</a></div>
				<?php
			}else{
				foreach ($items_ids as $id): 
					$json = file_get_contents("json/item_".$id.".json");
					if($json):
						$item = json_decode($json);
				?>
					<div class="item wishItem">
						<img src="<?php echo $item->img ?>">
						<h5><a class="wishAction" data-img="<?php echo $item->img ?>" data-title="<?php echo $item->title ?>" data-id="<?php echo $item->id ?>" href="#"></a> <?php echo $item->title ?></h5>
						<p><?php echo $item->description ?></p>
					</div>
				<?php endif; endforeach;
			} ?>
			</div>
		</div>
	</div>
	<script type="text/javascript">
		$(document).ready(function(){
			window.MYwishlist = $.Wishlist("wishlist",{
				itemOption : {
					onRemove : function(item){
						$("[data-id="+item.id+"]").parents(".wishItem").remove();
							if($(".listing .item").length < 1) $(".listing").append('<div class="error"> No wished item... <a class="wish" href="simple.html">Wish One</a></div>');
						}
				}
			});
		});
	</script>
</body>
</html>
