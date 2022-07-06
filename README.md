## 概要
本プログラムは、機械学習を用いて、ユーザが入力した言葉（自然言語）を解析し、  
その言葉がミクさんをどのような感情にさせるか、リアルタイムで反応を示すものを作成しました。  
※ここでは、私たち(本プログラム開発者)の脳内にあるライブ中のミクさんをイメージして作成しておりますので、人によっては感じ方が違うかもしれませんがご了承ください。  

ライブ中のミクさんが、コメント対してどのような感情を持つかを独断と偏見で下記の3つにしました。  
- happy
- sad
- thanks

作りは、下記画像の赤い枠にコメントを打ち込み、「コメント送信」ボタンをクリックすると  
そのコメントをリアルタイムに解析し、ミクさんが反応を示してくれます。  
!!FIXME!!画像を貼る  

ミクさんにとってうれしいコメントと判断すると  
!!FIXME!!  

ミクさんにとっては嬉しいわけではないけど、悪い言葉ではないと判断すると  
!!FIXME!!  

ミクさんにとって悪い言葉やあからさまな悪口だと判断すると  
!!FIXME!!  

のように、ミクさんが一時的に変化し、反応を返してくれます。  

## 人工知能実装概要
 - モデルの作成
    1. Wikipediaの日本語の文書データすべてを、単語区切りにするために形態素解析器にかけます。
       コンテストのルール上、サーバ側で処理ができないので、フロントで処理で処理をするために、jsの形態素解析器であるkuromoji.jsを使用しました。
       ※異なる解析器の場合、異なる結果になる可能性があります。
    2. 形態素解析の結果から、単語を50次元の数値配列へ変換し、word2vecモデルをpython言語で作ります。([参考](https://qiita.com/kenta1984/items/93b64768494f971edf86))
    3. 手作業で、感情用データにラベリングします。（感情用データについては、使用したツール参照）
    4. 感情用データを形態素解析し、その結果とラベリングしたものを、python言語で学習し感情モデルを作ります。
    5. pythonで作成したモデルを、フロントエンドで動かせるように変換します。
      - word2vec : 変換スクリプトを作成しました。
      - 感情モデル : kerasモジュールを使って変換しました。
  - モデルの利用
    1. 入力されたコメントをkuromoji.jsで形態素解析をします。
    2. 解析結果をjsで動くようにしたword2vecモデルで数値化します。
    3. 数値化されたデータを感情モデルにinputします。
    4. コメントがミクにとってどういうものなのかを判定した結果が返ってきます。

## 使用方法
1. githubからcloneする。
```
$ git clone 
$ cd magical_mirai2022
$ git lfs pull
```

ディレクトリ構成は下記の通り。
```
magical_mirai2022
 |---src //index.htmlなどのスクリプト類と、各種データ類
 |    |---data //モデルなどを格納
 |    |---dict //形態素解析用の辞書データ
 |    |---font //フォントデータ
 |    `---images //使用するイラストデータ
 |---lib //不足しているライブライ
 `---README.md //これ
```

2. http-serverに配置してアクセスする。  
下記の例は、nodeでhttp-serverをinstallしている環境。([参考](https://qiita.com/standard-software/items/1afe7b64c4c644fdd9e4))
```
$ cd src
$ http-server
```
※Windows上で実行する場合は、セキュリティエラーが出る環境がある。その場合は下記のコマンドを実行するとPCを再起動するまで回避できる。([参考](https://qiita.com/ponsuke0531/items/4629626a3e84bcd9398f))
```
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope Process
```

3. WebAppの表示が遅い場合は、word2vecモデルを変更してもよい。
src/index.htmlをエディタで開き、5行目のjavascriptの指定を変更する。  
ただし、モデルが軽くなればなるほど、ミクさんの感情にブレが生じる。

変更できるモデルは下記の３種類
- 【通常版】data/w2v_data.js
- 【中量版】data/w2v_data_middle.js
- 【軽量版】data/w2v_data_light.js


## 対応楽曲
 - 

## 作品への思いなど
### 発案・開発動機
マジカルミライをはじめとする、3D CGのライブは自分の好きなキャラがまさに目の前で踊って歌ってくれる夢のような時間です。  
その夢の時間にもし、ミクさんが、観客や自分の声を聴いて、声を理解し、応えてくれたら、どれほど素晴らし時間になるのだろうかと思っていました。 

それを、何とかしてアウトプットしたいと思っていた時にマジカルミライのプログラミングコンテストを目にしました。
これしか表現する機会はないと思い、約３か月という短い期間で、必ず人工知能を搭載したミクさんを作って見せると意気込み制作にあたりました。

### 開発中
jsはさっぱり分からず、一から勉強し、人工知能を作るためのデータセットも当てがあるわけではなく、一から用意して作りました。

データセットは、ミクさんの知能が過去、現在、未来とつながるように
マジカルミライ2021で演奏された楽曲のニコニコ動画のコメントを独自に入手して作成しました。
※ニコ動のコメント見てても時代を感じ、本当にコメントを見ているだけで感動していました。

人工知能を作っているときは、１つ１つミクさんと開発者が一歩ずつ進化しているような気がして、ここでも夢のような時間を過ごすことができました。

### 完成して...
感情を持ってミクさんが反応してくれた時の喜びは、破壊力満点でした！！！  
私たちは、自分のミクさんを信じます。１曲にすべてをかけます。


## 使用した主なライブラリ

- Text Alive App
  https://github.com/TextAliveJp/textalive-app-api
- p5.js
  https://github.com/processing/p5.js
- p5.play 
  https://github.com/molleindustria/p5.play
- kuromoji
  https://github.com/takuyaa/kuromoji.js/  
  ※ build/kuromoji.jsとdictディレクトリを使用
- keras.js
  https://github.com/transcranial/keras-js
- TensorFlow.js
  https://www.tensorflow.org/js/tutorials?hl=ja

## 使用したツール
- Wikipediaの日本語の文書すべて(コーパス)
  - https://dumps.wikimedia.org/jawiki/latest/
- 感情用データセット
  - ニコニコ動画コメント（独自入手約１万件）
- font(Google fonts)
  - https://fonts.google.com/specimen/DotGothic16?subset=japanese#standard-styles 

## 絵師様
- [Aoi](https://mobile.twitter.com/x13sora)様
  - 担当イラスト
    - ミクさんのイラスト
    - 歌詞モニタ

- [mamimu](https://www.photo-ac.com/profile/553109)様 ([photo AC](https://www.photo-ac.com/profile/553109))  
  - 担当イラスト
    - 背景の青い部分
    - [DLサイト](https://www.photo-ac.com/main/detail/3230406?title=%E6%9C%AA%E6%9D%A5%E3%80%80%E3%81%A4%E3%81%AA%E3%81%8C%E3%82%8A%E3%80%80%E3%83%86%E3%82%AF%E3%82%B9%E3%83%81%E3%83%A3%E3%83%BC%E3%80%80%E3%82%B5%E3%82%A4%E3%83%90%E3%83%BC&searchId=2327763154)

- [いらすとや](https://www.irasutoya.com)様  
  - 担当イラスト
    - 上記以外

## 開発者紹介
 - オメガりん
   - 担当：プログラミング、デザイン、事務手続きなど
 　普段はpython書くことがなく、jsなんて無縁の世界の人間。もちろんWebAppを作ったのは初めて。
   嘘くさいが、htmlにcanvasタグを入れなけばならないことに気づかず１週間が過ぎた時もあった…
   さらに、バックエンドで処理すればいいやと思っていたところがNGとなったことに発狂していた。
   - VOCALOIDにはまったきっかけ：甘酸っぱい夏の思い出
 - Aoi
   - 担当：イラスト、デザイン
    プログラミングとは無縁の人。たまに趣味でイラストを描いてくれる古き良き友人。今回は本気で挑戦したいと懇願してイラストを描いてもらった。
    デザインに関しても多くのアドバイスをいただきました。
   - VOCALOIDにはまったきっかけ：

## 免責事項・注意事項
絵師様をはじめとする、全クリエーターのために下記を守って使用してくださいますようよろしくお願いします。
- いかなる場合でも、本スクリプトを使用したことによって発生した損害等の責任は負いかねます。
- 本コンテストの規約に反する使い方をされた場合の責任は負いかねます。
- マジカルミライ(本年度以外のイベントも含む)の運営上必要な場合を除き、イラストの転載は禁止します。
- 本コンテスト以外の目的で、mamimu様、いらすとや様のイラストを使用したい場合は、本家からダウンロードしてください。本家からダウンロードせずに、本本作品以外で使用し生じた不利益については、一切の責任を負いかねます。
- 本コンテスト以外の目的で、Aoi様のイラストを使用することは禁止します。ただし、三次創作としてオリジナル物を作成する場合は問題ないですが、一次製作者のご厚意に反しないようお願いします。
- スクリプトの改修依頼などは原則お受けできません。（運営上必要な場合は可能な限り対応します。）
