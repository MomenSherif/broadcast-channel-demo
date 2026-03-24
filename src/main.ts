const CHANNEL_NAME = 'payment_channel';
const PAYMENT_BASE_URL = 'https://embed.moneyhash.io/embed/payment/';

const intentInput = document.getElementById('intentInput') as HTMLInputElement;
const payBtn = document.getElementById('payBtn') as HTMLButtonElement;
const status = document.getElementById('status') as HTMLDivElement;

payBtn.addEventListener('click', () => {
  const intentId = intentInput.value.trim();
  if (!intentId) {
    intentInput.focus();
    return;
  }

  const paymentUrl = `${PAYMENT_BASE_URL}${intentId}`;
  window.open(paymentUrl, '_blank');

  payBtn.disabled = true;
  status.className = 'waiting';
  status.textContent = 'Waiting for payment to complete...';

  const channel = new BroadcastChannel(CHANNEL_NAME);

  channel.addEventListener('message', (event) => {
    const { type, payload } = event.data ?? {};
    if (type === 'PAYMENT_SUCCESS') {
      channel.close();
      status.className = 'success';
      status.textContent = `Payment successful! ${payload?.amount} ${payload?.currency}`;
      payBtn.disabled = false;
    } else if (type === 'PAYMENT_FAILED') {
      channel.close();
      status.className = 'error';
      status.textContent = payload?.responseMessage || 'Payment failed.';
      payBtn.disabled = false;
    }
  });
});
