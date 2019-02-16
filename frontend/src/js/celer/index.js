window.account1 = "49ca2717e582e4037fe4c07eacf6ca3933a8f62d";
window.account2 = "90c8c14e90353730b605cd37231f3021bbfdc741";

window.eth2celarhost = {
  "49ca2717e582e4037fe4c07eacf6ca3933a8f62d": "https://197fe617.ngrok.io",
  "90c8c14e90353730b605cd37231f3021bbfdc741": "https://b924d2af.ngrok.io"
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
