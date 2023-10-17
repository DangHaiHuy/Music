const $=document.querySelector.bind(document)
const $$=document.querySelectorAll.bind(document)
const progress=$('#progress')
const app={
    currentIndex:0,
    isPlaying:false,
    songs:[
    {
        name:'Lần cuối',
        singer:'Ngọt',
        path:'./assets/music/Lancuoi.mp3',
        image:'./assets/image/Lancuoi.jpg',
        
    },
    {
        name:'Liệu giờ - Beat',
        singer:'2T x Venn',
        path:"./assets/music/LieugioBeat.mp3",
        image:'./assets/image/LieugioBeat.jpg'
    }
    ],
    render:function(){
        var htmls=this.songs.map(function(song){
            return `
            <div class="song">
                <div class="thumb" style="background-image: url(${song.image});">
                </div>
                <div class="body">
                    <h3 class="title">${song.name}</h3>
                    <p class="author">${song.singer}</p>
                </div>
                <div class="option">
                    <i class="fas fa-ellipsis-h"></i>
                </div>
            </div>`
        })
        $('.playlist').innerHTML=htmls.join('')
    },
    handleEvents:function(){
        const cd=$('.cd')
        const cdwidth=cd.offsetWidth;
        const audio=$('#audio')
        const toggle=$('.btn-toggle-play')
        const player=$('.player')
        const playerplaying=$('.player.playing')
        const cdimage=$('.cd-thumb')
        const cdanimate=cdimage.animate([{transform:'rotate(360deg)'}],{
            duration:10000,
            iterations:Infinity
        })
        cdanimate.pause()
        
        document.onscroll=function(){
            const decrease=window.scrollY||document.documentElement.scrollTop
            const decreasewidth=cdwidth-decrease;
            //decreasewidth không theo kịp tốc độ trượt, nên đôi khi kéo 200px về 31px rồi nhảy
            //thẳng qua số âm, khi đấy cd sẽ lấy phần dương chứ không lấy phần âm, vì vậy cần thêm điều kiện để fix
            cd.style.width=decreasewidth>0?decreasewidth+'px':0
            cd.style.opacity=decreasewidth/cdwidth
        }
        toggle.addEventListener('click',function(){
            if(app.isPlaying==false){
                audio.play()
            }
            else {
                audio.pause()
            }      
        })
        audio.onplay=function(){
            player.classList.add('playing')
            app.isPlaying=true
            cdanimate.play()
        }
        audio.onpause=function(){
            player.classList.remove('playing')
            app.isPlaying=false
            cdanimate.pause()
        }
        /*không sử dụng ontimeupdate bởi khi tua trên thanh progress, sự kiện onchange kết thúc khi ấn chuột và thả chuột
        , khi ấy nếu ấn chậm (tức là mới nhấn chứ chưa thả ) thì onchange chưa thực hiện kịp thì ontimeupdate đã update lại ( bằng cách di chuyển lại thanh tua progress )*/
        
        audio.ontimeupdate=function(){
            if(this.duration){
                let timepercent=Math.floor(this.currentTime / this.duration * 100)
                progress.value=timepercent
            }
        }  
        progress.oninput=function(e){
            let seekTime=audio.duration/100*e.target.value;
            audio.currentTime=seekTime         
        }
    },
    findCurrentSong:function(){
        Object.defineProperty(this,'currentSong',{
            get:function(){
                return this.songs[this.currentIndex]
            }//value: this.songs[this.currentIndex]
        })
    },
    loadCurrentSong(){
        const heading=$('.dashboard h2')
        const cdimage=$('.cd-thumb')
        const audio=$('#audio')
        heading.innerHTML=this.currentSong.name
        cdimage.style.backgroundImage=`url(${this.currentSong.image})`
        audio.src=this.currentSong.path
    },
    loadTime(){
        const audio=$('#audio')
        var htmlduration=''
        audio.onloadedmetadata=function(){
            const minutes=Math.floor(audio.duration / 60)
            const seconds=(audio.duration / 60 - minutes)*60
            console.log(minutes,seconds)
            htmlduration=minutes + ':' + seconds
            console.log(htmlduration)
        }
        
    },
    start:function(){
        this.render()
        this.handleEvents()
        this.findCurrentSong()
        this.loadCurrentSong()
        this.loadTime()
    }
}
app.start()