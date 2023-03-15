let catProd = document.querySelectorAll('.product-list');
const productElements = document.querySelectorAll('.product');
const prodPriceElements = document.querySelectorAll('.prodprice-item');
const btn = document.querySelectorAll('.buy-product');
const formBtn = document.querySelectorAll('.form-btn')
const form = document.querySelector('.singup');
const formName = document.getElementById('name');
const requiredFields = form.querySelectorAll('.required');
const radioButtons = form.querySelectorAll('input[type="radio"]');
const formDataEl = document.querySelector('.form-data');
let orderBtn = document.querySelector('.order')
const EMPTY_FIELD = 'The field is empty';
const INCORRECT_VALUE = 'Incorrect value';

let order = JSON.parse(localStorage.getItem('orders')) || [];


document.querySelectorAll('.shop-cat').forEach(elem => elem.addEventListener("click",(event) => {
  let clickCategory = event.target.dataset.id;
    if(clickCategory === "phones"){
        catProd[0].classList.add('d-block');
        catProd[1].classList.remove('d-block');
        catProd[2].classList.remove('d-block');

      }else if (clickCategory === "tv"){
        catProd[0].classList.remove('d-block');
        catProd[1].classList.add('d-block');
        catProd[2].classList.remove('d-block');
        
      } else if (clickCategory === "laptops"){
        catProd[0].classList.remove('d-block');
        catProd[1].classList.remove('d-block')
        catProd[2].classList.add('d-block');
      }
}))

productElements.forEach((productElement) => {
  productElement.addEventListener('click', (event) => {
    const prodId = event.target.dataset.prod;
    prodPriceElements.forEach((prodPriceElement, index) => {
      prodPriceElement.classList.toggle('d-block', index === prodId - 0);
    });
  });
})

btn.forEach(elem => elem.addEventListener('click', (event)=>{
  //event.preventDefault();
   // event = window.alert('Thank You for buying!');
    form.classList.add('d-block')
}));


function printError(el, errorMessage) {
    if (errorMessage) {
        form.elements[el].classList.add('has-error');
    } else {
        form.elements[el].classList.remove('has-error');
    }
    form.elements[el].parentElement.querySelector('small').textContent = errorMessage;
}

function sendFormToHTML() {
    console.log('valid');

    for (let i = 0; i < form.elements.length - 1; i++) {
        const div = document.createElement('div');
        let formElementValue = form.elements[i].value;

        if (form.elements[i].type === 'checkbox') {
            formElementValue = form.elements[i].checked;
        }
        if (form.elements[i].type === 'radio') {
          formElementValue = form.elements['quantity'].value;
        }        
        div.textContent = `${form.elements[i].name}: ${formElementValue}`;
        formDataEl.append(div);
    }
}

form.addEventListener('submit', (e) => {
    e.preventDefault();
    let formValid = true;

    // Check the Errors
    requiredFields.forEach((field) => {
        if (field.value === '') {
            printError(field.id, EMPTY_FIELD);
            formValid = false;
        }

        if (field.getAttribute('type') === 'email' && !field.value.includes('@')) {
            printError(field.id, INCORRECT_VALUE);
            formValid = false;
        }
    });

    // Send the Form if the Form is valid
    if (formValid) {
        sendFormToHTML();
    }
});

formName.addEventListener('input', (e) => {
    if (e.target.value.length > 0) {
        printError('name', '');
    }
});
function loadOrders() {
  const orders = JSON.parse(localStorage.getItem('orders'));
  if (orders) {
    orders.forEach((order) => {
      addOrder(order);
    });
  }
}

formBtn.forEach(elem => elem.addEventListener('click', (event)=>{
  const orderData = {
    name: formName.value,
    product: parseInt(event.target.dataset.prod) || 1,
    quantity: form.elements['quantity'].value,
  };
  order.push(orderData);
  localStorage.setItem('orders', JSON.stringify(order));
  form.classList.add('d-block');
}));

orderBtn.addEventListener('click', (event) => { 
  catProd.forEach(cat => cat.classList.remove('d-block'));
  formDataEl.innerHTML = '';
  const savedOrder = JSON.parse(localStorage.getItem('orders'));
  if (savedOrder && savedOrder.length > 0) {
    savedOrder.forEach((orderData, index) => {
      const productEl = productElements[orderData.product - 1];
      const productName = productEl ? productEl.textContent.trim() : (orderData.product === 1 ? '' : 'Unknown product');
      const div = document.createElement('div');
      div.classList.add('order-item');
      div.innerHTML = `<div class="order-details">
                         <p><span>Name:</span> ${orderData.name}</p>
                         <p><span>Product:</span> ${productName}</p>
                         <p><span>Quantity:</span> ${orderData.quantity}</p>
                       </div>`;
      formDataEl.append(div);
      div.querySelector('.order-details').addEventListener('click', (event) => {
        event.target.classList.toggle('d-block');
      });
      const deleteBtn = document.createElement('button');
      deleteBtn.textContent = 'Delete';
      deleteBtn.addEventListener('click', (event) => {
        savedOrder.splice(index, 1);
        localStorage.setItem('orders', JSON.stringify(savedOrder));
        event.target.parentElement.remove();
      });
      div.querySelector('.order-details').append(deleteBtn);
    });
  } else {
    formDataEl.innerHTML = '<p>No orders yet.</p>';
  }
});