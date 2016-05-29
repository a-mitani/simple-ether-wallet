//承認状態監視停止の閾値
var requiredConfirmations = 12;

//web3.eth.getTransactionと、web3.eth.getTransactionReceipt のAPIメソッドで得られた情報をもとに
//Transactionsコレクションをアップデート
var updateTransaction = function(oldDocument, transaction, receipt){
  if(receipt && transaction){
    var actualFee = transaction.gasPrice.times(new BigNumber(receipt.gasUsed)).toString(10);
      Transactions.update({_id: oldDocument._id},
                          {$set: {
                                  blockNumber:transaction.blockNumber,
                                  blockHash: transaction.blockHash,
                                  transactionIndex: transaction.transactionIndex,
                                  fee: actualFee
                                 }
                          });
  }else{
    console.log("NOT UPDATED");
  }
};


//最新ブロックを監視し、トランザクション（tx）の承認状態をアップデートする。
checkTransactionConfirmations = function(tx){
  var confCount = 0;
  var filter = web3.eth.filter('latest');

  //最新ブロックを監視。新しいブロックが採掘されれば、コールバック関数内で指定された処理を行う。
  filter.watch(function(e, blockHash){
    if(!e) {
      console.log("Received New Block");
      confCount++;

      // Transactionsコレクションから最新状態を取得。
      // Transactionsコレクションから削除されていれば監視を停止
      tx = Transactions.findOne(tx._id);
      if(!tx) {
        filter.stopWatching();
        return;
      }

      //web3.eth.getTransactionとweb3.eth.getTransactionReceiptの２つのAPI関数の返り値をもとに、
      //最新のトランザクションの状態を取得。
      web3.eth.getTransaction(tx.transactionHash, function(e, transaction){
        web3.eth.getTransactionReceipt(tx.transactionHash, function(e, receipt){
          if(!e) {

            //発信したトランザクションを含むブロックが相当の期間採掘されない場合は、
            //当該トランザクションがEthereumネットワークに受け入れられなかったとして、
            //Walletのトランザクションの歴から削除する。
            //ここで「相当の期間」として、requiredConfirmationsに指定された値の２倍としている。
            if(!receipt || !transaction){
              if(confCount > requiredConfirmations*2){
                Transactions.remove(tx._id);
                filter.stopWatching();
                return;
              }else{
                return;
              }

            // 発信したトランザクションを含むブロックが採掘された場合、
            // その情報でTransactionsコレクションの情報を更新。
            }else if(transaction.blockNumber) {
              if(transaction.blockNumber !== tx.blockNumber){
                updateTransaction(tx, transaction, receipt);
              }
              // Transactionsコレクションでのブロックハッシュと、
              // 最新のEthereumネットワーク上でのブロックハッシュが異なる場合、
              // 当該トランザクションを含むブロックは正規のブロックチェーン内に無いことを示すため、
              // Walletのトランザクション履歴から削除する。
              web3.eth.getBlock(transaction.blockNumber, function(e, block) {
              if(!e) {
                if(block.hash !== transaction.blockHash) {
                  // remove if the parent block is not in the chain anymore.
                  Transactions.remove(tx._id);
                  filter.stopWatching();
                  return;
                }
              }
              });

              // 承認回数が指定回数以上になった場合、十分信頼性が高いとして、
              // 当該トランザクションの承認状態の監視を停止する。
              var confirmations = (EthBlocks.latest.number + 1) - tx.blockNumber;
              if(confirmations > requiredConfirmations){
                console.log("Confirmed Enough. Stop Watching... TxHash=", tx.transactionHash);
                filter.stopWatching();
              }
            }
          }
        });
      });
    }
  });
};

