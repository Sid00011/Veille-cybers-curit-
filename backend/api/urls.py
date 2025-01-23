from django.urls import path
from .views import signup, signin
from .views import VulnerabilityList

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('signin/', signin, name='signin'),
    path('vulnerabilities/', VulnerabilityList.as_view(), name='vulnerability-list'),
]