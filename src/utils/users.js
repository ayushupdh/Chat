const users=[]

//Add User
const addUser= ({id, username, room})=>{

    if(!username || !room){
        return{
            error:'username and room are required'
        }
    }

    //Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //check for existing user
    const existingUser = users.find((user)=>{
        return user.room === room && user.username === username
    })

    //validate user
    if(existingUser){
        return{
            error:'Username is in use!'
        }
    }

    //Store User
    const user ={id, username, room}
    users.push(user)
    return {user}

}



//Remove User
const removeUser= (id)=>{
        const index = users.findIndex((user)=> user.id === id)

        if(index !== -1 ){
            return users.splice(index, 1)[0]
        }

}


//Get User

const getUser = (id)=>{

    const matchedUser = users.find((user)=>{
        return user.id=== id
    })
    return matchedUser

}

//Get Users in a room

const getUsersInRoom = (room)=>{

    const usersArray = users.filter((user)=>{
        return user.room === room
    })
    return(usersArray)

}

module.exports = {
    addUser,
    removeUser,
    getUser,
    getUsersInRoom
}