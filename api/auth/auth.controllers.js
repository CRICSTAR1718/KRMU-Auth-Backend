/*
    registration controller
        check if email already exists
            if email exists:
                409, {success: false, message: 'User already exists!'}
            else:
                hash the password - bcrypt - rounds (10 - 2^10)
                create user in database (but allocate uuid on server)
                201, {success: true, message: '...'}
*/

/*
    login controller
        check if email already exists
            if email does not exist:
                404, {success: false, message: 'User not found!'}
            else:
                match the password
                    if password does not match:
                        401, {success: false, message: 'Incorrect password!'}
                    else:
                        create token
                        send it in cookie
                            http-only: true
                            secure: true
                            same-site: strict / lax
                        200, {success: true, message: '...'}
*/

/*
    logout controller
        remove auth cookie
            http-only: true
            secure: true
            same-site: strict / lax
*/
