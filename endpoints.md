# Endpoint Design

## front page
- /
    - justs shows the front page('login', 'new user?')

- /login
    - sends to a login form page
    
- /newUser
    - sends to a new user form
    - /newUser/createUser/
        - post new user from form
        - success
            - /login
            - send to login form page
        - fail
            - post error message to screan