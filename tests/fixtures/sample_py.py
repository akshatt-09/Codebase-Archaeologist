import os
from .sample_js import helper

class OrderService:
    def __init__(self, tax_rate):
        self.tax_rate = tax_rate

    def calculate_total(self, items):
        total = 0
        for item in items:
            if item.get('price') and item['price'] > 0:
                total += item['price']
            elif item.get('discount'):
                total -= item['discount']
            else:
                pass
        return total * (1 + self.tax_rate)
