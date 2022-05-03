let wfc = new WFC()
$('#out').html(wfc.pretty)

let int

let step = a=>{
  wfc.observe()
  if(wfc.solved) clearInterval(int)
  $('#out').html(wfc.pretty)
}

$('#play').on('click', e=>{
  int = setInterval(step, 50)
})

$('#next').on('click', e=>{
  clearInterval(int)
  step()
})

$('#reset').on('click', e=>{
  clearInterval(int)
  wfc = new WFC()
  $('#out').html(wfc.pretty)
})