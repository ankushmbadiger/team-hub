from django.contrib import messages
from django.contrib.auth import get_user_model
from django.db import transaction
from django.shortcuts import redirect
from django.views import View

from .forms import AddMemberForm
from .permissions import TeamAdminRequiredMixin

User = get_user_model()


class AddMemberView(TeamAdminRequiredMixin, View):
    def post(self, request):
        form = AddMemberForm(request.POST)
        if form.is_valid():
            d = form.cleaned_data
            with transaction.atomic():
                user = User.objects.create_user(
                    username=d["username"], email=d["email"], password=d["password"]
                )
                membership = user.membership  # created by the signal
                membership.role = d["role"]
                membership.must_change_password = True
                membership.save()
            messages.success(request, f"Added {user.username}. They must change their password at first login.")
        else:
            for errors in form.errors.values():
                for error in errors:
                    messages.error(request, error)
        return redirect("/team/")
