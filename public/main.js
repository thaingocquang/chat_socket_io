window.onload = () => {
    document.getElementById("home").style.display = "none";
}

document.getElementById('typing').style.display = "none";

const socket = io('http://localhost:3000/');

document.getElementById('btnRegister').onclick = () => {
    let username = document.getElementById('txtUsername').value;
    socket.emit('client-send-register', username);
}

socket.on('server-send-register-fail', () => {
    alert("Username already existed!");
})

socket.on('server-send-register-success', (data) => {
    document.getElementById('currentUser').innerHTML = data;
    document.getElementById("home").style.display = "block";
    document.getElementById("login").style.display = "none";
})

socket.on('server-send-arrUser', (arrUser) => {
    document.getElementById('boxContent').innerText = "";
    arrUser.forEach(element => {
        let child = document.createElement('div');
        child.innerText = element;
        document.getElementById('boxContent').appendChild(child);
    });

})

document.getElementById('btnLogout').onclick = () => {
    socket.emit('logout');
    document.getElementById("home").style.display = "none";
    document.getElementById("login").style.display = "block";
}

document.getElementById('btnSendMessage').onclick = () => {
    let message = document.getElementById("txtMessage").value;
    socket.emit('user-send-message', message);
}

socket.on('server-send-message', (data) => {
    let child = document.createElement('div');
    child.innerText = data.username + ': ' + data.message;
    document.getElementById('listMessage').appendChild(child);
})

document.getElementById('txtMessage').addEventListener('focusin', () => {
    socket.emit('typing');
})

document.getElementById('txtMessage').addEventListener('focusout', () => {
    socket.emit('stop-typing');
})

socket.on('someone-is-typing', (data) => {
    document.getElementById('typing').style.display = "block";
    document.getElementById('span').innerText = data;
})

socket.on('someone-stop-typing', () => {
    document.getElementById('typing').style.display = "none";
})

