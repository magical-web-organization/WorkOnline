---
---
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

	function admin(){
		var edit_button = document.createElement('button');
		edit_button.id = 'edit_button';
		edit_button.innerText = 'Edit';
		edit_button.addEventListener('click', edit);
		edit_button.classList.add('sticky-button');
		document.body.appendChild(edit_button);
	}


var Editor, editor;

	async function edit(){
		document.querySelector('#edit_button').remove();
		
		document.querySelector('#editor').innerHTML = "";
		
		
		var toast_css = document.createElement( "link" );
		toast_css.href = "/public/css/toastui-editor.css";
		toast_css.type = "text/css";
		toast_css.rel = "stylesheet";
		toast_css.media = "screen,print";

		document.getElementsByTagName( "head" )[0].appendChild( toast_css );
		
		
		var toast_js = document.createElement( "script" );
		toast_js.src = "/public/js/toastui-editor-all.min.js";

		document.getElementsByTagName( "head" )[0].appendChild( toast_js );
		
		toast_js.onload = async function(){
			
			Editor = toastui.Editor;
			
			// fetch the md
			let request = await fetch("http://localhost/magical-web-presence/Markdownitor.php?type=fetch&repo={{site.repo}}&post="+window.location.pathname);
			let raw_md = await request.text();
			raw_md = raw_md.slice(3); // remove first "---"
			
			var separator = '---';
			var index = raw_md.indexOf(separator, separator.length);
			var raw_front_matter = raw_md.slice(0, index);
			var markdown_body = raw_md.slice(index + separator.length).trim();
			
			
			
			var parsed_fm = raw_front_matter.split("\r\n");
			
			var kvArr = [];
			
			parsed_fm.forEach(function(line, indexofline){
				if(line.includes(":")){
					var parsed_line = line.split(":");
					var separator = ':';
					var index = line.indexOf(separator, separator.length);
					var keyfm = line.slice(0, index);
					var valfm = line.slice(index + separator.length).trim();
					
					if(parsed_line[0]){
						kvArr.push([keyfm, valfm]);
					}
				}
			});
			
			const form = document.createElement('form');
			form.id = "frontmatter";
			
			const div = document.createElement('div');
			
			kvArr.forEach(function(kv, key){
				const row = document.createElement('div');
				row.classList.add('row');
				if(["layout", "date", "slug", "original", "last_modified_at"].includes(kv[0])){
					row.style.display = "none";
				}

				const value_div = document.createElement('div');
				value_div.classList.add('value');
				if(kv[0] == "description"){
					var value_input = document.createElement('textarea');
				}else{
					var value_input = document.createElement('input');
				}
				
				value_input.name = kv[0];
				value_input.value = kv[1];
				value_div.appendChild(value_input);
				
				const aibtn_div = document.createElement('div');
				aibtn_div.classList.add('aibtn');
				var aibtn = document.createElement('button');
				
				aibtn.type = "button";
				aibtn.classList.add('airw');
				aibtn.innerHTML = "rw";
				aibtn_div.appendChild(aibtn);
				aibtn.addEventListener('click', rw);

				row.appendChild(value_div);
				row.appendChild(aibtn_div);
				div.appendChild(row);
			});
			
			
			form.appendChild(div);
			document.getElementsByClassName( "article-body" )[0].prepend( form );
			
			
			

			editor = new Editor({
				el: document.querySelector('#editor'),
				height: 'auto',//auto
				initialEditType: 'wysiwyg',//markdown
				initialValue: markdown_body,
				previewStyle: 'tab',//vertical 
				usageStatistics: false,
			});


			var save_button = document.createElement('button');
			save_button.id = 'save_button';
			save_button.innerText = 'Save';
			save_button.addEventListener('click', save);
			save_button.classList.add('sticky-button');
			document.body.appendChild(save_button);
			
			var delete_button = document.createElement('button');
			delete_button.id = 'delete_button';
			delete_button.innerText = 'Delete';
			delete_button.addEventListener('click', del);
			delete_button.classList.add('sticky-button');
			document.body.appendChild(delete_button);
			
			
		}
	}
	
	function rw(){
		var that = this;
		var elem = this.parentNode.previousElementSibling.firstChild
		var _to_rw = this.parentNode.previousElementSibling.firstChild.value
		var type = this.parentNode.previousElementSibling.firstChild.name;
		elem.disabled = true
		that.disabled = true
		
		console.log(_to_rw)
		fetch("http://localhost/magical-web-presence/ai.php?type="+type+"&rw="+_to_rw)
		  .then(response => {
			elem.disabled = false
			that.disabled = false
			if (response.ok) {
			  return response.text();
			} else {
			  throw new Error('Network response was not ok');
			}
		  })
		  .then(data => {
			console.log(data);
			if(data){
				elem.value = data;
			}else{
				alert("Err: gpt failed: " + data);
			}
		  })
		  .catch(error => {
			console.error('Error:', error);
		  });
	}
	
	function save(){
		document.querySelector('#save_button').disabled = true;
		document.querySelector('#save_button').style.backgroundColor = 'green';
		setTimeout(function(){
			document.querySelector('#save_button').disabled = false;
			document.querySelector('#save_button').style.backgroundColor = 'blue';
		},2500);
		// get the md and post to php
		
		
		var markdown_to_save = editor.getMarkdown();
		
		const form = document.getElementById('frontmatter');
		
		const formData = new FormData(form);
		formData.append('markdown', markdown_to_save);
		
		var markdown = "---\r\n";
		
		for (let [key, val] of formData.entries()) {
			if(key == "last_modified_at"){
				val = new Date().toISOString().substr(0, 19).replace('T', ' ') + " +0300";
			}
			if(key != "markdown"){
				markdown = markdown + key + ": " + val + "\r\n";
			}
		}
		
		var markdown = markdown + "---\r\n";
		var markdown = markdown + markdown_to_save;


		const formToSend = new FormData();
		formToSend.append('markdown', markdown);


		const options = {
		  method: 'POST',
		  body: formToSend
		};

		fetch("http://localhost/magical-web-presence/Markdownitor.php?type=save&repo={{site.repo}}&post="+window.location.pathname, options)
		  .then(response => {
			if (response.ok) {
			  return response.json();
			} else {
			  throw new Error('Network response was not ok');
			}
		  })
		  .then(data => {
			console.log(data);
		  })
		  .catch(error => {
			console.error('Error:', error);
		  });
		  
		  
	}
	
	function del(){
		document.querySelector('#delete_button').disabled = true;
		
		fetch("http://localhost/magical-web-presence/Markdownitor.php?type=delete&repo={{site.repo}}&post="+window.location.pathname)
		  .then(response => {
			if (response.ok) {
			  return response.json();
			} else {
			  throw new Error('Network response was not ok');
			}
		  })
		  .then(data => {
			console.log(data);
			if(data == "1"){
				window.location.href = "/";
			}else{
				alert("Err: delete failed.");
			}
		  })
		  .catch(error => {
			console.error('Error:', error);
		  });
		  
	}
	