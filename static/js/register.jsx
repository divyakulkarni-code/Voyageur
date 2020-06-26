class Register extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
        <div className = "base-container" >
            <div className = "header">Register</div>
            <form action="/register" method="POST">
            <div className = "content">
                {/* <div className = "image">
                    <img src = {loginImg} />
                </div> */}
                
                <div className = "form">
                    <div className = "form-group">
                        <label htmlFor="user_name">Username</label>
                        <input type = "text" name = "user_name" placeholder="User Name" ></input>
                    </div>
                    <div className = "form-group">
                        <label htmlFor="first_name">First Name</label>
                        <input type = "text" name = "first_name" placeholder="First Name" ></input>
                    </div>
                    <div className = "form-group">
                        <label htmlFor="last_name">Last Name</label>
                        <input type = "text" name = "last_name" placeholder="Last Name" ></input>
                    </div>
                    <div className = "form-group">
                        <label htmlFor="email">Email</label>
                        <input type = "text" name = "email" placeholder="Email" ></input>
                    </div>
                    <div className = "form-group">
                        <label htmlFor="password">Password</label>
                        <input type = "text" name = "password" placeholder="Password" ></input>
                    </div>
                </div>
            </div>
            <div className = "footer">
            <input type="submit" className = "btn btn-primary" value = 'Register'>
            </input>
            </div>
            </form>
            
        </div>
        );
    }
        
}

ReactDOM.render(<Register />, document.getElementById("app"));