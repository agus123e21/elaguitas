import { describe, it, expect } from 'vitest';
import { computeDiscount, findActivePromotionByCode } from '../src/modules/promotions/promotions.service.js';

const base = { subtotal: 10000, deliveryFee: 1000, lines: [], totalQuantity: 1 };

describe('computeDiscount', () => {
  it('devuelve cero sin promoción', () => {
    const result = computeDiscount(null, base);
    expect(result.discount).toBe(0);
    expect(result.deliveryFee).toBe(1000);
    expect(result.applied).toBeNull();
  });

  it('aplica porcentaje sobre el subtotal', () => {
    const result = computeDiscount({ type: 'PERCENTAGE', value: 10 }, base);
    expect(result.discount).toBe(1000);
  });

  it('aplica monto fijo sin superar el subtotal', () => {
    const result = computeDiscount({ type: 'FIXED_AMOUNT', value: 15000 }, base);
    expect(result.discount).toBe(10000);
  });

  it('elimina el costo de envío en FREE_SHIPPING', () => {
    const result = computeDiscount({ type: 'FREE_SHIPPING', value: null }, base);
    expect(result.deliveryFee).toBe(0);
    expect(result.discount).toBe(0);
  });

  it('aplica descuento por pack cuando la cantidad alcanza el mínimo', () => {
    const lines = [{ quantity: 5, subtotal: 15000 }];
    const result = computeDiscount({ type: 'PACK', value: 10, pack_quantity: 5 }, { ...base, lines, totalQuantity: 5 });
    expect(result.discount).toBe(1500);
  });

  it('no aplica pack si no se alcanza la cantidad mínima', () => {
    const lines = [{ quantity: 3, subtotal: 9000 }];
    const result = computeDiscount({ type: 'PACK', value: 10, pack_quantity: 5 }, { ...base, lines, totalQuantity: 3 });
    expect(result.discount).toBe(0);
  });

  it('respeta el monto mínimo de pedido', () => {
    const result = computeDiscount({ type: 'PERCENTAGE', value: 10, min_order_amount: 20000 }, base);
    expect(result.discount).toBe(0);
    expect(result.applied).toBeNull();
  });
});
