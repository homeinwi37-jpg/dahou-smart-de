const payPalClientId = import.meta.env.VITE_PAYPAL_CLIENT_ID;
const productsUrl = new URL('./src/data/products.json', import.meta.url).href;

function calculatePrice(product) {
  if (product.price_de) return product.price_de;
  return (product.cost_cj * 2) + 5.00;
}

function loadPayPalSdk(clientId) {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&currency=EUR&locale=de_DE`;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function initPayPalButtons(product, price) {
  paypal.Buttons({
    createOrder: (data, actions) => {
      return actions.order.create({
        purchase_units: [{
          description: product.name,
          amount: { currency_code: 'EUR', value: price.toFixed(2) }
        }]
      });
    },
    onApprove: async (data, actions) => {
      const details = await actions.order.capture();
      alert(`Vielen Dank, ${details.payer.name.given_name}! Ihre Bestellung wurde entgegengenommen.`);
    }
  }).render('#paypal-button-container');
}

document.addEventListener('DOMContentLoaded', async () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id');
  if (!id) return;

  try {
    const res = await fetch(productsUrl);
    const products = await res.json();
    const product = products.find(p => p.id === id);
    if (!product) return;

    const price = calculatePrice(product);

    document.getElementById('product-name').textContent = product.name;
    document.getElementById('product-image').src = product.image_url;
    document.getElementById('product-description').textContent = product.description;
    document.getElementById('product-price').textContent = new Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(price);

    const specsEl = document.getElementById('product-specs');
    product.specs_list.forEach(spec => {
      const li = document.createElement('li');
      li.textContent = spec;
      specsEl.appendChild(li);
    });

    // Security Check for PayPal ID
    if (payPalClientId && payPalClientId !== 'undefined') {
      await loadPayPalSdk(payPalClientId);
      initPayPalButtons(product, price);
    } else {
      document.getElementById('paypal-button-container').innerHTML = 
        '<p class="warning">Zahlungssystem vorübergehend nicht verfügbar.</p>';
    }

  } catch (err) {
    console.error('Error loading product:', err);
  }
});

