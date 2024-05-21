function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for(var i = 0; i <ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
        c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
        return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, time) {
    var d = new Date();
    d.setTime(time*1000);
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";domain="+cookie_domain+";path=/";
}

function fetchData()
{

    var daitkn = getCookie('daitkn');
    if(daitkn === '')
        return false;
    var flag = 0;
    $.ajax({
    url: '/'+base_url+"/getDetails",
    type: "post",
    async: false,
    data: {authorization:daitkn,_token,token},
    success:function(response)
    {
        response = JSON.parse(response);
        if(response.hasOwnProperty('message'))
        {
            flag = 1;
            return false;
        }
        var name = response['user']['name'];
        var user_profile = response['user']['user_profile'];
        var created_at = response['user']['created_at'];
        user_id = response['user']['id'];
        var subscription = response['user']['subscription']['sub_plan_name'];
        var sub_category = response['user']['subscription']['sub_category'];
        tmp_user_info = {"name":name, "created_at":created_at, "user_profile":user_profile, "subscription":{"sub_plan_name":subscription,"sub_category":sub_category}};
        assingGlobaVarForNPM(tmp_user_info);
        fetchAll();
        return true;
    },
    error: function (xhr, ajaxOptions, thrownError) {
        console.log(xhr.responseText);
        console.log(thrownError);
        flag = 1;
      }
    });

    if(flag === 1)
        return false;
    return true;
}



// function getDetails()
// {
    
//     var daitkn = getCookie('daitkn');
    
//     if(daitkn === '')
//     {
//         if(refreshToken())
//         {
//             if(!fetchData())
//             {
//                 //alert('Server Error');
//                 logout();
//             }   
//         }
//         else
//         {
//             logout();
//         }
        
//     }
//     else
//     {
//         if(!fetchData())
//         {
//             if(refreshToken())
//             {
                
//                 if(!fetchData())
//                 {
//                     //alert('Server Error');
//                     logout();
//                 }   
//             }
//             else
//             {
//                 logout();
//             }   
//         }
//     }
    
// }


function getDetails(is_render_header)
{
    var daitkn = getCookie('daitkn');
    if(daitkn !== '')
    {
        $.ajax({
        url: '/'+base_url+"/getDetails",
        type: "post",
		async: false,
        data: {authorization:daitkn,_token:token}
        })
        .done(function(response){
            response = JSON.parse(response);
            
            var name = response['user']['name'];
            var user_profile = response['user']['user_profile'];
            var created_at = response['user']['created_at'];
            user_id = response['user']['id'];
            var subscription = response['user']['subscription']['sub_plan_name'];
            var sub_category = response['user']['subscription']['sub_category'];
			tmp_user_info = {"name":name, "created_at":created_at, "user_profile":user_profile, "subscription":{"sub_plan_name":subscription,"sub_category":sub_category}};
            if(is_render_header == true){
                assingGlobaVarForNPM(tmp_user_info);                
            }
            fetchAll();
        })
        .fail(function(jqXHR,textStatus){
            console.log(textStatus);
            setCookie('daitkn','',0);
            getDetails(true);
        });		
    }
    else
    {
        var dairftkn = getCookie('dairftkn');
        $.ajax({
        url: '/'+base_url+"/getNewToken",
        type: "post",
        data: {refreshToken:dairftkn,_token:token}
        })
        .done(function(response)
        {            
            var access_token = response.new_token;
         
            var newPayload = getPayload(access_token);
            var newExp = newPayload['exp'];
         
            setCookie('daitkn',access_token,newExp);
         
            getDetails(true);
        })
        .fail(function(jqXHR,textStatus){

            console.log(textStatus);
            //getDetails();
        });
        
    }
    
}



function refreshToken(call_back = null)
{
    var dairftkn = getCookie('dairftkn');
    if(dairftkn === '')
        return false;
    var flag = 0;
    $.ajax({
    url: '/'+base_url+"/getNewToken",
    type: "post",
    data: {refreshToken:dairftkn,_token:token},
    success:function(response)
    {
        if(response.hasOwnProperty('error'))
        {
            flag = 1;
            return false;
        }
        var access_token = response.new_token;

        var newPayload = getPayload(access_token);
        var newExp = newPayload['exp'];
        
        setCookie('daitkn',access_token,newExp);
        
        if(call_back){
            call_back(access_token);
        }

    }
    });

    if(flag === 1)
        return false;
    return true;
}


function getPayload(daitkn)
{
    var decoded = jwt_decode(daitkn);
    return decoded;
}





function logout()
{
    //var url = "https://designs.ai/user/logout?client=52be41e7ce66c5e157d00921f0ccffde&redirect=https%3A%2F%2Fcolor.designs-ai.loc";
    //is_login = 0;
    //window.location.replace(url);
}

/* CUSTOMIZED FOR 'daitkn' PARAMETER */
function fetchAll()
{
    let daitkn = getCookie('daitkn');    
    if(!daitkn || daitkn === ''){
        refreshToken(function(token){
            daitkn=token;
            fetchAllAfterRefreshTkn(daitkn);
        });            
    }
    else{
        fetchAllAfterRefreshTkn(daitkn);
    }
}

function fetchAllAfterRefreshTkn(daitkn){
    $.ajax({
        url: '/' + base_url + "/fetchPalettes",
        type: "post",
        data: { user_id: user_id, daitkn: daitkn, _token:token},
        success: function (response) {
            response = JSON.parse(response);
            var favs = response.data;
            limit = response.limit;

            //deleteAll();
            for (var i = 0; i < favs.length; i++) {
                var temp = favs[i].value;
                if (temp.data.length > 0) {
                    var newName = 'colorhunt-';
                    for(var x = 0; x < temp.data.length; x++){
                        newName += temp.data[x].substr(1)
                    }
                    temp.apiId = favs[i]._id;
                    temp.name = favs[i].name;
                    favs[i].value = temp;
                    apiStorage[newName] = favs[i].value;
                }
            }
            let count = 0;
            for (x in apiStorage) {
                count++;
            }
            apiStorage.length = count;


            doTheRightAction();
            setTimeout(function() {
                list_likes();
                //like_first_palette_tip();
            }, 10);

        }
    });
}


function doTheRightAction()
{
    var url = window.location;
	var active = url.pathname.split('/')[2];

    if (active == 'favourites')
    {
        $('.skeletonPal').remove();
        displayFavPals();
    } 

    if(active == 'palette')
    {
        id = url.pathname.split('/')[3];
        if(typeof displayPal === "function" )
        displayPal(id);
    }
}



function deleteAll(favs) {

    $.ajax({
        url: '/' + base_url + "/deleteAll",
        type: "post",
        data: { user_id: user_id,_token:token },
        async: false,
        success: function (response) {
            console.log(response);
        }
    });

}




//console.log('token '+getCookie('daitkn'));
//console.log('refresh token '+getCookie('dairftkn'));


var daitkn;
var dairftkn;
var ctime = Math.floor(Date.now() / 1000);
var token = $('meta[name="csrf-token"]').attr('content');

if(getCookie('dairftkn') != '')
{
    is_login = 1;

    let daitkn = getCookie('daitkn');
    if(daitkn != '')
    {
        var expireAt = getPayload(daitkn)['exp'];
        //expireAt = ctime + 30;
        setCookie('daitkn',daitkn,expireAt);
    }
}

function assingGlobaVarForNPM(obj_user_info){
	npm_header_user_info = obj_user_info;	
}