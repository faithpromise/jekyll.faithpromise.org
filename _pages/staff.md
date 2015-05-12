---
layout: page
title: Meet Our Staff
permalink: /staff/
banner_image: /images/banner-placeholder.png
banner_image: /images/temp/banner-pastor.jpg
---

<div class="Container">
    
    {% for team in site.data.teams %}
    
        <h2>{{ team.title }}</h2>
        
        <ul class="StaffGallery">
            {% for member in site.staff %}
                {% if member.teams contains team.slug %}
                    <li class="StaffGallery-item">
                    {{ member.display_name }}
                    </li>
                {% endif %}
            {% endfor %}
        </ul>
    
    {% endfor %}

</div>