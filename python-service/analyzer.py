import re

def analyze(text):
    text_lower = text.lower()
    priority = "medium"
    category = "general"

    high_keywords = ["срочно", "срочная", "до пятницы", "важно", "критично", "дедлайн", "клиент"]
    low_keywords = ["не срочно", "можно позже", "не важно"]

    if any(kw in text_lower for kw in low_keywords):
        priority = "low"
    elif any(kw in text_lower for kw in high_keywords):
        priority = "high"

    business_keywords = ["презентация", "клиент", "встреча", "отчет", "бизнес", "контракт", "закупка"]
    personal_keywords = ["купить", "семья", "дома", "ремонт", "здоровье", "спорт"]

    if any(kw in text_lower for kw in business_keywords):
        category = "business"
    elif any(kw in text_lower for kw in personal_keywords):
        category = "personal"

    return priority, category