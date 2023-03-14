---
layout: post
category: kategori1
title: HTML Kategori Title
description: META DESC
permalink: /kategori1/
---

<ul>
{% for item in site[page.category] reversed %}
   <div class="post">
	<h2 class="post-title">
	  <a href="{{ item.url | absolute_url }}">
		{{ item.title }}
	  </a>
	</h2>
	{{ item.description  }}
  </div>
{% endfor %}
</ul>
