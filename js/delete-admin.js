const deleteButton = document.getElementById('delete-user-button');
deleteButton.addEventListener('click', () => {
const url = `http://127.0.0.1:5000/teachers/${username}`; 
const options = {
  method: 'DELETE',
  headers: {
    'Authorization': 'Basic ' + btoa(localStorage.getItem('username') + ':' + localStorage.getItem('password')) 
  }
};
const confirmed = confirm("Are you sure you want to delete this admin?"); 

if (confirmed) { 
  fetch(url, options)
    .then(response => {
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      window.location.href = "/html/home-page.html"; 
      localStorage.clear();
    })
}
});