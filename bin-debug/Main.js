//////////////////////////////////////////////////////////////////////////////////////
//
//  Copyright (c) 2014-2015, Egret Technology Inc.
//  All rights reserved.
//  Redistribution and use in source and binary forms, with or without
//  modification, are permitted provided that the following conditions are met:
//
//     * Redistributions of source code must retain the above copyright
//       notice, this list of conditions and the following disclaimer.
//     * Redistributions in binary form must reproduce the above copyright
//       notice, this list of conditions and the following disclaimer in the
//       documentation and/or other materials provided with the distribution.
//     * Neither the name of the Egret nor the
//       names of its contributors may be used to endorse or promote products
//       derived from this software without specific prior written permission.
//
//  THIS SOFTWARE IS PROVIDED BY EGRET AND CONTRIBUTORS "AS IS" AND ANY EXPRESS
//  OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES
//  OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED.
//  IN NO EVENT SHALL EGRET AND CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT,
//  INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT
//  LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES;LOSS OF USE, DATA,
//  OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF
//  LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING
//  NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE,
//  EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
//
//////////////////////////////////////////////////////////////////////////////////////
var Main = (function (_super) {
    __extends(Main, _super);
    //private _distance:egret.Point = new egret.Point(); //鼠标点击时，鼠标全局坐标与_bird的位置差
    //private Pages:Array<egret.DisplayObjectContainer>;
    function Main() {
        _super.call(this);
        this._touchStatus = false; //当前触摸状态，按下时，值为true
        this.addEventListener(egret.Event.ADDED_TO_STAGE, this.onAddToStage, this);
    }
    var d = __define,c=Main,p=c.prototype;
    p.onAddToStage = function (event) {
        //设置加载进度界面
        //Config to load process interface
        this.loadingView = new LoadingUI();
        this.stage.addChild(this.loadingView);
        //初始化Resource资源加载库
        //initiate Resource loading library
        RES.addEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.loadConfig("resource/default.res.json", "resource/");
    };
    /**
     * 配置文件加载完成,开始预加载preload资源组。
     * configuration file loading is completed, start to pre-load the preload resource group
     */
    p.onConfigComplete = function (event) {
        RES.removeEventListener(RES.ResourceEvent.CONFIG_COMPLETE, this.onConfigComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
        RES.addEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
        RES.addEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
        RES.loadGroup("preload");
    };
    /**
     * preload资源组加载完成
     * Preload resource group is loaded
     */
    p.onResourceLoadComplete = function (event) {
        if (event.groupName == "preload") {
            this.stage.removeChild(this.loadingView);
            RES.removeEventListener(RES.ResourceEvent.GROUP_COMPLETE, this.onResourceLoadComplete, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_LOAD_ERROR, this.onResourceLoadError, this);
            RES.removeEventListener(RES.ResourceEvent.GROUP_PROGRESS, this.onResourceProgress, this);
            RES.removeEventListener(RES.ResourceEvent.ITEM_LOAD_ERROR, this.onItemLoadError, this);
            this.createGameScene();
        }
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onItemLoadError = function (event) {
        console.warn("Url:" + event.resItem.url + " has failed to load");
    };
    /**
     * 资源组加载出错
     *  The resource group loading failed
     */
    p.onResourceLoadError = function (event) {
        //TODO
        console.warn("Group:" + event.groupName + " has failed to load");
        //忽略加载失败的项目
        //Ignore the loading failed projects
        this.onResourceLoadComplete(event);
    };
    /**
     * preload资源组加载进度
     * Loading process of preload resource group
     */
    p.onResourceProgress = function (event) {
        if (event.groupName == "preload") {
            this.loadingView.setProgress(event.itemsLoaded, event.itemsTotal);
        }
    };
    /*
      private loadSound()
      {
           function loadSound(): void {
           var sound: egret.Sound = new egret.Sound();
           //sound 加载完成监听
           this._sound =sound=RES.getRes("faded_mp3");
           this._channel=sound.play(0,0);
           
           var Anim_point =0;//定义按钮模式
   
           this.music= this.createBitmapByName("music_png");
           this.music.x = this.music.width/2-5;
           this.music.y = 150+this.music.height/2;
           this.music.scaleX=0.4;
           this.music.scaleY=0.4;
           this.music.$alpha=0.8;
           this.changeanchor(this.music);
           this.music.touchEnabled = true;
           //stop
           this.music.addEventListener(egret.TouchEvent.TOUCH_TAP, changeAnim, this);
          
           var Sizetimer:egret.Timer = new egret.Timer(3000,0);
           //注册事件侦听器
           Sizetimer.addEventListener(egret.TimerEvent.TIMER,ChangeSizeByself,this);
           Sizetimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,()=>{ },this);
           //开始计时
         //  ChangeSizeByself();
          egret.Tween.get(this.music).to({scaleX:0.3,scaleY:0.3},1000, egret.Ease.sineIn)
                   .wait(500).to({scaleX:0.7,scaleY:0.7},1000, egret.Ease.sineIn).wait(500);//进行第一次播放
           Sizetimer.start();
   
           var rotationtimer:egret.Timer = new egret.Timer(30,0);
           //注册事件侦听器
           rotationtimer.addEventListener(egret.TimerEvent.TIMER,()=>{this.music.rotation += 0.2;},this);
           rotationtimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE,()=>{ },this);
           //开始计时
           rotationtimer.start();
   
         
           this.addChild(this.music);
   
              
           function changeAnim(e: egret.TouchEvent): void {
               Anim_point = (Anim_point + 1 ) % 2;
               switch (Anim_point) {
                   case 0 :
                       this._channel=this._sound.play(this._pauseTime,0);
                       break;
                   case 1 :
                       this._pauseTime = this._channel.position;
                       this._channel.stop();
                       this._channel = null;
                       break;
           }
           }
           function  ChangeSizeByself():void{
               //this.music=e;
               egret.Tween.get(this.music).to({scaleX:0.3,scaleY:0.3},1000, egret.Ease.sineIn)
                   .wait(500).to({scaleX:0.7,scaleY:0.7},1000, egret.Ease.sineIn).wait(500);
               //RotationByself(e);
               //console.log("12315664654899498498");
           }
       
           }
      }*/
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        // this.Pages=[index,FirstPage,SecondPage];
        // var num=3;
        /**
         * 创建主页
         * Create a game scene
         */
        var index = new egret.DisplayObjectContainer;
        index.y = 0;
        index.width = stageW;
        index.height = stageH;
        this.addChild(index);
        var sky = this.createBitmapByName("earth_jpg");
        index.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var musicPage = new egret.Bitmap;
        var channel;
        var pauseTime = 0;
        // this.loadSound();
        var sound = new egret.Sound();
        //sound 加载完成监听
        sound = RES.getRes("Fade_mp3");
        channel = sound.play(0, 0);
        var Anim_point = 0; //定义按钮模式
        musicPage = this.createBitmapByName("music_png");
        musicPage.x = musicPage.width / 2 - 5;
        musicPage.y = 150 + musicPage.height / 2;
        musicPage.scaleX = 0.4;
        musicPage.scaleY = 0.4;
        musicPage.$alpha = 0.8;
        changeanchor(musicPage);
        musicPage.touchEnabled = true;
        //index.addChild(music);
        //stop
        //music.addEventListener(egret.TouchEvent.TOUCH_TAP,changeAnim,this);
        musicPage.addEventListener(egret.TouchEvent.TOUCH_TAP, changeAnim, this);
        var Sizetimer = new egret.Timer(3000, 0);
        //注册事件侦听器
        Sizetimer.addEventListener(egret.TimerEvent.TIMER, ChangeSizeByself, this);
        Sizetimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () { }, this);
        //开始计时
        //  ChangeSizeByself();
        egret.Tween.get(musicPage).to({ scaleX: 0.3, scaleY: 0.3 }, 1000, egret.Ease.sineIn)
            .wait(500).to({ scaleX: 0.7, scaleY: 0.7 }, 1000, egret.Ease.sineIn).wait(500); //进行第一次播放
        Sizetimer.start();
        var rotationtimer = new egret.Timer(30, 0);
        //注册事件侦听器
        rotationtimer.addEventListener(egret.TimerEvent.TIMER, function () { musicPage.rotation += 0.2; }, this);
        rotationtimer.addEventListener(egret.TimerEvent.TIMER_COMPLETE, function () { }, this);
        //开始计时
        rotationtimer.start();
        index.addChild(musicPage);
        function changeanchor(icon) {
            icon.anchorOffsetX = icon.width / 2;
            icon.anchorOffsetY = icon.height / 2; //改变锚点位置
        }
        function changeAnim(e) {
            Anim_point = (Anim_point + 1) % 2;
            switch (Anim_point) {
                case 0:
                    channel = sound.play(pauseTime, 0);
                    break;
                case 1:
                    pauseTime = channel.position;
                    channel.stop();
                    channel = null;
                    break;
            }
        }
        function ChangeSizeByself() {
            egret.Tween.get(musicPage).to({ scaleX: 0.3, scaleY: 0.3 }, 1000, egret.Ease.sineIn)
                .wait(500).to({ scaleX: 0.7, scaleY: 0.7 }, 1000, egret.Ease.sineIn).wait(500);
        }
        /**
         *
         *
   * 创建第一页面
   * Create a game scene
   */
        var FirstPage = new egret.DisplayObjectContainer;
        FirstPage.y = stageH;
        FirstPage.width = stageW;
        FirstPage.height = stageH;
        this.addChild(FirstPage);
        var sky = this.createBitmapByName("dawn_jpg");
        FirstPage.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        FirstPage.addChild(topMask);
        var icon = this.createBitmapByName("head_jpg");
        FirstPage.addChild(icon);
        icon.x = 20;
        icon.y = 45;
        icon.$setScaleX(0.4);
        icon.$setScaleY(0.4);
        icon.$alpha = 1;
        /* icon.$touchEnabled=true;
         icon.addEventListener(egret.TouchEvent.TOUCH_BEGIN,()=>{
                // alert(1111);
                 var tween=egret.Tween.get(icon);
                 tween.to({x:100},2000).to({y:200},2000).call(function (){
                     //alert("helloworld")
                 },this).to({x:20,y:45},1000);
                 icon.addEventListener(egret.TouchEvent.TOUCH_MOVE,()=>{
                 console.log(icon.$getX);
                 console.log(icon.$getY);
                 var tween=egret.Tween.get(icon);
                 tween.to(icon.$getX,2000).to(icon.$getY,2000).call(function (){
                     //alert("helloworld");
                 },this);
             },this)
         },this);*/
        var offsetX = 0;
        var offsetY = 0;
        icon.$touchEnabled = true;
        icon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, startMove, this);
        icon.addEventListener(egret.TouchEvent.TOUCH_END, endMove, this);
        function startMove(e) {
            //icon = e.currentTarget;
            offsetX = e.stageX - icon.x;
            offsetY = e.stageY - icon.x;
            /*  if(e.stageX>icon.x)
                  offsetX += icon.x;
                  else offsetX=icon.x-offsetX;
              if(e.stageY>icon.y)
                  offsetY += icon.y;
                  else offsetY=icon.y-offsetY;*/
            //offsetX += icon.x;
            // offsetY += icon.y
            // icon.x +=offsetX;
            //icon.y += offsetY;
            this.addChild(icon);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, onMove, this);
        }
        function endMove() {
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, onMove, this);
        }
        function onMove(e) {
            // offsetX=e.stageX-icon.x;
            // offsetY=e.stageY-icon.x;
            /*  if(e.stageX>icon.x)
                  offsetX += icon.x;
                  else offsetX=icon.x-offsetX;
              if(e.stageY>icon.y)
                  offsetY += icon.y;
                  else offsetY=icon.y-offsetY;*/
            //offsetX += icon.x;
            // offsetY += icon.y
            // icon.x +=offsetX;
            // icon.y += offsetY;
            //  var tween=egret.Tween.get(icon);
            //  tween.to({x:icon.x,y:icon.y},50);
            //  console.log(icon.x);
            //  console.log(icon.y);
            icon.x = e.stageX - offsetX;
            icon.y = e.stageY - offsetY;
        }
        var line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 220;
        line.y = 61;
        FirstPage.addChild(line);
        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "14081202";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        FirstPage.addChild(colorLabel);
        var textfield = new egret.TextField();
        FirstPage.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        var label = new egret.TextField();
        FirstPage.addChild(label);
        label.x = 48;
        label.y = 240;
        label.width = 800;
        label.height = 800;
        label.textColor = 0xFFFFFF;
        label.size = 54;
        label.bold = true;
        label.italic = true;
        label.fontFamily = "Microsoft YaHei";
        label.text = "个\n\n\n          人\n\n\n                    简\n\n\n                              历";
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);
        /**
             * 创建第二页面
             * Create a game scene
             */
        var SecondPage = new egret.DisplayObjectContainer;
        SecondPage.y = -stageH;
        SecondPage.width = stageW;
        SecondPage.height = stageH;
        this.addChild(SecondPage);
        var sky = this.createBitmapByName("stara_jpg");
        SecondPage.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        /*//加入换页
                sky.touchEnabled=true;
                offsetY=0;
                sky.addEventListener(egret.TouchEvent.TOUCH_BEGIN,(e:egret.TouchEvent)=>{
                    offsetY=e.stageY-sky.x;
                    this.addChild(sky);
                    this.addEventListener(egret.TouchEvent.TOUCH_MOVE,()=>{
                        //this.creatFirstPage();
                        //this.creatindex();
                        if(offsetY>0)
                            this.creatindex();
                        else offsetY<0
                            this.creatFirstPage();
                    },this)
                },this);
                sky.addEventListener(egret.TouchEvent.TOUCH_END,endMove,this);
         */
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        SecondPage.addChild(topMask);
        var icon = this.createBitmapByName("eye_jpg");
        SecondPage.addChild(icon);
        icon.x = 20;
        icon.y = 45;
        icon.$setScaleX(0.45);
        icon.$setScaleY(0.45);
        var offsetX = 0;
        var offsetY = 0;
        icon.$touchEnabled = true;
        icon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, startMove, this);
        icon.addEventListener(egret.TouchEvent.TOUCH_END, endMove, this);
        var line = new egret.Shape();
        line.graphics.lineStyle(2, 0xffffff);
        line.graphics.moveTo(0, 0);
        line.graphics.lineTo(0, 117);
        line.graphics.endFill();
        line.x = 220;
        line.y = 61;
        SecondPage.addChild(line);
        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "14081202";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        SecondPage.addChild(colorLabel);
        var textfield = new egret.TextField();
        SecondPage.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        var Mask = new egret.Shape();
        Mask.graphics.beginFill(0x000000, 0.5);
        Mask.graphics.drawRect(0, 0, stageW, 600);
        Mask.graphics.endFill();
        Mask.y = 230;
        SecondPage.addChild(Mask);
        var label = new egret.TextField();
        SecondPage.addChild(label);
        label.x = 48;
        label.y = 300;
        label.width = 500;
        label.height = 500;
        label.textColor = 0xFFFFFF;
        label.fontFamily = "KaiTi";
        label.text = "姓名：王恒尊\n\n学号：14081202\n\n专业：数字媒体技术\n\n爱好：小说，音乐，游戏\n\n属性：宅\n\nQ Q：982049377\n\n微信：Monologue_whz\n\n目标：学好编程";
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);
        // this.swapChildren(FirstPage,SecondPage);
        var indextween = egret.Tween.get(index);
        var FirstPagetween = egret.Tween.get(FirstPage);
        var SecondPagetween = egret.Tween.get(SecondPage);
        ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
        index.touchEnabled = true;
        FirstPage.touchEnabled = true;
        SecondPage.touchEnabled = true;
        var index_distance = new egret.Point();
        var FirstPage_distance = new egret.Point();
        var SecondPage_distance = new egret.Point();
        var loaclindex = index.y;
        var loaclFirstPage = FirstPage.y;
        var loaclSecondPage = SecondPage.y;
        //主页的滚动
        index.addEventListener(egret.TouchEvent.TOUCH_BEGIN, indexmouseDown, index);
        index.addEventListener(egret.TouchEvent.TOUCH_END, indexmouseUp, index);
        function indexmouseDown(evt) {
            console.log("Mouse Down.");
            this._touchStatus = true;
            index_distance.y = evt.stageY - index.y;
            FirstPage_distance.y = evt.stageY - FirstPage.y;
            SecondPage_distance.y = evt.stageY - SecondPage.y;
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, indexmouseMove, this);
        }
        function move(evt) {
            index.y = evt.stageY - index_distance.y;
            //FirstPagetween.to({y: evt.stageY - _distance.y},10, egret.Ease.sineIn );
            FirstPage.y = evt.stageY - FirstPage_distance.y;
            SecondPage.y = evt.stageY - SecondPage_distance.y;
        }
        /*  function loacl(it:egret.DisplayObjectContainer){
                // indextween.to( {y:loaclindex},20);
                // FirstPagetween.to({y:loaclFirstPage},20);
                //SecondPagetween.to({y:loaclSecondPage},20);
               //    console.log(this.parent);
                for(var i=0;i<num;i++)
                {
                    var name=this.parent.Pages[i].name;
                 
                    if(name==it.name)
                    {
                        break;
                    }
                }
    
                    if (it.y>-400)
                {
                    //move(evt);
                    //loacl();
                     var indexstopy=evt.stageY - index_distance.y;
                        var FirstPagestopy=evt.stageY-FirstPage_distance.y;
                        var SecondPagesyopy=evt.stageY-SecondPage_distance.y;
                        egret.Tween.get(index).to({x:0,y:indexstopy},100, egret.Ease.sineIn )
                        .wait(300).to({x:0,y:0},200, egret.Ease.sineIn );
                        egret.Tween.get(FirstPage).to({x:0,y:FirstPagestopy},100, egret.Ease.sineIn )
                        .wait(300).to({x:0,y:1136},200, egret.Ease.sineIn );
                        egret.Tween.get(SecondPage).to({x:0,y:SecondPagesyopy},100, egret.Ease.sineIn )
                        .wait(300).to({x:0,y:1136*2},200, egret.Ease.sineIn );
                        egret.Tween.get(this.parent.Pages[i]).to({x:0,y:0},200, egret.Ease.sineIn );
                        egret.Tween.get(this.parent.Pages[(i+1)%num]).to({x:0,y:1136},200, egret.Ease.sineIn );
                        egret.Tween.get(this.parent.Pages[(i+2)%num]).to({x:0,y:1136*2},200, egret.Ease.sineIn );
                    // console.log("00000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000");
                }
                else
                        if(index.y<-400){
                        egret.Tween.get(this.parent.Pages[i]).to({x:0,y:-1136},200, egret.Ease.sineIn );
                        egret.Tween.get(this.parent.Pages[(i+1)%num]).to({x:0,y:0},200, egret.Ease.sineIn );
                        egret.Tween.get(this.parent.Pages[(i+2)%num]).to({x:0,y:1136},200, egret.Ease.sineIn );
                    // console.log("11111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111111");
                        
                }
            }*/
        function indexmouseMove(evt) {
            if (this._touchStatus) {
                console.log("moving now ! Mouse: [X:" + evt.stageX + ",Y:" + evt.stageY + "]");
                move(evt);
            }
        }
        function indexmouseUp(evt) {
            console.log("Mouse Up.");
            this._touchStatus = false;
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, indexmouseMove, this);
            //loacl(index);
            if (index.y > -400 && index.y < 400) {
                egret.Tween.get(index).to({ x: 0, y: 0 }, 200, egret.Ease.sineIn);
                egret.Tween.get(FirstPage).to({ x: 0, y: 1136 }, 200, egret.Ease.sineIn);
                egret.Tween.get(SecondPage).to({ x: 0, y: -1136 }, 200, egret.Ease.sineIn);
            }
            else if (index.y < -400) {
                egret.Tween.get(index).to({ x: 0, y: -1136 }, 200, egret.Ease.sineIn);
                egret.Tween.get(FirstPage).to({ x: 0, y: 0 }, 200, egret.Ease.sineIn);
                egret.Tween.get(SecondPage).to({ x: -640, y: -1136 }, 200).to({ x: -640, y: 1136 }, 200).to({ x: 0, y: 1136 }, 200, egret.Ease.sineIn);
            }
            else if (index.y > 400) {
                egret.Tween.get(index).to({ x: 0, y: 1136 }, 200, egret.Ease.sineIn);
                egret.Tween.get(FirstPage).to({ x: -640, y: 1136 }, 200).to({ x: -640, y: -1136 }, 200).to({ x: 0, y: -1136 }, 200, egret.Ease.sineIn);
                egret.Tween.get(SecondPage).to({ x: 0, y: 0 }, 200, egret.Ease.sineIn);
            }
        }
        //第一页的滚动   
        FirstPage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, FirstPagemouseDown, FirstPage);
        FirstPage.addEventListener(egret.TouchEvent.TOUCH_END, FirstPagemouseUp, FirstPage);
        var _distance = new egret.Point();
        function FirstPagemouseDown(evt) {
            console.log("Mouse Down.");
            this._touchStatus = true;
            index_distance.y = evt.stageY - index.y;
            FirstPage_distance.y = evt.stageY - FirstPage.y;
            SecondPage_distance.y = evt.stageY - SecondPage.y;
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, FirstPagemouseMove, this);
        }
        function FirstPagemouseMove(evt) {
            if (this._touchStatus) {
                console.log("moving now ! Mouse: [X:" + evt.stageX + ",Y:" + evt.stageY + "]");
                move(evt);
            }
        }
        function FirstPagemouseUp(evt) {
            console.log("Mouse Up.");
            this._touchStatus = false;
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, FirstPagemouseMove, this);
            //loacl(FirstPage);
            if (FirstPage.y > -400 && FirstPage.y < 400) {
                egret.Tween.get(FirstPage).to({ x: 0, y: 0 }, 200, egret.Ease.sineIn);
                egret.Tween.get(SecondPage).to({ x: 0, y: 1136 }, 200, egret.Ease.sineIn);
                egret.Tween.get(index).to({ x: 0, y: -1136 }, 200, egret.Ease.sineIn);
            }
            else if (FirstPage.y < -400) {
                egret.Tween.get(FirstPage).to({ x: 0, y: -1136 }, 200, egret.Ease.sineIn);
                egret.Tween.get(SecondPage).to({ x: 0, y: 0 }, 200, egret.Ease.sineIn);
                egret.Tween.get(index).to({ x: -640, y: -1136 }, 200).to({ x: -640, y: 1136 }, 200).to({ x: 0, y: 1136 }, 200, egret.Ease.sineIn);
            }
            else if (FirstPage.y > 400) {
                egret.Tween.get(FirstPage).to({ x: 0, y: 1136 }, 200, egret.Ease.sineIn);
                egret.Tween.get(SecondPage).to({ x: -640, y: 1136 }, 200).to({ x: -640, y: -1136 }, 200).to({ x: 0, y: -1136 }, 200, egret.Ease.sineIn);
                egret.Tween.get(index).to({ x: 0, y: 0 }, 200, egret.Ease.sineIn);
            }
        }
        //第二页的滚动
        SecondPage.addEventListener(egret.TouchEvent.TOUCH_BEGIN, SecondPagemouseDown, SecondPage);
        SecondPage.addEventListener(egret.TouchEvent.TOUCH_END, SecondPagemouseUp, SecondPage);
        var _distance = new egret.Point();
        function SecondPagemouseDown(evt) {
            console.log("Mouse Down.");
            this._touchStatus = true;
            index_distance.y = evt.stageY - index.y;
            FirstPage_distance.y = evt.stageY - FirstPage.y;
            SecondPage_distance.y = evt.stageY - SecondPage.y;
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, SecondPagemouseMove, this);
        }
        function SecondPagemouseMove(evt) {
            if (this._touchStatus) {
                console.log("moving now ! Mouse: [X:" + evt.stageX + ",Y:" + evt.stageY + "]");
                move(evt);
            }
        }
        function SecondPagemouseUp(evt) {
            console.log("Mouse Up.");
            this._touchStatus = false;
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, SecondPagemouseMove, this);
            if (SecondPage.y > -400 && SecondPage.y < 400) {
                egret.Tween.get(SecondPage).to({ x: 0, y: 0 }, 200, egret.Ease.sineIn);
                egret.Tween.get(index).to({ x: 0, y: 1136 }, 200, egret.Ease.sineIn);
                egret.Tween.get(FirstPage).to({ x: -640, y: 1136 }, 200).to({ x: -640, y: -1136 }, 200).to({ x: 0, y: -1136 }, 200, egret.Ease.sineIn);
            }
            else if (SecondPage.y < -400) {
                egret.Tween.get(SecondPage).to({ x: 0, y: -1136 }, 200, egret.Ease.sineIn);
                egret.Tween.get(index).to({ x: 0, y: 0 }, 200, egret.Ease.sineIn);
                egret.Tween.get(FirstPage).to({ x: -640, y: -1136 }, 200).to({ x: -640, y: 1136 }, 200).to({ x: 0, y: 1136 }, 200, egret.Ease.sineIn);
            }
            else if (SecondPage.y > 400) {
                egret.Tween.get(SecondPage).to({ x: 0, y: -1136 }, 200, egret.Ease.sineIn);
                egret.Tween.get(index).to({ x: 0, y: 1136 }, 200, egret.Ease.sineIn);
                egret.Tween.get(FirstPage).to({ x: 0, y: 0 }, 200, egret.Ease.sineIn);
            }
        }
    };
    /**
     * 根据name关键字创建一个Bitmap对象。name属性请参考resources/resource.json配置文件的内容。
     * Create a Bitmap object according to name keyword.As for the property of name please refer to the configuration file of resources/resource.json.
     */
    p.createBitmapByName = function (name) {
        var result = new egret.Bitmap();
        var texture = RES.getRes(name);
        result.texture = texture;
        return result;
    };
    /**
     * 描述文件加载成功，开始播放动画
     * Description file loading is successful, start to play the animation
     */
    p.startAnimation = function (result) {
        var self = this;
        var parser = new egret.HtmlTextParser();
        var textflowArr = [];
        for (var i = 0; i < result.length; i++) {
            textflowArr.push(parser.parser(result[i]));
        }
        var textfield = self.textfield;
        var count = -1;
        var change = function () {
            count++;
            if (count >= textflowArr.length) {
                count = 0;
            }
            var lineArr = textflowArr[count];
            self.changeDescription(textfield, lineArr);
            var tw = egret.Tween.get(textfield);
            tw.to({ "alpha": 1 }, 200);
            tw.wait(2000);
            tw.to({ "alpha": 0 }, 200);
            tw.call(change, self);
        };
        change();
    };
    /**
     * 切换描述内容
     * Switch to described content
     */
    p.changeDescription = function (textfield, textFlow) {
        textfield.textFlow = textFlow;
    };
    return Main;
}(egret.DisplayObjectContainer));
egret.registerClass(Main,'Main');
//# sourceMappingURL=Main.js.map