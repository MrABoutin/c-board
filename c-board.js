const className = "c-board"
const baseTable = document.createElement("table")
baseTable.className = `${className} ${className}-table`
const baseBody = document.createElement("tbody")
baseBody.className = `${className} ${className}-tbody`

class Grid {
    /**
     * Create the base instance of the Grid. call build() to return the composed grid.
     * @param {object[]} data
     * @param {object} [options] - Additional Options
     * @param {string[] || GridHeader[]} options.fields - Headers' name and property associated
     * @param {int} [options.take=10] - How many items per page
     * @param {boolean} [options.noHeaders=false] - Remove the header row
     * @param {object[] || object} [options.cellTemplate] - Template to use for each cells if one is provided or for each fields if the name of the field is provided as a key
     */
    constructor(data, options){
        const { fields, take } = options
        this.fields = fields;
        this.take = 10;
        this.skip = 0
        this.noHeaders = false
        this.cellTemplate = undefined
        if(options) Object.assign(this, options)

        this.data = data;
        this.id =  Math.random().toString(36).substr(2, 9)

        if(!fields && data?.length > 0) this.fields = Object.keys(data[0])
        else if (fields[0].field && fields[0].name){
            this.fields = fields.map(x => x.field)
            this.headers = fields.map(x => x.name)
        }

        this._table = $(baseTable)
        this._table.attr("id", `${className}-${this.id}`)
        this._body = $(baseBody).clone()
    }

    buildHeaders(){
        if(this.noHeaders || !this.fields) return;
        let h = this.fields.map(x => `<th>${x}</th>`)
        return `<tr>${h.join("")}</tr>`
    }

    buildCellFromTemplate(fieldName, content) {
        if(!this.cellTemplate) return content[fieldName]
        let ele
        if(this.cellTemplate[fieldName]) {
            ele = $(this.cellTemplate[fieldName]).clone()
        }
        else {
            ele = this.cellTemplate.clone()
        }
        let c = $(ele.prop("innerHTML"))
        if(c.find(".content").length < 1){
            c.append(content[fieldName])
        } else {
            c.find(".content").append(content[fieldName])
        }
        return c.prop("outerHTML")
    }


    buildPager() {
        let d = $(`<div class="${className} ${className}-pager"></div>`)
        if(this.data.length <= this.take) {
            return d
        }

        let div = this.data.length/this.take
        let pages = Math.floor(div)
        if(this.data.length % this.take != 0) pages++
        for (let i = 0; i < pages; i++){
            let b = $(`<button data="${i}" class='c-board c-board-button'>${i+1}</button>`)
            b.on("click", (e) => {
                this.pageChange(i)
            })
            d.append(b)
        }
        return d
    }

    buildBody() {
        let take = this.data.length - this.skip < this.take ? this.data.length - this.skip : this.take
        let rows = []
        for (let i = this.skip; i < this.skip + take; i++){
            let cells = this.fields.map(p => {
                let c = this.buildCellFromTemplate(p, this.data[i])
                return `<td class="${p}">${c || ""}</td>`
            })
            rows[i] = `<tr>${cells.join("")}</tr>`
        }

        return rows.join("")
    }

    build(){
        let component = $(`<div class=${className}></div>`)
        this._table.append(this.buildInner())
        component.append(this._table)
        component.append(this.buildPager())
        return component
    }

    buildInner(){
        this._body = $(baseBody).clone()
        this._body.append(this.buildHeaders()).append(this.buildBody())
        return this._body
    }

    reload(){
        $(`#c-board-${this.id}`).html(this.buildInner())
    }

    pageChange(page){
        this.skip = this.take * page
        this.reload()
    }
}

class GridHeader {
    constructor(field, name) {
        this.field = field
        this.name = name
    }
}

(function( $ ){
    $.fn.cBoard = function(data, gridHeader, take){
        const g = new Grid(data, gridHeader, take)
        $(this).each(function(){$(this).append(g.build())})
        return this
    }
})( jQuery );
