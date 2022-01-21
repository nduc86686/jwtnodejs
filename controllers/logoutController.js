// const usersDB = {
//     users: require('../model/user.json'),
//     setUsers: function (data) { this.users = data }
// }
// const fsPromises= require('fs').promises;
// const path= require('path');
const userModel=require('../model/user.js');

const handleLogout =async (req, res) => {
    //on client,also delete the accessToken
    const cookies = req.cookies;
    if (!cookies?.jwt) return res.sendStatus(204);//no content
    const refreshToken = cookies.jwt;

    //is refresh token in db
    // const foundUser = usersDB.users.find(person => person.refreshToken === refreshToken);
    // check for duplicate usernames in the db
    const foundUser = await userModel.findOne({ refreshToken }).exec();
    if (!foundUser) {
        res.clearCookie('jwt',{httpOnly: true,sameSite:'None',secure:true});
        return res.sendStatus(204); //Forbidden
    } 
    //deltete refresh token in db
    // const otherUsers= usersDB.users.filter(person=> person.refreshToken !== foundUser.refreshToken);
    // const currentUser = {...foundUser,refreshToken: ''};
    // usersDB.setUsers([...otherUsers,currentUser]);
    // await fsPromises.writeFile(path.join(__dirname, '..', 'model','user.json'),JSON.stringify(usersDB.users));
    foundUser.refreshToken='';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie('jwt',{httpOnly: true});//secure:true-only server on https
    res.sendStatus(204);
}

module.exports = { handleLogout }