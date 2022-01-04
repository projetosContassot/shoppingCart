const saveCartItems = (chave, valor) => {
  localStorage.setItem(chave, valor);
};

if (typeof module !== 'undefined') {
  module.exports = saveCartItems;
}
