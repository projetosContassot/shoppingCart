const btnClearCart = document.querySelector('.empty-cart');
const valorSubtotal = document.querySelector('#subTotal');
const loading = document.querySelector('.loading');

function createProductImageElement(imageSource) {
  const img = document.createElement('img');
  img.className = 'item__image';
  img.src = imageSource;
  return img;
}

function createCustomElement(element, className, innerText) {
  const e = document.createElement(element);
  e.className = className;
  e.innerText = innerText;
  return e;
}

function createProductItemElement({ sku, name, image }) {
  const section = document.createElement('section');
  section.className = 'item';

  section.appendChild(createCustomElement('span', 'item__sku', sku));
  section.appendChild(createCustomElement('span', 'item__title', name));
  section.appendChild(createProductImageElement(image));
  section.appendChild(createCustomElement('button', 'item__add', 'Adicionar ao carrinho!'));

  return section;
}

function getSkuFromProductItem(item) {
  return item.querySelector('span.item__sku').innerText;
}

function soma(valorTotal, valor) {
  let total = valorTotal;
  total += valor;
  return total;
}

function subtracao(valorTotal, valor) {
  let total = valorTotal;
  total -= valor;
  return total;
}

function formataValorCarrinho(valor, operacao = false) {
  const array = valorSubtotal.textContent.split('');
  const formatador = ['R', '$', ' ', '.', ','];
  let real = [];
  for (let i = array.length - 1; i >= 0; i -= 1) {
    if (formatador.includes(array[i])) array.splice(i, 1);
  }
  for (let i = 0; i < array.length - 2; i += 1) real.push(array[i]);
  real = parseInt(real.join(''), 10);
  const centavos = parseInt((array[array.length - 2]) + (array[array.length - 1]), 10);
  const valorAcumulado = parseFloat(`${real}.${centavos}`);
  let total = valorAcumulado;
  total = operacao ? soma(total, valor) : subtracao(total, valor);
  valorSubtotal.textContent = total.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
}

function somaCarrinho(valor) {
  return formataValorCarrinho(valor, true);
}

function subtraiCarrinho(valor) {
  return formataValorCarrinho(valor);
}

function cartItemClickListener(event) {
  let valor = [];
  const array = event.target.textContent.split('');
  for (let i = array.length - 1; i >= 0; i -= 1) {
    if (array[i] === '$') break;
    valor.push(array[i]);
  }
  valor.reverse();
  valor = parseFloat(valor.join(''), 10);
  subtraiCarrinho(valor);
  event.target.remove();
}

function createCartItemElement({ sku, name, salePrice }) {
  const li = document.createElement('li');
  li.className = 'cart__item';
  li.innerText = `SKU: ${sku} | NAME: ${name} | PRICE: $${salePrice}`;
  li.addEventListener('click', cartItemClickListener);
  return li;
}

function addProduct(produto) {
  const painelDeItens = document.querySelector('.items');
  const novoProduto = createProductItemElement(produto);
  painelDeItens.appendChild(novoProduto);
}

function addProductToCart(produto) {
  const carrinho = document.querySelector('.cart__items');
  const novoProduto = createCartItemElement(produto);
  carrinho.appendChild(novoProduto);
}

const todosProdutos = async () => {
  const array = await fetchProducts('computador');
  array.forEach((anuncio) => {
    const { id: sku, title: name, thumbnail: image } = anuncio;
    addProduct({ sku, name, image });
  });
};

const todosProdutosNoCarrinho = async (evento) => {
  let id = '';
  if (typeof evento === 'string') id = evento;
  else id = evento.target.parentNode.querySelector('.item__sku').innerText;
  const array = await fetchItem(id);
  const { id: sku, title: name, price: salePrice } = array;
  addProductToCart({ sku, name, salePrice });
  const valoresSalvos = getSavedCartItems();
  valoresSalvos.push(id);
  saveCartItems('cartItems', valoresSalvos);
  somaCarrinho(salePrice);
};

function observaBotoes() {
  const btnAdd = document.querySelectorAll('.item__add');
  for (let i = 0; i < btnAdd.length; i += 1) {
    btnAdd[i].addEventListener('click', todosProdutosNoCarrinho);
  }
}

function carregaCarrinho() {
  const valoresSalvos = getSavedCartItems();
  localStorage.clear();
  for (let i = 1; i < valoresSalvos.length; i += 1) {
    todosProdutosNoCarrinho(valoresSalvos[i]);
  }
}

function limpaCarrinho() {
  const itensNoCarrinho = document.querySelector('ol').children;
  for (let i = itensNoCarrinho.length - 1; i >= 0; i -= 1) {
    itensNoCarrinho[i].remove();
  }
  localStorage.clear();
  valorSubtotal.textContent = 'R$ 0,00';
}

function removeLoading() {
  loading.remove();
}

window.onload = async () => {
  await todosProdutos();
  removeLoading();
  observaBotoes();
  carregaCarrinho();
  btnClearCart.addEventListener('click', limpaCarrinho);
};
