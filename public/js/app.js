function genTpl (tpl, context){
  var rendered = tpl
  console.log(Object.keys(context))
  Object.keys(context).forEach(function( elem, index, array ){
    var regx = new RegExp('%'+elem+'%', "g")
    rendered = rendered.replace(regx, context[elem]);
  });
  return rendered;
}

var tpl = '<div class="item" data-id="%id%"><div class="row"><img class="venue-img" src="%image_url%">' +
    '<h2 class="venue-title"><a href="%url%">%name%</a></h2><a class="venue-vote"><span class="number">0</span> going</a></div>' +
    '<p class="venue-description">%snippet_text%</p>' +
    '<div class="how-many-going"><h3>Who\'s going?</h3><p class="people">Stanley Lau</p></div></div>'


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
          // append tpl to the DOM
          // var data = JSON.parse(data);
          var newContent = '';
          data.businesses.forEach(function(elem){
            newContent += genTpl(tpl, elem);
          })
          $('.result').html(newContent);
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
          // append tpl to the DOM
          // var data = JSON.parse(data);
          var newContent = '';
          data.businesses.forEach(function(elem){
            newContent += genTpl(tpl, elem);
          })
          $('.result').html(newContent);
        }
      }
    });
  })

  $('.venue-vote').on('click', function(){
    if(notLogIn){
      window.location.pathname="/user";
    }else{
      // user is already login, let's tell the server this guy is going to the bar

    }
  })

})
