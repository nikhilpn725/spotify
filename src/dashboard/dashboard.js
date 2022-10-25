import { fetchRequests } from "../api"
import { ENDPOINT, logOut, SECTIONTYPE } from "../common"

const audio = new Audio()
const volume = document.querySelector("#volume-button")
const playButton = document.querySelector("#play")
const totalSongDuration = document.querySelector("#total-song-duration")
const songDurationCompleted = document.querySelector("#song-duration-completed")
const songProgress = document.querySelector("#progress")

const onProfileClick = (event)=>{
    event.stopPropagation();
    const profileMenu = document.querySelector("#profile-menu")
    profileMenu.classList.toggle("hidden")
    if(!profileMenu.classList.contains("hidden")){
        profileMenu.querySelector("#logout").addEventListener("click", logOut)
    }
    
}


const loadUserProfile = async ()=>{
    const defaultImage = document.querySelector("#default-image")
    const defaultName = document.querySelector("#namee")
    const profileButton = document.querySelector("#user-profile-btn")

    const {display_name: displayName, images} = await fetchRequests(ENDPOINT.userInfo)


    if(images?.length){
        defaultImage.classList.add("hidden")
    }else{
        defaultImage.classList.remove('hidden')
    }
    profileButton.addEventListener("click", onProfileClick)
    defaultName.textContent = displayName
}

const onPlayListClick = (event, id)=>{
    const section = {type: SECTIONTYPE.PLAYLIST, playlist: id}
    history.pushState(section, "",`playlist/${id}`)
    loadSections(section)

}

const loadPlaylist = async(endpoint, elementId)=>{
    const {playlists : {items}}= await fetchRequests(endpoint);
    const playlistItemsSection = document.getElementById(`${elementId}`)

    for (let{name, description, images, id} of items){
        let img = images[0]
        let imgUrl = img.url;
       
        
        const playlistItem = document.createElement("section")
        playlistItem.className ="bg-black-secondary rounded border-solid p-4 hover:cursor-pointer hover:bg-light-black"
        playlistItem.id = id;
        playlistItem.setAttribute("data-type", "playlist");
        playlistItem.addEventListener("click",(event)=> onPlayListClick(event, id))
        playlistItem.innerHTML = `<img src=${imgUrl} alt="img class="rounded mb-2 object-contain shadow"/>
        <h2 class="text-base font-semibold mb-4 truncate">${name}</h2>
        <h3 class="text-sm text-secondary line-clamp-2">${description}</h3>`
        document.getElementById(`${elementId}`).appendChild(playlistItem)
    }
}

const loadPlaylists =()=>{
    loadPlaylist(ENDPOINT.featuredPlaylist, "featured-playlist-items")
    loadPlaylist(ENDPOINT.toplists, "top-playlist-items")

}

const fillContentForDashboard = ()=>{
    const pageContent = document.getElementById("page-content");
    const playlistMap = new Map([["featured", "featured-playlist-items"],["top playlists", "top-playlist-items"]])
    let innerHTML = "";
    for (let[type, id] of playlistMap){
        innerHTML +=
        `<article class="p-4">
        <h1 class="mb-4 text-2xl font-bold capitalize">${type}</h1>
        <section
          class="featured-songs grid grid-cols-auto-fill-cards gap-4"
          id="${id}"
        ></section>
        </article>`
    }
    pageContent.innerHTML = innerHTML
}
const formatTime = (duration_ms)=>{
    const min = Math.floor(duration_ms/60000);
    const sec = ((duration_ms % 6000)/1000).toFixed(0)
    const formattedTime = sec===60?
    min +1 + ":00" : min+ ":" + (sec < 10? "0":"00") + sec;
    return formattedTime
}

const onTrackSelection = (id, event)=>{
    document.querySelectorAll("#tracks .track").forEach(trackItem=>{
        if(trackItem.id === id){
            trackItem.classList.add("bg-gray", "selected")
        }else{
            trackItem.classList.remove("bg-gray", "selected");
        }
    })

}
// const timeline = document.querySelector("#")
//dd



const onPlayTrack = (event,{image, artistsNames, name, duration_ms, previewUrl, id})=>{
    console.log("check",image, artistsNames, name, duration_ms, previewUrl, id);
    // <img class="h-12 w-12" src="https://www.logo.wine/a/logo/Ethereum/Ethereum-Icon-Purple-Logo.wine.svg" alt="img" id="now-playing-img">
    //         <section class="flex flex-col justify-center">
    //           <h2 id="now-playing-song" class="text-sm font-semibold text-primary">song title</h2>
    //           <p class="text-xs" id="now-playing-artist">song artists</p>

    //         </section>
    const nowPlayingSong = document.querySelector("#now-playing-song")
    const nowPlayingImg = document.querySelector("#now-playing-img")
    const nowPlayingArtist = document.querySelector("#now-playing-artist")
    nowPlayingSong.textContent = name
    nowPlayingArtist.textContent = artistsNames
    nowPlayingImg.src = image.url
    console.log(previewUrl);

    audio.src = previewUrl;
    audio.play()
}

const loadPlaylistsTracks = ({tracks})=>{
    // console.log("tracks", tracks);
    const trackSelection = document.querySelector("#tracks") 
    let trackNo = 1
    for (let trackItem of tracks.items){
        let {id, artists, name, album, duration_ms, preview_url: previewUrl} = trackItem.track;
        let track = document.createElement("section")
        track.id = id
        track.className = "track p-1 grid grid-cols-[50px_1fr_1fr_50px] items-center justify-items-start gap-4 rounded-md text-secondary hover:bg-light-black"
        let image = album.images.find(img=> img.height === 64)
        let artistsNames = Array.from(artists, artist => artist.name).join(", ")

        track.innerHTML = `
            <p class="relative w-full flex items-center justify-center justify-self-center"><span class="track-no" >${trackNo++}</span></p>
            <section class="grid grid-cols-[auto_1fr] place-items-center gap-2">
              <img class="h-10 w-10" src="${image.url}" alt="${name}" />
              <article class="flex flex-col gap-1 justify-center">
                <h2 class="text-base text-primary line-clamp-1 ">${name}</h2>
                <p class="text-xs">${artistsNames}</p>
              </article>
            </section>
            <p class="text-sm">${album.name}</p>
            <p class="text-sm">${formatTime(duration_ms)}</p>`


        track.addEventListener("click", (event)=>onTrackSelection(id, event))

        const playbuttton = document.createElement("button")
        playbuttton.id = `play-track${id}`
        playbuttton.className = `play w-full absolute left-0 text-lg invisible z-5`
        playbuttton.textContent = "▶"
        playbuttton.addEventListener("click", (event)=>onPlayTrack(event, {image, artistsNames, name, duration_ms, previewUrl, id}))

        track.querySelector("p").appendChild(playbuttton)
        trackSelection.appendChild(track)
    }
}

const fillContentForPlaylist = async(playlistId)=>{
    // console.log(playlistId.playlist);
    const playlist = await fetchRequests(`${ENDPOINT.playlist}/${playlistId.playlist}`)
    let pageContent = document.getElementById("page-content");
    pageContent.innerHTML =`
    <header id="playlist-header" class="mx-8  py-4 z-10 border-secondary border-b-[0.5px] ">
          <nav>
            <ul class="grid grid-cols-[50px_1fr_1fr_50px] gap-4 text-secondary ">
              <li class="justify-self-center" >#</li>
              <li>Title</li>
              <li>Album</li>
              <li>🕔</li>
            </ul>
          </nav>
        </header>
        <section class="px-8 mt-4 text-secondary " id="tracks">
        </section`


    loadPlaylistsTracks(playlist)

}


const onContentScroll = (event)=>{
    const {scrollTop} = event.target;
    const header = document.querySelector(".header");

    if(scrollTop>=header.offsetHeight){
        console.log("true");
        header.classList.add("sticky", "top-0", "bg-black")
        header.classList.remove("bg-transparent")
    }else{
        console.log("false");
        header.classList.remove("sticky", "top-0", "bg-black-secondary")
        header.classList.add("bg-transparent")
    }

    if(history.state.type === SECTIONTYPE.PLAYLIST){
        const coverElement = document.querySelector("#cover-content");
        const playlistHeader = document.querySelector("#playlist-header")

        if(scrollTop>= (coverElement.offsetHeight -header.offsetHeight)){
            playlistHeader.classList.add("sticky", "bg-black-secondary", "px-8")
            playlistHeader.classList.remove("mx-8")
            playlistHeader.style.top = `${header.offsetHeight}px`;

        }else{
            playlistHeader.classList.remove("sticky", "bg-black-secondary", "px-8")
            playlistHeader.classList.add("mx-8")
            playlistHeader.style.top = `revert`;

        }
    }

} 

const loadSections = (section)=>{

    if(section.type === SECTIONTYPE.DASHBOARD){
        fillContentForDashboard()
        loadPlaylists()
    }else if(section.type === SECTIONTYPE.PLAYLIST) {
        const pageContent = document.querySelector("#page-content")
        pageContent.innerHTML = "playlist to be loaded"
        fillContentForPlaylist(section)
    }

    document.querySelector(".content").addEventListener("scroll" , onContentScroll)

}

document.addEventListener("DOMContentLoaded", ()=>{
    loadUserProfile()
    // const section = {type: SECTIONTYPE.DASHBOARD}
    const  section =  {type: SECTIONTYPE.PLAYLIST, playlist :"1dgDKBhoAceYRsjg440s5t?si=729cf433ab314d82"}
    // history.pushState(section, "","")
    history.pushState(section, "",`dashboard/playlist/${section.playlist}`)

    loadSections(section)
    fillContentForDashboard()
    loadPlaylists()

    document.addEventListener("click", ()=>{
        const profileMenu = document.querySelector("#profile-menu")
        if(!profileMenu.classList.contains("hidden")){
            profileMenu.classList.add("hidden")
        }
    })
    
    
    window.addEventListener("popstate", (event)=>{
        loadSections(event.state)
    })
 

})