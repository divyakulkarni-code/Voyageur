class Login extends React.Component {
    constructor(props){
        super(props);
    }

    handleRegister() {
        this.setState(state => ({
          isToggleOn: !state.isToggleOn
        }));
      }


    render() {
        return (
            <div className = "base-container">
                <div className = "header">Login</div>
                <form action="/handlelogin" method="POST">
                <div className = "content">
                    {/* { <div className = "image">
                        <img src = {loginImg} />
                    </div> } */}
                    <div className = "form">
                        <div className = "form-group">
                            <label htmlFor="user_name">Username</label>
                            <input type = "text" name = "user_name" placeholder="user_name" ></input>
                        </div>
                        <div className = "form-group">
                            <label htmlFor="password">Password</label>
                            <input type = "text" name = "password" placeholder="password" ></input>
                        </div>
                    </div>
                </div>
                <div className = "footer">
                    <input type="submit" className = "btn" value = 'Login'>
                    </input>
                    
                    <a href="/register">
                        Create Account
                    </a>

                </div>
                </form>
            </div>
        );
    }
}


ReactDOM.render(<Login />, document.getElementById("app"));