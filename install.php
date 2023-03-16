<?php

	function slugify($text, string $divider = '-'){
		// replace non letter or digits by divider
		$text = preg_replace('~[^\pL\d]+~u', $divider, $text);

		// transliterate
		$text = iconv('utf-8', 'us-ascii//TRANSLIT', $text);

		// remove unwanted characters
		$text = preg_replace('~[^-\w]+~', '', $text);

		// trim
		$text = trim($text, $divider);

		// remove duplicate divider
		$text = preg_replace('~-+~', $divider, $text);

		// lowercase
		$text = strtolower($text);

		if (empty($text)) {
			return 'n-a';
		}

		return $text;
	}

	if(!empty($_POST)){

		$title = $_POST['title'];
		$tagline = $_POST['tagline'];
		$description = $_POST['description'];
		$url = $_POST['url'];
		$repo = basename(dirname($_SERVER['PHP_SELF']));
		$ga_id = $_POST['google_analytics_id'];
		$about = $_POST['about'];

		$config = "title: $title
tagline: '$tagline'
description: '$description'
url: $url
repo: $repo
google_analytics_id: $ga_id
permalink: ':categories/:title.html'

exclude: [\"z_serve.bat\", \"*.ai\", \"install.php\"]

collections_dir: data
collections:";

		foreach($_POST["category_name"] as $k => $category_name){
			if(!$category_name){continue;}
			$cat_desc = $_POST["category_description"][$k];
			$config .= "
  " . slugify($category_name) . ":
    name: $category_name
    output: true
    permalink: /:collection/:name.html
";
		}
		

		$config .= "
# Gems
plugins:
  - jekyll-sitemap
";


		file_put_contents("_config.yml", $config);
		
		$ai_content_for_the_first_category = "Learn Markdown with Sample File";
		
		foreach($_POST["category_name"] as $k => $category_name){
			if(!$category_name){continue;}
			$cat_desc = $_POST["category_description"][$k];
			$cat_slug = slugify($category_name);
			
			$cat_front_matter = "---
layout: category
category: ".$cat_slug."
title: ".$category_name."
description: ".$cat_desc."
permalink: /".$cat_slug."/
---";

			if (!file_exists("data/_" . $cat_slug)) { mkdir("data/_" . $cat_slug, 0777, true); }
			
			file_put_contents("data/_" . $cat_slug . "/_.ai", $ai_content_for_the_first_category);
			$ai_content_for_the_first_category = "";
		
			file_put_contents("data/" . $cat_slug . ".md", $cat_front_matter);
		}


		$about_us = "---
layout: page
title: About ".$title."
description: Information about ".$title."
permalink: /about/
---
" . $about;

		file_put_contents("data/about.md", $about_us);
	
	
		echo "Site kuruldu! z_serve.bat dosyasını çalıştır ve <a href = 'http://localhost:4000'>http://localhost:4000</a> adresine git.<br>";
		echo "İlk içeriğin otomatik üretilmesi için <a target = '_blank' href = 'http://localhost/magical-web-presence/ai.php'>AI Generator</a> botunu çalıştır. (uzun sürecektir.)<br>";
		echo "Bundan sonraki içeriklerin AI Generator tarafından üretilmesi için 'data' klasöründeki her bir kategori klasörüne girip '_.ai' dosyasının içine her bir satıra bir konu gelecek şekilde liste hazırlanmalıdır ve bot çalıştırılmalıdır. Başarıyla üretilen içerikler o listeden kaldırılacaktır.";

		exit;
	}
?>
<!DOCTYPE html>
<html>
<head>
  <title>Site Kurulum Formu</title>
  <!-- CSS -->
<link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@5.2.3/dist/css/bootstrap.min.css" crossorigin="anonymous">


</head>
<body>
  <div style = "width:75%;margin:40px auto">
	  <h1>Site Kurulum Formu</h1>
	  <p>
		Bütün alanlar dolu olmalı. <br>
		Henüz bilinmeyenler (domain, analytics id) olduğu gibi kalabilir. <br>
		<span style = "color:red">Aynı site bir sebepten dolayı ikinci kez kuruluyorsa temiz bir kurulum için önce "data" klasörü silinmeli. </span>
	  </p>
	  
	  <form method="POST">
	  <div class="form-group">
		<label for="title">Site Adı:</label>
		<input type="text" class="form-control" id="title" name="title" required>
	  </div>
		<br />
		
	  <div class="form-group">
		<label for="tagline">Slogan:</label>
		<input type="text" class="form-control" id="tagline" name="tagline" required>
	  </div>
		<br />

	  <div class="form-group">
		<label for="description">Kısa Tanım (SEO için):</label>
		<textarea class="form-control" id="description" name="description" required></textarea>
	  </div>
		<br />

	  <div class="form-group">
		<label for="url">https://domain.com:</label>
		<input type="url" class="form-control" id="url" name="url" value = "https://localhost:4000" required>
	  </div>
		<br />

	  <div class="form-group">
		<label for="google_analytics_id">Google Analytics ID:</label>
		<input type="text" class="form-control" id="google_analytics_id" name="google_analytics_id" value = "G-XXXXXXXXXX" required>
	  </div>
		<br />

	  <div class="form-group">
		<label for="description">Hakkımızda Sayfası:</label>
		<small>Hakkımzda sayfası markdown formatında olmalıdır. chatgpt prompt:[Create an "About Us" page about <b>"Insurance Wiki"</b> using markdown formatting in a code block.]</small>
		<textarea class="form-control" id="about" name="about" required></textarea>
	  </div>
		<br />

	  <div class="form-group">
		<label for="categories">Kategoriler:</label>
		<small>Kategori satırlarından en az 1 tanesi dolu olmalı, fazladan boş satır olursa sorun yok.</small>
		<table id = "cats" class="table">
		  <thead>
			<tr>
			  <th>Kategori Adı</th>
			  <th>Kısa Tanım (SEO için)</th>
			</tr>
		  </thead>
		  <tbody>
			<tr>
			  <td><input type="text" class="form-control" name="category_name[]" required></td>
			  <td><input type="text" class="form-control" name="category_description[]" required></td>
			</tr>
		  </tbody>
		</table>
		<button type = "button" id="add-row-btn" class="btn btn-primary" style = "float:right">Add Row</button>
	  </div>

	  <button type="submit" class="btn btn-success" style = "display:block; margin:250px auto; width:120px; ">Kur</button>
	</form>
</div>
<script>
document.addEventListener('DOMContentLoaded', function() {
  // Get the table body element
  var tbody = document.querySelector('#cats tbody');
  
  // Get the button element
  var button = document.querySelector('#add-row-btn');
  
  // Add row on button click
  button.addEventListener('click', function() {
    // Create a new table row element
    var newRow = document.createElement('tr');
    
    // Create two new table cell elements
    var nameCell = document.createElement('td');
    var nameInput = document.createElement('input');
    nameInput.setAttribute('type', 'text');
    nameInput.setAttribute('class', 'form-control');
    nameInput.setAttribute('name', 'category_name[]');
    nameCell.appendChild(nameInput);
    
    var descriptionCell = document.createElement('td');
    var descriptionInput = document.createElement('input');
    descriptionInput.setAttribute('type', 'text');
    descriptionInput.setAttribute('class', 'form-control');
    descriptionInput.setAttribute('name', 'category_description[]');
    descriptionCell.appendChild(descriptionInput);
    
    // Add the cells to the row
    newRow.appendChild(nameCell);
    newRow.appendChild(descriptionCell);
    
    // Add the row to the table body
    tbody.appendChild(newRow);
  });
});
</script>
</body>
</html>

