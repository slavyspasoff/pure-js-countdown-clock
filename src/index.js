import './styles/main.scss'; // Don't delete :)
import { DateTime as lux } from 'luxon';

const leftContainer = document.querySelector('#left-container');

const setDate = {
  year: null,
  month: null,
  day: null,
  hour: null,
};

//FORM
const form = document.createElement('form');
//form containers
const formTextContainer = document.createElement('section');
formTextContainer.id = 'lbl-container';
const formInputContainer = document.createElement('section');
formInputContainer.id = 'inp-container';
// form identifiers
const formIdentifiers = ['inp-o`clock', 'inp-day', 'inp-month', 'inp-year'];
//form labels
const labels = Array.from({ length: 4 }, (_, i) => {
  const element = document.createElement('label');
  element.htmlFor = formIdentifiers[i];
  element.classList.add('lbl-group');
  element.textContent = formIdentifiers[i].split('-')[1];
  return element;
});
//form inputs
const inputs = Array.from({ length: 4 }, (_, i) => {
  const element = document.createElement('input');
  element.id = formIdentifiers[i];
  element.name = formIdentifiers[i];
  element.classList.add('inp-group');
  return element;
});
//button
const btn = document.createElement('button');
btn.textContent = 'Start countdown';
//append
leftContainer.appendChild(form);
formTextContainer.append(...labels);
formInputContainer.append(...inputs);
form.append(formTextContainer, formInputContainer);
form.appendChild(btn);

const deleteLastCharacter = function (target) {
  target.value = target.value.split('').slice(0, -1).join('');
};
const displayError = function () {
  btn.textContent = 'invalid date';
  btn.disabled = true;
  btn.style.backgroundColor = 'rgb(255 0 0 /0.3)';
  setTimeout(() => {
    btn.disabled = false;
    btn.textContent = 'Start countdown';
    btn.style.backgroundColor = 'rgb(0 0 0)';
  }, 2000);
};

//event handlers
form.addEventListener('input', evt => {
  const daysInMonth = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  if (evt.target.tagName === 'INPUT') {
    const target = evt.target;
    //check if last input was numeric
    if (isNaN(target.value.split('')[target.value.length - 1]))
      deleteLastCharacter(target);
    //check year
    if (target === inputs[3]) {
      if (target.value.length > 4) deleteLastCharacter(target);
      if (target.value.length === 4 && Number(target.value) < new Date().getFullYear())
        target.value = String(new Date().getFullYear());
    }
    //check months
    if (target === inputs[2]) {
      if (target.value[0] === '0') deleteLastCharacter(target);
      if ((target.value.length > 1) & (Number(target.value[0]) !== 1))
        deleteLastCharacter(target);
      if ((target.value.length > 1) & (Number(target.value[1]) > 2))
        deleteLastCharacter(target);
      if (target.value.length > 2) deleteLastCharacter(target);
      if (Number(inputs[1].value) > daysInMonth[target.value - 1]) {
        inputs[1].value = String(daysInMonth[target.value - 1]);
      }
    }
    // check day
    if (target === inputs[1]) {
      if ((target.value.length > 1) & (Number(target.value[0]) > 3))
        deleteLastCharacter(target);
      if (target.value.length > 2) deleteLastCharacter(target);
      if (
        inputs[2].value !== '' &&
        Number(target.value) > daysInMonth[Number(inputs[2].value) - 1]
      )
        target.value = String(daysInMonth[Number(inputs[2].value) - 1]);
      if (inputs[2].value === '' && Number(target.value) > 31) target.value = 31;
    }
    //check hours
    if (target === inputs[0]) {
      if (target.value.length > 2) deleteLastCharacter(target);
      if (Number(target.value) > 24) target.value = '24';
    }
  }
});

//COUNTER
//counter container
const counterContainer = document.createElement('div');
counterContainer.id = 'counter-container';
// counter paragraphs
const counterIdentifiers = ['text-days', 'text-hours', 'text-minutes', 'text-seconds'];
const paragraphs = Array.from({ length: 4 }, (_, i) => {
  const element = document.createElement('p');
  element.id = counterIdentifiers[i];
  element.classList.add('counter-text');
  const span = document.createElement('span');
  span.classList.add('counter-span');
  span.textContent = counterIdentifiers[i].split('-')[1];
  element.appendChild(span);
  return element;
});
//append
counterContainer.append(...paragraphs);

const getDifference = () =>
  lux
    .fromObject(setDate)
    .diff(lux.now(), ['days', 'hours', 'minutes', 'seconds'])
    .toObject();

form.addEventListener('submit', function (evt) {
  evt.preventDefault();
  if (inputs[3].value.length < 4) return displayError();
  for (let input of inputs) if (input.value === '') return displayError();
  setDate.hour = inputs[0].value;
  setDate.day = inputs[1].value;
  setDate.month = inputs[2].value;
  setDate.year = inputs[3].value;
  if (getDifference().minutes < 0) return displayError();
  this.remove();
  leftContainer.append(counterContainer);
  setInterval(() => {
    paragraphs.forEach((e, i) => {
      const identifier = counterIdentifiers[i].split('-')[1];
      e.textContent = `${String(Math.floor(getDifference()[identifier]))} ${identifier}`;
    });
  }, 500);
});
