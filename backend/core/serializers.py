from rest_framework import serializers
from .models import UserProfile, Level1TimeInput, Level1ComputedResult, Category2Activity, Category3Activity

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserProfile
        fields = ["id", "age", "life_expectancy"]


class Level1TimeInputSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level1TimeInput
        fields = [
            "sleep_hours_per_day",
            "work_hours_per_day",
            "work_days_per_week",
            "commute_hours_per_workday",
            "daily_routine_hours",
        ]



class Level1ComputedResultSerializer(serializers.ModelSerializer):
    class Meta:
        model = Level1ComputedResult
        fields = [
            "remaining_years",
            "sleep_years",
            "work_years",
            "commute_years",
            "routine_years",
            "free_years",
        ]


class Category2ActivitySerializer(serializers.ModelSerializer):
    source = serializers.ReadOnlyField()

    class Meta:
        model = Category2Activity
        fields = [
            "id",
            "name",
            "hours_per_week",
            "source",
            "is_active",
        ]


class Category3ActivitySerializer(serializers.ModelSerializer):
    class Meta:
        model = Category3Activity
        fields = [
            "id",
            "name",
            "hours_per_week",
            "is_active",
        ]