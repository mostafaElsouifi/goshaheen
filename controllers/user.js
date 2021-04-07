const User = require('../models/user');


// register  
module.exports.renderRegisterFrom = (req, res)=>{
    res.render('user/register', {title: 'Add user'});
}

module.exports.register = async(req, res)=>{
    try{
        const { username, email, password } = req.body;
    const user = new User({ username, email });
    const newUser = await User.register(user, password);
    req.flash('success', `${newUser.username} is the new admin`);
    res.redirect('/');
    }catch(e){
        req.flash('error', e.message);
        res.redirect('/register');
    }
    
}


// login 
module.exports.renderLoginForm = (req, res)=>{
    if(req.user){
        req.flash('success', 'you alredy logged in');
        return res.redirect('/controlpanel');
    }
    res.render('user/login', { title : 'login'});
}

module.exports.login = (req, res)=>{
    req.flash('success', 'welcome back');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}
// logout
module.exports.logout = (req, res)=>{
    req.logout();
    req.flash('success', 'Goodby');
    res.redirect('/');
}






