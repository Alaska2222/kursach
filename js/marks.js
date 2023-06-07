const username = localStorage.getItem('username');
const password = localStorage.getItem('password');

const table = document.querySelector('table tbody');
fetch(`http://127.0.0.1:5000/students/${username}`, {
  method: 'GET',
  headers: {
    'Authorization': 'Basic ' + btoa(username + ':' + password)
  }
})
.then((data)=>{
    return data.json();
})
.then((grades)=>{
    for (let i = 0; i < grades.length; i++)
    {
    var row = document.createElement('tr');

    var id = document.createElement('td');
    id.setAttribute('id', 'num');
    id.textContent = grades[i].MarkId;
    var subject = document.createElement('td');
    subject.setAttribute('id', 'sbj');
    subject.textContent = grades[i].SubjectId;
    var teacher = document.createElement('td');
    teacher.setAttribute('id', 'teacherID');
    teacher.textContent = grades[i].TeacherId;
    var mark = document.createElement('td');
    mark.setAttribute('id', 'value');
    mark.textContent = grades[i].Value;
    var date = document.createElement('td');
    date.setAttribute('id', 'date');
    date.textContent = grades[i].DateId;

    row.appendChild(id);
    row.appendChild(subject);
    row.appendChild(teacher);
    row.appendChild(mark);
    row.appendChild(date);
    table.appendChild(row);
    }

  const sortLinks = document.querySelectorAll('.sort-by');

  sortLinks.forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const sortKey = link.getAttribute('id');
    const sortDirection = link.classList.contains('asc') ? -1 : 1;
    const rows = Array.from(document.querySelectorAll('tbody tr'));

    rows.sort((a, b) => {
      const aVal = a.querySelector(`td#${sortKey}`).textContent;
      const bVal = b.querySelector(`td#${sortKey}`).textContent;

      if (isNaN(aVal) || isNaN(bVal)) {
        return aVal.localeCompare(bVal) * sortDirection;
      } else {
        return (parseFloat(aVal) - parseFloat(bVal)) * sortDirection;
      }
    });

    const table = document.querySelector('table');
    const tbody = table.querySelector('tbody');

    rows.forEach(row => {
      tbody.appendChild(row);
    });

    link.classList.toggle('asc');
  });
});
  })
 .catch(error => console.error(error));