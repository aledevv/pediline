var token = $('meta[name="csrf-token"]').attr('content');
var data = [];
var randomcols = [];
var lock = 0;


function taker(step, tags, tok) {
  token = tok;
  $.ajax({
      type: 'POST',
      url: '/'+base_url+'/list',
      dataType: "html",
      data: {
          step: step,
          tags: tags,
          _token: token
      },
      success: function(resData) {        
          $("#jscode").html(resData);
          run_items();
          if(var_palettes_count == 0){
            window.removeEventListener('scroll', palettes_scroll_ajax_load);
          }          
      }
  });
}

function run_items() {
  for (var i = 0; i < arr.length; i++) {
      var obj = arr[i];
      itemer(i, obj['id'], obj['code'], obj['date'], obj['likes']);
  }
}

function itemer(order, id, code, date, likes) {
  var newitem = $('#bank .item').clone().appendTo('#feed').attr('data-order', order).attr('data-id', id).attr('data-code', code);
  var c1 = code.substring(0, 6);
  var c2 = code.substring(6, 12);
  var c3 = code.substring(12, 18);
  var c4 = code.substring(18, 24);
  newitem.find('.palette a').attr('href', '/'+base_url+'/palette/' + id);
  newitem.find('.c1').css('background-color', '#' + c1).find('span').text('#' + c1).attr('onclick', 'copy("' + c1 + '", this)');
  newitem.find('.c2').css('background-color', '#' + c2).find('span').text('#' + c2).attr('onclick', 'copy("' + c2 + '", this)');
  newitem.find('.c3').css('background-color', '#' + c3).find('span').text('#' + c3).attr('onclick', 'copy("' + c3 + '", this)');
  newitem.find('.c4').css('background-color', '#' + c4).find('span').text('#' + c4).attr('onclick', 'copy("' + c4 + '", this)');
  newitem.find('.like span').text(formatThousands(likes));
  newitem.find('.like').attr('onclick', 'like(' + id + ', "' + code + '","' + token + '")');
  newitem.find('.contrast').attr('onclick', 'contrast1(' + id + ', "' + code + '")');
  newitem.find('.wheel').attr('onclick', 'wheel1(' + id + ', "' + code + '")');
  newitem.find('.gradient').attr('onclick', 'gradient1(' + id + ', "' + code + '")');
  newitem.find('.text').attr('onclick', 'text1(' + id + ', "' + code + '")');
  if (apiStorage.getItem("colorhunt-" + code) != null) {
      $('.item[data-id=' + id + ']').find('.like img').attr('src', '/'+base_url+'/img/Like_colored.svg');
      $('.item[data-id=' + id + ']').addClass('liked');
  }
  newitem.css('animation-delay', order * 50 + "ms");
}

function copy(text, target) {
  setTimeout(function() {
      $('#copied_tip').remove();
  }, 1000);
  $(target).parent('.place').append("<div class='tip' id='copied_tip'>Copied!</div>");
  var input = document.createElement('input');
  input.setAttribute('value', '#' + text);
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand('copy');
  document.body.removeChild(input);
  return result;
}

function copy1(text, target) {
  setTimeout(function() {
      $('#copied_tip').remove();
  }, 1000);
  $(target).parent().append("<div class='tip' id='copied_tip'>Copied!</div>");
  var input = document.createElement('input');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand('copy');
  document.body.removeChild(input);
  return result;
}

function copy2(text, target) {
  setTimeout(function() {
      $('#copied_tip').remove();
  }, 1000);
  $(target).append("<div class='tip' id='copied_tip'>Copied!</div>");
  var input = document.createElement('input');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand('copy');
  document.body.removeChild(input);
  $(target).focus();
  return result;
}

function copy3(target) {
  var text = $(target).prev().html();
  // setTimeout(function() {
  //     $('#copied_tip').remove();
  // }, 1000);
  $(target).append("<div class='tip' id='copied_tip'>Copied!</div>");
  var input = document.createElement('input');
  input.setAttribute('value', text);
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand('copy');
  document.body.removeChild(input);
  $(target).focus();
  return result;
}

function count_likes() {
  likes_count = 0;
  for (var j = 0, len = apiStorage.length; j < len; j++) {
      key = apiStorage.key(j);
      if (key.indexOf("colorhunt") != -1) {
          likes_count++
      }
      
  }
  return likes_count;
}

function like(id, code) {
  if(!isLogin())
  {
    notLogin();
    return false;
  }

  


  if(lock !== id)
  {
  
  lock = id;
  var date = new Date();
  var time = date.getTime().toString();
  if (apiStorage.getItem("colorhunt-" + code) == null) {

      if(!isLimit())
      {
        limitPopup();
        lock = 0;
        return false;
      }

      $("#expjson").show();
      apiStorage.setItem("colorhunt-" + code, {
          id: id,
          time: time
      });
      $('.item[data-id=' + id + ']').addClass('liked');
      
      var curlikes = $('.item[data-id=' + id + ']:last').find('.like span').text().replace(',', '');
      curlikes++;
      curlikes = formatThousands(curlikes);
      $('.item[data-id=' + id + ']').find('.like span').text(curlikes);
      $('.item[data-id=' + id + ']').find('a.like').attr('onclick', '').css('cursor', 'default');
      place_like(id, "colorhunt-" + code);
      $('.palette[data-id=' + id + ']').css('animation-name', 'liked_palettes');
      if ($('#like_tip').length > 0) {
          $('#like_tip').remove();
      }
      $('#likes').append("<div class='tip' id='saved_tip'>Saved!</div>");
      $('.item[data-id=' + id + ']').find('.like img').attr('src', '/'+base_url+'/img/Like_colored.svg');

      var image_data = createImage(id,code);
      


  } else {
      $('.item[data-id=' + id + ']').find('.like img').attr('src', '/'+base_url+'/img/Like_dark.svg');
      $('.item[data-id=' + id + ']').addClass('liked');
      var ids = apiStorage['colorhunt-'+code].apiId;
      
      $.ajax({
        url: "/"+base_url+"/deleteFav",
        type: "post",
        data: {user_id:user_id,id:ids,_token:token},
        success:function(response)
        {
           
            lock = 0;
        }
      });
      apiStorage.removeItem("colorhunt-" + code);
      $('.item[data-id=' + id + ']').removeClass('liked');
      $('.palette[data-id=' + id + ']').remove();
      var curlikes = $('.item[data-id=' + id + ']:last').find('.like span').text().replace(',', '');
      curlikes--;
      curlikes = formatThousands(curlikes);
      $('.item[data-id=' + id + ']').find('.like span').text(curlikes);
      if (likes_count == 0) {
          $('#likes').hide()
      } else {
          $('#likes').show();
      }
      /*for (var i = data.length - 1; i >= 0; i--) {

          if (data[i]['id'] == id.toString()) {

              data.splice(i, 1);
              if (apiStorage.length === 5) {
                  $("#expjson").hide();
              }
          }

      }*/
  }
  count_likes();
  $('#likes .title span').html(likes_count);
  }

  
  
}


function likeColors(id, code) {
  if(!isLogin())
  {
    notLogin();
    return false;
  }

  


  if(lock !== id)
  {
  
  lock = id;
  var date = new Date();
  var time = date.getTime().toString();
  if (apiStorage.getItem("colorhunt-" + code) == null) {

      if(!isLimit())
      {
        limitPopup();
        lock = 0;
        return false;
      }

      $("#expjson").show();
      apiStorage.setItem("colorhunt-" + code, {
          id: id,
          time: time
      });
      
      
      place_like(id, "colorhunt-" + code);
      $('.palette[data-id=' + id + ']').css('animation-name', 'liked_palettes');
      if ($('#like_tip').length > 0) {
          $('#like_tip').remove();
      }
      $('#likes').append("<div class='tip' id='saved_tip'>Saved!</div>");
      $('[data-code=' + code + ']').find('.palCreate').attr('src', '/'+base_url+'/img/Like_colored.svg');
     
      var image_data = createImage(id,code);
      


  } else {
      $('[data-code=' + code + ']').find('.palCreate').attr('src', '/'+base_url+'/img/Like_dark.svg');
      
      var ids = apiStorage['colorhunt-'+code].apiId;
      
      $.ajax({
        url: "/"+base_url+"/deleteFav",
        type: "post",
        data: {user_id:user_id,id:ids,_token:token},
        success:function(response)
        {
           
            lock = 0;
        }
      });
      
      apiStorage.removeItem("colorhunt-" + code);
      $('[data-id=' + id + ']').remove();
     
      if (likes_count == 0) {
          $('#likes').hide()
      } else {
          $('#likes').show();
      }
      for (var i = data.length - 1; i >= 0; i--) {

          if (data[i]['id'] == id.toString()) {

              data.splice(i, 1);
              if (apiStorage.length === 5) {
                  $("#expjson").hide();
              }
          }

      }
  }
  count_likes();
  $('#likes .title span').html(likes_count);

 
  }

  
  
}

/*function list_likes() {
  data = [];
  var codes = [];
  for (var fav in all_favs) {
      
      key = fav;
      if (key != null && key.indexOf("colorhunt") != -1) {
        id = JSON.parse(all_favs[fav]).id;
        time = JSON.parse(all_favs[fav]).time;
        codes.push({
            id: id,
            time: time,
            key: key
        });
      }
  }
  codes.sort(function(a, b) {
      return a['time'] - b['time'];
  });

  for (var j = 0; j < codes.length; j++) {
      $("#expjson").show();
      key = codes[j].key;
      id = codes[j].id;
      if (key != null && key.indexOf("colorhunt") != -1) {
          $('#side #main').remove();
          place_like(id, key);
      }
  }
}*/

function list_likes() {
  data = [];
  var codes = [];
  
  for (var j = apiStorage.length - 1, len = apiStorage.length; j >= 0; j--) {
      
      var key = apiStorage.key(j);
      
      if (key != null && key.indexOf("colorhunt") != -1) {
        
        id = apiStorage.getItem(key).id;
        time = apiStorage.getItem(key).time;
        
          codes.push({
              id: id,
              time: time,
              key: key
          });
      }
  }
  codes.sort(function(a, b) {
      return a['time'] - b['time'];
  });
  

  for (var j = 0; j < codes.length; j++) {
      $("#expjson").show();
      key = codes[j].key;
      id = codes[j].id;
      if (key != null && key.indexOf("colorhunt") != -1) {
          $('#side #main').remove();
          place_like(id, key);
      }
  }
}
function place_like(id, code) {
  $('#side #main').remove();
  var newitem = $('#bank .palette').clone();
  $('#likes .list').prepend(newitem);
  var c1 = code.substring(10, 16);
  var c2 = code.substring(16, 22);
  var c3 = code.substring(22, 28);
  var c4 = code.substring(28, 34);
  newitem.attr('data-id', id);
  newitem.attr('data-code', code);
  newitem.find('a').attr('href', '/'+base_url+'/palette/' + id);
  newitem.find('.place span').remove();
  newitem.find('.c1').css('background-color', '#' + c1);
  newitem.find('.c2').css('background-color', '#' + c2);
  newitem.find('.c3').css('background-color', '#' + c3);
  newitem.find('.c4').css('background-color', '#' + c4);
  count_likes();
  $('.item[data-id=' + id + ']').find('.like img').attr('src', '/'+base_url+'/img/Like_colored.svg');
  $('[data-code=' + code.replace('colorhunt-','') + ']').find('.palCreate').attr('src', '/'+base_url+'/img/Like_colored.svg');
  $('.item[data-id=' + id + ']').addClass('liked');
  $('#likes .title span').html(likes_count);
  
  if (likes_count == 0) {
      $('#likes').hide()
  } else {
      $('#likes').show()
  }
  new_remove_button = $('#bank .remove').clone().appendTo(newitem);
  code = code.replace("colorhunt-", "");
  new_remove_button.attr('onclick', 'like(' + id + ', "' + code + '")');
  var savedjson = {};
  savedjson['id'] = id;
  savedjson['color1'] = c1;
  savedjson['color2'] = c2;
  savedjson['color3'] = c3;
  savedjson['color4'] = c4;
  data.push(savedjson);
 
}

function formatThousands(n, dp) {
  var s = '' + (Math.floor(n)),
      d = n % 1,
      i = s.length,
      r = '';
  while ((i -= 3) > 0) {
      r = ',' + s.substr(i, 3) + r;
  }
  return s.substr(0, i + 3) + r + (d ? '.' + Math.round(d * Math.pow(10, dp || 2)) : '');
}

function select_sort_button(current) {
  $('#header').find('[data-button=' + current + ']').addClass('selected');
}

function select_menu_button(current) {
  $('#header').find('[data-button=' + current + ']').addClass('selected');
}

function like_first_palette_tip() {
  count_likes();
  if (likes_count == 0 && $('.focus').length > 0) {
      $('.focus').append("");
  }
}

function titleCase(str) {
  var splitStr = str.toLowerCase().split(' ');
  for (var i = 0; i < splitStr.length; i++) {
      splitStr[i] = splitStr[i].charAt(0).toUpperCase() + splitStr[i].substring(1);
  }
  return splitStr.join(' ');
}

function focus(tags) {
  $('.focus').append('<div class="button light_button save_image" onclick="save_image()"><img src="/'+base_url+'/img/save-image.png" width="16px" />Image</div> ')
  $('.focus').append('<div class="button light_button copy_link" onclick="copy_link()"><img src="/'+base_url+'/img/icon-link.png" width="16px" />Link</div> ')
  $('.focus').append('<div class="item_tags"></div>')
  tags = tags.split(" ");
  if (tags != "") {
      for (var i = 0; i < tags.length; i += 1) {
          $('.item_tags').append('<a href="/colors/search/' + tags[i].toLowerCase() + '">#' + tags[i].toLowerCase() + '</a>');
      }
  }
}

function save_image() {
  id = $('.focus').attr('data-id');
  $('.focus .palette,.focus .palette .c1,.focus .palette .c4').css('border-radius', '0px');
  html2canvas($('.focus .palette').get(0)).then(function(canvas) {
      saveAs(canvas.toDataURL(), 'Color Hunt Palette ' + id + '.png');
      $('.focus .palette').css('border-radius', '4px');
      $('.focus .palette .c4').css('border-radius', '20px 20px 4px 4px');
      $('.focus .palette .c1').css('border-radius', '4px 4px 0px 0px');
  });
}

function copy_link() {
  id = $('.focus').attr('data-id');
  setTimeout(function() {
      $('#copied_tip').remove();
  }, 1000);
  $('.button.copy_link').append("<div class='tip' id='copied_tip'>Copied!</div>");
  var input = document.createElement('input');
  input.setAttribute('value', server_name + '/'+base_url+'/palette/' + id);
  document.body.appendChild(input);
  input.select();
  var result = document.execCommand('copy');
  document.body.removeChild(input)
  return result;
}

function download(filename, text) {
  var element = document.createElement('a');
  element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
  element.setAttribute('download', filename);

  element.style.display = 'none';
  document.body.appendChild(element);

  element.click();

  document.body.removeChild(element);
}

function exportjson() {
  download("data.json", JSON.stringify(data));
}

function contrast() {
  code = $('.focus').attr('data-code');
  var c1 = "%23" + code.substr(0, 6);
  var c2 = "%23" + code.substr(6, 6);
  var c3 = "%23" + code.substr(12, 6);
  var c4 = "%23" + code.substr(18, 6);
  url = ('/'+base_url+"/contrast?colors=" + c1 + "," + c2 + "," + c3 + "," + c4);
  window.location.href = url;
}

function contrast1(id, code) {
  var c1 = "%23" + code.substr(0, 6);
  var c2 = "%23" + code.substr(6, 6);
  var c3 = "%23" + code.substr(12, 6);
  var c4 = "%23" + code.substr(18, 6);
  url = ('/'+base_url+"/contrast?colors=" + c1 + "," + c2 + "," + c3 + "," + c4);
  window.open(url, '_blank');
}

function gradient1(id, code) {
  var c1 = "%23" + code.substr(0, 6);
  var c2 = "%23" + code.substr(6, 6);
  var c3 = "%23" + code.substr(12, 6);
  var c4 = "%23" + code.substr(18, 6);
  url = ('/'+base_url+"/gradient?colors=" + c1 + "," + c2 + "," + c3 + "," + c4);
  window.open(url, '_blank');
}

function text1(id, code) {
  var c1 = "%23" + code.substr(0, 6);
  var c2 = "%23" + code.substr(6, 6);
  var c3 = "%23" + code.substr(12, 6);
  var c4 = "%23" + code.substr(18, 6);
  url = ('/'+base_url+"/text?colors=" + c1 + "," + c2 + "," + c3 + "," + c4);
  window.open(url, '_blank');

}

function wheel1(id, code) {
  var c1 = "%23" + code.substr(0, 6);
  var c2 = "%23" + code.substr(6, 6);
  var c3 = "%23" + code.substr(12, 6);
  var c4 = "%23" + code.substr(18, 6);
  url = ('/'+base_url+"/color-wheel?colors=" + c1 + "," + c2 + "," + c3 + "," + c4);
  window.open(url, '_blank');
}

function rel() {
  window.location.href = $(location).attr('href').split("?")[0];
}

function save(x) {
  
  x.previousSibling.style.borderRadius = "0px";
  x.previousSibling.childNodes[0].style.borderRadius = "0px";
  x.previousSibling.childNodes[1].style.borderRadius = "0px";
  var h = x.previousSibling.childNodes[0].height;
  x.previousSibling.style.height = h + 'px';
  x.previousSibling.childNodes[1].style.height = h + 'px';
  x.previousSibling.childNodes[1].style.top = 'unset';
  html2canvas(x.previousSibling, {
      scale: 4
  }).then(function(canvas) {
  
      saveYo(canvas.toDataURL(), 'DesignsAi_color_matcher.png');
      x.previousSibling.style.borderRadius = "6px";
      x.previousSibling.childNodes[0].style.borderRadius = "6px";
      x.previousSibling.childNodes[1].style.borderRadius = "6px";
      x.previousSibling.childNodes[1].style.height = '100%';
      x.previousSibling.style.height = '100%';
      x.previousSibling.childNodes[1].style.top = '0px';
  });
}

function save1(x) {
  
  x.previousSibling.style.borderRadius = "0px";
  html2canvas(x.previousSibling, {
      scale: 4
  }).then(function(canvas) {
     
      saveYo(canvas.toDataURL(), 'DesignsAi_color_matcher.png');
      x.previousSibling.style.borderRadius = "6px";
  });

}


function saveYo(uri, filename) {
  
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
      link.href = uri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  } else {
      window.open(uri);
  }
}

function saveAs(uri, filename) {
  console.log(uri);
  var link = document.createElement('a');
  if (typeof link.download === 'string') {
      link.href = uri;
      link.download = filename;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
  } else {
      window.open(uri);
  }
}

function send_data() {
  var code = $('.hex').text();
  code = code.split('#').join('');
  code = code.substr(0, 24);
  var x = 10000 + Math.floor(Math.random() * 99999);;
  var date = new Date();
  var time = date.getTime().toString();
  if(apiStorage['colorhunt-'+code] == undefined)
  {
    apiStorage.setItem("colorhunt-" + code, {
      id: x,
      time: time
    });
    $(".list").html("");
    list_likes();
    var data = '';
    $('.palette[data-id=' + id + '] .c1').css('border-radius','0px');
    $('.palette[data-id=' + id + '] .c4').css('border-radius','0px');
    html2canvas($('.palette[data-id=' + id + ']').get(0)).then(function(canvas) {
      var image_data = canvas.toDataURL();
      var date = new Date();
      var time = date.getTime().toString();
      $('.palette[data-id=' + id + '] .c1').css('border-radius','4px 4px 0 0');
      $('.palette[data-id=' + id + '] .c4').css('border-radius','20px 20px 4px 4px');
      $('.palette[data-id=' + id + '] .c2').css('border-radius','20px 20px 0 0');
      $('.palette[data-id=' + id + '] .c3').css('border-radius','20px 20px 0 0');
      $.ajax({
        url: '/'+base_url+"/addFav",
        type: "post",
        data: {user_id:user_id,name:"colorhunt-" + code,value:JSON.stringify({id: id,time: time}),image:image_data,_token:token},
        success:function(response)
        {
          var res = JSON.parse(response);
          var temp = res.data.value;
          var newName = 'colorhunt-'+temp.data[0].substr(1)+temp.data[1].substr(1)+temp.data[2].substr(1)+temp.data[3].substr(1);
          var temp = apiStorage[newName];
          temp.apiId = res.data._id;
          temp.name = res.data.name;
          apiStorage[newName] = temp;
        }
      });

      
    });
   
  }
  
}

function send_data1() {
  var code = $('#hex1 input').val() + $('#hex2 input').val() + $('#hex3 input').val() + $('#hex4 input').val() + $('#hex5 input').val();
  code = code.split('#').join('');
  code = code.substr(0, 24);
  var x = 10000 + Math.floor(Math.random() * 99999);;
  var date = new Date();
  var time = date.getTime().toString();
  if(apiStorage['colorhunt-'+code] == undefined)
  {
    

    apiStorage.setItem("colorhunt-" + code, {
      id: x,
      time: time
    });
    

    $(".list").html("");
    list_likes();
    
    $('.palette[data-id=' + id + '] .c1').css('border-radius','0px');
    $('.palette[data-id=' + id + '] .c4').css('border-radius','0px');
    html2canvas($('.palette[data-id=' + id + ']').get(0)).then(function(canvas) {
      var image_data = canvas.toDataURL();
      var date = new Date();
      var time = date.getTime().toString();
      $('.palette[data-id=' + id + '] .c1').css('border-radius','4px 4px 0 0');
      $('.palette[data-id=' + id + '] .c4').css('border-radius','20px 20px 4px 4px');
      $('.palette[data-id=' + id + '] .c2').css('border-radius','20px 20px 0 0');
      $('.palette[data-id=' + id + '] .c3').css('border-radius','20px 20px 0 0');
    $.ajax({
      url: '/'+base_url+"/addFav",
      type: "post",
      data: {user_id:user_id,name:"colorhunt-" + code,value:JSON.stringify({id: id,time: time}),image:image_data,_token:token},
      success:function(response)
      {
        var res = JSON.parse(response);
        var temp = res.data.value;
        var newName = 'colorhunt-'+temp.data[0].substr(1)+temp.data[1].substr(1)+temp.data[2].substr(1)+temp.data[3].substr(1);
        var temp = apiStorage[newName];
        temp.apiId = res.data._id;
        temp.name = res.data.name;
        apiStorage[newName] = temp;
      }
    });

    });
    
    
  }


}


function send_data2(code) {
  
  code = code.substr(0, 24);
  var x = 10000 + Math.floor(Math.random() * 99999);;
  var date = new Date();
  var time = date.getTime().toString();
  if(apiStorage['colorhunt-'+code] == undefined)
  {
    
    
    apiStorage.setItem("colorhunt-" + code, {
      id: x,
      time: time
    });
    
    
    $(".list").html("");
    list_likes();
    
    $('.palette[data-id=' + id + '] .c1').css('border-radius','0px');
    $('.palette[data-id=' + id + '] .c4').css('border-radius','0px');
    html2canvas($('.palette[data-id=' + id + ']').get(0)).then(function(canvas) {
      var image_data = canvas.toDataURL();
      var date = new Date();
      var time = date.getTime().toString();
      $('.palette[data-id=' + id + '] .c1').css('border-radius','4px 4px 0 0');
      $('.palette[data-id=' + id + '] .c4').css('border-radius','20px 20px 4px 4px');
      $('.palette[data-id=' + id + '] .c2').css('border-radius','20px 20px 0 0');
      $('.palette[data-id=' + id + '] .c3').css('border-radius','20px 20px 0 0');
    // $.ajax({
    //   url: '/'+base_url+"/addFav",
    //   type: "post",
    //   data: {user_id:user_id,name:"colorhunt-" + code,value:JSON.stringify({id: id,time: time}),image:image_data},
    //   success:function(response)
    //   {
    //     var res = JSON.parse(response);
    //     var temp = res.data.value;
    //     var newName = 'colorhunt-'+temp.data[0].substr(1)+temp.data[1].substr(1)+temp.data[2].substr(1)+temp.data[3].substr(1);
    //     var temp = apiStorage[newName];
    //     temp.apiId = res.data._id;
    //     temp.name = res.data.name;
    //     apiStorage[newName] = temp;
    //   }
    // });

    });
    
    
  }


}

function isLogin()
{
  
  if(is_login)
  {
    return true;
  }
  
    
  return false;
}

function isLimit()
{
  if(limit == count_likes())
  {
    
    return false;
  }
  return true;

}

function old_notLogin()
{
  alertify.defaults.glossary.title = '';
  alertify.defaults.glossary.ok = 'Login';
  alertify.defaults.glossary.cancel = 'Cancel'; 

  alertify.confirm("You can only save palette when logged in. Proceed to log in.",
  function(){
    alertify.success('Redirecting to login');
    var url = $url = "https://dev.designs.ai/user/login?client="+client_id+"&redirect="+redirect;
    window.location.href = url;
  },
  function(){
    alertify.error('Cancel');

  });
}

function notLogin()
{
  var url = server_name + "/user/login?client="+client_id+"&redirect="+redirect;
  var popup = '<div id = "popup"></div><div id = "popup_box" class = "shadow"><p class = "upperp">Log in to save your favorite colors in branding kit.</p><p class = "lowerp">You can then apply them easily across all of your designs.</p><a href = "'+url+'" class = "btn btn-primary logbtn">Log in to save</a><div id = "close"><i class="fa fa-times"></i></div><img class = "upperi" src = "/'+base_url+'/img/upper.svg"><img class = "loweri" src = "/'+base_url+'/img/lower.svg"><img class = "boxi" src = "/'+base_url+'/img/box.svg"></div>';
  $('body').append(popup);
  $('html, body').css({
    overflow: 'hidden',
    height: '100%'
  });
  $("#popup").fadeIn();
  $( "#popup_box" ).animate({
    opacity: 1,
    top: "200px",
  }, 350, function() {
    // Animation complete.
  });

  $('#popup,#close').click(function(){
    $( "#popup_box" ).animate({
      opacity: 0,
      top: "150px",
    }, 350, function() {
      // Animation complete.
      $("#popup").hide();
      $("#popup_box").remove();
      $("#popup").remove();
      $('html, body').css({
        overflow: 'auto',
        height: 'auto'
    });
    });
    
    
    
  });
  
}


function limitPopup()
{
  var url = server_name + "/pricing";
  var popup = '<div id = "popup"></div><div id = "popup_box" class = "shadow"><p class = "upperp">Maximum saved palette limit is reached.</p><p class = "lowerp">Please upgrade your subscription plan to save more palettes.</p><a href = "'+url+'" class = "btn btn-primary logbtn">Visit pricing page</a><div id = "close"><i class="fa fa-times"></i></div><img class = "upperi" src = "/'+base_url+'/img/upper.svg"><img class = "loweri" src = "/'+base_url+'/img/lower.svg"><img class = "boxi" src = "/'+base_url+'/img/box.svg"></div>';
  $('body').append(popup);
  $('html, body').css({
    overflow: 'hidden',
    height: '100%'
  });
  $("#popup").fadeIn();
  $( "#popup_box" ).animate({
    opacity: 1,
    top: "200px",
  }, 350, function() {
    // Animation complete.
  });

  $('#popup,#close').click(function(){
    $( "#popup_box" ).animate({
      opacity: 0,
      top: "150px",
    }, 350, function() {
      // Animation complete.
      $("#popup").hide();
      $("#popup_box").remove();
      $("#popup").remove();
      $('html, body').css({
        overflow: 'auto',
        height: 'auto'
    });
    });
    
    
    
  });
  
}

function likesCount()
{
  for(var i = 0; i < apiStorage.length;i++)
  {

  }
}

function rgb2hexColor(rgb) {
  if (/^#[0-9A-F]{6}$/i.test(rgb)) return rgb;

  rgb = rgb.match(/^rgb\((\d+),\s*(\d+),\s*(\d+)\)$/);
  function hex(x) {
      return ("0" + parseInt(x).toString(16)).slice(-2);
  }
  return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]);
}


function setColor(hexcolor) { 
  var rgbValue = chroma(hexcolor).rgb();
 
  var color = Math.round(((parseInt(rgbValue[0]) * 299) + 
      (parseInt(rgbValue[1]) * 587) + 
      (parseInt(rgbValue[2]) * 114)) / 1000); 
  var textColor = (color > 125) ? 'black' : 'white'; 
  
  return textColor;
} 

function createImage(id,code)
{
    var data = '';
    $('.palette[data-id=' + id + '] .c1').css('border-radius','0px');
    $('.palette[data-id=' + id + '] .c4').css('border-radius','0px');
    html2canvas($('.palette[data-id=' + id + ']').get(0)).then(function(canvas) {
      var image_data = canvas.toDataURL();
      var date = new Date();
      var time = date.getTime().toString();
      $('.palette[data-id=' + id + '] .c1').css('border-radius','4px 4px 0 0');
      $('.palette[data-id=' + id + '] .c4').css('border-radius','20px 20px 4px 4px');
      $('.palette[data-id=' + id + '] .c2').css('border-radius','20px 20px 0 0');
      $('.palette[data-id=' + id + '] .c3').css('border-radius','20px 20px 0 0');
      var value = {};
      value.id =  id;
      value.time = time;
      value = JSON.stringify(value);
     
      $.ajax({
        url: '/'+base_url+"/addFav",
        type: "post",
        data: {user_id:user_id,name:"colorhunt-" + code,value:value,image:image_data,_token:token},
        success:function(response)
        {
            var res = JSON.parse(response);
            var temp = res.data.value;
            var newName = 'colorhunt-'+temp.data[0].substr(1)+temp.data[1].substr(1)+temp.data[2].substr(1)+temp.data[3].substr(1);
            var temp = apiStorage[newName];
            temp.apiId = res.data._id;
            temp.name = res.data.name;
            apiStorage[newName] = temp;
            lock = 0;  
        }
      });
    });

    return data;
    
}