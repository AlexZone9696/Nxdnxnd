document.addEventListener('DOMContentLoaded', () => {
    const tronWeb = new TronWeb({
        fullHost: 'https://api.trongrid.io',
    });

    let userWallet = null;

    // Создание нового кошелька
    window.createWallet = async function() {
        try {
            const wallet = await tronWeb.createAccount();
            userWallet = wallet;
            displayWalletInfo(wallet);
            document.getElementById('status').innerText = 'Wallet created successfully!';
        } catch (error) {
            document.getElementById('status').innerText = 'Error creating wallet: ' + error.message;
        }
    };

    // Вход в кошелек по приватному ключу
    window.login = function() {
        const privateKey = document.getElementById('privateKey').value.trim();
        if (!privateKey) {
            document.getElementById('status').innerText = 'Please enter a private key!';
            return;
        }

        try {
            tronWeb.setPrivateKey(privateKey);
            userWallet = { address: tronWeb.defaultAddress, privateKey };
            displayWalletInfo(userWallet);
            document.getElementById('status').innerText = 'Logged in successfully!';
        } catch (error) {
            document.getElementById('status').innerText = 'Invalid private key!';
        }
    };

    // Отправка транзакции
    window.sendTransaction = async function() {
        const recipient = document.getElementById('recipient').value.trim();
        const amount = document.getElementById('amount').value.trim();

        if (!userWallet) {
            document.getElementById('status').innerText = 'Please create or login to a wallet first!';
            return;
        }

        if (!recipient || !amount) {
            document.getElementById('status').innerText = 'Please enter recipient and amount!';
            return;
        }

        try {
            const transaction = await tronWeb.trx.sendTransaction(
                recipient,
                tronWeb.toSun(amount),
                userWallet.privateKey
            );
            document.getElementById('status').innerText = `Transaction successful! TXID: ${transaction.txid}`;
        } catch (error) {
            document.getElementById('status').innerText = 'Transaction failed: ' + error.message;
        }
    };

    // Функция для отображения информации о кошельке
    function displayWalletInfo(wallet) {
        const { base58: address } = wallet.address;
        const { privateKey } = wallet;
        document.getElementById('walletInfo').innerHTML = `
            <p><strong>Address:</strong> ${address}</p>
            <p><strong>Private Key:</strong> ${privateKey}</p>
        `;
    }
});
