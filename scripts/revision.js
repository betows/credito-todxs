const Calculator = {           
    get() {        
        urlParams = new URLSearchParams(window.location.search);

        var amount = parseFloat(urlParams.get('amount'));
        var parcel = parseFloat(urlParams.get('parcel'));
        var date = new Date(urlParams.get('date'));        
        var credit_type = urlParams.get('credit_type');        
        
        var juros = 1.20

        //Valor da ultima parcela para arredondamento
        var sobra = (amount*juros)%parcel;
        var number_parcels = ((amount*juros)-sobra)/parcel;
        
        var parcels = []        
        for (var i = 1; i <= number_parcels; i++) {                      
            parcels.push({
                id: i, 
                parcel : parcel, 
                date : date,
            })

            date = new Date(date.setMonth( date.getMonth() + 1 ))
        }

        parcels.push({
            id: i, 
            parcel : sobra, 
            date : date,
        })

        return {parcels : parcels, amount : amount, parcel : parcel}
    },    
}

const Parcel = {
    calc : Calculator.get(),
    incomes() { // Somar entradas
        let income = 0

        Parcel.calc.parcels.forEach(parcel => {
            if (parcel.parcel > 0) {
                income += parcel.parcel
            }
        })
        return income
    },
    amount(){
        return Parcel.calc.amount
    },
    parcel(){
        return Parcel.calc.parcel
    },
    total() { // Somar saídas
        let expense = 0        
        Parcel.calc.parcels.forEach(parcel => {    
            expense += parcel.parcel            
        })
        return expense
    },    
}

const DOM = {
    parcelsContainer: document.querySelector("#data-table tbody"),
    addParcel(parcels, index) {
        const tr = document.createElement("tr")
        tr.innerHTML = DOM.innerHTMLParcel(parcels, index)
        tr.dataset.index = index

        DOM.parcelsContainer.appendChild(tr)
    },
    innerHTMLParcel(parcels, index) {
        const CSSclass = parcels.parcel > 0 ? "income":"expense"
        const parcel = Utils.formatSimple(parcels.parcel)
        const html = `
        <td class="id">${parcels.id}</td>
        <td class="parcel">${parcels.parcel}</td>        
        <td class="date">${Utils.formatDate(parcels.date)}</td>
        `
        return html
    },
    updateBalance() {        
        document
            .querySelector("#incomeDisplay")
            .innerHTML = Utils.formatSimple(Parcel.amount())
        document
            .querySelector("#expenseDisplay")
            .innerHTML = Utils.formatSimple(Parcel.parcel())
        document
            .querySelector("#totalDisplay")
            .innerHTML = Utils.formatSimple(Parcel.total())
    },
    totalCardColor(){
        if (Parcel.total() < 0) {
            // - Negativo
            console.info("Seu Valor Total Esta Negativo: " + Utils.formatSimple(Parcel.total()))
            CardColor.negative()
        } else {
            // - Positivo
            console.info("Seu Valor Total Esta Positivo: " + Utils.formatSimple(Parcel.total()))
            CardColor.positive()
        }
    },
}

const Utils = {
    formatSimple(value){
        value = String(value).replace(/\D/g, "")        
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })
        return "R$" + value
    },
    formatDate(date) {
        return date.toLocaleDateString("pt-BR")
    },
}


const App = {
    init() {
        /* Parcel.all.forEach((parcels, index) => {
            DOM.addParcel(parcels, index)
        })
         ou ↓ */
        Parcel.calc.parcels.forEach(DOM.addParcel)

        DOM.updateBalance()  // Atualiza o valor dos cards
        //DOM.totalCardColor() // Atualiza a cor do card 'total'

        //Calculator.get()
    },
    reload() {
        DOM.clearParcels()
        App.init()
    }
}
App.init()


