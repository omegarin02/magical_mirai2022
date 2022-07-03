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
    a.appendChild(document.createTextNode("⏸️"));
    play_flag = true;  
  },

  /* 楽曲の再生が止まったら呼ばれる */
  onPause() {
    const a = document.querySelector("#control > a#play");
    while (a.firstChild) a.removeChild(a.firstChild);
    a.appendChild(document.createTextNode("▶️"));
    play_flag = false;
  },
  onStop: () => {
    console.log("player.onStop");
    //再生を停止したら、歌詞のインデックスをリセットする
    lyrics_id = 0;
    start_latest = 0;
  },
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

    // 再生を停止したら画面表示をリセットする
    //bar.className = "";
    //resetChars();
  }
  return false;
});






let miku,
    audience,
    stage;

let screan_width = 980;
let screan_height = 650;
let comment_form_width = 300;
let comment_form_height = screan_height;
let comment_buff = 20;
let comment_text;
let show_comments_list = [];
let show_comments;
let font_size = 12;
let time_span = 0;
let button = document.getElementById("send_button");
let comment = document.getElementById("comment_box");
let frame_num = 0;
let sec_per_frame = 1000/60; 
let spend_time = 0;
let kubun = 0;
let jump_flag = false;
//ミクの初期座標と移動先の初期座標
const center_x = 475; 
const center_y = 425;
const left_x = 275;
const left_y = 375;
const right_x = 775;
const right_y = 375;
const back_x = 475;
const back_y = 250;
//audienceの初期座標
const L_audience_x = 237 ;
const R_audience_x = 740 ;
const audience_y = 575 ;
//let comment_show_width = 300 - comment_buff*2;
//let comment_show_htight = comment_form_height - comment_buff*2;
const miku_data_list = annotation_dic["miku"];
const positive_word_list = annotation_dic["positive"];
const negative_word_list = annotation_dic["negative"];

//let ai_model;

function preload() {
  miku_img = loadImage('./images/sample_miku.png');
  audience_img = loadImage('./images/audience.png');
  stage_img = loadImage('./images/sample_stage.png');
  monitor_img = loadImage('./images/monitor.png')
  button.setAttribute('onclick', 'send_comment()');
  //ai_model = tf.loadModel('./data/model.json');
}

function setup() {
  //canvas の設定
  let canvas = createCanvas(screan_width+comment_form_width, screan_height, P2D);
  canvas.parent('canvas');
  //stageのsprを作る
  stage_img.resize(screan_width,screan_height);
  stage_spr = createSprite(screan_width/2,screan_height/2);
  stage_spr.addImage(stage_img,screan_width/2,0);
  //観客のsprを作る
//  audience_img.resize(screan_width/2,0);
  audience_spr_L = createSprite(L_audience_x,audience_y);
  audience_spr_L.addImage(audience_img); 
//  audience_spr_L.scale = 0.000001;//1.5
  audience_spr_R = createSprite(R_audience_x,audience_y);
  audience_spr_R.addImage(audience_img); 
//  audience_spr_R.scale = 0.000001;
  //ミクのsprを作る
  miku_spr = createSprite(center_x,center_y);
  miku_spr.addImage(miku_img);
  //monitorのsprを作る
  monitor_spr_L = createSprite(225,138)
  monitor_spr_L.addImage(monitor_img)
  monitor_spr_R = createSprite(775,138)
  monitor_spr_R.addImage(monitor_img)
//  miku_spr.scale =0.000001;//0.3
  //コメント欄を作る
//  comment = createInput("");
//  comment.style()
//  button = createButton("コメント送信");
//  button.mousePressed(send_comment);
//	colorMode(HSB, 360, 100, 100, 100);
}

function check_annotation_miku(data){
  console.log("check_annotation_miku");
  for (let index = 0 ; index < miku_data_list.length; index++){
    if (data.indexOf(miku_data_list[index]) >= 0){
      return new Array(50).fill(1.0);
    }
  }
  return new Array(50).fill(0.0);
}
function check_annotation_negaposi(data){
  console.log("chekc_annotatoin_nagaposi");
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

function get_vectore(parsed_data){
    console.log('get_vector');
    if (parsed_data in w2v_dic){
        return w2v_dic[parsed_data];
    }else{
        console.log('no data in w2v');
        return new Array(50).fill(0.0);
    }
}

async function predict_comment(data){
  console.log('parse')
  var parsed_vec = [];
  let builder = await kuromoji.builder({dicPath: DICT_PATH})
  builder.build((err, tokenizer)=>{
    console.log("read kuromoji");
    tokens = tokenizer.tokenize(data);// 解析データの取得
    console.log("get tokens");
    for (let index = 0 ; index < 18; index++){
    //await tokens.forEach((token)=>{// 解析結果を順番に取得する
      if(tokens.length > index){
        let token = tokens[index];
        console.log(token["surface_form"]);
        vector = get_vectore(token["surface_form"]);//形態素のベクトル化
        parsed_vec = parsed_vec.concat(vector);//ベクトルを追加する処理
        console.log(vector);
      }else{
        parsed_vec = parsed_vec.concat(Array(50).fill(0.0))
      }
    };

    console.log(tokens);
    vector = check_annotation_miku(data);//話題がミクであるか判定
    console.log(vector);
    parsed_vec = parsed_vec.concat(vector);
    vector = check_annotation_negaposi(data);//ネガポジにかかわるワードがあるか 
    console.log(vector);
    parsed_vec = parsed_vec.concat(vector);
    score = prediction([parsed_vec]);//ミクの感情を判定する処理
    //console.log(argMax(score));//.arraySync()
  });
}

function prediction(comment_vec){
  console.log("predict");
  tf.loadModel('data/model.json').then(model => {
    console.log('load model')
    console.log(tf.tensor2d(comment_vec));
    tf_vector = tf.tensor2d(comment_vec);
    //reshaped = tf_vector.reshape([null,1000])
    //console.log(reshaped)
    result = model.predict(tf_vector);
    console.log("check result")
//    result.array().then(array => console.log(array));
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
      console.log(max_index)
      });
  });
  //console.log(ai_model.predict(comment_vec));
}

 
async function send_comment(event){ //コメント送信ボタンが押された時の時の処理
  comment_text = comment.value;//コメントを読み取る
  show_comments_list.push(comment_text);//コメント配列に追加する
  console.log(b);
  comment.value = "";
//  check_comment_length();
//  show_comments = show_comments_list.join("\n");
  console.log(show_comments);
  predict_comment(comment_text);//形態素解析解析してベクトルを返す処理
}


function draw() {
  const position = player.timer.position;//再生位置を取得
  background(0, 0, 0);
  
  //コメント欄の作成
  fill(128,128,128,100);
  rect(screan_width,0,comment_form_width-1,comment_form_height-1);
  fill(255,255,255);
  rect(screan_width+comment_buff,comment_buff,comment_form_width-comment_buff*2,comment_form_height-comment_buff*2);
  //コメント欄の作成終了
  //ミクさんの移動を決定する部分
  if (play_flag == false){
    miku_spr.position.x = center_x;
    miku_spr.position.y = center_y;
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
    }else if(27100 < position && position < 29100){//「へと」で伸びるミクさん
      if(kubun != 1){
        spend_time = 0;
        kubun = 1;
        miku_spr.position.y = center_y;
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;
      }
      miku_spr.position.y -= 0.5;
      audience_spr_L.position.y -= 0.25;
      audience_spr_R.position.y -= 0.25;
    }else if(29100 < position && position < 36000){//間奏1
      if(kubun != 2){
        spend_time = 0;   
        kubun = 2;
        miku_spr.position.y = center_y;
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;
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
      }else if(spend_time >= 410){
        miku_spr.position.y -= 10;
        audience_spr_L.position.y -= 5;
        audience_spr_R.position.y -= 5;
        jump_flag = true;
      }
    }else if(36000 < position && position < 39000){//間奏2
      if(kubun != 3){
        spend_time = 0;
        kubun = 3;
        miku_spr.position.y = center_y;
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;
      }//1ko 0.125
      if (spend_time < 125){
        miku_spr.position.y -= 1;
      }else if(spend_time < 250 ){
        miku_spr.position.y += 1;
      }
      if(spend_time > 250){
        spend_time = 0;
        jump_flag = false
      }
      if(frame_num % 3 == 0){
        spend_time += sec_per_frame*3;
      }
    }else if (39000 < position && position < 60000){//Aメロ
      if(kubun != 4){
        kubun = 4;
        miku_spr.position.y = back_y
        audience_spr_L.position.y = audience_y;
        audience_spr_R.position.y = audience_y;
        jump_flag = false;
      }
      if((position > 39000 && position < 44400) || (position > 52500 && position < 55200 )){//back
        if(kubun != 4.1){
          kubun = 4.1;
          miku_spr.position.x = back_x;
          miku_spr.position.y = back_y; 
          console.log("back")
        }
      }else if((position > 44400 && position < 49600) || (position > 55200 && position < 57000)){//left
        if(kubun != 4.2){
          kubun = 4.2;
          miku_spr.position.x = left_x;
          miku_spr.position.y = left_y;
          console.log("left")
        }
      }else if((position > 49600 && position < 50600) || (position > 57000 && position < 60000)){//center
        if(kubun != 4.3){
          kubun = 4.3;
          miku_spr.position.x = center_x;
          miku_spr.position.y = center_y;
          console.log("center")
        }
      }else if(position > 50600 && position<52500){//right
        if(kubun != 4.4){
          kubun = 4.4;
          miku_spr.position.x = right_x;
          miku_spr.position.y = right_y;
          console.log("right")
          console.log(kubun)
        }
      }
      if (spend_time < 125){
        miku_spr.position.y -= 1;
      }else if(spend_time < 250 ){
        miku_spr.position.y += 1;
      }
      if(spend_time > 250){
        spend_time = 0;
      }
      if(frame_num % 3 == 0){
        spend_time += sec_per_frame*3;
      }
    }


















    //歌詞に関する処理
    if(start_latest == 0){
      lyrics = player.video.getChar(lyrics_id);
      start_latest = lyrics.startTime;
      lyrics_id += 1;
      //console.log(lyrics.text)
      //console.log(start_latest)
    }else if(start_latest < position - 100){
      lyrics = player.video.getChar(lyrics_id);
      if(lyrics !== null){
        start_latest = lyrics.startTime;
        lyrics_id += 1;
        //console.log(lyrics.text)
        //console.log(start_latest)
      }
    }
  }
  drawSprites();//イラスト全て描画
//  textAlign(TOP);
//  textWrap(CHAR)
  //コメント描画
  textSize(font_size);
  fill(255,0,0);
  text(show_comments_list.join(),screan_width+comment_buff,comment_buff+font_size,comment_form_width-comment_buff*2,comment_form_height-comment_buff*2);

  //textSize(50);
  //text("これはテストです",100,100)
  

  //image(miku, 10, 10);
  //再生されていたら、歌詞情報を取ってくる
  if(play_flag){
   //let lirics = player.video.findChar(position - 100, { loose: true });
    //console.log(lirics);
  }
  //デバッグ用のグリッド線描画
  stroke(255,0,0)
  for (let i = 50; i < screan_width; i=i+50){
      line(i,0,i,screan_height)
  }
  for (let i = 50; i< screan_height; i=i+50){
      line(0,i,screan_width,i)
  }
  frame_num++;
  if(frame_num >= 60){
    frame_num = 0;
  }
}
