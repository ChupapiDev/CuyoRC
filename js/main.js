// Variables
let cart = JSON.parse(localStorage.getItem('cuyorc_cart')) || [];
const menuToggle = document.getElementById('menuToggle');
const nav = document.querySelector('.nav');
const backToTopBtn = document.getElementById('backToTop');
const header = document.querySelector('.header');

// Función para actualizar contador del carrito
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Función para agregar al carrito
function addToCart(productId, name, price, image) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            name: name,
            price: price,
            image: image,
            quantity: 1
        });
    }
    
    // Guardar en localStorage
    localStorage.setItem('cuyorc_cart', JSON.stringify(cart));
    
    // Actualizar contador
    updateCartCount();
    
    // Mostrar notificación
    showNotification('Producto agregado al carrito');
}

// Función para mostrar notificaciones
function showNotification(message) {
    // Crear el elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.innerHTML = `
        <p>${message}</p>
        <button class="notification-close"><i class="fas fa-times"></i></button>
    `;
    
    // Agregar al DOM
    document.body.appendChild(notification);
    
    // Mostrar con animación
    setTimeout(() => {
        notification.classList.add('show');
    }, 10);
    
    // Remover después de 3 segundos
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
    
    // Evento para cerrar notificación
    notification.querySelector('.notification-close').addEventListener('click', () => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    });
}

// Toggle del menú móvil
if (menuToggle) {
    menuToggle.addEventListener('click', () => {
        nav.classList.toggle('show');
        menuToggle.classList.toggle('active');
        
        // Cambiar icono
        const icon = menuToggle.querySelector('i');
        if (icon.classList.contains('fa-bars')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });
}

// Eventos para botones "Agregar al carrito"
document.addEventListener('DOMContentLoaded', () => {
    // Actualizar contador del carrito al cargar
    updateCartCount();
    
    // Botones de agregar al carrito
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-id');
            const productCard = btn.closest('.product-card');
            const productName = productCard.querySelector('h3').textContent;
            const productPrice = productCard.querySelector('.price').textContent;
            const productImage = productCard.querySelector('img').getAttribute('src');
            
            addToCart(productId, productName, productPrice, productImage);
        });
    });
    
    // Botones de wishlist (favoritos)
    const wishlistBtns = document.querySelectorAll('.wishlist');
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const icon = btn.querySelector('i');
            
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                showNotification('Producto agregado a favoritos');
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                showNotification('Producto eliminado de favoritos');
            }
        });
    });
    
    // Formulario de newsletter
    const newsletterForm = document.querySelector('.newsletter-form');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = newsletterForm.querySelector('input[type="email"]').value;
            
            if (email) {
                // Aquí iría la lógica para guardar el email
                showNotification('¡Gracias por suscribirte a nuestro newsletter!');
                newsletterForm.reset();
            }
        });
    }
});

// Evento de scroll para la navegación fija y botón "back to top"
window.addEventListener('scroll', () => {
    // Header
    if (window.scrollY > 50) {
        header.classList.add('scrolled');
    } else {
        header.classList.remove('scrolled');
    }
    
    // Back to top button
    if (window.scrollY > 300) {
        backToTopBtn.classList.add('show');
    } else {
        backToTopBtn.classList.remove('show');
    }
});

// Evento para el botón "back to top"
if (backToTopBtn) {
    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// Animaciones de scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.fade-in, .slide-up, .slide-left, .slide-right');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.classList.add('active');
        }
    });
}

window.addEventListener('scroll', animateOnScroll);
window.addEventListener('load', animateOnScroll);

// Filtrado de productos (para la página de tienda)
function filterProducts(category) {
    const products = document.querySelectorAll('.product-card');
    
    if (category === 'all') {
        products.forEach(product => {
            product.style.display = 'block';
        });
    } else {
        products.forEach(product => {
            const productCategory = product.getAttribute('data-category');
            
            if (productCategory === category) {
                product.style.display = 'block';
            } else {
                product.style.display = 'none';
            }
        });
    }
}

// Obtener parámetros de URL (para filtrar productos desde enlaces)
function getUrlParameter(name) {
    name = name.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    const regex = new RegExp('[\\?&]' + name + '=([^&#]*)');
    const results = regex.exec(location.search);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
}

// Inicializar filtros si estamos en la página de tienda
document.addEventListener('DOMContentLoaded', () => {
    const categoriaParam = getUrlParameter('categoria');
    
    if (categoriaParam && document.querySelector('.product-filters')) {
        filterProducts(categoriaParam);
        
        // Actualizar estado visual del filtro
        const filterBtns = document.querySelectorAll('.filter-btn');
        filterBtns.forEach(btn => {
            btn.classList.remove('active');
            if (btn.getAttribute('data-filter') === categoriaParam) {
                btn.classList.add('active');
            }
        });
    }
}); 