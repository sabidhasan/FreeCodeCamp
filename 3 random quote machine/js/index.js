var quoteLoader = {
    url: 'https://quotesondesign.com/wp-json/posts?filter[orderby]=rand&filter[posts_per_page]=1',///',
    success: function(data) {
        //Hide loading
      console.log(data);
        $(".wave").toggle();
        $(".quote-body").toggle();
        // Get first one from array by using shift method
        var post = data.shift(); 
        $(".quote-body").html(post.content);
        var author = post.title !== "" ? post.title : "Unknown";
        $(".quote-author").html(author);
        $(".twitter").attr("href", ("https://twitter.com/intent/tweet?text=" + post.content.replace(/(<([^>]+)>)/ig,"") + " - " + author));
    },
    fail: function() {
        $(".wave").toggle();
    },
    cache: false
};

$(document).ready(function() {
    $.ajax(quoteLoader);   
});

$(".reload").on("click", function() {
    $(".wave").toggle();
    $(".quote-body").toggle();
    $.ajax(quoteLoader);
});

$(".about-link").hover(function() {
    $(".about").toggle();
});