var selectedUser;
var currentUser;
function loadUserInfo()
{
    pageName = "userInfo";
    
    $('#userInfo-text').html("Go Back");
    bindBackToMain();

    $('#load-stuff-here').load('userinfo.html');
    $.get("/currentuser", {}, function(user)
    {
        selectedUser = user._id;
        currentUser = user._id;
        if(user.admin)
        {
            $('#approveUserData').hide();
            $('#denyUserData').hide();
            $('#upgradeUserData').hide();
            $('#deleteUserData').hide();
            $('#userSidePanel').hide();
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
                    entry.setAttribute('approvedUser', true);
                    entry.setAttribute('onClick','makeUserActive(this)');
                    entry.setAttribute('style','text-align:center;');
                    list.appendChild(entry);
                }        
            });
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
        }
        else
        {
            $('#upgradeUserData').hide();
            $('#deleteUserData').hide();
            $('#approveUserData').hide();
            $('#adminSidePanel').hide();
            $('#denyUserData').hide();
        }

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
    var apr = tableItem.getAttribute("approvedUser");
    if(apr == "true")
    {
        $('#upgradeUserData').show();
        $('#deleteUserData').show();
        $('#editUserData').show();
    }
    else
    {
        $('#editUserData').hide();
        $('#approveUserData').show();
        $('#denyUserData').show();
    }
    console.log(selectedUser + " " + currentUser);
    if(selectedUser == currentUser)
    {
        $('#upgradeUserData').hide();
        $('#deleteUserData').hide();
    }
}
function approveUser()
{
    $.post("/approve", {id:selectedUser}, function(res)
    {
        if(res.result == 'success')
        {
            var tableElements = $(li[useId=selectedUser]);
            for (var i = 0; i < tableElements.length; ++i)
            {
                tableElements[i].setAttribute("approvedUser", "true");
                tableElements[i].html(tableElements[i].html().substring(0,tableElements[i].html().length-3));
            }
        }
    });
}
function denyUser()
{
    $.post("/deny", {id:selectedUser}, function(res)
    {
        if(res.result == 'success')
        {
            var tableElements = $(li[useId=selectedUser]);
            for (var i = 0; i < tableElements.length; ++i)
            {
                tableElements[i].hide();
            }
        }
    });
}