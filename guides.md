---
layout: default
title: Guides
---

{% assign guides = site.guides | sort: 'title' %}
{% assign categories = guides | map: 'category' | uniq | sort %}

<div class="guides-index">
  <h1>All guides</h1>
  <p>Browse how-to guides and documentation by topic.</p>

  {% for category in categories %}
    {% if category %}
      <div class="guides-category-section">
        <p class="guides-category-title">{{ category }}</p>
        <ul class="guides-list">
          {% for guide in guides %}
            {% if guide.category == category %}
              <li>
                <a href="{{ guide.url | relative_url }}">
                  <span>{{ guide.title }}</span>
                  {% if guide.description %}
                    <span class="guide-desc">{{ guide.description }}</span>
                  {% endif %}
                </a>
              </li>
            {% endif %}
          {% endfor %}
        </ul>
      </div>
    {% endif %}
  {% endfor %}

  {% assign uncategorized = guides | where_exp: "g", "g.category == nil or g.category == ''" %}
  {% if uncategorized.size > 0 %}
    <div class="guides-category-section">
      <p class="guides-category-title">Other</p>
      <ul class="guides-list">
        {% for guide in uncategorized %}
          <li>
            <a href="{{ guide.url | relative_url }}">
              <span>{{ guide.title }}</span>
              {% if guide.description %}
                <span class="guide-desc">{{ guide.description }}</span>
              {% endif %}
            </a>
          </li>
        {% endfor %}
      </ul>
    </div>
  {% endif %}
</div>
