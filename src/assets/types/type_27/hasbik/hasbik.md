### №27637 на КЕГЭ

условия пока что нет :((

#### Решение

его тоже нет :(

```python
with open("27_A_27637.txt") as file:
	data = [list(map(float, i.replace(",", ".").split())) for i in file.readlines()]

x, y = 0, 1 

cl1 = []
cl2 = []

# разбиение на кластера вручную через линии
for point in data:
	if point[y] > 15:
		cl1 += [point]
	else:
		cl2 += [point]

def dist(p1, p2):
	return ((p1[x] - p2[x]) ** 2 + (p1[y] - p2[y]) ** 2) ** (1/2)

# находим центр кластера 
def get_center(claster):
	center = None 
	min_sum = float("inf")
	for point in claster:
		cur_sum = sum(dist(point, other) for other in claster)

		if cur_sum < min_sum:
			min_sum = cur_sum
			center = point
	return center

print(min(len(cl1), len(cl2)))

strange_point = [-1.0, 1.3]

center_cl1 = get_center(cl1)
center_cl2 = get_center(cl2)

print(int((dist(center_cl1, strange_point) + dist(center_cl2, strange_point)) * 10_000))
```

вот и все бейбики, брошки мои)