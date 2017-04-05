const form = document.getElementsByTagName('form')[0];
// basic info vars
const nameInput = form.querySelector('input#name');
const emailInput = form.querySelector('input#mail');
const titleSelect = form.querySelector('select#title');
const yourJobTitle = form.querySelector('input#other-title');

// t-shirt vars
const designSelect = form.querySelector('select#design');
const colorsDiv = form.querySelector('#colors-js-puns');
const colorSelect = colorsDiv.querySelector('select#color');

// activities vars
const activitiesFieldset = form.getElementsByClassName('activities')[0];
const activities = activitiesFieldset.getElementsByTagName('input');
const totalP = activitiesFieldset.getElementsByTagName('p')[0];
let total = 0;

// payment vars
const paymentSelect = form.querySelector('select#payment');
const paymentFieldset = form.getElementsByTagName('fieldset')[3];
const paymentDivs = paymentFieldset.querySelectorAll('[name="toggle"]');
const creditCardDiv = paymentDivs[0];
const creditCardData = creditCardDiv.getElementsByTagName('div');
const paypalDiv = paymentDivs[1];
const bitcoinDiv = paymentDivs[2];


// load
nameInput.focus();
	// unobtrusive
	yourJobTitle.className = 'is-hidden';
	colorsDiv.classList.add('is-hidden');
	paymentSelect.value = 'credit-card';
	paypalDiv.classList.add('is-hidden');
	bitcoinDiv.classList.add('is-hidden');

// append option
function appendOption(textContent,value){
	const newOption = document.createElement('option');
	newOption.textContent = textContent;
	newOption.value = value;
	colorSelect.appendChild( newOption );
}
// validate object
const validate = {
	name: () => {
		const value = nameInput.value;
		const label = nameInput.previousElementSibling;
		// remove classes if value exists
		if( value ) {
			label.className = '';	
			nameInput.className = '';
		} else {
			label.className = 'empty';
			nameInput.className = 'empty';
		}
	},
	email: () => {
		const value = emailInput.value;
		const label = emailInput.previousElementSibling;
		// check if value exists and contains @
		if( value && value.indexOf('@') >= 0 ){
			// check if there's text after @
			if( value.substring( value.indexOf('@') +1 ).length > 0 ){
				label.className = '';
				emailInput.className = '';
			} else {
				label.className = 'empty afterAt';
				emailInput.className = 'empty afterAt';
			}
		// check if value exists
		} else if( value ) {
			label.className = 'empty missingAt';
			emailInput.className = 'empty missingAt';
		} else {
			label.className = 'empty';
			emailInput.className = 'empty';
		}
	},
	creditCardData: (target,min,max) => {
		const value = target.value;
		console.log('value length',(value.length+1));
		if( value.length < (min-1) ){ // keypress begins at length = 0 (subtract 1)
			target.className = 'empty';
			target.previousElementSibling.className = 'empty tooShort';
		} else if( value.length > (max-1) ) { // keypress begins at length = 0 (subtract 1)
			target.className = 'empty';
			target.previousElementSibling.className = 'empty tooLong';
		} else {
			target.className = '';
			target.previousElementSibling.className = 'cool';
		}
	}
}

// validate name on blur
nameInput.addEventListener('blur', (e) => {
	validate.name();
});

// validate email in real time
emailInput.addEventListener('keyup', (e) => {
	validate.email();
});

// show Your Job Title input
titleSelect.addEventListener('change', (e) => {
	const value = e.target.value;
	// remove class is-hidden if value equals 'other'
	if( value === 'other' ){
		yourJobTitle.className = '';
	} else {
		yourJobTitle.className = 'is-hidden';
	}
});

// replace select options on designSelect change
designSelect.addEventListener('change', (e) => {
	const value = e.target.value;
	//empty select
	colorSelect.innerHTML = '';
	//check value
	if( value === 'js puns' ){
		// run loop 3 times
		for (let i = 0; i < 3; i++) {
			// set function values depending on i's value
			switch(i){
				case 0:
					appendOption('Cornflower Blue','cornflowerblue');
					break;
				case 1:
					appendOption('Dark Slate Grey','darkslategrey');
					break;
				case 2:
					appendOption('Gold','gold');
					break;
			}
		};
		colorsDiv.className = '';
	} else if( value === 'heart js' ){
		// run loop 3 times
		for (let i = 0; i < 3; i++) {
			// set function values depending on i's value
			switch(i){
				case 0:
					appendOption('Tomato','tomato');
					break;
				case 1:
					appendOption('Steel Blue','steelblue');
					break;
				case 2:
					appendOption('Dim Grey','dimgrey');
					break;
			}
		};
		colorsDiv.className = '';
	} else {
		colorsDiv.className = 'is-hidden';
	}
});

// add total price and block same-hour checkboxes
for (let i = 0; i < activities.length; i++) {
	const checkbox = activities[i];
	checkbox.addEventListener('change', (e) => {
		// our variables
		const parentNode = checkbox.parentNode;
		const labels = parentNode.parentNode.getElementsByTagName('label');
		const labelText = parentNode.textContent;
		const time = labelText.substring( labelText.indexOf(' — ')+3,labelText.indexOf(',') );
		const price = +( labelText.substring( labelText.indexOf('$')+1 ) );
		// add or substract price depending on checked
		( checkbox.checked === true ) ? total += price : total -= price;
		// change total span's textContent for new total
		totalP.firstElementChild.textContent = total;
		// show total
		( total > 0 ) ? totalP.className = '' : totalP.className = 'is-hidden';
		
		// loop through labels (to check times)
		for (let i2 = 0; i2 < labels.length; i2++) {
			// our variables
			const currentLabel = labels[i2];
			const currentLabelText = currentLabel.textContent;
			const currentLabelTime = currentLabelText.substring( currentLabelText.indexOf(' — ')+3,currentLabelText.indexOf(',') );
			// check if label is not the same as clicked && if times match && if checkbox is checked
			if( i !== i2 && time === currentLabelTime && checkbox.checked === true ){
				currentLabel.className = 'disabled';
				currentLabel.firstElementChild.disabled = 'disabled';
			} else if( i !== i2 && time === currentLabelTime ) { // check if label is not the same as clicked && if times match && if checkbox is unchecked
				currentLabel.className = '';
				currentLabel.firstElementChild.disabled = '';
			}
		};

	});
};

// payment
paymentSelect.addEventListener('change',(e) => {
	const value = e.target.value;
	// loop to look for the div with class same as value
	for (var i = 0; i < paymentDivs.length; i++) {
		( paymentDivs[i].className.indexOf(value) >= 0 ) ? paymentDivs[i].classList.remove('is-hidden') : paymentDivs[i].classList.add('is-hidden');
	};
});

// credit card inputs only accept numbers
for (let i = 0; i < creditCardData.length; i++) {
	creditCardData[i].addEventListener('keypress', (e) => {
		// only numbers
		if( e.charCode >= 48 && e.charCode <= 57 ){
			const target = e.target;
			// set min and max lengths for values to be valid
			let min;
			let max;
			switch(i){
				case 0:
					min = 13;
					max = 16;
					break;
				case 1:
					min = 5;
					max = 5;
					break;
				case 2:
					min = 3;
					max = 3;
					break;
			}
			// call function
			validate.creditCardData(target,min,max);
		} else {
			e.preventDefault();
		}		
	});
};

// on submit
form.addEventListener('submit',(e) => {
	e.preventDefault();

	//validate name
	validate.name();

	//validate email
	validate.email();

	// validate empty activities (which means total === 0)
	activitiesFieldset.className = ( total === 0 ) ? 'empty activities' : 'activities';

	// validate empty credit card data
	if( paymentSelect.value === 'credit-card' ){
		// loop through divs
		for (var i = 0; i < creditCardData.length; i++) {
			const input = creditCardData[i].lastElementChild;
			const label = creditCardData[i].firstElementChild;
			if( input.value && input.className.indexOf('empty') < 0 ){ // correct value
				input.className = '';
				label.className = '';
			} else if( input.value ) { // incorrect value (since this is already .empty)
				0;
			} else { // empty value
				input.className = 'empty';
				label.className = 'empty';
			}
		};
	} else {
		// remove .empty class of elemnts in case payment method changes
		for (var i = 0; i < creditCardData.length; i++) {
			const input = creditCardData[i].lastElementChild;
			const label = creditCardData[i].firstElementChild;
			input.className = '';
			label.className = '';
		}
	}

	// validate complete form
	let emptyFields = form.querySelectorAll('.empty');
	if( emptyFields.length > 0 ){
		form.className = 'missingFields';
		form.querySelector('button').textContent = 'Try again';
	} else {
		form.className = 'complete';
		form.querySelector('button').textContent = 'Done!';
	}
});
