Router.configure({
  //Layoutテンプレートの指定
  layoutTemplate: 'walletLayout'
});

Router.route('/', function () {
  //リダイレクト設定
  this.redirect('/dashboard');
});

//URLとRouteテンプレートのマッピングを指定
Router.route('/dashboard', {name: 'dashboard'});
Router.route('/send', {name: 'send'});
