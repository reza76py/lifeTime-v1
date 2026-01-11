from django.urls import path
from .views import (
    UserProfileView,
    Level1InputView,
    Category2View,
    LifeSummaryView,
    Category3View,
)


urlpatterns = [
    path("user-profile/", UserProfileView.as_view()),
    path("level1/<int:user_id>/", Level1InputView.as_view()),

    # Category 2 (single unified view)
    path("category2/<int:user_id>/", Category2View.as_view()),
    path("category2/<int:user_id>/<int:activity_id>/", Category2View.as_view()),
    path("category3/<int:user_id>/", Category3View.as_view()),


    # Life summary
    path("life-summary/<int:user_id>/", LifeSummaryView.as_view()),
]