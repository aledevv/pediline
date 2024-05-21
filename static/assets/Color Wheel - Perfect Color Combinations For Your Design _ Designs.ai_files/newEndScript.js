if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
    $('#likes .list').css('overflow', 'hidden');
}

// $(function() {
//     list_likes();
//     like_first_palette_tip();

// });

$("#expjson").click(function() {

    exportjson();
});

var inte = setInterval(function() {

    if ($('header').is(":visible")) {
        
        $('#rectangle').fadeIn(50,function(){
            $('.mainHeading,.heading').fadeIn(50,function(){
                $('#outer-container').css('display','flex');
                $('footer').fadeIn(50);
            });
            
        });
       
        clearInterval(inte);
    }
}, 500);

$("input[type=text]").focus(function() {
    $(this).addClass("uclass");
    $(this).removeClass("iclass");
})

$("input[type=text]").blur(function() {
    $(this).addClass("iclass");
    $(this).removeClass("uclass");
})

$('input').keyup(function(e) {
    if (e.keyCode == 13) {
        var ind = $(this).parent().attr('id').substr(3, 1);
        if (/^#[0-9A-F]{6}$/i.test($(this).val())) {
            manualSetup($(this).val(), ind);
        } else {
            alert("Not a valid hex string.");
        }

    }
});

$("#cwtbtn,#itbtn").on('click',function(){
    text2();
});

$("#cwgbtn,#igbtn").on('click',function(){
    gradient2();
});

$("#cwcbtn,#icbtn").on('click',function(){
    contrast2();
});

$("#iwbtn").on('click',function(){
    wheel2();
});

