const getSavedCartItems = () => {
  if (!localStorage.length) localStorage.setItem('cartItems', 'valorInicial');
  return localStorage.getItem('cartItems').split(',');
};

if (typeof module !== 'undefined') {
  module.exports = getSavedCartItems;
}
