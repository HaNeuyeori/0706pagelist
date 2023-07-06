let $tbody, $pagination;
let pagesize = 10; 

function getPageno() {
  const param = new URLSearchParams(location.search).get('pageno');
  const pageno = parseInt(param);
  if(isNaN(pageno))
    return 1;
  else if(pageno<1)
    return 1;
  else 
    return pageno;
}

async function getAjaxResponse(pageno, pagesize) {
  const url = `http://sample.bmaster.kro.kr/contacts?pageno=${pageno}&pagesize=${pagesize}`;
  return await $.ajax(url);
}

function printContacts(contacts) {
  $tbody.empty();
  for (const c of contacts) {
    const html = `
      <tr>
        <td>${c.no}</td>
        <td>${c.name}</td>
        <td>${c.address}</td>
        <td>${c.tel}</td>
      </tr>
    `;
    const row = $(html).appendTo($tbody);   
    row.on('click', function() {
      window.location.href = `/menulink.html?no=${c.no}`;
    });
  }
}

function getPagination(totalcount, pageno, pagesize) {
  const totalpages = Math.ceil(totalcount / pagesize);
  let start = Math.max(1, pageno - 2);
  let end = Math.min(totalpages, pageno + 2);
  let prev = (pageno > 1) ? pageno - 1 : 0;
  let next = (pageno < totalpages) ? pageno + 1 : 0;
  return { prev, start, end, next };
}

function printPagination(p, pageno) {
  $pagination.empty();
  if (p.prev > 0) {
    const html = `
    <li class="page-item">
      <a class="page-link" data-page="${p.prev}" href="#">이전으로</a>
      </li>
      `;
    $pagination.append(html);
  }
  for (let i = p.start; i <= p.end; i++) {
    let li_class = "page-item";
    if (i === pageno)
      li_class = "page-item active";
    const html = `
    <li class="${li_class}">
      <a class="page-link" data-page="${i}" href="#">${i}</a>
      </li>
      `;
    $pagination.append(html);
  }
  if (p.next > 0) {
    const html = `
    <li class="page-item">
      <a class="page-link" data-page="${p.next}" href="#">다음으로</a>
      </li>
      `;
    $pagination.append(html);
  }
}

async function loadPage(pageno) {
  try {
    const load = await getAjaxResponse(pageno, pagesize);
    const pagination = getPagination(load.totalcount, load.pageno, load.pagesize);
    printContacts(load.contacts);
    printPagination(pagination, load.pageno);
  } catch (err) {
    console.error(err);
  }
}

$(document).ready(function () {
  $tbody = $('#tbody');
  $pagination = $('#pagination');

  loadPage(getPageno());

  $pagination.on("click", "a.page-link", function (event) {
    event.preventDefault();
    const pageno = $(this).data("page");
    loadPage(pageno);
  });
});