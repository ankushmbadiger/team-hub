# Create your views here.
from django.contrib.auth.decorators import login_required
from django.shortcuts import render

@login_required
def dashboard(request):
    return render(request, "dashboard.html")




from django.contrib.auth import get_user_model
from django.contrib.auth.mixins import LoginRequiredMixin
from django.views.generic import TemplateView

User = get_user_model()


class PageView(LoginRequiredMixin, TemplateView):
    """Any page that only needs a template and a logged-in user."""


class DashboardView(LoginRequiredMixin, TemplateView):
    template_name = "dashboard.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["member_count"] = User.objects.filter(is_active=True).count()
        return ctx


class TeamView(LoginRequiredMixin, TemplateView):
    template_name = "team.html"

    def get_context_data(self, **kwargs):
        ctx = super().get_context_data(**kwargs)
        ctx["members"] = User.objects.filter(is_active=True).order_by("username")
        return ctx
