let wfc = new WFC()
$('#out').html(wfc.pretty)

let int

let step = e=>{
  wfc.observe()
  if(wfc.solved) clearInterval(int)
  $('#out').html(wfc.pretty)
}

let reset = e=>{
  clearInterval(int)
  wfc = new WFC()
}

$('#play').on('click', e=>{
  int = setInterval(step, 50)
})

$('#next').on('click', e=>{
  clearInterval(int)
  step()
})

$('#reset').on('click', e=>{
  reset()
  $('#out').html(wfc.pretty)
})

$('#import').on('click', e=>{
  reset()

  let g = $('#code').val().split(/\n+/).map(a=> a.split(/\s*/).map(b=> +b || undefined))

  wfc.load(g)

  $('#out').html(wfc.pretty)
})