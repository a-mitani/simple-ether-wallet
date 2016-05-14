//テンプレート「nodeStatusComponent」のテンプレートヘルパー
//web3オブジェクトのプロパティを取得する各種メソッドを定義。
Template.nodeStatusComponent.helpers({

  //接続先ノードの取得
  currentProvider: function(){
    return web3.currentProvider.host;
  },

  //接続先ノードのマイニング状態の取得
  //マイニング中であればtrue、そうでなければfalse
  isMining: function(){
    return web3.eth.mining;
  },

  //接続先ノードのマイニングのハッシュレートを取得
  currentHashrate: function(){
    return web3.eth.hashrate;
  },

  //接続先ノードのピア数の取得
  currentPeerCount: function(){
    return web3.net.peerCount;
  }
});
