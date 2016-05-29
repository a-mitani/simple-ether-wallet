//latestTransactionComponentテンプレートのヘルパー
Template.latestTransactionComponent.helpers({

  //Transactionsコレクションから最大5件のトランザクション情報を取得
  //timestamp属性について降順で取り出す。
  items: function(){
    selector = {};
    return Transactions.find(selector, {sort: {timestamp: -1}, limit: 5}).fetch();
  }
});


//transactionItemテンプレートのヘルパー
Template.transactionItem.helpers({

  //フォーマット化されたトランザクション時刻の取得
  txDateTime: function(){
    return unix2datetime(this.timestamp);
  },

  //送金額をEtherの単位で取得
  amountInEther: function(){
    var amountEth = web3.fromWei(this.amount, "ether");
    return parseFloat(amountEth).toFixed(3);
  },

  //承認回数の取得
  confirmationCount: function(){
    var count = 0;
    if(this.blockNumber) count = EthBlocks.latest.number - this.blockNumber +1;
    if(count > 50) count = "50+";
    return count;
  }
});

