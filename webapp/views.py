from django.shortcuts import render
from django.http import HttpResponseRedirect
from django.contrib.auth.decorators import login_required
from django.contrib.auth import logout as logout_view
from django.contrib.auth.models import User
from django.http import HttpResponse
from social_django.models import UserSocialAuth


def login(request):
    # if request.user.is_authenticated:
    #     if request.user.is_superuser:
    #         return HttpResponseRedirect('/admin')
    #     if request.user.is_staff:
    #         return HttpResponseRedirect('/manager')
    #     return HttpResponseRedirect('/')
    return render(request, 'webapp/login.html', {'user': request.user})

def index(request):
    return render(request, 'webapp/index.html')

def admin(request):
    # if not request.user.is_superuser:
    #     return HttpResponseRedirect('/')
    return render(request, 'webapp/admin.html')

def user_manager(request):
    # if not request.user.is_staff:
    #     return HttpResponseRedirect('/')
    return render(request, 'webapp/um.html')

def terminate(request):
    print "id", request.user.id
    access_token = UserSocialAuth.objects.get(user=User.objects.get(id=request.user.id)).access_token
    print access_token
    return render(request, 'webapp/terminate.html', {'access_token': access_token})

# def logout(request):
#     logout_view(request)
#     return HttpResponseRedirect('/login')

def register(request):
    print request.POST
    User.objects.create_user(username=request.POST['username'], password=request.POST['password'])
    return HttpResponse('')
