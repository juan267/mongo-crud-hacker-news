$('document').ready(function(){

  $('a[href$=delete]').on('click', function(e){
    e.preventDefault()
    var that = this
    $.ajax({
      url: this.href,
      type: 'GET'
    }).done(function(data){
      $(that).parents('li').remove()
    })
  })

  $('a[href$=votes').on('click', function(e){
    e.preventDefault()
    var that = this
    $.ajax({
      url: this.href,
      type: 'GET'
    }).done(function(data){
      $(that).remove()
      $("#"+data._id+"-votes").html(data.votes)
    })
  })

  $('form[action$=posts]').on('submit', function(e){
    e.preventDefault()
    var index = parseInt($($('ul li:last-child span')[0]).html().substring(0,2))
    e.target.index.value = index
    var data = $(this).serialize()
    var that = this
    $.ajax({
      url: this.action,
      type: "POST",
      data: data
    }).done(function(data){
      $(that)[0].reset()
      $('ul').append(data)
    })
  })

})
