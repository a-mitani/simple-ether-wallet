var peerCountIntervalId = null;

// 採掘状況を非同期で取得
var getIsMining = function(){
  web3.eth.getMining(function(e, res){
    if(!e)
      Session.set('isMining', res);
  });
};

// HashRateを非同期で取得
var getHashRate = function(){
  web3.eth.getHashrate(function(e, res){
    if(!e)
      Session.set('hashRate', res);
  });
};

// PeerCountを非同期で取得
var getPeerCount = function(){
  web3.net.getPeerCount(function(e, res){
    if(!e)
      Session.set('peerCount', res);
  });
};

observeNode = function(){
  Meteor.clearInterval(peerCountIntervalId);
  peerCountIntervalId = Meteor.setInterval(function() {
    getIsMining();
    getHashRate();
    getPeerCount();
  }, 1000);
};
