(function(document) {
  var toggle = document.querySelector('.sidebar-toggle');
  var sidebar = document.querySelector('#sidebar');
  var checkbox = document.querySelector('#sidebar-checkbox');

  document.addEventListener('click', function(e) {
    var target = e.target;

    if(!checkbox.checked ||
       sidebar.contains(target) ||
       (target === checkbox || target === toggle)) return;

    checkbox.checked = false;
  }, false);
  
  
  // On toggler clicked

	var container = document.body;
	var theme_toggle = document.getElementById('toggler');
	
	var theme = localStorage.getItem("theme");
	if(theme == "dark"){
		theme_toggle.checked = true;
		container.classList.add("dark-mode");
	}

	theme_toggle.addEventListener('change', (event) => {
	  container.classList.toggle("dark-mode");
	  if (theme_toggle.checked) {
		localStorage.setItem("theme", "dark");
	  } else {
		localStorage.setItem("theme", "light");
	  }
	});
	   


})(document);
