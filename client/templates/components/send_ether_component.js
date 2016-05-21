//送金に必要なFeeの計算。
//必要なFee ＝ 必要Gas × Gasプライス
var estimatedFeeInWei =  function(){
  var gas = Session.get('sendEther.estimatedGas');
  var gasPrice = new BigNumber(Session.get('sendEther.currentGasPrice'));
  return gasPrice.mul(gas);
}

var estimationCallback = function(e, res){
    var template = this;
    console.log('Estimated gas: ', res, e);
    if(!e && res) {
        Session.set('sendEther.estimatedGas', res);
    }
};

var getGasPriceCallback = function(e, res){
    var template = this;
    console.log('Current Gas Price in Wei: ', res.toString(10), e);
    if(!e && res) {
        Session.set('sendEther.currentGasPrice', res.toString(10));
    }
};

Template.sendEtherComponent.events({
  //「Send Ether」コンポーネントのSubmitボタン押下時のイベント制御
  'submit form': function(e) {
    var template = this;
    e.preventDefault(); //ボタン押下時のブラウザでのデフォルト動作の禁止

    //画面で入力された送金情報を「fundInfo」オブジェクトに格納
    var fundInfo = {
      fAddr: $(e.target).find('[name=f-addr]').val(),
      tAddr: $(e.target).find('[name=t-addr]').val(),
      amount: web3.toWei($(e.target).find('[name=amount]').val(),'ether') 
    };

    if(EthAccounts.findOne({address: fundInfo.fAddr}, {reactive: false})) {
      //送金情報をSession変数に格納
      Session.set('sendEther.fundInfo', fundInfo);

      //必要Gas量の見積もりをEthereumノードに問い合わせ→ Session変数に格納
      web3.eth.estimateGas({from: fundInfo.fAddr, to: fundInfo.tAddr, value: fundInfo.amount}, estimationCallback.bind(template));

      //現在のGas priceをEthereumノードに問い合わせ問い合わせ→ Session変数に格納
      web3.eth.getGasPrice(getGasPriceCallback.bind(template));

      //送金確認画面（モーダルウィンドウ）の表示
      $('#sendConfirmModal').modal('show');
    }
  }
});

//送金確認画面のヘルパー
Template.sendConfirmModalTemplate.helpers({
  sendAmountInEther: function(){
    var amountEth = web3.fromWei(Session.get("sendEther.fundInfo").amount,'ether');
    return parseFloat(amountEth).toFixed(3);
  },
  fAddr: function(){
    return Session.get("sendEther.fundInfo").fAddr;
  },
  tAddr: function(){
    return Session.get("sendEther.fundInfo").tAddr;
  },
  fee: function(){
    return web3.fromWei(estimatedFeeInWei(),'ether').toString(10);
  }
});

