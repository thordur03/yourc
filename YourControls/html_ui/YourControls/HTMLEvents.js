class YourControlsHTMLEvents {
    constructor(buttonCallback, inputCallback) {
        this.bindedInputs = {}

        this.buttonCallback = buttonCallback
        this.inputCallback = inputCallback
        this.documentListenerRunning = false
    }

    bindEvents() {
        document.addEventListener("mouseup", (e) => {
            if (e.YC) {return}

            let currentWorking = e.target

            while (currentWorking.id == "" && currentWorking != null) {
                currentWorking = currentWorking.parentNode
            }

            if (!currentWorking) {return}

            this.buttonCallback(currentWorking.id)
        })
    }

    startDocumentListener() {
        this.documentListenerRunning = true

        const addElement = this.addElement.bind(this)

        setInterval(() => {
            document.querySelectorAll("*").forEach((element) => {
                addElement(element)
            })
        }, 500)
    }

    addElement(element) {
        this.addButton(element)
        this.addInput(element)
    }

    getHash(string) {
        var hash = 0,
            i, chr;
        for (i = 0; i < string.length; i++) {
            chr = string.charCodeAt(i);
            hash = ((hash << 5) - hash) + chr;
            hash |= 0; // Convert to 32bit integer
        }
        return hash;
    }

    getPositionOfElementInParent(element) {
        if (element.parentNode == null) {
            return 0
        }

        let nodes = element.parentNode.childNodes

        for (let index = 0; index < nodes.length; index++) {
            const otherElement = nodes[index];

            if (otherElement.isEqualNode(element)) {
                return index
            }
        }

        return 0
    }

    countParents(element) {
        let count = 0
        let workingElement = element;

        while (workingElement != null) {
            count++
            workingElement = workingElement.parentNode
        }

        return count
    }

    getAttributesAsOneString(element) {
        let longString = ""

        if (element.hasAttributes()) {
            var attrs = element.attributes;
            for (var i = attrs.length - 1; i >= 0; i--) {
                longString += attrs[i].name + "#" + attrs[i].value
            }
        }

        return longString
    }

    generateHTMLHash(element) {
        let hash = this.getHash(this.getAttributesAsOneString(element))
        hash += this.countParents(element) * this.getPositionOfElementInParent(element)
        return hash
    }

    getIdCorrected(id) {
        while (document.getElementById(id) != null) {
            id += 1
        }

        return id
    }

    addButton(element) {
        if (element.id != "") {
            return
        }

        let id = element.id || this.getIdCorrected(this.generateHTMLHash(element))
        element.id = id
    }

    addInput(element) {
        if (!element instanceof HTMLInputElement || this.bindedInputs[element.id] == true) {
            return
        }

        this.bindedInputs[element.id] = true

        let cacheValue = null
        element.oninput = () => {
            if (cacheValue == element.value) {
                return
            }
            cacheValue = element.value
            // SEND VALUE
            this.inputCallback(element.id, element.value)
        }
    }

    clear() {
        this.bindedInputs = {}
    }
}