
var isReady=false;var onReadyCallbacks=[];
var isServiceReady=false;var onServiceReadyCallbacks=[];
var __uniConfig = {"pages":["pages/home/index","pages/login/login","pages/order/index","pages/order/clearAudit","pages/my/index","pages/my/marketingManager","pages/my/steward","pages/notThing/soloOut","pages/apply/index","pages/apply/waitAudit","pages/apply/waitSigned","pages/apply/enter","pages/apply/hotelManagement","pages/apply/applyResult","pages/order/repair","pages/order/record","pages/order/taskList","pages/order/taskManagement","pages/worker/index","pages/worker/choose"],"window":{"navigationBarTextStyle":"black","navigationBarBackgroundColor":"#FFFFFF","backgroundColor":"#F8F8F8"},"tabBar":{"custom":true,"selectedColor":"#FB8146","color":"#999999","borderStyle":"white","list":[{"pagePath":"pages/home/index"},{"pagePath":"pages/my/index"},{"pagePath":"pages/my/marketingManager"},{"pagePath":"pages/my/steward"}]},"nvueCompiler":"uni-app","nvueStyleCompiler":"uni-app","renderer":"auto","splashscreen":{"alwaysShowBeforeRender":true,"autoclose":false},"appname":"星火邦邦演示版","compilerVersion":"3.5.3","entryPagePath":"pages/home/index","networkTimeout":{"request":60000,"connectSocket":60000,"uploadFile":60000,"downloadFile":60000}};
var __uniRoutes = [{"path":"/pages/home/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom"}},{"path":"/pages/login/login","meta":{},"window":{"navigationBarTitleText":"登录"}},{"path":"/pages/order/index","meta":{},"window":{"navigationBarTitleText":"待服务"}},{"path":"/pages/order/clearAudit","meta":{},"window":{"navigationBarTitleText":"待审核"}},{"path":"/pages/my/index","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom"}},{"path":"/pages/my/marketingManager","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom"}},{"path":"/pages/my/steward","meta":{"isQuit":true,"isTabBar":true},"window":{"navigationStyle":"custom"}},{"path":"/pages/notThing/soloOut","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/apply/index","meta":{},"window":{"navigationBarTitleText":"签约申请","enablePullDownRefresh":false}},{"path":"/pages/apply/waitAudit","meta":{},"window":{"navigationBarTitleText":"待审核","enablePullDownRefresh":false}},{"path":"/pages/apply/waitSigned","meta":{},"window":{"navigationBarTitleText":"待签约","enablePullDownRefresh":false}},{"path":"/pages/apply/enter","meta":{},"window":{"navigationBarTitleText":"已入驻","enablePullDownRefresh":false}},{"path":"/pages/apply/hotelManagement","meta":{},"window":{"navigationBarTitleText":"酒店管理","enablePullDownRefresh":false}},{"path":"/pages/apply/applyResult","meta":{},"window":{"navigationBarTitleText":"开通账号","enablePullDownRefresh":false}},{"path":"/pages/order/repair","meta":{},"window":{"navigationBarTitleText":"","enablePullDownRefresh":false}},{"path":"/pages/order/record","meta":{},"window":{"navigationBarTitleText":"历史记录","enablePullDownRefresh":false}},{"path":"/pages/order/taskList","meta":{},"window":{"navigationBarTitleText":"派单列表","enablePullDownRefresh":false}},{"path":"/pages/order/taskManagement","meta":{},"window":{"navigationBarTitleText":"派单管理","enablePullDownRefresh":false}},{"path":"/pages/worker/index","meta":{},"window":{"navigationBarTitleText":"人员状态","enablePullDownRefresh":false}},{"path":"/pages/worker/choose","meta":{},"window":{"navigationBarTitleText":"选择阿姨","enablePullDownRefresh":false}}];
__uniConfig.onReady=function(callback){if(__uniConfig.ready){callback()}else{onReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"ready",{get:function(){return isReady},set:function(val){isReady=val;if(!isReady){return}const callbacks=onReadyCallbacks.slice(0);onReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
__uniConfig.onServiceReady=function(callback){if(__uniConfig.serviceReady){callback()}else{onServiceReadyCallbacks.push(callback)}};Object.defineProperty(__uniConfig,"serviceReady",{get:function(){return isServiceReady},set:function(val){isServiceReady=val;if(!isServiceReady){return}const callbacks=onServiceReadyCallbacks.slice(0);onServiceReadyCallbacks.length=0;callbacks.forEach(function(callback){callback()})}});
service.register("uni-app-config",{create(a,b,c){if(!__uniConfig.viewport){var d=b.weex.config.env.scale,e=b.weex.config.env.deviceWidth,f=Math.ceil(e/d);Object.assign(__uniConfig,{viewport:f,defaultFontSize:Math.round(f/20)})}return{instance:{__uniConfig:__uniConfig,__uniRoutes:__uniRoutes,global:void 0,window:void 0,document:void 0,frames:void 0,self:void 0,location:void 0,navigator:void 0,localStorage:void 0,history:void 0,Caches:void 0,screen:void 0,alert:void 0,confirm:void 0,prompt:void 0,fetch:void 0,XMLHttpRequest:void 0,WebSocket:void 0,webkit:void 0,print:void 0}}}});
