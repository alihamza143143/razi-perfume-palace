export function formatPKR(n) {
  return Number(n).toLocaleString('en-US');
}

export function buildOrderLink({ number, product, lang = 'en' }) {
  const price = formatPKR(product.price);
  const name = lang === 'ur' ? product.name_ur : product.name_en;
  const brand = product.brand || '';

  const msgEn = `Salam, I'd like to order *${brand} ${name} — 10ml decant* at Rs. ${price}. Are other sizes available?`;
  const msgUr = `السلام علیکم، میں *${brand} ${name} — 10ml ڈیکانٹ* آرڈر کرنا چاہتا/چاہتی ہوں — قیمت Rs. ${price}۔ کیا دیگر سائز دستیاب ہیں؟`;

  const text = lang === 'ur' ? msgUr : msgEn;
  return `https://wa.me/${number}?text=${encodeURIComponent(text)}`;
}
