const socket = io()

//Elements
const $form = document.querySelector('#message-form')
const $inputBox = $form.querySelector('#message')
const $sendButton = $form.querySelector('#send')
const $locationButton =  document.querySelector('#send-location')
const $messages = document.querySelector('#messages')
const $sidebar = document.querySelector('#sidebar')

//Templates
const messageTemplate = document.querySelector('#message-template').innerHTML
const locationMessageTemplate = document.querySelector('#location-message-template').innerHTML
const sidebarTemplate = document.querySelector('#sidebar-template').innerHTML

//Options
 const {username, room} = Qs.parse(location.search, {ignoreQueryPrefix:true})

    const autoscroll = ()=>{
        //new message
        const $newMessage = $messages.lastElementChild

        //height of the newMessage
        const newMessageStyles = getComputedStyle($newMessage)
        const newMessageMargin = parseInt(newMessageStyles.marginBottom)
        const newMessageHeight = $newMessage.offsetHeight + newMessageMargin

        //Visible Height
        const visibleHeight = $messages.offsetHeight

        //Heights of messages container
        const containerHeight = $messages.scrollHeight

        //How far have i scrolled
        const scrollOffset =$messages.scrollTop + visibleHeight

        if(containerHeight- newMessageHeight <=scrollOffset){
            $messages.scrollTop = $messages.scrollHeight

        }

    }



//Emit message to the client on recieving message from the server
socket.on('message',(message)=>{

    const html = Mustache.render(messageTemplate,{
        username: message.username,
        message: message.text,
        createdAt: moment(message.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', html)
    autoscroll()
})

//Emit location message to the client on recieving message from the server
socket.on('locationMessage', (locationData)=>{
    const locationHTML = Mustache.render(locationMessageTemplate,{
        username: locationData.username,
        locationURL:locationData.locationURL,
        createdAt: moment(locationData.createdAt).format('h:mm a')
    })
    $messages.insertAdjacentHTML('beforeend', locationHTML)
    autoscroll()

})

socket.on("roomData", ({room, users})=>{
    const html = Mustache.render(sidebarTemplate, {
        room,
        users 
    })
    $sidebar.innerHTML=html
})

socket.emit("joinRoom", {username, room}, (error)=>{
    if(error){
        alert(error)
        location.href='/'
    }
})


//Event handler for form submit event
$form.addEventListener('submit',(e)=>{

    e.preventDefault()
    $sendButton.setAttribute('disabled', 'disabled')

    const inputMessage = e.target.elements.message.value

    //Emit message to the server recieved from the client
    socket.emit('sendMessage', inputMessage ,(error)=>{
        $sendButton.removeAttribute('disabled')
        $inputBox.value=''
        $inputBox.focus()
        if(error){
            return console.log(error);
        }
        console.log('Delivered');
    })
})

//Event handler for form location button click event
$locationButton.addEventListener('click', ()=>{
    
    if(!navigator.geolocation){
        return alert('Geolocation is not supported by your browser')
    }
    $locationButton.setAttribute('disabled', 'disabled')

    //Send server the current location
    navigator.geolocation.getCurrentPosition((position)=>{
        socket.emit('sendLocation', {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        }, ()=>{
            $locationButton.removeAttribute('disabled')
            console.log('location shared');
        })
    })
})