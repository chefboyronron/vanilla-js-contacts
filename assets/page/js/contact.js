// DOM elements variable
let form = document.getElementById('contact-form');
let contact_table = document.getElementById('contact-table');
let fields = document.getElementsByClassName('text-field'); // returns a collection
let counter = 0;

// Objects and prototypes
function Contact(name, phone, email, timestamp) {
    this.name = name;
    this.phone = phone;
    this.email = email;
    this.timestamp = timestamp;
}

function Store() {}

Store.prototype.getContact = function() {

    let contact;

    if(localStorage.getItem('contacts') === null) {
        contacts = [];
    } else {
        contacts = JSON.parse(localStorage.getItem('contacts'));
    }

    return contacts;
}

Store.prototype.addContact = function(contact) {

    console.log(contact);

    const store = new Store();

    const contacts = store.getContact();

    contacts.push(contact);

    localStorage.setItem('contacts', JSON.stringify(contacts));
}

Store.prototype.removeContact = function(timestamp) {

    let store = new Store();
    const contacts = store.getContact();

    contacts.forEach(function(contact, index){
        console.log(timestamp);
        if(contact.timestamp === parseInt(timestamp)) {
            contacts.splice(index, 1);
        }
    });

    localStorage.setItem('contacts', JSON.stringify(contacts));
}

Store.prototype.displayContact = function() {

    const localStorage = new Store();

    const contacts = localStorage.getContact();

    contacts.forEach(function(contact){
        const ui  = new ContactUI();
        // Add book to UI
        ui.addContact(contact);
    });
}

function ContactUI() {};

ContactUI.prototype.noRecordDOM = function() {
    let html = `
        <tr class="info contact-item">
            <td colspan="4">
                <p class="text-center no-record">No record found!</p>
            </td>
        <tr>
    `;
    return html;
}


ContactUI.prototype.addContact = function(contact) {
    let name = contact.name,
        phone = contact.phone,
        email = contact.email,
        timestamp = contact.timestamp,
        ui = new ContactUI();

    let table_body = contact_table.querySelector('tbody');
    let message_type = 'error';
    let text_fields = [].slice.call(fields); // convert collection to array

    if( name === '' || phone === '' || email === '' ) {

        this.showMessage('Please fill up all required fields.', message_type);

        // add error border on text fields
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
        row.classList.add('contact-item');
        row.innerHTML = `
            <td>${name}</td>
            <td>${phone}</td>
            <td>${email}</td>
            <td>
                <div class="text-center">
                    <input type="hidden" class="timestamp" value="${timestamp}" />
                    <a href="#" class="remove-btn"><i class="icon-trash"></i></a>
                </div>
            </td>
        `;

        table_body.appendChild(row);

        text_fields.forEach(function(e, i){
            e.value = '';
            e.parentElement.parentElement.classList.remove(message_type);
        });

        ui.deleteContact();
    }
}

ContactUI.prototype.deleteContact = function() {

    // delete contact add listener on submit form
    let contact_item = contact_table.getElementsByClassName('contact-item'),
        table_body = contact_table.querySelector('tbody'),
        ui = new ContactUI(),
        store = new Store();

    if( contact_item.length > 0 ) {

        let contact = [].slice.call(contact_item);

        contact.forEach(function(elem){

           let remove_btn = elem.querySelector('.remove-btn');

           if( remove_btn !== null ) {
               remove_btn.addEventListener('click',function(){

                   elem.remove();

                   // Remove contacts to LocalStorage
                   store.removeContact(this.parentElement.querySelector('.timestamp').value);

                   if( table_body.innerHTML === '' ) {
                        table_body.innerHTML = ui.noRecordDOM();
                   }
               });
           }
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
    const timestamp = new Date().getTime();

    let contact = new Contact(name, phone, email, timestamp);
    let ui = new ContactUI();
    let store = new Store()

    // add contact to UI
    ui.addContact(contact);

    // Add contact to LocalStorage
    store.addContact(contact);

});

// initial load
document.addEventListener('DOMContentLoaded', function(){

    const table_body = contact_table.querySelector('tbody');
    let ui = new ContactUI(),
        localStorage = new Store();

    localStorage.displayContact();

    if( table_body.innerHTML === '' ) {
        table_body.innerHTML = ui.noRecordDOM();
    }
});