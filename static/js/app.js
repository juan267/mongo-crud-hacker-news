$('document').ready(function(){

  var post = "<li id='{{post._id}}''><span>{{loop.index}}.<a href='/posts/{{post._id}}/votes'>&#9650;</a><span class='post-title'><a href='{{post.url}}' target='_blank'>{{post.title}}</a></span><a href='/posts/{{post._id}}/delete'>&#10008;</a><span class='post-url'>({{post.url}})</span></span><span class='post-details'>{{post.votes}} points  |By: {{post.author}}<a href='/posts/{{post._id}}/edit'>Edit</a></span></li>"

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


})
