const Modal = {
    open(credit_type) {
        Form.credit_type.value = credit_type
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

const Utils = {
    formatparcel(value) {
        value = value * 100
        return Math.round(value)
    },
    formatDate(date) {
        const splittedDate = date.split("-")
        return `${splittedDate[2]}/${splittedDate[1]}/${splittedDate[0]}`
    }
}

const Form = {
    amount: document.querySelector("input#amount"),
    parcel: document.querySelector("input#parcel"),
    date: document.querySelector("input#date"),
    credit_type: document.querySelector("input#credit_type"),
    
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
            console.log("Ué")
            throw new Error("Por favor, preencha todos os campos!")
        }
        if (parseFloat(parcel)  > parseFloat (amount)) {
            throw new Error("Não é possível informar uma parcela maior que o valor solicitado!")
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

    submit(event) {
        event.preventDefault()
        try {
            Form.validateFields()                   // Verifica campos
            Modal.close()                           // Fecha modal
            window.location.href = "./revision.html?amount="+Form.amount.value+"&parcel="+Form.parcel.value+"&date="+Form.date.value+"&credit_type="+Form.credit_type.value;              // Redireciona para a próxima pagina
            
        } catch (error) {
            console.warn(error.message)
            toastError(error.message)            
        }
    }
}

const App = {
    init() {      
        //Sem função de inicio
    },
    reload() {        
        App.init()
    }
}
App.init()



function toastError(message = "ERRO!") {
    const toastId = document.querySelector("#toast")
    toastId.className = "show"

    setTimeout(() => {
        toastId.className = toastId.className.replace("show", "")
    }, 5000)
}
