import './style.css'

const APP_URL = import.meta.env.VITE_APP_HOME


document.addEventListener("DOMContentLoaded", ()=>{
  if (localStorage.getItem("accessToken")){
    window.location.href=`${APP_URL}dashbord//dashboard.html`
  }else{
    window.location.href=`${APP_URL}login/login.html`
  }
})
