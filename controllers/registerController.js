// const userDB={
//     users:require('../model/user.json'),
//     setUser:function(data){this.users=data},
// }

const userModel=require('../model/user.js');
const fsPromises=require('fs').promises;
const path=require('path');
const bcrypt=require('bcrypt')

const handleNewUser = async(req,res)=>{
    const {user,pwd} = req.body;
    console.log(user);
    console.log(pwd);
    if(!user||!pwd) return res.status(400).json({'message':'Username or password incorrect'});

    //check for duplicates username in the db file
    // const duplicate=userDB.users.find(person=>person.username===user);

    // check for duplicate usernames in the db
    const duplicate = await userModel.findOne({ username: user }).exec();
    if(duplicate) return res.sendStatus(409); //Conflict 
    try {
        //encrypt the password
        const hashedPwd=await bcrypt.hash(pwd,10)
        // const newUser={"username":user,"roles":{"User":2001}, "password":hashedPwd}
        // userDB.setUser([...userDB.users,newUser])
        // await fsPromises.writeFile(path.join(__dirname,'..', 'model','user.json'),JSON.stringify(userDB.users));
        const result = await userModel.create({
            "username":user,
            "password":hashedPwd
        })
        console.log(result);
        res.status(201).json({'success':'complete create user'})
    } catch (error) {
        res.status(500).json({'message':error.message});
    }
}
module.exports ={handleNewUser};