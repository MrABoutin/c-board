
class Grid {
    /**
     * Create the base instance of the Grid. call generate() to return the composed grid.
     * @param {object[]} data
     * @param {string[] || GridHeader[]} fields - Headers' name and property associated
     * @param {int} [take=10] - How many items per page
     */
    constructor(data, fields, take){
        this.data = data;
        this.fields = fields;
        this.take = take || 10;
        this.skip = 0
        this.id =  Math.random().toString(36).substr(2, 9)

        if (fields[0].field && fields[0].name){
            this.fields = fields.map(x => x.field)
            this.headers = fields.map(x => x.name)
        }

        this.upperBread =`
    	<table id="c-board-${this.id}" class="c-board c-board-table">
      	<tbody class="c-board">    
   	`

        this.lowerBread =`
				</tbody>
      </table>
    `
    }

    generateHeaders(){
        let th = this.fields || []
        if(this.headers){
            th = this.headers || []
        }
        let h = th.map(x => `<th>${x}</th>`)
        return `<tr>${h.join("")}</tr>`
    }


    generatePager() {
        let d = `<div></div>`
        if(this.data.length <= this.take) return d
        let div = this.data.length/this.take
        let pages = Math.floor(div)
        if(this.data.length % this.take != 0) pages++
        let bt = []
        for (let i = 0; i < pages; i++){
            bt.push(`<button value="${i}" class='c-board c-board-button'>${i+1}`)
        }
        return `<div>${bt.join("")}</div>`
    }

    generateBody() {
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

    generate(){
        return this.upperBread + this.generateHeaders() + this.generateBody() + this.lowerBread + this.generatePager()
    }

    reload(){
        $(`#c-board-${this.id}`).html("<tbody>" + this.generateHeaders() + this.generateBody() + "</tbody>")
    }

    pageChange(page){
        this.skip = this.take * page
        this.reload()
    }
}

module.exports = Grid;

