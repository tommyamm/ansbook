### Задание 26 №21719  на КЕГЭ

В банке дистанционной проверяющей системы имеется более 100 000 заданий. Все задачи пронумерованы начиная с единицы. Эти задания в течение учебного периода решают участники различных курсов. Каждому студенту при регистрации присваивается уникальный идентификатор - натуральное число, не превышающее 1 000 000. Студент
может сдать несколько различных правильных решений одной задачи, при этом в зачёт идёт только одно из них.
Преподаватель сделал выгрузку результатов за некоторый период времени и выбрал студента, который решил наибольшее количество задач из банка через одну (одну решил, следующую нет и т.д.).
Определите идентификационный номер студента, который решил наибольшее количество задач через одну, и количество решённых им задач. Если несколько студентов решили одинаковое максимальное количество задач, то укажите студента с наименьшим идентификационным номером.

**Входные данные**
В первой строке входного файла находится число N - количество зачтённых решений (натуральное число, не превышающее 60 000) за некоторый период времени. Каждая из следующих N строк содержит два натуральных числа, не превышающих 1 000 000: идентификатор студента и номер правильно решённой задачи.

**Выходные данные**
Два целых неотрицательных числа: наименьший идентификационный номер студента и наибольшее количество успешно решённых задач через одну.

#### Решение
```python
with open("26_21719.txt", "r") as file:
    data = [list(map(int, i.split(' '))) for i in file.readlines()][1:]

def group(mas):
    if not mas:
        return []
    
    result = []
    current = [mas[0]]
    
    for i in range(1, len(mas)):
        if mas[i] == current[-1] + 2:
            current.append(mas[i])
        else:
            if len(current) >= 2:
                result.append(current)
            current = [mas[i]]

    if len(current) >= 2:
        result.append(current)
        
    return result

table = {}
for line in data:
    student, task = line 

    if student not in table:
        table[student] = [task]
        continue
    
    # Дубликаты не добавляем
    if task in table[student]:
        continue

    table[student].append(task)

new_table = {}
for student in table:
    if not table[student]:
        continue

    table[student] = sorted(table[student])
    table[student] = group(table[student])
    table[student] = sorted(table[student], key=len)

    if not table[student]:
        continue

    listWithMaxElems = table[student][-1]
    new_table[student] = len(listWithMaxElems)

for student in sorted(new_table):
    print(student, new_table[student])
    break
```