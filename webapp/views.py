from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as logout_view
from django.contrib.auth.models import User
from django.http import HttpResponse
from social_django.models import UserSocialAuth


def login(request):
    return render(request, 'webapp/login.html', {'user': request.user})

def index(request):
    return render(request, 'webapp/index.html')

def admin(request):
    if request.GET['type'] == "staff":
        return render(request, 'webapp/um.html')
    elif request.GET['type'] == "admin":
        return render(request, 'webapp/admin.html')
    return HttpResponse('')

def terminate(request):
    access_token = UserSocialAuth.objects.get(user=User.objects.get(id=request.user.id)).access_token
    print access_token
    return render(request, 'webapp/terminate.html', {'access_token': access_token})