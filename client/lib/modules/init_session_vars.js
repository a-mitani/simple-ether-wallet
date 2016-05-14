//Session変数の初期化
initSessionVars = function(){

//Node関連の変数
Session.setDefault('isMining', false);
Session.setDefault('hashRate', 0);
Session.setDefault('peerCount', 0);

};
