/*
    auth middleware
        - cookie? token?
            false:
                401
            true:
                strictly don't decode
                --> verify jwt
                    --> err
                        --> 401
                    --> success
                        --> data
                        --> req.user = data
                    
*/
