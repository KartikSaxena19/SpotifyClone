console.log("mkc");

let currentSong=new Audio();        //we make this global variable because the song not play simultaneously 
let currFolder;
let songs;
async function getsongs(folder) {
    currFolder=folder
    let a = await fetch(`http://127.0.0.1:5500/${currFolder}/`);
    let response = await a.text();

    let div = document.createElement("div");

    div.innerHTML = response;
    let as = div.getElementsByTagName("a");

    songs = [];
    for (let index = 0; index < as.length; index++) {
        const element = as[index];
        if (element.href.endsWith(".mp3")) {
            songs.push(element.href.split(`/${currFolder}`)[1]);
        }
    }

    //Show all the song
    let songUL= document.querySelector(".songList").getElementsByTagName("ul")[0]
    songUL.innerHTML=""         //this black space is used to not append the song while changing the playlist
    for (const song of songs) {
        songUL.innerHTML=songUL.innerHTML+`<li>
                <div>
                ${song.replaceAll("%20", " ").replaceAll("/", " ")}</div>
                <div class="playnow justify-content align-content">
                  <span>Play</span>
                  <img src="img/play.svg" alt="" />
                </div>
              </li>`
    }

    //Play the clicked song
    Array.from(document.querySelector(".songList").getElementsByTagName("li")).forEach(e=>{
        e.addEventListener("click",element=>{
            playmusic(e.firstElementChild.innerHTML.trim())     //use trim because their is space in the starting
        })
        
    })
}

const playmusic = (track)=>{
    currentSong.src=`/${currFolder}/`+track
    currentSong.play()
    play.setAttribute("src", "img/pause.svg?"); 
    document.querySelector(".songinfo").innerHTML=track
    document.querySelector(".songtime").innerHTML="00:00 / 00:00"
}

function secondsToMinutesSeconds(seconds) {
    if (isNaN(seconds) || seconds < 0) {
        return "00:00";
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    const formattedMinutes = String(minutes).padStart(2, '0');
    const formattedSeconds = String(remainingSeconds).padStart(2, '0');

    return `${formattedMinutes}:${formattedSeconds}`;
}
async function main() {
    
    //Get song
    await getsongs("songs/Kshma");
    
    

    //Control the music
    play.addEventListener("click",()=>{
        if(currentSong.paused){
            currentSong.play()
            play.setAttribute("src", "img/pause.svg?");      
        }else{
            currentSong.pause()
            play.setAttribute("src", "img/play.svg?");
        }
    })

    //song time update function
    currentSong.addEventListener("timeupdate", () => {
        document.querySelector(".songtime").innerHTML = `${secondsToMinutesSeconds(currentSong.currentTime)} / ${secondsToMinutesSeconds(currentSong.duration)}`
        document.querySelector(".circle").style.left = (currentSong.currentTime / currentSong.duration) * 100 + "%";
    })

    //change time manually of song
    document.querySelector(".line").addEventListener("click", e => {
        let percent = (e.offsetX / e.target.getBoundingClientRect().width) * 100;
        document.querySelector(".circle").style.left = percent + "%";
        currentSong.currentTime = ((currentSong.duration) * percent) / 100
    })

    // Add an event listener to previous
    previous.addEventListener("click", () => {
        currentSong.pause()
        console.log("Previous clicked")
        console.log(currentSong.src);
        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index - 1) >= 0) {
            playmusic(songs[index - 1])
        }
    })

    //For next song
    next.addEventListener("click", () => {
        currentSong.pause()
        console.log("Next clicked")

        let index = songs.indexOf(currentSong.src.split("/").slice(-1)[0])
        if ((index + 1) < songs.length) {
            playmusic(songs[index + 1])
        }
    })

    //for hamburger 
    document.querySelector(".hamburger").addEventListener("click",() => {
      document.querySelector(".left").style.left="0"
    }
    )

    //for close
    document.querySelector(".close").addEventListener("click",() => {
      document.querySelector(".left").style.left="-120%"
    }
    )


    //Load the playlist
    Array.from(document.getElementsByClassName("card1")).forEach(e=>{
        e.addEventListener("click",async item=>{
            songs=await getsongs(`songs/${item.currentTarget.dataset.folder}`)
        })
    })
    
}

main();
