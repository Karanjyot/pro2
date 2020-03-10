var socket = io.connect("http://localhost:8080");

//DOM
var message = document.getElementById('message');
var handle = document.getElementById('handle');
var send = document.getElementById('send');
var output = document.getElementById('output');
var feedback = document.getElementById('feedback');
var to = document.getElementById('to');
var save = document.getElementById('save');
var chat = document.getElementById('chat')
var buttons = document.getElementsByClassName("buttons")
var body = document.getElementById('balls');


var testArr = []
var senderArr = []

// emit message to server if user presses enter
document.querySelector('#message').addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        event.preventDefault();

        $(".typing").remove();

       

        socket.emit("private-message", {
            message: message.value,
            handle: senderArr[0],
            to: testArr[0]
        });

        var id = { sender: senderArr[0], reciever: testArr[0], chat: message.value }

        $.ajax({
            type: "POST",
            url: "/api/post",
            data: id
        }
        );
        $("#message").val("")
    }
    
});


// broadcast a message to a selected user when another user is typing a message
message.addEventListener("keypress", () => {
    socket.emit('typing', { sender: senderArr, reciever: testArr[0] })
})


// display users

window.onload = function () {

    // get the name of the user that is logged in and save in array
    $.get({
        type: "POST",
        url: "/api/user",
    }
    ).then(function (response) {
        console.log(response)
        senderArr.push(response)
        var username = senderArr[0]
        socket.emit("add-user", { "username": username });


    }).fail(function (err) {
        console.log(err)
    });

    // if user visits chat page, retrieve all users online and display them

       
        event.preventDefault();
        // retrieve users
        $.ajax({
            type: "POST",
            url: "/api/users",
            success: function (response) {
                console.log(response)
                

                var messages = JSON.parse(response)
                console.log(messages)
                console.log(senderArr[0])
                console.log(messages[0]);
                // loop through array and create/append a button for each user
                for (var i = 0; i < messages.length; i++) {

                    var div = document.createElement("div");
                    div.className = `conversation ${i}`;
                    $("#conversation-list").append(div)

                    // $(`.${i}`).append(`<img src ="../assets/images/paperclip.png" alt="profile"></img>`) 
                   
                   
                
                    var nameDiv = document.createElement("div")
                    nameDiv.className="title-text"
                    nameDiv.innerHTML =`${messages[i]}`
                    $(`.${i}`).append(nameDiv)



                   
                    



                    // var btn = document.createElement("BUTTON");
                    // btn.innerHTML = messages[i];
                    // $("#conversation-list").append(btn);
                    // btn.className = "buttons";
                    // add an onclick function for each button that allows chat history to be displayed and reciever of the message to be selected
                    nameDiv.onclick = function () {
                      
                        var username = senderArr[0]
                        socket.emit("add-user", { "username": username });
                        var userData = { reciever: this.innerHTML, sender: senderArr[0] }

                        testArr = [this.innerHTML]

                        console.log(testArr)

                        $("#firstName").text(testArr[0])
                        
                        // retrieve chat history and display
                        $.ajax({
                            type: "POST",
                            url: "/api/chats",
                            data: userData,
                            success: function (response) {

                                var chats = JSON.parse(response)
                                console.log(chats)

                                // Removes all previous messages 
                                $("LI").remove();

                                for (var i = 0; i < chats.length; i++) {

                                    var listItem = document.createElement("LI")
                                    listItem.innerHTML = chats[i].sender + " says: " + chats[i].chats;
                                    listItem.className = "chats";
                                    $("#ulChats").append(listItem);

                                    if (chats[i].sender === senderArr[0]) {
                                        listItem.className = "sender";

                                    } else {
                                        listItem.className = "reciever";
                                    }
                                }


                            }
                        }
                        );

                    };
                
                }


            }
        }
        );

};

//listen for events and append messages

socket.on('private-message', data => {



    if (data.handle === senderArr[0]) {
        $("#ulChats").append(`<li class="sender">${data.handle} says: ${data.message}</li>`);

    } else {
        $("#ulChats").append(`<li class="reciever">${data.handle} says: ${data.message}</li>`);

    }

})

// append on element which lets user know who is typing
// socket.on('typing', data => {
    
//     feedback.innerHTML = `<p ><em class="typing"> ${data.sender} is typing a message...</em></p>`

    
// })


