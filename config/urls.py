"""
URL configuration for config project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/6.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from django.views.generic import RedirectView
from core.views import PageView, DashboardView, TeamView
from accounts.views import ChangePasswordView
from teams.views import AddMemberView
urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("django.contrib.auth.urls")),
    path("", RedirectView.as_view(url="/dashboard/")),
    path("dashboard/", DashboardView.as_view()),
    path("chat/", PageView.as_view(template_name="chat.html")),
    path("chat/<slug:slug>/", PageView.as_view(template_name="chat.html")),
    path("files/", PageView.as_view(template_name="files.html")),
    path("team/", TeamView.as_view()),
    path("settings/", PageView.as_view(template_name="settings.html")),
    path("team/add/", AddMemberView.as_view()),
    path("settings/password/", ChangePasswordView.as_view()),
]
