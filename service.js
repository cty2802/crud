class Service {

    async getCurrency(dateChoosen) {
        let url = `https://bank.gov.ua/NBUStatService/v1/statdirectory/exchange?date=${dateChoosen}&json`;
        try {
            let res = await fetch(url);
            return await res.json();
        } catch (error) {
            console.log(error);
        }
    }

    getLocalData(date) {
        let choosenDate = document.getElementById('chooseDate');
        let newDate = choosenDate.value.replace("-", "").replace("-", "");
        let arrayCurrency = [];
        arrayCurrency = JSON.parse(localStorage.getItem(newDate));
        if (localStorage[`${newDate}`]) {
            return arrayCurrency;
        } else {
            this.getServerData(date);
            console.log(arrayCurrency);
            return arrayCurrency;
        }
    }

    async getServerData(date) {
        let choosenDate = document.getElementById('chooseDate');
        let newDate = choosenDate.value.replace("-", "").replace("-", "");
        let arrayCurrency = [];
        let currency = await this.getCurrency(newDate);
        currency.forEach(arr => {
            let obj = new Object();
            obj.r030 = `${arr.r030}`;
            obj.txt = `${arr.txt}`;
            obj.rate = `${arr.rate}`;
            obj.cc = `${arr.cc}`;
            obj.exchangedate = `${arr.exchangedate}`;
            obj.id = `${arr.r030}`;
            obj.quantity = 1;
            arrayCurrency[arrayCurrency.length] = obj;
        })
        localStorage.setItem(`${newDate}`, JSON.stringify(arrayCurrency));
        console.log(arrayCurrency);
        return arrayCurrency;
    }



    create() {
        let choosenDate = document.getElementById('chooseDate');
        let newDate = choosenDate.value.replace("-", "").replace("-", "");
        let arrayCurrency = JSON.parse(localStorage.getItem(`${newDate}`));
        let newCurr = new Object();
        newCurr.r030 = document.getElementById('r030').value;
        newCurr.txt = document.getElementById('txt').value;
        newCurr.quantity = document.getElementById('quantity').value;
        newCurr.cc = document.getElementById('cc').value;
        newCurr.rate = document.getElementById('rate').value;
        newCurr.exchangedate = `${newDate}`;
        newCurr.id = document.getElementById('r030').value;
        arrayCurrency[arrayCurrency.length] = newCurr;
        localStorage.setItem(`${newDate}`, JSON.stringify(arrayCurrency));
    }

    read(id, date) {}
    update(obj) {}
    delete(id, date) {}

}


export { Service };