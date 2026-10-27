from django.contrib.auth.mixins import LoginRequiredMixin, UserPassesTestMixin


def is_team_admin(user):
    return user.is_authenticated and hasattr(user, "membership") and user.membership.is_admin


class TeamAdminRequiredMixin(LoginRequiredMixin, UserPassesTestMixin):
    """Anonymous -> redirect to login. Logged-in non-admin -> 403."""

    def test_func(self):
        return is_team_admin(self.request.user)
