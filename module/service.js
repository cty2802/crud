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

    async getServerData(date) {
        let arrayCurrency = [];
        let currency = await this.getCurrency(date);
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
        localStorage.setItem(`${date}`, JSON.stringify(arrayCurrency));
        return arrayCurrency;
    }

    getLocalData(dateChoosen, filterStr) {
        let arrayCurrency = [];
        arrayCurrency = JSON.parse(localStorage.getItem(dateChoosen));
        if (!localStorage[`${dateChoosen}`] || !filterStr) {
            this.getServerData(dateChoosen);
            return arrayCurrency;
        } else {
            let newArray = [];
            for (let i = 0; i < arrayCurrency.length; i++) {
                if (arrayCurrency[i].r030 === filterStr || arrayCurrency[i].txt === filterStr || arrayCurrency[i].cc === filterStr) {
                    newArray.push(arrayCurrency[i]);
                }
            }
            return newArray;
        }
    }

    create(obj, date) {
        let arrayCurrency = this.getLocalData(date);
        arrayCurrency.push(obj);
        localStorage.setItem(`${date}`, JSON.stringify(arrayCurrency));
    }

    delete(id, date) {
        let arrayCurrency = this.getLocalData(date);
        let ind = arrayCurrency.findIndex((el) => {
            return el.id == id;
        });
        arrayCurrency.splice(ind, 1);
        localStorage.setItem(`${date}`, JSON.stringify(arrayCurrency));
    }

    read(id, date) {
        let arrayCurrency = this.getLocalData(date);
        let ind = arrayCurrency.findIndex((el) => {
            return el.id == id;
        });
        return ind;
    }

    update(obj, ind, date, id) {
        let arrayCurrency = this.getLocalData(date);
        ind = this.read(id, date);
        arrayCurrency[ind] = obj;
        localStorage.setItem(`${date}`, JSON.stringify(arrayCurrency));
    }
}

export { Service };