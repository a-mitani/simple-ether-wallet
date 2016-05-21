//Session変数の初期化
initSessionVars = function(){

//Node関連の変数
Session.setDefault('isMining', false);
Session.setDefault('hashRate', 0);
Session.setDefault('peerCount', 0);

//送金関連の変数
var initialFundInfo = {
  amount:0,
  fAddr:0x0,
  tAddr:0x0,
};
Session.setDefault("sendEther.fundInfo", initialFundInfo);
Session.setDefault("sendEther.estimatedGas", 0);
Session.setDefault("sendEther.currentGasPrice", 0);

};
