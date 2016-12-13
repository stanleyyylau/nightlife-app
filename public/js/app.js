$(document).ready(function(){

  $('.J_confirm').on('click', function(){
    var searchValue = $('.J_location').val().trim();
    console.log('the search value is ...' + searchValue);
    localStorage.setItem('lastSearch', searchValue);
  })

  // send the request to server, let node make this request and render the page

})
