function getNo(){
  const param = new URLSearchParams(location.search);
  const no = parseInt(param.get('no'));
  if(isNaN(no)){
    return null;
  }else if (no<1){
    return null;
  }return no;
}

async function fetch(no) {
  try {
    return await $.ajax(`http://sample.bmaster.kro.kr/contacts/${no}`);
  } catch(err) {
    console.log(err);
    return null;
  }
}

function printContact(contact) {
  $('#photo').attr('src', contact.photo).css('width', 400).css('height', 400);
  $('#name').text(contact.name);
  $('#address').text(contact.address);
  $('#tel').text(contact.tel);
}