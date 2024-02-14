document.getElementById('sendBtn').addEventListener('click', function () {
    var message = document.getElementById('textInput').value;
    if (message) {
        var messageElement = document.createElement('div');
        messageElement.className = 'message';
        messageElement.innerText = message;
        document.getElementById('textCont').appendChild(messageElement);
        document.getElementById('textInput').value = '';
        timeOut(messageElement);
    }
})

function timeOut(messageElement) {
    setTimeout(function () {
        messageElement.remove();
    }, 10000);
}