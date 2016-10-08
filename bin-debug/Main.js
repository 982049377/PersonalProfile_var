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
    function Main() {
        _super.call(this);
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
    /**
     * 创建主页
     * Create a game scene
     */
    p.creatindex = function () {
        var sky = this.createBitmapByName("earth_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        //加入换页
        ///问题i000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000
        /*
         sky.touchEnabled=true;
         sky.addEventListener(egret.TouchEvent.TOUCH_BEGIN,(e:egret.TouchEvent)=>{
             this.addChild(sky);
             this.addEventListener(egret.TouchEvent.TOUCH_MOVE,()=>{
                 this.creatSecondPage();
             },this)
         },this);
         sky.addEventListener(egret.TouchEvent.TOUCH_END,endMove,this);
     */
    };
    /**
       * 创建第一页面
       * Create a game scene
       */
    p.creatFirstPage = function () {
        var _this = this;
        var sky = this.createBitmapByName("dawn_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        //加入换页
        sky.touchEnabled = true;
        sky.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
            offsetX = e.stageX - sky.x;
            offsetY = e.stageY - sky.x;
            _this.addChild(sky);
            _this.addEventListener(egret.TouchEvent.TOUCH_MOVE, function () {
                _this.creatSecondPage();
            }, _this);
        }, this);
        sky.addEventListener(egret.TouchEvent.TOUCH_END, endMove, this);
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);
        var icon = this.createBitmapByName("head_jpg");
        this.addChild(icon);
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
        //  icon.addEventListener(egret.TouchEvent.)
        /* var tween=egret.Tween.get(icon);
         tween.to({x:100},2000).to({y:200},2000).call(function (){
             alert("helloworld");
         },this).to({x:20,y:45},1000);*/
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
        this.addChild(line);
        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "14081202";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        this.addChild(colorLabel);
        var textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);
        var label = new egret.TextField();
        this.addChild(label);
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
    };
    /**
         * 创建第二页面
         * Create a game scene
         */
    p.creatSecondPage = function () {
        var _this = this;
        var sky = this.createBitmapByName("stara_jpg");
        this.addChild(sky);
        var stageW = this.stage.stageWidth;
        var stageH = this.stage.stageHeight;
        sky.width = stageW;
        sky.height = stageH;
        //加入换页
        sky.touchEnabled = true;
        sky.addEventListener(egret.TouchEvent.TOUCH_BEGIN, function (e) {
            offsetX = e.stageX - sky.x;
            offsetY = e.stageY - sky.x;
            _this.addChild(sky);
            _this.addEventListener(egret.TouchEvent.TOUCH_MOVE, function () {
                _this.creatFirstPage();
                //this.creatindex();
            }, _this);
        }, this);
        sky.addEventListener(egret.TouchEvent.TOUCH_END, endMove, this);
        var topMask = new egret.Shape();
        topMask.graphics.beginFill(0x000000, 0.5);
        topMask.graphics.drawRect(0, 0, stageW, 172);
        topMask.graphics.endFill();
        topMask.y = 33;
        this.addChild(topMask);
        var icon = this.createBitmapByName("eye_jpg");
        this.addChild(icon);
        icon.x = 20;
        icon.y = 45;
        icon.$setScaleX(0.45);
        icon.$setScaleY(0.45);
        var offsetX = 0;
        var offsetY = 0;
        icon.$touchEnabled = true;
        icon.addEventListener(egret.TouchEvent.TOUCH_BEGIN, startMove, this);
        icon.addEventListener(egret.TouchEvent.TOUCH_END, endMove, this);
        function startMove(e) {
            offsetX = e.stageX - icon.x;
            offsetY = e.stageY - icon.x;
            this.addChild(icon);
            this.addEventListener(egret.TouchEvent.TOUCH_MOVE, onMove, this);
        }
        function endMove() {
            this.removeEventListener(egret.TouchEvent.TOUCH_MOVE, onMove, this);
        }
        function onMove(e) {
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
        this.addChild(line);
        var colorLabel = new egret.TextField();
        colorLabel.textColor = 0xffffff;
        colorLabel.width = stageW - 172;
        colorLabel.textAlign = "center";
        colorLabel.text = "14081202";
        colorLabel.size = 24;
        colorLabel.x = 172;
        colorLabel.y = 80;
        this.addChild(colorLabel);
        var textfield = new egret.TextField();
        this.addChild(textfield);
        textfield.alpha = 0;
        textfield.width = stageW - 172;
        textfield.textAlign = egret.HorizontalAlign.CENTER;
        textfield.size = 24;
        textfield.textColor = 0xffffff;
        textfield.x = 172;
        textfield.y = 135;
        this.textfield = textfield;
        //根据name关键字，异步获取一个json配置文件，name属性请参考resources/resource.json配置文件的内容。
        // Get asynchronously a json configuration file according to name keyword. As for the property of name please refer to the configuration file of resources/resource.json.
        RES.getResAsync("description_json", this.startAnimation, this);
        var Mask = new egret.Shape();
        Mask.graphics.beginFill(0x000000, 0.5);
        Mask.graphics.drawRect(0, 0, stageW, 600);
        Mask.graphics.endFill();
        Mask.y = 230;
        this.addChild(Mask);
        var label = new egret.TextField();
        this.addChild(label);
        label.x = 48;
        label.y = 300;
        label.width = 500;
        label.height = 500;
        label.textColor = 0xFFFFFF;
        label.fontFamily = "KaiTi";
        label.text = "姓名：王恒尊\n\n学号：14081202\n\n专业：数字媒体技术\n\n爱好：小说，音乐，游戏\n\n属性：宅\n\nQ Q：982049377\n\n微信：Monologue_whz\n\n目标：学好编程";
    };
    /**
     * 创建游戏场景
     * Create a game scene
     */
    p.createGameScene = function () {
        this.creatFirstPage();
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