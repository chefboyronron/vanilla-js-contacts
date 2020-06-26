// DOM elements variable
let form = document.getElementById('contact-form');
let contact_table = document.getElementById('contact-table');
let fields = document.getElementsByClassName('text-field'); // returns a collection
let counter = 0;

// Objects and prototypes
function Contact(name, phone, email) {
    this.name = name;
    this.phone = phone;
    this.email = email;
}

function ContactUI() {};

ContactUI.prototype.addContact = function(contact) {
    let name = contact.name,
        phone = contact.phone,
        email = contact.email;

    let table_body = contact_table.querySelector('tbody');
    let message_type = 'error';
    let text_fields = [].slice.call(fields); // convert collection to array

    if( name === '' || phone === '' || email === '' ) {

        this.showMessage('Please fill up all required fields.', message_type);

        // add error on text fields

        text_fields.forEach(function(e, i){
            if( e.value === '' ) {
                e.parentElement.parentElement.classList.add(message_type);
            } else {
                e.parentElement.parentElement.classList.remove(message_type);
            }
        });

    } else {
        let emptylist = table_body.querySelector('.info');

        if( emptylist !== null ) {
            table_body.innerHTML = '';
        }

        // add contact to table
        counter++;

        const row = document.createElement('tr');

        // create template literal
        row.innerHTML = `
            <td>${counter}</td>
            <td>${name}</td>
            <td>${phone}</td>
            <td>${email}</td>
            <td>
                <div class="text-center"><a href="#" class="remove"><i class="icon-trash"></i></a></div>
            </td>
        `;

        table_body.appendChild(row);

        text_fields.forEach(function(e, i){
            e.value = '';
            e.parentElement.parentElement.classList.remove(message_type);
        });

    }
}

ContactUI.prototype.showMessage = function(msg, type) {

    // show message
    let message = document.getElementById('message');

    message.innerHTML = msg;
    message.style.display = 'block';
    message.classList.add('alert-' + type);
    message.classList.add('text-' + type)

    setTimeout(function(){
        // hide message
        message.innerHTML = '';
        message.style.display = 'none';
        message.classList.remove('alert-' + type);
        message.classList.remove('text-' + type)
    }, 3000);

}

// form submit
form.addEventListener('submit', function(e){
    e.preventDefault();

    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const email = document.getElementById('email').value;

    let contact = new Contact(name, phone, email);
    let ui = new ContactUI;

    // add contact
    ui.addContact(contact);

});

// initial load
document.addEventListener('DOMContentLoaded', function(){
    const table_body = contact_table.querySelector('tbody');

    if( table_body.innerHTML === '' ) {
        table_body.innerHTML = `
            <tr class="info">
                <td colspan="5">
                    <p class="text-center no-record">No record found!</p>
                </td>
            <tr>
        `;
    }
});