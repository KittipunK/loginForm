import React, {useState} from "react";
import styles from './styles.module.css';
import Verify_img from '../img/verify.png'

const ForgotPasswordForm = () => {
  const [phrase, setPhrase] = useState(0);
  const [input_data, set_input_data] = useState({
    Email:'',
    Code:'',
    Password:'',
    RePassword:''
  });
  const [message, setMessage] = useState("");

  const updateInput = (name, value) => {
    set_input_data({...input_data, [name]: value});
  }

  const onSendCode = (e) =>{
    e.preventDefault();
    if(input_data.Email.length<1){
        setMessage("Please enter the correct email address");
    }else{
        setMessage("");
        fetch('http://localhost:5000/verifyEmail', {
            "method": "POST",
            "body": JSON.stringify({Email: input_data.Email}),
            headers: {
              "Content-Type": "application/json",
            }
          })
          .then(response=>{
            if(response.status===400) { 
                setMessage("Please enter the correct email address"); 
                return response.json();
            }else{
                setMessage("Your verification code has been sent.")
                return response.json();
            }
          })
          .then(function(data){
            
          })
          .catch(err=>{
            console.log(err);
          })
    }
  }

  const onSubmit = (e) =>{
    e.preventDefault();
    if(input_data.Email.length<1){
        setMessage("Please enter the correct email address.");
    }else{
        setMessage(null);
        fetch('http://localhost:5000/verifyCode', {
            "method": "POST",
            "body": JSON.stringify({Email: input_data.Email, Code: input_data.Code}),
            headers: {
              "Content-Type": "application/json",
            }
          })
          .then(response=>{
            if(response.status===200){
                setPhrase(1);
                return response.json();
            }else{
                setMessage("Something went wrong."); 
                return response.json();
            }
          })
          .then(function(data){
            
          })
          .catch(err=>{
            console.log(err);
          })
    }
  }

  const onPasswordChange = (e) => {
    e.preventDefault();
    if(input_data.Password.length < 1){
        setMessage("Please enter new password.");
    }else if(input_data.Password !== input_data.RePassword){
        setMessage("Password does not match.");
    }else{
        fetch('http://localhost:5000/passwordChange', {
            "method": "POST",
            "body": JSON.stringify({Email: input_data.Email, Code: input_data.Code,
                Password: input_data.Password
            }),
            headers: {
              "Content-Type": "application/json",
            }
          })
          .then(response=>{
            if(response.status===200){
                setMessage("Something went right."); 
                window.location.replace("http://localhost:3000/")
                return response.json();
            }else{
                setMessage("Something went wrong."); 
                return response.json();
            }
          })
          .then(function(data){
            
          })
          .catch(err=>{
            console.log(err);
          })
    }
  }

  return <div className={styles.input_container}>
    <img className={styles.account_logo} src={Verify_img} alt="" />
    {(phrase===0)
    ?/// VERIFY CODE
    <form onSubmit={onSubmit} className={styles.form}>
        <h1>EMAIL VERIFICATION</h1>
        <p className={styles.desc}>We will send you a verification code for password reseting</p>
        {(message!==null)&&<p className={styles.message}>{message}</p>}
        <p className={styles.label}>Enter email address</p>
        <div className={styles.split}>
            <input name="Email" onChange={e=>{updateInput(e.target.name,e.target.value)}} type="email" />
            <button onClick={onSendCode}>send code</button>
        </div>
        <p className={styles.label}>Enter code</p>
        <div className={styles.split}>
            <input name="Code" onChange={e=>{updateInput(e.target.name,e.target.value)}} type="text" />
            <button type="submit">submit</button>
        </div>
        <a href={"http://localhost:3000/"}>go back</a>
    </form>
    :/// PASSWORD CHANGE
    <form onSubmit={onPasswordChange} className={styles.form}>
        <h1>PASSWORD CHANGE</h1>
        <p className={styles.desc}>Verification Successfully</p>
        {(message!=="")&&<p className={styles.message}>{message}</p>}
        <p className={styles.label}>Enter new password</p>
        <input name="Password" onChange={e=>{updateInput(e.target.name,e.target.value)}} type="text" />
        <p className={styles.label}>Re-enter password</p>
        <input name="RePassword" onChange={e=>{updateInput(e.target.name,e.target.value)}} type="text" />
        <button type="submit">submit</button>
        <a href={"http://localhost:3000/"}>go back</a>
    </form>
    }
  </div>;
}

export default ForgotPasswordForm
