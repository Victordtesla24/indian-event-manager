from typing import Any
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app import crud, models
from app.api import deps
from datetime import datetime, timedelta


router = APIRouter()


@router.get("/metrics")
async def get_metrics(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Get admin dashboard metrics
    """
    try:
        # Get total events count and change
        total_events = crud.event.count(db)
        events_last_week = crud.event.count_by_date_range(
            db,
            start_date=datetime.now() - timedelta(days=14),
            end_date=datetime.now() - timedelta(days=7)
        )
        events_this_week = crud.event.count_by_date_range(
            db,
            start_date=datetime.now() - timedelta(days=7),
            end_date=datetime.now()
        )
        events_change = calculate_percentage_change(
            events_last_week,
            events_this_week
        )

        # Get active users count and change
        active_users = crud.user.count_active(db)
        users_last_week = crud.user.count_active_by_date_range(
            db,
            start_date=datetime.now() - timedelta(days=14),
            end_date=datetime.now() - timedelta(days=7)
        )
        users_this_week = crud.user.count_active_by_date_range(
            db,
            start_date=datetime.now() - timedelta(days=7),
            end_date=datetime.now()
        )
        users_change = calculate_percentage_change(
            users_last_week,
            users_this_week
        )

        # Get sponsors count and change
        total_sponsors = crud.sponsor.count(db)
        sponsors_last_week = crud.sponsor.count_by_date_range(
            db,
            start_date=datetime.now() - timedelta(days=14),
            end_date=datetime.now() - timedelta(days=7)
        )
        sponsors_this_week = crud.sponsor.count_by_date_range(
            db,
            start_date=datetime.now() - timedelta(days=7),
            end_date=datetime.now()
        )
        sponsors_change = calculate_percentage_change(
            sponsors_last_week,
            sponsors_this_week
        )

        # Calculate engagement rate (events per active user)
        engagement_rate = round(
            total_events / active_users if active_users > 0 else 0,
            2
        )
        engagement_last_week = round(
            events_last_week / users_last_week if users_last_week > 0 else 0,
            2
        )
        engagement_this_week = round(
            events_this_week / users_this_week if users_this_week > 0 else 0,
            2
        )
        engagement_change = calculate_percentage_change(
            engagement_last_week,
            engagement_this_week
        )

        return [
            {
                "value": total_events,
                "change": events_change
            },
            {
                "value": active_users,
                "change": users_change
            },
            {
                "value": total_sponsors,
                "change": sponsors_change
            },
            {
                "value": engagement_rate,
                "change": engagement_change
            }
        ]

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching metrics: {str(e)}"
        )


@router.get("/trends")
async def get_trends(
    db: Session = Depends(deps.get_db),
    current_user: models.User = Depends(deps.get_current_admin_user),
) -> Any:
    """
    Get event trends data for the dashboard charts
    """
    try:
        # Get daily event counts for the last 7 days
        end_date = datetime.now()
        start_date = end_date - timedelta(days=7)
        daily_counts = crud.event.get_daily_counts(db, start_date, end_date)

        # Format data for the chart
        labels = []
        values = []
        current_date = start_date
        while current_date <= end_date:
            date_str = current_date.strftime('%a')  # Day name (Mon, Tue, etc.)
            count = daily_counts.get(current_date.date(), 0)
            
            labels.append(date_str)
            values.append(count)
            
            current_date += timedelta(days=1)

        return {
            "labels": labels,
            "values": values
        }

    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Error fetching trends: {str(e)}"
        )


def calculate_percentage_change(old_value: float, new_value: float) -> float:
    """Calculate percentage change between two values"""
    if old_value == 0:
        return 100 if new_value > 0 else 0
    return round(((new_value - old_value) / old_value) * 100, 1)
