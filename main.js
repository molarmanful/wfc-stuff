let wfc = new WFC()
$('#out').html(wfc.pretty)

$('#play').on('click', e=>{
  let int = setInterval(_=>{
    wfc.observe()
    if(wfc.solved) clearInterval(int)
    $('#out').html(wfc.pretty)
  }, 50)

  $('#rst').on('click', e=>{
    clearInterval(int)
    wfc = new WFC()
    $('#out').html(wfc.pretty)
  })
})