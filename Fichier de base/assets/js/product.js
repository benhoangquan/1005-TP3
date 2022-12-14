var productList = []; 

$.urlParam = function(name){
	var results = new RegExp('[\?&]' + name + '=([^&#]*)').exec(window.location.href);
	return results[1] || 0;
    
}

function range(start, end) {
    return Array.apply(0, Array(end))
      .map((element, index) => index + start);
}

function displayInfoProducts(id){
    index = id - 1; 
    if (index in range(0, productList.length)){
        $("#product-image").attr("src", "./assets/img/" + productList[index].image);

        $("#product-name").html(productList[index].name);
        $("#product-desc").html(productList[index].description);
    
        var featureList = ""; 
        for (let i = 0; i < productList[index].features.length; i++)
            featureList += "<li>" + productList[index].features[i] + "</li>"; 
        $("#product-features").html(featureList);
    
        $("#product-price").html('Prix: <strong>'+ productList[index].price +'&thinsp;$</strong>');
    }
    else{
        $('article').html('<h1>Page non trouvée!</h1>'); 
    }
}

$(document).ready(function () {
    $.ajax({
        async: true, 
        type: "GET",
        url: "./data/products.json",
        datatype: 'json',
        success: function(xhr) {
            //update product list on successful get
            productList = xhr; 

            //product page must have ?id= suffix to identify the product
            if (!window.location.href.includes("?id="))
                window.location.assign("/product.html?id=404"); 

            //
            displayInfoProducts($.urlParam('id')); 
        }
    }); 
});


function addToLocalStorage(id) {
    var currentItem = window.localStorage.getItem(productList[id].name); 
    console.log(currentItem);
    // create new item if item doesnt exist in local storage
    if (currentItem == null){
        var newItem = new Object(); 
        newItem["id"] = parseInt($.urlParam('id')); 
        newItem["quantity"] = parseInt($("#product-quantity").val()); 
        newItem["price"] = parseInt(productList[id].price); 
        window.localStorage.setItem(productList[id].name, JSON.stringify(newItem));
    }

    // update current item if it exists
    else {
        currentItem = JSON.parse(currentItem);
        currentItem.quantity += parseInt($("#product-quantity").val()); 
        window.localStorage.setItem(productList[id].name, JSON.stringify(currentItem))
    }
}

function openDialog(message){
    //create dialog box
    dialogBox = '<dialog open id ="dialog">' + message + '</dialog>';
    $("article").append(dialogBox); 

    // hide dialog after 5000 ms = 5s and delete to prepare for the next dialog
    $("#dialog").fadeOut(5000,function() {
        $(this).modal('hide');
        $("#dialog").remove();
    });
}
$(document).ready(function () {
    var currentUrl = window.location.href; 
    $("#add-to-cart-btn").click(function () {
        $.ajax({
            async: true, 
            type: "post",
            url: currentUrl, 
            datatype: "json",
            success: function() {
                var id = $.urlParam('id') - 1; 
                addToLocalStorage(id);
                openDialog("Le produit a été ajouté au panier.");
            }
        }); 
    });
});
