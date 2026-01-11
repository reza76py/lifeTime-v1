from django.db import models

class UserProfile(models.Model):
    age = models.PositiveIntegerField()
    life_expectancy = models.PositiveIntegerField(default=80)
    created_at = models.DateTimeField(auto_now_add=True)


class Level1TimeInput(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE)

    sleep_hours_per_day = models.FloatField()
    work_hours_per_day = models.FloatField()
    work_days_per_week = models.PositiveIntegerField()
    commute_hours_per_workday = models.FloatField()
    daily_routine_hours = models.FloatField()

    created_at = models.DateTimeField(auto_now_add=True)



class Level1ComputedResult(models.Model):
    user = models.OneToOneField(UserProfile, on_delete=models.CASCADE)

    remaining_years = models.FloatField()
    sleep_years = models.FloatField()
    work_years = models.FloatField()
    commute_years = models.FloatField()
    routine_years = models.FloatField()
    free_years = models.FloatField()

    updated_at = models.DateTimeField(auto_now=True)


# class Category2Activity(models.Model):
#     user = models.ForeignKey(UserProfile, on_delete=models.CASCADE)
#     name = models.CharField(max_length=100)
#     hours_per_week = models.FloatField(default=0)
#     is_active = models.BooleanField(default=True)


class Category2Activity(models.Model):
    PRESET = "preset"
    USER = "user"

    SOURCE_CHOICES = [
        (PRESET, "Preset"),
        (USER, "User"),
    ]

    user = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="category2_activities",
    )

    name = models.CharField(max_length=255)
    hours_per_week = models.FloatField(default=0)
    source = models.CharField(
        max_length=20,
        choices=SOURCE_CHOICES,
        default=PRESET,
    )
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "name")

    def __str__(self):
        return f"{self.name} ({self.user_id})"
    


    
class Category3Activity(models.Model):
    user = models.ForeignKey(
        UserProfile,
        on_delete=models.CASCADE,
        related_name="category3_activities",
    )

    name = models.CharField(max_length=255)
    hours_per_week = models.FloatField(default=0)
    is_active = models.BooleanField(default=True)

    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ("user", "name")

    def __str__(self):
        return f"{self.name} ({self.user_id})"
