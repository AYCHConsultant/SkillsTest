from django.conf.urls import url

from skill_api import views

app_name = 'skill_api'

urlpatterns = [
    url(r'^$', views.home, name='home'),
    url(r'^api/skill$', views.SkillCreateListView.as_view(), name='skill-create-list'),
    url(r'^api/skill/(?P<pk>[0-9]+)$', views.SkillRetrieveUpdateDestroyView.as_view(), name='skill-retrieve-update-destroy')
]
