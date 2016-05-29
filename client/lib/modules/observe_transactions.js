//Transactionsコレクションの状態を監視
observeTransactions = function(){
    Transactions.find({}).observe({
        //Transactionsコレクションにドキュメントが追加された場合
        added: function(newDocument) {
          console.log("Added Transaction Document");
          checkTransactionConfirmations(newDocument);
        },
        //Transactionsコレクションからドキュメントが削除された場合
        removed: function(document) {
          console.log("Removed Transaction Document", document._id);
        }
    });
};
