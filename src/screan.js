const { Player } = TextAliveApp;
const DICT_PATH = "./dict"
// プレイヤーの初期化 / Initialize TextAlive Player
const player = new Player({
  // トークンは https://developer.textalive.jp/profile で取得したものを使う
  app: { token: "8KBfjCmqKXJE1Kut" },
  mediaElement: document.querySelector("#media"),
});

const overlay = document.querySelector("#overlay");
const bar = document.querySelector("#bar");
const textContainer = document.querySelector("#text");
const seekbar = document.querySelector("#seekbar");
const paintedSeekbar = seekbar.querySelector("div");
let b, c;
let play_flag = false;
let lyrics_id = 0;
let start_latest = 0;
let monitor_start_time = 0;
let timing_id = 0;
let monitor_timing_id=0;
let miku_position = 1;
player.addListener({
  /* APIの準備ができたら呼ばれる */
  onAppReady(app) {
    if (app.managed) {
      document.querySelector("#control").className = "disabled";
    }
    if (!app.songUrl) {
      document.querySelector("#media").className = "disabled";

      // Loading Memories / せきこみごはん feat. 初音ミク
      player.createFromSongUrl("https://piapro.jp/t/RoPB/20220122172830");
    }
  },

  /* 楽曲が変わったら呼ばれる */
  //onAppMediaChange() {
    // 画面表示をリセット
  //  overlay.className = "";
  //  bar.className = "";
  //  resetChars();
  //},

  /* 楽曲情報が取れたら呼ばれる */
  onVideoReady(video) {
    // 楽曲情報を表示
    //document.querySelector("#artist span").textContent =player.data.song.artist.name;
    //document.querySelector("#song span").textContent = player.data.song.name;

    // 最後に表示した文字の情報をリセット
    c = null;
  },

  /* 再生コントロールができるようになったら呼ばれる */
  onTimerReady() {
    //overlay.className = "disabled";
    document.querySelector("#control > a#play").className = "";
    document.querySelector("#control > a#stop").className = "";
  },


  /* 楽曲の再生が始まったら呼ばれる */
  onPlay() {
    const a = document.querySelector("#control > a#play");
    while (a.firstChild) a.removeChild(a.firstChild);
    a.appendChild(document.createTextNode("⏸️Pause"));
    play_flag = true;  
  },

  /* 楽曲の再生が止まったら呼ばれる */
  onPause() {
    const a = document.querySelector("#control > a#play");
    while (a.firstChild) a.removeChild(a.firstChild);
    a.appendChild(document.createTextNode("▶️Start"));
    play_flag = false;
  },
  onStop: () => {
    console.log("player.onStop");
    //再生を停止したら、歌詞のインデックスをリセットする
    lyrics_id = 0;
    start_latest = 0;
    monitor_start_time = 0;
    timing_id = 0;
    monitor_timing_id=0;
  },
  onTimeUpdate(position) {
    // シークバーの表示を更新
    paintedSeekbar.style.width = `${
      parseInt((position * 1000) / player.video.duration) / 10
    }%`;
  }

});
//seekbar
seekbar.addEventListener("click", (e) => {
  e.preventDefault();
  if (player) {
    player.requestMediaSeek(
      (player.video.duration * e.offsetX) / seekbar.clientWidth
    );
  }
  lyrics = player.video.getChar(lyrics_id)
  if(lyrics.startTime < position){
    console.log('True')
    timing_id = 0;
    lyrics_id = 0;
  }
  
  return false;
});
/* 再生・一時停止ボタン */
document.querySelector("#control > a#play").addEventListener("click", (e) => {
  e.preventDefault();
  if (player) {
    if (player.isPlaying) {
      player.requestPause();
    } else {
      player.requestPlay();
    }
  }
  return false;
});

/* 停止ボタン */
document.querySelector("#control > a#stop").addEventListener("click", (e) => {
  e.preventDefault();
  if (player) {
    player.requestStop();
  }
  return false;
});




let miku,
    audience,
    stage;

let screan_width = 980;//
let screan_height = 650;//
let comment_form_width = 300;//コメント欄の横幅
let comment_form_height = screan_height;//コメント欄の立幅
let comment_buff = 20;//コメント欄のバッファ
let comment_text;//コメント欄に表示するためのコメント
let show_comments_list = [];
let show_comments;
let font_size = 20;//コメントの字の大きさ
let time_span = 0;//
let button = document.getElementById("send_button");//
let button2 = document.getElementById("send_button2")
let comment = document.getElementById("comment_box");//
let frame_num = 0;//
let sec_per_frame = 1000/60;
let spend_time = 0;//タイマー処理に使う変数
let random_time = 0;//前回ランダムに移動してから経過した時間を示す
let kubun = 0;//本アプリに対するモーション区分
let jump_flag = false;//ミクが飛ぶモーションをしているか判定するフラグ
let monitor_lyrics;//画面に表示する文字列の座標情報などが入った配列が格納されるもの
let monitor_timings;//monitor_lyricsに加え、表示終了時間を定義しているもの
let emotion_num_list = [];//感情推定結果と推定したときの曲の再生位置が格納されている変数
let do_emotion_flag = false;//感情表現を実行中であるかを示すflag
let emotion_start_time = -1;//感情表現を開始した時間を格納している変数
let emotion_num = -1;//感情ID（0:happy, 1:sad, 2:thanks(neutral))
let emotion_span = 5000;
let position;
let before_x = 0;
let before_y = 0;
let font;
//ミクの初期座標と移動先の初期座標
const center_x = 495; 
const center_y = 425;
const left_x = 275;
const left_y = 375;
const right_x = 775;
const right_y = 375;
const back_x = 494;
const back_y = 250;
//audienceの初期座標
const L_audience_x = 237 ;
const R_audience_x = 740 ;
const audience_y = 575 ;
const L_monitor_x = 225;
const R_monitor_x = 775;
const monitor_y = 140;
const monitor_miku_y = monitor_y + 15;
const L_monitor_miku_x = L_monitor_x-1;
const R_monitor_miku_x = R_monitor_x-1;
const max_length = (comment_form_width-comment_buff*2)/font_size;
//let comment_show_width = 300 - comment_buff*2;
//let comment_show_htight = comment_form_height - comment_buff*2;
const miku_data_list = annotation_dic["miku"];
const positive_word_list = annotation_dic["positive"];
const negative_word_list = annotation_dic["negative"];

//let ai_model;

function preload() {
  miku_img = loadImage('./images/miku_normal.png');
  miku_happy_img = loadImage('./images/miku_happy.png');
  miku_sad_img = loadImage('./images/miku_sad_v2.png');
  miku_thanks_img = loadImage('./images/miku_thanks.png');
  miku_very_happy_img = loadImage('./images/miku_very_happy.png');
  audience_img = loadImage('./images/audience.png');
  stage_img = loadImage('./images/stage.png');
  monitor_img_L = loadImage('./images/monitor_v2.png');
  monitor_img_R = loadImage('./images/monitor_v2_R.png');
  button2.setAttribute('onclick','send_comment()')
  font = loadFont('font/KiwiMaru-Light.ttf')
}

function setup() {
  textFont(font)
  //canvas の設定
  let canvas = createCanvas(screan_width+comment_form_width, screan_height, P2D);
  canvas.parent('canvas');
  //stageのsprを作る
  stage_spr = createSprite(screan_width/2,screan_height/2);
  stage_spr.addImage(stage_img,screan_width/2,0);
  //観客のsprを作る
  audience_spr_L = createSprite(L_audience_x,audience_y);
  audience_spr_L.addImage(audience_img); 
  audience_spr_R = createSprite(R_audience_x,audience_y);
  audience_spr_R.addImage(audience_img); 
  //ミクのsprを作る
  miku_spr = createSprite(center_x,center_y);
  miku_spr.addImage('center_normal',miku_img);
  miku_spr.addImage('center_happy',miku_happy_img);
  miku_spr.addImage('center_sad',miku_sad_img);
  miku_spr.addImage('center_thanks',miku_thanks_img);
  miku_spr.addImage('center_very_happy',miku_very_happy_img);
  //monitorのsprを作る
  monitor_spr_L = createSprite(225,128);
  monitor_spr_L.addImage(monitor_img_L);
  monitor_spr_R = createSprite(775,128);
  monitor_spr_R.addImage(monitor_img_R);
  //モニター表示用のsprを作る
  zoom_stage_spr_L = createSprite(L_monitor_x-10,monitor_y);
  zoom_stage_spr_R = createSprite(R_monitor_x-10,monitor_y);
  zoom_stage_spr_L.scale = 0;
  zoom_stage_spr_R.scale = 0;

  //モニター表示用のミクを作る
  zoom_miku_spr_L = createSprite(L_monitor_miku_x,monitor_miku_y);
  zoom_miku_spr_L.addImage('center_normal',miku_img);
  zoom_miku_spr_L.addImage('center_happy',miku_happy_img);
  zoom_miku_spr_L.addImage('center_sad',miku_sad_img);
  zoom_miku_spr_L.addImage('center_thanks',miku_thanks_img);
  zoom_miku_spr_L.addImage('center_very_happy',miku_very_happy_img);

  zoom_miku_spr_R = createSprite(R_monitor_miku_x,monitor_miku_y);
  zoom_miku_spr_R.addImage('center_normal',miku_img);
  zoom_miku_spr_R.addImage('center_happy',miku_happy_img);
  zoom_miku_spr_R.addImage('center_sad',miku_sad_img);
  zoom_miku_spr_R.addImage('center_thanks',miku_thanks_img);
  zoom_miku_spr_R.addImage('center_very_happy',miku_very_happy_img);
  zoom_miku_spr_L.scale = 0;
  zoom_miku_spr_R.scale = 0;
}

function check_annotation_miku(data){
  for (let index = 0 ; index < miku_data_list.length; index++){
    if (data.indexOf(miku_data_list[index]) >= 0){
      return new Array(50).fill(1.0);
    }
  }
  return new Array(50).fill(0.0);
}
function check_annotation_negaposi(data){
  for (let index = 0; index < positive_word_list.length; index++){
    if (data.indexOf(positive_word_list[index]) >= 0 ){
      return new Array(50).fill(1.0);
    }
  }
  for (let index = 0; index < negative_word_list.length; index++){
    if (data.indexOf(negative_word_list[index])>=0 ){
      return new Array(50).fill(-1.0);
    }
  }
  return new Array(50).fill(0.0);
}

function get_vector(parsed_data){
    console.log('get_vector');
    if (parsed_data in w2v_dic){
        return w2v_dic[parsed_data];
    }else{
        console.log('no data in w2v');
        return new Array(50).fill(0.0);
    }
}

function predict_comment(data){
  console.log('parse')
  var parsed_vec = [];
  let builder = kuromoji.builder({dicPath: DICT_PATH})
  builder.build((err, tokenizer)=>{
    console.log("read kuromoji");
    tokens = tokenizer.tokenize(data);// 解析データの取得
    console.log("get tokens");
    for (let index = 0 ; index < 18; index++){
    //await tokens.forEach((token)=>{// 解析結果を順番に取得する
      if(tokens.length > index){
        let token = tokens[index];
        console.log(token["surface_form"]);
        vector = get_vector(token["surface_form"]);//形態素のベクトル化
        parsed_vec = parsed_vec.concat(vector);//ベクトルを追加する処理
        console.log(vector);
      }else{
        parsed_vec = parsed_vec.concat(Array(50).fill(0.0))
      }
    };

    vector = check_annotation_miku(data);//話題がミクであるか判定
    parsed_vec = parsed_vec.concat(vector);
    vector = check_annotation_negaposi(data);//ネガポジにかかわるワードがあるか 
    parsed_vec = parsed_vec.concat(vector);
    score = prediction([parsed_vec]);//ミクの感情を判定する処理
  });
}

function prediction(comment_vec){
  console.log("predict");
  tf.loadModel('data/model.json').then(model => {
    console.log('load model')
    console.log(tf.tensor2d(comment_vec));
    tf_vector = tf.tensor2d(comment_vec);
    result = model.predict(tf_vector);
    console.log("check result")
    result.data().then(data => { 
      console.log(data);
      max_index = 0;
      max_score = data[0];
      for (let index = 1 ; index<data.length ; index++){
        if(max_score < data[index]){
            max_score = data[index];
            max_index = index;
            }
        }
      emotion_num_list.push([position,max_index]);
      console.log(max_index)
      });
  });
}

 
function send_comment(event){ //コメント送信ボタンが押された時の時の処理
  comment_text = comment.value;//コメントを読み取る
  if(comment_text.length != 0){
    if(comment_text.length > max_length){
      let tmp_comment = comment_text;
      let loop_num = 0;
      while(max_length <= tmp_comment.length){
        //tmp_commentからmax_lengthだけ取り出す。
        show_comments_list.push(tmp_comment.substring(0,max_length-1));
        tmp_comment = tmp_comment.slice(max_length-1);
        //show_commnets_listのcomment_id番+loopに挿入する。
        loop_num ++;
      }
      console.log('check')
      console.log(tmp_comment)
      show_comments_list.push(tmp_comment);
    }else{
      show_comments_list.push(comment_text);//コメント配列に追加する
    }
    console.log(b);
    comment.value = "";
    predict_comment(comment_text);//形態素解析解析してベクトルを返す処理
  }
}

function reset_center(){
  miku_spr.position.x = center_x;
  miku_spr.position.y = center_y;
  miku_spr.rotation = 0 ;
  audience_spr_L.position.y = audience_y;
  audience_spr_R.position.y = audience_y;
  if(do_emotion_flag === false){
    miku_spr.changeImage('center_normal');
  }

}

function draw() {
  position = player.timer.position;//再生位置を取得
  background(0, 0, 0);
  //コメント欄の作成
  fill(128,128,128,100);
  rect(screan_width,0,comment_form_width-1,comment_form_height-1);
  fill(255,255,255);
  rect(screan_width+comment_buff,comment_buff,comment_form_width-comment_buff*2,comment_form_height-comment_buff*2);
  //コメント欄の作成終了
  //ミクさんの移動を決定する部分
  if (play_flag == false){
    ;
  }else{
    //ミクの動きに関する処理
    if( 2630 < position && position < 27100){//最初の部分
      if(frame_num % 3 == 0 ) {//3fに１回少し移動する
        miku_spr.position.y --;
        audience_spr_L.position.y -= 0.5;
        audience_spr_R.position.y -= 0.5;
        spend_time += sec_per_frame*3;
      }
      if(spend_time > 2100 ){
        miku_spr.position.y = center_y;
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;
        spend_time = 0;
      }
    }else if((27100 < position && position < 29100)||
             (106400 < position && position < 107400) ||
             (172830 < position && position < 173850) || 
             (194030 < position && position < 196500) || 
             (242650 < position && position < 244000)){//「へと」で伸びるミクさん
      if(kubun != 1){
        spend_time = 0;
        miku_spr.rotation = 0;
        kubun = 1;
        reset_center();
      }
      miku_spr.position.y -= 0.5;
      audience_spr_L.position.y -= 0.25;
      audience_spr_R.position.y -= 0.25;
    }else if((29100 < position && position < 36000) || 
            (96100 < position && position < 106400) || 
            (220500 < position && position < 228350) ||
            (231950 < position && position < 239100)){//間奏1
      if(kubun != 2){
        spend_time = 0;   
        kubun = 2;
        reset_center();
      }
      if(frame_num % 3 == 0){
         spend_time += sec_per_frame*3
      }
      if(spend_time >= 550){
        miku_spr.position.y = center_y;
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;
        jump_flag = false;
        spend_time = 0;
        if(do_emotion_flag === false){
          miku_spr.changeImage('center_normal');
        }
      }else if(spend_time >= 410){
        miku_spr.position.y -= 10;
        audience_spr_L.position.y -= 5;
        audience_spr_R.position.y -= 5;
        jump_flag = true;
        if(do_emotion_flag === false){
          miku_spr.changeImage('center_happy');
        }
      }
    }else if((36000 < position && position < 39000)||
             (170000 < position && position < 172000)){//間奏2
      if(kubun != 3){
        spend_time = 0;
        kubun = 3;
        reset_center();
      }
      if (spend_time < 125){
        miku_spr.position.y -= 1;
        audience_spr_L.position.y -= 0.2;
        audience_spr_R.position.y -= 0.2;
      }else if(spend_time < 250 ){
        miku_spr.position.y += 1;
        audience_spr_L.position.y += 0.2;
        audience_spr_R.position.y += 0.2;
      }
      if(spend_time > 250){
        spend_time = 0;
        jump_flag = false
      }
      if(frame_num % 3 == 0){
        spend_time += sec_per_frame*3;
      }
    }else if ((39000 < position && position < 60000 ) ||
              (74100 < position && position < 96100 ) || 
              (119700 < position && position < 130200) ||
              (140150 < position && position < 162200) ||
              (190500 < position && position < 193000) ||
              (211100 < position && position < 220500) || 
              (228300 < position && position < 231700) || 
              (239150 < position && position < 241550)) {//1番Aメロ、サビ、Cメロの一部
      if(kubun != 4){
        kubun = 4;
        reset_center()
        miku_spr.position.y = back_y
        spend_time = 0;
        miku_position = 1;
        jump_flag = false;
      }
      if((74100 < position && position < 96100) || 
         (119700 < position && position < 130200) || 
         (140150 < position && position < 162200)  || 
         (212100 < position && position < 220500)){
        if(random_time > 2000){
          miku_position = Math.floor(Math.random() * 4);
          random_time = 0;
        }
      }
      if((position > 39000 && position < 44400) ||
         (position > 52500 && position < 55200 )){//back
        miku_position = 0;
      }else if((position > 44400 && position < 49600) ||
               (position > 55200 && position < 57000) ){//left
        miku_position = 2;
      }else if((position > 49600 && position < 50600) || 
               (position > 57000 && position < 60000) || 
               (position > 167650 && position < 172000) || 
               (position > 190500 && position < 193000) ||
               (228300 < position && position < 231700) ||
               (239150 < position && position < 240450)){//center
        miku_position = 1;
      }else if(position > 50600 && position<52500){//right
        miku_position = 3;
      } 

     if(jump_flag === false){
       if(miku_position == 0 ){
          miku_spr.position.x = back_x;
          miku_spr.position.y = back_y; 
        }else if(miku_position == 2){
          miku_spr.position.x = left_x;
          miku_spr.position.y = left_y;
        }else if(miku_position == 1){
          miku_spr.position.x = center_x;
          miku_spr.position.y = center_y;
        }else if(miku_position == 3){
          miku_spr.position.x = right_x;
          miku_spr.position.y = right_y;
        }
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;
      }
      if (spend_time < 125){
        jump_flag = true;
        miku_spr.position.y -= 2;
        audience_spr_L.position.y -= 1;
        audience_spr_R.position.y -= 1;
      }else if(spend_time < 250 ){
        miku_spr.position.y += 2;
        audience_spr_L.position.y += 1;
        audience_spr_R.position.y += 1;
      }
      if(spend_time > 250){
        spend_time = 0;
        jump_flag = false;
        if(miku_spr.rotation == 0 || miku_spr.rotation == -15){
          miku_spr.rotation = 15;
        }else if(miku_spr.rotation == 15){
          miku_spr.rotation = -15;
        } 
      }
      if(frame_num % 3 == 0){
        spend_time += sec_per_frame*3;
        random_time += sec_per_frame*3;
      }
    }else if ((60000 < position && position < 68800) ||
              (130200 < position && position < 135600)){//Bメロ
      if(kubun!=5){
        kubun = 5;
        reset_center();
        spend_time = 0;
      }
      if(frame_num %  3 == 0){
        spend_time +=  sec_per_frame * 3;
     }
      if(spend_time >= 1000){
        miku_spr.position.x = center_x;
        miku_spr.position.y = center_y;
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;
        spend_time = 0;
      }else{
        miku_spr.position.y -= 1;
        audience_spr_L.position.y -= 0.5;
        audience_spr_R.position.y -= 0.5;
      }
  }else if( (68200 < position && position < 74000) || 
            (135600 < position && position < 136900) ||
            (138172 < position && position < 140100 ) || 
            (172080 < position && position < 172750) || 
            (241147 < position && position < 232600)) {//サビ前orセンターで静止
    if(kubun!=6){
      kubun = 6;
      reset_center();
    }
  }else if (109100 < position && position < 119700){//２番Aメロ
    if(kubun != 7){
      kubun=7;
      reset_center();
      miku_spr.position.x = back_x;
      miku_spr.position.y = back_y;
      spend_time = 0;
      miku_position = 1;
      jump_flag = false;
    }
    if(109100 < position && position < 112650){
      miku_position = 1;
    }else if(112650 < position && position < 114150){
      miku_position = 2;
    }else if(114150 < position && position < 119700){
      miku_position = 3; 
    }

    if(jump_flag === false){
      if(miku_position == 2){
        miku_spr.position.x = left_x;
        miku_spr.position.y = left_y;
      }else if(miku_position == 1){
        miku_spr.position.x = center_x;
        miku_spr.position.y = center_y;
      }else if(miku_position == 3){
        miku_spr.position.x = right_x;
        miku_spr.position.y = right_y;
      }
      audience_spr_L.position.y = audience_y;
      audience_spr_R.position.y = audience_y;

    } 
    miku_spr.position.y -= 0.5;
    audience_spr_L.position.y -= 0.5;
    audience_spr_R.position.y -= 0.5;
    if(spend_time < 400){
      jump_flag = true;
    }else{
      jump_flag = false;
      spend_time = 0;
      if(miku_spr.rotation == 0 || miku_spr.rotation == -15){
        miku_spr.rotation = 15;
      }else if(miku_spr.rotation == 15){
        miku_spr.rotation = -15
      }
    }
    if(frame_num % 3 == 0){
      spend_time += sec_per_frame*3;
    }
  }else if(137600 < position && position < 137800){
    if(kubun != 8){
      kubun=8;
      reset_center();
      if(do_emotion_flag === false){
        miku_spr.changeImage('center_very_happy');
      }
    }
    console.log
    miku_spr.position.x = center_x;
    miku_spr.position.y -= 10;
    audience_spr_L.position.y -= 1;
    audience_spr_R.position.y -= 1;
  }else if( (162200 < position && position < 164900) || 
            (167640 < position && position < 170000) ){//2番サビ「熱を帯びて」「キミに届け」
    if(kubun != 9){
      if(kubun != 10){
        miku_spr.position.x = center_x;
      }
      kubun = 9;
      miku_spr.rotation = 0;
      miku_spr.position.y = center_y;
      spend_time = 0;
      if(do_emotion_flag === false){
        miku_spr.changeImage('center_normal');
      }
    }
    if((position > 162200 && position < 163946) || 
       (position > 167640 && position < 170000)) {
      miku_spr.position.x -= 2;
      audience_spr_L.position.y -= 0.2;
      audience_spr_R.position.y -= 0.2;
    }else{
      if(spend_time == 0){
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;
      }
      if(frame_num % 3 == 0) {
        spend_time += sec_per_frame*3;
      }
      if(spend_time < 400){
        miku_spr.position.y -= 1;
        audience_spr_L.position.y -= 0.5;
        audience_spr_R.position.y -= 0.5;
        if(do_emotion_flag === false){
          miku_spr.changeImage('center_happy');
        }
      }else if (spend_time >= 400){
        miku_spr.position.y = center_y;
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;
        spend_time=0;
        if(do_emotion_flag === false){
          miku_spr.changeImage('center_normal');
        }
      }
    }
  
  }else if(164900 < position && position < 167600){//2番サビ「時をかけて」
    if(kubun != 10){
      kubun = 10;
      miku_spr.position.y = center_y;
      miku_spr.rotation = 0;
      spend_time = 0;
      audience_spr_L.position.y = audience_y;
      audience_spr_R.position.y = audience_y;
      if(do_emotion_flag === false){
        miku_spr.changeImage('center_normal');
      }
    }
    if(position < 166670){
      miku_spr.position.x += 4;
      audience_spr_L.position.y -= 0.2;
      audience_spr_R.position.y -= 0.2; 
    }else{
      if(spend_time == 0){
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y; 
      }
      if(frame_num % 3 == 0) {
        spend_time += sec_per_frame*3;
      }
      if(spend_time < 400){
        miku_spr.position.y -= 1;
        audience_spr_L.position.y -= 0.2;
        audience_spr_R.position.y -= 0.2;
        if(do_emotion_flag === false){
          miku_spr.changeImage('center_happy');
        }
      }else if (spend_time >= 400){
        miku_spr.position.y = center_y;
        spend_time=0;
        if(do_emotion_flag === false){
          miku_spr.changeImage('center_normal');
        }
      }
    }
  }else if(173900 < position && position < 181300){
    if(kubun != 11){
      kubun = 11;
      miku_spr.position.y = center_y;
      miku_spr.position.x = center_x;
      miku_spr.rotation = 0;
      audience_spr_L.position.y = audience_y;
      audience_spr_R.position.y = audience_y;
      spend_time = 0;
      if(do_emotion_flag === false){
        miku_spr.changeImage('center_normal');
      }
    }
    if(spend_time < 600){
      if(position < 178000){//x軸に関する制御
        miku_spr.position.x -= 1;
      }else{
        miku_spr.position.x += 2;
      }
      if(spend_time < 300){//y軸に関する制御
        miku_spr.position.y -= 0.5;
        audience_spr_L.position.y -= 0.5;
        audience_spr_R.position.y -= 0.5;
     //   if(do_emotion_flag === false){
     //     miku_spr.changeImage('center_happy');
     //   } 
      }else if(spend_time < 600){
        miku_spr.position.y += 0.5;
        audience_spr_L.position.y += 0.5;
        audience_spr_R.position.y += 0.5;
     //   if(do_emotion_flag === false){
     //     miku_spr.changeImage('center_normal');
     //   }
      }
    }else if(spend_time >= 600){
      spend_time = 0;
    }
    if(frame_num % 3 == 0){
      spend_time += sec_per_frame*3;
    }
  }else if(181331 < position && position < 183750){
    if(kubun != 12){
      kubun = 12;
      reset_center();
      spend_time = 0;
      if(do_emotion_flag === false){
        miku_spr.changeImage('center_normal');
      }
    }
    if(spend_time < 200){
      miku_spr.position.y -=2;
      audience_spr_L.position.y -= 0.5;
      audience_spr_R.position.y -= 0.5;
    }else if(spend_time < 400){
      miku_spr.position.y += 2;
      audience_spr_L.position.y += 0.5;
      audience_spr_R.position.y += 0.5;
    }else{
      spend_time = 0;
    }
    if(frame_num % 3 == 0){
      spend_time += sec_per_frame*3;
    }
  }else if (184000 < position && position < 190500){
    if(kubun != 13){
      kubun = 13;
      miku_spr.rotation = 0;
      spend_time = 0;
      jump_flag = false;
      if(do_emotion_flag === false){
        miku_spr.changeImage('center_normal');
      }
    }
    //x軸の移動のみ
    if((184000 < position && position < 184800  )){
      miku_spr.position.x -= 4;
      audience_spr_L.position.y -= 0.2;
      audience_spr_R.position.y -= 0.2;
    }else if(185300 < position  && position < 186100){
      if(jump_flag === true){
        //イラスト変更
        jump_flag = false;
        miku_spr.changeImage('center_normal');
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;

      }
      miku_spr.position.x += 4;
      audience_spr_L.position.y -= 0.2;
      audience_spr_R.position.y -= 0.2;
    }else if((185700 < position && position < 186150) ||
             (186700 < position && position < 186900) ||  
             (187540 < position && position < 188800)){
      if(jump_flag === true){
        //イラスト変更
        jump_flag = false;
        miku_spr.changeImage('center_normal');
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;
      }
    }

    //y軸のみの動き
    if((184800 < position && position < 185300) ||
        (186150 < position && position < 186700) || 
        (187100 < position && position < 187540)){
      if(jump_flag === false){
        miku_spr.changeImage('center_very_happy');
        jump_flag = true;
        spend_time = 0;
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;
        //イラスト変更
      } 
      if(spend_time < 250){
        miku_spr.position.y -= 2;
        audience_spr_L.position.y -= 0.5;
        audience_spr_R.position.y -= 0.5;
      }else if(spend_time < 500){
        miku_spr.position.y += 2;
        audience_spr_L.position.y += 0.5;
        audience_spr_R.position.y += 0.5;
      }
    }else if (188990 < position && position < 190500 ){
      miku_spr.position.y -= 1;
      audience_spr_L.position.y -= 0.1;
      audience_spr_R.position.y -= 0.1;
    }
    if(frame_num % 3 == 0){
      spend_time += sec_per_frame*3;
    }
  }else if(196800 < position && position < 206900){//ヒカリに包まれ…掛け替えのないMEMORY
    if(kubun != 14){
      kubun = 14;
      miku_spr.rotation = 0;
      reset_center();
      spend_time = 0;

    }
    if(spend_time < 600){
      if(position < 204410){//x軸に関する制御
        miku_spr.position.x -= 0.3;
      }else{
        miku_spr.position.x += 0;
      }
      if(spend_time < 500){//y軸に関する制御
        miku_spr.position.y -= 0.5;
        audience_spr_L.position.y -= 0.1;
        audience_spr_R.position.y -= 0.1;
      }else if(spend_time < 1000){
        miku_spr.position.y += 0.5;
        audience_spr_L.position.y += 0.2;
        audience_spr_R.position.y += 0.2;
      }
    }else if(spend_time >= 1000){
      spend_time = 0;
    }
    if(frame_num % 3 == 0){
      spend_time += sec_per_frame*3;
    }
  }else if(208460 < position && position < 210100){
    if(kubun != 15){
      kubun = 15;
      miku_spr.rotation = 0;
      audience_spr_L.position.y = audience_y;
      audience_spr_R.position.y = audience_y;
      jump_flag = false;
    }
    if(position < 210000){
      miku_spr.position.x -= 2
    }else{
      if(jump_flag === false){
        miku_spr.changeImage('center_very_happy');
      }
      miku_spr.position.x = center_x
      miku_spr.position.y = center_y - 5
      audience_spr_L.position.y = audience_y - 15;
      audience_spr_R.position.y = audience_y - 15 ;     
    }
  }else{
    if(kubun!= 99){
      kubun = 99
    }
    if(24265 < position && position > 241550){
      reset_center();
      miku_spr.rotation = 0;
    }
  }












  }
  drawSprites();//イラスト全て描画
  if(position > 1000 && do_emotion_flag === false){
    if(start_latest == 0){
      lyrics = player.video.getChar(lyrics_id);
      monitor_start_time = lyrics.startTime;
      monitor_timings = lyrics_timing[timing_id];
      monitor_lyrics = monitor_timings[1];
    }
    if(monitor_start_time - 100 < position && position < monitor_timings[0]){//指定した表示位置を超えたら表示する
      for (let id=0; id < monitor_lyrics.length; id++){
        lyrics = player.video.getChar(lyrics_id+id)
        if(position > lyrics.startTime - 100 && lyrics.startTime < monitor_timings[0]){
          //文字を追加で表示
          textSize(int(monitor_lyrics[id][0]*0.8));
          fill(monitor_lyrics[id][1],monitor_lyrics[id][2],monitor_lyrics[id][3]);
          stroke(115, 115, 255);
          strokeWeight(2);
          text(lyrics.text,monitor_lyrics[id][4],monitor_lyrics[id][5]);
          text(lyrics.text,monitor_lyrics[id][4]+545,monitor_lyrics[id][5]);
          id += monitor_lyrics[id][6];
        }
      }
    }else if(monitor_timings[0] < position){//表示終了時刻より時刻が過ぎた場合は、次の表示に移る
      if(timing_id + 1 < lyrics_timing.length){
        lyrics_id += monitor_lyrics.length;
        lyrics = player.video.getChar(lyrics_id);
        timing_id += 1;
      }
      monitor_timings = lyrics_timing[timing_id];
      monitor_lyrics = monitor_timings[1];
      monitor_start_time = lyrics.startTime;
    }
  }
  //コメント描画

  textSize(font_size);
  fill(255,0,0);
  stroke(127,191,255);
  strokeWeight(1);
  for (let comment_id=0;comment_id < show_comments_list.length;comment_id++){
    text(show_comments_list[comment_id],screan_width+comment_buff+font_size,comment_buff+font_size*comment_id,comment_form_width-comment_buff*2,comment_form_height-comment_buff*2);
  }
  if((emotion_num_list.length > 0) && (do_emotion_flag === false)){//感情判定された結果がある場合。
    console.log(emotion_num_list)
    emotion_start_time = emotion_num_list[0][0];
    emotion_num = emotion_num_list[0][1];
    do_emotion_flag = true;
    zoom_stage_spr_L.scale = 0.75;
    zoom_stage_spr_R.scale = 0.75;
    zoom_miku_spr_L.scale = 0.5;
    zoom_miku_spr_R.scale = 0.5; 
    before_y = miku_spr.position.y;
  }
  if((emotion_start_time + emotion_span > position) && do_emotion_flag === true){//１回だけイラストを切り替える
    do_emotion_flag = true;
    if (emotion_num == 0){//happy
      miku_spr.changeImage('center_happy');
      zoom_miku_spr_L.changeImage('center_happy');
      zoom_miku_spr_R.changeImage('center_happy');
    }else if(emotion_num == 1){//sad
      miku_spr.changeImage('center_sad');
      zoom_miku_spr_L.changeImage('center_sad');
      zoom_miku_spr_R.changeImage('center_sad');
    }else if(emotion_num == 2){//thanks
      miku_spr.changeImage('center_thanks');
      zoom_miku_spr_L.changeImage('center_thanks');
      zoom_miku_spr_R.changeImage('center_thanks');
    }
    //ちびミクの動き再現
    if(before_x != miku_spr.position.x){
      let zoom_stage_img = stage_img.get(miku_spr.position.x-75,miku_spr.position.y-133,250,200)
      zoom_stage_spr_L.addImage('zoom',zoom_stage_img);
      zoom_stage_spr_L.changeImage('zoom');
      zoom_stage_spr_R.addImage('zoom',zoom_stage_img);
      zoom_stage_spr_R.changeImage('zoom');
      before_x = miku_spr.position.x
      before_y = miku_spr.position.y
    }else{
      zoom_miku_spr_L.position.y = monitor_miku_y + (before_y - miku_spr.position.y)*-0.8;
      zoom_miku_spr_R.position.y = zoom_miku_spr_L.position.y;
    }

  }else if(emotion_start_time + emotion_span < position && do_emotion_flag === true){//表示時間が終わったとき
    do_emotion_flag = false;
    //リストの１つ目を破壊する
    emotion_num_list.shift();
    //元のスプライトに戻す
    miku_spr.changeImage('center_normal');
    //いったんちびミクを隠す
    zoom_stage_spr_L.scale = 0;
    zoom_stage_spr_R.scale = 0;
    zoom_miku_spr_L.scale = 0;
    zoom_miku_spr_R.scale = 0;
    zoom_miku_spr_L.position.y = monitor_miku_y;
    zoom_miku_spr_R.position.y = monitor_miku_y;
  }

  //デバッグ用のグリッド線描画
  if(false){
    stroke(255,0,0)
    for (let i = 50; i < screan_width; i=i+50){
        line(i,0,i,screan_height)
    }
    for (let i = 50; i< screan_height; i=i+50){
        line(0,i,screan_width,i)
    }
    textSize(20)
    fill(255,0,0)
    text(position,0,600);
  }
    console.log(kubun)
  
  frame_num++;
  if(frame_num >= 60){
    frame_num = 0;
  }
}
