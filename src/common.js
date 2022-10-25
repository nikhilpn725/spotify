export const ACESSS_TOKEN = "ACCESS_TOKEN";
export const TOKEN_TYPE = "TOKEN_TYPE";
export const EXPIRES_IN = "EXPIRES_IN";

const APP_URL_LOGOUT = import.meta.env.VITE_APP_HOME


export const ENDPOINT = {
    userInfo: "me",
    featuredPlaylist : "browse/featured-playlists?limit=5",
    toplists : "browse/categories/toplists/playlists?limit=10",
    playlist : "playlists"
}

export const logOut = ()=>{
    localStorage.removeItem(ACESSS_TOKEN)
    localStorage.removeItem(EXPIRES_IN)
    localStorage.removeItem(TOKEN_TYPE)
    window.location.href= APP_URL_LOGOUT
}

export const SECTIONTYPE = {
    DASHBOARD : "DASHBOARD",
    PLAYLIST  : "PLAYLIST"
}