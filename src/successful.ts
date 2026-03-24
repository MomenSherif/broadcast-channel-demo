const CHANNEL_NAME = 'payment_channel';

const params = new URLSearchParams(window.location.search);
const type = params.get('type') ?? '';
const status = params.get('status') ?? '';
const intentId = params.get('intent_id') ?? '';
const transactionId = params.get('transaction_id') ?? '';
const amount = params.get('amount') ?? '';
const currency = params.get('currency') ?? '';
const responseCode = params.get('response_code') ?? '';
const responseMessage = params.get('response_message') ?? '';

const isFailed = status === 'FAILED';

const channel = new BroadcastChannel(CHANNEL_NAME);
channel.postMessage({
  type: isFailed ? 'PAYMENT_FAILED' : 'PAYMENT_SUCCESS',
  payload: { type, status, intentId, transactionId, amount, currency, responseCode, responseMessage },
});
channel.close();

// Update UI based on outcome
const card = document.querySelector('.card') as HTMLElement;
const body = document.body;

if (isFailed) {
  body.style.background = '#fef2f2';
  card.innerHTML = `
    <div class="icon">❌</div>
    <h1 style="color:#991b1b">Payment Failed</h1>
    <p style="margin-bottom:8px">${responseMessage || 'An error occurred.'}</p>
    <p style="font-size:0.8rem;color:#aaa">Code: ${responseCode}</p>
    <p style="margin-top:12px">This window will close shortly...</p>
  `;
} else {
  card.innerHTML = `
    <div class="icon">✅</div>
    <h1>Payment Successful!</h1>
    <p style="margin-bottom:8px">${amount} ${currency}</p>
    <p style="font-size:0.8rem;color:#aaa">Transaction: ${transactionId}</p>
    <p style="margin-top:12px">This window will close shortly...</p>
  `;
}

setTimeout(() => window.close(), 2000);
