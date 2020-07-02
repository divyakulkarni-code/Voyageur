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
                <SignInUpNavbar/>
                
                <section className = "content-fluid">
                    <section className = "row justify-content-center">
                    <section className = "col-12 col-sm-6 col-md-3">
                    <form className="form-container" action="/handlelogin" method="POST">
                        <div className = "form">
                            <div className = "form-group">
                                <label htmlFor="user_name">Username</label>
                                <input type = "text" className="form-control" name = "user_name" placeholder="User Name"></input>
                            </div>
                            <div className = "form-group">
                                <label htmlFor="password">Password</label>
                                <input type = "password" className="form-control" name = "password" placeholder="Password" ></input>
                            </div>
            
                                <input type="submit" className = "btn btn-primary btn-block" value = 'Login'>
                                </input>

                                <a href="/register">
                                    Create Account
                                </a> 
                         
                        </div>
                        </form>
                        </section>
                    </section>
                </section>
                {/* <section className = "sign-up-content">
                    <section className = "row justify-content-center">
                    <section className = "col-12 col-sm-6 col-md-3"> 
                        <a href="/register">
                                Create Account
                        </a> 
                    </section>
                </section>
                </section> */}
            </div>
        );
    }
}


ReactDOM.render(<Login />, document.getElementById("app"));