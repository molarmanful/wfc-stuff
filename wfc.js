class WFC {
  constructor(n=9, q=3){
    this.n = n
    this.q = q
    this.grid = WFC.superPos(this.n)
    this.history = []
  }

  static superPos(n){
    return [...new Array(n)].map(a=> [...new Array(n)].map(b=> _.range(1, n + 1)))
  }

  row(n){
    return this.grid[n]
  }

  col(n){
    return this.grid.map(xs=> xs[n])
  }

  sq(i, j){
    let i0 = (i / this.q | 0) * this.q
    let j0 = (j / this.q | 0) * this.q
    return this.grid.slice(i0, i0 + this.q).flatMap(xs=> xs.slice(j0, j0 + this.q))
  }

  get least(){
    return _.min(this.grid.map(xs=> _.min(xs.map(ys=> ys.length).filter(a=> a != 1))))
  }

  get solved(){
    return this.grid.every(xs=> xs.every(ys=> ys.length == 1))
  }

  get ok(){
    return this.grid.every(xs=> xs.every(ys=> ys.length != 0))
  }

  at(i, j){
    return this.grid[i][j]
  }

  alt(v, i, j){
    this.grid[i][j] = v
  }

  each(f){
    for(let i in this.grid){
      for(let j in this.grid[i]){
        f(this.at(i, j), +i, +j)
      }
    }
  }

  pick(i, j){
    if(i === undefined) i = _.random(this.n)
    if(j === undefined) j = _.random(this.n)
    this.alt([_.sample(this.at(i, j))], i, j)
    this.propagate()
  }

  observe(){
    let cands = []
    let t = this.least
    if(!this.solved && this.ok){
      this.each((v, i, j)=>{
        if(v.length == t) cands.push([i, j])
      })

      this.pick(..._.sample(cands))
      return true
    }
    if(!this.solved) this.back()
    return false
  }

  check(i, j){
    if(this.grid[i][j].length > 1){
      let taken = {}
      for(let xs of [...this.row(i), ...this.col(j), ...this.sq(i, j)]){
        if(xs.length == 1) taken[xs[0]] = true
      }
      this.alt(this.at(i, j).filter(a=> !(a in taken)), i, j)
    }
  }

  propagate(){
    this.each((v, i, j)=>{
      this.check(i, j)
    })

    this.history.unshift(_.cloneDeep(this.grid))
  }

  back(){
    while(!this.ok) this.grid = this.history.shift()
  }

  get pretty(){
    return this.grid.map(xs=> xs.map(ys=> ys.length <= 1 ? ` ${ys.length ? `<span class="green">${ys[0]}</span>` : '<span class="red">X</span>'} ` : `<span class="gray">[${ys.length}]</span>`).join``).join`\n`
  }
}