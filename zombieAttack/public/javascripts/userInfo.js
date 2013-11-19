var selectedUser;
var currentUser;
function setMe()
{
    $('#approveUserData').hide();
    $('#denyUserData').hide();
    $('#upgradeUserData').hide();
    $('#deleteUserData').hide();
    $('#editUserData').show();

    $('#permTable').hide();
    $('#editTable').show();
}
function setRequest()
{
    $('#approveUserData').show();
    $('#denyUserData').show();
    $('#upgradeUserData').hide();
    $('#deleteUserData').hide();
    $('#editUserData').hide();

    $('#permTable').hide();
    $('#editTable').hide();
}
function setOther()
{
    $('#approveUserData').hide();
    $('#denyUserData').hide();
    $('#upgradeUserData').show();
    $('#deleteUserData').show();
    $('#editUserData').hide();

    $('#permTable').show();
    $('#editTable').hide();
}
function setUpFileUpload()
{
       $('#uploadFile').fileupload({
        dataType: 'json',
        done: function (e, data) {
            $.each(data.result.files, function (index, file) {
                $('<p/>').text(file.name).appendTo(document.body);
            });
        }
    
});
}
function loadUserInfo()
{
    pageName = "userInfo";
    $.post('/updatePage',{page:'userInfo'},function(info){});

    $('#login-form').html("<table><tr><td><a href=\"\/logout\" class='btn btn-success'> Logout </button></td><td><button id=\"userInfo-text\" class='btn btn-success'> UserInfo </button></td></tr></table>");
    $('#userInfo-text').html("Go Back");
    bindBackToMain();

    $('#load-stuff-here').load('userinfo.html', function(){
        setUpFileUpload();
        $.get("/currentuser", {}, function(user)
        {
            selectedUser = user._id;
            currentUser = user._id;
            setUserUI(user._id, user.name, user.admin, user.designer, user.player);
            if(user.admin)
            {
                $('#userSidePanel').hide();
                setMe();
                $.get("/users", {}, function(info) {
                    var list = document.getElementById('userList');
                    for(var i = 0; i < info.length; ++i)
                    {
                        var name = info[i].value.name;
                        var entry = document.createElement('li');
                        entry.appendChild(document.createTextNode(name));
                        if(info[i].value._id == currentUser)
                        {
                            entry.setAttribute('class','list-group-item active');
                        }
                        else
                        {
                            entry.setAttribute('class','list-group-item');
                        }
                        entry.setAttribute('userId', info[i].value._id);
                        entry.setAttribute('userName', info[i].value.name);
                        entry.setAttribute('userA', info[i].value.admin);
                        entry.setAttribute('userD', info[i].value.designer);
                        entry.setAttribute('userP', info[i].value.player);
                        entry.setAttribute('approvedUser', true);
                        entry.setAttribute('onClick','makeUserActive(this)');
                        entry.setAttribute('style','text-align:center;');
                        list.appendChild(entry);
                    } 
                    $.get("/userrequests", {}, function(info) {
                    var list = document.getElementById('userList');
                    for(var i = 0; i < info.length; ++i)
                    {
                        var name = info[i].value.name;
                        var entry = document.createElement('li');
                        entry.appendChild(document.createTextNode(name + "<--request"));
                        if(info[i].value._id == list)
                        {
                            entry.setAttribute('class','list-group-item active');
                        }
                        else
                        {
                            entry.setAttribute('class','list-group-item');
                        }
                        entry.setAttribute('userId', info[i].value._id);
                        entry.setAttribute('approvedUser', "false");
                        entry.setAttribute('onClick','makeUserActive(this)');
                        entry.setAttribute('style','text-align:center;');
                        list.appendChild(entry);
                    }        
                });       
            });
        }
        else
        {
            setMe();
            $('#adminSidePanel').hide();
        }

    });
    });
}

 function bindBackToMain()
 {
    $('#userInfo-text').click(function()
    {
        loadMainPage();    
        return false;  
    });
    return false;
 }

 function makeUserActive(tableItem)
{
    var tableElements = document.getElementsByClassName('list-group-item active');
    for (var i = 0; i < tableElements.length; ++i)
    {
        tableElements[i].className = "list-group-item";
    }
    tableItem.className = "list-group-item active";
    selectedUser = tableItem.getAttribute("userId");
    var nm = tableItem.getAttribute("userName");
    var ad = tableItem.getAttribute("userA");
    var des = tableItem.getAttribute("userD");
    var pl = tableItem.getAttribute("userP");
    var apr = tableItem.getAttribute("approvedUser");
    setUserUI(selectedUser, nm, ad, des, pl);
    if(apr == "true")
    {
        setOther();
    }
    else
    {
        setRequest();
    }
    console.log(selectedUser + " " + currentUser);
    if(selectedUser == currentUser)
    {
        setMe();
    }
}
function approveUser()
{
    $.post("/approve", {id:selectedUser}, function(res)
    {
        var tableElements = $("userList");
        for (var i = 0; i < tableElements.length; ++i)
        {
            if(tableElements[i].getAttribute("userId") == selectedUser)
           {
                if(res.result == "success")
                    tableElements[i].hide();
                else
                    tableElements[i].html("ERROR");
            }
        }
        if(res.result == "success")
            loadUserInfo(); 
    });
}
function denyUser()
{
    $.post("/deny", {id:selectedUser}, function(res)
    {
        var tableElements = $("userList");
        for (var i = 0; i < tableElements.length; ++i)
        {
            if(tableElements[i].getAttribute("userId") == selectedUser)
            {
                if(res.result == "success")
                    tableElements[i].hide();
                else
                    tableElements[i].html("ERROR");
            }
        }
        if(res.result == "success")
            loadUserInfo();
    });

}
function deleteUser()
{
    $.post("/deleteuser", {id:selectedUser}, function(res)
    {
        var tableElements = $("userList");
        for (var i = 0; i < tableElements.length; ++i)
        {
            if(tableElemnents[i].getAttribute("userId") == selectedUser)
            {
                if(res.result == "success")
                    tableElements[i].hide();
                else
                    tableElement[i].html("ERROR");
            }
        }
        if(res.result == "success")
            loadUserInfo();
    });

}
function setUserUI(id, name, admin, designer, player)
{
    $('#tdemail').html(id);
    $('#inname').val(name);
    console.log("Admin: ", admin);
    if(admin == "true")
    {
        console.log("Admin true");
        $('#cha').prop("checked", true);
    }
    else
    {
        console.log("Admin false");
        $('#cha').prop("checked", false);
    }
    if(designer == "true")
    {
        console.log("Des true");
        $('#chd').prop("checked", true);
    }
    else
    {
        console.log("Des false");
        $('#chd').prop("checked", false);
    }
    if(player == "true")
    {
        console.log("Play true");
        $('#chp').prop("checked", true);
    }
    else
    {
        console.log("Play false");
        $('#chp').prop("checked", false);
    }
}
function edituser()
{
    var n = document.getElementById('inname').value;
    var p1 = document.getElementById('inpass').value
    var p2 = document.getElementById('inpass2').value;
    if(p1 != p2 || (p1.length < 5 && p1.length > 0))
    {
        console.log("Error: invalid password...");
        return;
    }
    else if(p1.length >= 5)
    {
        $.post("/editpassword", {password:p1}, function(res)
        {
            console.log("EditPass: ", res);
        });
    }
    if(n.length > 0)
    {
        $.post("/editname", {name:n}, function(res)
        {
            console.log("EditName: ", res);
        });
    }
}
function upgradeuser()
{
    var a = document.getElementById('cha').checked;
    var d = document.getElementById('chd').checked;
    var p = document.getElementById('chp').checked;
    if(a == true)
    {
        d = true;
        p = true;
    }
    $.post("/upgrade", {id:selectedUser, admin: a, player: p, designer: d}, function(res)
    {
        console.log("upgrade: ", res);
    });
}