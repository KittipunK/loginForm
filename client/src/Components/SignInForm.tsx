import React, {useState} from "react";
import Input_field from "./Input_field.tsx";
import username_img from '../img/username.png'
import password_img from '../img/lock.png'
import account_img from '../img/account.png'
import styles from './styles.module.css';


const SignInForm = () => {

  const [input_data, set_input_data] = useState({
    Username:'',
    Password:''
  });
  const [message, setMessage] = useState('')

  const updateInput = (name, value) => {
    set_input_data({...input_data, [name]: value});
  }

  const toNext = () => {
    window.location.replace("/success");
  }

  const onClick = () => {
    fetch('http://localhost:5000/signin', {
      "method": "POST",
      "body": JSON.stringify(input_data),
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response=>{
      console.log(response.status)
      if (response.status!==200){return response.json();}
      else{ toNext() }
    })
    .then(function(data){
      setMessage(data.message);
    })
    .catch(err=>{
      console.log(err);
    })
  }

  return <div className={styles.input_container}>
    <img className={styles.account_logo} src={account_img} alt="" />
    {(message!==null)&&<p className={styles.message}>{message}</p>}
    <Input_field name={"Username"} src={username_img} type={"text"} func={updateInput} />
    <Input_field name={"Password"} src={password_img} type={"password"} func={updateInput} />
    <div className={styles.link_area}>
      <a href="http://localhost:3000/signup">Register</a>
      <a href="http://localhost:3000/forgotPassword">Forgot password</a>
    </div>
    <div className={styles.login_background}><button onClick={onClick} className={styles.login_btn}>LOGIN</button></div>
  </div>;
}

export default SignInForm;