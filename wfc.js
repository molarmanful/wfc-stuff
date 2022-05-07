class WFC {
  constructor(n=9, q=3){
    this.n = n
    this.q = q
    this.grid = WFC.superPos(this.n)
    this.history = []
    this.guess = []
    this.elims = []
  }

  static superPos(n){
    return [...new Array(n)].map(a=> [...new Array(n)].map(b=> _.range(1, n + 1)))
  }

  load(g){
    this.grid = _.merge(WFC.superPos(this.n), g)
    this.each((v, i, j)=>{
      if(!v.pop) this.alt([v], i, j)
    })
    this.propagate()
    this.history = []
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
    return _.min(this.grid.map(xs=> _.min(_.without(xs.map(ys=> ys.length), 1))))
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

  elimd(i, j){
    return this.elims.filter(([v, a, b])=> a == i && b == j).map(([v])=> v)
  }

  canded(i, j){
    return _.difference(this.at(i, j), this.elimd(i, j))
  }

  pick(cands){
    let [i, j] = _.sample(cands)
    let v = _.sample(this.canded(i, j))
    this.alt([v], i, j)
    this.guess = [v, i, j]
    this.propagate()
  }

  observe(){
    if(!this.solved){
      if(!this.ok){
        this.back()
      }
      else {
        let cands = []
        let t = this.least
        this.each((v, i, j)=>{
          if(v.length == t && this.canded(i, j).length) cands.push([i, j])
        })
        cands = cands.filter(c=> this.canded(...c))
        if(cands.length) this.pick(cands)
        else this.back()
      }
    }
  }

  check(i, j){
    if(this.at(i, j).length > 1){
      this.alt(_.difference(this.at(i, j), ...[...this.row(i), ...this.col(j), ...this.sq(i, j)].filter(xs=> xs.length == 1)), i, j)
    }
  }

  propagate(){
    this.each((v, i, j)=>{
      this.check(i, j)
    })

    this.history.unshift({
      grid: _.cloneDeep(this.grid),
      guess: _.clone(this.guess),
      elims: _.cloneDeep(this.elims)
    })
  }

  back(){
    if(this.history.length){
      let h = this.history.shift()
      if(h.guess.length){
        this.grid = h.grid
        this.elims = [... h.elims, h.guess]
      }
      else this.back()
    }
  }

  get pretty(){
    return this.grid.map(xs=> xs.map(ys=> ys.length <= 1 ? ` ${ys.length ? `<span class="green">${ys[0]}</span>` : '<span class="red">X</span>'} ` : `<span class="gray">[${ys.length}]</span>`).join``).join`\n`
  }
}