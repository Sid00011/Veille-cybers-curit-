from django.urls import path
from .views import signup, signin
from .views import VulnerabilityList
from .views import get_vulnerability_by_cve
from .views import send_email

urlpatterns = [
    path('signup/', signup, name='signup'),
    path('signin/', signin, name='signin'),
    path('vulnerabilities/', VulnerabilityList.as_view(), name='vulnerability-list'),
    path('vulnerabilities/<str:code_cve>/', get_vulnerability_by_cve, name='vulnerability-detail'),
    path('send-email/', send_email, name='send_email'),  
]