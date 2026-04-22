

#### Решение

```python
def prime(n):
    for d in range(2, int(n ** 0.5) + 1):
        if n % d == 0:
            return False
    return True


def divisors(n):
    dvrs = set()
    for d in range(2, int(n ** 0.5) + 1):
        if n % d == 0:
            if prime(d):
                dvrs.add(d)
            if prime(n // d):
                dvrs.add(n // d)
    return list(dvrs)


def has_4_or_7(n):
    return '4' in str(n) or '7' in str(n)


count = 0
for i in range(2_400_001, 2_400_001 + 700):
    factors = divisors(i)

    if len(factors) != 3:
        continue

    if factors[0] * factors[1] * factors[2] != i:
        continue

    if not all(has_4_or_7(f) for f in factors):
        continue

    print(i, max(factors))
    count += 1
```