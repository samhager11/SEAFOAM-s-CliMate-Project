
//Facebook app id
// 195326264136993

//Facebook secret
//45153cbf8947e53c17171249b2b26c0a

module.exports = {
    'facebookAuth': {
        'clientID': '195326264136993',
        'clientSecret': '45153cbf8947e53c17171249b2b26c0a',
        'callbackURL': 'http://localhost:3000/auth/facebook/callback',
        'profileFields': ['emails', 'displayName']
    }
}
