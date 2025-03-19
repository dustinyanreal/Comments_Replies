"""
URL configuration for backend project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.0/topics/http/urls/
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
from django.urls import path
from comments import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/comments/', views.comment_list, name='comment-list'),
    path('api/comments/<int:pk>/', views.comment_detail, name='comment-detail'),
    path('api/replies/', views.reply_create, name='reply-create'),
    path('api/comments/<int:comment_id>/replies/', views.get_replies_by_comment, name='comment-replies'),
    path('api/replies/<int:pk>/', views.reply_detail),
]
