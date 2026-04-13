const payPalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;

const DEFAULT_PRODUCT = 'Dahou Smart Energy Manager';
const DEFAULT_PRICE = '24.99';

function showMessage(elementId, text) {
  const el = document.getElementById(elementId);
  if (el) el.textContent = text;
}

function loadPayPalSdk(clientId) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector('script[data-paypal-sdk]');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', () => reject(new Error('PayPal SDK')));
      return;
    }
    const script = document.createElement('script');
    script.dataset.paypalSdk = 'true';
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(clientId)}&currency=EUR&locale=de_DE`;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('PayPal SDK'));
    document.head.appendChild(script);
  });
}

function initPayPalButtons(product, safePrice) {
  if (typeof paypal === 'undefined') {
    showMessage(
      'payment-status',
      'Zahlungsdienst ist momentan nicht erreichbar. Bitte versuchen Sie es später erneut oder kontaktieren Sie uns per E-Mail.'
    );
    return;
  }

  paypal
    .Buttons({
      style: { layout: 'vertical', shape: 'rect', label: 'buynow' },
      createOrder(_data, actions) {
        return actions.order.create({
          purchase_units: [
            {
              description: product,
              amount: {
                currency_code: 'EUR',
                value: safePrice,
              },
            },
          ],
        });
      },
      onApprove(_data, actions) {
        return actions.order.capture().then((details) => {
          const payer = details.payer?.name?.given_name || 'Kundin/Kunde';
          showMessage(
            'payment-status',
            `Vielen Dank, ${payer}! Ihre Zahlung wurde erfolgreich bestätigt. Sie erhalten in Kürze eine Bestätigung per E-Mail.`
          );
        });
      },
      onError() {
        showMessage(
          'payment-status',
          'Die Zahlung konnte nicht abgeschlossen werden. Bitte prüfen Sie Ihre Angaben bei PayPal oder wählen Sie eine andere Zahlungsquelle.'
        );
      },
      onCancel() {
        showMessage(
          'payment-status',
          'Sie haben den Bezahlvorgang abgebrochen. Sie können jederzeit erneut zur Kasse gehen.'
        );
      },
    })
    .render('#paypal-button-container');
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const product = params.get('product') || DEFAULT_PRODUCT;
  const priceRaw = params.get('price') || DEFAULT_PRICE;
  const normalized = Number.parseFloat(String(priceRaw).replace(',', '.'));
  const safePrice = Number.isFinite(normalized) ? normalized.toFixed(2) : DEFAULT_PRICE;

  const itemEl = document.getElementById('order-item');
  const priceEl = document.getElementById('order-price');
  if (itemEl) itemEl.textContent = product;
  if (priceEl) priceEl.textContent = safePrice;

  if (!payPalClientId || payPalClientId === 'undefined') {
    showMessage(
      'payment-status',
      'Checkout ist vorübergehend nicht konfiguriert. Bitte setzen Sie VITE_PAYPAL_CLIENT_ID in der Umgebung (ohne Commit in Git) und starten Sie den Build erneut.'
    );
    return;
  }

  try {
    await loadPayPalSdk(payPalClientId);
    initPayPalButtons(product, safePrice);
  } catch {
    showMessage(
      'payment-status',
      'PayPal konnte nicht geladen werden. Bitte prüfen Sie Ihre Internetverbindung oder deaktivieren Sie Blocker für paypal.com.'
    );
  }
});
