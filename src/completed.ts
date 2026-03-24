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
  payload: {
    type,
    status,
    intentId,
    transactionId,
    amount,
    currency,
    responseCode,
    responseMessage,
  },
});
channel.close();

// Update UI based on outcome
const card = document.querySelector('.card') as HTMLElement;

if (isFailed) {
  card.innerHTML = `
    <div class="icon">❌</div>
    <h1 class="failed">Payment Failed</h1>
    <p>${responseMessage || 'An error occurred.'}</p>
    <p class="meta">Code: ${responseCode}</p>
    <p class="closing">This window will close shortly...</p>
    <div class="progress"></div>
  `;
} else {
  card.innerHTML = `
    <div class="icon">✅</div>
    <h1>Payment Successful!</h1>
    <p>${amount} ${currency}</p>
    <p class="meta">Transaction: ${transactionId}</p>
    <p class="closing">This window will close shortly...</p>
    <div class="progress"></div>
  `;
}

setTimeout(() => window.close(), 3000);
