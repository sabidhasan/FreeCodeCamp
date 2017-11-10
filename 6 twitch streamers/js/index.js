var users = {catstrator: {}, syndicate: {}, riotgames: {}, shroud: {}, nasscomgdc: {}};
//catstrator: {url: '', bio: '', displayName: '', logo: '', status: '', game: '', text: ''}
var cat = "all";

$(document).ready(function() {
  var i = 0;
    for (user in users) {
      i++;
         //get basic user info
         $.ajax({
             url: 'https://wind-bow.glitch.me/twitch-api/users/' + user,
             cache: false
         }).done(function(data) {
             //check for 404 status
             users[data.name].displayName = data.display_name;
             users[data.name].url = "https://twitch.tv/" + data.name;
             users[data.name].bio = data.bio;
             users[data.name].logo = data.logo == null ? "++++": data.logo;
         });
         //Get current status
         $.ajax({
             url: 'https://wind-bow.glitch.me/twitch-api/streams/' + user,
             cache: false
         }).done(function(data) {
             var currUser = data._links.channel.split("/")[data._links.channel.split("/").length - 1];
             if (data.stream == null) {
                 //User isnt online
                 users[currUser].game = null;
                 users[currUser].status = 'offline';
                 users[currUser].text = '';
             } else {
                 users[currUser].status = 'online';
                 users[currUser].game = data.stream.channel.game;  
                 users[currUser].text = data.stream.channel.status;
             }
       if (i === 4) {   doFilter() };   
         });
      
    }
});

$("li").click(function() {
    $("li").removeClass("current");
    $(this).addClass("current");
    cat = $(this).attr("id");
    doFilter();
});

$(".search-box").keyup(function() {
    doFilter();
})

window.setTimeout(function() {doFilter()}, 1000)
function doFilter() {
  var written = false;
    $("tbody").html("");
    for (user in users) {
        //var 
 if ((cat != "all" && users[user].status != cat) || (users[user].displayName.toLowerCase().indexOf($(".search-box").val().toLowerCase()) == -1)) { continue; }
      written = true;
      console.log()
      $("tbody").append("<tr><td class=\"table-icon\"><img alt=\"Player Logo\" src=\"" + users[user].logo + "\"></td><td class=\"table-name\">" + users[user].displayName.toLowerCase().replace( $(".search-box").val().toLowerCase(), "<span class='highlight'>" + $(".search-box").val().toLowerCase() + "</span>"  ) + "</td><td class=\"table-status\">" + users[user].text.substr(0, 50) + "</td></tr>");      
    }
    if (written == false) { $("tbody").append("<tr><td class=\"table-no-streamers\">No streamers found</td></tr>"); }
}