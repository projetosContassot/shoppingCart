const fetchProducts = async (produto) => {
  if (produto === undefined) throw new Error('You must provide an url');
  const url = `https://api.mercadolibre.com/sites/MLB/search?q=${produto}`;

  const result = await fetch(url);
  const data = await result.json();
  return data.results;
};

if (typeof module !== 'undefined') {
  module.exports = {
    fetchProducts,
  };
}