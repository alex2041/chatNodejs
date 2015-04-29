//chat.js
var socket;
window.onunload = function(){
    socket.disconnet();
};
window.onload = function(){
    socket = io.connect('http://localhost:80');
    var messages = [];
    var usersm = [];
    
    var field = document.getElementById('field');
    var form = document.getElementById('form');
    var content = document.getElementById('content');
    var users = document.getElementById('users');
    
    if(document.getElementById('name')){
        var name = document.getElementById('name').innerHTML;
    }
    
    if(name){
        socket.emit('hello', {name: name});
    }
    
    form.onsubmit = function(){
       var text = field.value;
       var color = document.getElementById('color').value;
       socket.emit('send', {message: '<span style="color:' + color + ';">' + name + ': ' + text + '</span>'});
       field.value = '';
       return false;
    };
    
    socket.on('message', function(data){
        if(data.message){
            messages.unshift(data.message);
            var html = '';
            for(var i = 0; i < messages.length; i++){
                html += messages[i] + '<br/>';
            }
            content.innerHTML = html;
        }else{
            console.log('чтотонето...')
        }
    });
    
    socket.on('users', function(data){
        if(data.users){
            usersm.unshift(data.users);
            var html = '';
            for(var i = 0; i < usersm.length; i++){
                html += usersm[i] + '<br/>';
            }
            users.innerHTML = html;
        }
    });
    
};

function toUser(tous){
    document.getElementById('field').value += 'to [' + tous + '] ';
}