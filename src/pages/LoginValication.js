function Validation(value){
    let error  = {}
    const email_pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const password_pattern = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;

    if (value.email === "") {
        error.email = "Name should note be empty"
    } else if(!email_pattern.test(value.email)){
        error.email = "Email Didn't match"
    }else{
        error.email = ""
    }

    if (value.password === "") {
        error.password = "Password should note be empty"
    } else if(!password_pattern.test(value.password)){
        error.password = "Password Didn't match"
    }else{
        error.password = ""
    }
}

export default Validation;