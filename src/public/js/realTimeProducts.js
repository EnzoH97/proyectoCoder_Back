// Inicializamos la conexión del socket del lado del cliente
const socket = io();

const productsContainer = document.getElementById("products-container");

// Escuchamos el evento 'update-products' que emite nuestro backend
socket.on("update-products", (products) => {
    // Limpiamos el contenedor para redibujar la lista actualizada
    productsContainer.innerHTML = "";

    // Iteramos sobre el array de productos actualizados que nos envió el servidor
    products.forEach((product) => {
        const productCard = document.createElement("div");
        productCard.id = `product-${product._id}`;
        productCard.style.cssText = `
            border: 1px solid #ddd;
            border-radius: 8px;
            padding: 1rem;
            box-shadow: 0 2px 4px rgba(0,0,0,0.05);
            display: flex;
            flex-direction: column;
            justify-content: space-between;
        `;

        productCard.innerHTML = `
            <div>
                <h3 style="margin: 0 0 0.5rem 0; color: #0084ff;">${product.title}</h3>
                <p style="margin: 0 0 0.5rem 0; color: #666; font-size: 0.9rem;">${product.description || ''}</p>
                <p style="margin: 0 0 0.5rem 0; font-weight: bold;">Categoría: <span style="font-weight: normal; color: #444;">${product.category || 'N/A'}</span></p>
                <p style="margin: 0 0 0.5rem 0; font-weight: bold; color: #28a745; font-size: 1.2rem;">$${product.price}</p>
                <p style="margin: 0 0 1rem 0; font-size: 0.85rem; color: #888;">Stock: ${product.stock} unidades</p>
            </div>
            <button onclick="deleteProduct('${product._id}')" style="background-color: #dc3545; color: white; border: none; padding: 0.5rem; border-radius: 4px; cursor: pointer; font-weight: bold; width: 100%;">
                Eliminar
            </button>
        `;

        productsContainer.appendChild(productCard);
    });
});

// Función auxiliar para borrar un producto enviando un DELETE a la API
// Al borrarlo, el router disparará automáticamente el aviso por Socket y se actualizará la vista
async function deleteProduct(productId) {
    if (confirm("¿Estás seguro de que deseas eliminar este producto?")) {
        try {
            const response = await fetch(`/api/products/${productId}`, {
                method: "DELETE"
            });
            if (!response.ok) {
                alert("Error al intentar eliminar el producto");
            }
        } catch (error) {
            console.error("Error:", error);
        }
    }
}