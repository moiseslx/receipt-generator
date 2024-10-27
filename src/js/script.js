// Função para carregar os dados do localStorage
function loadReceiptData() {
    document.getElementById('buyer').textContent = localStorage.getItem('buyer');
    document.getElementById('company').textContent = localStorage.getItem('company');
    document.getElementById('address').textContent = localStorage.getItem('address');
    document.getElementById('cnpj').textContent = localStorage.getItem('cnpj');

    const products = localStorage.getItem('products');
    const productRows = products.split(';').map(item => {
        const [productName, quantity] = item.split(',');
        return `<tr><td>${productName.trim()}</td><td>${quantity.trim()}</td></tr>`;
    }).join('');
    document.getElementById('product-list').innerHTML = productRows;

    document.getElementById('sub-total').textContent = `R$ ${localStorage.getItem('subTotal')}`;
    document.getElementById('tax').textContent = `R$ ${localStorage.getItem('tax')}`;

    const total = parseFloat(localStorage.getItem('subTotal')) + parseFloat(localStorage.getItem('tax'));
    document.getElementById('total').textContent = `R$ ${total.toFixed(2)}`;

    document.getElementById('total-value').textContent = `R$ ${total.toFixed(2)}`;
}

// Gera o comprovante PDF da página inteira A4
function generatePDF() {
    document.getElementById('generate-pdf').style.display = 'none';  // Esconde o botão

    const receipt = document.getElementById('receipt');

    html2canvas(receipt, { scale: 2 }).then(canvas => {
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p', 'mm', 'a4');
        const imgProps = pdf.getImageProperties(imgData);
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;

        pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
        pdf.save('comprovante.pdf');

        document.getElementById('generate-pdf').style.display = 'block';  // Mostra o botão novamente
    });
}

// Carregar os dados quando a página estiver pronta
window.onload = () => {
    if (window.location.pathname.includes('receipt.html')) {
        loadReceiptData();
    }
};

// Adiciona o evento para gerar PDF
if (document.getElementById('generate-pdf')) {
    document.getElementById('generate-pdf').addEventListener('click', generatePDF);
}
