const Modal = {
    open() {
        document
            .querySelector(".modal-overlay")
            .classList
            .add("active")
    },
    close() {
        document
            .querySelector(".modal-overlay")
            .classList
            .remove("active")
    }
}

const CardColor = {
    positive() {
        document
            .querySelector(".card.total")
            .classList
            .remove("negative")
        document
            .querySelector(".card.total")
            .classList
            .add("positive")
    },
    negative() {
        document
            .querySelector(".card.total")
            .classList
            .remove("positive")
        document
            .querySelector(".card.total")
            .classList
            .add("negative")
    }
}

const Storage = {
    get() {
        return JSON.parse(localStorage.getItem("dev.finances:transactions")) || []
    },
    set(transactions) {
        localStorage.setItem("dev.finances:transactions", JSON.stringify(transactions))
    }
}

const Transaction = {
    all: Storage.get(),
    add(transaction) {
        Transaction.all.push(transaction);

        App.reload()
    },
    remove(index) {
        Transaction.all.splice(index, 1)

        App.reload()
    },
    incomes() { // Somar entradas
        let income = 0

        Transaction.all.forEach(transaction => {
            if (transaction.parcel > 0) {
                income += transaction.parcel
            }
        })
        return income
    },
    expenses() { // Somar saídas
        let expense = 0

        Transaction.all.forEach(transaction => {
            if (transaction.parcel < 0) {
                expense += transaction.parcel
            }
        })
        return expense
    },
    total() { // Entradas menos saídas
        return Transaction.incomes() + Transaction.expenses()
    }
}

const DOM = {
    transactionsContainer: document.querySelector("#data-table tbody"),
    addTransaction(transactions, index) {
        const tr = document.createElement("tr")
        tr.innerHTML = DOM.innerHTMLTransaction(transactions, index)
        tr.dataset.index = index

        DOM.transactionsContainer.appendChild(tr)
    },
    innerHTMLTransaction(transactions, index) {
        const CSSclass = transactions.parcel > 0 ? "income":"expense"
        const parcel = Utils.formatCurrency(transactions.parcel)
        const html = `
        <td class="amount">${transactions.amount}</td>
        <td class="${CSSclass}">${parcel}</td>
        <td class="date">${transactions.date}</td>
        <td>
            <img onclick="Transaction.remove(${index})" src="./assets/minus.svg" class="remove" alt="Remover Transação">
        </td>
        `
        return html
    },
    updateBalance() {
        document
            .querySelector("#incomeDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.incomes())
        document
            .querySelector("#expenseDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.expenses())
        document
            .querySelector("#totalDisplay")
            .innerHTML = Utils.formatCurrency(Transaction.total())
    },
    totalCardColor(){
        if (Transaction.total() < 0) {
            // - Negativo
            console.info("Seu Valor Total Esta Negativo: " + Utils.formatSimple(Transaction.total()))
            CardColor.negative()
        } else {
            // - Positivo
            console.info("Seu Valor Total Esta Positivo: " + Utils.formatSimple(Transaction.total()))
            CardColor.positive()
        }
    },
    clearTransactions(){
        DOM.transactionsContainer.innerHTML = ""
    }
}

const Utils = {
    formatCurrency(value) {
        const signal = Number(value) < 0 ? "-&nbsp;" : "+&nbsp;"

        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })

        return signal + value
    },
    formatparcel(value) {
        value = value * 100
        return Math.round(value)
    },
    formatSimple(value){
        const signal = Number(value) < 0 ? "- " : "+ "

        value = String(value).replace(/\D/g, "")
        value = Number(value) / 100
        value = value.toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
        })

        return signal + value
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    amount: document.querySelector("input#amount"),
    parcel:      document.querySelector("input#parcel"),
    date:        document.querySelector("input#date"),
    getValues() {
        return {
            amount: Form.amount.value,
            parcel:      Form.parcel.value,
            date:        Form.date.value
        }
    },
    validateFields() {
        const {amount, parcel, date} = Form.getValues()
        console.log(amount, parcel, date)
        if (amount.trim() === "" || parcel.trim() === "" || date.trim() === "") {
            throw new Error("Por favor, preencha todos os campos!")
        }
    },
    formatValues() {
        let {amount, parcel, date} = Form.getValues()

        parcel = Utils.formatparcel(parcel)
        date   = Utils.formatDate(date)

        return {
            amount,
            parcel,
            date
        }
    },
    saveTransaction(transaction) {
        Transaction.add(transaction)
    },
    clearFields() {
        Form.amount.value = ""
        Form.parcel.value      = ""
        Form.date.value        = ""
    },
    submit(event) {
        event.preventDefault()

        try {
            Form.validateFields()                   // Verifica campos
            const transaction = Form.formatValues() // Formata valores
            Form.saveTransaction(transaction)       // Adiciona valores
            Form.clearFields()                      // Limpa campos

            Modal.close()                           // Fecha modal
        } catch (error) {
            console.warn(error.message)
            toastError(error.message)
            //alert(error.message)
        }
    }
}

const App = {
    init() {
        /* Transaction.all.forEach((transactions, index) => {
            DOM.addTransaction(transactions, index)
        })
         ou ↓ */
        Transaction.all.forEach(DOM.addTransaction)

        DOM.updateBalance()  // Atualiza o valor dos cards
        DOM.totalCardColor() // Atualiza a cor do card 'total'

        Storage.set(Transaction.all)
    },
    reload() {
        DOM.clearTransactions()
        App.init()
    }
}
App.init()



function toastError(message = "ERRO!") {
    /*let a = document.querySelector("???").innerHTML = `
    <div id="toast">
    <div class="img">Icon</div>
    <div class="amount">${message}</div>
    </div>`*/

    const toastId = document.querySelector("#toast")
    toastId.className = "show"

    setTimeout(() => {
        toastId.className = toastId.className.replace("show", "")
    }, 5000)
}