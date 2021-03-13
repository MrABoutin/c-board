const className = "c-board"
const baseTable = $(`<table class="${className} ${className}-table"></table>`)
const baseBody = $(`<tbody class="${className} ${className}-tbody"></tbody>`)

class Grid {
    /**
     * Create the base instance of the Grid. call build() to return the composed grid.
     * @param {object[]} data
     * @param {string[] || GridHeader[]} fields - Headers' name and property associated
     * @param {int} [take=10] - How many items per page
     * @param {object} [options] - Additional Options
     */
    constructor(data, fields, take, options){
        this.data = data;
        this.fields = fields;
        this.take = take || 10;
        this.skip = 0
        this.id =  Math.random().toString(36).substr(2, 9)

        if (fields[0].field && fields[0].name){
            this.fields = fields.map(x => x.field)
            this.headers = fields.map(x => x.name)
        }

        this._table = baseTable
        this._table.attr("id", `${className}-${this.id}`)
        this._body = baseBody.clone()
    }

    buildHeaders(){
        let th = this.fields || []
        if(this.headers){
            th = this.headers || []
        }
        let h = th.map(x => `<th>${x}</th>`)
        return `<tr>${h.join("")}</tr>`
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
                return `<td class="${p}">${this.data[i][p] || ""}</td>`
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
        this._body = baseBody.clone()
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

module.exports = Grid;

