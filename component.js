import { Service } from './module/service.js';
let service = new Service();
let dateTable = null;

function getChoosenDate() {
    let date = document.getElementById('chooseDate');
    let dateChoosen = date.value.replace("-", "").replace("-", "");
    return dateChoosen;
}

function drawTable(date, arrayCurrency) {
    dateTable = date;
    let html = '';
    for (let i = 0; i < arrayCurrency.length; i++) {
        let htmlSegment = `<tr>
            <td> ${arrayCurrency[i].r030} </td>
            <td style="text-align: left"> ${ arrayCurrency[i].txt} </td>
            <td>${ arrayCurrency[i].quantity}</td>
            <td > ${arrayCurrency[i].cc} </td>
           <td > ${arrayCurrency[i].rate} </td>
            <td> ${arrayCurrency[i].exchangedate} </td>
            <td><button onclick="onBtnUpdate(${arrayCurrency[i].id})">Update</button>
            <button id='del' onclick="onBtnDel(${arrayCurrency[i].id})"><img src="pngwing.com.png " width="15 " height="15 " alt="Корзина " 
            style="vertical-align: middle ">Delete</button></td><tr>`;
        html += htmlSegment;
    }
    let container = document.querySelector('.container');
    container.innerHTML = html;
    let htmlDate = '';
    let htmlDateFilling = `Дані на ${date[6] + date[7] + "." + date[4] + date[5] + "." + date[0] + date[1] + date[2] + date[3]}`;
    htmlDate += htmlDateFilling;
    let containerDate = document.querySelector('.fillCurrentgDate');
    containerDate.innerHTML = htmlDate;
}

async function onBtnReloadFromServer() {
    let date = getChoosenDate()
    let array = await service.getServerData(date);
    drawTable(date, array);
    dateTable = date;
}

async function onBtnShowFromLocalStorage() {
    let date = getChoosenDate();
    let array = await service.getLocalData(date);
    drawTable(date, array);
}

async function onBtnDel(id) {
    let result = confirm("Do you really want to delete?");
    if (result) {
        service.delete(id, dateTable);
        let array = await service.getLocalData(dateTable);
        drawTable(dateTable, array);
    }
}

async function onBtnUpdate(id) {
    let arrayCurrency = await service.getLocalData(dateTable);
    let html = '';
    let ind = service.read(id, dateTable);
    for (let i = 0; i < arrayCurrency.length; i++) {
        if (i === ind) {
            let htmlSegment = `
            <td><input id="r030Save" value = "${arrayCurrency[ind].r030}" style="text-align: center" maxlength = "4"></td>
            <td ><input id="textSave" value = "${ arrayCurrency[ind].txt}" style="text-align: left" maxlength = "20"></td>
            <td><input id="quantitySave" value = "${ arrayCurrency[ind].quantity}" style="text-align: center" maxlength = "4"></td>
            <td><input id="ccSave" value = "${arrayCurrency[ind].cc}" style="text-align: center" maxlength = "3"></td>
            <td><input id="rateSave" value = "${arrayCurrency[ind].rate}" style="text-align: center"></td>
            <td> ${arrayCurrency[ind].exchangedate} </td>
            <td><button type = "submit" onclick = "onBtnSaveForUpdate(${arrayCurrency[i].id})">Save</button>
            <button onclick = "onBtnCancel()">Cancel</button></td>`;
            html += htmlSegment;
            i++;
        }
        let htmlSegment = `<tr>
            <td> ${arrayCurrency[i].r030} </td>
            <td style="text-align: left"> ${ arrayCurrency[i].txt} </td>
            <td>${ arrayCurrency[i].quantity}</td>
            <td > ${arrayCurrency[i].cc} </td>
            <td > ${arrayCurrency[i].rate} </td>
            <td> ${arrayCurrency[i].exchangedate} </td>
            <td><button onclick="onBtnUpdate(${arrayCurrency[i].id})">Update</button>
            <button id='del' onclick="onBtnDel(${arrayCurrency[i].id})">Delete</button></td><tr>`;
        html += htmlSegment;
    }
    let container = document.querySelector('.container');
    container.innerHTML = html;
}

async function onBtnSaveForUpdate(id) {
    let dateFromField = dateTable[6] + dateTable[7] + "." + dateTable[4] + dateTable[5] + "." + dateTable[0] + dateTable[1] + dateTable[2] + dateTable[3];
    let array = await service.getLocalData(dateTable);
    let newCurr = new Object();
    newCurr.r030 = document.getElementById('r030Save').value;
    newCurr.txt = document.getElementById('textSave').value;
    newCurr.quantity = document.getElementById('quantitySave').value;
    newCurr.cc = document.getElementById('ccSave').value;
    newCurr.rate = document.getElementById('rateSave').value;
    newCurr.exchangedate = dateFromField;
    let error = validateCurrency(newCurr);
    if (error) {
        alert(error);
        return;
    }
    let ind = service.read(id, dateTable);
    service.update(newCurr, ind, dateTable, id);
    array = await service.getLocalData(dateTable);
    drawTable(dateTable, array);
}

function validateCurrency(currency) {
    if (!currency.r030 || !currency.txt || !currency.quantity || !currency.cc || !currency.rate) {
        return "Треба заповнити поле!"
    }
    if (!currency.r030.match(/[0-9]/)) {
        return "Поле 'код цифровий' має містити мах 4 цифри!"
    }
    if (currency.txt.match(/^[A-Za-z]+$/)) {
        return "Поле 'код літеральний' має містити тільки літери!"
    }
    if (!currency.quantity.match(/[0-9]/)) {
        return "Поле 'кількість одиниць валюти' має містити мах 4 цифри!"
    }
    if (!currency.cc.match(/[A-Z]/)) {
        return "Поле 'назва валюти' має містити тільки 3 великих літери!"
    }
    if (!currency.rate.match(/\d+(,\d{,8})?/)) {
        return "Поле 'офіційний курс' має містити мах 8 цифри після 'коми'!"
    }
    return null;
}

async function onBtnCancel() {
    let array = await service.getLocalData(dateTable);
    drawTable(dateTable, array);
}

async function onBtnAdd() {
    let dateFromField = dateTable[6] + dateTable[7] + "." + dateTable[4] + dateTable[5] + "." + dateTable[0] + dateTable[1] + dateTable[2] + dateTable[3];
    let html = '';
    let arrayCurrency = await service.getLocalData(dateTable);
    let htmlSegment = `
    <td><input id="r030Add"></input></td>
        <td><input id="textAdd"></input></td>
        <td><input id="quantityAdd"></input></td>
        <td><input id="ccAdd"></input></td>
        <td><input id="rateAdd"></input></td>
        <td id="dateInput">${dateFromField}</td>
        <td><button type = "submit" onclick = "onBtnSaveForAdd()">Save</button>
        <button onclick = "onBtnCancel()">Cancel</button></td><tr>`;
    html += htmlSegment;
    for (let i = 0; i < arrayCurrency.length; i++) {
        htmlSegment = `<tr>
    <td> ${arrayCurrency[i].r030} </td>
    <td style="text-align: left"> ${ arrayCurrency[i].txt} </td>
    <td>${ arrayCurrency[i].quantity}</td>
    <td > ${arrayCurrency[i].cc} </td>
    <td > ${arrayCurrency[i].rate} </td>
    <td> ${arrayCurrency[i].exchangedate} </td>
    <td><button onclick="onBtnUpdate(${arrayCurrency[i].id})">Update</button>
    <button id='del' onclick="onBtnDel(${arrayCurrency[i].id})">Delete</button></td><tr>`;
        html += htmlSegment;
    }
    let container = document.querySelector('.container');
    container.innerHTML = html;
    let htmlDate = '';
    let htmlDateFilling = `Дані на ${dateFromField}`;
    htmlDate += htmlDateFilling;
    let containerDate = document.querySelector('.fillCurrentgDate');
    containerDate.innerHTML = htmlDate;
}

async function onBtnSaveForAdd() {
    let dateFromField = dateTable[6] + dateTable[7] + "." + dateTable[4] + dateTable[5] + "." + dateTable[0] + dateTable[1] + dateTable[2] + dateTable[3];
    let array = await service.getLocalData(dateTable);
    let newCurr = new Object();
    newCurr.r030 = document.getElementById('r030Add').value;
    newCurr.txt = document.getElementById('textAdd').value;
    newCurr.quantity = document.getElementById('quantityAdd').value;
    newCurr.cc = document.getElementById('ccAdd').value;
    newCurr.rate = document.getElementById('rateAdd').value;
    newCurr.id = document.getElementById('r030Add').value
    newCurr.exchangedate = dateFromField;
    let error = validateCurrency(newCurr);
    if (error) {
        alert(error);
        return;
    }
    service.create(newCurr, dateTable);
    array = await service.getLocalData(dateTable);
    drawTable(dateTable, array);
}


window.onBtnSaveForAdd = onBtnSaveForAdd;
window.onBtnUpdate = onBtnUpdate;
window.onBtnCancel = onBtnCancel;
window.onBtnDel = onBtnDel;
window.onBtnShowFromLocalStorage = onBtnShowFromLocalStorage;
window.onBtnAdd = onBtnAdd;
window.onBtnSaveForUpdate = onBtnSaveForUpdate;
window.onBtnReloadFromServer = onBtnReloadFromServer;