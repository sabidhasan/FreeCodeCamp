var users = {catstrator: {}, scoga: {}, riotgames: {}, shroud: {}, nasscomgdc: {}, freecodecamp: {}};
//catstrator: {url: '', bio: '', displayName: '', logo: '', status: '', game: '', text: ''}
var cat = "all";

function basicUserData() {
    return $.ajax({
             url: 'https://wind-bow.glitch.me/twitch-api/users/' + user,
             cache: false
         }).done(function(data) {
             //check for 404 status
             users[data.name].displayName = data.display_name;
             users[data.name].url = "https://twitch.tv/" + data.name;
             users[data.name].bio = data.bio;
             users[data.name].logo = data.logo == null ? "++++": data.logo;
         });
}

function advUserData() {
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
    });
}
            
$(document).ready(function() {
    for (user in users) {
        //get basic user info
        basicUserData();
         //Get current status
        advUserData();  
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
 if ((cat != "all" && users[user].status != cat) || (users[user].displayName.toLowerCase().indexOf($(".search-box").val().toLowerCase()) == -1)) { continue; }
      written = true;
      var app = "<tr class=\"table-" + users[user].status + "\"><td class=\"table-icon\"><img alt=\"Player Logo\" src=\"" + users[user].logo + "\"></td>";
      app += "<td class=\"table-name\">" + "<a href=\"https://twitch.tv/" + users[user].displayName  + "\">" + users[user].displayName.toLowerCase().replace( $(".search-box").val().toLowerCase(), "<span class='highlight'>" + $(".search-box").val().toLowerCase() + "</span>"  ) + "</a></td>";
      app += "<td class=\"table-status\">" + (users[user].status == "online" ? "Playing <span class=\"game-title\">" + users[user].text.substr(0, 50) + "</span>" : "Offline") + "</td></tr>";
      
      $("tbody").append(app);
    }
    if (written == false) { $("tbody").append("<tr><td class=\"table-no-streamers\">No streamers found</td></tr>"); }
}