// const userDB={
//     users:require('../model/user.json'),
//     setUser:function(data){this.users=data},
// }
const userModel=require('../model/user.js');
const jwt=require('jsonwebtoken')

const bcrypt=require('bcrypt');
// const fsPromises= require('fs').promises;
// require('dotenv').config();
// const path=require('path');

const handleLogin = async (req, res)=>{
    const {user,pwd}=req.body;
   
if (!user || !pwd) return res.sendStatus(400).json({ 'message': 'Username and password are required.' });

// const foundUser=userDB.users.find(person=>person.username===user);
// check for duplicate usernames in the db
const foundUser = await userModel.findOne({ username: user}).exec();
if(!foundUser) return res.sendStatus(401)

const match=await bcrypt.compare(pwd,foundUser.password);
if(match) {
    const roles=Object.values(foundUser.roles);
    //crete JWT
    const accessToken = jwt.sign(
        {
            "UserInfo":{
            "username":foundUser.username,
            "roles":roles
        }},
        process.env.ACCESS_TOKEN_SECRET,
        {expiresIn: '30s'}
    );
    const refreshToken = jwt.sign(
        {"username":foundUser.username},
        process.env.REFRESH_TOKEN_SECRET,
        {expiresIn: '1d'}
    );
    //saving refreshtoke with currentUser
    // const otherUsers=userDB.users.filter(person=>person.username!==foundUser.username);
    // const currentUser = {...foundUser,refreshToken};
    // userDB.setUser([...otherUsers,currentUser]);
    // await fsPromises.writeFile(
    //     path.join(__dirname,'..','model','user.json'),
    //     JSON.stringify(userDB.users)
    // );
    foundUser.refreshToken=refreshToken;
    const result = await foundUser.save();
    console.log(result);       
    res.cookie('jwt',refreshToken,{httpOnly:true,maxAge:24*60*60*1000,sameSite:'None',secure:true});
    res.json({accessToken});

}else{
    res.sendStatus(401)
}
}
module.exports={handleLogin}