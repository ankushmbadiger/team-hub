from django.contrib import messages
from django.shortcuts import redirect

ALLOWED_PREFIXES = ("/settings/", "/accounts/logout/", "/static/")


class ForcePasswordChangeMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        user = request.user
        if (
            user.is_authenticated
            and hasattr(user, "membership")
            and user.membership.must_change_password
            and not request.path.startswith(ALLOWED_PREFIXES)
        ):
            messages.info(request, "Set a new password to continue.")
            return redirect("/settings/")
        return self.get_response(request)
