

if(localStorage.getItem('username') == null && localStorage.getItem('password') == null){
    let heading = document.getElementById("login-a");
    let user_page = document.getElementById("user-a");
    heading.innerHTML = "Login";
    function UserPage() {
        window.location.href = "/html/login-page.html";
      }

      user_page.addEventListener("click", UserPage);

} else {
    let heading = document.getElementById("login-a");
    let user_page = document.getElementById("user-a");
    heading.innerHTML = "Logout";

    function changeToLogin() {
        localStorage.clear();
        heading.innerHTML = "Login";
      }

    heading.addEventListener("click", changeToLogin);

    function UserPage(role) {
        if(role == "admin"){
        window.location.href = "/html/admin-page.html";
    }
       else if(role == "user"){
        window.location.href = "/html/user-page.html";
      }
    }

      user_page.addEventListener("click", UserPage());
}