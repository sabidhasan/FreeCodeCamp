var table = $("table tbody");

$(".search").keydown(function(e) {
  //;
  if (e.keyCode === 13){
    e.preventDefault();
    doWikiSearch();
  } else if (e.keyCode === 27) {
    table.html("")
  }
});

function doWikiSearch() {
  if ($(".search").val().length < 2) { table.html(""); return; };
  
  $.ajax({
     url: "https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=" + $(".search").val() + "&format=json&srlimit=15&srprop=size%7Cwordcount%7Ctimestamp%7Csnippet&callback=?",
     dataType: "json",
     success: function(data) {      
       var ret;
       if (data.query.search.length == 0) {
          table.html("<tr>" + "<td>" + "No results found" + "</td>" + "</tr>");
       } else {
         table.html("");
         for (var i = 0; i < data.query.search.length; i++) {
            ret = ""
            ret +=  "<tr>" + "<td><a href='http://en.wikipedia.org/wiki/" + data.query.search[i].title + "'>"+ data.query.search[i].title + "</a></td>";
            ret += "<td>"+ data.query.search[i].snippet + " ...</td>" + "</tr>";     
            table.append(ret);
         }
       }
    },
    fail: function () {
      table.html("<tr>" + "<td>" + "No results found" + "</td>" + "</tr>");
    }
  });
}