import React, {useState} from "react";
import Input_field from "./Input_field.tsx";
import username_img from '../img/username.png'
import password_img from '../img/lock.png'
import account_img from '../img/account.png'
import email_img from '../img/email.png'
import birth_img from '../img/birth.png'
import styles from './styles.module.css';
import { Link } from "react-router-dom";

const SignInForm = () => {

  const [input_data, set_input_data] = useState({
    Username:'',
    Password:'',
    Email:'',
    DoB:'',
  });
  const [message, setMessage] = useState('')

  const updateInput = (name: string, value: string) => {
    set_input_data({...input_data, [name]: value});
  }

  const toNext = () => {
    window.location.replace("/success");
  }

  const onClick = () => {
    fetch('http://localhost:5000/signup', {
      "method": "POST",
      "body": JSON.stringify(input_data),
      headers: {
        "Content-Type": "application/json",
      }
    })
    .then(response=>{
      console.log(response.status)
      if (response.status!==201){return response.json();}
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
    <Input_field name={"Email"} src={email_img} type={"email"} func={updateInput} />
    <div className={styles.dateInput}>
        <img src={birth_img}/>
        <input type='date' name="DoB" onChange={e=>{updateInput(e.target.name, e.target.value)}}/>
    </div>

    <div className={styles.link_area}>
      <a href="http://localhost:3000/">Log in</a>
      <a href="http://localhost:3000/forgotPassword">Forgot password</a>
    </div>
    <div className={styles.login_background}><button onClick={onClick} className={styles.login_btn}>LOGIN</button></div>
  </div>;
}

export default SignInForm;