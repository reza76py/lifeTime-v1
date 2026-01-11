from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.shortcuts import get_object_or_404
from rest_framework.exceptions import ValidationError
from .utils import calculate_level1, calculate_cat2_years, DAYS_PER_YEAR, WEEKS_PER_YEAR


from .models import UserProfile, Level1TimeInput, Level1ComputedResult, Category2Activity, Category3Activity
from .serializers import (
    UserProfileSerializer,
    Level1TimeInputSerializer,
    Level1ComputedResultSerializer,
    Category2ActivitySerializer,
    Category3ActivitySerializer,
)
from .utils import calculate_level1, calculate_cat2_years


class UserProfileView(APIView):

    def get(self, request):
        return Response(
            {"message": "POST age and life_expectancy to create a user profile."},
            status=status.HTTP_200_OK,
        )

    def post(self, request):
        serializer = UserProfileSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)


class Level1InputView(APIView):
    def post(self, request, user_id):
        user = UserProfile.objects.get(id=user_id)

        serializer = Level1TimeInputSerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        input_obj, _ = Level1TimeInput.objects.update_or_create(
            user=user,
            defaults=serializer.validated_data
        )

        result_data = calculate_level1(user, input_obj)

        result_obj, _ = Level1ComputedResult.objects.update_or_create(
            user=user,
            defaults=result_data
        )

        return Response(
            Level1ComputedResultSerializer(result_obj).data,
            status=status.HTTP_200_OK
        )
    


class Category2ActivityView(APIView):
    def get(self, request, user_id):
        user = get_object_or_404(UserProfile, id=user_id)
        activities = Category2Activity.objects.filter(user=user).order_by("created_at")
        return Response(Category2ActivitySerializer(activities, many=True).data)

    def post(self, request, user_id):
        user = get_object_or_404(UserProfile, id=user_id)

        serializer = Category2ActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        activity = serializer.save(user=user, source=Category2Activity.PRESET)
        return Response(Category2ActivitySerializer(activity).data, status=status.HTTP_201_CREATED)


class Category2View(APIView):

    def get(self, request, user_id):
        user = get_object_or_404(UserProfile, id=user_id)
        activities = Category2Activity.objects.filter(user=user, is_active=True)
        serializer = Category2ActivitySerializer(activities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, user_id):
        user = get_object_or_404(UserProfile, id=user_id)

        serializer = Category2ActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        activity = serializer.save(
            user=user,
            source=Category2Activity.PRESET,
        )

        return Response(
            Category2ActivitySerializer(activity).data,
            status=status.HTTP_201_CREATED,
        )

    def patch(self, request, user_id, activity_id):
        user = get_object_or_404(UserProfile, id=user_id)
        activity = get_object_or_404(
            Category2Activity, id=activity_id, user=user
        )

        serializer = Category2ActivitySerializer(
            activity, data=request.data, partial=True
        )
        serializer.is_valid(raise_exception=True)
        serializer.save()

        return Response(serializer.data, status=status.HTTP_200_OK)


class Category3View(APIView):
    def get(self, request, user_id):
        user = get_object_or_404(UserProfile, id=user_id)
        activities = Category3Activity.objects.filter(user=user, is_active=True)
        serializer = Category3ActivitySerializer(activities, many=True)
        return Response(serializer.data, status=status.HTTP_200_OK)

    def post(self, request, user_id):
        user = get_object_or_404(UserProfile, id=user_id)

        serializer = Category3ActivitySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)

        activity = serializer.save(user=user)
        return Response(
            Category3ActivitySerializer(activity).data,
            status=status.HTTP_201_CREATED,
        )




class LifeSummaryView(APIView):
    """
    Returns:
    - level1: base category1 result
    - maintenance_years: total cat2 consumption in years
    - adjusted: same as level1, but free_years reduced by maintenance_years
    """

    def get(self, request, user_id):
        user = get_object_or_404(UserProfile, id=user_id)

        # If Level1 result doesn't exist yet, return a clean message (NOT 500)
        try:
            level1 = Level1ComputedResult.objects.get(user=user)
        except Level1ComputedResult.DoesNotExist:
            return Response(
                {"detail": "Level1 result not found. Submit Category1 inputs first."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        remaining_years = level1.remaining_years

        activities = Category2Activity.objects.filter(user=user, is_active=True)
        activity_breakdown = []
        for a in activities:
            years = (a.hours_per_week * WEEKS_PER_YEAR * remaining_years) / (24 * DAYS_PER_YEAR)
            if years > 0:
                activity_breakdown.append({
                    "label": a.name,
                    "years": years,
                })

        cat3_activities = Category3Activity.objects.filter(user=user, is_active=True)

        cat3_breakdown = []
        for a in cat3_activities:
            years = (a.hours_per_week * WEEKS_PER_YEAR * remaining_years) / (24 * DAYS_PER_YEAR)
            if years > 0:
                cat3_breakdown.append({
                    "label": a.name,
                    "years": years,
                })

        leakage_years = calculate_cat2_years(cat3_activities, remaining_years)


        maintenance_years = calculate_cat2_years(activities, remaining_years)

        adjusted_free = max(level1.free_years - maintenance_years - leakage_years, 0)

        return Response(
            {
                "level1": {
                    "remaining_years": level1.remaining_years,
                    "sleep_years": level1.sleep_years,
                    "work_years": level1.work_years,
                    "commute_years": level1.commute_years,
                    "routine_years": level1.routine_years,
                    "free_years": level1.free_years,
                },
                "maintenance_years": maintenance_years,
                "leakage_years": leakage_years,
                "category2": activity_breakdown,
                "category3": cat3_breakdown,
                "adjusted": {
                    "remaining_years": level1.remaining_years,
                    "sleep_years": level1.sleep_years,
                    "work_years": level1.work_years,
                    "commute_years": level1.commute_years,
                    "routine_years": level1.routine_years,
                    "free_years": adjusted_free,
                },
            },
            status=status.HTTP_200_OK,
        )
