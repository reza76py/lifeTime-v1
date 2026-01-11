
# core/utils.py

DAYS_PER_YEAR = 365
WEEKS_PER_YEAR = 52

def calculate_level1(user, input_data):
    remaining_years = user.life_expectancy - user.age

    sleep_years = (
        input_data.sleep_hours_per_day * DAYS_PER_YEAR * remaining_years
    ) / (24 * DAYS_PER_YEAR)

    work_years = (
        input_data.work_hours_per_day *
        input_data.work_days_per_week *
        WEEKS_PER_YEAR *
        remaining_years
    ) / (24 * DAYS_PER_YEAR)

    commute_years = (
        input_data.commute_hours_per_workday *
        input_data.work_days_per_week *
        WEEKS_PER_YEAR *
        remaining_years
    ) / (24 * DAYS_PER_YEAR)

    routine_years = (
        input_data.daily_routine_hours * DAYS_PER_YEAR * remaining_years
    ) / (24 * DAYS_PER_YEAR)

    free_years = remaining_years - (
        sleep_years + work_years + commute_years + routine_years
    )

    return {
        "remaining_years": remaining_years,
        "sleep_years": sleep_years,
        "work_years": work_years,
        "commute_years": commute_years,
        "routine_years": routine_years,
        "free_years": max(free_years, 0),
    }

def calculate_cat2_years(activities, remaining_years):
    """
    Convert Category2 hours/week into years, capped to remaining_years.
    """
    total_hours_per_week = sum(
        a.hours_per_week for a in activities if getattr(a, "is_active", True)
    )

    total_hours = total_hours_per_week * WEEKS_PER_YEAR * remaining_years

    maintenance_years = total_hours / (24 * DAYS_PER_YEAR)

    # Clamp
    if maintenance_years < 0:
        maintenance_years = 0
    if maintenance_years > remaining_years:
        maintenance_years = remaining_years

    return maintenance_years
