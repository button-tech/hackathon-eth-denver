window.account1 = "149960814b05d5560bba5000f6c9852c250611bd";
window.account2 = "f6cdf7cdc1d804765c481d03ce0e545d073219d9";

window.eth2celarhost = {
  "149960814b05d5560bba5000f6c9852c250611bd": "https://ethergram.tk/c0",
  "f6cdf7cdc1d804765c481d03ce0e545d073219d9": "https://ethergram.tk/c1"
};

function getClient(ethAddress) {
  const host = eth2celarhost[ethAddress];
  return new celer.Client(host);
}

function depositEth(client, amount) {
  return client.depositEth(amount);
  // return new Promise(function (resolve, reject) {
  //   client.depositEth(amount)
  //     .then(txHash => {
  //       resolve(`https://ropsten.etherscan.io/tx/${txHash}`);
  //     })
  //     .catch(e => {
  //       reject(JSON.stringify(e));
  //     })
  // });
}

window.depositEth = depositEth;


function withdrawEth(client, amount) {
  return client.withdrawEth(amount);
}

window.withdrawEth = withdrawEth;


function sendEth(client, destination, elemId) {

  const elem = document.getElementById(elemId);
  elem.textContent = "Run...";

  client.sendEth(amount, destination)
    .then(result => {
      elem.textContent = `${result}`
    })
    .catch(e => {
      elem.textContent = JSON.stringify(e)
    })
}

window.sendEth = sendEth;

function getEthBalance(client, elemId) {
  const elem = document.getElementById(elemId);
  elem.textContent = "Run...";

  client.getEthBalance(amount)
    .then(result => {
      elem.textContent = JSON.stringify(result)
    })
    .catch(e => {
      elem.textContent = JSON.stringify(e)
    })
}

window.getEthBalance = getEthBalance;


// document.onreadystatechange = () => {
//   document.getElementById("account1").innerText = account1;
//   document.getElementById("account2").innerText = account2;
//   openChannel(client1, 'c1', channelCapacity);
//   openChannel(client2, 'c2', channelCapacity);
// }
