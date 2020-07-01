class Register extends React.Component {
    constructor(props){
        super(props);
    }

    render() {
        return (
        <div className = "base-container-register" >

        <section className = "content-fluid">
            <section className = "row justify-content-center">
                <section className = "col-12 col-sm-6 col-md-3">
                    <form className="form-container-register" action="/register" method="POST">
                    
                        <div className = "form">
                            <div className = "form-group">
                                <label htmlFor="user_name">Username</label>
                                <input type = "text" className="form-control" name = "user_name" placeholder="User Name" ></input>
                            </div>
                            <div className = "form-group">
                                <label htmlFor="first_name">First Name</label>
                                <input type = "text" className="form-control" name = "first_name" placeholder="First Name" ></input>
                            </div>
                            <div className = "form-group">
                                <label htmlFor="last_name">Last Name</label>
                                <input type = "text" className="form-control" name = "last_name" placeholder="Last Name" ></input>
                            </div>
                            <div className = "form-group">
                                <label htmlFor="email">Email</label>
                                <input type = "text" className="form-control" name = "email" placeholder="Email" ></input>
                            </div>
                            <div className = "form-group">
                                <label htmlFor="password">Password</label>
                                <input type = "text" className="form-control" name = "password" placeholder="Password" ></input>
                            </div>
                            <input type="submit" className = "btn btn-primary btn-block" value = 'Register'>
                            </input>
                        </div>
                    
                    </form>
                </section>
            </section>
        </section>
            
        </div>
        );
    }
        
}

ReactDOM.render(<Register />, document.getElementById("app"));