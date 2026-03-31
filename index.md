---
layout: default
title: Home
---

<div class="home-hero">
  <h1>Documentation &amp; Guides</h1>
  <p>A personal reference portal for how-to guides, notes, and documentation across various topics.</p>
  <a href="/guides/" class="btn">Browse all guides</a>
</div>

{% assign guides = site.guides | sort: 'title' %}
{% if guides.size > 0 %}
  <p class="section-label">Recent guides</p>
  <div class="guide-grid">
    {% for guide in guides limit: 6 %}
      <a class="guide-card" href="{{ guide.url | relative_url }}">
        {% if guide.category %}
          <span class="guide-card-category">{{ guide.category }}</span>
        {% endif %}
        <h3>{{ guide.title }}</h3>
        {% if guide.description %}
          <p>{{ guide.description }}</p>
        {% endif %}
      </a>
    {% endfor %}
  </div>
{% endif %}
