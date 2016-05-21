Template.walletLayout.helpers({
  //ナビゲーションバーのアイテムをハイライトするためのヘルパー関数
  activeIfCurrent: function (template) {
    var currentRoute = Router.current();
    if(currentRoute && template === Router.current().route.getName()){
      return 'active';
    }else{
      return '';
    }
  }
});
