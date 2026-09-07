// Cle de stockage et liste des produits autorises dans le panier.
const cartKey = 'mfb-cart';
const catalogProducts = new Set(['Fauteuil Abobo', 'Table Cocody', 'Lit Bingerville', 'Étagère Angré']);

// Recupere le panier en supprimant les produits qui ne font plus partie du catalogue.
const getCart = () => {
    const storedCart = JSON.parse(localStorage.getItem(cartKey) || '[]');
    const validCart = storedCart.filter((item) => catalogProducts.has(item.name));
    if (validCart.length !== storedCart.length) localStorage.setItem(cartKey, JSON.stringify(validCart));
    return validCart;
};

// Enregistre le panier dans le stockage local du navigateur.
const saveCart = (cart) => localStorage.setItem(cartKey, JSON.stringify(cart));

// Affiche les prix avec le format utilise en Cote d'Ivoire.
const formatPrice = (price) => `${new Intl.NumberFormat('fr-FR').format(price)} F`;

// Harmonise le nom de la boutique dans les en-tetes et les pieds de page.
document.querySelectorAll('.logo').forEach((logo) => {
    logo.innerHTML = 'Mobilier des <span>Frères BLEDJO</span>';
});
document.querySelectorAll('.footer span:first-child').forEach((footerBrand) => {
    footerBrand.textContent = 'Mobilier des Frères BLEDJO';
});

function updateCount() {
    const total = getCart().reduce((sum, item) => sum + item.quantity, 0);
    document.querySelectorAll('.cart-count').forEach((count) => { count.textContent = total; });
}

// Ajoute un produit au panier ou augmente sa quantite s'il existe deja.
function addToCart(name, price) {
    const cart = getCart();
    const item = cart.find((product) => product.name === name);
    if (item) item.quantity += 1;
    else cart.push({ name, price: Number(price), quantity: 1 });
    saveCart(cart);
    updateCount();
}

// Reconstruit l'affichage du panier et branche les boutons de suppression.
function renderCart() {
    const container = document.querySelector('#cart-items');
    if (!container) return;
    const cart = getCart();
    if (!cart.length) {
        container.innerHTML = '<p class="empty-cart">Votre panier est vide. <a href="collection.html">Découvrir la collection ↗</a></p>';
        document.querySelector('#cart-total').textContent = '0 F';
        return;
    }
    container.innerHTML = cart.map((item, index) => `<article class="cart-line"><div><h3>${item.name}</h3><p>${item.quantity} × ${formatPrice(item.price)}</p></div><strong>${formatPrice(item.price * item.quantity)}</strong><button class="remove-item" data-index="${index}">Retirer</button></article>`).join('');
    const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    document.querySelector('#cart-total').textContent = formatPrice(total);
    container.querySelectorAll('.remove-item').forEach((button) => {
        button.addEventListener('click', () => {
            const nextCart = getCart();
            nextCart.splice(Number(button.dataset.index), 1);
            saveCart(nextCart);
            updateCount();
            renderCart();
        });
    });
}

// Active l'ajout au panier sur les boutons des fiches produits.
document.querySelectorAll('.add-button').forEach((button) => {
    button.addEventListener('click', () => {
        addToCart(button.dataset.product, button.dataset.price);
        const original = button.innerHTML;
        button.textContent = 'Ajouté au panier ✓';
        setTimeout(() => { button.innerHTML = original; }, 1300);
    });
});

// Initialise le compteur et le contenu du panier sur chaque page.
updateCount();
renderCart();