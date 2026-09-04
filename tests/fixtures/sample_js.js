import React from 'react';
import { calculateTotal } from './sample_py';

export function OrderSummary({ items }) {
    if (!items || items.length === 0) {
        return <div>No items found</div>;
    }
    const total = calculateTotal(items);
    return <div>Total: {total}</div>;
}