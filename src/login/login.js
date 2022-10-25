import { ACESSS_TOKEN, EXPIRES_IN, TOKEN_TYPE } from "../common"

const ClIENT_ID = import.meta.env.VITE_ClIENT_ID
const scopes = "user-top-read user-follow-read playlist-read-private user-library-read"
const REDIRECT_URI = import.meta.env.VITE_REDIRECT_URI

const APP_URL = import.meta.env.VITE_APP_URL
const ACCESS_TOKEN_KEY = "accessToken"

const authorizeUser = ()=>{
    console.log("called");
    const url = `https://accounts.spotify.com/authorize?client_id=${ClIENT_ID}&response_type=token&redirect_uri=${REDIRECT_URI}&scopes=${scopes}$show_dialog=true`
    window.open(url, "login", "width=800, height=600" )
}

document.addEventListener("DOMContentLoaded", ()=>{
    document.querySelector("#login-button").addEventListener("click", authorizeUser)

})

window.setItemsInLocalStorage = ({accessToken, tokenType, expiresIn})=>{
    localStorage.setItem(ACESSS_TOKEN, accessToken)
    localStorage.setItem(TOKEN_TYPE, tokenType)
    localStorage.setItem(EXPIRES_IN, (Date.now() + (expiresIn * 1000)))
    window.location.href= APP_URL

}

window.addEventListener("load", ()=>{
    const accessTokenL = localStorage.getItem(ACESSS_TOKEN)
    if (accessTokenL){
        window.location.href = APP_URL
    }

    if(window.opener !==null && !window.opener.closed){
        window.focus();
        if(window.location.href.includes("error")){
            window.close();
        }
    }
    const {hash} =window.location;
    const searchParams = new URLSearchParams(hash)

    const accessToken = searchParams.get("#access_token")
    const tokenType = searchParams.get("token_type")
    const expiresIn = searchParams.get("expires_in")
    console.log(accessToken);
    if (accessToken){
        window.close();
        window.opener.setItemsInLocalStorage({accessToken,tokenType,expiresIn})
    }
    else{
        window.close()
    }


})