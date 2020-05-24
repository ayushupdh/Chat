const generateMessage = (username, message)=>{
    

    return{
        username,
        text:message,
        createdAt: new Date().getTime()
    }

}
const generateLocationMessage = (username,data)=>{
    return{
        username,
        locationURL:`https://google.com/maps?q=${data.latitude},${data.longitude} `,
        createdAt: new Date().getTime()
    }

}

module.exports = {generateMessage, generateLocationMessage}