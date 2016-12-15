function genTpl (tpl, context){
  var rendered = tpl
  Object.keys(context).forEach(function( elem, index, array ){
    var regx = new RegExp('%'+elem+'%', "g")
    rendered = rendered.replace(regx, context[elem]);
  });
  return rendered;
}

var tpl = '<div class="item" data-id="%id%"><div class="row"><img class="venue-img" src="%image_url%">' +
    '<h2 class="venue-title"><a href="%url%">%name%</a></h2><a class="venue-vote"><span class="number">0</span> going</a></div>' +
    '<p class="venue-description">%snippet_text%</p>' +
    '<div class="how-many-going"><h3>Who\'s going?</h3></div></div>'


$(document).ready(function(){
  // reject last query data when the page first loads
  if(localStorage.getItem('lastSearch')){
    $.ajax({
      type: "POST",
      url: "/yelp",
      data: { location: localStorage.getItem('lastSearch') },
      cache: false,
      success: function(data){
        console.log(data);
        if(data.error){
          $('.result').html('<h3>Network error, try again...</h3>');
        }else{
          var allVenue = data.allVenue;
          // append tpl to the DOM
          // var data = JSON.parse(data);
          var data = data.response;
          var newContent = '';
          data.businesses.forEach(function(elem){
            newContent += genTpl(tpl, elem);
          })
          $('.result').html(newContent);
          confirmGoing();
          // append who's going data to DOM
          if(allVenue){
            allVenue.forEach(function(elem, index){
              if(elem.going.length > 0){
                var targetSelector = '.item[data-id="' + elem.name + '"]';
                $(targetSelector).find(".number").html(elem.going.length);
                elem.going.forEach(function(elem, index){
                  var tpl = '<p class="people">' + elem.displayName + '</p>';
                  $(targetSelector).find(".how-many-going").append(tpl);
                })
              }
            })
          }
        }

      }
    });
  }


  var searchValue;
  $('.J_confirm').on('click', function(){
    searchValue = $('.J_location').val().trim();
    console.log('the search value is ...' + searchValue);
    localStorage.setItem('lastSearch', searchValue);
    // send the request to server, let node make this request and render the page
    $.ajax({
      type: "POST",
      url: "/yelp",
      data: { location: searchValue },
      cache: false,
      success: function(data){
        console.log(data);
        // append tpl to the DOM
        // var data = JSON.parse(data);
        if(data.error){
          $('.result').html('<h3>Network error, try again...</h3>');
        }else{
          var allVenue = data.allVenue;
          // append tpl to the DOM
          // var data = JSON.parse(data);
          var data = data.response;
          var newContent = '';
          data.businesses.forEach(function(elem){
            newContent += genTpl(tpl, elem);
          })
          $('.result').html(newContent);
          confirmGoing();
          // append who's going data to DOM
          if(allVenue){
            allVenue.forEach(function(elem, index){
              if(elem.going.length > 0){
                var targetSelector = '.item[data-id="' + elem.name + '"]';
                $(targetSelector).find(".number").html(elem.going.length);
                elem.going.forEach(function(elem, index){
                  var tpl = '<p class="people">' + elem.displayName + '</p>';
                  $(targetSelector).find(".how-many-going").append(tpl);
                })
              }
            })
          }
        }
      }
    });
  })



})



function confirmGoing() {
  $('.venue-vote').on('click', function(){
    var thisDOM = $(this).closest('.item');
    if(notLogIn){
      window.location.pathname="/user";
    }else{
      // user is already login, let's tell the server this guy is going to the bar
      var barName = $(this).closest('.item').data('id');
      console.log(barName);
      $.ajax({
        type: "POST",
        url: "/going",
        data: { bar: barName },
        cache: false,
        success: function(data){

          // date should container the name of the current user
          // to do, going increment by 1
          // todo, add that name to who's going
          if(data.going && data.going.length > 0){
            thisDOM.find('.number').text(data.going.length)
            thisDOM.find(".people").remove();
            data.going.forEach(function(elem, index){
                var tpl = '<p class="people">' + elem.displayName + '</p>';
                thisDOM.find(".how-many-going").append(tpl);
              })
            }else{
              thisDOM.find('.number').text(0)
              thisDOM.find(".people").remove();
            }
          }
        })
      }
  })

}
