$('document').ready(function(){

  $('.main').on('click','a[href$=delete]', function(e){
    e.preventDefault()
    var that = this
    $.ajax({
      url: this.href,
      type: 'GET'
    }).done(function(data){
      $('ul').replaceWith(data)
      // $(that).parents('li').remove()
    })
  })

  $('.main').on('click', 'a[href$=votes]', function(e){
    e.preventDefault()
    var that = this
    $.ajax({
      url: this.href,
      type: 'GET'
    }).done(function(data){
      // $('ul').replaceWith(data)
      $(that).remove()
      $("#"+data._id+"-votes").html(data.votes)
    })
  })

  $('form[action$=posts]').on('submit', function(e){
    e.preventDefault()
    // var index = parseInt($($('ul li:last-child span')[0]).html().substring(0,2))
    // e.target.index.value = index
    var data = $(this).serialize()
    var that = this
    $.ajax({
      url: this.action,
      type: "POST",
      data: data
    }).done(function(data){
      $(that)[0].reset()
      $('ul').replaceWith(data)
    })
  })

})
