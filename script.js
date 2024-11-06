function startRotation() {
    stopRotation();
    
    const folder = folders[currentFolder];
    let currentIndex = -1;
    const qrDisplay = document.getElementById('qrDisplay');
    
    async function showNext() {
        if (!folder.items.length) {
            qrDisplay.innerHTML = '';
            new QRCode(qrDisplay, {
                text: currentFolder,
                width: 256,
                height: 256
            });
            const label = document.createElement('div');
            label.className = 'qr-label';
            label.textContent = currentFolder;
            qrDisplay.appendChild(label);
            return;
        }
        
        currentIndex = (currentIndex + 1) % (folder.items.length * 2);
        qrDisplay.innerHTML = '';
        
        if (currentIndex % 2 === 0) {
            // Mostrar QR de la carpeta
            new QRCode(qrDisplay, {
                text: currentFolder,
                width: 256,
                height: 256
            });
            const label = document.createElement('div');
            label.className = 'qr-label';
            label.textContent = currentFolder;
            qrDisplay.appendChild(label);
        } else {
            // Mostrar QR del item y buscar información del producto
            const itemIndex = Math.floor(currentIndex / 2);
            const itemCode = folder.items[itemIndex];

            // Contenedor para el QR y la información del producto
            const container = document.createElement('div');
            container.style.display = 'flex';
            container.style.flexDirection = 'column';
            container.style.alignItems = 'center';
            container.style.gap = '1rem';

            // Generar QR
            const qrDiv = document.createElement('div');
            new QRCode(qrDiv, {
                text: itemCode,
                width: 256,
                height: 256
            });
            container.appendChild(qrDiv);

            // Label con el código
            const label = document.createElement('div');
            label.className = 'qr-label';
            label.textContent = itemCode;
            container.appendChild(label);

            // Contenedor para la información del producto
            const productInfo = document.createElement('div');
            productInfo.className = 'product-info';
            productInfo.innerHTML = '<div class="loading">Buscando información del producto...</div>';
            container.appendChild(productInfo);

            qrDisplay.appendChild(container);

            // Buscar información del producto
            try {
                const searchUrl = `https://www.google.com/search?q=${encodeURIComponent(itemCode)}`;
                
                // Crear un botón para ver el producto
                const searchButton = document.createElement('a');
                searchButton.href = searchUrl;
                searchButton.target = '_blank';
                searchButton.className = 'btn btn-primary product-link';
                searchButton.textContent = 'Ver Producto';
                searchButton.style.marginTop = '10px';
                container.appendChild(searchButton);

            } catch (error) {
                console.error('Error al buscar información del producto:', error);
                productInfo.innerHTML = '<div class="error">No se pudo obtener información del producto</div>';
            }
        }
    }
    
    showNext();
    rotationInterval = setInterval(showNext, 3000);
}