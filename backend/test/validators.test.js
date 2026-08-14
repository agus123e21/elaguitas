import { describe, it, expect } from 'vitest';
import { validators, validate } from '../src/utils/validate.js';
import { assertOrderStatus } from '../src/modules/orders/orders.service.js';
import { ApiError } from '../src/utils/ApiError.js';

describe('validators', () => {
  it('valida email correcto e inválido', () => {
    expect(validators.email('a@b.com')).toBe(true);
    expect(validators.email('no-es-email')).toBe(false);
  });

  it('valida número positivo y optional', () => {
    expect(validators.number(5)).toBe(true);
    expect(validators.number('5')).toBe(false);
    expect(validators.optionalNumber(undefined)).toBe(true);
    expect(validators.optionalNumber(null)).toBe(true);
  });

  it('valida enum y optionalEnum', () => {
    expect(validators.enum(['A', 'B'])('A')).toBe(true);
    expect(validators.enum(['A', 'B'])('C')).toBe(false);
    expect(validators.optionalEnum(['A', 'B'])(undefined)).toBe(true);
  });
});

describe('validate', () => {
  it('reporta campos inválidos', () => {
    const rules = { email: validators.email, quantity: (v) => validators.number(v) && v > 0 };
    const errors = validate({ email: 'x', quantity: -1 }, rules);
    expect(errors).toEqual(['email', 'quantity']);
  });

  it('pasa cuando todo es válido', () => {
    const rules = { email: validators.email, quantity: (v) => validators.number(v) && v > 0 };
    expect(validate({ email: 'a@b.com', quantity: 3 }, rules)).toEqual([]);
  });
});

describe('assertOrderStatus', () => {
  it('acepta estados válidos', () => {
    expect(() => assertOrderStatus('DELIVERED')).not.toThrow();
  });

  it('rechaza estados desconocidos', () => {
    expect(() => assertOrderStatus('NOPE')).toThrow(ApiError);
  });
});
